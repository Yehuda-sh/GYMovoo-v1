/**
 * @file src/services/core/DataManager.ts
 * @brief מנהל נתונים מרכזי - יכין נתונים בכניסה ויתמוך בשרת בעתיד
 * @brief Central Data Manager - prepares data at startup and supports future server integration
 * @dependencies userStore, demoHistoryService, workoutHistoryService
 * @updated 2025-08-10 מערכת חדשה למרכוז ניהול נתונים
 */

import { User } from "../../stores/userStore";
import {
  WorkoutWithFeedback,
  WorkoutStatistics,
} from "../../screens/workout/types/workout.types";
import { demoHistoryService } from "../demo/demoHistoryService";
import { workoutHistoryService } from "../workoutHistoryService";

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

class DataManagerService {
  private cache: AppDataCache | null = null;
  private serverConfig: ServerConfig = {
    enabled: false,
    syncInterval: 30, // 30 minutes default
  };
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
      console.warn("🚀 DataManager: Starting initialization...");
      console.warn("👤 DataManager: User data preview:", {
        id: user.id,
        name: user.name,
        email: user.email,
        hasQuestionnaire: !!user.questionnaire,
        hasSmartQuestionnaire: !!user.smartQuestionnaireData,
        hasActivityHistory: !!user.activityHistory,
        workoutsCount: user.activityHistory?.workouts?.length || 0,
        hasScientificProfile: !!user.scientificProfile,
      });

      // בדיקה אם יש נתונים בשרת (עתידי)
      if (this.serverConfig.enabled) {
        await this._loadFromServer(user);
      } else {
        await this._loadFromLocalSources(user);
      }

      // 📊 לוג מפורט של כל הנתונים שנוצרו
      this._logCompleteUserData(user);

      this.isInitialized = true;
      console.warn("✅ DataManager: Initialization completed");
    } catch (error) {
      console.error("❌ DataManager: Initialization failed", error);
      // במקרה של כשל, ננסה לטעון נתונים מקומיים
      await this._loadFromLocalSources(user);
      this.isInitialized = true;
    }
  }

  /**
   * טעינה מהשרת (עתידי)
   */
  private async _loadFromServer(user: User): Promise<void> {
    try {
      console.warn("🌐 DataManager: Loading from server...");

      // כאן יהיה הקוד לטעינה מהשרת בעתיד
      // const serverData = await this._fetchFromServer(user.id);

      // לעת עתה, נשתמש בנתונים מקומיים
      await this._loadFromLocalSources(user);

      // נסמן שהנתונים באו מהשרת
      if (this.cache) {
        this.cache.isDemo = false;
      }
    } catch (error) {
      console.error(
        "🌐❌ DataManager: Server loading failed, falling back to local",
        error
      );
      await this._loadFromLocalSources(user);
    }
  }

  /**
   * טעינה ממקורות מקומיים
   */
  private async _loadFromLocalSources(user: User): Promise<void> {
    const isDemo = __DEV__ || !user?.activityHistory?.workouts?.length;

    console.warn(
      `📦 DataManager: Loading from ${isDemo ? "demo" : "user"} sources...`
    );

    let workoutHistory: WorkoutWithFeedback[] = [];
    let statistics: WorkoutStatistics | null = null;
    let congratulationMessage: string | null = null;

    if (isDemo) {
      // נתוני דמו מלאים
      [workoutHistory, statistics, congratulationMessage] = await Promise.all([
        demoHistoryService.getWorkoutHistory(user),
        demoHistoryService.getStatistics(user),
        demoHistoryService.getCongratulationMessage(user),
      ]);
    } else {
      // נתוני משתמש אמיתיים
      [workoutHistory, statistics, congratulationMessage] = await Promise.all([
        workoutHistoryService.getWorkoutHistory(),
        workoutHistoryService.getGenderGroupedStatistics(),
        workoutHistoryService.getLatestCongratulationMessage(),
      ]);
    }

    this.cache = {
      workoutHistory,
      statistics,
      congratulationMessage,
      lastUpdated: new Date(),
      isDemo,
    };

    console.warn(
      `✅ DataManager: Loaded ${workoutHistory.length} workouts (${isDemo ? "demo" : "real"})`
    );
  }

  /**
   * קבלת נתוני אימונים
   */
  getWorkoutHistory(): WorkoutWithFeedback[] {
    if (!this.cache) {
      console.warn(
        "⚠️ DataManager: Cache not initialized, returning empty array"
      );
      return [];
    }
    return this.cache.workoutHistory;
  }

  /**
   * קבלת סטטיסטיקות
   */
  getStatistics(): WorkoutStatistics | null {
    if (!this.cache) {
      console.warn("⚠️ DataManager: Cache not initialized, returning null");
      return null;
    }
    return this.cache.statistics;
  }

  /**
   * קבלת הודעת ברכה
   */
  getCongratulationMessage(): string | null {
    if (!this.cache) {
      console.warn("⚠️ DataManager: Cache not initialized, returning null");
      return null;
    }
    return this.cache.congratulationMessage;
  }

  /**
   * בדיקה האם המערכת מאותחלת
   */
  isReady(): boolean {
    return this.isInitialized && this.cache !== null;
  }

  /**
   * קבלת מצב הנתונים
   */
  getDataStatus(): {
    isDemo: boolean;
    lastUpdated: Date | null;
    ready: boolean;
  } {
    return {
      isDemo: this.cache?.isDemo ?? true,
      lastUpdated: this.cache?.lastUpdated ?? null,
      ready: this.isReady(),
    };
  }

  /**
   * רענון נתונים (לשימוש ב-refresh)
   */
  async refresh(user: User): Promise<void> {
    console.warn("🔄 DataManager: Refreshing data...");
    this.isInitialized = false;
    this.cache = null;
    this.initPromise = null;
    await this.initialize(user);
  }

  /**
   * הגדרת תצורת שרת (לעתיד)
   */
  configureServer(config: Partial<ServerConfig>): void {
    this.serverConfig = { ...this.serverConfig, ...config };
    console.warn("🔧 DataManager: Server config updated", this.serverConfig);
  }

  /**
   * סנכרון עם שרת (עתידי)
   */
  async syncWithServer(_user: User): Promise<void> {
    if (!this.serverConfig.enabled) {
      console.warn("🌐 DataManager: Server sync disabled");
      return;
    }

    try {
      console.warn("🔄 DataManager: Syncing with server...");

      // כאן יהיה הקוד לסנכרון עם שרת בעתיד
      // await this._uploadToServer(_user, this.cache);
      // await this._downloadFromServer(_user);

      console.warn("✅ DataManager: Sync completed");
    } catch (error) {
      console.error("❌ DataManager: Sync failed", error);
    }
  }

  /**
   * ניקוי נתונים (לדיבוג)
   */
  clearCache(): void {
    console.warn("🗑️ DataManager: Clearing cache");
    this.cache = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * לוג מפורט של כל נתוני המשתמש והמערכת
   */
  private _logCompleteUserData(user: User): void {
    console.warn("📊 ========== DATA MANAGER - COMPLETE USER DATA ==========");

    // 👤 נתוני משתמש בסיסיים
    console.warn("👤 === USER BASIC DATA ===");
    console.warn("• User ID:", user.id);
    console.warn("• User Name:", user.name);
    console.warn("• User Email:", user.email);
    console.warn("• User Avatar:", user.avatar);
    console.warn("• User Provider:", user.provider);

    // 🧠 נתוני שאלון חכם
    if (user.smartQuestionnaireData) {
      console.warn("🧠 === SMART QUESTIONNAIRE DATA ===");
      console.warn(
        "• Smart Questionnaire Complete Object:",
        user.smartQuestionnaireData
      );
    }

    // 📜 נתוני שאלון ישן (לתאימות)
    if (user.questionnaire) {
      console.warn("📜 === LEGACY QUESTIONNAIRE ===");
      console.warn("• Legacy Answers:", user.questionnaire);
    }

    if (user.questionnaireData) {
      console.warn("📜 === LEGACY QUESTIONNAIRE DATA ===");
      console.warn("• Legacy Data Complete Object:", user.questionnaireData);
    }

    // 🔬 פרופיל מדעי
    if (user.scientificProfile) {
      console.warn("🔬 === SCIENTIFIC PROFILE ===");
      console.warn(
        "• Scientific Profile Complete Object:",
        user.scientificProfile
      );
    }

    // 🤖 המלצות AI
    if (user.aiRecommendations) {
      console.warn("🤖 === AI RECOMMENDATIONS ===");
      console.warn(
        "• AI Recommendations Complete Object:",
        user.aiRecommendations
      );
    }

    // 📈 היסטוריית פעילות
    if (user.activityHistory) {
      console.warn("📈 === ACTIVITY HISTORY ===");
      console.warn(
        "• Total Workouts:",
        user.activityHistory.workouts?.length || 0
      );
      console.warn(
        "• Weekly Progress:",
        user.activityHistory.weeklyProgress || 0
      );
      console.warn("• Activity History Complete Object:", user.activityHistory);

      if (
        user.activityHistory.workouts &&
        user.activityHistory.workouts.length > 0
      ) {
        console.warn("🏋️ === WORKOUTS PREVIEW (First 3) ===");
        user.activityHistory.workouts.slice(0, 3).forEach((workout, index) => {
          console.warn(`• Workout ${index + 1}:`, {
            name: workout.name,
            date: workout.date || workout.completedAt,
            duration: `${Math.round((workout.duration || 0) / 60)} minutes`,
            exercises: workout.exercises?.length || 0,
            difficulty: workout.feedback?.overallRating || "N/A",
            hasPlannedVsActual: !!workout.plannedVsActual,
          });
        });
        if (user.activityHistory.workouts.length > 3) {
          console.warn(
            `• ... and ${user.activityHistory.workouts.length - 3} more workouts`
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

// יצירת instance יחיד
export const dataManager = new DataManagerService();
