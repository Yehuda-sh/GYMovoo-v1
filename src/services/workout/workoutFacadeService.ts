/**
 * @file src/services/workout/workoutFacadeService.ts
 * @version 2025-09-01
 * @description שירת פאסאד מתקדם לתיאום כל שירותי האימונים
 *
 * Advanced facade service orchestrating workout-related services:
      logger.error("WorkoutFacadeService", "Failed to get advanced metrics", error);
      // Return default metrics structure with proper typing
      return {
        consistencyScore: 0,
        progressTrend: "stable" as const,
        muscleGroupDistribution: {},
        averageIntensity: 0,
        workoutFrequency: 0,
        totalVolume: 0,
        strengthProgression: 0,
        enduranceProgression: 0,
        volumeProgression: [],
        reliability: 0
      };ntry point for workout history, analytics, records & recommendations
 * - Advanced analytics integration with new AdvancedMetrics interface
 * - Gender-grouped statistics with comprehensive implementation
 * - Streamlined API for all workout-related operations
 *
 * @author GYMovoo Development Team
 * @updated 2025-09-01 - Enhanced error handling, input validation, and logging
 */
// NOTE (2025-08-16): Advanced screen-level workoutStorageService removed.
// Facade now exclusively uses unified simple workoutStorageService for persistence.
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
import type { AdvancedMetrics } from "./workoutAnalyticsService";
import { logger } from "../../utils/logger";

class WorkoutFacadeService {
  // Constants for thresholds and limits
  private readonly CONSISTENCY_THRESHOLD = 70;
  private readonly MUSCLE_GROUP_IMBALANCE_THRESHOLD = 40;
  private readonly MAX_WORKOUT_STREAK_GAP_DAYS = 3;
  private readonly DEFAULT_MOST_ACTIVE_DAY = "לא זמין";

  // --- Storage Methods ---
  // --- Storage Methods ---

  /**
   * Save a workout to storage
   * @param workout - The workout with feedback to save
   */
  async saveWorkout(workout: WorkoutWithFeedback): Promise<void> {
    try {
      if (!workout || !workout.workout) {
        throw new Error("Invalid workout data provided");
      }
      return await workoutStorageService.saveWorkout(workout);
    } catch (error) {
      logger.error("WorkoutFacadeService", "Failed to save workout", error);
      throw error;
    }
  }

  /**
   * Get workout history formatted for list display
   * @returns Array of workout history items
   */
  async getHistoryForList(): Promise<WorkoutHistoryItem[]> {
    try {
      return await workoutStorageService.getHistoryForList();
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to get history for list",
        error
      );
      return [];
    }
  }

  /**
   * Get complete workout history with full details
   * @returns Array of workouts with feedback
   */
  async getHistory(): Promise<WorkoutWithFeedback[]> {
    try {
      return await workoutStorageService.getHistory();
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to get workout history",
        error
      );
      return [];
    }
  }

  /**
   * Clear all workout history
   */
  async clearHistory(): Promise<void> {
    try {
      return await workoutStorageService.clearHistory();
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to clear workout history",
        error
      );
      throw error;
    }
  }

  // --- Personal Record Methods ---

  /**
   * Detect personal records from a workout
   * @param workout - The workout data to analyze
   * @returns Array of detected personal records
   */
  async detectPersonalRecords(workout: WorkoutData): Promise<PersonalRecord[]> {
    try {
      if (!workout || !workout.exercises) {
        logger.warn(
          "WorkoutFacadeService",
          "Invalid workout data for personal records",
          {
            hasWorkout: !!workout,
            hasExercises: !!workout?.exercises,
          }
        );
        return [];
      }

      const result = await personalRecordService.detectPersonalRecords(workout);
      return result.records || [];
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to detect personal records",
        error
      );
      return [];
    }
  }

  /**
   * Save previous performances for future reference
   * @param workout - The workout data to save
   * @param userGender - Optional user gender for gender-specific adaptations
   */
  async savePreviousPerformances(
    workout: WorkoutData,
    userGender?: UserGender
  ): Promise<void> {
    try {
      if (!workout || !workout.exercises) {
        throw new Error(
          "Invalid workout data provided for saving performances"
        );
      }

      return await personalRecordService.savePreviousPerformances(
        workout,
        userGender
      );
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to save previous performances",
        error
      );
      throw error;
    }
  }

  /**
   * Get previous performance for a specific exercise
   * @param exerciseName - Name of the exercise to get performance for
   * @returns Previous performance data or null if not found
   */
  async getPreviousPerformanceForExercise(
    exerciseName: string
  ): Promise<PreviousPerformance | null> {
    try {
      if (!exerciseName || typeof exerciseName !== "string") {
        logger.warn("WorkoutFacadeService", "Invalid exercise name provided", {
          exerciseName,
          type: typeof exerciseName,
        });
        return null;
      }

      return await personalRecordService.getPreviousPerformanceForExercise(
        exerciseName
      );
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to get previous performance",
        error
      );
      return null;
    }
  }

  // --- Analytics Methods ---

  /**
   * Get personalized workout analytics
   * @param history - Workout history for analysis
   * @param personalData - Personal data for customization
   * @returns Array of personalized analytics insights
   */
  async getPersonalizedWorkoutAnalytics(
    history: WorkoutHistoryItem[],
    personalData: PersonalData
  ): Promise<string[]> {
    try {
      if (!Array.isArray(history)) {
        throw new Error("Invalid history data provided");
      }
      if (!personalData || !personalData.age) {
        throw new Error("Invalid personal data provided");
      }

      return await workoutAnalyticsService.getPersonalizedWorkoutAnalytics(
        history,
        personalData
      );
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to get personalized analytics",
        error
      );
      return ["שגיאה בטעינת ניתוחים מותאמים אישית"];
    }
  }

  /**
   * קבלת מטריקות ביצועים מתקדמות
   * Get advanced performance metrics for detailed analysis
   * @future Ready for integration with progress screens and analytics dashboards
   * @param history - Workout history for metrics calculation
   * @returns Advanced performance metrics
   */
  async getAdvancedMetrics(
    history: WorkoutHistoryItem[]
  ): Promise<AdvancedMetrics> {
    try {
      if (!Array.isArray(history)) {
        throw new Error("Invalid history data provided for advanced metrics");
      }

      return await workoutAnalyticsService.calculateAdvancedMetrics(history);
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to get advanced metrics",
        error
      );
      // Return default metrics structure with proper typing
      return {
        consistencyScore: 0,
        progressTrend: "stable" as const,
        muscleGroupDistribution: {},
        averageIntensity: 0,
        volumeProgression: [],
        reliability: 0,
      };
    }
  }

  /**
   * ניתוח מקיף של ביצועים עם נתונים מפורטים
   * Comprehensive performance analysis with detailed insights
   * @future Enhanced API for dashboard integration and progress tracking
   * @param personalData - Personal data for customized analysis
   * @returns Comprehensive analytics with insights, metrics, and summary
   */
  async getComprehensiveAnalytics(personalData: PersonalData): Promise<{
    insights: string[];
    metrics: AdvancedMetrics;
    summary: {
      totalWorkouts: number;
      averageDuration: number;
      mostActiveDay: string;
      improvementAreas: string[];
    };
  }> {
    try {
      if (!personalData || !personalData.age) {
        throw new Error(
          "Invalid personal data provided for comprehensive analytics"
        );
      }

      const history = await this.getHistoryForList();
      const insights = await this.getPersonalizedWorkoutAnalytics(
        history,
        personalData
      );
      const metrics = await this.getAdvancedMetrics(history);

      // חישוב סיכום מקיף
      const workoutsWithDuration = history.filter(
        (h) => h.duration && h.duration > 0
      );
      const totalWorkouts = history.length;
      const averageDuration =
        workoutsWithDuration.length > 0
          ? workoutsWithDuration.reduce(
              (sum, h) => sum + (h.duration || 0),
              0
            ) / workoutsWithDuration.length
          : 0;

      // מציאת היום הפעיל ביותר
      const dayCount = new Map<string, number>();
      history.forEach((h) => {
        if (h.date || h.completedAt) {
          const dateStr = h.date || h.completedAt!;
          try {
            const day = new Date(dateStr).toLocaleDateString("he-IL", {
              weekday: "long",
            });
            dayCount.set(day, (dayCount.get(day) || 0) + 1);
          } catch (dateError) {
            logger.warn(
              "WorkoutFacadeService",
              "Invalid date format in history",
              {
                dateStr,
                error: dateError,
              }
            );
          }
        }
      });
      const mostActiveDay =
        Array.from(dayCount.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        this.DEFAULT_MOST_ACTIVE_DAY;

      // זיהוי תחומי שיפור
      const improvementAreas: string[] = [];
      if (metrics.consistencyScore < this.CONSISTENCY_THRESHOLD)
        improvementAreas.push("עקביות");
      if (metrics.progressTrend === "declining")
        improvementAreas.push("התקדמות");

      const muscleGroups = Object.entries(metrics.muscleGroupDistribution);
      const maxMuscleGroup = muscleGroups.sort(([, a], [, b]) => b - a)[0];
      if (
        maxMuscleGroup &&
        maxMuscleGroup[1] > this.MUSCLE_GROUP_IMBALANCE_THRESHOLD
      ) {
        improvementAreas.push("איזון קבוצות שרירים");
      }

      logger.info("WorkoutFacadeService", "Generated comprehensive analytics", {
        totalWorkouts,
        averageDuration: Math.round(averageDuration),
        mostActiveDay,
        improvementAreasCount: improvementAreas.length,
      });

      return {
        insights,
        metrics,
        summary: {
          totalWorkouts,
          averageDuration: Math.round(averageDuration),
          mostActiveDay,
          improvementAreas,
        },
      };
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to get comprehensive analytics",
        error
      );
      // Return fallback structure
      return {
        insights: ["שגיאה בטעינת ניתוחים מקיפים"],
        metrics: {
          consistencyScore: 0,
          progressTrend: "stable" as const,
          muscleGroupDistribution: {},
          averageIntensity: 0,
          volumeProgression: [],
          reliability: 0,
        },
        summary: {
          totalWorkouts: 0,
          averageDuration: 0,
          mostActiveDay: this.DEFAULT_MOST_ACTIVE_DAY,
          improvementAreas: [],
        },
      };
    }
  }

  // --- Recommendation Methods ---

  /**
   * Get personalized next workout insights
   * @param personalData - Optional personal data for more accurate recommendations
   * @returns Next workout insights with duration, intensity, recovery, and focus areas
   */
  async getPersonalizedNextWorkoutInsights(
    personalData?: PersonalData
  ): Promise<NextWorkoutInsights> {
    try {
      const history = await this.getHistory();
      return await workoutRecommendationService.getPersonalizedNextWorkoutInsights(
        history,
        personalData
      );
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to get next workout insights",
        error
      );
      // Return fallback insights
      return {
        suggestedDuration: 45,
        suggestedIntensity: "moderate",
        recoveryRecommendation: "נסה שוב מאוחר יותר",
        focusAreas: ["גוף מלא"],
        expectedCalorieBurn: 360,
      };
    }
  }

  // --- Advanced Statistics Methods ---

  /**
   * סטטיסטיקות מקובצות לפי מגדר עם חישובים אמיתיים
   * Gender-grouped statistics with real calculations from workout history
   * @returns Statistics grouped by gender with counts and averages
   */
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
    try {
      const history = await this.getHistory();

      // אתחול נתונים
      const stats = {
        byGender: {
          male: { count: 0, averageDifficulty: 0 },
          female: { count: 0, averageDifficulty: 0 },
          other: { count: 0, averageDifficulty: 0 },
        },
        total: {
          totalWorkouts: history.length,
          totalDuration: 0,
          averageDifficulty: 0,
          workoutStreak: 0,
        },
      };

      if (history.length === 0) {
        logger.info(
          "WorkoutFacadeService",
          "No workout history available for gender statistics"
        );
        return stats;
      }

      // חישוב סטטיסטיקות כלליות
      let totalDifficulty = 0;
      let workoutsWithDifficulty = 0;

      history.forEach((workout) => {
        // חישוב משך כולל
        if (workout.workout?.duration) {
          stats.total.totalDuration += workout.workout.duration;
        }

        // חישוב קושי ממוצע
        if (
          workout.feedback?.difficulty !== undefined &&
          workout.feedback.difficulty >= 0
        ) {
          totalDifficulty += workout.feedback.difficulty;
          workoutsWithDifficulty++;

          // חלוקה לפי מגדר (אם זמין)
          const gender = workout.metadata?.userGender || "other";
          if (gender in stats.byGender) {
            const genderKey = gender as keyof typeof stats.byGender;
            stats.byGender[genderKey].count++;
            stats.byGender[genderKey].averageDifficulty +=
              workout.feedback.difficulty;
          } else {
            logger.warn(
              "WorkoutFacadeService",
              "Unknown gender in workout metadata",
              {
                gender,
                workoutId: workout.workout?.id,
              }
            );
          }
        }
      });

      // חישוב ממוצעים
      stats.total.averageDifficulty =
        workoutsWithDifficulty > 0
          ? Number((totalDifficulty / workoutsWithDifficulty).toFixed(1))
          : 0;

      // חישוב ממוצעים לפי מגדר
      Object.keys(stats.byGender).forEach((gender) => {
        const genderKey = gender as keyof typeof stats.byGender;
        const genderStats = stats.byGender[genderKey];
        if (genderStats.count > 0) {
          genderStats.averageDifficulty = Number(
            (genderStats.averageDifficulty / genderStats.count).toFixed(1)
          );
        }
      });

      // חישוב רצף אימונים נוכחי
      stats.total.workoutStreak = this.calculateWorkoutStreak(history);

      logger.info(
        "WorkoutFacadeService",
        "Generated gender grouped statistics",
        {
          totalWorkouts: stats.total.totalWorkouts,
          maleCount: stats.byGender.male.count,
          femaleCount: stats.byGender.female.count,
          otherCount: stats.byGender.other.count,
          workoutStreak: stats.total.workoutStreak,
        }
      );

      return stats;
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to get gender grouped statistics",
        error
      );
      // Return empty stats structure
      return {
        byGender: {
          male: { count: 0, averageDifficulty: 0 },
          female: { count: 0, averageDifficulty: 0 },
          other: { count: 0, averageDifficulty: 0 },
        },
        total: {
          totalWorkouts: 0,
          totalDuration: 0,
          averageDifficulty: 0,
          workoutStreak: 0,
        },
      };
    }
  }

  /**
   * חישוב רצף אימונים נוכחי
   * Calculate current workout streak
   * @param history - Workout history to analyze
   * @returns Current workout streak count
   */
  private calculateWorkoutStreak(history: WorkoutWithFeedback[]): number {
    try {
      if (!Array.isArray(history) || history.length === 0) {
        return 0;
      }

      const sortedHistory = history
        .filter((h) => h.feedback?.completedAt)
        .sort(
          (a, b) =>
            new Date(b.feedback!.completedAt!).getTime() -
            new Date(a.feedback!.completedAt!).getTime()
        );

      if (sortedHistory.length === 0) {
        return 0;
      }

      let streak = 1;
      let currentDate = new Date(sortedHistory[0].feedback!.completedAt!);

      for (let i = 1; i < sortedHistory.length; i++) {
        try {
          const workoutDate = new Date(sortedHistory[i].feedback!.completedAt!);
          const daysDiff = Math.floor(
            (currentDate.getTime() - workoutDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          if (daysDiff <= this.MAX_WORKOUT_STREAK_GAP_DAYS) {
            // רווח מקסימלי של 3 ימים
            streak++;
            currentDate = workoutDate;
          } else {
            break;
          }
        } catch (dateError) {
          logger.warn(
            "WorkoutFacadeService",
            "Invalid date in workout history",
            {
              index: i,
              error: dateError,
            }
          );
          break;
        }
      }

      return streak;
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to calculate workout streak",
        error
      );
      return 0;
    }
  }

  /**
   * Get the latest congratulation message from workout history
   * @returns Latest congratulation message or null if not available
   */
  async getLatestCongratulationMessage(): Promise<string | null> {
    try {
      const history = await this.getHistory();
      if (!Array.isArray(history) || history.length === 0) {
        return null;
      }

      const latestWorkout = history[0];
      if (!latestWorkout?.feedback?.congratulationMessage) {
        logger.debug(
          "WorkoutFacadeService",
          "No congratulation message in latest workout"
        );
        return null;
      }

      return latestWorkout.feedback.congratulationMessage;
    } catch (error) {
      logger.error(
        "WorkoutFacadeService",
        "Failed to get latest congratulation message",
        error
      );
      return null;
    }
  }
}

/**
 * מופע יחיד של שירות הפאסאד - נקודת כניסה מרכזית לכל פעולות האימון
 * Singleton facade service instance - central entry point for all workout operations
 *
 * @enhanced 2025-09-01:
 * ✅ Comprehensive error handling with proper logging
 * ✅ Input validation for all methods
 * ✅ Constants extraction for better maintainability
 * ✅ Type-safe error recovery with fallback structures
 * ✅ Enhanced documentation and parameter validation
 *
 * @usage Main service used by DataManager, ProgressScreen, and workout hooks
 */
export const workoutFacadeService = new WorkoutFacadeService();
