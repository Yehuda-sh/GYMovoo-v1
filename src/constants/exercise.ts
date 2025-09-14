/**
 * @file src/constants/exercise.ts
 * @description Core exercise constants that are actually used across the application.
 * @notes Removed unused constants: EXERCISE_CATEGORIES, EXERCISE_TYPES, EQUIPMENT_TYPES, TRAINING_GOALS,
 *        REP_RANGES, DURATION_RANGES, REST_TIMES, INTENSITY_LEVELS, WORKOUT_FREQUENCIES,
 *        PROGRESSION_PATTERNS, EQUIPMENT_AVAILABILITY - these were not used anywhere in the codebase.
 * @features Only essential constants: MUSCLE_GROUPS, DIFFICULTY_LEVELS with related utilities.
 */

// Canonical muscle groups - used by workoutDataService and exerciseFilters
export const MUSCLE_GROUPS = [
  "shoulders",
  "chest",
  "back",
  "biceps",
  "triceps",
  "forearms",
  "core",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "hips",
  "neck",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

// Difficulty levels - used by exerciseFilters
export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export type ExerciseDifficulty = (typeof DIFFICULTY_LEVELS)[number];

// Utility functions that are actually needed
export const isValidMuscleGroup = (muscle: string): muscle is MuscleGroup => {
  return MUSCLE_GROUPS.includes(muscle as MuscleGroup);
};

export const isValidDifficultyLevel = (
  level: string
): level is ExerciseDifficulty => {
  return DIFFICULTY_LEVELS.includes(level as ExerciseDifficulty);
};
