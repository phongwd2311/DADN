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
import ResultCard from '../components/ResultCard';
import GradientButton from '../components/GradientButton';

const ResultScreen = ({ route, navigation }: any) => {
  // Get params or use defaults
  const input = route?.params?.input ?? { F: 2500, v: 1.2, D: 320 };
  const strategy = route?.params?.strategy ?? 'cost';

  // Mock calculation results
  const results = {
    motorPower: 3.0,
    transmissionRatio: 18.5,
    chainParams: { z1: 21, z2: 63, pitch: 19.05 },
    recommendedMotor: { id: 'M02', power: 3.0, speed: 1450, type: 'K' },
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Results</Text>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Hero Result Card */}
        <LinearGradient
          colors={Colors.gradientBlue}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.heroCard, Shadows.glow(Colors.primary)]}
        >
          <Text style={styles.heroLabel}>MOTOR POWER</Text>
          <View style={styles.heroValueRow}>
            <Text style={styles.heroValue}>{results.motorPower}</Text>
            <Text style={styles.heroUnit}>kW</Text>
          </View>
          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <Ionicons name="flash" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.heroMetaText}>F = {input.F} N</Text>
            </View>
            <View style={styles.heroMetaItem}>
              <Ionicons name="speedometer" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.heroMetaText}>v = {input.v} m/s</Text>
            </View>
            <View style={styles.heroMetaItem}>
              <Ionicons name="ellipse-outline" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.heroMetaText}>D = {input.D} mm</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Detailed Results Grid */}
        <Text style={styles.sectionTitle}>Detailed Results</Text>
        <View style={styles.resultGrid}>
          <View style={styles.resultGridItem}>
            <ResultCard
              label="Tỷ số truyền"
              value={results.transmissionRatio}
              icon={<Ionicons name="git-branch" size={18} color={Colors.accent} />}
              accentColor={Colors.accent}
            />
          </View>
          <View style={styles.resultGridItem}>
            <ResultCard
              label="Chain Z1"
              value={results.chainParams.z1}
              unit="teeth"
              icon={<Ionicons name="link" size={18} color={Colors.success} />}
              accentColor={Colors.success}
            />
          </View>
          <View style={styles.resultGridItem}>
            <ResultCard
              label="Chain Z2"
              value={results.chainParams.z2}
              unit="teeth"
              icon={<Ionicons name="link" size={18} color={Colors.warning} />}
              accentColor={Colors.warning}
            />
          </View>
          <View style={styles.resultGridItem}>
            <ResultCard
              label="Pitch"
              value={results.chainParams.pitch}
              unit="mm"
              icon={<Ionicons name="resize" size={18} color={Colors.primary} />}
              accentColor={Colors.primary}
            />
          </View>
        </View>

        {/* Recommended Component */}
        <Text style={styles.sectionTitle}>Recommended Component</Text>
        <GlassCard accentColor={Colors.success}>
          <View style={styles.componentRow}>
            <LinearGradient
              colors={Colors.gradientSuccess}
              style={styles.componentIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="hardware-chip" size={22} color="#fff" />
            </LinearGradient>
            <View style={styles.componentInfo}>
              <Text style={styles.componentName}>Motor {results.recommendedMotor.id}</Text>
              <Text style={styles.componentSpec}>
                {results.recommendedMotor.power} kW @ {results.recommendedMotor.speed} rpm
              </Text>
              <Text style={styles.componentType}>Type: {results.recommendedMotor.type}</Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>Best Match</Text>
            </View>
          </View>
        </GlassCard>

        {/* Strategy Info */}
        <GlassCard style={styles.strategyInfo} accentColor={strategy === 'cost' ? Colors.success : Colors.accent}>
          <View style={styles.strategyRow}>
            <Ionicons
              name={strategy === 'cost' ? 'wallet' : 'shield-checkmark'}
              size={18}
              color={strategy === 'cost' ? Colors.success : Colors.accent}
            />
            <Text style={styles.strategyText}>
              Optimized for {strategy === 'cost' ? 'Cost Efficiency' : 'Maximum Durability'}
            </Text>
          </View>
        </GlassCard>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <GradientButton
            title="Save Result"
            onPress={() => {}}
            gradient={Colors.gradientSuccess}
            icon={<Ionicons name="save" size={18} color="#fff" />}
            style={{ flex: 1, marginRight: Spacing.sm }}
          />
          <GradientButton
            title="New Calc"
            onPress={() => navigation.goBack()}
            outlined
            icon={<Ionicons name="refresh" size={18} color={Colors.primary} />}
            style={{ flex: 1, marginLeft: Spacing.sm }}
          />
        </View>
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
    paddingBottom: Spacing.xxxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h2,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Hero Card
  heroCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  heroLabel: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff',
  },
  heroUnit: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginLeft: Spacing.sm,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
    marginVertical: 2,
  },
  heroMetaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
  },

  // Section
  sectionTitle: {
    ...Typography.caption,
    fontSize: 12,
    marginBottom: Spacing.md,
    color: Colors.textSecondary,
  },

  // Result Grid
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  resultGridItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },

  // Component
  componentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  componentIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  componentInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  componentName: {
    ...Typography.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  componentSpec: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontSize: 13,
  },
  componentType: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 11,
  },
  matchBadge: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  matchText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // Strategy Info
  strategyInfo: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    padding: Spacing.md,
  },
  strategyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strategyText: {
    ...Typography.bodySmall,
    marginLeft: Spacing.sm,
    color: Colors.textSecondary,
  },

  // Actions
  actionButtons: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
});

export default ResultScreen;
