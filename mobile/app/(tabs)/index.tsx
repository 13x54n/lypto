import * as React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { storage } from '@/lib/secure-storage';

export default function DashboardScreen() {
  const router = useRouter();
  React.useEffect(() => {
    (async () => {
      const token = await storage.getToken();
      if (!token) {
        router.replace('/auth');
      }
    })();
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to your Zypto business dashboard</Text>
          
          {/* Revenue Cards */}
          <View style={styles.cardsGrid}>
            <View style={[styles.card, styles.revenueCard]}>
              <Text style={styles.cardDescription}>Total Revenue</Text>
              <Text style={styles.cardValue}>15,420 SOL</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>Total revenue generated</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>↗ +24.5%</Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, styles.subscriptionCard]}>
              <Text style={styles.cardDescription}>Active Subscriptions</Text>
              <Text style={styles.cardValue}>1,247</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>Active premium subscriptions</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>↗ +31%</Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, styles.paymentCard]}>
              <Text style={styles.cardDescription}>Total Payments</Text>
              <Text style={styles.cardValue}>2,847</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>All-time payments processed</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>↗ +18%</Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, styles.growthCard]}>
              <Text style={styles.cardDescription}>Monthly Growth</Text>
              <Text style={styles.cardValue}>+12.3%</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>Revenue growth this month</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>↗ +5.2%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Chart Section */}
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Revenue Overview</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>📈</Text>
              <Text style={styles.chartLabel}>Interactive chart will be here</Text>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.transactionList}>
              <View style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>Premium Subscription</Text>
                  <Text style={styles.transactionDate}>2 hours ago</Text>
                </View>
                <Text style={styles.transactionAmount}>+50 SOL</Text>
              </View>
              <View style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>One-time Payment</Text>
                  <Text style={styles.transactionDate}>5 hours ago</Text>
                </View>
                <Text style={styles.transactionAmount}>+25 SOL</Text>
              </View>
              <View style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>Custom Plan</Text>
                  <Text style={styles.transactionDate}>1 day ago</Text>
                </View>
                <Text style={styles.transactionAmount}>+100 SOL</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollView: { flex: 1 },
  content: { padding: 16, gap: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#9ca3af', marginBottom: 20 },
  
  // Cards Grid
  cardsGrid: { gap: 12 },
  card: { 
    backgroundColor: '#111111', 
    padding: 20, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 4,
    borderWidth: 1,
    borderColor: '#1f1f1f'
  },
  revenueCard: { 
    backgroundColor: '#111111',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981'
  },
  subscriptionCard: { 
    backgroundColor: '#111111',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6'
  },
  paymentCard: { 
    backgroundColor: '#111111',
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6'
  },
  growthCard: { 
    backgroundColor: '#111111',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b'
  },
  cardDescription: { fontSize: 14, color: '#9ca3af', marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardFooterText: { fontSize: 12, color: '#9ca3af', flex: 1 },
  trendBadge: { 
    backgroundColor: '#064e3b', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981'
  },
  trendText: { fontSize: 12, color: '#10b981', fontWeight: '600' },
  
  // Chart Section
  chartSection: { marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#ffffff', marginBottom: 16 },
  chartPlaceholder: { 
    backgroundColor: '#111111', 
    padding: 40, 
    borderRadius: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f'
  },
  chartText: { fontSize: 48, marginBottom: 8 },
  chartLabel: { fontSize: 14, color: '#9ca3af' },
  
  // Transactions Section
  transactionsSection: { marginTop: 8 },
  transactionList: { gap: 12 },
  transactionItem: { 
    backgroundColor: '#111111', 
    padding: 16, 
    borderRadius: 8, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f'
  },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 16, fontWeight: '500', color: '#ffffff', marginBottom: 4 },
  transactionDate: { fontSize: 12, color: '#9ca3af' },
  transactionAmount: { fontSize: 16, fontWeight: '600', color: '#10b981' },
});