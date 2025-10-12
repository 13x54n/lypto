// API Configuration
// API_BASE is configured via environment variables
// Development: Set EXPO_PUBLIC_API_BASE in app.json
// Production: Set in eas.json build profiles
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000';

export const endpoints = {
  // Auth endpoints
  requestOTP: `${API_BASE}/api/auth/request-otp`,
  verifyOTP: `${API_BASE}/api/auth/verify-otp`,
  
  // Merchant endpoints
  createPayment: `${API_BASE}/api/merchant/create-payment`,
  getTransactions: `${API_BASE}/api/merchant/transactions`,
  getStats: `${API_BASE}/api/merchant/stats`,
  confirmPayment: `${API_BASE}/api/merchant/confirm-payment`,
  lyptoBalance: `${API_BASE}/api/merchant/lypto-balance`,
  userTransactions: `${API_BASE}/api/merchant/user-transactions`,
  realtime: `${API_BASE}/api/merchant/realtime`,
};

