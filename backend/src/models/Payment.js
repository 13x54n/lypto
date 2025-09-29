const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  paymentType: {
    type: String,
    required: true,
    enum: ['subscription', 'one-time']
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  subscriptionId: {
    type: String,
    required: function() {
      return this.paymentType === 'subscription'
    }
  },
  planName: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

// Indexes for better performance
paymentSchema.index({ id: 1 }, { unique: true })
paymentSchema.index({ paymentType: 1 })
paymentSchema.index({ date: -1 })
paymentSchema.index({ userName: 1 })
paymentSchema.index({ subscriptionId: 1 }, { sparse: true })

// Virtual for formatted price
paymentSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`
})

// Static method to get next ID
paymentSchema.statics.getNextId = async function() {
  const lastPayment = await this.findOne({}).sort({ id: -1 })
  return lastPayment ? lastPayment.id + 1 : 1
}

// Instance method to check if it's a refund
paymentSchema.methods.isRefund = function() {
  return this.price <= 0
}

module.exports = mongoose.model('Payment', paymentSchema)
