/**
 * @file src/services/supabase/storage.ts
 * @brief Supabase storage URL utilities and helpers
 * @description Storage URL helper – Supabase only (cleaned: no EXPO_PUBLIC_STORAGE_BASE_URL).
 *              Provides public storage URL generation for accessing uploaded files
 *              and media assets through Supabase's storage API.
 *
 * @features
 * - Public URL generation for files and media
 * - User-specific file URL building
 * - Exercise and workout file URL helpers
 * - URL validation and path extraction
 * - Comprehensive error handling and logging
 *
 * @status ACTIVE - Storage utilities for public file access
 * @updated 2025-09-01 - Enhanced error handling, validation, and additional utility functions
 */
import { getSupabaseProjectUrl, hasSupabaseConfig } from "./client";

// =======================================
// 🗄️ Storage URL Utilities
// כלי עזר ל-URL של אחסון
// =======================================

/**
 * Validates bucket name format
 * @param bucket - Bucket name to validate
 * @returns True if bucket name is valid
 */
const isValidBucketName = (bucket: string): boolean => {
  // Bucket names should be alphanumeric with hyphens and underscores
  return (
    /^[a-zA-Z0-9_-]+$/.test(bucket) && bucket.length > 0 && bucket.length <= 63
  );
};

/**
 * Validates file path format
 * @param path - File path to validate
 * @returns True if file path is valid
 */
const isValidFilePath = (path: string): boolean => {
  // Basic path validation - no dangerous characters
  return !/[<>:"|?*]/.test(path) && path.length > 0 && path.length <= 1024;
};

/**
 * Returns public base URL for files (Supabase public storage only)
 * @param bucket - Storage bucket name (default: "public")
 * @returns Base URL string or null if not configured or invalid
 */
export function getPublicStorageBaseUrl(
  bucket: string = "public"
): string | null {
  // אם יש קונפיג של Supabase – בנה URL ציבורי לבאקט
  if (!hasSupabaseConfig) {
    if (__DEV__) {
      console.warn("⚠️ Supabase not configured - cannot generate storage URLs");
    }
    return null;
  }

  if (!isValidBucketName(bucket)) {
    console.error(`❌ Invalid bucket name: ${bucket}`);
    return null;
  }

  const url = getSupabaseProjectUrl();
  if (!url) {
    console.error("❌ Failed to get Supabase project URL");
    return null;
  }

  return `${url.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}`;
}

/**
 * Builds complete public URL for a file based on base URL
 * @param path - File path within the bucket
 * @param bucket - Storage bucket name (default: "public")
 * @returns Complete public URL or null if base URL unavailable or invalid inputs
 */
export function buildPublicUrl(
  path: string,
  bucket: string = "public"
): string | null {
  if (!path || typeof path !== "string") {
    console.error("❌ Invalid file path provided");
    return null;
  }

  if (!isValidFilePath(path)) {
    console.error(`❌ Invalid file path format: ${path}`);
    return null;
  }

  const base = getPublicStorageBaseUrl(bucket);
  if (!base) {
    console.error("❌ Failed to get storage base URL");
    return null;
  }

  const clean = path.replace(/^\/+/, "");
  const fullUrl = `${base}/${clean}`;

  // Validate final URL format
  try {
    new URL(fullUrl);
    return fullUrl;
  } catch {
    console.error(`❌ Generated invalid URL: ${fullUrl}`);
    return null;
  }
}

/**
 * Builds URL for a user-specific file
 * @param userId - User ID
 * @param fileName - File name
 * @param bucket - Storage bucket name (default: "public")
 * @returns Complete public URL or null if invalid
 */
export function buildUserFileUrl(
  userId: string,
  fileName: string,
  bucket: string = "public"
): string | null {
  if (!userId || !fileName) {
    console.error("❌ User ID and file name are required");
    return null;
  }

  const userPath = `users/${userId}/${fileName}`;
  return buildPublicUrl(userPath, bucket);
}

/**
 * Builds URL for an exercise-related file
 * @param exerciseId - Exercise ID
 * @param fileName - File name
 * @param bucket - Storage bucket name (default: "public")
 * @returns Complete public URL or null if invalid
 */
export function buildExerciseFileUrl(
  exerciseId: string,
  fileName: string,
  bucket: string = "public"
): string | null {
  if (!exerciseId || !fileName) {
    console.error("❌ Exercise ID and file name are required");
    return null;
  }

  const exercisePath = `exercises/${exerciseId}/${fileName}`;
  return buildPublicUrl(exercisePath, bucket);
}

/**
 * Builds URL for a workout-related file
 * @param workoutId - Workout ID
 * @param fileName - File name
 * @param bucket - Storage bucket name (default: "public")
 * @returns Complete public URL or null if invalid
 */
export function buildWorkoutFileUrl(
  workoutId: string,
  fileName: string,
  bucket: string = "public"
): string | null {
  if (!workoutId || !fileName) {
    console.error("❌ Workout ID and file name are required");
    return null;
  }

  const workoutPath = `workouts/${workoutId}/${fileName}`;
  return buildPublicUrl(workoutPath, bucket);
}

/**
 * Extracts file path from a full storage URL
 * @param fullUrl - Full storage URL
 * @returns File path or null if invalid
 */
export function extractFilePath(fullUrl: string): string | null {
  if (!fullUrl || typeof fullUrl !== "string") {
    return null;
  }

  try {
    const url = new URL(fullUrl);
    // Extract path after '/storage/v1/object/public/{bucket}/'
    const pathMatch = url.pathname.match(
      /\/storage\/v1\/object\/public\/[^/]+\/(.+)/
    );
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}

/**
 * Checks if a URL is a valid Supabase storage URL
 * @param url - URL to check
 * @returns True if URL is a valid Supabase storage URL
 */
export function isSupabaseStorageUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.pathname.includes("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
