/**
 * @file src/services/workout/workoutStorageService.ts
 * @description Service for storing and retrieving workout history data using local storage.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../../utils/logger";
import { StorageKeys } from "../../constants/StorageKeys";
import { WorkoutWithFeedback } from "../../core/types/workout.types";
import { WorkoutHistoryItem } from "../../core/types/user.types";

class WorkoutStorageService {
  /**
   * Save a workout to local storage.
   */
  async saveWorkout(workout: WorkoutWithFeedback): Promise<void> {
    try {
      const existingHistory = await this.getLocalHistory();
      const updatedHistory = [workout, ...existingHistory];
      await AsyncStorage.setItem(
        StorageKeys.WORKOUT_HISTORY,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      logger.error("Failed to save workout", "storage", error);
      throw error;
    }
  }

  /**
   * Get the full workout history from local storage.
   */
  async getHistory(): Promise<WorkoutWithFeedback[]> {
    return this.getLocalHistory();
  }

  /**
   * Get workout history from local storage.
   */
  private async getLocalHistory(): Promise<WorkoutWithFeedback[]> {
    try {
      const raw = await AsyncStorage.getItem(StorageKeys.WORKOUT_HISTORY);
      const data: WorkoutWithFeedback[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      logger.error("WorkoutStorageService.getLocalHistory", "storage", error);
      return [];
    }
  }

  /**
   * Get workout history formatted for list views.
   */
  async getHistoryForList(): Promise<WorkoutHistoryItem[]> {
    const history = await this.getHistory();
    return history.map((item) => ({
      id: item.id,
      name: item.workout.name,
      date: item.feedback.completedAt,
      duration: item.stats.duration,
      rating: item.feedback.difficulty,
    }));
  }
}

export const workoutStorageService = new WorkoutStorageService();
