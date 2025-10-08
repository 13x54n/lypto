import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userEmail: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@zypto_auth';
const EMAIL_STORAGE_KEY = '@zypto_email';

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
      const [storedEmail, storedToken] = await Promise.all([
        AsyncStorage.getItem(EMAIL_STORAGE_KEY),
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
      ]);

      if (storedEmail && storedToken) {
        setUserEmail(storedEmail);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, token: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(EMAIL_STORAGE_KEY, email),
        AsyncStorage.setItem(AUTH_STORAGE_KEY, token),
      ]);
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
        AsyncStorage.removeItem(EMAIL_STORAGE_KEY),
        AsyncStorage.removeItem(AUTH_STORAGE_KEY),
      ]);
      setUserEmail(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  };

  const value = {
    userEmail,
    isAuthenticated,
    loading,
    login,
    logout,
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

