import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useRef } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import GlobalPaymentAuthModal from '@/components/GlobalPaymentAuthModal';
import { API_BASE, endpoints } from '@/constants/api';

// Lazy load notifications to avoid native module errors in Expo Go
let Notifications: any = null;
let registerForPushNotificationsAsync: any = null;
let addNotificationReceivedListener: any = null;
let addNotificationResponseReceivedListener: any = null;

let setupNotificationCategories: any = null;

try {
  Notifications = require('expo-notifications');
  const notificationUtils = require('@/utils/notifications');
  registerForPushNotificationsAsync = notificationUtils.registerForPushNotificationsAsync;
  addNotificationReceivedListener = notificationUtils.addNotificationReceivedListener;
  addNotificationResponseReceivedListener = notificationUtils.addNotificationResponseReceivedListener;
  setupNotificationCategories = notificationUtils.setupNotificationCategories;
} catch (error) {
  console.log('Push notifications not available in this build');
}

function RootNavigator() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { userEmail, isAuthenticated } = useAuth();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    if (isAuthenticated && userEmail && registerForPushNotificationsAsync) {
      // Set up notification action buttons
      if (setupNotificationCategories) {
        setupNotificationCategories();
      }

      // Register for push notifications (only if available)
      registerForPushNotificationsAsync().then(async (token: string) => {
        if (token) {
          // Save push token to backend
          try {
            await fetch(`${API_BASE}/api/auth/save-push-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: userEmail, pushToken: token }),
            });
            console.log('Push token saved:', token);
          } catch (error) {
            console.error('Failed to save push token:', error);
          }
        }
      }).catch((error: any) => {
        console.log('Push notifications not available:', error.message);
      });

      // Listen for notifications while app is in foreground
      if (addNotificationReceivedListener) {
        notificationListener.current = addNotificationReceivedListener((notification: any) => {
          console.log('Notification received:', notification);
        });
      }

      // Listen for notification action taps (authorize/decline from notification)
      if (addNotificationResponseReceivedListener) {
        responseListener.current = addNotificationResponseReceivedListener(async (response: any) => {
          const data = response.notification.request.content.data;
          const actionIdentifier = response.actionIdentifier;

          // Handle quick actions from notification
          if (actionIdentifier === 'authorize' || actionIdentifier === 'decline') {
            const paymentId = data.paymentId;
            const status = actionIdentifier === 'authorize' ? 'confirmed' : 'declined';

            try {
              await fetch(endpoints.confirmPayment, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, status }),
              });
              console.log(`✅ Payment ${status} from notification action`);
            } catch (error) {
              console.error('Error processing payment action:', error);
            }
          } else if (data.type === 'payment_request') {
            // User tapped the notification itself (not an action button)
            router.push('/(tabs)/dashboard');
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
  }, [isAuthenticated, userEmail]);

  return (
    <PaymentProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen 
          name="dashboard" 
          options={{ 
            headerShown: false, 
            gestureEnabled: false,
            headerBackVisible: false 
          }} 
        />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
        <StatusBar style="dark" />
        
        {/* Global Payment Authorization Modal - appears automatically */}
        <GlobalPaymentAuthModal />
      </ThemeProvider>
    </PaymentProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
