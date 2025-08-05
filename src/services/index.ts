/**
 * @file src/services/index.ts
 * @brief ייצוא מרכזי לכל השירותים - Services Export Hub
 * @description Central export point for all GYMovoo services and utilities
 * @dependencies All service modules within the services directory
 * @notes מאפשר ייבוא נוח ועקבי של שירותים מחוץ לתיקיה | Enables convenient and consistent service imports
 * @version 2.0.0 - Enhanced organization and type safety
 * @updated 2025-08-05 - Added User type, improved categorization, enhanced documentation
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
export * from "./workoutDataService";

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

export { realisticDemoService } from "./realisticDemoService";
export type {
  WorkoutSession,
  WorkoutExercise,
  RealisticExerciseSet,
  WorkoutFeedback,
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
} from "./scientificAIService";

// =======================================
// 🌐 External API Services
// שירותי API חיצוניים
// =======================================
export { wgerApiService } from "./wgerApiService";
export type { WgerExerciseInfo } from "./wgerApiService";

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
// 📊 Service Export Summary
// סיכום ייצוא שירותים
// =======================================
// Total Services: 8 | Core: 4 | Specialized: 4 | AI: 1 | External API: 1 | Quick Tools: 1
// Types Exported: 12 | Interfaces: 8 | Service Instances: 7
// Architecture: Singleton pattern with centralized export hub
// Compatibility: Full backward compatibility maintained
