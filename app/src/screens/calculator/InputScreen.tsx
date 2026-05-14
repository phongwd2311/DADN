import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../utils/theme';
import CustomInput from '../../components/CustomInput';
import GradientButton from '../../components/GradientButton';
import { calculateApi, ChainLayoutType, ExternalDriveType, GearboxType } from '../../api/calculateApi';
import { draftsApi, templatesApi } from '../../api';

const InputScreen = ({ navigation }: any) => {
  const [force, setForce] = useState('');
  const [velocity, setVelocity] = useState('');
  const [diameter, setDiameter] = useState('');
  const [t1, setT1] = useState('');
  const [T1, setTr1] = useState('');
  const [t2, setT2] = useState('');
  const [T2, setTr2] = useState('');
  const [uh, setUh] = useState('12.5');
  const [tmmRatio, setTmmRatio] = useState('1.6');
  const [gearboxType, setGearboxType] = useState<GearboxType>('KHAI_TRIEN');
  const [externalDriveType, setExternalDriveType] = useState<ExternalDriveType>('CHAIN');
  const [chainLayout, setChainLayout] = useState<ChainLayoutType>('HORIZONTAL_OR_LT40');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [draftId, setDraftId] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<{ force?: string; velocity?: string; diameter?: string; uh?: string; tmmRatio?: string; t1?: string; t2?: string }>({});
  const isHydratingRef = useRef(true);

  const applyTemplateInput = (input: any) => {
    if (!input || typeof input !== 'object') return;
    setForce(String(input.F ?? ''));
    setVelocity(String(input.v ?? ''));
    setDiameter(String(input.D ?? ''));
    setT1(String(input.t1 ?? ''));
    setT2(String(input.t2 ?? ''));
    setUh(String(input.uh ?? '12.5'));
    setTmmRatio(String(input.tmm_t1_ratio ?? '1.6'));
    setGearboxType(input.gearbox_type === 'PHAN_DOI' ? 'PHAN_DOI' : 'KHAI_TRIEN');
    const edt = ['CHAIN', 'BELT', 'GEAR', 'NONE'].includes(input.external_drive_type)
      ? (input.external_drive_type as ExternalDriveType)
      : 'CHAIN';
    setExternalDriveType(edt);
    const cl = input.chain_layout === 'STEEP_GT40' ? 'STEEP_GT40' : 'HORIZONTAL_OR_LT40';
    setChainLayout(cl);
  };

  const buildCalculationPayload = (overrides?: Partial<Record<string, unknown>>) => {
    const t1Num = t1 ? Number(t1) : undefined;
    const t2Num = t2 ? Number(t2) : undefined;

    const T1Num = T1 ? Number(T1) : undefined;
    const T2Num = T2 ? Number(T2) : undefined;

    let T1_ratio = 1;
    let T2_ratio = 1;
    if (T1Num !== undefined && T2Num !== undefined && T1Num > 0) {
      T1_ratio = 1;
      T2_ratio = T2Num / T1Num;
    }

    return {
      F: Number(force),
      v: Number(velocity),
      D: Number(diameter),
      t1: t1Num ?? 20,
      T1_ratio,
      t2: t2Num ?? 80,
      T2_ratio: T2_ratio ?? 0.65,
      uh: Number(uh),
      gearbox_type: gearboxType,
      tmm_t1_ratio: Number(tmmRatio),
      external_drive_type: externalDriveType,
      chain_layout: externalDriveType === 'CHAIN' ? chainLayout : undefined,
      ...(overrides ?? {}),
    };
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [draftRes, templateRes] = await Promise.all([
          draftsApi.getLatest(),
          templatesApi.getAll(),
        ]);

        if (Array.isArray(templateRes?.templates)) {
          setTemplates(templateRes.templates);
        }

        const latestDraft = draftRes?.draft;
        if (latestDraft?.draft_id) {
          setDraftId(Number(latestDraft.draft_id));
        }

        const hasAnyLocalInput = !!(force || velocity || diameter || t1 || t2 || uh || tmmRatio);
        if (!hasAnyLocalInput && latestDraft?.input) {
          applyTemplateInput(latestDraft.input);
        }
      } catch (error) {
        console.log('Load draft/template failed:', error);
      } finally {
        isHydratingRef.current = false;
      }
    };

    bootstrap();
    // intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isHydratingRef.current) {
      return;
    }

    const hasAnyInput = !!(force || velocity || diameter || t1 || t2 || T1 || T2 || uh || tmmRatio);
    if (!hasAnyInput) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const payloadInput = buildCalculationPayload();
        const res = await draftsApi.autosave({
          draft_id: draftId,
          draft_name: 'InputScreen Draft',
          input: payloadInput,
          result: null,
        });
        if (res?.draft_id) {
          setDraftId(Number(res.draft_id));
        }
      } catch (error) {
        console.log('Autosave draft failed:', error);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [force, velocity, diameter, t1, T1, t2, T2, uh, tmmRatio, gearboxType, externalDriveType, chainLayout, draftId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const fVal = Number(force);
    const vVal = Number(velocity);
    const dVal = Number(diameter);
    const t1Val = Number(t1);
    const t2Val = Number(t2);
    const uhVal = Number(uh);
    const tmmVal = Number(tmmRatio);

    if (!force.trim()) newErrors.force = 'Yêu cầu nhập lực';
    else if (isNaN(fVal) || fVal <= 0 || fVal > 50000) newErrors.force = '0 < F ≤ 50,000 N';

    if (!velocity.trim()) newErrors.velocity = 'Yêu cầu nhập vận tốc';
    else if (isNaN(vVal) || vVal <= 0 || vVal > 5) newErrors.velocity = '0 < v ≤ 5 m/s';

    if (!diameter.trim()) newErrors.diameter = 'Yêu cầu nhập đường kính';
    else if (isNaN(dVal) || dVal <= 0 || dVal > 1000) newErrors.diameter = '0 < D ≤ 1000 mm';

    if (t1.trim() && (isNaN(t1Val) || t1Val < 0 || t1Val > 100)) newErrors.t1 = '0-100%';
    if (t2.trim() && (isNaN(t2Val) || t2Val < 0 || t2Val > 100)) newErrors.t2 = '0-100%';
    if (!uh.trim() || isNaN(uhVal) || uhVal <= 0) newErrors.uh = 'uh phải > 0';
    if (!tmmRatio.trim() || isNaN(tmmVal) || tmmVal <= 0) newErrors.tmmRatio = 'Tmm/T1 phải > 0';
    
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
    
    try {
      const payload = buildCalculationPayload();
      const result = await calculateApi.calculate(payload);

      setLoading(false);
      navigation.navigate('Result', {
        resultData: result,
        input: { F: force, v: velocity, D: diameter },
        calculationInput: payload,
        strategy: 'cost',
      });
    } catch (e) {
      console.error("Calculation Error:", e);
      const maybeAxiosError = e as any;
      const backendCode = maybeAxiosError?.response?.data?.code;
      if (backendCode === 'motor_overload_requirement_not_met') {
        Alert.alert('Không tìm thấy động cơ phù hợp', 'Không có động cơ thỏa điều kiện quá tải. Vui lòng giảm yêu cầu tải hoặc chỉnh lại Tmm/T1.');
      } else {
        Alert.alert('Lỗi tính toán', 'Tính toán thất bại. Vui lòng kiểm tra lại thông số đầu vào.');
      }
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const payload = buildCalculationPayload();
      const templateName = `Template ${new Date().toLocaleString('vi-VN')}`;
      await templatesApi.create(templateName, payload);
      const refreshed = await templatesApi.getAll();
      setTemplates(Array.isArray(refreshed?.templates) ? refreshed.templates : []);
      Alert.alert('Thành công', 'Đã lưu template nhanh.');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu template.');
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

            {/* Load change over time (t1, T1 / t2, T2) */}
            <Text style={styles.sectionTitle}>
              Chế độ tải thay đổi theo thời gian
            </Text>

            <View style={styles.templateHeader}>
              <Text style={styles.sectionTitle}>Template Library</Text>
              <TouchableOpacity onPress={handleSaveTemplate}>
                <Text style={styles.saveTemplateText}>LÆ°u template</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateRow}>
              {templates.slice(0, 8).map((tpl: any) => (
                <TouchableOpacity
                  key={String(tpl.template_id)}
                  style={styles.templateChip}
                  onPress={() => applyTemplateInput(tpl.input)}
                >
                  <Text style={styles.templateChipText} numberOfLines={1}>
                    {tpl.template_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

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

            <CustomInput
              label="Tỷ số truyền hộp giảm tốc uh"
              value={uh}
              onChangeText={setUh}
              placeholder="e.g. 12.5"
              keyboardType="numeric"
              error={errors.uh}
              style={{ paddingBottom: Spacing.sm }}
            />

            <CustomInput
              label="Tỷ số quá tải yêu cầu Tmm/T1"
              value={tmmRatio}
              onChangeText={setTmmRatio}
              placeholder="e.g. 1.6"
              keyboardType="numeric"
              error={errors.tmmRatio}
              style={{ paddingBottom: Spacing.sm }}
            />

            <Text style={styles.sectionTitle}>Loại hộp giảm tốc (HGT)</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, gearboxType === 'KHAI_TRIEN' && styles.toggleButtonActive]}
                onPress={() => setGearboxType('KHAI_TRIEN')}
              >
                <Text style={[styles.toggleText, gearboxType === 'KHAI_TRIEN' && styles.toggleTextActive]}>
                  KHAI_TRIEN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, gearboxType === 'PHAN_DOI' && styles.toggleButtonActive]}
                onPress={() => setGearboxType('PHAN_DOI')}
              >
                <Text style={[styles.toggleText, gearboxType === 'PHAN_DOI' && styles.toggleTextActive]}>
                  PHAN_DOI
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Loại bộ truyền ngoài</Text>
            <View style={styles.toggleRow}>
              {(['CHAIN', 'BELT', 'GEAR', 'NONE'] as ExternalDriveType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.toggleButton, externalDriveType === type && styles.toggleButtonActive]}
                  onPress={() => setExternalDriveType(type)}
                >
                  <Text style={[styles.toggleText, externalDriveType === type && styles.toggleTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {externalDriveType === 'CHAIN' && (
              <>
                <Text style={styles.sectionTitle}>Bố trí bộ truyền xích</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[styles.toggleButton, chainLayout === 'HORIZONTAL_OR_LT40' && styles.toggleButtonActive]}
                    onPress={() => setChainLayout('HORIZONTAL_OR_LT40')}
                  >
                    <Text style={[styles.toggleText, chainLayout === 'HORIZONTAL_OR_LT40' && styles.toggleTextActive]}>
                      Nằm ngang / {"<"}40°
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleButton, chainLayout === 'STEEP_GT40' && styles.toggleButtonActive]}
                    onPress={() => setChainLayout('STEEP_GT40')}
                  >
                    <Text style={[styles.toggleText, chainLayout === 'STEEP_GT40' && styles.toggleTextActive]}>
                      Nghiêng {">"}40°
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

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
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  saveTemplateText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  templateRow: {
    marginBottom: Spacing.md,
  },
  templateChip: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    maxWidth: 180,
  },
  templateChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
  },
  toggleButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  toggleText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  toggleTextActive: {
    color: Colors.primary,
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
