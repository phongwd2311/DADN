import React, { useCallback, useState } from "react";
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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, BorderRadius } from "../../utils/theme";
import GlassCard from "../../components/GlassCard";
import { sessionApi } from "../../api/sessionApi";

type SessionStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

const STATUS_OPTIONS: SessionStatus[] = ["DRAFT", "IN_PROGRESS", "COMPLETED", "FAILED"];

const getStatusColor = (status: SessionStatus) => {
  switch (status) {
    case "DRAFT":
      return Colors.accent;
    case "IN_PROGRESS":
      return Colors.primary;
    case "COMPLETED":
      return "#11A36A";
    case "FAILED":
      return "#D64545";
    default:
      return Colors.textMuted;
  }
};

const HistoryScreen = ({ navigation }: any) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [originalEditName, setOriginalEditName] = useState("");
  const [editStatus, setEditStatus] = useState<SessionStatus>("DRAFT");

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await sessionApi.getAll();
      setSessions(Array.isArray(response?.sessions) ? response.sessions : []);
    } catch (error) {
      Alert.alert("Error", "Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions]),
  );

  const openEditModal = (session: any) => {
    const sessionName = String(session.session_name ?? "");
    setEditingSessionId(Number(session.session_id));
    setEditName(sessionName);
    setOriginalEditName(sessionName);
    setEditStatus((session.status as SessionStatus) ?? "DRAFT");
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSessionId) return;
    const normalizedName = editName.trim();
    if (!normalizedName) {
      Alert.alert("Validation", "Session name cannot be empty.");
      return;
    }

    try {
      const payload: {
        session_name?: string;
        status: SessionStatus;
      } = { status: editStatus };

      if (normalizedName !== originalEditName.trim()) {
        payload.session_name = normalizedName;
      }

      await sessionApi.update(editingSessionId, payload);
      setEditModalVisible(false);
      await loadSessions();
      Alert.alert("Success", "Session updated.");
    } catch (error: any) {
      const message =
        error?.response?.data?.details?.session_name?.join("\n") ??
        error?.response?.data?.error ??
        "Failed to update session.";
      Alert.alert("Error", message);
    }
  };

  const handleDelete = (sessionId: number) => {
    Alert.alert("Delete Session", "Are you sure you want to delete this session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await sessionApi.delete(sessionId);
            await loadSessions();
          } catch {
            Alert.alert("Error", "Failed to delete session.");
          }
        },
      },
    ]);
  };

  const renderSessionItem = ({ item, index }: { item: any; index: number }) => {
    const accentColor = index % 2 === 0 ? Colors.primary : Colors.accent;
    const status = (item.status ?? "DRAFT") as SessionStatus;
    const statusColor = getStatusColor(status);
    const input = item.input_json ?? {};
    const result = item.result_json ?? {};

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("Calculate", {
            screen: "Result",
            params: {
              input,
              resultData: result,
            },
          })
        }
      >
        <GlassCard accentColor={accentColor} style={styles.historyCard}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWrap}>
              <Text style={styles.sessionName} numberOfLines={1}>
                {item.session_name}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor}25` }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
              </View>
            </View>
            <View style={styles.actionWrap}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconButton}>
                <Ionicons name="pencil" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(Number(item.session_id))}
                style={styles.iconButton}
              >
                <Ionicons name="trash" size={16} color="#D64545" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.dateText}>
            Updated: {new Date(item.updated_at ?? item.created_at).toLocaleString("vi-VN")}
          </Text>

          <View style={styles.paramsRow}>
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>F</Text>
              <Text style={styles.paramValue}>{input.F ?? 0} N</Text>
            </View>
            <View style={styles.paramDivider} />
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>v</Text>
              <Text style={styles.paramValue}>{input.v ?? 0} m/s</Text>
            </View>
            <View style={styles.paramDivider} />
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>D</Text>
              <Text style={styles.paramValue}>{input.D ?? 0} mm</Text>
            </View>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Power: {result.Pct ?? 0} kW</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
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
          keyExtractor={(item) => String(item.session_id)}
          renderItem={renderSessionItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadSessions}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No sessions yet</Text>
            </View>
          }
        />
      )}

      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Session</Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Session name"
              style={styles.textInput}
              placeholderTextColor={Colors.textMuted}
            />

            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((status) => (
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
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    ...Typography.h1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  historyCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  titleWrap: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  sessionName: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: "700",
  },
  actionWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  paramsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  paramItem: {
    flex: 1,
    alignItems: "center",
  },
  paramLabel: {
    ...Typography.caption,
    fontSize: 10,
    marginBottom: 2,
  },
  paramValue: {
    ...Typography.body,
    fontWeight: "600",
    fontSize: 14,
  },
  paramDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...Typography.bodySmall,
    marginTop: Spacing.md,
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  modalTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
  },
  statusOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statusOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}15`,
  },
  statusOptionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statusOptionTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.sm,
  },
  cancelButton: {
    backgroundColor: Colors.surfaceLight,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  saveButtonText: {
    ...Typography.bodySmall,
    color: "#fff",
    fontWeight: "700",
  },
});

export default HistoryScreen;
