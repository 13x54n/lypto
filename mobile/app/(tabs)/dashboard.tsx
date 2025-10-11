import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/constants/api';
import { Colors } from '@/constants/Colors';

interface Transaction {
  id: string;
  merchantEmail: string;
  amount: number;
  lyptoReward: number;
  lyptoMinted: boolean;
  status: string;
  createdAt: string;
}

export default function DashboardTab() {
  const { userEmail } = useAuth();
  const [lyptoBalance, setLyptoBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [userEmail]);

  const loadDashboardData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        fetch(`${API_BASE}/api/merchant/lypto-balance?email=${userEmail}`),
        fetch(`${API_BASE}/api/merchant/user-transactions?userEmail=${userEmail}`),
      ]);

      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        setLyptoBalance(balanceData.balance || 0);
        setTotalEarned(balanceData.totalEarned || 0);
        setWalletAddress(balanceData.walletAddress || '');
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* LYPTO Balance Card */}
        <View style={styles.lyptoCard}>
          <View style={styles.lyptoHeader}>
            <View style={styles.lyptoIconContainer}>
              <Ionicons name="diamond" size={32} color="#55efc4" />
            </View>
            <View style={styles.lyptoInfo}>
              <Text style={styles.lyptoLabel}>LYPTO Balance</Text>
              {walletAddress && (
                <Text style={styles.walletAddress}>{formatAddress(walletAddress)}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.lyptoBalanceContainer}>
            <Text style={styles.lyptoBalance}>{lyptoBalance.toLocaleString()}</Text>
            <Text style={styles.lyptoSymbol}>LYPTO</Text>
          </View>
          
          <View style={styles.lyptoValueContainer}>
            <Text style={styles.lyptoValue}>≈ ${(lyptoBalance * 0.01).toFixed(2)} USD</Text>
            <Text style={styles.lyptoRate}>1 LYPTO = $0.01</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.earnedContainer}>
            <View style={styles.earnedItem}>
              <Text style={styles.earnedLabel}>Total Earned</Text>
              <Text style={styles.earnedValue}>{totalEarned} LYPTO</Text>
            </View>
            <View style={styles.earnedItem}>
              <Text style={styles.earnedLabel}>Worth</Text>
              <Text style={styles.earnedValue}>${(totalEarned * 0.01).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="receipt-outline" size={24} color="#55efc4" />
            <Text style={styles.statValue}>{transactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color="#55efc4" />
            <Text style={styles.statValue}>
              {transactions.filter(t => t.status === 'confirmed').length}
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="sparkles-outline" size={24} color="#55efc4" />
            <Text style={styles.statValue}>
              {transactions.reduce((sum, t) => sum + (t.lyptoMinted ? t.lyptoReward : 0), 0)}
            </Text>
            <Text style={styles.statLabel}>LYPTO Earned</Text>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#55efc4" />
            <Text style={styles.infoTitle}>Earn 2% LYPTO on Every Purchase!</Text>
          </View>
          <Text style={styles.infoText}>
            Make purchases at participating merchants and automatically earn LYPTO tokens worth 2% of your purchase amount.
          </Text>
          <View style={styles.infoExamples}>
            <View style={styles.infoExample}>
              <Text style={styles.infoExampleAmount}>$10</Text>
              <Ionicons name="arrow-forward" size={16} color="#999" />
              <Text style={styles.infoExampleReward}>20 LYPTO</Text>
            </View>
            <View style={styles.infoExample}>
              <Text style={styles.infoExampleAmount}>$50</Text>
              <Ionicons name="arrow-forward" size={16} color="#999" />
              <Text style={styles.infoExampleReward}>100 LYPTO</Text>
            </View>
            <View style={styles.infoExample}>
              <Text style={styles.infoExampleAmount}>$100</Text>
              <Ionicons name="arrow-forward" size={16} color="#999" />
              <Text style={styles.infoExampleReward}>200 LYPTO</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color="#666" />
              <Text style={styles.emptyTitle}>No Transactions Yet</Text>
              <Text style={styles.emptyText}>
                Make your first purchase to start earning LYPTO rewards!
              </Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {transactions.slice(0, 10).map((tx) => (
                <View key={tx.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Ionicons 
                      name={tx.status === 'confirmed' ? 'checkmark-circle' : 'close-circle'} 
                      size={32} 
                      color={tx.status === 'confirmed' ? '#55efc4' : '#ff6b6b'} 
                    />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>{tx.merchantEmail}</Text>
                    <Text style={styles.activityDate}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </Text>
                    {tx.lyptoMinted && (
                      <View style={styles.lyptoRewardBadge}>
                        <Ionicons name="diamond" size={12} color="#55efc4" />
                        <Text style={styles.lyptoRewardText}>+{tx.lyptoReward} LYPTO</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.activityAmount}>
                    <Text style={styles.activityAmountText}>${tx.amount.toFixed(2)}</Text>
                    <Text style={[
                      styles.activityStatus,
                      tx.status === 'confirmed' && styles.statusConfirmed,
                      tx.status === 'declined' && styles.statusDeclined,
                    ]}>
                      {tx.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#999',
    marginBottom: 4,
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // LYPTO Card Styles
  lyptoCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(85, 239, 196, 0.2)',
  },
  lyptoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lyptoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(85, 239, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lyptoInfo: {
    flex: 1,
  },
  lyptoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  lyptoBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  lyptoBalance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12,
  },
  lyptoSymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#55efc4',
  },
  lyptoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  lyptoValue: {
    fontSize: 16,
    color: '#999',
  },
  lyptoRate: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 16,
  },
  earnedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earnedItem: {
    alignItems: 'center',
  },
  earnedLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  earnedValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#55efc4',
  },
  
  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  
  // Info Card
  infoCard: {
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoExamples: {
    gap: 10,
  },
  infoExample: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoExampleAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    width: 50,
    textAlign: 'right',
  },
  infoExampleReward: {
    fontSize: 16,
    fontWeight: '600',
    color: '#55efc4',
    width: 100,
  },
  
  // Transactions Section
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewAllText: {
    fontSize: 14,
    color: '#55efc4',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
  },
  activityIcon: {
    marginRight: 16,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  lyptoRewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(85, 239, 196, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  lyptoRewardText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#55efc4',
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  activityStatus: {
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
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#111',
    borderRadius: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
