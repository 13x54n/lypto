const mongoose = require('mongoose')

const sectionCardSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: String,
    required: true
  },
  
  // Static content - these don't change
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Dynamic values - these are calculated/updated from business data
  value: {
    type: String,
    required: true
  },
  trend: {
    type: Number,
    required: true
  },
  trendLabel: {
    type: String,
    required: true
  },
  
  // Metadata for tracking
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSource: {
    type: String,
    default: 'calculated',
    enum: ['calculated', 'manual', 'api']
  },
  
  // Business data references (optional)
  businessType: {
    type: String,
    enum: ['revenue', 'subscriptions', 'payments', 'refunds', 'custom']
  }
}, {
  timestamps: true
})

// Indexes for better performance
sectionCardSchema.index({ userId: 1, title: 1 }, { unique: true })
sectionCardSchema.index({ userId: 1 })
sectionCardSchema.index({ lastUpdated: -1 })
sectionCardSchema.index({ businessType: 1 })

// Virtual for trend direction
sectionCardSchema.virtual('trendDirection').get(function() {
  return this.trend >= 0 ? 'up' : 'down'
})

// Method to update dynamic values
sectionCardSchema.methods.updateValues = function(newValue, newTrend, newTrendLabel) {
  this.value = newValue
  this.trend = newTrend
  this.trendLabel = newTrendLabel
  this.lastUpdated = new Date()
  this.dataSource = 'calculated'
  return this.save()
}

module.exports = mongoose.model('SectionCard', sectionCardSchema)
