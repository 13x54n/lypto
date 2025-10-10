# 🏪 Lypto Merchant App

Mobile app for merchants to scan customer passes, create payment requests, and manage transactions.

## ✨ Features

### 🎯 Core Functionality
- **QR Code Scanner** - Scan customer Lypto passes with camera
- **Payment Requests** - Create payment requests with custom amounts
- **Push Notifications** - Send payment confirmations to customers (future)
- **Transaction History** - View all transactions with status
- **Dashboard Stats** - Today/Week/Month transaction statistics
- **Email OTP Authentication** - Secure merchant login

### 📱 Screens

1. **Scanner (Home)**
   - Camera view with QR code scanning
   - Flash toggle
   - Amount input modal
   - Create payment requests

2. **History**
   - Transaction list with status (pending/confirmed/declined)
   - Daily/weekly/monthly stats
   - Pull to refresh
   - Empty state

3. **Settings**
   - Merchant profile
   - Logout functionality
   - Account settings

4. **Auth**
   - Email OTP login
   - Same authentication as customer app

## 🚀 Getting Started

### Prerequisites
```bash
# Install dependencies
cd merchant
npm install
```

### Run the App
```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🔌 API Integration

### Base URL
```typescript
const API_BASE = 'http://localhost:4000';
```

### Endpoints

#### Authentication
```typescript
POST /api/auth/request-otp
POST /api/auth/verify-otp
```

#### Merchant Operations
```typescript
// Create payment request
POST /api/merchant/create-payment
Body: {
  userId: string,
  userEmail: string,
  amount: number,
  merchantEmail: string
}

// Get transactions
GET /api/merchant/transactions?merchantEmail={email}

// Get stats
GET /api/merchant/stats?merchantEmail={email}

// Confirm payment (called by customer app)
POST /api/merchant/confirm-payment
Body: {
  paymentId: string,
  status: 'confirmed' | 'declined'
}
```

## 📊 Data Flow

### Payment Request Flow

```
1. Merchant scans customer QR code
   ↓
2. QR code parsed: LYPTO:userId:points
   ↓
3. Merchant enters payment amount
   ↓
4. POST /api/merchant/create-payment
   ↓
5. Payment request created (pending)
   ↓
6. Push notification sent to customer
   ↓
7. Customer confirms/declines in mobile app
   ↓
8. POST /api/merchant/confirm-payment
   ↓
9. Transaction status updated
   ↓
10. Both apps updated
```

## 🎨 Design System

### Colors
```typescript
const colors = {
  primary: '#55efc4',      // Mint green
  background: '#000',      // Black
  surface: '#111',         // Dark gray
  text: '#fff',            // White
  textSecondary: '#999',   // Gray
  error: '#ff6b6b',        // Red
};
```

### Components
- Modal with slide animation
- Camera overlay with corner indicators
- Transaction cards with status badges
- Stat cards with icons

## 📁 Project Structure

```
merchant/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Scanner screen
│   │   ├── history.tsx        # Transaction history
│   │   ├── settings.tsx       # Settings
│   │   └── _layout.tsx        # Tab navigation
│   ├── auth/
│   │   ├── login.tsx          # Email login
│   │   └── otp.tsx            # OTP verification
│   └── _layout.tsx            # Root layout with auth
├── contexts/
│   └── AuthContext.tsx        # Authentication state
├── constants/
│   └── api.ts                 # API endpoints
├── assets/                    # Images and icons
├── app.json                   # Expo configuration
└── package.json
```

## 🔒 Authentication

Uses the same email OTP system as the customer app:
1. Merchant enters email
2. OTP sent to email
3. Merchant enters 6-digit code
4. Token stored in AsyncStorage
5. Protected routes require authentication

## 📸 Camera Permissions

### iOS
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan customer QR codes</string>
```

### Android
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

## 🧪 Testing

### Test Flow
1. Start backend: `cd backend && npm run dev`
2. Start merchant app: `cd merchant && npm start`
3. Login with test merchant email
4. Scan customer pass QR code
5. Enter payment amount
6. Create payment request
7. View in history

### Test Data
```typescript
// Customer QR code format
"LYPTO:userId:points"
// Example: "LYPTO:test_at_example_com:1250"

// Test merchant email
"merchant@test.com"
```

## 🚧 Future Enhancements

- [ ] Real push notifications (Expo Notifications)
- [ ] Real-time payment confirmations (WebSocket)
- [ ] Transaction filters and search
- [ ] Export transactions
- [ ] Multiple merchant locations
- [ ] Customer lookup
- [ ] Offline mode
- [ ] Receipt printing

## 🔗 Related Apps

- **Mobile App** (`/mobile`) - Customer-facing app
- **Backend** (`/backend`) - API server
- **Web** (`/app`) - Web dashboard

## 📝 Notes

- Currently uses in-memory storage (replace with database)
- Push notifications are placeholder (implement with Expo Notifications)
- Transaction data is shared with backend
- Uses same auth system as customer app

## 🛠 Tech Stack

- **Framework**: React Native + Expo
- **Router**: Expo Router
- **Camera**: expo-camera
- **Storage**: AsyncStorage
- **HTTP**: Fetch API
- **Notifications**: expo-notifications (planned)
- **State**: React Context API

---

Built with ❤️ for Lypto merchants

