import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../utils/theme';
import CustomInput from '../components/CustomInput';
import GradientButton from '../components/GradientButton';
import GlassCard from '../components/GlassCard';

type Strategy = 'cost' | 'durability';

const InputScreen = ({ navigation }: any) => {
  const [force, setForce] = useState('');
  const [velocity, setVelocity] = useState('');
  const [diameter, setDiameter] = useState('');
  const [strategy, setStrategy] = useState<Strategy>('cost');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ force?: string; velocity?: string; diameter?: string }>({});

  const validate = () => {
    const newErrors: { force?: string; velocity?: string; diameter?: string } = {};
    if (!force.trim()) newErrors.force = 'Force is required';
    else if (isNaN(Number(force)) || Number(force) <= 0) newErrors.force = 'Must be a positive number';

    if (!velocity.trim()) newErrors.velocity = 'Velocity is required';
    else if (isNaN(Number(velocity)) || Number(velocity) <= 0) newErrors.velocity = 'Must be a positive number';

    if (!diameter.trim()) newErrors.diameter = 'Diameter is required';
    else if (isNaN(Number(diameter)) || Number(diameter) <= 0) newErrors.diameter = 'Must be a positive number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate calculation
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Result', {
        input: {
          F: Number(force),
          v: Number(velocity),
          D: Number(diameter),
        },
        strategy,
      });
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Input Parameters</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Info Banner */}
        <GlassCard accentColor={Colors.info} style={styles.infoBanner}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={18} color={Colors.info} />
            <Text style={styles.infoText}>
              Enter conveyor belt parameters to calculate the drive system design.
            </Text>
          </View>
        </GlassCard>

        {/* Conveyor Parameters Section */}
        <Text style={styles.sectionTitle}>
          <Ionicons name="settings" size={16} color={Colors.textSecondary} />{' '}
          Conveyor Parameters
        </Text>

        <CustomInput
          label="Lực vòng F"
          value={force}
          onChangeText={setForce}
          placeholder="e.g. 2500"
          unit="N"
          keyboardType="numeric"
          error={errors.force}
          icon={<Ionicons name="flash" size={16} color={Colors.textMuted} />}
        />

        <CustomInput
          label="Vận tốc v"
          value={velocity}
          onChangeText={setVelocity}
          placeholder="e.g. 1.2"
          unit="m/s"
          keyboardType="numeric"
          error={errors.velocity}
          icon={<Ionicons name="speedometer" size={16} color={Colors.textMuted} />}
        />

        <CustomInput
          label="Đường kính tang D"
          value={diameter}
          onChangeText={setDiameter}
          placeholder="e.g. 320"
          unit="mm"
          keyboardType="numeric"
          error={errors.diameter}
          icon={<Ionicons name="ellipse-outline" size={16} color={Colors.textMuted} />}
        />

        {/* Optimization Strategy Section */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
          <Ionicons name="bulb" size={16} color={Colors.textSecondary} />{' '}
          Optimization Strategy
        </Text>

        <View style={styles.strategyRow}>
          <TouchableOpacity
            style={[
              styles.strategyCard,
              strategy === 'cost' && styles.strategyCardActive,
            ]}
            onPress={() => setStrategy('cost')}
            activeOpacity={0.7}
          >
            <View style={[styles.strategyIcon, { backgroundColor: Colors.success + '20' }]}>
              <Ionicons name="wallet" size={22} color={Colors.success} />
            </View>
            <Text style={[styles.strategyLabel, strategy === 'cost' && styles.strategyLabelActive]}>
              Cost
            </Text>
            <Text style={styles.strategyDesc}>Optimize for cost</Text>
            {strategy === 'cost' && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.strategyCard,
              strategy === 'durability' && styles.strategyCardActive,
            ]}
            onPress={() => setStrategy('durability')}
            activeOpacity={0.7}
          >
            <View style={[styles.strategyIcon, { backgroundColor: Colors.accent + '20' }]}>
              <Ionicons name="shield-checkmark" size={22} color={Colors.accent} />
            </View>
            <Text style={[styles.strategyLabel, strategy === 'durability' && styles.strategyLabelActive]}>
              Durability
            </Text>
            <Text style={styles.strategyDesc}>Optimize for life</Text>
            {strategy === 'durability' && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Calculate Button */}
        <GradientButton
          title="Calculate"
          onPress={handleCalculate}
          loading={loading}
          style={{ marginTop: Spacing.xxl }}
          icon={<Ionicons name="calculator" size={20} color="#fff" />}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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

  // Info Banner
  infoBanner: {
    marginBottom: Spacing.xl,
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    ...Typography.bodySmall,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },

  // Section
  sectionTitle: {
    ...Typography.caption,
    fontSize: 12,
    marginBottom: Spacing.md,
    color: Colors.textSecondary,
  },

  // Strategy
  strategyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strategyCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
  },
  strategyCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  strategyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  strategyLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  strategyLabelActive: {
    color: Colors.primary,
  },
  strategyDesc: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 12,
  },
  checkBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
});

export default InputScreen;
