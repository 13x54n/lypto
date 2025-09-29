const RAW_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api'

function buildUrl(endpoint: string) {
  const base = RAW_BASE_URL.replace(/\/$/, '')
  const hasApi = /(^|\/)api(\/?$|\/)/.test(base)
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const path = hasApi ? normalizedEndpoint : `/api${normalizedEndpoint}`
  return `${base}${path}`
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = buildUrl(endpoint)
  console.log('Making request to:', url)
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })
  console.log('Response status:', res.status)
  if (!res.ok) {
    const text = await res.text()
    console.error('Request failed:', text)
    throw new Error(text || `HTTP ${res.status}`)
  }
  const data = await res.json()
  console.log('Response data:', data)
  if (data?.success === false) {
    throw new Error(data?.error || 'Request failed')
  }
  return (data?.data ?? data) as T
}

export const api = {
  requestOtp(email: string) {
    return request<{ success: boolean; message: string }>(`/auth/request-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, platform: 'mobile' }),
    })
  },
  async verifyOtp(email: string, code: string) {
    const result = await request<{ 
      token?: string; 
      data?: { 
        token: string; 
        user: {
          userId: string;
          email: string;
          platform: string;
          lastLogin: string;
          loginCount: number;
        }
      } 
    }>(`/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, code, platform: 'mobile' }),
    })
    
    if ((result as any)?.data?.token && (result as any)?.data?.user) {
      return { 
        token: (result as any).data.token as string,
        user: (result as any).data.user
      }
    }
    if ((result as any)?.token) return { token: (result as any).token as string }
    throw new Error('Invalid verify response')
  },
}


