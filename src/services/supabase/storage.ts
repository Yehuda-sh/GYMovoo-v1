// Supabase storage URL utilities
import { getSupabaseProjectUrl, hasSupabaseConfig } from "./client";

export function getPublicStorageBaseUrl(
  bucket: string = "public"
): string | null {
  if (!hasSupabaseConfig) return null;

  const url = getSupabaseProjectUrl();
  if (!url) return null;

  return `${url.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}`;
}

export function buildPublicUrl(
  path: string,
  bucket: string = "public"
): string | null {
  if (!path) return null;

  const base = getPublicStorageBaseUrl(bucket);
  if (!base) return null;

  const clean = path.replace(/^\/+/, "");
  return `${base}/${clean}`;
}

export function buildUserFileUrl(
  userId: string,
  fileName: string,
  bucket: string = "public"
): string | null {
  if (!userId || !fileName) return null;
  return buildPublicUrl(`users/${userId}/${fileName}`, bucket);
}

export function buildExerciseFileUrl(
  exerciseId: string,
  fileName: string,
  bucket: string = "public"
): string | null {
  if (!exerciseId || !fileName) return null;
  return buildPublicUrl(`exercises/${exerciseId}/${fileName}`, bucket);
}

export function buildWorkoutFileUrl(
  workoutId: string,
  fileName: string,
  bucket: string = "public"
): string | null {
  if (!workoutId || !fileName) return null;
  return buildPublicUrl(`workouts/${workoutId}/${fileName}`, bucket);
}

export function extractFilePath(fullUrl: string): string | null {
  if (!fullUrl) return null;

  try {
    const url = new URL(fullUrl);
    const pathMatch = url.pathname.match(
      /\/storage\/v1\/object\/public\/[^/]+\/(.+)/
    );
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}

export function isSupabaseStorageUrl(url: string): boolean {
  if (!url) return false;

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
