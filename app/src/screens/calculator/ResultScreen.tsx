import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../utils/theme';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';

import { CalculationResult } from '../../types/result';

// ─── Tab definitions ───────────────────────────────────────────
const TABS = [
  'Động cơ',
  'Bộ truyền xích',
  'Bánh răng nhanh',
  'Bánh răng chậm',
  'Trục',
  'Ổ lăn',
  'Vỏ hộp',
] as const;

interface TabRow {
  stt: number;
  param: string;
  value: string | number;
  unit: string;
}

// ─── Main Component ────────────────────────────────────────────
const ResultScreen = ({ route, navigation }: any) => {
  const input = route?.params?.input ?? { F: 2500, v: 1.25, D: 320 };
  const strategy = route?.params?.strategy ?? 'cost';
  const result: CalculationResult = route?.params?.resultData;
  const [activeTab, setActiveTab] = useState(0);

  if (!result) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No results available. Please go back and calculate again.</Text>
        <GradientButton title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const f = (num: number, digits = 2) => Number(num.toFixed(digits));

  // ─── Build tab data ────────────────────────────────────────
  const getTabData = (tabIndex: number): TabRow[] | null => {
    switch (tabIndex) {
      case 0: { // Động cơ
        const ut = f(result.shaftTable.truc1.u * result.shaftTable.truc2.u * result.shaftTable.truc3.u);
        const uh = f(result.shaftTable.truc1.u * result.shaftTable.truc2.u);
        return [
          { stt: 1, param: 'Công suất làm việc', value: f(result.Plv), unit: 'kW' },
          { stt: 2, param: 'Công suất tương đương', value: f(result.Ptd), unit: 'kW' },
          { stt: 3, param: 'Hiệu suất toàn hệ', value: f(result.eta, 4), unit: '-' },
          { stt: 4, param: 'Công suất cần thiết', value: f(result.Pct), unit: 'kW' },
          { stt: 5, param: 'Động cơ chọn', value: result.motor.id, unit: '-' },
          { stt: 6, param: 'Số vòng quay động cơ', value: result.motor.speed, unit: 'vòng/phút' },
          { stt: 7, param: 'Tỷ số truyền tổng', value: ut, unit: '-' },
          { stt: 8, param: 'Phân phối tỷ số truyền', value: `u1 = ${f(result.shaftTable.truc1.u)}, u2 = ${f(result.shaftTable.truc2.u)}`, unit: '-' },
          { stt: 9, param: 'Công suất trục 1', value: f(result.shaftTable.truc1.P), unit: 'kW' },
          { stt: 10, param: 'Số vòng quay trục 1', value: f(result.shaftTable.truc1.n), unit: 'vòng/phút' },
          { stt: 11, param: 'Mômen trục 1', value: f(result.shaftTable.truc1.T), unit: 'Nm' },
          { stt: 12, param: 'Công suất trục 2', value: f(result.shaftTable.truc2.P), unit: 'kW' },
          { stt: 13, param: 'Số vòng quay trục 2', value: f(result.shaftTable.truc2.n), unit: 'vòng/phút' },
          { stt: 14, param: 'Mômen trục 2', value: f(result.shaftTable.truc2.T), unit: 'Nm' },
          { stt: 15, param: 'Công suất trục 3', value: f(result.shaftTable.truc3.P), unit: 'kW' },
          { stt: 16, param: 'Số vòng quay trục 3', value: f(result.shaftTable.truc3.n), unit: 'vòng/phút' },
          { stt: 17, param: 'Mômen trục 3', value: f(result.shaftTable.truc3.T), unit: 'Nm' },
        ];
      }
      case 1: { // Bộ truyền xích
        return [
          { stt: 1, param: 'Tỷ số truyền xích thực', value: f(result.shaftTable.truc3.u), unit: '-' },
          { stt: 2, param: 'Số răng đĩa xích nhỏ (z1)', value: result.chainParams.z1, unit: 'răng' },
          { stt: 3, param: 'Số răng đĩa xích lớn (z2)', value: result.chainParams.z2, unit: 'răng' },
          { stt: 4, param: 'Bước xích', value: f(result.chainParams.p), unit: 'mm' },
          { stt: 5, param: 'Số mắt xích', value: result.chainParams.xc, unit: 'mắt' },
          { stt: 6, param: 'Khoảng cách trục', value: f(result.chainParams.a), unit: 'mm' },
          { stt: 7, param: 'Vận tốc xích', value: f(result.chainStrength.v_chain), unit: 'm/s' },
          { stt: 8, param: 'Lực vòng', value: f(result.chainStrength.Ft), unit: 'N' },
          { stt: 9, param: 'Lực căng F0', value: f(result.chainStrength.F0), unit: 'N' },
          { stt: 10, param: 'Hệ số an toàn', value: f(result.chainStrength.s), unit: '-' },
          { stt: 11, param: 'Đường kính vòng chia d1', value: f(result.chainParams.d1), unit: 'mm' },
          { stt: 12, param: 'Đường kính vòng chia d2', value: f(result.chainParams.d2), unit: 'mm' },
          { stt: 13, param: 'Lực tác dụng lên trục Fr', value: f(result.chainParams.Fr), unit: 'N' },
        ];
      }
      default:
        return null; // Tabs chưa có data
    }
  };

  const tabData = getTabData(activeTab);

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
          <Text style={styles.heroLabel}>CÔNG SUẤT CẦN THIẾT</Text>
          <View style={styles.heroValueRow}>
            <Text style={styles.heroValue}>{f(result.Pct)}</Text>
            <Text style={styles.heroUnit}>kW</Text>
          </View>
          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <Ionicons name="flash" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.heroMetaText}>Plv = {f(result.Plv)} kW</Text>
            </View>
            <View style={styles.heroMetaItem}>
              <Ionicons name="speedometer" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.heroMetaText}>η = {f(result.eta, 3)}</Text>
            </View>
            <View style={styles.heroMetaItem}>
              <Ionicons name="ellipse-outline" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.heroMetaText}>nsb = {f(result.nsb)} v/p</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ─── Tab Section ─── */}
        <View style={styles.tabSection}>
          {/* Section Header */}
          <View style={styles.tabSectionHeader}>
            <Text style={styles.tabSectionTitle}>Chi tiết kết quả tính toán</Text>
            <Text style={styles.tabSectionSubtitle}>
              {TABS.length} bảng thông số kỹ thuật từ Module 2
            </Text>
          </View>

          {/* Tab Bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBarContent}
            style={styles.tabBar}
          >
            {TABS.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, activeTab === index && styles.tabItemActive]}
                onPress={() => setActiveTab(index)}
              >
                <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tab Content */}
          {tabData ? (
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.sttCol]}>STT</Text>
                <Text style={[styles.tableHeaderCell, styles.paramCol]}>Thông số</Text>
                <Text style={[styles.tableHeaderCell, styles.valueCol]}>Giá trị</Text>
                <Text style={[styles.tableHeaderCell, styles.unitCol]}>Đơn vị</Text>
              </View>

              {/* Table Rows */}
              {tabData.map((row, idx) => (
                <View
                  key={row.stt}
                  style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
                >
                  <Text style={[styles.tableCell, styles.sttCol, styles.sttText]}>{row.stt}</Text>
                  <Text style={[styles.tableCell, styles.paramCol, styles.paramText]}>{row.param}</Text>
                  <Text style={[styles.tableCell, styles.valueCol, styles.valueText]}>{row.value}</Text>
                  <Text style={[styles.tableCell, styles.unitCol, styles.unitText]}>{row.unit}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="construct-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.placeholderTitle}>Đang phát triển</Text>
              <Text style={styles.placeholderText}>
                Module "{TABS[activeTab]}" sẽ được cập nhật trong phiên bản tiếp theo.
              </Text>
            </View>
          )}
        </View>

        {/* Chain Strength Validation */}
        {activeTab <= 1 && (
          <>
            <Text style={styles.sectionTitle}>Cơ tính và Kiểm nghiệm bền xích</Text>
            <GlassCard accentColor={result.chainStrength.passed ? Colors.success : Colors.error} style={{ marginBottom: Spacing.xl }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                <Text style={styles.strategyText}>Hệ số an toàn (s): {f(result.chainStrength.s)}</Text>
                <Text style={[styles.strategyText, { color: result.chainStrength.passed ? Colors.success : Colors.error }]}>
                  (Yêu cầu: ≥ {f(result.chainStrength.s_min)})
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.strategyText}>Ứng suất tiếp xúc (σH1): {f(result.chainStrength.sigmaH1)} MPa</Text>
                <Text style={[styles.strategyText, { color: result.chainStrength.contactPassed ? Colors.success : Colors.error }]}>
                  (Yêu cầu: ≤ {f(result.chainStrength.sigmaH_allow)})
                </Text>
              </View>
            </GlassCard>

            {/* Standard Motor Selected */}
            <Text style={styles.sectionTitle}>Động cơ tiêu chuẩn được chọn</Text>
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
                  <Text style={styles.componentName}>Motor {result.motor.id}</Text>
                  <Text style={styles.componentSpec}>
                    {result.motor.power} kW @ {result.motor.speed} rpm
                  </Text>
                  <Text style={styles.componentType}>Type: {result.motor.type}</Text>
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
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={18} color={Colors.textPrimary} />
            <Text style={styles.backButtonText}>Quay lại nhập liệu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('DeviceSuggestion', { input, result, strategy })}
          >
            <Text style={styles.continueButtonText}>Tiếp tục đề xuất động cơ</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Thông tin quan trọng */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Thông tin quan trọng</Text>
          <Text style={styles.infoBoxText}>
            Các thông số trên được tính toán dựa trên tiêu chuẩn thiết kế hộp giảm tốc bánh răng trụ.
            Sau khi xem xét kết quả, bạn có thể tiếp tục để xem các đề xuất động cơ phù hợp hoặc quay lại chỉnh sửa thông số đầu vào.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────
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

  // ─── Tab Section ───
  tabSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  tabSectionHeader: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  tabSectionTitle: {
    ...Typography.h3,
    fontWeight: '700',
    marginBottom: 4,
  },
  tabSectionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },

  // Tab Bar
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBarContent: {
    paddingHorizontal: Spacing.md,
  },
  tabItem: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    marginRight: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontWeight: '500',
    fontSize: 13,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  // ─── Table ───
  tableContainer: {
    // no extra padding — table fills full width
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.md,
  },
  tableHeaderCell: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'none',
    paddingHorizontal: Spacing.sm,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tableRowAlt: {
    backgroundColor: Colors.background + '80',
  },
  tableCell: {
    paddingHorizontal: Spacing.sm,
    fontSize: 14,
  },

  // Column widths
  sttCol: {
    width: 50,
    textAlign: 'center',
  },
  paramCol: {
    flex: 1,
  },
  valueCol: {
    width: 120,
  },
  unitCol: {
    width: 80,
  },

  // Cell text styles
  sttText: {
    color: Colors.textMuted,
    fontWeight: '500',
  },
  paramText: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  valueText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  unitText: {
    color: Colors.textMuted,
    fontWeight: '400',
  },

  // Placeholder
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl + 20,
    paddingHorizontal: Spacing.xl,
  },
  placeholderTitle: {
    ...Typography.h3,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    color: Colors.textSecondary,
  },
  placeholderText: {
    ...Typography.bodySmall,
    textAlign: 'center',
    color: Colors.textMuted,
    lineHeight: 20,
  },

  // Section
  sectionTitle: {
    ...Typography.caption,
    fontSize: 12,
    marginBottom: Spacing.md,
    color: Colors.textSecondary,
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
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  backButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  continueButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  continueButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#fff',
  },
  infoBox: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: '#F0F5FF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#D6E4FF',
  },
  infoBoxTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  infoBoxText: {
    ...Typography.body,
    color: Colors.primary,
    opacity: 0.8,
    lineHeight: 22,
  },
});

export default ResultScreen;
