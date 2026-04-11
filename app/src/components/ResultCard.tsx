import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../utils/theme';

interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
}

const ResultCard: React.FC<ResultCardProps> = ({
  label,
  value,
  unit,
  icon,
  accentColor = Colors.primary,
  style,
}) => {
  return (
    <View style={[styles.card, Shadows.card, style]}>
      <View style={[styles.iconBadge, { backgroundColor: accentColor + '20' }]}>
        {icon || <Text style={[styles.iconFallback, { color: accentColor }]}>⚙</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconFallback: {
    fontSize: 18,
  },
  label: {
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  unit: {
    ...Typography.bodySmall,
    marginLeft: Spacing.xs,
    color: Colors.textMuted,
  },
});

export default ResultCard;
