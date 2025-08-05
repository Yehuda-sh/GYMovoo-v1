/**
 * @file src/utils/workoutStatsCalculator.ts
 * @brief יוטיליטי מרכזי לחישוב סטטיסטיקות אימון
 * @description מונע כפילות קוד בחישוב סטטיסטיקות בין קבצים שונים
 */

import type { Exercise, Set } from "../screens/workout/types/workout.types";

export interface WorkoutStats {
  totalExercises: number;
  completedExercises: number;
  totalSets: number;
  completedSets: number;
  totalVolume: number;
  totalReps: number;
  progressPercentage: number;
  personalRecords?: number;
}

/**
 * חישוב סטטיסטיקות אימון מלא
 * Calculates comprehensive workout statistics
 */
export function calculateWorkoutStats(exercises: Exercise[]): WorkoutStats {
  let totalExercises = exercises.length;
  let completedExercises = 0;
  let totalSets = 0;
  let completedSets = 0;
  let totalVolume = 0;
  let totalReps = 0;
  let personalRecords = 0;

  exercises.forEach((exercise) => {
    if (!exercise.sets) return;

    let exerciseCompletedSets = 0;
    let exerciseHasAnySets = false;

    exercise.sets.forEach((set: Set) => {
      totalSets++;
      exerciseHasAnySets = true;

      if (set.completed) {
        completedSets++;
        exerciseCompletedSets++;

        const reps = set.actualReps || set.targetReps || 0;
        const weight = set.actualWeight || set.targetWeight || 0;

        totalReps += reps;
        totalVolume += reps * weight;

        // חישוב שיאים אישיים
        if (set.isPR) {
          personalRecords++;
        }
      }
    });

    // תרגיל נחשב מושלם אם יש לו לפחות סט אחד מושלם
    if (exerciseCompletedSets > 0 && exerciseHasAnySets) {
      completedExercises++;
    }
  });

  return {
    totalExercises,
    completedExercises,
    totalSets,
    completedSets,
    totalVolume,
    totalReps,
    progressPercentage:
      totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0,
    personalRecords,
  };
}

/**
 * חישוב אחוז התקדמות פשוט
 * Simple progress percentage calculation
 */
export function calculateProgress(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

/**
 * חישוב נפח כולל (משקל × חזרות × סטים)
 * Calculate total volume (weight × reps × sets)
 */
export function calculateTotalVolume(
  weight: number,
  reps: number,
  sets: number
): number {
  return weight * reps * sets;
}

/**
 * חישוב ציון יעילות אימון (1-10)
 * Calculate workout efficiency score (1-10)
 */
export function calculateWorkoutEfficiency(
  completedSets: number,
  plannedSets: number,
  duration: number,
  plannedDuration: number
): number {
  const completionRate = completedSets / plannedSets;
  const timeEfficiency = plannedDuration / duration;
  const efficiency = (completionRate * 0.7 + timeEfficiency * 0.3) * 10;
  return Math.round(Math.max(1, Math.min(10, efficiency)));
}
