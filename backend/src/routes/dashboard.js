const express = require('express')
const router = express.Router()
const Payment = require('../models/Payment')
const ChartData = require('../models/ChartData')
const SectionCard = require('../models/SectionCard')

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $cond: [{ $gt: ['$price', 0] }, '$price', 0] } },
          totalPayments: { $sum: 1 },
          subscriptionPayments: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$paymentType', 'subscription'] }, { $gt: ['$price', 0] }] },
                1,
                0
              ]
            }
          },
          oneTimePayments: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$paymentType', 'one-time'] }, { $gt: ['$price', 0] }] },
                1,
                0
              ]
            }
          },
          refunds: {
            $sum: {
              $cond: [{ $lte: ['$price', 0] }, 1, 0]
            }
          }
        }
      }
    ])

    const result = stats[0] || {
      totalRevenue: 0,
      totalPayments: 0,
      subscriptionPayments: 0,
      oneTimePayments: 0,
      refunds: 0
    }

    res.json({
      success: true,
      data: {
        totalRevenue: result.totalRevenue || 0,
        totalPayments: result.totalPayments || 0,
        subscriptionPayments: result.subscriptionPayments || 0,
        oneTimePayments: result.oneTimePayments || 0,
        refunds: result.refunds || 0,
        monthlyGrowth: 24.5 // Placeholder, needs actual calculation
      }
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/dashboard/chart-data - Get chart data
router.get('/chart-data', async (req, res, next) => {
  try {
    const chartData = await ChartData.find({}).sort({ month: 1 }).lean()

    res.json({
      success: true,
      data: chartData
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/dashboard/section-cards - Get section cards data
router.get('/section-cards', async (req, res, next) => {
  try {
    const sectionCards = await SectionCard.find({}).lean()

    res.json({
      success: true,
      data: sectionCards
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
