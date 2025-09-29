import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { storage } from '@/lib/secure-storage';

export default function SettingsScreen() {
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      const token = await storage.getToken();
      if (!token) {
        router.replace('/auth');
      }
    })();
  }, [router]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAuth();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your app preferences</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>General</Text>
          <Text style={styles.cardText}>Language: English</Text>
          <Text style={styles.cardText}>Theme: System</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardText}>Push notifications: Enabled</Text>
          <Text style={styles.cardText}>Email notifications: Enabled</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy</Text>
          <Text style={styles.cardText}>Data collection: Minimal</Text>
          <Text style={styles.cardText}>Analytics: Enabled</Text>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
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
    borderColor: '#1f1f1f'
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#9ca3af', marginBottom: 4 },
  logoutButton: { backgroundColor: '#dc2626', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  logoutText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
