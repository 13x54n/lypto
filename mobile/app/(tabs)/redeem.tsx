import React, { useState } from 'react';
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
  const [autoRedeemEnabled, setAutoRedeemEnabled] = useState(false)
  const [fromAmount, setFromAmount] = useState('20.20')
  const [toAmount, setToAmount] = useState('0.00')
  // Empty array - no rewards available yet
  const redeemOptions: any[] = [];

  const handleRedeem = (option: any) => {
    console.log('Redeeming:', option.title);
  };

  return (
    <View style={styles.container}>
      <DashboardHeader totalPoints={1250} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Swap Section */}
        <View style={styles.swapSection}>

          {/* You Pay Card */}
          <View style={styles.swapCard}>
            <View style={styles.swapRow}>
              <TouchableOpacity style={styles.assetLeft}>
                <View style={styles.assetIconCircle}>
                  <Text style={styles.assetIconEmoji}>⭐</Text>
                </View>
                <Text style={styles.assetName}>Lypto Points</Text>
              </TouchableOpacity>
              <View style={styles.amountRight}>
                <Text style={styles.amountValue}>{fromAmount}</Text>
              </View>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceText}>Balance: <Text style={styles.balanceMuted}>0.00</Text> <Text style={styles.maxText}>Max</Text></Text>
            </View>
          </View>

          {/* Swap Button */}
          <View style={styles.swapIconRow}>
            <TouchableOpacity style={styles.swapIconButton} onPress={() => {
              // simple demo swap amounts
              setFromAmount(toAmount)
              setToAmount(fromAmount)
            }}>
              <Ionicons name="swap-vertical" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* You Receive Card */}
          <View style={styles.swapCard}>
            <View style={styles.swapRow}>
              <TouchableOpacity style={styles.assetLeft}>
                <View style={[styles.assetIconCircle, styles.assetIconLight]}>
                  <Text style={[styles.assetIconEmoji, styles.assetIconDark]}>$</Text>
                </View>
                <Text style={styles.assetName}>USDC</Text>
              </TouchableOpacity>
              <View style={styles.amountRight}>
                <Text style={styles.amountValue}>{toAmount}</Text>
              </View>
            </View>
            <View style={styles.receiveFooterRow}>
              <Text style={styles.receiveBalanceText}>Balance: <Text style={styles.receiveBalancePositive}>0.00</Text></Text>
              <Text style={styles.receiveUsdText}>= $0.00</Text>
            </View>
          </View>

          {/* Redeem CTA and Fee */}
          <View style={styles.redeemRow}>
            <TouchableOpacity style={styles.redeemButton}>
              <Text style={styles.redeemButtonText}>Redeem Lypto Points</Text>
            </TouchableOpacity>
            <View style={styles.feeRow}>
              <Ionicons name="flash" size={14} color="#9CA3AF" />
              <Text style={styles.feeText}>$0.185</Text>
              <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* Popular Section */}
        {/* <View style={styles.section}>
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
        </View> */}

        {/* All Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Rewards</Text>
          {redeemOptions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="gift-outline" size={64} color="#333" />
              <Text style={styles.emptyStateTitle}>No Rewards Available</Text>
              <Text style={styles.emptyStateText}>
                Check back soon for exciting redemption options!
              </Text>
              <Text style={styles.emptyStateSubtext}>
                We're working on adding gift cards, exclusive deals, and more ways to use your LYPTO tokens.
              </Text>
            </View>
          ) : (
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  swapSection: {
    backgroundColor: '#000',
    paddingTop: 12,
    paddingBottom: 8,
  },
  swapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  autoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  autoLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  autoSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  autoStateText: {
    fontSize: 12,
  },
  autoOnText: { color: '#55efc4' },
  autoOffText: { color: '#fab1a0' },
  autoSwitch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoOn: { backgroundColor: '#55efc4' },
  autoOff: { backgroundColor: '#fab1a0' },
  swapCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  swapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assetIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetIconEmoji: {
    fontSize: 18,
    color: '#000',
  },
  assetIconLight: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  assetIconDark: {
    color: '#000',
  },
  assetName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '300',
  },
  amountRight: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  balanceMuted: { color: '#9CA3AF' },
  maxText: { color: '#2ecc71' },
  swapIconRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -12,
    zIndex: 1,
  },
  swapIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiveFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiveBalanceText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  receiveBalancePositive: { color: '#2ecc71' },
  receiveUsdText: { color: '#9CA3AF', fontSize: 12 },
  redeemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 12,
  },
  redeemButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  redeemButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '300',
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feeText: { color: '#9CA3AF', fontSize: 12 },
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
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
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
