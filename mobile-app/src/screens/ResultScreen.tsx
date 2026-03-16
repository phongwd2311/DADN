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

import { CalculationResult } from '../types/result';
import DataTable from '../components/DataTable';

const ResultScreen = ({ route, navigation }: any) => {
  // Get params or use defaults
  const input = route?.params?.input ?? { F: 2500, v: 1.25, D: 320 };
  const strategy = route?.params?.strategy ?? 'cost';
  const result: CalculationResult = route?.params?.resultData;

  if (!result) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No results available. Please go back and calculate again.</Text>
        <GradientButton title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // Formatting helper
  const f = (num: number, digits = 2) => Number(num.toFixed(digits));

  // Table 1: Chọn động cơ điện
  const motorTableData = [
    { param: 'Plv (kW)', val: f(result.Plv) },
    { param: 'Ptd (kW)', val: f(result.Ptd) },
    { param: 'Hiệu suất η', val: f(result.eta, 4) },
    { param: 'Pct (kW)', val: f(result.Pct) },
    { param: 'nlv (v/p)', val: f(result.nlv) },
    { param: 'nsb (v/p)', val: f(result.nsb) },
    { param: 'Động cơ chọn', val: result.motor.id },
  ];

  // Table 2: Phân phối tỷ số truyền
  const ratioTableData = [
    { param: 'Hệ dẫn động (ut)', val: f(result.shaftTable.truc3.u * result.shaftTable.truc1.u * result.shaftTable.truc2.u) }, // Approximate ut
    { param: 'Hộp giảm tốc (uh)', val: f(result.shaftTable.truc1.u * result.shaftTable.truc2.u) },
    { param: 'Cấp nhanh (u1)', val: f(result.shaftTable.truc1.u) },
    { param: 'Cấp chậm (u2)', val: f(result.shaftTable.truc2.u) },
    { param: 'Xích (ux)', val: f(result.shaftTable.truc3.u) },
  ];

  // Table 3: Bảng 1.2. Số liệu động học và động lực học (Shaft Table)
  const shaftTableData = [
    { name: 'Động cơ', P: f(result.shaftTable.dc.P), u: f(result.shaftTable.dc.u), n: f(result.shaftTable.dc.n), T: f(result.shaftTable.dc.T) },
    { name: 'Trục I', P: f(result.shaftTable.truc1.P), u: f(result.shaftTable.truc1.u), n: f(result.shaftTable.truc1.n), T: f(result.shaftTable.truc1.T) },
    { name: 'Trục II', P: f(result.shaftTable.truc2.P), u: f(result.shaftTable.truc2.u), n: f(result.shaftTable.truc2.n), T: f(result.shaftTable.truc2.T) },
    { name: 'Trục III', P: f(result.shaftTable.truc3.P), u: f(result.shaftTable.truc3.u), n: f(result.shaftTable.truc3.n), T: f(result.shaftTable.truc3.T) },
    { name: 'Trục CT', P: f(result.shaftTable.ct.P), u: '-', n: f(result.shaftTable.ct.n), T: f(result.shaftTable.ct.T) },
  ];

  const shaftColumns = [
    { key: 'name', title: 'Thông số', width: 80, align: 'left' as const },
    { key: 'P', title: 'P (kW)', align: 'center' as const },
    { key: 'u', title: 'u', align: 'center' as const },
    { key: 'n', title: 'n (v/p)', align: 'center' as const },
    { key: 'T', title: 'T (N.mm)', align: 'right' as const },
  ];

  // Table 4: Xác định thông số xích
  const chainDesignTableData = [
    { param: 'Số răng đĩa dẫn (z1)', val: result.chainParams.z1 },
    { param: 'Số răng đĩa bị dẫn (z2)', val: result.chainParams.z2 },
    { param: 'Bước xích p (mm)', val: f(result.chainParams.p) },
    { param: 'Khoảng cách trục a (mm)', val: f(result.chainParams.a) },
    { param: 'Số mắt xích (xc)', val: result.chainParams.xc },
  ];

  // Table 5: Kích thước đĩa xích
  const sproketTableData = [
    { param: 'ĐK chia dẫn d1 (mm)', val: f(result.chainParams.d1) },
    { param: 'ĐK chia bị dẫn d2 (mm)', val: f(result.chainParams.d2) },
    { param: 'ĐK đỉnh đĩa dẫn da1 (mm)', val: f(result.chainParams.da1) },
    { param: 'ĐK đỉnh đĩa bị dẫn da2 (mm)', val: f(result.chainParams.da2) },
    { param: 'ĐK chân đĩa dẫn df1 (mm)', val: f(result.chainParams.df1) },
    { param: 'ĐK chân đĩa bị dẫn df2 (mm)', val: f(result.chainParams.df2) },
  ];

  // Table 6: Bảng 3.2. Thông số bộ truyền xích
  const finalChainTableData = [
    { param: 'Số răng dẫn (z1)', val: result.chainParams.z1, param2: 'a (mm)', val2: f(result.chainParams.a) },
    { param: 'Số răng bị dẫn (z2)', val: result.chainParams.z2, param2: 'd1 (mm)', val2: f(result.chainParams.d1) },
    { param: 'Bước p (mm)', val: f(result.chainParams.p), param2: 'd2 (mm)', val2: f(result.chainParams.d2) },
    { param: 'Chiều dài ống lót B', val: f(result.chainParams.B), param2: 'Lực Fr (N)', val2: f(result.chainParams.Fr) },
    { param: 'Đường kính chốt dc', val: f(result.chainParams.dc), param2: 'Số mắt xc', val2: result.chainParams.xc },
  ];

  const basicColumns = [
    { key: 'param', title: 'Đại lượng', align: 'left' as const },
    { key: 'val', title: 'Giá trị', align: 'right' as const },
  ];

  const twinColumns = [
    { key: 'param', title: 'Đại lượng', align: 'left' as const },
    { key: 'val', title: 'Giá trị', align: 'right' as const },
    { key: 'param2', title: 'Đại lượng', align: 'left' as const },
    { key: 'val2', title: 'Giá trị', align: 'right' as const },
  ];

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

        <DataTable title="1. Bảng Chọn động cơ điện" columns={basicColumns} data={motorTableData} />
        <DataTable title="2. Bảng Phân phối tỷ số truyền" columns={basicColumns} data={ratioTableData} />
        <DataTable title="3. Bảng 1.2. Số liệu động học" columns={shaftColumns} data={shaftTableData} />
        <DataTable title="4. Bảng Xác định thông số xích" columns={basicColumns} data={chainDesignTableData} />
        <DataTable title="5. Bảng Tính kích thước đĩa xích" columns={basicColumns} data={sproketTableData} />
        <DataTable title="6. Bảng 3.2. Thông số bộ truyền xích" columns={twinColumns} data={finalChainTableData} />

        {/* Chain Strength Validation */}
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
