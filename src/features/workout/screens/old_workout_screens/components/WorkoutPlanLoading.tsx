/**
 * @file WorkoutPlanLoading.tsx
 * @description רכיב טעינה לתוכנית אימון
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

interface WorkoutPlanLoadingProps {
  message?: string;
  isAI?: boolean;
}

const WorkoutPlanLoading: React.FC<WorkoutPlanLoadingProps> = ({
  message = "יוצר תוכנית אימון...",
  isAI = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isAI && (
          <MaterialCommunityIcons
            name="brain"
            size={48}
            color={theme.colors.primary}
            style={styles.icon}
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
};

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
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    maxWidth: 320,
    width: "100%",
  },

  icon: {
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
    marginTop: 8,
  },
});

export default WorkoutPlanLoading;
