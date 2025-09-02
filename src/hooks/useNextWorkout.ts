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
import { getPersonalDataFromUser } from "../utils/questionnaireUtils";
import { fieldMapper } from "../utils/fieldMapper";
import { WorkoutPlan } from "../screens/workout/types/workout.types";
import { logger } from "../utils/logger";
import { errorHandler } from "../utils/errorHandler";
import { performanceManager } from "../utils/performanceManager";

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
  // ✅ יכולות חדשות
  personalizedInsights: {
    recommendation: string;
    motivation: string;
    nextGoal: string;
  } | null;
  weeklyPlanCache: string[];
  resetCache: () => void;
  // ✅ מעקב ביצועים וסטטיסטיקות
  cacheStats: Record<string, number>;
}

// ===============================================
// 🚀 Performance Cache & Optimizations - מערכת Cache ואופטימיזציות
// ===============================================

/**
 * Singleton cache for workout recommendations
 * מניעת חישובים כפולים על ידי cache גלובלי
 */
class GlobalWorkoutCache {
  private static instance: GlobalWorkoutCache;
  private cachedRecommendation: NextWorkoutRecommendation | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 10000; // 10 שניות
  private activeFetches = new Set<string>();

  static getInstance(): GlobalWorkoutCache {
    if (!GlobalWorkoutCache.instance) {
      GlobalWorkoutCache.instance = new GlobalWorkoutCache();
    }
    return GlobalWorkoutCache.instance;
  }

  getCachedRecommendation(userId?: string): NextWorkoutRecommendation | null {
    const now = Date.now();
    if (
      this.cachedRecommendation &&
      now - this.cacheTimestamp < this.CACHE_DURATION
    ) {
      logger.debug("useNextWorkout", "Using global cached recommendation", {
        age: now - this.cacheTimestamp,
        userId,
      });
      return this.cachedRecommendation;
    }
    return null;
  }

  setCachedRecommendation(
    recommendation: NextWorkoutRecommendation,
    userId?: string
  ): void {
    this.cachedRecommendation = recommendation;
    this.cacheTimestamp = Date.now();
    logger.debug("useNextWorkout", "Cached recommendation globally", {
      workoutName: recommendation.workoutName,
      userId,
    });
  }

  isActiveFetch(key: string): boolean {
    return this.activeFetches.has(key);
  }

  setActiveFetch(key: string): void {
    this.activeFetches.add(key);
  }

  clearActiveFetch(key: string): void {
    this.activeFetches.delete(key);
  }

  clearCache(): void {
    this.cachedRecommendation = null;
    this.cacheTimestamp = 0;
    this.activeFetches.clear();
  }
}

/**
 * Cache מהיר לתוכניות שבועיות וחישובים תכופים
 * Fast cache for weekly plans and frequent calculations
 */
const WorkoutHookCache = {
  weeklyPlans: new Map<string, string[]>(),
  personalData: new Map<string, Record<string, unknown>>(),
  recommendations: new Map<string, NextWorkoutRecommendation>(),

  clear(): void {
    this.weeklyPlans.clear();
    this.personalData.clear();
    this.recommendations.clear();
    logger.debug("useNextWorkout", "Cache cleared", {
      cacheSize: {
        weeklyPlans: this.weeklyPlans.size,
        personalData: this.personalData.size,
        recommendations: this.recommendations.size,
      },
    });
  },

  getWeeklyPlanKey(
    userId: string,
    frequency: string,
    planType?: string
  ): string {
    return `${userId}_${frequency}_${planType || "auto"}`;
  },

  getPersonalDataKey(userId: string, version: string): string {
    return `${userId}_${version}`;
  },

  getCacheStats(): Record<string, number> {
    return {
      weeklyPlans: this.weeklyPlans.size,
      personalData: this.personalData.size,
      recommendations: this.recommendations.size,
    };
  },
};

/**
 * Hook לניהול האימון הבא במחזור
 * Hook for managing next workout in cycle
 */
const DEBUG_NEXT_WORKOUT = false; // ✅ השבתת דיבוג בייצור
const debug = (...args: unknown[]) => {
  if (DEBUG_NEXT_WORKOUT && __DEV__) {
    logger.debug("useNextWorkout", "Debug info", ...args);
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

  // ✅ מצבים חדשים מתקדמים
  const [personalizedInsights, setPersonalizedInsights] = useState<{
    recommendation: string;
    motivation: string;
    nextGoal: string;
  } | null>(null);

  const [weeklyPlanCache, setWeeklyPlanCache] = useState<string[]>([]);

  // ✅ Global cache instance
  const globalCache = useMemo(() => GlobalWorkoutCache.getInstance(), []);

  /**
   * Reset cache function
   * פונקציית איפוס cache
   */
  const resetCache = useCallback(() => {
    const beforeStats = WorkoutHookCache.getCacheStats();
    WorkoutHookCache.clear();
    globalCache.clearCache(); // ✅ ניקוי cache גלובלי
    setWeeklyPlanCache([]);
    setPersonalizedInsights(null);
    hasInitializedRef.current = false; // ✅ איפוס flag של initialization

    logger.info("useNextWorkout", "Cache reset completed", {
      beforeReset: beforeStats,
      afterReset: WorkoutHookCache.getCacheStats(),
    });
    debug("🧹 Cache cleared", { beforeStats });
  }, [globalCache]);

  /**
   * Enhanced personal data extraction with questionnaire integration
   * חילוץ נתונים אישיים משופר עם אינטגרציה לשאלון
   */
  const enhancedPersonalData = useMemo(() => {
    if (!user) return null;

    const userId = user.id || "anonymous";
    const cacheKey = WorkoutHookCache.getPersonalDataKey(
      userId,
      user.smartquestionnairedata?.metadata?.version || "1.0"
    );

    // בדיקת cache
    if (WorkoutHookCache.personalData.has(cacheKey)) {
      return WorkoutHookCache.personalData.get(cacheKey);
    }

    // יצירת נתונים משופרים
    let data = {};

    // מהשאלון החדש (עדיפות גבוהה)
    const smartAnswers = fieldMapper.getSmartAnswers(user);
    if (smartAnswers) {
      const answers = smartAnswers as {
        gender?: string;
        age?: string | number;
        weight?: string | number;
        height?: string | number;
        fitnessLevel?: string;
        goals?: string[];
        equipment?: string[];
        availability?: string[] | string;
        sessionDuration?: string;
        workoutLocation?: string;
        nutrition?: string[];
      };
      data = {
        gender: answers.gender as string,
        age: String(answers.age || ""),
        weight: String(answers.weight || ""),
        height: String(answers.height || ""),
        fitnessLevel: answers.fitnessLevel as string,
        goals: answers.goals || [],
        equipment: answers.equipment || [],
        availability: answers.availability || [],
        sessionDuration: answers.sessionDuration,
        workoutLocation: answers.workoutLocation,
        nutrition: answers.nutrition || [],
        // ✅ נתונים מתקדמים מ-metadata
        questionnaire: user.smartquestionnairedata?.metadata
          ? {
              version: user.smartquestionnairedata.metadata?.version,
              completedAt: user.smartquestionnairedata.metadata?.completedAt,
            }
          : undefined,
      };
    }
    // fallback לשאלון ישן
    else if (user.questionnairedata?.answers) {
      const answers = user.questionnairedata.answers as Record<string, unknown>;
      data = {
        fitnessLevel: answers.fitnessLevel as string,
        goals: Array.isArray(answers.goals) ? answers.goals : [answers.goals],
        equipment: (answers.equipment as string[]) || [],
        availability: Array.isArray(answers.availability)
          ? answers.availability
          : [answers.availability],
        sessionDuration: answers.sessionDuration as string,
        workoutLocation: answers.workoutLocation as string,
      };
    }

    // שמירה בcache
    WorkoutHookCache.personalData.set(cacheKey, data);
    debug("💾 Personal data cached", { userId, cacheKey, data });
    logger.debug("useNextWorkout", "Personal data cached", {
      userId,
      cacheKey,
      dataKeys: Object.keys(data || {}),
      cacheStats: WorkoutHookCache.getCacheStats(),
    });

    return data;
  }, [user]);

  /**
   * Optimized weekly plan generation with smart caching
   * יצירת תוכנית שבועית מיטבית עם cache חכם
   */
  const extractFrequencyFromUser = useCallback((): string => {
    const smartAnswers2 = fieldMapper.getSmartAnswers(user) as {
      availability?: string[] | string;
    } | null;
    if (smartAnswers2?.availability) {
      const availability = smartAnswers2.availability;
      const freq = Array.isArray(availability) ? availability[0] : availability;
      debug("frequency from smartquestionnairedata", freq);
      return freq;
    }
    if (user?.trainingstats?.preferredWorkoutDays) {
      const freq = String(user.trainingstats.preferredWorkoutDays);
      debug("frequency from trainingStats", freq);
      return freq;
    }
    if (user?.questionnairedata?.answers) {
      const answers = user.questionnairedata.answers as Record<string, unknown>;
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
  }, [user]);

  /**
   * Parse frequency string to number of days (optimized)
   * המרת מחרוזת תדירות למספר ימים (מיטבי)
   */
  const parseFrequencyToDays = useCallback((raw: string): number => {
    const normalized = raw.trim().toLowerCase();

    // מיפוי מהיר O(1)
    const directMap: Record<string, number> = {
      "2_days": 2,
      "2-times": 2,
      "2_times": 2,
      "2 times per week": 2,
      "3_days": 3,
      "3-times": 3,
      "3_times": 3,
      "3 times per week": 3,
      "4_days": 4,
      "4-times": 4,
      "4_times": 4,
      "4 times per week": 4,
      "5_days": 5,
      "5-plus": 5,
      "5_times": 5,
      "5 times per week": 5,
      "6_times": 6,
      "6 times per week": 6,
      "7_times": 7,
      "7 times per week": 7,
      "1-2 פעמים": 2,
      "3 פעמים": 3,
      "4 פעמים": 4,
      "5+ פעמים": 5,
      "2 ימים בשבוע": 2,
      "3 ימים בשבוע": 3,
      "5 ימים בשבוע": 5,
      "כל יום": 6,
    };

    if (directMap[normalized] != null) {
      return directMap[normalized];
    }

    // fallback לביטויים רגולריים
    if (/^\d$/.test(normalized)) {
      return Math.min(7, Math.max(1, Number(normalized)));
    }
    if (/5-6/.test(normalized)) return 5;
    if (/3-4/.test(normalized)) return 3;
    if (/1-2/.test(normalized)) return 2;

    return 3; // ברירת מחדל חכמה
  }, []);

  const weeklyPlan = useMemo(() => {
    // Direct plan provided - highest priority
    if (workoutPlan?.workouts) {
      const plan = workoutPlan.workouts.map((w) => w.name);
      debug("Using provided workoutPlan", plan);
      setWeeklyPlanCache(plan);
      return plan;
    }

    const userId = user?.id || "anonymous";
    const rawFrequency = extractFrequencyFromUser();
    const cacheKey = WorkoutHookCache.getWeeklyPlanKey(
      userId,
      rawFrequency,
      "auto"
    );

    // בדיקת cache
    if (WorkoutHookCache.weeklyPlans.has(cacheKey)) {
      const cachedPlan = WorkoutHookCache.weeklyPlans.get(cacheKey)!;
      setWeeklyPlanCache(cachedPlan);
      return cachedPlan;
    }

    // יצירת תוכנית חדשה
    const WORKOUT_DAYS_MAP: Record<number, string[]> = {
      1: ["אימון מלא"],
      2: ["פלג גוף עליון", "פלג גוף תחתון"],
      3: ["דחיפה", "משיכה", "רגליים"],
      4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
      5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
      6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
      7: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן", "קרדיו קל"],
    };

    const days = parseFrequencyToDays(rawFrequency);
    const selectedPlan = WORKOUT_DAYS_MAP[days] || WORKOUT_DAYS_MAP[3];

    // שמירה בcache
    WorkoutHookCache.weeklyPlans.set(cacheKey, selectedPlan);
    setWeeklyPlanCache(selectedPlan);

    debug("Generated weekly plan", {
      userId,
      rawFrequency,
      days,
      selectedPlan,
    });

    logger.debug("useNextWorkout", "Weekly plan generated and cached", {
      userId,
      rawFrequency,
      days,
      selectedPlan,
      cacheKey,
      cacheStats: WorkoutHookCache.getCacheStats(),
    });

    return selectedPlan;
  }, [workoutPlan, user, extractFrequencyFromUser, parseFrequencyToDays]);

  /**
   * Generate personalized insights from recommendation data
   * יצירת תובנות מותאמות אישית מנתוני המלצה
   */
  const generatePersonalizedInsights = useCallback(
    (
      recommendation: NextWorkoutRecommendation,
      personalData: Record<string, unknown> | null,
      _stats: Record<string, unknown> | null
    ) => {
      const { workoutName, suggestedIntensity } = recommendation;
      const { fitnessLevel = "beginner", goals = [] } = personalData || {};

      // המלצות מותאמות
      let recommendationText = `מוכן/נה ל${workoutName}?`;
      if (suggestedIntensity === "light") {
        recommendationText = `התחלה רכה עם ${workoutName}`;
      } else if (suggestedIntensity === "catchup") {
        recommendationText = `זמן להדביק פערים עם ${workoutName}`;
      }

      // מוטיבציה מותאמת לרמה
      const motivationMap: Record<string, string> = {
        beginner: "כל התחלה קשה, אבל אתם על הדרך הנכונה! 💪",
        intermediate: "אתם מתקדמים מצוין! המשיכו ככה! 🔥",
        advanced: "אתם מקצועים! בואו נדחוף את הגבולות! 🚀",
      };

      const motivation =
        motivationMap[String(fitnessLevel)] || motivationMap.beginner;

      // יעד הבא
      const nextGoalMap: Record<string, string> = {
        lose_weight: 'המטרה: הפחתת 0.5 ק"ג השבוע',
        build_muscle: "המטרה: הוספת משקל לתרגיל הבא",
        general_fitness: "המטרה: שיפור הסיבולת הכללית",
        athletic_performance: "המטרה: שיפור זמן ההתאוששות",
      };

      const primaryGoal = Array.isArray(goals) ? goals[0] : goals;
      const nextGoal =
        nextGoalMap[String(primaryGoal)] || "המטרה: שמירה על עקביות באימונים";

      return {
        recommendation: recommendationText,
        motivation,
        nextGoal,
      };
    },
    []
  );

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
      const userId = user?.id || "anonymous";
      const fetchKey = `${userId}_${JSON.stringify(weeklyPlan)}`;

      // ✅ בדיקת cache גלובלי
      const cachedRecommendation = globalCache.getCachedRecommendation(userId);
      if (cachedRecommendation && !globalCache.isActiveFetch(fetchKey)) {
        setNextWorkout(cachedRecommendation);
        setIsLoading(false);
        debug("🚀 Using cached recommendation", cachedRecommendation);
        return;
      }

      // ✅ מניעת קריאות כפולות
      if (globalCache.isActiveFetch(fetchKey)) {
        debug("⏳ Fetch already in progress, skipping", { fetchKey });
        return;
      }

      // בדיקה האם יש בקשה פעילה דומה
      const requestKey = `nextWorkout_${user?.id}_${JSON.stringify(weeklyPlan)}`;

      // בדיקת cache בסיסי מהמנהל הגלובלי
      const cachedResult =
        performanceManager.getCachedData<NextWorkoutRecommendation>(requestKey);
      if (cachedResult) {
        debug("🎯 Using cached workout recommendation", { cachedResult });
        setNextWorkout(cachedResult);
        globalCache.clearActiveFetch(fetchKey);
        if (isMountedRef.current) setIsLoading(false);
        return;
      }

      // בדיקה האם הבקשה מותרת על פי הביצועים
      if (!performanceManager.canMakeRequest(requestKey)) {
        debug("⏸️ Request blocked by performance manager", { requestKey });
        globalCache.clearActiveFetch(fetchKey);
        if (isMountedRef.current) setIsLoading(false);
        return;
      }

      globalCache.setActiveFetch(fetchKey);
      setIsLoading(true);
      setError(null);

      debug("🔄 Fetching next workout recommendation", {
        weeklyPlan,
        userPresent: !!user,
      });
      debug("👤 User data sources", {
        hasQuestionnaireData: !!user?.questionnairedata,
        hasQuestionnaire: !!user?.questionnaire,
        hasSmartData: !!user?.smartquestionnairedata,
        hasExtendedData: !!user?.trainingstats,
      });

      // ✅ הכנת נתונים אישיים מהשאלון החדש לשיפור המלצות - משופר
      const personalData =
        enhancedPersonalData || getPersonalDataFromUser(user);

      debug("🎯 Enhanced personal data for recommendations", personalData);

      // בדיקת בטיחות מתקדמת - וידוא שהשירות קיים
      if (
        !nextWorkoutLogicService ||
        typeof nextWorkoutLogicService.getNextWorkoutRecommendation !==
          "function"
      ) {
        throw new Error("nextWorkoutLogicService is not properly initialized");
      }

      // הרץ במקביל עם טיפול בשגיאות חכם - כולל נתונים אישיים
      const [recommendation, stats] = await Promise.all([
        nextWorkoutLogicService.getNextWorkoutRecommendation(
          weeklyPlan,
          personalData
        ),
        nextWorkoutLogicService.getCycleStatistics().catch((err) => {
          logger.warn("useNextWorkout", "Could not get cycle stats", {
            error: err.message,
            stack: err.stack,
          });
          return null; // החזר null במקום לכשל
        }),
      ]);

      if (isMountedRef.current) {
        setNextWorkout(recommendation);
        setCycleStats(stats);

        // ✅ שמירה ב-cache גלובלי
        globalCache.setCachedRecommendation(recommendation, userId);

        // ✅ שמירה במנהל הביצועים הגלובלי
        performanceManager.setCachedData(requestKey, recommendation, 30000); // 30 שניות
        performanceManager.completeRequest(requestKey);

        // ✅ יצירת insights מותאמים אישית מהנתונים החדשים
        if (personalData && recommendation) {
          const insights = generatePersonalizedInsights(
            recommendation,
            personalData,
            stats
          );
          setPersonalizedInsights(insights);
        }
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

      // שימוש במערכת דיווח שגיאות מרכזית
      errorHandler.reportError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          source: "useNextWorkout.refreshRecommendation",
          context: {
            weeklyPlan,
            userPresent: !!user,
            hasPersonalData: !!enhancedPersonalData,
          },
        }
      );

      setError(errorMessage);
      logger.error("useNextWorkout", "Error getting next workout", {
        error: errorMessage,
        weeklyPlan,
        userPresent: !!user,
      });

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
      const userId = user?.id || "anonymous";
      const fetchKey = `${userId}_${JSON.stringify(weeklyPlan)}`;
      globalCache.clearActiveFetch(fetchKey);
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [
    weeklyPlan,
    user,
    enhancedPersonalData,
    generatePersonalizedInsights,
    globalCache,
  ]);

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
          logger.error("useNextWorkout", "Service initialization error", {
            error,
          });
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

        // שימוש במערכת דיווח שגיאות מרכזית
        errorHandler.reportError(
          err instanceof Error ? err : new Error(errorMessage),
          {
            source: "useNextWorkout.markWorkoutCompleted",
            context: {
              workoutName,
              workoutIndex,
              timestamp: new Date().toISOString(),
            },
          }
        );

        logger.error("useNextWorkout", "Error marking workout completed", {
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
   * טעינה ראשונית עם throttling
   * Initial load with throttling
   */
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // ✅ מניעת קריאות מיותרות - רק פעם אחת או כשמשתמש משתנה
    if (!hasInitializedRef.current || !nextWorkout) {
      hasInitializedRef.current = true;
      refreshRecommendation();
    }
  }, [user?.id, nextWorkout, refreshRecommendation]); // תיקון dependencies

  // ✅ רענון כשמשתנה תוכנית האימון
  useEffect(() => {
    if (hasInitializedRef.current && workoutPlan) {
      const timeoutId = setTimeout(() => {
        refreshRecommendation();
      }, 100); // debounce קצר
      return () => clearTimeout(timeoutId);
    }
    return undefined; // תיקון return value
  }, [workoutPlan, refreshRecommendation]); // תיקון dependencies

  return {
    nextWorkout,
    isLoading,
    error,
    refreshRecommendation,
    markWorkoutCompleted,
    cycleStats,
    // ✅ יכולות חדשות מתקדמות
    personalizedInsights,
    weeklyPlanCache,
    resetCache,
    // ✅ מעקב ביצועים
    cacheStats: WorkoutHookCache.getCacheStats(),
  };
};
