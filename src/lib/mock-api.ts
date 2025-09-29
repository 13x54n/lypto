// Mock API for development - replace with real backend integration
import { PaymentData, DashboardStats, ChartData, SectionCardData } from './api'

// Mock data
const mockPayments: PaymentData[] = [
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

const mockDashboardStats: DashboardStats = {
  totalRevenue: 15420.50,
  totalPayments: 13,
  subscriptionPayments: 7,
  oneTimePayments: 3,
  refunds: 3,
  monthlyGrowth: 24.5
}

const mockChartData: ChartData[] = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const mockSectionCards: SectionCardData[] = [
  {
    title: "Total Revenue",
    value: "$15,420.50",
    description: "Total revenue generated",
    trend: 24.5,
    trendLabel: "+24.5%",
    lastUpdated: new Date().toISOString(),
    dataSource: 'static' as const,
    businessType: 'revenue' as const
  },
  {
    title: "Active Subscriptions", 
    value: "7",
    description: "Active subscription payments",
    trend: 31,
    trendLabel: "+31%",
    lastUpdated: new Date().toISOString(),
    dataSource: 'static' as const,
    businessType: 'subscriptions' as const
  },
  {
    title: "One-time Payments",
    value: "3", 
    description: "One-time payment count",
    trend: 18.2,
    trendLabel: "+18.2%",
    lastUpdated: new Date().toISOString(),
    dataSource: 'static' as const,
    businessType: 'payments' as const
  },
  {
    title: "Refunds",
    value: "3",
    description: "Total refunds processed", 
    trend: -5.2,
    trendLabel: "-5.2%",
    lastUpdated: new Date().toISOString(),
    dataSource: 'static' as const,
    businessType: 'refunds' as const
  }
]

// Mock API functions with simulated delays
export const mockApiService = {
  async getPayments(): Promise<PaymentData[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockPayments
  },

  async getPaymentById(id: number): Promise<PaymentData> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const payment = mockPayments.find(p => p.id === id)
    if (!payment) throw new Error('Payment not found')
    return payment
  },

  async createPayment(payment: Omit<PaymentData, 'id'>): Promise<PaymentData> {
    await new Promise(resolve => setTimeout(resolve, 800))
    const newPayment: PaymentData = {
      ...payment,
      id: Math.max(...mockPayments.map(p => p.id)) + 1
    }
    mockPayments.push(newPayment)
    return newPayment
  },

  async updatePayment(id: number, payment: Partial<PaymentData>): Promise<PaymentData> {
    await new Promise(resolve => setTimeout(resolve, 600))
    const index = mockPayments.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Payment not found')
    mockPayments[index] = { ...mockPayments[index], ...payment }
    return mockPayments[index]
  },

  async deletePayment(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockPayments.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Payment not found')
    mockPayments.splice(index, 1)
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockDashboardStats
  },

  async getChartData(): Promise<ChartData[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockChartData
  },

  async getSectionCards(): Promise<SectionCardData[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockSectionCards
  },

  async getPaymentsByType(type: 'subscription' | 'one-time' | 'refunds'): Promise<PaymentData[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    if (type === 'refunds') {
      return mockPayments.filter(p => p.price <= 0)
    }
    return mockPayments.filter(p => p.paymentType === type)
  }
}
