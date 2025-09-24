/**
 * @file src/features/workout/screens/workout_screens/components/ExercisesList.tsx
 * @brief Exercises list component for WorkoutSummaryScreen
 */

import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL } from "../../../../../utils/rtlHelpers";
import { WorkoutSummaryData } from "../../../../../navigation/types";

interface ExercisesListProps {
  exercises: WorkoutSummaryData["exercises"];
  fadeAnim: Animated.Value;
}

const ExerciseCard: React.FC<{
  exercise: WorkoutSummaryData["exercises"][0];
}> = ({ exercise }) => (
  <View style={styles.exerciseCard}>
    <Text style={styles.exerciseName}>{exercise.name}</Text>
    <View style={styles.setsContainer}>
      {exercise.sets.map((set, index) => (
        <View key={`${exercise.id || index}_${index}`} style={styles.setRow}>
          <Text style={styles.setText}>
            סט {index + 1}: {set.reps} חזרות
            {typeof set.weight === "number" && set.weight > 0
              ? ` × ${Math.round(set.weight)} ק״ג`
              : ""}
          </Text>
          <MaterialCommunityIcons
            name={set.completed ? "check-circle" : "circle-outline"}
            size={16}
            color={
              set.completed ? theme.colors.success : theme.colors.textSecondary
            }
          />
        </View>
      ))}
    </View>
  </View>
);

export const ExercisesList: React.FC<ExercisesListProps> = ({
  exercises,
  fadeAnim,
}) => {
  return (
    <Animated.View style={[styles.exercisesSection, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>פירוט תרגילים</Text>

      {exercises.map((exercise, index) => (
        <ExerciseCard key={exercise.id || `ex_${index}`} exercise={exercise} />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  exercisesSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: isRTL() ? "right" : "left",
  },
  exerciseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL() ? "right" : "left",
  },
  setsContainer: {
    gap: theme.spacing.sm,
  },
  setRow: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  setText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: isRTL() ? "right" : "left",
  },
});
