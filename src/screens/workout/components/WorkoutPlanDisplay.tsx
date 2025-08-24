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
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import { theme } from "../../../styles/theme";
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
      <View style={styles.emptyState}>
        <Text
          style={styles.emptyTitle}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="אין אימונים בתוכנית"
        >
          אין אימונים בתוכנית
        </Text>
        <Text
          style={styles.emptyMessage}
          accessible={true}
          accessibilityLabel="התוכנית עדיין לא מכילה אימונים"
        >
          התוכנית עדיין לא מכילה אימונים
        </Text>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              accessible={true}
              accessibilityLabel="טוען אימונים"
            />
            <Text style={styles.loadingText}>טוען אימונים...</Text>
          </View>
        )}
      </View>
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
          <View key={`${workout.id}-${index}`} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <Text
                style={styles.workoutName}
                accessible={true}
                accessibilityRole="header"
                accessibilityLabel={`אימון ${workout.name}`}
              >
                {workout.name}
              </Text>
              <Text
                style={styles.workoutDuration}
                accessible={true}
                accessibilityLabel={`משך האימון ${workout.duration} דקות`}
              >
                {workout.duration} דקות
              </Text>
            </View>

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

            {/* כפתור התחלת אימון */}
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
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.background}
                    style={styles.buttonLoader}
                  />
                  <Text style={styles.startButtonText}>מכין אימון...</Text>
                </View>
              ) : (
                <Text style={styles.startButtonText}>התחל אימון</Text>
              )}
            </TouchableOpacity>
          </View>
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
  workoutCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // הוספת צל עדין
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    marginBottom: 16,
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
