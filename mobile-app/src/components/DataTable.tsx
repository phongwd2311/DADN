import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../utils/theme';

interface Column {
  key: string;
  title: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  isHighlight?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, title }) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <ScrollView horizontal contentContainerStyle={{ minWidth: '100%' }}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.headerRow}>
            {columns.map((col, idx) => (
              <View
                key={col.key}
                style={[
                  styles.headerCell,
                  col.width ? { width: col.width } : styles.flexCell,
                  { alignItems: col.align === 'right' ? 'flex-end' : col.align === 'left' ? 'flex-start' : 'center' },
                  idx === 0 ? styles.firstCell : {}
                ]}
              >
                <Text style={styles.headerText}>{col.title}</Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.dataRow, rowIndex % 2 === 1 ? styles.altRow : {}]}>
              {columns.map((col, idx) => (
                <View
                  key={col.key}
                  style={[
                    styles.dataCell,
                    col.width ? { width: col.width } : styles.flexCell,
                    { alignItems: col.align === 'right' ? 'flex-end' : col.align === 'left' ? 'flex-start' : 'center' },
                    idx === 0 ? styles.firstCell : {}
                  ]}
                >
                  <Text style={[
                    styles.dataText, 
                    rowIndex === data.length - 1 ? styles.lastRowText : {},
                    col.isHighlight ? { color: Colors.primary, fontWeight: '600' } : {}
                  ]}>
                    {row[col.key]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    ...Typography.h3,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    color: Colors.textPrimary,
  },
  table: {
    minWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '10',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCell: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border + '50',
  },
  firstCell: {
    paddingLeft: Spacing.md,
  },
  headerText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  altRow: {
    backgroundColor: Colors.background + '50',
  },
  dataCell: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border + '50',
  },
  dataText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  lastRowText: {
    // optional styling for last row
  },
  flexCell: {
    flex: 1,
    minWidth: 80,
  },
});

export default DataTable;
