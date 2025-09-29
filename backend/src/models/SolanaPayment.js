const mongoose = require('mongoose')

const solanaPaymentSchema = new mongoose.Schema({
  // Transaction details
  signature: {
    type: String,
    required: true
  },
  
  // User reference
  userId: {
    type: String,
    required: true
  },
  
  // Payment details
  amount: {
    type: Number,
    required: true
  },
  
  tokenMint: {
    type: String,
    required: false
  },
  
  // Wallet addresses
  fromWallet: {
    type: String,
    required: true
  },
  
  toWallet: {
    type: String,
    required: true
  },
  
  // Transaction metadata
  memo: {
    type: String,
    required: false
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  
  // Network information
  network: {
    type: String,
    enum: ['devnet', 'testnet', 'mainnet-beta'],
    default: 'devnet'
  },
  
  // Block information
  slot: {
    type: Number,
    required: false
  },
  
  blockTime: {
    type: Date,
    required: false
  },
  
  // Confirmation details
  confirmationStatus: {
    type: String,
    required: false
  },
  
  // Fee information
  fee: {
    type: Number,
    required: false
  },
  
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes for better performance
solanaPaymentSchema.index({ signature: 1 }, { unique: true })
solanaPaymentSchema.index({ userId: 1, createdAt: -1 })
solanaPaymentSchema.index({ fromWallet: 1, createdAt: -1 })
solanaPaymentSchema.index({ toWallet: 1, createdAt: -1 })
solanaPaymentSchema.index({ status: 1 })
solanaPaymentSchema.index({ network: 1 })
solanaPaymentSchema.index({ tokenMint: 1 })

// Virtual for transaction URL
solanaPaymentSchema.virtual('explorerUrl').get(function() {
  const baseUrl = this.network === 'mainnet-beta' 
    ? 'https://explorer.solana.com'
    : `https://explorer.solana.com?cluster=${this.network}`
  return `${baseUrl}/tx/${this.signature}`
})

// Method to update status
solanaPaymentSchema.methods.updateStatus = function(newStatus, blockInfo = {}) {
  this.status = newStatus
  if (blockInfo.slot) this.slot = blockInfo.slot
  if (blockInfo.blockTime) this.blockTime = blockInfo.blockTime
  if (blockInfo.confirmationStatus) this.confirmationStatus = blockInfo.confirmationStatus
  return this.save()
}

module.exports = mongoose.model('SolanaPayment', solanaPaymentSchema)
