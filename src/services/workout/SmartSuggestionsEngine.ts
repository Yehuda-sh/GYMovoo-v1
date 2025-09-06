/**
 * Smart Suggestions Engine - פשוט ויעיל
 * מנוע הצעות בסיסי לאימונים
 */

import { logger } from "../../utils/logger";
import { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { workoutStorageService } from "./workoutStorageService";
import { progressiveOverloadService } from "./ProgressiveOverloadService";
import { WorkoutPlanRequest, WorkoutDay } from "./types";

export interface SimpleSuggestion {
  id: string;
  title: string;
  description: string;
  type: "exercise" | "equipment" | "variety" | "progression";
}

export interface SuggestionResult {
  suggestions: SimpleSuggestion[];
  tips: string[];
}

class SmartSuggestionsEngine {
  /**
   * קבל הצעות פשוטות לאימון
   */
  async generateSuggestions(
    request: WorkoutPlanRequest
  ): Promise<SuggestionResult> {
    try {
      const history = await workoutStorageService.getHistory();
      const suggestions: SimpleSuggestion[] = [];
      const tips: string[] = [];

      // הצעות לפי ציוד זמין
      if (request.equipment) {
        suggestions.push(...this.getEquipmentSuggestions(request.equipment));
      }

      // הצעות לפי משך זמן
      if (request.duration && request.duration < 30) {
        suggestions.push({
          id: "quick_workout",
          title: "אימון מהיר",
          description: "אימון יעיל ב-20 דקות",
          type: "variety",
        });
      }

      // הצעות התקדמות אם יש היסטוריה
      if (history.length >= 3) {
        const progressSuggestions =
          await this.getProgressionSuggestions(history);
        suggestions.push(...progressSuggestions);
      }

      // טיפים כלליים
      tips.push(...this.getGeneralTips());

      return { suggestions, tips };
    } catch (error) {
      logger.error(
        "SmartSuggestionsEngine",
        "Failed to generate suggestions",
        error
      );
      return this.getDefaultSuggestions();
    }
  }

  /**
   * הצעות לפי ציוד זמין
   */
  private getEquipmentSuggestions(equipment: string[]): SimpleSuggestion[] {
    const suggestions: SimpleSuggestion[] = [];

    if (equipment.includes("dumbbells")) {
      suggestions.push({
        id: "dumbbell_focus",
        title: "מיקוד במשקולות",
        description: "נצל את המשקולות לאימון כוח יעיל",
        type: "equipment",
      });
    }

    if (equipment.includes("bodyweight")) {
      suggestions.push({
        id: "bodyweight_focus",
        title: "אימון משקל גוף",
        description: "אימון יעיל ללא ציוד נוסף",
        type: "equipment",
      });
    }

    if (equipment.includes("resistance_bands")) {
      suggestions.push({
        id: "bands_variation",
        title: "גיוון עם גומיות",
        description: "הוסף גומיות לחיזוק שרירי הליבה",
        type: "equipment",
      });
    }

    return suggestions;
  }

  /**
   * הצעות התקדמות מההיסטוריה
   */
  private async getProgressionSuggestions(
    history: WorkoutWithFeedback[]
  ): Promise<SimpleSuggestion[]> {
    const suggestions: SimpleSuggestion[] = [];

    try {
      // קבל אימון אחרון
      const lastWorkout = history[0];
      if (!lastWorkout?.workout.exercises) return suggestions;

      // בדוק תרגילים שחוזרים על עצמם
      const exerciseFrequency: Record<string, number> = {};
      history.slice(0, 5).forEach((workout) => {
        workout.workout.exercises?.forEach((exercise) => {
          exerciseFrequency[exercise.id] =
            (exerciseFrequency[exercise.id] || 0) + 1;
        });
      });

      // אם יש תרגילים שחוזרים הרבה - הצע גיוון
      const repetitiveExercises = Object.entries(exerciseFrequency)
        .filter(([_, count]) => count >= 4)
        .map(([exerciseId]) => exerciseId);

      if (repetitiveExercises.length > 0) {
        suggestions.push({
          id: "add_variety",
          title: "הוסף גיוון",
          description: "נסה תרגילים חדשים לאותן קבוצות שרירים",
          type: "variety",
        });
      }

      // בדוק אם יש צורך בהתקדמות
      const exerciseToCheck = lastWorkout.workout.exercises[0];
      if (exerciseToCheck) {
        const progressSuggestion =
          await progressiveOverloadService.getProgressionSuggestion(
            exerciseToCheck.id
          );

        if (progressSuggestion && progressSuggestion.action !== "maintain") {
          suggestions.push({
            id: `progress_${exerciseToCheck.id}`,
            title: "זמן להתקדמות",
            description: progressSuggestion.reason,
            type: "progression",
          });
        }
      }

      return suggestions;
    } catch (error) {
      logger.error(
        "SmartSuggestionsEngine",
        "Failed to get progression suggestions",
        error
      );
      return suggestions;
    }
  }

  /**
   * טיפים כלליים
   */
  private getGeneralTips(): string[] {
    const allTips = [
      "שמור על עקביות - זה חשוב יותר מעצמה",
      "תשתה מים לפני, במהלך ואחרי האימון",
      "חימום של 5-10 דקות מונע פציעות",
      "תקליט את הביצועים שלך לעקב אחר התקדמות",
      "תן לגוף שלך זמן להתאושש בין אימונים",
      "התמקד בטכניקה תקינה לפני הגברת משקל",
      "מתיחות אחרי האימון משפרת גמישות",
      "שינה איכותית חיונית לשחזור השרירים",
    ];

    // החזר 3 טיפים אקראיים
    const shuffled = allTips.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  /**
   * הצעות ברירת מחדל
   */
  private getDefaultSuggestions(): SuggestionResult {
    return {
      suggestions: [
        {
          id: "basic_start",
          title: "התחל בפשטות",
          description: "בחר 3-4 תרגילים בסיסיים ותתמקד בטכניקה",
          type: "exercise",
        },
        {
          id: "consistency",
          title: "שמור על עקביות",
          description: "אמן 3 פעמים בשבוע לתוצאות מיטביות",
          type: "variety",
        },
      ],
      tips: [
        "ההתחלה היא החלק הקשה ביותר",
        "כל התקדמות היא התקדמות",
        "תאמן בקצב שלך ותהנה מהתהליך",
      ],
    };
  }

  /**
   * קבל המלצות אישיות פשוטות
   */
  async getPersonalizedRecommendations(): Promise<{
    todaysFocus: string;
    weeklyGoal: string;
    motivationalTip: string;
  }> {
    try {
      const history = await workoutStorageService.getHistory();

      if (history.length === 0) {
        return {
          todaysFocus: "התחל עם אימון קצר של 20 דקות",
          weeklyGoal: "השלם 3 אימונים ראשונים השבוע",
          motivationalTip: "המסע של אלף מייל מתחיל בצעד אחד! 🚀",
        };
      }

      const recentWorkouts = history.slice(0, 7); // שבוע אחרון
      const daysSinceLastWorkout = history[0]
        ? this.getDaysSinceLastWorkout(history[0])
        : 999;

      return {
        todaysFocus: this.getTodaysFocus(daysSinceLastWorkout),
        weeklyGoal: `השלם ${Math.max(1, 4 - recentWorkouts.length)} אימונים נוספים השבוע`,
        motivationalTip: this.getRandomMotivationalTip(),
      };
    } catch (error) {
      logger.error(
        "SmartSuggestionsEngine",
        "Failed to get recommendations",
        error
      );
      return {
        todaysFocus: "התחל עם אימון בסיסי",
        weeklyGoal: "שמור על עקביות",
        motivationalTip: "אתה יכול! 💪",
      };
    }
  }

  /**
   * חשב ימים מהאימון האחרון
   */
  private getDaysSinceLastWorkout(lastWorkout: WorkoutWithFeedback): number {
    const lastWorkoutDate = new Date(lastWorkout.workout.startTime);
    const now = new Date();
    return Math.floor(
      (now.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  /**
   * מיקוד לאימון היום
   */
  private getTodaysFocus(daysSinceLastWorkout: number): string {
    if (daysSinceLastWorkout === 0) return "מנוחה פעילה - מתיחות או הליכה קלה";
    if (daysSinceLastWorkout === 1) return "אימון בעצמה בינונית";
    if (daysSinceLastWorkout >= 3) return "חזרה הדרגתית לאימונים";
    return "אימון רגיל לפי התוכנית";
  }

  /**
   * טיפ מוטיבציה אקראי
   */
  private getRandomMotivationalTip(): string {
    const tips: readonly string[] = [
      "כל אימון הוא צעד קדימה 💪",
      "עקביות חשובה יותר מעצמה 🎯",
      "האתגרים של היום הם הכוח של מחר ⚡",
      "הגוף שלך יכול - המוח שלך צריך להאמין 🧠",
      "כל התחלה קשה, אבל סיום מתגמל 🏆",
    ] as const;

    return tips[Math.floor(Math.random() * tips.length)] || "אתה יכול! 💪";
  }

  /**
   * החל הצעה על תוכנית אימון
   */
  async applySuggestion(
    suggestionId: string,
    currentWorkout: WorkoutDay
  ): Promise<WorkoutDay> {
    // יישום פשוט - בעיקר להחזיר את האימון כמו שהוא
    logger.info(
      "SmartSuggestionsEngine",
      `Applied suggestion: ${suggestionId}`
    );
    return currentWorkout;
  }
}

export const smartSuggestionsEngine = new SmartSuggestionsEngine();
