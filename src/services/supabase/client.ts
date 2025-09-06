// Supabase client configuration
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || "";
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

export const hasSupabaseConfig: boolean = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const getSupabaseProjectUrl = (): string | null =>
  hasSupabaseConfig ? SUPABASE_URL : null;

export const isSupabaseReady = (): boolean => supabase !== null;
