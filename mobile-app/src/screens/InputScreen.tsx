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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../utils/theme';
import CustomInput from '../components/CustomInput';
import GradientButton from '../components/GradientButton';

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
    const newErrors: { force?: string; velocity?: string; diameter?: string } = {};
    if (!force.trim()) newErrors.force = 'Yêu cầu nhập lực';
    else if (isNaN(Number(force)) || Number(force) <= 0) newErrors.force = 'Số dương';

    if (!velocity.trim()) newErrors.velocity = 'Yêu cầu nhập vận tốc';
    else if (isNaN(Number(velocity)) || Number(velocity) <= 0) newErrors.velocity = 'Số dương';

    if (!diameter.trim()) newErrors.diameter = 'Yêu cầu nhập đường kính';
    else if (isNaN(Number(diameter)) || Number(diameter) <= 0) newErrors.diameter = 'Số dương';

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
        strategy: 'cost',
      });
    }, 1200);
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
