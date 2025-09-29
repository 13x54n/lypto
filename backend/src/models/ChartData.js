const mongoose = require('mongoose')

const chartDataSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  desktop: {
    type: Number,
    required: true,
    min: 0
  },
  mobile: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
})

// Index for better performance
chartDataSchema.index({ month: 1 }, { unique: true })

// Virtual for total
chartDataSchema.virtual('total').get(function() {
  return this.desktop + this.mobile
})

module.exports = mongoose.model('ChartData', chartDataSchema)
