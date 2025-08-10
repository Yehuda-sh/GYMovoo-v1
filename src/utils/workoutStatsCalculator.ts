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
  // 💡 New advanced stats
  averageVolumePerSet: number;
  averageRepsPerSet: number;
  timeToComplete?: number; // in seconds
}

/**
 * Processes a single exercise's sets to calculate its contribution to the total stats.
 * @param sets - The array of sets for a single exercise.
 * @returns An object with stats for the given sets.
 */
function processExerciseSets(sets: Set[]) {
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
 * חישוב סטטיסטיקות אימון מלא
 * Calculates comprehensive workout statistics
 */
export function calculateWorkoutStats(exercises: Exercise[]): WorkoutStats {
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
    totalVolume,
    totalReps,
    progressPercentage,
    personalRecords,
    // 💡 Add new stats to the return object
    averageVolumePerSet: completedSets > 0 ? totalVolume / completedSets : 0,
    averageRepsPerSet: completedSets > 0 ? totalReps / completedSets : 0,
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
