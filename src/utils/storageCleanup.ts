/**
 * @file src/utils/storageCleanup.ts
 * @description ניקוי זיכרון ומסד נתונים מלא עם תמיכה בנתוני שאלון חכם
 * English: Storage cleanup utility for full database with smart questionnaire support
 * @updated 2025-07-30 תמיכה בניקוי נתוני השאלון החכם והתאמת המגדר
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

export class StorageCleanup {
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
      const keysToCheck = keys.length > 500 ? keys.slice(0, 500) : keys;

      for (const key of keysToCheck) {
        try {
          const value = await AsyncStorage.getItem(key);
          // חישוב גודל ב-KB ללא Blob (לא זמין ב-React Native)
          const size = value ? (value.length * 2) / 1024 : 0; // KB (UTF-16, כל תו = 2 bytes)
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
        } catch (error) {
          console.warn(`Error reading key ${key}:`, error);
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

      for (const key of keys) {
        try {
          // נתונים ישנים לניקוי - כולל נתוני שאלון חכם
          if (
            key.startsWith("workout_draft_") ||
            key.startsWith("workout_time_") ||
            key.startsWith("temp_") ||
            key.includes("cache_") ||
            key.startsWith("questionnaire_draft_") || // טיוטות שאלון ישנות
            key.startsWith("gender_adaptation_temp_") || // נתוני התאמת מגדר זמניים
            key.includes("smart_questionnaire_session_") // סשן שאלון ישן
          ) {
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
              } catch (parseError) {
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
          console.log(
            `🗑️ Cleaned ${batch.length} old items (including questionnaire data)`
          );
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

      console.log(
        `✅ Storage cleanup complete - removed ${keysToRemove.length} items (including smart questionnaire data)`
      );
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
      const nonEssentialKeys = keys.filter(
        (key) =>
          key.startsWith("workout_draft_") ||
          key.startsWith("workout_time_") ||
          key.startsWith("cache_") ||
          key.startsWith("temp_") ||
          key.includes("analytics_") ||
          key.includes("logs_") ||
          // נתוני שאלון זמניים ולא חיוניים
          key.startsWith("questionnaire_draft_") ||
          key.startsWith("gender_adaptation_temp_") ||
          key.includes("smart_questionnaire_session_") ||
          key.includes("questionnaire_analytics_") ||
          key.includes("gender_test_data_")
      );

      if (nonEssentialKeys.length > 0) {
        try {
          await AsyncStorage.multiRemove(nonEssentialKeys);
          console.log(
            `🚨 Emergency cleanup - removed ${nonEssentialKeys.length} items (including questionnaire temps)`
          );
        } catch (error) {
          console.warn(
            "Failed batch emergency cleanup, trying individually:",
            error
          );
          // נסה למחוק פריט אחד בכל פעם
          let removedCount = 0;
          for (const key of nonEssentialKeys) {
            try {
              await AsyncStorage.removeItem(key);
              removedCount++;
            } catch (singleError) {
              console.warn(`Failed to remove ${key}:`, singleError);
            }
          }
          console.log(
            `🚨 Emergency cleanup - removed ${removedCount}/${nonEssentialKeys.length} items (including questionnaire temps)`
          );
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
      return info.totalKeys > 1000 || info.estimatedSize > 50 * 1024;
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
      console.log("📊 Storage Status:");
      console.log(`  Total keys: ${info.totalKeys}`);
      console.log(`  Estimated size: ${info.estimatedSize.toFixed(2)} KB`);
      console.log(`  Is full: ${await this.isStorageFull()}`);
      console.log(`  🧠 Smart Questionnaire keys: ${info.questionnaireKeys}`);
      console.log(`  👥 Gender adaptation keys: ${info.genderAdaptationKeys}`);
      console.log(
        `  ⚙️ User preferences size: ${info.userPreferencesSize.toFixed(2)} KB`
      );

      if (info.largestItems.length > 0) {
        console.log("  Largest items:");
        info.largestItems.slice(0, 5).forEach((item, index) => {
          console.log(
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
      const questionnaireKeys = keys.filter(
        (key) =>
          key.includes("questionnaire_draft_") ||
          key.includes("smart_questionnaire_session_") ||
          key.includes("questionnaire_analytics_") ||
          key.includes("gender_test_data_")
      );

      if (questionnaireKeys.length > 0) {
        await AsyncStorage.multiRemove(questionnaireKeys);
        console.log(
          `🧠 Cleaned ${questionnaireKeys.length} questionnaire data items`
        );
      }
    } catch (error) {
      console.error("Error cleaning questionnaire data:", error);
    }
  }

  /**
   * גיבוי נתוני שאלון חכם חיוניים
   * Backup essential smart questionnaire data
   */
  static async backupEssentialQuestionnaireData(): Promise<{
    [key: string]: any;
  } | null> {
    try {
      const essentialKeys = [
        "userPreferences",
        "smart_questionnaire_results",
        "user_gender_preference",
        "selected_equipment",
      ];

      const backupData: { [key: string]: any } = {};

      for (const key of essentialKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            backupData[key] = JSON.parse(value);
          }
        } catch (error) {
          console.warn(`Failed to backup ${key}:`, error);
        }
      }

      console.log(
        `💾 Backed up ${Object.keys(backupData).length} essential questionnaire items`
      );
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
  static async restoreEssentialQuestionnaireData(backupData: {
    [key: string]: any;
  }): Promise<void> {
    try {
      let restoredCount = 0;

      for (const [key, value] of Object.entries(backupData)) {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value));
          restoredCount++;
        } catch (error) {
          console.warn(`Failed to restore ${key}:`, error);
        }
      }

      console.log(`♻️ Restored ${restoredCount} essential questionnaire items`);
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
        console.warn("❌ Missing essential questionnaire data");
        return false;
      }

      const prefs = JSON.parse(userPrefs);
      const results = JSON.parse(questionnaireResults);

      // בדיקות בסיסיות
      const hasGender = prefs.gender || results.gender;
      const hasEquipment = prefs.equipment && prefs.equipment.length > 0;
      const hasFitnessLevel = prefs.fitnessLevel || results.fitnessLevel;

      if (!hasGender || !hasEquipment || !hasFitnessLevel) {
        console.warn("❌ Incomplete questionnaire data");
        return false;
      }

      console.log("✅ Questionnaire data is valid");
      return true;
    } catch (error) {
      console.error("Error validating questionnaire data:", error);
      return false;
    }
  }
}
