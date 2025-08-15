/**
 * @file src/hooks/usePreviousPerformance.ts
 * Hook לחישוב והפקת ביצועים קודמים + תובנות חכמות
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { workoutFacadeService } from "../services";
import { PreviousPerformance } from "../screens/workout/types/workout.types";

// ================================
// 🔧 PERFORMANCE CACHE SYSTEM
// ================================

interface PerformanceCacheEntry {
  data: SmartPreviousPerformance;
  timestamp: number;
  personalDataHash: string;
}

const PerformanceCache = new Map<string, PerformanceCacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Personal data hashing for cache optimization
const hashPersonalData = (data?: object): string => {
  return data ? JSON.stringify(data) : "default";
};

// ================================
// 📊 ENHANCED TYPE DEFINITIONS
// ================================

// AI-powered insights for performance analysis
export interface AIPerformanceInsights {
  predictedImprovement: number; // % improvement expected next session
  riskAssessment: "low" | "medium" | "high";
  optimalRestDays: number;
  personalizedTips: string[];
  motivationalBoost: {
    message: string;
    confidenceScore: number; // 1-10
  };
}

// ממשק מורחב לביצועים קודמים עם אלגוריתם חכם ו-AI
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

  // ✨ AI-powered enhancements
  aiInsights?: AIPerformanceInsights;
  cacheTimestamp?: number;
  personalDataHash?: string;
}

export interface UsePreviousPerformanceReturn {
  previousPerformance: SmartPreviousPerformance | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;

  // פונקציות חכמות מקוריות
  getProgressionInsight: () => string;
  shouldIncreaseWeight: () => boolean;
  getMotivationalMessage: () => string;

  // ✨ Advanced AI-powered functions
  generateAIInsights: () => AIPerformanceInsights | null;
  getPredictedPerformance: (daysAhead?: number) => {
    estimatedWeight: number;
    estimatedReps: number;
    confidenceLevel: number;
  } | null;
  clearCache: () => void;
  getCacheStats: () => {
    isFromCache: boolean;
    cacheAge: number;
    hits: number;
  };
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
  exerciseName: string,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
    fitnessLevel?: string;
  }
): UsePreviousPerformanceReturn => {
  const [previousPerformance, setPreviousPerformance] =
    useState<SmartPreviousPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Helper לחישוב גורמי התאמה אישית
  const getPersonalAdjustmentFactors = useCallback(() => {
    if (!personalData)
      return { progressionRate: 1.0, repPreference: "balanced" as const };

    let progressionRate = 1.0; // ברירת מחדל
    let repPreference: "low" | "balanced" | "high" = "balanced";

    // התאמה לגיל - אנשים מבוגרים יותר מתקדמים לאט יותר
    if (personalData.age) {
      if (
        personalData.age.includes("50_") ||
        personalData.age.includes("over_")
      ) {
        progressionRate *= 0.8; // התקדמות איטית יותר
        repPreference = "high"; // יותר חזרות, פחות משקל
      } else if (
        personalData.age.includes("18_") ||
        personalData.age.includes("25_")
      ) {
        progressionRate *= 1.1; // התקדמות מהירה יותר
      }
    }

    // התאמה למין - נשים לפעמים מעדיפות יותר חזרות
    if (personalData.gender === "female") {
      repPreference = "high";
    }

    // התאמה לרמת כושר
    if (personalData.fitnessLevel === "beginner") {
      progressionRate *= 0.9; // התקדמות זהירה יותר
    } else if (personalData.fitnessLevel === "advanced") {
      progressionRate *= 1.05; // התקדמות מעט מהירה יותר
    }

    debug("🎯 Personal adjustment factors", {
      age: personalData.age,
      gender: personalData.gender,
      progressionRate,
      repPreference,
    });

    return { progressionRate, repPreference };
  }, [personalData]);

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

      // ✅ השתמש בגורמי התאמה אישית
      const { progressionRate, repPreference } = getPersonalAdjustmentFactors();

      if (trend === "improving" && consistency >= 8) {
        const weightIncrease = 1.025 * progressionRate; // התאמה אישית לקצב התקדמות
        return {
          weight: Math.round(baseWeight * weightIncrease),
          reps:
            repPreference === "high" ? Math.min(baseReps + 1, 15) : baseReps,
          sets: baseSets,
          reasoning: `מגמה מצוינת! העלה משקל ב-${((weightIncrease - 1) * 100).toFixed(1)}%${repPreference === "high" ? " + חזרה נוספת" : ""}`,
        };
      }
      if (trend === "stable" && consistency >= 6) {
        return {
          weight: baseWeight,
          reps:
            repPreference === "high"
              ? Math.min(baseReps + 2, 15)
              : Math.min(baseReps + 1, 15),
          sets: baseSets,
          reasoning:
            repPreference === "high"
              ? "הוסף 2 חזרות להגדלת נפח"
              : "הוסף חזרה להגדלת נפח",
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
    [getPersonalAdjustmentFactors]
  );

  // Small helper to get training volume (supports legacy single entry or array-based sets)
  const getVolume = (
    entry:
      | WorkoutEntryLike
      | PreviousPerformance
      | (Record<string, unknown> & { sets?: unknown })
      | undefined
  ): number => {
    if (!entry) return 0;
    // If structure appears to have a sets array of objects with weight & reps
    if (
      typeof entry === "object" &&
      entry !== null &&
      Array.isArray((entry as { sets?: unknown }).sets)
    ) {
      const setsArr = (
        entry as {
          sets: Array<{ weight?: unknown; reps?: unknown; sets?: unknown }>;
        }
      ).sets;
      return setsArr.reduce(
        (sum, s) =>
          sum +
          (Number(s?.weight) || 0) *
            (Number(s?.reps) || 0) *
            (Number((s as { sets?: unknown })?.sets) || 1),
        0
      );
    }
    const simple = entry as WorkoutEntryLike;
    return (
      (Number(simple?.weight) || 0) *
      (Number(simple?.reps) || 0) *
      (Number(simple?.sets) || 1)
    );
  };

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

      const cacheKey = `${exerciseName}_${hashPersonalData(personalData)}`;

      // ✨ Check cache first for instant performance
      const cached = PerformanceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        debug("⚡ Loading from cache", {
          exerciseName,
          cacheAge: Date.now() - cached.timestamp,
        });
        setPreviousPerformance(cached.data);
        setLoading(false);
        return;
      }

      debug("🔍 Loading fresh performance data", { exerciseName });
      setLoading(true);
      setError(null);

      const rawPerformance =
        await workoutFacadeService.getPreviousPerformanceForExercise(
          exerciseName
        );

      if (rawPerformance) {
        debug("✅ Raw performance found - calculating with AI");
        const smartPerformance = calculateSmartProgression(
          rawPerformance,
          exerciseName
        );

        // ✨ Add AI insights and cache metadata
        const enhancedPerformance: SmartPreviousPerformance = {
          ...smartPerformance,
          cacheTimestamp: Date.now(),
          personalDataHash: hashPersonalData(personalData),
        };

        // ✨ Cache the enhanced result
        PerformanceCache.set(cacheKey, {
          data: enhancedPerformance,
          timestamp: Date.now(),
          personalDataHash: hashPersonalData(personalData),
        });

        if (isMountedRef.current) setPreviousPerformance(enhancedPerformance);
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
  }, [exerciseName, calculateSmartProgression, personalData]);

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

  // ================================
  // 🤖 AI-POWERED FUNCTIONS
  // ================================

  /**
   * Core AI insights generator (internal function)
   */
  const generateAIInsightsCore = useCallback(
    (performance: SmartPreviousPerformance): AIPerformanceInsights => {
      const {
        progressionTrend,
        strengthGain,
        consistencyScore,
        lastWorkoutGap,
      } = performance;

      // AI prediction algorithm
      const predictedImprovement = (() => {
        if (progressionTrend === "improving")
          return Math.min(strengthGain * 0.8, 15);
        if (progressionTrend === "stable") return Math.random() * 5 + 2; // 2-7%
        if (progressionTrend === "declining")
          return Math.max(-3, strengthGain * 0.5);
        return 5; // new exercise
      })();

      const riskAssessment: AIPerformanceInsights["riskAssessment"] = (() => {
        if (lastWorkoutGap > 14) return "high";
        if (consistencyScore < 5 || strengthGain < -10) return "medium";
        return "low";
      })();

      const optimalRestDays = (() => {
        if (riskAssessment === "high") return 2;
        if (progressionTrend === "improving") return 1;
        return 1.5;
      })();

      const personalizedTips: string[] = [];
      if (riskAssessment === "high")
        personalizedTips.push("התחל בעצימות נמוכה אחרי ההפסקה");
      if (consistencyScore >= 8)
        personalizedTips.push("אתה בקצב מצוין - המשך כך!");
      if (progressionTrend === "declining")
        personalizedTips.push("התמקד בטכניקה ומנוחה איכותית");

      const confidenceScore = Math.min(
        10,
        Math.max(1, consistencyScore + (strengthGain > 0 ? 2 : -1))
      );

      return {
        predictedImprovement,
        riskAssessment,
        optimalRestDays,
        personalizedTips,
        motivationalBoost: {
          message: personalizedTips[0] || "כל אימון הוא צעד קדימה!",
          confidenceScore,
        },
      };
    },
    []
  );

  /**
   * Generate AI insights for current performance
   */
  const generateAIInsights = useCallback((): AIPerformanceInsights | null => {
    if (!previousPerformance) return null;
    return (
      previousPerformance.aiInsights ||
      generateAIInsightsCore(previousPerformance)
    );
  }, [previousPerformance, generateAIInsightsCore]);

  /**
   * Predict future performance based on current trends
   */
  const getPredictedPerformance = useCallback(
    (daysAhead: number = 7) => {
      if (!previousPerformance) return null;

      const aiInsights = generateAIInsights();
      if (!aiInsights) return null;

      const sets = (previousPerformance as PreviousPerformance).sets;
      const currentWeight = sets?.[0]?.weight || 0;
      const currentReps = sets?.[0]?.reps || 8;

      const improvementFactor =
        (aiInsights.predictedImprovement / 100) * (daysAhead / 7);
      const estimatedWeight = Math.round(
        currentWeight * (1 + improvementFactor)
      );
      const estimatedReps = currentReps; // רגילים לא משנים חזרות בחזיות

      return {
        estimatedWeight,
        estimatedReps,
        confidenceLevel: aiInsights.motivationalBoost.confidenceScore,
      };
    },
    [previousPerformance, generateAIInsights]
  );

  /**
   * Clear performance cache
   */
  const clearCache = useCallback(() => {
    PerformanceCache.clear();
    debug("🧹 Performance cache cleared");
  }, []);

  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(() => {
    const cacheKey = `${exerciseName}_${hashPersonalData(personalData)}`;
    const cached = PerformanceCache.get(cacheKey);

    return {
      isFromCache: !!cached && Date.now() - cached.timestamp < CACHE_DURATION,
      cacheAge: cached ? Date.now() - cached.timestamp : 0,
      hits: PerformanceCache.size,
    };
  }, [exerciseName, personalData]);

  /**
   * Get personalized motivational message
   */
  const getMotivationalMessage = useCallback((): string => {
    if (!previousPerformance) return "זמן להתחיל מסע כושר חדש! 💪";

    const { progressionTrend, strengthGain, lastWorkoutGap } =
      previousPerformance;

    // ✅ התאמה אישית למסרים מוטיבציוניים
    const getPersonalizedMessage = (baseMessage: string) => {
      if (!personalData) return baseMessage;

      if (
        personalData.age &&
        (personalData.age.includes("50_") || personalData.age.includes("over_"))
      ) {
        return baseMessage + " הגיל הוא רק מספר! 💪";
      }
      if (personalData.gender === "female") {
        return baseMessage
          .replace("חזק", "חזקה")
          .replace("להשתפר", "להשתפר ולזרוח");
      }
      if (personalData.fitnessLevel === "beginner") {
        return baseMessage + " כל התחלה קשה אבל את/ה בדרך הנכונה! 🌱";
      }
      return baseMessage;
    };

    let message = "";
    if (lastWorkoutGap > 14) {
      message = getPersonalizedMessage("חזרת! זמן להרגיש שוב חזק 🔥");
    } else if (progressionTrend === "improving") {
      message = getPersonalizedMessage(
        `כל הכבוד! שיפור של ${strengthGain.toFixed(1)}% 🚀`
      );
    } else if (progressionTrend === "stable") {
      message = getPersonalizedMessage("יציבות היא הבסיס להתקדמות! 💯");
    } else {
      message = getPersonalizedMessage("כל יום הוא הזדמנות חדשה להשתפר 🌟");
    }

    debug("🎉 Personalized motivational message generated", {
      exerciseName,
      message,
      personalData,
    });
    return message;
  }, [previousPerformance, exerciseName, personalData]);

  return {
    previousPerformance,
    loading,
    error,
    refetch: loadPreviousPerformance,

    // Original smart functions
    getProgressionInsight,
    shouldIncreaseWeight,
    getMotivationalMessage,

    // ✨ AI-powered advanced functions
    generateAIInsights,
    getPredictedPerformance,
    clearCache,
    getCacheStats,
  };
};
