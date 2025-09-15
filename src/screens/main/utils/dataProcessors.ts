/**
 * @file dataProcessors.ts
 * @description Data processing utilities for MainScreen
 */

import type { WorkoutHistoryItem } from "../../../core/types/user.types";

/**
 * Calculate next recommended training day
 */
export const getNextRecommendedDay = (
  workouts: WorkoutHistoryItem[],
  availableDays: number
): number => {
  if (workouts.length === 0) return 1;

  const lastWorkout = workouts[workouts.length - 1];
  const lastWorkoutType = lastWorkout?.name || "";

  if (lastWorkoutType.includes("1") || lastWorkoutType.includes("יום 1")) {
    return 2;
  } else if (
    lastWorkoutType.includes("2") ||
    lastWorkoutType.includes("יום 2")
  ) {
    return availableDays >= 3 ? 3 : 1;
  } else if (
    lastWorkoutType.includes("3") ||
    lastWorkoutType.includes("יום 3")
  ) {
    return availableDays >= 4 ? 4 : 1;
  } else if (
    lastWorkoutType.includes("4") ||
    lastWorkoutType.includes("יום 4")
  ) {
    return availableDays >= 5 ? 5 : 1;
  } else if (
    lastWorkoutType.includes("5") ||
    lastWorkoutType.includes("יום 5")
  ) {
    return 1;
  }

  return 1;
};
