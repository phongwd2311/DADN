import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../utils/theme';
import GlassCard from '../components/GlassCard';
import { LocalDb } from '../data/localDb';

type FilterType = 'all' | 'week' | 'month';

const HistoryScreen = ({ navigation }: any) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await LocalDb.getAll('history');
    setHistory(data);
    setLoading(false);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  const renderHistoryItem = ({ item, index }: { item: any; index: number }) => {
    const accentColor = index % 2 === 0 ? Colors.primary : Colors.accent;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Calculate', {
            screen: 'Result',
            params: { input: item.input },
          })
        }
        activeOpacity={0.8}
      >
        <GlassCard accentColor={accentColor} style={styles.historyCard}>
          <View style={styles.cardHeader}>
            <View style={styles.dateSection}>
              <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.dateText}>
                {formatDate(item.timestamp)} • {formatTime(item.timestamp)}
              </Text>
            </View>
            <View style={[styles.powerBadge, { backgroundColor: accentColor + '20' }]}>
              <Text style={[styles.powerBadgeText, { color: accentColor }]}>
                {item.output.motorPower} kW
              </Text>
            </View>
          </View>

          <View style={styles.paramsRow}>
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>F</Text>
              <Text style={styles.paramValue}>{item.input.F} N</Text>
            </View>
            <View style={styles.paramDivider} />
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>v</Text>
              <Text style={styles.paramValue}>{item.input.v} m/s</Text>
            </View>
            <View style={styles.paramDivider} />
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>D</Text>
              <Text style={styles.paramValue}>{item.input.D} mm</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerLabel}>Ratio:</Text>
              <Text style={styles.footerValue}>{item.output.transmissionRatio}</Text>
              <Text style={styles.footerLabel}>  Pitch:</Text>
              <Text style={styles.footerValue}>{item.output.chainParams.pitch} mm</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="time-outline" size={48} color={Colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No calculations yet</Text>
      <Text style={styles.emptySubtitle}>
        Your calculation history will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="search" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[
                styles.filterChip,
                activeFilter === filter.key && styles.filterChipActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter.key && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerArea: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.h1,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.bodySmall,
    fontSize: 13,
    color: Colors.textMuted,
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },

  // History Card
  historyCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...Typography.bodySmall,
    fontSize: 12,
    marginLeft: Spacing.xs,
    color: Colors.textMuted,
  },
  powerBadge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  powerBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Params Row
  paramsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  paramItem: {
    flex: 1,
    alignItems: 'center',
  },
  paramLabel: {
    ...Typography.caption,
    fontSize: 10,
    marginBottom: 2,
  },
  paramValue: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 14,
  },
  paramDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 12,
  },
  footerValue: {
    ...Typography.body,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Loading
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.bodySmall,
    marginTop: Spacing.md,
    color: Colors.textMuted,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

export default HistoryScreen;
