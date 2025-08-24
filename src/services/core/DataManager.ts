/**
 * @file src/services/core/DataManager.ts
 * @brief מנהל נתונים מרכזי – מכין ומטמון נתונים בעת עליית האפליקציה ותומך בהתרחבות עתידית לשרת
 * @brief Central Data Manager – initializes & caches core data at app startup (server-ready architecture)
 * @dependencies userStore, workoutFacadeService, userApi, logger
 * @updated 2025-08-25 החלפת console logs במערכת logger מרכזית, פישוט logging מורכב
 *
 * ✅ ACTIVE & CRITICAL / בשימוש פעיל
 * - מספק היסטוריית אימונים, סטטיסטיקות והודעות ברכה למסכים שונים
 * - Singleton pattern (instance יחיד)
 * - In-memory caching להפחתת גישות חוזרות
 * - Graceful fallback מקומי אם שרת לא זמין
 * - מוכן להרחבת סנכרון דו-כיווני בעתיד
 *
 * @architecture Central data hub with smart caching and server preparation
 * @usage 20+ files depend on this service across the application
 * @performance In-memory caching reduces redundant data fetching
 * @scalability Ready for server integration and sync capabilities
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
    syncInterval: 30, // 30 minutes default
  };
  private serverReachable: boolean = true;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  /**
   * אתחול המערכת - ייקרא פעם אחת בהפעלת האפליקציה
   */
  async initialize(user: User): Promise<void> {
    if (this.isInitialized && this.cache) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._performInitialization(user);
    await this.initPromise;
  }

  private async _performInitialization(user: User): Promise<void> {
    try {
      // בדיקת זמינות שרת לפני טעינה
      this.serverReachable = await this._checkServerHealth();
      devLog("🌐 Server reachable:", this.serverReachable);
      devLog("🚀 Starting initialization...");
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
      devLog("✅ Initialization completed");
    } catch (error) {
      logger.error("DataManager", "Initialization failed", error);
      errorHandler.reportError(error, { source: "DataManager.initialize" });
      // במקרה של כשל, ננסה לטעון נתונים מקומיים
      await this._loadFromLocalSources(user);
      this.isInitialized = true;
    }
  }

  /**
   * בדיקת בריאות שרת
   */
  private async _checkServerHealth(): Promise<boolean> {
    try {
      const res = await userApi.health();
      return Boolean(res);
    } catch {
      return false;
    }
  }

  /**
   * טעינה מהשרת (עתידי)
   */
  private async _loadFromServer(user: User): Promise<void> {
    try {
      devLog("🌐 Loading from server...");

      // כאן יהיה הקוד לטעינה מהשרת בעתיד
      // const serverData = await this._fetchFromServer(user.id);

      // לעת עתה, נשתמש בנתונים מקומיים
      await this._loadFromLocalSources(user);

      // נסמן שהנתונים באו מהשרת
      if (this.cache) {
        this.cache.isDemo = false;
      }
    } catch (error) {
      logger.error(
        "DataManager",
        "Server loading failed, falling back to local",
        error
      );
      errorHandler.reportError(error, {
        source: "DataManager._loadFromServer",
      });
      await this._loadFromLocalSources(user);
    }
  }

  /**
   * טעינה ממקורות מקומיים
   */
  private async _loadFromLocalSources(_user: User): Promise<void> {
    // אין שימוש בדמו – תמיד נטען נתונים אמיתיים
    const isDemo = false;

    devLog(`📦 Loading from ${isDemo ? "demo" : "user"} sources...`);

    const [workoutHistory, statistics, congratulationMessage] =
      await Promise.all([
        workoutFacadeService.getHistory(),
        workoutFacadeService.getGenderGroupedStatistics(),
        workoutFacadeService.getLatestCongratulationMessage(),
      ]);

    this.cache = {
      workoutHistory,
      statistics,
      congratulationMessage,
      lastUpdated: new Date(),
      isDemo,
    };

    devLog(
      `✅ Loaded ${workoutHistory.length} workouts (${isDemo ? "demo" : "real"})`
    );
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
   * @param {User} user - נתוני המשתמש לרענון
   */
  async refresh(user: User): Promise<void> {
    devLog("🔄 Refreshing data...");
    this.isInitialized = false;
    this.cache = null;
    this.initPromise = null;
    await this.initialize(user);
  }

  /**
   * הגדרת תצורת שרת עתידית
   * @param {Partial<ServerConfig>} config - תצורת שרת חלקית לעדכון
   */
  configureServer(config: Partial<ServerConfig>): void {
    this.serverConfig = { ...this.serverConfig, ...config };
    devLog("🔧 Server config updated", this.serverConfig);
  }

  /**
   * סנכרון עם שרת - פונקציונליות עתידית (לא מיושמת)
   */
  async syncWithServer(_user: User): Promise<void> {
    if (!this.serverConfig.enabled) {
      devLog("🌐 Server sync disabled");
      return;
    }

    logger.info("DataManager", "Sync with server not yet implemented");
    // TODO: Implement server sync functionality
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
