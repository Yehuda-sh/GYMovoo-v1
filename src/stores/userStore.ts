/**
 * @file src/stores/userStore.ts
 * @description Store מרכזי לניהול מצב המשתמש עם תמיכה בשאלון חכם
 * English: Central store for managing user state with smart questionnaire support
 *
 * מה הקובץ הזה עושה?
 * ===================
 * זה כמו "מחסן מרכזי" לאפליקציה ששומר את כל המידע על המשתמש:
 * - שם, אימייל, העדפות
 * - תשובות לשאלון החכם
 * - תוכניות אימון
 * - מצב מנוי (חינם/ניסיון/פרימיום)
 *
 * למה זה חשוב?
 * =============
 * בלי זה, האפליקציה "תשכח" הכל כשאתה סוגר אותה.
 * זה שומר את כל הנתונים בטלפון ומסנכרן עם השרת כשצריך.
 *
 * @features
 * - ניהול מצב משתמש מרכזי עם Zustand ו-AsyncStorage persistence
 * - תמיכה מלאה בשאלון חכם חדש (SmartQuestionnaireData)
 * - פונקציות התאמת מגדר והעדפות מותאמות אישית
 * - ניהול משתמש דמו מותאם עם אפשרויות ניקוי מתקדמות
 * - Hooks נוספים לנוחות ובדיקות מצב
 * - Enhanced error handling עם fallback strategies
 * - Performance optimizations עם memoization
 * - Accessibility support לקוראי מסך
 * - TypeScript strict typing ו-data validation
 * - Advanced logging ו-debug capabilities
 *
 * @enhancements_2025-09-01
 * - ✅ שיפור type safety עם ExtendedQuestionnaireAnswers
 * - ✅ החלפה של eslint-disable ב-gym_equipment עם טיפוס מוגדר
 * - ✅ תיעוד משופר וסידור קוד
 * - ✅ הוספת קבועים מרכזיים (CONSTANTS) למניעת קוד קשיח
 * - ✅ פונקציית עזר לניתוח ימי אימון (parseWorkoutDaysFromFrequency)
 * - ✅ החלפת ערכי ברירת מחדל קשיחים עם קבועים
 * - ✅ שיפור קריאות הקוד והתחזוקה
 * - ✅ הסרת פונקציונליות demo user לא רלוונטית
 *
 * @dependencies zustand, AsyncStorage, types/index, logger
 * @usage Used throughout application for user state management
 * @updated 2025-09-01 שיפורי type safety ותיעוד - Store מתקדם עם טיפוסים משופרים וקבועים מרכזיים
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, WorkoutPlan } from "../core/types/user.types";
import type { QuestionnaireData } from "../features/questionnaire/types";
import { userApi } from "../services/api/userApi";
import { StorageKeys } from "../constants/StorageKeys";
import { fieldMapper } from "../utils/fieldMapper";
import { logger } from "../utils/logger";
import { normalizeEquipment as normalizeEquipmentCatalog } from "../utils/equipmentCatalog";

// Import constants
import { USER_STORE_CONSTANTS } from "../constants/userStoreConstants";

// ==============================
// קבועים - כמו הגדרות קבועות שלא משתנות
// ==============================
const CONSTANTS = USER_STORE_CONSTANTS;

// =======================================
// 🎯 Internal Helper Functions
// פונקציות עזר פנימיות
// =======================================

/**
 * Safely clears all AsyncStorage data with logging
 * Used for complete data reset operations
 */
const clearAllStorageData = async (context: string): Promise<void> => {
  try {
    logger.info("Storage", `${context} - Starting complete data clear`);

    const allKeys = await AsyncStorage.getAllKeys();
    logger.debug("Storage", `Found ${allKeys.length} keys in AsyncStorage`);

    await AsyncStorage.multiRemove(allKeys);

    logger.info("Storage", `${context} - Data clear completed successfully`);
  } catch (error) {
    logger.error("Storage", `${context} - Error clearing data`, error);
    throw error;
  }
};

// ==============================
// אופטימיזציה לביצועים - שמירה בזיכרון של חישובים
// Performance Optimization Utils
// ==============================
let __memoizedEquipment: {
  data: string[];
  timestamp: number;
  input: string[];
} | null = null;

const memoizedNormalizeEquipment = (arr?: string[]): string[] => {
  if (!arr || arr.length === 0) return [];

  const inputKey = JSON.stringify(arr.sort());
  const now = Date.now();

  if (
    __memoizedEquipment &&
    __memoizedEquipment.input.join(",") === inputKey &&
    now - __memoizedEquipment.timestamp < CONSTANTS.CACHE.MEMO_CACHE_TTL
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
// Helper Functions
// ==============================

// ==============================
// Utilities
// ==============================
const normalizeEquipment = (arr?: string[]): string[] => {
  // Use memoized version for better performance
  return memoizedNormalizeEquipment(arr);
};

// טיפוס מורחב לתשובות השאלון עם שדות נוספים
// Extended questionnaire answers type with additional fields
type ExtendedQuestionnaireAnswers = {
  [key: number]: string | string[];
  gym_equipment?: (string | { id?: string; label?: string })[];
};

// =======================================
// 🏪 הגדרת הממשק - כמו חוזה של מה ה-store יכול לעשות
// Store Interface Definition
// =======================================

interface UserStore {
  // מצב המשתמש
  // User state
  user: User | null;
  // האם הטעינה מהאחסון הושלמה
  // Has persisted state finished hydrating
  hydrated: boolean;
  // האם המשתמש כבר ראה את מסך ה- Welcome בעבר
  hasSeenWelcome: boolean;

  // 🚫 מניעת עדכונים תכופים מדי
  lastSubscriptionUpdate: number;

  // פעולות בסיסיות
  // Basic actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;

  // בדיקות מצב התחברות
  // Authentication state checks
  isLoggedIn: () => Promise<boolean>;
  clearAllUserData: () => Promise<void>;
  clearDataForFreshStart: () => Promise<void>; // חדש: לניקוי במצב פיתוח

  // פעולות שאלון חכם חדשות
  // New smart questionnaire actions
  setSmartQuestionnaireData: (data: QuestionnaireData) => void;
  updateSmartQuestionnaireData: (updates: Partial<QuestionnaireData>) => void;
  getSmartQuestionnaireAnswers: () => QuestionnaireData["answers"] | null;
  resetSmartQuestionnaire: () => void;

  // פעולות התאמת מגדר
  // Gender adaptation actions
  setUserGender: (gender: "male" | "female" | "other") => void;
  updateGenderProfile: (profile: Partial<User["genderprofile"]>) => void;
  getAdaptedWorkoutName: (originalName: string) => string;

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
  // סנכרון שרת
  // Server sync helpers
  refreshFromServer: () => Promise<void>;
  scheduleServerSync: (reason?: string) => void;
  // פעולה פנימית לעדכון דגל הידרציה
  setHydrated?: () => void;
  // סימון שהמשתמש ראה את מסך ה-Welcome
  markWelcomeSeen: () => void;
}

// =======================================
// 🏪 יצירת ה-Store הראשי - זה הלב של כל ניהול המשתמש
// Creating the main store with Zustand
// =======================================
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,
      hasSeenWelcome: false,
      // 🚫 מניעת עדכונים תכופים מדי
      lastSubscriptionUpdate: 0,
      setHydrated: () => set({ hydrated: true }),
      markWelcomeSeen: () => set({ hasSeenWelcome: true }),

      // Stubs for server sync (replaced below after store creation)
      refreshFromServer: async () => {},
      scheduleServerSync: () => {},

      // הגדרת משתמש
      // Set user
      setUser: async (user) => {
        try {
          // If user doesn't have questionnaire data but there are saved results, load them
          if (user && !user.questionnaireData) {
            try {
              const savedResults = await AsyncStorage.getItem(
                StorageKeys.SMART_QUESTIONNAIRE_RESULTS
              );
              if (savedResults) {
                const smartData = JSON.parse(savedResults);
                user = {
                  ...user,
                  questionnaireData: smartData,
                  hasQuestionnaire: true,
                };
                logger.debug(
                  "UserStore",
                  "Loaded questionnaire results from AsyncStorage"
                );
              }
            } catch (error) {
              logger.warn(
                "UserStore",
                "Failed to load saved questionnaire results",
                error
              );
            }
          }

          set({ user });
          // סנכרון שרת (אם יש מזהה אמיתי)
          get().scheduleServerSync("setUser");
          logger.debug("UserStore", "User set successfully", {
            hasUser: !!user,
            hasQuestionnaire: !!user?.questionnaireData,
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

      // ===========================================
      // 🚪 התנתקות - מוחק את כל הנתונים ומסמן שהמשתמש התנתק
      // Logout - clears all data and marks user as logged out
      // ===========================================

      // התנתקות מפושטת עם ניקוי יעיל
      // Simplified logout with efficient cleanup
      logout: async () => {
        try {
          logger.debug("Auth", "userStore.logout - מתחיל התנתקות");

          // רשימת מפתחות עיקריים לניקוי
          const keysToRemove = [
            "user-storage",
            "smart_questionnaire_results",
            "user_gender_preference",
            "selected_equipment",
          ];

          // מחיקה יעילה של המפתחות העיקריים
          await AsyncStorage.multiRemove(keysToRemove);

          // שמירת מצב התנתקות
          await AsyncStorage.setItem("user_logged_out", "true");

          // איפוס ה-store עם סימון התנתקות
          set({ user: null });

          logger.info("Auth", "userStore.logout - התנתקות הושלמה בהצלחה");
        } catch (error) {
          logger.error("Auth", "userStore.logout - שגיאה בהתנתקות", error);
          // גם אם יש שגיאה, איפוס ה-store
          set({ user: null });
          throw error;
        }
      },

      // ===========================================
      // 📋 פונקציות השאלון החכם - מנהלות את התשובות והנתונים
      // Smart Questionnaire Functions - manage answers and data
      // ===========================================

      // === פונקציות השאלון החכם החדש ===
      // === New Smart Questionnaire Functions ===

      // הגדרת נתוני השאלון החכם
      // Set smart questionnaire data
      setSmartQuestionnaireData: (data) => {
        try {
          // אם יש משתמש קיים - עדכן אותו
          // אם אין משתמש - רק שמור את נתוני השאלון ב-AsyncStorage
          const state = get();
          if (state.user?.email) {
            // עדכון משתמש קיים
            set((st) => {
              if (!st.user) return st; // nothing to do
              const current = st.user;
              const availability = data.answers?.availability;
              const preferredWorkoutDays = (() => {
                if (Array.isArray(availability) && availability.length > 0) {
                  const token = availability[0];
                  if (typeof token === "string" && /_days$/.test(token)) {
                    const splitResult = token.split("_", 1)[0];
                    if (splitResult) {
                      const n = parseInt(splitResult, 10);
                      if (!isNaN(n) && n >= 1 && n <= 7) {
                        const days = [
                          "sunday",
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                          "saturday",
                        ];
                        return days.slice(0, n);
                      }
                    }
                  }
                  return availability.map((item) =>
                    typeof item === "string" ? item : String(item)
                  );
                }
                return (
                  current.trainingStats?.preferredWorkoutDays || [
                    "monday",
                    "wednesday",
                    "friday",
                  ]
                );
              })();

              const selectedEquipment = (() => {
                if (
                  data.answers &&
                  Array.isArray(data.answers.equipment) &&
                  data.answers.equipment.length
                )
                  return normalizeEquipment(data.answers.equipment);
                const extendedAnswers =
                  data.answers as ExtendedQuestionnaireAnswers;
                const ge = extendedAnswers?.gym_equipment;
                if (Array.isArray(ge) && ge.length) {
                  const mapped = ge
                    .map((g) => (typeof g === "string" ? g : g.id || g.label))
                    .filter(Boolean) as string[];
                  if (mapped.length) return normalizeEquipment(mapped);
                }
                return current.trainingStats?.selectedEquipment || [];
              })();

              const rawGoals = data.answers?.goals as unknown;
              const fitnessGoals: string[] = Array.isArray(rawGoals)
                ? (rawGoals.filter(Boolean) as string[])
                : typeof rawGoals === "string" && rawGoals
                  ? [String(rawGoals).trim()]
                  : current.trainingStats?.fitnessGoals || [];

              const currentFitnessLevel =
                (data.answers && data.answers.fitnessLevel) ||
                current.trainingStats?.currentFitnessLevel;

              return {
                user: {
                  ...current,
                  questionnaireData: data,
                  preferences: {
                    ...current.preferences,
                    gender:
                      data.answers && typeof data.answers.gender === "string"
                        ? data.answers.gender
                        : current.preferences?.gender,
                    rtlPreference: true,
                  },
                  trainingStats: {
                    ...(current.trainingStats || {}),
                    preferredWorkoutDays: (preferredWorkoutDays || []).filter(
                      (d): d is string => typeof d === "string"
                    ),
                    selectedEquipment: selectedEquipment || [],
                    fitnessGoals: fitnessGoals,
                    currentFitnessLevel:
                      (typeof currentFitnessLevel === "string" &&
                      currentFitnessLevel
                        ? currentFitnessLevel
                        : current.trainingStats?.currentFitnessLevel) ||
                      "beginner",
                  },
                },
              } as Partial<UserStore>;
            });
          }

          // שמירה ב-AsyncStorage
          AsyncStorage.setItem(
            StorageKeys.SMART_QUESTIONNAIRE_RESULTS,
            JSON.stringify(data)
          )
            .then(() =>
              logger.info("Store", "smart_questionnaire_results נשמר")
            )
            .catch((err) =>
              logger.error("Store", "שגיאה בשמירת השאלון החכם", err)
            );

          // שמירת העדפת מגדר בנפרד
          if (
            data.answers &&
            data.answers.gender &&
            typeof data.answers.gender === "string"
          ) {
            AsyncStorage.setItem(
              StorageKeys.USER_GENDER_PREFERENCE,
              data.answers.gender
            ).catch((err) =>
              logger.error("Store", "שגיאה בשמירת העדפת מגדר", err)
            );
          }

          // שמירת ציוד נבחר
          if (data.answers && Array.isArray(data.answers.equipment)) {
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
          // Try to save minimal data as fallback only if user exists
          try {
            const state = get();
            if (state.user?.email) {
              set((state) => ({
                user: {
                  ...(state.user || {}),
                  questionnaireData: data,
                },
              }));
            } else {
              // אם אין משתמש, רק נשמור ב-AsyncStorage
              logger.info(
                "Store",
                "No user found, saving questionnaire data to AsyncStorage only"
              );
            }
          } catch (fallbackError) {
            logger.error("Store", "Fallback save also failed", fallbackError);
          }
        }
      },

      // עדכון חלקי של נתוני השאלון החכם
      // Partial update of smart questionnaire data
      updateSmartQuestionnaireData: (updates) => {
        set((state) => {
          if (!state.user) return state;
          const existing = state.user.questionnaireData || {
            answers: {},
            metadata: {},
          };
          const merged: QuestionnaireData = {
            answers: {
              ...(existing.answers || {}),
              ...(updates.answers || {}),
            },
            metadata: {
              ...(existing.metadata || {}),
              ...(updates.metadata || {}),
            },
          };
          return {
            ...state,
            user: { ...state.user, questionnaireData: merged },
          };
        });
        get().scheduleServerSync("updateSmartQuestionnaireData");
      },

      // קבלת תשובות השאלון החכם
      // Get smart questionnaire answers
      getSmartQuestionnaireAnswers: () => {
        const state = get();
        return state.user?.questionnaireData?.answers || null;
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

        if (
          genderProfile?.adaptedWorkoutNames &&
          typeof genderProfile.adaptedWorkoutNames === "object"
        ) {
          const map = genderProfile.adaptedWorkoutNames as Record<
            string,
            string
          >;
          if (Object.prototype.hasOwnProperty.call(map, originalName)) {
            const val = map[originalName];
            if (typeof val === "string" && val.trim()) return val;
          }
        }
        return originalName;
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
        set((state) => {
          if (!state.user) return state;
          const base = state.user.trainingStats || {};
          const preferredWorkoutDays = prefs.workoutDays
            ? Array.from(
                { length: prefs.workoutDays },
                (_, i) =>
                  [
                    "sunday",
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                  ][i % 7]
              )
            : base.preferredWorkoutDays || [];
          const normalizedEquip =
            normalizeEquipment(prefs.equipment) || base.selectedEquipment || [];
          return {
            ...state,
            user: {
              ...state.user,
              trainingStats: {
                ...base,
                preferredWorkoutDays: preferredWorkoutDays.filter(
                  (d): d is string => typeof d === "string"
                ),
                selectedEquipment: normalizedEquip,
                fitnessGoals: (prefs.goals || base.fitnessGoals || []).filter(
                  Boolean
                ) as string[],
                currentFitnessLevel:
                  prefs.fitnessLevel || base.currentFitnessLevel || "beginner",
              },
            },
          } as Partial<UserStore>;
        });
        get().scheduleServerSync("updateTrainingPreferences");
      },

      // עדכון סטטיסטיקות אימון
      // Update training statistics
      updateTrainingStats: (stats) => {
        set((state) => {
          if (!state.user) return state;
          const base = state.user.trainingStats || {};
          return {
            ...state,
            user: { ...state.user, trainingStats: { ...base, ...stats } },
          };
        });
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
              user?.questionnaireData || user?.hasQuestionnaire
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
        if (user.questionnaireData && !user.questionnaireData.answers) {
          issues.push("Smart questionnaire data missing answers");
        }

        if (
          user.trainingStats?.selectedEquipment &&
          !Array.isArray(user.trainingStats.selectedEquipment)
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
          const hasSmartQuestionnaire = !!user.questionnaireData?.answers;

          const consistencyCheck = get().validateUserConsistency();

          return (
            hasBasicInfo && hasSmartQuestionnaire && consistencyCheck.isValid
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

        logger.info("UserStore", "Checking completion status with user data", {
          hasQuestionnaire: user?.hasQuestionnaire,
          hasCompletedAt: !!user?.questionnaireData?.metadata?.completedAt,
          hasQuestionnaireData: !!user?.questionnaireData,
          hasBasicInfo: !!(user?.id || user?.email || user?.name),
        });

        // בדיקה מדויקת יותר של השלמת השאלון - אם יש השדה hasQuestionnaire או completedAt או עצם קיום נתוני שאלון
        const hasSmartQuestionnaire = !!(
          user?.hasQuestionnaire ||
          user?.questionnaireData?.metadata?.completedAt ||
          (user?.questionnaireData &&
            Object.keys(user.questionnaireData).length > 0)
        );

        // אם יש שאלון מושלם, המשתמש נחשב כמוכן גם בלי נתונים בסיסיים (עבור זרימת Questionnaire->Register)
        // אבל אם יש ID, אז צריך גם נתונים בסיסיים
        const hasBasicInfo = !!(user?.id || user?.email || user?.name);

        // לזרימת Questionnaire->Register: אם יש שאלון מושלם אבל אין ID, המשתמש מוכן להרשמה
        // לזרימת רגילה: אם יש ID, צריך גם שאלון
        const isFullySetup = hasSmartQuestionnaire && hasBasicInfo;

        return {
          hasBasicInfo,
          hasSmartQuestionnaire,
          isFullySetup,
        };
      },

      // בדיקת מצב התחברות
      // Check login status
      isLoggedIn: async () => {
        const state = get();
        if (state.user === null) return false;

        // בדיקה אם המשתמש התנתק בעבר
        const loggedOut = await AsyncStorage.getItem("user_logged_out");
        return loggedOut !== "true";
      },

      // ניקוי מלא של כל נתוני המשתמש (כולל AsyncStorage)
      // Complete clearing of all user data (including AsyncStorage)
      clearAllUserData: async () => {
        await clearAllStorageData("clearAllUserData");
        set({ user: null });
      },

      // פונקציה לניקוי מלא לפיתוח (ללא התנתקות)
      // Complete data clearing for development (without logout)
      clearDataForFreshStart: async () => {
        await clearAllStorageData("clearDataForFreshStart");
        set({ user: null });
      },

      // ===========================================
      // 💳 ניהול מנוי ותקופת ניסיון - בודק גישה לתכנים
      // Subscription & Trial Management - checks access to content
      // ===========================================

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
                      trialDaysRemaining: CONSTANTS.SUBSCRIPTION.TRIAL_DAYS,
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
          const state = get();
          const now = Date.now();

          // 🚫 מניעת עדכונים תכופים מדי - מינימום 5 שניות בין עדכונים
          if (now - state.lastSubscriptionUpdate < 5000) {
            logger.debug("Subscription", "Update throttled - too frequent", {
              timeSinceLastUpdate: now - state.lastSubscriptionUpdate,
            });
            return;
          }

          set((state) => {
            if (!state.user) return state;
            const baseSub = state.user.subscription || {
              type: "free",
              isActive: false,
            };
            return {
              user: {
                ...state.user,
                subscription: {
                  ...baseSub,
                  ...updates,
                  lastTrialCheck: new Date().toISOString(),
                },
              },
              lastSubscriptionUpdate: now,
            } as Partial<UserStore>;
          });
          get().scheduleServerSync("updateSubscription");

          // ✅ הפחתת לוגים - רק ב-dev mode
          if (__DEV__) {
            logger.debug("Subscription", "Subscription updated", {
              updatedFields: Object.keys(updates || {}),
            });
          }
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

        // מניעת קריאות תכופות מדי - מחייבים מינימום 30 שניות בין בדיקות
        const now = Date.now();
        const lastCheck = subscription.lastTrialCheck
          ? new Date(subscription.lastTrialCheck).getTime()
          : 0;
        if (now - lastCheck < 30000) {
          // החזר את הערכים הקיימים מבלי לעדכן
          const currentDays = subscription.trialDaysRemaining ?? 0;
          return {
            isTrialActive:
              subscription.type === "trial" &&
              currentDays > 0 &&
              (subscription.isActive ?? false),
            daysRemaining: currentDays,
            hasExpired: currentDays === 0 && subscription.type === "trial",
          };
        }

        const nowDate = new Date();
        const registrationDate = new Date(
          subscription.registrationDate ||
            subscription.startDate ||
            new Date().toISOString()
        );
        const daysSinceRegistration = Math.floor(
          (nowDate.getTime() - registrationDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const daysRemaining = Math.max(0, 7 - daysSinceRegistration);
        const isTrialActive =
          subscription.type === "trial" &&
          daysRemaining > 0 &&
          (subscription.isActive ?? false);

        // עדכון סטטוס הניסיון אם צריך - מניעת עדכונים תכופים
        const currentDays = subscription.trialDaysRemaining ?? 0;
        const daysDiff = Math.abs(currentDays - daysRemaining);

        if (__DEV__ && daysDiff > 0.1) {
          console.warn("🔍 Trial days check:", {
            currentDays,
            calculatedDays: daysRemaining,
            diff: daysDiff,
            registrationDate: subscription.registrationDate,
          });
        }

        // עדכן רק אם ההפרש הוא יותר משעה (1/24 של יום)
        if (daysDiff >= 1 / 24) {
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
        const type = state.user?.subscription?.type || "free";
        return type as "trial" | "premium" | "free";
      },

      canAccessPremiumFeatures: () => {
        const state = get();
        const subscription = state.user?.subscription;

        if (!subscription) return false;

        if (subscription.type === "premium") return true;

        // חישוב ישיר ללא קריאה ל-checkTrialStatus למניעת לולאה
        if (subscription.type === "trial") {
          const now = new Date();
          const registrationDate = new Date(
            subscription.registrationDate ||
              subscription.startDate ||
              new Date().toISOString()
          );
          const daysSinceRegistration = Math.floor(
            (now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const daysRemaining = Math.max(0, 7 - daysSinceRegistration);
          return daysRemaining > 0 && (subscription.isActive ?? false);
        }

        return false;
      },

      startPremiumSubscription: () => {
        get().updateSubscription({
          type: "premium",
          isActive: true,
        });
      },

      // ===========================================
      // 🏋️ ניהול תוכניות אימון - מחליט איזו תוכנית להציג
      // Workout Plans Management - decides which plan to show
      // ===========================================

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

      // ===========================================
      // ✏️ עדכון תוכנית אימון ספציפית - משנה רק חלק מהתוכניות
      // Update Specific Workout Plan - changes only part of the plans
      // ===========================================
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

      // ===========================================
      // 🎯 בחירת התוכנית הנגישה - מחזירה את התוכנית הטובה ביותר לפי המנוי
      // Select Accessible Plan - returns the best plan based on subscription
      // ===========================================
      getAccessibleWorkoutPlan: () => {
        const state = get();
        const plans = state.user?.workoutplans as unknown as
          | {
              basicPlan?: { id: string; name: string } & Record<
                string,
                unknown
              >;
              smartPlan?: { id: string; name: string } & Record<
                string,
                unknown
              >;
            }
          | undefined;
        const canAccessPremium = get().canAccessPremiumFeatures();
        if (!plans) return null;
        if (canAccessPremium && plans.smartPlan)
          return plans.smartPlan as unknown as WorkoutPlan | null;
        return (plans.basicPlan as unknown as WorkoutPlan) || null;
      },

      // ===========================================
      // 👁️ האם להציג תוכן בטשטוש - רק אם אין גישה לפרימיום
      // Should Blur Premium Content - only if no premium access
      // ===========================================
      shouldBlurPremiumContent: () => {
        return !get().canAccessPremiumFeatures();
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // אל תשמור פונקציות
      // Don't save functions
      // שמירת חלק מהמצב בלבד: משתמש ודגל מסך פתיחה
      partialize: (state) => ({
        user: state.user,
        hasSeenWelcome: state.hasSeenWelcome,
      }),
      // טעינה אוטומטית בהפעלה
      // Auto-load on startup
      onRehydrateStorage: () => (state) => {
        logger.debug("Store", "User store rehydrated", {
          hasUser: !!state?.user?.email,
        });

        // סימון שההידרציה הסתיימה
        useUserStore.setState({ hydrated: true });

        // מצב פיתוח: ניקוי אוטומטי בכל כניסה חדשה (מושבת זמנית)
        // Development mode: Auto-clear on every fresh start (temporarily disabled)
        if (CONSTANTS.DEV.AUTO_CLEAR && __DEV__ && !state?.user?.email) {
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
export type { User } from "../core/types/user.types";
export type { QuestionnaireData } from "../features/questionnaire/types";

// =======================================
// 🎣 Hooks נוחים - כמו כלי עזר לשימוש בקומפוננטים
// Additional convenience hooks
// =======================================

export const useUser = () => useUserStore((state) => state.user);
export const useIsLoggedIn = () => useUserStore((state) => state.user !== null);

// Thin selector for normalized equipment (for workout generation)
export const useUserEquipment = () => {
  const user = useUserStore((state) => state.user);

  // Try to get equipment from multiple possible sources
  const equipment = user?.trainingStats?.selectedEquipment || [];

  return Array.isArray(equipment)
    ? normalizeEquipment(equipment as string[])
    : [];
};

// useUserPreferences moved to hooks/useUserPreferences.ts for advanced smart features
export const useQuestionnaireCompleted = () =>
  useUserStore((state) => state.user?.questionnaireData?.answers !== undefined);

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
    hasQuestionnaire: !!user?.questionnaireData,
  };
};

// ==============================
// 🔄 סנכרון עם השרת - שולח נתונים רק אם יש מנוי בתשלום
// Server sync implementation
// ==============================
// זה שולח את הנתונים שלך לשרת כדי לשמור אותם בענן
// This sends your data to the server to save it in the cloud
// - עובד רק עם מנוי פרימיום
// - שולח רק שינויים חדשים
// - מונע שליחה כפולה עם טיימר מיוחד
let __userSyncTimer: ReturnType<typeof setTimeout> | null = null;

useUserStore.setState((prev) => ({
  ...prev,

  // ===========================================
  // 📥 טעינת נתונים מהשרת - מושך את הנתונים העדכניים ביותר
  // Load data from server - pulls the latest data
  // ===========================================
  refreshFromServer: async () => {
    try {
      const state = useUserStore.getState();
      const u = state.user;
      if (!u?.id || typeof u.id !== "string") return;
      if (u.id.startsWith("demo_")) return;
      const serverUser = await userApi.getById(u.id);
      // שמירה על שדות לוקליים שלא קיימים בשרת (אם יש)
      useUserStore.setState((curr) => {
        const base: Record<string, unknown> = {
          ...(serverUser as Record<string, unknown>),
        };
        return { ...curr, user: base as User };
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.warn("ServerSync", "userStore.refreshFromServer error", {
        error: msg,
      });
    }
  },

  // ===========================================
  // ⏰ תזמון סנכרון עם השרת - שולח שינויים בזמן הנכון
  // Schedule server sync - sends changes at the right time
  // ===========================================
  scheduleServerSync: (reason?: string) => {
    try {
      if (__userSyncTimer) clearTimeout(__userSyncTimer);
      __userSyncTimer = setTimeout(async () => {
        const state = useUserStore.getState();
        const u = state.user;
        if (!u?.id || typeof u.id !== "string") return;
        if (u.id.startsWith("demo_")) return; // אל תסנכרן משתמש דמו

        // בדיקה אם יש גישה לפרימיום - רק אז מסנכרנים עם השרת
        const canAccessPremium = state.canAccessPremiumFeatures();
        if (!canAccessPremium) {
          // ✅ הפחתת לוגים - רק ב-dev mode
          if (__DEV__) {
            logger.debug("ServerSync", "לא מסנכרנים - אין גישה לפרימיום", {
              reason,
            });
          }
          return;
        }

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
      }, CONSTANTS.SYNC.DEBOUNCE_MS);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.warn("ServerSync", "scheduleServerSync outer catch", {
        error: msg,
      });
    }
  },
}));

// =======================================
// 💰 Hooks למערכת מנוי ותקופת ניסיון
// Subscription & Trial Hooks
// =======================================

/**
 * Hook לבדיקת סטטוס מנוי ותקופת ניסיון
 */
export const useSubscription = () => {
  const subscription = useUserStore((state) => state.user?.subscription);
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

  const trialStatus = useUserStore((state) => {
    const sub = state.user?.subscription;
    if (!sub)
      return { isTrialActive: false, daysRemaining: 0, hasExpired: false };

    // 🚫 השתמש בערכים הקיימים במנוי במקום לחשב מחדש
    const daysRemaining = sub.trialDaysRemaining ?? 0;
    return {
      isTrialActive: sub.type === "trial" && daysRemaining > 0 && sub.isActive,
      daysRemaining,
      hasExpired: daysRemaining === 0 && sub.type === "trial",
    };
  });

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
  return useUserStore((state) => {
    const sub = state.user?.subscription;
    if (!sub) return 0;

    // 🚫 השתמש בערך הקיים במנוי במקום לחשב מחדש
    return sub.trialDaysRemaining ?? 0;
  });
}; // =======================================
// 🚀 Hooks מתקדמים - לבדיקות מיוחדות ונגישות
// Advanced Hooks for Better UX
// =======================================
// כאן יש כלים מיוחדים לעזור למפתחים ולמשתמשים
// Here are special tools to help developers and users
// - בדיקת סטטוס נתונים
// - תמיכה בקורא מסך
// - טיפול בשגיאות בצורה בטוחה

/**
 * Hook מתקדם לניהול סטטוס נתונים
 * Advanced hook for managing data status
 *
 * זה בודק אם הנתונים של המשתמש תקינים ומוכנים לשימוש
 * This checks if the user's data is valid and ready to use
 * - בודק אם יש משתמש
 * - בודק אם הנתונים תקינים
 * - בודק אם הנתונים עקביים
 * - בודק אם ההתקנה הושלמה
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
 * Hook for accessibility and screen reader support
 *
 * עוזר למשתמשים עם מוגבלויות להשתמש באפליקציה
 * Helps users with disabilities use the app
 * - יוצר תוויות נגישות
 * - מכין טקסט לקורא מסך
 * - מדווח על פעולות למשתמש
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
 * Advanced hook for error handling
 *
 * עוזר לטפל בשגיאות בצורה בטוחה ולא לקרוס את האפליקציה
 * Helps handle errors safely without crashing the app
 * - מטפל בשגיאות אחסון
 * - מריץ פעולות בצורה בטוחה
 * - מחזיר ערך ברירת מחדל אם יש שגיאה
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
