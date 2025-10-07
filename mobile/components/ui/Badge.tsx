import React, { PropsWithChildren } from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Typography } from '@/constants/design';

interface BadgeProps extends PropsWithChildren {
  color?: 'primary' | 'warning' | 'danger' | 'info' | 'neutral';
  style?: ViewStyle | ViewStyle[];
}

export function Badge({ children, color = 'neutral', style }: BadgeProps) {
  return (
    <View style={[styles.base, styles[color], style as any]}>
      <Text style={[styles.text, styles[`${color}Text` as const]]}>{children as any}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: { fontSize: Typography.label, fontWeight: '600' as const },

  primary: { backgroundColor: Colors.primary },
  primaryText: { color: Colors.primaryOn },

  warning: { backgroundColor: Colors.warning },
  warningText: { color: '#000' },

  danger: { backgroundColor: Colors.danger },
  dangerText: { color: Colors.textPrimary },

  info: { backgroundColor: Colors.info },
  infoText: { color: Colors.textPrimary },

  neutral: { backgroundColor: Colors.surface },
  neutralText: { color: Colors.textSecondary },
});
