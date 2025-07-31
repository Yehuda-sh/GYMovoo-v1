/**
 * @file src/hooks/usePreviousPerformance.ts
 * @description Hook חכם לקבלת ביצועים קודמים של תרגילים עם אלגוריתם התקדמות
 * @description Smart hook for getting previous exercise performances with progression algorithm
 * @notes משתמש באלגוריתם חכם לחישוב התקדמות והמלצות לביצועים הבאים
 * @notes Uses smart algorithm for calculating progression and recommendations for next performances
 */

import { useState, useEffect, useCallback } from "react";
import {
  workoutHistoryService,
  PreviousPerformance,
} from "../services/workoutHistoryService";

// ממשק מורחב לביצועים קודמים עם אלגוריתם חכם
export interface SmartPreviousPerformance extends PreviousPerformance {
  progressionTrend: "improving" | "stable" | "declining" | "new";
  recommendedProgression: {
    weight?: number;
    reps?: number;
    sets?: number;
    reasoning: string;
  };
  consistencyScore: number; // 1-10
  strengthGain: number; // אחוזי שיפור
  lastWorkoutGap: number; // ימים מהאימון האחרון
  confidenceLevel: "high" | "medium" | "low";
}

export interface UsePreviousPerformanceReturn {
  previousPerformance: SmartPreviousPerformance | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;

  // פונקציות חכמות נוספות
  getProgressionInsight: () => string;
  shouldIncreaseWeight: () => boolean;
  getMotivationalMessage: () => string;
}

export const usePreviousPerformance = (
  exerciseName: string
): UsePreviousPerformanceReturn => {
  const [previousPerformance, setPreviousPerformance] =
    useState<SmartPreviousPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // פונקציה לחישוב אלגוריתם התקדמות חכם
  const calculateSmartProgression = useCallback(
    (rawPerformance: PreviousPerformance): SmartPreviousPerformance => {
      // נניח שיש history או נבנה אותו מהנתונים הזמינים
      const history = ((rawPerformance as unknown as Record<string, unknown>)
        ?.history as unknown[]) || [rawPerformance];
      const lastWorkout =
        (history[history.length - 1] as Record<string, unknown>) ||
        rawPerformance;
      const previousWorkout = history[history.length - 2] as Record<
        string,
        unknown
      >;

      // חישוב מגמת התקדמות
      let progressionTrend: SmartPreviousPerformance["progressionTrend"] =
        "new";
      let strengthGain = 0;

      if (history.length >= 2 && lastWorkout && previousWorkout) {
        const lastVolume =
          (Number(lastWorkout.weight) || 0) *
          (Number(lastWorkout.reps) || 0) *
          (Number(lastWorkout.sets) || 1);
        const prevVolume =
          (Number(previousWorkout.weight) || 0) *
          (Number(previousWorkout.reps) || 0) *
          (Number(previousWorkout.sets) || 1);

        strengthGain =
          prevVolume > 0 ? ((lastVolume - prevVolume) / prevVolume) * 100 : 0;

        if (strengthGain > 5) progressionTrend = "improving";
        else if (strengthGain > -5) progressionTrend = "stable";
        else progressionTrend = "declining";
      }

      // חישוב ציון עקביות (1-10)
      const consistencyScore = Math.min(
        10,
        Math.max(
          1,
          history.length * 2 +
            (strengthGain > 0 ? 3 : strengthGain < -10 ? -2 : 1)
        )
      );

      // חישוב רווח זמן מהאימון האחרון
      const lastWorkoutGap = lastWorkout?.date
        ? Math.floor(
            (Date.now() - new Date(String(lastWorkout.date)).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0;

      // רמת ביטחון בהמלצות
      const confidenceLevel: SmartPreviousPerformance["confidenceLevel"] =
        history.length >= 3 && consistencyScore >= 7
          ? "high"
          : history.length >= 2 && consistencyScore >= 5
            ? "medium"
            : "low";

      // המלצה חכמה להתקדמות
      const recommendedProgression = calculateRecommendedProgression(
        lastWorkout,
        progressionTrend,
        consistencyScore,
        lastWorkoutGap
      );

      return {
        ...rawPerformance,
        progressionTrend,
        recommendedProgression,
        consistencyScore,
        strengthGain,
        lastWorkoutGap,
        confidenceLevel,
      };
    },
    []
  );

  // פונקציה לחישוב המלצות התקדמות
  const calculateRecommendedProgression = (
    lastWorkout: unknown,
    trend: SmartPreviousPerformance["progressionTrend"],
    consistency: number,
    daysSince: number
  ) => {
    if (!lastWorkout) {
      return {
        reasoning: "אין נתונים קודמים - התחל עם משקל נוח ו-8-12 חזרות",
      };
    }

    const baseWeight =
      lastWorkout && typeof lastWorkout === "object" && "weight" in lastWorkout
        ? Number(lastWorkout.weight) || 0
        : 0;
    const baseReps =
      lastWorkout && typeof lastWorkout === "object" && "reps" in lastWorkout
        ? Number(lastWorkout.reps) || 8
        : 8;
    const baseSets =
      lastWorkout && typeof lastWorkout === "object" && "sets" in lastWorkout
        ? Number(lastWorkout.sets) || 3
        : 3;

    // אלגוריתם התקדמות מותאם אישית
    if (trend === "improving" && consistency >= 8) {
      return {
        weight: Math.round(baseWeight * 1.025), // 2.5% עלייה
        reps: baseReps,
        sets: baseSets,
        reasoning: "מגמה מצוינת! העלה משקל ב-2.5%",
      };
    } else if (trend === "stable" && consistency >= 6) {
      return {
        weight: baseWeight,
        reps: Math.min(baseReps + 1, 15), // הוסף חזרה
        sets: baseSets,
        reasoning: "הוסף חזרה להגדלת נפח",
      };
    } else if (trend === "declining" || daysSince > 7) {
      return {
        weight: Math.round(baseWeight * 0.9), // הפחת 10%
        reps: baseReps,
        sets: baseSets,
        reasoning:
          daysSince > 7 ? "חזרה אחרי הפסקה - הפחת משקל" : "התמקד בטכניקה",
      };
    }

    return {
      weight: baseWeight,
      reps: baseReps,
      sets: baseSets,
      reasoning: "שמור על הרמה הנוכחית",
    };
  };

  useEffect(() => {
    loadPreviousPerformance();
  }, [exerciseName]);

  const loadPreviousPerformance = async () => {
    try {
      setLoading(true);
      setError(null);

      const rawPerformance =
        await workoutHistoryService.getPreviousPerformanceForExercise(
          exerciseName
        );

      if (rawPerformance) {
        // הפוך את הנתונים הגולמיים לביצועים חכמים
        const smartPerformance = calculateSmartProgression(rawPerformance);
        setPreviousPerformance(smartPerformance);
      } else {
        setPreviousPerformance(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "שגיאה בטעינת נתוני ביצועים";
      console.error("Error loading previous performance:", err);
      setError(errorMessage);
      setPreviousPerformance(null);
    } finally {
      setLoading(false);
    }
  };

  // פונקציות חכמות נוספות
  const getProgressionInsight = useCallback((): string => {
    if (!previousPerformance) return "אין נתונים זמינים";

    const { progressionTrend, strengthGain, consistencyScore } =
      previousPerformance;

    switch (progressionTrend) {
      case "improving":
        return `מצוין! התקדמת ב-${strengthGain.toFixed(1)}% - המשך כך!`;
      case "stable":
        return `יציב בביצועים (ציון עקביות: ${consistencyScore}/10) - זמן להתקדם`;
      case "declining":
        return `ירידה בביצועים - התמקד בטכניקה ומנוחה`;
      default:
        return "תרגיל חדש - בואו נתחיל בזהירות";
    }
  }, [previousPerformance]);

  const shouldIncreaseWeight = useCallback((): boolean => {
    if (!previousPerformance) return false;

    const { progressionTrend, consistencyScore, lastWorkoutGap } =
      previousPerformance;

    return (
      progressionTrend === "improving" &&
      consistencyScore >= 7 &&
      lastWorkoutGap <= 7
    );
  }, [previousPerformance]);

  const getMotivationalMessage = useCallback((): string => {
    if (!previousPerformance) return "זמן להתחיל מסע כושר חדש! 💪";

    const { progressionTrend, strengthGain, lastWorkoutGap } =
      previousPerformance;

    if (lastWorkoutGap > 14) {
      return "חזרת! זמן להרגיש שוב חזק 🔥";
    } else if (progressionTrend === "improving") {
      return `כל הכבוד! שיפור של ${strengthGain.toFixed(1)}% 🚀`;
    } else if (progressionTrend === "stable") {
      return "יציבות היא הבסיס להתקדמות! 💯";
    } else {
      return "כל יום הוא הזדמנות חדשה להשתפר 🌟";
    }
  }, [previousPerformance]);

  return {
    previousPerformance,
    loading,
    error,
    refetch: loadPreviousPerformance,
    getProgressionInsight,
    shouldIncreaseWeight,
    getMotivationalMessage,
  };
};
