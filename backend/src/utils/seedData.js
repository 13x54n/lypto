const Payment = require('../models/Payment')
const ChartData = require('../models/ChartData')
const SectionCard = require('../models/SectionCard')

const seedPayments = [
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
    planName: "Basic Plan"
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
    planName: "Premium Plan"
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
    planName: "Basic Plan"
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
    planName: "Premium Plan"
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

    // Seed section cards
    await SectionCard.insertMany(seedSectionCards)
    console.log(`✅ Seeded ${seedSectionCards.length} section cards`)

    console.log('🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  }
}

module.exports = { seedDatabase, seedPayments, seedChartData, seedSectionCards }
