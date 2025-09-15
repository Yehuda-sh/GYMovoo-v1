/**
 * @file src/services/supabase/client.ts
 * @description Supabase client configuration and initialization
 * @brief מנהל חיבור ותצורה לSupabase - Database client setup
 *
 * Provides centralized Supabase client with proper configuration for:
 * - Authentication with session persistence
 * - Environment-based initialization
 * - Null-safe client access
 * - Development environment support
 */

// Supabase client configuration
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || "";
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

/**
 * Check if Supabase configuration is available
 */
export const hasSupabaseConfig: boolean = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);

/**
 * Supabase client instance - null if config missing
 */
export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false, // Mobile app doesn't need URL session detection
      },
    })
  : null;
