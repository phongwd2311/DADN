import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../utils/theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  gradient?: readonly [string, string, ...string[]];
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  gradient = Colors.gradientBlue,
  loading = false,
  disabled = false,
  outlined = false,
  style,
  icon,
}) => {
  if (outlined) {
    return (
      <TouchableOpacity
        style={[styles.outlinedButton, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {icon && <>{icon}</>}
        <Text style={[styles.outlinedText, icon ? { marginLeft: Spacing.sm } : {}]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={style}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, disabled && styles.disabled, Shadows.glow(gradient[0])]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text style={[styles.text, icon ? { marginLeft: Spacing.sm } : {}]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    minHeight: 50,
  },
  text: {
    ...Typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
  outlinedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    minHeight: 50,
  },
  outlinedText: {
    ...Typography.h3,
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default GradientButton;
