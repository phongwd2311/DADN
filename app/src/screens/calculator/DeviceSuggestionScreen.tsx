import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../utils/theme';
import { MOTOR_TABLE } from '../../utils/constants';

const { width } = Dimensions.get('window');

const DeviceSuggestionScreen = ({ route, navigation }: any) => {
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'power'>('match');
  
  const input = route?.params?.input;
  const result = route?.params?.result;

  const devices = useMemo(() => {
    if (!result) return [];
    
    const { Pct, nsb } = result;
    
    // Tìm các động cơ có công suất gần với Pct (cho phép nhỏ hơn một chút, vd 90%, và lớn hơn)
    let suitableMotors = MOTOR_TABLE.filter(m => m.power >= Pct * 0.9);
    
    if (suitableMotors.length === 0) {
      // Nếu không có, lấy 3 cái lớn nhất
      suitableMotors = MOTOR_TABLE.slice(-3);
    }

    const calculated = suitableMotors.map((m) => {
      // Tính độ chênh lệch
      const d_speed = Math.abs(m.speed - nsb) / nsb;
      const d_power = (m.power - Pct) / Pct;
      
      // Công thức điểm khớp: phạt chênh lệch tốc độ mạnh hơn, và phạt dư công suất
      let matchScore = 100 - (d_speed * 100 * 2.0) - (d_power * 100 * 1.5);
      
      // Đảm bảo nằm trong mức hợp lý
      if (matchScore > 99) matchScore = 99;
      if (matchScore < 30) matchScore = 30; // Điểm thấp quá thì giới hạn lại

      // Tạo giá giả định dựa trên công suất
      const estimatedPrice = m.power * 2500000;
      
      return {
        id: m.id,
        name: `Động cơ ${m.id} - ${m.type}`,
        powerText: `${m.power} kW`,
        torque: `${m.speed} vòng/phút`,
        brand: m.power < 3 ? 'Siemens' : 'ABB',
        priceVal: estimatedPrice,
        price: `${estimatedPrice.toLocaleString('vi-VN')} đ`,
        match: Math.round(matchScore),
        image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400',
        originalPower: m.power,
      };
    });

    // Sắp xếp
    return calculated.sort((a, b) => {
      if (sortBy === 'match') return b.match - a.match;
      if (sortBy === 'price') return a.priceVal - b.priceVal;
      if (sortBy === 'power') return a.originalPower - b.originalPower;
      return 0;
    });
  }, [result, sortBy]);

  const fStr = input ? `F=${input.F}N, v=${input.v}m/s, D=${input.D}mm` : 'Không có thông số';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Danh sách gợi ý thiết bị</Text>
            <Text style={styles.headerSubtitle}>
              Tìm thấy {devices.length} thiết bị phù hợp với thông số: {fStr}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sort Bar */}
        <View style={styles.sortBar}>
          <View style={styles.sortContent}>
            <Ionicons name="options-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.sortLabel}>Sắp xếp:</Text>
            <TouchableOpacity 
              style={styles.sortDropdown}
              onPress={() => setSortBy(prev => prev === 'match' ? 'price' : 'match')}
            >
              <Text style={styles.sortValue}>
                {sortBy === 'match' ? 'Độ khớp cao nhất' : 'Giá tăng dần'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Device List */}
        <View style={styles.listContainer}>
          {devices.map((device, index) => (
            <View key={device.id} style={styles.deviceCard}>
              <Image source={{ uri: device.image }} style={styles.deviceImage} />
              
              <View style={styles.deviceInfo}>
                <View style={styles.deviceHeader}>
                  <Text style={styles.deviceName} numberOfLines={1}>{device.name}</Text>
                  <View style={[styles.badge, device.match >= 90 ? {backgroundColor: Colors.success} : {backgroundColor: Colors.warning}]}>
                    <Text style={[styles.badgeText, device.match < 90 && {color: '#8A6D3B'}]}>
                      Độ khớp: {device.match}%
                    </Text>
                  </View>
                </View>

                <Text style={styles.deviceSpec}>{device.powerText} | {device.torque}</Text>
                <Text style={styles.deviceBrand}>Thương hiệu: {device.brand}</Text>

                <View style={styles.deviceFooter}>
                  <Text style={styles.devicePrice}>{device.price}</Text>
                  <TouchableOpacity 
                    style={styles.detailBtn}
                    onPress={() => navigation.navigate('DeviceDetail', { device })}
                  >
                    <Text style={styles.detailBtnText}>Xem chi tiết</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          {devices.length === 0 && (
            <Text style={{textAlign: 'center', marginTop: 20, color: Colors.textSecondary}}>
              Không tìm thấy kết quả. Hãy thử điều chỉnh thông số đầu vào.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // A light gray background like the image
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
    marginRight: Spacing.md,
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 20,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  sortBar: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  sortContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    ...Typography.body,
    marginLeft: 8,
    marginRight: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  sortValue: {
    ...Typography.body,
    marginRight: 8,
    fontSize: 14,
  },
  listContainer: {
    gap: Spacing.md,
  },
  deviceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  deviceImage: {
    width: 130, // Adjust width based on image proportion
    height: '100%',
    backgroundColor: '#EEE', // Placeholder if image loading
  },
  deviceInfo: {
    flex: 1,
    padding: Spacing.md,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  deviceName: {
    flex: 1,
    ...Typography.h3,
    fontSize: 16,
    marginRight: 8,
  },
  badge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  deviceSpec: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  deviceBrand: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  deviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  devicePrice: {
    ...Typography.h3,
    color: Colors.primary,
    fontSize: 16,
  },
  detailBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  detailBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DeviceSuggestionScreen;
