/**
 * @file src/utils/workoutSafetyUtils.ts
 * @description Safe workout data handling utilities
 */

import {
  WorkoutExercise,
  Set as WorkoutSet,
} from "../screens/workout/types/workout.types";
import { logger } from "./logger";

/**
 * Safely get sets from exercise with fallback to empty array
 */
export const getSafeSets = (exercise?: WorkoutExercise): WorkoutSet[] => {
  return exercise?.sets || [];
};

/**
 * Check if exercise has valid sets
 */
export const hasValidSets = (exercise?: WorkoutExercise): boolean => {
  return getSafeSets(exercise).length > 0;
};

/**
 * Validate exercise data with safe defaults
 */
export const validateExercise = (
  exercise: WorkoutExercise
): WorkoutExercise => {
  if (!exercise) {
    logger.error("workoutSafetyUtils", "Exercise cannot be undefined");
    throw new Error("Exercise cannot be undefined");
  }

  // Return validated exercise with defaults
  return {
    ...exercise,
    sets: exercise.sets || [],
    category: exercise.category || "general",
    primaryMuscles: exercise.primaryMuscles || ["general"],
    equipment: exercise.equipment || "bodyweight",
    restTime: exercise.restTime || 60,
  };
};

/**
 * Validate array of exercises
 */
export const validateExercises = (
  exercises: WorkoutExercise[]
): WorkoutExercise[] => {
  if (!Array.isArray(exercises)) {
    logger.error("workoutSafetyUtils", "Expected array of exercises");
    return [];
  }

  return exercises.map(validateExercise);
};
