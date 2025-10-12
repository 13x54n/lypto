import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import DashboardHeader from '@/components/DashboardHeader';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '@/constants/design';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ListItem } from '@/components/ui/ListItem';
import { useAuth } from '@/contexts/AuthContext';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { endpoints, API_BASE } from '@/constants/api';

interface Transaction {
  id: string;
  merchantEmail: string;
  amount: number;
  lyptoReward: number;
  lyptoMinted: boolean;
  status: string;
  createdAt: string;
}

export default function WalletTab() {
  const { userEmail } = useAuth();
  const [autoRedeemEnabled, setAutoRedeemEnabled] = useState(false);
  const [showPassPreview, setShowPassPreview] = useState(false);
  const [lyptoBalance, setLyptoBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, [userEmail]);

  const loadWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        fetch(`${endpoints.lyptoBalance}?email=${userEmail}`).catch(() => null),
        fetch(`${endpoints.userTransactions}?userEmail=${userEmail}`).catch(() => null),
      ]);

      if (balanceRes?.ok) {
        const balanceData = await balanceRes.json();
        setLyptoBalance(balanceData.balance || 0);
        setTotalEarned(balanceData.totalEarned || 0);
        setWalletAddress(balanceData.walletAddress || '');
      }

      if (transactionsRes?.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions || []);
      }
    } catch (error) {
      console.error('[Wallet] Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWalletData();
  };

  const getTransactionColor = (status: string) => {
    return status === 'confirmed' ? Colors.primary : Colors.textSecondary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 14) {
      return '1 week ago';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getMerchantIcon = (merchantEmail: string) => {
    // Simple heuristic for icons based on merchant email
    if (merchantEmail.includes('coffee') || merchantEmail.includes('starbucks')) return '☕';
    if (merchantEmail.includes('food') || merchantEmail.includes('restaurant')) return '🍔';
    if (merchantEmail.includes('shop') || merchantEmail.includes('store')) return '🛒';
    if (merchantEmail.includes('gas') || merchantEmail.includes('fuel')) return '⛽';
    if (merchantEmail.includes('grocery')) return '🥬';
    return '💳'; // Default icon
  };

  const handleAddToWallet = () => {
    // Show preview modal first
    setShowPassPreview(true);
  };

  const confirmAddToWallet = async () => {
    try {
      setShowPassPreview(false);
      
      if (Platform.OS === 'ios') {
        // For iOS - Download and open .pkpass file
        Alert.alert(
          'Adding to Apple Wallet',
          'Preparing your Lypto pass...',
          [{ text: 'OK' }]
        );

        try {
          // Generate userId from email
          const userId = userEmail?.replace('@', '_at_').replace(/\./g, '_') || 'guest';
          
          // Call backend to download the .pkpass file
          const passUrl = `${endpoints.walletPass}?email=${encodeURIComponent(userEmail || 'guest')}&points=${lyptoBalance}&userId=${userId}`;
          
          // Use new expo-file-system API
          const cacheDir = Paths.cache;
          const fileName = `lypto_${userId}.pkpass`;
          
          // Download the .pkpass file using new API
          const downloadedFile = await File.downloadFileAsync(
            passUrl,
            new File(cacheDir, fileName),
            { idempotent: true } // Overwrite if exists
          );
          
          if (downloadedFile.exists) {
            // Check if it's a small file (likely an error JSON response)
            if (downloadedFile.size < 1000) {
              try {
                const fileContent = await downloadedFile.text();
                const errorData = JSON.parse(fileContent);
                if (errorData.error) {
                  Alert.alert(
                    'Setup Required',
                    errorData.message || 'Please configure wallet certificates on the server.',
                    [{ text: 'OK' }]
                  );
                  return;
                }
              } catch {
                // Not JSON or parsing failed, continue
              }
            }
            
            // Success! Open the .pkpass file
            const canOpen = await Linking.canOpenURL(downloadedFile.uri);
            
            if (canOpen) {
              // Open directly with Wallet app
              await Linking.openURL(downloadedFile.uri);
              
              Alert.alert(
                'Success! 🎉',
                'Opening Apple Wallet... Tap "Add" to add your Lypto card with NFC support!',
                [{ text: 'OK' }]
              );
            } else {
              // Use sharing as fallback
              const sharingAvailable = await Sharing.isAvailableAsync();
              if (sharingAvailable) {
                await Sharing.shareAsync(downloadedFile.uri, {
                  UTI: 'com.apple.pkpass',
                  mimeType: 'application/vnd.apple.pkpass',
                });
              } else {
                Alert.alert('Error', 'Unable to add pass to Wallet. Please try again.');
              }
            }
          } else {
            throw new Error('Failed to download pass');
          }
        } catch (error) {
          console.error('Error downloading pass:', error);
          
          // Fallback: Try to open a wallet pass URL directly
          const walletPassUrl = `${API_BASE}/api/wallet/pass?email=${encodeURIComponent(userEmail || 'guest')}`;
          
          Linking.openURL(walletPassUrl).catch(() => {
            Alert.alert(
              'Setup Required',
              'To add this card to Apple Wallet, please:\n\n1. Ensure you have iOS 15 or later\n2. Open this link in Safari\n3. Tap "Add to Apple Wallet"\n\nWould you like to copy the link?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Copy Link',
                  onPress: () => {
                    Alert.alert('Link Copied', 'Paste in Safari to add to Wallet');
                  },
                },
              ]
            );
          });
        }
      } else if (Platform.OS === 'android') {
        // For Android - Use Google Wallet API
        try {
          // Call backend to generate Google Wallet pass
          const response = await fetch(endpoints.googleWalletPass, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userEmail || 'guest',
              points: lyptoBalance,
            }),
          });
          
          const data = await response.json();
          
          if (data.success) {
            // Show information about the pass
            Alert.alert(
              'Pass Ready! 📱',
              data.message + '\n\n' + data.note,
              [
                {
                  text: 'OK',
                  style: 'default',
                },
              ]
            );
            return;
          }
          
          // If we get a save URL from backend, use it
          const googleWalletUrl = data.saveUrl || `https://pay.google.com/gp/v/save/${encodeURIComponent(data.loyaltyObject.id)}`;
          
          // Try to open Google Wallet
          const canOpen = await Linking.canOpenURL(googleWalletUrl);
          
          if (canOpen) {
            await Linking.openURL(googleWalletUrl);
            
            setTimeout(() => {
              Alert.alert(
                'Opening Google Wallet',
                'Your Lypto loyalty card will be added to Google Wallet.',
                [{ text: 'OK' }]
              );
            }, 1000);
          } else {
            // Fallback: Open Google Wallet web page
            const webUrl = 'https://pay.google.com/gp/w/home/loyalty';
            await Linking.openURL(webUrl);
            
            Alert.alert(
              'Setup Required',
              'Please install Google Wallet from the Play Store to add loyalty cards.',
              [
                {
                  text: 'Install',
                  onPress: () => {
                    Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel');
                  },
                },
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
              ]
            );
          }
        } catch (error) {
          console.error('Error opening Google Wallet:', error);
          Alert.alert('Error', 'Failed to open Google Wallet. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error adding to wallet:', error);
      Alert.alert('Error', 'Failed to add card to wallet. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <DashboardHeader totalPoints={lyptoBalance} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DashboardHeader totalPoints={lyptoBalance} />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Balance Overview */}
        <View style={styles.balancesRow}>
          <View style={styles.balanceLeft}>
            <Text style={styles.balanceAmount}>{lyptoBalance.toLocaleString()} LYPTO</Text>
            <Text style={styles.balanceValue}>Total Earned: {totalEarned.toLocaleString()}</Text>
          </View>
          <View style={styles.balanceRight}>
            {walletAddress && (
            <View style={styles.assetPill}>
                <Ionicons name="wallet-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.assetSymbol}>{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</Text>
            </View>
            )}
          </View>
        </View>

        <View style={styles.autoRedeemRow}>
          <Text style={styles.autoRedeemText}>Auto Redeem Points</Text>
          <Switch
            value={autoRedeemEnabled}
            onValueChange={setAutoRedeemEnabled}
            style={styles.switchSmall}
          />
        </View>

        <View style={styles.autoRedeemInfoRow}>
          <Text style={styles.autoRedeemInfoText}>{autoRedeemEnabled ? "- Your points will be redeemed automatically." : "- Points will not be redeemed automatically."}</Text>
        </View>
        <View style={styles.actionsRow}>
          <Button variant="secondary" size="sm" style={[styles.actionButton, styles.actionButtonDeposit]} onPress={() => { /* TODO: implement deposit */ }}>
            <View style={styles.actionButtonContent}>
              <Ionicons name="arrow-down-circle-outline" size={16} color={Colors.textPrimary} />
              <Text style={styles.actionButtonText}>Deposit</Text>
            </View>
          </Button>
          <Button variant="secondary" size="sm" style={[styles.actionButton, styles.actionButtonWithdraw]} onPress={() => { /* TODO: implement withdraw */ }}>
            <View style={styles.actionButtonContent}>
              <Ionicons name="arrow-up-circle-outline" size={16} color={Colors.textPrimary} />
              <Text style={styles.actionButtonText}>Withdraw</Text>
            </View>
          </Button>
        </View>

        {/* Add Card to Wallet */}
        <View style={styles.section}>
            <TouchableOpacity 
              style={styles.addCardButton}
              activeOpacity={0.7}
              onPress={handleAddToWallet}
            >
              <View style={styles.addCardIconContainer}>
                <Ionicons name="add-circle" size={24} color={Colors.primary} />
              </View>
              <View style={styles.addCardContent}>
                <Text style={styles.addCardTitle}>Add Card to {Platform.OS === 'ios' ? 'Apple' : 'Google'} Wallet 💳</Text>
                <Text style={styles.addCardSubtitle}>Access your points on the go</Text>
          </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <Badge color="neutral">Last 30 days</Badge>
          </View>
        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.filtersLeft}>
            <Button variant="primary" size="sm">All</Button>
            <Button variant="secondary" size="sm">Earned</Button>
            <Button variant="secondary" size="sm">Spent</Button>
          </View>
          <Button variant="ghost" size="sm" onPress={() => { /* TODO: implement export */ }}>
            <View style={styles.exportContent}>
              <Ionicons name="download-outline" size={16} color="#000" />
              <Text style={styles.exportText}>Export</Text>
            </View>
          </Button>
        </View>
        
          <View style={styles.listStack}>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyStateText}>No transactions yet</Text>
                <Text style={styles.emptyStateSubtext}>Your transaction history will appear here</Text>
              </View>
            ) : (
              transactions.map((transaction) => (
              <ListItem
                key={transaction.id}
                  title={transaction.merchantEmail}
                  subtitle={formatDate(transaction.createdAt)}
                left={
                  <View style={styles.leftIcon}>
                      <Text style={styles.leftEmoji}>{getMerchantIcon(transaction.merchantEmail)}</Text>
                  </View>
                }
                right={
                    <View>
                      <Text style={[styles.pointsText, { color: getTransactionColor(transaction.status) }]}>
                        +{transaction.lyptoReward} LYPTO
                  </Text>
                      <Text style={styles.transactionAmount}>${transaction.amount.toFixed(2)}</Text>
                    </View>
                }
              />
              ))
            )}
          </View>
        </View>

        {/* Load More */}
        <View style={styles.loadMoreRow}>
          <Button variant="ghost" size="md" style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More Transactions</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.primary} />
          </Button>
        </View>
      </ScrollView>

      {/* Pass Preview Modal */}
      <Modal
        visible={showPassPreview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPassPreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Preview Pass</Text>
              <TouchableOpacity onPress={() => setShowPassPreview(false)}>
                <Ionicons name="close-circle" size={28} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Pass Card Preview */}
            <View style={styles.passCard}>
              <View style={styles.passCardHeader}>
                <View style={styles.passLogo}>
                  <Text style={styles.passLogoText}>L</Text>
                </View>
                <View>
                  <Text style={styles.passCompanyName}>Lypto</Text>
                  <Text style={styles.passType}>{userEmail || 'guest@lypto.app'}</Text>
                </View>
              </View>

              <View style={styles.passBody}>
                <View style={styles.passBarcodeArea}>
                  <View style={styles.passBarcode}>
                    <Text style={styles.passBarcodeText}>|||| |||| |||| ||||</Text>
                  </View>
                  <Text style={styles.passBarcodeNumber}>{lyptoBalance.toLocaleString()} LYPTO</Text>
                </View>

                <View style={styles.passInfo}>
                  <View style={styles.passInfoRow}>
                    <View style={styles.passInfoItem}>
                      <Text style={styles.passInfoLabel}>BALANCE</Text>
                      <Text style={styles.passInfoValue}>{lyptoBalance.toLocaleString()}</Text>
                    </View>
                    {totalEarned > 0 && (
                      <View style={styles.passInfoItem}>
                        <Text style={styles.passInfoLabel}>TOTAL EARNED</Text>
                        <Text style={styles.passInfoValue}>{totalEarned.toLocaleString()}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.passFooter}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
                <Text style={styles.passFooterText}>Secure Digital Pass</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <Button
                variant="primary"
                size="md"
                style={styles.confirmButton}
                onPress={confirmAddToWallet}
              >
                <View style={styles.confirmButtonContent}>
                  <Ionicons name={Platform.OS === 'ios' ? 'logo-apple' : 'logo-google'} size={20} color="#fff" />
                  <Text style={styles.confirmButtonText}>
                    Add to {Platform.OS === 'ios' ? 'Apple' : 'Google'} Wallet
                  </Text>
                </View>
              </Button>
              <Button
                variant="secondary"
                size="md"
                style={styles.cancelButton}
                onPress={() => setShowPassPreview(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: Typography.title,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptyStateSubtext: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
  balancesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLeft: {
  },
  balanceRight: {
    flexDirection: 'column',
    gap: 8,
  },
  balanceLabel: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: Typography.title,
    color: Colors.textMuted,
  },
  assetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  assetSymbol: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginRight: 2,
  },
  assetAmount: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  filtersLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  
  section: {
    marginTop: 12,
    // borderTopWidth: 1,
    // borderTopColor: Colors.border,
    paddingTop: 20,
    
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  listStack: {
    gap: 8,
    marginTop: 8,
  },
  leftIcon: {
    width: 44,
    height: 44,
    // backgroundColor: Colors.border,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftEmoji: {
    fontSize: 20,
  },
  pointsText: {
    fontSize: Typography.title,
    fontWeight: '600',
  },
  loadMoreRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadMoreText: {
    fontSize: Typography.body,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  exportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  exportText: {
    color: "#000",
    fontWeight: '600',
  },
  autoRedeemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginTop: 16,
  },
  autoRedeemText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  switchSmall: {
    transform: [{ scale: 0.85 }],
  },
  autoRedeemInfoRow: {
    marginTop: 8,
  },
  autoRedeemInfoText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDeposit: {
    backgroundColor: 'rgba(46, 213, 115,1.0)',
    borderWidth: 0,
  },
  actionButtonWithdraw: {
    backgroundColor: 'rgba(255, 107, 129,1.0)',
    borderWidth: 0,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addCardIconContainer: {
    marginRight: 12,
  },
  addCardContent: {
    flex: 1,
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  addCardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  passCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  passLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  passLogoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  passCompanyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  passType: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  passBody: {
    marginBottom: 16,
  },
  passBarcodeArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  passBarcode: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  passBarcodeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 4,
  },
  passBarcodeNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  passInfo: {
    marginTop: 8,
  },
  passInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  passInfoItem: {
    alignItems: 'center',
  },
  passInfoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  passInfoValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  passFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  passFooterText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  modalActions: {
    gap: 12,
  },
  confirmButton: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  confirmButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  cancelButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
