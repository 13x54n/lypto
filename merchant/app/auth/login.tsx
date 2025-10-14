import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { endpoints } from '../../constants/api';
import { useAuth } from '@/contexts/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const { authenticateWithBiometrics, login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && isEnrolled);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      // Check if user has stored credentials first
      const storedEmail = await SecureStore.getItemAsync('merchant_email');
      const storedToken = await SecureStore.getItemAsync('merchant_token');

      if (storedEmail && storedToken) {
        // User has stored credentials, try biometric authentication
        const success = await authenticateWithBiometrics();
        if (success) {
          // Biometric auth successful - log them in and navigate to dashboard
          await login(storedEmail, storedToken);
          router.replace('/(tabs)');
        } else {
          Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try again or use email login.');
        }
      } else {
        // No stored credentials - biometric login not available
        Alert.alert('Not Available', 'Please log in with email first to enable biometric authentication.');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication error. Please use email login.');
    }
  };

  const handleSendOTP = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(endpoints.requestOTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push({ pathname: '/auth/otp', params: { email } });
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="storefront" size={60} color="#fff" />
        </View>
        <Text style={styles.title}>Lypto Merchant</Text>
        <Text style={styles.subtitle}>Sign in to your merchant account</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="merchant@example.com"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        {/* Biometric Login Button */}
        {biometricAvailable && (
          <TouchableOpacity
            style={[styles.button, styles.biometricButton]}
            onPress={handleBiometricLogin}
            disabled={loading}
          >
            <Text style={styles.biometricButtonText}>
              {Platform.OS === 'ios' ? '🔐 Use Face ID' : '🔐 Use Fingerprint'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Divider */}
        {biometricAvailable && (
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.buttonText}>Send OTP</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.info}>
          We'll send a one-time password to your email
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 60,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: -12,
  },
  input: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  biometricButton: {
    backgroundColor: '#55efc4',
  },
  biometricButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
  },
});

