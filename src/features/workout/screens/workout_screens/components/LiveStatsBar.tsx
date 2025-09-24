/**
 * @file src/features/workout/screens/workout_screens/components/LiveStatsBar.tsx
 * @brief Real-time statistics display for ActiveWorkoutScreen
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../../../../core/theme";

interface LiveStatsBarProps {
  completedSets: number;
  totalVolume: number;
  totalReps: number;
  progressPercentage: number;
}

export const LiveStatsBar: React.FC<LiveStatsBarProps> = ({
  completedSets,
  totalVolume,
  totalReps,
  progressPercentage,
}) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{completedSets}</Text>
        <Text style={styles.statLabel}>סטים</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalVolume}kg</Text>
        <Text style={styles.statLabel}>נפח</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalReps}</Text>
        <Text style={styles.statLabel}>חזרות</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{progressPercentage}%</Text>
        <Text style={styles.statLabel}>התקדמות</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
