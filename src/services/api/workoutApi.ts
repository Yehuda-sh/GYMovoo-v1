import axios from "axios";
import { Platform } from "react-native";
import type { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
const fromEnv =
  process.env.EXPO_PUBLIC_STORAGE_BASE_URL || process.env.STORAGE_BASE_URL;
let BASE_URL = fromEnv || "http://localhost:3001";
if (!fromEnv && Platform.OS === "android" && BASE_URL.includes("localhost")) {
  BASE_URL = "http://10.0.2.2:3001";
}

export const workoutApi = {
  listByUser: async (userId: string): Promise<WorkoutWithFeedback[]> => {
    const { data } = await axios.get(`${BASE_URL}/users/${userId}/workouts`);
    return data as WorkoutWithFeedback[];
  },
  createForUser: async (
    userId: string,
    workout: Omit<WorkoutWithFeedback, "id">
  ): Promise<WorkoutWithFeedback> => {
    const { data } = await axios.post(
      `${BASE_URL}/users/${userId}/workouts`,
      workout
    );
    return data as WorkoutWithFeedback;
  },
  deleteForUser: async (
    userId: string,
    workoutId: string
  ): Promise<boolean> => {
    const { status } = await axios.delete(
      `${BASE_URL}/users/${userId}/workouts/${workoutId}`
    );
    return status === 204;
  },
};
