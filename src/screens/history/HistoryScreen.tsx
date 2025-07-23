/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים - Placeholder
 * @dependencies React Native, theme
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function HistoryScreen() {
  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>היסטוריית אימונים</Text>
          <Text style={styles.subtitle}>כל האימונים שלך במקום אחד</Text>
        </View>

        <View style={styles.comingSoonCard}>
          <MaterialCommunityIcons
            name="history"
            size={64}
            color={theme.colors.accent}
          />
          <Text style={styles.comingSoonTitle}>בקרוב!</Text>
          <Text style={styles.comingSoonText}>
            מעקב אחר כל האימונים, סטטיסטיקות מתקדמות וגרפים...
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginTop: 60,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  comingSoonCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
    marginTop: 40,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});
