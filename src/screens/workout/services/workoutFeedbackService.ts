/**
 * @file src/screens/workout/services/workoutFeedbackService.ts
 * @description שירות לניהול משוב ופידבק על אימונים
 * English: Workout feedback and response management service
 * @inspired מהטיפול המוצלח במשוב במסך ההיסטוריה
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutData, WorkoutWithFeedback } from "../types/workout.types";
import workoutValidationService from "./workoutValidationService";
import workoutErrorHandlingService from "./workoutErrorHandlingService";

// טיפוס משוב נפרד בהתבסס על WorkoutWithFeedback
type WorkoutFeedback = WorkoutWithFeedback["feedback"];

interface FeedbackValidationResult {
  isValid: boolean;
  correctedFeedback?: WorkoutFeedback;
  warnings: string[];
}

interface FeedbackMetrics {
  averageDifficulty: number;
  mostCommonFeeling: string;
  completionTrend: "improving" | "stable" | "declining";
  personalRecordCount: number;
}

class WorkoutFeedbackService {
  private static instance: WorkoutFeedbackService;
  private readonly FEEDBACK_STORAGE_KEY = "workout_feedback_data";

  static getInstance(): WorkoutFeedbackService {
    if (!WorkoutFeedbackService.instance) {
      WorkoutFeedbackService.instance = new WorkoutFeedbackService();
    }
    return WorkoutFeedbackService.instance;
  }

  /**
   * וידואי נתוני משוב (מבוסס על validateWorkoutData מההיסטוריה)
   */
  validateFeedback(feedback: any): FeedbackValidationResult {
    const warnings: string[] = [];
    let isValid = true;

    try {
      // וידואי זמן השלמה
      let completedAt = feedback.completedAt;
      if (!completedAt || completedAt === "Invalid Date") {
        completedAt = new Date().toISOString();
        warnings.push("זמן השלמה לא תקין - הוגדר לזמן נוכחי");
      } else {
        const date = new Date(completedAt);
        if (isNaN(date.getTime()) || date.getTime() <= 0) {
          completedAt = new Date().toISOString();
          warnings.push("זמן השלמה תוקן לזמן נוכחי");
        }
      }

      // וידואי רמת קושי
      let difficulty = feedback.difficulty;
      if (
        typeof difficulty !== "number" ||
        isNaN(difficulty) ||
        difficulty < 1 ||
        difficulty > 5
      ) {
        difficulty = 3; // ברירת מחדל - בינוני
        warnings.push("רמת קושי לא תקינה - הוגדרה לבינונית");
      }

      // וידואי הרגשה
      let feeling = feedback.feeling;
      const validFeelings = [
        "😄",
        "😊",
        "😐",
        "😞",
        "😢",
        "💪",
        "😴",
        "🔥",
        "happy",
        "sad",
        "neutral",
        "tired",
        "motivated",
      ];
      if (!feeling || !validFeelings.includes(feeling)) {
        feeling = "😐"; // ברירת מחדל - ניטרלי
        warnings.push("הרגשה לא תקינה - הוגדרה לניטרלית");
      }

      // יצירת משוב מתוקן
      const correctedFeedback: WorkoutFeedback = {
        completedAt,
        difficulty,
        feeling,
        readyForMore:
          feedback.readyForMore !== undefined
            ? Boolean(feedback.readyForMore)
            : null,
        genderAdaptedNotes: feedback.genderAdaptedNotes || undefined,
        congratulationMessage: feedback.congratulationMessage || undefined,
      };

      return {
        isValid: warnings.length === 0,
        correctedFeedback,
        warnings,
      };
    } catch (error) {
      console.error("Error validating feedback:", error);
      return {
        isValid: false,
        warnings: ["שגיאה בוידוא המשוב"],
      };
    }
  }

  /**
   * שמירת משוב עם וידואי (מבוסס על הגישה בהיסטוריה)
   */
  async saveFeedback(
    workoutId: string,
    feedback: WorkoutFeedback
  ): Promise<{ success: boolean; warnings?: string[] }> {
    try {
      // וידואי המשוב
      const validation = this.validateFeedback(feedback);
      const finalFeedback = validation.correctedFeedback || feedback;

      // שמירה
      const feedbackWithId = {
        workoutId,
        feedback: finalFeedback,
        savedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        `${this.FEEDBACK_STORAGE_KEY}_${workoutId}`,
        JSON.stringify(feedbackWithId)
      );

      return {
        success: true,
        warnings:
          validation.warnings.length > 0 ? validation.warnings : undefined,
      };
    } catch (error) {
      const result = await workoutErrorHandlingService.handleDataLoadError(
        error,
        "feedback_save"
      );

      return {
        success: result.success,
        warnings: result.message ? [result.message] : undefined,
      };
    }
  }

  /**
   * טעינת משוב לאימון ספציפי
   */
  async getFeedback(workoutId: string): Promise<WorkoutFeedback | null> {
    try {
      const data = await AsyncStorage.getItem(
        `${this.FEEDBACK_STORAGE_KEY}_${workoutId}`
      );
      if (!data) return null;

      const parsed = JSON.parse(data);
      const validation = this.validateFeedback(parsed.feedback);

      return validation.correctedFeedback || parsed.feedback;
    } catch (error) {
      const result = await workoutErrorHandlingService.handleDataLoadError(
        error,
        "feedback_load"
      );

      return result.success ? result.data : null;
    }
  }

  /**
   * חישוב מדדי משוב (מבוסס על הסטטיסטיקות בהיסטוריה)
   */
  async calculateFeedbackMetrics(
    workouts: WorkoutWithFeedback[]
  ): Promise<FeedbackMetrics> {
    try {
      if (!workouts || workouts.length === 0) {
        return {
          averageDifficulty: 3,
          mostCommonFeeling: "😐",
          completionTrend: "stable",
          personalRecordCount: 0,
        };
      }

      // חישוב ציון קושי ממוצע
      const validDifficulties = workouts
        .map((w) => w.feedback?.difficulty)
        .filter((d) => typeof d === "number" && !isNaN(d) && d >= 1 && d <= 5);

      const averageDifficulty =
        validDifficulties.length > 0
          ? validDifficulties.reduce((sum, d) => sum + d, 0) /
            validDifficulties.length
          : 3;

      // הרגשה הכי נפוצה
      const feelings = workouts.map((w) => w.feedback?.feeling).filter(Boolean);

      const feelingCounts: Record<string, number> = {};
      feelings.forEach((feeling) => {
        feelingCounts[feeling] = (feelingCounts[feeling] || 0) + 1;
      });

      const mostCommonFeeling = Object.keys(feelingCounts).reduce(
        (a, b) => (feelingCounts[a] > feelingCounts[b] ? a : b),
        "😐"
      );

      // מגמת השלמה
      const completionTrend = this.calculateCompletionTrend(workouts);

      // ספירת שיאים אישיים
      const personalRecordCount = workouts.reduce(
        (sum, w) => sum + (w.stats?.personalRecords || 0),
        0
      );

      return {
        averageDifficulty: Math.round(averageDifficulty * 10) / 10,
        mostCommonFeeling,
        completionTrend,
        personalRecordCount,
      };
    } catch (error) {
      console.error("Error calculating feedback metrics:", error);
      return {
        averageDifficulty: 3,
        mostCommonFeeling: "😐",
        completionTrend: "stable",
        personalRecordCount: 0,
      };
    }
  }

  /**
   * חישוב מגמת השלמה
   */
  private calculateCompletionTrend(
    workouts: WorkoutWithFeedback[]
  ): "improving" | "stable" | "declining" {
    if (workouts.length < 3) return "stable";

    try {
      // חישוב יחס השלמת סטים עבור האימונים האחרונים
      const recentWorkouts = workouts.slice(0, 5); // 5 האחרונים
      const completionRates = recentWorkouts.map((w) => {
        const completed = w.stats?.totalSets || 0;
        const planned = w.stats?.totalPlannedSets || 1;
        return completed / planned;
      });

      if (completionRates.length < 2) return "stable";

      // השוואה בין התחלה לסוף
      const firstHalf = completionRates.slice(
        0,
        Math.ceil(completionRates.length / 2)
      );
      const secondHalf = completionRates.slice(
        Math.floor(completionRates.length / 2)
      );

      const firstAvg =
        firstHalf.reduce((sum, rate) => sum + rate, 0) / firstHalf.length;
      const secondAvg =
        secondHalf.reduce((sum, rate) => sum + rate, 0) / secondHalf.length;

      const difference = secondAvg - firstAvg;

      if (difference > 0.1) return "improving";
      if (difference < -0.1) return "declining";
      return "stable";
    } catch {
      return "stable";
    }
  }

  /**
   * ניקוי משוב ישן
   */
  async cleanOldFeedback(olderThanDays: number = 90): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const feedbackKeys = keys.filter((key) =>
        key.startsWith(this.FEEDBACK_STORAGE_KEY)
      );

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      for (const key of feedbackKeys) {
        try {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            const savedDate = new Date(parsed.savedAt);

            if (savedDate < cutoffDate) {
              await AsyncStorage.removeItem(key);
              console.log("🧹 Removed old feedback:", key);
            }
          }
        } catch (error) {
          // אם יש שגיאה בקריאה, מחק את הפריט
          await AsyncStorage.removeItem(key);
          console.warn("🗑️ Removed corrupted feedback:", key);
        }
      }
    } catch (error) {
      console.error("Error cleaning old feedback:", error);
    }
  }

  /**
   * יצוא נתוני משוב לניתוח
   */
  async exportFeedbackData(): Promise<any[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const feedbackKeys = keys.filter((key) =>
        key.startsWith(this.FEEDBACK_STORAGE_KEY)
      );

      const allFeedback = await AsyncStorage.multiGet(feedbackKeys);

      return allFeedback
        .map(([key, value]) => {
          try {
            return value ? JSON.parse(value) : null;
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error exporting feedback data:", error);
      return [];
    }
  }
}

export default WorkoutFeedbackService.getInstance();
