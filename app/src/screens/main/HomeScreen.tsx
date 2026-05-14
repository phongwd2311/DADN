import React, { useEffect, useState } from 'react';
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
import GlassCard from '../../components/GlassCard';
import { dashboardApi } from '../../api';

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  iconBgColor: string;
  iconColor: string;
  onPress: () => void;
}

const FeatureCard = ({ icon, title, subtitle, iconBgColor, iconColor, onPress }: FeatureCardProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.featureCard}>
    <View style={[styles.featureCardInner, Shadows.card]}>
      <View style={[styles.featureIconBg, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.featureTextWrapper}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureSubtitle}>{subtitle}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }: any) => {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardApi.getOverview();
        setDashboard(data);
      } catch (error) {
        console.log('Load dashboard failed:', error);
      }
    };

    loadDashboard();
  }, []);

  const totalCalculations = dashboard?.summary?.total_calculations ?? 0;
  const savedProjects = dashboard?.quick_access?.templates_count ?? 0;
  const lastCalculationAt = dashboard?.summary?.last_calculation_at
    ? new Date(dashboard.summary.last_calculation_at).toLocaleDateString('vi-VN')
    : 'N/A';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Action - New Calculation (Hero Banner at top) */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Calculate')}
          activeOpacity={0.85}
          style={styles.heroCardWrapper}
        >
          <LinearGradient
            colors={Colors.gradientHero}
            style={[styles.heroCard, Shadows.glow(Colors.primary)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextArea}>
                <Text style={styles.heroTitle}>New Calculation</Text>
                <Text style={styles.heroSubtitle}>Start designing your industrial drive system</Text>
                
                <View style={styles.heroAction}>
                  <Text style={styles.heroActionText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
                </View>
              </View>

              <View style={styles.heroIconWrapper}>
                <View style={styles.heroIconBg}>
                  <Ionicons name="calculator" size={28} color="#fff" />
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Feature Cards */}
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureGrid}>
          <FeatureCard
            icon="calculator"
            title="Calculations"
            subtitle="Motor, Gear, Shaft"
            iconBgColor={Colors.gradientCyan[0] + '20'} // Light transparent background
            iconColor={Colors.gradientCyan[0]}
            onPress={() => navigation.navigate('Calculate')}
          />
          <FeatureCard
            icon="time"
            title="History"
            subtitle="Past results"
            iconBgColor={Colors.gradientPurple[0] + '20'}
            iconColor={Colors.gradientPurple[0]}
            onPress={() => navigation.navigate('History')}
          />
          <FeatureCard
            icon="document-text"
            title="Tech Standards"
            subtitle="View specs & data"
            iconBgColor={Colors.success + '20'}
            iconColor={Colors.success}
            onPress={() => navigation.navigate('Standards')}
          />
          <FeatureCard
            icon="hardware-chip"
            title="Motors"
            subtitle="Browse motor models"
            iconBgColor={Colors.warning + '20'}
            iconColor={Colors.warning}
            onPress={() => navigation.navigate('Motors')}
          />
        </View>

        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={[styles.statsContainer, Shadows.card]}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCalculations}</Text>
              <Text style={styles.statLabel}>TOTAL CALCULATIONS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lastCalculationAt}</Text>
              <Text style={styles.statLabel}>LAST CALCULATION</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{savedProjects}</Text>
              <Text style={styles.statLabel}>SAVED PROJECTS</Text>
            </View>
          </View>
        </View>

        {dashboard?.recent_calculations?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Calculations</Text>
            <View style={[styles.statsContainer, Shadows.card]}>
              {dashboard.recent_calculations.slice(0, 3).map((item: any) => (
                <TouchableOpacity
                  key={item.session_id}
                  style={styles.recentItem}
                  onPress={() => navigation.navigate('History')}
                >
                  <Text style={styles.recentName} numberOfLines={1}>
                    {item.session_name}
                  </Text>
                  <Text style={styles.recentMeta}>
                    {item.pct ? `${Number(item.pct).toFixed(2)} kW` : 'N/A'} â€¢ {item.motor_model ?? 'N/A'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl, // Removed avatar/header, banner is first
    paddingBottom: 100,
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
    alignItems: 'center',
  },
  heroTextArea: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: Spacing.lg,
    lineHeight: 20,
    paddingRight: Spacing.xl,
  },
  heroAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  heroActionText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
    marginRight: Spacing.xs,
  },
  heroIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  heroIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Title
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
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
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  featureTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
  },

  // Stats
  statsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.border,
  },
  recentItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  recentName: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  recentMeta: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
  },
});

export default HomeScreen;
