/**
 * @file src/stores/userStore.ts
 * @brief Store מרכזי לניהול מצב המשתמש עם תמיכה בשאלון חכם
 * @brief Central store for managing user state with smart questionnaire support
 * @dependencies zustand, AsyncStorage, types/index
 * @notes מבנה מפושט ומאוחד עם הסרת כפילויות וטיפוסים מרכזיים
 * @notes Simplified and unified structure with removed duplications and centralized types
 * @updated 2025-01-08 איחוד טיפוסים, פישוט מבנה, הסרת קוד מיותר
 * @optimization הוסרו כפילויות, טיפוסים הועברו ל-types/index.ts, פונקציות פושטו
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  SmartQuestionnaireData,
  LegacyQuestionnaireData,
} from "../types";

// טיפוס תשובות השאלון הישן (לתאימות לאחור)
// Old questionnaire answers type (for backward compatibility)
type LegacyQuestionnaireAnswers = {
  [key: number]: string | string[];
};

// =======================================
// 🏪 Store Interface Definition
// הגדרת ממשק ה-Store
// =======================================

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
  clearDataForFreshStart: () => Promise<void>; // חדש: לניקוי במצב פיתוח

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
  setQuestionnaire: (answers: LegacyQuestionnaireAnswers) => void;
  setQuestionnaireData: (data: LegacyQuestionnaireData) => void;
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

  // פעולות משתמש דמו מותאם
  // Custom demo user actions
  setCustomDemoUser: (demoUser: User["customDemoUser"]) => void;
  getCustomDemoUser: () => User["customDemoUser"] | null;
  clearCustomDemoUser: () => void;
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

      // התנתקות מפושטת עם ניקוי יעיל
      // Simplified logout with efficient cleanup
      logout: async () => {
        try {
          console.log("🚪 userStore.logout - מתחיל התנתקות");

          // רשימת מפתחות עיקריים לניקוי
          const keysToRemove = [
            "user-storage",
            "questionnaire_metadata",
            "questionnaire_answers",
            "smart_questionnaire_results",
            "user_gender_preference",
            "selected_equipment",
          ];

          // מחיקה יעילה של המפתחות העיקריים
          await AsyncStorage.multiRemove(keysToRemove);

          // איפוס ה-store
          set({ user: null });

          console.log("✅ userStore.logout - התנתקות הושלמה בהצלחה");
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

      // === פונקציות התאמת מגדר (פשוטות) ===
      // === Gender Adaptation Functions (Simplified) ===

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
        const questionnaireData: LegacyQuestionnaireData = {
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
          user: state.user
            ? {
                ...state.user,
                questionnaire: answers,
                questionnaireData: questionnaireData,
              }
            : {
                questionnaire: answers,
                questionnaireData: questionnaireData,
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
          user: state.user
            ? {
                ...state.user,
                questionnaireData: data,
                // שמירת תאימות לאחור
                questionnaire: data.answers,
              }
            : {
                questionnaireData: data,
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

      // 🎯 פעולות משתמש דמו מותאם
      // Custom demo user actions
      setCustomDemoUser: (demoUser) => {
        if (!demoUser) return;

        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                customDemoUser: {
                  id: demoUser.id || `demo_${Date.now()}`,
                  name: demoUser.name || "משתמש דמו",
                  gender: demoUser.gender || "other",
                  age: demoUser.age || 30,
                  experience: demoUser.experience || "intermediate",
                  height: demoUser.height || 170,
                  weight: demoUser.weight || 70,
                  fitnessGoals: demoUser.fitnessGoals || [],
                  availableDays: demoUser.availableDays || 3,
                  sessionDuration:
                    typeof demoUser.sessionDuration === "string"
                      ? demoUser.sessionDuration
                      : String(demoUser.sessionDuration),
                  equipment: demoUser.equipment || [],
                  preferredTime: demoUser.preferredTime || "evening",
                  createdFromQuestionnaire: true,
                  questionnaireTimestamp: new Date().toISOString(),
                },
              }
            : null,
        }));
        console.log("✅ Custom demo user saved:", demoUser?.name);
      },

      getCustomDemoUser: () => {
        const user = get().user;
        return user?.customDemoUser || null;
      },

      clearCustomDemoUser: () => {
        set((state) => ({
          user: state.user
            ? { ...state.user, customDemoUser: undefined }
            : null,
        }));
        console.log("✅ Custom demo user cleared");
      },

      // פונקציה לניקוי מלא לפיתוח (ללא התנתקות)
      // Complete data clearing for development (without logout)
      clearDataForFreshStart: async () => {
        try {
          console.log("🧹 clearDataForFreshStart - מתחיל ניקוי לכניסה חדשה");

          // קבלת כל המפתחות מ-AsyncStorage
          const allKeys = await AsyncStorage.getAllKeys();
          console.log(`📋 נמצאו ${allKeys.length} מפתחות ב-AsyncStorage`);

          // מחיקת כל המפתחות
          await AsyncStorage.multiRemove(allKeys);

          // איפוס ה-store
          set({ user: null });

          console.log(
            "✅ clearDataForFreshStart - ניקוי הושלם, הסשן החדש התחיל"
          );
        } catch (error) {
          console.error("❌ clearDataForFreshStart - שגיאה בניקוי:", error);
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

        // מצב פיתוח: ניקוי אוטומטי בכל כניסה חדשה (מושבת זמנית)
        // Development mode: Auto-clear on every fresh start (temporarily disabled)
        if (false && __DEV__) {
          console.log("🧹 DEV MODE: Auto-clearing user data for fresh start");
          // ניקוי אסינכרוני כדי לא לחסום את הטעינה
          setTimeout(async () => {
            try {
              const allKeys = await AsyncStorage.getAllKeys();
              await AsyncStorage.multiRemove(allKeys);
              console.log("✅ DEV MODE: All data cleared");
            } catch (error) {
              console.error("❌ DEV MODE: Error clearing data:", error);
            }
          }, 100);
        }
      },
    }
  )
);

// =======================================
// 📤 Re-exports for Backward Compatibility
// יצוא מחדש לתאימות לאחור
// =======================================

// Re-export types from central location
export type {
  User,
  SmartQuestionnaireData,
  LegacyQuestionnaireData,
} from "../types";

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

// Hook לגישה למשתמש דמו מותאם
export const useCustomDemoUser = () =>
  useUserStore((state) => state.user?.customDemoUser);

// Hook לניקוי מהיר במצב פיתוח
// Quick clear hook for development mode
export const useFreshStart = () => {
  const clearDataForFreshStart = useUserStore(
    (state) => state.clearDataForFreshStart
  );

  const performFreshStart = async () => {
    console.log("🔄 Performing fresh start...");
    await clearDataForFreshStart();
    // אחרי הניקוי, האפליקציה תחזור למסך הפתיחה
    console.log("✨ Fresh start completed! App will reset to welcome screen.");
  };

  return { performFreshStart };
};

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
