/**
 * @file WorkoutPlanDisplay.tsx
 * @description מציג את התוכנית הנבחרת עם כל האימונים והתרגילים
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../../../styles/theme";
import EmptyState from "../../../components/common/EmptyState";
import UniversalCard from "../../../components/ui/UniversalCard";
import type { WorkoutPlan, WorkoutRecommendation } from "../../../types/index";

interface WorkoutPlanDisplayProps {
  workoutPlan: WorkoutPlan;
  onStartWorkout: (workout: WorkoutRecommendation, index: number) => void;
  isLoading?: boolean;
}

const WorkoutPlanDisplay: React.FC<WorkoutPlanDisplayProps> = ({
  workoutPlan,
  onStartWorkout,
  isLoading = false,
}) => {
  if (!workoutPlan.workouts || workoutPlan.workouts.length === 0) {
    return (
      <EmptyState
        icon="clipboard-outline"
        title="אין אימונים בתוכנית"
        description="התוכנית עדיין לא מכילה אימונים"
        variant="compact"
      />
    );
  }

  const totalExercises = workoutPlan.workouts.reduce(
    (sum, workout) => sum + (workout.exercises?.length || 0),
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>תוכנית האימון שלך</Text>
        <Text style={styles.planSubtitle}>
          {workoutPlan.workouts.length} אימונים • {workoutPlan.frequency || 3}{" "}
          פעמים בשבוע • {totalExercises} תרגילים
        </Text>
      </View>

      <View style={styles.listContent}>
        {workoutPlan.workouts.map((workout, index) => (
          <UniversalCard
            key={`${workout.id}-${index}`}
            title={workout.name}
            subtitle={`${workout.duration} דקות`}
            variant="workout"
            footer={
              <TouchableOpacity
                style={[
                  styles.startButton,
                  isLoading && styles.startButtonDisabled,
                ]}
                onPress={() => onStartWorkout(workout, index)}
                disabled={isLoading}
              >
                <Text style={styles.startButtonText}>
                  {isLoading ? "מכין אימון..." : "התחל אימון"}
                </Text>
              </TouchableOpacity>
            }
          >
            <Text style={styles.workoutDescription}>{workout.description}</Text>

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
          </UniversalCard>
        ))}
      </View>
    </View>
  );
};

export default WorkoutPlanDisplay;

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
    textAlign: "right",
  },

  planSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },

  listContent: {
    paddingBottom: 20,
  },

  workoutDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    textAlign: "right",
  },

  exercisesSection: {
    marginBottom: 16,
  },

  exercisesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "right",
  },

  exerciseItem: {
    marginBottom: 6,
    paddingLeft: 8,
  },

  exerciseName: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
    textAlign: "right",
  },

  exerciseDetails: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: "right",
  },

  moreExercises: {
    fontSize: 12,
    color: theme.colors.primary,
    fontStyle: "italic",
    paddingLeft: 8,
    marginTop: 4,
    textAlign: "right",
  },

  startButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  startButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.6,
  },

  startButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});
