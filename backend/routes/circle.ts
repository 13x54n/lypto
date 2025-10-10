import { Hono } from 'hono';
import { User } from '../models/User';
import { 
  listWallets, 
  getWalletBalance, 
  createTransaction,
} from '../services/circleWalletService';

export const circleRouter = new Hono();

// Get user's wallets
circleRouter.get('/wallets', async (c) => {
  try {
    const email = c.req.query('email');
    if (!email) {
      return c.json({ error: 'Email required' }, 400);
    }

    const user = await User.findOne({ email });
    if (!user || !user.circleUserId) {
      return c.json({ error: 'User has no Circle wallet' }, 404);
    }

    const wallets = await listWallets(user.circleUserId);
    
    // Update user's wallet info if we have it
    if (wallets.length > 0 && !user.circleWalletId) {
      user.circleWalletId = wallets[0].id;
      user.circleWalletAddress = wallets[0].address;
      user.walletInitialized = true;
      await user.save();
    }

    return c.json({ wallets });
  } catch (error) {
    console.error('Error getting wallets:', error);
    return c.json({ error: 'Failed to get wallets' }, 500);
  }
});

// Get wallet balance
circleRouter.get('/balance', async (c) => {
  try {
    const email = c.req.query('email');
    if (!email) {
      return c.json({ error: 'Email required' }, 400);
    }

    const user = await User.findOne({ email });
    if (!user || !user.circleWalletId) {
      return c.json({ error: 'User has no wallet' }, 404);
    }

    const balance = await getWalletBalance(user.circleWalletId);
    return c.json(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return c.json({ error: 'Failed to get balance' }, 500);
  }
});

// Session endpoint removed - using developer-controlled wallets now

// Initiate a transaction
circleRouter.post('/transaction', async (c) => {
  try {
    const { email, destinationAddress, amount, tokenId } = await c.req.json();
    
    if (!email || !destinationAddress || !amount || !tokenId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const user = await User.findOne({ email });
    if (!user || !user.circleUserId || !user.circleWalletId) {
      return c.json({ error: 'User has no wallet' }, 404);
    }

    const result = await createTransaction({
      walletId: user.circleWalletId,
      tokenId,
      destinationAddress,
      amounts: [amount],
    });

    return c.json(result);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return c.json({ error: 'Failed to create transaction' }, 500);
  }
});

// Update wallet info after initialization
circleRouter.post('/update-wallet-info', async (c) => {
  try {
    const { email, walletId, walletAddress } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email required' }, 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (walletId) user.circleWalletId = walletId;
    if (walletAddress) user.circleWalletAddress = walletAddress;
    user.walletInitialized = true;
    await user.save();

    return c.json({ ok: true, message: 'Wallet info updated' });
  } catch (error) {
    console.error('Error updating wallet info:', error);
    return c.json({ error: 'Failed to update wallet info' }, 500);
  }
});

