// Database initialization script
import { connectToDatabase, MongooseService, closeDatabase } from './mongoose'

export async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    
    // Connect to MongoDB
    await connectToDatabase()
    
    // Seed initial data
    await MongooseService.seedData()
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  } finally {
    // Close connection
    await closeDatabase()
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup complete')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Database setup failed:', error)
      process.exit(1)
    })
}
