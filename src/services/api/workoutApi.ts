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

  // Fix: Access workouts from activityhistory.workouts
  const workouts = data.activityhistory.workouts;
  return Array.isArray(workouts) ? workouts : [];
};

const saveHistory = async (
  userId: string,
  history: WorkoutWithFeedback[]
): Promise<void> => {
  if (!supabase || !userId) throw new Error("Invalid parameters");

  // Fix: Save to activityhistory.workouts instead of replacing entire activityhistory
  const { error } = await supabase
    .from("users")
    .update({
      activityhistory: {
        workouts: history,
        weeklyProgress: 0, // maintain structure
      },
    })
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
