/**
 * @file src/features/workout/utils/workoutStatsCalculator.ts
 * @description יוטיליטי מאופטם לחישוב סטטיסטיקות אימון
 */

// cspell:ignore יוטיליטי מאופטם אימונים מצויין אנליטיקה

import type {
  WorkoutExercise,
  Set as WorkoutSet, // אליאס כדי לא להתנגש עם Set המובנה של JS
} from "../../../core/types/workout.types";

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
  timeToComplete: number; // סכום זמן ביצוע (שניות) בסטים שהושלמו
}

interface ExerciseStats {
  completedSets: number;
  totalVolume: number;
  totalReps: number;
  personalRecords: number;
  timeToComplete: number;
}

const EMPTY_EXERCISE_STATS: ExerciseStats = {
  completedSets: 0,
  totalVolume: 0,
  totalReps: 0,
  personalRecords: 0,
  timeToComplete: 0,
};

// ===============================================
// 🧮 Helper Functions
// ===============================================

const round2 = (n: number): number => Math.round(n * 100) / 100;
const clampNonNeg = (n: number): number =>
  n < 0 || !Number.isFinite(n) ? 0 : n;

/**
 * המרה בטוחה למספר עם תמיכה בטווחים (למשל "8-12" → 10)
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
 * חישוב סטטיסטיקות עבור תרגיל בודד (מערך סטים)
 */
function calculateExerciseStats(sets: WorkoutSet[]): ExerciseStats {
  if (!sets?.length) return { ...EMPTY_EXERCISE_STATS };

  return sets.reduce<ExerciseStats>(
    (stats, s) => {
      if (!s.completed) return stats;

      const reps = clampNonNeg(toNumberSafe(s.actualReps ?? s.targetReps ?? 0));
      const weight = clampNonNeg(
        toNumberSafe(s.actualWeight ?? s.targetWeight ?? 0)
      );
      const time = s.timeToComplete
        ? clampNonNeg(toNumberSafe(s.timeToComplete))
        : 0;

      return {
        completedSets: stats.completedSets + 1,
        totalVolume: stats.totalVolume + reps * weight,
        totalReps: stats.totalReps + reps,
        personalRecords: stats.personalRecords + (s.isPR ? 1 : 0),
        timeToComplete: stats.timeToComplete + time,
      };
    },
    { ...EMPTY_EXERCISE_STATS }
  );
}

/**
 * חישוב סטטיסטיקות אימון מקיפות
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

  const aggregated = exercises.reduce<
    Omit<
      WorkoutStats,
      | "totalExercises"
      | "totalSets"
      | "progressPercentage"
      | "averageVolumePerSet"
      | "averageRepsPerSet"
    >
  >(
    (acc, exercise) => {
      if (!exercise.sets?.length) return acc;

      totalSets += exercise.sets.length;
      const exStats = calculateExerciseStats(exercise.sets);

      return {
        completedExercises:
          acc.completedExercises + (exStats.completedSets > 0 ? 1 : 0),
        completedSets: acc.completedSets + exStats.completedSets,
        totalVolume: acc.totalVolume + exStats.totalVolume,
        totalReps: acc.totalReps + exStats.totalReps,
        personalRecords: acc.personalRecords + exStats.personalRecords,
        timeToComplete: acc.timeToComplete + exStats.timeToComplete,
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

  const { completedSets, totalVolume, totalReps } = aggregated;
  const progressPercentage =
    totalSets > 0
      ? Math.min(
          100,
          Math.max(0, Math.round((completedSets / totalSets) * 100))
        )
      : 0;

  return {
    totalExercises,
    totalSets,
    progressPercentage,
    ...aggregated,
    totalVolume: round2(totalVolume),
    averageVolumePerSet:
      completedSets > 0 ? round2(totalVolume / completedSets) : 0,
    averageRepsPerSet:
      completedSets > 0 ? round2(totalReps / completedSets) : 0,
  };
}
