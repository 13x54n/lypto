import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="email" 
        options={{ 
          headerShown: false,
          title: 'Email Authentication'
        }} 
      />
      <Stack.Screen 
        name="otp" 
        options={{ 
          headerShown: false,
          title: 'OTP Verification'
        }} 
      />
      <Stack.Screen 
        name="security-code" 
        options={{ 
          headerShown: false,
          title: 'Security Code Setup'
        }} 
      />
    </Stack>
  );
}
