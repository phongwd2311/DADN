import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../utils/theme';
import CustomInput from '../../components/CustomInput';
import GradientButton from '../../components/GradientButton';

const InputScreen = ({ navigation }: any) => {
  const [force, setForce] = useState('');
  const [velocity, setVelocity] = useState('');
  const [diameter, setDiameter] = useState('');
  const [life, setLife] = useState('');
  const [t1, setT1] = useState('');
  const [T1, setTr1] = useState('');
  const [t2, setT2] = useState('');
  const [T2, setTr2] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ force?: string; velocity?: string; diameter?: string }>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const fVal = Number(force);
    const vVal = Number(velocity);
    const dVal = Number(diameter);
    const lVal = Number(life);
    const t1Val = Number(t1);
    const t2Val = Number(t2);

    if (!force.trim()) newErrors.force = 'Yêu cầu nhập lực';
    else if (isNaN(fVal) || fVal <= 0 || fVal > 50000) newErrors.force = '0 < F ≤ 50,000 N';

    if (!velocity.trim()) newErrors.velocity = 'Yêu cầu nhập vận tốc';
    else if (isNaN(vVal) || vVal <= 0 || vVal > 5) newErrors.velocity = '0 < v ≤ 5 m/s';

    if (!diameter.trim()) newErrors.diameter = 'Yêu cầu nhập đường kính';
    else if (isNaN(dVal) || dVal <= 0 || dVal > 1000) newErrors.diameter = '0 < D ≤ 1000 mm';

    if (life.trim() && (isNaN(lVal) || lVal <= 0 || lVal > 100000)) newErrors.life = '0 < L ≤ 100,000';
    if (t1.trim() && (isNaN(t1Val) || t1Val < 0 || t1Val > 100)) newErrors.t1 = '0-100%';
    if (t2.trim() && (isNaN(t2Val) || t2Val < 0 || t2Val > 100)) newErrors.t2 = '0-100%';
    
    if (t1.trim() && t2.trim() && (t1Val + t2Val > 100)) {
       newErrors.t1 = 'Tổng % > 100';
       newErrors.t2 = 'Tổng % > 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async () => {
    if (!validate()) return;
    setLoading(true);
    
    // Call facade calculation
    try {
      // Calculate ratios if T1 and T2 are provided
      // T_ratio = (T_i / T_max). By convention in these problems, usually T1 is the maximum torque (T_max).
      // If user inputs T1 and T2, then T1_ratio = T1/T1 = 1.0, T2_ratio = T2/T1.
      const t1Num = t1 ? Number(t1) : undefined;
      const t2Num = t2 ? Number(t2) : undefined;
      
      const T1Num = T1 ? Number(T1) : undefined;
      const T2Num = T2 ? Number(T2) : undefined;
      
      let T1_ratio = 1;
      let T2_ratio = 1;
      
      if (T1Num !== undefined && T2Num !== undefined) {
        // T1 is considered T_max
        T1_ratio = 1;
        T2_ratio = T2Num / T1Num;
      }

      const { DesignFacade } = await import('../../business/DesignFacade');
      const facade = new DesignFacade();
      console.log("Calling performFullDesign with:", {
        F: Number(force),
        v: Number(velocity),
        D: Number(diameter),
        L: life ? Number(life) : undefined,
        t1: t1Num,
        T1_ratio: T1_ratio,
        t2: t2Num,
        T2_ratio: T2_ratio,
      });
      const result = await facade.performFullDesign({
        F: Number(force),
        v: Number(velocity),
        D: Number(diameter),
        L: life ? Number(life) : undefined,
        t1: t1Num,
        T1_ratio: T1_ratio,
        t2: t2Num,
        T2_ratio: T2_ratio,
      });

      console.log("Calculation successful:", !!result);
      setLoading(false);
      navigation.navigate('Result', {
        resultData: result,
        input: { F: force, v: velocity, D: diameter },
        strategy: 'cost',
      });
    } catch (e) {
      console.error("Calculation Error:", e);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Simple Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Thông số đầu vào</Text>
          <Text style={styles.headerSubtitle}>
            Nhập thông số kỹ thuật băng tải để tìm kiếm thiết bị phù hợp
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Form Card */}
          <View style={[styles.card, Shadows.card]}>
            <CustomInput
              label="Lực kéo băng tải F (N)"
              value={force}
              onChangeText={setForce}
              placeholder="e.g. 2500"
              keyboardType="numeric"
              error={errors.force}
              style={{ paddingBottom: Spacing.sm }}
            />

            <CustomInput
              label="Tốc độ băng tải v (m/s)"
              value={velocity}
              onChangeText={setVelocity}
              placeholder="e.g. 1.2"
              keyboardType="numeric"
              error={errors.velocity}
              style={{ paddingBottom: Spacing.sm }}
            />

            <CustomInput
              label="Đường kính tang quay D (mm)"
              value={diameter}
              onChangeText={setDiameter}
              placeholder="e.g. 320"
              keyboardType="numeric"
              error={errors.diameter}
              style={{ paddingBottom: Spacing.sm }}
            />

            <CustomInput
              label="Tuổi thọ/Thời gian phục vụ L (giờ)"
              value={life}
              onChangeText={setLife}
              placeholder="e.g. 20000"
              keyboardType="numeric"
              style={{ paddingBottom: Spacing.sm }}
            />

            {/* Load change over time (t1, T1 / t2, T2) */}
            <Text style={styles.sectionTitle}>
              Chế độ tải thay đổi theo thời gian
            </Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <CustomInput
                  label="t₁ (%)"
                  value={t1}
                  onChangeText={setT1}
                  placeholder="e.g. 10"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.spacer} />
              <View style={styles.col}>
                <CustomInput
                  label="T₁ (Nm)"
                  value={T1}
                  onChangeText={setTr1}
                  placeholder="e.g. 800"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <CustomInput
                  label="t₂ (%)"
                  value={t2}
                  onChangeText={setT2}
                  placeholder="e.g. 5"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.spacer} />
              <View style={styles.col}>
                <CustomInput
                  label="T₂ (Nm)"
                  value={T2}
                  onChangeText={setTr2}
                  placeholder="e.g. 1200"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Calculate Button */}
            <GradientButton
              title="TÌM KIẾM THIẾT BỊ"
              onPress={handleCalculate}
              loading={loading}
              gradient={Colors.gradientBlue}
              style={{ marginTop: Spacing.lg }}
              icon={<Ionicons name="search" size={20} color="#fff" />}
            />
          </View>
        </ScrollView>
        
        {/* Info Banner at bottom */}
        <View style={styles.bottomBanner}>
          <Text style={styles.bannerText}>
            <Text style={{ fontWeight: '700' }}>Lưu ý: </Text>
            Hệ thống sẽ tự động tính toán và gợi ý các thiết bị phù hợp nhất dựa trên thông số băng tải bạn nhập.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h2,
    color: '#1E293B',
    marginBottom: Spacing.xs,
    fontWeight: '800',
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },

  // Card
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },

  // Section
  sectionTitle: {
    ...Typography.label,
    fontSize: 15,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },

  // 2 Col layout
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
  },
  spacer: {
    width: Spacing.md,
  },

  // Bottom Banner
  bottomBanner: {
    backgroundColor: '#EBF5FF', // very light blue from figma
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: '#D1E8FF',
  },
  bannerText: {
    color: Colors.primaryDark,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default InputScreen;
