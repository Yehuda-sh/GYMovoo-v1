/**
 * @file src/services/workout/workoutStorageService.ts
 * @description Service for storing and retrieving workout history data.
 * Handles both local (AsyncStorage) and remote (Supabase) storage.
 * Implements Free user limitations: local storage only with 7-day retention.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { workoutApi } from "../api/workoutApi";
import { useUserStore } from "../../stores/userStore";
import { logger } from "../../utils/logger";
import {
  WorkoutWithFeedback,
  WorkoutHistoryItem,
} from "../../screens/workout/types/workout.types";

const WORKOUT_HISTORY_KEY = "workout_history";

class WorkoutStorageService {
  private readonly SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 ימים במילישניות

  /**
   * Save a workout to the appropriate storage (API or local).
   * Free users: Local storage only with 7-day retention
   * Premium users: Remote storage with local backup
   */
  async saveWorkout(workout: WorkoutWithFeedback): Promise<void> {
    const user = useUserStore.getState().user;
    const subscription = user?.subscription;

    // Premium users: שמירה remote + local backup
    if (user?.id && subscription?.type !== "free") {
      try {
        await workoutApi.createForUser(user.id, workout);
        // גם שמירה מקומית כ-backup
        await this.saveToLocalStorage(workout);
      } catch (error) {
        logger.error(
          "Failed to save workout remotely, saving locally",
          "storage",
          error
        );
        // במקרה של שגיאה remote, לפחות נשמור מקומית
        await this.saveToLocalStorage(workout);
      }
    } else {
      // Free users: שמירה מקומית בלבד עם מחיקה אוטומטית
      await this.saveToLocalStorage(workout);
      await this.cleanupOldWorkouts(); // מחיקת אימונים ישנים > 7 ימים
    }
  }

  /**
   * שמירת אימון ב-AsyncStorage
   */
  private async saveToLocalStorage(
    workout: WorkoutWithFeedback
  ): Promise<void> {
    const existingHistory = await this.getLocalHistory();
    const updatedHistory = [workout, ...existingHistory];
    await AsyncStorage.setItem(
      WORKOUT_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
  }

  /**
   * מחיקה אוטומטית של אימונים ישנים מ-7 ימים (Free users)
   */
  private async cleanupOldWorkouts(): Promise<void> {
    try {
      const user = useUserStore.getState().user;
      const subscription = user?.subscription;
      if (subscription?.type !== "free") return; // רק Free users

      const history = await this.getLocalHistory();
      const now = new Date().getTime();

      const filteredHistory = history.filter((workout) => {
        const workoutDate = new Date(workout.feedback.completedAt).getTime();
        return now - workoutDate <= this.SEVEN_DAYS_MS;
      });

      // שמירה רק אם יש הבדל
      if (filteredHistory.length !== history.length) {
        await AsyncStorage.setItem(
          WORKOUT_HISTORY_KEY,
          JSON.stringify(filteredHistory)
        );
        logger.info(
          `Cleaned up ${history.length - filteredHistory.length} old workouts (Free user limitation)`,
          "storage"
        );
      }
    } catch (error) {
      logger.error("Error during workout cleanup", "storage", error);
    }
  }

  /**
   * קבלת מידע על הגבלות Free users
   */
  async getFreeUserStorageInfo(): Promise<{
    isFreeLimited: boolean;
    workoutCount: number;
    oldestWorkoutAge: number; // ימים
    canSync: boolean;
  }> {
    const user = useUserStore.getState().user;
    const subscription = user?.subscription;
    const isFreeLimited = subscription?.type === "free";

    const history = await this.getLocalHistory();
    const workoutCount = history.length;

    let oldestWorkoutAge = 0;
    if (history.length > 0) {
      const oldestWorkout = history[history.length - 1];
      const oldestDate = new Date(oldestWorkout.feedback.completedAt).getTime();
      const now = new Date().getTime();
      oldestWorkoutAge = Math.floor((now - oldestDate) / (24 * 60 * 60 * 1000));
    }

    return {
      isFreeLimited,
      workoutCount,
      oldestWorkoutAge,
      canSync: !isFreeLimited && !!user?.id,
    };
  }

  /**
   * Get the full workout history.
   * Free users: Local storage only with automatic cleanup
   * Premium users: Remote storage with local fallback
   */
  async getHistory(): Promise<WorkoutWithFeedback[]> {
    const user = useUserStore.getState().user;
    const subscription = user?.subscription;

    // Premium users: ניסיון remote תחילה, אם לא אז local
    if (user?.id && subscription?.type !== "free") {
      try {
        return await workoutApi.listByUser(user.id);
      } catch (error) {
        logger.error(
          "Failed to fetch remote history, falling back to local",
          "storage",
          error
        );
        return this.getLocalHistory();
      }
    }

    // Free users: local storage בלבד עם ניקוי אוטומטי
    await this.cleanupOldWorkouts(); // ניקוי לפני החזרת נתונים
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
      logger.error("WorkoutStorageService.getLocalHistory", "storage", error);
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
      logger.info("Local workout history synced successfully", "storage");
    } catch (error) {
      logger.error("Error syncing local workout history", "storage", error);
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
        logger.warn(
          "Remote history clearing not implemented in API",
          "storage"
        );
      }
    } catch (error) {
      logger.error("Error clearing workout history", "storage", error);
      throw error;
    }
  }
}

export const workoutStorageService = new WorkoutStorageService();
