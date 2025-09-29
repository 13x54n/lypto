import * as React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { storage } from '@/lib/secure-storage';

export default function PaymentsScreen() {
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
          <Text style={styles.title}>Payments</Text>
          <Text style={styles.subtitle}>Manage your payment methods and transactions</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardDescription}>Total Processed</Text>
            <Text style={styles.cardValue}>2,847 SOL</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>All-time payments processed</Text>
              <View style={styles.trendBadge}>
                <Text style={styles.trendText}>↗ +18%</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <View style={styles.paymentMethodCard}>
              <Text style={styles.paymentMethodText}>💳 Solana Wallet</Text>
              <Text style={styles.paymentMethodStatus}>Active</Text>
            </View>
            <View style={styles.paymentMethodCard}>
              <Text style={styles.paymentMethodText}>🔗 USDC</Text>
              <Text style={styles.paymentMethodStatus}>Active</Text>
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
    borderColor: '#1f1f1f',
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6'
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
  
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#ffffff', marginBottom: 16 },
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
  
  paymentMethodCard: { 
    backgroundColor: '#111111', 
    padding: 16, 
    borderRadius: 8, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f',
    marginBottom: 8
  },
  paymentMethodText: { fontSize: 16, fontWeight: '500', color: '#ffffff' },
  paymentMethodStatus: { fontSize: 12, color: '#10b981', fontWeight: '600' },
});
