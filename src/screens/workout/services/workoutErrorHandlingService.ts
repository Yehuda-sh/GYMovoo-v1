/**
 * @file src/screens/workout/services/workoutErrorHandlingService.ts
 * @description שירות טיפול בשגיאות עבור אימונים
 * English: Workout error handling service
 * @inspired מהטיפול המוצלח בשגיאות במסך ההיסטוריה
 */

import { Alert } from "react-native";
import { WorkoutData } from "../types/workout.types";
import workoutValidationService from "./workoutValidationService";

interface ErrorContext {
  operation: string;
  workoutId?: string;
  timestamp: string;
  additionalInfo?: Record<string, any>;
}

interface RecoveryStrategy {
  type: "retry" | "fallback" | "user_action" | "ignore";
  action?: () => Promise<void>;
  message?: string;
}

class WorkoutErrorHandlingService {
  private static instance: WorkoutErrorHandlingService;
  private errorLog: Array<{ error: Error; context: ErrorContext }> = [];

  static getInstance(): WorkoutErrorHandlingService {
    if (!WorkoutErrorHandlingService.instance) {
      WorkoutErrorHandlingService.instance = new WorkoutErrorHandlingService();
    }
    return WorkoutErrorHandlingService.instance;
  }

  /**
   * טיפול בשגיאות שמירה אוטומטית (מבוסס על autoSaveService)
   */
  async handleAutoSaveError(
    error: unknown,
    workout: WorkoutData,
    retryCallback: () => Promise<void>
  ): Promise<RecoveryStrategy> {
    const errorObj = error as { code?: number; message?: string };
    const context: ErrorContext = {
      operation: "auto_save",
      workoutId: workout.id,
      timestamp: new Date().toISOString(),
      additionalInfo: { workoutName: workout.name },
    };

    this.logError(error as Error, context);

    // טיפול בשגיאות מסד נתונים מלא (כמו ב-autoSaveService)
    if (errorObj?.code === 13 || errorObj?.message?.includes("SQLITE_FULL")) {
      return {
        type: "user_action",
        message: "אחסון מלא - יש לפנות מקום או לייצא נתונים",
        action: async () => {
          Alert.alert(
            "שגיאת אחסון",
            "מקום האחסון מלא. האם תרצה לנסות לפנות מקום?",
            [
              { text: "ביטול", style: "cancel" },
              {
                text: "נקה נתונים ישנים",
                onPress: () => this.cleanOldData(),
              },
            ]
          );
        },
      };
    }

    // טיפול בשגיאות מכסת אחסון (כמו ב-autoSaveService)
    if (
      errorObj?.message?.includes("storage full") ||
      errorObj?.message?.includes("QUOTA_EXCEEDED")
    ) {
      return {
        type: "fallback",
        message: "מעבר לשמירה מקומית בלבד",
        action: async () => {
          // שמירה במטמון זמני
          await this.saveToTemporaryCache(workout);
        },
      };
    }

    // שגיאות רשת
    if (
      errorObj?.message?.includes("network") ||
      errorObj?.message?.includes("timeout")
    ) {
      return {
        type: "retry",
        message: "בעיית רשת - ינוסה שוב",
        action: retryCallback,
      };
    }

    // שגיאות וידואי נתונים
    const validation = workoutValidationService.validateWorkoutData(workout);
    if (!validation.isValid) {
      return {
        type: "fallback",
        message: "נתונים לא תקינים - יישמרו נתונים מתוקנים",
        action: async () => {
          if (validation.correctedData) {
            await retryCallback();
          }
        },
      };
    }

    // ברירת מחדל - ניסיון חוזר
    return {
      type: "retry",
      action: retryCallback,
    };
  }

  /**
   * טיפול בשגיאות טעינת נתונים (מבוסס על ההצלחה בהיסטוריה)
   */
  async handleDataLoadError(
    error: unknown,
    operation: string,
    fallbackData?: any
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    const context: ErrorContext = {
      operation,
      timestamp: new Date().toISOString(),
    };

    this.logError(error as Error, context);

    const errorObj = error as { message?: string };

    // טיפול בשגיאות פירסור JSON (כמו בהיסטוריה)
    if (errorObj?.message?.includes("JSON")) {
      if (fallbackData) {
        console.warn("📁 Using fallback data due to JSON parse error");
        return {
          success: true,
          data: fallbackData,
          message: "נטענו נתונים מהמטמון",
        };
      } else {
        return {
          success: false,
          message: "שגיאה בקריאת נתונים",
        };
      }
    }

    // שגיאות גישה לקובץ
    if (
      errorObj?.message?.includes("permission") ||
      errorObj?.message?.includes("access")
    ) {
      return {
        success: false,
        message: "אין הרשאה לגשת לנתונים",
      };
    }

    // ברירת מחדל
    return {
      success: false,
      message: "שגיאה בטעינת נתונים",
    };
  }

  /**
   * טיפול בשגיאות תאריכים (מבוסס על formatDateHebrewLocal מההיסטוריה)
   */
  handleDateError(dateString: any, context: string): string {
    this.logError(new Error(`Invalid date: ${dateString}`), {
      operation: "date_formatting",
      timestamp: new Date().toISOString(),
      additionalInfo: { context, originalValue: dateString },
    });

    // החזרת ערך ברירת מחדל מתאים (כמו בהיסטוריה)
    switch (context) {
      case "workout_completion":
        return "זמן לא זמין";
      case "workout_start":
        return "התחיל עכשיו";
      case "history_display":
        return "תאריך לא תקין";
      default:
        return "תאריך לא זמין";
    }
  }

  /**
   * רישום שגיאות למעקב
   */
  private logError(error: Error, context: ErrorContext): void {
    this.errorLog.push({ error, context });

    // שמירת רק 100 השגיאות האחרונות
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    console.error(`❌ [${context.operation}] Error:`, error.message, context);
  }

  /**
   * ניקוי נתונים ישנים
   */
  private async cleanOldData(): Promise<void> {
    // כאן יהיה הקוד לניקוי נתונים ישנים
    console.log("🧹 Cleaning old data...");
  }

  /**
   * שמירה למטמון זמני
   */
  private async saveToTemporaryCache(workout: WorkoutData): Promise<void> {
    // כאן יהיה הקוד לשמירה במטמון זמני
    console.log("💾 Saving to temporary cache:", workout.name);
  }

  /**
   * קבלת סיכום שגיאות
   */
  getErrorSummary(): {
    totalErrors: number;
    recentErrors: Array<{
      operation: string;
      message: string;
      timestamp: string;
    }>;
    commonIssues: Record<string, number>;
  } {
    const recentErrors = this.errorLog.slice(-10).map((entry) => ({
      operation: entry.context.operation,
      message: entry.error.message,
      timestamp: entry.context.timestamp,
    }));

    const commonIssues: Record<string, number> = {};
    this.errorLog.forEach((entry) => {
      const operation = entry.context.operation;
      commonIssues[operation] = (commonIssues[operation] || 0) + 1;
    });

    return {
      totalErrors: this.errorLog.length,
      recentErrors,
      commonIssues,
    };
  }

  /**
   * איפוס רישום שגיאות
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }
}

export default WorkoutErrorHandlingService.getInstance();
