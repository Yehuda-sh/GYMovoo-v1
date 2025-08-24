/**
 * @file src/services/supabase/storage.ts
 * @brief Supabase storage URL utilities and helpers
 * @description Storage URL helper – Supabase only (cleaned: no EXPO_PUBLIC_STORAGE_BASE_URL).
 *              Provides public storage URL generation for accessing uploaded files
 *              and media assets through Supabase's storage API.
 * @status ACTIVE - Storage utilities for public file access
 * @updated 2025-08-25 - Enhanced documentation and type safety improvements
 */
import { getSupabaseProjectUrl, hasSupabaseConfig } from "./client";

// =======================================
// 🗄️ Storage URL Utilities
// כלי עזר ל-URL של אחסון
// =======================================

/**
 * Returns public base URL for files (Supabase public storage only)
 * @param bucket - Storage bucket name (default: "public")
 * @returns Base URL string or null if not configured
 */
export function getPublicStorageBaseUrl(
  bucket: string = "public"
): string | null {
  // אם יש קונפיג של Supabase – בנה URL ציבורי לבאקט
  if (hasSupabaseConfig) {
    const url = getSupabaseProjectUrl();
    if (url) {
      return `${url.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}`;
    }
  }
  return null;
}

/**
 * Builds complete public URL for a file based on base URL
 * @param path - File path within the bucket
 * @param bucket - Storage bucket name (default: "public")
 * @returns Complete public URL or null if base URL unavailable
 */
export function buildPublicUrl(
  path: string,
  bucket: string = "public"
): string | null {
  const base = getPublicStorageBaseUrl(bucket);
  if (!base) return null;

  const clean = path.replace(/^\/+/, "");
  return `${base}/${clean}`;
}
