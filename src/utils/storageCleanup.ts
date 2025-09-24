/**
 * @file src/utils/storageCleanup.ts
 * @description יוטיליטי מעודכן לניקוי AsyncStorage - מותאם לפרויקט הנוכחי
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";
import { StorageKeys } from "../constants/StorageKeys";

/**
 * Keys מוגנים - על בסיס StorageKeys בפועל
 */
const PROTECTED_KEYS = [
  // Core user data
  "user-storage", // Zustand user store
  StorageKeys.USER_GENDER_PREFERENCE,
  StorageKeys.USER_PERSISTENCE,
  StorageKeys.LAST_USER_ID,
  StorageKeys.LAST_EMAIL,

  // Questionnaire data
  StorageKeys.SMART_QUESTIONNAIRE_RESULTS,
  StorageKeys.QUESTIONNAIRE_METADATA,
  StorageKeys.SELECTED_EQUIPMENT,
  StorageKeys.GENDER_ADAPTATION_DATA,

  // Workout data
  StorageKeys.WORKOUT_HISTORY,

  // Auth state
  StorageKeys.USER_LOGGED_OUT,
] as const;

/**
 * דפוסי ניקוי בסיסיים
 */
const CLEANUP_PATTERNS = [
  "temp_",
  "_temp",
  "cache_",
  "_cache",
  "draft_",
  "debug_",
  "test_",
] as const;

/**
 * התאמת namespace בטוחה:
 * נחשב "שייך ל-ns" אם key === ns או key מתחיל ב- `${ns}:` או `${ns}_`
 */
const isNamespacedMatch = (key: string, ns: string): boolean => {
  return key === ns || key.startsWith(`${ns}:`) || key.startsWith(`${ns}_`);
};

/**
 * בדיקה אם key מוגן ממחיקה (בטוחה יותר מ-includes)
 */
const isProtectedKey = (
  key: string,
  extraProtected: string[] = []
): boolean => {
  const protectedList = [...PROTECTED_KEYS, ...extraProtected];
  return protectedList.some((base) => isNamespacedMatch(key, String(base)));
};

/**
 * בדיקה אם key הוא זמני לפי דפוסים ידועים
 */
const isTemporaryKey = (key: string, extraPatterns: string[] = []): boolean => {
  const patterns = [...CLEANUP_PATTERNS, ...extraPatterns];
  return patterns.some((p) => key.includes(p));
};

type CleanupOptions = {
  dryRun?: boolean; // רק לדיווח – לא מוחק בפועל
  extraProtectedKeys?: string[];
  extraPatterns?: string[];
  batchSize?: number; // ברירת מחדל 50
};

const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

export class StorageCleanup {
  /**
   * בדיקה בסיסית אם storage מתקרב לגבולות
   */
  static async isStorageFull(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // היוריסטיקה פשוטה – מעל 100 מפתחות ננקה
      return keys.length > 100;
    } catch {
      return true; // ננקה אם יש שגיאה
    }
  }

  /**
   * ניקוי נתונים זמניים וישנים (עם אופציות קלות)
   */
  static async cleanOldData(options: CleanupOptions = {}): Promise<void> {
    const {
      dryRun = false,
      extraProtectedKeys = [],
      extraPatterns = [],
      batchSize = 50,
    } = options;

    try {
      const keys = await AsyncStorage.getAllKeys();

      const keysToRemove = keys.filter(
        (key) =>
          !isProtectedKey(key, extraProtectedKeys) &&
          isTemporaryKey(key, extraPatterns)
      );

      if (keysToRemove.length === 0) return;

      if (dryRun) {
        // דיווח בלבד – לא מוחקים
        logger.info("StorageCleanup", "Dry run – keys to remove", {
          count: keysToRemove.length,
          samples: keysToRemove.slice(0, 10),
        });
        return;
      }

      const batches = chunk(keysToRemove, Math.max(1, batchSize));
      for (const batch of batches) {
        await AsyncStorage.multiRemove(batch);
      }
      // לוג תמציתי
      logger.info("StorageCleanup", "Removed temporary keys", {
        totalRemoved: keysToRemove.length,
        batches: batches.length,
      });
    } catch (error) {
      logger.error("StorageCleanup", "Error cleaning old data", error);
    }
  }

  /**
   * ניקוי חירום - אותה לוגיקה כמו cleanOldData
   * (נשמר לתאימות עם useAppInitialization)
   */
  static async emergencyCleanup(options?: CleanupOptions): Promise<void> {
    return this.cleanOldData(options);
  }
}

export default StorageCleanup;
