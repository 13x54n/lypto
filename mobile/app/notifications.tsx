import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'Points Earned!',
      message: 'You earned 50 points from Starbucks purchase',
      time: '2 hours ago',
      type: 'earned',
      read: false,
    },
    {
      id: 2,
      title: 'Referral Bonus',
      message: 'Your friend John joined using your referral code',
      time: '1 day ago',
      type: 'referral',
      read: false,
    },
    {
      id: 3,
      title: 'New Offer Available',
      message: '50% off Uber rides - Limited time offer!',
      time: '2 days ago',
      type: 'offer',
      read: true,
    },
    {
      id: 4,
      title: 'Welcome to Zypto!',
      message: 'Thanks for joining. Start earning points today!',
      time: '1 week ago',
      type: 'welcome',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return '💰';
      case 'referral':
        return '👥';
      case 'offer':
        return '🎁';
      case 'welcome':
        return '🎉';
      default:
        return '📢';
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadCard
            ]}
          >
            <View style={styles.notificationLeft}>
              <Text style={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </Text>
            </View>
            
            <View style={styles.notificationContent}>
              <Text style={[
                styles.notificationTitle,
                !notification.read && styles.unreadTitle
              ]}>
                {notification.title}
              </Text>
              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>
              <Text style={styles.notificationTime}>
                {notification.time}
              </Text>
            </View>
            
            <View style={styles.notificationRight}>
              {!notification.read && <View style={styles.unreadDot} />}
            </View>
          </TouchableOpacity>
        ))}
        
        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyMessage}>
              You&apos;re all caught up! New notifications will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    color: '#55efc4',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  unreadCard: {
    backgroundColor: '#1a2a1a',
    borderColor: '#55efc4',
  },
  notificationLeft: {
    marginRight: 12,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationRight: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#55efc4',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
