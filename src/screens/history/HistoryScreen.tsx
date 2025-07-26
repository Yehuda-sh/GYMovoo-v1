/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים - זמני
 * @brief Workout history screen - temporary
 * @dependencies React Native, theme
 * @notes מסך זמני למניעת שגיאות ניווט
 * @notes Temporary screen to prevent navigation errors
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="history"
          size={80}
          color={theme.colors.primary}
        />
        <Text style={styles.title}>היסטוריית אימונים</Text>
        <Text style={styles.subtitle}>
          כאן תוכל לראות את כל האימונים שביצעת
        </Text>
        <Text style={styles.comingSoon}>בקרוב...</Text>

        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons name="chart-line" size={24} color="#fff" />
          <Text style={styles.buttonText}>צפה בנתונים</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 18,
    color: theme.colors.primary,
    fontWeight: "600",
    marginBottom: 32,
  },
  button: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
