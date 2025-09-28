const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    }

    await mongoose.connect(mongoURI, options)
    
    console.log('✅ MongoDB connected successfully')
    console.log(`📊 Database: ${mongoose.connection.name}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('🔌 MongoDB connection closed through app termination')
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
