/**
 * @file src/utils/storageCleanup.ts
 * @description Simple storage cleanup utility
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";

interface StorageInfo {
  totalKeys: number;
  estimatedSizeKB: number;
  largestItems: Array<{ key: string; sizeKB: number }>;
}

interface CleanupStats {
  removedKeys: number;
  freedSpaceKB: number;
  errors: number;
}

export class StorageCleanup {
  private static readonly MAX_KEYS_THRESHOLD = 1000;
  private static readonly MAX_SIZE_THRESHOLD_KB = 50 * 1024; // 50MB

  /**
   * Get basic storage information
   */
  static async getStorageInfo(): Promise<StorageInfo> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items: Array<{ key: string; sizeKB: number }> = [];
      let totalSize = 0;

      // Check first 500 keys to avoid performance issues
      const keysToCheck = keys.slice(0, 500);

      for (const key of keysToCheck) {
        try {
          const value = await AsyncStorage.getItem(key);
          const sizeKB = value ? (value.length * 2) / 1024 : 0; // UTF-16 encoding
          items.push({ key, sizeKB });
          totalSize += sizeKB;
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
      };
    } catch (error) {
      logger.error("StorageCleanup", "Error getting storage info", error);
      return {
        totalKeys: 0,
        estimatedSizeKB: 0,
        largestItems: [],
      };
    }
  }

  /**
   * Clean old temporary data
   */
  static async cleanOldData(): Promise<CleanupStats> {
    const stats: CleanupStats = {
      removedKeys: 0,
      freedSpaceKB: 0,
      errors: 0,
    };

    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove: string[] = [];
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      // Patterns for old data
      const oldDataPatterns = [
        "temp_",
        "cache_",
        "workout_draft_",
        "analytics_",
        "session_",
        "_temp",
      ];

      for (const key of keys) {
        if (oldDataPatterns.some((pattern) => key.includes(pattern))) {
          try {
            const value = await AsyncStorage.getItem(key);
            if (value) {
              try {
                const data = JSON.parse(value);
                const timestamp =
                  data.timestamp || data.createdAt || data.lastSaved;

                if (timestamp && new Date(timestamp).getTime() < oneWeekAgo) {
                  keysToRemove.push(key);
                  stats.freedSpaceKB += (value.length * 2) / 1024;
                }
              } catch {
                // If can't parse, assume it's old data
                keysToRemove.push(key);
                stats.freedSpaceKB += (value.length * 2) / 1024;
              }
            }
          } catch {
            // Mark problematic keys for removal
            keysToRemove.push(key);
            stats.errors++;
          }
        }
      }

      // Remove keys in batches
      const batchSize = 10;
      for (let i = 0; i < keysToRemove.length; i += batchSize) {
        const batch = keysToRemove.slice(i, i + batchSize);
        try {
          await AsyncStorage.multiRemove(batch);
          stats.removedKeys += batch.length;
        } catch {
          // Try removing individually
          for (const key of batch) {
            try {
              await AsyncStorage.removeItem(key);
              stats.removedKeys++;
            } catch {
              stats.errors++;
            }
          }
        }
      }

      stats.freedSpaceKB = Math.round(stats.freedSpaceKB * 100) / 100;
      logger.info("StorageCleanup", "Old data cleanup completed", stats);

      return stats;
    } catch (error) {
      logger.error("StorageCleanup", "Error cleaning old data", error);
      return stats;
    }
  }

  /**
   * Emergency cleanup - remove non-essential data
   */
  static async emergencyCleanup(): Promise<CleanupStats> {
    const stats: CleanupStats = {
      removedKeys: 0,
      freedSpaceKB: 0,
      errors: 0,
    };

    try {
      const keys = await AsyncStorage.getAllKeys();
      const nonEssentialPatterns = [
        "temp_",
        "cache_",
        "draft_",
        "analytics_",
        "logs_",
        "debug_",
        "test_",
        "_cache",
        "_temp",
      ];

      const keysToRemove: string[] = [];

      for (const key of keys) {
        if (nonEssentialPatterns.some((pattern) => key.includes(pattern))) {
          try {
            const value = await AsyncStorage.getItem(key);
            if (value) {
              stats.freedSpaceKB += (value.length * 2) / 1024;
            }
            keysToRemove.push(key);
          } catch {
            keysToRemove.push(key);
            stats.errors++;
          }
        }
      }

      // Remove in larger batches for emergency
      const batchSize = 20;
      for (let i = 0; i < keysToRemove.length; i += batchSize) {
        const batch = keysToRemove.slice(i, i + batchSize);
        try {
          await AsyncStorage.multiRemove(batch);
          stats.removedKeys += batch.length;
        } catch {
          // Try individually
          for (const key of batch) {
            try {
              await AsyncStorage.removeItem(key);
              stats.removedKeys++;
            } catch {
              stats.errors++;
            }
          }
        }
      }

      stats.freedSpaceKB = Math.round(stats.freedSpaceKB * 100) / 100;
      logger.info("StorageCleanup", "Emergency cleanup completed", stats);

      return stats;
    } catch (error) {
      logger.error("StorageCleanup", "Error in emergency cleanup", error);
      return stats;
    }
  }

  /**
   * Check if storage is approaching limits
   */
  static async isStorageFull(): Promise<boolean> {
    try {
      const info = await this.getStorageInfo();
      return (
        info.totalKeys > this.MAX_KEYS_THRESHOLD ||
        info.estimatedSizeKB > this.MAX_SIZE_THRESHOLD_KB
      );
    } catch {
      return true; // Assume full on error
    }
  }

  /**
   * Log current storage status
   */
  static async logStorageStatus(): Promise<void> {
    try {
      const info = await this.getStorageInfo();
      const isFull = await this.isStorageFull();

      logger.info("StorageCleanup", "Storage Status", {
        totalKeys: info.totalKeys,
        estimatedSizeKB: info.estimatedSizeKB,
        isFull,
        status: isFull ? "Storage Full" : "Storage OK",
        largestItems: info.largestItems.slice(0, 5).map((item) => ({
          key: item.key.length > 30 ? `${item.key.substring(0, 27)}...` : item.key,
          sizeKB: Math.round(item.sizeKB * 100) / 100,
        })),
      });
    } catch (error) {
      logger.error("StorageCleanup", "Failed to get storage status", error);
    }
  }
}

export default StorageCleanup;
