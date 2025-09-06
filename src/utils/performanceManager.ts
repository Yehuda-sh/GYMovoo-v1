/**
 * @file src/utils/performanceManager.ts
 * @description מנהל ביצועים מתקדם - Advanced Performance Management System
 */

import { InteractionManager } from "react-native";

// ===============================================
// 📊 Types & Interfaces - טיפוסים וממשקים
// ===============================================

/** מדדי ביצועים */
interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  jsHeapSize?: number;
  componentCount: number;
  lastUpdateTime: number;
  fps?: number;
}

/** הגדרות cache */
interface CacheOptions {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  cleanupInterval: number;
}

/** תוצאת ניטור ביצועים */
interface PerformanceReport {
  startTime: number;
  endTime: number;
  duration: number;
  metrics: PerformanceMetrics;
  warnings: string[];
  recommendations: string[];
}

/** הגדרות profiling */
interface ProfilerOptions {
  enableMemoryTracking: boolean;
  enableRenderTracking: boolean;
  enableFPSTracking: boolean;
  sampleInterval: number;
}

// ===============================================
// 🔧 Configuration & State - הגדרות ומצב
// ===============================================

/** הגדרות ברירת מחדל למנהל הביצועים */
const DEFAULT_CONFIG = {
  cache: {
    maxSize: 100,
    ttl: 300000, // 5 minutes
    cleanupInterval: 60000, // 1 minute
  } as CacheOptions,

  profiler: {
    enableMemoryTracking: true,
    enableRenderTracking: true,
    enableFPSTracking: false, // Resource intensive
    sampleInterval: 1000, // 1 second
  } as ProfilerOptions,

  debounce: {
    defaultWait: 300,
    maxWait: 1000,
  },

  throttle: {
    defaultWait: 100,
    leading: true,
    trailing: true,
  },
};

/** Cache גלובלי לפונקציות ממוטבות */
const globalCache = new Map<
  string,
  { value: unknown; timestamp: number; ttl: number }
>();

/** מדדי ביצועים נוכחיים */
const currentMetrics: PerformanceMetrics = {
  memoryUsage: 0,
  renderTime: 0,
  componentCount: 0,
  lastUpdateTime: Date.now(),
};

/** סטטיסטיקות שימוש */
const usageStats = {
  totalFunctionCalls: 0,
  cacheHits: 0,
  cacheMisses: 0,
  memoryWarnings: 0,
  performanceWarnings: 0,
};

// ===============================================
// 🚀 Core Performance Functions - פונקציות ביצועים עיקריות
// ===============================================

/**
 * פונקצית debounce מתקדמת עם אפשרויות נוספות
 * @param func הפונקציה לעיכוב
 * @param wait זמן ההמתנה במילישניות
 * @param options אפשרויות נוספות
 * @returns פונקציה מעוכבת
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = DEFAULT_CONFIG.debounce.defaultWait,
  options: { leading?: boolean; maxWait?: number } = {}
): T {
  let timeout: NodeJS.Timeout | null = null;
  let lastCallTime = 0;
  const { leading = false, maxWait = DEFAULT_CONFIG.debounce.maxWait } =
    options;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const isLeading = leading && !timeout;

    usageStats.totalFunctionCalls++;

    // Max wait logic
    if (maxWait && lastCallTime && now - lastCallTime >= maxWait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCallTime = now;
      return func(...args);
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      lastCallTime = now;
      if (!isLeading) func(...args);
    }, wait);

    if (isLeading) {
      lastCallTime = now;
      return func(...args);
    }

    return undefined; // Explicit return for type safety
  }) as T;
}

/**
 * פונקצית throttle מתקדמת לבקרת קצב קריאות
 * @param func הפונקציה לבקרה
 * @param wait זמן ההמתנה במילישניות
 * @param options אפשרויות נוספות
 * @returns פונקציה מבוקרת
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = DEFAULT_CONFIG.throttle.defaultWait,
  options: { leading?: boolean; trailing?: boolean } = {}
): T {
  let timeout: NodeJS.Timeout | null = null;
  let lastCallTime = 0;
  let lastArgs: Parameters<T> | null = null;
  const {
    leading = DEFAULT_CONFIG.throttle.leading,
    trailing = DEFAULT_CONFIG.throttle.trailing,
  } = options;

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now();
    usageStats.totalFunctionCalls++;

    if (!lastCallTime && !leading) {
      lastCallTime = now;
    }

    const remaining = wait - (now - lastCallTime);
    lastArgs = args;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCallTime = now;
      return func(...args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        lastCallTime = leading ? 0 : Date.now();
        timeout = null;
        if (lastArgs) func(...lastArgs);
      }, remaining);
    }

    return undefined; // Explicit return for type safety
  };

  return throttled as T;
}

/**
 * פונקצית memoization מתקדמת עם TTL ו-LRU
 * @param func הפונקציה לזכירה
 * @param options אפשרויות cache
 * @returns פונקציה עם זיכרון
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  options: Partial<CacheOptions> = {}
): T & { cache: Map<string, unknown>; clearCache: () => void } {
  const config = { ...DEFAULT_CONFIG.cache, ...options };
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();

  const memoized = (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const now = Date.now();

    usageStats.totalFunctionCalls++;

    // Check cache
    const cached = cache.get(key);
    if (cached && now - cached.timestamp < config.ttl) {
      usageStats.cacheHits++;
      return cached.value;
    }

    usageStats.cacheMisses++;

    // Execute function
    const result = func(...args) as ReturnType<T>;

    // Store in cache with LRU eviction
    if (cache.size >= config.maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    cache.set(key, { value: result, timestamp: now });
    return result;
  };

  memoized.cache = cache as Map<string, unknown>;
  memoized.clearCache = () => cache.clear();

  return memoized as T & {
    cache: Map<string, unknown>;
    clearCache: () => void;
  };
}

/**
 * פונקציית batch לביצוע פעולות במקבץ
 * @param operations מערך פעולות לביצוע
 * @param batchSize גודל המקבץ
 * @param delay השהיה בין מקבצים
 * @returns Promise עם תוצאות
 */
export async function batchOperations<T>(
  operations: (() => Promise<T> | T)[],
  batchSize: number = 10,
  delay: number = 0
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);

    // Wait for interactions to complete
    await new Promise<void>((resolve) => {
      InteractionManager.runAfterInteractions(() => resolve());
    });

    const batchResults = await Promise.all(
      batch.map(async (operation) => {
        try {
          return await operation();
        } catch (error) {
          console.error("Batch operation failed:", error);
          throw error;
        }
      })
    );

    results.push(...batchResults);

    if (delay > 0 && i + batchSize < operations.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return results;
}

// ===============================================
// 📊 Performance Monitoring - ניטור ביצועים
// ===============================================

/**
 * מדידת זמן ביצוע פונקציה
 * @param func הפונקציה למדידה
 * @param name שם הפונקציה לדיווח
 * @returns פונקציה עם מדידת זמן
 */
export function measurePerformance<T extends (...args: unknown[]) => unknown>(
  func: T,
  name: string = func.name || "anonymous"
): T {
  return ((...args: Parameters<T>) => {
    const startTime = performance.now();

    try {
      const result = func(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.finally(() => {
          const endTime = performance.now();
          const duration = endTime - startTime;

          console.log(`⏱️ ${name} completed in ${duration.toFixed(2)}ms`);

          // Warn about slow operations
          if (duration > 100) {
            usageStats.performanceWarnings++;
            console.warn(
              `🐌 Slow operation detected: ${name} took ${duration.toFixed(2)}ms`
            );
          }
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(`⏱️ ${name} completed in ${duration.toFixed(2)}ms`);

      if (duration > 50) {
        usageStats.performanceWarnings++;
        console.warn(
          `🐌 Slow operation detected: ${name} took ${duration.toFixed(2)}ms`
        );
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }) as T;
}

/**
 * ניטור זיכרון ואזהרות על דליפות
 * @returns מידע על שימוש בזיכרון
 */
export function getMemoryInfo(): {
  used: number;
  total?: number;
  warnings: string[];
} {
  const warnings: string[] = [];

  try {
    // React Native doesn't have direct memory API, so we estimate
    const estimatedUsage = globalCache.size * 0.001; // Rough estimation in MB

    if (globalCache.size > 1000) {
      warnings.push("Large cache size detected - consider cleanup");
      usageStats.memoryWarnings++;
    }

    if (
      usageStats.totalFunctionCalls > 10000 &&
      usageStats.cacheHits < usageStats.cacheMisses
    ) {
      warnings.push("Low cache hit ratio - consider optimizing cache strategy");
    }

    return {
      used: estimatedUsage,
      warnings,
    };
  } catch (error) {
    console.error("Error getting memory info:", error);
    return { used: 0, warnings: ["Failed to get memory info"] };
  }
}

/**
 * ניקוי cache גלובלי וסטטיסטיקות
 * @param force ניקוי כפוי של הכל
 */
export function cleanup(force: boolean = false): void {
  const now = Date.now();
  let cleaned = 0;

  // Clean expired cache entries
  for (const [key, entry] of globalCache.entries()) {
    if (force || now - entry.timestamp > entry.ttl) {
      globalCache.delete(key);
      cleaned++;
    }
  }

  if (force) {
    // Reset all stats
    usageStats.totalFunctionCalls = 0;
    usageStats.cacheHits = 0;
    usageStats.cacheMisses = 0;
    usageStats.memoryWarnings = 0;
    usageStats.performanceWarnings = 0;
  }

  console.log(
    `🧹 Cleaned ${cleaned} cache entries${force ? " and reset stats" : ""}`
  );
}

/**
 * דוח ביצועים מפורט
 * @returns אובייקט עם כל הסטטיסטיקות
 */
export function getPerformanceReport(): PerformanceReport {
  const now = Date.now();
  const memoryInfo = getMemoryInfo();

  const metrics: PerformanceMetrics = {
    ...currentMetrics,
    memoryUsage: memoryInfo.used,
    lastUpdateTime: now,
  };

  const recommendations: string[] = [];
  const warnings = [...memoryInfo.warnings];

  // Generate recommendations
  if (usageStats.cacheMisses > usageStats.cacheHits * 2) {
    recommendations.push("Consider increasing cache TTL or size");
  }

  if (usageStats.performanceWarnings > 10) {
    recommendations.push(
      "Multiple slow operations detected - consider optimization"
    );
  }

  if (globalCache.size === 0 && usageStats.totalFunctionCalls > 100) {
    recommendations.push(
      "Consider using memoization for repeated calculations"
    );
  }

  return {
    startTime: 0, // This would be set when starting monitoring
    endTime: now,
    duration: 0, // This would be calculated based on monitoring session
    metrics,
    warnings,
    recommendations,
  };
}

// ===============================================
// 🎁 Additional Utilities - יוטיליטיז נוספים
// ===============================================

/**
 * פונקציית lazy loading לרכיבים כבדים
 * @param loader פונקציה לטעינת הרכיב
 * @param fallback רכיב fallback בזמן טעינה
 * @returns Promise עם הרכיב הטעון
 */
export function createLazyLoader<T>(
  loader: () => Promise<T>,
  fallback?: T
): () => Promise<T> {
  let cached: T | null = null;
  let loading: Promise<T> | null = null;

  return async (): Promise<T> => {
    if (cached) {
      usageStats.cacheHits++;
      return cached;
    }

    if (loading) {
      return loading;
    }

    usageStats.cacheMisses++;

    loading = loader()
      .then((result) => {
        cached = result;
        loading = null;
        return result;
      })
      .catch((error) => {
        loading = null;
        if (fallback) {
          cached = fallback;
          return fallback;
        }
        throw error;
      });

    return loading;
  };
}

/**
 * קבלת סטטיסטיקות שימוש נוכחיות
 * @returns אובייקט סטטיסטיקות
 */
export function getUsageStats() {
  const cacheEfficiency =
    usageStats.totalFunctionCalls > 0
      ? (usageStats.cacheHits /
          (usageStats.cacheHits + usageStats.cacheMisses)) *
        100
      : 0;

  return {
    ...usageStats,
    cacheSize: globalCache.size,
    cacheEfficiency: Math.round(cacheEfficiency),
    averageCallsPerWarning:
      usageStats.performanceWarnings > 0
        ? Math.round(
            usageStats.totalFunctionCalls / usageStats.performanceWarnings
          )
        : Infinity,
  };
}

/**
 * ביצוע פעולה בצורה אופטימלית עם InteractionManager
 * @param operation הפעולה לביצוע
 * @returns Promise עם התוצאה
 */
export function runOptimized<T>(operation: () => T | Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    InteractionManager.runAfterInteractions(async () => {
      try {
        const result = await operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}
