# 🪙 LYPTO Minting - Complete Guide & Debugging

## ✅ What I Fixed

### Issue: LYPTO Tokens Not Minting on Payment

**Root Causes:**
1. ❌ Missing dependencies: `@coral-xyz/anchor`, `@solana/spl-token`
2. ❌ Async service loading - service not ready when payments confirmed
3. ❌ No debugging logs to identify issues

**Fixes Applied:**
1. ✅ Installed missing dependencies
2. ✅ Added fallback synchronous import if service not loaded
3. ✅ Added comprehensive debug logging
4. ✅ Restarted backend with new code

---

## 🔍 How to Debug LYPTO Minting

### Step 1: Check Backend Logs on Startup

When you start the backend, you should see:

**If LYPTO is enabled:**
```
✅ LYPTO minting enabled
   Program ID: WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
   Mint Address: HcTYKqZaRjjhuJmmisTfqeD75XUQxsRiqkn18Pw5Y285
```

**If LYPTO is disabled:**
```
ℹ️  LYPTO minting disabled (set ENABLE_LYPTO_MINTING=true in .env to enable)
```

**If service fails to load:**
```
❌ Failed to load LYPTO service: <error message>
```

### Step 2: Monitor Payment Confirmation

When a payment is confirmed, watch for these logs:

```bash
# In backend terminal, you'll see:
💳 Payment confirmed: <paymentId> for $10.00

[LYPTO Check] Customer: customer@example.com
[LYPTO Check] Wallet Address: ABC123xyz...
[LYPTO Check] ENABLE_LYPTO_MINTING: true
[LYPTO Check] mintLyptoReward function: loaded  ← CRITICAL!

🪙 Minting 20 LYPTO to ABC123xyz...
💰 Minting LYPTO reward for transaction tx_123
   Amount: $10.00
   Customer: ABC123xyz...
   Reward: 20 LYPTO (2%)
   
✅ LYPTO minted! TX: 5VPe2YwS...
💰 Customer balance: 20 LYPTO
```

### Step 3: Check for Errors

**Common Issues & Solutions:**

#### Issue 1: "mintLyptoReward function: NOT LOADED"
```bash
# Check if dependencies are installed
cd backend
ls node_modules/@coral-xyz/anchor  # Should exist
ls node_modules/@solana/spl-token  # Should exist

# If missing, install:
bun add @coral-xyz/anchor @solana/spl-token

# Restart backend
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
bun run index.ts
```

#### Issue 2: "Customer wallet address not set"
```bash
# Check if user has Circle wallet
curl "http://localhost:4000/api/merchant/lypto-balance?email=customer@example.com"

# Should return:
# {
#   "balance": 0,
#   "walletAddress": "ABC123xyz..."  ← Must exist
# }

# If walletAddress is null, user needs to login again
# (wallet is created during OTP verification)
```

#### Issue 3: "ENABLE_LYPTO_MINTING: false"
```bash
# Check .env file
cd backend
grep ENABLE_LYPTO_MINTING .env

# Should show:
# ENABLE_LYPTO_MINTING=true

# If not, add it and restart backend
```

#### Issue 4: "Failed to mint LYPTO: <error>"
```bash
# Check Solana config
grep -E "LYPTO_MINT|LYPTO_PROGRAM|MERCHANT_SOLANA" backend/.env

# All must be set:
LYPTO_MINT_ADDRESS=HcTYKqZaRjjhuJmmisTfqeD75XUQxsRiqkn18Pw5Y285
LYPTO_PROGRAM_ID=WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
MERCHANT_SOLANA_PRIVATE_KEY=[array of numbers]
ENABLE_LYPTO_MINTING=true
```

---

## 🧪 Testing LYPTO Minting

### Test Payment Flow

1. **Create a test payment:**
```bash
curl -X POST http://localhost:4000/api/merchant/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "merchantEmail": "merchant@example.com",
    "userId": "test123",
    "amount": 10.00
  }'

# Save the paymentId from response
```

2. **Confirm payment (triggers LYPTO minting):**
```bash
curl -X POST http://localhost:4000/api/merchant/confirm-payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "<paymentId_from_step_1>",
    "status": "confirmed"
  }'
```

3. **Watch backend logs for:**
```
[LYPTO Check] Customer: test@example.com
[LYPTO Check] Wallet Address: ABC123xyz...
[LYPTO Check] ENABLE_LYPTO_MINTING: true
[LYPTO Check] mintLyptoReward function: loaded

🪙 Minting 20 LYPTO to ABC123xyz...
✅ LYPTO minted! TX: 5VPe2YwS...
💰 Customer balance: 20 LYPTO
```

4. **Verify on Solana Explorer:**
```bash
# Check program state
cd contracts
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-node -e "
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Contracts } from './target/types/contracts';
import { PublicKey } from '@solana/web3.js';

(async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Contracts as Program<Contracts>;
  
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('program-state')],
    program.programId
  );
  
  const state = await program.account.programState.fetch(programStatePda);
  console.log('Total LYPTO Minted:', state.totalRewardsMinted.toString());
  console.log('Total Transactions:', state.totalTransactions.toString());
})();
"
```

5. **Check customer balance:**
```bash
curl "http://localhost:4000/api/merchant/lypto-balance?email=test@example.com"

# Should show:
# {
#   "balance": 20,
#   "totalEarned": 20,
#   "walletAddress": "ABC123xyz...",
#   "syncedFromBlockchain": true
# }
```

---

## 🔧 Backend Code Flow

### 1. Service Loading (routes/merchant.ts:19-32)
```typescript
if (ENABLE_LYPTO_MINTING) {
  import('../services/lyptoTokenService').then(module => {
    mintLyptoReward = module.mintLyptoReward;
    getLyptoBalance = module.getLyptoBalance;
    console.log('✅ LYPTO minting enabled');
  }).catch(error => {
    console.error('❌ Failed to load LYPTO service:', error);
  });
}
```

### 2. Payment Confirmation (routes/merchant.ts:157-245)
```typescript
if (status === 'confirmed') {
  const customer = await User.findOne({ email: payment.userEmail });
  
  // Debug logging
  console.log('[LYPTO Check] Customer:', customer?.email);
  console.log('[LYPTO Check] Wallet Address:', customer?.circleWalletAddress);
  console.log('[LYPTO Check] ENABLE_LYPTO_MINTING:', ENABLE_LYPTO_MINTING);
  console.log('[LYPTO Check] mintLyptoReward function:', mintLyptoReward ? 'loaded' : 'NOT LOADED');
  
  // Fallback import if service not loaded
  if (!mintLyptoReward) {
    const lyptoService = await import('../services/lyptoTokenService');
    await lyptoService.mintLyptoReward(...);
  }
  
  // Or use pre-loaded service
  else {
    await mintLyptoReward(...);
  }
}
```

### 3. LYPTO Service (services/lyptoTokenService.ts)
```typescript
export async function mintLyptoReward(
  customerWalletAddress: string,
  amountInDollars: number,
  transactionId: string
): Promise<string> {
  // 1. Get Solana connection
  // 2. Get merchant keypair
  // 3. Calculate 2% reward
  // 4. Get PDAs (program state, mint, transaction)
  // 5. Get/create customer token account
  // 6. Load Anchor program from IDL
  // 7. Call processPayment instruction
  // 8. Return transaction signature
}
```

---

## 📊 What Happens on Each Payment

```
Merchant creates payment ($10.00)
        ↓
Customer authorizes payment
        ↓
Backend: POST /confirm-payment
        ↓
Update payment status in MongoDB
        ↓
Send real-time update via SSE
        ↓
[LYPTO Check] Logs appear ← YOU ARE HERE
        ↓
If all checks pass:
├─ Calculate reward: $10 × 2% = 20 LYPTO
├─ Get customer's token account
├─ Call Solana program: processPayment()
├─ Smart contract mints 20 LYPTO
├─ Update MongoDB with TX signature
├─ Sync balance from blockchain
└─ Send LYPTO minted notification
        ↓
Customer sees +20 LYPTO in wallet
```

---

## ✅ Verification Checklist

Before testing LYPTO minting:

### Backend Configuration
- [ ] `.env` has `ENABLE_LYPTO_MINTING=true`
- [ ] `.env` has `LYPTO_MINT_ADDRESS=HcTYKqZaRjjhuJmmisTfqeD75XUQxsRiqkn18Pw5Y285`
- [ ] `.env` has `LYPTO_PROGRAM_ID=WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH`
- [ ] `.env` has `MERCHANT_SOLANA_PRIVATE_KEY=[...]`
- [ ] Backend shows "✅ LYPTO minting enabled" on startup

### Smart Contract
- [ ] Program deployed: `WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH`
- [ ] LYPTO mint initialized: `HcTYKqZaRjjhuJmmisTfqeD75XUQxsRiqkn18Pw5Y285`
- [ ] Can view on Solana Explorer (devnet)

### User Wallet
- [ ] User logged in (has auth token)
- [ ] User has Circle wallet created (check via `/lypto-balance`)
- [ ] `circleWalletAddress` is not null

### Dependencies
- [ ] `@coral-xyz/anchor` installed in backend
- [ ] `@solana/spl-token` installed in backend
- [ ] `@solana/web3.js` installed in backend

---

## 🎯 Quick Test

```bash
# 1. Verify LYPTO service is loaded
curl http://localhost:4000/health
# Should see "✅ LYPTO minting enabled" in backend logs

# 2. Create and confirm a payment via merchant app
# Watch backend logs for [LYPTO Check] messages

# 3. If you see "mintLyptoReward function: loaded", it's working!

# 4. After confirmation, check customer balance:
curl "http://localhost:4000/api/merchant/lypto-balance?email=<customer_email>"
# Should show balance > 0 if minting worked
```

---

## 🔗 Useful Commands

```bash
# View Solana program logs (live)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
solana logs WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH

# Check program stats
cd contracts
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-node scripts/check-status.ts

# Restart backend
cd backend
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
bun run index.ts
```

---

## 📝 Expected Behavior

### First Payment
```
Backend logs:
  [LYPTO Check] Customer: test@example.com
  [LYPTO Check] Wallet Address: ABC123xyz...
  [LYPTO Check] ENABLE_LYPTO_MINTING: true
  [LYPTO Check] mintLyptoReward function: loaded
  
  🪙 Minting 20 LYPTO to ABC123xyz...
  💰 Minting LYPTO reward for transaction tx_123
     Amount: $10.00
     Customer: ABC123xyz...
     Reward: 20 LYPTO (2%)
     
  ✅ LYPTO minted! TX: 5VPe2YwSuZ...
  💰 Customer balance: 20 LYPTO
```

Solana program logs:
```
Program WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH invoke [1]
Program log: Processing payment:
Program log:   Transaction ID: tx_123
Program log:   Amount: $10.00
Program log:   Reward (2%): 20 LYPTO
Program log:   Customer: ABC123xyz...
Program log: ✅ Payment processed successfully!
Program log:   Total rewards minted: 20
Program log:   Total transactions: 1
Program WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH success
```

---

## 🚀 Next Steps

1. **Create a test payment** via merchant app
2. **Authorize it** via mobile app
3. **Watch backend logs** for [LYPTO Check] messages
4. **Check Solana logs** for program execution
5. **Verify balance** increased in mobile app

If you see all the check logs and no errors, LYPTO minting is working! 🎉

---

## 📊 System Status

| Component | Status |
|-----------|--------|
| Backend | ✅ Running |
| Dependencies | ✅ Installed |
| LYPTO Service | ✅ Ready (with fallback) |
| Smart Contract | ✅ Deployed |
| Debug Logging | ✅ Added |
| Fallback Import | ✅ Implemented |

**Try a payment now and watch the backend logs!** 🚀

