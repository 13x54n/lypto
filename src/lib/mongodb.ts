import { MongoClient, Db, Collection } from 'mongodb'
import { PaymentData, DashboardStats, ChartData, SectionCardData } from './api'

// MongoDB connection
let client: MongoClient
let db: Db

// Database collections
export let paymentsCollection: Collection<PaymentData>
export let chartDataCollection: Collection<ChartData>
export let sectionCardsCollection: Collection<SectionCardData>

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME || 'zypto'

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    // Check if MongoDB URI is provided
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set. Please set your MongoDB connection string.')
    }

    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        // Cloud MongoDB connection options
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
      })
      await client.connect()
      console.log('Connected to MongoDB Cloud')
    }

    if (!db) {
      db = client.db(DB_NAME)
      
      // Initialize collections
      paymentsCollection = db.collection<PaymentData>('payments')
      chartDataCollection = db.collection<ChartData>('chartData')
      sectionCardsCollection = db.collection<SectionCardData>('sectionCards')
      
      // Create indexes for better performance
      await createIndexes()
    }

    return { client, db }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    console.error('Please check your MONGODB_URI environment variable')
    throw error
  }
}

// Create database indexes
async function createIndexes() {
  try {
    // Payments collection indexes
    await paymentsCollection.createIndex({ id: 1 }, { unique: true })
    await paymentsCollection.createIndex({ paymentType: 1 })
    await paymentsCollection.createIndex({ date: -1 })
    await paymentsCollection.createIndex({ userName: 1 })
    await paymentsCollection.createIndex({ subscriptionId: 1 }, { sparse: true })

    // Chart data indexes
    await chartDataCollection.createIndex({ month: 1 }, { unique: true })

    // Section cards indexes
    await sectionCardsCollection.createIndex({ title: 1 }, { unique: true })

    console.log('Database indexes created successfully')
  } catch (error) {
    console.error('Error creating indexes:', error)
  }
}

// MongoDB service class
export class MongoDBService {
  // Payments CRUD operations
  static async getPayments(filter?: { paymentType?: string }): Promise<PaymentData[]> {
    await connectToDatabase()
    
    let query: any = {}
    
    if (filter?.paymentType === 'refunds') {
      query = { price: { $lte: 0 } }
    } else if (filter?.paymentType) {
      query = { paymentType: filter.paymentType as "subscription" | "one-time" }
    }

    return await paymentsCollection.find(query).sort({ date: -1 }).toArray()
  }

  static async getPaymentById(id: number): Promise<PaymentData | null> {
    await connectToDatabase()
    return await paymentsCollection.findOne({ id })
  }

  static async createPayment(payment: Omit<PaymentData, 'id'>): Promise<PaymentData> {
    await connectToDatabase()
    
    // Get the next ID
    const lastPayment = await paymentsCollection.findOne({}, { sort: { id: -1 } })
    const nextId = lastPayment ? lastPayment.id + 1 : 1

    const newPayment: PaymentData = {
      ...payment,
      id: nextId
    }

    await paymentsCollection.insertOne(newPayment)
    return newPayment
  }

  static async updatePayment(id: number, payment: Partial<PaymentData>): Promise<PaymentData | null> {
    await connectToDatabase()
    
    const result = await paymentsCollection.findOneAndUpdate(
      { id },
      { $set: payment },
      { returnDocument: 'after' }
    )

    return result || null
  }

  static async deletePayment(id: number): Promise<boolean> {
    await connectToDatabase()
    
    const result = await paymentsCollection.deleteOne({ id })
    return result.deletedCount > 0
  }

  // Dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    await connectToDatabase()
    
    const pipeline = [
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
    ]

    const result = await paymentsCollection.aggregate(pipeline).toArray()
    const stats = result[0] || {
      totalRevenue: 0,
      totalPayments: 0,
      subscriptionPayments: 0,
      oneTimePayments: 0,
      refunds: 0
    }

    return {
      totalRevenue: stats.totalRevenue || 0,
      totalPayments: stats.totalPayments || 0,
      subscriptionPayments: stats.subscriptionPayments || 0,
      oneTimePayments: stats.oneTimePayments || 0,
      refunds: stats.refunds || 0,
      monthlyGrowth: 24.5 // Calculate based on historical data
    }
  }

  // Chart data
  static async getChartData(): Promise<ChartData[]> {
    await connectToDatabase()
    return await chartDataCollection.find({}).sort({ month: 1 }).toArray()
  }

  // Section cards data
  static async getSectionCards(): Promise<SectionCardData[]> {
    await connectToDatabase()
    return await sectionCardsCollection.find({}).toArray()
  }

  // Seed initial data
  static async seedData() {
    await connectToDatabase()
    
    // Check if data already exists
    const existingPayments = await paymentsCollection.countDocuments()
    if (existingPayments > 0) {
      console.log('Data already exists, skipping seed')
      return
    }

    // Seed payments data
    const paymentsData: PaymentData[] = [
      {
        id: 1,
        userName: "Alice Johnson",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-15",
        subscriptionId: "sub_001",
        planName: "Premium Plan"
      },
      {
        id: 2,
        userName: "Bob Smith",
        paymentType: "one-time",
        price: 49.99,
        date: "2024-01-16"
      },
      {
        id: 3,
        userName: "Carol Davis",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-17",
        subscriptionId: "sub_002",
        planName: "Premium Plan"
      },
      {
        id: 4,
        userName: "David Wilson",
        paymentType: "one-time",
        price: 79.99,
        date: "2024-01-18"
      },
      {
        id: 5,
        userName: "Eva Brown",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-19",
        subscriptionId: "sub_003",
        planName: "Basic Plan"
      },
      {
        id: 6,
        userName: "Frank Miller",
        paymentType: "one-time",
        price: 99.99,
        date: "2024-01-20"
      },
      {
        id: 7,
        userName: "Grace Lee",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-21",
        subscriptionId: "sub_004",
        planName: "Premium Plan"
      },
      {
        id: 8,
        userName: "Henry Taylor",
        paymentType: "one-time",
        price: 59.99,
        date: "2024-01-22"
      },
      {
        id: 9,
        userName: "Ivy Chen",
        paymentType: "subscription",
        price: 29.99,
        date: "2024-01-23",
        subscriptionId: "sub_005",
        planName: "Basic Plan"
      },
      {
        id: 10,
        userName: "Jack Anderson",
        paymentType: "one-time",
        price: 89.99,
        date: "2024-01-24"
      },
      {
        id: 11,
        userName: "Ethan Cooper",
        paymentType: "subscription",
        price: -29.99,
        date: "2024-02-14",
        subscriptionId: "sub_001"
      },
      {
        id: 12,
        userName: "Fiona Reed",
        paymentType: "one-time",
        price: -79.99,
        date: "2024-02-15"
      },
      {
        id: 13,
        userName: "George Murphy",
        paymentType: "subscription",
        price: -29.99,
        date: "2024-02-16",
        subscriptionId: "sub_003"
      }
    ]

    await paymentsCollection.insertMany(paymentsData)

    // Seed chart data
    const chartData: ChartData[] = [
      { month: "January", desktop: 186, mobile: 80 },
      { month: "February", desktop: 305, mobile: 200 },
      { month: "March", desktop: 237, mobile: 120 },
      { month: "April", desktop: 73, mobile: 190 },
      { month: "May", desktop: 209, mobile: 130 },
      { month: "June", desktop: 214, mobile: 140 },
    ]

    await chartDataCollection.insertMany(chartData)

    // Seed section cards data
    const sectionCardsData: SectionCardData[] = [
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

    await sectionCardsCollection.insertMany(sectionCardsData)

    console.log('Database seeded successfully')
  }
}

// Close MongoDB connection
export async function closeDatabase() {
  if (client) {
    await client.close()
    console.log('MongoDB connection closed')
  }
}
