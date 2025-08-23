/**
 * @file src/screens/workout/components/WorkoutPlanDisplay.tsx
 * @brief מציג את התוכנית הנבחרת עם כל האימונים והתרגילים
 * @dependencies React Native, WorkoutPlan types
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../../../styles/theme";
import type { WorkoutPlan, WorkoutRecommendation } from "../../../types/index";

interface WorkoutPlanDisplayProps {
  workoutPlan: WorkoutPlan;
  onStartWorkout: (workout: WorkoutRecommendation, index: number) => void;
}

export default function WorkoutPlanDisplay({
  workoutPlan,
  onStartWorkout,
}: WorkoutPlanDisplayProps) {
  if (!workoutPlan.workouts || workoutPlan.workouts.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>אין אימונים בתוכנית</Text>
        <Text style={styles.emptyMessage}>התוכנית עדיין לא מכילה אימונים</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>תוכנית האימון שלך</Text>
        <Text style={styles.planSubtitle}>
          {workoutPlan.workouts.length} אימונים • {workoutPlan.frequency} פעמים
          בשבוע
        </Text>
      </View>

      <View style={styles.listContent}>
        {workoutPlan.workouts.map((workout, index) => (
          <View key={`${workout.id}-${index}`} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDuration}>
                {workout.duration} דקות
              </Text>
            </View>

            <Text style={styles.workoutDescription}>{workout.description}</Text>

            {/* רשימת תרגילים */}
            {workout.exercises && workout.exercises.length > 0 && (
              <View style={styles.exercisesSection}>
                <Text style={styles.exercisesTitle}>
                  תרגילים ({workout.exercises.length}):
                </Text>
                {workout.exercises
                  .slice(0, 3)
                  .map((exercise, exerciseIndex) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>
                        {exerciseIndex + 1}. {exercise.name}
                      </Text>
                      <Text style={styles.exerciseDetails}>
                        {exercise.sets?.length || 0} סטים
                        {exercise.sets?.[0]?.reps &&
                          ` • ${exercise.sets[0].reps} חזרות`}
                        {exercise.sets?.[0]?.duration &&
                          ` • ${exercise.sets[0].duration} שניות`}
                      </Text>
                    </View>
                  ))}

                {workout.exercises.length > 3 && (
                  <Text style={styles.moreExercises}>
                    +{workout.exercises.length - 3} תרגילים נוספים
                  </Text>
                )}
              </View>
            )}

            {/* כפתור התחלת אימון */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => onStartWorkout(workout, index)}
            >
              <Text style={styles.startButtonText}>התחל אימון</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  planHeader: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingBottom: 20,
  },
  workoutCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    flex: 1,
  },
  workoutDuration: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  workoutDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  exercisesSection: {
    marginBottom: 16,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
  },
  exerciseItem: {
    marginBottom: 6,
    paddingLeft: 8,
  },
  exerciseName: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  exerciseDetails: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  moreExercises: {
    fontSize: 12,
    color: theme.colors.primary,
    fontStyle: "italic",
    paddingLeft: 8,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  startButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
