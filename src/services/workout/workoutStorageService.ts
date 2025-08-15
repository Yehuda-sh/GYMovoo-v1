/**
 * @file src/services/workout/workoutStorageService.ts
 * @description Service for storing and retrieving workout history data.
 * Handles both local (AsyncStorage) and remote (Supabase) storage.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { workoutApi } from "../api/workoutApi";
import { useUserStore } from "../../stores/userStore";
import {
  WorkoutWithFeedback,
  WorkoutHistoryItem,
} from "../../screens/workout/types/workout.types";

const WORKOUT_HISTORY_KEY = "workout_history";

class WorkoutStorageService {
  /**
   * Save a workout to the appropriate storage (API or local).
   */
  async saveWorkout(workout: WorkoutWithFeedback): Promise<void> {
    const user = useUserStore.getState().user;
    if (user?.id) {
      await workoutApi.createForUser(user.id, workout);
    } else {
      const existingHistory = await this.getLocalHistory();
      const updatedHistory = [workout, ...existingHistory];
      await AsyncStorage.setItem(
        WORKOUT_HISTORY_KEY,
        JSON.stringify(updatedHistory)
      );
    }
  }

  /**
   * Get the full workout history.
   */
  async getHistory(): Promise<WorkoutWithFeedback[]> {
    const user = useUserStore.getState().user;
    if (user?.id) {
      return await workoutApi.listByUser(user.id);
    }
    return this.getLocalHistory();
  }

  /**
   * Get workout history from local storage.
   */
  private async getLocalHistory(): Promise<WorkoutWithFeedback[]> {
    try {
      const raw = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
      const data: WorkoutWithFeedback[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ WorkoutStorageService.getLocalHistory - Error:", error);
      return [];
    }
  }

  /**
   * Get workout history formatted for list views.
   */
  async getHistoryForList(): Promise<WorkoutHistoryItem[]> {
    const history = await this.getHistory();
    return history.map(
      (item) =>
        ({
          id: item.id,
          workoutName: item.workout.name,
          date: item.feedback.completedAt,
          duration: item.stats.duration,
          rating: item.feedback.difficulty,
          // You can add more transformations here if needed
        }) as WorkoutHistoryItem
    );
  }

  /**
   * Synchronize local workout history with the remote server.
   */
  async syncLocalHistoryWithServer(userId: string): Promise<void> {
    try {
      const localHistory = await this.getLocalHistory();
      if (localHistory.length === 0) {
        return; // Nothing to sync
      }

      // In a real app, you'd probably want to merge intelligently.
      // For now, we'll just upload all local workouts.
      for (const workout of localHistory) {
        await workoutApi.createForUser(userId, workout);
      }

      // Clear local history after successful sync
      await AsyncStorage.removeItem(WORKOUT_HISTORY_KEY);
      console.warn("✅ Local workout history synced successfully.");
    } catch (error) {
      console.error("❌ Error syncing local workout history:", error);
    }
  }

  /**
   * Clear all workout history.
   */
  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WORKOUT_HISTORY_KEY);
      // Also need to clear remote history if a user is logged in
      const user = useUserStore.getState().user;
      if (user?.id) {
        // This assumes workoutApi has a method to delete all workouts for a user.
        // await workoutApi.deleteAllForUser(user.id);
        console.warn("Remote history clearing not implemented in API.");
      }
    } catch (error) {
      console.error("Error clearing workout history:", error);
      throw error;
    }
  }
}

export const workoutStorageService = new WorkoutStorageService();
