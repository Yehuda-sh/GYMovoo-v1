/**
 * Storage URL helper – שומר על חוזה קיים עם EXPO_PUBLIC_STORAGE_BASE_URL.
 * אם הוגדר Supabase, מחזיר base ציבורי ל-bucket ייעודי (למשל "public/videos").
 */
import { getSupabaseProjectUrl, hasSupabaseConfig } from "./client";

/**
 * מחזיר base URL ציבורי לקבצים
 * קדימות:
 * 1) EXPO_PUBLIC_STORAGE_BASE_URL (כפי שנקבע במסמכים)
 * 2) Supabase public storage: {SUPABASE_URL}/storage/v1/object/public/{bucket}
 */
export function getPublicStorageBaseUrl(bucket = "public"): string | null {
  const explicit = (process.env.EXPO_PUBLIC_STORAGE_BASE_URL || "").trim();

  // אם ההגדרה המפורשת מצביעה כבר ל-Supabase Storage – השתמש בה
  // זיהוי מפורש של Supabase (לא בשימוש כרגע – הלוגיקה מעדיפה Supabase בכל מקרה כאשר מוגדר)

  // אם יש קונפיג של Supabase – העדף את בסיס האחסון של Supabase עבור קבצים ציבוריים
  if (hasSupabaseConfig) {
    const url = getSupabaseProjectUrl();
    if (url)
      return `${url.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}`;
  }

  // ללא Supabase – חזור ל-explicit אם קיים (עלול להיות שרת מקומי שמגיש קבצים)
  if (explicit) return explicit.replace(/\/+$/, "");

  return null;
}

/**
 * בונה URL ציבורי מלא לקובץ לפי base.
 */
export function buildPublicUrl(path: string, bucket = "public"): string | null {
  const base = getPublicStorageBaseUrl(bucket);
  if (!base) return null;
  const clean = path.replace(/^\/+/, "");
  return `${base}/${clean}`;
}
