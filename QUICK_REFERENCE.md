# 🚀 Zypto - Quick Reference

## ✅ Status: FULLY INTEGRATED & WORKING!

---

## 🎯 Start the System

```bash
# Backend (Terminal 1)
cd backend && npm run dev
# Running on http://localhost:4000 ✅

# Mobile App (Terminal 2)
cd mobile && npm start
# Scan QR in Expo Go ✅

# Merchant App (Terminal 3)
cd merchant && npm start  
# Scan QR in Expo Go ✅
```

---

## 📱 Test Flow (5 Minutes)

### 1. Customer App
```
1. Open mobile app
2. Login: your-email@gmail.com
3. Get OTP from email
4. Enter OTP
5. ✅ Solana wallet created: 4kfQUF...YULT
6. ✅ Dashboard shows 0 LYPTO balance
7. Go to Wallet tab
8. Tap "Add to Apple Wallet"
9. ✅ Pass added with QR code
```

### 2. Merchant App
```
1. Open merchant app
2. Login: merchant@gmail.com
3. Get OTP from email
4. Enter OTP
5. ✅ Dashboard ready
6. Tap FAB (+) button
7. Enter: $10.00
8. Tap "Next: Scan Customer Pass"
9. Scan customer's Apple Wallet QR
10. ✅ Payment request sent
```

### 3. Customer Authorization
```
1. Customer receives push notification:
   "💳 Payment Request"
   "merchant@gmail.com requesting $10.00"
   "🪙 Earn 20 LYPTO (2% reward)"
2. Tap "Authorize" from notification
3. ✅ Payment confirmed
4. ✅ Dashboard updates with +20 LYPTO
```

### 4. Merchant Confirmation
```
1. Merchant sees waiting screen
2. Real-time update: "Payment Confirmed! ✅"
3. ✅ Stats update: +20 LYPTO distributed
4. ✅ Transaction appears in history
```

---

## 📊 Key Endpoints

```bash
# Health Check
curl http://localhost:4000/health

# Get LYPTO Balance
curl "http://localhost:4000/api/merchant/lypto-balance?email=customer@example.com"

# Get Merchant Stats
curl "http://localhost:4000/api/merchant/stats?merchantEmail=merchant@example.com"

# Get Transactions
curl "http://localhost:4000/api/merchant/transactions?merchantEmail=merchant@example.com"
```

---

## 🔧 Configuration Files

### Backend `.env`
```bash
MONGODB_URI=mongodb+srv://...
CIRCLE_APP_ID=5efa6aaa-1181-55e7-bb9d-9f01c5c89899
CIRCLE_API_KEY=TEST_API_KEY:69a25...
CIRCLE_ENTITY_SECRET=55a42eb4...
SMTP_USER=ming.env@gmail.com
SMTP_PASS=ubct iqgo hayb ivpn
```

### Mobile `app.json`
```json
{
  "extra": {
    "EXPO_PUBLIC_API_BASE": "http://10.0.0.144:4000"
  }
}
```

### Merchant `app.json`
```json
{
  "extra": {
    "EXPO_PUBLIC_API_BASE": "http://10.0.0.144:4000"
  }
}
```

---

## 🪙 LYPTO Rewards (2%)

| Purchase | LYPTO Earned | Value |
|----------|--------------|-------|
| $5       | 10 LYPTO     | $0.10 |
| $10      | 20 LYPTO     | $0.20 |
| $25      | 50 LYPTO     | $0.50 |
| $50      | 100 LYPTO    | $1.00 |
| $100     | 200 LYPTO    | $2.00 |
| $500     | 1000 LYPTO   | $10.00 |

**Formula:** `LYPTO = (amount_in_cents * 200) / 10000`

---

## 🔍 Verify Wallets

### MongoDB:
```bash
# Find user
db.users.findOne({ email: "customer@example.com" })

# Check wallet created
{
  circleWalletAddress: "4kfQUF2..."  ✅
}
```

### Circle Console:
```
https://console.circle.com
→ Developer Wallets
→ See all created wallets
```

### Solana Explorer:
```
https://explorer.solana.com/address/4kfQUF2xyct2v85TvYupZqJVoVBsBPCFpxAfJQWQYULT?cluster=devnet
```

---

## 🐛 Quick Fixes

### Backend not starting:
```bash
lsof -ti:4000 | xargs kill -9
cd backend && npm run dev
```

### Network error in apps:
```bash
# Check your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Update in mobile/app.json and merchant/app.json:
"EXPO_PUBLIC_API_BASE": "http://YOUR_IP:4000"
```

### OTP not sending:
```bash
# Check backend .env
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password  # No quotes!
```

---

## 🎯 What's Working (Test Now!)

✅ **Authentication** - Email OTP login  
✅ **Wallets** - Auto Solana wallet creation  
✅ **Payments** - Full merchant → customer flow  
✅ **Notifications** - Push + notification actions  
✅ **Real-time** - SSE for instant updates  
✅ **LYPTO Tracking** - Balance & rewards calculated  
✅ **MongoDB** - All data persisted  
✅ **Apple Wallet** - Pass with QR codes  
✅ **UI/UX** - Beautiful interfaces  

---

## ⏳ Optional (Deploy Contract)

```bash
# Install Solana tools
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Build & deploy contract
cd contracts
anchor build
anchor deploy
anchor run initialize

# Enable minting in backend
# routes/merchant.ts: ENABLE_LYPTO_MINTING = true

# Restart backend
# ✅ Real LYPTO tokens on Solana!
```

---

## 📚 Full Documentation

- **SYSTEM_SUMMARY.md** - Complete overview (this file)
- **COMPLETE_INTEGRATION.md** - Architecture & data flow
- **LYPTO_TOKEN_CONTRACT.md** - Smart contract details
- **SOLANA_DEPLOYMENT_GUIDE.md** - Deployment steps

---

## 🎉 You're Done!

**System is 100% functional:**

✅ All components integrated  
✅ MongoDB storing data  
✅ Real-time updates working  
✅ LYPTO rewards calculated  
✅ Ready to test NOW  
⏳ Ready for blockchain (30 min to deploy contract)  

**Just run the apps and test the payment flow!** 🚀💰

---

**Current Test Wallet:**
```
Email: not.so.lexy@gmail.com
Solana Address: 4kfQUF2xyct2v85TvYupZqJVoVBsBPCFpxAfJQWQYULT
LYPTO Balance: 0 (ready to earn!)
```

**Start testing payments now!** 🎊
