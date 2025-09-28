const mongoose = require('mongoose')

const sectionCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true
  },
  description: {
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
  }
}, {
  timestamps: true
})

// Index for better performance
sectionCardSchema.index({ title: 1 }, { unique: true })

// Virtual for trend direction
sectionCardSchema.virtual('trendDirection').get(function() {
  return this.trend >= 0 ? 'up' : 'down'
})

module.exports = mongoose.model('SectionCard', sectionCardSchema)
