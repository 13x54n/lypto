# ✅ Start Here - Complete Setup in 5 Minutes

## 🎉 Your LYPTO Token is Live on Solana Devnet!

Everything is deployed and ready. Just follow these 3 steps:

---

## Step 1: Get Your Private Key (30 seconds)

```bash
cat ~/.config/solana/id.json
```

Copy the **entire array** output (including the brackets).

Example output:
```
[123,45,67,89,101,112,131,...]
```

---

## Step 2: Configure Backend (1 minute)

Open `backend/.env` and add these lines:

```env
# Solana Configuration
LYPTO_MINT_ADDRESS=HcTYKqZaRjjhuJmmisTfqeD75XUQxsRiqkn18Pw5Y285
LYPTO_PROGRAM_ID=WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
SOLANA_RPC_URL=https://api.devnet.solana.com
MERCHANT_SOLANA_PRIVATE_KEY=[PASTE_YOUR_ARRAY_HERE]
ENABLE_LYPTO_MINTING=true
```

**Replace `[PASTE_YOUR_ARRAY_HERE]` with the array you copied in Step 1.**

---

## Step 3: Restart Backend (30 seconds)

```bash
cd backend
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
bun run index.ts
```

Look for these lines in the output:
```
✅ Solana configuration loaded
   Program ID: WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
   LYPTO Mint: HcTYKqZaRjjhuJmmisTfqeD75XUQxsRiqkn18Pw5Y285
```

---

## ✅ You're Done!

### Test It Now:

1. **Open merchant app** → Create payment ($10.00)
2. **Scan customer QR** (from mobile app wallet tab)
3. **Customer authorizes** → Payment confirmed
4. **Backend mints** → 20 LYPTO tokens (2% of $10)
5. **Mobile app updates** → Balance shows +20 LYPTO

### Verify On-Chain:

```bash
solana logs WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH
```

Or visit:
- **Program:** https://explorer.solana.com/address/WvogQBTW3fvNABvsFk4nB6VvNLLNpEMP7rTe94zdwZH?cluster=devnet
- **LYPTO Mint:** https://explorer.solana.com/address/HcTYKqZaRjjhuJmmisTfqeD75XUQxsRiqkn18Pw5Y285?cluster=devnet

---

## 📚 Need More Info?

- **Full Deployment Details:** `DEPLOYMENT_COMPLETE.md`
- **Backend Config Guide:** `backend/SOLANA_CONFIG.md`
- **System Overview:** `SOLANA_INTEGRATION_COMPLETE.md`

---

## 🚀 **That's It!**

Your blockchain-powered loyalty program is live!

**Every payment now automatically mints 2% LYPTO rewards to customers.** 🎉

