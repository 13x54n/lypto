#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔧 Zypto Backend Setup')
console.log('=====================\n')

// Check if .env exists
const envPath = path.join(process.cwd(), '.env')
const envExists = fs.existsSync(envPath)

if (envExists) {
  console.log('✅ .env file already exists')
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
  console.log('❌ .env file not found')
  console.log('📝 Creating .env file from template...')
  
  const template = `# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zypto?retryWrites=true&w=majority
DB_NAME=zypto

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
`

  fs.writeFileSync(envPath, template)
  console.log('✅ .env file created')
}

console.log('\n🚀 Next Steps:')
console.log('1. Update MONGODB_URI in .env with your MongoDB connection string')
console.log('2. Run: npm run dev (to start development server)')
console.log('3. Run: npm run seed (to seed database with sample data)')
console.log('4. Test: curl http://localhost:3001/health')

console.log('\n📖 For detailed setup instructions, see:')
console.log('   - README.md')
