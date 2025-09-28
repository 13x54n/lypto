// Test MongoDB connection script
import { connectToDatabase, closeDatabase } from './mongoose'

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...')
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set')
    
    await connectToDatabase()
    console.log('✅ MongoDB connection successful!')
    
    // Test a simple query
    const { MongooseService } = await import('./mongoose')
    const payments = await MongooseService.getPayments()
    console.log(`✅ Database accessible. Found ${payments.length} payments.`)
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:')
    console.error(error)
    process.exit(1)
  } finally {
    await closeDatabase()
    console.log('Connection closed.')
  }
}

// Run if this file is executed directly
if (require.main === module) {
  testConnection()
}
