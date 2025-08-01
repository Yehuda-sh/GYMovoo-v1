/**
 * @file src/stores/userStore.ts
 * @brief Store מרכזי לניהול מצב המשתמש עם תמיכה בשאלון חכם והתאמת מגדר
 * @brief Central store for managing user state with smart questionnaire and gender adaptation
 * @dependencies zustand, AsyncStorage
 * @notes כולל שמירה אוטומטית ב-AsyncStorage עם תמיכה מלאה בנתוני השאלון החכם
 * @notes Includes automatic saving to AsyncStorage with full smart questionnaire data support
 * @updated 2025-07-30 הוספת תמיכה מלאה במערכת השאלון החכם והתאמת מגדר
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// טיפוס נתוני השאלון החכם החדש
// New smart questionnaire data type
export interface SmartQuestionnaireData {
  // תשובות השאלון החכם
  // Smart questionnaire answers
  answers: {
    gender?: "male" | "female" | "other";
    fitnessLevel?: "beginner" | "intermediate" | "advanced";
    goals?: string[];
    availability?: string[];
    preferences?: string[];
    equipment?: string[];
    nutrition?: string[];
  };

  // מטאדאטה מורחבת
  // Extended metadata
  metadata: {
    completedAt: string;
    version: string;
    sessionId?: string;
    completionTime?: number; // זמן השלמה במילישניות
    questionsAnswered?: number;
    totalQuestions?: number;
    deviceInfo?: {
      platform?: string;
      screenWidth?: number;
      screenHeight?: number;
    };
  };

  // נתוני AI ותובנות
  // AI data and insights
  aiInsights?: {
    fitnessAssessment?: string;
    recommendedProgram?: string;
    equipmentSuggestions?: string[];
    nutritionTips?: string[];
    personalizedMessage?: string;
  };

  // נתוני התאמת מגדר
  // Gender adaptation data
  genderAdaptation?: {
    textVariations?: { [key: string]: string };
    workoutNameAdaptations?: { [key: string]: string };
    preferredLanguageStyle?: string;
  };
}

// טיפוס תשובות השאלון הישן (לתאימות לאחור)
// Old questionnaire answers type (for backward compatibility)
type QuestionnaireAnswers = {
  [key: number]: string | string[];
};

// טיפוס נתוני השאלון הישן (לתאימות לאחור)
// Old questionnaire data type (for backward compatibility)
export interface QuestionnaireData {
  // תשובות בפורמט הישן
  // Answers in old format
  answers?: QuestionnaireAnswers;

  // נתונים מורחבים
  // Extended data
  metadata?: {
    [key: string]: unknown;
  };

  // תאריך השלמה
  // Completion date
  completedAt?: string;

  // גרסת השאלון
  // Questionnaire version
  version?: string;
}

export interface User {
  // נתוני בסיס
  // Basic data
  id?: string;
  name?: string;
  email?: string;
  avatar?: string; // URL או נתיב מקומי / URL or local path
  provider?: string; // לדוגמה: "google", "facebook" וכו' / e.g., "google", "facebook" etc.

  // נתוני השאלון החכם החדש (עיקרי)
  // New smart questionnaire data (primary)
  smartQuestionnaireData?: SmartQuestionnaireData;

  // נתוני השאלון הישן (לתאימות לאחור)
  // Old questionnaire data (for backward compatibility)
  questionnaire?: QuestionnaireAnswers; // לתאימות לאחור / for backward compatibility
  questionnaireData?: QuestionnaireData; // נתונים מורחבים / extended data

  // נתונים מדעיים חדשים
  // New scientific data
  scientificProfile?: any; // יבוא מ-scientificUserGenerator
  aiRecommendations?: any;
  activityHistory?: any;
  currentStats?: any;

  // העדפות משתמש מורחבות
  // Extended user preferences
  preferences?: {
    theme?: "light" | "dark";
    notifications?: boolean;
    language?: "he" | "en";
    units?: "metric" | "imperial";
    // העדפות חדשות מהשאלון החכם
    gender?: "male" | "female" | "other";
    rtlPreference?: boolean;
    workoutNameStyle?: "adapted" | "neutral" | "original";
  };

  // נתוני אימון מורחבים
  // Extended training data
  trainingStats?: {
    totalWorkouts?: number;
    totalVolume?: number;
    favoriteExercises?: string[];
    lastWorkoutDate?: string;
    // נתונים חדשים מהשאלון החכם
    preferredWorkoutDays?: number;
    selectedEquipment?: string[];
    fitnessGoals?: string[];
    currentFitnessLevel?: "beginner" | "intermediate" | "advanced";
  };

  // נתוני פרופיל מותאמים למגדר
  // Gender-adapted profile data
  genderProfile?: {
    selectedGender: "male" | "female" | "other";
    adaptedWorkoutNames?: { [key: string]: string };
    personalizedMessages?: string[];
    completionMessages?: {
      male?: string;
      female?: string;
      neutral?: string;
    };
  };
}

interface UserStore {
  // מצב המשתמש
  // User state
  user: User | null;

  // פעולות בסיסיות
  // Basic actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;

  // בדיקות מצב התחברות
  // Authentication state checks
  isLoggedIn: () => boolean;
  clearAllUserData: () => Promise<void>;

  // פעולות שאלון חכם חדשות
  // New smart questionnaire actions
  setSmartQuestionnaireData: (data: SmartQuestionnaireData) => void;
  updateSmartQuestionnaireData: (
    updates: Partial<SmartQuestionnaireData>
  ) => void;
  getSmartQuestionnaireAnswers: () => SmartQuestionnaireData["answers"] | null;
  resetSmartQuestionnaire: () => void;

  // פעולות התאמת מגדר
  // Gender adaptation actions
  setUserGender: (gender: "male" | "female" | "other") => void;
  updateGenderProfile: (profile: Partial<User["genderProfile"]>) => void;
  getAdaptedWorkoutName: (originalName: string) => string;

  // פעולות שאלון ישן (לתאימות לאחור)
  // Old questionnaire actions (for backward compatibility)
  setQuestionnaire: (answers: QuestionnaireAnswers) => void;
  setQuestionnaireData: (data: QuestionnaireData) => void;
  resetQuestionnaire: () => void;

  // פעולות העדפות מורחבות
  // Extended preferences actions
  updatePreferences: (preferences: Partial<User["preferences"]>) => void;
  updateTrainingPreferences: (prefs: {
    workoutDays?: number;
    equipment?: string[];
    goals?: string[];
    fitnessLevel?: "beginner" | "intermediate" | "advanced";
  }) => void;

  // פעולות סטטיסטיקות מורחבות
  // Extended statistics actions
  updateTrainingStats: (stats: Partial<User["trainingStats"]>) => void;

  // פעולות שמירה ובדיקה
  // Save and validation actions
  saveToStorage: () => Promise<void>;
  validateUserData: () => boolean;
  getCompletionStatus: () => {
    hasBasicInfo: boolean;
    hasSmartQuestionnaire: boolean;
    hasOldQuestionnaire: boolean;
    isFullySetup: boolean;
  };
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,

      // הגדרת משתמש
      // Set user
      setUser: (user) => {
        set({ user });
      },

      // עדכון נתוני משתמש
      // Update user data
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      // התנתקות מורחבת עם ניקוי מלא
      // Extended logout with complete data clearing
      logout: async () => {
        try {
          console.log("🚪 userStore.logout - מתחיל התנתקות מלאה");

          // רשימה מקיפה של כל המפתחות שצריך למחוק
          const keysToRemove = [
            // נתוני משתמש בסיסיים
            "user-storage",
            "user_data",
            "user_preferences",

            // נתוני שאלון
            "questionnaire_metadata",
            "questionnaire_draft",
            "questionnaire_answers",
            "smart_questionnaire_results",
            "questionnaire_completion_data",

            // נתוני אימון
            "workout_preferences",
            "workout_history",
            "active_workout_data",
            "workout_plans",
            "workout_statistics",
            "workout_session_data",

            // העדפות אישיות
            "user_gender_preference",
            "selected_equipment",
            "gender_adaptation_data",
            "rtl_preferences",
            "theme_preferences",

            // נתוני AI
            "ai_workout_data",
            "ai_recommendations",
            "ai_insights",

            // נתוני סשן
            "session_data",
            "login_timestamp",
            "last_activity",

            // נתוני מטמון
            "cached_exercises",
            "cached_workout_data",
            "offline_data",

            // נתוני התקדמות
            "progress_photos",
            "body_measurements",
            "performance_records",

            // הגדרות מתקדמות
            "notification_settings",
            "privacy_settings",
            "app_settings",
          ];

          // מחיקה מרובה של כל המפתחות
          await AsyncStorage.multiRemove(keysToRemove);

          // איפוס מלא של ה-store
          set({ user: null });

          console.log("✅ userStore.logout - התנתקות הושלמה בהצלחה");
          console.log(`🗑️ נמחקו ${keysToRemove.length} מפתחות מ-AsyncStorage`);
        } catch (error) {
          console.error("❌ userStore.logout - שגיאה בהתנתקות:", error);

          // גם אם יש שגיאה, איפוס ה-store
          set({ user: null });

          throw error;
        }
      },

      // === פונקציות השאלון החכם החדש ===
      // === New Smart Questionnaire Functions ===

      // הגדרת נתוני השאלון החכם
      // Set smart questionnaire data
      setSmartQuestionnaireData: (data) => {
        console.log("💾 userStore.setSmartQuestionnaireData נקרא עם:", data);

        set((state) => ({
          user: {
            ...(state.user || {}),
            smartQuestionnaireData: data,
            // עדכון העדפות בהתאם לתשובות
            preferences: {
              ...state.user?.preferences,
              gender: data.answers.gender,
              rtlPreference: true, // תמיד נכון לעברית
            },
            // עדכון נתוני אימון
            trainingStats: {
              ...state.user?.trainingStats,
              preferredWorkoutDays: data.answers.availability?.length || 3,
              selectedEquipment: data.answers.equipment || [],
              fitnessGoals: data.answers.goals || [],
              currentFitnessLevel: data.answers.fitnessLevel,
            },
          },
        }));

        // שמירה ב-AsyncStorage
        AsyncStorage.setItem(
          "smart_questionnaire_results",
          JSON.stringify(data)
        )
          .then(() => console.log("✅ smart_questionnaire_results נשמר"))
          .catch((err) => console.error("❌ שגיאה בשמירת השאלון החכם:", err));

        // שמירת העדפת מגדר בנפרד
        if (data.answers.gender) {
          AsyncStorage.setItem("user_gender_preference", data.answers.gender);
        }

        // שמירת ציוד נבחר
        if (data.answers.equipment) {
          AsyncStorage.setItem(
            "selected_equipment",
            JSON.stringify(data.answers.equipment)
          );
        }
      },

      // עדכון חלקי של נתוני השאלון החכם
      // Partial update of smart questionnaire data
      updateSmartQuestionnaireData: (updates) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                smartQuestionnaireData: state.user.smartQuestionnaireData
                  ? {
                      ...state.user.smartQuestionnaireData,
                      ...updates,
                      answers: {
                        ...state.user.smartQuestionnaireData.answers,
                        ...updates.answers,
                      },
                      metadata: {
                        ...state.user.smartQuestionnaireData.metadata,
                        ...updates.metadata,
                      },
                    }
                  : undefined,
              }
            : null,
        }));
      },

      // קבלת תשובות השאלון החכם
      // Get smart questionnaire answers
      getSmartQuestionnaireAnswers: () => {
        const state = get();
        return state.user?.smartQuestionnaireData?.answers || null;
      },

      // איפוס השאלון החכם
      // Reset smart questionnaire
      resetSmartQuestionnaire: () => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                smartQuestionnaireData: undefined,
                genderProfile: undefined,
              }
            : null,
        }));

        // ניקוי מ-AsyncStorage
        AsyncStorage.multiRemove([
          "smart_questionnaire_results",
          "user_gender_preference",
          "selected_equipment",
          "gender_adaptation_data",
        ]);
      },

      // === פונקציות התאמת מגדר ===
      // === Gender Adaptation Functions ===

      // הגדרת מגדר משתמש
      // Set user gender
      setUserGender: (gender) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: {
                  ...state.user.preferences,
                  gender,
                },
                genderProfile: {
                  ...state.user.genderProfile,
                  selectedGender: gender,
                },
              }
            : null,
        }));

        // שמירה ב-AsyncStorage
        AsyncStorage.setItem("user_gender_preference", gender);
      },

      // עדכון פרופיל מגדר
      // Update gender profile
      updateGenderProfile: (profile) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                genderProfile: {
                  selectedGender:
                    state.user.genderProfile?.selectedGender || "other",
                  ...state.user.genderProfile,
                  ...profile,
                },
              }
            : null,
        }));
      },

      // קבלת שם אימון מותאם
      // Get adapted workout name
      getAdaptedWorkoutName: (originalName) => {
        const state = get();
        const genderProfile = state.user?.genderProfile;

        if (genderProfile?.adaptedWorkoutNames?.[originalName]) {
          return genderProfile.adaptedWorkoutNames[originalName];
        }

        return originalName;
      },

      // === פונקציות שאלון ישן (לתאימות לאחור) ===
      // === Old Questionnaire Functions (Backward Compatibility) ===

      // הגדרת תשובות שאלון (פורמט ישן)
      // Set questionnaire answers (old format)
      setQuestionnaire: (answers) => {
        console.log("💾 userStore.setQuestionnaire נקרא עם:", answers);

        // יצירת נתוני שאלון מורחבים
        const questionnaireData = {
          answers: answers,
          metadata: {
            completedAt: new Date().toISOString(),
            version: "smart-questionnaire-v1",
          },
          completedAt: new Date().toISOString(),
          version: "smart-questionnaire-v1",
        };

        console.log("💾 Creating questionnaireData:", questionnaireData);

        set((state) => ({
          user: {
            ...(state.user || {}),
            questionnaire: answers,
            questionnaireData: questionnaireData, // 🔧 הוספת נתונים מורחבים
          },
        }));

        // שמירה גם ב-AsyncStorage הנפרד לתאימות
        AsyncStorage.setItem("questionnaire_answers", JSON.stringify(answers))
          .then(() =>
            console.log("✅ questionnaire_answers נשמר ב-AsyncStorage")
          )
          .catch((err) =>
            console.error("❌ שגיאה בשמירת questionnaire_answers:", err)
          );

        // שמירת המטאדאטה המורחבת
        AsyncStorage.setItem("questionnaire_metadata", JSON.stringify(answers))
          .then(() =>
            console.log("✅ questionnaire_metadata נשמר ב-AsyncStorage")
          )
          .catch((err) =>
            console.error("❌ שגיאה בשמירת questionnaire_metadata:", err)
          );
      },

      // הגדרת נתוני שאלון מורחבים (ישן)
      // Set extended questionnaire data (old)
      setQuestionnaireData: (data) => {
        set((state) => ({
          user: {
            ...(state.user || {}),
            questionnaireData: data,
            // שמירת תאימות לאחור
            questionnaire: data.answers,
          },
        }));
      },

      // איפוס שאלון ישן
      // Reset old questionnaire
      resetQuestionnaire: () => {
        set((state) => ({
          user: {
            ...(state.user || {}),
            questionnaire: undefined,
            questionnaireData: undefined,
          },
        }));

        // ניקוי מ-AsyncStorage
        AsyncStorage.multiRemove([
          "questionnaire_metadata",
          "questionnaire_draft",
          "questionnaire_answers",
        ]);
      },

      // === פונקציות העדפות מורחבות ===
      // === Extended Preferences Functions ===

      // עדכון העדפות כללי
      // Update general preferences
      updatePreferences: (preferences) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: {
                  ...state.user.preferences,
                  ...preferences,
                },
              }
            : null,
        }));
      },

      // עדכון העדפות אימון
      // Update training preferences
      updateTrainingPreferences: (prefs) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                trainingStats: {
                  ...state.user.trainingStats,
                  preferredWorkoutDays: prefs.workoutDays,
                  selectedEquipment: prefs.equipment,
                  fitnessGoals: prefs.goals,
                  currentFitnessLevel: prefs.fitnessLevel,
                },
              }
            : null,
        }));
      },

      // עדכון סטטיסטיקות אימון
      // Update training statistics
      updateTrainingStats: (stats) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                trainingStats: {
                  ...state.user.trainingStats,
                  ...stats,
                },
              }
            : null,
        }));
      },

      // === פונקציות בדיקה ושמירה ===
      // === Validation and Save Functions ===

      // שמירה ידנית ל-AsyncStorage
      // Manual save to AsyncStorage
      saveToStorage: async () => {
        const state = get();
        if (state.user) {
          await AsyncStorage.setItem("user-storage", JSON.stringify(state));
        }
      },

      // בדיקת תקינות נתוני משתמש
      // Validate user data
      validateUserData: () => {
        const state = get();
        const user = state.user;

        if (!user) return false;

        // בדיקות בסיסיות
        const hasBasicInfo = !!(user.id || user.email || user.name);
        const hasSmartQuestionnaire = !!user.smartQuestionnaireData?.answers;
        const hasOldQuestionnaire = !!(
          user.questionnaire || user.questionnaireData
        );

        return hasBasicInfo && (hasSmartQuestionnaire || hasOldQuestionnaire);
      },

      // קבלת סטטוס השלמה
      // Get completion status
      getCompletionStatus: () => {
        const state = get();
        const user = state.user;

        const hasBasicInfo = !!(user?.id || user?.email || user?.name);
        const hasSmartQuestionnaire = !!user?.smartQuestionnaireData?.answers;
        const hasOldQuestionnaire = !!(
          user?.questionnaire || user?.questionnaireData
        );
        const isFullySetup =
          hasBasicInfo && (hasSmartQuestionnaire || hasOldQuestionnaire);

        return {
          hasBasicInfo,
          hasSmartQuestionnaire,
          hasOldQuestionnaire,
          isFullySetup,
        };
      },

      // בדיקת מצב התחברות
      // Check login status
      isLoggedIn: () => {
        const state = get();
        return state.user !== null;
      },

      // ניקוי מלא של כל נתוני המשתמש (כולל AsyncStorage)
      // Complete clearing of all user data (including AsyncStorage)
      clearAllUserData: async () => {
        try {
          console.log("🧹 userStore.clearAllUserData - מתחיל ניקוי מלא");

          // קבלת כל המפתחות מ-AsyncStorage
          const allKeys = await AsyncStorage.getAllKeys();
          console.log(`📋 נמצאו ${allKeys.length} מפתחות ב-AsyncStorage`);

          // מחיקת כל המפתחות
          await AsyncStorage.multiRemove(allKeys);

          // איפוס ה-store
          set({ user: null });

          console.log("✅ userStore.clearAllUserData - ניקוי הושלם בהצלחה");
        } catch (error) {
          console.error("❌ userStore.clearAllUserData - שגיאה בניקוי:", error);
          throw error;
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // אל תשמור פונקציות
      // Don't save functions
      partialize: (state) => ({ user: state.user }),
      // טעינה אוטומטית בהפעלה
      // Auto-load on startup
      onRehydrateStorage: () => (state) => {
        console.log("User store rehydrated:", state?.user?.email);
      },
    }
  )
);

// Hooks נוספים לנוחות
// Additional convenience hooks

export const useUser = () => useUserStore((state) => state.user);
export const useIsLoggedIn = () => useUserStore((state) => state.user !== null);
export const useUserPreferences = () =>
  useUserStore((state) => state.user?.preferences);
export const useQuestionnaireCompleted = () =>
  useUserStore(
    (state) =>
      state.user?.questionnaire !== undefined ||
      state.user?.questionnaireData?.completedAt !== undefined
  );

// Hook מתקדם לבדיקת מצב התחברות
// Advanced hook for checking login status
export const useAuthState = () => {
  const user = useUserStore((state) => state.user);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn());
  const logout = useUserStore((state) => state.logout);
  const clearAllData = useUserStore((state) => state.clearAllUserData);

  return {
    user,
    isLoggedIn,
    logout,
    clearAllData,
    hasBasicInfo: !!(user?.id || user?.email || user?.name),
    hasQuestionnaire: !!(
      user?.questionnaire ||
      user?.questionnaireData ||
      user?.smartQuestionnaireData
    ),
  };
};
