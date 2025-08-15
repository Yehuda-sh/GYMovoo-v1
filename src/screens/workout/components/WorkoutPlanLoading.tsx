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
              size={48}
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
  },
  content: {
    alignItems: "center",
    padding: 24,
  },
  brainIcon: {
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

WorkoutPlanLoading.displayName = "WorkoutPlanLoading";

export default WorkoutPlanLoading;
