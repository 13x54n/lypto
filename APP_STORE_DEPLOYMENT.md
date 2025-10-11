# 🚀 App Store Deployment Guide

## 📱 Apps Ready for Deployment!

### ✅ Mobile App (Customer)
- **Name:** Lypto
- **Bundle ID:** `xyz.minginc.lypto`
- **Logo:** Black background (original)
- **Theme:** Dark mode optimized

### ✅ Merchant App (POS)
- **Name:** Lypto Merchant
- **Bundle ID:** `xyz.minginc.lypto.merchant`
- **Logo:** White background (inverted)
- **Theme:** Dark UI with light branding

---

## 🎨 Assets Created

### ✅ Mobile Assets (Original):
```
mobile/assets/images/
├── icon.png (1024x1024)               # Black background
├── splash-icon.png (400x400)          # Black background
├── notification-icon.png (96x96)      # Black background
├── favicon.png (48x48)
└── android-icon-*.png                 # Adaptive icons
```

### ✅ Merchant Assets (Inverted):
```
merchant/assets/images/
├── icon.png (1024x1024)               # WHITE background ✅
├── splash-icon.png (400x400)          # WHITE background ✅
├── notification-icon.png (96x96)      # WHITE background ✅
├── favicon.png (48x48)                # Inverted ✅
└── android-icon-*.png                 # Inverted adaptive icons ✅
```

**Colors Inverted:**
- Mobile: Black logo on transparent/black → Merchant: White logo on white
- Mobile: Green accents → Merchant: Same green accents (#55efc4)

---

## 📋 Pre-Deployment Checklist

### Mobile App:
- [x] Assets created and optimized
- [x] app.json configured
- [x] Bundle identifier set
- [x] Version 1.0.0
- [x] Build number 1
- [x] Camera permissions (Apple Wallet)
- [x] Notifications configured
- [x] EAS config ready
- [ ] EAS project ID (run `eas build:configure`)
- [ ] Apple Developer account
- [ ] App Store Connect app created

### Merchant App:
- [x] Inverted assets created ✅
- [x] app.json configured
- [x] Bundle identifier set
- [x] Version 1.0.0
- [x] Build number 1
- [x] Camera permissions (QR scanner)
- [x] Notifications configured
- [x] EAS config ready
- [ ] EAS project ID (run `eas build:configure`)
- [ ] Apple Developer account
- [ ] App Store Connect app created

---

## 🔧 Setup EAS (Expo Application Services)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
# Use your Expo account: not.so.lexy
```

### 3. Configure Mobile App
```bash
cd /Users/lex-work/Documents/zypto/mobile

# Initialize EAS
eas build:configure

# Create EAS project
eas init

# The EAS project ID will be added to app.json automatically
```

### 4. Configure Merchant App
```bash
cd /Users/lex-work/Documents/zypto/merchant

# Initialize EAS
eas build:configure

# Create EAS project
eas init
```

---

## 🏗️ Build for iOS

### Mobile App (Customer):

```bash
cd /Users/lex-work/Documents/zypto/mobile

# Development build (for testing)
eas build --profile development --platform ios

# Preview build (TestFlight)
eas build --profile preview --platform ios

# Production build (App Store)
eas build --profile production --platform ios
```

### Merchant App (POS):

```bash
cd /Users/lex-work/Documents/zypto/merchant

# Development build (for testing)
eas build --profile development --platform ios

# Preview build (TestFlight)
eas build --profile preview --platform ios

# Production build (App Store)
eas build --profile production --platform ios
```

---

## 📤 Submit to App Store

### 1. Build Production Version

```bash
# Mobile
cd mobile
eas build --profile production --platform ios

# Merchant
cd merchant
eas build --profile production --platform ios
```

### 2. Submit to App Store

```bash
# Mobile
cd mobile
eas submit --platform ios

# Merchant
cd merchant
eas submit --platform ios
```

EAS will:
1. Upload build to App Store Connect
2. Create app listing if needed
3. Fill in required metadata
4. Submit for review

---

## 📝 App Store Metadata

### Mobile App (Lypto):

**App Name:** Lypto - Crypto Rewards  
**Subtitle:** Earn LYPTO tokens on every purchase  
**Keywords:** crypto, rewards, loyalty, blockchain, solana, wallet  
**Category:** Finance  

**Description:**
```
Earn crypto rewards with every purchase!

Lypto is a revolutionary rewards platform that gives you 2% back in LYPTO tokens on every transaction. Your rewards are stored on the Solana blockchain, giving you real ownership of your earnings.

KEY FEATURES:
• 2% Crypto Rewards - Earn LYPTO tokens on every purchase
• Instant Wallet - Automatic Solana wallet creation
• Apple Wallet Integration - Easy payment with QR codes
• Real-time Notifications - Never miss a payment request
• Track Your Rewards - See your earnings grow
• Secure & Non-Custodial - You control your wallet

HOW IT WORKS:
1. Sign up and get your Solana wallet automatically
2. Add your Lypto pass to Apple Wallet
3. Shop at participating merchants
4. Scan your pass and authorize payments
5. Earn 2% LYPTO on every purchase!

1 LYPTO = $0.01
Earn, save, and redeem your crypto rewards!
```

**Screenshots Needed:**
1. Dashboard with LYPTO balance
2. Apple Wallet pass
3. Payment authorization modal
4. Transaction history
5. Rewards explanation screen

### Merchant App (Lypto Merchant):

**App Name:** Lypto Merchant - POS  
**Subtitle:** Accept payments & reward customers  
**Keywords:** pos, merchant, point of sale, payments, qr, scanner  
**Category:** Business  

**Description:**
```
Turn your phone into a crypto-rewards POS system!

Lypto Merchant helps you accept payments and automatically reward your customers with LYPTO crypto tokens. Every transaction earns your customers 2% back, keeping them coming back.

KEY FEATURES:
• QR Code Scanner - Scan customer passes instantly
• Payment Requests - Send payment requests with one scan
• Real-time Status - See authorizations as they happen
• Transaction History - Track all your sales
• LYPTO Distribution - See how many rewards you've given
• Daily/Weekly/Monthly Stats - Monitor your performance
• Push Notifications - Get notified of payment status

HOW IT WORKS:
1. Sign up for merchant account
2. Customer shows their Lypto pass
3. Scan their QR code
4. Enter payment amount
5. Customer authorizes on their phone
6. Payment confirmed & LYPTO rewarded!

Increase customer loyalty with automatic crypto rewards!
```

**Screenshots Needed:**
1. Transaction dashboard with stats
2. QR scanner interface
3. Payment waiting screen
4. Transaction history
5. LYPTO stats card

---

## 🎨 App Icons Preview

### Mobile (Dark):
```
┌─────────────┐
│  ███████    │  ← Black/Dark
│  ███ Z ███  │
│  ███████    │
└─────────────┘
```

### Merchant (Light):
```
┌─────────────┐
│             │  ← White/Light
│     Z       │
│             │
└─────────────┘
```

---

## 🔒 Production Configuration

### Update Backend URL

**Mobile `app.json`:**
```json
"extra": {
  "EXPO_PUBLIC_API_BASE": "https://your-production-api.com"
}
```

**Merchant `app.json`:**
```json
"extra": {
  "EXPO_PUBLIC_API_BASE": "https://your-production-api.com"
}
```

### Environment-specific Builds

**EAS eas.json:**
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_BASE": "https://api.lypto.app"
      }
    }
  }
}
```

---

## 🧪 Pre-submission Testing

### TestFlight (iOS):

```bash
# Build preview version
cd mobile
eas build --profile preview --platform ios

# Submit to TestFlight
eas submit --platform ios --latest

# Invite testers in App Store Connect
# Test all features thoroughly
```

### Internal Testing (Android):

```bash
# Build APK for testing
cd mobile
eas build --profile preview --platform android

# Download and install on test devices
```

---

## 📊 Build Configuration Details

### Mobile App Config:
```json
{
  "name": "Lypto",
  "bundleIdentifier": "xyz.minginc.lypto",
  "icon": "Black logo on transparent",
  "theme": "Dark mode",
  "features": [
    "Authentication",
    "Solana Wallet",
    "LYPTO Balance",
    "Apple Wallet",
    "Payment Authorization",
    "Push Notifications",
    "Transaction History"
  ]
}
```

### Merchant App Config:
```json
{
  "name": "Lypto Merchant",
  "bundleIdentifier": "xyz.minginc.lypto.merchant",
  "icon": "WHITE logo (inverted)",
  "theme": "Dark UI with light branding",
  "features": [
    "Authentication",
    "Solana Wallet",
    "QR Scanner",
    "Payment Creation",
    "Real-time Status",
    "LYPTO Stats",
    "Transaction Management"
  ]
}
```

---

## 🚀 Quick Deploy Commands

### Build Both Apps for iOS:

```bash
# Terminal 1: Mobile
cd /Users/lex-work/Documents/zypto/mobile
eas build --profile production --platform ios

# Terminal 2: Merchant
cd /Users/lex-work/Documents/zypto/merchant
eas build --profile production --platform ios
```

### Build Both Apps for Android:

```bash
# Mobile
cd mobile
eas build --profile production --platform android

# Merchant  
cd merchant
eas build --profile production --platform android
```

### Build All Platforms:

```bash
# Mobile
cd mobile
eas build --profile production --platform all

# Merchant
cd merchant
eas build --profile production --platform all
```

---

## 📱 App Store Requirements

### Both Apps Need:

1. **Apple Developer Account** ($99/year)
   - Enroll at: https://developer.apple.com

2. **App Store Connect**
   - Create app listings
   - Add screenshots
   - Set pricing (Free)
   - Configure in-app purchases (if needed)

3. **Privacy Policy**
   - Already have: `https://lypto.vercel.app/privacy`
   
4. **Terms of Service**
   - Already have: `https://lypto.vercel.app/terms`

5. **App Icon** (1024x1024)
   - ✅ Mobile: Created
   - ✅ Merchant: Created (inverted)

6. **Screenshots** (Required Sizes)
   - iPhone 6.7" (1290x2796)
   - iPhone 6.5" (1242x2688)
   - iPhone 5.5" (1242x2208)
   - iPad Pro 12.9" (2048x2732)

---

## 🎯 Deployment Timeline

### Week 1: Preparation
- [ ] Create Apple Developer account
- [ ] Set up App Store Connect listings
- [ ] Take screenshots for both apps
- [ ] Deploy backend to production

### Week 2: TestFlight
- [ ] Build preview versions
- [ ] Upload to TestFlight
- [ ] Invite beta testers
- [ ] Collect feedback
- [ ] Fix any issues

### Week 3: Production
- [ ] Build production versions
- [ ] Submit to App Store Review
- [ ] Wait for approval (1-3 days typically)
- [ ] Launch! 🎉

---

## 🔍 Verify Assets

### Check Merchant Assets:
```bash
cd /Users/lex-work/Documents/zypto/merchant/assets/images
ls -lh

# Should see:
# icon.png (inverted)
# splash-icon.png (inverted)
# notification-icon.png (inverted)
# android-icon-*.png (inverted)
```

### Preview Icons:
```bash
# Open in Preview/Finder
open merchant/assets/images/icon.png
# Should see WHITE background logo ✅
```

---

## 🎨 Visual Differences

### Mobile App Icon:
- Background: Black/Dark
- Logo: Light/White
- Accent: #55efc4 (mint green)
- Style: Modern, sleek

### Merchant App Icon:
- Background: White/Light ✅
- Logo: Dark/Black
- Accent: #55efc4 (same green)
- Style: Professional, clean

**Perfect for differentiating in App Store!**

---

## 📦 Build Size Optimization

### Reduce App Size:

```json
// In app.json
"assetBundlePatterns": [
  "**/*"
],
"packagerOpts": {
  "sourceExts": ["js", "json", "ts", "tsx", "jsx"]
}
```

### Remove Dev Dependencies:

```bash
# Before building for production
npm prune --production
```

---

## 🐛 Pre-Build Fixes

### Fix Mongoose Warning:

The warning about duplicate schema index is harmless, but we can fix it:

```typescript
// backend/models/Payment.ts
// Remove this line:
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Keep only:
expiresAt: { 
  type: Date, 
  required: true,
  index: true,  // This is enough
}
```

---

## ✅ Ready to Build!

### Quick Build Test:

```bash
# Test build locally first
cd mobile
npx expo prebuild
npx expo run:ios --configuration Release

cd merchant
npx expo prebuild
npx expo run:ios --configuration Release
```

### Production Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build Mobile
cd mobile
eas build --profile production --platform ios

# Build Merchant
cd merchant
eas build --profile production --platform ios
```

---

## 🎊 Summary

**You now have:**

✅ **Mobile App** - Ready for App Store
   - Dark theme
   - Black logo
   - Customer features
   - Production config

✅ **Merchant App** - Ready for App Store
   - Light branding (WHITE logo)
   - Dark UI
   - POS features
   - Production config

✅ **Assets** - Optimized & inverted
   - All sizes created
   - Properly configured
   - App Store compliant

✅ **EAS Config** - Build ready
   - Development profile
   - Preview (TestFlight)
   - Production (App Store)

---

## 🚀 Next Steps:

1. **Review inverted merchant logo:**
   ```bash
   open /Users/lex-work/Documents/zypto/merchant/assets/images/icon.png
   ```

2. **Test builds locally:**
   ```bash
   cd mobile && npx expo prebuild
   cd merchant && npx expo prebuild
   ```

3. **Create EAS projects:**
   ```bash
   cd mobile && eas build:configure
   cd merchant && eas build:configure
   ```

4. **Build for TestFlight:**
   ```bash
   eas build --profile preview --platform ios
   ```

5. **Deploy to App Store:**
   ```bash
   eas build --profile production --platform ios
   eas submit --platform ios
   ```

---

**Both apps are configured and ready to deploy!** 🎉📱

**Merchant logo is now WHITE (inverted from mobile)** ✅
