# 🪙 LYPTO Token Rewards Contract

## Overview

Solana smart contract built with **Anchor Framework** that mints **LYPTO tokens** as rewards for customer purchases.

**Reward Rate:** 2% of purchase amount  
**Token Type:** SPL Token (Solana)  
**Network:** Devnet (Testnet)  

---

## 🚀 Quick Start

### Build
```bash
anchor build
```

### Deploy
```bash
anchor deploy --provider.cluster devnet
```

### Initialize
```bash
anchor run initialize
```

### Test
```bash
anchor test --provider.cluster devnet
```

---

## 📁 Structure

```
contracts/
├── programs/
│   └── contracts/
│       ├── Cargo.toml          # Rust dependencies
│       └── src/
│           └── lib.rs           # Main contract code
├── tests/
│   └── contracts.ts            # Integration tests
├── scripts/
│   └── initialize.ts           # Initialization script
├── Anchor.toml                 # Anchor configuration
└── README.md                   # This file
```

---

## 🎯 Contract Features

### Instructions:

1. **`initialize()`**
   - Creates LYPTO token mint
   - Sets up program state
   - **Run once** after deployment

2. **`process_payment(amount, tx_id)`**
   - Calculates 2% reward
   - Mints LYPTO to customer
   - Records transaction on-chain

3. **`get_transaction(tx_id)`**
   - Retrieves transaction details
   - On-chain transaction history

4. **`update_authority(new_authority)`**
   - Admin function
   - Transfer program control

---

## 💰 Reward Examples

| Purchase Amount | LYPTO Reward (2%) |
|----------------|-------------------|
| $5.00          | 10 LYPTO          |
| $10.00         | 20 LYPTO          |
| $25.00         | 50 LYPTO          |
| $50.00         | 100 LYPTO         |
| $100.00        | 200 LYPTO         |

**1 LYPTO = $0.01**

---

## 🧪 Testing

### Run Tests:
```bash
# Local validator
anchor test

# Devnet
anchor test --provider.cluster devnet --skip-local-validator
```

### Test Coverage:
- ✅ Program initialization
- ✅ $10 payment → 20 LYPTO minted
- ✅ $50 payment → 100 LYPTO minted  
- ✅ Token balance verification
- ✅ Transaction retrieval
- ✅ Program stats

---

## 🔧 Development

### Build:
```bash
anchor build
```

### Deploy:
```bash
anchor deploy
```

### Update Program:
```bash
anchor build
anchor upgrade target/deploy/contracts.so --program-id PROGRAM_ID
```

### Clean Build:
```bash
anchor clean
anchor build
```

---

## 📊 Program Accounts

### Program State (PDA):
```rust
Seeds: ["program-state"]
Data:
  - authority: Pubkey
  - lypto_mint: Pubkey
  - total_rewards_minted: u64
  - total_transactions: u64
```

### LYPTO Mint (PDA):
```rust
Seeds: ["lypto-mint"]
Type: SPL Token Mint
Decimals: 0 (whole numbers only)
Authority: Program State PDA
```

### Transaction (PDA per payment):
```rust
Seeds: ["transaction", transaction_id]
Data:
  - transaction_id: String
  - customer: Pubkey
  - merchant: Pubkey
  - amount: u64 (cents)
  - reward: u64 (LYPTO)
  - timestamp: i64
```

---

## 🔗 Integration

### Backend Service:
`/backend/services/lyptoTokenService.ts`

**Functions:**
```typescript
// Mint rewards
mintLyptoReward(customerAddress, amount, txId)

// Get balance
getLyptoBalance(customerAddress)

// Get transaction
getTransactionDetails(txId)

// Get stats
getProgramStats()
```

### Payment Flow:
```
1. Merchant scans QR
2. Customer authorizes payment
3. Payment confirmed in MongoDB
4. Backend calls mintLyptoReward()
5. Smart contract mints LYPTO
6. Tokens sent to customer wallet
7. Transaction recorded on-chain
```

---

## 🎓 Resources

- **Anchor Book:** https://www.anchor-lang.com/
- **Solana Cookbook:** https://solanacookbook.com/
- **SPL Token Docs:** https://spl.solana.com/token
- **Devnet Explorer:** https://explorer.solana.com/?cluster=devnet

---

## ✅ Status

| Component | Status |
|-----------|--------|
| Contract Code | ✅ Complete |
| Tests | ✅ Written |
| Backend Service | ✅ Ready |
| Build Config | ✅ Configured |
| Deployment | ⏳ Waiting for Solana CLI |

**Install Solana tools and deploy to start earning LYPTO!** 🚀

---

## 📝 License

Part of the Zypto project.

Built with ❤️ using Anchor Framework.

