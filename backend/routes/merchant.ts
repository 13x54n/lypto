import { Hono } from 'hono';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { realtimeService } from '../services/realtimeService';
import { updateAnalytics, getUserMonthlyAnalytics, getUserDailyAnalytics, getUserStats } from '../services/analyticsService';

export const merchantRouter = new Hono();

// Initialize Expo push notification client
const expo = new Expo();

// LYPTO minting (will be enabled when contract is deployed)
const ENABLE_LYPTO_MINTING = false; // Set to true after deploying contract
let mintLyptoReward: any = null;
let getLyptoBalance: any = null;

// Lazy load LYPTO service (only if enabled)
if (ENABLE_LYPTO_MINTING) {
	import('../services/lyptoTokenService').then(module => {
		mintLyptoReward = module.mintLyptoReward;
		getLyptoBalance = module.getLyptoBalance;
		console.log('✅ LYPTO minting enabled');
	});
}

// Create payment request
merchantRouter.post('/create-payment', async (c) => {
	try {
		const { userId, userEmail, amount, merchantEmail } = await c.req.json();

		if (!userId || !userEmail || !amount || !merchantEmail) {
			return c.json({ error: 'Missing required fields' }, 400);
		}

		// Find user and merchant
		const user = await User.findOne({ email: userEmail });
		const merchant = await User.findOne({ email: merchantEmail });

		if (!user) {
			return c.json({ error: 'Customer not found' }, 404);
		}

		if (!merchant) {
			return c.json({ error: 'Merchant not found' }, 404);
		}

		// Calculate LYPTO reward (2% of amount)
		const amountInCents = Math.floor(parseFloat(amount) * 100);
		const lyptoReward = Math.floor((amountInCents * 200) / 10000);

		// Create transaction ID for blockchain
		const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		// Create payment in MongoDB
		const payment = new Payment({
			transactionId,
			userId: user._id.toString(),
			userEmail,
			merchantId: merchant._id.toString(),
			merchantEmail,
			amount: parseFloat(amount),
			amountInCents,
			lyptoReward,
			status: 'pending',
			lyptoMinted: false,
			expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
		});

		await payment.save();

		console.log(`📝 Payment created: ${payment._id} for $${amount}`);
		console.log(`   Customer: ${userEmail}`);
		console.log(`   Merchant: ${merchantEmail}`);
		console.log(`   LYPTO Reward: ${lyptoReward} tokens`);

		// Send push notification to user's mobile app
		try {
			if (user.pushToken && Expo.isExpoPushToken(user.pushToken)) {
				const message: ExpoPushMessage = {
					to: user.pushToken,
					sound: 'default',
					title: '💳 Payment Request',
					body: `${merchantEmail} is requesting $${amount}\n🪙 Earn ${lyptoReward} LYPTO (2% reward)`,
					data: { 
						type: 'payment_request',
						paymentId: payment._id.toString(),
						amount,
						merchantEmail,
						lyptoReward,
					},
					categoryIdentifier: 'payment_request',
					priority: 'high',
					badge: 1,
				};

				const chunks = expo.chunkPushNotifications([message]);
				for (const chunk of chunks) {
					await expo.sendPushNotificationsAsync(chunk);
				}
				
				console.log(`✅ Push notification sent to ${userEmail} for $${amount}`);
			}
		} catch (error) {
			console.error('Error sending push notification:', error);
		}

		return c.json({
			success: true,
			paymentId: payment._id.toString(),
			lyptoReward,
			message: 'Payment request created successfully',
		});
	} catch (error) {
		console.error('Error creating payment:', error);
		return c.json({ error: 'Failed to create payment' }, 500);
	}
});

// Confirm payment (called by user mobile app)
merchantRouter.post('/confirm-payment', async (c) => {
	try {
		const { paymentId, status } = await c.req.json();

		if (!paymentId || !status) {
			return c.json({ error: 'Missing required fields' }, 400);
		}

		const payment = await Payment.findById(paymentId);
		
		if (!payment) {
			return c.json({ error: 'Payment not found' }, 404);
		}

		if (payment.status !== 'pending') {
			return c.json({ error: 'Payment already processed' }, 400);
		}

		// Update payment status
		payment.status = status;
		payment.confirmedAt = new Date();
		await payment.save();

		console.log(`💳 Payment ${status}: ${paymentId} for $${payment.amount}`);

		// Send real-time update immediately
		realtimeService.notifyPaymentUpdate(payment);

		// If payment confirmed, mint LYPTO rewards!
		if (status === 'confirmed') {
			const customer = await User.findOne({ email: payment.userEmail });
			
			if (customer?.circleWalletAddress && ENABLE_LYPTO_MINTING && mintLyptoReward) {
				try {
					console.log(`🪙 Minting ${payment.lyptoReward} LYPTO to ${customer.circleWalletAddress}...`);
					
					const txSignature = await mintLyptoReward(
						customer.circleWalletAddress,
						payment.amount,
						payment.transactionId
					);
					
					// Update payment with blockchain transaction
					payment.lyptoTxSignature = txSignature;
					payment.lyptoMinted = true;
					await payment.save();
					
					// Update customer's LYPTO balance in database
					const newBalance = await getLyptoBalance(customer.circleWalletAddress);
					customer.lyptoBalance = newBalance;
					customer.totalLyptoEarned = (customer.totalLyptoEarned || 0) + payment.lyptoReward;
					customer.lastLyptoSync = new Date();
					await customer.save();
					
					console.log(`✅ LYPTO minted! TX: ${txSignature}`);
					console.log(`💰 Customer balance: ${newBalance} LYPTO`);
					
					// Send real-time LYPTO minted notification
					realtimeService.notifyLyptoMinted(
						customer.email,
						payment.lyptoReward,
						newBalance,
						txSignature
					);
					
				} catch (error) {
					console.error('❌ Failed to mint LYPTO:', error);
					// Don't fail payment if LYPTO minting fails
				}
			} else {
				console.log(`ℹ️  LYPTO minting disabled or wallet not ready`);
			}
			
			// Update customer points (legacy system)
			if (customer) {
				customer.points = (customer.points || 0) + Math.floor(payment.amount * 10);
				await customer.save();
			}
		}
		
		// Update analytics (daily and monthly)
		await updateAnalytics(payment.userEmail, {
			amount: payment.amount,
			lyptoReward: payment.lyptoReward,
			lyptoMinted: payment.lyptoMinted,
			status: payment.status as 'confirmed' | 'declined',
			confirmedAt: payment.confirmedAt || new Date(),
		});

		// Send notification to merchant
		try {
			const merchant = await User.findOne({ email: payment.merchantEmail });
			
			if (merchant?.pushToken && Expo.isExpoPushToken(merchant.pushToken)) {
				const statusEmoji = status === 'confirmed' ? '✅' : '❌';
				const message: ExpoPushMessage = {
					to: merchant.pushToken,
					sound: 'default',
					title: `${statusEmoji} Payment ${status === 'confirmed' ? 'Confirmed' : 'Declined'}`,
					body: `$${payment.amount} from ${payment.userEmail}`,
					data: { 
						type: 'payment_status',
						paymentId: payment._id.toString(),
						status,
					},
					priority: 'high',
					badge: 1,
				};

				const chunks = expo.chunkPushNotifications([message]);
				for (const chunk of chunks) {
					await expo.sendPushNotificationsAsync(chunk);
				}
				
				console.log(`✅ Status notification sent to merchant: ${payment.merchantEmail}`);
			}
		} catch (error) {
			console.error('Error sending merchant notification:', error);
		}

		return c.json({
			success: true,
			message: `Payment ${status}`,
			payment: {
				...payment.toObject(),
				lyptoMinted: payment.lyptoMinted,
				lyptoReward: payment.lyptoReward,
			},
		});
	} catch (error) {
		console.error('Error confirming payment:', error);
		return c.json({ error: 'Failed to confirm payment' }, 500);
	}
});

// Get pending payments for user (called by mobile app)
merchantRouter.get('/pending-payments', async (c) => {
	try {
		const userEmail = c.req.query('userEmail');

		if (!userEmail) {
			return c.json({ error: 'User email required' }, 400);
		}

		const pendingPayments = await Payment.find({
			userEmail,
			status: 'pending',
		})
		.sort({ createdAt: -1 })
		.limit(10);

		return c.json({
			payments: pendingPayments.map(p => ({
				id: p._id.toString(),
				amount: p.amount,
				lyptoReward: p.lyptoReward,
				merchantEmail: p.merchantEmail,
				createdAt: p.createdAt,
			})),
			count: pendingPayments.length,
		});
	} catch (error) {
		console.error('Error fetching pending payments:', error);
		return c.json({ error: 'Failed to fetch pending payments' }, 500);
	}
});

// Get merchant transactions (with LYPTO info)
merchantRouter.get('/transactions', async (c) => {
	try {
		const merchantEmail = c.req.query('merchantEmail');

		if (!merchantEmail) {
			return c.json({ error: 'Merchant email required' }, 400);
		}

		const merchantTransactions = await Payment.find({ merchantEmail })
			.sort({ createdAt: -1 })
			.limit(50);

		return c.json({
			transactions: merchantTransactions.map(p => ({
				id: p._id.toString(),
				userEmail: p.userEmail,
				amount: p.amount,
				lyptoReward: p.lyptoReward,
				lyptoMinted: p.lyptoMinted,
				lyptoTxSignature: p.lyptoTxSignature,
				status: p.status,
				createdAt: p.createdAt,
				confirmedAt: p.confirmedAt,
			})),
			count: merchantTransactions.length,
		});
	} catch (error) {
		console.error('Error fetching transactions:', error);
		return c.json({ error: 'Failed to fetch transactions' }, 500);
	}
});

// Get merchant stats (with LYPTO data)
merchantRouter.get('/stats', async (c) => {
	try {
		const merchantEmail = c.req.query('merchantEmail');

		if (!merchantEmail) {
			return c.json({ error: 'Merchant email required' }, 400);
		}

		const now = new Date();
		const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - now.getDay());
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		const [todayTxs, weekTxs, monthTxs, totalLyptoMinted] = await Promise.all([
			Payment.find({
				merchantEmail,
				status: 'confirmed',
				confirmedAt: { $gte: startOfDay },
			}),
			Payment.find({
				merchantEmail,
				status: 'confirmed',
				confirmedAt: { $gte: startOfWeek },
			}),
			Payment.find({
				merchantEmail,
				status: 'confirmed',
				confirmedAt: { $gte: startOfMonth },
			}),
			Payment.aggregate([
				{ $match: { merchantEmail, status: 'confirmed', lyptoMinted: true } },
				{ $group: { _id: null, total: { $sum: '$lyptoReward' } } },
			]),
		]);

		const stats = {
			today: {
				count: todayTxs.length,
				total: todayTxs.reduce((sum, t) => sum + t.amount, 0),
				lyptoMinted: todayTxs.reduce((sum, t) => sum + (t.lyptoMinted ? t.lyptoReward : 0), 0),
			},
			week: {
				count: weekTxs.length,
				total: weekTxs.reduce((sum, t) => sum + t.amount, 0),
				lyptoMinted: weekTxs.reduce((sum, t) => sum + (t.lyptoMinted ? t.lyptoReward : 0), 0),
			},
			month: {
				count: monthTxs.length,
				total: monthTxs.reduce((sum, t) => sum + t.amount, 0),
				lyptoMinted: monthTxs.reduce((sum, t) => sum + (t.lyptoMinted ? t.lyptoReward : 0), 0),
			},
			allTime: {
				lyptoMinted: totalLyptoMinted[0]?.total || 0,
			},
		};

		return c.json(stats);
	} catch (error) {
		console.error('Error fetching stats:', error);
		return c.json({ error: 'Failed to fetch stats' }, 500);
	}
});

// Get user's transaction history (for mobile app)
merchantRouter.get('/user-transactions', async (c) => {
	try {
		const userEmail = c.req.query('userEmail');

		if (!userEmail) {
			return c.json({ error: 'User email required' }, 400);
		}

		const userTransactions = await Payment.find({
			userEmail,
			status: { $in: ['confirmed', 'declined'] },
		})
		.sort({ createdAt: -1 })
		.limit(50);

		return c.json({
			transactions: userTransactions.map(p => ({
				id: p._id.toString(),
				merchantEmail: p.merchantEmail,
				amount: p.amount,
				lyptoReward: p.lyptoReward,
				lyptoMinted: p.lyptoMinted,
				lyptoTxSignature: p.lyptoTxSignature,
				status: p.status,
				createdAt: p.createdAt,
				confirmedAt: p.confirmedAt,
			})),
			count: userTransactions.length,
		});
	} catch (error) {
		console.error('Error fetching user transactions:', error);
		return c.json({ error: 'Failed to fetch transactions' }, 500);
	}
});

// Get LYPTO balance for user
merchantRouter.get('/lypto-balance', async (c) => {
	try {
		const email = c.req.query('email');

		if (!email) {
			return c.json({ error: 'Email required' }, 400);
		}

		const user = await User.findOne({ email });

		if (!user) {
			return c.json({ error: 'User not found' }, 404);
		}

		let balance = user.lyptoBalance || 0;
		let syncedFromBlockchain = false;

		// If LYPTO minting is enabled and user has wallet, sync from blockchain
		if (ENABLE_LYPTO_MINTING && user.circleWalletAddress && getLyptoBalance) {
			try {
				balance = await getLyptoBalance(user.circleWalletAddress);
				
				// Update cached balance
				user.lyptoBalance = balance;
				user.lastLyptoSync = new Date();
				await user.save();
				
				syncedFromBlockchain = true;
			} catch (error) {
				console.error('Error syncing LYPTO balance from blockchain:', error);
			}
		}

		return c.json({
			balance,
			totalEarned: user.totalLyptoEarned || 0,
			walletAddress: user.circleWalletAddress,
			lastSync: user.lastLyptoSync,
			syncedFromBlockchain,
		});
	} catch (error) {
		console.error('Error fetching LYPTO balance:', error);
		return c.json({ error: 'Failed to fetch LYPTO balance' }, 500);
	}
});

// Clean up expired payments (cron job endpoint)
merchantRouter.post('/cleanup-expired', async (c) => {
	try {
		const result = await Payment.updateMany(
			{
				status: 'pending',
				expiresAt: { $lt: new Date() },
			},
			{
				$set: { status: 'expired' },
			}
		);

		console.log(`🧹 Cleaned up ${result.modifiedCount} expired payments`);

		return c.json({
			success: true,
			expiredCount: result.modifiedCount,
		});
	} catch (error) {
		console.error('Error cleaning up expired payments:', error);
		return c.json({ error: 'Failed to cleanup' }, 500);
	}
});

// Server-Sent Events for real-time payment updates
merchantRouter.get('/realtime', async (c) => {
	const email = c.req.query('email');

	if (!email) {
		return c.json({ error: 'Email required' }, 400);
	}

	// Set up SSE headers
	c.header('Content-Type', 'text/event-stream');
	c.header('Cache-Control', 'no-cache');
	c.header('Connection', 'keep-alive');

	const stream = new ReadableStream({
		start(controller) {
			// Send initial connection message
			const encoder = new TextEncoder();
			controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

			// Subscribe to updates
			const unsubscribe = realtimeService.subscribe(email, (data) => {
				try {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
				} catch (error) {
					console.error('Error sending SSE:', error);
				}
			});

			// Keep alive ping every 30 seconds
			const keepAlive = setInterval(() => {
				try {
					controller.enqueue(encoder.encode(`: ping\n\n`));
				} catch (error) {
					clearInterval(keepAlive);
				}
			}, 30000);

			// Cleanup on disconnect
			return () => {
				clearInterval(keepAlive);
				unsubscribe();
			};
		},
	});

	return new Response(stream);
});

// Get real-time service stats
merchantRouter.get('/realtime-stats', async (c) => {
	const stats = realtimeService.getStats();
	return c.json(stats);
});

// Get user's monthly analytics (for chart)
merchantRouter.get('/analytics/monthly', async (c) => {
	try {
		const email = c.req.query('email');

		if (!email) {
			return c.json({ error: 'Email required' }, 400);
		}

		const analytics = await getUserMonthlyAnalytics(email);
		
		return c.json({
			analytics,
			count: analytics.length,
		});
	} catch (error) {
		console.error('Error fetching monthly analytics:', error);
		return c.json({ error: 'Failed to fetch analytics' }, 500);
	}
});

// Get user's daily analytics
merchantRouter.get('/analytics/daily', async (c) => {
	try {
		const email = c.req.query('email');
		const days = parseInt(c.req.query('days') || '30');

		if (!email) {
			return c.json({ error: 'Email required' }, 400);
		}

		const analytics = await getUserDailyAnalytics(email, days);
		
		return c.json({
			analytics,
			count: analytics.length,
		});
	} catch (error) {
		console.error('Error fetching daily analytics:', error);
		return c.json({ error: 'Failed to fetch analytics' }, 500);
	}
});

// Get user stats summary
merchantRouter.get('/analytics/stats', async (c) => {
	try {
		const email = c.req.query('email');

		if (!email) {
			return c.json({ error: 'Email required' }, 400);
		}

		const stats = await getUserStats(email);
		
		return c.json(stats);
	} catch (error) {
		console.error('Error fetching user stats:', error);
		return c.json({ error: 'Failed to fetch stats' }, 500);
	}
});
