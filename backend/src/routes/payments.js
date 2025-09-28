const express = require('express')
const router = express.Router()
const Payment = require('../models/Payment')

// GET /api/payments - Get all payments with optional filtering
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query
    
    let query = {}
    
    if (type === 'refunds') {
      query = { price: { $lte: 0 } }
    } else if (type && ['subscription', 'one-time'].includes(type)) {
      query = { paymentType: type }
    }

    const payments = await Payment.find(query)
      .sort({ date: -1 })
      .lean()

    res.json({
      success: true,
      count: payments.length,
      data: payments
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/payments/:id - Get specific payment
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment ID'
      })
    }

    const payment = await Payment.findOne({ id: parseInt(id) }).lean()

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

// POST /api/payments - Create new payment
router.post('/', async (req, res, next) => {
  try {
    const { userName, paymentType, price, date, subscriptionId, planName } = req.body

    // Validation
    if (!userName || !paymentType || price === undefined || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userName, paymentType, price, date'
      })
    }

    if (!['subscription', 'one-time'].includes(paymentType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment type. Must be "subscription" or "one-time"'
      })
    }

    if (paymentType === 'subscription' && !subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'subscriptionId is required for subscription payments'
      })
    }

    // Get next ID
    const nextId = await Payment.getNextId()

    const payment = new Payment({
      id: nextId,
      userName,
      paymentType,
      price: Number(price),
      date,
      subscriptionId,
      planName
    })

    await payment.save()

    res.status(201).json({
      success: true,
      data: payment
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/payments/:id - Update payment
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { userName, paymentType, price, date, subscriptionId, planName } = req.body

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment ID'
      })
    }

    if (paymentType && !['subscription', 'one-time'].includes(paymentType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment type. Must be "subscription" or "one-time"'
      })
    }

    const payment = await Payment.findOneAndUpdate(
      { id: parseInt(id) },
      {
        ...(userName && { userName }),
        ...(paymentType && { paymentType }),
        ...(price !== undefined && { price: Number(price) }),
        ...(date && { date }),
        ...(subscriptionId && { subscriptionId }),
        ...(planName && { planName })
      },
      { new: true, runValidators: true }
    )

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

// DELETE /api/payments/:id - Delete payment
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment ID'
      })
    }

    const payment = await Payment.findOneAndDelete({ id: parseInt(id) })

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      })
    }

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
