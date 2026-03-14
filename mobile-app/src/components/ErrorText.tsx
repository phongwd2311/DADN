import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../utils/theme';

interface ErrorTextProps {
  message?: string;
}

const ErrorText: React.FC<ErrorTextProps> = ({ message }) => {
  if (!message) return null;
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={14} color={Colors.error} />
      <Text style={styles.error}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  error: {
    color: Colors.error,
    fontSize: 12,
    marginLeft: Spacing.xs,
  },
});

export default ErrorText;
