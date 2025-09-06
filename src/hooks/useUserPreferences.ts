/**
 * @file src/hooks/useUserPreferences.ts
 * @description Hook פשוט וממוקד לניהול העדפות משתמש
 * @dependencies questionnaireService, userStore, userPreferencesHelpers, logger
 * @notes Hook מרכזי לכל הפעולות הקשורות להעדפות משתמש - נוקה מקוד מיותר
 * @updated 2025-09-03 פישוט וניקוי קוד מיותר
 */

import { useState, useEffect, useCallback } from "react";
import { logger } from "../utils/logger";
import { questionnaireService } from "../services/questionnaireService";
import { fieldMapper } from "../utils/fieldMapper";
import { QuestionnaireMetadata, WorkoutRecommendation } from "../types";
import { useUserStore } from "../stores/userStore";
import {
  scoreFrequency,
  calculateDataQuality,
  generateFocusAreas,
  generateWarningFlags,
  createSmartWorkoutPlan,
  calculateEnhancedDataQuality,
  generatePersonalizedFocusAreas,
  calculatePersonalizedProgressionPace,
  generatePersonalizedMotivation,
  createPersonalizedWorkoutPlan,
  SmartWorkoutPlan,
} from "./userPreferencesHelpers";

// ממשק פשוט לתוצאות חכמות
export interface SmartUserPreferences extends QuestionnaireMetadata {
  personalityProfile:
    | "מתחיל זהיר"
    | "נחוש להצליח"
    | "ספורטאי מנוסה"
    | "מחפש איזון";
  motivationLevel: number; // 1-10
  consistencyScore: number; // 1-10
  equipmentReadiness: number; // 1-10
  algorithmConfidence: "high" | "medium" | "low";

  smartRecommendations: {
    idealWorkoutTime: "בוקר" | "צהריים" | "ערב";
    progressionPace: "איטי" | "בינוני" | "מהיר";
    focusAreas: string[];
    warningFlags: string[];
  };

  // מטא-דאטה בסיסי
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

  // נתונים ספציפיים
  userGoal: string;
  userExperience: string;
  availableEquipment: string[];
  preferredDuration: number;
  hasCompletedQuestionnaire: boolean;

  // נתונים חכמים
  systemType: "legacy" | "new" | "extended" | "mixed";
  completionQuality: number;
  personalizedInsights: string[];

  // נתונים אישיים
  personalData: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
    fitnessLevel?: string;
  } | null;

  // המלצות
  workoutRecommendations: WorkoutRecommendation[];
  quickWorkout: WorkoutRecommendation | null;
  smartWorkoutPlan: SmartWorkoutPlan | null;

  // פונקציות בסיסיות
  refreshPreferences: () => Promise<void>;
  clearPreferences: () => Promise<void>;
  getSmartInsights: () => string[];
  calculateUserScore: () => number;
  shouldRecommendUpgrade: () => boolean;
}

/**
 * Hook פשוט לניהול העדפות משתמש
 */
export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferences] = useState<SmartUserPreferences | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // נתונים ספציפיים
  const [userGoal, setUserGoal] = useState("בריאות כללית");
  const [userExperience, setUserExperience] = useState("מתחיל");
  const [availableEquipment, setAvailableEquipment] = useState<string[]>([]);
  const [preferredDuration, setPreferredDuration] = useState(45);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] =
    useState(false);

  // נתונים חכמים
  const [systemType, setSystemType] = useState<
    "legacy" | "new" | "extended" | "mixed"
  >("legacy");
  const [completionQuality, setCompletionQuality] = useState(0);
  const [personalizedInsights, setPersonalizedInsights] = useState<string[]>(
    []
  );

  // נתונים אישיים
  const [personalData, setPersonalData] = useState<{
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
    fitnessLevel?: string;
  } | null>(null);

  // המלצות
  const [workoutRecommendations, setWorkoutRecommendations] = useState<
    WorkoutRecommendation[]
  >([]);
  const [quickWorkout, setQuickWorkout] =
    useState<WorkoutRecommendation | null>(null);
  const [smartWorkoutPlan, setSmartWorkoutPlan] =
    useState<SmartWorkoutPlan | null>(null);

  // גישה ל-store
  const user = useUserStore((state) => state.user);

  // פונקציה לחישוב אלגוריתם חכם מנתוני שאלון
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
      // חישוב ציון מוטיבציה (1-10)
      let motivationLevel = 5;
      if (
        rawData.goal?.includes("שריפת שומן") ||
        rawData.goal?.includes("בניית שריר")
      ) {
        motivationLevel += 2;
      }
      if (rawData.experience === "מתקדם" || rawData.experience === "מקצועי") {
        motivationLevel += 1;
      }

      // התאמות מוטיבציה לפי נתונים אישיים
      if (personalData) {
        if (
          personalData.age &&
          (personalData.age.includes("18_") || personalData.age.includes("25_"))
        ) {
          motivationLevel += 1;
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

      // חישוב רמת ביטחון באלגוריתם
      let totalData =
        (rawData.age ? 1 : 0) +
        (rawData.gender ? 1 : 0) +
        (rawData.goal ? 1 : 0) +
        (rawData.experience ? 1 : 0) +
        (rawData.frequency ? 1 : 0) +
        equipmentCount;

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

      // המלצות חכמות
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

    // הוספת מסר מוטיבציוני מותאם אישית
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

      // שימוש בתוכנית מותאמת אישית
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
   * טעינת העדפות משתמש פשוטה ויעילה
   */
  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      logger.info("Loading user preferences", "Starting preference loading");

      // טען נתונים בסיסיים
      const preferencesData = await questionnaireService.getUserPreferences();
      let rawPreferences: QuestionnaireMetadata | null = preferencesData;
      const currentSystemType: typeof systemType = "legacy";

      // אם אין נתונים, נסה מהסטור הישן
      if (!rawPreferences && user?.questionnaire) {
        rawPreferences = convertOldStoreFormat(user.questionnaire as unknown[]);
        logger.warn("Data conversion", "Converted from legacy store format");
      }

      setSystemType(currentSystemType);

      if (rawPreferences) {
        // טען נתונים אישיים מהשאלון החדש
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

        // הפוך לנתונים חכמים
        const smartPreferences = calculateSmartAnalysis(
          rawPreferences,
          userPersonalData
        );
        setPreferences(smartPreferences);

        // חשב איכות השלמה
        const quality = userPersonalData
          ? calculateEnhancedDataQuality(rawPreferences, userPersonalData)
          : calculateDataQuality(rawPreferences);
        setCompletionQuality(quality);

        // צור תובנות מותאמות אישית
        const insights = generatePersonalizedInsights(
          smartPreferences,
          userPersonalData
        );
        setPersonalizedInsights(insights);

        logger.info(
          "Preferences loaded successfully",
          `Quality score: ${quality}`
        );
      } else {
        logger.warn(
          "No preferences data",
          "User has not completed questionnaire"
        );
      }

      // טען נתונים ספציפיים
      await loadSpecificData();
      setIsInitialized(true);

      logger.info("Loading completed", "All data loaded successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load preferences";
      logger.error("Loading failed", errorMessage);
      setError(errorMessage);

      // Fallback mechanism
      try {
        logger.info("Attempting fallback", "Loading basic preferences");
        const basicPreferences =
          await questionnaireService.getUserPreferences();
        if (basicPreferences) {
          const fallbackPreferences = calculateSmartAnalysis(
            basicPreferences,
            null
          );
          setPreferences(fallbackPreferences);
          setIsInitialized(true);
          logger.info("Fallback successful", "Basic preferences loaded");
        }
      } catch (fallbackError) {
        logger.error(
          "Fallback failed",
          fallbackError instanceof Error
            ? fallbackError.message
            : "Complete failure"
        );
      }
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

  /**
   * רענון העדפות משתמש
   */
  const refreshPreferences = useCallback(async () => {
    await loadPreferences();
  }, [loadPreferences]);

  /**
   * ניקוי העדפות משתמש
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
      logger.error(
        "Clear preferences failed",
        err instanceof Error ? err.message : "Failed to clear preferences"
      );
      setError(
        err instanceof Error ? err.message : "Failed to clear preferences"
      );
    }
  }, []);

  // פונקציות חכמות
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

  return {
    // נתונים בסיסיים
    preferences,
    isLoading,
    isInitialized,
    error,

    // נתונים ספציפיים
    userGoal,
    userExperience,
    availableEquipment,
    preferredDuration,
    hasCompletedQuestionnaire,

    // נתונים חכמים
    systemType,
    completionQuality,
    personalizedInsights,

    // נתונים אישיים
    personalData,

    // המלצות
    workoutRecommendations,
    quickWorkout,
    smartWorkoutPlan,

    // פונקציות בסיסיות
    refreshPreferences,
    clearPreferences,
    getSmartInsights,
    calculateUserScore,
    shouldRecommendUpgrade,
  };
}

/**
 * Hook לבדיקה מהירה האם המשתמש השלים שאלון
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
      logger.info("Loading quick workout", "Starting workout loading");

      const quickWorkout = await questionnaireService.getQuickWorkout();
      setWorkout(quickWorkout);

      // צור תובנות חכמות לאימון המהיר
      if (quickWorkout) {
        const insights = [
          "⚡ אימון מהיר מותאם לך",
          "🎯 נבנה על בסיס העדפותיך האישיות",
          "💪 מוכן להתחיל בכל רגע",
        ];
        setSmartInsights(insights);
        logger.info("Quick workout loaded", "Successfully loaded workout");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "שגיאה בטעינת אימון";
      logger.error("Quick workout loading failed", errorMessage);
      setError(errorMessage);
      setSmartInsights(["❌ שגיאה בטעינת האימון המהיר"]);
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
