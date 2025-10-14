import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { endpoints } from '@/constants/api';

interface PaymentRequest {
  id: string;
  merchantEmail: string;
  amount: number;
  createdAt: string;
  userId: string;
  userEmail: string;
}

interface PaymentContextType {
  currentPayment: PaymentRequest | null;
  dismissPayment: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const { userEmail, isAuthenticated } = useAuth();
  const [currentPayment, setCurrentPayment] = useState<PaymentRequest | null>(null);
  const [shownPaymentIds, setShownPaymentIds] = useState<Set<string>>(new Set());
  const currentPaymentRef = useRef<PaymentRequest | null>(null);
  const shownPaymentIdsRef = useRef<Set<string>>(new Set());

  // Keep refs in sync with state
  useEffect(() => {
    currentPaymentRef.current = currentPayment;
  }, [currentPayment]);

  useEffect(() => {
    shownPaymentIdsRef.current = shownPaymentIds;
  }, [shownPaymentIds]);

  useEffect(() => {
    if (!isAuthenticated || !userEmail) {
      setShownPaymentIds(new Set()); // Reset when logged out
      setCurrentPayment(null);
      return;
    }

    console.log('[PaymentContext] Starting payment monitoring for:', userEmail);

    const checkForPayments = async () => {
      try {
        console.log('[PaymentContext] Checking for payments...');
        const response = await fetch(`${endpoints.pendingPayments}?userEmail=${userEmail}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`[PaymentContext] Found ${data.payments?.length || 0} pending payments`);

          // Use ref to get current value without causing re-render loop
          const activePayment = currentPaymentRef.current;
          const currentShownIds = shownPaymentIdsRef.current;

          console.log('[PaymentContext] Current payment:', activePayment?.id);
          console.log('[PaymentContext] Shown payment IDs:', Array.from(currentShownIds));

          // If we're showing a payment, check if it's still pending
          if (activePayment) {
            const stillPending = data.payments?.some(
              (payment: PaymentRequest) => payment.id === activePayment.id
            );

            console.log(`[PaymentContext] Payment ${activePayment.id} still pending: ${stillPending}`);

            // If payment is no longer pending, it was processed (confirmed/declined)
            if (!stillPending) {
              console.log('✅ Payment processed externally, dismissing modal');
              setCurrentPayment(null);
              return;
            }
            // Still pending, don't look for new ones
            return;
          }

          // Only look for new payments if we're not showing one
          const newPayment = data.payments?.find(
            (payment: PaymentRequest) => !currentShownIds.has(payment.id)
          );

          if (newPayment) {
            console.log('🚨 NEW PAYMENT REQUEST DETECTED!', newPayment);
            setCurrentPayment(newPayment);
            setShownPaymentIds(prev => {
              const newSet = new Set([...prev, newPayment.id]);
              console.log('[PaymentContext] Added payment to shown IDs:', newPayment.id);
              console.log('[PaymentContext] Total shown payments:', newSet.size);
              return newSet;
            });
          } else {
            console.log('[PaymentContext] No new payments found');
          }
        } else {
          console.error('[PaymentContext] Failed to fetch payments:', response.status);
        }
      } catch (error) {
        console.error('[PaymentContext] Error checking for payments:', error);
      }
    };

    // Check immediately
    checkForPayments();

    // Poll every 3 seconds for new payments
    const interval = setInterval(checkForPayments, 3000);
    return () => clearInterval(interval);
  }, [userEmail, isAuthenticated]);

  const dismissPayment = () => {
    setCurrentPayment(null);
  };

  return (
    <PaymentContext.Provider value={{ currentPayment, dismissPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}

