/**
 * @file src/services/supabase/index.ts
 * @brief Supabase services export hub
 * @description Central export point for all Supabase-related services and utilities.
 *              Provides unified access to client configuration, storage utilities,
 *              and authentication helpers throughout the application.
 *
 * @exports Client Functions:
 * - supabase: Main Supabase client instance
 * - hasSupabaseConfig: Check if Supabase is properly configured
 * - getSupabaseProjectUrl: Get project URL
 * - getSupabaseProjectRef: Get project reference ID
 * - isSupabaseReady: Check if client is ready to use
 * - getSupabaseConfigStatus: Get detailed configuration status
 *
 * @exports Storage Functions:
 * - getPublicStorageBaseUrl: Get base URL for storage bucket
 * - buildPublicUrl: Build complete public URL for file
 * - buildUserFileUrl: Build URL for user-specific files
 * - buildExerciseFileUrl: Build URL for exercise files
 * - buildWorkoutFileUrl: Build URL for workout files
 * - extractFilePath: Extract file path from full URL
 * - isSupabaseStorageUrl: Validate Supabase storage URL
 *
 * @status ACTIVE - Core Supabase service exports
 * @updated 2025-09-01 - Updated exports to include all new utility functions and improved organization
 */

// =======================================
// 🔌 Core Client & Configuration
// לקוח ליבה ותצורה
// =======================================
export {
  supabase,
  hasSupabaseConfig,
  getSupabaseProjectUrl,
  getSupabaseProjectRef,
  isSupabaseReady,
  getSupabaseConfigStatus,
} from "./client";

// =======================================
// 🗄️ Storage Services
// שירותי אחסון
// =======================================
export {
  getPublicStorageBaseUrl,
  buildPublicUrl,
  buildUserFileUrl,
  buildExerciseFileUrl,
  buildWorkoutFileUrl,
  extractFilePath,
  isSupabaseStorageUrl,
} from "./storage";

// =======================================
// � Authentication Services (Future)
// שירותי אימות (עתידי)
// =======================================
// export { ... } from "./auth"; // Future authentication helpers

// =======================================
// 📊 Database Services (Future)
// שירותי מסד נתונים (עתידי)
// =======================================
// export { ... } from "./database"; // Future database helpers

// =======================================
// �📝 Type Exports
// ייצוא טיפוסים
// =======================================
export type { SupabaseClient } from "@supabase/supabase-js";
