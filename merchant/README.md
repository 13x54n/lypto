# 🏪 Lypto Merchant - POS App

## Overview

Point-of-sale mobile app for merchants to accept payments and distribute LYPTO crypto rewards to customers.

**Features:**
- 📷 QR code scanner for customer passes
- 💳 Payment request creation
- 📊 Real-time transaction dashboard
- 🪙 LYPTO rewards distribution tracking
- 📱 Push notifications
- 📈 Daily/Weekly/Monthly stats

---

## 🚀 Quick Start

### Development:
```bash
cd merchant
npm install
npm start
```

### Build for iOS:
```bash
npx expo prebuild
npx expo run:ios
```

### Production Build:
```bash
eas build --profile production --platform ios
```

---

## 🎨 Branding

### Logo:
- **Inverted from mobile app** ✅
- **White background** (vs mobile's black)
- Differentiated for merchants
- Professional appearance

### Theme:
- UI: Dark (#000 background)
- Accent: #55efc4 (mint green)
- Cards: #111 (dark gray)
- Text: White primary, #999 secondary

---

## 📁 Structure

```
merchant/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Transactions & Scanner
│   │   └── settings.tsx       # Merchant settings
│   ├── auth/
│   │   ├── login.tsx          # Email input
│   │   └── otp.tsx            # OTP verification
│   └── _layout.tsx            # Root layout
├── contexts/
│   └── AuthContext.tsx        # Authentication state
├── constants/
│   └── api.ts                 # API endpoints
├── assets/
│   └── images/                # Inverted logos ✅
├── app.json                   # Expo configuration
└── eas.json                   # Build configuration
```

---

## 🔌 API Integration

### Endpoints Used:
```typescript
POST /api/auth/request-otp
POST /api/auth/verify-otp
POST /api/merchant/create-payment
POST /api/merchant/confirm-payment
GET  /api/merchant/transactions
GET  /api/merchant/stats
GET  /api/merchant/realtime
```

---

## 🎯 Key Features

### 1. Authentication
- Email OTP login
- JWT token storage
- Auto Solana wallet creation

### 2. QR Scanner
- expo-camera integration
- LYPTO QR code validation
- Flash toggle
- Smart filtering (ignores invalid QR)

### 3. Payment Flow
- FAB to initiate
- Amount modal
- QR scanner activation
- Real-time waiting screen
- Success/decline confirmation

### 4. Dashboard
- Transaction history
- Daily/Weekly/Monthly stats
- LYPTO distribution tracking
- Pull to refresh

### 5. Real-time Updates
- Payment status changes
- LYPTO minting notifications
- Server-Sent Events (SSE)

---

## 🔐 Permissions

### iOS (Info.plist):
```xml
<key>NSCameraUsageDescription</key>
<string>Lypto Merchant needs camera access to scan customer QR codes and process payments</string>
```

### Android (AndroidManifest.xml):
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.VIBRATE" />
```

---

## 📊 Stats Tracked

```javascript
{
  today: {
    count: 2,              // Transactions
    total: 20.00,          // Revenue
    lyptoMinted: 40        // Rewards distributed
  },
  week: { /* ... */ },
  month: { /* ... */ },
  allTime: {
    lyptoMinted: 460       // Total LYPTO distributed ever
  }
}
```

---

## 🧪 Testing

### Test locally:
```bash
npm start
# Scan QR in Expo Go
```

### Test on device:
```bash
npx expo prebuild
npx expo run:ios --device
```

### Test payment flow:
1. Login merchant
2. Tap FAB (+)
3. Enter $10.00
4. Scan customer QR
5. Customer authorizes
6. ✅ See confirmation + stats update

---

## 🎨 Assets (Inverted)

All assets are **inverted** from mobile app:
- ✅ icon.png - WHITE background
- ✅ splash-icon.png - Inverted colors
- ✅ notification-icon.png - Inverted
- ✅ Android adaptive icons - Inverted

**Generated using:** `/scripts/create-merchant-assets.js`

---

## 🚀 Deploy to App Store

```bash
# 1. Configure EAS
eas build:configure

# 2. Build production
eas build --profile production --platform ios

# 3. Submit to App Store
eas submit --platform ios

# 4. Monitor in App Store Connect
```

---

## 📖 Documentation

- **APP_STORE_DEPLOYMENT.md** - Complete deployment guide
- **SYSTEM_SUMMARY.md** - Overall system architecture
- **COMPLETE_INTEGRATION.md** - Technical integration details

---

## ✅ Production Checklist

- [x] Inverted logo assets
- [x] App.json configured
- [x] Bundle identifier set
- [x] Camera permissions
- [x] Notifications configured
- [x] EAS config ready
- [x] API endpoints working
- [x] Real-time updates
- [x] LYPTO stats tracking
- [ ] Production API URL
- [ ] EAS project created
- [ ] TestFlight testing
- [ ] App Store submission

---

**Merchant app is ready for App Store with inverted WHITE logo!** ✅📱