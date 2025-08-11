/**
 * @file src/utils/workoutStatsCalculator.ts
 * @description יוטיליטי מרכזי לחישוב סטטיסטיקות אימון - מונע כפילות קוד
 * English: Central utility for workout statistics calculation - prevents code duplication
 *
 * @features
 * - חישוב סטטיסטיקות אימון מקיפות (נפח, חזרות, התקדמות)
 * - ניתוח יעילות אימון וזמן השלמה
 * - זיהוי שיאים אישיים ומעקב התקדמות
 * - ממוצעים ונתונים סטטיסטיים מתקדמים
 *
 * @usage Used in ActiveWorkoutScreen, WorkoutSummary, and analytics services
 * @updated 2025-08-11 שיפור תיעוד והוספת validations
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
  // 💡 New advanced stats
  averageVolumePerSet: number;
  averageRepsPerSet: number;
  timeToComplete?: number; // in seconds
}

/**
 * Processes a single exercise's sets to calculate its contribution to the total stats.
 * מעבד סטים של תרגיל יחיד לחישוב תרומתו לסטטיסטיקות הכוללות
 * @param sets - The array of sets for a single exercise.
 * @returns An object with stats for the given sets.
 */
function processExerciseSets(sets: Set[]) {
  if (!sets || sets.length === 0) {
    return {
      completedSets: 0,
      totalVolume: 0,
      totalReps: 0,
      personalRecords: 0,
      timeToComplete: 0,
    };
  }

  let completedSets = 0;
  let totalVolume = 0;
  let totalReps = 0;
  let personalRecords = 0;
  let timeToComplete = 0;

  sets.forEach((set: Set) => {
    if (set.completed) {
      completedSets++;

      const reps = set.actualReps || set.targetReps || 0;
      const weight = set.actualWeight || set.targetWeight || 0;

      totalReps += reps;
      totalVolume += reps * weight;
      if (set.timeToComplete) {
        timeToComplete += set.timeToComplete;
      }

      if (set.isPR) {
        personalRecords++;
      }
    }
  });

  return {
    completedSets,
    totalVolume,
    totalReps,
    personalRecords,
    timeToComplete,
  };
}

/**
 * חישוב סטטיסטיקות אימון מלא עם validation
 * Calculates comprehensive workout statistics with validation
 */
export function calculateWorkoutStats(exercises: Exercise[]): WorkoutStats {
  if (!exercises || exercises.length === 0) {
    return {
      totalExercises: 0,
      completedExercises: 0,
      totalSets: 0,
      completedSets: 0,
      totalVolume: 0,
      totalReps: 0,
      progressPercentage: 0,
      personalRecords: 0,
      averageVolumePerSet: 0,
      averageRepsPerSet: 0,
      timeToComplete: 0,
    };
  }

  const totalExercises = exercises.length;
  let completedExercises = 0;
  let totalSets = 0;
  let completedSets = 0;
  let totalVolume = 0;
  let totalReps = 0;
  let personalRecords = 0;
  let totalTimeToComplete = 0;

  exercises.forEach((exercise) => {
    if (!exercise.sets || exercise.sets.length === 0) return;

    totalSets += exercise.sets.length;

    const exerciseStats = processExerciseSets(exercise.sets);

    completedSets += exerciseStats.completedSets;
    totalVolume += exerciseStats.totalVolume;
    totalReps += exerciseStats.totalReps;
    personalRecords += exerciseStats.personalRecords;
    totalTimeToComplete += exerciseStats.timeToComplete;

    // An exercise is considered complete if at least one of its sets is completed.
    if (exerciseStats.completedSets > 0) {
      completedExercises++;
    }
  });

  const progressPercentage =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return {
    totalExercises,
    completedExercises,
    totalSets,
    completedSets,
    totalVolume: Math.round(totalVolume * 100) / 100, // Round to 2 decimal places
    totalReps,
    progressPercentage,
    personalRecords,
    // 💡 Add new stats to the return object with proper rounding
    averageVolumePerSet:
      completedSets > 0
        ? Math.round((totalVolume / completedSets) * 100) / 100
        : 0,
    averageRepsPerSet:
      completedSets > 0
        ? Math.round((totalReps / completedSets) * 100) / 100
        : 0,
    timeToComplete: totalTimeToComplete,
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
 * חישוב נפח כולל (משקל × חזרות × סטים) עם validation
 * Calculate total volume (weight × reps × sets) with validation
 */
export function calculateTotalVolume(
  weight: number,
  reps: number,
  sets: number
): number {
  if (weight < 0 || reps < 0 || sets < 0) {
    console.warn("Invalid input for volume calculation:", {
      weight,
      reps,
      sets,
    });
    return 0;
  }
  return weight * reps * sets;
}

/**
 * חישוב ציון יעילות אימון (1-10) עם validation
 * Calculate workout efficiency score (1-10) with validation
 */
export function calculateWorkoutEfficiency(
  completedSets: number,
  plannedSets: number,
  duration: number,
  plannedDuration: number
): number {
  if (plannedSets <= 0 || duration <= 0 || plannedDuration <= 0) {
    console.warn("Invalid input for efficiency calculation:", {
      completedSets,
      plannedSets,
      duration,
      plannedDuration,
    });
    return 1;
  }

  const completionRate = Math.min(1, completedSets / plannedSets);
  const timeEfficiency = Math.min(2, plannedDuration / duration); // Cap at 2x efficiency
  const efficiency = (completionRate * 0.7 + timeEfficiency * 0.3) * 10;
  return Math.round(Math.max(1, Math.min(10, efficiency)));
}
