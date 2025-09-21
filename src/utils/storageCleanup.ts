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
 * בדיקה אם key מוגן ממחיקה
 */
const isProtectedKey = (key: string): boolean => {
  return PROTECTED_KEYS.some(
    (protectedKey) => key === protectedKey || key.includes(protectedKey)
  );
};

/**
 * בדיקה אם key הוא זמני לפי דפוסים ידועים
 */
const isTemporaryKey = (key: string): boolean => {
  return CLEANUP_PATTERNS.some((pattern) => key.includes(pattern));
};

export class StorageCleanup {
  /**
   * בדיקה בסיסית אם storage מתקרב לגבולות
   */
  static async isStorageFull(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // Simple heuristic - if more than 100 keys, consider cleanup needed
      return keys.length > 100;
    } catch {
      return true; // Assume cleanup needed on error
    }
  }

  /**
   * ניקוי נתונים זמניים וישנים
   */
  static async cleanOldData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(
        (key) => !isProtectedKey(key) && isTemporaryKey(key)
      );

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
        // הסרנו לוג מיותר שהיה מופיע בכל הפעלה
      }
    } catch (error) {
      logger.error("StorageCleanup", "Error cleaning old data", error);
    }
  }

  /**
   * ניקוי חירום - אותה לוגיקה כמו cleanOldData
   * (נשמר לתאימות עם useAppInitialization)
   */
  static async emergencyCleanup(): Promise<void> {
    return this.cleanOldData();
  }
}

export default StorageCleanup;
