import * as React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { storage } from '@/lib/secure-storage';

export default function ProductsScreen() {
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
        <Text style={styles.title}>Products</Text>
        <Text style={styles.subtitle}>Manage your products and services</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Products</Text>
          <Text style={styles.cardText}>No products available</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Product Categories</Text>
          <Text style={styles.cardText}>No categories defined</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inventory</Text>
          <Text style={styles.cardText}>No inventory items</Text>
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
    borderColor: '#1f1f1f'
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#9ca3af' },
});
