/**
 * @file src/services/index.ts
 * @brief ייצוא מרכזי לכל השירותים - Services Export Hub
 * @description Central export point for all GYMovoo services and utilities
 * @dependencies All service modules within the services directory
 * @notes מאפשר ייבוא נוח ועקבי של שירותים מחוץ לתיקיה | Enables convenient and consistent service imports
 * @version 2.2.0 - Updated service count, removed duplications, improved organization
 * @updated 2025-08-06 - Fixed TypeScript issues, removed duplicated services, enhanced consistency
 * @architecture Centralized export hub with singleton pattern for service instances
 */

// =======================================
// 🔐 Authentication Services
// שירותי אימות ואבטחה
// =======================================
export * from "./authService";

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

// Note: workoutSimulationService can be imported directly from "./workoutSimulationService"
// export { default as workoutSimulationService } from "./workoutSimulationService";

export { nextWorkoutLogicService } from "./nextWorkoutLogicService";
export type {
  WorkoutCycleState,
  NextWorkoutRecommendation,
} from "./nextWorkoutLogicService";

export { realisticDemoService } from "./realisticDemoService";

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

// =======================================
// 🎯 Workout Screen Services (Legacy)
// שירותי מסך אימון (תמיכה בגרסה קודמת)
// =======================================
// Note: These services are also available in src/screens/workout/services
// הערה: שירותים אלו זמינים גם ב-src/screens/workout/services
export {
  autoSaveService,
  workoutValidationService,
  workoutErrorHandlingService,
  workoutFeedbackService,
  workoutDataService as WorkoutScreenDataService, // Renamed to avoid conflicts
} from "../screens/workout/services";

// =======================================
// 📊 Service Export Summary
// סיכום ייצוא שירותים
// =======================================
// Total Services: 13 | Core: 3 | Specialized: 3 | AI: 1 | Quick Tools: 1 | Auth: 1 | Logic: 1 | Workout Screen: 5
// Types Exported: 12+ | Service Instances: 8 | Interface Categories: 4
// Architecture: Centralized export hub with categorized organization
// Compatibility: Merged workout screen services, removed duplications
// Export Strategy: Explicit exports for services, comprehensive type exports for better IntelliSense
// Exercise Data: Uses local database in src/data/exercises/ with 600+ exercises
// Note: workoutSimulationService available via direct import from "./workoutSimulationService"
// Last Updated: 2025-08-06 - Fixed duplications, enhanced TypeScript compatibility, improved service organization
