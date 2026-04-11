import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1628",
  },
});
