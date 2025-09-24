/**
 * @file src/services/supabase/client.ts
 * @description Supabase client configuration and initialization (Expo-ready)
 * @brief מנהל חיבור ותצורה ל-Supabase עם שמירת סשן ו־null-safety
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Read env from Expo (EAS) */
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? "";
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/** Quick validation (basic) */
const isValidUrl = (u: string) => {
  try {
    const url = new URL(u);
    return (
      /^https?:$/.test(url.protocol) &&
      /supabase\.co$|supabase\.in$/.test(url.hostname)
    );
  } catch {
    return false;
  }
};

const hasUrl = SUPABASE_URL.length > 0 && isValidUrl(SUPABASE_URL);
const hasKey = SUPABASE_ANON_KEY.length > 0;

/** Export a boolean flag for feature-gating */
export const hasSupabaseConfig: boolean = hasUrl && hasKey;

/**
 * Single, centralized Supabase client instance.
 * Will be `null` when env vars are missing/invalid (safe to import everywhere).
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

/**
 * Optional strict accessor:
 * Call when you *must* have a live client (e.g., inside API services).
 * Throws a clear error if the client is unavailable.
 */
export const getSupabaseOrThrow = (): SupabaseClient => {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }
  return supabase;
};

/**
 * Soft status helper for diagnostics / health checks.
 */
export const supabaseHealth = () =>
  hasSupabaseConfig ? ("ok" as const) : ("missing_config" as const);
