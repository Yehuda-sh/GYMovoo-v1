/**
 * @file src/services/supabase/client.ts
 * @brief Supabase client configuration and initialization
 * @description Simple Supabase client configuration for storage and authentication
 *
 * @security WARNING: Only use anonymous keys in client-side code. Never expose service role keys.
 * @env EXPO_PUBLIC_SUPABASE_URL - Supabase project URL (required)
 * @env EXPO_PUBLIC_SUPABASE_ANON_KEY - Supabase anonymous key (required)
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// =======================================
// 🔧 Configuration
// =======================================

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || "";
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

// Check if we have the required configuration
export const hasSupabaseConfig: boolean = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);

// =======================================
// 🚀 Client Initialization
// =======================================

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
// =======================================

/**
 * Gets the Supabase project URL if configuration is available
 */
export const getSupabaseProjectUrl = (): string | null =>
  hasSupabaseConfig ? SUPABASE_URL : null;

/**
 * Checks if Supabase is properly configured and ready to use
 */
export const isSupabaseReady = (): boolean => {
  return supabase !== null && hasSupabaseConfig;
};
