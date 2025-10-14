// API_BASE is configured via environment variables
// Development: Set EXPO_PUBLIC_API_BASE in app.json
// Production: Set in eas.json build profiles
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:4000";

export const endpoints = {
    requestOtp: `${API_BASE}/api/auth/request-otp`,
    verifyOtp: `${API_BASE}/api/auth/verify-otp`,
    walletPass: `${API_BASE}/api/wallet/pass`,
    googleWalletPass: `${API_BASE}/api/wallet/google-pass`,
    pendingPayments: `${API_BASE}/api/merchant/pending-payments`,
    confirmPayment: `${API_BASE}/api/merchant/confirm-payment`,
    lyptoBalance: `${API_BASE}/api/merchant/lypto-balance`,
    userTransactions: `${API_BASE}/api/merchant/user-transactions`,
    realtime: `${API_BASE}/api/merchant/realtime`,
    analyticsMonthly: `${API_BASE}/api/merchant/analytics/monthly`,
    analyticsDaily: `${API_BASE}/api/merchant/analytics/daily`,
    analyticsStats: `${API_BASE}/api/merchant/analytics/stats`,
    walletBalances: `${API_BASE}/api/merchant/wallet-balances`,
    withdraw: `${API_BASE}/api/merchant/withdraw`,
};
