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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../utils/theme';
import { AuthContext } from '../../context/AuthContext';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = React.useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account settings</Text>
        </View>

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
              <Text style={styles.userName}>{user?.username || 'Khach'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'Chua dang nhap'}</Text>
            </View>
          </View>
        </View>

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

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default ProfileScreen;
