import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Alert, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { endpoints } from '@/constants/api';
import { usePayment } from '@/contexts/PaymentContext';

export default function GlobalPaymentAuthModal() {
  const { currentPayment, dismissPayment } = usePayment();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hasVibrated, setHasVibrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (currentPayment) {
      setVisible(true);
      setIsProcessing(false); // Reset processing flag for new payment
      // Vibrate only once when a new payment is detected
      if (!hasVibrated) {
        Vibration.vibrate([0, 200, 100, 200]);
        setHasVibrated(true);
      }
    } else {
      setVisible(false);
      setHasVibrated(false); // Reset for next payment
      setIsProcessing(false);
    }
  }, [currentPayment, hasVibrated]);

  const handleConfirm = async () => {
    if (!currentPayment || loading || isProcessing) return;

    setIsProcessing(true);
    setLoading(true);
    
    try {
      const response = await fetch(endpoints.confirmPayment, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: currentPayment.id,
          status: 'confirmed',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success! ✅', `Payment of $${currentPayment.amount.toFixed(2)} confirmed!`);
        dismissPayment();
      } else if (data.error === 'Payment already processed') {
        // Payment was already confirmed (maybe from notification action or double-tap)
        console.log('Payment already processed, dismissing');
        dismissPayment();
      } else {
        Alert.alert('Error', data.message || 'Failed to confirm payment');
        setIsProcessing(false);
      }
    } catch {
      Alert.alert('Error', 'Network error. Please try again.');
      setIsProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!currentPayment || isProcessing) return;

    Alert.alert(
      'Decline Payment?',
      'Are you sure you want to decline this payment request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            setLoading(true);
            try {
              const response = await fetch(endpoints.confirmPayment, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paymentId: currentPayment.id,
                  status: 'declined',
                }),
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert('Payment Declined', 'Payment request has been declined.');
                dismissPayment();
              } else if (data.error === 'Payment already processed') {
                console.log('Payment already processed, dismissing');
                dismissPayment();
              } else {
                Alert.alert('Error', data.message || 'Failed to decline payment');
                setIsProcessing(false);
              }
            } catch {
              Alert.alert('Error', 'Network error. Please try again.');
              setIsProcessing(false);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!currentPayment) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="card-outline" size={60} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Payment Authorization Required</Text>
          <Text style={styles.subtitle}>A merchant is requesting payment</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.merchantCard}>
            <Ionicons name="storefront" size={32} color={Colors.primary} />
            <View style={styles.merchantInfo}>
              <Text style={styles.merchantLabel}>MERCHANT</Text>
              <Text style={styles.merchantEmail}>{currentPayment.merchantEmail}</Text>
            </View>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Requesting</Text>
            <Text style={styles.amount}>${currentPayment.amount.toFixed(2)}</Text>
            <Text style={styles.amountSubtext}>
              {new Date(currentPayment.createdAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              The merchant will be notified once you confirm or decline this payment.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton, (loading || isProcessing) && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={loading || isProcessing}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#000" />
                <Text style={styles.confirmButtonText}>Authorize Payment</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.declineButton, (loading || isProcessing) && styles.buttonDisabled]}
            onPress={handleDecline}
            disabled={loading || isProcessing}
          >
            <Ionicons name="close-circle-outline" size={24} color="#ff6b6b" />
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: Colors.surface,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  merchantCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 40,
    alignItems: 'center',
    gap: 15,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 5,
    letterSpacing: 1,
  },
  merchantEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amount: {
    fontSize: 64,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  amountSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(85, 239, 196, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(85, 239, 196, 0.2)',
    padding: 15,
    borderRadius: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    padding: 30,
    paddingBottom: 50,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    gap: 10,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  declineButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  declineButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6b6b',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

