/**
 * @file src/services/core/DataManager.ts
 * @brief מנהל נתונים מרכזי – מכין ומטמון נתונים בעת עליית האפליקציה ותומך בהתרחבות עתידית לשרת
 * @brief Central Data Manager – initializes & caches core data at app startup (server-ready architecture)
 * @dependencies userStore, workoutFacadeService, userApi, logger, errorHandler
 * @updated 2025-09-01 Enhanced error handling, input validation, constants extraction, and comprehensive logging
 *
 * ✅ ACTIVE & CRITICAL / בשימוש פעיל
 * - מספק היסטוריית אימונים, סטטיסטיקות והודעות ברכה למסכים שונים
 * - Singleton pattern (instance יחיד)
 * - In-memory caching להפחתת גישות חוזרות
 * - Graceful fallback מקומי אם שרת לא זמין
 * - מוכן להרחבת סנכרון דו-כיווני בעתיד
 * - Comprehensive error handling with structured logging
 * - Input validation and type safety
 * - Performance optimizations and retry mechanisms
 *
 * @architecture Central data hub with smart caching and server preparation
 * @usage 20+ files depend on this service across the application
 * @performance In-memory caching reduces redundant data fetching
 * @scalability Ready for server integration and sync capabilities
 * @errorHandling Comprehensive error recovery with fallback mechanisms
 * @validation Input validation for all public methods
 */

import { User } from "../../stores/userStore";
import {
  WorkoutWithFeedback,
  WorkoutStatistics,
} from "../../screens/workout/types/workout.types";
import { workoutFacadeService } from "../workout/workoutFacadeService";
import { LOGGING } from "../../constants/logging";
import { userApi } from "../api/userApi";
import { logger } from "../../utils/logger";
import { errorHandler } from "../../utils/errorHandler";
import { DATA_MANAGER_CONSTANTS } from "../../constants/sharedConstants";

// =====================================
// 🪵 Dev Logger (only in __DEV__)
// =====================================
const devLog = (message: string, ...args: unknown[]) => {
  if (__DEV__ && LOGGING.DATA_MANAGER_SUMMARY) {
    logger.debug("DataManager", message, ...args);
  }
};

export interface AppDataCache {
  workoutHistory: WorkoutWithFeedback[];
  statistics: WorkoutStatistics | null;
  congratulationMessage: string | null;
  lastUpdated: Date;
  isDemo: boolean;
}

export interface ServerConfig {
  readonly baseUrl?: string;
  readonly apiKey?: string;
  readonly enabled: boolean;
  readonly syncInterval: number; // minutes
}

export interface DataStatus {
  readonly isDemo: boolean;
  readonly lastUpdated: Date | null;
  readonly ready: boolean;
  readonly serverReachable: boolean;
}

class DataManagerService {
  private cache: AppDataCache | null = null;
  private serverConfig: ServerConfig = {
    enabled: false,
    syncInterval: DATA_MANAGER_CONSTANTS.SYNC_INTERVAL_DEFAULT, // 30 minutes default
  };
  private serverReachable: boolean = true;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private retryCount = 0;

  /**
   * אתחול המערכת - ייקרא פעם אחת בהפעלת האפליקציה
   * @param user נתוני המשתמש - חובה וחייב להיות תקף
   * @throws Error אם נתוני המשתמש לא תקפים
   */
  async initialize(user: User): Promise<void> {
    try {
      // Input validation
      this._validateUser(user);

      if (this.isInitialized && this.cache) {
        devLog("✅ Already initialized, skipping");
        return;
      }

      if (this.initPromise) {
        devLog("⏳ Initialization in progress, waiting...");
        return this.initPromise;
      }

      this.initPromise = this._performInitialization(user);
      await this.initPromise;
    } catch (error) {
      logger.error(
        "DataManager",
        "Initialize failed with validation error",
        error
      );
      errorHandler.reportError(error, {
        source: "DataManager.initialize",
        userId: user?.id,
        errorType: "validation",
      });
      throw error;
    }
  }

  private async _performInitialization(user: User): Promise<void> {
    const startTime = Date.now();

    try {
      devLog("🚀 Starting initialization...");
      logger.info("DataManager", "Initialization started", { userId: user.id });

      // בדיקת זמינות שרת לפני טעינה עם retry logic
      this.serverReachable = await this._checkServerHealthWithRetry();
      devLog("🌐 Server reachable:", this.serverReachable);

      if (LOGGING.DATA_MANAGER_SUMMARY) {
        logger.debug("DataManager", "👤 User data preview:", {
          id: user.id,
          name: user.name,
          email: user.email,
          hasQuestionnaire: !!user.questionnaire,
          hasSmartQuestionnaire: !!user.smartquestionnairedata,
          hasActivityHistory: !!user.activityhistory,
          workoutsCount: user.activityhistory?.workouts?.length || 0,
          hasScientificProfile: !!user.scientificprofile,
        });
      }

      // בדיקה אם יש נתונים בשרת (עתידי)
      if (this.serverConfig.enabled && this.serverReachable) {
        await this._loadFromServer(user);
      } else {
        await this._loadFromLocalSources(user);
      }

      // 📊 לוג מפורט של כל הנתונים שנוצרו (רק במצב VERBOSE)
      if (LOGGING.VERBOSE) this._logCompleteUserData(user);

      this.isInitialized = true;
      this.retryCount = 0; // Reset retry count on success

      const duration = Date.now() - startTime;
      devLog(`✅ Initialization completed in ${duration}ms`);
      logger.info("DataManager", "Initialization completed successfully", {
        userId: user.id,
        duration,
        serverReachable: this.serverReachable,
      });
    } catch (error) {
      this.retryCount++;
      logger.error("DataManager", "Initialization failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId: user.id,
        attempt: this.retryCount,
        serverReachable: this.serverReachable,
      });

      errorHandler.reportError(error, {
        source: "DataManager._performInitialization",
        userId: user.id,
        attempt: this.retryCount,
        errorType: "initialization",
      });

      // במקרה של כשל, ננסה לטעון נתונים מקומיים עם retry
      if (this.retryCount < DATA_MANAGER_CONSTANTS.MAX_RETRY_ATTEMPTS) {
        devLog(`🔄 Retrying initialization (attempt ${this.retryCount + 1})`);
        await new Promise((resolve) =>
          setTimeout(resolve, DATA_MANAGER_CONSTANTS.RETRY_DELAY_MS)
        );
        return this._loadFromLocalSources(user);
      }

      // אחרי כל הניסיונות, נזרוק את השגיאה
      throw new Error(
        `${DATA_MANAGER_CONSTANTS.ERRORS.INITIALIZATION_FAILED}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * בדיקת בריאות שרת עם retry logic
   */
  private async _checkServerHealthWithRetry(): Promise<boolean> {
    for (
      let attempt = 1;
      attempt <= DATA_MANAGER_CONSTANTS.HEALTH_CHECK_RETRIES;
      attempt++
    ) {
      try {
        const isHealthy = await this._checkServerHealth();
        if (isHealthy) {
          return true;
        }

        if (attempt < DATA_MANAGER_CONSTANTS.HEALTH_CHECK_RETRIES) {
          devLog(
            `🌐 Server health check failed (attempt ${attempt}), retrying...`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, DATA_MANAGER_CONSTANTS.RETRY_DELAY_MS)
          );
        }
      } catch (error) {
        devLog(`🌐 Server health check error (attempt ${attempt}):`, error);
        if (attempt < DATA_MANAGER_CONSTANTS.HEALTH_CHECK_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, DATA_MANAGER_CONSTANTS.RETRY_DELAY_MS)
          );
        }
      }
    }

    devLog("🌐 Server health check failed after all retries");
    return false;
  }

  /**
   * בדיקת בריאות שרת
   */
  private async _checkServerHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        DATA_MANAGER_CONSTANTS.HEALTH_CHECK_TIMEOUT_MS
      );

      const res = await userApi.health();
      clearTimeout(timeoutId);

      return Boolean(res);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        devLog("🌐 Server health check timed out");
      }
      return false;
    }
  }

  /**
   * טעינה מהשרת (עתידי)
   */
  private async _loadFromServer(user: User): Promise<void> {
    const startTime = Date.now();

    try {
      devLog("🌐 Loading from server...");
      logger.info("DataManager", "Server loading started", { userId: user.id });

      // כאן יהיה הקוד לטעינה מהשרת בעתיד
      // const serverData = await this._fetchFromServer(user.id);

      // לעת עתה, נשתמש בנתונים מקומיים
      await this._loadFromLocalSources(user);

      // נסמן שהנתונים באו מהשרת
      if (this.cache) {
        this.cache.isDemo = false;
      }

      const duration = Date.now() - startTime;
      devLog(`✅ Server loading completed in ${duration}ms`);
      logger.info("DataManager", "Server loading completed successfully", {
        userId: user.id,
        duration,
      });
    } catch (error) {
      logger.error(
        "DataManager",
        "Server loading failed, falling back to local",
        {
          error: error instanceof Error ? error.message : "Unknown error",
          userId: user.id,
        }
      );

      errorHandler.reportError(error, {
        source: "DataManager._loadFromServer",
        userId: user.id,
        errorType: "server_loading",
      });

      // Fallback to local sources
      await this._loadFromLocalSources(user);
    }
  }

  /**
   * טעינה ממקורות מקומיים
   */
  private async _loadFromLocalSources(user: User): Promise<void> {
    const startTime = Date.now();

    try {
      // אין שימוש בדמו – תמיד נטען נתונים אמיתיים
      const isDemo = false;

      devLog(`📦 Loading from ${isDemo ? "demo" : "user"} sources...`);

      // טעינה מקבילה עם error handling לכל מקור נתונים
      const loadPromises = [
        this._safeLoadWorkoutHistory(),
        this._safeLoadStatistics(),
        this._safeLoadCongratulationMessage(),
      ];

      const [workoutHistory, statistics, congratulationMessage] =
        (await Promise.all(loadPromises)) as [
          WorkoutWithFeedback[],
          WorkoutStatistics | null,
          string | null,
        ];

      this.cache = {
        workoutHistory,
        statistics,
        congratulationMessage,
        lastUpdated: new Date(),
        isDemo,
      };

      const duration = Date.now() - startTime;
      devLog(
        `✅ Loaded ${workoutHistory.length} workouts in ${duration}ms (${isDemo ? "demo" : "real"})`
      );

      logger.info("DataManager", "Local data loaded successfully", {
        userId: user.id,
        workoutsCount: workoutHistory.length,
        hasStatistics: !!statistics,
        hasCongratulation: !!congratulationMessage,
        duration,
      });
    } catch (error) {
      logger.error("DataManager", "Failed to load from local sources", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId: user.id,
      });

      errorHandler.reportError(error, {
        source: "DataManager._loadFromLocalSources",
        userId: user.id,
      });

      // יצירת cache ריק במקרה של כשל מוחלט
      this.cache = {
        workoutHistory: [],
        statistics: null,
        congratulationMessage: null,
        lastUpdated: new Date(),
        isDemo: false,
      };

      throw error;
    }
  }

  /**
   * קבלת נתוני אימונים
   */
  getWorkoutHistory(): WorkoutWithFeedback[] {
    return this._getCacheOrWarn()?.workoutHistory || [];
  }

  /**
   * קבלת סטטיסטיקות
   */
  getStatistics(): WorkoutStatistics | null {
    return this._getCacheOrWarn()?.statistics || null;
  }

  /**
   * קבלת הודעת ברכה
   */
  getCongratulationMessage(): string | null {
    return this._getCacheOrWarn()?.congratulationMessage || null;
  }

  /**
   * בדיקה האם המערכת מאותחלת ומוכנה לשימוש
   * @returns {boolean} האם המנהל מוכן לשימוש
   */
  isReady(): boolean {
    return this.isInitialized && this.cache !== null;
  }

  /**
   * קבלת מצב מפורט של הנתונים
   * @returns {object} מידע מפורט על מצב המנהל
   */
  getDataStatus(): DataStatus {
    return {
      isDemo: this.cache?.isDemo ?? true,
      lastUpdated: this.cache?.lastUpdated ?? null,
      ready: this.isReady(),
      serverReachable: this.serverReachable,
    };
  }

  /**
   * בדיקת זמינות השרת
   */
  isServerReachable(): boolean {
    return this.serverReachable;
  }

  /**
   * רענון נתונים - מאפס את המטמון וטוען מחדש
   * @param user נתוני המשתמש לרענון - חובה וחייב להיות תקף
   * @throws Error אם נתוני המשתמש לא תקפים
   */
  async refresh(user: User): Promise<void> {
    try {
      // Input validation
      this._validateUser(user);

      devLog("🔄 Refreshing data...");
      logger.info("DataManager", "Data refresh started", { userId: user.id });

      this.isInitialized = false;
      this.cache = null;
      this.initPromise = null;
      this.retryCount = 0;

      await this.initialize(user);

      logger.info("DataManager", "Data refresh completed", { userId: user.id });
    } catch (error) {
      logger.error("DataManager", "Data refresh failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId: user?.id,
      });

      errorHandler.reportError(error, {
        source: "DataManager.refresh",
        userId: user?.id,
        errorType: "refresh",
      });

      throw error;
    }
  }

  /**
   * הגדרת תצורת שרת עתידית
   * @param config תצורת שרת חלקית לעדכון
   * @throws Error אם התצורה לא תקפה
   */
  configureServer(config: Partial<ServerConfig>): void {
    try {
      // Input validation
      if (config.syncInterval !== undefined) {
        if (
          typeof config.syncInterval !== "number" ||
          config.syncInterval < DATA_MANAGER_CONSTANTS.SYNC_INTERVAL_MIN ||
          config.syncInterval > DATA_MANAGER_CONSTANTS.SYNC_INTERVAL_MAX
        ) {
          throw new Error(
            `${DATA_MANAGER_CONSTANTS.ERRORS.INVALID_CONFIG}: syncInterval must be between ${DATA_MANAGER_CONSTANTS.SYNC_INTERVAL_MIN} and ${DATA_MANAGER_CONSTANTS.SYNC_INTERVAL_MAX} minutes`
          );
        }
      }

      this.serverConfig = { ...this.serverConfig, ...config };
      devLog("🔧 Server config updated", this.serverConfig);

      logger.info("DataManager", "Server configuration updated", {
        enabled: this.serverConfig.enabled,
        syncInterval: this.serverConfig.syncInterval,
      });
    } catch (error) {
      logger.error("DataManager", "Server configuration update failed", {
        error: error instanceof Error ? error.message : "Unknown error",
      });

      errorHandler.reportError(error, {
        source: "DataManager.configureServer",
        errorType: "configuration",
      });

      throw error;
    }
  }

  /**
   * סנכרון עם שרת - פונקציונליות עתידית (לא מיושמת)
   * @param user נתוני המשתמש לסנכרון
   * @throws Error אם הסנכרון נכשל
   */
  async syncWithServer(user: User): Promise<void> {
    try {
      if (!this.serverConfig.enabled) {
        devLog("🌐 Server sync disabled");
        logger.info("DataManager", "Server sync skipped - disabled in config");
        return;
      }

      if (!this.serverReachable) {
        throw new Error(DATA_MANAGER_CONSTANTS.ERRORS.SERVER_UNREACHABLE);
      }

      // Input validation
      this._validateUser(user);

      logger.info("DataManager", "Server sync started", { userId: user.id });

      // TODO: Implement server sync functionality
      devLog("🔄 Server sync not yet implemented");
      logger.warn(
        "DataManager",
        "Server sync functionality not yet implemented"
      );
    } catch (error) {
      logger.error("DataManager", "Server sync failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId: user?.id,
      });

      errorHandler.reportError(error, {
        source: "DataManager.syncWithServer",
        userId: user?.id,
        errorType: "sync",
      });

      throw error;
    }
  }

  /**
   * ניקוי מטמון ומצב - לצרכי דיבוג ופיתוח
   */
  clearCache(): void {
    devLog("🗑️ Clearing cache");
    this.cache = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * Helper: בדיקה אם המטמון מאותחל ומחזיר אותו עם אזהרה אם לא
   * @returns AppDataCache | null
   */
  private _getCacheOrWarn(): AppDataCache | null {
    if (!this.cache) {
      devLog("⚠️ Cache not initialized");
      return null;
    }
    return this.cache;
  }

  /**
   * Input validation: בדיקת תקפות נתוני המשתמש
   * @param user נתוני המשתמש לבדיקה
   * @throws Error אם הנתונים לא תקפים
   */
  private _validateUser(user: User): void {
    if (!user) {
      throw new Error(DATA_MANAGER_CONSTANTS.ERRORS.INVALID_USER);
    }

    if (!user.id || typeof user.id !== "string" || user.id.trim() === "") {
      throw new Error(
        `${DATA_MANAGER_CONSTANTS.ERRORS.INVALID_USER}: Missing or invalid user ID`
      );
    }

    if (
      !user.name ||
      typeof user.name !== "string" ||
      user.name.trim() === ""
    ) {
      throw new Error(
        `${DATA_MANAGER_CONSTANTS.ERRORS.INVALID_USER}: Missing or invalid user name`
      );
    }

    if (
      !user.email ||
      typeof user.email !== "string" ||
      !user.email.includes("@")
    ) {
      throw new Error(
        `${DATA_MANAGER_CONSTANTS.ERRORS.INVALID_USER}: Missing or invalid email`
      );
    }
  }

  /**
   * Safe loading: טעינת היסטוריית אימונים עם error handling
   */
  private async _safeLoadWorkoutHistory(): Promise<WorkoutWithFeedback[]> {
    try {
      return await workoutFacadeService.getHistory();
    } catch (error) {
      devLog("⚠️ Failed to load workout history, using empty array", error);
      logger.warn("DataManager", "Failed to load workout history", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * Safe loading: טעינת סטטיסטיקות עם error handling
   */
  private async _safeLoadStatistics(): Promise<WorkoutStatistics | null> {
    try {
      return await workoutFacadeService.getGenderGroupedStatistics();
    } catch (error) {
      devLog("⚠️ Failed to load statistics, using null", error);
      logger.warn("DataManager", "Failed to load statistics", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Safe loading: טעינת הודעת ברכה עם error handling
   */
  private async _safeLoadCongratulationMessage(): Promise<string | null> {
    try {
      return await workoutFacadeService.getLatestCongratulationMessage();
    } catch (error) {
      devLog("⚠️ Failed to load congratulation message, using null", error);
      logger.warn("DataManager", "Failed to load congratulation message", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * לוג מפורט של כל נתוני המשתמש והמערכת (רק במצב VERBOSE)
   */
  private _logCompleteUserData(user: User) {
    if (!LOGGING.VERBOSE) return;

    logger.debug("DataManager", "📊 COMPLETE USER DATA SUMMARY", {
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
        hasQuestionnaire: !!user.questionnaire,
        hasSmartQuestionnaire: !!user.smartquestionnairedata,
        hasActivityHistory: !!user.activityhistory,
        hasScientificProfile: !!user.scientificprofile,
        hasAIRecommendations: !!user.airecommendations,
      },
      activityHistory: {
        totalWorkouts: user.activityhistory?.workouts?.length || 0,
        weeklyProgress: user.activityhistory?.weeklyProgress || 0,
      },
      cache: {
        status: this.isReady() ? "Ready" : "Not Ready",
        type: this.cache?.isDemo ? "Demo Data" : "Real Data",
        lastUpdated: this.cache?.lastUpdated?.toISOString(),
        workoutsCount: this.cache?.workoutHistory?.length || 0,
        hasStatistics: !!this.cache?.statistics,
        hasCongratulation: !!this.cache?.congratulationMessage,
      },
      system: {
        isInitialized: this.isInitialized,
        hasCache: !!this.cache,
        serverEnabled: this.serverConfig.enabled,
        serverReachable: this.serverReachable,
      },
    });
  }
}

// יצירת instance יחיד עבור כל האפליקציה - Singleton Pattern
export const dataManager = new DataManagerService();
