/**
 * @file src/services/supabase/index.ts
 * @brief Supabase services export hub
 * @description Central export point for Supabase-related services and utilities.
 *
 * @status ACTIVE - Core Supabase service exports
 */

// =======================================
// 🔌 Core Client & Configuration
// =======================================
export {
  supabase,
  hasSupabaseConfig,
  getSupabaseProjectUrl,
  isSupabaseReady,
} from "./client";

// =======================================
// 🗄️ Storage Services
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
// 📝 Type Exports
// =======================================
export type { SupabaseClient } from "@supabase/supabase-js";
