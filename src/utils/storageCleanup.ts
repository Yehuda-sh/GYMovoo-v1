/**
 * @file src/utils/storageCleanup.ts
 * @description ניקוי זיכרון ומסד נתונים מלא
 * English: Storage cleanup utility for full database
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

interface StorageSize {
  totalKeys: number;
  estimatedSize: number; // KB
  largestItems: Array<{ key: string; size: number }>;
}

export class StorageCleanup {
  /**
   * בדיקת גודל אחסון
   * Check storage size
   */
  static async getStorageInfo(): Promise<StorageSize> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items: Array<{ key: string; size: number }> = [];
      let totalSize = 0;

      // בדיקת בטיחות - אם יש יותר מדי מפתחות, לא לעבור על כולם
      const keysToCheck = keys.length > 500 ? keys.slice(0, 500) : keys;

      for (const key of keysToCheck) {
        try {
          const value = await AsyncStorage.getItem(key);
          // חישוב גודל ב-KB ללא Blob (לא זמין ב-React Native)
          const size = value ? (value.length * 2) / 1024 : 0; // KB (UTF-16, כל תו = 2 bytes)
          items.push({ key, size });
          totalSize += size;
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
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return { totalKeys: 0, estimatedSize: 0, largestItems: [] };
    }
  }

  /**
   * ניקוי נתונים ישנים
   * Clean old data
   */
  static async cleanOldData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove: string[] = [];
      const now = new Date().getTime();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000; // שבוע אחורה

      for (const key of keys) {
        try {
          // נתונים ישנים לניקוי
          if (
            key.startsWith("workout_draft_") ||
            key.startsWith("workout_time_") ||
            key.startsWith("temp_") ||
            key.includes("cache_")
          ) {
            const item = await AsyncStorage.getItem(key);
            if (item) {
              const data = JSON.parse(item);
              const lastSaved =
                data.lastSaved || data.completedAt || data.createdAt;

              if (lastSaved && new Date(lastSaved).getTime() < oneWeekAgo) {
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
          console.log(`🗑️ Cleaned ${batch.length} old items`);
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
        `✅ Storage cleanup complete - removed ${keysToRemove.length} items`
      );
    } catch (error) {
      console.error("Error cleaning storage:", error);
    }
  }

  /**
   * ניקוי חירום - מחק כל מה שלא חיוני
   * Emergency cleanup - remove non-essential data
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
          key.includes("logs_")
      );

      if (nonEssentialKeys.length > 0) {
        try {
          await AsyncStorage.multiRemove(nonEssentialKeys);
          console.log(
            `🚨 Emergency cleanup - removed ${nonEssentialKeys.length} items`
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
            `🚨 Emergency cleanup - removed ${removedCount}/${nonEssentialKeys.length} items`
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
   * הדפסת מידע על מצב האחסון (לפיתוח)
   * Print storage status info (for development)
   */
  static async logStorageStatus(): Promise<void> {
    try {
      const info = await this.getStorageInfo();
      console.log("📊 Storage Status:");
      console.log(`  Total keys: ${info.totalKeys}`);
      console.log(`  Estimated size: ${info.estimatedSize.toFixed(2)} KB`);
      console.log(`  Is full: ${await this.isStorageFull()}`);

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
}
