import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { endpoints } from '../../constants/api';
import { useAuth } from '../../contexts/AuthContext';

interface Transaction {
  id: string;
  userEmail: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'declined';
  createdAt: string;
}

interface Stats {
  today: { count: number; total: number; lyptoMinted: number };
  week: { count: number; total: number; lyptoMinted: number };
  month: { count: number; total: number; lyptoMinted: number };
  allTime?: { lyptoMinted: number };
}

export default function TransactionsScreen() {
  const { merchantEmail } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Scanner states
  const [showScanner, setShowScanner] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [amount, setAmount] = useState('');
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'declined'>('pending');
  const [scannedData, setScannedData] = useState<{ userId: string; points: string; userEmail: string } | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Poll payment status when on waiting screen
  useEffect(() => {
    if (!showWaiting || !currentPaymentId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`${endpoints.getTransactions}?merchantEmail=${merchantEmail}`);
        if (response.ok) {
          const data = await response.json() as { transactions?: Array<{ id: string; status: string }> };
          const payment = data.transactions?.find((t) => t.id === currentPaymentId);
          if (payment && payment.status !== 'pending') {
            setPaymentStatus(payment.status as 'pending' | 'confirmed' | 'declined');
            loadData(); // Refresh transactions list
          }
        }
      } catch {
        console.error('Error polling status');
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [showWaiting, currentPaymentId, merchantEmail, pollStatus, loadData]);

  const loadData = async () => {
    try {
      console.log('[Merchant] Loading data for:', merchantEmail);
      console.log('[Merchant] Transactions URL:', `${endpoints.getTransactions}?merchantEmail=${merchantEmail}`);
      console.log('[Merchant] Stats URL:', `${endpoints.getStats}?merchantEmail=${merchantEmail}`);
      
      const [transactionsRes, statsRes] = await Promise.all([
        fetch(`${endpoints.getTransactions}?merchantEmail=${merchantEmail}`).catch(err => {
          console.error('[Merchant] Transactions fetch error:', err);
          return { ok: false };
        }),
        fetch(`${endpoints.getStats}?merchantEmail=${merchantEmail}`).catch(err => {
          console.error('[Merchant] Stats fetch error:', err);
          return { ok: false };
        }),
      ]);

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        console.log('[Merchant] Loaded', transactionsData.transactions?.length || 0, 'transactions');
        setTransactions(transactionsData.transactions || []);
      } else {
        console.warn('[Merchant] Transactions request failed');
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('[Merchant] Stats loaded:', statsData);
        setStats(statsData);
      } else {
        console.warn('[Merchant] Stats request failed');
      }
    } catch (error) {
      console.error('[Merchant] Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleStartPayment = () => {
    setShowAmountModal(true);
  };

  const handleAmountConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    
    setShowAmountModal(false);
    setShowScanner(true);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || !data) return;
    
    // Validate QR code format before processing
    if (!data.startsWith('LYPTO:')) {
      console.log('Invalid QR format:', data);
      return; // Ignore invalid QR codes silently
    }
    
    const parts = data.split(':');
    if (parts.length !== 3) {
      console.log('Invalid QR parts:', parts);
      return; // Ignore invalid QR codes silently
    }
    
    // Valid QR code detected!
    setScanned(true);
    setShowScanner(false);
    
    const userId = parts[1];
    const points = parts[2];
    await createPaymentRequest(userId, points);
  };

  const createPaymentRequest = async (userId: string, points: string) => {
    if (processingPayment) return;
    
    setProcessingPayment(true);
    try {
      const userEmail = userId.replace(/_at_/g, '@').replace(/_/g, '.');
      
      const response = await fetch(endpoints.createPayment, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userEmail,
          amount: parseFloat(points),
          merchantEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentPaymentId(data.paymentId);
        setScannedData({ userId, points, userEmail });
        setPaymentStatus('pending');
        setShowWaiting(true);
      } else {
        Alert.alert('Error', data.message || 'Failed to create payment');
        resetFlow();
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
      resetFlow();
    } finally {
      setProcessingPayment(false);
    }
  };

  const resetFlow = () => {
    setScanned(false);
    setShowScanner(false);
    setShowWaiting(false);
    setShowAmountModal(false);
    setAmount('');
    setScannedData(null);
    setCurrentPaymentId(null);
    setPaymentStatus('pending');
    setProcessingPayment(false);
  };

  const handleCancelAmount = () => {
    setShowAmountModal(false);
    setAmount('');
  };

  const handleCancelScanner = () => {
    setShowScanner(false);
    setScanned(false);
  };

  const renderStatCard = (title: string, count: number, total: number, icon: keyof typeof Ionicons.glyphMap) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color="#55efc4" />
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statCount}>{count} transactions</Text>
      <Text style={styles.statTotal}>${total.toFixed(2)}</Text>
    </View>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Ionicons 
          name={item.status === 'confirmed' ? 'checkmark-circle' : item.status === 'declined' ? 'close-circle' : 'time'} 
          size={24} 
          color={item.status === 'confirmed' ? '#55efc4' : item.status === 'declined' ? '#ff6b6b' : '#999'} 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionEmail}>{item.userEmail}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
        <Text style={[
          styles.transactionStatus,
          item.status === 'confirmed' && styles.statusConfirmed,
          item.status === 'declined' && styles.statusDeclined,
          item.status === 'pending' && styles.statusPending,
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#55efc4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showWaiting ? (
        // Waiting Screen
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Payment Request</Text>
            <Text style={styles.subtitle}>
              {paymentStatus === 'pending' ? 'Waiting for customer...' : 
               paymentStatus === 'confirmed' ? 'Payment Confirmed!' : 'Payment Declined'}
            </Text>
          </View>

          <View style={styles.waitingContainer}>
            {paymentStatus === 'pending' && (
              <>
                <ActivityIndicator size="large" color="#55efc4" style={styles.waitingSpinner} />
                <Ionicons name="hourglass-outline" size={80} color="#55efc4" />
                <Text style={styles.waitingTitle}>Waiting for Confirmation</Text>
                <Text style={styles.waitingText}>
                  The customer will receive a notification to confirm this payment
                </Text>
              </>
            )}

            {paymentStatus === 'confirmed' && (
              <>
                <View style={styles.successCircle}>
                  <Ionicons name="checkmark" size={80} color="#55efc4" />
                </View>
                <Text style={styles.successTitle}>Payment Confirmed! ✅</Text>
                <Text style={styles.successText}>
                  The payment has been successfully processed
                </Text>
              </>
            )}

            {paymentStatus === 'declined' && (
              <>
                <View style={styles.errorCircle}>
                  <Ionicons name="close" size={80} color="#ff6b6b" />
                </View>
                <Text style={styles.errorTitle}>Payment Declined</Text>
                <Text style={styles.errorText}>
                  The customer declined this payment request
                </Text>
              </>
            )}

            <View style={styles.paymentDetailsCard}>
              <View style={styles.paymentDetailRow}>
                <Text style={styles.paymentDetailLabel}>Amount</Text>
                <Text style={styles.paymentDetailValue}>${amount}</Text>
              </View>
              <View style={styles.paymentDetailRow}>
                <Text style={styles.paymentDetailLabel}>Customer</Text>
                <Text style={styles.paymentDetailValue}>{scannedData?.userEmail}</Text>
              </View>
            </View>

            {paymentStatus !== 'pending' && (
              <TouchableOpacity style={styles.doneButton} onPress={resetFlow}>
                <Text style={styles.doneButtonText}>Done</Text>
                <Ionicons name="checkmark-circle" size={20} color="#000" />
              </TouchableOpacity>
            )}

            {paymentStatus === 'pending' && (
              <TouchableOpacity style={styles.cancelWaitingButton} onPress={resetFlow}>
                <Text style={styles.cancelWaitingText}>Cancel & Go Back</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        // Transactions List
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Transactions</Text>
            <Text style={styles.subtitle}>{merchantEmail}</Text>
          </View>

          {stats && (
            <>
              <View style={styles.statsContainer}>
                {renderStatCard('Today', stats.today.count, stats.today.total, 'today-outline')}
                {renderStatCard('This Week', stats.week.count, stats.week.total, 'calendar-outline')}
                {renderStatCard('This Month', stats.month.count, stats.month.total, 'stats-chart-outline')}
              </View>
              
              {/* LYPTO Stats */}
              {/* <View style={styles.lyptoStatsCard}>
                <View style={styles.lyptoHeader}>
                  <Ionicons name="diamond" size={28} color="#55efc4" />
                  <Text style={styles.lyptoTitle}>LYPTO Rewards Distributed</Text>
                </View>
                <View style={styles.lyptoStatsRow}>
                  <View style={styles.lyptoStatItem}>
                    <Text style={styles.lyptoStatLabel}>Today</Text>
                    <Text style={styles.lyptoStatValue}>{stats.today.lyptoMinted || 0}</Text>
                  </View>
                  <View style={styles.lyptoStatItem}>
                    <Text style={styles.lyptoStatLabel}>This Week</Text>
                    <Text style={styles.lyptoStatValue}>{stats.week.lyptoMinted || 0}</Text>
                  </View>
                  <View style={styles.lyptoStatItem}>
                    <Text style={styles.lyptoStatLabel}>This Month</Text>
                    <Text style={styles.lyptoStatValue}>{stats.month.lyptoMinted || 0}</Text>
                  </View>
                  {stats.allTime && (
                    <View style={styles.lyptoStatItem}>
                      <Text style={styles.lyptoStatLabel}>All Time</Text>
                      <Text style={styles.lyptoStatValue}>{stats.allTime.lyptoMinted || 0}</Text>
                    </View>
                  )}
                </View>
              </View> */}
            </>
          )}

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Ionicons name="refresh" size={24} color="#55efc4" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#55efc4" />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={60} color="#666" />
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Tap the button below to create a payment</Text>
              </View>
            }
          />

          {/* Floating Action Button */}
          <TouchableOpacity style={styles.fab} onPress={handleStartPayment}>
            <Ionicons name="add" size={32} color="#000" />
          </TouchableOpacity>
        </>
      )}

      {/* Amount Modal */}
      <Modal
        visible={showAmountModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelAmount}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalOverlayTouchable} 
            activeOpacity={1} 
            onPress={handleCancelAmount}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Enter Payment Amount</Text>
                  <TouchableOpacity onPress={handleCancelAmount}>
                    <Ionicons name="close-circle" size={28} color="#999" />
                  </TouchableOpacity>
                </View>

                <View style={styles.amountInfoCard}>
                  <Ionicons name="cash-outline" size={40} color="#55efc4" />
                  <Text style={styles.amountInfoText}>
                    How much would you like to charge?
                  </Text>
                </View>

                <View style={styles.amountContainer}>
                  <Text style={styles.dollarSign}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor="#666"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    autoFocus
                  />
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleAmountConfirm}>
                  <Text style={styles.confirmButtonText}>Next: Scan Customer Pass</Text>
                  <Ionicons name="qr-code-outline" size={20} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelModalButton} onPress={handleCancelAmount}>
                  <Text style={styles.cancelModalText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCancelScanner}
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity onPress={handleCancelScanner}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.scannerHeaderText}>
              <Text style={styles.scannerTitle}>Scan Customer Pass</Text>
              <Text style={styles.scannerSubtitle}>Amount: ${amount}</Text>
            </View>
            <View style={{ width: 28 }} />
          </View>

          {permission?.granted ? (
            <>
              <View style={styles.cameraContainer}>
                <CameraView
                  style={styles.camera}
                  facing="back"
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                  enableTorch={flashOn}
                >
                  <View style={styles.overlay}>
                    <View style={styles.scanArea}>
                      <View style={[styles.corner, styles.topLeft]} />
                      <View style={[styles.corner, styles.topRight]} />
                      <View style={[styles.corner, styles.bottomLeft]} />
                      <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                  </View>
                </CameraView>
              </View>

              <View style={styles.scannerControls}>
                <TouchableOpacity style={styles.flashButton} onPress={() => setFlashOn(!flashOn)}>
                  <Ionicons name={flashOn ? 'flash' : 'flash-off'} size={24} color={flashOn ? '#55efc4' : '#999'} />
                  <Text style={[styles.flashText, flashOn && styles.flashTextActive]}>Flash</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.permissionContainer}>
              <Ionicons name="camera-outline" size={80} color="#55efc4" />
              <Text style={styles.permissionTitle}>Camera Permission Required</Text>
              <Text style={styles.permissionText}>We need camera access to scan customer QR codes</Text>
              <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    gap: 6,
  },
  statTitle: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  statCount: {
    fontSize: 12,
    color: '#666',
  },
  statTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(85, 239, 196, 0.2)',
    color: '#55efc4',
  },
  statusDeclined: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    color: '#ff6b6b',
  },
  statusPending: {
    backgroundColor: 'rgba(153, 153, 153, 0.2)',
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#55efc4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#55efc4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Waiting screen styles
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  waitingSpinner: {
    marginBottom: 20,
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  waitingText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  successCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(85, 239, 196, 0.1)',
    borderWidth: 3,
    borderColor: '#55efc4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#55efc4',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 3,
    borderColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  paymentDetailsCard: {
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    gap: 12,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentDetailLabel: {
    fontSize: 14,
    color: '#999',
  },
  paymentDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  doneButton: {
    backgroundColor: '#55efc4',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  doneButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelWaitingButton: {
    padding: 15,
    marginTop: 10,
  },
  cancelWaitingText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
  },
  modalOverlayTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 50,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  amountInfoCard: {
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    gap: 12,
  },
  amountInfoText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dollarSign: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#55efc4',
    marginRight: 10,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 150,
  },
  confirmButton: {
    backgroundColor: '#55efc4',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelModalButton: {
    padding: 15,
    alignItems: 'center',
  },
  cancelModalText: {
    color: '#999',
    fontSize: 16,
  },
  // Scanner styles
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  scannerHeaderText: {
    alignItems: 'center',
  },
  scannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scannerSubtitle: {
    fontSize: 14,
    color: '#55efc4',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#55efc4',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scannerControls: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  flashButton: {
    alignItems: 'center',
    padding: 15,
  },
  flashText: {
    color: '#999',
    marginTop: 5,
    fontSize: 12,
  },
  flashTextActive: {
    color: '#55efc4',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#55efc4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // LYPTO Stats Styles
  lyptoStatsCard: {
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(85, 239, 196, 0.2)',
  },
  lyptoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  lyptoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  lyptoStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 15,
  },
  lyptoStatItem: {
    alignItems: 'center',
    minWidth: 70,
  },
  lyptoStatLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
  },
  lyptoStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#55efc4',
  },
});
