import React, { PropsWithChildren } from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Typography } from '@/constants/design';

interface ButtonProps extends PropsWithChildren {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onPress,
  disabled,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style as any,
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label` as const]]}>{children as any}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: { paddingVertical: 8, paddingHorizontal: 12 },
  md: { paddingVertical: 12, paddingHorizontal: 16 },
  lg: { paddingVertical: 14, paddingHorizontal: 20 },

  primary: { backgroundColor: "#fff" },
  secondary: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: Colors.danger },

  label: { fontSize: Typography.body, fontWeight: '600' as const },
  primaryLabel: { color: Colors.primaryOn },
  secondaryLabel: { color: Colors.textPrimary },
  ghostLabel: { color: Colors.textSecondary },
  dangerLabel: { color: Colors.textPrimary },

  disabled: { opacity: 0.6 },
});
