import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../utils/theme';
import { standardsApi } from '../../api';

const StandardsScreen = ({ navigation }: any) => {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    try {
      setLoading(true);
      const data = await standardsApi.getStandardTables();
      setTables(data.tables || []);
    } catch (e) {
      Alert.alert('Error', 'Failed to load standards data.');
    } finally {
      setLoading(false);
    }
  };

  const renderTableItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.card, Shadows.card]}
      onPress={() => navigation.navigate('StandardDetail', { tableKey: item.key, title: item.title })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
      </View>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBlue} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tech Standards</Text>
      </LinearGradient>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList 
          data={tables}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContainer}
          renderItem={renderTableItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { 
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: Spacing.xl, 
    flexDirection: 'row', alignItems: 'center'
  },
  backButton: { marginRight: 16 },
  headerTitle: { ...Typography.h2, color: '#fff', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: Spacing.xl, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  cardTitle: { ...Typography.h3, color: Colors.textPrimary, fontWeight: '700', flex: 1, marginRight: 8 },
  cardDesc: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 20 },
});

export default StandardsScreen;