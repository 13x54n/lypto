# 🚀 LYPTO Token - Complete Deployment Guide

## 📋 What We're Deploying

A **Solana smart contract** (Anchor program) that:
- Creates **LYPTO token** (SPL token)
- Mints **2% rewards** on every customer purchase
- Stores **transactions on-chain**
- Integrates with your **backend payment system**

---

## 🛠️ Prerequisites Installation

### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustc --version  # Verify installation
```

### 2. Install Solana CLI
```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
solana --version  # Verify installation
```

### 3. Install Anchor CLI
```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli --locked
anchor --version  # Verify installation
```

### 4. Create Solana Wallet
```bash
# Generate new wallet
solana-keygen new --outfile ~/.config/solana/id.json

# Or recover from seed phrase
solana-keygen recover --outfile ~/.config/solana/id.json

# Check your address
solana address
```

---

## 🔧 Configure Solana for Devnet

```bash
# Set to devnet
solana config set --url devnet

# Check config
solana config get

# Get your address
solana address

# Request SOL airdrop (for deployment costs)
solana airdrop 2

# Check balance
solana balance
```

---

## 🏗️ Build the Contract

```bash
cd /Users/lex-work/Documents/zypto/contracts

# Build the Anchor program
anchor build

# This creates:
# - target/deploy/contracts.so (compiled program)
# - target/deploy/contracts-keypair.json (program keypair)
# - target/idl/contracts.json (IDL for integration)
```

**Expected Output:**
```
Compiling contracts v0.1.0
Finished release [optimized] target(s) in 2m 15s
```

---

## 🚀 Deploy to Devnet

### Step 1: Deploy the Program

```bash
cd /Users/lex-work/Documents/zypto/contracts

# Deploy to devnet
anchor deploy --provider.cluster devnet

# This uploads your program to Solana devnet
```

**Expected Output:**
```
Deploying cluster: devnet
Upgrade authority: YOUR_WALLET_ADDRESS
Deploying program "contracts"...
Program path: target/deploy/contracts.so
Program Id: WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH

Deploy success!
```

### Step 2: Verify Deployment

```bash
# Check program is deployed
solana program show WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH --url devnet
```

### Step 3: Initialize the Program

```bash
# Run initialization script
anchor run initialize

# Or manually:
ts-node scripts/initialize.ts
```

**Expected Output:**
```
✅ Initialize transaction confirmed!
✅ LYPTO Token Program Initialized Successfully!

Program State:
  Authority: YOUR_WALLET
  LYPTO Mint: MINT_ADDRESS
  Total Rewards Minted: 0
  Total Transactions: 0
```

---

## 🧪 Test the Contract

### Run Tests on Devnet:

```bash
cd /Users/lex-work/Documents/zypto/contracts

# Test on devnet
anchor test --provider.cluster devnet --skip-local-validator
```

**Expected Output:**
```
✅ Program initialized successfully!
✅ Payment processed! (20 LYPTO minted)
✅ Customer LYPTO balance: 20
✅ Second payment processed! (100 LYPTO minted)
✅ Customer LYPTO balance: 120
```

---

## 🔌 Backend Integration

### Step 1: Install Dependencies

```bash
cd /Users/lex-work/Documents/zypto/backend

npm install @solana/web3.js @coral-xyz/anchor @solana/spl-token
```

### Step 2: Configure Environment

Add to `/backend/.env`:

```bash
# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com

# Merchant's Solana Private Key
# Get this by running: cat ~/.config/solana/id.json
MERCHANT_SOLANA_PRIVATE_KEY=[123,45,67,89,...]

# LYPTO Program Configuration
LYPTO_PROGRAM_ID=WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
LYPTO_MINT_ADDRESS=YOUR_MINT_ADDRESS_FROM_INITIALIZATION
```

### Step 3: Update Payment Confirmation

Edit `/backend/routes/merchant.ts`:

```typescript
import { mintLyptoReward, getLyptoBalance } from '../services/lyptoTokenService';

// In the confirm-payment endpoint:
merchantRouter.post('/confirm-payment', async (c) => {
  const { paymentId, status } = await c.req.json();
  
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return c.json({ error: 'Payment not found' }, 404);
  }
  
  payment.status = status;
  payment.updatedAt = new Date();
  await payment.save();
  
  // Mint LYPTO rewards if payment confirmed!
  if (status === 'confirmed') {
    const customer = await User.findOne({ email: payment.userEmail });
    
    if (customer?.circleWalletAddress) {
      try {
        console.log(`🪙 Minting LYPTO for $${payment.amount} payment...`);
        
        const txSignature = await mintLyptoReward(
          customer.circleWalletAddress,
          payment.amount,
          payment.id
        );
        
        console.log(`✅ LYPTO minted! TX: ${txSignature}`);
        
        // Save on-chain transaction signature
        payment.lyptoTxSignature = txSignature;
        await payment.save();
        
        // Get customer's new LYPTO balance
        const balance = await getLyptoBalance(customer.circleWalletAddress);
        console.log(`💰 Customer LYPTO balance: ${balance}`);
        
      } catch (error) {
        console.error('❌ Failed to mint LYPTO:', error);
        // Don't fail payment confirmation if LYPTO fails
      }
    }
  }
  
  // ... rest of code (send notifications, etc.)
  
  return c.json({ ok: true, payment });
});
```

### Step 4: Add LYPTO Balance Endpoint

Add new route in `/backend/index.ts`:

```typescript
import { getLyptoBalance, getProgramStats } from './services/lyptoTokenService';

// Get customer's LYPTO balance
app.get('/api/lypto/balance', async (c) => {
  const email = c.req.query('email');
  const user = await User.findOne({ email });
  
  if (!user?.circleWalletAddress) {
    return c.json({ balance: 0 });
  }
  
  const balance = await getLyptoBalance(user.circleWalletAddress);
  return c.json({ 
    balance,
    address: user.circleWalletAddress
  });
});

// Get program statistics
app.get('/api/lypto/stats', async (c) => {
  const stats = await getProgramStats();
  return c.json(stats);
});
```

---

## 📱 Mobile App Integration

### Display LYPTO Balance on Dashboard

Edit `/mobile/app/(tabs)/dashboard.tsx`:

```typescript
const [lyptoBalance, setLyptoBalance] = useState(0);

useEffect(() => {
  const fetchLyptoBalance = async () => {
    const response = await fetch(`${API_BASE}/api/lypto/balance?email=${userEmail}`);
    const data = await response.json();
    setLyptoBalance(data.balance);
  };
  
  fetchLyptoBalance();
}, [userEmail]);

// In JSX:
<View style={styles.lyptoCard}>
  <Ionicons name="diamond-outline" size={32} color="#55efc4" />
  <Text style={styles.lyptoBalance}>{lyptoBalance} LYPTO</Text>
  <Text style={styles.lyptoValue}>≈ ${(lyptoBalance * 0.01).toFixed(2)}</Text>
</View>
```

---

## 🧪 Test the Complete Flow

### End-to-End Test:

1. **Customer Login** (Mobile App)
   - Login with email
   - Solana wallet created automatically

2. **Merchant Creates Payment** (Merchant App)
   - Scan customer's Apple Wallet QR
   - Enter amount: $10.00
   - Send payment request

3. **Customer Authorizes** (Mobile App)
   - Receives push notification
   - Authorizes payment

4. **Backend Mints LYPTO** (Automatic)
   - Payment confirmed
   - Calls `mintLyptoReward()`
   - 20 LYPTO minted to customer

5. **Verify** (Multiple Ways)
   - Check mobile app dashboard
   - Check Solana Explorer
   - Check Circle Console
   - Check MongoDB

---

## 🔍 Verification

### Check Solana Explorer:
```
https://explorer.solana.com/address/CUSTOMER_WALLET_ADDRESS?cluster=devnet
```

You'll see:
- LYPTO token account
- Token balance
- Transaction history

### Check Transaction:
```
https://explorer.solana.com/tx/TRANSACTION_SIGNATURE?cluster=devnet
```

You'll see:
- Program invocation
- Token mint operation
- All account changes

---

## 📊 Example Transactions

```
Transaction 1: $10.00 Purchase
  → 20 LYPTO minted
  → Customer balance: 20 LYPTO
  → Value: $0.20

Transaction 2: $50.00 Purchase
  → 100 LYPTO minted
  → Customer balance: 120 LYPTO
  → Value: $1.20

Transaction 3: $100.00 Purchase
  → 200 LYPTO minted
  → Customer balance: 320 LYPTO
  → Value: $3.20
```

---

## 🐛 Common Issues

### "anchor: command not found"
**Solution:**
```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli --locked
```

### "solana: command not found"
**Solution:**
```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

### "Insufficient funds for deployment"
**Solution:**
```bash
solana airdrop 2
solana balance  # Check you have enough SOL
```

### "Program already deployed"
**Solution:**
```bash
# Upgrade existing program
anchor upgrade target/deploy/contracts.so --program-id WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
```

### "IDL not found"
**Solution:**
```bash
# IDL is deployed automatically with anchor deploy
# Or manually upload:
anchor idl init --filepath target/idl/contracts.json WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
```

---

## 📈 Production Deployment

### Switch to Mainnet:

1. **Update Anchor.toml:**
   ```toml
   [provider]
   cluster = "mainnet"
   ```

2. **Configure mainnet:**
   ```bash
   solana config set --url mainnet-beta
   ```

3. **Fund wallet with real SOL**
   (Deployment costs ~5-10 SOL)

4. **Deploy:**
   ```bash
   anchor build
   anchor deploy --provider.cluster mainnet
   anchor run initialize
   ```

5. **Update backend .env:**
   ```bash
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   ```

---

## 🎯 Quick Reference

### Build Commands:
```bash
anchor build              # Compile program
anchor deploy            # Deploy to configured cluster
anchor test              # Run tests
anchor run initialize    # Initialize program
```

### Solana Commands:
```bash
solana config get                    # Show config
solana address                       # Show wallet address
solana balance                       # Check SOL balance
solana airdrop 2                     # Get test SOL (devnet only)
solana program show PROGRAM_ID       # Check if program deployed
```

### Useful Addresses:
```
Program ID:    WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
Network:       Devnet (testnet)
RPC:           https://api.devnet.solana.com
Explorer:      https://explorer.solana.com/?cluster=devnet
```

---

## ✅ Deployment Checklist

- [ ] Rust installed
- [ ] Solana CLI installed
- [ ] Anchor CLI installed
- [ ] Solana wallet created
- [ ] SOL airdropped for deployment
- [ ] Contract built (`anchor build`)
- [ ] Contract deployed (`anchor deploy`)
- [ ] Program initialized (`anchor run initialize`)
- [ ] Backend configured with program ID
- [ ] Merchant keypair configured
- [ ] Test transaction successful
- [ ] Mobile app shows LYPTO balance

---

## 🎉 After Successful Deployment

You'll have:

✅ **LYPTO token created** on Solana  
✅ **Mint authority** controlled by contract  
✅ **2% rewards** minted automatically  
✅ **On-chain transaction history**  
✅ **Backend integration** ready  
✅ **Mobile app** showing balances  

**Customers will earn LYPTO with every purchase!** 🪙⛓️

---

## 📖 Next Steps

1. **Test on devnet** thoroughly
2. **Add LYPTO balance** to mobile dashboard
3. **Show rewards** in transaction history
4. **Build redemption** features
5. **Deploy to mainnet** when ready

---

## 💡 Need Help?

- **Anchor Docs:** https://www.anchor-lang.com/docs/installation
- **Solana Docs:** https://docs.solana.com/cli/install-solana-cli-tools
- **Discord:** Solana Discord for community help

---

**Contract code is ready! Just install tools, build, and deploy!** 🚀
