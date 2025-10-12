/**
 * Initialize the LYPTO Token Program
 * Run this ONCE after deploying the contract
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contracts } from "../target/types/contracts";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

async function main() {
  console.log("🚀 Initializing LYPTO Token Program...\n");

  // Configure the client
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Contracts as Program<Contracts>;
  const authority = provider.wallet;

  console.log("📋 Configuration:");
  console.log("  Network:", provider.connection.rpcEndpoint);
  console.log("  Program ID:", program.programId.toString());
  console.log("  Authority:", authority.publicKey.toString());
  console.log();

  // Derive PDAs
  const [programStatePda, programStateBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("program-state")],
    program.programId
  );

  const [lyptoMintPda, mintBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("lypto-mint")],
    program.programId
  );

  console.log("🔑 PDAs:");
  console.log("  Program State:", programStatePda.toString());
  console.log("  LYPTO Mint:", lyptoMintPda.toString());
  console.log();

  try {
    // Check if already initialized
    try {
      const existingState = await program.account.programState.fetch(programStatePda);
      console.log("⚠️  Program already initialized!");
      console.log("  Current Authority:", existingState.authority.toString());
      console.log("  LYPTO Mint:", existingState.lyptoMint.toString());
      console.log("  Total Rewards Minted:", existingState.totalRewardsMinted.toString());
      console.log("  Total Transactions:", existingState.totalTransactions.toString());
      return;
    } catch (error) {
      // Not initialized yet, continue
    }

    // Initialize the program
    console.log("📝 Sending initialize transaction...");
    
    const tx = await program.methods
      .initialize()
      .accountsPartial({
        programState: programStatePda,
        lyptoMint: lyptoMintPda,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("✅ Initialize transaction confirmed!");
    console.log("  Transaction:", tx);
    console.log();

    // Fetch and display program state
    const programState = await program.account.programState.fetch(programStatePda);
    
    console.log("🎉 LYPTO Token Program Initialized Successfully!\n");
    console.log("📊 Program State:");
    console.log("  Authority:", programState.authority.toString());
    console.log("  LYPTO Mint:", programState.lyptoMint.toString());
    console.log("  Total Rewards Minted:", programState.totalRewardsMinted.toString());
    console.log("  Total Transactions:", programState.totalTransactions.toString());
    console.log();
    
    console.log("🔗 Links:");
    console.log("  Transaction:", `https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    console.log("  Program:", `https://explorer.solana.com/address/${program.programId}?cluster=devnet`);
    console.log("  Mint:", `https://explorer.solana.com/address/${lyptoMintPda}?cluster=devnet`);
    console.log();
    
    console.log("✅ Ready to mint LYPTO rewards!");
    console.log("💡 Add this to your backend .env:");
    console.log(`   LYPTO_MINT_ADDRESS=${lyptoMintPda.toString()}`);
    console.log(`   LYPTO_PROGRAM_ID=${program.programId.toString()}`);
    
  } catch (error) {
    console.error("\n❌ Initialization failed:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

