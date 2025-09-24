/**
 * ייצוא מרכזי של כל הטיפוסים
 * @file src/core/types/index.ts
 */

// ייצוא טיפוסים של משתמש (type-only)
export type * from "./user.types";

// ייצוא סלקטיבי מטיפוסי אימון (type-only + אליאס ל-Set)
export type {
  WorkoutExercise,
  WorkoutData,
  Set as ExerciseSet, // ← אליאס כדי להימנע מבלבול עם Set המובנה
  ProgressData,
  PerformanceData,
  WorkoutStatistics,
  WorkoutWithFeedback,
  WorkoutFeedback,
  WorkoutStats,
  PreviousPerformance,
  WorkoutPlan, // ← חדש: מרכזים את התוכנית מכאן
  WorkoutSummary, // ← חדש: סיכום אימון שכיח לשימוש במסכים
  ISODateString,
} from "./workout.types";
