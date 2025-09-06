import {
  WorkoutWithFeedback,
  WorkoutData,
  PersonalRecord,
  WorkoutHistoryItem,
} from "../../screens/workout/types/workout.types";
import { PersonalData } from "../../utils/personalDataUtils";
import { workoutStorageService } from "./workoutStorageService";
import workoutAnalyticsService from "./workoutAnalyticsService";
import personalRecordService from "./personalRecordService";
import type { AdvancedMetrics } from "./workoutAnalyticsService";

class WorkoutFacadeService {
  // Storage Methods
  async saveWorkout(workout: WorkoutWithFeedback): Promise<void> {
    if (!workout?.workout) {
      throw new Error("Invalid workout data provided");
    }
    return await workoutStorageService.saveWorkout(workout);
  }

  async getHistoryForList(): Promise<WorkoutHistoryItem[]> {
    return await workoutStorageService.getHistoryForList();
  }

  async getHistory(): Promise<WorkoutWithFeedback[]> {
    return await workoutStorageService.getHistory();
  }

  async clearAllData(): Promise<void> {
    return await workoutStorageService.clearHistory();
  }

  // Analytics Methods
  async getPersonalizedAnalytics(
    history: WorkoutHistoryItem[],
    personalData: PersonalData
  ): Promise<string[]> {
    try {
      return await workoutAnalyticsService.getPersonalizedWorkoutAnalytics(
        history,
        personalData
      );
    } catch {
      return ["אירעה שגיאה בניתוח האימונים."];
    }
  }

  getAdvancedMetrics(
    history: WorkoutHistoryItem[],
    personalData: PersonalData
  ): AdvancedMetrics {
    try {
      return workoutAnalyticsService.getAdvancedMetrics(history, personalData);
    } catch {
      return {
        averageIntensity: 0,
        muscleGroupDistribution: {},
        progressTrend: "stable",
        consistencyScore: 0,
        volumeProgression: [],
        reliability: 0,
      };
    }
  }

  // Personal Records Methods
  async detectPersonalRecords(workout: WorkoutData): Promise<PersonalRecord[]> {
    return await personalRecordService.detectPersonalRecords(workout);
  }

  async savePersonalRecord(record: PersonalRecord): Promise<void> {
    return await personalRecordService.savePersonalRecord(record);
  }

  async getPersonalRecords(exerciseName?: string): Promise<PersonalRecord[]> {
    return await personalRecordService.getPersonalRecords(exerciseName);
  }
}

export default new WorkoutFacadeService();
