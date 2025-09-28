# Quick Setup Guide for Cloud MongoDB

## 🚀 Quick Start

### 1. Set Your MongoDB Connection String

Create a `.env.local` file in your project root:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/zypto?retryWrites=true&w=majority
DB_NAME=zypto
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Test Your Connection

```bash
npm run test-db
```

### 3. Initialize Your Database

```bash
npm run init-db
```

### 4. Start Development Server

```bash
npm run dev
```

## 🔧 Configuration Details

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Add your IP to the whitelist
5. Create a database user

### Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## ✅ Verification

After setup, you should see:
- ✅ MongoDB connection successful!
- ✅ Database accessible
- ✅ Collections created
- ✅ Data seeded

## 🆘 Troubleshooting

**Connection Failed?**
- Check your connection string
- Verify username/password
- Check IP whitelist in MongoDB Atlas
- Ensure network access is enabled

**Need Help?**
- Check `MONGODB_CLOUD_SETUP.md` for detailed instructions
- Run `npm run test-db` to diagnose connection issues
