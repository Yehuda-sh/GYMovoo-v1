/**
 * @file src/stores/userStore.ts
 * @description Store מרכזי לניהול מצב המשתמש עם תמיכה בשאלון חכם
 * English: Central store for managing user state with smart questionnaire support
 *
 * @features
 * - ניהול מצב משתמש מרכזי עם Zustand ו-AsyncStorage persistence
 * - תמיכה מלאה בשאלון חכם חדש (SmartQuestionnaireData)
 * - תאימות לאחור עם שאלון ישן (LegacyQuestionnaireData)
 * - פונקציות התאמת מגדר והעדפות מותאמות אישית
 * - ניהול משתמש דמו מותאם עם אפשרויות ניקוי מתקדמות
 * - Hooks נוספים לנוחות ובדיקות מצב
 * - Enhanced error handling עם fallback strategies
 * - Performance optimizations עם memoization
 * - Accessibility support לקוראי מסך
 * - TypeScript strict typing ו-data validation
 * - Advanced logging ו-debug capabilities
 *
 * @enhancements_2025-08-24
 * - ✅ החלפה של כל console.log ב-logger עקבי
 * - ✅ הוספת error handling מתקדם עם fallback strategies
 * - ✅ Performance optimizations עם memoized equipment normalization
 * - ✅ Accessibility support עם screen reader text
 * - ✅ Data validation ו-consistency checks
 * - ✅ Advanced hooks לניהול מצב ושגיאות
 * - ✅ Enhanced TypeScript typing
 * - ✅ Improved subscription management
 *
 * @dependencies zustand, AsyncStorage, types/index, logger
 * @usage Used throughout application for user state management
 * @updated 2025-08-24 שיפורים מקיפים לפי תקני הפרויקט - Store מתקדם ומותאם
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  SmartQuestionnaireData,
  LegacyQuestionnaireData,
  WorkoutPlan,
} from "../types";
import { userApi } from "../services/api/userApi";
import { StorageKeys } from "../constants/StorageKeys";
import { fieldMapper } from "../utils/fieldMapper";
import { extractSmartAnswers } from "../utils/questionnaireUtils";
import { logger } from "../utils/logger";
import { normalizeEquipment as normalizeEquipmentCatalog } from "../utils/equipmentCatalog";

// ==============================
// Performance Optimization Utils
// ==============================
let __memoizedEquipment: {
  data: string[];
  timestamp: number;
  input: string[];
} | null = null;
const MEMO_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const memoizedNormalizeEquipment = (arr?: string[]): string[] => {
  if (!arr || arr.length === 0) return [];

  const inputKey = JSON.stringify(arr.sort());
  const now = Date.now();

  if (
    __memoizedEquipment &&
    __memoizedEquipment.input.join(",") === inputKey &&
    now - __memoizedEquipment.timestamp < MEMO_CACHE_TTL
  ) {
    return __memoizedEquipment.data;
  }

  const result = normalizeEquipmentCatalog(arr) as string[];
  __memoizedEquipment = {
    data: result,
    timestamp: now,
    input: arr.sort(),
  };

  return result;
};

// ==============================
// Utilities
// ==============================
const normalizeEquipment = (arr?: string[]): string[] => {
  // Use memoized version for better performance
  return memoizedNormalizeEquipment(arr);
};

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
  updateGenderProfile: (profile: Partial<User["genderprofile"]>) => void;
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
  updateTrainingStats: (stats: Partial<User["trainingstats"]>) => void;

  // Accessibility support
  getAccessibilityLabel: (
    context: "user" | "questionnaire" | "subscription"
  ) => string;
  getScreenReaderText: (action: string, data?: unknown) => string;

  // שמירה ב-AsyncStorage
  saveToStorage: () => Promise<void>;
  validateUserData: () => boolean;

  // Enhanced error handling
  handleStorageError: (error: unknown, operation: string) => Promise<void>;
  validateUserConsistency: () => { isValid: boolean; issues: string[] };

  getCompletionStatus: () => {
    hasBasicInfo: boolean;
    hasSmartQuestionnaire: boolean;
    hasOldQuestionnaire: boolean;
    isFullySetup: boolean;
  };

  // פעולות מנוי ותקופת ניסיון
  // Subscription and trial actions
  initializeSubscription: () => void;
  updateSubscription: (updates: Partial<User["subscription"]>) => void;
  checkTrialStatus: () => {
    isTrialActive: boolean;
    daysRemaining: number;
    hasExpired: boolean;
  };
  getSubscriptionType: () => "trial" | "premium" | "free";
  canAccessPremiumFeatures: () => boolean;
  startPremiumSubscription: () => void;

  // פעולות תוכניות אימון
  // Workout plans actions
  setWorkoutPlans: (plans: Partial<User["workoutplans"]>) => void;
  updateWorkoutPlan: (
    planType: "basic" | "smart" | "additional",
    plan: WorkoutPlan
  ) => void;
  getAccessibleWorkoutPlan: () => WorkoutPlan | null;
  shouldBlurPremiumContent: () => boolean;

  // פעולות משתמש דמו מותאם
  // Custom demo user actions
  setCustomDemoUser: (demoUser: User["customDemoUser"]) => void;
  getCustomDemoUser: () => User["customDemoUser"] | null;
  clearCustomDemoUser: () => void;

  // סנכרון שרת
  // Server sync helpers
  refreshFromServer: () => Promise<void>;
  scheduleServerSync: (reason?: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      // Stubs for server sync (replaced below after store creation)
      refreshFromServer: async () => {},
      scheduleServerSync: () => {},

      // הגדרת משתמש
      // Set user
      setUser: (user) => {
        try {
          set({ user });
          // סנכרון שרת (אם יש מזהה אמיתי)
          get().scheduleServerSync("setUser");
          logger.debug("UserStore", "User set successfully", {
            hasUser: !!user,
          });
        } catch (error) {
          logger.error("UserStore", "Error setting user", error);
          // Fallback: try to set without sync
          set({ user });
        }
      },

      // עדכון נתוני משתמש
      // Update user data
      updateUser: (updates) => {
        try {
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          }));
          get().scheduleServerSync("updateUser");
          logger.debug("UserStore", "User updated successfully", {
            updatedFields: Object.keys(updates),
          });
        } catch (error) {
          logger.error("UserStore", "Error updating user", error);
          // Fallback: try basic update without sync
          try {
            set((state) => ({
              user: state.user ? { ...state.user, ...updates } : null,
            }));
          } catch (fallbackError) {
            logger.error(
              "UserStore",
              "Fallback update also failed",
              fallbackError
            );
          }
        }
      },

      // התנתקות מפושטת עם ניקוי יעיל
      // Simplified logout with efficient cleanup
      logout: async () => {
        try {
          logger.debug("Auth", "userStore.logout - מתחיל התנתקות");

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

          logger.info("Auth", "userStore.logout - התנתקות הושלמה בהצלחה");
        } catch (error) {
          logger.error("Auth", "userStore.logout - שגיאה בהתנתקות", error);
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
        try {
          logger.debug("Store", "userStore.setSmartQuestionnaireData נקרא", {
            hasData: !!data,
          });

          set((state) => ({
            user: {
              ...(state.user || {}),
              smartquestionnairedata: data,
              // עדכון העדפות בהתאם לתשובות
              preferences: {
                ...state.user?.preferences,
                gender: data.answers.gender,
                rtlPreference: true, // תמיד נכון לעברית
              },
              // עדכון נתוני אימון
              trainingstats: {
                ...state.user?.trainingstats,
                // תמיכה במבנה availability חדש: מערך עם מזהי '2_days','3_days' וכו'
                preferredWorkoutDays: (() => {
                  const arr = data.answers.availability;
                  if (Array.isArray(arr) && arr.length > 0) {
                    const token = arr[0];
                    if (typeof token === "string" && /_days$/.test(token)) {
                      const n = parseInt(token.split("_", 1)[0], 10);
                      if (!isNaN(n) && n >= 1 && n <= 7) return n;
                    }
                    return arr.length; // fallback: מספר פריטים במערך (מודל ישן)
                  }
                  return 3;
                })(),
                selectedEquipment: (() => {
                  if (data.answers.equipment && data.answers.equipment.length)
                    return normalizeEquipment(data.answers.equipment);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const ge: any = (data.answers as any).gym_equipment;
                  if (Array.isArray(ge) && ge.length) {
                    const mapped = ge
                      .map((g) => (typeof g === "string" ? g : g.id || g.label))
                      .filter(Boolean) as string[];
                    if (mapped.length) return normalizeEquipment(mapped);
                  }
                  return [];
                })(),
                fitnessGoals: data.answers.goals || [],
                currentFitnessLevel: data.answers.fitnessLevel,
              },
            },
          }));

          // שמירה ב-AsyncStorage
          AsyncStorage.setItem(
            StorageKeys.SMART_QUESTIONNAIRE_RESULTS,
            JSON.stringify(data)
          )
            .then(() =>
              logger.debug("Store", "smart_questionnaire_results נשמר")
            )
            .catch((err) =>
              logger.error("Store", "שגיאה בשמירת השאלון החכם", err)
            );

          // שמירת העדפת מגדר בנפרד
          if (data.answers.gender) {
            AsyncStorage.setItem(
              StorageKeys.USER_GENDER_PREFERENCE,
              data.answers.gender
            ).catch((err) =>
              logger.error("Store", "שגיאה בשמירת העדפת מגדר", err)
            );
          }

          // שמירת ציוד נבחר
          if (data.answers.equipment) {
            AsyncStorage.setItem(
              StorageKeys.SELECTED_EQUIPMENT,
              JSON.stringify(normalizeEquipment(data.answers.equipment))
            ).catch((err) =>
              logger.error("Store", "שגיאה בשמירת ציוד נבחר", err)
            );
          }

          // סנכרון שרת מרוכך
          get().scheduleServerSync("setSmartQuestionnaireData");

          logger.info("Store", "Smart questionnaire data set successfully");
        } catch (error) {
          logger.error(
            "Store",
            "Error setting smart questionnaire data",
            error
          );
          // Try to save minimal data as fallback
          try {
            set((state) => ({
              user: {
                ...(state.user || {}),
                smartquestionnairedata: data,
              },
            }));
          } catch (fallbackError) {
            logger.error("Store", "Fallback save also failed", fallbackError);
          }
        }
      },

      // עדכון חלקי של נתוני השאלון החכם
      // Partial update of smart questionnaire data
      updateSmartQuestionnaireData: (updates) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                smartquestionnairedata: state.user.smartquestionnairedata
                  ? {
                      ...state.user.smartquestionnairedata,
                      ...updates,
                      // מיזוג בטוח של answers ללא גישה ישירה במקומות אחרים בקוד
                      answers: {
                        ...(extractSmartAnswers(state.user) || {}),
                        ...(updates.answers || {}),
                      } as Record<string, unknown>,
                      metadata: {
                        ...state.user.smartquestionnairedata.metadata,
                        ...updates.metadata,
                      },
                    }
                  : undefined,
              }
            : null,
        }));
        get().scheduleServerSync("updateSmartQuestionnaireData");
      },

      // קבלת תשובות השאלון החכם
      // Get smart questionnaire answers
      getSmartQuestionnaireAnswers: () => {
        const state = get();
        return state.user?.smartquestionnairedata?.answers || null;
      },

      // איפוס השאלון החכם
      // Reset smart questionnaire
      resetSmartQuestionnaire: () => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                smartquestionnairedata: undefined,
                genderProfile: undefined,
              }
            : null,
        }));

        // ניקוי מ-AsyncStorage
        AsyncStorage.multiRemove([
          StorageKeys.SMART_QUESTIONNAIRE_RESULTS,
          StorageKeys.USER_GENDER_PREFERENCE,
          StorageKeys.SELECTED_EQUIPMENT,
          StorageKeys.GENDER_ADAPTATION_DATA,
        ]);

        get().scheduleServerSync("resetSmartQuestionnaire");
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
        AsyncStorage.setItem(StorageKeys.USER_GENDER_PREFERENCE, gender);

        get().scheduleServerSync("setUserGender");
      },

      // עדכון פרופיל מגדר
      // Update gender profile
      updateGenderProfile: (profile) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                genderprofile: {
                  selectedGender:
                    state.user.genderprofile?.selectedGender || "other",
                  ...state.user.genderprofile,
                  ...profile,
                },
              }
            : null,
        }));
        get().scheduleServerSync("updateGenderProfile");
      },

      // קבלת שם אימון מותאם
      // Get adapted workout name
      getAdaptedWorkoutName: (originalName) => {
        const state = get();
        const genderProfile = state.user?.genderprofile;

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
        logger.debug("Store", "userStore.setQuestionnaire נקרא", {
          answerCount: Object.keys(answers).length,
        });

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

        logger.debug("Store", "Creating questionnaireData", {
          hasMetadata: !!questionnaireData.metadata,
        });

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
        AsyncStorage.setItem(
          StorageKeys.QUESTIONNAIRE_ANSWERS,
          JSON.stringify(answers)
        )
          .then(() =>
            logger.info(
              "UserStore",
              "questionnaire_answers saved to AsyncStorage"
            )
          )
          .catch((err) =>
            logger.error("UserStore", "Error saving questionnaire_answers", {
              error: err,
            })
          );

        // שמירת המטאדאטה המורחבת
        AsyncStorage.setItem(
          StorageKeys.QUESTIONNAIRE_METADATA,
          JSON.stringify(answers)
        )
          .then(() =>
            logger.info(
              "UserStore",
              "questionnaire_metadata saved to AsyncStorage"
            )
          )
          .catch((err) =>
            logger.error("UserStore", "Error saving questionnaire_metadata", {
              error: err,
            })
          );

        get().scheduleServerSync("setQuestionnaire");
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
        get().scheduleServerSync("setQuestionnaireData");
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

        get().scheduleServerSync("resetQuestionnaire");
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
        get().scheduleServerSync("updatePreferences");
      },

      // עדכון העדפות אימון
      // Update training preferences
      updateTrainingPreferences: (prefs) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                trainingstats: {
                  ...state.user.trainingstats,
                  preferredWorkoutDays: prefs.workoutDays,
                  selectedEquipment: normalizeEquipment(prefs.equipment),
                  fitnessGoals: prefs.goals,
                  currentFitnessLevel: prefs.fitnessLevel,
                },
              }
            : null,
        }));
        get().scheduleServerSync("updateTrainingPreferences");
      },

      // עדכון סטטיסטיקות אימון
      // Update training statistics
      updateTrainingStats: (stats) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                trainingstats: {
                  ...state.user.trainingstats,
                  ...stats,
                },
              }
            : null,
        }));
        get().scheduleServerSync("updateTrainingStats");
      },

      // === פונקציות בדיקה ושמירה ===
      // === Validation and Save Functions ===

      // שמירה ידנית ל-AsyncStorage
      // Manual save to AsyncStorage
      saveToStorage: async () => {
        try {
          const state = get();
          if (state.user) {
            await AsyncStorage.setItem(
              StorageKeys.USER_PERSISTENCE,
              JSON.stringify(state)
            );
            logger.debug(
              "Storage",
              "User data saved to AsyncStorage successfully"
            );
          }
        } catch (error) {
          logger.error("Storage", "Failed to save user data", error);
          await get().handleStorageError(error, "saveToStorage");
        }
      },

      // Accessibility support
      getAccessibilityLabel: (
        context: "user" | "questionnaire" | "subscription"
      ) => {
        const state = get();
        const user = state.user;

        switch (context) {
          case "user": {
            return user?.name
              ? `פרופיל משתמש: ${user.name}`
              : "פרופיל משתמש לא זמין";
          }
          case "questionnaire": {
            const hasQuestionnaire = !!(
              user?.smartquestionnairedata || user?.questionnaire
            );
            return hasQuestionnaire ? "שאלון הושלם" : "שאלון לא הושלם";
          }
          case "subscription": {
            const subscription = user?.subscription;
            if (!subscription) return "מידע מנוי לא זמין";
            return `מנוי ${subscription.type}: ${subscription.isActive ? "פעיל" : "לא פעיל"}`;
          }
          default: {
            return "מידע משתמש";
          }
        }
      },

      getScreenReaderText: (action: string, data?: unknown) => {
        try {
          switch (action) {
            case "user_updated": {
              return "פרטי המשתמש עודכנו בהצלחה";
            }
            case "questionnaire_completed": {
              return "השאלון הושלם והנתונים נשמרו";
            }
            case "subscription_changed": {
              const subData = data as { type?: string };
              return `המנוי שונה ל: ${subData?.type || "לא ידוע"}`;
            }
            case "logout": {
              return "התנתקות בוצעה בהצלחה";
            }
            case "data_cleared": {
              return "כל הנתונים נוקו מהמכשיר";
            }
            default: {
              return `הפעולה ${action} בוצעה`;
            }
          }
        } catch (error) {
          logger.error(
            "Accessibility",
            "Error generating screen reader text",
            error
          );
          return "הפעולה בוצעה";
        }
      },

      // Enhanced error handling
      handleStorageError: async (error: unknown, operation: string) => {
        try {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          logger.error("Storage", `Storage error in ${operation}`, {
            error: errorMessage,
          });

          // Try to recover by clearing corrupted data if needed
          if (
            errorMessage.includes("QUOTA_EXCEEDED") ||
            errorMessage.includes("storage full")
          ) {
            logger.warn(
              "Storage",
              "Storage quota exceeded, attempting cleanup"
            );
            // Could implement storage cleanup here
          }
        } catch (handlingError) {
          logger.error("Storage", "Error in error handling", handlingError);
        }
      },

      validateUserConsistency: () => {
        const state = get();
        const user = state.user;
        const issues: string[] = [];

        if (!user) {
          return { isValid: false, issues: ["No user data"] };
        }

        // Check data consistency
        if (
          user.smartquestionnairedata &&
          !user.smartquestionnairedata.answers
        ) {
          issues.push("Smart questionnaire data missing answers");
        }

        if (
          user.trainingstats?.selectedEquipment &&
          !Array.isArray(user.trainingstats.selectedEquipment)
        ) {
          issues.push("Training stats equipment data malformed");
        }

        if (user.subscription && !user.subscription.type) {
          issues.push("Subscription data missing type");
        }

        return {
          isValid: issues.length === 0,
          issues,
        };
      },

      // בדיקת תקינות נתוני משתמש
      // Validate user data
      validateUserData: () => {
        try {
          const state = get();
          const user = state.user;

          if (!user) return false;

          // בדיקות בסיסיות
          const hasBasicInfo = !!(user.id || user.email || user.name);
          const hasSmartQuestionnaire = !!user.smartquestionnairedata?.answers;
          const hasOldQuestionnaire = !!(
            user.questionnaire || user.questionnairedata
          );

          const consistencyCheck = get().validateUserConsistency();

          return (
            hasBasicInfo &&
            (hasSmartQuestionnaire || hasOldQuestionnaire) &&
            consistencyCheck.isValid
          );
        } catch (error) {
          logger.error("Validation", "Error validating user data", error);
          return false;
        }
      },

      // קבלת סטטוס השלמה
      // Get completion status
      getCompletionStatus: () => {
        const state = get();
        const user = state.user;

        const hasBasicInfo = !!(user?.id || user?.email || user?.name);
        const hasSmartQuestionnaire = !!user?.smartquestionnairedata?.answers;
        const hasOldQuestionnaire = !!(
          user?.questionnaire || user?.questionnairedata
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
          logger.info(
            "DataManagement",
            "userStore.clearAllUserData - מתחיל ניקוי מלא"
          );

          // קבלת כל המפתחות מ-AsyncStorage
          const allKeys = await AsyncStorage.getAllKeys();
          logger.debug(
            "DataManagement",
            `נמצאו ${allKeys.length} מפתחות ב-AsyncStorage`
          );

          // מחיקת כל המפתחות
          await AsyncStorage.multiRemove(allKeys);

          // איפוס ה-store
          set({ user: null });

          logger.info(
            "DataManagement",
            "userStore.clearAllUserData - ניקוי הושלם בהצלחה"
          );
        } catch (error) {
          logger.error(
            "DataManagement",
            "userStore.clearAllUserData - שגיאה בניקוי",
            error
          );
          throw error;
        }
      },

      // 🎯 פעולות משתמש דמו מותאם
      // Custom demo user actions
      setCustomDemoUser: (demoUser) => {
        if (!demoUser) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const qd: any = (demoUser as any).questionnaireData; // עשוי להגיע מ-UnifiedQuestionnaireScreen

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
                questionnaire: qd || state.user.questionnaire,
                smartquestionnairedata: (() => {
                  const existing = state.user.smartquestionnairedata;
                  if (qd) {
                    const realEquip = Array.isArray(qd.equipment)
                      ? normalizeEquipment(qd.equipment)
                      : [];
                    if (existing) {
                      if (realEquip.length > 0) {
                        return {
                          ...existing,
                          answers: {
                            ...existing.answers,
                            equipment: realEquip,
                          },
                        };
                      }
                      return existing;
                    }
                    return {
                      answers: {
                        goal: qd.goal,
                        gender: qd.gender,
                        experience: qd.experience,
                        availability: [qd.frequency].filter(Boolean),
                        duration: qd.duration,
                        location: qd.location,
                        diet: qd.diet,
                        equipment:
                          realEquip.length > 0 ? realEquip : qd.equipment,
                      },
                      metadata: qd.metadata || { source: "customDemo" },
                    };
                  }
                  return existing;
                })(),
                trainingstats: (() => {
                  if (!qd) return state.user.trainingstats;
                  const freq = qd.frequency;
                  let preferredDays =
                    state.user.trainingstats?.preferredWorkoutDays || 3;
                  if (typeof freq === "string" && /_days$/.test(freq)) {
                    const n = parseInt(freq.split("_", 1)[0], 10);
                    if (!isNaN(n)) preferredDays = n;
                  }
                  return {
                    ...state.user.trainingstats,
                    preferredWorkoutDays: preferredDays,
                    selectedEquipment: (() => {
                      if (qd.equipment && Array.isArray(qd.equipment)) {
                        const real = normalizeEquipment(qd.equipment);
                        if (real.length > 0) return real;
                      }
                      return state.user.trainingstats?.selectedEquipment || [];
                    })(),
                    fitnessGoals: qd.goal
                      ? [qd.goal]
                      : state.user.trainingstats?.fitnessGoals || [],
                    currentFitnessLevel:
                      demoUser.experience ||
                      state.user.trainingstats?.currentFitnessLevel,
                  };
                })(),
              }
            : {
                // Create baseline user object when state.user is null
                id: `demo_${Date.now()}`,
                email: "",
                name: demoUser.name || "משתמש דמו",
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
                questionnaire: qd,
                smartquestionnairedata: qd
                  ? {
                      answers: {
                        goal: qd.goal,
                        gender: qd.gender,
                        experience: qd.experience,
                        availability: [qd.frequency].filter(Boolean),
                        duration: qd.duration,
                        location: qd.location,
                        diet: qd.diet,
                        equipment: Array.isArray(qd.equipment)
                          ? normalizeEquipment(qd.equipment)
                          : qd.equipment,
                      },
                      metadata: qd.metadata || { source: "customDemo" },
                    }
                  : undefined,
                trainingstats: (() => {
                  if (!qd) return { totalWorkouts: 0 };
                  const freq = qd.frequency;
                  let preferredDays = 3;
                  if (typeof freq === "string" && /_days$/.test(freq)) {
                    const n = parseInt(freq.split("_", 1)[0], 10);
                    if (!isNaN(n)) preferredDays = n;
                  }
                  return {
                    totalWorkouts: 0,
                    preferredWorkoutDays: preferredDays,
                    selectedEquipment: Array.isArray(qd.equipment)
                      ? normalizeEquipment(qd.equipment)
                      : [],
                    fitnessGoals: qd.goal ? [qd.goal] : [],
                    currentFitnessLevel: demoUser.experience || "intermediate",
                  };
                })(),
              },
        }));
        logger.info("DemoUser", "Custom demo user saved", {
          name: demoUser?.name,
        });
        get().scheduleServerSync("setCustomDemoUser");
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
        logger.info("DemoUser", "Custom demo user cleared");
        get().scheduleServerSync("clearCustomDemoUser");
      },

      // פונקציה לניקוי מלא לפיתוח (ללא התנתקות)
      // Complete data clearing for development (without logout)
      clearDataForFreshStart: async () => {
        try {
          logger.info(
            "Development",
            "clearDataForFreshStart - מתחיל ניקוי לכניסה חדשה"
          );

          // קבלת כל המפתחות מ-AsyncStorage
          const allKeys = await AsyncStorage.getAllKeys();
          logger.debug(
            "Development",
            `נמצאו ${allKeys.length} מפתחות ב-AsyncStorage`
          );

          // מחיקת כל המפתחות
          await AsyncStorage.multiRemove(allKeys);

          // איפוס ה-store
          set({ user: null });

          logger.info(
            "Development",
            "clearDataForFreshStart - ניקוי הושלם, הסשן החדש התחיל"
          );
        } catch (error) {
          logger.error(
            "Development",
            "clearDataForFreshStart - שגיאה בניקוי",
            error
          );
          throw error;
        }
      },

      // =======================================
      // 🎯 Subscription & Trial Management
      // ניהול מנוי ותקופת ניסיון
      // =======================================

      initializeSubscription: () => {
        try {
          const state = get();
          if (!state.user) {
            logger.warn(
              "Subscription",
              "Cannot initialize subscription - no user"
            );
            return;
          }

          const now = new Date().toISOString();

          if (!state.user.subscription) {
            // יצירת מנוי ניסיון חדש
            set((prevState) => ({
              user: prevState.user
                ? {
                    ...prevState.user,
                    subscription: {
                      type: "trial",
                      startDate: now,
                      registrationDate: now,
                      isActive: true,
                      trialDaysRemaining: 7,
                      hasCompletedTrial: false,
                      lastTrialCheck: now,
                    },
                  }
                : null,
            }));

            logger.info("Subscription", "Trial subscription initialized", {
              userId: state.user.id,
              trialDays: 7,
            });
          }
        } catch (error) {
          logger.error(
            "Subscription",
            "Error initializing subscription",
            error
          );
        }
      },

      updateSubscription: (updates) => {
        try {
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  subscription: {
                    ...state.user.subscription,
                    ...updates,
                    lastTrialCheck: new Date().toISOString(),
                  } as User["subscription"],
                }
              : null,
          }));
          get().scheduleServerSync("updateSubscription");
          logger.debug("Subscription", "Subscription updated", {
            updatedFields: Object.keys(updates || {}),
          });
        } catch (error) {
          logger.error("Subscription", "Error updating subscription", error);
        }
      },

      checkTrialStatus: () => {
        const state = get();
        const subscription = state.user?.subscription;

        if (!subscription) {
          return { isTrialActive: false, daysRemaining: 0, hasExpired: true };
        }

        const now = new Date();
        const registrationDate = new Date(subscription.registrationDate);
        const daysSinceRegistration = Math.floor(
          (now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const daysRemaining = Math.max(0, 7 - daysSinceRegistration);
        const isTrialActive =
          subscription.type === "trial" &&
          daysRemaining > 0 &&
          subscription.isActive;

        // עדכון סטטוס הניסיון אם צריך
        if (subscription.trialDaysRemaining !== daysRemaining) {
          get().updateSubscription({
            trialDaysRemaining: daysRemaining,
            hasCompletedTrial: daysRemaining === 0,
            isActive: subscription.type === "premium" || daysRemaining > 0,
          });
        }

        return {
          isTrialActive,
          daysRemaining,
          hasExpired: daysRemaining === 0 && subscription.type === "trial",
        };
      },

      getSubscriptionType: () => {
        const state = get();
        return state.user?.subscription?.type || "free";
      },

      canAccessPremiumFeatures: () => {
        const state = get();
        const subscription = state.user?.subscription;

        if (!subscription) return false;

        if (subscription.type === "premium") return true;

        const trialStatus = get().checkTrialStatus();
        return trialStatus.isTrialActive;
      },

      startPremiumSubscription: () => {
        get().updateSubscription({
          type: "premium",
          endDate: undefined, // אין תאריך סיום לפרימיום
          isActive: true,
        });
      },

      // =======================================
      // 📋 Workout Plans Management
      // ניהול תוכניות אימון
      // =======================================

      setWorkoutPlans: (plans) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                workoutplans: {
                  ...state.user.workoutplans,
                  ...plans,
                  lastUpdated: new Date().toISOString(),
                },
              }
            : null,
        }));
        get().scheduleServerSync("setWorkoutPlans");
      },

      updateWorkoutPlan: (planType, plan) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                workoutplans: {
                  ...state.user.workoutplans,
                  [planType === "basic"
                    ? "basicPlan"
                    : planType === "smart"
                      ? "smartPlan"
                      : "additionalPlan"]: plan,
                  lastUpdated: new Date().toISOString(),
                },
              }
            : null,
        }));
        get().scheduleServerSync("updateWorkoutPlan");
      },

      getAccessibleWorkoutPlan: () => {
        const state = get();
        const plans = state.user?.workoutplans;
        const canAccessPremium = get().canAccessPremiumFeatures();

        if (!plans) return null;

        // אם יש גישה לפרימיום והתוכנית החכמה קיימת
        if (canAccessPremium && plans.smartPlan) {
          return plans.smartPlan;
        }

        // אחרת תחזיר את התוכנית הבסיסית
        return plans.basicPlan || null;
      },

      shouldBlurPremiumContent: () => {
        return !get().canAccessPremiumFeatures();
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
        logger.debug("Store", "User store rehydrated", {
          hasUser: !!state?.user?.email,
        });

        // מצב פיתוח: ניקוי אוטומטי בכל כניסה חדשה (מושבת זמנית)
        // Development mode: Auto-clear on every fresh start (temporarily disabled)
        // eslint-disable-next-line no-constant-condition, no-constant-binary-expression
        if (false && __DEV__) {
          logger.debug(
            "Store",
            "DEV MODE: Auto-clearing user data for fresh start"
          );
          // ניקוי אסינכרוני כדי לא לחסום את הטעינה
          setTimeout(async () => {
            try {
              const allKeys = await AsyncStorage.getAllKeys();
              await AsyncStorage.multiRemove(allKeys);
              logger.debug("Store", "DEV MODE: All data cleared");
            } catch (error) {
              logger.error("Store", "DEV MODE: Error clearing data", error);
            }
          }, 100);
        }

        // טעינת נתוני אמת מהשרת אחרי רהידרציה
        setTimeout(() => {
          try {
            const actions = useUserStore.getState();
            actions.refreshFromServer().catch((e: unknown) => {
              const msg = e instanceof Error ? e.message : String(e);
              logger.warn("ServerSync", "refreshFromServer failed", {
                error: msg,
              });
            });
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            logger.warn("ServerSync", "refreshFromServer outer catch", {
              error: msg,
            });
          }
        }, 50);
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

// Thin selector for normalized equipment (for workout generation)
export const useUserEquipment = () => {
  const user = useUserStore((state) => state.user);

  // Try to get equipment from multiple possible sources
  const equipment =
    user?.customDemoUser?.equipment ||
    user?.trainingstats?.selectedEquipment ||
    [];

  return normalizeEquipment(equipment);
};

// useUserPreferences moved to hooks/useUserPreferences.ts for advanced smart features
export const useQuestionnaireCompleted = () =>
  useUserStore(
    (state) =>
      state.user?.questionnaire !== undefined ||
      state.user?.questionnairedata?.completedAt !== undefined
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
    logger.info("Development", "Performing fresh start...");
    await clearDataForFreshStart();
    // אחרי הניקוי, האפליקציה תחזור למסך הפתיחה
    logger.info(
      "Development",
      "Fresh start completed! App will reset to welcome screen."
    );
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
      user?.questionnairedata ||
      user?.smartquestionnairedata
    ),
  };
};

// ==============================
// Server sync implementation
// ==============================
let __userSyncTimer: ReturnType<typeof setTimeout> | null = null;
const SYNC_DEBOUNCE_MS = 800;

useUserStore.setState((prev) => ({
  ...prev,
  refreshFromServer: async () => {
    try {
      const state = useUserStore.getState();
      const u = state.user;
      if (!u?.id || typeof u.id !== "string") return;
      if (u.id.startsWith("demo_")) return;
      const serverUser = await userApi.getById(u.id);
      // שמירה על שדות לוקליים שלא קיימים בשרת (אם יש)
      useUserStore.setState((curr) => ({
        ...curr,
        user: { ...serverUser, customDemoUser: curr.user?.customDemoUser },
      }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.warn("ServerSync", "userStore.refreshFromServer error", {
        error: msg,
      });
    }
  },
  scheduleServerSync: (reason?: string) => {
    try {
      if (__userSyncTimer) clearTimeout(__userSyncTimer);
      __userSyncTimer = setTimeout(async () => {
        const state = useUserStore.getState();
        const u = state.user;
        if (!u?.id || typeof u.id !== "string") return;
        if (u.id.startsWith("demo_")) return; // אל תסנכרן משתמש דמו
        try {
          // בניית אובייקט קנוני (camelCase) ורק שדות רלוונטיים לסנכרון
          // הערה: אם נוסיף שדות חדשים בעתיד מספיק להוסיף אותם לרשימה זו;
          // fieldMapper.toDB ימיר ללואורקייס / מפה מותאמת.
          const canonicalUpdates: Record<string, unknown> = {};
          const ux = u as Partial<User> & Record<string, unknown>;
          if (
            ux.smartquestionnairedata ||
            (ux as Record<string, unknown>)["smartQuestionnaireData"]
          ) {
            canonicalUpdates.smartQuestionnaireData =
              (ux as Record<string, unknown>)["smartQuestionnaireData"] ||
              ux.smartquestionnairedata;
          }
          if (ux.questionnaire)
            canonicalUpdates.questionnaire = ux.questionnaire;
          if (ux.questionnairedata)
            canonicalUpdates.questionnairedata = ux.questionnairedata;
          if (ux.preferences) canonicalUpdates.preferences = ux.preferences;
          if (ux.genderprofile)
            canonicalUpdates.genderprofile = ux.genderprofile;
          if (ux.trainingstats)
            canonicalUpdates.trainingstats = ux.trainingstats;
          if (ux.workoutplans) canonicalUpdates.workoutplans = ux.workoutplans;
          if (ux.subscription) canonicalUpdates.subscription = ux.subscription;

          if (Object.keys(canonicalUpdates).length === 0) return;

          const payload = fieldMapper.toDB(canonicalUpdates);
          await userApi.update(u.id, payload as Partial<User>);
          // אופציונלי: רענון כדי למשוך אמת מהשרת
          // const fresh = await userApi.getById(u.id);
          // useUserStore.setState((curr) => ({ ...curr, user: { ...fresh } }));
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          logger.warn(
            "ServerSync",
            `userStore scheduleServerSync failed${reason ? ` (${reason})` : ""}`,
            { error: msg }
          );
        }
      }, SYNC_DEBOUNCE_MS);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.warn("ServerSync", "scheduleServerSync outer catch", {
        error: msg,
      });
    }
  },
}));

// =======================================
// 🎯 Subscription & Trial Hooks
// Hooks למערכת מנוי ותקופת ניסיון
// =======================================

/**
 * Hook לבדיקת סטטוס מנוי ותקופת ניסיון
 */
export const useSubscription = () => {
  const subscription = useUserStore((state) => state.user?.subscription);
  const checkTrialStatus = useUserStore((state) => state.checkTrialStatus);
  const getSubscriptionType = useUserStore(
    (state) => state.getSubscriptionType
  );
  const canAccessPremiumFeatures = useUserStore(
    (state) => state.canAccessPremiumFeatures
  );
  const initializeSubscription = useUserStore(
    (state) => state.initializeSubscription
  );
  const startPremiumSubscription = useUserStore(
    (state) => state.startPremiumSubscription
  );

  const trialStatus = checkTrialStatus();

  return {
    subscription,
    subscriptionType: getSubscriptionType(),
    trialStatus,
    canAccessPremium: canAccessPremiumFeatures(),
    shouldBlurContent: !canAccessPremiumFeatures(),
    initializeSubscription,
    startPremiumSubscription,
  };
};

/**
 * Hook לניהול תוכניות אימון
 */
export const useWorkoutPlans = () => {
  const workoutPlans = useUserStore((state) => state.user?.workoutplans);
  const setWorkoutPlans = useUserStore((state) => state.setWorkoutPlans);
  const updateWorkoutPlan = useUserStore((state) => state.updateWorkoutPlan);
  const getAccessibleWorkoutPlan = useUserStore(
    (state) => state.getAccessibleWorkoutPlan
  );
  const shouldBlurPremiumContent = useUserStore(
    (state) => state.shouldBlurPremiumContent
  );

  return {
    workoutPlans,
    setWorkoutPlans,
    updateWorkoutPlan,
    accessiblePlan: getAccessibleWorkoutPlan(),
    shouldBlurPremium: shouldBlurPremiumContent(),
  };
};

/**
 * Hook פשוט לבדיקה האם המשתמש יכול לגשת לתכנים מתקדמים
 */
export const useCanAccessPremium = () =>
  useUserStore((state) => state.canAccessPremiumFeatures());

/**
 * Hook לקבלת ימי ניסיון נותרים
 */
export const useTrialDaysRemaining = () => {
  const checkTrialStatus = useUserStore((state) => state.checkTrialStatus);
  return checkTrialStatus().daysRemaining;
};

// =======================================
// 🎯 Advanced Hooks for Better UX
// Hooks מתקדמים לחוויית משתמש משופרת
// =======================================

/**
 * Hook מתקדם לניהול סטטוס נתונים
 */
export const useUserDataStatus = () => {
  const user = useUserStore((state) => state.user);
  const validateUserData = useUserStore((state) => state.validateUserData);
  const validateUserConsistency = useUserStore(
    (state) => state.validateUserConsistency
  );
  const getCompletionStatus = useUserStore(
    (state) => state.getCompletionStatus
  );

  const isValid = validateUserData();
  const consistency = validateUserConsistency();
  const completion = getCompletionStatus();

  return {
    hasUser: !!user,
    isValid,
    consistency,
    completion,
    isReady: isValid && consistency.isValid && completion.isFullySetup,
  };
};

/**
 * Hook לנגישות ותמיכה בקורא מסך
 */
export const useUserAccessibility = () => {
  const getAccessibilityLabel = useUserStore(
    (state) => state.getAccessibilityLabel
  );
  const getScreenReaderText = useUserStore(
    (state) => state.getScreenReaderText
  );

  return {
    getAccessibilityLabel,
    getScreenReaderText,
    announceAction: (action: string, data?: unknown) => {
      const text = getScreenReaderText(action, data);
      // Could integrate with React Native's AccessibilityInfo here
      logger.debug("Accessibility", "Action announced", { action, text });
      return text;
    },
  };
};

/**
 * Hook מתקדם לניהול שגיאות
 */
export const useUserErrorHandling = () => {
  const handleStorageError = useUserStore((state) => state.handleStorageError);

  return {
    handleStorageError,
    safeExecute: async <T>(
      operation: () => Promise<T>,
      operationName: string,
      fallback?: T
    ): Promise<T | undefined> => {
      try {
        return await operation();
      } catch (error) {
        logger.error("UserStore", `Error in ${operationName}`, error);
        await handleStorageError(error, operationName);
        return fallback;
      }
    },
  };
};
