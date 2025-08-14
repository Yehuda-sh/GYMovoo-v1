/**
 * Supabase client (אופציונלי) – נטען רק אם הוגדרו ENV מתאימים.
 * לא מחליף את ה-API הקיים; מיועד בעיקר ל-Storage/Edge.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// תמיכה בכמה שמות ENV ובברירת מחדל ל-URL שסיפקת (לא סודי)
const SUPABASE_URL = (
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://nyfvsmateipdmpshllsd.supabase.co"
).trim();

// מפתח אנונימי בלבד בצד לקוח. אל תשתמש ב-Service Role כאן.
const SUPABASE_ANON_KEY = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  ""
).trim();

export const hasSupabaseConfig: boolean = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);

// ב-React Native אין צורך בהגדרות מיוחדות ל-basic שימושים.
export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

export const getSupabaseProjectUrl = (): string | null =>
  hasSupabaseConfig ? SUPABASE_URL : null;
