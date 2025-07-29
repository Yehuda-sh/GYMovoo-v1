/**
 * @file src/stores/userStore.ts
 * @brief Store מרכזי לניהול מצב המשתמש באפליקציה
 * @brief Central store for managing user state in the app
 * @dependencies zustand, AsyncStorage
 * @notes כולל שמירה אוטומטית ב-AsyncStorage
 * @notes Includes automatic saving to AsyncStorage
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// טיפוס תשובות השאלון הישן (לתאימות לאחור)
// Old questionnaire answers type (for backward compatibility)
type QuestionnaireAnswers = {
  [key: number]: string | string[];
};

// טיפוס נתוני השאלון החדש
// New questionnaire data type
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

  // העדפות משתמש
  // User preferences
  preferences?: {
    theme?: "light" | "dark";
    notifications?: boolean;
    language?: "he" | "en";
    units?: "metric" | "imperial";
  };

  // נתוני אימון
  // Training data
  trainingStats?: {
    totalWorkouts?: number;
    totalVolume?: number;
    favoriteExercises?: string[];
    lastWorkoutDate?: string;
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

  // פעולות שאלון
  // Questionnaire actions
  setQuestionnaire: (answers: QuestionnaireAnswers) => void;
  setQuestionnaireData: (data: QuestionnaireData) => void;
  resetQuestionnaire: () => void;

  // פעולות העדפות
  // Preferences actions
  updatePreferences: (preferences: Partial<User["preferences"]>) => void;

  // פעולות סטטיסטיקות
  // Statistics actions
  updateTrainingStats: (stats: Partial<User["trainingStats"]>) => void;

  // שמירה ידנית
  // Manual save
  saveToStorage: () => Promise<void>;
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

      // התנתקות
      // Logout
      logout: async () => {
        // ניקוי כל הנתונים
        // Clear all data
        await AsyncStorage.multiRemove([
          "user-storage",
          "questionnaire_metadata",
          "questionnaire_draft",
          "workout_preferences",
        ]);
        set({ user: null });
      },

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
        // Also save in separate AsyncStorage for compatibility
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

      // הגדרת נתוני שאלון מורחבים
      // Set extended questionnaire data
      setQuestionnaireData: (data) => {
        set((state) => ({
          user: {
            ...(state.user || {}),
            questionnaireData: data,
            // שמירת תאימות לאחור
            // Maintain backward compatibility
            questionnaire: data.answers,
          },
        }));
      },

      // איפוס שאלון
      // Reset questionnaire
      resetQuestionnaire: () => {
        set((state) => ({
          user: {
            ...(state.user || {}),
            questionnaire: undefined,
            questionnaireData: undefined,
          },
        }));

        // ניקוי מ-AsyncStorage
        // Clear from AsyncStorage
        AsyncStorage.multiRemove([
          "questionnaire_metadata",
          "questionnaire_draft",
          "questionnaire_answers",
        ]);
      },

      // עדכון העדפות
      // Update preferences
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

      // שמירה ידנית ל-AsyncStorage
      // Manual save to AsyncStorage
      saveToStorage: async () => {
        const state = get();
        if (state.user) {
          await AsyncStorage.setItem("user-storage", JSON.stringify(state));
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
