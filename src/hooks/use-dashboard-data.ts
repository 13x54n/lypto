import { useState, useEffect, useCallback } from 'react'
import { apiService, PaymentData, DashboardStats, ChartData, SectionCardData } from '@/lib/api'

export function usePayments() {
  const [data, setData] = useState<PaymentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true)
        setError(null)
        const payments = await apiService.getPayments()
        setData(payments)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch payments')
        console.error('Error fetching payments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const payments = await apiService.getPayments()
      setData(payments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const stats = await apiService.getDashboardStats()
        setData(stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { data, loading, error }
}

export function useChartData() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        setError(null)
        const chartData = await apiService.getChartData()
        setData(chartData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chart data')
        console.error('Error fetching chart data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  return { data, loading, error }
}

export function useSectionCards(userId: string) {
  const [data, setData] = useState<SectionCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSectionCards = useCallback(async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      setError(null)
      const cards = await apiService.getSectionCards(userId)
      setData(cards)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch section cards')
      console.error('Error fetching section cards:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const updateSectionCards = useCallback(async () => {
    if (!userId) return
    
    try {
      setError(null)
      await apiService.updateSectionCards(userId)
      await fetchSectionCards() // Refresh data after update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update section cards')
    }
  }, [userId, fetchSectionCards])

  const updateSectionCardValue = useCallback(async (title: string, value: string, trend: number, trendLabel: string) => {
    if (!userId) return
    
    try {
      setError(null)
      const updatedCard = await apiService.updateSectionCardValue(userId, title, value, trend, trendLabel)
      setData(prevData => 
        prevData.map(card => card.title === title ? updatedCard : card)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update section card value')
    }
  }, [userId])

  const initializeSectionCards = useCallback(async () => {
    if (!userId) return
    
    try {
      setError(null)
      const result = await apiService.initializeSectionCards(userId)
      if (result.data.initialized) {
        await fetchSectionCards() // Refresh data after initialization
      }
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize section cards')
      throw err
    }
  }, [userId, fetchSectionCards])

  useEffect(() => {
    fetchSectionCards()
  }, [fetchSectionCards])

  const refetch = useCallback(() => {
    fetchSectionCards()
  }, [fetchSectionCards])

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    updateSectionCards, 
    updateSectionCardValue,
    initializeSectionCards
  }
}
