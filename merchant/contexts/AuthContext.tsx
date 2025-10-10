import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  merchantEmail: string | null;
  merchantToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [merchantEmail, setMerchantEmail] = useState<string | null>(null);
  const [merchantToken, setMerchantToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const email = await AsyncStorage.getItem('merchant_email');
      const token = await AsyncStorage.getItem('merchant_token');
      
      if (email && token) {
        setMerchantEmail(email);
        setMerchantToken(token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    }
  };

  const login = async (email: string, token: string) => {
    try {
      await AsyncStorage.setItem('merchant_email', email);
      await AsyncStorage.setItem('merchant_token', token);
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
      await AsyncStorage.removeItem('merchant_email');
      await AsyncStorage.removeItem('merchant_token');
      setMerchantEmail(null);
      setMerchantToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ merchantEmail, merchantToken, isAuthenticated, login, logout }}>
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

