/**
 * @file src/hooks/useNextWorkout.ts
 * @description Hook לקבלת האימון הבא במחזור עם אלגוריתם חכם
 * @description Hook for getting the next workout in cycle with smart algorithm
 * @notes משתמש במערכת השאלונים החדשה ובאלגוריתם ההתאמה החכם
 * @notes Uses the new questionnaire system and smart matching algorithm
 * @updated 2025-08-05 שיפור לוגינג ותמיכה במאגר התרגילים החדש
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
const DEBUG_NEXT_WORKOUT = false; // Toggle verbose logging
const debug = (...args: unknown[]) => {
  if (DEBUG_NEXT_WORKOUT) {
    console.warn("[useNextWorkout]", ...args);
  }
};

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
  const weeklyPlan = useMemo(() => {
    // Direct plan provided
    if (workoutPlan?.workouts) {
      const plan = workoutPlan.workouts.map((w) => w.name);
      debug("Using provided workoutPlan", plan);
      return plan;
    }

    const WORKOUT_DAYS_MAP: Record<number, string[]> = {
      1: ["אימון מלא"],
      2: ["פלג גוף עליון", "פלג גוף תחתון"],
      3: ["דחיפה", "משיכה", "רגליים"],
      4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
      5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
      6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
      7: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן", "קרדיו קל"],
    };

    const extractRawFrequency = (): string => {
      if (user?.smartQuestionnaireData?.answers?.availability) {
        const availability = user.smartQuestionnaireData.answers.availability;
        const freq = Array.isArray(availability)
          ? availability[0]
          : availability;
        debug("frequency from smartQuestionnaireData", freq);
        return freq;
      }
      if (user?.trainingStats?.preferredWorkoutDays) {
        const freq = String(user.trainingStats.preferredWorkoutDays);
        debug("frequency from trainingStats", freq);
        return freq;
      }
      if (user?.questionnaireData?.answers) {
        const answers = user.questionnaireData.answers as Record<
          string,
          unknown
        >;
        const freq = String(answers.frequency || "");
        debug("frequency from questionnaireData", freq);
        return freq;
      }
      if (user?.questionnaire) {
        let legacy = "";
        Object.values(user.questionnaire).forEach((value) => {
          if (
            typeof value === "string" &&
            (value.includes("times") || value.includes("פעמים"))
          ) {
            legacy = value;
          }
        });
        debug("frequency from legacy questionnaire", legacy);
        return legacy;
      }
      return "";
    };

    const raw = extractRawFrequency();
    let days = 3; // default smart
    const normalized = raw.trim().toLowerCase();
    const directMap: Record<string, number> = {
      "2-times": 2,
      "2_times": 2,
      "2 times per week": 2,
      "3-times": 3,
      "3_times": 3,
      "3 times per week": 3,
      "4-times": 4,
      "4_times": 4,
      "4 times per week": 4,
      "5-plus": 5,
      "5_times": 5,
      "5 times per week": 5,
      "6 times per week": 6,
      "7 times per week": 7,
      "1-2 פעמים": 2,
      "3 פעמים": 3,
      "4 פעמים": 4,
      "5+ פעמים": 5,
      "2 פעמים בשבוע": 2,
      "3 פעמים בשבוע": 3,
      "5 פעמים בשבוע": 5,
      "כל יום": 6,
      "6_times": 6,
    };
    if (directMap[normalized] != null) {
      days = directMap[normalized];
    } else if (/^\d$/.test(normalized)) {
      days = Math.min(7, Math.max(1, Number(normalized)));
    } else if (/5-6/.test(normalized)) {
      days = 5;
    } else if (/3-4/.test(normalized)) {
      days = 3;
    } else if (/1-2/.test(normalized)) {
      days = 2;
    }
    debug("Parsed frequency", { raw, normalized, days });

    const selected = WORKOUT_DAYS_MAP[days] || WORKOUT_DAYS_MAP[3];
    debug("Selected weekly plan", { days, selected });
    return selected;
  }, [workoutPlan, user]);

  /**
   * רענון המלצת האימון הבא עם אלגוריתם חכם
   * Refresh next workout recommendation with smart algorithm
   */
  const isMountedRef = useRef(true);
  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    []
  );

  const refreshRecommendation = useCallback(async () => {
    try {
      // אל תכניס loading אם כבר טוען
      if (!isLoading) {
        setIsLoading(true);
      }
      setError(null);

      debug("🔄 Fetching next workout recommendation", {
        weeklyPlan,
        userPresent: !!user,
      });
      debug("👤 User data sources", {
        hasQuestionnaireData: !!user?.questionnaireData,
        hasQuestionnaire: !!user?.questionnaire,
        hasSmartData: !!user?.smartQuestionnaireData,
        hasExtendedData: !!user?.trainingStats,
      });

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

      if (isMountedRef.current) {
        setNextWorkout(recommendation);
        setCycleStats(stats);
      }
      debug("✅ Recommendation received", {
        workoutName: recommendation.workoutName,
        workoutIndex: recommendation.workoutIndex,
        reason: recommendation.reason,
        intensity: recommendation.suggestedIntensity,
        stats,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("❌ Error getting next workout:", err);

      // במקרה של שגיאה, צור המלצה בסיסית חכמה
      const fallbackPlan = weeklyPlan;
      const fallbackRecommendation = {
        workoutName: fallbackPlan[0] || "אימון מלא",
        workoutIndex: 0,
        reason: `אימון ${fallbackPlan[0] || "בסיסי"} (ברירת מחדל בגלל שגיאה טכנית)`,
        isRegularProgression: true,
        daysSinceLastWorkout: 0,
        suggestedIntensity: "normal" as const,
      };
      if (isMountedRef.current) setNextWorkout(fallbackRecommendation);
      debug("🔄 Using fallback recommendation", fallbackRecommendation);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [weeklyPlan, isLoading, user]);

  /**
   * סימון אימון כהושלם with improved error handling
   * Mark workout as completed with smart logging
   */
  const markWorkoutCompleted = useCallback(
    async (workoutIndex: number, workoutName: string) => {
      try {
        debug("🏁 Mark workout completed", { workoutName, workoutIndex });

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

        debug("✅ Workout completion stored", { workoutName, workoutIndex });

        // רענון המלצה לאחר השלמת אימון
        debug("🔄 Refreshing recommendation after completion");
        await refreshRecommendation();

        debug("🎯 Recommendation refresh completed");
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
