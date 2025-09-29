const mongoose = require('mongoose')

const OtpCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  consumed: { type: Boolean, default: false },
}, { timestamps: true })

// TTL index for automatic cleanup after expiration
OtpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('OtpCode', OtpCodeSchema)


