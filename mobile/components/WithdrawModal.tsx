import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/design';
import { Button } from './ui/Button';

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  walletAddress: string;
  solBalance: number;
  usdcBalance: number;
  onWithdraw: (token: 'SOL' | 'USDC', amount: string, destination: string) => Promise<void>;
}

export default function WithdrawModal({
  visible,
  onClose,
  walletAddress,
  solBalance,
  usdcBalance,
  onWithdraw,
}: WithdrawModalProps) {
  const [selectedToken, setSelectedToken] = useState<'SOL' | 'USDC'>('SOL');
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const currentBalance = selectedToken === 'SOL' ? solBalance : usdcBalance;

  const handleMaxAmount = () => {
    setAmount(currentBalance.toString());
  };

  const handleWithdraw = async () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > currentBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    if (!destinationAddress || destinationAddress.length < 32) {
      Alert.alert('Error', 'Please enter a valid destination address');
      return;
    }

    // Confirm withdrawal
    Alert.alert(
      'Confirm Withdrawal',
      `Withdraw ${amount} ${selectedToken} to:\n${destinationAddress.slice(0, 6)}...${destinationAddress.slice(-6)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await onWithdraw(selectedToken, amount, destinationAddress);
              
              // Reset form
              setAmount('');
              setDestinationAddress('');
              
              Alert.alert('Success', 'Withdrawal initiated successfully', [
                { text: 'OK', onPress: onClose },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to process withdrawal');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const tokens = [
    {
      symbol: 'SOL',
      name: 'Solana',
      balance: solBalance,
      icon: '◎',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: usdcBalance,
      icon: '💵',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Withdraw</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Token Selection */}
            <View style={styles.tokenSelector}>
              {tokens.map((token) => (
                <TouchableOpacity
                  key={token.symbol}
                  style={[
                    styles.tokenButton,
                    selectedToken === token.symbol && styles.tokenButtonActive,
                  ]}
                  onPress={() => setSelectedToken(token.symbol as 'SOL' | 'USDC')}
                >
                  <Text style={styles.tokenIcon}>{token.icon}</Text>
                  <View style={styles.tokenInfo}>
                    <Text
                      style={[
                        styles.tokenSymbol,
                        selectedToken === token.symbol && styles.tokenSymbolActive,
                      ]}
                    >
                      {token.symbol}
                    </Text>
                    <Text style={styles.tokenBalance}>
                      {token.balance.toFixed(token.symbol === 'SOL' ? 4 : 2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Amount Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textMuted}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
                <TouchableOpacity style={styles.maxButton} onPress={handleMaxAmount}>
                  <Text style={styles.maxButtonText}>MAX</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceText}>
                Available: {currentBalance.toFixed(selectedToken === 'SOL' ? 4 : 2)} {selectedToken}
              </Text>
            </View>

            {/* Destination Address */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Destination Address</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter Solana wallet address"
                placeholderTextColor={Colors.textMuted}
                value={destinationAddress}
                onChangeText={setDestinationAddress}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <Text style={styles.helperText}>
                Make sure the address is on Solana {selectedToken === 'USDC' ? 'SPL' : 'network'}
              </Text>
            </View>

            {/* Fee Info */}
            <View style={styles.feeBox}>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Network Fee</Text>
                <Text style={styles.feeValue}>~0.000005 SOL</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>You&apos;ll Receive</Text>
                <Text style={styles.feeValueBold}>
                  {amount || '0.00'} {selectedToken}
                </Text>
              </View>
            </View>

            {/* Warning */}
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color={Colors.warning} />
              <Text style={styles.warningText}>
                Double-check the destination address. Cryptocurrency transactions are irreversible.
              </Text>
            </View>
          </ScrollView>

          {/* Withdraw Button */}
          <Button
            variant="primary"
            size="md"
            style={styles.withdrawButton}
            onPress={handleWithdraw}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.withdrawButtonText}>Withdraw {selectedToken}</Text>
            )}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  tokenSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tokenButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  tokenButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(85, 239, 196, 0.1)',
  },
  tokenIcon: {
    fontSize: 24,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tokenSymbolActive: {
    color: Colors.primary,
  },
  tokenBalance: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingVertical: 16,
  },
  maxButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  maxButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  balanceText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  addressInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  feeBox: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  feeValue: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  feeValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255, 107, 129, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 129, 0.3)',
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: Colors.warning,
    lineHeight: 18,
  },
  withdrawButton: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  withdrawButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

