/**
 * @file src/utils/performanceDemo.ts
 * @description דמו להשתמשות במנהל הביצועים למניעת בעיות ביצועים
 * @description Demo for using performance manager to prevent performance issues
 * @version 1.0.0 - ראשונית
 * @performance דוגמאות מעשיות לשימוש
 */

import { performanceManager, debounce } from "./performanceManager";
import { logger } from "./logger";

/**
 * דוגמה לשימוש במנהל ביצועים עבור שירות API
 * Example of using performance manager for API service
 */
export class OptimizedApiService {
  /**
   * פונקציה מותאמת לקריאות API עם cache ו-throttling
   * Optimized function for API calls with cache and throttling
   */
  async getUserData(userId: string): Promise<unknown> {
    const cacheKey = `user_data_${userId}`;

    // בדיקת cache תחילה
    const cached = performanceManager.getCachedData(cacheKey);
    if (cached) {
      logger.debug("OptimizedApiService", "Cache hit", { userId });
      return cached;
    }

    // בדיקה האם ניתן לבצע בקשה
    if (!performanceManager.canMakeRequest(cacheKey)) {
      throw new Error("Too many requests - please wait");
    }

    try {
      // סימולציה של קריאת API
      const response = await this.fetchFromServer(userId);

      // שמירה ב-cache
      performanceManager.setCachedData(cacheKey, response, 60000); // 1 דקה

      return response;
    } finally {
      performanceManager.completeRequest(cacheKey);
    }
  }

  private async fetchFromServer(userId: string): Promise<unknown> {
    // סימולציה
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { userId, data: "sample data", timestamp: Date.now() };
  }
}

/**
 * דוגמה לשימוש ב-throttleAsync decorator
 * Example of using throttleAsync decorator
 */
export class WorkoutService {
  /**
   * פונקציה מוגנת מקריאות כפולות
   * Function protected from duplicate calls
   */
  async getWorkoutRecommendations(userId: string): Promise<unknown> {
    logger.info("WorkoutService", "Fetching workout recommendations", {
      userId,
    });

    // סימולציה של עיבוד כבד
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      workouts: ["Push Day", "Pull Day", "Leg Day"],
      userId,
      timestamp: Date.now(),
    };
  }
}

/**
 * דוגמה לשימוש ב-debounce לחיפושים
 * Example of using debounce for searches
 */
export class SearchService {
  /**
   * חיפוש עם debounce למניעת קריאות תכופות
   * Search with debounce to prevent frequent calls
   */
  debouncedSearch = debounce(async (query: string) => {
    if (query.length < 2) return [];

    const cacheKey = `search_${query}`;

    // בדיקת cache
    const cached = performanceManager.getCachedData(cacheKey);
    if (cached) return cached;

    // ביצוע חיפוש
    const results = await this.performSearch(query);

    // שמירה ב-cache לזמן קצר
    performanceManager.setCachedData(cacheKey, results, 30000); // 30 שניות

    return results;
  }, 300); // המתנה של 300ms בין חיפושים

  private async performSearch(query: string): Promise<string[]> {
    // סימולציה של חיפוש
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [`Result 1 for ${query}`, `Result 2 for ${query}`];
  }
}

/**
 * יוטיליטי למעקב אחר ביצועים של הפונקציות
 * Utility for monitoring function performance
 */
export function monitorPerformance<T extends (...args: never[]) => unknown>(
  fn: T,
  name: string
): T {
  return ((...args: never[]) => {
    const start = Date.now();
    const result = fn(...args);

    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = Date.now() - start;
        logger.debug("Performance Monitor", `${name} completed`, { duration });
      });
    } else {
      const duration = Date.now() - start;
      logger.debug("Performance Monitor", `${name} completed`, { duration });
      return result;
    }
  }) as T;
}

/**
 * דוגמה לשימוש כל יחד
 * Example of using everything together
 */
export class OptimizedExampleService {
  private apiService = new OptimizedApiService();
  private workoutService = new WorkoutService();
  private searchService = new SearchService();

  async getDashboardData(userId: string): Promise<unknown> {
    const cacheKey = `dashboard_${userId}`;

    // בדיקת cache כללי
    const cached = performanceManager.getCachedData(cacheKey);
    if (cached) {
      logger.debug("OptimizedExampleService", "Dashboard cache hit", {
        userId,
      });
      return cached;
    }

    try {
      // טעינה מקבילה של נתונים (רק אם לא ב-cache)
      const [userData, workouts] = await Promise.all([
        this.apiService.getUserData(userId),
        this.workoutService.getWorkoutRecommendations(userId),
      ]);

      const dashboardData = {
        user: userData,
        workouts,
        lastUpdated: Date.now(),
      };

      // שמירה ב-cache למשך זמן ארוך יותר
      performanceManager.setCachedData(cacheKey, dashboardData, 120000); // 2 דקות

      return dashboardData;
    } catch (error) {
      logger.error("OptimizedExampleService", "Failed to get dashboard data", {
        error: error instanceof Error ? error.message : String(error),
        userId,
      });
      throw error;
    }
  }

  /**
   * קבלת סטטיסטיקות ביצועים
   * Get performance statistics
   */
  getPerformanceStats() {
    return performanceManager.getStats();
  }
}

// Export instances עבור שימוש נוח
export const optimizedApiService = new OptimizedApiService();
export const workoutService = new WorkoutService();
export const searchService = new SearchService();
export const optimizedExampleService = new OptimizedExampleService();
