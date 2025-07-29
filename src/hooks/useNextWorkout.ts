/**
 * @file src/hooks/useNextWorkout.ts
 * @description Hook לקבלת האימון הבא במחזור
 * English: Hook for getting the next workout in cycle
 */

import { useState, useEffect, useCallback } from "react";
import {
  nextWorkoutLogicService,
  NextWorkoutRecommendation,
} from "../services/nextWorkoutLogicService";
import { useUserStore } from "../stores/userStore";
import { ExtendedQuestionnaireAnswers } from "../data/extendedQuestionnaireData";

export interface UseNextWorkoutReturn {
  nextWorkout: NextWorkoutRecommendation | null;
  isLoading: boolean;
  error: string | null;
  refreshRecommendation: () => Promise<void>;
  markWorkoutCompleted: (
    workoutIndex: number,
    workoutName: string
  ) => Promise<void>;
  cycleStats: {
    currentWeek: number;
    totalWorkouts: number;
    daysInProgram: number;
    consistency: number;
  } | null;
}

/**
 * Hook לניהול האימון הבא במחזור
 * Hook for managing next workout in cycle
 */
export const useNextWorkout = (workoutPlan?: any) => {
  const { user } = useUserStore();
  const [nextWorkout, setNextWorkout] =
    useState<NextWorkoutRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true); // התחל עם true
  const [error, setError] = useState<string | null>(null);
  const [cycleStats, setCycleStats] = useState<any>(null);

  /**
   * יצירת תוכנית שבועית מהנתונים
   * Create weekly plan from data
   */
  const getWeeklyPlanFromData = useCallback(() => {
    // אם יש תוכנית ספציפית, השתמש בה
    if (workoutPlan?.workouts) {
      return workoutPlan.workouts.map((w: any) => w.name);
    }

    // מיפוי WORKOUT_DAYS (כמו בWorkoutPlansScreen)
    const WORKOUT_DAYS_MAP = {
      1: ["אימון מלא"],
      2: ["פלג גוף עליון", "פלג גוף תחתון"],
      3: ["דחיפה", "משיכה", "רגליים"],
      4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
      5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
      6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
    };

    // אם יש נתוני משתמש מהשאלון, צור תוכנית לפי התדירות
    if (user?.questionnaireData?.answers || user?.questionnaire) {
      // שימוש בנתונים החדשים או הישנים
      const questionnaire =
        user.questionnaireData?.answers || user.questionnaire;

      let frequency: string = "";

      // טיפול בפורמט החדש (QuestionnaireAnswers)
      if (user?.questionnaireData?.answers) {
        const answers = user.questionnaireData.answers as any;
        frequency = answers.frequency || "";
      }
      // טיפול בפורמט הישן (מספרים כמפתחות)
      else if (user?.questionnaire) {
        // מציאת תדירות לפי מפתחות ידועים
        Object.entries(user.questionnaire).forEach(([key, value]) => {
          const keyNum = parseInt(key);
          if (keyNum >= 4 && keyNum <= 6 && typeof value === "string") {
            if (value.includes("פעמים") || value.includes("times")) {
              frequency = value;
            }
          }
        });
      }

      // המרת התדירות למספר ימים
      let daysPerWeek = 3; // ברירת מחדל
      if (frequency === "2_times" || frequency === "1-2 פעמים בשבוע") {
        daysPerWeek = 2;
      } else if (frequency === "3_times" || frequency === "3-4 פעמים בשבוע") {
        daysPerWeek = 3;
      } else if (frequency === "4_times") {
        daysPerWeek = 4;
      } else if (frequency === "5_times" || frequency === "5-6 פעמים בשבוע") {
        daysPerWeek = 5;
      } else if (frequency === "6_times" || frequency === "כל יום") {
        daysPerWeek = 6;
      }

      // החזרת התוכנית המתאימה
      return (
        WORKOUT_DAYS_MAP[daysPerWeek as keyof typeof WORKOUT_DAYS_MAP] ||
        WORKOUT_DAYS_MAP[3]
      );
    }

    // ברירת מחדל
    return WORKOUT_DAYS_MAP[3]; // דחיפה, משיכה, רגליים
  }, [workoutPlan, user]);

  /**
   * רענון המלצת האימון הבא
   * Refresh next workout recommendation
   */
  const refreshRecommendation = useCallback(async () => {
    try {
      // אל תכניס loading אם כבר טוען
      if (!isLoading) {
        setIsLoading(true);
      }
      setError(null);

      const weeklyPlan = getWeeklyPlanFromData();
      console.log(
        "🔄 Getting next workout recommendation with plan:",
        weeklyPlan
      );

      // בדיקת בטיחות - וידוא שהשירות קיים
      if (
        !nextWorkoutLogicService ||
        typeof nextWorkoutLogicService.getNextWorkoutRecommendation !==
          "function"
      ) {
        throw new Error("nextWorkoutLogicService is not properly initialized");
      }

      // הרץ במקביל
      const [recommendation, stats] = await Promise.all([
        nextWorkoutLogicService.getNextWorkoutRecommendation(weeklyPlan),
        nextWorkoutLogicService.getCycleStatistics(),
      ]);

      setNextWorkout(recommendation);
      setCycleStats(stats);

      console.log("✅ Next workout recommendation:", recommendation);
      console.log("📊 Cycle stats:", stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("❌ Error getting next workout:", err);

      // במקרה של שגיאה, צור המלצה בסיסית
      const fallbackPlan = getWeeklyPlanFromData();
      const fallbackRecommendation = {
        workoutName: fallbackPlan[0] || "דחיפה",
        workoutIndex: 0,
        reason: "אימון ברירת מחדל בגלל שגיאה טכנית",
        isRegularProgression: true,
        daysSinceLastWorkout: 0,
        suggestedIntensity: "normal" as const,
      };
      setNextWorkout(fallbackRecommendation);
    } finally {
      setIsLoading(false);
    }
  }, [getWeeklyPlanFromData, isLoading]);

  /**
   * סימון אימון כהושלם
   * Mark workout as completed
   */
  const markWorkoutCompleted = useCallback(
    async (workoutIndex: number, workoutName: string) => {
      try {
        // בדיקת בטיחות
        if (
          !nextWorkoutLogicService ||
          typeof nextWorkoutLogicService.updateWorkoutCompleted !== "function"
        ) {
          console.error(
            "❌ nextWorkoutLogicService is not properly initialized"
          );
          return;
        }

        await nextWorkoutLogicService.updateWorkoutCompleted(
          workoutIndex,
          workoutName
        );
        console.log(
          `✅ Marked workout completed: ${workoutName} (index ${workoutIndex})`
        );

        // רענון המלצה לאחר השלמת אימון
        await refreshRecommendation();
      } catch (err) {
        console.error("❌ Error marking workout completed:", err);
      }
    },
    [refreshRecommendation]
  );

  /**
   * טעינה ראשונית
   * Initial load
   */
  useEffect(() => {
    refreshRecommendation();
  }, [refreshRecommendation]);

  return {
    nextWorkout,
    isLoading,
    error,
    refreshRecommendation,
    markWorkoutCompleted,
    cycleStats,
  };
};
