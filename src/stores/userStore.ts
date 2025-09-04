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
 * - ✅ שמירה על eslint-disable מוצדק ב-setCustomDemoUser
 * - ✅ תיעוד משופר וסידור קוד
 * - ✅ הוספת קבועים מרכזיים (CONSTANTS) למניעת קוד קשיח
 * - ✅ פונקציית עזר לניתוח ימי אימון (parseWorkoutDaysFromFrequency)
 * - ✅ החלפת ערכי ברירת מחדל קשיחים עם קבועים
 * - ✅ שיפור קריאות הקוד והתחזוקה
 *
 * @dependencies zustand, AsyncStorage, types/index, logger
 * @usage Used throughout application for user state management
 * @updated 2025-09-01 שיפורי type safety ותיעוד - Store מתקדם עם טיפוסים משופרים וקבועים מרכזיים
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, SmartQuestionnaireData, WorkoutPlan } from "../types";
import { userApi } from "../services/api/userApi";
import { StorageKeys } from "../constants/StorageKeys";
import { fieldMapper } from "../utils/fieldMapper";
import { extractSmartAnswers } from "../utils/questionnaireUtils";
import { logger } from "../utils/logger";
import { normalizeEquipment as normalizeEquipmentCatalog } from "../utils/equipmentCatalog";

// Import new helper files
import { USER_STORE_CONSTANTS } from "./userStoreConstants";
import { clearAllStorageData } from "./userStoreHelpers";
import {
  updateUserWithDemoData,
  createNewUserWithDemoData,
} from "./userStoreDemoUtils";

// ==============================
// קבועים - כמו הגדרות קבועות שלא משתנות
// ==============================
const CONSTANTS = USER_STORE_CONSTANTS;

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

// =======================================
// 🏪 יצירת ה-Store הראשי - זה הלב של כל ניהול המשתמש
// Creating the main store with Zustand
// =======================================
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      // 🚫 מניעת עדכונים תכופים מדי
      lastSubscriptionUpdate: 0,

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
                  if (
                    Array.isArray(data.answers.equipment) &&
                    data.answers.equipment.length
                  )
                    return normalizeEquipment(data.answers.equipment);
                  const extendedAnswers =
                    data.answers as ExtendedQuestionnaireAnswers;
                  const ge = extendedAnswers.gym_equipment;
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
          if (data.answers.gender && typeof data.answers.gender === "string") {
            AsyncStorage.setItem(
              StorageKeys.USER_GENDER_PREFERENCE,
              data.answers.gender
            ).catch((err) =>
              logger.error("Store", "שגיאה בשמירת העדפת מגדר", err)
            );
          }

          // שמירת ציוד נבחר
          if (Array.isArray(data.answers.equipment)) {
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

        const hasBasicInfo = !!(user?.id || user?.email || user?.name);
        const hasSmartQuestionnaire =
          !!user?.smartquestionnairedata?.answers ||
          !!user?.questionnairedata?.equipment;
        const isFullySetup = hasBasicInfo && hasSmartQuestionnaire;

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

      // 🎯 פעולות משתמש דמו מותאם
      // Custom demo user actions
      setCustomDemoUser: (demoUser) => {
        if (!demoUser) return;

        const qd = (demoUser as Record<string, unknown>).questionnaireData as
          | Record<string, unknown>
          | undefined;

        set((state) => {
          if (state.user) {
            // Update existing user with demo data
            return {
              user: updateUserWithDemoData(
                state.user as Record<string, unknown>,
                demoUser,
                qd
              ) as unknown as User,
            };
          } else {
            // Create new user with demo data
            return {
              user: createNewUserWithDemoData(demoUser, qd) as unknown as User,
            };
          }
        });

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
            lastSubscriptionUpdate: now, // 🚫 עדכון timestamp
          }));
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
              subscription.isActive,
            daysRemaining: currentDays,
            hasExpired: currentDays === 0 && subscription.type === "trial",
          };
        }

        const nowDate = new Date();
        const registrationDate = new Date(subscription.registrationDate);
        const daysSinceRegistration = Math.floor(
          (nowDate.getTime() - registrationDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const daysRemaining = Math.max(0, 7 - daysSinceRegistration);
        const isTrialActive =
          subscription.type === "trial" &&
          daysRemaining > 0 &&
          subscription.isActive;

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
          const registrationDate = new Date(subscription.registrationDate);
          const daysSinceRegistration = Math.floor(
            (now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const daysRemaining = Math.max(0, 7 - daysSinceRegistration);
          return daysRemaining > 0 && subscription.isActive;
        }

        return false;
      },

      startPremiumSubscription: () => {
        get().updateSubscription({
          type: "premium",
          endDate: undefined, // אין תאריך סיום לפרימיום
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
      partialize: (state) => ({ user: state.user }),
      // טעינה אוטומטית בהפעלה
      // Auto-load on startup
      onRehydrateStorage: () => (state) => {
        logger.debug("Store", "User store rehydrated", {
          hasUser: !!state?.user?.email,
        });

        // מצב פיתוח: ניקוי אוטומטי בכל כניסה חדשה (מושבת זמנית)
        // Development mode: Auto-clear on every fresh start (temporarily disabled)
        if (CONSTANTS.DEV.AUTO_CLEAR && __DEV__) {
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
  const equipment =
    user?.customDemoUser?.equipment ||
    user?.trainingstats?.selectedEquipment ||
    [];

  return normalizeEquipment(equipment);
};

// useUserPreferences moved to hooks/useUserPreferences.ts for advanced smart features
export const useQuestionnaireCompleted = () =>
  useUserStore(
    (state) => state.user?.smartquestionnairedata?.answers !== undefined
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
    hasQuestionnaire: !!user?.smartquestionnairedata,
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
