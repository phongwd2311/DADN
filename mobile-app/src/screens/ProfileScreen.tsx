import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../utils/theme';

const ProfileScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account settings</Text>
        </View>

        {/* Profile Info Card */}
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.userInfoRow}>
            <LinearGradient
              colors={Colors.gradientPurple}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="person-outline" size={32} color="#fff" />
            </LinearGradient>
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>Khai</Text>
              <Text style={styles.userEmail}>khai@drivecalc.com</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Calculations</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Saved Projects</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Member Since</Text>
            <Text style={styles.statValue}>Oct 2024</Text>
          </View>
        </View>

        {/* Settings Card */}
        <View style={[styles.card, Shadows.card]}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Account Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.replace('Welcome')}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
  
  // Header
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.h2,
    color: '#1E293B',
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },

  // User Info
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userInfoText: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    ...Typography.h3,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },

  // Stats
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
  },
  statValue: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '600',
  },

  // Settings Menu
  sectionTitle: {
    ...Typography.h3,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  menuItem: {
    paddingVertical: Spacing.md,
  },
  menuItemText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  signOutText: {
    color: Colors.error || '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
});

export default ProfileScreen;
