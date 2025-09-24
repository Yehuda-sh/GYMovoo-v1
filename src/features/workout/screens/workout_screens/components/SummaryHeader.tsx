/**
 * @file src/features/workout/screens/workout_screens/components/SummaryHeader.tsx
 * @brief Header component for WorkoutSummaryScreen - success animation and title
 */

import React from "react";
import { Text, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../../core/theme";
import { formatDuration } from "../../../../../utils/formatters";
import { WorkoutSummaryData } from "../../../../../navigation/types";

interface SummaryHeaderProps {
  workoutData: WorkoutSummaryData;
  fadeAnim: Animated.Value;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  workoutData,
  fadeAnim,
}) => {
  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[theme.colors.success, theme.colors.primary]}
        style={styles.successCircle}
      >
        <MaterialCommunityIcons name="check" size={48} color="white" />
      </LinearGradient>

      <Text style={styles.congratsText}>כל הכבוד!</Text>

      <Text style={styles.workoutTitle}>{workoutData.workoutName}</Text>

      <Text style={styles.completionText}>
        הושלם ב-{formatDuration(workoutData.totalDuration)}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  completionText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
