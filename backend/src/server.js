const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const connectDB = require('./config/database')
const errorHandler = require('./middleware/errorHandler')

// Import routes
const paymentRoutes = require('./routes/payments')
const dashboardRoutes = require('./routes/dashboard')
const solanaPaymentsRoutes = require('./routes/solanaPayments')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 3001

// Connect to MongoDB
connectDB()

// Security middleware
app.use(helmet())

// CORS configuration
// Allow mobile apps (which may send no Origin) and web frontend
app.use(cors({
  origin: (origin, callback) => {
    const allowed = new Set([
      process.env.FRONTEND_URL || 'http://localhost:3000',
    ])
    if (!origin) return callback(null, true) // native apps / curl
    if (allowed.has(origin)) return callback(null, true)
    return callback(null, true) // allow others during development
  },
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Compression middleware
app.use(compression())

// Logging middleware
app.use(morgan('combined'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes
app.use('/api/payments', paymentRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/solana-payments', solanaPaymentsRoutes)
app.use('/api/auth', authRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
})

module.exports = app
