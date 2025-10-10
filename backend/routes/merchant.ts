import { Hono } from 'hono';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { User } from '../models/User';

export const merchantRouter = new Hono();

// Initialize Expo push notification client
const expo = new Expo();

// In-memory storage (replace with database in production)
const payments: any[] = [];
const transactions: any[] = [];

// Create payment request
merchantRouter.post('/create-payment', async (c) => {
  try {
    const { userId, userEmail, amount, merchantEmail } = await c.req.json();

    if (!userId || !userEmail || !amount || !merchantEmail) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = {
      id: paymentId,
      userId,
      userEmail,
      amount: parseFloat(amount),
      merchantEmail,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    payments.push(payment);
    transactions.push(payment);

    // Send push notification to user's mobile app
    try {
      const user = await User.findOne({ email: userEmail });
      
      if (user && user.pushToken && Expo.isExpoPushToken(user.pushToken)) {
        const message: ExpoPushMessage = {
          to: user.pushToken,
          sound: 'default',
          title: '💳 Payment Request',
          body: `${merchantEmail} is requesting $${amount}`,
          data: { 
            type: 'payment_request',
            paymentId,
            amount,
            merchantEmail,
          },
          categoryIdentifier: 'payment_request', // Enable action buttons
          priority: 'high',
          badge: 1,
        };

        const chunks = expo.chunkPushNotifications([message]);
        for (const chunk of chunks) {
          try {
            await expo.sendPushNotificationsAsync(chunk);
            console.log(`✅ Push notification sent to ${userEmail} for $${amount}`);
          } catch (error) {
            console.error('Error sending push notification:', error);
          }
        }
      } else {
        console.log(`⚠️  No valid push token for ${userEmail}`);
      }
    } catch (error) {
      console.error('Error fetching user for push notification:', error);
    }

    return c.json({
      success: true,
      paymentId,
      message: 'Payment request created successfully',
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return c.json({ error: 'Failed to create payment' }, 500);
  }
});

// Get merchant transactions
merchantRouter.get('/transactions', async (c) => {
  try {
    const merchantEmail = c.req.query('merchantEmail');

    if (!merchantEmail) {
      return c.json({ error: 'Merchant email required' }, 400);
    }

    const merchantTransactions = transactions
      .filter(t => t.merchantEmail === merchantEmail)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({
      transactions: merchantTransactions,
      count: merchantTransactions.length,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

// Get merchant stats
merchantRouter.get('/stats', async (c) => {
  try {
    const merchantEmail = c.req.query('merchantEmail');

    if (!merchantEmail) {
      return c.json({ error: 'Merchant email required' }, 400);
    }

    const merchantTransactions = transactions.filter(t => 
      t.merchantEmail === merchantEmail && t.status === 'confirmed'
    );

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayTransactions = merchantTransactions.filter(t => 
      new Date(t.createdAt) >= startOfDay
    );
    
    const weekTransactions = merchantTransactions.filter(t => 
      new Date(t.createdAt) >= startOfWeek
    );
    
    const monthTransactions = merchantTransactions.filter(t => 
      new Date(t.createdAt) >= startOfMonth
    );

    const stats = {
      today: {
        count: todayTransactions.length,
        total: todayTransactions.reduce((sum, t) => sum + t.amount, 0),
      },
      week: {
        count: weekTransactions.length,
        total: weekTransactions.reduce((sum, t) => sum + t.amount, 0),
      },
      month: {
        count: monthTransactions.length,
        total: monthTransactions.reduce((sum, t) => sum + t.amount, 0),
      },
    };

    return c.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// Confirm payment (called by user mobile app)
merchantRouter.post('/confirm-payment', async (c) => {
  try {
    const { paymentId, status } = await c.req.json();

    if (!paymentId || !status) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const payment = payments.find(p => p.id === paymentId);
    
    if (!payment) {
      return c.json({ error: 'Payment not found' }, 404);
    }

    if (payment.status !== 'pending') {
      return c.json({ error: 'Payment already processed' }, 400);
    }

    payment.status = status;
    payment.confirmedAt = new Date().toISOString();

    // Update in transactions list
    const transaction = transactions.find(t => t.id === paymentId);
    if (transaction) {
      transaction.status = status;
      transaction.confirmedAt = payment.confirmedAt;
    }

    // Send notification to merchant (if they have push token)
    try {
      const merchant = await User.findOne({ email: payment.merchantEmail });
      
      if (merchant && merchant.pushToken && Expo.isExpoPushToken(merchant.pushToken)) {
        const statusEmoji = status === 'confirmed' ? '✅' : '❌';
        const message: ExpoPushMessage = {
          to: merchant.pushToken,
          sound: 'default',
          title: `${statusEmoji} Payment ${status === 'confirmed' ? 'Confirmed' : 'Declined'}`,
          body: `$${payment.amount} from ${payment.userEmail}`,
          data: { 
            type: 'payment_status',
            paymentId,
            status,
          },
          priority: 'high',
          badge: 1,
        };

        const chunks = expo.chunkPushNotifications([message]);
        for (const chunk of chunks) {
          try {
            await expo.sendPushNotificationsAsync(chunk);
            console.log(`✅ Status notification sent to merchant: ${payment.merchantEmail}`);
          } catch (error) {
            console.error('Error sending merchant notification:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error sending merchant notification:', error);
    }

    return c.json({
      success: true,
      message: `Payment ${status}`,
      payment,
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

    const pendingPayments = payments
      .filter(p => p.userEmail === userEmail && p.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({
      payments: pendingPayments,
      count: pendingPayments.length,
    });
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    return c.json({ error: 'Failed to fetch pending payments' }, 500);
  }
});

