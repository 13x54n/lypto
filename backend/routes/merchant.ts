import { Hono } from 'hono';
import { Expo } from 'expo-server-sdk';
import type { ExpoPushMessage } from 'expo-server-sdk';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { realtimeService } from '../services/realtimeService';
import { updateAnalytics, getUserMonthlyAnalytics, getUserDailyAnalytics, getUserStats } from '../services/analyticsService';

export const merchantRouter = new Hono();

// Initialize Expo push notification client
const expo = new Expo();

// LYPTO minting (configured via environment variable)
const ENABLE_LYPTO_MINTING = process.env.ENABLE_LYPTO_MINTING === 'true';
let mintLyptoReward: any = null;
let getLyptoBalance: any = null;

// Lazy load LYPTO service (only if enabled)
if (ENABLE_LYPTO_MINTING) {
	import('../services/lyptoTokenService').then(module => {
		mintLyptoReward = module.mintLyptoReward;
		getLyptoBalance = module.getLyptoBalance;
		console.log('✅ LYPTO minting enabled');
		console.log(`   Program ID: ${process.env.LYPTO_PROGRAM_ID}`);
		console.log(`   Mint Address: ${process.env.LYPTO_MINT_ADDRESS}`);
	}).catch(error => {
		console.error('❌ Failed to load LYPTO service:', error);
	});
} else {
	console.log('ℹ️  LYPTO minting disabled (set ENABLE_LYPTO_MINTING=true in .env to enable)');
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
			userId: (user._id as any).toString(),
			userEmail,
			merchantId: (merchant._id as any).toString(),
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
				const message: ExpoPushMessage & { categoryIdentifier?: string } = {
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
			
			console.log(`[LYPTO Check] Customer: ${customer?.email}`);
			console.log(`[LYPTO Check] Wallet Address: ${customer?.circleWalletAddress}`);
			console.log(`[LYPTO Check] ENABLE_LYPTO_MINTING: ${ENABLE_LYPTO_MINTING}`);
			console.log(`[LYPTO Check] mintLyptoReward function: ${mintLyptoReward ? 'loaded' : 'NOT LOADED'}`);
			
			if (!customer) {
				console.log('❌ Customer not found');
			} else if (!customer.circleWalletAddress) {
				console.log('❌ Customer wallet address not set');
			} else if (!ENABLE_LYPTO_MINTING) {
				console.log('ℹ️  LYPTO minting disabled in .env');
			} else if (!mintLyptoReward) {
				console.log('❌ LYPTO service not loaded - trying to load now...');
				
				// Try to load service synchronously
				try {
					const lyptoService = await import('../services/lyptoTokenService');
					const txSignature = await lyptoService.mintLyptoReward(
						customer.circleWalletAddress,
						payment.amount,
						payment.transactionId
					);
					
					// Update payment with blockchain transaction
					payment.lyptoTxSignature = txSignature;
					payment.lyptoMinted = true;
					await payment.save();
					
					// Update customer's LYPTO balance
					const newBalance = await lyptoService.getLyptoBalance(customer.circleWalletAddress);
					customer.lyptoBalance = newBalance;
					customer.totalLyptoEarned = (customer.totalLyptoEarned || 0) + payment.lyptoReward;
					customer.lastLyptoSync = new Date();
					await customer.save();
					
					console.log(`✅ LYPTO minted! TX: ${txSignature}`);
					console.log(`💰 Customer balance: ${newBalance} LYPTO`);
					
					realtimeService.notifyLyptoMinted(
						customer.email,
						payment.lyptoReward,
						newBalance,
						txSignature
					);
				} catch (error) {
					console.error('❌ Failed to mint LYPTO (fallback):', error);
				}
			} else {
				// Service is loaded and ready
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

// Pay merchant with crypto (SOL or USDC)
merchantRouter.post('/pay-with-crypto', async (c) => {
	try {
		const { userEmail, merchantEmail, token, amount, paymentId } = await c.req.json();

		if (!userEmail || !merchantEmail || !token || !amount) {
			return c.json({ error: 'Missing required fields' }, 400);
		}

		const [user, merchant] = await Promise.all([
			User.findOne({ email: userEmail }),
			User.findOne({ email: merchantEmail }),
		]);

		if (!user || !merchant) {
			return c.json({ error: 'User or merchant not found' }, 404);
		}

		if (!user.circleWalletId || !merchant.circleWalletAddress) {
			return c.json({ error: 'Wallet not initialized' }, 400);
		}

		// Validate amount
		const amountNum = parseFloat(amount);
		if (isNaN(amountNum) || amountNum <= 0) {
			return c.json({ error: 'Invalid amount' }, 400);
		}

		try {
			const { createTransaction } = await import('../services/circleWalletService');
			
			const USDC_TOKEN_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
			const blockchain = (process.env.SOLANA_NETWORK === 'mainnet' ? 'SOL-MAINNET' : 'SOL-DEVNET') as 'SOL-DEVNET' | 'SOL-MAINNET';
			
			// Create transaction from user to merchant
			const result = await createTransaction({
				walletId: user.circleWalletId,
				blockchain,
				tokenAddress: token === 'USDC' ? USDC_TOKEN_ADDRESS : '',
				amount: amount,
				destinationAddress: merchant.circleWalletAddress,
			});

			console.log(`💰 Crypto payment from ${userEmail} to ${merchantEmail}:`);
			console.log(`   Token: ${token}`);
			console.log(`   Amount: ${amount}`);
			console.log(`   TX ID: ${result.transactionId}`);

			// Update payment if paymentId provided
			if (paymentId) {
				const payment = await Payment.findById(paymentId);
				if (payment) {
					payment.status = 'confirmed';
					payment.confirmedAt = new Date();
					payment.lyptoTxSignature = result.transactionId; // Store Circle TX ID
					await payment.save();
					
					// Send real-time update
					realtimeService.notifyPaymentUpdate(payment);
				}
			}

			return c.json({
				success: true,
				transactionId: result.transactionId,
				state: result.state,
				message: 'Payment sent successfully',
			});
		} catch (error: any) {
			console.error('Error creating crypto payment:', error);
			return c.json({
				error: 'Failed to send payment',
				message: error.message || 'Unknown error',
			}, 500);
		}
	} catch (error) {
		console.error('Error processing crypto payment:', error);
		return c.json({ error: 'Failed to process payment' }, 500);
	}
});

// Withdraw tokens (SOL, USDC) from wallet
merchantRouter.post('/withdraw', async (c) => {
	try {
		const { email, token, amount, destinationAddress } = await c.req.json();

		if (!email || !token || !amount || !destinationAddress) {
			return c.json({ error: 'Missing required fields' }, 400);
		}

		const user = await User.findOne({ email });

		if (!user) {
			return c.json({ error: 'User not found' }, 404);
		}

		if (!user.circleWalletId) {
			return c.json({ error: 'Wallet not initialized' }, 400);
		}

		// Validate amount
		const amountNum = parseFloat(amount);
		if (isNaN(amountNum) || amountNum <= 0) {
			return c.json({ error: 'Invalid amount' }, 400);
		}

		// Validate destination address (basic Solana address check)
		if (destinationAddress.length < 32 || destinationAddress.length > 44) {
			return c.json({ error: 'Invalid Solana address' }, 400);
		}

		try {
			const { createTransaction } = await import('../services/circleWalletService');
			
			// USDC token address on Solana
			const USDC_TOKEN_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
			
			const blockchain = (process.env.SOLANA_NETWORK === 'mainnet' ? 'SOL-MAINNET' : 'SOL-DEVNET') as 'SOL-DEVNET' | 'SOL-MAINNET';
			
			const result = await createTransaction({
				walletId: user.circleWalletId,
				blockchain,
				tokenAddress: token === 'USDC' ? USDC_TOKEN_ADDRESS : '', // Empty for native SOL
				amount: amount,
				destinationAddress: destinationAddress,
			});

			console.log(`💸 Withdrawal initiated for ${email}:`);
			console.log(`   Token: ${token}`);
			console.log(`   Amount: ${amount}`);
			console.log(`   To: ${destinationAddress}`);
			console.log(`   TX ID: ${result.transactionId}`);

			return c.json({
				success: true,
				transactionId: result.transactionId,
				state: result.state,
				message: 'Withdrawal initiated successfully',
			});
		} catch (error: any) {
			console.error('Error creating withdrawal transaction:', error);
			return c.json({
				error: 'Failed to create withdrawal',
				message: error.message || 'Unknown error',
			}, 500);
		}
	} catch (error) {
		console.error('Error processing withdrawal:', error);
		return c.json({ error: 'Failed to process withdrawal' }, 500);
	}
});

// Get wallet balances (SOL, USDC, etc.) from Circle
merchantRouter.get('/wallet-balances', async (c) => {
	try {
		const email = c.req.query('email');

		if (!email) {
			return c.json({ error: 'Email required' }, 400);
		}

		const user = await User.findOne({ email });

		if (!user) {
			return c.json({ error: 'User not found' }, 404);
		}

		if (!user.circleWalletId) {
			return c.json({
				balances: {
					sol: 0,
					usdc: 0,
				},
				walletAddress: user.circleWalletAddress || null,
			});
		}

		try {
			// Import Circle wallet service
			const { getWalletBalance, getWallet } = await import('../services/circleWalletService');
			
			// Get token balances (for USDC, SPL tokens, etc.)
			const balanceData = await getWalletBalance(user.circleWalletId);
			
			// Get wallet details (for native SOL balance)
			const walletDetails = await getWallet(user.circleWalletId);
			
			console.log('[Circle API] Wallet details:', JSON.stringify(walletDetails, null, 2));
			console.log('[Circle API] Balance data:', JSON.stringify(balanceData, null, 2));
			
			// Parse token balances
			const tokenBalances = balanceData?.tokenBalances || [];
			
			let solBalance = 0;
			let usdcBalance = 0;

			// Try multiple ways to get SOL balance
			// Method 1: Check tokenBalances array
			for (const token of tokenBalances) {
				const symbol = token.token?.symbol || token.symbol;
				const amount = token.amount || '0';
				
				if (symbol === 'SOL') {
					solBalance = parseFloat(amount);
					console.log('[SOL] Found in tokenBalances:', solBalance);
				} else if (symbol === 'USDC') {
					usdcBalance = parseFloat(amount);
					console.log('[USDC] Found in tokenBalances:', usdcBalance);
				}
			}
			
			// Method 2: Check wallet's native balance
			if (solBalance === 0 && walletDetails) {
				const nativeBalance = (walletDetails as any).nativeBalance || 
				                     (walletDetails as any).balance;
				if (nativeBalance) {
					solBalance = parseFloat(nativeBalance);
					console.log('[SOL] Found in nativeBalance:', solBalance);
				}
			}
			
			// Method 3: Fetch directly from Solana RPC as fallback
			if (solBalance === 0 && user.circleWalletAddress) {
				try {
					const { Connection, PublicKey } = await import('@solana/web3.js');
					const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
					const connection = new Connection(rpcUrl, 'confirmed');
					const publicKey = new PublicKey(user.circleWalletAddress);
					const balance = await connection.getBalance(publicKey);
					solBalance = balance / 1e9; // Convert lamports to SOL
					console.log('[SOL] Fetched from Solana RPC:', solBalance);
				} catch (error) {
					console.error('[SOL] Error fetching from RPC:', error);
				}
			}

			// Get CAD conversions
			const { convertToCad } = await import('../services/priceService');
			const cadValues = await convertToCad({
				sol: solBalance,
				usdc: usdcBalance,
			});

			console.log(`[Wallet Balances] ${user.email}:`);
			console.log(`  SOL: ${solBalance} (~$${cadValues.solCad.toFixed(2)} CAD)`);
			console.log(`  USDC: ${usdcBalance} (~$${cadValues.usdcCad.toFixed(2)} CAD)`);
			console.log(`  Total: ~$${cadValues.totalCad.toFixed(2)} CAD`);

			return c.json({
				balances: {
					sol: solBalance,
					usdc: usdcBalance,
				},
				cadValues: {
					sol: cadValues.solCad,
					usdc: cadValues.usdcCad,
					total: cadValues.totalCad,
				},
				walletAddress: user.circleWalletAddress,
				tokenBalances: tokenBalances.map((t: any) => ({
					symbol: t.token?.symbol || t.symbol,
					amount: t.amount,
					decimals: t.token?.decimals || t.decimals,
				})),
			});
		} catch (error) {
			console.error('Error fetching wallet balances from Circle:', error);
			return c.json({
				balances: {
					sol: 0,
					usdc: 0,
				},
				walletAddress: user.circleWalletAddress || null,
			});
		}
	} catch (error) {
		console.error('Error fetching wallet balances:', error);
		return c.json({ error: 'Failed to fetch wallet balances' }, 500);
	}
});
