const express = require('express')
const router = express.Router()
const SolanaPaymentService = require('../services/solanaPaymentService')

// Create payment service instance
const paymentService = new SolanaPaymentService('devnet')

// POST /api/solana-payments - Create a new payment record
router.post('/', async (req, res, next) => {
  try {
    const { signature, userId, amount, tokenMint, fromWallet, toWallet, memo } = req.body

    if (!signature || !userId || !amount || !fromWallet || !toWallet) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: signature, userId, amount, fromWallet, toWallet'
      })
    }

    const payment = await paymentService.createPayment({
      signature,
      userId,
      amount,
      tokenMint,
      fromWallet,
      toWallet,
      memo
    })

    res.status(201).json({
      success: true,
      data: payment
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/solana-payments/:signature - Get payment by signature
router.get('/:signature', async (req, res, next) => {
  try {
    const { signature } = req.params
    const payment = await paymentService.getPaymentBySignature(signature)

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      })
    }

    res.json({
      success: true,
      data: payment
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/solana-payments/user/:userId - Get payments for a user
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params
    const { limit = 20, offset = 0 } = req.query

    const payments = await paymentService.getUserPayments(userId, parseInt(limit), parseInt(offset))

    res.json({
      success: true,
      data: payments,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: payments.length
      }
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/solana-payments/wallet/:walletAddress - Get payments by wallet address
router.get('/wallet/:walletAddress', async (req, res, next) => {
  try {
    const { walletAddress } = req.params
    const { limit = 20, offset = 0 } = req.query

    const payments = await paymentService.getPaymentsByWallet(walletAddress, parseInt(limit), parseInt(offset))

    res.json({
      success: true,
      data: payments,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: payments.length
      }
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/solana-payments/:signature/status - Update payment status
router.put('/:signature/status', async (req, res, next) => {
  try {
    const { signature } = req.params
    const { status, blockInfo } = req.body

    if (!status || !['pending', 'confirmed', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be pending, confirmed, or failed'
      })
    }

    const payment = await paymentService.updatePaymentStatus(signature, status, blockInfo)

    res.json({
      success: true,
      data: payment
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/solana-payments/:signature/verify - Verify transaction on blockchain
router.post('/:signature/verify', async (req, res, next) => {
  try {
    const { signature } = req.params
    const verification = await paymentService.verifyTransaction(signature)

    if (verification.verified) {
      // Update payment status based on verification
      const payment = await paymentService.updatePaymentStatus(
        signature, 
        verification.blockInfo.confirmationStatus,
        verification.blockInfo
      )

      res.json({
        success: true,
        data: {
          verified: true,
          payment,
          blockInfo: verification.blockInfo
        }
      })
    } else {
      res.status(400).json({
        success: false,
        error: verification.error
      })
    }
  } catch (error) {
    next(error)
  }
})

// GET /api/solana-payments/stats/:userId - Get payment statistics for a user
router.get('/stats/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params
    const stats = await paymentService.getPaymentStats(userId)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/solana-payments/recent - Get recent payments
router.get('/recent', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query
    const payments = await paymentService.getRecentPayments(parseInt(limit))

    res.json({
      success: true,
      data: payments
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/solana-payments/search - Search payments
router.get('/search', async (req, res, next) => {
  try {
    const { q: query, userId } = req.query

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      })
    }

    const payments = await paymentService.searchPayments(query, userId)

    res.json({
      success: true,
      data: payments
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/solana-payments/cleanup - Clean up old pending payments
router.post('/cleanup', async (req, res, next) => {
  try {
    const { olderThanHours = 24 } = req.body
    const cleanedCount = await paymentService.cleanupPendingPayments(olderThanHours)

    res.json({
      success: true,
      data: {
        cleanedCount,
        message: `Cleaned up ${cleanedCount} old pending payments`
      }
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
