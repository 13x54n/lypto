import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import DashboardHeader from '@/components/DashboardHeader';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '@/constants/design';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ListItem } from '@/components/ui/ListItem';

export default function WalletTab() {
  const [autoRedeemEnabled, setAutoRedeemEnabled] = useState(false);
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
        return Colors.primary;
      case 'bonus':
        return Colors.warning;
      case 'redeemed':
        return Colors.danger;
      default:
        return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <DashboardHeader totalPoints={1250} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Overview */}
        <View style={styles.balancesRow}>
          <View style={styles.balanceLeft}>
            {/* <Text style={styles.balanceLabel}>Available Balance</Text> */}
            <Text style={styles.balanceAmount}>1,250 pts</Text>
            <Text style={styles.balanceValue}>≈ $12.50</Text>
          </View>
          <View style={styles.balanceRight}>
            <View style={styles.assetPill}>
              <Text style={styles.assetSymbol}>USDC</Text>
              <Text style={styles.assetAmount}>120.50</Text>
            </View>
            <View style={styles.assetPill}>
              <Text style={styles.assetSymbol}>SOL</Text>
              <Text style={styles.assetAmount}>3.25</Text>
            </View>
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
            {transactions.map((transaction) => (
              <ListItem
                key={transaction.id}
                title={transaction.title}
                subtitle={transaction.date}
                left={
                  <View style={styles.leftIcon}>
                    <Text style={styles.leftEmoji}>{transaction.icon}</Text>
                  </View>
                }
                right={
                  <Text style={[styles.pointsText, { color: getTransactionColor(transaction.type) }]}>
                    {transaction.amount}
                  </Text>
                }
              />
            ))}
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
});
