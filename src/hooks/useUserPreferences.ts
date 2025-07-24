/**
 * @file src/hooks/useUserPreferences.ts
 * @brief Hook לגישה נוחה לנתוני העדפות המשתמש מהשאלון
 * @brief Hook for convenient access to user preferences from questionnaire
 * @dependencies questionnaireService, userStore
 * @notes Hook מרכזי לכל הפעולות הקשורות להעדפות משתמש
 * @notes Central hook for all user preferences operations
 */

import { useState, useEffect, useCallback } from "react";
import {
  questionnaireService,
  QuestionnaireMetadata,
  WorkoutRecommendation,
} from "../services/questionnaireService";
import { useUserStore } from "../stores/userStore";

interface UseUserPreferencesReturn {
  // נתונים
  // Data
  preferences: QuestionnaireMetadata | null;
  isLoading: boolean;
  error: string | null;

  // נתונים ספציפיים
  // Specific data
  userGoal: string;
  userExperience: string;
  availableEquipment: string[];
  preferredDuration: number;
  hasCompletedQuestionnaire: boolean;

  // המלצות
  // Recommendations
  workoutRecommendations: WorkoutRecommendation[];
  quickWorkout: WorkoutRecommendation | null;

  // פעולות
  // Actions
  refreshPreferences: () => Promise<void>;
  clearPreferences: () => Promise<void>;
}

/**
 * Hook לניהול העדפות משתמש
 * User preferences management hook
 */
export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferences] = useState<QuestionnaireMetadata | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // נתונים ספציפיים
  // Specific data
  const [userGoal, setUserGoal] = useState("בריאות כללית");
  const [userExperience, setUserExperience] = useState("מתחיל");
  const [availableEquipment, setAvailableEquipment] = useState<string[]>([]);
  const [preferredDuration, setPreferredDuration] = useState(45);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] =
    useState(false);

  // המלצות
  // Recommendations
  const [workoutRecommendations, setWorkoutRecommendations] = useState<
    WorkoutRecommendation[]
  >([]);
  const [quickWorkout, setQuickWorkout] =
    useState<WorkoutRecommendation | null>(null);

  // גישה ל-store
  // Access to store
  const user = useUserStore((state) => state.user);

  /**
   * טעינת העדפות משתמש
   * Load user preferences
   */
  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // טען נתונים מ-AsyncStorage
      // Load data from AsyncStorage
      const preferencesData = await questionnaireService.getUserPreferences();
      setPreferences(preferencesData);

      // אם אין נתונים ב-AsyncStorage, נסה מה-store
      // If no data in AsyncStorage, try from store
      if (!preferencesData && user?.questionnaire) {
        // המר מפורמט ישן לחדש
        // Convert from old to new format
        const convertedPreferences: QuestionnaireMetadata = {
          age:
            typeof user.questionnaire[0] === "string"
              ? user.questionnaire[0]
              : undefined,
          gender:
            typeof user.questionnaire[1] === "string"
              ? user.questionnaire[1]
              : undefined,
          goal:
            typeof user.questionnaire[2] === "string"
              ? user.questionnaire[2]
              : undefined,
          experience:
            typeof user.questionnaire[3] === "string"
              ? user.questionnaire[3]
              : undefined,
          frequency:
            typeof user.questionnaire[4] === "string"
              ? user.questionnaire[4]
              : undefined,
          duration:
            typeof user.questionnaire[5] === "string"
              ? user.questionnaire[5]
              : undefined,
          location:
            typeof user.questionnaire[6] === "string"
              ? user.questionnaire[6]
              : undefined,
          health_conditions: Array.isArray(user.questionnaire[7])
            ? user.questionnaire[7]
            : typeof user.questionnaire[7] === "string"
            ? [user.questionnaire[7]]
            : [],
          // תיקון: שימוש בשם המאפיין הנכון לפי המיקום של הנתונים
          // Fix: Use correct property name based on location data
          home_equipment: Array.isArray(user.questionnaire[8])
            ? user.questionnaire[8]
            : [],
          gym_equipment: [], // לא זמין בפורמט הישן / Not available in old format
        };
        setPreferences(convertedPreferences);
      }

      // טען נתונים ספציפיים
      // Load specific data
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
      // Load recommendations if questionnaire completed
      if (completed) {
        const [recommendations, quick] = await Promise.all([
          questionnaireService.getWorkoutRecommendations(),
          questionnaireService.getQuickWorkout(),
        ]);

        setWorkoutRecommendations(recommendations);
        setQuickWorkout(quick);
      }
    } catch (err) {
      console.error("Error loading user preferences:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load preferences"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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
    } catch (err) {
      console.error("Error clearing preferences:", err);
      setError(
        err instanceof Error ? err.message : "Failed to clear preferences"
      );
    }
  }, []);

  // טען העדפות בטעינה ראשונית
  // Load preferences on initial mount
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // עדכן העדפות כשהמשתמש משתנה
  // Update preferences when user changes
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user, loadPreferences]);

  return {
    // נתונים
    // Data
    preferences,
    isLoading,
    error,

    // נתונים ספציפיים
    // Specific data
    userGoal,
    userExperience,
    availableEquipment,
    preferredDuration,
    hasCompletedQuestionnaire,

    // המלצות
    // Recommendations
    workoutRecommendations,
    quickWorkout,

    // פעולות
    // Actions
    refreshPreferences,
    clearPreferences,
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
 * Hook לקבלת אימון מהיר מומלץ
 * Hook to get recommended quick workout
 */
export function useQuickWorkout(): {
  workout: WorkoutRecommendation | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [workout, setWorkout] = useState<WorkoutRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const quickWorkout = await questionnaireService.getQuickWorkout();
      setWorkout(quickWorkout);
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
  };
}
