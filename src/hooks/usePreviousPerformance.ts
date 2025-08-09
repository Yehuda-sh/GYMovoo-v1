/**
 * @file src/hooks/usePreviousPerformance.ts
 * @description Hook חכם לקבלת ביצועים קודמים של תרגילים עם אלגוריתם התקדמות
 * @description Smart hook for getting previous exercise performances with progression algorithm
 * @notes משתמש באלגוריתם חכם לחישוב התקדמות והמלצות לביצועים הבאים
 * @notes Uses smart algorithm for calculating progression and recommendations for next performances
 * @updated 2025-08-05 שיפור לוגינג ותמיכה במאגר התרגילים החדש
 */

import { useState, useEffect, useCallback, useRef } from "react";
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

const DEBUG_PREV_PERF = false; // toggle detailed debug logs

// Internal debug helper (avoids console noise in production)
const debug = (...args: unknown[]) => {
  if (DEBUG_PREV_PERF) {
    console.warn("[usePreviousPerformance]", ...args);
  }
};
// Lightweight internal type for workout history entries (partial)
interface WorkoutEntryLike {
  weight?: number | string;
  reps?: number | string;
  sets?: number | string;
  date?: string | Date;
}

export const usePreviousPerformance = (
  exerciseName: string
): UsePreviousPerformanceReturn => {
  const [previousPerformance, setPreviousPerformance] =
    useState<SmartPreviousPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recommendation algorithm extracted above usage for clarity
  const calculateRecommendedProgression = useCallback(
    (
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

      const entry = lastWorkout as WorkoutEntryLike | undefined;
      const baseWeight = entry?.weight != null ? Number(entry.weight) || 0 : 0;
      const baseReps = entry?.reps != null ? Number(entry.reps) || 8 : 8;
      const baseSets = entry?.sets != null ? Number(entry.sets) || 3 : 3;

      if (trend === "improving" && consistency >= 8) {
        return {
          weight: Math.round(baseWeight * 1.025),
          reps: baseReps,
          sets: baseSets,
          reasoning: "מגמה מצוינת! העלה משקל ב-2.5%",
        };
      }
      if (trend === "stable" && consistency >= 6) {
        return {
          weight: baseWeight,
          reps: Math.min(baseReps + 1, 15),
          sets: baseSets,
          reasoning: "הוסף חזרה להגדלת נפח",
        };
      }
      if (trend === "declining" || daysSince > 7) {
        return {
          weight: Math.round(baseWeight * 0.9),
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
    },
    []
  );

  // Small helper to get training volume
  const getVolume = (entry: WorkoutEntryLike | undefined) =>
    (Number(entry?.weight) || 0) *
    (Number(entry?.reps) || 0) *
    (Number(entry?.sets) || 1);

  // פונקציה לחישוב אלגוריתם התקדמות חכם (memoized & pure wrt inputs)
  const calculateSmartProgression = useCallback(
    (
      rawPerformance: PreviousPerformance,
      name: string
    ): SmartPreviousPerformance => {
      debug("🧠 Starting smart progression calculation", { name });

      const history = ((rawPerformance as unknown as Record<string, unknown>)
        ?.history as unknown[]) || [rawPerformance];
      const lastWorkout =
        (history[history.length - 1] as Record<string, unknown>) ||
        rawPerformance;
      const previousWorkout = history[history.length - 2] as
        | Record<string, unknown>
        | undefined;

      debug("📊 Processing workout history", {
        totalWorkouts: history.length,
        name,
        hasLastWorkout: !!lastWorkout,
        hasPreviousWorkout: !!previousWorkout,
      });

      let progressionTrend: SmartPreviousPerformance["progressionTrend"] =
        "new";
      let strengthGain = 0;

      if (previousWorkout) {
        const lastVolume = getVolume(lastWorkout);
        const prevVolume = getVolume(previousWorkout);
        strengthGain =
          prevVolume > 0 ? ((lastVolume - prevVolume) / prevVolume) * 100 : 0;
        if (strengthGain > 5) progressionTrend = "improving";
        else if (strengthGain > -5) progressionTrend = "stable";
        else progressionTrend = "declining";
        debug("📈 Progression analysis", {
          lastVolume,
          prevVolume,
          strengthGain: strengthGain.toFixed(1) + "%",
          trend: progressionTrend,
        });
      }

      const consistencyScore = Math.min(
        10,
        Math.max(
          1,
          history.length * 2 +
            (strengthGain > 0 ? 3 : strengthGain < -10 ? -2 : 1)
        )
      );

      const lastWorkoutGap = (lastWorkout as WorkoutEntryLike | undefined)?.date
        ? Math.floor(
            (Date.now() -
              new Date(
                String((lastWorkout as WorkoutEntryLike).date)
              ).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0;

      const confidenceLevel: SmartPreviousPerformance["confidenceLevel"] =
        history.length >= 3 && consistencyScore >= 7
          ? "high"
          : history.length >= 2 && consistencyScore >= 5
            ? "medium"
            : "low";

      const recommendedProgression = calculateRecommendedProgression(
        lastWorkout,
        progressionTrend,
        consistencyScore,
        lastWorkoutGap
      );

      debug("🎯 Smart progression calculated", {
        name,
        progressionTrend,
        consistencyScore,
        confidenceLevel,
        recommendation: recommendedProgression.reasoning,
      });

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
    [calculateRecommendedProgression]
  );
  const isMountedRef = useRef(true);
  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    []
  );

  const loadPreviousPerformance = useCallback(async () => {
    try {
      if (!exerciseName) {
        debug("⚠️ Skipping load - empty exerciseName");
        setPreviousPerformance(null);
        return;
      }
      debug("🔍 Loading performance data", { exerciseName });
      setLoading(true);
      setError(null);

      const rawPerformance =
        await workoutHistoryService.getPreviousPerformanceForExercise(
          exerciseName
        );

      if (rawPerformance) {
        debug("✅ Raw performance found - calculating");
        const smartPerformance = calculateSmartProgression(
          rawPerformance,
          exerciseName
        );
        if (isMountedRef.current) setPreviousPerformance(smartPerformance);
      } else {
        debug("📭 No previous performance data", { exerciseName });
        if (isMountedRef.current) setPreviousPerformance(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "שגיאה בטעינת נתוני ביצועים";
      console.error(
        "❌ usePreviousPerformance: Error loading performance data:",
        err
      );
      if (isMountedRef.current) {
        setError(errorMessage);
        setPreviousPerformance(null);
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [exerciseName, calculateSmartProgression]);

  useEffect(() => {
    loadPreviousPerformance();
  }, [loadPreviousPerformance]);

  // פונקציות חכמות נוספות
  const getProgressionInsight = useCallback((): string => {
    if (!previousPerformance) return "אין נתונים זמינים";

    const { progressionTrend, strengthGain, consistencyScore } =
      previousPerformance;

    debug("💡 Generating progression insight", {
      exerciseName,
      trend: progressionTrend,
      gain: strengthGain.toFixed(1) + "%",
      consistency: consistencyScore,
    });

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

    debug("⚖️ Weight increase decision", {
      exerciseName,
      shouldIncrease,
      trend: progressionTrend,
      consistency: consistencyScore,
      daysSince: lastWorkoutGap,
    });

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

    debug("🎉 Motivational message generated", { exerciseName, message });
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
