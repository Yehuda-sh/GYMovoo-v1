/**
 * @file src/screens/plans/WorkoutPlansScreen.tsx
 * @brief מסך תוכניות אימון - Placeholder
 * @dependencies React Native, theme
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function WorkoutPlansScreen() {
  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>תוכניות אימון</Text>
          <Text style={styles.subtitle}>בחר תוכנית שמתאימה לך</Text>
        </View>

        <View style={styles.comingSoonCard}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={64}
            color={theme.colors.primary}
          />
          <Text style={styles.comingSoonTitle}>בקרוב!</Text>
          <Text style={styles.comingSoonText}>
            תוכניות אימון מותאמות אישית, מסלולי התקדמות ועוד...
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
