/**
 * @file src/services/workout/workoutStorageService.ts
 * @description Service for storing and retrieving workout history data using local storage.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../../utils/logger";
import { StorageKeys } from "../../constants/StorageKeys";
import type { WorkoutWithFeedback } from "../../core/types/workout.types";
import type { WorkoutHistoryItem } from "../../core/types/user.types";

class WorkoutStorageService {
  private static readonly MAX_HISTORY = 500; // hard cap to avoid unbounded growth

  /**
   * Save a workout to local storage.
   */
  async saveWorkout(workout: WorkoutWithFeedback): Promise<void> {
    try {
      const existingHistory = await this.getLocalHistory();

      // prepend and cap size
      const updatedHistory = [workout, ...existingHistory].slice(
        0,
        WorkoutStorageService.MAX_HISTORY
      );

      await AsyncStorage.setItem(
        StorageKeys.WORKOUT_HISTORY,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      logger.error(
        "WorkoutStorageService",
        "Failed to save workout to storage",
        error
      );
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
      if (!raw) return [];

      const parsed = JSON.parse(raw) as unknown;

      // Ensure array shape
      if (!Array.isArray(parsed)) return [];

      // Optionally, shallow-validate expected keys
      return parsed as WorkoutWithFeedback[];
    } catch (error) {
      logger.error(
        "WorkoutStorageService.getLocalHistory",
        "Failed to read/parse history",
        error
      );
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
      // Optional fields from your WorkoutHistoryItem can be added here if needed
    }));
  }

  /**
   * Clear workout history (utility).
   */
  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(StorageKeys.WORKOUT_HISTORY);
    } catch (error) {
      logger.error(
        "WorkoutStorageService",
        "Failed to clear workout history",
        error
      );
      throw error;
    }
  }
}

export const workoutStorageService = new WorkoutStorageService();
