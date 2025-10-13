import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '@/constants/design';
import { Button } from './ui/Button';
import QRCode from 'react-native-qrcode-svg';

interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
  walletAddress: string;
}

export default function DepositModal({ visible, onClose, walletAddress }: DepositModalProps) {
  const [selectedToken, setSelectedToken] = useState<'SOL' | 'USDC'>('SOL');

  const handleCopyAddress = () => {
    // TODO: Implement clipboard copy
    console.log('Copied address:', walletAddress);
    Alert.alert('Copied!', 'Wallet address copied to clipboard');
  };

  const tokens = [
    {
      symbol: 'SOL',
      name: 'Solana',
      network: 'Solana Devnet',
      icon: '◎',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      network: 'Solana (SPL Token)',
      icon: '💵',
    },
  ];

  const selectedTokenInfo = tokens.find(t => t.symbol === selectedToken);

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
            <Text style={styles.title}>Deposit {selectedToken}</Text>
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
                  <Text
                    style={[
                      styles.tokenSymbol,
                      selectedToken === token.symbol && styles.tokenSymbolActive,
                    ]}
                  >
                    {token.symbol}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* QR Code */}
            <View style={styles.qrContainer}>
              <View style={styles.qrWrapper}>
                {walletAddress ? (
                  <QRCode
                    value={walletAddress}
                    size={200}
                    backgroundColor="white"
                    color="black"
                  />
                ) : (
                  <View style={styles.qrPlaceholder}>
                    <Ionicons name="qr-code-outline" size={100} color={Colors.textSecondary} />
                  </View>
                )}
              </View>
            </View>

            {/* Wallet Address */}
            <View style={styles.addressSection}>
              <Text style={styles.addressLabel}>Your {selectedTokenInfo?.name} Address</Text>
              <View style={styles.addressBox}>
                <Text style={styles.addressText}>{walletAddress || 'Not available'}</Text>
              </View>
              <Button
                variant="secondary"
                size="md"
                style={styles.copyButton}
                onPress={handleCopyAddress}
              >
                <View style={styles.copyButtonContent}>
                  <Ionicons name="copy-outline" size={18} color={Colors.primary} />
                  <Text style={styles.copyButtonText}>Copy Address</Text>
                </View>
              </Button>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <View style={styles.instructionItem}>
                <Ionicons name="alert-circle-outline" size={20} color={Colors.warning} />
                <Text style={styles.instructionText}>
                  Send only {selectedToken} on {selectedTokenInfo?.network}
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
                <Text style={styles.instructionText}>
                  Deposits typically arrive within 1-2 minutes
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
                <Text style={styles.instructionText}>
                  Your funds are secured by Circle's infrastructure
                </Text>
              </View>
            </View>

            {/* Warning */}
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={24} color={Colors.warning} />
              <Text style={styles.warningText}>
                Sending any other asset or using a different network will result in permanent loss of funds.
              </Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <Button variant="primary" size="md" style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Done</Text>
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
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 16,
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
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tokenSymbolActive: {
    color: Colors.primary,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  addressSection: {
    marginBottom: 24,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  addressBox: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  copyButton: {
    borderRadius: 12,
  },
  copyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  copyButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    gap: 12,
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
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
  closeButton: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

