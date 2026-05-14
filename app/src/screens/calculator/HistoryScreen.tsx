import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../utils/theme';
import GlassCard from '../../components/GlassCard';
import { sessionApi } from '../../api/sessionApi';

type FilterType = 'all' | 'week' | 'month';

const HistoryScreen = ({ navigation }: any) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('DRAFT');
  const [editModalVisible, setEditModalVisible] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await sessionApi.getAll();
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      Alert.alert('Error', 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return Colors.accent;
      case 'IN_PROGRESS':
        return Colors.primary;
      case 'COMPLETED':
        return Colors.primary;
      case 'FAILED':
        return '#FF4444';
      default:
        return Colors.textMuted;
    }
  };

  const openEditModal = (session: any) => {
    setEditingId(session.session_id);
    setEditName(session.session_name);
    setEditStatus(session.status || 'DRAFT');
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const showAlert = (title: string, message: string) => {
      if (Platform.OS === 'web') {
        window.alert(`${title}: ${message}`);
        return;
      }
      Alert.alert(title, message);
    };

    if (!editName.trim()) {
      showAlert('Error', 'Session name cannot be empty');
      return;
    }

    try {
      await sessionApi.update(editingId!, {
        session_name: editName,
        status: editStatus,
      });
      setEditModalVisible(false);
      loadSessions();
      showAlert('Success', 'Session updated successfully');
    } catch (error) {
      console.error('Failed to update session:', error);
      const err = error as any;
      const apiMessage = err?.response?.data?.error as string | undefined;
      const nameErrors = err?.response?.data?.details?.session_name as string[] | undefined;
      const detailMessage = nameErrors?.length ? nameErrors.join('\n') : undefined;
      showAlert('Error', detailMessage || apiMessage || 'Failed to update session');
    }
  };

  const handleDelete = (sessionId: number) => {
    const confirmDelete = async () => {
      try {
        await sessionApi.delete(sessionId);
        loadSessions();
      } catch (error) {
        Alert.alert('Error', 'Failed to delete session');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure?')) {
        confirmDelete();
      }
      return;
    }

    Alert.alert('Delete Session', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Delete', onPress: confirmDelete },
    ]);
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  const renderSessionItem = ({ item, index }: { item: any; index: number }) => {
    const accentColor = index % 2 === 0 ? Colors.primary : Colors.accent;
    const statusColor = getStatusColor(item.status);
    const inputData = item.input_json || {};
    const resultData = item.result_json || {};

    return (
      <GlassCard accentColor={accentColor} style={styles.sessionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.sessionName}>{item.session_name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '30' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status || 'DRAFT'}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => openEditModal(item)}
              style={styles.iconBtn}
            >
              <Ionicons name="pencil" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.session_id)}
              style={styles.iconBtn}
            >
              <Ionicons name="trash" size={18} color="#FF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.dateText}>
            Updated: {new Date(item.updated_at).toLocaleString('vi-VN')}
          </Text>
        </View>

        {inputData.F && (
          <View style={styles.paramsRow}>
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>F</Text>
              <Text style={styles.paramValue}>{inputData.F} N</Text>
            </View>
            <View style={styles.paramDivider} />
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>v</Text>
              <Text style={styles.paramValue}>{inputData.v} m/s</Text>
            </View>
            <View style={styles.paramDivider} />
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>D</Text>
              <Text style={styles.paramValue}>{inputData.D} mm</Text>
            </View>
          </View>
        )}

        {resultData.Pct && (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Power: {resultData.Pct} kW</Text>
          </View>
        )}
      </GlassCard>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="time-outline" size={48} color={Colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No sessions yet</Text>
      <Text style={styles.emptySubtitle}>
        Your calculation sessions will appear here
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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.session_id.toString()}
          renderItem={renderSessionItem}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadSessions}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Session</Text>

            <Text style={styles.inputLabel}>Session Name</Text>
            <TextInput
              style={styles.textInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter session name"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Status</Text>
            <View style={styles.statusOptions}>
              {['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'FAILED'].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setEditStatus(status)}
                  style={[
                    styles.statusOption,
                    editStatus === status && styles.statusOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      editStatus === status && styles.statusOptionTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={[styles.modalBtn, styles.cancelBtn]}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} style={[styles.modalBtn, styles.saveBtn]}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: Colors.textPrimary,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    ...Typography.body,
    color: Colors.textMuted,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sessionCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  sessionName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  dateText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  paramsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paramItem: {
    flex: 1,
    alignItems: 'center',
  },
  paramLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  paramValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  paramDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  resultRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  resultLabel: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  statusOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusOptionText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  statusOptionTextActive: {
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
  },
  saveBtnText: {
    ...Typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default HistoryScreen;
