import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../utils/theme';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={[styles.logoContainer, Shadows.card]}>
            <LinearGradient
              colors={Colors.gradientBlue}
              style={styles.logoBg}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="settings-outline" size={48} color="#fff" />
            </LinearGradient>
          </View>
          
          <Text style={styles.appTitle}>DriveCalc</Text>
          <Text style={styles.appSubtitle}>
            Hệ thống tính toán và gợi ý thiết bị công nghiệp thông minh
          </Text>
          <Text style={styles.appDescription}>
            Tối ưu hóa quy trình thiết kế hệ thống truyền động của bạn
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, Shadows.glow(Colors.primary)]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.primaryButtonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Register')}
          >
            <Ionicons name="person-add-outline" size={20} color={Colors.primary} style={styles.btnIcon} />
            <Text style={styles.secondaryButtonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Help icon at bottom right like in Figma */}
      <TouchableOpacity style={styles.helpButton}>
        <Ionicons name="help" size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Logo
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl * 1.5,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  logoBg: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    ...Typography.h1,
    fontSize: 42,
    color: Colors.primaryDark, // Dark blue color from Figma
    marginBottom: Spacing.md,
    fontWeight: '800',
  },
  appSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  appDescription: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginLeft: Spacing.sm,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  btnIcon: {
    marginRight: Spacing.sm,
  },
  
  // floating help button
  helpButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  }
});

export default WelcomeScreen;
