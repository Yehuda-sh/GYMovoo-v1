/**
 * @file src/features/workout/screens/workout_screens/components/WorkoutHeader.tsx
 * @brief Header component for ActiveWorkoutScreen with timer and controls
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackButton from "../../../../../components/common/BackButton";
import { theme } from "../../../../../core/theme";

interface WorkoutHeaderProps {
  workoutTitle: string;
  workoutTime: string;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workoutTitle,
  workoutTime,
  isTimerRunning,
  onToggleTimer,
}) => {
  return (
    <View style={styles.header}>
      <BackButton />
      <View style={styles.headerCenter}>
        <Text style={styles.workoutTitle}>{workoutTitle}</Text>
        <Text style={styles.workoutTime}>{workoutTime}</Text>
      </View>
      <TouchableOpacity style={styles.timerButton} onPress={onToggleTimer}>
        <MaterialCommunityIcons
          name={isTimerRunning ? "pause" : "play"}
          size={20}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: theme.spacing.md,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  workoutTime: {
    fontSize: 16,
    color: theme.colors.primary,
    marginTop: 4,
  },
  timerButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary + "20",
  },
});
