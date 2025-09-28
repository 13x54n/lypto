import mongoose from 'mongoose'
import { Payment, IPayment } from './models/Payment'
import { ChartData, IChartData } from './models/ChartData'
import { SectionCard, ISectionCard } from './models/SectionCard'
import { PaymentData, DashboardStats, ChartData as ChartDataType, SectionCardData } from './api'

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME || 'zypto'

// Connect to MongoDB using Mongoose
export async function connectToDatabase() {
  try {
    // Check if MongoDB URI is provided
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set. Please set your MongoDB connection string.')
    }

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected')
      return
    }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    console.log('Connected to MongoDB with Mongoose')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    console.error('Please check your MONGODB_URI environment variable')
    throw error
  }
}

// Close MongoDB connection
export async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
  }
}

// Mongoose service class
export class MongooseService {
  // Payments CRUD operations
  static async getPayments(filter?: { paymentType?: string }): Promise<PaymentData[]> {
    await connectToDatabase()
    
    let query: any = {}
    
    if (filter?.paymentType === 'refunds') {
      query = { price: { $lte: 0 } }
    } else if (filter?.paymentType) {
      query = { paymentType: filter.paymentType as "subscription" | "one-time" }
    }

    const payments = await Payment.find(query).sort({ date: -1 }).lean()
    return payments.map(payment => ({
      id: payment.id,
      userName: payment.userName,
      paymentType: payment.paymentType,
      price: payment.price,
      date: payment.date,
      subscriptionId: payment.subscriptionId,
      planName: payment.planName
    }))
  }

  static async getPaymentById(id: number): Promise<PaymentData | null> {
    await connectToDatabase()
    const payment = await Payment.findOne({ id }).lean()
    
    if (!payment) return null
    
    return {
      id: payment.id,
      userName: payment.userName,
      paymentType: payment.paymentType,
      price: payment.price,
      date: payment.date,
      subscriptionId: payment.subscriptionId,
      planName: payment.planName
    }
  }

  static async createPayment(payment: Omit<PaymentData, 'id'>): Promise<PaymentData> {
    await connectToDatabase()
    
    // Get the next ID
    const lastPayment = await Payment.findOne({}).sort({ id: -1 }).lean()
    const nextId = lastPayment ? lastPayment.id + 1 : 1

    const newPayment = new Payment({
      ...payment,
      id: nextId
    })

    await newPayment.save()
    
    return {
      id: newPayment.id,
      userName: newPayment.userName,
      paymentType: newPayment.paymentType,
      price: newPayment.price,
      date: newPayment.date,
      subscriptionId: newPayment.subscriptionId,
      planName: newPayment.planName
    }
  }

  static async updatePayment(id: number, payment: Partial<PaymentData>): Promise<PaymentData | null> {
    await connectToDatabase()
    
    const updatedPayment = await Payment.findOneAndUpdate(
      { id },
      payment,
      { new: true, runValidators: true }
    ).lean()

    if (!updatedPayment) return null
    
    return {
      id: updatedPayment.id,
      userName: updatedPayment.userName,
      paymentType: updatedPayment.paymentType,
      price: updatedPayment.price,
      date: updatedPayment.date,
      subscriptionId: updatedPayment.subscriptionId,
      planName: updatedPayment.planName
    }
  }

  static async deletePayment(id: number): Promise<boolean> {
    await connectToDatabase()
    
    const result = await Payment.deleteOne({ id })
    return result.deletedCount > 0
  }

  // Dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    await connectToDatabase()
    
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

    return {
      totalRevenue: result.totalRevenue || 0,
      totalPayments: result.totalPayments || 0,
      subscriptionPayments: result.subscriptionPayments || 0,
      oneTimePayments: result.oneTimePayments || 0,
      refunds: result.refunds || 0,
      monthlyGrowth: 24.5 // Calculate based on historical data
    }
  }

  // Chart data
  static async getChartData(): Promise<ChartDataType[]> {
    await connectToDatabase()
    const chartData = await ChartData.find({}).sort({ month: 1 }).lean()
    return chartData.map(data => ({
      month: data.month,
      desktop: data.desktop,
      mobile: data.mobile
    }))
  }

  // Section cards data
  static async getSectionCards(): Promise<SectionCardData[]> {
    await connectToDatabase()
    const sectionCards = await SectionCard.find({}).lean()
    return sectionCards.map(card => ({
      title: card.title,
      value: card.value,
      description: card.description,
      trend: card.trend,
      trendLabel: card.trendLabel
    }))
  }

  // Seed initial data
  static async seedData() {
    await connectToDatabase()
    
    // Check if data already exists
    const existingPayments = await Payment.countDocuments()
    if (existingPayments > 0) {
      console.log('Data already exists, skipping seed')
      return
    }

    // Seed payments data
    const paymentsData: Omit<PaymentData, 'id'>[] = [
      {
        userName: "Alice Johnson",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-15",
        subscriptionId: "sub_001",
        planName: "Premium Plan"
      },
      {
        userName: "Bob Smith",
        paymentType: "one-time",
        price: 49.99,
        date: "2024-01-16"
      },
      {
        userName: "Carol Davis",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-17",
        subscriptionId: "sub_002",
        planName: "Basic Plan"
      },
      {
        userName: "David Wilson",
        paymentType: "one-time",
        price: 79.99,
        date: "2024-01-18"
      },
      {
        userName: "Eva Brown",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-19",
        subscriptionId: "sub_003",
        planName: "Premium Plan"
      },
      {
        userName: "Frank Miller",
        paymentType: "one-time",
        price: 99.99,
        date: "2024-01-20"
      },
      {
        userName: "Grace Lee",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-21",
        subscriptionId: "sub_004",
        planName: "Basic Plan"
      },
      {
        userName: "Henry Taylor",
        paymentType: "one-time",
        price: 59.99,
        date: "2024-01-22"
      },
      {
        userName: "Ivy Chen",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-23",
        subscriptionId: "sub_005",
        planName: "Premium Plan"
      },
      {
        userName: "Jack Anderson",
        paymentType: "one-time",
        price: 89.99,
        date: "2024-01-24"
      },
      {
        userName: "Ethan Cooper",
        paymentType: "subscription",
        price: -29.99,
        date: "2024-02-14",
        subscriptionId: "sub_001"
      },
      {
        userName: "Fiona Reed",
        paymentType: "one-time",
        price: -79.99,
        date: "2024-02-15"
      },
      {
        userName: "George Murphy",
        paymentType: "subscription",
        price: -29.99,
        date: "2024-02-16",
        subscriptionId: "sub_003"
      }
    ]

    // Create payments with IDs
    const paymentsWithIds = paymentsData.map((payment, index) => ({
      ...payment,
      id: index + 1
    }))

    await Payment.insertMany(paymentsWithIds)

    // Seed chart data
    const chartData = [
      { month: "January", desktop: 186, mobile: 80 },
      { month: "February", desktop: 305, mobile: 200 },
      { month: "March", desktop: 237, mobile: 120 },
      { month: "April", desktop: 73, mobile: 190 },
      { month: "May", desktop: 209, mobile: 130 },
      { month: "June", desktop: 214, mobile: 140 },
    ]

    await ChartData.insertMany(chartData)

    // Seed section cards data
    const sectionCardsData = [
      {
        title: "Total Revenue",
        value: "$15,420.50",
        description: "Total revenue generated",
        trend: 24.5,
        trendLabel: "+24.5%"
      },
      {
        title: "Active Subscriptions",
        value: "7",
        description: "Active subscription payments",
        trend: 31,
        trendLabel: "+31%"
      },
      {
        title: "One-time Payments",
        value: "3",
        description: "One-time payment count",
        trend: 18.2,
        trendLabel: "+18.2%"
      },
      {
        title: "Refunds",
        value: "3",
        description: "Total refunds processed",
        trend: -5.2,
        trendLabel: "-5.2%"
      }
    ]

    await SectionCard.insertMany(sectionCardsData)

    console.log('Database seeded successfully with Mongoose')
  }
}
