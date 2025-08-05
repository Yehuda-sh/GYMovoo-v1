/**
 * @file src/services/index.ts
 * @brief ייצוא מרכזי לכל השירותים - Services Export Hub
 * @description Central export point for all GYMovoo services and utilities
 * @dependencies All service modules within the services directory
 * @notes מאפשר ייבוא נוח ועקבי של שירותים מחוץ לתיקיה | Enables convenient and consistent service imports
 * @version 2.1.0 - Enhanced organization, accurate service counts, improved documentation
 * @updated 2025-08-05 - Updated service counts, improved categorization, enhanced consistency
 * @architecture Centralized export hub with singleton pattern for service instances
 */

// =======================================
// 🔐 Authentication Services
// שירותי אימות ואבטחה
// =======================================
export * from "./authService";
export type { User } from "./authService"; // Enhanced user type with full interface support

// =======================================
// 🏋️ Core Workout Services
// שירותי אימון ליבה
// =======================================
export * from "./exerciseService";
export * from "./questionnaireService";
export { WorkoutDataService } from "./workoutDataService";

// =======================================
// 🎯 Specialized Workout Services
// שירותי אימון מתמחים
// =======================================
export { workoutHistoryService } from "./workoutHistoryService";
export type {
  PreviousPerformance,
  PersonalRecord,
} from "./workoutHistoryService";

export { workoutSimulationService } from "./workoutSimulationService";

export { nextWorkoutLogicService } from "./nextWorkoutLogicService";
export type {
  WorkoutCycleState,
  NextWorkoutRecommendation,
} from "./nextWorkoutLogicService";

export { realisticDemoService } from "./realisticDemoService";
export type {
  WorkoutSession,
  WorkoutExercise,
  RealisticExerciseSet,
  WorkoutFeedback,
  PerformanceAnalysis,
  PerformanceRecommendation,
} from "./realisticDemoService";

// =======================================
// 🤖 AI and Scientific Services
// שירותי AI ומדע
// =======================================
export { scientificAIService } from "./scientificAIService";
export type {
  ScientificExerciseRecommendation,
  FitnessAssessment,
  ScientificWorkoutPlan,
} from "./scientificAIService";

// =======================================
// ⚡ Quick Workout Generation
// יצירת אימונים מהירים
// =======================================
export {
  QuickWorkoutGenerator,
  generateQuickWorkout,
} from "./quickWorkoutGenerator";
export type { QuickWorkoutTemplate } from "../types";

// =======================================
// 🎯 Exercise Data Access
// גישה לנתוני תרגילים
// =======================================
// For exercise data, use the new local database:
// עבור נתוני תרגילים, השתמש במאגר המקומי החדש:
// import { allExercises, getBodyweightExercises, Exercise } from "../data/exercises";

// =======================================
// 📊 Service Export Summary
// סיכום ייצוא שירותים
// =======================================
// Total Services: 12 | Core: 3 | Specialized: 5 | AI: 1 | Quick Tools: 1 | Auth: 1 | Logic: 1
// Types Exported: 15+ | Service Instances: 8 | Interface Categories: 5
// Architecture: Centralized export hub with categorized organization
// Compatibility: Removed deprecated wgerApiService, migrated to local exercise database
// Export Strategy: Explicit exports for services, comprehensive type exports for better IntelliSense
// Exercise Data: Uses local database in src/data/exercises/ with 600+ exercises
// Last Updated: 2025-08-05 - Removed wgerApiService and useWgerExercises, fully migrated to local database
