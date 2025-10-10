import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

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
    
    const program = new Program(idl, new AnchorProvider(
      connection,
      new NodeWallet(merchant),
      {}
    ));
    
    // Call process_payment instruction
    const tx = await program.methods
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
    
    const program = new Program(idl, new AnchorProvider(
      connection,
      new NodeWallet(merchant),
      {}
    ));
    
    const transactionData = await program.account.transaction.fetch(transactionPda);
    
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
    
    const program = new Program(idl, new AnchorProvider(
      connection,
      new NodeWallet(merchant),
      {}
    ));
    
    const programState = await program.account.programState.fetch(programStatePda);
    
    return {
      totalRewardsMinted: (programState as any).totalRewardsMinted.toNumber(),
      totalTransactions: (programState as any).totalTransactions.toNumber(),
    };
  } catch (error) {
    console.error('Error getting program stats:', error);
    return null;
  }
}

