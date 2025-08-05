/**
 * @file src/hooks/useNextWorkout.ts
 * @description Hook לקבלת האימון הבא במחזור עם אלגוריתם חכם
 * @description Hook for getting the next workout in cycle with smart algorithm
 * @notes משתמש במערכת השאלונים החדשה ובאלגוריתם ההתאמה החכם
 * @notes Uses the new questionnaire system and smart matching algorithm
 * @updated 2025-08-05 שיפור לוגינג ותמיכה במאגר התרגילים החדש
 */

import { useState, useEffect, useCallback } from "react";
import {
  nextWorkoutLogicService,
  NextWorkoutRecommendation,
} from "../services/nextWorkoutLogicService";
import { useUserStore } from "../stores/userStore";
import { WorkoutPlan } from "../screens/workout/types/workout.types";

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
export const useNextWorkout = (workoutPlan?: WorkoutPlan) => {
  const { user } = useUserStore();
  const [nextWorkout, setNextWorkout] =
    useState<NextWorkoutRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true); // התחל עם true
  const [error, setError] = useState<string | null>(null);
  const [cycleStats, setCycleStats] = useState<{
    currentWeek: number;
    totalWorkouts: number;
    daysInProgram: number;
    consistency: number;
  } | null>(null);

  /**
   * יצירת תוכנית שבועית מהנתונים עם תמיכה במערכת החדשה
   * Create weekly plan from data with support for new system
   */
  const getWeeklyPlanFromData = useCallback(() => {
    // אם יש תוכנית ספציפית, השתמש בה
    if (workoutPlan?.workouts) {
      return workoutPlan.workouts.map((w) => w.name);
    }

    // מיפוי WORKOUT_DAYS מותאם למערכת החדשה
    const WORKOUT_DAYS_MAP = {
      1: ["אימון מלא"],
      2: ["פלג גוף עליון", "פלג גוף תחתון"],
      3: ["דחיפה", "משיכה", "רגליים"],
      4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
      5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
      6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
    };

    // קבלת נתוני משתמש מהמערכת הקיימת עם תמיכה מורחבת
    const getUserFrequencyData = () => {
      console.log("🔍 useNextWorkout: Starting frequency data extraction...");

      // נסה מכל המקורות האפשריים
      let frequency = "";

      // תמיכה במערכת החדשה (אם תתווסף בעתיד)
      if (user?.smartQuestionnaireData?.answers?.availability) {
        const availability = user.smartQuestionnaireData.answers.availability;
        frequency = Array.isArray(availability)
          ? availability[0]
          : availability;
        console.log(
          "📊 useNextWorkout: Found frequency in smartQuestionnaireData:",
          frequency
        );
      }
      // תמיכה בשאלון המורחב (אם יתווסף בעתיד)
      else if (user?.trainingStats?.preferredWorkoutDays) {
        frequency = user.trainingStats.preferredWorkoutDays.toString();
        console.log(
          "📊 useNextWorkout: Found frequency in trainingStats:",
          frequency
        );
      }
      // תמיכה במערכת הנוכחית
      else if (user?.questionnaireData?.answers) {
        const answers = user.questionnaireData.answers as Record<
          string,
          unknown
        >;
        frequency = (answers.frequency as string) || "";
        console.log(
          "📊 useNextWorkout: Found frequency in questionnaireData:",
          frequency
        );
      }
      // תמיכה בפורמט הישן
      else if (user?.questionnaire) {
        Object.entries(user.questionnaire).forEach(([key, value]) => {
          const keyNum = parseInt(key);
          if (keyNum >= 4 && keyNum <= 6 && typeof value === "string") {
            if (value.includes("פעמים") || value.includes("times")) {
              frequency = value;
            }
          }
        });
        console.log(
          "📊 useNextWorkout: Found frequency in legacy questionnaire:",
          frequency
        );
      }

      console.log(
        `📊 useNextWorkout: Raw frequency data found: "${frequency}"`
      );
      return frequency;
    };

    const frequency = getUserFrequencyData();

    // המרת התדירות למספר ימים עם תמיכה בפורמטים השונים
    let daysPerWeek = 3; // ברירת מחדל חכמה

    // פורמט חדש מהשאלון החכם
    if (frequency === "2-times" || frequency === "2_times") {
      daysPerWeek = 2;
    } else if (frequency === "3-times" || frequency === "3_times") {
      daysPerWeek = 3;
    } else if (frequency === "4-times" || frequency === "4_times") {
      daysPerWeek = 4;
    } else if (frequency === "5-plus" || frequency === "5_times") {
      daysPerWeek = 5;
    }
    // 🔧 FIX: פורמט אנגלי עם רווחים מהשאלון החדש
    else if (frequency === "2 times per week") {
      daysPerWeek = 2;
    } else if (frequency === "3 times per week") {
      daysPerWeek = 3;
    } else if (frequency === "4 times per week") {
      daysPerWeek = 4; // 🔧 התיקון העיקרי!
    } else if (frequency === "5 times per week") {
      daysPerWeek = 5;
    } else if (frequency === "6 times per week") {
      daysPerWeek = 6;
    } else if (frequency === "7 times per week") {
      daysPerWeek = 7;
    }
    // פורמט מהשאלון המורחב
    else if (frequency === "1-2 פעמים") {
      daysPerWeek = 2;
    } else if (frequency === "3 פעמים") {
      daysPerWeek = 3;
    } else if (frequency === "4 פעמים") {
      daysPerWeek = 4;
    } else if (frequency === "5+ פעמים") {
      daysPerWeek = 5;
    }
    // פורמט ישן
    else if (frequency.includes("1-2") || frequency === "2 פעמים בשבוע") {
      daysPerWeek = 2;
    } else if (frequency.includes("3-4") || frequency === "3 פעמים בשבוע") {
      daysPerWeek = 3;
    } else if (frequency.includes("5-6") || frequency === "5 פעמים בשבוע") {
      daysPerWeek = 5;
    } else if (frequency === "כל יום" || frequency === "6_times") {
      daysPerWeek = 6;
    }

    console.log(
      `🎯 useNextWorkout: Detected frequency: "${frequency}" -> ${daysPerWeek} days per week`
    );
    console.log(
      `📅 useNextWorkout: Selected workout plan for ${daysPerWeek} days:`,
      WORKOUT_DAYS_MAP[daysPerWeek as keyof typeof WORKOUT_DAYS_MAP] ||
        WORKOUT_DAYS_MAP[3]
    );

    // החזרת התוכנית המתאימה
    return (
      WORKOUT_DAYS_MAP[daysPerWeek as keyof typeof WORKOUT_DAYS_MAP] ||
      WORKOUT_DAYS_MAP[3]
    );
  }, [workoutPlan, user]);

  /**
   * רענון המלצת האימון הבא עם אלגוריתם חכם
   * Refresh next workout recommendation with smart algorithm
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
        "🔄 useNextWorkout: Getting next workout recommendation with smart plan:",
        weeklyPlan
      );
      console.log("👤 useNextWorkout: User data available:", {
        hasQuestionnaireData: !!user?.questionnaireData,
        hasQuestionnaire: !!user?.questionnaire,
        hasSmartData: !!user?.smartQuestionnaireData,
        hasExtendedData: !!user?.trainingStats,
      });
      console.log(
        "🔧 useNextWorkout: Integration with updated exercise database and services ready"
      );

      // בדיקת בטיחות מתקדמת - וידוא שהשירות קיים
      if (
        !nextWorkoutLogicService ||
        typeof nextWorkoutLogicService.getNextWorkoutRecommendation !==
          "function"
      ) {
        throw new Error("nextWorkoutLogicService is not properly initialized");
      }

      // הרץ במקביל עם טיפול בשגיאות חכם
      const [recommendation, stats] = await Promise.all([
        nextWorkoutLogicService.getNextWorkoutRecommendation(weeklyPlan),
        nextWorkoutLogicService.getCycleStatistics().catch((err) => {
          console.warn("⚠️ Could not get cycle stats:", err.message);
          return null; // החזר null במקום לכשל
        }),
      ]);

      setNextWorkout(recommendation);
      setCycleStats(stats);

      console.log("✅ useNextWorkout: Next workout recommendation received:", {
        workoutName: recommendation.workoutName,
        workoutIndex: recommendation.workoutIndex,
        reason: recommendation.reason,
        intensity: recommendation.suggestedIntensity,
      });

      if (stats) {
        console.log("📊 useNextWorkout: Cycle statistics:", {
          currentWeek: stats.currentWeek,
          totalWorkouts: stats.totalWorkouts,
          consistency: stats.consistency,
        });
      }

      console.log(
        "🎯 useNextWorkout: Ready to work with updated exercise services (workoutDataService, quickWorkoutGenerator)"
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("❌ Error getting next workout:", err);

      // במקרה של שגיאה, צור המלצה בסיסית חכמה
      const fallbackPlan = getWeeklyPlanFromData();
      const fallbackRecommendation = {
        workoutName: fallbackPlan[0] || "אימון מלא",
        workoutIndex: 0,
        reason: `אימון ${fallbackPlan[0] || "בסיסי"} (ברירת מחדל בגלל שגיאה טכנית)`,
        isRegularProgression: true,
        daysSinceLastWorkout: 0,
        suggestedIntensity: "normal" as const,
      };
      setNextWorkout(fallbackRecommendation);

      console.log(
        "🔄 useNextWorkout: Using fallback recommendation:",
        fallbackRecommendation
      );
      console.log(
        "💡 useNextWorkout: Even in fallback mode, updated exercise services will provide proper equipment filtering"
      );
    } finally {
      setIsLoading(false);
    }
  }, [getWeeklyPlanFromData, isLoading, user]);

  /**
   * סימון אימון כהושלם with improved error handling
   * Mark workout as completed with smart logging
   */
  const markWorkoutCompleted = useCallback(
    async (workoutIndex: number, workoutName: string) => {
      try {
        console.log(
          `🏁 useNextWorkout: Starting to mark workout as completed:`,
          {
            workoutName,
            workoutIndex,
            timestamp: new Date().toISOString(),
          }
        );

        // בדיקת בטיחות מתקדמת
        if (
          !nextWorkoutLogicService ||
          typeof nextWorkoutLogicService.updateWorkoutCompleted !== "function"
        ) {
          const error = "nextWorkoutLogicService is not properly initialized";
          console.error("❌ useNextWorkout:", error);
          setError(error);
          return;
        }

        // סימון האימון כהושלם
        await nextWorkoutLogicService.updateWorkoutCompleted(
          workoutIndex,
          workoutName
        );

        console.log(
          `✅ useNextWorkout: Successfully marked workout completed:`,
          {
            workoutName,
            workoutIndex,
            completedAt: new Date().toISOString(),
          }
        );

        // רענון המלצה לאחר השלמת אימון
        console.log(
          "🔄 useNextWorkout: Refreshing recommendation after workout completion..."
        );
        await refreshRecommendation();

        console.log(
          "🎯 useNextWorkout: Recommendation refresh completed - next workout will use updated exercise database"
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("❌ useNextWorkout: Error marking workout completed:", {
          error: errorMessage,
          workoutName,
          workoutIndex,
          timestamp: new Date().toISOString(),
        });
        setError(`שגיאה בסימון אימון: ${errorMessage}`);
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
