#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔧 Zypto Dashboard Environment Setup')
console.log('=====================================\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExists = fs.existsSync(envPath)

if (envExists) {
  console.log('✅ .env.local file already exists')
  console.log('📝 Current configuration:')
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')
  
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=')
      if (key === 'MONGODB_URI') {
        console.log(`   ${key}: ${line.includes('mongodb+srv://') ? 'Set (Cloud)' : 'Set (Local)'}`)
      } else {
        console.log(`   ${key}: Set`)
      }
    }
  })
} else {
  console.log('❌ .env.local file not found')
  console.log('📝 Creating .env.local template...')
  
  const template = `# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zypto?retryWrites=true&w=majority

# Database Name
DB_NAME=zypto

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentication (for production)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
`

  fs.writeFileSync(envPath, template)
  console.log('✅ .env.local template created')
}

console.log('\n🚀 Next Steps:')
console.log('1. Update MONGODB_URI in .env.local with your MongoDB connection string')
console.log('2. Run: npm run test-db (to test connection)')
console.log('3. Run: npm run init-db (to initialize database)')
console.log('4. Run: npm run dev (to start development server)')

console.log('\n📖 For detailed setup instructions, see:')
console.log('   - QUICK_SETUP.md')
console.log('   - MONGODB_CLOUD_SETUP.md (if using cloud MongoDB)')
