import axios from "axios";
import { Platform } from "react-native";
import type { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";

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

const BASE_URL = resolveBaseUrl();

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export const workoutApi = {
  listByUser: async (userId: string): Promise<WorkoutWithFeedback[]> => {
    const { data } = await api.get<WorkoutWithFeedback[]>(
      `/users/${encodeURIComponent(userId)}/workouts`
    );
    return data;
  },
  createForUser: async (
    userId: string,
    workout: Omit<WorkoutWithFeedback, "id">
  ): Promise<WorkoutWithFeedback> => {
    const { data } = await api.post<WorkoutWithFeedback>(
      `/users/${encodeURIComponent(userId)}/workouts`,
      workout
    );
    return data;
  },
  deleteForUser: async (
    userId: string,
    workoutId: string
  ): Promise<boolean> => {
    const { status } = await api.delete(
      `/users/${encodeURIComponent(userId)}/workouts/${encodeURIComponent(workoutId)}`
    );
    return status === 204;
  },
};
