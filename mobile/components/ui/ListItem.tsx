import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography } from '@/constants/design';

interface ListItemProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function ListItem({ title, subtitle, left, right, style }: ListItemProps) {
  return (
    <View style={[styles.container, style as any]}>
      {left && <View style={styles.left}>{left}</View>}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#000",
    paddingVertical: 12,
  },
  left: { marginRight: 12 },
  content: { flex: 1 },
  right: { marginLeft: 12 },
  title: { color: Colors.textPrimary, fontSize: Typography.title, fontWeight: '600' as const },
  subtitle: { color: Colors.textSecondary, fontSize: Typography.body, marginTop: 4 },
});
