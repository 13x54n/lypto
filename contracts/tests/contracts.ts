import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contracts } from "../target/types/contracts";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { assert } from "chai";

describe("LYPTO Token Rewards", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Contracts as Program<Contracts>;
  const authority = provider.wallet as anchor.Wallet;

  // PDAs
  let programStatePda: PublicKey;
  let lyptoMintPda: PublicKey;
  let programStateBump: number;
  let mintBump: number;

  // Test accounts
  const customer = Keypair.generate();
  const merchant = Keypair.generate();

  before(async () => {
    // Derive PDAs
    [programStatePda, programStateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );

    [lyptoMintPda, mintBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("lypto-mint")],
      program.programId
    );

    // Airdrop SOL to test accounts
    const airdropSignature = await provider.connection.requestAirdrop(
      merchant.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    console.log("Test Accounts:");
    console.log("  Authority:", authority.publicKey.toString());
    console.log("  Customer:", customer.publicKey.toString());
    console.log("  Merchant:", merchant.publicKey.toString());
    console.log("\nPDAs:");
    console.log("  Program State:", programStatePda.toString());
    console.log("  LYPTO Mint:", lyptoMintPda.toString());
  });

  it("Initializes the LYPTO token program", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        programState: programStatePda,
        lyptoMint: lyptoMintPda,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("\n✅ Initialize transaction signature:", tx);

    // Fetch and verify program state
    const programState = await program.account.programState.fetch(programStatePda);
    
    assert.equal(
      programState.authority.toString(),
      authority.publicKey.toString(),
      "Authority mismatch"
    );
    assert.equal(
      programState.lyptoMint.toString(),
      lyptoMintPda.toString(),
      "Mint mismatch"
    );
    assert.equal(
      programState.totalRewardsMinted.toNumber(),
      0,
      "Initial rewards should be 0"
    );
    assert.equal(
      programState.totalTransactions.toNumber(),
      0,
      "Initial transactions should be 0"
    );

    console.log("✅ Program initialized successfully!");
    console.log("  Authority:", programState.authority.toString());
    console.log("  LYPTO Mint:", programState.lyptoMint.toString());
  });

  it("Processes a $10 payment and mints 20 LYPTO tokens (2% reward)", async () => {
    const transactionId = "tx_test_001";
    const amountInCents = 1000; // $10.00
    const expectedReward = 20; // 2% of $10 = $0.20 = 20 LYPTO

    // Derive transaction PDA
    const [transactionPda, transactionBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("transaction"), Buffer.from(transactionId)],
      program.programId
    );

    // Get customer's LYPTO token account
    const customerTokenAccount = await getAssociatedTokenAddress(
      lyptoMintPda,
      customer.publicKey
    );

    const tx = await program.methods
      .processPayment(new anchor.BN(amountInCents), transactionId)
      .accounts({
        programState: programStatePda,
        lyptoMint: lyptoMintPda,
        transaction: transactionPda,
        customer: customer.publicKey,
        customerTokenAccount: customerTokenAccount,
        merchant: merchant.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([merchant])
      .rpc();

    console.log("\n✅ Payment processed! Transaction signature:", tx);

    // Verify transaction data
    const transactionData = await program.account.transaction.fetch(transactionPda);
    
    assert.equal(transactionData.transactionId, transactionId);
    assert.equal(transactionData.customer.toString(), customer.publicKey.toString());
    assert.equal(transactionData.merchant.toString(), merchant.publicKey.toString());
    assert.equal(transactionData.amount.toNumber(), amountInCents);
    assert.equal(transactionData.reward.toNumber(), expectedReward);

    console.log("✅ Transaction verified:");
    console.log("  Transaction ID:", transactionData.transactionId);
    console.log("  Amount: $" + (transactionData.amount.toNumber() / 100).toFixed(2));
    console.log("  Reward:", transactionData.reward.toNumber(), "LYPTO");
    console.log("  Customer:", transactionData.customer.toString());
    console.log("  Merchant:", transactionData.merchant.toString());

    // Verify customer's token balance
    const customerTokenAccountData = await getAccount(
      provider.connection,
      customerTokenAccount
    );

    assert.equal(
      customerTokenAccountData.amount.toString(),
      expectedReward.toString(),
      "Customer should have received 20 LYPTO tokens"
    );

    console.log("✅ Customer LYPTO balance:", customerTokenAccountData.amount.toString());

    // Verify program state updated
    const programState = await program.account.programState.fetch(programStatePda);
    
    assert.equal(programState.totalRewardsMinted.toNumber(), expectedReward);
    assert.equal(programState.totalTransactions.toNumber(), 1);

    console.log("✅ Program stats updated:");
    console.log("  Total rewards minted:", programState.totalRewardsMinted.toNumber());
    console.log("  Total transactions:", programState.totalTransactions.toNumber());
  });

  it("Processes a $50 payment and mints 100 LYPTO tokens (2% reward)", async () => {
    const transactionId = "tx_test_002";
    const amountInCents = 5000; // $50.00
    const expectedReward = 100; // 2% of $50 = $1.00 = 100 LYPTO

    // Derive transaction PDA
    const [transactionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("transaction"), Buffer.from(transactionId)],
      program.programId
    );

    // Get customer's LYPTO token account (already exists from first transaction)
    const customerTokenAccount = await getAssociatedTokenAddress(
      lyptoMintPda,
      customer.publicKey
    );

    const tx = await program.methods
      .processPayment(new anchor.BN(amountInCents), transactionId)
      .accounts({
        programState: programStatePda,
        lyptoMint: lyptoMintPda,
        transaction: transactionPda,
        customer: customer.publicKey,
        customerTokenAccount: customerTokenAccount,
        merchant: merchant.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([merchant])
      .rpc();

    console.log("\n✅ Second payment processed! Transaction signature:", tx);

    // Verify customer's token balance (should be 20 + 100 = 120)
    const customerTokenAccountData = await getAccount(
      provider.connection,
      customerTokenAccount
    );

    const expectedTotal = 20 + 100; // From both transactions
    assert.equal(
      customerTokenAccountData.amount.toString(),
      expectedTotal.toString(),
      "Customer should have 120 LYPTO tokens total"
    );

    console.log("✅ Customer LYPTO balance:", customerTokenAccountData.amount.toString());

    // Verify program state
    const programState = await program.account.programState.fetch(programStatePda);
    
    assert.equal(programState.totalRewardsMinted.toNumber(), expectedTotal);
    assert.equal(programState.totalTransactions.toNumber(), 2);

    console.log("✅ Program stats:");
    console.log("  Total rewards minted:", programState.totalRewardsMinted.toNumber());
    console.log("  Total transactions:", programState.totalTransactions.toNumber());
  });

  it("Can retrieve transaction details", async () => {
    const transactionId = "tx_test_001";
    
    const [transactionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("transaction"), Buffer.from(transactionId)],
      program.programId
    );

    const transactionData = await program.account.transaction.fetch(transactionPda);
    
    console.log("\n📊 Transaction Details:");
    console.log("  ID:", transactionData.transactionId);
    console.log("  Amount: $" + (transactionData.amount.toNumber() / 100).toFixed(2));
    console.log("  Reward:", transactionData.reward.toNumber(), "LYPTO");
    console.log("  Customer:", transactionData.customer.toString());
    console.log("  Merchant:", transactionData.merchant.toString());
    console.log("  Timestamp:", new Date(transactionData.timestamp.toNumber() * 1000).toISOString());

    assert.equal(transactionData.transactionId, transactionId);
    assert.equal(transactionData.amount.toNumber(), 1000);
    assert.equal(transactionData.reward.toNumber(), 20);
  });
});
