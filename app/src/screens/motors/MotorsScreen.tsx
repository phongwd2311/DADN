import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../utils/theme';
import { motorsApi } from '../../api';

const MotorsScreen = ({ navigation }: any) => {
  const [motors, setMotors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMotors();
  }, []);

  const loadMotors = async () => {
    try {
      setLoading(true);
      const data = await motorsApi.getMotors();
      setMotors(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load motors data.');
    } finally {
      setLoading(false);
    }
  };

  const renderMotorItem = ({ item }: { item: any }) => (
    <View style={[styles.card, Shadows.card]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.model}</Text>
        <LinearGradient
            colors={Colors.gradientWarning}
            style={styles.iconBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Ionicons name="hardware-chip" size={16} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.cardDesc}>Power: {item.rated_power} kW</Text>
      <Text style={styles.cardDesc}>Speed: {item.rated_speed} rpm</Text>
      <Text style={styles.cardDesc}>Tk/Tdn: {item.tk_tdn}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBlue} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Motor Library</Text>
      </LinearGradient>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList 
          data={motors}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={renderMotorItem}
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
  cardDesc: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  iconBg: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }
});

export default MotorsScreen;