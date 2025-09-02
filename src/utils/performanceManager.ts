/**
 * @file src/utils/performanceManager.ts
 * @description מנהל ביצועים למניעת לולאות אינסופיות וקריאות כפולות
 * English: Performance manager to prevent infinite loops and duplicate calls
 * @version 1.0.0 - הוספה ראשונית
 * @performance מערכת מתקדמת למניעת בעיות ביצועים
 * @dependencies בלתי תלוי ברכיבים אחרים
 */

import { logger } from "./logger";

/**
 * Global request throttling manager
 * מנהל גלובלי למניעת קריאות תכופות מדי
 */
class PerformanceManager {
  private static instance: PerformanceManager;

  // מעקב בקשות פעילות
  private activeRequests = new Map<
    string,
    { timestamp: number; count: number }
  >();

  // מניעת spam requests
  private readonly MAX_REQUESTS_PER_MINUTE = 10;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 שנייה

  // Cache for frequently accessed data
  private dataCache = new Map<
    string,
    { data: unknown; timestamp: number; ttl: number }
  >();
  private readonly DEFAULT_CACHE_TTL = 10000; // 10 שניות

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  /**
   * בדיקה האם בקשה מותרת או צריכה להיות חסומה
   * Check if request is allowed or should be blocked
   */
  canMakeRequest(requestKey: string): boolean {
    const now = Date.now();
    const existing = this.activeRequests.get(requestKey);

    if (!existing) {
      this.activeRequests.set(requestKey, { timestamp: now, count: 1 });
      return true;
    }

    // בדיקת זמן מינימלי בין בקשות
    if (now - existing.timestamp < this.MIN_REQUEST_INTERVAL) {
      logger.warn("PerformanceManager", "Request blocked - too frequent", {
        requestKey,
        timeSinceLastRequest: now - existing.timestamp,
      });
      return false;
    }

    // בדיקת מספר בקשות לדקה
    const minuteAgo = now - 60000;
    if (
      existing.timestamp > minuteAgo &&
      existing.count >= this.MAX_REQUESTS_PER_MINUTE
    ) {
      logger.warn("PerformanceManager", "Request blocked - too many requests", {
        requestKey,
        requestCount: existing.count,
      });
      return false;
    }

    // עדכון מונה בקשות
    if (existing.timestamp > minuteAgo) {
      existing.count += 1;
    } else {
      existing.count = 1;
    }
    existing.timestamp = now;

    return true;
  }

  /**
   * סימון סיום בקשה
   * Mark request as completed
   */
  completeRequest(requestKey: string): void {
    const existing = this.activeRequests.get(requestKey);
    if (existing && existing.count > 0) {
      existing.count -= 1;
      if (existing.count <= 0) {
        this.activeRequests.delete(requestKey);
      }
    }
  }

  /**
   * קבלת נתונים מ-cache או החזרת null אם לא קיים
   * Get data from cache or return null if not exists
   */
  getCachedData<T>(key: string): T | null {
    const cached = this.dataCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.dataCache.delete(key);
      return null;
    }

    logger.debug("PerformanceManager", "Cache hit", {
      key,
      age: now - cached.timestamp,
    });
    return cached.data as T;
  }

  /**
   * שמירת נתונים ב-cache
   * Save data to cache
   */
  setCachedData<T>(
    key: string,
    data: T,
    ttl: number = this.DEFAULT_CACHE_TTL
  ): void {
    this.dataCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    logger.debug("PerformanceManager", "Data cached", {
      key,
      ttl,
      dataSize: JSON.stringify(data).length,
    });
  }

  /**
   * ניקוי cache ישן
   * Clean expired cache entries
   */
  cleanExpiredCache(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, cached] of this.dataCache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.dataCache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.debug("PerformanceManager", "Cache cleaned", {
        cleanedEntries: cleanedCount,
        remainingEntries: this.dataCache.size,
      });
    }
  }

  /**
   * איפוס מלא של המנהל
   * Complete reset of the manager
   */
  reset(): void {
    this.activeRequests.clear();
    this.dataCache.clear();
    logger.info("PerformanceManager", "Performance manager reset");
  }

  /**
   * קבלת סטטיסטיקות ביצועים
   * Get performance statistics
   */
  getStats(): {
    activeRequests: number;
    cachedItems: number;
    totalRequests: number;
  } {
    return {
      activeRequests: this.activeRequests.size,
      cachedItems: this.dataCache.size,
      totalRequests: Array.from(this.activeRequests.values()).reduce(
        (sum, req) => sum + req.count,
        0
      ),
    };
  }
}

/**
 * Instance יחיד גלובלי
 * Global singleton instance
 */
export const performanceManager = PerformanceManager.getInstance();

/**
 * Decorator למניעת קריאות כפולות לפונקציות async
 * Decorator to prevent duplicate calls to async functions
 */
export function throttleAsync<T extends (...args: never[]) => Promise<unknown>>(
  fn: T,
  key: string
): T {
  return (async (...args: never[]) => {
    const requestKey = `${key}_${JSON.stringify(args)}`;

    // בדיקת cache
    const cached = performanceManager.getCachedData(requestKey);
    if (cached) return cached;

    // בדיקת האם ניתן לבצע בקשה
    if (!performanceManager.canMakeRequest(requestKey)) {
      throw new Error(`Request blocked for performance: ${requestKey}`);
    }

    try {
      const result = await fn(...args);
      performanceManager.setCachedData(requestKey, result);
      return result;
    } finally {
      performanceManager.completeRequest(requestKey);
    }
  }) as T;
}

/**
 * Debounce function למניעת קריאות תכופות מדי
 * Debounce function to prevent too frequent calls
 */
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: never[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * יוטיליטי לניקוי cache אוטומטי
 * Utility for automatic cache cleanup
 */
export function startPerformanceCleanup(): () => void {
  const interval = setInterval(() => {
    performanceManager.cleanExpiredCache();
  }, 60000); // כל דקה

  return () => clearInterval(interval);
}
