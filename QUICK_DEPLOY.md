# ⚡ Quick Deploy Guide - Solana Contracts

## 🎯 Current Status

✅ **Contract:** Built & ready (329 KB)  
✅ **Backend:** Fully integrated  
✅ **Mobile/Merchant:** Connected  
⏳ **Deployment:** Waiting for devnet SOL

---

## 🚀 One-Command Deploy

Once you have ~2.5 SOL in your wallet, just run:

```bash
cd /Users/lex-work/Documents/zypto/contracts
./deploy-and-initialize.sh
```

That's it! The script handles everything.

---

## 💰 Get Devnet SOL

### Option 1: Wait & Retry (Recommended)
```bash
# Wait 5-10 minutes, then:
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
cd /Users/lex-work/Documents/zypto/contracts
solana airdrop 1
```

### Option 2: Web Faucets
- https://faucet.solana.com/
- https://solfaucet.com/

**Wallet Address:** `DFDuRSt4x2WURSpo6FaWWXFEJasvgqky3Aeu1Zxd93Nw`

### Option 3: Check Balance First
```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
solana balance
# If you see 2+ SOL, you might have enough already
```

---

## 📋 After Deployment

### 1. Add to Backend `.env`
```bash
# Get your private key
cat ~/.config/solana/id.json

# Add to backend/.env
MERCHANT_SOLANA_PRIVATE_KEY='[paste the array here]'
ENABLE_LYPTO_MINTING=true
```

### 2. Restart Backend
```bash
cd /Users/lex-work/Documents/zypto/backend
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
bun run index.ts
```

### 3. Test
Create a payment in merchant app → Authorize in mobile app → Check LYPTO balance!

---

## 📝 Key Addresses

| Item | Address |
|------|---------|
| **Program ID** | `WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH` |
| **Deploy Wallet** | `DFDuRSt4x2WURSpo6FaWWXFEJasvgqky3Aeu1Zxd93Nw` |
| **Network** | Devnet |
| **RPC** | `https://api.devnet.solana.com` |

---

## 🔍 Verify Deployment

```bash
# Check program exists
solana program show WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH

# View on explorer
open "https://explorer.solana.com/address/WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH?cluster=devnet"

# Watch logs
solana logs WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
```

---

## ❓ Troubleshooting

### "Insufficient funds"
```bash
solana airdrop 1
# Wait 1 minute and try again
```

### "Rate limit reached"
Wait 5-10 minutes or use web faucet.

### "Program not found"
Not deployed yet - run `./deploy-and-initialize.sh` first.

### "Transaction failed"
Check Solana Explorer for details. Link in verification section.

---

## 📚 Full Documentation

For detailed information, see:
- `SOLANA_INTEGRATION_COMPLETE.md` - Complete system overview
- `DEPLOYMENT_STATUS.md` - Deployment progress & status
- `contracts/README.md` - Contract documentation

---

## ⏱️ Timeline

- **Getting SOL:** 5-30 minutes (faucet dependent)
- **Deployment:** 2-3 minutes
- **Testing:** 5 minutes
- **Total:** ~15-40 minutes

**Everything is ready. Just waiting on devnet faucet!** 🎉

