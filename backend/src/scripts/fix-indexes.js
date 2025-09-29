require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');

async function fixIndexes() {
  try {
    console.log('🔧 Fixing database indexes...');
    
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    const DB_NAME = process.env.DB_NAME || 'zypto';

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('📊 Connected to MongoDB');

    // Drop the sectioncards collection to remove old indexes
    await mongoose.connection.db.collection('sectioncards').drop().catch(() => {
      console.log('Collection sectioncards does not exist or already dropped');
    });
    console.log('🗑️  Dropped sectioncards collection');

    // Drop the payments collection to remove old indexes
    await mongoose.connection.db.collection('payments').drop().catch(() => {
      console.log('Collection payments does not exist or already dropped');
    });
    console.log('🗑️  Dropped payments collection');

    console.log('✅ Database indexes fixed successfully');
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

fixIndexes();
