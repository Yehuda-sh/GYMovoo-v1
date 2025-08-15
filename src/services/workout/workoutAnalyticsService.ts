/**
 * @file src/services/workout/workoutAnalyticsService.ts
 * @description Service for workout analytics.
 */
import {
  WorkoutData,
  WorkoutHistoryItem,
  WorkoutSummary,
} from "../../screens/workout/types/workout.types";
import { PersonalData } from "../../utils/personalDataUtils";

class WorkoutAnalyticsService {
  /**
   * Get personalized workout analytics.
   */
  async getPersonalizedWorkoutAnalytics(
    history: WorkoutHistoryItem[],
    personalData: PersonalData
  ): Promise<string[]> {
    const insights: string[] = [];
    if (history.length < 2) {
      return ["השלם לפחות שני אימונים כדי לקבל ניתוח מותאם אישית."];
    }

    const lastWorkout = history[0];
    const previousWorkout = history[1];

    // Compare total volume
    if (lastWorkout.workout && previousWorkout.workout) {
      const lastVolume = this.calculateTotalVolume(
        lastWorkout.workout as WorkoutData
      );
      const prevVolume = this.calculateTotalVolume(
        previousWorkout.workout as WorkoutData
      );
      if (prevVolume > 0 && lastVolume > prevVolume) {
        insights.push(
          `כל הכבוד! הנפח הכולל שלך עלה ב-${(
            ((lastVolume - prevVolume) / prevVolume) *
            100
          ).toFixed(0)}% מהאימון הקודם.`
        );
      }
    }

    // Check for consistency
    const workoutDates = history
      .map((h) => (h.date ? new Date(h.date).getTime() : 0))
      .filter((d) => d > 0);

    if (workoutDates.length > 1) {
      const diffs = workoutDates
        .slice(0, -1)
        .map((date, i) => date - workoutDates[i + 1]);
      const avgDiff = diffs.reduce((a, b) => a + b, 0) / (diffs.length || 1);
      const daysBetween = avgDiff / (1000 * 60 * 60 * 24);
      if (
        personalData.availability &&
        daysBetween >
          (parseInt(personalData.availability.split("_")[0], 10) || 3) + 2
      ) {
        insights.push(
          `נראה שהייתה הפסקה ארוכה בין האימונים. נסה לשמור על עקביות.`
        );
      }
    }

    return insights;
  }

  /**
   * Calculate total volume for a workout.
   */
  calculateTotalVolume(workout: WorkoutData): number {
    return workout.exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
        if (set.completed) {
          return setTotal + (set.actualReps || 0) * (set.actualWeight || 0);
        }
        return setTotal;
      }, 0);
      return total + exerciseVolume;
    }, 0);
  }

  /**
   * Generate a summary for a completed workout.
   */
  generateWorkoutSummary(workout: WorkoutData): WorkoutSummary {
    const completedExercises = workout.exercises.filter((ex) =>
      ex.sets.some((s) => s.completed)
    );
    const totalVolume = this.calculateTotalVolume(workout);
    const totalSets = workout.exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
      0
    );
    const totalReps = workout.exercises.reduce(
      (sum, ex) =>
        sum +
        ex.sets.reduce(
          (exSum, s) => exSum + (s.completed ? s.actualReps || 0 : 0),
          0
        ),
      0
    );

    return {
      duration: workout.duration,
      totalVolume,
      totalSets,
      totalReps,
      completedExercises: completedExercises.length,
      workoutName: workout.name,
    };
  }
}

export const workoutAnalyticsService = new WorkoutAnalyticsService();
