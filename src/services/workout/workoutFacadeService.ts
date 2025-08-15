/**
 * @file src/services/workout/workoutFacadeService.ts
 * @description Facade service to orchestrate workout-related services.
 * This service acts as a single entry point for all workout history,
 * analytics, records, and recommendation functionalities.
 */
import { workoutStorageService } from "./workoutStorageService";
import { workoutAnalyticsService } from "./workoutAnalyticsService";
import { personalRecordService } from "./personalRecordService";
import { workoutRecommendationService } from "./workoutRecommendationService";
import {
  WorkoutWithFeedback,
  WorkoutData,
  PersonalRecord,
  PreviousPerformance,
  WorkoutHistoryItem,
  NextWorkoutInsights,
} from "../../screens/workout/types/workout.types";
import { UserGender } from "../../utils/genderAdaptation";
import { PersonalData } from "../../utils/personalDataUtils";

class WorkoutFacadeService {
  // --- Storage Methods ---

  async saveWorkout(workout: WorkoutWithFeedback): Promise<void> {
    return workoutStorageService.saveWorkout(workout);
  }

  async getHistoryForList(): Promise<WorkoutHistoryItem[]> {
    return workoutStorageService.getHistoryForList();
  }

  async getHistory(): Promise<WorkoutWithFeedback[]> {
    return workoutStorageService.getHistory();
  }

  async clearHistory(): Promise<void> {
    return workoutStorageService.clearHistory();
  }

  // --- Personal Record Methods ---

  async detectPersonalRecords(workout: WorkoutData): Promise<PersonalRecord[]> {
    return personalRecordService.detectPersonalRecords(workout);
  }

  async savePreviousPerformances(
    workout: WorkoutData,
    userGender?: UserGender
  ): Promise<void> {
    return personalRecordService.savePreviousPerformances(workout, userGender);
  }

  async getPreviousPerformanceForExercise(
    exerciseName: string
  ): Promise<PreviousPerformance | null> {
    return personalRecordService.getPreviousPerformanceForExercise(
      exerciseName
    );
  }

  // --- Analytics Methods ---

  async getPersonalizedWorkoutAnalytics(
    history: WorkoutHistoryItem[],
    personalData: PersonalData
  ): Promise<string[]> {
    // Note: The analytics service might need the full WorkoutWithFeedback object.
    // This is a temporary adaptation.
    return workoutAnalyticsService.getPersonalizedWorkoutAnalytics(
      history,
      personalData
    );
  }

  // --- Recommendation Methods ---

  async getPersonalizedNextWorkoutInsights(
    personalData?: PersonalData
  ): Promise<NextWorkoutInsights> {
    const history = await this.getHistory();
    return workoutRecommendationService.getPersonalizedNextWorkoutInsights(
      history,
      personalData
    );
  }

  // --- Methods to be moved from old service ---

  async getGenderGroupedStatistics(): Promise<{
    byGender: {
      male: {
        count: number;
        averageDifficulty: number;
      };
      female: {
        count: number;
        averageDifficulty: number;
      };
      other: {
        count: number;
        averageDifficulty: number;
      };
    };
    total: {
      totalWorkouts: number;
      totalDuration: number;
      averageDifficulty: number;
      workoutStreak: number;
    };
  }> {
    // This logic needs to be moved to the analytics service
    // and called from here.
    console.warn(
      "getGenderGroupedStatistics is not fully implemented in the facade yet."
    );
    return {
      byGender: {
        male: {
          count: 0,
          averageDifficulty: 0,
        },
        female: {
          count: 0,
          averageDifficulty: 0,
        },
        other: {
          count: 0,
          averageDifficulty: 0,
        },
      },
      total: {
        totalWorkouts: 0,
        totalDuration: 0,
        averageDifficulty: 0,
        workoutStreak: 0,
      },
    };
  }

  async getLatestCongratulationMessage(): Promise<string | null> {
    const history = await this.getHistory();
    if (history.length === 0) return null;
    return history[0].feedback.congratulationMessage || null;
  }
}

export const workoutFacadeService = new WorkoutFacadeService();
