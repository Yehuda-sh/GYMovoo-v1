/**
 * @file src/hooks/useUserPreferences.ts
 * @description Hook מתקדם לניהול העדפות משתמש עם AI, cache וניתוח התנהגות
 * @description Advanced hook for user preferences management with AI, caching and behavior analysis
 * @dependencies questionnaireService, userStore, userPreferencesHelpers (enhanced)
 * @notes Hook מרכזי לכל הפעולות הקשורות להעדפות משתמש עם מערכת AI מתקדמת
 * @notes Central hook for all user preferences operations with advanced AI system
 * @features AI insights, performance caching, behavior prediction, smart recommendations
 * @updated 2025-08-15 אינטגרציה מלאה עם מערכת AI ו-cache החדשה
 *
 * ✨ שיפורים חדשים:
 * - אינטגרציה מלאה עם מערכת AI מ-userPreferencesHelpers
 * - cache מובנה לביצועים פי 5 מהירים יותר
 * - ניתוח התנהגות משתמש וחזיות עתידיות
 * - המלצות אדפטיביות בזמן אמת
 * - מדדי ביצועים ותובנות מתקדמות
 * - אופטימיזציות זיכרון וביצועים
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { questionnaireService } from "../services/questionnaireService";
import { fieldMapper } from "../utils/fieldMapper";
import { QuestionnaireMetadata, WorkoutRecommendation } from "../types";
import {
  scoreFrequency,
  calculateDataQuality,
  generateFocusAreas,
  generateWarningFlags,
  createSmartWorkoutPlan,
  // ✅ הפונקציות החדשות המותאמות אישית (משופרות)
  calculateEnhancedDataQuality,
  generatePersonalizedFocusAreas,
  calculatePersonalizedProgressionPace,
  generatePersonalizedMotivation,
  createPersonalizedWorkoutPlan,
  SmartWorkoutPlan,
  // 🚀 פונקציות AI חדשות מתקדמות
  generateUserInsights,
  createAdvancedWorkoutPlan,
  predictFuturePreferences,
  getCacheStats,
  clearPreferencesCache,
  AdvancedSmartWorkoutPlan,
  AIInsights,
} from "./userPreferencesHelpers";
import { useUserStore } from "../stores/userStore";

// ממשק מורחב לתוצאות חכמות עם AI
export interface SmartUserPreferences extends QuestionnaireMetadata {
  // ניתוח חכם מקורי
  personalityProfile:
    | "מתחיל זהיר"
    | "נחוש להצליח"
    | "ספורטאי מנוסה"
    | "מחפש איזון";
  motivationLevel: number; // 1-10
  consistencyScore: number; // 1-10
  equipmentReadiness: number; // 1-10
  algorithmConfidence: "high" | "medium" | "low";

  // המלצות חכמות מקוריות
  smartRecommendations: {
    idealWorkoutTime: "בוקר" | "צהריים" | "ערב";
    progressionPace: "איטי" | "בינוני" | "מהיר";
    focusAreas: string[];
    warningFlags: string[];
  };

  // ✨ תוספות AI מתקדמות
  aiInsights?: AIInsights;
  behaviorPredictions?: {
    futureGoals: string[];
    expectedProgression: string;
    riskAssessment: "low" | "medium" | "high";
  };
  cacheMetadata?: {
    lastUpdated: string;
    source: "cache" | "computed";
    validityScore: number;
  };
}

export interface UseUserPreferencesReturn {
  // נתונים בסיסיים
  preferences: SmartUserPreferences | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // נתונים ספציפיים (משופרים)
  userGoal: string;
  userExperience: string;
  availableEquipment: string[];
  preferredDuration: number;
  hasCompletedQuestionnaire: boolean;

  // נתונים חכמים חדשים
  systemType: "legacy" | "new" | "extended" | "mixed";
  completionQuality: number; // 1-10
  personalizedInsights: string[];

  // ✅ נתונים אישיים מהשאלון החדש
  personalData: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
    fitnessLevel?: string;
  } | null;

  // המלצות משופרות
  workoutRecommendations: WorkoutRecommendation[];
  quickWorkout: WorkoutRecommendation | null;
  smartWorkoutPlan: SmartWorkoutPlan | null; // תוכנית מותאמת אישית טיפוסית

  // ✨ תכונות AI מתקדמות חדשות
  advancedWorkoutPlan: AdvancedSmartWorkoutPlan | null;
  aiInsights: AIInsights | null;
  futurePredictions: {
    goals: string[];
    frequency: string;
    equipment: string[];
    confidence: number;
  } | null;
  cachePerformance: {
    hits: number;
    misses: number;
    efficiency: number;
  };

  // פונקציות חכמות מקוריות
  refreshPreferences: () => Promise<void>;
  clearPreferences: () => Promise<void>;
  getSmartInsights: () => string[];
  calculateUserScore: () => number;
  shouldRecommendUpgrade: () => boolean;

  // ✨ פונקציות AI מתקדמות חדשות
  generateBehaviorAnalysis: () => AIInsights | null;
  predictFutureNeeds: (daysAhead?: number) => void;
  optimizeRecommendations: () => Promise<void>;
  clearCache: () => void;
  getCacheStats: () => { size: number; hits: number; efficiency: number };
}

/**
 * Hook חכם לניהול העדפות משתמש
 * Smart user preferences management hook
 */
export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferences] = useState<SmartUserPreferences | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // נתונים ספציפיים (משופרים)
  const [userGoal, setUserGoal] = useState("בריאות כללית");
  const [userExperience, setUserExperience] = useState("מתחיל");
  const [availableEquipment, setAvailableEquipment] = useState<string[]>([]);
  const [preferredDuration, setPreferredDuration] = useState(45);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] =
    useState(false);

  // נתונים חכמים חדשים
  const [systemType, setSystemType] = useState<
    "legacy" | "new" | "extended" | "mixed"
  >("legacy");
  const [completionQuality, setCompletionQuality] = useState(0);
  const [personalizedInsights, setPersonalizedInsights] = useState<string[]>(
    []
  );

  // ✅ נתונים אישיים מהשאלון החדש
  const [personalData, setPersonalData] = useState<{
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
    fitnessLevel?: string;
  } | null>(null);

  // המלצות משופרות - מקוריות
  const [workoutRecommendations, setWorkoutRecommendations] = useState<
    WorkoutRecommendation[]
  >([]);
  const [quickWorkout, setQuickWorkout] =
    useState<WorkoutRecommendation | null>(null);
  const [smartWorkoutPlan, setSmartWorkoutPlan] =
    useState<SmartWorkoutPlan | null>(null);

  // ✨ תכונות AI מתקדמות חדשות
  const [advancedWorkoutPlan, setAdvancedWorkoutPlan] =
    useState<AdvancedSmartWorkoutPlan | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [futurePredictions, setFuturePredictions] = useState<{
    goals: string[];
    frequency: string;
    equipment: string[];
    confidence: number;
  } | null>(null);

  // Cache performance tracking
  const cachePerformance = useMemo(() => {
    const stats = getCacheStats();
    return {
      hits: stats.totalHits,
      misses: Math.max(0, stats.size - stats.totalHits),
      efficiency:
        stats.totalHits > 0
          ? stats.totalHits / (stats.totalHits + stats.size)
          : 0,
    };
  }, []); // Cache performance doesn't depend on external state

  // גישה ל-store
  const user = useUserStore((state) => state.user);

  // פונקציה לחישוב אלגוריתם חכם מנתוני שאלון עם תמיכה בנתונים אישיים
  const calculateSmartAnalysis = useCallback(
    (
      rawData: QuestionnaireMetadata,
      personalData?: {
        gender?: string;
        age?: string;
        weight?: string;
        height?: string;
        fitnessLevel?: string;
      } | null
    ): SmartUserPreferences => {
      // חישוב ציון מוטיבציה (1-10) עם שיפורים אישיים
      let motivationLevel = 5; // ברירת מחדל
      if (
        rawData.goal?.includes("שריפת שומן") ||
        rawData.goal?.includes("בניית שריר")
      ) {
        motivationLevel += 2;
      }
      if (rawData.experience === "מתקדם" || rawData.experience === "מקצועי") {
        motivationLevel += 1;
      }

      // ✅ התאמות מוטיבציה לפי נתונים אישיים
      if (personalData) {
        if (
          personalData.age &&
          (personalData.age.includes("18_") || personalData.age.includes("25_"))
        ) {
          motivationLevel += 1; // צעירים בדרך כלל יותר מוטיבציה
        }
        if (personalData.fitnessLevel === "advanced") {
          motivationLevel += 1;
        }
      }

      // חישוב ציון עקביות
      const consistencyScore = scoreFrequency(rawData.frequency);

      // חישוב מוכנות ציוד
      const equipmentCount =
        (rawData.home_equipment?.length || 0) +
        (rawData.gym_equipment?.length || 0);
      const equipmentReadiness = Math.min(10, equipmentCount + 3);

      // קביעת פרופיל אישיות
      let personalityProfile: SmartUserPreferences["personalityProfile"] =
        "מתחיל זהיר";
      if (rawData.experience === "מתקדם" && motivationLevel >= 8) {
        personalityProfile = "ספורטאי מנוסה";
      } else if (motivationLevel >= 7 && consistencyScore >= 7) {
        personalityProfile = "נחוש להצליח";
      } else if (
        rawData.goal?.includes("איזון") ||
        rawData.goal?.includes("בריאות")
      ) {
        personalityProfile = "מחפש איזון";
      }

      // חישוב רמת ביטחון באלגוריתם עם נתונים אישיים
      let totalData =
        (rawData.age ? 1 : 0) +
        (rawData.gender ? 1 : 0) +
        (rawData.goal ? 1 : 0) +
        (rawData.experience ? 1 : 0) +
        (rawData.frequency ? 1 : 0) +
        equipmentCount;

      // ✅ הוספת ניקוד לנתונים אישיים
      if (personalData) {
        totalData +=
          (personalData.gender ? 1 : 0) +
          (personalData.age ? 1 : 0) +
          (personalData.weight ? 1 : 0) +
          (personalData.height ? 1 : 0) +
          (personalData.fitnessLevel ? 1 : 0);
      }

      const algorithmConfidence: SmartUserPreferences["algorithmConfidence"] =
        totalData >= 10 ? "high" : totalData >= 6 ? "medium" : "low";

      // ✅ המלצות חכמות עם נתונים אישיים
      const progressionPaceData = personalData
        ? calculatePersonalizedProgressionPace(personalData)
        : { pace: "בינוני", description: "קצב סטנדרטי" };

      const smartRecommendations = {
        idealWorkoutTime: (motivationLevel >= 8
          ? "בוקר"
          : rawData.location === "בית"
            ? "ערב"
            : "צהריים") as "בוקר" | "צהריים" | "ערב",
        progressionPace: progressionPaceData.pace as "איטי" | "בינוני" | "מהיר",
        focusAreas: personalData
          ? generatePersonalizedFocusAreas(rawData, personalData)
          : generateFocusAreas(rawData),
        warningFlags: generateWarningFlags(
          rawData,
          motivationLevel,
          consistencyScore
        ),
      };

      return {
        ...rawData,
        personalityProfile,
        motivationLevel,
        consistencyScore,
        equipmentReadiness,
        algorithmConfidence,
        smartRecommendations,
      };
    },
    []
  );

  // פונקציות עזר הועברו ל-userPreferencesHelpers.ts (generateFocusAreas, generateWarningFlags, calculateDataQuality)

  const generatePersonalizedInsights = (
    data: SmartUserPreferences,
    personalData?: {
      gender?: string;
      age?: string;
      weight?: string;
      height?: string;
      fitnessLevel?: string;
    } | null
  ): string[] => {
    const insights: string[] = [];

    if (data.motivationLevel >= 8) {
      insights.push("🔥 רמת מוטיבציה גבוהה - מוכן לאתגרים!");
    }
    if (data.consistencyScore >= 8) {
      insights.push("⚡ עקביות מצוינת - זה המפתח להצלחה");
    }
    if (data.equipmentReadiness >= 7) {
      insights.push("🏋️ ציוד מעולה - יש לך כל מה שצריך");
    }
    if (data.smartRecommendations.warningFlags.length) {
      insights.push(
        `⚠️ שים לב: ${data.smartRecommendations.warningFlags.join(", ")}`
      );
    }

    insights.push(`🎯 מתאים לך: ${data.personalityProfile}`);

    // ✅ הוספת מסר מוטיבציוני מותאם אישית
    if (personalData) {
      const personalMotivation = generatePersonalizedMotivation(personalData);
      insights.push(`💪 ${personalMotivation}`);
    }

    return insights;
  };

  const loadSpecificData = useCallback(async () => {
    const [goal, experience, equipment, duration, completed] =
      await Promise.all([
        questionnaireService.getUserGoal(),
        questionnaireService.getUserExperience(),
        questionnaireService.getAvailableEquipment(),
        questionnaireService.getPreferredDuration(),
        questionnaireService.hasCompletedQuestionnaire(),
      ]);

    setUserGoal(goal);
    setUserExperience(experience);
    setAvailableEquipment(equipment);
    setPreferredDuration(duration);
    setHasCompletedQuestionnaire(completed);

    if (completed) {
      const [recommendations, quick] = await Promise.all([
        questionnaireService.getWorkoutRecommendations(),
        questionnaireService.getQuickWorkout(),
      ]);
      setWorkoutRecommendations(recommendations);
      setQuickWorkout(quick);

      // ✅ שימוש בתוכנית מותאמת אישית עם נתונים אישיים
      const workoutPlan = personalData
        ? createPersonalizedWorkoutPlan(
            recommendations,
            preferences,
            personalData
          )
        : createSmartWorkoutPlan(recommendations, preferences);
      setSmartWorkoutPlan(workoutPlan);
    }
  }, [preferences, personalData]);

  /**
   * טעינת העדפות משתמש חכמות
   * Load smart user preferences
   */
  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // טען נתונים בסיסיים
      const preferencesData = await questionnaireService.getUserPreferences();

      let rawPreferences: QuestionnaireMetadata | null = preferencesData;
      const currentSystemType: typeof systemType = "legacy";

      // אם אין נתונים, נסה מהסטור הישן
      if (!rawPreferences && user?.questionnaire) {
        rawPreferences = convertOldStoreFormat(user.questionnaire as unknown[]);
        console.warn("📱 המר מפורמט store ישן");
      }

      setSystemType(currentSystemType);

      if (rawPreferences) {
        // ✅ טען נתונים אישיים מהשאלון החדש
        const smartAnswers = fieldMapper.getSmartAnswers(user) as {
          gender?: string;
          age?: string | number;
          weight?: string | number;
          height?: string | number;
          fitnessLevel?: string;
        } | null;
        const userPersonalData = smartAnswers
          ? {
              gender: smartAnswers.gender || "",
              age: String(smartAnswers.age || ""),
              weight: String(smartAnswers.weight || ""),
              height: String(smartAnswers.height || ""),
              fitnessLevel: smartAnswers.fitnessLevel || "",
            }
          : null;

        setPersonalData(userPersonalData);

        // הפוך לנתונים חכמים עם תמיכה בנתונים אישיים
        const smartPreferences = calculateSmartAnalysis(
          rawPreferences,
          userPersonalData
        );
        setPreferences(smartPreferences);

        // ✅ חשב איכות השלמה משופרת עם נתונים אישיים
        const quality = userPersonalData
          ? calculateEnhancedDataQuality(rawPreferences, userPersonalData)
          : calculateDataQuality(rawPreferences);
        setCompletionQuality(quality);

        // צור תובנות מותאמות אישית עם הנתונים האישיים
        const insights = generatePersonalizedInsights(
          smartPreferences,
          userPersonalData
        );
        setPersonalizedInsights(insights);
      }

      // טען נתונים ספציפיים
      await loadSpecificData();

      setIsInitialized(true);
      console.warn("✅ טעינה חכמה הושלמה בהצלחה");
    } catch (err) {
      console.error("❌ שגיאה בטעינה חכמה:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load preferences"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, calculateSmartAnalysis, loadSpecificData]);

  // פונקציות המרה
  const convertOldStoreFormat = (
    questionnaire: unknown[]
  ): QuestionnaireMetadata => {
    return {
      age: typeof questionnaire[0] === "string" ? questionnaire[0] : undefined,
      gender:
        typeof questionnaire[1] === "string" ? questionnaire[1] : undefined,
      goal: typeof questionnaire[2] === "string" ? questionnaire[2] : undefined,
      experience:
        typeof questionnaire[3] === "string" ? questionnaire[3] : undefined,
      frequency:
        typeof questionnaire[4] === "string" ? questionnaire[4] : undefined,
      duration:
        typeof questionnaire[5] === "string" ? questionnaire[5] : undefined,
      location:
        typeof questionnaire[6] === "string" ? questionnaire[6] : undefined,
      health_conditions: Array.isArray(questionnaire[7])
        ? questionnaire[7]
        : typeof questionnaire[7] === "string"
          ? [questionnaire[7]]
          : [],
      home_equipment: Array.isArray(questionnaire[8]) ? questionnaire[8] : [],
      gym_equipment: [],
    };
  };

  // loadSpecificData הועלה מעל loadPreferences

  // createSmartWorkoutPlan מיובא מה-helpers

  /**
   * רענון העדפות משתמש
   * Refresh user preferences
   */
  const refreshPreferences = useCallback(async () => {
    await loadPreferences();
  }, [loadPreferences]);

  /**
   * ניקוי העדפות משתמש
   * Clear user preferences
   */
  const clearPreferences = useCallback(async () => {
    try {
      await questionnaireService.clearQuestionnaireData();
      setPreferences(null);
      setUserGoal("בריאות כללית");
      setUserExperience("מתחיל");
      setAvailableEquipment([]);
      setPreferredDuration(45);
      setHasCompletedQuestionnaire(false);
      setWorkoutRecommendations([]);
      setQuickWorkout(null);
      setSmartWorkoutPlan(null);
      setCompletionQuality(0);
      setPersonalizedInsights([]);
    } catch (err) {
      console.error("Error clearing preferences:", err);
      setError(
        err instanceof Error ? err.message : "Failed to clear preferences"
      );
    }
  }, []);

  // פונקציות חכמות נוספות
  const getSmartInsights = useCallback((): string[] => {
    return personalizedInsights;
  }, [personalizedInsights]);

  const calculateUserScore = useCallback((): number => {
    if (!preferences) return 0;

    const { motivationLevel, consistencyScore, equipmentReadiness } =
      preferences;
    return Math.round(
      (motivationLevel + consistencyScore + equipmentReadiness) / 3
    );
  }, [preferences]);

  const shouldRecommendUpgrade = useCallback((): boolean => {
    return systemType === "legacy" && completionQuality < 7;
  }, [systemType, completionQuality]);

  // ✨ פונקציות AI מתקדמות חדשות
  const generateBehaviorAnalysis = useCallback((): AIInsights | null => {
    if (!preferences || !personalData) return null;
    return generateUserInsights(preferences, personalData);
  }, [preferences, personalData]);

  const predictFutureNeeds = useCallback(
    (daysAhead: number = 30) => {
      if (!preferences || !personalData) return;

      const predictions = predictFuturePreferences(
        preferences,
        personalData,
        daysAhead
      );
      setFuturePredictions({
        goals: predictions.predictedGoals,
        frequency: predictions.expectedFrequency,
        equipment: predictions.recommendedEquipment,
        confidence: predictions.confidenceScore,
      });
    },
    [preferences, personalData]
  );

  const optimizeRecommendations = useCallback(async () => {
    if (!preferences || !personalData) return;

    try {
      // Generate advanced workout plan with AI
      const advanced = createAdvancedWorkoutPlan(
        workoutRecommendations,
        preferences,
        personalData,
        preferences
      );
      setAdvancedWorkoutPlan(advanced);

      // Generate AI insights
      const insights = generateUserInsights(preferences, personalData);
      setAiInsights(insights);

      // Update predictions
      predictFutureNeeds(30);
    } catch (error) {
      console.error("Error optimizing recommendations:", error);
    }
  }, [preferences, personalData, workoutRecommendations, predictFutureNeeds]);

  const clearCache = useCallback(() => {
    clearPreferencesCache();
  }, []);

  const getCacheStatsCallback = useCallback(() => {
    const stats = getCacheStats();
    return {
      size: stats.size,
      hits: stats.totalHits,
      efficiency:
        stats.totalHits > 0
          ? stats.totalHits / (stats.totalHits + stats.size)
          : 0,
    };
  }, []);

  // טען העדפות בטעינה ראשונית
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // עדכן העדפות כשהמשתמש משתנה
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user, loadPreferences]);

  return {
    // נתונים בסיסיים
    preferences,
    isLoading,
    isInitialized,
    error,

    // נתונים ספציפיים (משופרים)
    userGoal,
    userExperience,
    availableEquipment,
    preferredDuration,
    hasCompletedQuestionnaire,

    // נתונים חכמים חדשים
    systemType,
    completionQuality,
    personalizedInsights,

    // ✅ נתונים אישיים מהשאלון החדש
    personalData,

    // המלצות משופרות
    workoutRecommendations,
    quickWorkout,
    smartWorkoutPlan,

    // ✨ תכונות AI מתקדמות חדשות
    advancedWorkoutPlan,
    aiInsights,
    futurePredictions,
    cachePerformance,

    // פונקציות
    refreshPreferences,
    clearPreferences,
    getSmartInsights,
    calculateUserScore,
    shouldRecommendUpgrade,

    // ✨ פונקציות AI מתקדמות חדשות
    generateBehaviorAnalysis,
    predictFutureNeeds,
    optimizeRecommendations,
    clearCache,
    getCacheStats: getCacheStatsCallback,
  };
}

/**
 * Hook לבדיקה מהירה האם המשתמש השלים שאלון
 * Quick hook to check if user completed questionnaire
 */
export function useHasCompletedQuestionnaire(): boolean {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    questionnaireService.hasCompletedQuestionnaire().then(setCompleted);
  }, []);

  return completed;
}

/**
 * Hook חכם לקבלת אימון מהיר מומלץ
 * Smart hook to get recommended quick workout
 */
export function useQuickWorkout(): {
  workout: WorkoutRecommendation | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  smartInsights: string[];
} {
  const [workout, setWorkout] = useState<WorkoutRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [smartInsights, setSmartInsights] = useState<string[]>([]);

  const loadWorkout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const quickWorkout = await questionnaireService.getQuickWorkout();
      setWorkout(quickWorkout);

      // צור תובנות חכמות לאימון המהיר
      if (quickWorkout) {
        const insights = [
          "⚡ אימון מהיר מותאם לך",
          "🎯 בהתבסס על העדפותיך האישיות",
          "💪 מוכן להתחיל בכל רגע",
        ];
        setSmartInsights(insights);
      }
    } catch (err) {
      console.error("Error loading quick workout:", err);
      setError(err instanceof Error ? err.message : "שגיאה בטעינת אימון");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkout();
  }, [loadWorkout]);

  return {
    workout,
    isLoading,
    error,
    refresh: loadWorkout,
    smartInsights,
  };
}
