import { useEffect, useState, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://10.0.0.144:4000';

// Lazy load notifications to avoid native module errors in Expo Go
let Notifications: any = null;
let registerForPushNotificationsAsync: any = null;
let addNotificationReceivedListener: any = null;
let addNotificationResponseReceivedListener: any = null;

try {
  Notifications = require('expo-notifications');
  const notificationUtils = require('../utils/notifications');
  registerForPushNotificationsAsync = notificationUtils.registerForPushNotificationsAsync;
  addNotificationReceivedListener = notificationUtils.addNotificationReceivedListener;
  addNotificationResponseReceivedListener = notificationUtils.addNotificationResponseReceivedListener;
} catch (error) {
  console.log('Push notifications not available in this build');
}

function RootNavigator() {
  const { isAuthenticated, merchantEmail } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Mark navigation as ready after first render
    setIsNavigationReady(true);
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated and in auth group
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isNavigationReady]);

  // Register for push notifications when authenticated
  useEffect(() => {
    if (isAuthenticated && merchantEmail && registerForPushNotificationsAsync) {
      // Register for push notifications (only if available)
      registerForPushNotificationsAsync().then(async (token: string) => {
        if (token) {
          // Save push token to backend
          try {
            await fetch(`${API_BASE}/api/auth/save-push-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: merchantEmail, pushToken: token }),
            });
            console.log('Merchant push token saved:', token);
          } catch (error) {
            console.error('Failed to save merchant push token:', error);
          }
        }
      }).catch((error: any) => {
        console.log('Push notifications not available:', error.message);
      });

      // Listen for notifications while app is in foreground
      if (addNotificationReceivedListener) {
        notificationListener.current = addNotificationReceivedListener((notification: any) => {
          console.log('Merchant notification received:', notification);
        });
      }

      // Listen for notification taps
      if (addNotificationResponseReceivedListener) {
        responseListener.current = addNotificationResponseReceivedListener((response: any) => {
          const data = response.notification.request.content.data;
          if (data.type === 'payment_status') {
            // Navigate to history where merchant can see the updated status
            router.push('/(tabs)/history');
          }
        });
      }
    }

    return () => {
      if (notificationListener.current && Notifications?.removeNotificationSubscription) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current && Notifications?.removeNotificationSubscription) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [isAuthenticated, merchantEmail]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

