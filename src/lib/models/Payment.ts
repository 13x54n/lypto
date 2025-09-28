import mongoose, { Schema, Document } from 'mongoose'

export interface IPayment extends Document {
  id: number
  userName: string
  paymentType: 'subscription' | 'one-time'
  price: number
  date: string
  subscriptionId?: string
  planName?: string
}

const PaymentSchema = new Schema<IPayment>({
  id: { type: Number, required: true, unique: true },
  userName: { type: String, required: true },
  paymentType: { 
    type: String, 
    required: true, 
    enum: ['subscription', 'one-time'] 
  },
  price: { type: Number, required: true },
  date: { type: String, required: true },
  subscriptionId: { type: String, required: false },
  planName: { type: String, required: false }
}, {
  timestamps: true
})

// Create indexes
PaymentSchema.index({ id: 1 }, { unique: true })
PaymentSchema.index({ paymentType: 1 })
PaymentSchema.index({ date: -1 })
PaymentSchema.index({ userName: 1 })
PaymentSchema.index({ subscriptionId: 1 }, { sparse: true })

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema)
