// Workout history API for Supabase users.activityhistory JSONB field
import type { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { supabase } from "../supabase/client";

const fetchHistory = async (userId: string): Promise<WorkoutWithFeedback[]> => {
  if (!supabase || !userId) return [];

  const { data, error } = await supabase
    .from("users")
    .select("activityhistory")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data?.activityhistory) return [];
  return Array.isArray(data.activityhistory) ? data.activityhistory : [];
};

const saveHistory = async (
  userId: string,
  history: WorkoutWithFeedback[]
): Promise<void> => {
  if (!supabase || !userId) throw new Error("Invalid parameters");

  const { error } = await supabase
    .from("users")
    .update({ activityhistory: history })
    .eq("id", userId);

  if (error) throw error;
};

export const workoutApi = {
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
