/**
 * @file src/services/index.ts
 * @brief ייצוא מרכזי לכל השירותים - Services Export Hub
 * @description Central export point for all GYMovoo services and utilities.
 *              Provides unified access to authentication, workout, data management,
 *              and specialized services throughout the application.
 * @status ACTIVE - Critical export hub maintaining all service imports
 * @updated 2025-09-01 - Added userOnboardingService export, updated documentation
 */

// =======================================
// 🔐 Authentication Services
// שירותי אימות ואבטחה
// =======================================
export * from "./authService";
export { isQuickLoginAvailable, tryQuickLogin } from "./auth/quickLoginService";

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
export { personalRecordService } from "./workout/personalRecordService";
export { progressiveOverloadService } from "./workout/ProgressiveOverloadService";

// =======================================
// 💾 Data Services
// שירותי נתונים
// =======================================
export { localDataService } from "./localDataService";

// =======================================
// 🔌 Database & Storage Services
// שירותי בסיס נתונים ואחסון
// =======================================
export {
  supabase,
  hasSupabaseConfig,
  getSupabaseProjectUrl,
  getPublicStorageBaseUrl,
  buildPublicUrl,
} from "./supabase";
export type { SupabaseClient } from "./supabase";

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
// 🚀 User Onboarding Services
// שירותי הקמת משתמשים
// =======================================
export { completeUserOnboarding } from "./userOnboardingService";
export type { UserOnboardingResult } from "./userOnboardingService";

// =======================================
// 🌟 Service Summary
// סיכום שירותים
// =======================================
// Demo services are now integrated in UnifiedQuestionnaireManager
// and userStore customDemoUser functions - no separate service needed
// Total Active Services: 18 | All deprecated/missing services removed
// Last validated: 2025-09-01 | Core services fully modernized and complete
// Added: QuickLogin authentication + Supabase storage + PersonalRecord analytics + ProgressiveOverloadService + UserOnboardingService
