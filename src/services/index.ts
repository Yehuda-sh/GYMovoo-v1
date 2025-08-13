/**
 * @file src/services/index.ts
 * @brief ייצוא מרכזי לכל השירותים - Services Export Hub
 * @description Central export point for all GYMovoo services and utilities
 * @status ACTIVE - Critical export hub maintaining all service imports
 * @dependencies All service modules within the services directory
 * @notes מאפשר ייבוא נוח ועקבי של שירותים מחוץ לתיקיה | Enables convenient and consistent service imports
 * @version 2.3.0 - Updated based on systematic service audit (August 2025)
 * @updated 2025-08-11 - Service status audit completed, deprecated services marked
 * @architecture Centralized export hub with singleton pattern for service instances
 * @audit_complete All services reviewed and categorized by usage and status
 */

// =======================================
// 🔐 Authentication Services
// שירותי אימות ואבטחה
// Status: ✅ ACTIVE - Core authentication service with extensive usage
// =======================================
export * from "./authService";

// =======================================
// 🏋️ Core Workout Services
// שירותי אימון ליבה
// Status: ✅ ACTIVE - Primary workout management services
// =======================================
export * from "./questionnaireService";
export { WorkoutDataService } from "./workoutDataService";

// =======================================
// � API Clients
// לקוחי API (שרת הוא מקור אמת)
// Status: ✅ ACTIVE - Unified baseURL/timeout with Android emulator support
// =======================================
export { userApi } from "./api/userApi";
export { workoutApi } from "./api/workoutApi";

// =======================================
// �🎯 Specialized Workout Services
// שירותי אימון מתמחים
// Status: ✅ ACTIVE - Essential workout tracking and progression
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

// 🔴 Demo services (DEV ONLY)
// 🔴 Demo services הוסרו (2025-08-13 cleanup) - אין יותר ייצואי דמו פעילים

// =======================================
// 🤖 AI and Scientific Services
// שירותי AI ומדע
// Status: ⚠️ ACTIVE but DEPRECATED - Limited usage, experimental features only
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
// Status: ⚠️ ACTIVE but OVERLAPPING - Consider consolidation with workoutDataService
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
  workoutStorageService as WorkoutScreenStorageService, // Renamed to avoid conflicts
} from "../screens/workout/services";

// =======================================
// 🧠 Core Data Manager & Types
// מנהל נתונים מרכזי וטיפוסים
// Status: ✅ ACTIVE - Expose via main services barrel for convenience
// =======================================
export { dataManager } from "./core";
export type { AppDataCache, ServerConfig, DataStatus } from "./core";

// =======================================
// 📊 Service Export Summary
// סיכום ייצוא שירותים
// =======================================
// Total Services: 13 | Core: 3 | Specialized: 3 | AI: 1 (deprecated) | Quick Tools: 1 (overlapping) | Auth: 1 | Logic: 1 | Workout Screen: 5
// Service Status: ✅ Active: 11 | ⚠️ Deprecated: 1 | ⚠️ Overlapping: 1
// Types Exported: 12+ | Service Instances: 8 | Interface Categories: 4
// Architecture: Centralized export hub with categorized organization
// Compatibility: Merged workout screen services, marked deprecated services
// Export Strategy: Explicit exports for services, comprehensive type exports for better IntelliSense
// Exercise Data: Uses local database in src/data/exercises/ with 600+ exercises
// Note: workoutSimulationService available via direct import from "./workoutSimulationService"
// Last Updated: 2025-08-11 - Systematic service audit completed, status annotations added
// Audit Results: All major services reviewed and categorized, improvement recommendations documented
