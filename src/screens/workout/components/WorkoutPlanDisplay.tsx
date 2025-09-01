/**
 * @file src/screens/workout/components/WorkoutPlanDisplay.tsx
 * @brief מציג את התוכנית הנבחרת עם כל האימונים והתרגילים - גרסה משופרת
 * @dependencies React Native, WorkoutPlan types, Haptic Feedback
 * @updated August 2025 - Enhanced UX, Accessibility & Performance
 *
 * 🚀 שיפורים שנוספו:
 * - 🎯 Haptic Feedback למגע טוב יותר
 * - ♿ נגישות מלאה עם accessibilityLabels
 * - 📊 סטטיסטיקות מחושבות ממוזכרות
 * - 🎨 עיצוב משופר עם צללים ואנימציות
 * - ⚡ אופטימיזציה עם React.memo
 * - 🔄 מצבי טעינה אינטראקטיביים
 * - 📱 שיפורי UX עם hitSlop וגדלים מותאמים
 */

import React, { useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { theme } from "../../../styles/theme";
import EmptyState from "../../../components/common/EmptyState";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import UniversalCard from "../../../components/ui/UniversalCard";
import type { WorkoutPlan, WorkoutRecommendation } from "../../../types/index";

interface WorkoutPlanDisplayProps {
  workoutPlan: WorkoutPlan;
  onStartWorkout: (workout: WorkoutRecommendation, index: number) => void;
  isLoading?: boolean;
}

const WorkoutPlanDisplay = React.memo(function WorkoutPlanDisplay({
  workoutPlan,
  onStartWorkout,
  isLoading = false,
}: WorkoutPlanDisplayProps) {
  // 🎯 Haptic Feedback
  const triggerHaptic = useCallback((type: "selection" | "impact") => {
    if (type === "selection") {
      Haptics.selectionAsync();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  // 📊 מחושב ממוזכר של נתוני התוכנית
  const planStats = useMemo(() => {
    if (!workoutPlan.workouts || workoutPlan.workouts.length === 0) {
      return { totalExercises: 0, avgDuration: 0, totalWorkouts: 0 };
    }

    const totalExercises = workoutPlan.workouts.reduce(
      (sum, workout) => sum + (workout.exercises?.length || 0),
      0
    );

    const avgDuration =
      workoutPlan.workouts.reduce(
        (sum, workout) => sum + (workout.duration || 0),
        0
      ) / workoutPlan.workouts.length;

    return {
      totalExercises,
      avgDuration: Math.round(avgDuration),
      totalWorkouts: workoutPlan.workouts.length,
    };
  }, [workoutPlan.workouts]);

  // 🏃‍♂️ מטפל בלחיצה על התחלת אימון
  const handleStartWorkout = useCallback(
    (workout: WorkoutRecommendation, index: number) => {
      triggerHaptic("impact");
      onStartWorkout(workout, index);
    },
    [onStartWorkout, triggerHaptic]
  );
  if (!workoutPlan.workouts || workoutPlan.workouts.length === 0) {
    return (
      <EmptyState
        icon="clipboard-outline"
        title="אין אימונים בתוכנית"
        description="התוכנית עדיין לא מכילה אימונים"
        variant="compact"
        testID="workout-plan-empty-state"
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <LoadingSpinner
              size="small"
              variant="pulse"
              text="טוען אימונים..."
              testID="workout-plan-loading"
            />
          </View>
        )}
      </EmptyState>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.planHeader}>
        <Text
          style={styles.planTitle}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="תוכנית האימון שלך"
        >
          תוכנית האימון שלך
        </Text>
        <Text
          style={styles.planSubtitle}
          accessible={true}
          accessibilityLabel={`${planStats.totalWorkouts} אימונים, ${workoutPlan.frequency} פעמים בשבוע, סך הכל ${planStats.totalExercises} תרגילים`}
        >
          {planStats.totalWorkouts} אימונים • {workoutPlan.frequency} פעמים
          בשבוע
        </Text>
        {/* סטטיסטיקות נוספות */}
        <Text style={styles.planExtraStats}>
          📊 {planStats.totalExercises} תרגילים • ⏱️ ממוצע{" "}
          {planStats.avgDuration} דקות
        </Text>
      </View>

      <View style={styles.listContent}>
        {workoutPlan.workouts.map((workout, index) => (
          <UniversalCard
            key={`${workout.id}-${index}`}
            title={workout.name}
            subtitle={`${workout.duration} דקות`}
            variant="workout"
            enableHapticFeedback={true}
            testID={`workout-card-${index}`}
            accessibilityLabel={`אימון ${workout.name}`}
            footer={
              <TouchableOpacity
                style={[
                  styles.startButton,
                  isLoading && styles.startButtonDisabled,
                ]}
                onPress={() => handleStartWorkout(workout, index)}
                disabled={isLoading}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`התחל אימון ${workout.name}, אימון מספר ${index + 1}`}
                accessibilityHint="הקש כדי לעבור למסך האימון הפעיל ולהתחיל להתאמן"
                accessibilityState={{ disabled: isLoading }}
              >
                {isLoading ? (
                  <View style={styles.startButtonContent}>
                    <LoadingSpinner
                      size="small"
                      color={theme.colors.background}
                      variant="bounce"
                      text="מכין אימון..."
                      testID="start-workout-loading"
                    />
                  </View>
                ) : (
                  <Text style={styles.startButtonText}>התחל אימון</Text>
                )}
              </TouchableOpacity>
            }
          >
            <Text
              style={styles.workoutDescription}
              accessible={true}
              accessibilityLabel={`תיאור האימון: ${workout.description}`}
            >
              {workout.description}
            </Text>

            {/* רשימת תרגילים */}
            {workout.exercises && workout.exercises.length > 0 && (
              <View style={styles.exercisesSection}>
                <Text
                  style={styles.exercisesTitle}
                  accessible={true}
                  accessibilityRole="header"
                  accessibilityLabel={`רשימת תרגילים, סך הכל ${workout.exercises.length} תרגילים`}
                >
                  תרגילים ({workout.exercises.length}):
                </Text>
                {workout.exercises
                  .slice(0, 3)
                  .map((exercise, exerciseIndex) => (
                    <View
                      key={exercise.id}
                      style={styles.exerciseItem}
                      accessible={true}
                      accessibilityRole="text"
                    >
                      <Text
                        style={styles.exerciseName}
                        accessible={true}
                        accessibilityLabel={`תרגיל מספר ${exerciseIndex + 1}: ${exercise.name}`}
                      >
                        {exerciseIndex + 1}. {exercise.name}
                      </Text>
                      <Text
                        style={styles.exerciseDetails}
                        accessible={true}
                        accessibilityLabel={`
                          ${exercise.sets?.length || 0} סטים
                          ${exercise.sets?.[0]?.reps ? `, ${exercise.sets[0].reps} חזרות` : ""}
                          ${exercise.sets?.[0]?.duration ? `, ${exercise.sets[0].duration} שניות` : ""}
                        `.trim()}
                      >
                        {exercise.sets?.length || 0} סטים
                        {exercise.sets?.[0]?.reps &&
                          ` • ${exercise.sets[0].reps} חזרות`}
                        {exercise.sets?.[0]?.duration &&
                          ` • ${exercise.sets[0].duration} שניות`}
                      </Text>
                    </View>
                  ))}

                {workout.exercises.length > 3 && (
                  <Text
                    style={styles.moreExercises}
                    accessible={true}
                    accessibilityLabel={`עוד ${workout.exercises.length - 3} תרגילים נוספים`}
                  >
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
});

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
  },
  planSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  planExtraStats: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 20,
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
    paddingVertical: 2,
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
    justifyContent: "center",
    minHeight: 48, // הנגשה - גובה מינימלי לכפתור
  },
  startButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.6,
  },
  startButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLoader: {
    marginRight: 8,
  },
  startButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
});
