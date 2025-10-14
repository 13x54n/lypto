import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';

interface AuthContextType {
  userEmail: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'zypto_auth_token';
const EMAIL_STORAGE_KEY = 'zypto_user_email';
const BIOMETRIC_ENABLED_KEY = 'zypto_biometric_enabled';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const [storedEmail, storedToken, biometricEnabled] = await Promise.all([
        SecureStore.getItemAsync(EMAIL_STORAGE_KEY),
        SecureStore.getItemAsync(AUTH_STORAGE_KEY),
        SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY),
      ]);

      if (storedEmail && storedToken) {
        // Check if biometric authentication is available and enabled
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        
        if (hasHardware && isEnrolled && biometricEnabled === 'true') {
          // Try biometric authentication first
          const biometricSuccess = await authenticateWithBiometrics();
          if (biometricSuccess) {
            setUserEmail(storedEmail);
            setIsAuthenticated(true);
          } else {
            // Biometric failed - user needs to login again
            await logout();
          }
        } else {
          // No biometric required or not available - auto-login
          setUserEmail(storedEmail);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, token: string) => {
    try {
      // Save to secure store
      await Promise.all([
        SecureStore.setItemAsync(EMAIL_STORAGE_KEY, email),
        SecureStore.setItemAsync(AUTH_STORAGE_KEY, token),
      ]);
      
      // Check if biometric authentication is available
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        // Ask user if they want to enable biometric auth
        Alert.alert(
          Platform.OS === 'ios' ? 'Enable Face ID?' : 'Enable Biometric Authentication?',
          'Use biometrics to quickly and securely access your wallet',
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
      
      setUserEmail(email);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(EMAIL_STORAGE_KEY),
        SecureStore.deleteItemAsync(AUTH_STORAGE_KEY),
        SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY),
      ]);
      setUserEmail(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        console.log('No biometric hardware available');
        return true; // Skip biometric if not available
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        console.log('No biometrics enrolled');
        return true; // Skip if user hasn't set up biometrics
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your wallet',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const value = {
    userEmail,
    isAuthenticated,
    loading,
    login,
    logout,
    authenticateWithBiometrics,
  };

  return (
    <AuthContext.Provider value={value}>
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

