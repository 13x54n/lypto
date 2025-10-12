# 🔧 Environment Configuration Guide

## 📱 Mobile & Merchant Apps

### Development vs Production URLs

**Development (Local):** `http://YOUR_IP:4000`  
**Production (Deployed):** `https://api.lypto.minginc.xyz`

---

## 🛠️ Setup for Development

### 1. Find Your Local IP Address

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 10.0.0.144
```

**Windows:**
```bash
ipconfig
# Look for IPv4 Address
```

### 2. Update Mobile App

Edit `/mobile/app.json`:
```json
{
  "extra": {
    "EXPO_PUBLIC_API_BASE": "http://YOUR_IP:4000"
  }
}
```

**Example:**
```json
{
  "extra": {
    "EXPO_PUBLIC_API_BASE": "http://10.0.0.144:4000"
  }
}
```

### 3. Update Merchant App

Edit `/merchant/app.json`:
```json
{
  "extra": {
    "EXPO_PUBLIC_API_BASE": "http://YOUR_IP:4000"
  }
}
```

**Same IP as mobile app!**

---

## 🚀 Production Builds

### EAS Build Profiles

Both apps use `eas.json` for production configuration:

**Preview Builds (TestFlight):**
```json
{
  "preview": {
    "env": {
      "EXPO_PUBLIC_API_BASE": "https://api.lypto.minginc.xyz"
    }
  }
}
```

**Production Builds (App Store):**
```json
{
  "production": {
    "env": {
      "EXPO_PUBLIC_API_BASE": "https://api.lypto.minginc.xyz"
    }
  }
}
```

---

## 🔄 How Environment Variables Work

### In Code:

**Mobile & Merchant `/constants/api.ts`:**
```typescript
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000';
```

### Priority Order:
1. **EAS Build** → Uses `eas.json` env (production/preview)
2. **Expo Start** → Uses `app.json` extra (development)
3. **Fallback** → Uses `http://localhost:4000`

---

## 📊 Environment Matrix

| Scenario | API URL | Configuration |
|----------|---------|---------------|
| **Local dev (Expo Go)** | `http://10.0.0.144:4000` | `app.json` → `extra.EXPO_PUBLIC_API_BASE` |
| **Dev build** | `http://10.0.0.144:4000` | `app.json` → `extra.EXPO_PUBLIC_API_BASE` |
| **TestFlight** | `https://api.lypto.minginc.xyz` | `eas.json` → `preview.env` |
| **App Store** | `https://api.lypto.minginc.xyz` | `eas.json` → `production.env` |

---

## 🧪 Testing Different Environments

### Test with Development URL:
```bash
cd mobile
npm start
# Uses app.json extra: http://10.0.0.144:4000
```

### Test with Production URL:
```bash
cd mobile

# Temporarily override for testing
EXPO_PUBLIC_API_BASE=https://api.lypto.minginc.xyz npm start
```

### Build with Production URL:
```bash
cd mobile
eas build --profile production --platform ios
# Uses eas.json env: https://api.lypto.minginc.xyz
```

---

## 🔧 Quick Setup Steps

### For New Developer:

1. **Clone repo**
   ```bash
   git clone <repo>
   cd zypto
   ```

2. **Find your IP**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Note your IP (e.g., 10.0.0.144)
   ```

3. **Update mobile/app.json**
   ```json
   "extra": {
     "EXPO_PUBLIC_API_BASE": "http://YOUR_IP:4000"
   }
   ```

4. **Update merchant/app.json**
   ```json
   "extra": {
     "EXPO_PUBLIC_API_BASE": "http://YOUR_IP:4000"
   }
   ```

5. **Start backend**
   ```bash
   cd backend && npm run dev
   ```

6. **Start apps**
   ```bash
   cd mobile && npm start
   cd merchant && npm start
   ```

---

## 📝 Current Configuration

### Mobile App (`app.json`):
```json
"extra": {
  "EXPO_PUBLIC_API_BASE": "http://10.0.0.144:4000"  // ← Your local IP
}
```

### Merchant App (`app.json`):
```json
"extra": {
  "EXPO_PUBLIC_API_BASE": "http://10.0.0.144:4000"  // ← Same IP
}
```

### Mobile EAS (`eas.json`):
```json
"development": {
  // No env override - uses app.json
},
"preview": {
  "env": {
    "EXPO_PUBLIC_API_BASE": "https://api.lypto.minginc.xyz"
  }
},
"production": {
  "env": {
    "EXPO_PUBLIC_API_BASE": "https://api.lypto.minginc.xyz"
  }
}
```

### Merchant EAS (`eas.json`):
```json
// Same configuration as mobile
```

---

## ✅ Verification

### Check Your Current Setup:

**Mobile:**
```bash
cd mobile
grep -A 2 "EXPO_PUBLIC_API_BASE" app.json
# Should show: "http://10.0.0.144:4000"
```

**Merchant:**
```bash
cd merchant
grep -A 2 "EXPO_PUBLIC_API_BASE" app.json
# Should show: "http://10.0.0.144:4000"
```

**Production API (Live):**
```bash
curl https://api.lypto.minginc.xyz/health
# Should return: {"ok":true}
```

---

## 🎯 Perfect Setup!

✅ **Development:** Uses `app.json` → Your local IP  
✅ **Production:** Uses `eas.json` → Production API  
✅ **No hardcoded values** → All in config files  
✅ **Easy to change** → Just edit app.json  
✅ **Production ready** → API already live  

**You can develop locally and deploy to production without any code changes!** 🚀
