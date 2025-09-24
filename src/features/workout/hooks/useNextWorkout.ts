/**
 * @file src/features/workout/hooks/useNextWorkout.ts
 * @description Hook לקבלת האימון הבא במחזור
 * Hook for getting the next workout in cycle
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  nextWorkoutLogicService,
  NextWorkoutRecommendation,
} from "../services/nextWorkoutLogicService";
import { useUserStore } from "../../../stores/userStore";
import { fieldMapper } from "../../../utils/fieldMapper";
import type { WorkoutPlan } from "../../../core/types/workout.types";

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
 */
export const useNextWorkout = (workoutPlan?: WorkoutPlan) => {
  const { user } = useUserStore();
  const [nextWorkout, setNextWorkout] =
    useState<NextWorkoutRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cycleStats, setCycleStats] = useState<{
    currentWeek: number;
    totalWorkouts: number;
    daysInProgram: number;
    consistency: number;
  } | null>(null);

  // תדירות אימונים מהשאלון
  const getFrequency = useCallback((): number => {
    const smartAnswers = fieldMapper.getSmartAnswers(user) as {
      availability?: string[] | string;
    } | null;

    if (smartAnswers?.availability) {
      const availability = smartAnswers.availability;
      const freq = Array.isArray(availability) ? availability[0] : availability;

      if (freq?.includes("2")) return 2;
      if (freq?.includes("3")) return 3;
      if (freq?.includes("4")) return 4;
      if (freq?.includes("5")) return 5;
    }
    return 3; // ברירת מחדל
  }, [user]);

  // ✅ weeklyPlan: factory מחתים מפורשות (): string[] ומחזיר תמיד מערך
  const weeklyPlan = useMemo((): string[] => {
    // אם יש תכנית קיימת — קח רק שמות תקינים
    const fromPlan =
      workoutPlan?.workouts
        ?.map((w) => w?.name)
        .filter((n): n is string => typeof n === "string" && n.length > 0) ??
      [];

    if (fromPlan.length > 0) return fromPlan;

    // תכנית ברירת מחדל לפי תדירות
    const frequency = getFrequency();
    const WORKOUT_PLANS: Record<number, string[]> = {
      2: ["פלג גוף עליון", "פלג גוף תחתון"],
      3: ["דחיפה", "משיכה", "רגליים"],
      4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
      5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
    };

    return WORKOUT_PLANS[frequency] ?? WORKOUT_PLANS[3] ?? ["אימון מלא"];
  }, [workoutPlan, getFrequency]);

  // רענון המלצת האימון הבא
  const refreshRecommendation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const recommendation =
        await nextWorkoutLogicService.getNextWorkoutRecommendation(weeklyPlan);

      setNextWorkout(recommendation);

      // סטטיסטיקות מחזור (אם נתמך)
      try {
        if (
          "getCycleStatistics" in nextWorkoutLogicService &&
          typeof nextWorkoutLogicService.getCycleStatistics === "function"
        ) {
          const stats = await nextWorkoutLogicService.getCycleStatistics();
          setCycleStats(stats);
        }
      } catch {
        // לא קריטי אם לא מצליח
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "שגיאה בקבלת המלצת אימון";
      setError(errorMessage);

      const fallbackRecommendation: NextWorkoutRecommendation = {
        workoutName: weeklyPlan[0] || "אימון מלא",
        workoutIndex: 0,
        reason: "אימון בסיסי",
        isRegularProgression: true,
        daysSinceLastWorkout: 0,
        suggestedIntensity: "normal",
      };
      setNextWorkout(fallbackRecommendation);
    } finally {
      setIsLoading(false);
    }
  }, [weeklyPlan]);

  // סימון אימון כהושלם
  const markWorkoutCompleted = useCallback(
    async (workoutIndex: number, _workoutName: string) => {
      try {
        await nextWorkoutLogicService.updateWorkoutCompleted(workoutIndex);
        await refreshRecommendation();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "שגיאה בסימון אימון";
        setError(`שגיאה בסימון אימון: ${errorMessage}`);
      }
    },
    [refreshRecommendation]
  );

  // טעינה ראשונית
  useEffect(() => {
    if (user) {
      refreshRecommendation();
    }
  }, [user, refreshRecommendation]);

  // רענון כשמתעדכנת התכנית
  useEffect(() => {
    if (workoutPlan) {
      const timeoutId = setTimeout(refreshRecommendation, 100);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [workoutPlan, refreshRecommendation]);

  return {
    nextWorkout,
    isLoading,
    error,
    refreshRecommendation,
    markWorkoutCompleted,
    cycleStats,
  };
};
