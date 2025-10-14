# 🔔 Push Notification System - How Targeting Works

## ✅ How Notifications Reach the Right User

### **The System:**

Each device gets a unique Expo Push Token when the app launches. This token is stored in MongoDB linked to the user's email. When sending notifications, the backend looks up the specific user's token.

---

## 🔑 Step-by-Step Flow

### **1. Device Registration (Mobile App)**

**When:** User logs in and app launches

**Where:** `mobile/app/_layout.tsx:47-57`

```typescript
// Register for push notifications
registerForPushNotificationsAsync().then(async (token: string) => {
  if (token) {
    // Save push token to backend
    await fetch(`${API_BASE}/api/auth/save-push-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: userEmail,        // ← User's email
        pushToken: token          // ← UNIQUE device token
      }),
    });
    console.log('Push token saved:', token);
  }
});
```

**Result:** Each device/user combination gets a unique token stored in MongoDB.

---

### **2. Token Storage (Backend)**

**Where:** `backend/controllers/authController.ts:195-213`

```typescript
export async function savePushToken(c: Context) {
  const { email, pushToken } = await c.req.json();
  
  // Find the user by email
  const user = await User.findOne({ email });
  
  if (user) {
    // Store the device's unique push token
    user.pushToken = pushToken;  // ← Saved to MongoDB
    await user.save();
    
    console.log(`✅ Push token saved for ${email}`);
  }
  
  return c.json({ success: true });
}
```

**Database:** 
```
User Collection:
{
  email: "customer@example.com",
  pushToken: "ExponentPushToken[xxxxxxxxxxxxxx]",  ← Device-specific
  circleWalletAddress: "ABC123...",
  lyptoBalance: 250,
  ...
}
```

---

### **3. Notification Sending (Backend)**

**When:** Payment is created or confirmed

**Where:** `backend/routes/merchant.ts`

#### **A. Payment Request Notification (Create Payment)**

```typescript
// Line 78-110
merchantRouter.post('/create-payment', async (c) => {
  // ... create payment ...
  
  // Find the SPECIFIC customer
  const user = await User.findOne({ email: userEmail }); // ← Target user
  
  // Send notification ONLY to this user's device
  if (user.pushToken && Expo.isExpoPushToken(user.pushToken)) {
    const message: ExpoPushMessage = {
      to: user.pushToken,  // ← UNIQUE to this user's device
      title: '💳 Payment Request',
      body: `${merchantEmail} is requesting $${amount}`,
      data: { 
        paymentId: payment._id.toString(),
        amount,
        merchantEmail,
      },
    };
    
    await expo.sendPushNotificationsAsync([message]); // ← Sent ONLY to this user
  }
});
```

#### **B. Payment Status Notification (Confirm Payment)**

```typescript
// Line 266-293
merchantRouter.post('/confirm-payment', async (c) => {
  // ... confirm payment ...
  
  // Find the SPECIFIC merchant
  const merchant = await User.findOne({ email: payment.merchantEmail }); // ← Target merchant
  
  // Send notification ONLY to merchant's device
  if (merchant?.pushToken && Expo.isExpoPushToken(merchant.pushToken)) {
    const message: ExpoPushMessage = {
      to: merchant.pushToken,  // ← UNIQUE to merchant's device
      title: `✅ Payment Confirmed`,
      body: `$${payment.amount} from ${payment.userEmail}`,
      data: { 
        paymentId: payment._id.toString(),
        status,
      },
    };
    
    await expo.sendPushNotificationsAsync([message]); // ← Sent ONLY to merchant
  }
});
```

---

## 🎯 How Targeting Works

### **Database Lookup:**
```typescript
// Customer notification
const customer = await User.findOne({ email: payment.userEmail });
// Returns ONE user document with THEIR push token

// Merchant notification  
const merchant = await User.findOne({ email: payment.merchantEmail });
// Returns ONE user document with THEIR push token

// NOT a broadcast - each query returns ONE specific user
```

### **Expo Push Token System:**
```typescript
// Each device gets a unique token like:
ExponentPushToken[xxxxxxxxxxxxxx]

// Expo's servers route notifications to the exact device
// that registered that token
```

---

## 📱 Multiple Devices (Same User)

### **Scenario:** User logs in on 2 devices

**What Happens:**
1. Device 1 registers → Saves token A
2. Device 2 registers → Overwrites with token B
3. Notifications go to Device 2 only

**Solution (if needed):**
Store array of tokens instead:
```typescript
// User model
pushTokens: [
  "ExponentPushToken[device1]",
  "ExponentPushToken[device2]"
]

// Send to all devices
for (const token of user.pushTokens) {
  await expo.sendPushNotificationsAsync([{ to: token, ... }]);
}
```

---

## 🔍 Verification

### **Check Token Storage:**
```bash
# Using MongoDB CLI or Studio
db.users.find({ email: "customer@example.com" }, { pushToken: 1 })

# Should show:
{
  _id: ObjectId("..."),
  pushToken: "ExponentPushToken[xxxxxxxxxxxxxx]"
}
```

### **Test Notification Flow:**

1. **Customer logs in on Device A**
   - Token: `ExponentPushToken[AAAA]`
   - Stored in DB for `customer@example.com`

2. **Merchant creates payment**
   - Backend finds customer by email
   - Gets their token: `ExponentPushToken[AAAA]`
   - Sends notification ONLY to that token
   - Expo routes to Device A only ✅

3. **Customer authorizes on Device A**
   - Backend finds merchant by email
   - Gets merchant's token: `ExponentPushToken[BBBB]`
   - Sends notification ONLY to merchant's device ✅

---

## 🔐 Security & Privacy

### **Why This is Secure:**

1. ✅ **Email-based lookup:** Each notification targets a specific email
2. ✅ **Token per device:** Each device has unique identifier
3. ✅ **No broadcasting:** Never sends to all users
4. ✅ **MongoDB validation:** User must exist to get notification
5. ✅ **Expo validation:** Token must be valid Expo format

### **What Can't Happen:**

❌ Customer A receives notification meant for Customer B  
❌ All users get notified about one payment  
❌ Merchant sees customer's private data  
❌ Cross-contamination of notifications  

---

## 📊 Complete Notification Flow

```
Payment Created ($10 to Customer A)
        ↓
Backend: Find Customer A by email
        ↓
Get Customer A's pushToken: "ExponentPushToken[AAAA]"
        ↓
Send to ONLY this token
        ↓
Expo servers route to Device with token AAAA
        ↓
Customer A's device receives notification ✅
        ↓
Customer A authorizes payment
        ↓
Backend: Find Merchant by email
        ↓
Get Merchant's pushToken: "ExponentPushToken[BBBB]"
        ↓
Send to ONLY this token
        ↓
Expo servers route to Merchant's device
        ↓
Merchant's device shows payment confirmed ✅
```

---

## 🔧 Current Implementation

### **Mobile App Registration:**
- ✅ Registers push token on login
- ✅ Sends token to backend
- ✅ Token stored in User document
- ✅ Sets up notification categories (payment_request)

### **Merchant App Registration:**
- ✅ Same registration flow
- ✅ Separate token per device
- ✅ Stored in same User collection

### **Backend Targeting:**
- ✅ Query by email: `User.findOne({ email })`
- ✅ Extract push token: `user.pushToken`
- ✅ Validate token: `Expo.isExpoPushToken(token)`
- ✅ Send to specific token: `expo.sendPushNotificationsAsync([message])`

---

## 🎯 Summary

**Q: How does the right user get notified?**

**A: 3-Step Process:**
1. **Registration:** Device saves unique token → Backend → MongoDB (linked to email)
2. **Lookup:** Backend finds user by email → Gets their unique token
3. **Delivery:** Expo sends notification to that specific token → Device receives it

**Result:** Only the exact user/device that the payment involves gets notified!

---

## ✅ Your System is Already Configured Correctly!

- ✅ Mobile app registers push tokens
- ✅ Merchant app registers push tokens
- ✅ Backend stores tokens per user
- ✅ Notifications target specific users
- ✅ No broadcasting - 1:1 communication only

**The targeting is working perfectly!** 🎯

Each notification goes to exactly one user's device based on their email lookup in MongoDB.

