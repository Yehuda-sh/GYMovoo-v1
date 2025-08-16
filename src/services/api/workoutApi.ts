import axios from "axios";
import type { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";

// מצב Supabase REST – אם הוגדר URL ומפתח anon, נשתמש בו ונגדיר כותרות מתאימות
const SUPABASE_URL = (
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ""
).trim();
const SUPABASE_ANON = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  ""
).trim();
const isSupabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON);

// יצירת axios instance
if (!isSupabaseEnabled) {
  throw new Error(
    "Supabase configuration required for workoutApi. Local Express fallback removed."
  );
}

const api = axios.create({
  baseURL: `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1`,
  timeout: 10000,
  headers: {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
    Prefer: "return=representation",
  },
});

// Debug: להבין מיד לאן אנו פונים
// Dev debug
if (typeof __DEV__ !== "undefined" && __DEV__) {
  console.warn(
    `🔍 workoutApi Debug (Supabase only): Base URL: ${api.defaults.baseURL}`
  );
}

export const workoutApi = {
  // בSupabase - workout data מאוחסן בתוך user record (activityhistory)
  listByUser: async (userId: string): Promise<WorkoutWithFeedback[]> => {
    const { data } = await api.get<
      Array<{ activityhistory: WorkoutWithFeedback[] | null }>
    >(`/users`, {
      params: {
        id: `eq.${userId}`,
        select: "activityhistory",
      },
    });
    if (data && data.length > 0 && data[0].activityhistory) {
      return Array.isArray(data[0].activityhistory)
        ? data[0].activityhistory
        : [];
    }
    return [];
  },

  createForUser: async (
    userId: string,
    workout: Omit<WorkoutWithFeedback, "id">
  ): Promise<WorkoutWithFeedback> => {
    const newWorkout = { ...workout, id: `workout_${Date.now()}` };
    const currentHistory = await workoutApi.listByUser(userId);
    const updatedHistory = [...currentHistory, newWorkout];
    await api.patch(
      `/users`,
      { activityhistory: updatedHistory },
      {
        params: { id: `eq.${userId}` },
      }
    );
    return newWorkout;
  },

  deleteForUser: async (
    userId: string,
    workoutId: string
  ): Promise<boolean> => {
    const currentHistory = await workoutApi.listByUser(userId);
    const updatedHistory = currentHistory.filter((w) => w.id !== workoutId);
    await api.patch(
      `/users`,
      { activityhistory: updatedHistory },
      {
        params: { id: `eq.${userId}` },
      }
    );
    return true;
  },
};
