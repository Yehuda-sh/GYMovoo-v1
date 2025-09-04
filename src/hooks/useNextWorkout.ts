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
// 🚀 Simplified Hook Logic - לוגיקה פשוטה ומיושרת
// ===============================================

/**
 * Simple cache for workout recommendations
 * Cache פשוט להמלצות אימון
 */
const simpleCache = {
  recommendation: null as NextWorkoutRecommendation | null,
  timestamp: 0,
  CACHE_DURATION: 30000, // 30 שניות - סביר יותר

  get(userId?: string): NextWorkoutRecommendation | null {
    const now = Date.now();
    if (this.recommendation && now - this.timestamp < this.CACHE_DURATION) {
      logger.debug("useNextWorkout", "Using cached recommendation", { userId });
      return this.recommendation;
    }
    return null;
  },

  set(recommendation: NextWorkoutRecommendation, userId?: string): void {
    this.recommendation = recommendation;
    this.timestamp = Date.now();
    logger.debug("useNextWorkout", "Cached recommendation", {
      workoutName: recommendation.workoutName,
      userId,
    });
  },

  clear(): void {
    this.recommendation = null;
    this.timestamp = 0;
  },
};

// Helper functions
const generatePersonalizedInsights = (
  recommendation: NextWorkoutRecommendation,
  personalData: Record<string, unknown> | null
): { recommendation: string; motivation: string; nextGoal: string } => {
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

  /**
   * Reset cache function
   * פונקציית איפוס cache
   */
  const resetCache = useCallback(() => {
    simpleCache.clear(); // ✅ ניקוי cache פשוט
    setWeeklyPlanCache([]);
    setPersonalizedInsights(null);
    hasInitializedRef.current = false; // ✅ איפוס flag של initialization

    logger.info("useNextWorkout", "Cache reset completed");
    debug("🧹 Cache cleared");
  }, []);

  /**
   * Enhanced personal data extraction with questionnaire integration
   * חילוץ נתונים אישיים משופר עם אינטגרציה לשאלון
   */
  const enhancedPersonalData = useMemo(() => {
    if (!user) return null;

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
        fitnessLevel: (answers.fitnessLevel ||
          answers["experience" as keyof typeof answers]) as string, // Fix: try both field names
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

    debug("💾 Personal data processed", { data });
    logger.debug("useNextWorkout", "Personal data processed", {
      dataKeys: Object.keys(data || {}),
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

    setWeeklyPlanCache(selectedPlan);

    debug("Generated weekly plan", {
      userId,
      rawFrequency,
      days,
      selectedPlan,
    });

    logger.debug("useNextWorkout", "Weekly plan generated", {
      userId,
      rawFrequency,
      days,
      selectedPlan,
    });

    return selectedPlan;
  }, [workoutPlan, user, extractFrequencyFromUser, parseFrequencyToDays]);

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

      // ✅ בדיקת cache פשוט
      const cachedRecommendation = simpleCache.get(userId);
      if (cachedRecommendation) {
        setNextWorkout(cachedRecommendation);
        setIsLoading(false);
        debug("🚀 Using cached recommendation", cachedRecommendation);
        return;
      }

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

        // ✅ שמירה ב-cache פשוט
        simpleCache.set(recommendation, userId);

        // ✅ יצירת insights מותאמים אישית מהנתונים החדשים
        if (personalData && recommendation) {
          const insights = generatePersonalizedInsights(
            recommendation,
            personalData
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
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [weeklyPlan, user, enhancedPersonalData]);

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
    // ✅ מעקב ביצועים פשוט
    cacheStats: {
      simpleCache: simpleCache.recommendation ? 1 : 0,
    },
  };
};
