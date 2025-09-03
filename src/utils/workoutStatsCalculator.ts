/**
 * @file src/utils/workoutStatsCalculator.ts
 * @description יוטיליטי לחישוב סטטיסטיקות אימון
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
  personalRecords?: number;
  averageVolumePerSet: number;
  averageRepsPerSet: number;
  timeToComplete?: number;
}

// Helper functions
const round2 = (n: number) => Math.round(n * 100) / 100;
const clampNonNegative = (n: number) => (n < 0 || !Number.isFinite(n) ? 0 : n);
const toNumberSafe = (v: unknown): number => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const s = v.trim();
    const range = s.split("-").map((x) => parseFloat(x));
    if (range.length === 2 && range.every((x) => Number.isFinite(x))) {
      return (range[0] + range[1]) / 2;
    }
    const num = parseFloat(s);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
};

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

      const reps = clampNonNegative(
        toNumberSafe(set.actualReps ?? set.targetReps ?? 0)
      );
      const weight = clampNonNegative(
        toNumberSafe(set.actualWeight ?? set.targetWeight ?? 0)
      );

      totalReps += reps;
      totalVolume += reps * weight;
      if (set.timeToComplete) {
        const t = toNumberSafe(set.timeToComplete);
        if (t > 0) timeToComplete += t;
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
 * חישוב סטטיסטיקות אימון מקיפות
 */
export function calculateWorkoutStats(
  exercises: WorkoutExercise[]
): WorkoutStats {
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
    totalVolume: round2(totalVolume),
    totalReps,
    progressPercentage,
    personalRecords,
    averageVolumePerSet:
      completedSets > 0 ? round2(totalVolume / completedSets) : 0,
    averageRepsPerSet:
      completedSets > 0 ? round2(totalReps / completedSets) : 0,
    timeToComplete: totalTimeToComplete,
  };
}
