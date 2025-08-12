/**
 * @file src/utils/index.ts
 * @description נקודת כניסה מרכזית לכלי העזר של GYMovoo
 * English: Central entry point for GYMovoo utility functions
 * @exports Gender adaptation, RTL helpers, Storage management, Workout naming, Workout statistics, Logger
 * @usage import { StorageCleanup, genderAdaptation, calculateWorkoutStats, workoutLogger } from '@/utils'
 *
 * @optimization 2025-08-05:
 * - Added missing exports: workoutStatsCalculator, workoutLogger
 * - Consolidated duplicate functions between workoutHelpers and workoutStatsCalculator
 * - All statistical calculations now centralized in workoutStatsCalculator
 * - Improved import consistency across the project
 */

// =======================================
// 👥 Gender Adaptation Utilities
// כלי התאמת מגדר
// =======================================
export * from "./genderAdaptation";

// =======================================
// 🌐 RTL and Localization Helpers
// עוזרי RTL ולוקליזציה
// =======================================
export * from "./rtlHelpers";

// =======================================
// 💾 Storage Management Utilities
// כלי ניהול אחסון
// =======================================
export * from "./storageCleanup";

// =======================================
// 🏋️ Workout Naming Synchronization
// =======================================
// 🏋️ Workout Helper Functions
// פונקציות עזר לאימון
// Note: workoutNamesSync removed - functionality consolidated in WorkoutPlansScreen
// =======================================
export * from "./workoutHelpers";

// =======================================
// 📊 Workout Statistics Calculator
// מחשבון סטטיסטיקות אימון
// =======================================
export * from "./workoutStatsCalculator";

// =======================================
// 📝 Logger Utilities
// כלי לוגים מאוחדים
// =======================================
export { logger, workoutLogger } from "./logger";

// =======================================
// 💪 Exercise Constants (from constants/)
// קבועי תרגילים (מ-constants/)
// =======================================
// Note: Muscle groups are available in src/constants/exercise.ts and exercisesScreenTexts.ts

// =======================================
// 🧩 Equipment helpers (icons & names)
// עוזרי ציוד (אייקונים ושמות)
// =======================================
export * from "./equipmentIconMapping";
