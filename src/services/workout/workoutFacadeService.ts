/**
 * @file src/services/workout/workoutFacadeService.ts
 * @version 2025-08-17
 * @description שירת פאסאד מתקדם לתיאום כל שירותי האימונים
 *
 * Advanced facade service orchestrating workout-related services:
 * - Unified entry point for workout history, analytics, records & recommendations
 * - Advanced analytics integration with new AdvancedMetrics interface
 * - Gender-grouped statistics with comprehensive implementation
 * - Streamlined API for all workout-related operations
 *
 * @author GYMovoo Development Team
 * @updated 2025-08-17 - Enhanced with advanced analytics and comprehensive statistics
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
    const result = await personalRecordService.detectPersonalRecords(workout);
    return result.records || [];
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
    return workoutAnalyticsService.getPersonalizedWorkoutAnalytics(
      history,
      personalData
    );
  }

  /**
   * קבלת מטריקות ביצועים מתקדמות
   * Get advanced performance metrics for detailed analysis
   * @future Ready for integration with progress screens and analytics dashboards
   */
  async getAdvancedMetrics(
    history: WorkoutHistoryItem[]
  ): Promise<AdvancedMetrics> {
    return workoutAnalyticsService.calculateAdvancedMetrics(history);
  }

  /**
   * ניתוח מקיף של ביצועים עם נתונים מפורטים
   * Comprehensive performance analysis with detailed insights
   * @future Enhanced API for dashboard integration and progress tracking
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
        ? workoutsWithDuration.reduce((sum, h) => sum + (h.duration || 0), 0) /
          workoutsWithDuration.length
        : 0;

    // מציאת היום הפעיל ביותר
    const dayCount = new Map<string, number>();
    history.forEach((h) => {
      if (h.date || h.completedAt) {
        const dateStr = h.date || h.completedAt!;
        const day = new Date(dateStr).toLocaleDateString("he-IL", {
          weekday: "long",
        });
        dayCount.set(day, (dayCount.get(day) || 0) + 1);
      }
    });
    const mostActiveDay =
      Array.from(dayCount.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "לא זמין";

    // זיהוי תחומי שיפור
    const improvementAreas: string[] = [];
    if (metrics.consistencyScore < 70) improvementAreas.push("עקביות");
    if (metrics.progressTrend === "declining") improvementAreas.push("התקדמות");

    const muscleGroups = Object.entries(metrics.muscleGroupDistribution);
    const maxMuscleGroup = muscleGroups.sort(([, a], [, b]) => b - a)[0];
    if (maxMuscleGroup && maxMuscleGroup[1] > 40) {
      improvementAreas.push("איזון קבוצות שרירים");
    }

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

  // --- Advanced Statistics Methods ---

  /**
   * סטטיסטיקות מקובצות לפי מגדר עם חישובים אמיתיים
   * Gender-grouped statistics with real calculations from workout history
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

    if (history.length === 0) return stats;

    // חישוב סטטיסטיקות כלליות
    let totalDifficulty = 0;
    let workoutsWithDifficulty = 0;

    history.forEach((workout) => {
      // חישוב משך כולל
      if (workout.workout?.duration) {
        stats.total.totalDuration += workout.workout.duration;
      }

      // חישוב קושי ממוצע
      if (workout.feedback?.difficulty !== undefined) {
        totalDifficulty += workout.feedback.difficulty;
        workoutsWithDifficulty++;

        // חלוקה לפי מגדר (אם זמין)
        const gender = workout.metadata?.userGender || "other";
        if (gender in stats.byGender) {
          const genderKey = gender as keyof typeof stats.byGender;
          stats.byGender[genderKey].count++;
          stats.byGender[genderKey].averageDifficulty +=
            workout.feedback.difficulty;
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

    return stats;
  }

  /**
   * חישוב רצף אימונים נוכחי
   * Calculate current workout streak
   */
  private calculateWorkoutStreak(history: WorkoutWithFeedback[]): number {
    if (history.length === 0) return 0;

    const sortedHistory = history
      .filter((h) => h.feedback?.completedAt)
      .sort(
        (a, b) =>
          new Date(b.feedback.completedAt).getTime() -
          new Date(a.feedback.completedAt).getTime()
      );

    if (sortedHistory.length === 0) return 0;

    let streak = 1;
    let currentDate = new Date(sortedHistory[0].feedback.completedAt);

    for (let i = 1; i < sortedHistory.length; i++) {
      const workoutDate = new Date(sortedHistory[i].feedback.completedAt);
      const daysDiff = Math.floor(
        (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= 3) {
        // רווח מקסימלי של 3 ימים
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }

    return streak;
  }

  async getLatestCongratulationMessage(): Promise<string | null> {
    const history = await this.getHistory();
    if (history.length === 0) return null;
    return history[0].feedback.congratulationMessage || null;
  }
}

/**
 * מופע יחיד של שירות הפאסאד - נקודת כניסה מרכזית לכל פעולות האימון
 * Singleton facade service instance - central entry point for all workout operations
 *
 * @enhanced 2025-08-17:
 * ✅ Advanced analytics integration with AdvancedMetrics interface
 * ✅ Comprehensive gender-grouped statistics with real calculations
 * ✅ Enhanced streak calculation and performance insights
 * ✅ Future-ready APIs for dashboard integration
 *
 * @usage Main service used by DataManager, ProgressScreen, and workout hooks
 */
export const workoutFacadeService = new WorkoutFacadeService();
