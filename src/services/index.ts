/**
 * @file src/services/index.ts
 * @brief ייצוא מרכזי לכל השירותים - Services Export Hub
 * @description Central export point for all GYMovoo services and utilities
 * @status ACTIVE - Critical export hub maintaining all service imports
 * @updated 2025-08-15 - Cleaned up deprecated and missing services after demo user validation
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
export * from "./questionnaireService";
export { WorkoutDataService } from "./workoutDataService";
export { nextWorkoutLogicService } from "./nextWorkoutLogicService";
export type {
  WorkoutCycleState,
  NextWorkoutRecommendation,
} from "./nextWorkoutLogicService";

// =======================================
// 📊 API Clients
// לקוחי API
// =======================================
export { userApi } from "./api/userApi";
export { workoutApi } from "./api/workoutApi";

// =======================================
// 🎯 Specialized Workout Services
// שירותי אימון מתמחים
// =======================================
export { workoutFacadeService } from "./workout/workoutFacadeService";

// =======================================
// 💾 Data Services
// שירותי נתונים
// =======================================
export { localDataService } from "./localDataService";

// =======================================
// 🧠 Core Data Manager & Types
// מנהל נתונים מרכזי וטיפוסים
// =======================================
export { dataManager } from "./core";
export type { AppDataCache, ServerConfig, DataStatus } from "./core";

// =======================================
// 🎯 Workout Screen Services
// שירותי מסך אימון
// =======================================
export {
  autoSaveService,
  workoutValidationService,
  workoutErrorHandlingService,
  workoutFeedbackService,
} from "../screens/workout/services";

// =======================================
// � Service Summary
// סיכום שירותים
// =======================================
// Demo services are now integrated in UnifiedQuestionnaireManager
// and userStore customDemoUser functions - no separate service needed
// Total Active Services: 11 | All deprecated/missing services removed
