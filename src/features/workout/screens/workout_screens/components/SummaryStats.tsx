/**
 * @file src/features/workout/screens/workout_screens/components/SummaryStats.tsx
 * @brief Statistics cards component for WorkoutSummaryScreen
 */

import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL } from "../../../../../utils/rtlHelpers";
import { WorkoutSummaryData } from "../../../../../navigation/types";

interface SummaryStatsProps {
  workoutData: WorkoutSummaryData;
  fadeAnim: Animated.Value;
}

const StatCard: React.FC<{
  icon: string;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <View style={styles.statCard}>
    <MaterialCommunityIcons
      name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
      size={24}
      color={color}
    />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  workoutData,
  fadeAnim,
}) => {
  return (
    <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
      <StatCard
        icon="dumbbell"
        label="תרגילים"
        value={workoutData.exercises.length}
        color={theme.colors.primary}
      />
      <StatCard
        icon="format-list-numbered"
        label="סטים"
        value={workoutData.totalSets}
        color={theme.colors.warning}
      />
      <StatCard
        icon="repeat"
        label="חזרות"
        value={workoutData.totalReps}
        color={theme.colors.success}
      />
      <StatCard
        icon="weight-kilogram"
        label="נפח (ק״ג)"
        value={Math.round(workoutData.totalVolume)}
        color={theme.colors.error}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});
