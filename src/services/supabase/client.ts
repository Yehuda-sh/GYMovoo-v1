/**
 * @file src/services/supabase/client.ts
 * @brief Supabase client configuration and initialization
 * @description Optional Supabase client – loaded only if appropriate ENV variables are configured.
 *              Does not replace existing API; intended primarily for Storage/Edge functions.
 *              Provides secure client-side access with anonymous key and session management.
 *
 * @security WARNING: Only use anonymous keys in client-side code. Never expose service role keys.
 * @env EXPO_PUBLIC_SUPABASE_URL - Supabase project URL (public)
 * @env EXPO_PUBLIC_SUPABASE_ANON_KEY - Supabase anonymous key (public)
 *
 * @status ACTIVE - Core database client for authentication and storage operations
 * @updated 2025-09-01 - Enhanced error handling, validation, and security improvements
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

/**
 * Validates Supabase URL format
 * Ensures URL is a valid HTTPS Supabase URL
 */
const isValidSupabaseUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname.includes("supabase.co")
    );
  } catch {
    return false;
  }
};

/**
 * Validates Supabase anonymous key format
 * Checks for JWT-like format and reasonable length
 */
const isValidSupabaseKey = (key: string): boolean => {
  // Supabase anon keys typically start with 'eyJ' (JWT format) and are quite long
  return key.length > 100 && key.startsWith("eyJ");
};

export const hasSupabaseConfig: boolean = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    isValidSupabaseUrl(SUPABASE_URL) &&
    isValidSupabaseKey(SUPABASE_ANON_KEY)
);

// =======================================
// 🚀 Client Initialization
// איתחול לקוח
// =======================================

// ב-React Native אין צורך בהגדרות מיוחדות ל-basic שימושים.
export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? (() => {
      try {
        const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false, // Disable for React Native
          },
        });

        // Log successful initialization in development
        if (__DEV__) {
          console.warn("✅ Supabase client initialized successfully");
        }

        return client;
      } catch (error) {
        console.error("❌ Failed to initialize Supabase client:", error);
        return null;
      }
    })()
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

/**
 * Gets the Supabase project reference (the part before .supabase.co)
 * @returns Project reference string or null if not configured
 */
export const getSupabaseProjectRef = (): string | null => {
  if (!hasSupabaseConfig) return null;
  try {
    const url = new URL(SUPABASE_URL);
    return url.hostname.split(".")[0];
  } catch {
    return null;
  }
};

/**
 * Checks if Supabase is properly configured and ready to use
 * @returns Boolean indicating if Supabase is ready
 */
export const isSupabaseReady = (): boolean => {
  return supabase !== null && hasSupabaseConfig;
};

/**
 * Gets configuration status for debugging
 * @returns Object with configuration details
 */
export const getSupabaseConfigStatus = () => ({
  hasConfig: hasSupabaseConfig,
  hasClient: supabase !== null,
  isReady: isSupabaseReady(),
  projectUrl: getSupabaseProjectUrl(),
  projectRef: getSupabaseProjectRef(),
  urlValid: isValidSupabaseUrl(SUPABASE_URL),
  keyValid: isValidSupabaseKey(SUPABASE_ANON_KEY),
});
