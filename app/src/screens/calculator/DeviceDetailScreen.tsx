import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../utils/theme';
import DataTable from '../../components/DataTable';

const DeviceDetailScreen = ({ route, navigation }: any) => {
  const device = route?.params?.device;

  if (!device) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Không tìm thấy thiết bị</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    );
  }

  // Cấu hình bảng thông số kỹ thuật
  const specsData = [
    { stt: '1', param: 'Công suất định mức', value: device.powerText, unit: '' },
    { stt: '2', param: 'Mô-men xoắn', value: device.torque, unit: '' },
    { stt: '3', param: 'Tỷ số truyền', value: '8.5', unit: '-' }, // Giả định
    { stt: '4', param: 'Số vòng quay động cơ', value: device.torque.replace(' vòng/phút', ''), unit: 'vòng/phút' },
    { stt: '5', param: 'Hiệu suất toàn hệ', value: '0.85', unit: '-' }, // Giả định
    { stt: '6', param: 'Kiểu lắp đặt', value: 'Chân đế/Mặt bích', unit: '-' },
  ];

  const specsColumns = [
    { key: 'stt', title: 'STT', width: 40, align: 'center' as const },
    { key: 'param', title: 'Thông số', align: 'left' as const },
    { key: 'value', title: 'Giá trị', align: 'left' as const, isHighlight: true },
    { key: 'unit', title: 'Đơn vị', align: 'center' as const },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết thiết bị</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Layout chia 2 phần hiển thị (Trên di động sẽ xếp dọc, nhưng cố gắng làm giống ảnh) */}
        <View style={styles.mainLayout}>
          
          {/* Cột trái: Hình ảnh */}
          <View style={styles.imageCard}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: device.image }} style={styles.mainImage} resizeMode="cover" />
              <View style={[styles.badge, device.match >= 90 ? {backgroundColor: Colors.success} : {backgroundColor: Colors.warning}]}>
                <Text style={[styles.badgeText, device.match < 90 && {color: '#8A6D3B'}]}>
                  Độ khớp: {device.match}%
                </Text>
              </View>
            </View>
            <View style={styles.imageInfo}>
              <Text style={styles.imageInfoTitle}>Hình ảnh thiết bị</Text>
              <Text style={styles.imageInfoDesc}>Hình ảnh thực tế động cơ và hộp giảm tốc</Text>
            </View>
          </View>

          {/* Cột phải: Thông tin tổng quan */}
          <View style={styles.overviewCard}>
            <Text style={styles.cardTitle}>Thông tin tổng quan</Text>
            
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Thương hiệu</Text>
              <Text style={styles.specValue}>{device.brand}</Text>
            </View>
            
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Mã sản phẩm</Text>
              <Text style={styles.specValue}>{device.id}</Text>
            </View>
            
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Công suất</Text>
              <Text style={styles.specValue}>{device.powerText}</Text>
            </View>
            
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Momen xoắn</Text>
              <Text style={styles.specValue}>{device.torque}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceRow}>
              <Text style={styles.specLabel}>Giá bán</Text>
              <Text style={styles.priceValue}>{device.price}</Text>
            </View>
          </View>

        </View>

        {/* Thông số kỹ thuật cơ bản */}
        <View style={styles.specsContainer}>
          <Text style={styles.specsTitle}>Thông số kỹ thuật cơ bản</Text>
          <View style={styles.tableWrapper}>
            <DataTable 
              columns={specsColumns} 
              data={specsData}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveBtn}>
            <Ionicons name="save-outline" size={20} color="#fff" style={{marginRight: 8}} />
            <Text style={styles.saveBtnText}>Lưu cấu hình</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.exportBtn}>
            <Ionicons name="download-outline" size={20} color={Colors.primary} style={{marginRight: 8}} />
            <Text style={styles.exportBtnText}>Xuất báo cáo</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 20,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl * 2,
  },
  mainLayout: {
    flexDirection: 'column', // Đổi thành column cho mobile
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  
  // Image Card
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.card,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: '#000',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  imageInfo: {
    padding: Spacing.lg,
  },
  imageInfoTitle: {
    ...Typography.h3,
    marginBottom: 4,
  },
  imageInfoDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },

  // Overview Card
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  cardTitle: {
    ...Typography.h2,
    fontSize: 18,
    marginBottom: Spacing.xl,
  },
  specRow: {
    marginBottom: Spacing.md,
  },
  specLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  specValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  priceRow: {
    marginTop: Spacing.sm,
  },
  priceValue: {
    ...Typography.h2,
    color: Colors.primary,
    fontSize: 24,
    marginTop: 4,
  },

  // Specs
  specsContainer: {
    backgroundColor: '#F0F4FA', // Màu xanh nhạt theo ảnh
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  specsTitle: {
    ...Typography.h2,
    fontSize: 18,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  tableWrapper: {
    backgroundColor: '#fff',
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Actions
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#34A853', // Màu xanh lá
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportBtnText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default DeviceDetailScreen;
