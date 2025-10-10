use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH");

// Reward rate: 2% of transaction amount
const REWARD_RATE_BPS: u64 = 200; // 200 basis points = 2%
const BPS_DENOMINATOR: u64 = 10000;

#[program]
pub mod contracts {
    use super::*;

    /// Initialize the LYPTO token mint and program state
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        program_state.authority = ctx.accounts.authority.key();
        program_state.lypto_mint = ctx.accounts.lypto_mint.key();
        program_state.total_rewards_minted = 0;
        program_state.total_transactions = 0;
        program_state.bump = ctx.bumps.program_state;
        
        msg!("LYPTO Token Program Initialized!");
        msg!("Mint: {}", ctx.accounts.lypto_mint.key());
        msg!("Authority: {}", ctx.accounts.authority.key());
        
        Ok(())
    }

    /// Process a payment and mint LYPTO rewards to the customer
    /// Amount is in cents (e.g., $10.00 = 1000)
    pub fn process_payment(
        ctx: Context<ProcessPayment>,
        amount_in_cents: u64,
        transaction_id: String,
    ) -> Result<()> {
        require!(amount_in_cents > 0, LyptoError::InvalidAmount);
        require!(transaction_id.len() > 0, LyptoError::InvalidTransactionId);

        let program_state = &mut ctx.accounts.program_state;
        let transaction = &mut ctx.accounts.transaction;

        // Calculate reward: 2% of transaction amount
        let reward_amount = (amount_in_cents * REWARD_RATE_BPS) / BPS_DENOMINATOR;
        
        msg!("Processing payment:");
        msg!("  Transaction ID: {}", transaction_id);
        msg!("  Amount: ${:.2}", amount_in_cents as f64 / 100.0);
        msg!("  Reward (2%): {} LYPTO", reward_amount);
        msg!("  Customer: {}", ctx.accounts.customer.key());

        // Store transaction data
        transaction.transaction_id = transaction_id;
        transaction.customer = ctx.accounts.customer.key();
        transaction.merchant = ctx.accounts.merchant.key();
        transaction.amount = amount_in_cents;
        transaction.reward = reward_amount;
        transaction.timestamp = Clock::get()?.unix_timestamp;
        transaction.bump = ctx.bumps.transaction;

        // Mint LYPTO tokens to customer
        let seeds = &[
            b"program-state".as_ref(),
            &[program_state.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.lypto_mint.to_account_info(),
            to: ctx.accounts.customer_token_account.to_account_info(),
            authority: ctx.accounts.program_state.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::mint_to(cpi_ctx, reward_amount)?;

        // Update global stats
        program_state.total_rewards_minted += reward_amount;
        program_state.total_transactions += 1;

        msg!("✅ Payment processed successfully!");
        msg!("  Total rewards minted: {}", program_state.total_rewards_minted);
        msg!("  Total transactions: {}", program_state.total_transactions);

        Ok(())
    }

    /// Get transaction details
    pub fn get_transaction(
        _ctx: Context<GetTransaction>,
    ) -> Result<()> {
        // Transaction data is already in the account
        Ok(())
    }

    /// Update mint authority (admin only)
    pub fn update_authority(
        ctx: Context<UpdateAuthority>,
        new_authority: Pubkey,
    ) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        program_state.authority = new_authority;
        
        msg!("Authority updated to: {}", new_authority);
        Ok(())
    }
}

// ========== ACCOUNTS ==========

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ProgramState::LEN,
        seeds = [b"program-state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = 0,
        mint::authority = program_state,
        seeds = [b"lypto-mint"],
        bump
    )]
    pub lypto_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount_in_cents: u64, transaction_id: String)]
pub struct ProcessPayment<'info> {
    #[account(
        mut,
        seeds = [b"program-state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        mut,
        seeds = [b"lypto-mint"],
        bump
    )]
    pub lypto_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = merchant,
        space = 8 + Transaction::LEN,
        seeds = [b"transaction", transaction_id.as_bytes()],
        bump
    )]
    pub transaction: Account<'info, Transaction>,
    
    /// Customer who receives LYPTO rewards
    /// CHECK: This is safe as we only use it as a key
    pub customer: AccountInfo<'info>,
    
    /// Customer's LYPTO token account
    #[account(
        init_if_needed,
        payer = merchant,
        associated_token::mint = lypto_mint,
        associated_token::authority = customer
    )]
    pub customer_token_account: Account<'info, TokenAccount>,
    
    /// Merchant who processes the payment (pays for transaction)
    #[account(mut)]
    pub merchant: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct GetTransaction<'info> {
    #[account(
        seeds = [b"transaction", transaction.transaction_id.as_bytes()],
        bump = transaction.bump
    )]
    pub transaction: Account<'info, Transaction>,
}

#[derive(Accounts)]
pub struct UpdateAuthority<'info> {
    #[account(
        mut,
        seeds = [b"program-state"],
        bump = program_state.bump,
        has_one = authority
    )]
    pub program_state: Account<'info, ProgramState>,
    
    pub authority: Signer<'info>,
}

// ========== STATE ==========

#[account]
pub struct ProgramState {
    pub authority: Pubkey,           // 32
    pub lypto_mint: Pubkey,          // 32
    pub total_rewards_minted: u64,   // 8
    pub total_transactions: u64,     // 8
    pub bump: u8,                    // 1
}

impl ProgramState {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 1;
}

#[account]
pub struct Transaction {
    pub transaction_id: String,      // 4 + 64 = 68 (max 64 chars)
    pub customer: Pubkey,             // 32
    pub merchant: Pubkey,             // 32
    pub amount: u64,                  // 8 (in cents)
    pub reward: u64,                  // 8 (LYPTO tokens minted)
    pub timestamp: i64,               // 8
    pub bump: u8,                     // 1
}

impl Transaction {
    pub const LEN: usize = 68 + 32 + 32 + 8 + 8 + 8 + 1;
}

// ========== ERRORS ==========

#[error_code]
pub enum LyptoError {
    #[msg("Invalid amount: must be greater than 0")]
    InvalidAmount,
    
    #[msg("Invalid transaction ID: cannot be empty")]
    InvalidTransactionId,
    
    #[msg("Unauthorized: only admin can perform this action")]
    Unauthorized,
}
