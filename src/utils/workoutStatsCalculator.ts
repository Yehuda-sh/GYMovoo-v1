/**
 * @file src/utils/workoutStatsCalculator.ts
 * @description יוטיליטי מאופטם לחישוב סטטיסטיקות אימון
 */

import type {
  WorkoutExercise,
  Set,
} from "../screens/workout/types/workout.types";

export interface WorkoutStats {
  totalExercises: number;
  completedExercises: number;
  totalSets: number;
  completedSets: number;
  totalVolume: number;
  totalReps: number;
  progressPercentage: number;
  personalRecords: number;
  averageVolumePerSet: number;
  averageRepsPerSet: number;
  timeToComplete: number;
}

// ===============================================
// 🧮 Helper Functions - מאופטמות
// ===============================================

const round2 = (n: number): number => Math.round(n * 100) / 100;
const clamp = (n: number): number => (n < 0 || !Number.isFinite(n) ? 0 : n);

/**
 * המרה בטוחה למספר עם תמיכה בטווחים
 */
const toNumberSafe = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const trimmed = value.trim();
    // תמיכה בטווח כמו "8-12"
    if (trimmed.includes("-")) {
      const parts = trimmed.split("-");
      if (parts.length === 2) {
        const min = Number(parts[0]);
        const max = Number(parts[1]);
        if (Number.isFinite(min) && Number.isFinite(max)) {
          return (min + max) / 2;
        }
      }
    }
    const parsed = parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

/**
 * חישוב סטטיסטיקות לסט אימונים בודד
 */
function calculateExerciseStats(sets: Set[]) {
  if (!sets?.length) {
    return {
      completedSets: 0,
      totalVolume: 0,
      totalReps: 0,
      personalRecords: 0,
      timeToComplete: 0,
    };
  }

  return sets.reduce(
    (stats, set) => {
      if (!set.completed) return stats;

      const reps = clamp(toNumberSafe(set.actualReps ?? set.targetReps ?? 0));
      const weight = clamp(
        toNumberSafe(set.actualWeight ?? set.targetWeight ?? 0)
      );
      const time = set.timeToComplete
        ? clamp(toNumberSafe(set.timeToComplete))
        : 0;

      return {
        completedSets: stats.completedSets + 1,
        totalVolume: stats.totalVolume + reps * weight,
        totalReps: stats.totalReps + reps,
        personalRecords: stats.personalRecords + (set.isPR ? 1 : 0),
        timeToComplete: stats.timeToComplete + time,
      };
    },
    {
      completedSets: 0,
      totalVolume: 0,
      totalReps: 0,
      personalRecords: 0,
      timeToComplete: 0,
    }
  );
}

/**
 * חישוב סטטיסטיקות אימון מקיפות - מאופטם
 */
export function calculateWorkoutStats(
  exercises: WorkoutExercise[]
): WorkoutStats {
  if (!exercises?.length) {
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
  let totalSets = 0;

  // שימוש ב-reduce לביצועים טובים יותר
  const aggregatedStats = exercises.reduce(
    (acc, exercise) => {
      if (!exercise.sets?.length) return acc;

      totalSets += exercise.sets.length;
      const exerciseStats = calculateExerciseStats(exercise.sets);

      return {
        completedExercises:
          acc.completedExercises + (exerciseStats.completedSets > 0 ? 1 : 0),
        completedSets: acc.completedSets + exerciseStats.completedSets,
        totalVolume: acc.totalVolume + exerciseStats.totalVolume,
        totalReps: acc.totalReps + exerciseStats.totalReps,
        personalRecords: acc.personalRecords + exerciseStats.personalRecords,
        timeToComplete: acc.timeToComplete + exerciseStats.timeToComplete,
      };
    },
    {
      completedExercises: 0,
      completedSets: 0,
      totalVolume: 0,
      totalReps: 0,
      personalRecords: 0,
      timeToComplete: 0,
    }
  );

  const { completedSets, totalVolume, totalReps } = aggregatedStats;
  const progressPercentage =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return {
    totalExercises,
    totalSets,
    progressPercentage,
    ...aggregatedStats,
    totalVolume: round2(totalVolume),
    averageVolumePerSet:
      completedSets > 0 ? round2(totalVolume / completedSets) : 0,
    averageRepsPerSet:
      completedSets > 0 ? round2(totalReps / completedSets) : 0,
  };
}
