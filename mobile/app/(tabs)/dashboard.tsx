import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardHeader from '@/components/DashboardHeader';
import { LoyaltyPointsChart } from '@/components/ui/Chart';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/constants/api';

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    loadDashboardData();
  }, [userEmail]);

  async function loadDashboardData() {
    try {
      console.log('[Dashboard] Fetching data from:', API_BASE);
      console.log('[Dashboard] User email:', userEmail);
      
        const [balanceRes, transactionsRes] = await Promise.all([
            fetch(`${API_BASE}/api/merchant/lypto-balance?email=${userEmail}`).catch(err => {
                console.error('[Dashboard] Balance fetch error:', err);
                return null;
            }),
            fetch(`${API_BASE}/api/merchant/user-transactions?userEmail=${userEmail}`).catch(err => {
                console.error('[Dashboard] Transactions fetch error:', err);
                return null;
            }),
        ]);

        if (balanceRes?.ok) {
            const balanceData = await balanceRes.json();
            console.log('[Dashboard] Balance data:', balanceData);
            setLyptoBalance(balanceData.balance || 0);
        } else {
            console.warn('[Dashboard] Balance request failed');
        }

        if (transactionsRes?.ok) {
            const transactionsData = await transactionsRes.json();
            console.log('[Dashboard] Transactions:', transactionsData.transactions?.length || 0);
            setTransactions(transactionsData.transactions || []);
        } else {
            console.warn('[Dashboard] Transactions request failed');
        }
    } catch (error) {
      console.error('[Dashboard] Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Calculate stats from transactions
  const thisMonthTransactions = transactions.filter(t => {
    const txDate = new Date(t.createdAt);
    const now = new Date();
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
  });
  
  const totalPoints = lyptoBalance;
  const totalSaved = lyptoBalance * 0.01; // 1 LYPTO = $0.01
  const monthlyTransactions = thisMonthTransactions.length;
  const monthlyPoints = thisMonthTransactions.reduce((sum, t) => sum + (t.lyptoMinted ? t.lyptoReward : 0), 0);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#55efc4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DashboardHeader totalPoints={totalPoints} />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#55efc4" />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total LYPTO Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${totalSaved.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Saved Amount</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{monthlyTransactions}</Text>
            <Text style={styles.statLabel}>Transactions this month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>+{monthlyPoints}</Text>
            <Text style={styles.statLabel}>Points earned this month</Text>
          </View>
        </View>

        {/* Loyalty Points Chart */}
        <LoyaltyPointsChart />

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color="#666" />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>Make your first purchase to start earning LYPTO!</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {transactions.slice(0, 5).map((transaction) => {
                const merchantName = transaction.merchantEmail.split('@')[0];
                const emoji = getEmojiForMerchant(merchantName);
                const isPositive = transaction.status === 'confirmed';
                const pointsChange = isPositive ? `+${transaction.lyptoReward}` : `-${transaction.lyptoReward}`;
                
                return (
                  <View key={transaction.id} style={styles.activityItem}>
                    <View style={styles.activityIcon}>
                      <Text style={styles.activityEmoji}>{emoji}</Text>
                    </View>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityTitle}>
                        {merchantName.charAt(0).toUpperCase() + merchantName.slice(1)}
                      </Text>
                      <Text style={styles.activityDate}>
                        {formatDate(transaction.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.activityAmount}>
                      <Text style={[
                        styles.activityPoints, 
                        { color: isPositive ? '#26de81' : '#ff7675' }
                      ]}>
                        {pointsChange} pts
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Helper function to get emoji based on merchant name
function getEmojiForMerchant(merchantName: string): string {
  const name = merchantName.toLowerCase();
  if (name.includes('coffee') || name.includes('starbucks')) return '☕';
  if (name.includes('food') || name.includes('restaurant')) return '🍔';
  if (name.includes('uber') || name.includes('taxi')) return '🚗';
  if (name.includes('shop') || name.includes('store')) return '🛍️';
  if (name.includes('gas') || name.includes('fuel')) return '⛽';
  if (name.includes('hotel')) return '🏨';
  return '🏪'; // Default store emoji
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) {
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `Today, ${time}`;
  }
  if (diffDays === 1) {
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `Yesterday, ${time}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
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
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityEmoji: {
    fontSize: 24,
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
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityPoints: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#111',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
