import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../utils/theme';
import GlassCard from '../components/GlassCard';

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  gradient: readonly [string, string, ...string[]];
  onPress: () => void;
}

const FeatureCard = ({ icon, title, subtitle, gradient, onPress }: FeatureCardProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.featureCard}>
    <View style={[styles.featureCardInner, Shadows.card]}>
      <LinearGradient
        colors={gradient}
        style={styles.featureIconBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon} size={24} color="#fff" />
      </LinearGradient>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Khai 👋</Text>
            <Text style={styles.subtitle}>Ready to design your next system?</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <LinearGradient
              colors={Colors.gradientBlue}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>K</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Action - New Calculation */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Calculate')}
          activeOpacity={0.85}
          style={styles.heroCardWrapper}
        >
          <LinearGradient
            colors={Colors.gradientBlue}
            style={[styles.heroCard, Shadows.glow(Colors.primary)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextArea}>
                <Text style={styles.heroTitle}>New Calculation</Text>
                <Text style={styles.heroSubtitle}>Start designing your conveyor drive system</Text>
              </View>
              <View style={styles.heroIcon}>
                <Ionicons name="add-circle" size={48} color="rgba(255,255,255,0.3)" />
              </View>
            </View>
            <View style={styles.heroAction}>
              <Text style={styles.heroActionText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Feature Cards */}
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureGrid}>
          <FeatureCard
            icon="calculator"
            title="Calculations"
            subtitle="Motor, Gear, Chain"
            gradient={Colors.gradientCyan}
            onPress={() => navigation.navigate('Calculate')}
          />
          <FeatureCard
            icon="time"
            title="History"
            subtitle="Past results"
            gradient={Colors.gradientPurple}
            onPress={() => navigation.navigate('History')}
          />
          <FeatureCard
            icon="hardware-chip"
            title="Components"
            subtitle="Motor & Chain DB"
            gradient={Colors.gradientSuccess}
            onPress={() => {}}
          />
          <FeatureCard
            icon="bulb"
            title="Expert System"
            subtitle="AI suggestions"
            gradient={Colors.gradientWarning}
            onPress={() => {}}
          />
        </View>

        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <GlassCard>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Total Calculations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Nov 5</Text>
              <Text style={styles.statLabel}>Last Calculation</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Saved Designs</Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  avatarContainer: {},
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  // Hero Card
  heroCardWrapper: {
    marginBottom: Spacing.xl,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTextArea: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  heroIcon: {
    marginLeft: Spacing.md,
  },
  heroAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  heroActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginRight: Spacing.xs,
  },

  // Section Title
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
    color: Colors.textSecondary,
  },

  // Feature Grid
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  featureCard: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  featureCardInner: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  featureTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 12,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.value,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    fontSize: 10,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
});

export default HomeScreen;
