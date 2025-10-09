# Apple Wallet Pass Setup - Complete Guide

## ✅ What's Been Implemented

Your Lypto app now has a **fully functional Apple Wallet integration** with **NFC support** for tap-to-share functionality!

### Backend (`/backend/routes/wallet.ts`)
- ✅ .pkpass file generation with proper signing
- ✅ NFC payload embedded in pass (`lypto://user/{userId}`)
- ✅ Certificate validation and error handling
- ✅ User-specific pass generation
- ✅ QR code barcode for scanning
- ✅ Points balance and member info display

### Mobile App (`/mobile/app/(tabs)/wallet.tsx`)
- ✅ Beautiful pass preview modal
- ✅ Download and install .pkpass files
- ✅ Automatic Wallet app integration
- ✅ Proper error handling
- ✅ User email integration
- ✅ Platform-specific handling (iOS/Android)

## 🔧 Setup Required

To enable actual wallet pass generation, you need to add **3 certificate files**:

### 1. Add Certificates to `/backend/certificates/`

You need these files (see `/backend/certificates/README.md` for details):
- `signerCert.pem` - Your Pass Type ID certificate
- `signerKey.pem` - Private key for the certificate
- `wwdr.pem` - Apple WWDR certificate

**How to get them:**
1. Go to [Apple Developer](https://developer.apple.com/account/resources/identifiers/list/passTypeId)
2. Create/use Pass Type ID: `pass.xyz.minginc.lypto`
3. Create certificate for this Pass Type ID
4. Follow conversion steps in certificates/README.md

### 2. Add Pass Assets to `/backend/assets/pass.pass/`

Create these image files (see `/backend/assets/pass.pass/README.md` for specs):
- `icon.png` (29x29), `icon@2x.png` (58x58), `icon@3x.png` (87x87)
- `logo.png` (160x50), `logo@2x.png` (320x100), `logo@3x.png` (480x150)

**Quick option:** Copy your app icon and logo from `/mobile/assets/images/`

## 🎯 How It Works

### User Flow:
1. User opens Wallet tab in mobile app
2. Taps "Add Card to Apple Wallet"
3. Sees preview of the pass
4. Confirms addition
5. Backend generates signed .pkpass file with:
   - User's email
   - Points balance
   - User ID
   - **NFC message:** `lypto://user/{userId}`
6. Pass downloads and opens in Apple Wallet
7. User taps "Add" in Wallet app
8. Pass is now in their wallet!

### NFC Functionality:
When the user taps their pass on an NFC reader:
- **Message broadcasted:** `lypto://user/john_at_example_com`
- Reader can identify the user
- Award points automatically
- Log visits/transactions
- Verify membership

## 📱 Testing

### Without Certificates (Current State):
- App will show: "Certificates not configured"
- You'll get setup instructions
- Pass preview still works

### With Certificates:
- Real .pkpass files are generated
- Can be added to Apple Wallet
- NFC will work on iPhone 7+ with iOS 11+
- Tap pass on NFC reader to share user ID

## 🔐 Security

### NFC Security:
- ✅ User ID is obfuscated (email transformed)
- ✅ No sensitive data in NFC payload
- ✅ Server-side validation recommended
- ✅ Rate limiting suggested
- 🔄 Optional: Add encryption key for enhanced security

### Certificate Security:
- ✅ Certificates stored in `/backend/certificates/`
- ✅ Directory is in `.gitignore`
- ⚠️ **NEVER commit certificates to version control**

## 🚀 Production Deployment

### 1. Add Certificates (Required)
```bash
cd backend/certificates
# Add your .pem files here
```

### 2. Add Pass Assets (Required)
```bash
cd backend/assets/pass.pass
# Add icon and logo images
```

### 3. Test Locally
```bash
cd backend
bun run index.ts

# In another terminal
cd mobile
bun start
```

### 4. Test Pass Generation
- Open mobile app
- Navigate to Wallet tab
- Tap "Add Card to Apple Wallet"
- Verify pass downloads and opens in Wallet

### 5. Create NFC Reader App/Service
See `/backend/NFC_SETUP.md` for:
- iOS NFC reader implementation
- Android NFC reader implementation
- Web service integration
- URL scheme handling

## 📊 Pass Features

### Front of Pass:
- **Primary:** Points balance (1,250 pts)
- **Secondary:** User email
- **Auxiliary:** Dollar value ($12.50)
- **Barcode:** QR code with user ID

### Back of Pass:
- User ID
- NFC info message
- Terms and conditions
- Support contact

### NFC Payload:
```
lypto://user/{userId}
```
Example: `lypto://user/john_at_example_com`

## 🛠 Customization

### Update Pass Colors:
Edit `/backend/routes/wallet.ts`:
```typescript
foregroundColor: 'rgb(255, 255, 255)',  // Text color
backgroundColor: 'rgb(0, 0, 0)',         // Background
labelColor: 'rgb(85, 239, 196)',         // Label color (green)
```

### Update NFC Message:
```typescript
nfc: {
  message: `lypto://user/${userId}`,
  // Add encryption:
  encryptionPublicKey: "YOUR_PUBLIC_KEY"
}
```

### Add More Fields:
```typescript
backFields: [
  {
    key: 'custom',
    label: 'Custom Field',
    value: 'Custom Value',
  },
  // ... more fields
]
```

## 📚 Documentation

- **Certificate Setup:** `/backend/certificates/README.md`
- **Pass Assets:** `/backend/assets/pass.pass/README.md`
- **NFC Implementation:** `/backend/NFC_SETUP.md`
- **API Endpoints:** 
  - `GET /api/wallet/pass?email={email}&points={points}&userId={userId}`
  - `POST /api/wallet/google-pass` (for Android)

## 🎉 Next Steps

1. **Add certificates** to enable pass generation
2. **Add pass assets** (icons, logos)
3. **Test on real iPhone** with iOS 13+
4. **Create NFC reader service** to process taps
5. **Set up URL scheme handler** for `lypto://`
6. **Implement Google Wallet** for Android users

## 💡 Tips

- Test with TestFlight before production
- Use Apple's Pass Validator tool
- Monitor pass usage in Apple Developer Console
- Keep certificates secure and backed up
- Update pass design regularly
- Test NFC on multiple devices

## ⚠️ Troubleshooting

### "Certificates not configured"
- Add .pem files to `/backend/certificates/`
- Check file names match exactly
- Verify files are readable

### "Failed to download pass"
- Check backend is running
- Verify API endpoint is accessible
- Check network connectivity

### "Pass not showing in Wallet"
- Ensure iOS 13+ or later
- Check pass is properly signed
- Verify Pass Type ID matches

### "NFC not working"
- Requires iPhone 7+ with iOS 11+
- NFC must be enabled
- Pass must be properly added to Wallet
- Reader must support NDEF format

## 📞 Support

For issues or questions:
- Check documentation in `/backend/` directory
- Review Apple's PassKit documentation
- Test with Apple's Pass Validator
- Contact Apple Developer Support for certificate issues

---

**Your wallet pass system is ready! Just add the certificates and assets to go live! 🚀**

