const express = require('express')
const router = express.Router()
const Payment = require('../models/Payment')
const ChartData = require('../models/ChartData')
const SectionCard = require('../models/SectionCard')
const SectionCardService = require('../services/sectionCardService')

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

// GET /api/dashboard/section-cards - Get section cards data for a specific user (auto-seed if needed)
router.get('/section-cards', async (req, res, next) => {
  try {
    const { userId } = req.query
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      })
    }

    // Auto-seed if user has no data
    const sectionCards = await SectionCardService.ensureUserHasData(userId)

    res.json({
      success: true,
      data: sectionCards
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/dashboard/section-cards/update - Update section cards with calculated values for a specific user
router.post('/section-cards/update', async (req, res, next) => {
  try {
    const { userId } = req.body
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      })
    }

    await SectionCardService.updateSectionCards(userId)
    res.json({
      success: true,
      message: 'Section cards updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/dashboard/section-cards/initialize - Initialize section cards for a new user
router.post('/section-cards/initialize', async (req, res, next) => {
  try {
    const { userId } = req.body
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      })
    }

    const wasSeeded = await SectionCardService.autoSeedForUser(userId)
    
    if (wasSeeded) {
      res.json({
        success: true,
        message: 'Section cards initialized successfully for new user',
        data: { initialized: true }
      })
    } else {
      res.json({
        success: true,
        message: 'User already has section cards',
        data: { initialized: false }
      })
    }
  } catch (error) {
    next(error)
  }
})

// PUT /api/dashboard/section-cards/:title - Manually update a section card value for a specific user
router.put('/section-cards/:title', async (req, res, next) => {
  try {
    const { title } = req.params
    const { userId, value, trend, trendLabel } = req.body
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      })
    }
    
    if (!value || trend === undefined || !trendLabel) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: value, trend, trendLabel' 
      })
    }

    const updatedCard = await SectionCardService.updateSectionCardValue(userId, title, value, trend, trendLabel)
    res.json({
      success: true,
      data: updatedCard
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
