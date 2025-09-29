const Payment = require('../models/Payment')
const ChartData = require('../models/ChartData')
const SectionCard = require('../models/SectionCard')
const SectionCardService = require('../services/sectionCardService')

const seedPayments = [
  {
    id: 1,
    userId: "demo-user-123",
    userName: "Alice Johnson",
    paymentType: "subscription",
    price: 29.99,
    date: "2024-01-15",
    subscriptionId: "sub_001",
    planName: "Premium Plan"
  },
  {
    id: 2,
    userId: "demo-user-123",
    userName: "Bob Smith",
    paymentType: "one-time",
    price: 49.99,
    date: "2024-01-16"
  },
  {
    id: 3,
    userId: "demo-user-123",
    userName: "Carol Davis",
    paymentType: "subscription",
    price: 29.99,
    date: "2024-01-17",
    subscriptionId: "sub_002",
    planName: "Basic Plan"
  },
  {
    id: 4,
    userId: "demo-user-123",
    userName: "David Wilson",
    paymentType: "one-time",
    price: 79.99,
    date: "2024-01-18"
  },
  {
    id: 5,
    userId: "demo-user-123",
    userName: "Eva Brown",
    paymentType: "subscription",
    price: 29.99,
    date: "2024-01-19",
    subscriptionId: "sub_003",
    planName: "Premium Plan"
  },
  {
    id: 6,
    userId: "demo-user-123",
    userName: "Frank Miller",
    paymentType: "one-time",
    price: 99.99,
    date: "2024-01-20"
  },
  {
    id: 7,
    userId: "demo-user-123",
    userName: "Grace Lee",
    paymentType: "subscription",
    price: 29.99,
    date: "2024-01-21",
    subscriptionId: "sub_004",
    planName: "Basic Plan"
  },
  {
    id: 8,
    userId: "demo-user-123",
    userName: "Henry Taylor",
    paymentType: "one-time",
    price: 59.99,
    date: "2024-01-22"
  },
  {
    id: 9,
    userId: "demo-user-123",
    userName: "Ivy Chen",
    paymentType: "subscription",
    price: 29.99,
    date: "2024-01-23",
    subscriptionId: "sub_005",
    planName: "Premium Plan"
  },
  {
    id: 10,
    userId: "demo-user-123",
    userName: "Jack Anderson",
    paymentType: "one-time",
    price: 89.99,
    date: "2024-01-24"
  },
  {
    id: 11,
    userId: "demo-user-123",
    userName: "Ethan Cooper",
    paymentType: "subscription",
    price: -29.99,
    date: "2024-02-14",
    subscriptionId: "sub_001"
  },
  {
    id: 12,
    userId: "demo-user-123",
    userName: "Fiona Reed",
    paymentType: "one-time",
    price: -79.99,
    date: "2024-02-15"
  },
  {
    id: 13,
    userId: "demo-user-123",
    userName: "George Murphy",
    paymentType: "subscription",
    price: -29.99,
    date: "2024-02-16",
    subscriptionId: "sub_003"
  }
]

const seedChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 }
]

const seedSectionCards = [
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

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    await Payment.deleteMany({})
    await ChartData.deleteMany({})
    await SectionCard.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Seed payments
    await Payment.insertMany(seedPayments)
    console.log(`✅ Seeded ${seedPayments.length} payments`)

    // Seed chart data
    await ChartData.insertMany(seedChartData)
    console.log(`✅ Seeded ${seedChartData.length} chart data entries`)

        // Initialize section cards with static values for demo user
        const demoUserId = 'demo-user-123'
        await SectionCardService.initializeSectionCards(demoUserId)
        console.log('✅ Section cards initialized with static values for demo user')

    console.log('🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  }
}

module.exports = { seedDatabase, seedPayments, seedChartData, seedSectionCards }
