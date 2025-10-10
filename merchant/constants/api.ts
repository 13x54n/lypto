// API Configuration
// Use your local network IP address (same as mobile app)
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://10.0.0.144:4000';

export const endpoints = {
  // Auth endpoints
  requestOTP: `${API_BASE}/api/auth/request-otp`,
  verifyOTP: `${API_BASE}/api/auth/verify-otp`,
  
  // Merchant endpoints
  createPayment: `${API_BASE}/api/merchant/create-payment`,
  getTransactions: `${API_BASE}/api/merchant/transactions`,
  getStats: `${API_BASE}/api/merchant/stats`,
  confirmPayment: `${API_BASE}/api/merchant/confirm-payment`,
};

