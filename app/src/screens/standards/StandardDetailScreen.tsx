import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { standardsApi } from '../../api';

const StandardDetailScreen = ({ route, navigation }: any) => {
  const { tableKey, title } = route.params;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const res = await standardsApi.getStandardTableByKey(tableKey);
        setData(res.data);
      } catch (e) {
        Alert.alert('Error', 'Failed to load table details.');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [tableKey]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientBlue} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </LinearGradient>
      
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.dataCard}>
                <Text style={styles.jsonText}>{JSON.stringify(data, null, 2)}</Text>
            </View>
        </ScrollView>
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
  headerTitle: { ...Typography.h3, color: '#fff', fontWeight: 'bold', flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.xl },
  dataCard: {
      backgroundColor: '#fff',
      padding: Spacing.lg,
      borderRadius: BorderRadius.md,
  },
  jsonText: {
      fontFamily: 'monospace',
      fontSize: 12,
      color: Colors.textSecondary
  }
});

export default StandardDetailScreen;