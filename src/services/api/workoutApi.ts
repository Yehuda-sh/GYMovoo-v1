/**
 * @file workoutApi.ts
 * @brief CRUD helpers for workout history stored inside users.activityhistory (JSONB) in Supabase.
 * @notes All workout history is embedded in the single user row (no separate table). We therefore perform
 *        read-modify-write operations. This is NOT fully concurrent safe; if race conditions become an issue,
 *        consider moving workouts to a dedicated table or using PostgREST RPC with row-level locking.
 */
import type { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { supabase } from "../supabase/client";

if (!supabase) {
  throw new Error(
    "Supabase client not initialized. Ensure EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY are set."
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const devLog = (...args: any[]) => {
  if (__DEV__) console.warn("[workoutApi]", ...args);
};

type ActivityHistoryRow = {
  activityhistory: WorkoutWithFeedback[] | null;
};

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

export const workoutApi = {
  // בSupabase - workout data מאוחסן בתוך user record (activityhistory)
  listByUser: async (userId: string): Promise<WorkoutWithFeedback[]> => {
    return fetchHistory(userId);
  },

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
