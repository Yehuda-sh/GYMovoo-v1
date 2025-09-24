/**
 * @file /src/screens/main/utils/aiRecommendationEngine.ts
 * @description מנוע המלצות חכמות מבוסס נתוני אימון והתנהגות משתמש
 */

import { logger } from "../../../utils/logger";
import type {
  AIRecommendation,
  WorkoutPattern,
} from "../types/aiRecommendations.types";
import type { WorkoutHistoryItem } from "../../../core/types/user.types";

/** המרה בטוחה למילישניות מתוך string | Date | unknown */
const toTime = (val: unknown): number => {
  if (typeof val === "string") {
    const t = Date.parse(val);
    return Number.isFinite(t) ? t : 0;
  }
  if (val instanceof Date) {
    const t = val.getTime();
    return Number.isFinite(t) ? t : 0;
  }
  return 0;
};

/** החזרת timestamp מהימן עבור רשומת אימון (מעדיף completedAt) */
const getWorkoutTime = (w: WorkoutHistoryItem | undefined): number => {
  if (!w) return 0;
  const tCompleted = toTime(w.completedAt as unknown);
  const tDate = toTime(w.date as unknown);
  return tCompleted || tDate || 0;
};

/** ממיין היסטוריה מהחדש לישן; ערכים ללא זמן בר תוקף ירדו לסוף */
const sortHistoryDesc = (
  history: WorkoutHistoryItem[]
): WorkoutHistoryItem[] => {
  const copy = [...history];
  copy.sort((a, b) => getWorkoutTime(b) - getWorkoutTime(a));
  return copy;
};

/** הבדל ימים בין שני timestamps (עיגול מטה) */
const diffDays = (aMs: number, bMs: number): number => {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(Math.abs(aMs - bMs) / oneDay);
};

export class AIRecommendationEngine {
  private static instance: AIRecommendationEngine;

  public static getInstance(): AIRecommendationEngine {
    if (!AIRecommendationEngine.instance) {
      AIRecommendationEngine.instance = new AIRecommendationEngine();
    }
    return AIRecommendationEngine.instance;
  }

  public async generateRecommendations(
    workoutHistory: WorkoutHistoryItem[],
    _userPreferences?: Record<string, unknown>
  ): Promise<AIRecommendation[]> {
    try {
      const history = sortHistoryDesc(workoutHistory).slice(0, 60);
      const recommendations: AIRecommendation[] = [];
      const pattern = this.analyzeWorkoutPattern(history);

      const restRecommendation = this.generateRestRecommendation(history);
      if (restRecommendation) recommendations.push(restRecommendation);

      const intensityRecommendation =
        this.generateIntensityRecommendation(pattern);
      if (intensityRecommendation)
        recommendations.push(intensityRecommendation);

      const balanceRecommendation = this.generateBalanceRecommendation(pattern);
      if (balanceRecommendation) recommendations.push(balanceRecommendation);

      const nutritionRecommendation =
        this.generateNutritionRecommendation(pattern);
      if (nutritionRecommendation)
        recommendations.push(nutritionRecommendation);

      const sleepRecommendation = this.generateSleepRecommendation();
      if (sleepRecommendation) recommendations.push(sleepRecommendation);

      return recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 } as const;
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

  private analyzeWorkoutPattern(history: WorkoutHistoryItem[]): WorkoutPattern {
    const recentHistory = history.slice(0, 30);

    const frequencyPerWeek = this.calculateWeeklyFrequency(recentHistory);

    const averageDuration =
      recentHistory.reduce((sum, w) => sum + (w.duration || 45), 0) /
      (recentHistory.length || 1);

    const preferredTimes = this.analyzePreferredTimes(recentHistory);

    const muscleGroupFrequency = this.analyzeMuscleFrequency(recentHistory);

    const difficultyTrend = this.analyzeDifficultyTrend(recentHistory);

    const consistencyScore = this.calculateConsistencyScore(recentHistory);

    return {
      frequencyPerWeek,
      averageDuration,
      preferredTimes,
      muscleGroupFrequency,
      difficultyTrend,
      consistencyScore,
    };
  }

  private generateRestRecommendation(
    history: WorkoutHistoryItem[]
  ): AIRecommendation | null {
    const lastWorkout = history[0];
    if (!lastWorkout) return null;

    const lastTime = getWorkoutTime(lastWorkout);
    if (!lastTime) return null;

    const daysSinceLastWorkout = diffDays(Date.now(), lastTime);
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
        description: `אתה מתאמן רק ${pattern.frequencyPerWeek.toFixed(
          1
        )} פעמים בשבוע`,
        action: "הוסף עוד יום אימון השבוע",
        priority: "low",
        icon: "calendar-plus",
        color: "#4ecdc4",
        timestamp: new Date().toISOString(),
      };
    }

    return null;
  }

  private generateBalanceRecommendation(
    pattern: WorkoutPattern
  ): AIRecommendation | null {
    const entries = Object.entries(pattern.muscleGroupFrequency);
    if (entries.length === 0) return null;

    const leastTrained = entries.reduce((min, cur) =>
      cur[1] < min[1] ? cur : min
    );

    const total = entries.reduce((s, [, v]) => s + v, 0);
    const avg = total / (entries.length || 1);
    if (leastTrained[1] < Math.max(1, avg / 2)) {
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

  private generateSleepRecommendation(): AIRecommendation | null {
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

  /** חישוב תדירות שבועית על בסיס טווח תאריכים אמיתי */
  private calculateWeeklyFrequency(history: WorkoutHistoryItem[]): number {
    if (history.length === 0) return 0;

    const sorted = sortHistoryDesc(history);

    // מצא את ה-timestamp התקף הראשון והאחרון
    let tLast = 0; // החדש ביותר
    for (let i = 0; i < sorted.length; i++) {
      tLast = getWorkoutTime(sorted[i]);
      if (tLast) break;
    }
    let tFirst = 0; // הישן ביותר
    for (let i = sorted.length - 1; i >= 0; i--) {
      tFirst = getWorkoutTime(sorted[i]);
      if (tFirst) break;
    }

    if (!tFirst || !tLast) {
      // fallback שמרני
      const weeks = Math.max(1, Math.ceil(history.length / 7));
      return history.length / weeks;
    }

    const daysSpan = Math.max(1, diffDays(tLast, tFirst) + 1);
    const weeks = Math.max(1, daysSpan / 7);
    return history.length / weeks;
  }

  private analyzePreferredTimes(_history: WorkoutHistoryItem[]): string[] {
    return ["morning", "evening"];
  }

  private analyzeMuscleFrequency(
    history: WorkoutHistoryItem[]
  ): Record<string, number> {
    const freq: Record<string, number> = {};
    history.forEach((w) => {
      const key = (w.name || w.workoutName || "כללי").trim();
      if (!key) return;
      freq[key] = (freq[key] || 0) + 1;
    });
    return freq;
  }

  private analyzeDifficultyTrend(
    history: WorkoutHistoryItem[]
  ): "increasing" | "decreasing" | "stable" {
    if (history.length < 5) return "stable";

    const recent = history.slice(0, 5);
    const older = history.slice(5, 10);

    const avg = (arr: WorkoutHistoryItem[]) =>
      arr.length
        ? arr.reduce((s, w) => s + (w.rating ?? 3), 0) / arr.length
        : 0;

    const recentAvg = avg(recent);
    const olderAvg = older.length ? avg(older) : recentAvg;

    if (recentAvg > olderAvg + 0.5) return "increasing";
    if (recentAvg < olderAvg - 0.5) return "decreasing";
    return "stable";
  }

  /** ציון עקביות לפי פערים בין אימונים (ימים) */
  private calculateConsistencyScore(history: WorkoutHistoryItem[]): number {
    const sorted = sortHistoryDesc(history);
    if (sorted.length < 2) return sorted.length * 10;

    const gaps: number[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = getWorkoutTime(sorted[i]);
      const b = getWorkoutTime(sorted[i + 1]);
      if (a && b) {
        gaps.push(diffDays(a, b));
      }
    }

    if (gaps.length === 0) return 50;

    const avgGap = gaps.reduce((s, g) => s + g, 0) / gaps.length;
    return Math.max(0, Math.min(100, Math.round(100 - (avgGap - 1) * 20)));
  }

  /** ספירת ימים רצופים של אימון עד היום */
  private calculateConsecutiveWorkoutDays(
    history: WorkoutHistoryItem[]
  ): number {
    const sorted = sortHistoryDesc(history);
    let consecutive = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = +today;

    for (let i = 0; i < sorted.length; i++) {
      const t = getWorkoutTime(sorted[i]);
      if (!t) {
        // רשומה בלי זמן: מדלגים, לא שוברים רצף
        continue;
      }

      const d = new Date(t);
      d.setHours(0, 0, 0, 0);
      const daysDiff = diffDays(+d, todayMs);

      if (daysDiff === consecutive) {
        consecutive++;
      } else if (daysDiff > consecutive) {
        // מצאנו פער גדול מהרצף הנוכחי → מפסיקים
        break;
      } else {
        // daysDiff < consecutive → רשומה ישנה יותר; ממשיכים לבדוק את הבאה
        continue;
      }
    }

    return consecutive;
  }
}
