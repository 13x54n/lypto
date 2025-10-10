import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!isAuthenticated || !userEmail) {
      setShownPaymentIds(new Set()); // Reset when logged out
      setCurrentPayment(null);
      return;
    }

    const checkForPayments = async () => {
      try {
        const response = await fetch(`${endpoints.pendingPayments}?userEmail=${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          
          // If we're showing a payment, check if it's still pending
          if (currentPayment) {
            const stillPending = data.payments?.some(
              (payment: PaymentRequest) => payment.id === currentPayment.id
            );
            
            // If payment is no longer pending, it was processed (confirmed/declined)
            if (!stillPending) {
              console.log('✅ Payment processed externally, dismissing modal');
              dismissPayment();
              return;
            }
            // Still pending, don't look for new ones
            return;
          }
          
          // Only look for new payments if we're not showing one
          const newPayment = data.payments?.find(
            (payment: PaymentRequest) => !shownPaymentIds.has(payment.id)
          );

          if (newPayment) {
            console.log('🚨 NEW PAYMENT REQUEST DETECTED!', newPayment);
            setCurrentPayment(newPayment);
            setShownPaymentIds(prev => new Set([...prev, newPayment.id]));
          }
        }
      } catch (error) {
        console.error('Error checking for payments:', error);
      }
    };

    // Check immediately
    checkForPayments();

    // Poll every 3 seconds for new payments
    const interval = setInterval(checkForPayments, 3000);
    return () => clearInterval(interval);
  }, [userEmail, isAuthenticated, currentPayment]);

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

