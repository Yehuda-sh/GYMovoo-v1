/**
 * @file aiRecommendationEngine.ts
 * @description מנוע המלצות חכמות מבוסס נתוני אימון והתנהגות משתמש
 */

import { logger } from "../../../utils/logger";
import type {
  AIRecommendation,
  WorkoutPattern,
} from "../types/aiRecommendations.types";
import type { WorkoutHistoryItem } from "../../../core/types/user.types";

/**
 * יצירת המלצות AI מבוססות היסטוריית אימונים
 */
export class AIRecommendationEngine {
  private static instance: AIRecommendationEngine;

  public static getInstance(): AIRecommendationEngine {
    if (!AIRecommendationEngine.instance) {
      AIRecommendationEngine.instance = new AIRecommendationEngine();
    }
    return AIRecommendationEngine.instance;
  }

  /**
   * יצירת המלצות מבוססות היסטוריה
   */
  public async generateRecommendations(
    workoutHistory: WorkoutHistoryItem[],
    _userPreferences?: Record<string, unknown>
  ): Promise<AIRecommendation[]> {
    try {
      const recommendations: AIRecommendation[] = [];
      const pattern = this.analyzeWorkoutPattern(workoutHistory);

      // המלצה 1: מנוחה והתאוששות
      const restRecommendation =
        this.generateRestRecommendation(workoutHistory);
      if (restRecommendation) recommendations.push(restRecommendation);

      // המלצה 2: עוצמת אימון
      const intensityRecommendation =
        this.generateIntensityRecommendation(pattern);
      if (intensityRecommendation)
        recommendations.push(intensityRecommendation);

      // המלצה 3: איזון קבוצות שרירים
      const balanceRecommendation = this.generateBalanceRecommendation(pattern);
      if (balanceRecommendation) recommendations.push(balanceRecommendation);

      // המלצה 4: תזונה
      const nutritionRecommendation =
        this.generateNutritionRecommendation(pattern);
      if (nutritionRecommendation)
        recommendations.push(nutritionRecommendation);

      // המלצה 5: שינה
      const sleepRecommendation = this.generateSleepRecommendation();
      if (sleepRecommendation) recommendations.push(sleepRecommendation);

      // מיון לפי עדיפות
      return recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      logger.error(
        "AIRecommendationEngine",
        "Error generating recommendations",
        error
      );
      return [];
    }
  }

  /**
   * ניתוח דפוסי אימון
   */
  private analyzeWorkoutPattern(history: WorkoutHistoryItem[]): WorkoutPattern {
    const recentHistory = history.slice(0, 30); // 30 אימונים אחרונים

    // חישוב תדירות שבועית
    const weeklyFrequency = this.calculateWeeklyFrequency(recentHistory);

    // חישוב משך ממוצע
    const averageDuration =
      recentHistory.reduce((sum, w) => sum + (w.duration || 45), 0) /
      recentHistory.length;

    // ניתוח זמנים מועדפים
    const preferredTimes = this.analyzePreferredTimes(recentHistory);

    // ניתוח תדירות קבוצות שרירים
    const muscleGroupFrequency = this.analyzeMuscleFrequency(recentHistory);

    // מגמת קושי
    const difficultyTrend = this.analyzeDifficultyTrend(recentHistory);

    // ציון עקביות
    const consistencyScore = this.calculateConsistencyScore(recentHistory);

    return {
      frequencyPerWeek: weeklyFrequency,
      averageDuration,
      preferredTimes,
      muscleGroupFrequency,
      difficultyTrend,
      consistencyScore,
    };
  }

  /**
   * המלצת מנוחה
   */
  private generateRestRecommendation(
    history: WorkoutHistoryItem[]
  ): AIRecommendation | null {
    const lastWorkout = history[0];
    if (!lastWorkout) return null;

    const daysSinceLastWorkout = Math.floor(
      (Date.now() - new Date(lastWorkout.date).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const consecutiveDays = this.calculateConsecutiveWorkoutDays(history);

    if (daysSinceLastWorkout > 7) {
      return {
        id: "rest_too_long",
        type: "rest_recovery",
        title: "זמן לחזור לאימונים! 💪",
        description: `עברו ${daysSinceLastWorkout} ימים מהאימון האחרון שלך`,
        action: "התחל אימון קל היום",
        priority: "high",
        icon: "play-circle",
        color: "#4ecdc4",
        timestamp: new Date().toISOString(),
      };
    }

    if (consecutiveDays >= 5) {
      return {
        id: "rest_needed",
        type: "rest_recovery",
        title: "הגוף שלך זקוק למנוחה 😴",
        description: `אימנת ${consecutiveDays} ימים ברצף`,
        action: "קח יום מנוחה או אימון קל",
        priority: "medium",
        icon: "sleep",
        color: "#ff6b6b",
        timestamp: new Date().toISOString(),
      };
    }

    return null;
  }

  /**
   * המלצת עוצמה
   */
  private generateIntensityRecommendation(
    pattern: WorkoutPattern
  ): AIRecommendation | null {
    if (
      pattern.difficultyTrend === "decreasing" &&
      pattern.consistencyScore > 70
    ) {
      return {
        id: "increase_intensity",
        type: "intensity",
        title: "הגיע הזמן להעלות רמה! 🚀",
        description: "האימונים האחרונים שלך היו קלים יחסית",
        action: "נסה אימון מאתגר יותר",
        priority: "medium",
        icon: "trending-up",
        color: "#ffd93d",
        timestamp: new Date().toISOString(),
      };
    }

    if (pattern.frequencyPerWeek < 2) {
      return {
        id: "increase_frequency",
        type: "intensity",
        title: "בוא נגביר קצב 📈",
        description: `אתה מתאמן רק ${pattern.frequencyPerWeek.toFixed(1)} פעמים בשבוע`,
        action: "הוסף עוד יום אימון השבוע",
        priority: "low",
        icon: "calendar-plus",
        color: "#4ecdc4",
        timestamp: new Date().toISOString(),
      };
    }

    return null;
  }

  /**
   * המלצת איזון
   */
  private generateBalanceRecommendation(
    pattern: WorkoutPattern
  ): AIRecommendation | null {
    const muscleGroups = Object.entries(pattern.muscleGroupFrequency);

    if (muscleGroups.length === 0) return null;

    // מציאת הקבוצה הכי מוזנחת
    const leastTrained = muscleGroups.reduce((min, current) =>
      current[1] < min[1] ? current : min
    );

    // אם יש קבוצת שרירים שלא אומנה מזמן
    if (
      leastTrained[1] <
      Math.max(
        1,
        Object.values(pattern.muscleGroupFrequency).reduce((a, b) => a + b, 0) /
          muscleGroups.length /
          2
      )
    ) {
      return {
        id: "balance_muscles",
        type: "balance",
        title: "איזון האימונים שלך ⚖️",
        description: `לא אימנת ${leastTrained[0]} לאחרונה`,
        action: `הוסף תרגילי ${leastTrained[0]} לאימון הבא`,
        priority: "low",
        icon: "scale-balance",
        color: "#8e44ad",
        timestamp: new Date().toISOString(),
      };
    }

    return null;
  }

  /**
   * המלצת תזונה
   */
  private generateNutritionRecommendation(
    pattern: WorkoutPattern
  ): AIRecommendation | null {
    if (pattern.frequencyPerWeek >= 4) {
      return {
        id: "nutrition_active",
        type: "nutrition",
        title: "תזונה לספורטאי פעיל 🥗",
        description: "אתה מתאמן הרבה - הגוף שלך זקוק לדלק איכותי",
        action: "וודא צריכת חלבון מספקת",
        priority: "low",
        icon: "food-apple",
        color: "#2ecc71",
        timestamp: new Date().toISOString(),
      };
    }

    return null;
  }

  /**
   * המלצת שינה
   */
  private generateSleepRecommendation(): AIRecommendation | null {
    // לעכשיו המלצה כללית - בעתיד נוכל לחבר לנתוני שינה אמיתיים
    return {
      id: "sleep_recovery",
      type: "sleep",
      title: "שינה איכותית = התאוששות מהירה 🌙",
      description: "שינה טובה חיונית להתאוששות ולבניית שריר",
      action: "כוון ל-7-8 שעות שינה בלילה",
      priority: "low",
      icon: "weather-night",
      color: "#3f51b5",
      timestamp: new Date().toISOString(),
    };
  }

  // Helper methods
  private calculateWeeklyFrequency(history: WorkoutHistoryItem[]): number {
    if (history.length === 0) return 0;

    const weeks = Math.max(1, Math.ceil(history.length / 7));
    return history.length / weeks;
  }

  private analyzePreferredTimes(_history: WorkoutHistoryItem[]): string[] {
    // ניתוח זמנים מועדפים (דוגמה)
    return ["morning", "evening"];
  }

  private analyzeMuscleFrequency(
    history: WorkoutHistoryItem[]
  ): Record<string, number> {
    const frequency: Record<string, number> = {};

    history.forEach((workout) => {
      // בהעדר targetMuscles, נשתמש בשם התרגיל או 'כללי'
      const muscleGroups = [workout.name || "כללי"];
      muscleGroups.forEach((muscle: string) => {
        frequency[muscle] = (frequency[muscle] || 0) + 1;
      });
    });

    return frequency;
  }

  private analyzeDifficultyTrend(
    history: WorkoutHistoryItem[]
  ): "increasing" | "decreasing" | "stable" {
    if (history.length < 5) return "stable";

    const recent = history.slice(0, 5);
    const older = history.slice(5, 10);

    const recentAvg =
      recent.reduce((sum, w) => sum + (w.rating || 3), 0) / recent.length;
    const olderAvg =
      older.length > 0
        ? older.reduce((sum, w) => sum + (w.rating || 3), 0) / older.length
        : recentAvg;

    if (recentAvg > olderAvg + 0.5) return "increasing";
    if (recentAvg < olderAvg - 0.5) return "decreasing";
    return "stable";
  }

  private calculateConsistencyScore(history: WorkoutHistoryItem[]): number {
    if (history.length < 7) return history.length * 10;

    // חישוב ציון עקביות מבוסס על פערים בין אימונים
    const gaps = [];
    for (let i = 0; i < history.length - 1; i++) {
      const currentDate = history[i]?.date;
      const nextDate = history[i + 1]?.date;

      if (currentDate && nextDate) {
        const gap =
          Math.abs(
            new Date(currentDate).getTime() - new Date(nextDate).getTime()
          ) /
          (1000 * 60 * 60 * 24);
        gaps.push(gap);
      }
    }

    if (gaps.length === 0) return 50;

    const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;

    // ציון גבוה יותר לפערים קטנים יותר
    return Math.max(0, Math.min(100, 100 - (avgGap - 1) * 20));
  }

  private calculateConsecutiveWorkoutDays(
    history: WorkoutHistoryItem[]
  ): number {
    let consecutive = 0;
    const today = new Date();

    for (const workout of history) {
      const workoutDate = new Date(workout.date);
      const daysDiff = Math.floor(
        (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === consecutive) {
        consecutive++;
      } else {
        break;
      }
    }

    return consecutive;
  }
}
