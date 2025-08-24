/**
 * @file src/services/supabase/index.ts
 * @brief Supabase services export hub
 * @description Central export point for all Supabase-related services and utilities.
 *              Provides unified access to client configuration, storage utilities,
 *              and authentication helpers throughout the application.
 * @status ACTIVE - Core Supabase service exports
 * @updated 2025-08-25 - Initial creation for better service organization
 */

// =======================================
// 🔌 Core Client & Configuration
// לקוח ליבה ותצורה
// =======================================
export { supabase, hasSupabaseConfig, getSupabaseProjectUrl } from "./client";

// =======================================
// 🗄️ Storage Services
// שירותי אחסון
// =======================================
export { getPublicStorageBaseUrl, buildPublicUrl } from "./storage";

// =======================================
// 📝 Type Exports
// ייצוא טיפוסים
// =======================================
export type { SupabaseClient } from "@supabase/supabase-js";
