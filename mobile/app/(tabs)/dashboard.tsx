import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DashboardHeader from '@/components/DashboardHeader';
import { LoyaltyPointsChart } from '@/components/ui/Chart';

export default function DashboardTab() {

  return (
    <View style={styles.container}>
      <DashboardHeader totalPoints={1250} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1,250</Text>
            <Text style={styles.statLabel}>Total Earned Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$127.5 </Text>
            <Text style={styles.statLabel}>Total Saved Amount</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>Transactions this month.</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>+450</Text>
            <Text style={styles.statLabel}>Points Earned this month.</Text>
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
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>☕</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Starbucks</Text>
                <Text style={styles.activityDate}>Today, 2:30 PM</Text>
              </View>
              <View style={styles.activityAmount}>
                <Text style={[styles.activityPoints, { color: '#26de81' }]}>+50 pts</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>🚗</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Uber</Text>
                <Text style={styles.activityDate}>Yesterday, 7:15 PM</Text>
              </View>
              <View style={styles.activityAmount}>
                <Text style={[styles.activityPoints, { color: '#ff7675' }]}>-30 pts</Text>
              </View>
            </View>
          </View>
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
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#26de81',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginTop: 22,
    paddingBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  viewAllText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  activityList: {
    backgroundColor: '#000',
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  activityIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '600',
  },
});
