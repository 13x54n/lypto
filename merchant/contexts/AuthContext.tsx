import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';

interface AuthContextType {
  merchantEmail: string | null;
  merchantToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MERCHANT_EMAIL_KEY = 'merchant_email';
const MERCHANT_TOKEN_KEY = 'merchant_token';
const BIOMETRIC_ENABLED_KEY = 'merchant_biometric_enabled';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [merchantEmail, setMerchantEmail] = useState<string | null>(null);
  const [merchantToken, setMerchantToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const [email, token, biometricEnabled] = await Promise.all([
        SecureStore.getItemAsync(MERCHANT_EMAIL_KEY),
        SecureStore.getItemAsync(MERCHANT_TOKEN_KEY),
        SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY),
      ]);
      
      if (email && token) {
        // If biometric auth is enabled, require it
        if (biometricEnabled === 'true') {
          const biometricSuccess = await authenticateWithBiometrics();
          if (biometricSuccess) {
            setMerchantEmail(email);
            setMerchantToken(token);
            setIsAuthenticated(true);
          } else {
            // Biometric failed - user needs to login again
            await logout();
          }
        } else {
          // No biometric required - auto-login
          setMerchantEmail(email);
          setMerchantToken(token);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        console.log('No biometric hardware available');
        return true;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        console.log('No biometrics enrolled');
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Merchant Dashboard',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const login = async (email: string, token: string) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync(MERCHANT_EMAIL_KEY, email),
        SecureStore.setItemAsync(MERCHANT_TOKEN_KEY, token),
      ]);
      
      // Check if biometric authentication is available
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        // Ask user if they want to enable biometric auth
        Alert.alert(
          Platform.OS === 'ios' ? 'Enable Face ID?' : 'Enable Biometric Authentication?',
          'Use biometrics to quickly and securely access the merchant dashboard',
          [
            {
              text: 'Not Now',
              onPress: async () => {
                await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'false');
              },
              style: 'cancel',
            },
            {
              text: 'Enable',
              onPress: async () => {
                await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
              },
            },
          ]
        );
      }
      
      setMerchantEmail(email);
      setMerchantToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(MERCHANT_EMAIL_KEY),
        SecureStore.deleteItemAsync(MERCHANT_TOKEN_KEY),
        SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY),
      ]);
      setMerchantEmail(null);
      setMerchantToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ merchantEmail, merchantToken, isAuthenticated, login, logout, authenticateWithBiometrics }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

