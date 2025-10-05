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

export default function RedeemTab() {
  const redeemOptions = [
    {
      id: 1,
      title: 'Starbucks Gift Card',
      points: 500,
      value: '$5.00',
      icon: '☕',
      category: 'Food & Drink',
      popular: true,
    },
    {
      id: 2,
      title: 'Amazon Gift Card',
      points: 1000,
      value: '$10.00',
      icon: '🛒',
      category: 'Shopping',
      popular: false,
    },
    {
      id: 3,
      title: 'Uber Credits',
      points: 750,
      value: '$7.50',
      icon: '🚗',
      category: 'Transportation',
      popular: true,
    },
    {
      id: 4,
      title: 'Netflix Subscription',
      points: 1500,
      value: '$15.00',
      icon: '📺',
      category: 'Entertainment',
      popular: false,
    },
    {
      id: 5,
      title: 'Spotify Premium',
      points: 800,
      value: '$8.00',
      icon: '🎵',
      category: 'Entertainment',
      popular: false,
    },
    {
      id: 6,
      title: 'Apple App Store',
      points: 1200,
      value: '$12.00',
      icon: '📱',
      category: 'Digital',
      popular: false,
    },
  ];

  const handleRedeem = (option: any) => {
    // TODO: Implement redeem functionality
    console.log('Redeeming:', option.title);
  };

  return (
    <View style={styles.container}>
      <DashboardHeader totalPoints={1250} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Redeem Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Points Available</Text>
          <Text style={styles.balanceAmount}>1,250 pts</Text>
          <Text style={styles.balanceValue}>≈ $12.50 value</Text>
        </View>

        {/* Popular Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Rewards</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {redeemOptions.filter(option => option.popular).map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.rewardCard}
                onPress={() => handleRedeem(option)}
              >
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
                <Text style={styles.rewardIcon}>{option.icon}</Text>
                <Text style={styles.rewardTitle}>{option.title}</Text>
                <Text style={styles.rewardCategory}>{option.category}</Text>
                <Text style={styles.rewardPoints}>{option.points} pts</Text>
                <Text style={styles.rewardValue}>{option.value}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Rewards</Text>
          <View style={styles.rewardsGrid}>
            {redeemOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.rewardItem}
                onPress={() => handleRedeem(option)}
              >
                <View style={styles.rewardIconContainer}>
                  <Text style={styles.rewardIconLarge}>{option.icon}</Text>
                </View>
                <View style={styles.rewardDetails}>
                  <Text style={styles.rewardTitleLarge}>{option.title}</Text>
                  <Text style={styles.rewardCategoryLarge}>{option.category}</Text>
                  <View style={styles.rewardFooter}>
                    <Text style={styles.rewardPointsLarge}>{option.points} pts</Text>
                    <Text style={styles.rewardValueLarge}>{option.value}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
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
  section: {
    marginTop: 32,
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
  seeAllText: {
    fontSize: 14,
    color: '#55efc4',
    fontWeight: '500',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  rewardCard: {
    width: 160,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#333',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
  },
  rewardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  rewardCategory: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  rewardPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#55efc4',
    marginBottom: 4,
  },
  rewardValue: {
    fontSize: 14,
    color: '#666',
  },
  rewardsGrid: {
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  rewardIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#333',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rewardIconLarge: {
    fontSize: 24,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardTitleLarge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  rewardCategoryLarge: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardPointsLarge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#55efc4',
  },
  rewardValueLarge: {
    fontSize: 14,
    color: '#666',
  },
});
