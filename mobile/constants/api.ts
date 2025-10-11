export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://10.0.0.144:4000";

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
};
