import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import type { Idl } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

// Define the IDL type for our program
type LyptoProgramIdl = Idl & {
  accounts: Array<{
    name: string;
    discriminator: number[];
  }>;
  instructions: Array<{
    name: string;
    discriminator: number[];
    accounts: Array<{
      name: string;
      pda?: any;
    }>;
  }>;
};

// Solana RPC endpoints
const SOLANA_DEVNET_RPC = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';

// Program ID from the contract
const PROGRAM_ID = new PublicKey('WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH');

// Merchant keypair (loaded from environment)
let merchantKeypair: Keypair | null = null;

/**
 * Initialize merchant keypair from private key
 */
function getMerchantKeypair(): Keypair {
  if (merchantKeypair) return merchantKeypair;
  
  const privateKeyString = process.env.MERCHANT_SOLANA_PRIVATE_KEY;
  if (!privateKeyString) {
    throw new Error('MERCHANT_SOLANA_PRIVATE_KEY not configured in .env');
  }
  
  // Parse private key (expects JSON array of numbers)
  const privateKey = Uint8Array.from(JSON.parse(privateKeyString));
  merchantKeypair = Keypair.fromSecretKey(privateKey);
  
  return merchantKeypair;
}

/**
 * Get Solana connection
 */
function getConnection(): Connection {
  return new Connection(SOLANA_DEVNET_RPC, 'confirmed');
}

/**
 * Get PDAs for program
 */
function getPDAs() {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('program-state')],
    PROGRAM_ID
  );
  
  const [lyptoMintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('lypto-mint')],
    PROGRAM_ID
  );
  
  return { programStatePda, lyptoMintPda };
}

/**
 * Process a payment and mint LYPTO rewards to customer
 * 
 * @param customerWalletAddress - Customer's Solana wallet address
 * @param amountInDollars - Payment amount in dollars (e.g., 10.50)
 * @param transactionId - Unique transaction ID from MongoDB
 * @returns Transaction signature
 */
export async function mintLyptoReward(
  customerWalletAddress: string,
  amountInDollars: number,
  transactionId: string
): Promise<string> {
  try {
    console.log(`💰 Minting LYPTO reward for transaction ${transactionId}`);
    console.log(`   Amount: $${amountInDollars.toFixed(2)}`);
    console.log(`   Customer: ${customerWalletAddress}`);
    
    const connection = getConnection();
    const merchant = getMerchantKeypair();
    const customer = new PublicKey(customerWalletAddress);
    
    // Convert dollars to cents
    const amountInCents = Math.floor(amountInDollars * 100);
    
    // Calculate 2% reward
    const rewardAmount = Math.floor((amountInCents * 200) / 10000);
    console.log(`   Reward: ${rewardAmount} LYPTO (2%)`);
    
    // Get PDAs
    const { programStatePda, lyptoMintPda } = getPDAs();
    
    // Get transaction PDA
    const [transactionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('transaction'), Buffer.from(transactionId)],
      PROGRAM_ID
    );
    
    // Get customer's associated token account
    const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } = 
      await import('@solana/spl-token');
    
    const customerTokenAccount = await getAssociatedTokenAddress(
      lyptoMintPda,
      customer
    );
    
    // Load IDL
    const idl = await Program.fetchIdl(PROGRAM_ID, new AnchorProvider(
      connection,
      new NodeWallet(merchant),
      {}
    ));
    
    if (!idl) {
      throw new Error('IDL not found - contract not deployed?');
    }

    const provider = new AnchorProvider(
      connection,
      new NodeWallet(merchant),
      {}
    );
    const program = new Program(idl as LyptoProgramIdl, provider);

    // Call process_payment instruction
    const tx = await (program.methods as any)
      .processPayment(new BN(amountInCents), transactionId)
      .accounts({
        programState: programStatePda,
        lyptoMint: lyptoMintPda,
        transaction: transactionPda,
        customer: customer,
        customerTokenAccount: customerTokenAccount,
        merchant: merchant.publicKey,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([merchant])
      .rpc();
    
    console.log(`✅ LYPTO minted! Transaction: ${tx}`);
    console.log(`   View: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    
    return tx;
  } catch (error) {
    console.error('❌ Error minting LYPTO:', error);
    throw error;
  }
}

/**
 * Get customer's LYPTO token balance
 */
export async function getLyptoBalance(customerWalletAddress: string): Promise<number> {
  try {
    const connection = getConnection();
    const customer = new PublicKey(customerWalletAddress);
    const { lyptoMintPda } = getPDAs();
    
    const { getAssociatedTokenAddress, getAccount } = await import('@solana/spl-token');
    
    const customerTokenAccount = await getAssociatedTokenAddress(
      lyptoMintPda,
      customer
    );
    
    try {
      const accountInfo = await getAccount(connection, customerTokenAccount);
      return Number(accountInfo.amount);
    } catch (error) {
      // Account doesn't exist yet - balance is 0
      return 0;
    }
  } catch (error) {
    console.error('Error getting LYPTO balance:', error);
    return 0;
  }
}

/**
 * Get transaction details from blockchain
 */
export async function getTransactionDetails(transactionId: string): Promise<{
  transactionId: string;
  customer: string;
  merchant: string;
  amount: number;
  reward: number;
  timestamp: number;
} | null> {
  try {
    const connection = getConnection();
    const merchant = getMerchantKeypair();
    
    const [transactionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('transaction'), Buffer.from(transactionId)],
      PROGRAM_ID
    );
    
    const idl = await Program.fetchIdl(PROGRAM_ID, new AnchorProvider(
      connection,
      new NodeWallet(merchant),
      {}
    ));
    
    if (!idl) {
      return null;
    }
    
    const provider = new AnchorProvider(
      connection,
      new NodeWallet(merchant),
      {}
    );
    const program = new Program(idl as LyptoProgramIdl, provider);
    
    const transactionData = await (program.account as any).transaction.fetch(transactionPda);
    
    return {
      transactionId: (transactionData as any).transactionId,
      customer: (transactionData as any).customer.toString(),
      merchant: (transactionData as any).merchant.toString(),
      amount: (transactionData as any).amount.toNumber(),
      reward: (transactionData as any).reward.toNumber(),
      timestamp: (transactionData as any).timestamp.toNumber(),
    };
  } catch (error) {
    console.error('Error getting transaction details:', error);
    return null;
  }
}

/**
 * Get program stats
 */
export async function getProgramStats(): Promise<{
  totalRewardsMinted: number;
  totalTransactions: number;
} | null> {
  try {
    const connection = getConnection();
    const merchant = getMerchantKeypair();
    const { programStatePda } = getPDAs();

    const idl = await Program.fetchIdl(PROGRAM_ID, new AnchorProvider(
      connection,
      new NodeWallet(merchant),
      {}
    ));

    if (!idl) {
      return null;
    }

    const provider = new AnchorProvider(
      connection,
      new NodeWallet(merchant),
      {}
    );
    const program = new Program(idl as LyptoProgramIdl, provider);

    const programState = await (program.account as any).programState.fetch(programStatePda);

    return {
      totalRewardsMinted: (programState as any).totalRewardsMinted.toNumber(),
      totalTransactions: (programState as any).totalTransactions.toNumber(),
    };
  } catch (error) {
    console.error('Error getting program stats:', error);
    return null;
  }
}

/**
 * Swap LYPTO tokens for USDC or SOL (simulated)
 * This uses price feeds and simulates the swap without complex smart contract changes
 */
export async function swapLyptoToToken(
  customerWalletAddress: string,
  amountInLypto: number,
  outputToken: 'USDC' | 'SOL'
): Promise<{
  success: boolean;
  txHash?: string;
  outputAmount: number;
  exchangeRate: number;
  fee: number;
}> {
  try {
    console.log(`🔄 Swapping ${amountInLypto} LYPTO for ${outputToken}`);

    // Get current prices (in production, this would come from a price oracle)
    const prices = await getTokenPrices();
    const lyptoPrice = prices.LYPTO;
    const usdcPrice = prices.USDC;
    const solPrice = prices.SOL;

    if (!lyptoPrice || !usdcPrice || !solPrice) {
      throw new Error('Unable to fetch current prices');
    }

    // Calculate exchange rate and output amount
    let exchangeRate: number;
    let outputAmount: number;
    let fee: number;

    if (outputToken === 'USDC') {
      exchangeRate = lyptoPrice / usdcPrice;
      outputAmount = amountInLypto * exchangeRate;
      fee = outputAmount * 0.003; // 0.3% fee
    } else {
      exchangeRate = lyptoPrice / solPrice;
      outputAmount = amountInLypto * exchangeRate;
      fee = outputAmount * 0.003; // 0.3% fee
    }

    outputAmount = outputAmount - fee;

    console.log(`   Exchange Rate: 1 LYPTO = ${exchangeRate.toFixed(6)} ${outputToken}`);
    console.log(`   Output: ${outputAmount.toFixed(6)} ${outputToken}`);
    console.log(`   Fee: ${fee.toFixed(6)} ${outputToken}`);

    // In a real implementation, this would:
    // 1. Burn LYPTO tokens from user's account
    // 2. Transfer output tokens from program account to user
    // 3. Update program balances

    // For now, we'll simulate the transaction
    const simulatedTxHash = `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      txHash: simulatedTxHash,
      outputAmount: outputAmount,
      exchangeRate: exchangeRate,
      fee: fee
    };

  } catch (error) {
    console.error('❌ Error swapping LYPTO:', error);
    throw error;
  }
}

/**
 * Swap USDC or SOL for LYPTO tokens (simulated)
 */
export async function swapTokenToLypto(
  customerWalletAddress: string,
  inputAmount: number,
  inputToken: 'USDC' | 'SOL'
): Promise<{
  success: boolean;
  txHash?: string;
  outputAmount: number;
  exchangeRate: number;
  fee: number;
}> {
  try {
    console.log(`🔄 Swapping ${inputAmount} ${inputToken} for LYPTO`);

    // Get current prices
    const prices = await getTokenPrices();
    const lyptoPrice = prices.LYPTO;
    const usdcPrice = prices.USDC;
    const solPrice = prices.SOL;

    if (!lyptoPrice || !usdcPrice || !solPrice) {
      throw new Error('Unable to fetch current prices');
    }

    // Calculate exchange rate and output amount
    let exchangeRate: number;
    let outputAmount: number;
    let fee: number;

    if (inputToken === 'USDC') {
      exchangeRate = usdcPrice / lyptoPrice;
      outputAmount = inputAmount * exchangeRate;
      fee = outputAmount * 0.003; // 0.3% fee
    } else {
      exchangeRate = solPrice / lyptoPrice;
      outputAmount = inputAmount * exchangeRate;
      fee = outputAmount * 0.003; // 0.3% fee
    }

    outputAmount = outputAmount - fee;

    console.log(`   Exchange Rate: 1 ${inputToken} = ${exchangeRate.toFixed(6)} LYPTO`);
    console.log(`   Output: ${outputAmount.toFixed(6)} LYPTO`);
    console.log(`   Fee: ${fee.toFixed(6)} LYPTO`);

    // In a real implementation, this would:
    // 1. Transfer input tokens from user to program account
    // 2. Mint LYPTO tokens to user's account
    // 3. Update program balances

    // For now, we'll simulate the transaction
    const simulatedTxHash = `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      txHash: simulatedTxHash,
      outputAmount: outputAmount,
      exchangeRate: exchangeRate,
      fee: fee
    };

  } catch (error) {
    console.error('❌ Error swapping to LYPTO:', error);
    throw error;
  }
}

/**
 * Get current token prices (simulated)
 * In production, this would fetch from a price oracle like CoinGecko or Pyth
 */
async function getTokenPrices(): Promise<{
  LYPTO: number;
  USDC: number;
  SOL: number;
}> {
  // Simulate price fetching
  // In production, integrate with CoinGecko API or Pyth oracle
  return {
    LYPTO: 0.01, // $0.01 per LYPTO
    USDC: 1.0,   // $1.00 per USDC
    SOL: 100.0   // $100.00 per SOL
  };
}

