import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/design';

interface CardProps extends PropsWithChildren {
  variant?: 'default' | 'muted' | 'outlined';
  style?: ViewStyle | ViewStyle[];
}

export function Card({ children, variant = 'default', style }: CardProps) {
  return <View style={[styles.base, styles[variant], style as any]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#000",
  },
  default: {},
  muted: {
    backgroundColor: "#000",
  },
  outlined: {
    backgroundColor: 'transparent',
  },
});
