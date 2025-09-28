import mongoose, { Schema, Document } from 'mongoose'

export interface ISectionCard extends Document {
  title: string
  value: string
  description: string
  trend: number
  trendLabel: string
}

const SectionCardSchema = new Schema<ISectionCard>({
  title: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  description: { type: String, required: true },
  trend: { type: Number, required: true },
  trendLabel: { type: String, required: true }
}, {
  timestamps: true
})

// Create indexes
SectionCardSchema.index({ title: 1 }, { unique: true })

export const SectionCard = mongoose.models.SectionCard || mongoose.model<ISectionCard>('SectionCard', SectionCardSchema)
