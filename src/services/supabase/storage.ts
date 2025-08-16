/**
 * Storage URL helper – Supabase בלבד (ניקוי: ללא EXPO_PUBLIC_STORAGE_BASE_URL).
 */
import { getSupabaseProjectUrl, hasSupabaseConfig } from "./client";

/**
 * מחזיר base URL ציבורי לקבצים (רק Supabase public storage).
 */
export function getPublicStorageBaseUrl(bucket = "public"): string | null {
  // אם יש קונפיג של Supabase – בנה URL ציבורי לבאקט
  if (hasSupabaseConfig) {
    const url = getSupabaseProjectUrl();
    if (url)
      return `${url.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}`;
  }
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
