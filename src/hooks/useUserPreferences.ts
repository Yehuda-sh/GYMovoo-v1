/**
 * @file src/hooks/useUserPreferences.ts
 * @description Hook חכם לגישה נוחה לנתוני העדפות המשתמש עם אלגוריתמים מתקדמים
 * @description Smart hook for convenient access to user preferences with advanced algorithms
 * @dependencies questionnaireService, userStore
 * @notes Hook מרכזי לכל הפעולות הקשורות להעדפות משתמש עם תמיכה במערכת החדשה
 * @notes Central hook for all user preferences operations with new system support
 * @features Smart analysis, multi-system support, Hebrew UX, algorithm scoring
 */

import { useState, useEffect, useCallback } from "react";
import { questionnaireService } from "../services/questionnaireService";
import { QuestionnaireMetadata, WorkoutRecommendation } from "../types";
import { useUserStore } from "../stores/userStore";

// ממשק מורחב לתוצאות חכמות
export interface SmartUserPreferences extends QuestionnaireMetadata {
  // ניתוח חכם
  personalityProfile:
    | "מתחיל זהיר"
    | "נחוש להצליח"
    | "ספורטאי מנוסה"
    | "מחפש איזון";
  motivationLevel: number; // 1-10
  consistencyScore: number; // 1-10
  equipmentReadiness: number; // 1-10
  algorithmConfidence: "high" | "medium" | "low";

  // המלצות חכמות
  smartRecommendations: {
    idealWorkoutTime: "בוקר" | "צהריים" | "ערב";
    progressionPace: "איטי" | "בינוני" | "מהיר";
    focusAreas: string[];
    warningFlags: string[];
  };
}

interface UseUserPreferencesReturn {
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

  // המלצות משופרות
  workoutRecommendations: WorkoutRecommendation[];
  quickWorkout: WorkoutRecommendation | null;
  smartWorkoutPlan: unknown; // תוכנית מותאמת אישית

  // פונקציות חכמות נוספות
  refreshPreferences: () => Promise<void>;
  clearPreferences: () => Promise<void>;
  getSmartInsights: () => string[];
  calculateUserScore: () => number;
  shouldRecommendUpgrade: () => boolean;
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

  // המלצות משופרות
  const [workoutRecommendations, setWorkoutRecommendations] = useState<
    WorkoutRecommendation[]
  >([]);
  const [quickWorkout, setQuickWorkout] =
    useState<WorkoutRecommendation | null>(null);
  const [smartWorkoutPlan, setSmartWorkoutPlan] = useState<unknown>(null);

  // גישה ל-store
  const user = useUserStore((state) => state.user);

  // פונקציה לחישוב אלגוריתם חכם מנתוני שאלון
  const calculateSmartAnalysis = useCallback(
    (rawData: QuestionnaireMetadata): SmartUserPreferences => {
      // חישוב ציון מוטיבציה (1-10)
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

      // חישוב ציון עקביות
      const consistencyScore =
        rawData.frequency === "יומי"
          ? 10
          : rawData.frequency === "5-6 פעמים בשבוע"
            ? 9
            : rawData.frequency === "3-4 פעמים בשבוע"
              ? 7
              : rawData.frequency === "2-3 פעמים בשבוע"
                ? 5
                : 3;

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

      // חישוב רמת ביטחון באלגוריתם
      const totalData =
        (rawData.age ? 1 : 0) +
        (rawData.gender ? 1 : 0) +
        (rawData.goal ? 1 : 0) +
        (rawData.experience ? 1 : 0) +
        (rawData.frequency ? 1 : 0) +
        equipmentCount;

      const algorithmConfidence: SmartUserPreferences["algorithmConfidence"] =
        totalData >= 8 ? "high" : totalData >= 5 ? "medium" : "low";

      // המלצות חכמות
      const smartRecommendations = {
        idealWorkoutTime: (motivationLevel >= 8
          ? "בוקר"
          : rawData.location === "בית"
            ? "ערב"
            : "צהריים") as "בוקר" | "צהריים" | "ערב",
        progressionPace: (rawData.experience === "מתחיל"
          ? "איטי"
          : consistencyScore >= 8
            ? "מהיר"
            : "בינוני") as "איטי" | "בינוני" | "מהיר",
        focusAreas: generateFocusAreas(rawData),
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

  // פונקציות עזר לאלגוריתם
  const generateFocusAreas = (data: QuestionnaireMetadata): string[] => {
    const areas: string[] = [];
    if (data.goal?.includes("שריפת שומן")) areas.push("קרדיו");
    if (data.goal?.includes("בניית שריר")) areas.push("כוח");
    if (data.experience === "מתחיל") areas.push("טכניקה");
    if (data.health_conditions?.length) areas.push("בטיחות");
    return areas.length ? areas : ["כושר כללי"];
  };

  const generateWarningFlags = (
    data: QuestionnaireMetadata,
    motivation: number,
    consistency: number
  ): string[] => {
    const warnings: string[] = [];
    if (motivation < 4) warnings.push("מוטיבציה נמוכה");
    if (consistency < 4) warnings.push("תדירות נמוכה");
    if (data.health_conditions?.length) warnings.push("מצב בריאותי");
    if (!data.home_equipment?.length && !data.gym_equipment?.length) {
      warnings.push("ציוד מוגבל");
    }
    return warnings;
  };

  // פונקציות עזר נוספות
  const calculateDataQuality = (data: QuestionnaireMetadata): number => {
    let score = 0;
    if (data.age) score += 1;
    if (data.gender) score += 1;
    if (data.goal) score += 2;
    if (data.experience) score += 2;
    if (data.frequency) score += 2;
    if (data.duration) score += 1;
    if (data.location) score += 1;
    return Math.min(10, score);
  };

  const generatePersonalizedInsights = (
    data: SmartUserPreferences
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
    return insights;
  };

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
        console.log("📱 המר מפורמט store ישן");
      }

      setSystemType(currentSystemType);

      if (rawPreferences) {
        // הפוך לנתונים חכמים
        const smartPreferences = calculateSmartAnalysis(rawPreferences);
        setPreferences(smartPreferences);

        // חשב איכות השלמה
        const quality = calculateDataQuality(rawPreferences);
        setCompletionQuality(quality);

        // צור תובנות מותאמות אישית
        const insights = generatePersonalizedInsights(smartPreferences);
        setPersonalizedInsights(insights);
      }

      // טען נתונים ספציפיים
      await loadSpecificData();

      setIsInitialized(true);
      console.log("✅ טעינה חכמה הושלמה בהצלחה");
    } catch (err) {
      console.error("❌ שגיאה בטעינה חכמה:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load preferences"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, calculateSmartAnalysis]);

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

  const loadSpecificData = async () => {
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

    // טען המלצות אם השלים שאלון
    if (completed) {
      const [recommendations, quick] = await Promise.all([
        questionnaireService.getWorkoutRecommendations(),
        questionnaireService.getQuickWorkout(),
      ]);

      setWorkoutRecommendations(recommendations);
      setQuickWorkout(quick);

      // צור תוכנית אימון חכמה
      setSmartWorkoutPlan(createSmartWorkoutPlan(recommendations, preferences));
    }
  };

  const createSmartWorkoutPlan = (
    recommendations: WorkoutRecommendation[],
    prefs: SmartUserPreferences | null
  ) => {
    if (!prefs) return null;

    return {
      weeklySchedule: recommendations.slice(0, 3),
      personalityMatch: prefs.personalityProfile,
      focusAreas: prefs.smartRecommendations.focusAreas,
      progressionPace: prefs.smartRecommendations.progressionPace,
      motivationalBoost:
        prefs.motivationLevel >= 7
          ? "מוכן לפריצת דרך!"
          : "התקדמות יציבה היא המפתח",
    };
  };

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

    // המלצות משופרות
    workoutRecommendations,
    quickWorkout,
    smartWorkoutPlan,

    // פונקציות
    refreshPreferences,
    clearPreferences,
    getSmartInsights,
    calculateUserScore,
    shouldRecommendUpgrade,
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
