# NFC Setup for Apple Wallet Passes

This document explains how the NFC feature works in your Lypto wallet passes and how to use it.

## What is NFC in Wallet Passes?

NFC (Near Field Communication) allows your digital wallet pass to share information when tapped against an NFC-enabled device. This is similar to how contactless payments work.

## How It Works

### 1. **NFC Message Structure**
When a user taps their Lypto pass on an NFC reader, it broadcasts a message:
```
lypto://user/{userId}
```

For example:
- User email: `john@example.com`
- Generated userId: `john_at_example_com`
- NFC message: `lypto://user/john_at_example_com`

### 2. **Receiving Device Requirements**
To read the NFC data from a Lypto pass, the receiving device needs:
- NFC reader capability (most modern smartphones have this)
- An app that can handle the `lypto://` URL scheme
- Or a web service that processes the NFC data

### 3. **Use Cases**

#### **At Point of Sale (POS)**
1. Customer taps Lypto pass on merchant's NFC reader
2. Reader receives: `lypto://user/john_at_example_com`
3. Merchant system looks up user and applies loyalty points
4. Transaction is recorded

#### **For User Identification**
1. User taps pass at entry point (event, venue, etc.)
2. System identifies user via NFC
3. Access granted or information retrieved

#### **Peer-to-Peer Sharing**
1. User taps pass on another user's phone
2. Receiving phone reads NFC data
3. App processes the userId and displays profile/info

## Implementation Guide

### Backend (Already Implemented)

The NFC configuration is in `/backend/routes/wallet.ts`:

```typescript
nfc: {
  message: `lypto://user/${userId}`,
  encryptionPublicKey: undefined, // Optional: Add for encrypted NFC
}
```

### Creating an NFC Reader App

To create an app that reads Lypto passes:

#### iOS (Swift)
```swift
import CoreNFC

class NFCReader: NSObject, NFCNDEFReaderSessionDelegate {
    func startNFCSession() {
        let session = NFCNDEFReaderSession(
            delegate: self,
            queue: nil,
            invalidateAfterFirstRead: false
        )
        session.begin()
    }
    
    func readerSession(_ session: NFCNDEFReaderSession, 
                      didDetectNDEFs messages: [NFCNDEFMessage]) {
        for message in messages {
            for record in message.records {
                if let url = record.wellKnownTypeURIPayload() {
                    // url will be: lypto://user/{userId}
                    handleLyptoURL(url)
                }
            }
        }
    }
}
```

#### Android (Kotlin)
```kotlin
class NFCActivity : AppCompatActivity() {
    private var nfcAdapter: NfcAdapter? = null
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
    }
    
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        if (NfcAdapter.ACTION_NDEF_DISCOVERED == intent.action) {
            val rawMessages = intent.getParcelableArrayExtra(
                NfcAdapter.EXTRA_NDEF_MESSAGES
            )
            // Parse and handle lypto://user/{userId}
        }
    }
}
```

### Web Service Integration

Create an endpoint to handle NFC redirects:

```typescript
// Example endpoint
app.get('/nfc/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  // Look up user
  const user = await getUserByUserId(userId);
  
  if (user) {
    // Award points, log visit, etc.
    await awardPoints(user, 10);
    res.json({ success: true, points: user.points });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});
```

## Security Considerations

### 1. **URL Scheme Security**
- The `lypto://` URL scheme is public and can be read by any NFC reader
- Don't include sensitive data in the NFC message
- Use userId as a reference, not personal data

### 2. **Encryption (Optional)**
For enhanced security, you can encrypt the NFC payload:

```typescript
nfc: {
  message: `lypto://user/${encryptedUserId}`,
  encryptionPublicKey: "YOUR_PUBLIC_KEY_HERE"
}
```

Then decrypt on the receiving end before processing.

### 3. **Server-Side Validation**
Always validate the userId on your backend:
- Check if userId exists in database
- Verify user is active/not suspended
- Rate limit to prevent abuse

## Testing NFC

### Using iPhone
1. Add pass to Apple Wallet
2. Hold phone near NFC reader
3. Pass will automatically activate when in range
4. No need to open Wallet app

### Using Android
1. Add pass to Google Wallet (when implemented)
2. Hold phone near NFC reader
3. Wallet will prompt or auto-share

### Testing Without Hardware
1. Use NFC Tools app (iOS/Android)
2. Simulate NFC tags
3. Test URL handling

## Current Implementation Status

✅ **Completed:**
- NFC message generation in backend
- Pass includes NFC payload
- User ID embedded in NFC message
- Pass generation with certificates

🔄 **Next Steps:**
1. Add certificates to `/backend/certificates/`
2. Add pass assets (icons, logos) to `/backend/assets/pass/`
3. Create NFC reader app/service
4. Set up URL scheme handler (lypto://)
5. Implement backend endpoints to process NFC data

## Troubleshooting

### Pass doesn't show NFC icon
- Ensure iOS 13+ or Android with NFC
- Check that `nfc` field is in pass.json
- Verify pass is properly signed

### NFC not being read
- Ensure NFC is enabled on device
- Check reader is configured for NDEF format
- Verify URL scheme is registered

### Security warning when tapping
- Normal for custom URL schemes
- Consider using Universal Links (https://)
- Add proper entitlements to your app

## Resources

- [Apple Wallet Developer Guide](https://developer.apple.com/wallet/)
- [PassKit NFC Documentation](https://developer.apple.com/documentation/passkit/wallet/adding_nfc_to_wallet_passes)
- [Core NFC Framework](https://developer.apple.com/documentation/corenfc)
- [Google Wallet NFC](https://developers.google.com/wallet/tickets/loyalty-cards/nfc)

