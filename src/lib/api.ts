// API service for backend integration
export interface PaymentData {
  id: number
  userName: string
  paymentType: "subscription" | "one-time"
  price: number
  date: string
  subscriptionId?: string // Optional for subscription payments
  planName?: string // Optional for subscription payments (e.g., "Premium Plan", "Basic Plan")
}

export interface DashboardStats {
  totalRevenue: number
  totalPayments: number
  subscriptionPayments: number
  oneTimePayments: number
  refunds: number
  monthlyGrowth: number
}

export interface ChartData {
  month: string
  desktop: number
  mobile: number
}

export interface SectionCardData {
  title: string
  value: string
  description: string
  trend: number
  trendLabel: string
  lastUpdated?: string
  dataSource?: 'calculated' | 'manual' | 'api' | 'static'
  businessType?: 'revenue' | 'subscriptions' | 'payments' | 'refunds' | 'custom'
}

class ApiService {
  private baseUrl: string
  private useMockData: boolean

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    // Use mock data only if explicitly configured or if API URL is not set
    this.useMockData = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Handle Express backend response format
      if (data.success !== undefined) {
        if (!data.success) {
          throw new Error(data.error || 'API request failed')
        }
        return data.data || data
      }
      
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Auth API (OTP)
  async requestOtp(email: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/auth/request-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, platform: 'web' }),
    })
  }

  async verifyOtp(email: string, code: string): Promise<{ token: string; user?: any }> {
    const res = await this.request<{ 
      success?: boolean; 
      data?: { 
        token: string; 
        user: {
          userId: string;
          email: string;
          platform: string;
          lastLogin: string;
          loginCount: number;
        }
      }; 
      token?: string 
    }>(`/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, code, platform: 'web' }),
    })
    
    // Handle both backend response formats
    if ((res as any)?.data?.token && (res as any)?.data?.user) {
      return { 
        token: (res as any).data.token as string,
        user: (res as any).data.user
      }
    }
    if ((res as any)?.token) return { token: (res as any).token as string }
    throw new Error('Invalid verifyOtp response')
  }

  // Payments API
  async getPayments(): Promise<PaymentData[]> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.getPayments()
    }
    return this.request<PaymentData[]>('/payments')
  }

  async getPaymentById(id: number): Promise<PaymentData> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.getPaymentById(id)
    }
    return this.request<PaymentData>(`/payments/${id}`)
  }

  async createPayment(payment: Omit<PaymentData, 'id'>): Promise<PaymentData> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.createPayment(payment)
    }
    return this.request<PaymentData>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    })
  }

  async updatePayment(id: number, payment: Partial<PaymentData>): Promise<PaymentData> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.updatePayment(id, payment)
    }
    return this.request<PaymentData>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payment),
    })
  }

  async deletePayment(id: number): Promise<void> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.deletePayment(id)
    }
    return this.request<void>(`/payments/${id}`, {
      method: 'DELETE',
    })
  }

  // Dashboard Stats API
  async getDashboardStats(): Promise<DashboardStats> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.getDashboardStats()
    }
    return this.request<DashboardStats>('/dashboard/stats')
  }

  // Chart Data API
  async getChartData(): Promise<ChartData[]> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.getChartData()
    }
    return this.request<ChartData[]>('/dashboard/chart-data')
  }

  // Section Cards API
  async getSectionCards(userId: string): Promise<SectionCardData[]> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.getSectionCards()
    }
    return this.request<SectionCardData[]>(`/dashboard/section-cards?userId=${encodeURIComponent(userId)}`)
  }

  async updateSectionCards(userId: string): Promise<{ success: boolean; message: string }> {
    if (this.useMockData) {
      return { success: true, message: 'Section cards updated (mock)' }
    }
    return this.request<{ success: boolean; message: string }>('/dashboard/section-cards/update', {
      method: 'POST',
      body: JSON.stringify({ userId })
    })
  }

  async updateSectionCardValue(userId: string, title: string, value: string, trend: number, trendLabel: string): Promise<SectionCardData> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.getSectionCards().then(cards => 
        cards.find(card => card.title === title) || cards[0]
      )
    }
    return this.request<SectionCardData>(`/dashboard/section-cards/${encodeURIComponent(title)}`, {
      method: 'PUT',
      body: JSON.stringify({ userId, value, trend, trendLabel })
    })
  }

  async initializeSectionCards(userId: string): Promise<{ success: boolean; message: string; data: { initialized: boolean } }> {
    if (this.useMockData) {
      return { success: true, message: 'Section cards initialized (mock)', data: { initialized: true } }
    }
    return this.request<{ success: boolean; message: string; data: { initialized: boolean } }>('/dashboard/section-cards/initialize', {
      method: 'POST',
      body: JSON.stringify({ userId })
    })
  }

  // Filtered payments
  async getPaymentsByType(type: 'subscription' | 'one-time' | 'refunds'): Promise<PaymentData[]> {
    if (this.useMockData) {
      const { mockApiService } = await import('./mock-api')
      return mockApiService.getPaymentsByType(type)
    }
    return this.request<PaymentData[]>(`/payments?type=${type}`)
  }
}

export const apiService = new ApiService()
