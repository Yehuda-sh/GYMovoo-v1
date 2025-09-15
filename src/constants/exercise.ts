/**
 * @file exercise.ts
 * @description Core exercise constants used across the application.
 * @notes Essential constants: MUSCLE_GROUPS, DIFFICULTY_LEVELS with types.
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
