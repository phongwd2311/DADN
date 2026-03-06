import React from "react";
import { Text, StyleSheet } from "react-native";

const ErrorText = ({ message }) => {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
};

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
});

export default ErrorText;
