require('dotenv').config()
const mongoose = require('mongoose')
const { seedDatabase } = require('../utils/seedData')

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    })
    console.log('📊 Connected to MongoDB')

    // Seed the database
    await seedDatabase()

    // Close connection
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
