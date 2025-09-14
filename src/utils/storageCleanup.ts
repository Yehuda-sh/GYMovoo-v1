/**
 * @file src/utils/storageCleanup.ts
 * @description יוטיליטי בסיסי לניקוי storage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";

/**
 * Keys חשובים שאסור למחוק
 */
const PROTECTED_KEYS = [
  "user",
  "userStore",
  "settings",
  "preferences",
  "subscription",
  "workoutplans",
  "questionnaire",
  "questionnaireData",
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
    (protectedKey) => key.includes(protectedKey) || key.startsWith(protectedKey)
  );
};

export class StorageCleanup {
  /**
   * בדיקה בסיסית אם storage מתקרב לגבולות
   */
  static async isStorageFull(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // Simple check - if more than 500 keys, consider it full
      return keys.length > 500;
    } catch {
      return true; // Assume full on error
    }
  }

  /**
   * ניקוי נתונים ישנים בסיסי
   */
  static async cleanOldData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove: string[] = [];

      for (const key of keys) {
        // Skip protected keys
        if (isProtectedKey(key)) continue;

        // Remove keys matching cleanup patterns
        if (CLEANUP_PATTERNS.some((pattern) => key.includes(pattern))) {
          keysToRemove.push(key);
        }
      }

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
        logger.info(
          "StorageCleanup",
          `Cleaned ${keysToRemove.length} old data items`
        );
      }
    } catch (error) {
      logger.error("StorageCleanup", "Error cleaning old data", error);
    }
  }

  /**
   * ניקוי חירום - הסרת נתונים לא חיוניים
   */
  static async emergencyCleanup(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove: string[] = [];

      for (const key of keys) {
        // Skip protected keys
        if (isProtectedKey(key)) continue;

        // Remove temporary and cache data using existing patterns
        if (CLEANUP_PATTERNS.some((pattern) => key.includes(pattern))) {
          keysToRemove.push(key);
        }
      }

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
        logger.info(
          "StorageCleanup",
          `Emergency cleanup removed ${keysToRemove.length} items`
        );
      }
    } catch (error) {
      logger.error("StorageCleanup", "Error in emergency cleanup", error);
    }
  }
}

export default StorageCleanup;
