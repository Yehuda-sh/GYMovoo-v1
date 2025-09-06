// Supabase services export hub
export {
  supabase,
  hasSupabaseConfig,
  getSupabaseProjectUrl,
  isSupabaseReady,
} from "./client";

export {
  getPublicStorageBaseUrl,
  buildPublicUrl,
  buildUserFileUrl,
  buildExerciseFileUrl,
  buildWorkoutFileUrl,
  extractFilePath,
  isSupabaseStorageUrl,
} from "./storage";

export type { SupabaseClient } from "@supabase/supabase-js";
