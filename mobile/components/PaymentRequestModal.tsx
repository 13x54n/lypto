import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { endpoints } from '@/constants/api';

interface PaymentRequest {
  id: string;
  merchantEmail: string;
  amount: number;
  createdAt: string;
}

interface PaymentRequestModalProps {
  visible: boolean;
  payment: PaymentRequest | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PaymentRequestModal({ visible, payment, onClose, onConfirm }: PaymentRequestModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!payment) return;

    setLoading(true);
    try {
      const response = await fetch(endpoints.confirmPayment, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: payment.id,
          status: 'confirmed',
        }),
      });

      if (response.ok) {
        Alert.alert('Success! ✅', `Payment of $${payment.amount.toFixed(2)} confirmed!`);
        onConfirm();
        onClose();
      } else {
        Alert.alert('Error', 'Failed to confirm payment');
      }
    } catch {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!payment) return;

    Alert.alert(
      'Decline Payment?',
      'Are you sure you want to decline this payment request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(endpoints.confirmPayment, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paymentId: payment.id,
                  status: 'declined',
                }),
              });

              if (response.ok) {
                Alert.alert('Payment Declined', 'Payment request has been declined.');
                onConfirm();
                onClose();
              } else {
                Alert.alert('Error', 'Failed to decline payment');
              }
            } catch {
              Alert.alert('Error', 'Network error. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!payment) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="card-outline" size={60} color={Colors.primary} />
            <Text style={styles.title}>Payment Request</Text>
          </View>

          <View style={styles.merchantInfo}>
            <Text style={styles.merchantLabel}>From Merchant</Text>
            <Text style={styles.merchantEmail}>{payment.merchantEmail}</Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amount}>${payment.amount.toFixed(2)}</Text>
          </View>

          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.timeText}>
              {new Date(payment.createdAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, loading && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#000" />
                  <Text style={styles.confirmButtonText}>Confirm Payment</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={handleDecline}
              disabled={loading}
            >
              <Ionicons name="close-circle-outline" size={24} color="#ff6b6b" />
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 15,
  },
  merchantInfo: {
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  merchantLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  merchantEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actions: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 15,
    gap: 10,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  declineButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

