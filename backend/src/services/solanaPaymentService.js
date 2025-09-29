const SolanaPayment = require('../models/SolanaPayment')
const { Connection, PublicKey } = require('@solana/web3.js')

class SolanaPaymentService {
  constructor(network = 'devnet') {
    this.network = network
    this.connection = new Connection(
      network === 'mainnet-beta' 
        ? 'https://api.mainnet-beta.solana.com'
        : network === 'testnet'
        ? 'https://api.testnet.solana.com'
        : 'https://api.devnet.solana.com'
    )
  }

  // Create a new payment record
  async createPayment(paymentData) {
    try {
      const payment = new SolanaPayment({
        signature: paymentData.signature,
        userId: paymentData.userId,
        amount: paymentData.amount,
        tokenMint: paymentData.tokenMint,
        fromWallet: paymentData.fromWallet,
        toWallet: paymentData.toWallet,
        memo: paymentData.memo,
        network: this.network,
        status: 'pending'
      })

      await payment.save()
      return payment
    } catch (error) {
      console.error('Error creating payment:', error)
      throw error
    }
  }

  // Get payment by signature
  async getPaymentBySignature(signature) {
    try {
      return await SolanaPayment.findOne({ signature })
    } catch (error) {
      console.error('Error getting payment by signature:', error)
      throw error
    }
  }

  // Get payments for a user
  async getUserPayments(userId, limit = 20, offset = 0) {
    try {
      return await SolanaPayment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
    } catch (error) {
      console.error('Error getting user payments:', error)
      throw error
    }
  }

  // Get payments by wallet address
  async getPaymentsByWallet(walletAddress, limit = 20, offset = 0) {
    try {
      return await SolanaPayment.find({
        $or: [
          { fromWallet: walletAddress },
          { toWallet: walletAddress }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
    } catch (error) {
      console.error('Error getting payments by wallet:', error)
      throw error
    }
  }

  // Update payment status
  async updatePaymentStatus(signature, status, blockInfo = {}) {
    try {
      const payment = await SolanaPayment.findOne({ signature })
      if (!payment) {
        throw new Error('Payment not found')
      }

      return await payment.updateStatus(status, blockInfo)
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  }

  // Verify transaction on blockchain
  async verifyTransaction(signature) {
    try {
      const transaction = await this.connection.getTransaction(signature)
      
      if (!transaction) {
        return { verified: false, error: 'Transaction not found' }
      }

      const blockInfo = {
        slot: transaction.slot,
        blockTime: transaction.blockTime ? new Date(transaction.blockTime * 1000) : null,
        confirmationStatus: transaction.meta?.err ? 'failed' : 'confirmed'
      }

      return {
        verified: true,
        blockInfo,
        transaction
      }
    } catch (error) {
      console.error('Error verifying transaction:', error)
      return { verified: false, error: error.message }
    }
  }

  // Get payment statistics
  async getPaymentStats(userId) {
    try {
      const pipeline = [
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalPayments: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            confirmedPayments: {
              $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
            },
            pendingPayments: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            failedPayments: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            }
          }
        }
      ]

      const result = await SolanaPayment.aggregate(pipeline)
      return result[0] || {
        totalPayments: 0,
        totalAmount: 0,
        confirmedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0
      }
    } catch (error) {
      console.error('Error getting payment stats:', error)
      throw error
    }
  }

  // Get recent payments
  async getRecentPayments(limit = 10) {
    try {
      return await SolanaPayment.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'username email')
    } catch (error) {
      console.error('Error getting recent payments:', error)
      throw error
    }
  }

  // Search payments
  async searchPayments(query, userId = null) {
    try {
      const searchCriteria = {
        $or: [
          { signature: { $regex: query, $options: 'i' } },
          { fromWallet: { $regex: query, $options: 'i' } },
          { toWallet: { $regex: query, $options: 'i' } },
          { memo: { $regex: query, $options: 'i' } }
        ]
      }

      if (userId) {
        searchCriteria.userId = userId
      }

      return await SolanaPayment.find(searchCriteria)
        .sort({ createdAt: -1 })
        .limit(50)
    } catch (error) {
      console.error('Error searching payments:', error)
      throw error
    }
  }

  // Clean up old pending payments
  async cleanupPendingPayments(olderThanHours = 24) {
    try {
      const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000)
      
      const result = await SolanaPayment.updateMany(
        { 
          status: 'pending',
          createdAt: { $lt: cutoffTime }
        },
        { status: 'failed' }
      )

      return result.modifiedCount
    } catch (error) {
      console.error('Error cleaning up pending payments:', error)
      throw error
    }
  }
}

module.exports = SolanaPaymentService
