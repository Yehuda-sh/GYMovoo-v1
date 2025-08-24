/**
 * @file src/services/api/workoutApi.ts
 * @brief CRUD helpers for workout history stored inside users.activityhistory (JSONB) in Supabase.
 * @description All workout history is embedded in the single user row (no separate table).
 *              Read-modify-write operations are performed (not fully concurrent safe).
 *              If race conditions become an issue, consider moving workouts to a dedicated table or using PostgREST RPC with row-level locking.
 * @status ACTIVE - Core workout API
 * @updated 2025-08-25 - Modernized logging and documentation
 */
import type { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { supabase } from "../supabase/client";
import { logger } from "../../utils/logger";

if (!supabase) {
  throw new Error(
    "Supabase client not initialized. Ensure EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY are set."
  );
}

const devLog = (...args: unknown[]) => {
  if (__DEV__) logger.warn("workoutApi", args.map(String).join(" "));
};

type ActivityHistoryRow = {
  activityhistory: WorkoutWithFeedback[] | null;
};

/**
 * Fetch workout history for a user
 * @param userId - User ID
 * @returns Array of WorkoutWithFeedback
 */
async function fetchHistory(userId: string): Promise<WorkoutWithFeedback[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("users")
    .select("activityhistory")
    .eq("id", userId)
    .limit(1)
    .maybeSingle<ActivityHistoryRow>();

  if (error) {
    devLog("fetchHistory error", error.message);
    return [];
  }
  if (!data || !data.activityhistory) return [];
  return Array.isArray(data.activityhistory) ? data.activityhistory : [];
}

/**
 * Save workout history for a user
 * @param userId - User ID
 * @param history - Array of WorkoutWithFeedback
 */
async function saveHistory(
  userId: string,
  history: WorkoutWithFeedback[]
): Promise<void> {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase
    .from("users")
    .update({ activityhistory: history })
    .eq("id", userId);
  if (error) {
    devLog("saveHistory error", error.message);
    throw error;
  }
}

/**
 * API for managing workout history in Supabase
 */
export const workoutApi = {
  /**
   * List all workouts for a user
   */
  listByUser: async (userId: string): Promise<WorkoutWithFeedback[]> => {
    return fetchHistory(userId);
  },

  /**
   * Create a new workout for a user
   */
  createForUser: async (
    userId: string,
    workout: Omit<WorkoutWithFeedback, "id">
  ): Promise<WorkoutWithFeedback> => {
    const newWorkout = { ...workout, id: `workout_${Date.now()}` };
    const currentHistory = await fetchHistory(userId);
    const updatedHistory = [...currentHistory, newWorkout];
    await saveHistory(userId, updatedHistory);
    return newWorkout;
  },

  /**
   * Delete a workout for a user
   */
  deleteForUser: async (
    userId: string,
    workoutId: string
  ): Promise<boolean> => {
    const currentHistory = await fetchHistory(userId);
    const updatedHistory = currentHistory.filter((w) => w.id !== workoutId);
    await saveHistory(userId, updatedHistory);
    return true;
  },
};
