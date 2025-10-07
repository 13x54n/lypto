export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:4000";

export const endpoints = {
	requestOtp: `${API_BASE}/api/auth/request-otp`,
	verifyOtp: `${API_BASE}/api/auth/verify-otp`,
};


