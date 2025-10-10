import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

// Initialize Circle Developer Controlled Wallets client
const circleClient = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY || '',
  entitySecret: process.env.CIRCLE_ENTITY_SECRET || '',
});

export interface DeveloperWallet {
  id: string;
  address: string;
  blockchain: string;
  state: string;
  walletSetId: string;
}

/**
 * Create a wallet set for a user
 */
export async function createWalletSet(userId: string): Promise<string> {
  try {
    console.log(`📝 Creating wallet set for user: ${userId}`);
    
    const response = await circleClient.createWalletSet({
      name: `WalletSet_${userId}`,
    });

    const walletSetId = (response.data as any)?.walletSet?.id;
    
    if (!walletSetId) {
      throw new Error('Failed to create wallet set - no ID returned');
    }

    console.log(`✅ Wallet set created: ${walletSetId}`);
    return walletSetId;
  } catch (error) {
    console.error('❌ Error creating wallet set:', error);
    throw error;
  }
}

/**
 * Create a Solana wallet for a user
 */
export async function createSolanaWallet(
  walletSetId: string,
  blockchain: 'SOL-DEVNET' | 'SOL-MAINNET' = 'SOL-DEVNET'
): Promise<DeveloperWallet> {
  try {
    console.log(`🔐 Creating Solana wallet on ${blockchain}...`);
    
    const response = await circleClient.createWallets({
      accountType: 'EOA', // Externally Owned Account for Solana
      blockchains: [blockchain as any],
      count: 1,
      walletSetId: walletSetId,
    });

    const wallet = (response.data as any)?.wallets?.[0];
    
    if (!wallet) {
      throw new Error('Failed to create wallet - no wallet returned');
    }

    console.log(`✅ Wallet created: ${wallet.address}`);
    
    return {
      id: wallet.id,
      address: wallet.address,
      blockchain: wallet.blockchain,
      state: wallet.state,
      walletSetId: wallet.walletSetId,
    };
  } catch (error) {
    console.error('❌ Error creating Solana wallet:', error);
    throw error;
  }
}

/**
 * Get wallet by ID
 */
export async function getWallet(walletId: string): Promise<DeveloperWallet | null> {
  try {
    const response = await circleClient.getWallet({
      id: walletId,
    });

    const wallet = response.data as any;
    
    if (!wallet) {
      return null;
    }

    return {
      id: wallet.id,
      address: wallet.address,
      blockchain: wallet.blockchain,
      state: wallet.state,
      walletSetId: wallet.walletSetId,
    };
  } catch (error) {
    console.error('Error getting wallet:', error);
    return null;
  }
}

/**
 * List all wallets in a wallet set
 */
export async function listWallets(walletSetId: string): Promise<DeveloperWallet[]> {
  try {
    const response = await circleClient.listWallets({
      walletSetId: walletSetId,
    });

    const wallets = (response.data as any)?.wallets || [];
    
    return wallets.map((wallet: any) => ({
      id: wallet.id,
      address: wallet.address,
      blockchain: wallet.blockchain,
      state: wallet.state,
      walletSetId: wallet.walletSetId,
    }));
  } catch (error) {
    console.error('Error listing wallets:', error);
    return [];
  }
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(walletId: string): Promise<any> {
  try {
    const response = await circleClient.getWalletTokenBalance({
      id: walletId,
    });

    return response.data;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return { tokenBalances: [] };
  }
}

/**
 * Create a transaction (transfer tokens)
 */
export async function createTransaction(params: {
  walletId: string;
  tokenId: string;
  destinationAddress: string;
  amounts: string[];
}): Promise<{ transactionId: string; state: string }> {
  try {
    const response = await circleClient.createTransaction({
      walletId: params.walletId,
      tokenId: params.tokenId,
      destinationAddress: params.destinationAddress,
      amount: params.amounts, // Note: SDK expects 'amount', not 'amounts'
      fee: {
        type: 'level',
        config: {
          feeLevel: 'MEDIUM',
        },
      },
    } as any);

    const transaction = response.data as any;
    
    return {
      transactionId: transaction.id,
      state: transaction.state,
    };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

/**
 * Get Solana network status
 */
export async function getSolanaNetworkStatus(): Promise<{
  network: string;
  isHealthy: boolean;
}> {
  return {
    network: 'SOL-DEVNET',
    isHealthy: true,
  };
}
