/**
 * @file src/utils/storageCleanup.ts
 * @description ניקוי זיכרון ומסד נתונים מלא עם תמיכה בנתוני שאלון חכם
 * English: Storage cleanup utility for full database with smart questionnaire support
 *
 * @features
 * - ניטור גודל אחסון וזיהוי מפתחות גדולים
 * - ניקוי אוטומטי של נתונים זמניים ישנים
 * - תמיכה מיוחדת בנתוני שאלון חכם והתאמת מגדר
 * - ניקוי חירום בזמן אחסון מלא
 * - גיבוי ושחזור נתונים חיוניים
 *
 * @usage Used in App.tsx for automatic storage management on startup
 * @updated 2025-08-11 עדכון תיעוד ושיפור ביצועים
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

interface StorageSize {
  totalKeys: number;
  estimatedSize: number; // KB
  largestItems: Array<{ key: string; size: number }>;
  questionnaireKeys: number; // מספר מפתחות שאלון
  genderAdaptationKeys: number; // מפתחות התאמת מגדר
  userPreferencesSize: number; // גודל העדפות משתמש
}

interface BackupData {
  [key: string]: unknown;
}

export class StorageCleanup {
  // Constants for storage limits
  private static readonly MAX_KEYS_THRESHOLD = 1000;
  private static readonly MAX_SIZE_THRESHOLD_KB = 50 * 1024; // 50MB in KB
  private static readonly MAX_KEYS_TO_CHECK = 500; // Safety limit for key checking
  private static readonly BYTES_PER_CHAR = 2; // UTF-16 encoding

  /**
   * בדיקת גודל אחסון עם תמיכה בנתוני שאלון חכם
   * Check storage size with smart questionnaire support
   */
  static async getStorageInfo(): Promise<StorageSize> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items: Array<{ key: string; size: number }> = [];
      let totalSize = 0;
      let questionnaireKeys = 0;
      let genderAdaptationKeys = 0;
      let userPreferencesSize = 0;

      // בדיקת בטיחות - אם יש יותר מדי מפתחות, לא לעבור על כולם
      const keysToCheck =
        keys.length > this.MAX_KEYS_TO_CHECK
          ? keys.slice(0, this.MAX_KEYS_TO_CHECK)
          : keys;

      for (const key of keysToCheck) {
        try {
          const value = await AsyncStorage.getItem(key);
          // חישוב גודל ב-KB ללא Blob (לא זמין ב-React Native)
          const size = value ? (value.length * this.BYTES_PER_CHAR) / 1024 : 0; // KB (UTF-16, כל תו = 2 bytes)
          items.push({ key, size });
          totalSize += size;

          // ספירת מפתחות מיוחדים
          if (
            key.includes("questionnaire") ||
            key.includes("smart_questionnaire")
          ) {
            questionnaireKeys++;
          }
          if (key.includes("gender") || key.includes("adaptation")) {
            genderAdaptationKeys++;
          }
          if (key === "userPreferences" || key.includes("user_preferences")) {
            userPreferencesSize += size;
          }
        } catch {
          // Log warning but continue processing
        }
      }

      // מיון לפי גודל
      items.sort((a, b) => b.size - a.size);

      return {
        totalKeys: keys.length,
        estimatedSize: Math.round(totalSize * 100) / 100, // עיגול ל-2 ספרות אחרי הנקודה
        largestItems: items.slice(0, 10), // 10 הפריטים הגדולים ביותר
        questionnaireKeys,
        genderAdaptationKeys,
        userPreferencesSize: Math.round(userPreferencesSize * 100) / 100,
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return {
        totalKeys: 0,
        estimatedSize: 0,
        largestItems: [],
        questionnaireKeys: 0,
        genderAdaptationKeys: 0,
        userPreferencesSize: 0,
      };
    }
  }

  /**
   * ניקוי נתונים ישנים עם תמיכה בנתוני שאלון חכם
   * Clean old data with smart questionnaire support
   */
  static async cleanOldData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove: string[] = [];
      const now = new Date().getTime();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000; // שבוע אחורה

      // Define old data patterns for cleanup
      const oldDataPatterns = [
        "workout_draft_",
        "workout_time_",
        "temp_",
        "cache_",
        "questionnaire_draft_",
        "gender_adaptation_temp_",
        "smart_questionnaire_session_",
      ];

      for (const key of keys) {
        try {
          // Check if key matches old data patterns
          const isOldDataKey =
            oldDataPatterns.some((pattern) => key.startsWith(pattern)) ||
            key.includes("cache_") ||
            key.includes("smart_questionnaire_session_");

          if (isOldDataKey) {
            const item = await AsyncStorage.getItem(key);
            if (item) {
              try {
                const data = JSON.parse(item);
                const lastSaved =
                  data.lastSaved ||
                  data.completedAt ||
                  data.createdAt ||
                  data.timestamp;

                if (lastSaved && new Date(lastSaved).getTime() < oneWeekAgo) {
                  keysToRemove.push(key);
                }
              } catch {
                // אם לא ניתן לפרס, אולי זה נתון ישן - סמן למחיקה
                keysToRemove.push(key);
              }
            }
          }
        } catch {
          // אם יש שגיאה בקריאה, סמן למחיקה
          keysToRemove.push(key);
        }
      }

      // מחק בחבורות של 10 עם הגנה
      for (let i = 0; i < keysToRemove.length; i += 10) {
        const batch = keysToRemove.slice(i, i + 10);
        try {
          await AsyncStorage.multiRemove(batch);
        } catch (error) {
          console.warn(`Failed to remove batch ${i / 10 + 1}:`, error);
          // נסה למחוק פריט אחד בכל פעם
          for (const key of batch) {
            try {
              await AsyncStorage.removeItem(key);
            } catch (singleError) {
              console.warn(`Failed to remove ${key}:`, singleError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error cleaning storage:", error);
    }
  }

  /**
   * ניקוי חירום - מחק כל מה שלא חיוני כולל נתוני שאלון זמניים
   * Emergency cleanup - remove non-essential data including temporary questionnaire data
   */
  static async emergencyCleanup(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();

      // Define non-essential key patterns
      const nonEssentialPatterns = [
        "workout_draft_",
        "workout_time_",
        "cache_",
        "temp_",
        "analytics_",
        "logs_",
        "questionnaire_draft_",
        "gender_adaptation_temp_",
        "smart_questionnaire_session_",
        "questionnaire_analytics_",
        "gender_test_data_",
      ];

      const nonEssentialKeys = keys.filter((key) =>
        nonEssentialPatterns.some(
          (pattern) => key.startsWith(pattern) || key.includes(pattern)
        )
      );

      if (nonEssentialKeys.length > 0) {
        try {
          await AsyncStorage.multiRemove(nonEssentialKeys);
        } catch (error) {
          console.warn(
            "Failed batch emergency cleanup, trying individually:",
            error
          );
          // נסה למחוק פריט אחד בכל פעם
          for (const key of nonEssentialKeys) {
            try {
              await AsyncStorage.removeItem(key);
            } catch (singleError) {
              console.warn(`Failed to remove ${key}:`, singleError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in emergency cleanup:", error);
    }
  }

  /**
   * בדיקה אם הזיכרון מלא
   * Check if storage is full
   */
  static async isStorageFull(): Promise<boolean> {
    try {
      const info = await this.getStorageInfo();
      // אם יש יותר מ-1000 מפתחות או יותר מ-50MB
      return (
        info.totalKeys > this.MAX_KEYS_THRESHOLD ||
        info.estimatedSize > this.MAX_SIZE_THRESHOLD_KB
      );
    } catch {
      return true; // בטוח יותר להניח שמלא
    }
  }

  /**
   * הדפסת מידע על מצב האחסון כולל נתוני שאלון חכם (לפיתוח)
   * Print storage status info including smart questionnaire data (for development)
   */
  static async logStorageStatus(): Promise<void> {
    try {
      const info = await this.getStorageInfo();
      console.warn("📊 Storage Status:");
      console.warn(`  Total keys: ${info.totalKeys}`);
      console.warn(`  Estimated size: ${info.estimatedSize.toFixed(2)} KB`);
      console.warn(`  Is full: ${await this.isStorageFull()}`);
      console.warn(`  🧠 Smart Questionnaire keys: ${info.questionnaireKeys}`);
      console.warn(`  👥 Gender adaptation keys: ${info.genderAdaptationKeys}`);
      console.warn(
        `  ⚙️ User preferences size: ${info.userPreferencesSize.toFixed(2)} KB`
      );

      if (info.largestItems.length > 0) {
        console.warn("  Largest items:");
        info.largestItems.slice(0, 5).forEach((item, index) => {
          console.warn(
            `    ${index + 1}. ${item.key}: ${item.size.toFixed(2)} KB`
          );
        });
      }
    } catch (error) {
      console.error("Failed to get storage status:", error);
    }
  }

  /**
   * פונקציות חדשות לשאלון חכם
   * New functions for smart questionnaire
   */

  /**
   * ניקוי מיוחד לנתוני שאלון חכם
   * Special cleanup for smart questionnaire data
   */
  static async cleanQuestionnaireData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const questionnairePatterns = [
        "questionnaire_draft_",
        "smart_questionnaire_session_",
        "questionnaire_analytics_",
        "gender_test_data_",
      ];

      const questionnaireKeys = keys.filter((key) =>
        questionnairePatterns.some((pattern) => key.includes(pattern))
      );

      if (questionnaireKeys.length > 0) {
        await AsyncStorage.multiRemove(questionnaireKeys);
      }
    } catch (error) {
      console.error("Error cleaning questionnaire data:", error);
    }
  }

  /**
   * גיבוי נתוני שאלון חכם חיוניים
   * Backup essential smart questionnaire data
   */
  static async backupEssentialQuestionnaireData(): Promise<BackupData | null> {
    try {
      const essentialKeys = [
        "userPreferences",
        "smart_questionnaire_results",
        "user_gender_preference",
        "selected_equipment",
      ];

      const backupData: BackupData = {};

      for (const key of essentialKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            backupData[key] = JSON.parse(value);
          }
        } catch {
          // Handle backup error for specific key
        }
      }

      return backupData;
    } catch (error) {
      console.error("Error backing up questionnaire data:", error);
      return null;
    }
  }

  /**
   * שחזור נתוני שאלון חכם חיוניים
   * Restore essential smart questionnaire data
   */
  static async restoreEssentialQuestionnaireData(
    backupData: BackupData
  ): Promise<void> {
    try {
      for (const [key, value] of Object.entries(backupData)) {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch {
          // Handle restore error for specific key
        }
      }
    } catch (error) {
      console.error("Error restoring questionnaire data:", error);
    }
  }

  /**
   * בדיקה האם נתוני השאלון החכם תקינים
   * Check if smart questionnaire data is valid
   */
  static async validateQuestionnaireData(): Promise<boolean> {
    try {
      const userPrefs = await AsyncStorage.getItem("userPreferences");
      const questionnaireResults = await AsyncStorage.getItem(
        "smart_questionnaire_results"
      );

      if (!userPrefs || !questionnaireResults) {
        return false;
      }

      const prefs = JSON.parse(userPrefs);
      const results = JSON.parse(questionnaireResults);

      // בדיקות בסיסיות
      const hasGender = prefs.gender || results.gender;
      const hasEquipment = prefs.equipment && prefs.equipment.length > 0;
      const hasFitnessLevel = prefs.fitnessLevel || results.fitnessLevel;

      if (!hasGender || !hasEquipment || !hasFitnessLevel) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating questionnaire data:", error);
      return false;
    }
  }
}
