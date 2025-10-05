import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from '@/components/DashboardHeader';
import { Ionicons } from '@expo/vector-icons';

export default function WalletTab() {
  const transactions = [
    {
      id: 1,
      title: 'Starbucks Coffee',
      date: 'Today, 2:30 PM',
      amount: '+50 pts',
      type: 'earned',
      icon: '☕',
    },
    {
      id: 2,
      title: 'Uber Ride',
      date: 'Yesterday, 7:15 PM',
      amount: '+30 pts',
      type: 'earned',
      icon: '🚗',
    },
    {
      id: 3,
      title: 'Amazon Purchase',
      date: '2 days ago',
      amount: '+120 pts',
      type: 'earned',
      icon: '🛒',
    },
    {
      id: 4,
      title: 'Referral Bonus',
      date: '3 days ago',
      amount: '+200 pts',
      type: 'bonus',
      icon: '🎁',
    },
    {
      id: 5,
      title: 'McDonald\'s',
      date: '4 days ago',
      amount: '+25 pts',
      type: 'earned',
      icon: '🍔',
    },
    {
      id: 6,
      title: 'Netflix Subscription',
      date: '1 week ago',
      amount: '-500 pts',
      type: 'redeemed',
      icon: '📺',
    },
  ];

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return '#55efc4';
      case 'bonus':
        return '#ffd700';
      case 'redeemed':
        return '#ff6b6b';
      default:
        return '#55efc4';
    }
  };

  return (
    <View style={styles.container}>
      <DashboardHeader totalPoints={1250} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Overview */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>1,250 pts</Text>
          <Text style={styles.balanceValue}>≈ $12.50</Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterButton, styles.filterActive]}>
            <Text style={[styles.filterText, styles.filterActiveText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Earned</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Redeemed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Bonus</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <View style={styles.transactionList}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionPoints,
                    { color: getTransactionColor(transaction.type) }
                  ]}>
                    {transaction.amount}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Load More */}
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load More Transactions</Text>
          <Ionicons name="chevron-down" size={16} color="#55efc4" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#55efc4',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 16,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  filterActive: {
    backgroundColor: '#55efc4',
    borderColor: '#55efc4',
  },
  filterText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  filterActiveText: {
    color: '#000',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  transactionList: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#333',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionPoints: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 20,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#55efc4',
    fontWeight: '500',
  },
});
