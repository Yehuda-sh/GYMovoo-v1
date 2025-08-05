/**
 * @file src/hooks/usePreviousPerformance.ts
 * @description Hook חכם לקבלת ביצועים קודמים של תרגילים עם אלגוריתם התקדמות
 * @description Smart hook for getting previous exercise performances with progression algorithm
 * @notes משתמש באלגוריתם חכם לחישוב התקדמות והמלצות לביצועים הבאים
 * @notes Uses smart algorithm for calculating progression and recommendations for next performances
 * @updated 2025-08-05 שיפור לוגינג ותמיכה במאגר התרגילים החדש
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
      console.log(
        "🧠 usePreviousPerformance: Starting smart progression calculation for:",
        exerciseName
      );

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

      console.log("📊 usePreviousPerformance: Processing workout history:", {
        totalWorkouts: history.length,
        exerciseName,
        hasLastWorkout: !!lastWorkout,
        hasPreviousWorkout: !!previousWorkout,
      });

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

        console.log("📈 usePreviousPerformance: Progression analysis:", {
          lastVolume,
          prevVolume,
          strengthGain: strengthGain.toFixed(1) + "%",
          trend: progressionTrend,
        });
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

      console.log("🎯 usePreviousPerformance: Smart progression calculated:", {
        exerciseName,
        progressionTrend,
        consistencyScore,
        confidenceLevel,
        recommendedProgression: recommendedProgression.reasoning,
      });
      console.log(
        "🔧 usePreviousPerformance: Ready to work with updated exercise database and equipment filtering"
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
      console.log(
        "🔍 usePreviousPerformance: Loading performance data for exercise:",
        exerciseName
      );
      setLoading(true);
      setError(null);

      const rawPerformance =
        await workoutHistoryService.getPreviousPerformanceForExercise(
          exerciseName
        );

      if (rawPerformance) {
        console.log(
          "✅ usePreviousPerformance: Raw performance data found, calculating smart progression..."
        );
        // הפוך את הנתונים הגולמיים לביצועים חכמים
        const smartPerformance = calculateSmartProgression(rawPerformance);
        setPreviousPerformance(smartPerformance);
        console.log(
          "🎯 usePreviousPerformance: Smart performance calculation completed successfully"
        );
      } else {
        console.log(
          "📭 usePreviousPerformance: No previous performance data found for:",
          exerciseName
        );
        setPreviousPerformance(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "שגיאה בטעינת נתוני ביצועים";
      console.error(
        "❌ usePreviousPerformance: Error loading performance data:",
        err
      );
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

    console.log(
      "💡 usePreviousPerformance: Generating progression insight for:",
      exerciseName,
      {
        trend: progressionTrend,
        gain: strengthGain.toFixed(1) + "%",
        consistency: consistencyScore,
      }
    );

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
  }, [previousPerformance, exerciseName]);

  const shouldIncreaseWeight = useCallback((): boolean => {
    if (!previousPerformance) return false;

    const { progressionTrend, consistencyScore, lastWorkoutGap } =
      previousPerformance;

    const shouldIncrease =
      progressionTrend === "improving" &&
      consistencyScore >= 7 &&
      lastWorkoutGap <= 7;

    console.log(
      "⚖️ usePreviousPerformance: Weight increase recommendation for:",
      exerciseName,
      {
        shouldIncrease,
        trend: progressionTrend,
        consistency: consistencyScore,
        daysSince: lastWorkoutGap,
      }
    );

    return shouldIncrease;
  }, [previousPerformance, exerciseName]);

  const getMotivationalMessage = useCallback((): string => {
    if (!previousPerformance) return "זמן להתחיל מסע כושר חדש! 💪";

    const { progressionTrend, strengthGain, lastWorkoutGap } =
      previousPerformance;

    let message = "";
    if (lastWorkoutGap > 14) {
      message = "חזרת! זמן להרגיש שוב חזק 🔥";
    } else if (progressionTrend === "improving") {
      message = `כל הכבוד! שיפור של ${strengthGain.toFixed(1)}% 🚀`;
    } else if (progressionTrend === "stable") {
      message = "יציבות היא הבסיס להתקדמות! 💯";
    } else {
      message = "כל יום הוא הזדמנות חדשה להשתפר 🌟";
    }

    console.log(
      "🎉 usePreviousPerformance: Generated motivational message for:",
      exerciseName,
      message
    );
    return message;
  }, [previousPerformance, exerciseName]);

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
