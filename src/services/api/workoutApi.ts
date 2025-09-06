// Workout history API for Supabase users.activityhistory JSONB field
import type { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { supabase } from "../supabase/client";

if (!supabase) {
  throw new Error("Supabase client not initialized");
}

export const workoutApi = {
  listByUser: async (userId: string): Promise<WorkoutWithFeedback[]> => {
    if (!userId) return [];

    const { data, error } = await supabase!
      .from("users")
      .select("activityhistory")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data?.activityhistory) return [];

    const workouts = data.activityhistory.workouts;
    return Array.isArray(workouts) ? workouts : [];
  },

  createForUser: async (
    userId: string,
    workout: Omit<WorkoutWithFeedback, "id">
  ): Promise<WorkoutWithFeedback> => {
    if (!userId) throw new Error("Invalid parameters");

    const newWorkout = { ...workout, id: `workout_${Date.now()}` };
    const currentHistory = await workoutApi.listByUser(userId);
    const updatedHistory = [...currentHistory, newWorkout];

    const { error } = await supabase!
      .from("users")
      .update({
        activityhistory: { workouts: updatedHistory },
      })
      .eq("id", userId);

    if (error) throw error;
    return newWorkout;
  },

  deleteForUser: async (
    userId: string,
    workoutId: string
  ): Promise<boolean> => {
    if (!userId) throw new Error("Invalid parameters");

    const currentHistory = await workoutApi.listByUser(userId);
    const updatedHistory = currentHistory.filter((w) => w.id !== workoutId);

    const { error } = await supabase!
      .from("users")
      .update({
        activityhistory: { workouts: updatedHistory },
      })
      .eq("id", userId);

    if (error) throw error;
    return true;
  },
};
