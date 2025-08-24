/**
 * @file src/services/supabase/client.ts
 * @brief Supabase client configuration and initialization
 * @description Optional Supabase client – loaded only if appropriate ENV variables are configured.
 *              Does not replace existing API; intended primarily for Storage/Edge functions.
 *              Provides secure client-side access with anonymous key and session management.
 * @status ACTIVE - Core database client for authentication and storage operations
 * @updated 2025-08-25 - Enhanced documentation and modernized configuration patterns
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// =======================================
// 🔧 Configuration Constants
// קבועי תצורה
// =======================================

// תמיכה בכמה שמות ENV ובברירת מחדל ל-URL שסיפקת (לא סודי)
const SUPABASE_URL: string = (
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://nyfvsmateipdmpshllsd.supabase.co"
).trim();

// מפתח אנונימי בלבד בצד לקוח. אל תשתמש ב-Service Role כאן.
const SUPABASE_ANON_KEY: string = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  ""
).trim();

// =======================================
// 🔍 Configuration Validation
// אימות תצורה
// =======================================

export const hasSupabaseConfig: boolean = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);

// =======================================
// 🚀 Client Initialization
// איתחול לקוח
// =======================================

// ב-React Native אין צורך בהגדרות מיוחדות ל-basic שימושים.
export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// =======================================
// 🔗 Utility Functions
// פונקציות עזר
// =======================================

/**
 * Gets the Supabase project URL if configuration is available
 * @returns Project URL string or null if not configured
 */
export const getSupabaseProjectUrl = (): string | null =>
  hasSupabaseConfig ? SUPABASE_URL : null;
