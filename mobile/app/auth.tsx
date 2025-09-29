import * as React from 'react'
import { StyleSheet, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { api } from '@/lib/api'
import { storage } from '@/lib/secure-storage'

export default function AuthScreen() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState('')
  const [step, setStep] = React.useState<'email' | 'otp'>('email')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const requestCode = async () => {
    try {
      setError(null)
      setLoading(true)
      console.log('Requesting OTP for:', email)
      console.log('API URL:', process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api')
      await api.requestOtp(email)
      setStep('otp')
    } catch (e: any) {
      console.error('OTP request failed:', e)
      setError(e?.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    try {
      setError(null)
      setLoading(true)
      const result = await api.verifyOtp(email, code)
      await storage.setToken(result.token)
      if (result.user) {
        await storage.setUser(result.user)
      }
      router.replace('/(tabs)')
    } catch (e: any) {
      setError(e?.message || 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Enter your email to receive a one-time code.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {step === 'email' ? (
          <>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <Pressable style={[styles.button, !email || loading ? styles.buttonDisabled : null]} onPress={requestCode} disabled={!email || loading}>
              <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send code'}</Text>
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              value={code}
              onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              style={styles.input}
            />
            <Pressable style={[styles.button, code.length !== 6 || loading ? styles.buttonDisabled : null]} onPress={verifyCode} disabled={code.length !== 6 || loading}>
              <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify & continue'}</Text>
            </Pressable>
            <Pressable style={[styles.secondaryButton]} onPress={requestCode} disabled={loading}>
              <Text style={styles.secondaryText}>{loading ? 'Resending...' : 'Resend code'}</Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    backgroundColor: '#000000' 
  },
  card: { 
    width: '100%', 
    maxWidth: 420, 
    gap: 16,
    backgroundColor: '#111111',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: { 
    fontSize: 16, 
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 8
  },
  error: { 
    color: '#ef4444', 
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#1f1f1f',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#1f1f1f', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16,
    backgroundColor: '#000000',
    color: '#ffffff',
    textAlign: 'center'
  },
  button: { 
    backgroundColor: '#10b981', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: { 
    opacity: 0.5,
    backgroundColor: '#374151'
  },
  buttonText: { 
    color: '#ffffff', 
    fontWeight: '600',
    fontSize: 16
  },
  secondaryButton: { 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f'
  },
  secondaryText: { 
    color: '#9ca3af', 
    fontWeight: '600',
    fontSize: 16
  },
})


