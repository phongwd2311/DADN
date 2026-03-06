import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ResultCard = ({ label, value, unit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value} {unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    marginTop: 5,
  },
});

export default ResultCard;
