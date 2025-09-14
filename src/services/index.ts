/**
 * @file src/services/index.ts
 * @brief ייצוא מרכזי לכל השירותים - Services Export Hub
 * @description Central export point for all GYMovoo services and utilities.
 *              Provides unified access to authentication, workout, data management,
 *              and specialized services throughout the application.
 * @status ACTIVE - Critical export hub maintaining all service imports
 * @updated 2025-01-08 - Removed unused userOnboardingService, updated documentation
 */

// =======================================
// 🔐 Authentication Services
// שירותי אימות ואבטחה
// =======================================
// Note: Auth services moved to features/auth/services/
export { isQuickLoginAvailable, tryQuickLogin } from "./auth/quickLoginService";

// =======================================
// 🏋️ Core Workout Services
// שירותי אימון ליבה
// =======================================
export * from "../features/questionnaire/services/questionnaireService";
export { nextWorkoutLogicService } from "../features/workout/services/nextWorkoutLogicService";
export type {
  WorkoutCycleState,
  NextWorkoutRecommendation,
} from "../features/workout/services/nextWorkoutLogicService";

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
export { default as workoutFacadeService } from "./workout/workoutFacadeService";
export { default as personalRecordService } from "../features/workout/services/personalRecordService";

// =======================================
// 💾 Data Services
// שירותי נתונים
// =======================================
// אין localDataService - שירות DEV שהוסר

// =======================================
// 🔌 Database & Storage Services
// שירותי בסיס נתונים ואחסון
// =======================================
export { supabase, hasSupabaseConfig, getSupabaseProjectUrl } from "./supabase";
export type { SupabaseClient } from "./supabase";

// =======================================
// 🧠 Core Data Manager & Types
// מנהל נתונים מרכזי וטיפוסים
// =======================================
export { dataManager } from "./core";
export type { AppDataCache } from "./core";

// =======================================
// 🎯 Workout Screen Services
// שירותי מסך אימון
// =======================================

// =======================================
// 🌟 Service Summary
// סיכום שירותים
// =======================================
// Demo services are now integrated in UnifiedQuestionnaireManager
// and userStore customDemoUser functions - no separate service needed
// Total Active Services: 15 | All deprecated/missing services removed
// Last validated: 2025-01-08 | Core services fully modernized and complete
// Added: QuickLogin authentication + Supabase storage + PersonalRecord analytics
