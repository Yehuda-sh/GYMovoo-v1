/**
 * Simple Data Manager for basic caching
 */

import { User } from "../../stores/userStore";
import { WorkoutWithFeedback } from "../../core/types/workout.types";
import { WorkoutHistoryItem } from "../../core/types/user.types";
import workoutFacadeService from "../workout/workoutFacadeService";
import { logger } from "../../utils/logger";

export interface AppDataCache {
  workoutHistory: WorkoutWithFeedback[];
  historyList: WorkoutHistoryItem[];
  lastUpdated: Date;
}

class DataManagerService {
  private cache: AppDataCache | null = null;
  private isInitialized = false;

  async initialize(user: User): Promise<void> {
    if (!user?.id) throw new Error("Invalid user");

    if (this.isInitialized && this.cache) return;

    try {
      logger.info("DataManager", "Initialization started", { userId: user.id });

      const workoutHistory = await workoutFacadeService
        .getHistory()
        .catch(() => []);
      const historyList = await workoutFacadeService
        .getHistoryForList()
        .catch(() => []);

      this.cache = {
        workoutHistory,
        historyList,
        lastUpdated: new Date(),
      };

      this.isInitialized = true;
      logger.info("DataManager", "Initialization completed", {
        userId: user.id,
        workoutCount: workoutHistory.length,
      });
    } catch (error) {
      logger.error("DataManager", "Initialization failed", {
        error,
        userId: user.id,
      });
      throw error;
    }
  }

  getWorkoutHistory(): WorkoutWithFeedback[] {
    return this.cache?.workoutHistory || [];
  }

  getHistoryList(): WorkoutHistoryItem[] {
    return this.cache?.historyList || [];
  }

  isReady(): boolean {
    return this.isInitialized && this.cache !== null;
  }

  getLastUpdated(): Date | null {
    return this.cache?.lastUpdated ?? null;
  }

  async refresh(user: User): Promise<void> {
    if (!user?.id) throw new Error("Invalid user");

    logger.info("DataManager", "Data refresh started", { userId: user.id });

    this.isInitialized = false;
    this.cache = null;

    await this.initialize(user);

    logger.info("DataManager", "Data refresh completed", { userId: user.id });
  }

  clearCache(): void {
    this.cache = null;
    this.isInitialized = false;
  }
}

export const dataManager = new DataManagerService();
