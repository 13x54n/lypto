const express = require('express')
const router = express.Router()
const OtpCode = require('../models/OtpCode')
const User = require('../models/User')
const { sendOtpEmail } = require('../services/mailer')

function generateOtp() {
  // 6-digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString()
}

router.post('/request-otp', async (req, res, next) => {
  try {
    const { email, platform = 'web' } = req.body
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email is required' })
    }

    const code = generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    await OtpCode.create({ email: email.toLowerCase(), code, expiresAt })
    await sendOtpEmail(email, code)

    return res.json({ success: true, message: 'OTP sent' })
  } catch (err) {
    next(err)
  }
})

router.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, code, platform = 'web' } = req.body
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and code are required' })
    }

    const record = await OtpCode.findOne({
      email: email.toLowerCase(),
      code,
      consumed: false,
      expiresAt: { $gt: new Date() },
    })

    if (!record) {
      return res.status(400).json({ success: false, error: 'Invalid or expired code' })
    }

    record.consumed = true
    await record.save()

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      // Create new user
      user = await User.create({
        email: email.toLowerCase(),
        platform,
        lastLogin: new Date(),
        loginCount: 1
      })
    } else {
      // Update existing user
      user.lastLogin = new Date()
      user.loginCount += 1
      user.platform = platform
      await user.save()
    }

    // Issue a simple session token (mock) - in production use JWT & cookies
    const token = `mock-jwt-token-${user.userId}`

    return res.json({ 
      success: true, 
      data: { 
        token,
        user: {
          userId: user.userId,
          email: user.email,
          platform: user.platform,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount
        }
      } 
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router


