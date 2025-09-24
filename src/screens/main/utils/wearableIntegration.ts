/**
 *
 * @file  /src/screens/main/utils/wearableIntegration.ts
 * @description אינטגרציה עם מכשירי wearable (שעונים חכמים, צמידי כושר)
 */

import { logger } from "../../../utils/logger";
import type {
  WearableData,
  WearableConnectionStatus,
} from "../types/aiRecommendations.types";

/**
 * מחלקה לניהול אינטגרציה עם wearables (Singleton)
 */
export class WearableIntegration {
  private static instance: WearableIntegration;

  private connectionStatus: WearableConnectionStatus = {
    isConnected: false,
    deviceType: "unknown",
    permissions: {
      heartRate: false,
      steps: false,
      calories: false,
      sleep: false,
      workouts: false,
    },
  };

  private retryCount = 0;
  private readonly maxRetries = 3;
  private readonly baseBackoffMs = 800; // בסיס לעיכוב אקספוננציאלי

  // בנאי פרטי כדי להבטיח Singleton
  private constructor() {}

  public static getInstance(): WearableIntegration {
    if (!WearableIntegration.instance) {
      WearableIntegration.instance = new WearableIntegration();
    }
    return WearableIntegration.instance;
  }

  /**
   * בדיקת זמינות ובקשת הרשאות עם retry + backoff
   */
  public async requestPermissions(): Promise<boolean> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        logger.info("WearableIntegration", "Simulating permission request", {
          attempt: attempt + 1,
          maxAttempts: this.maxRetries + 1,
        });

        // הדמיה של בקשת הרשאות
        await this.simulatePermissionRequest();

        this.connectionStatus = {
          isConnected: true,
          deviceName: "Apple Watch (הדמיה)",
          deviceType: "apple_health",
          lastSync: new Date().toISOString(),
          permissions: {
            heartRate: true,
            steps: true,
            calories: true,
            sleep: true,
            workouts: false, // נדרשת הרשאה נוספת
          },
        };

        logger.info("WearableIntegration", "Wearable connected successfully", {
          deviceType: this.connectionStatus.deviceType,
          deviceName: this.connectionStatus.deviceName,
          attempt: attempt + 1,
        });

        this.retryCount = 0; // איפוס ספירת ניסיונות
        return true;
      } catch (error) {
        this.retryCount = attempt + 1;

        if (attempt === this.maxRetries) {
          // ניסיון אחרון נכשל
          logger.warn(
            "WearableIntegration",
            "Failed to connect wearable after all retries - using fallback mode",
            {
              error: error instanceof Error ? error.message : String(error),
              totalAttempts: this.maxRetries + 1,
            }
          );

          // חזרה למצב לא מחובר
          this.connectionStatus = {
            isConnected: false,
            deviceType: "unknown",
            permissions: {
              heartRate: false,
              steps: false,
              calories: false,
              sleep: false,
              workouts: false,
            },
          };

          return false;
        }

        // Backoff לפני ניסיון נוסף
        const jitter = Math.floor(Math.random() * 250);
        const delay =
          Math.min(4000, this.baseBackoffMs * 2 ** attempt) + jitter;

        logger.warn(
          "WearableIntegration",
          `Retry attempt ${attempt + 1} failed, trying again...`,
          {
            error: error instanceof Error ? error.message : String(error),
            nextAttempt: attempt + 2,
            delayMs: delay,
          }
        );

        await this.sleep(delay);
      }
    }

    return false;
  }

  /**
   * קבלת נתונים מ-wearable
   */
  public async getHealthData(): Promise<WearableData | null> {
    if (!this.connectionStatus.isConnected) {
      logger.warn("WearableIntegration", "No wearable connected");
      return null;
    }

    try {
      logger.info("WearableIntegration", "Fetching health data from wearable");

      // הדמיית נתונים
      const mockData: WearableData = await this.generateMockHealthData();

      // עדכון זמן סנכרון אחרון
      this.connectionStatus = {
        ...this.connectionStatus,
        lastSync: new Date().toISOString(),
      };

      return mockData;
    } catch (error) {
      logger.error("WearableIntegration", "Failed to fetch health data", error);
      return null;
    }
  }

  /**
   * קבלת סטטוס החיבור (העתק קריא בלבד)
   */
  public getConnectionStatus(): WearableConnectionStatus {
    return { ...this.connectionStatus };
  }

  /**
   * קבלת מספר הניסיונות שנעשו
   */
  public getRetryCount(): number {
    return this.retryCount;
  }

  /**
   * ניתוק מ-wearable
   */
  public async disconnect(): Promise<void> {
    try {
      logger.info("WearableIntegration", "Disconnecting from wearable");

      this.connectionStatus = {
        isConnected: false,
        deviceType: "unknown",
        permissions: {
          heartRate: false,
          steps: false,
          calories: false,
          sleep: false,
          workouts: false,
        },
      };
    } catch (error) {
      logger.error("WearableIntegration", "Error during disconnect", error);
    }
  }

  /**
   * הדמיה של בקשת הרשאות
   */
  private async simulatePermissionRequest(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        try {
          // הדמיית הצלחה ב-95% מהמקרים
          const success = Math.random() > 0.05;
          if (!success) {
            reject(new Error("User denied permissions"));
          } else {
            resolve();
          }
        } catch (err) {
          reject(err);
        }
      }, 1000);

      // אין צורך להחזיר פונקציית ניקוי מתוך Promise constructor
      // (זה דפוס של useEffect בלבד)
      void timeoutId;
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
  }

  /**
   * יצירת נתוני בריאות מדומים לצורך הדגמה
   */
  private async generateMockHealthData(): Promise<WearableData> {
    await this.sleep(500);

    const now = new Date().toISOString();

    return {
      heartRate: {
        current: Math.floor(Math.random() * 40) + 60, // 60-100
        resting: Math.floor(Math.random() * 20) + 50, // 50-70
        max: Math.floor(Math.random() * 30) + 170, // 170-200
        timestamp: now,
      },
      steps: {
        count: Math.floor(Math.random() * 8000) + 2000, // 2000-10000
        goal: 10000,
        distance: parseFloat((Math.random() * 6 + 1).toFixed(1)), // 1-7 km
        timestamp: now,
      },
      calories: {
        burned: Math.floor(Math.random() * 800) + 200, // 200-1000
        goal: 2000,
        active: Math.floor(Math.random() * 500) + 100, // 100-600
        resting: Math.floor(Math.random() * 200) + 1400, // 1400-1600
        timestamp: now,
      },
      sleep: {
        duration: parseFloat((Math.random() * 3 + 6).toFixed(1)), // 6-9 hours
        quality:
          (["poor", "fair", "good", "excellent"] as const)[
            Math.floor(Math.random() * 4)
          ] || "fair",
        deepSleep: parseFloat((Math.random() * 2 + 1).toFixed(1)), // 1-3 hours
        remSleep: parseFloat((Math.random() * 2 + 1).toFixed(1)), // 1-3 hours
        timestamp: now,
      },
      activity: {
        activeMinutes: Math.floor(Math.random() * 120) + 30, // 30-150
        goal: 150,
        zones: {
          fat_burn: Math.floor(Math.random() * 60) + 10, // 10-70
          cardio: Math.floor(Math.random() * 30) + 5, // 5-35
          peak: Math.floor(Math.random() * 15) + 2, // 2-17
        },
        timestamp: now,
      },
    };
  }

  /**
   * חישוב ציון בריאות כללי (0-100), מנרמל לפי כמה תחומים קיימים
   */
  public calculateHealthScore(data: WearableData): number {
    let score = 0;
    let factors = 0;

    // צעדים
    if (data.steps) {
      const stepsRatio = Math.min(1, data.steps.count / data.steps.goal);
      score += stepsRatio * 25;
      factors++;
    }

    // קלוריות
    if (data.calories) {
      const caloriesRatio = Math.min(
        1,
        data.calories.burned / (data.calories.goal * 0.3)
      ); // 30% מהיעד
      score += caloriesRatio * 25;
      factors++;
    }

    // שינה
    if (data.sleep) {
      const sleepBase =
        data.sleep.duration >= 7 ? 25 : (data.sleep.duration / 7) * 25;
      const qualityMultiplier = {
        poor: 0.5,
        fair: 0.7,
        good: 0.9,
        excellent: 1.0,
      } as const;
      score += sleepBase * qualityMultiplier[data.sleep.quality];
      factors++;
    }

    // פעילות
    if (data.activity) {
      const activityRatio = Math.min(
        1,
        data.activity.activeMinutes / data.activity.goal
      );
      score += activityRatio * 25;
      factors++;
    }

    // נרמול: גם אם יש רק 2/3 תחומים, מדרגים לסולם 0-100
    return factors > 0 ? Math.round((score / factors) * 4) : 0;
  }
}
