import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
// After verifying OTP, you can optionally POST this security code to backend if needed.
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SecurityCodeSetupPage() {
  const [securityCode, setSecurityCode] = useState(['', '', '', '', '', '']);
  const [confirmCode, setConfirmCode] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'setup' | 'confirm'>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (value: string, index: number, isConfirm: boolean = false) => {
    if (isConfirm) {
      const newCode = [...confirmCode];
      newCode[index] = value;
      setConfirmCode(newCode);
    } else {
      const newCode = [...securityCode];
      newCode[index] = value;
      setSecurityCode(newCode);
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    const currentCode = step === 'confirm' ? confirmCode : securityCode;
    
    if (key === 'Backspace' && !currentCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleNext = () => {
    const code = securityCode.join('');
    
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit security code');
      return;
    }

    // Validate that all digits are different (basic validation)
    const uniqueDigits = new Set(code.split(''));
    if (uniqueDigits.size < 4) {
      Alert.alert('Error', 'Please use at least 4 different digits for better security');
      return;
    }

    setStep('confirm');
    // Clear confirm code and focus first input
    setConfirmCode(['', '', '', '', '', '']);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleConfirm = async () => {
    const originalCode = securityCode.join('');
    const confirmCodeStr = confirmCode.join('');
    
    if (confirmCodeStr.length !== 6) {
      Alert.alert('Error', 'Please confirm the complete 6-digit security code');
      return;
    }

    if (originalCode !== confirmCodeStr) {
      Alert.alert('Error', 'Security codes do not match. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to save security code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to dashboard
      router.replace('/dashboard');
    } catch {
      Alert.alert('Error', 'Failed to set security code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('setup');
      // Clear confirm code
      setConfirmCode(['', '', '', '', '', '']);
    } else {
      router.back();
    }
  };

  const currentCode = step === 'confirm' ? confirmCode : securityCode;
  const isComplete = currentCode.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>
              {step === 'setup' ? 'Set Security Code' : 'Confirm Security Code'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'setup' 
                ? 'Create a 6-digit security code for your account.'
                : 'Please confirm your security code.'
              }
            </Text>
          </View>

          {/* Security Code Input */}
          <View style={styles.codeContainer}>
            {currentCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.codeInput, 
                  digit && styles.codeInputFilled,
                  step === 'confirm' && digit && styles.codeInputConfirm
                ]}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index, step === 'confirm')}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0 && step === 'setup'}
                secureTextEntry
              />
            ))}
          </View>

          {/* Security Tips */}
          {step === 'setup' && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Security Tips:</Text>
              <Text style={styles.tipText}>• Use at least 4 different digits</Text>
              <Text style={styles.tipText}>• Avoid simple patterns like 123456</Text>
              <Text style={styles.tipText}>• Don&apos;t use your birth year or phone number</Text>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.button, 
              (!isComplete || isLoading) && styles.buttonDisabled
            ]}
            onPress={step === 'setup' ? handleNext : handleConfirm}
            disabled={!isComplete || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading 
                ? 'Setting up...' 
                : step === 'setup' 
                  ? 'Continue' 
                  : 'Complete Setup'
              }
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              You can change this code later in settings
            </Text>
          </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 54,
  },
  backButtonText: {
    fontSize: 16,
    color: '#55efc4',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  codeInput: {
    width: 48,
    height: 56,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  codeInputFilled: {
    borderColor: '#55efc4',
    backgroundColor: '#1a2a1a',
  },
  codeInputConfirm: {
    borderColor: '#fab1a0',
    backgroundColor: '#2a1a1a',
  },
  tipsContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#333',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
