import mongoose, { Schema, Document } from 'mongoose'

export interface IChartData extends Document {
  month: string
  desktop: number
  mobile: number
}

const ChartDataSchema = new Schema<IChartData>({
  month: { type: String, required: true, unique: true },
  desktop: { type: Number, required: true },
  mobile: { type: Number, required: true }
}, {
  timestamps: true
})

// Create indexes
ChartDataSchema.index({ month: 1 }, { unique: true })

export const ChartData = mongoose.models.ChartData || mongoose.model<IChartData>('ChartData', ChartDataSchema)
