/**
 * @file src/utils/workoutSafetyUtils.ts
 * @description Utility functions for safe workout data handling
 * @updated 2025-08-24 - Added to prevent undefined sets errors
 */

import {
  WorkoutExercise,
  Set as WorkoutSet,
} from "../screens/workout/types/workout.types";
import { logger } from "./logger";

/**
 * Safely get sets from exercise with fallback to empty array
 * @param exercise - The workout exercise
 * @returns Safe sets array
 */
export const getSafeSets = (exercise: WorkoutExercise): WorkoutSet[] => {
  if (!exercise) {
    logger.warn(
      "workoutSafetyUtils",
      "getSafeSets called with undefined exercise"
    );
    return [];
  }

  if (!exercise.sets) {
    logger.debug(
      "workoutSafetyUtils",
      "Exercise has no sets, returning empty array",
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
      }
    );
    return [];
  }

  return exercise.sets;
};

/**
 * Safely get sets count from exercise
 * @param exercise - The workout exercise
 * @returns Number of sets or 0 if undefined
 */
export const getSafeSetsCount = (exercise: WorkoutExercise): number => {
  return getSafeSets(exercise).length;
};

/**
 * Check if exercise has valid sets
 * @param exercise - The workout exercise
 * @returns True if exercise has at least one set
 */
export const hasValidSets = (exercise: WorkoutExercise): boolean => {
  return getSafeSetsCount(exercise) > 0;
};

/**
 * Validate exercise data and fix common issues
 * @param exercise - The workout exercise to validate
 * @returns Validated exercise with safe defaults
 */
export const validateExercise = (
  exercise: WorkoutExercise
): WorkoutExercise => {
  if (!exercise) {
    logger.error(
      "workoutSafetyUtils",
      "validateExercise called with undefined exercise"
    );
    throw new Error("Exercise cannot be undefined");
  }

  return {
    ...exercise,
    sets: exercise.sets || [],
    category: exercise.category || "כללי",
    primaryMuscles: exercise.primaryMuscles || ["כללי"],
    equipment: exercise.equipment || "bodyweight",
    restTime: exercise.restTime || 60,
  };
};

/**
 * Validate array of exercises
 * @param exercises - Array of workout exercises
 * @returns Validated exercises array
 */
export const validateExercises = (
  exercises: WorkoutExercise[]
): WorkoutExercise[] => {
  if (!Array.isArray(exercises)) {
    logger.error(
      "workoutSafetyUtils",
      "validateExercises called with non-array",
      { exercises }
    );
    return [];
  }

  return exercises.map(validateExercise);
};
