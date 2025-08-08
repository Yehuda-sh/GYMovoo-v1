/**
 * @file src/constants/exercise.ts
 * @description Centralized exercise domain constants (muscles, categories, difficulty levels).
 * Keeps string literals DRY and aligned across data + validation scripts.
 */

export const EXERCISE_CATEGORIES = [
  "strength",
  "cardio",
  "flexibility",
  "core",
] as const;
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export type ExerciseDifficulty = (typeof DIFFICULTY_LEVELS)[number];

// Canonical muscle groups (expandable). Keep lowercase; UI layer handles localization.
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

// Utility guards (runtime safety for dynamic inputs)
export function isExerciseCategory(v: string): v is ExerciseCategory {
  return (EXERCISE_CATEGORIES as readonly string[]).includes(v);
}
export function isDifficulty(v: string): v is ExerciseDifficulty {
  return (DIFFICULTY_LEVELS as readonly string[]).includes(v);
}
export function isMuscleGroup(v: string): v is MuscleGroup {
  return (MUSCLE_GROUPS as readonly string[]).includes(v);
}
