/**
 * Real-time Service using Server-Sent Events (SSE)
 * Provides real-time payment status updates to mobile and merchant apps
 */

type PaymentUpdateListener = (data: any) => void;

class RealtimeService {
	private listeners: Map<string, Set<PaymentUpdateListener>> = new Map();

	/**
	 * Subscribe to payment updates for a specific email
	 */
	subscribe(email: string, listener: PaymentUpdateListener): () => void {
		if (!this.listeners.has(email)) {
			this.listeners.set(email, new Set());
		}
		
		this.listeners.get(email)!.add(listener);
		console.log(`📡 ${email} subscribed to real-time updates`);

		// Return unsubscribe function
		return () => {
			const emailListeners = this.listeners.get(email);
			if (emailListeners) {
				emailListeners.delete(listener);
				if (emailListeners.size === 0) {
					this.listeners.delete(email);
				}
			}
			console.log(`📴 ${email} unsubscribed from real-time updates`);
		};
	}

	/**
	 * Notify all subscribers for a specific email
	 */
	notify(email: string, data: any): void {
		const emailListeners = this.listeners.get(email);
		if (emailListeners && emailListeners.size > 0) {
			console.log(`📤 Sending real-time update to ${email}:`, data.type);
			emailListeners.forEach(listener => {
				try {
					listener(data);
				} catch (error) {
					console.error('Error calling listener:', error);
				}
			});
		}
	}

	/**
	 * Notify payment status update (for both customer and merchant)
	 */
	notifyPaymentUpdate(payment: any): void {
		const updateData = {
			type: 'payment_update',
			paymentId: payment._id?.toString() || payment.id,
			status: payment.status,
			amount: payment.amount,
			lyptoReward: payment.lyptoReward,
			lyptoMinted: payment.lyptoMinted,
			timestamp: new Date().toISOString(),
		};

		// Notify customer
		this.notify(payment.userEmail, {
			...updateData,
			role: 'customer',
			merchantEmail: payment.merchantEmail,
		});

		// Notify merchant
		this.notify(payment.merchantEmail, {
			...updateData,
			role: 'merchant',
			userEmail: payment.userEmail,
		});
	}

	/**
	 * Notify LYPTO minted event
	 */
	notifyLyptoMinted(userEmail: string, amount: number, newBalance: number, txSignature: string): void {
		this.notify(userEmail, {
			type: 'lypto_minted',
			amount,
			newBalance,
			txSignature,
			timestamp: new Date().toISOString(),
		});
	}

	/**
	 * Get active subscribers count
	 */
	getSubscriberCount(): number {
		let total = 0;
		this.listeners.forEach(set => {
			total += set.size;
		});
		return total;
	}

	/**
	 * Get stats
	 */
	getStats() {
		return {
			totalEmails: this.listeners.size,
			totalSubscribers: this.getSubscriberCount(),
			emails: Array.from(this.listeners.keys()),
		};
	}
}

// Singleton instance
export const realtimeService = new RealtimeService();

