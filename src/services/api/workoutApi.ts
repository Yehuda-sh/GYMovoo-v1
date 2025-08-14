import axios from "axios";
import { Platform } from "react-native";
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

// קביעת BASE_URL זהה ל-userApi עם נרמול ופתרון 10.0.2.2 לאנדרואיד
const resolveBaseUrl = () => {
  const rawEnv = (
    process.env.EXPO_PUBLIC_STORAGE_BASE_URL ||
    process.env.STORAGE_BASE_URL ||
    ""
  ).trim();

  let base =
    rawEnv ||
    (Platform.OS === "android"
      ? "http://10.0.2.2:3001"
      : "http://localhost:3001");

  try {
    const url = new URL(base);
    if (
      Platform.OS === "android" &&
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
    ) {
      url.hostname = "10.0.2.2";
      base = url.toString();
    }
  } catch {
    // ignore invalid URL
  }

  return base.replace(/\/+$/, "");
};

// יצירת axios instance
const api = isSupabaseEnabled
  ? axios.create({
      baseURL: `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1`,
      timeout: 10000,
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        Prefer: "return=representation",
      },
    })
  : axios.create({ baseURL: resolveBaseUrl(), timeout: 10000 });

// Debug: להבין מיד לאן אנו פונים
if (typeof __DEV__ !== "undefined" && __DEV__) {
  // eslint-disable-next-line no-console
  console.warn(`🔍 workoutApi Debug:
    - Mode: ${isSupabaseEnabled ? "Supabase" : "Local"}
    - Base URL: ${api.defaults.baseURL}
    - Has Supabase URL: ${!!SUPABASE_URL}
    - Has Supabase Key: ${!!SUPABASE_ANON}
  `);
}

export const workoutApi = {
  // בSupabase - workout data מאוחסן בתוך user record (activityhistory)
  listByUser: async (userId: string): Promise<WorkoutWithFeedback[]> => {
    if (isSupabaseEnabled) {
      // בSupabase נקרא את ה-user עם activityhistory
      const { data } = await api.get<
        Array<{ activityhistory: WorkoutWithFeedback[] | null }>
      >(`/users`, {
        params: {
          id: `eq.${userId}`,
          select: "activityhistory",
        },
      });

      if (data && data.length > 0 && data[0].activityhistory) {
        // מחזיר את ההיסטוריה אם קיימת
        return Array.isArray(data[0].activityhistory)
          ? data[0].activityhistory
          : [];
      }
      return [];
    } else {
      // מצב לוקלי ישן
      const { data } = await api.get<WorkoutWithFeedback[]>(
        `/users/${encodeURIComponent(userId)}/workouts`
      );
      return data;
    }
  },

  createForUser: async (
    userId: string,
    workout: Omit<WorkoutWithFeedback, "id">
  ): Promise<WorkoutWithFeedback> => {
    if (isSupabaseEnabled) {
      // בSupabase נעדכן את ה-user activityhistory
      const newWorkout = { ...workout, id: `workout_${Date.now()}` };

      // קודם נקרא את ההיסטוריה הנוכחית
      const currentHistory = await workoutApi.listByUser(userId);
      const updatedHistory = [...currentHistory, newWorkout];

      // נעדכן את המשתמש
      await api.patch(
        `/users`,
        { activityhistory: updatedHistory },
        {
          params: { id: `eq.${userId}` },
        }
      );

      return newWorkout;
    } else {
      // מצב לוקלי ישן
      const { data } = await api.post<WorkoutWithFeedback>(
        `/users/${encodeURIComponent(userId)}/workouts`,
        workout
      );
      return data;
    }
  },

  deleteForUser: async (
    userId: string,
    workoutId: string
  ): Promise<boolean> => {
    if (isSupabaseEnabled) {
      // בSupabase נעדכן את ההיסטוריה בלי האימון הנמחק
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
    } else {
      // מצב לוקלי ישן
      const { status } = await api.delete(
        `/users/${encodeURIComponent(userId)}/workouts/${encodeURIComponent(workoutId)}`
      );
      return status === 204;
    }
  },
};
