/**
 * @file src/utils/storageCleanup.ts
 * @description יוטיליטי מתקדם לניקוי וניהול storage - Advanced Storage Cleanup Utility
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";

// ===============================================
// 📊 Configuration & Constants - הגדרות וקבועים
// ===============================================

interface StorageConfig {
  maxKeysThreshold: number;
  maxSizeThresholdKB: number;
  maxKeysToAnalyze: number;
  defaultBatchSize: number;
  emergencyBatchSize: number;
  defaultRetentionDays: number;
}

const DEFAULT_CONFIG: StorageConfig = {
  maxKeysThreshold: 1000,
  maxSizeThresholdKB: 50 * 1024, // 50MB
  maxKeysToAnalyze: 1000, // Increased from 500
  defaultBatchSize: 10,
  emergencyBatchSize: 20,
  defaultRetentionDays: 7,
};

/**
 * דפוסי ניקוי עם עדיפויות
 */
interface CleanupPattern {
  pattern: string;
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  retentionDays?: number;
}

const CLEANUP_PATTERNS: CleanupPattern[] = [
  {
    pattern: "temp_",
    priority: "critical",
    description: "Temporary files",
    retentionDays: 1,
  },
  {
    pattern: "_temp",
    priority: "critical",
    description: "Temporary suffixes",
    retentionDays: 1,
  },
  {
    pattern: "cache_",
    priority: "high",
    description: "Cache files",
    retentionDays: 3,
  },
  {
    pattern: "_cache",
    priority: "high",
    description: "Cache suffixes",
    retentionDays: 3,
  },
  {
    pattern: "draft_",
    priority: "medium",
    description: "Draft data",
    retentionDays: 7,
  },
  {
    pattern: "workout_draft_",
    priority: "medium",
    description: "Workout drafts",
    retentionDays: 7,
  },
  {
    pattern: "session_",
    priority: "medium",
    description: "Session data",
    retentionDays: 14,
  },
  {
    pattern: "analytics_",
    priority: "low",
    description: "Analytics data",
    retentionDays: 30,
  },
  {
    pattern: "logs_",
    priority: "low",
    description: "Log files",
    retentionDays: 7,
  },
  {
    pattern: "debug_",
    priority: "high",
    description: "Debug data",
    retentionDays: 1,
  },
  {
    pattern: "test_",
    priority: "critical",
    description: "Test data",
    retentionDays: 1,
  },
];

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
  "smartquestionnairedata",
] as const;

// ===============================================
// 📋 Interfaces - ממשקים
// ===============================================

interface StorageInfo {
  totalKeys: number;
  estimatedSizeKB: number;
  largestItems: Array<{ key: string; sizeKB: number }>;
  protectedKeys: number;
  cleanableKeys: number;
}

interface CleanupStats {
  removedKeys: number;
  freedSpaceKB: number;
  errors: number;
  skippedKeys: number;
  processedPatterns: string[];
}

interface CleanupOptions {
  retentionDays?: number;
  batchSize?: number;
  patterns?: string[];
  dryRun?: boolean;
  respectProtection?: boolean;
}

// ===============================================
// 🔧 Helper Functions - פונקציות עזר
// ===============================================

/**
 * בדיקה אם key מוגן ממחיקה
 */
const isProtectedKey = (key: string): boolean => {
  return PROTECTED_KEYS.some(
    (protectedKey) => key.includes(protectedKey) || key.startsWith(protectedKey)
  );
};

/**
 * חישוב גודל מדויק יותר של value
 */
const calculateValueSize = (value: string): number => {
  // More accurate size calculation - consider actual byte size
  return new Blob([value]).size / 1024; // KB
};

/**
 * מחיקה בbatches עם error handling משופר
 */
const removeKeysBatch = async (
  keys: string[],
  batchSize: number = DEFAULT_CONFIG.defaultBatchSize
): Promise<{ removed: number; errors: number }> => {
  let removed = 0;
  let errors = 0;

  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);
    try {
      await AsyncStorage.multiRemove(batch);
      removed += batch.length;
    } catch {
      // Fallback to individual removal
      for (const key of batch) {
        try {
          await AsyncStorage.removeItem(key);
          removed++;
        } catch {
          errors++;
        }
      }
    }
  }

  return { removed, errors };
};

export class StorageCleanup {
  private static config: StorageConfig = DEFAULT_CONFIG;

  /**
   * עדכון תצורת הניקוי
   */
  static updateConfig(newConfig: Partial<StorageConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * קבלת מידע מפורט על storage
   */
  static async getStorageInfo(): Promise<StorageInfo> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items: Array<{ key: string; sizeKB: number }> = [];
      let totalSize = 0;
      let protectedKeys = 0;
      let cleanableKeys = 0;

      // Check up to configured limit
      const keysToCheck = keys.slice(0, this.config.maxKeysToAnalyze);

      for (const key of keysToCheck) {
        try {
          const value = await AsyncStorage.getItem(key);
          const sizeKB = value ? calculateValueSize(value) : 0;
          items.push({ key, sizeKB });
          totalSize += sizeKB;

          // Count protected vs cleanable keys
          if (isProtectedKey(key)) {
            protectedKeys++;
          } else if (CLEANUP_PATTERNS.some((p) => key.includes(p.pattern))) {
            cleanableKeys++;
          }
        } catch {
          // Skip problematic keys
        }
      }

      // Sort by size (largest first)
      items.sort((a, b) => b.sizeKB - a.sizeKB);

      return {
        totalKeys: keys.length,
        estimatedSizeKB: Math.round(totalSize * 100) / 100,
        largestItems: items.slice(0, 10),
        protectedKeys,
        cleanableKeys,
      };
    } catch (error) {
      logger.error("StorageCleanup", "Error getting storage info", error);
      return {
        totalKeys: 0,
        estimatedSizeKB: 0,
        largestItems: [],
        protectedKeys: 0,
        cleanableKeys: 0,
      };
    }
  }

  /**
   * ניקוי נתונים ישנים עם הגדרות מתקדמות
   */
  static async cleanOldData(
    options: CleanupOptions = {}
  ): Promise<CleanupStats> {
    const {
      retentionDays = this.config.defaultRetentionDays,
      batchSize = this.config.defaultBatchSize,
      patterns = CLEANUP_PATTERNS.map((p) => p.pattern),
      dryRun = false,
      respectProtection = true,
    } = options;

    const stats: CleanupStats = {
      removedKeys: 0,
      freedSpaceKB: 0,
      errors: 0,
      skippedKeys: 0,
      processedPatterns: [],
    };

    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove: string[] = [];
      const now = Date.now();

      // Process keys based on patterns with priority
      const sortedPatterns = CLEANUP_PATTERNS.filter((p) =>
        patterns.includes(p.pattern)
      ).sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      for (const patternConfig of sortedPatterns) {
        const patternCutoffTime =
          now -
          (patternConfig.retentionDays || retentionDays) * 24 * 60 * 60 * 1000;
        stats.processedPatterns.push(patternConfig.pattern);

        for (const key of keys) {
          if (key.includes(patternConfig.pattern)) {
            // Skip protected keys if configured
            if (respectProtection && isProtectedKey(key)) {
              stats.skippedKeys++;
              continue;
            }

            try {
              const value = await AsyncStorage.getItem(key);
              if (value) {
                const shouldRemove = await this.shouldRemoveKey(
                  key,
                  value,
                  patternCutoffTime
                );
                if (shouldRemove) {
                  keysToRemove.push(key);
                  stats.freedSpaceKB += calculateValueSize(value);
                }
              }
            } catch {
              // Mark problematic keys for removal
              keysToRemove.push(key);
              stats.errors++;
            }
          }
        }
      }

      // Remove keys if not dry run
      if (!dryRun && keysToRemove.length > 0) {
        const result = await removeKeysBatch(keysToRemove, batchSize);
        stats.removedKeys = result.removed;
        stats.errors += result.errors;
      } else if (dryRun) {
        stats.removedKeys = keysToRemove.length;
      }

      stats.freedSpaceKB = Math.round(stats.freedSpaceKB * 100) / 100;

      logger.info(
        "StorageCleanup",
        `Old data cleanup ${dryRun ? "(dry run) " : ""}completed`,
        {
          ...stats,
          retentionDays,
          patterns: stats.processedPatterns,
        }
      );

      return stats;
    } catch (error) {
      logger.error("StorageCleanup", "Error cleaning old data", error);
      return stats;
    }
  }

  /**
   * בדיקה אם key צריך להימחק לפי זמן ותוכן
   */
  private static async shouldRemoveKey(
    key: string,
    value: string,
    cutoffTime: number
  ): Promise<boolean> {
    try {
      // Try to extract timestamp from key itself
      const timestampMatch = key.match(/(\d{13})/); // 13 digit timestamp
      if (timestampMatch && timestampMatch[1]) {
        const timestamp = parseInt(timestampMatch[1], 10);
        return timestamp < cutoffTime;
      }

      // Try to parse value as JSON with timestamp
      try {
        const data = JSON.parse(value);
        if (data && typeof data === "object") {
          const timestamp =
            data.timestamp ||
            data.createdAt ||
            data.lastSaved ||
            data.lastUpdated ||
            data.lastUsed ||
            data.date;

          if (typeof timestamp === "number") {
            return timestamp < cutoffTime;
          }

          if (typeof timestamp === "string") {
            return new Date(timestamp).getTime() < cutoffTime;
          }
        }
      } catch {
        // Not JSON, continue with key analysis
      }

      // Pattern-based removal for known old data types
      const oldPatterns = ["cache_", "temp_", "_old", "expired_", "draft_"];
      if (oldPatterns.some((pattern) => key.includes(pattern))) {
        return true;
      }

      // For keys without timestamp, check size - large items are likely old
      if (value.length > 50000) {
        // 50KB threshold
        return true;
      }

      return false;
    } catch {
      return false; // Don't remove if unsure
    }
  }

  /**
   * ניקוי חירום - הסרת נתונים לא חיוניים
   */
  static async emergencyCleanup(
    options: CleanupOptions = {}
  ): Promise<CleanupStats> {
    const {
      batchSize = this.config.emergencyBatchSize,
      respectProtection = true,
      dryRun = false,
    } = options;

    const stats: CleanupStats = {
      removedKeys: 0,
      freedSpaceKB: 0,
      errors: 0,
      skippedKeys: 0,
      processedPatterns: [],
    };

    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove: string[] = [];

      // Get critical and high priority patterns
      const emergencyPatterns = CLEANUP_PATTERNS.filter(
        (p) => p.priority === "critical" || p.priority === "high"
      ).map((p) => p.pattern);

      stats.processedPatterns = emergencyPatterns;

      for (const key of keys) {
        if (emergencyPatterns.some((pattern) => key.includes(pattern))) {
          // Skip protected keys if configured
          if (respectProtection && isProtectedKey(key)) {
            stats.skippedKeys++;
            continue;
          }

          try {
            const value = await AsyncStorage.getItem(key);
            if (value) {
              stats.freedSpaceKB += calculateValueSize(value);
            }
            keysToRemove.push(key);
          } catch {
            keysToRemove.push(key);
            stats.errors++;
          }
        }
      }

      // Remove keys if not dry run
      if (!dryRun && keysToRemove.length > 0) {
        const result = await removeKeysBatch(keysToRemove, batchSize);
        stats.removedKeys = result.removed;
        stats.errors += result.errors;
      } else if (dryRun) {
        stats.removedKeys = keysToRemove.length;
      }

      stats.freedSpaceKB = Math.round(stats.freedSpaceKB * 100) / 100;

      logger.info(
        "StorageCleanup",
        `Emergency cleanup ${dryRun ? "(dry run) " : ""}completed`,
        {
          ...stats,
          emergencyPatterns,
        }
      );

      return stats;
    } catch (error) {
      logger.error("StorageCleanup", "Error in emergency cleanup", error);
      return stats;
    }
  }

  /**
   * בדיקה אם storage מתקרב לגבולות
   */
  static async isStorageFull(): Promise<boolean> {
    try {
      const info = await this.getStorageInfo();
      return (
        info.totalKeys > this.config.maxKeysThreshold ||
        info.estimatedSizeKB > this.config.maxSizeThresholdKB
      );
    } catch {
      return true; // Assume full on error
    }
  }

  /**
   * רישום מצב storage נוכחי
   */
  static async logStorageStatus(): Promise<void> {
    try {
      const info = await this.getStorageInfo();
      const isFull = await this.isStorageFull();

      logger.info("StorageCleanup", "Storage Status", {
        totalKeys: info.totalKeys,
        estimatedSizeKB: info.estimatedSizeKB,
        protectedKeys: info.protectedKeys,
        cleanableKeys: info.cleanableKeys,
        isFull,
        status: isFull ? "Storage Full" : "Storage OK",
        thresholds: {
          maxKeys: this.config.maxKeysThreshold,
          maxSizeKB: this.config.maxSizeThresholdKB,
        },
        largestItems: info.largestItems.slice(0, 5).map((item) => ({
          key:
            item.key.length > 30 ? `${item.key.substring(0, 27)}...` : item.key,
          sizeKB: Math.round(item.sizeKB * 100) / 100,
        })),
      });
    } catch (error) {
      logger.error("StorageCleanup", "Failed to get storage status", error);
    }
  }

  /**
   * ניקוי אוטומטי מתקדם
   */
  static async autoCleanup(): Promise<CleanupStats> {
    try {
      const isFull = await this.isStorageFull();

      if (isFull) {
        logger.warn(
          "StorageCleanup",
          "Storage is approaching limits, starting auto-cleanup"
        );
        return await this.emergencyCleanup({ respectProtection: true });
      } else {
        return await this.cleanOldData({ respectProtection: true });
      }
    } catch (error) {
      logger.error("StorageCleanup", "Auto cleanup failed", error);
      return {
        removedKeys: 0,
        freedSpaceKB: 0,
        errors: 1,
        skippedKeys: 0,
        processedPatterns: [],
      };
    }
  }
}

export default StorageCleanup;
