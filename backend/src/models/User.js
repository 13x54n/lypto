const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    index: true 
  },
  userId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  },
  loginCount: { 
    type: Number, 
    default: 1 
  },
  platform: { 
    type: String, 
    enum: ['web', 'mobile'], 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
})

// Generate unique userId
UserSchema.pre('save', async function(next) {
  if (this.isNew && !this.userId) {
    this.userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  next()
})

module.exports = mongoose.model('User', UserSchema)
