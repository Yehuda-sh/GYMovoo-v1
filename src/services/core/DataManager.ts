/**
 * @file src/services/core/DataManager.ts
 * @brief מנהל נתונים מרכזי – מכין ומטמון נתונים בעת עליית האפליקציה ותומך בהתרחבות עתידית לשרת
 * @brief Central Data Manager – initializes & caches core data at app startup (server-ready architecture)
 * @dependencies userStore, workoutFacadeService, userApi
 * @updated 2025-01-17 מערכת חדשה למרכוז ניהול נתונים
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const devLog = (...args: any[]) => {
  if (__DEV__ && LOGGING.DATA_MANAGER_SUMMARY)
    console.warn("[DataManager]", ...args);
};

export interface AppDataCache {
  workoutHistory: WorkoutWithFeedback[];
  statistics: WorkoutStatistics | null;
  congratulationMessage: string | null;
  lastUpdated: Date;
  isDemo: boolean;
}

export interface ServerConfig {
  baseUrl?: string;
  apiKey?: string;
  enabled: boolean;
  syncInterval: number; // minutes
}

export interface DataStatus {
  isDemo: boolean;
  lastUpdated: Date | null;
  ready: boolean;
  serverReachable: boolean;
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
        console.warn("[DataManager] 👤 User data preview:", {
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
   * סנכרון עם שרת - פונקציונליות עתידית מתקדמת
   * @param {User} _user - נתוני המשתמש לסנכרון
   */
  async syncWithServer(_user: User): Promise<void> {
    if (!this.serverConfig.enabled) {
      devLog("🌐 Server sync disabled");
      return;
    }

    try {
      devLog("🔄 Syncing with server...");

      // כאן יהיה הקוד לסנכרון עם שרת בעתיד
      // await this._uploadToServer(_user, this.cache);
      // await this._downloadFromServer(_user);

      devLog("✅ Sync completed");
    } catch (error) {
      logger.error("DataManager", "Sync failed", error);
      errorHandler.reportError(error, { source: "DataManager.sync" });
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
   * Helper: unify cache-not-ready warning & return cache (DEV only logs)
   */
  private _getCacheOrWarn(): AppDataCache | null {
    if (!this.cache) {
      devLog("⚠️ Cache not initialized");
      return null;
    }
    return this.cache;
  }

  /**
   * לוג מפורט של כל נתוני המשתמש והמערכת
   */
  private _logCompleteUserData(user: User) {
    console.warn("📊 ========== DATA MANAGER - COMPLETE USER DATA ==========");

    // 👤 נתוני משתמש בסיסיים
    console.warn("👤 === USER BASIC DATA ===");
    console.warn("• User ID:", user.id);
    console.warn("• User Name:", user.name);
    console.warn("• User Email:", user.email);
    console.warn("• User Avatar:", user.avatar);
    console.warn("• User Provider:", user.provider);

    // 🧠 נתוני שאלון חכם
    if (user.smartquestionnairedata) {
      console.warn("🧠 === SMART QUESTIONNAIRE DATA ===");
      console.warn(
        "• Smart Questionnaire Complete Object:",
        user.smartquestionnairedata
      );
    }

    // 📜 נתוני שאלון ישן (לתאימות)
    if (user.questionnaire) {
      console.warn("📜 === LEGACY QUESTIONNAIRE ===");
      console.warn("• Legacy Answers:", user.questionnaire);
    }

    if (user.questionnairedata) {
      console.warn("📜 === LEGACY QUESTIONNAIRE DATA ===");
      console.warn("• Legacy Data Complete Object:", user.questionnairedata);
    }

    // 🔬 פרופיל מדעי
    if (user.scientificprofile) {
      console.warn("🔬 === SCIENTIFIC PROFILE ===");
      console.warn(
        "• Scientific Profile Complete Object:",
        user.scientificprofile
      );
    }

    // 🤖 המלצות AI
    if (user.airecommendations) {
      console.warn("🤖 === AI RECOMMENDATIONS ===");
      console.warn(
        "• AI Recommendations Complete Object:",
        user.airecommendations
      );
    }

    // 📈 היסטוריית פעילות
    if (user.activityhistory) {
      console.warn("📈 === ACTIVITY HISTORY ===");
      console.warn(
        "• Total Workouts:",
        user.activityhistory.workouts?.length || 0
      );
      console.warn(
        "• Weekly Progress:",
        user.activityhistory.weeklyProgress || 0
      );
      console.warn("• Activity History Complete Object:", user.activityhistory);

      if (
        user.activityhistory.workouts &&
        user.activityhistory.workouts.length > 0
      ) {
        console.warn("🏋️ === WORKOUTS PREVIEW (First 3) ===");
        type PreviewWorkout = {
          name?: string;
          date?: string;
          completedAt?: string;
          duration?: number;
          exercises?: unknown[];
          feedback?: { overallRating?: number | string };
          plannedVsActual?: unknown;
        };
        (user.activityhistory.workouts as PreviewWorkout[])
          .slice(0, 3)
          .forEach((workout, index: number) => {
            console.warn(`• Workout ${index + 1}:`, {
              name: workout.name,
              date: workout.date || workout.completedAt,
              duration: `${Math.round((workout.duration || 0) / 60)} minutes`,
              exercises: workout.exercises?.length || 0,
              difficulty: workout.feedback?.overallRating || "N/A",
              hasPlannedVsActual: !!workout.plannedVsActual,
            });
          });
        if (user.activityhistory.workouts.length > 3) {
          console.warn(
            `• ... and ${user.activityhistory.workouts.length - 3} more workouts`
          );
        }
      }
    }

    // 📊 נתוני Cache המערכת
    if (this.cache) {
      console.warn("💾 === SYSTEM CACHE DATA ===");
      console.warn(
        "• Cache Status:",
        this.isReady() ? "✅ Ready" : "❌ Not Ready"
      );
      console.warn(
        "• Cache Type:",
        this.cache.isDemo ? "🎭 Demo Data" : "👤 Real Data"
      );
      console.warn(
        "• Last Updated:",
        this.cache.lastUpdated.toLocaleString("he-IL")
      );
      console.warn(
        "• Cached Workouts Count:",
        this.cache.workoutHistory.length
      );
      console.warn("• Has Statistics:", !!this.cache.statistics);
      console.warn("• Has Congratulation:", !!this.cache.congratulationMessage);

      if (this.cache.statistics) {
        console.warn("• Statistics Summary:", {
          totalWorkouts: this.cache.statistics.total?.totalWorkouts || 0,
          avgDifficulty:
            this.cache.statistics.total?.averageDifficulty?.toFixed(1) || "N/A",
          totalDuration: `${Math.round((this.cache.statistics.total?.totalDuration || 0) / 60)} minutes`,
        });
      }

      if (this.cache.congratulationMessage) {
        console.warn(
          "• Congratulation Message:",
          this.cache.congratulationMessage
        );
      }

      // דוגמת אימונים מה-Cache
      if (this.cache.workoutHistory.length > 0) {
        console.warn("📋 === CACHE WORKOUTS PREVIEW (First 2) ===");
        this.cache.workoutHistory.slice(0, 2).forEach((workout, index) => {
          console.warn(`• Cache Workout ${index + 1}:`, {
            id: workout.id,
            name: workout.workout.name,
            duration: `${Math.round((workout.stats.duration || 0) / 60)} minutes`,
            totalSets: workout.stats.totalSets,
            personalRecords: workout.stats.personalRecords,
            difficulty: workout.feedback.difficulty,
            feeling: workout.feedback.feeling,
          });
        });
      }
    }

    console.warn("🎯 === DATAMANAGER STATUS ===");
    console.warn("• Is Initialized:", this.isInitialized);
    console.warn("• Has Cache:", !!this.cache);
    console.warn("• Server Enabled:", this.serverConfig.enabled);
    console.warn(
      "• Data Source:",
      this.cache?.isDemo ? "Demo Service" : "Real User Data"
    );

    console.warn("📊 ========== END COMPLETE USER DATA ==========");
  }
}

// יצירת instance יחיד עבור כל האפליקציה - Singleton Pattern
export const dataManager = new DataManagerService();
