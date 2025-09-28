#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Zypto Project Setup')
console.log('=====================\n')

// Check if we're in the right directory
if (!fs.existsSync('package.json') || !fs.existsSync('backend')) {
  console.error('❌ Please run this script from the project root directory')
  process.exit(1)
}

console.log('📦 Installing frontend dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Frontend dependencies installed')
} catch (error) {
  console.error('❌ Failed to install frontend dependencies:', error.message)
  process.exit(1)
}

console.log('\n📦 Installing backend dependencies...')
try {
  execSync('cd backend && npm install', { stdio: 'inherit' })
  console.log('✅ Backend dependencies installed')
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error.message)
  process.exit(1)
}

console.log('\n🔧 Setting up backend environment...')
try {
  execSync('cd backend && npm run setup', { stdio: 'inherit' })
  console.log('✅ Backend environment configured')
} catch (error) {
  console.error('❌ Failed to setup backend environment:', error.message)
  process.exit(1)
}

console.log('\n🎉 Setup completed successfully!')
console.log('\n📋 Next Steps:')
console.log('1. Update MONGODB_URI in backend/.env with your MongoDB connection string')
console.log('2. Start backend: cd backend && npm run dev')
console.log('3. Start frontend: npm run dev')
console.log('4. Seed database: cd backend && npm run seed')

console.log('\n🌐 URLs:')
console.log('   Frontend: http://localhost:3000')
console.log('   Backend:  http://localhost:3001')
console.log('   Health:   http://localhost:3001/health')
