/**
 * @file src/screens/workout/components/WorkoutPlanLoading.tsx
 * @brief Loading Component for Workout Plan Generation
 * @updated August 2025 - Performance optimized loading component
 */

import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

interface WorkoutPlanLoadingProps {
  message?: string;
  isAI?: boolean;
}

const WorkoutPlanLoading = memo(
  ({
    message = "יוצר תוכנית אימון...",
    isAI = false,
  }: WorkoutPlanLoadingProps) => {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {isAI && (
            <MaterialCommunityIcons
              name="brain"
              size={56}
              color={theme.colors.primary}
              style={styles.brainIcon}
            />
          )}

          <LoadingSpinner size="large" />

          <Text style={styles.message}>{message}</Text>

          {isAI && (
            <Text style={styles.subMessage}>
              AI מנתח את הנתונים שלך לתוכנית מותאמת אישית
            </Text>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
    padding: 32,
    backgroundColor: `${theme.colors.surface}F8`,
    borderRadius: 24,
    maxWidth: 320,
    width: "100%",
    // שיפורי עיצוב מתקדמים
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}40`,
  },
  brainIcon: {
    marginBottom: 20,
    opacity: 0.9,
  },
  message: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 0.3,
    lineHeight: 26,
    // שיפור טיפוגרפי
    textShadowColor: `${theme.colors.text}10`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subMessage: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.2,
    paddingHorizontal: 16,
    marginTop: 8,
  },
});

WorkoutPlanLoading.displayName = "WorkoutPlanLoading";

export default WorkoutPlanLoading;
