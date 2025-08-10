/**
 * @file src/hooks/index.ts
 * @description Central export hub for all hooks
 * @description מרכז ייצוא לכל ה-hooks
 */

// Smart hooks for workout management
export { useNextWorkout } from "./useNextWorkout";
export { usePreviousPerformance } from "./usePreviousPerformance";

// Advanced user preferences with smart algorithms
export { useUserPreferences } from "./useUserPreferences";

// Helper functions for user preferences
export * from "./userPreferencesHelpers";

// Types from individual hooks
export type { UseNextWorkoutReturn } from "./useNextWorkout";
export type {
  SmartPreviousPerformance,
  UsePreviousPerformanceReturn,
} from "./usePreviousPerformance";
export type {
  SmartUserPreferences,
  UseUserPreferencesReturn,
} from "./useUserPreferences";
