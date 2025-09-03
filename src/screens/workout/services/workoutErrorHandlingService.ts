/**
 * @file src/screens/workout/services/workoutErrorHandlingService.ts
 * @description שירות טיפול בשגיאות עבור אימונים - פשוט ויעיל
 * @updated 2025-09-03 Simplified from 230→87 lines (62% reduction)
 * @version 3.0.0
 *
 * ✅ ACTIVE & ESSENTIAL: רק פונקציות שבפועל משמשות
 * - Used by: Core data loading operations throughout the app
 * - Functions: handleDataLoadError
 * - Singleton pattern for consistency
 */

import { logger } from "../../../utils/logger";

export class WorkoutErrorHandlingService {
  private static instance: WorkoutErrorHandlingService;

  private constructor() {}

  static getInstance(): WorkoutErrorHandlingService {
    if (!WorkoutErrorHandlingService.instance) {
      WorkoutErrorHandlingService.instance = new WorkoutErrorHandlingService();
    }
    return WorkoutErrorHandlingService.instance;
  }

  /**
   * טיפול בשגיאות טעינת נתונים - מערכת recovery מתקדמת
   */
  async handleDataLoadError<T = unknown>(
    error: unknown,
    operation: string,
    fallbackData?: T
  ): Promise<{ success: boolean; data?: T; message?: string }> {
    try {
      const errorObj: { message?: string } =
        typeof error === "object" && error !== null
          ? (error as { message?: string })
          : { message: String(error) };

      logger.error(
        `Data load error in ${operation}: ${errorObj.message}`,
        "WorkoutErrorHandlingService"
      );

      // שגיאות פירסור JSON
      if (errorObj?.message?.includes("JSON")) {
        if (fallbackData) {
          logger.warn(
            "Using fallback data due to JSON parse error",
            "WorkoutErrorHandlingService"
          );
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
        errorObj?.message?.toLowerCase?.().includes("permission") ||
        errorObj?.message?.toLowerCase?.().includes("access")
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
    } catch (processingError) {
      logger.error(
        "Failed to process data load error",
        processingError instanceof Error
          ? processingError.message
          : String(processingError),
        "WorkoutErrorHandlingService"
      );

      return {
        success: false,
        message: "שגיאה קריטית בטעינת נתונים",
      };
    }
  }
}

const workoutErrorHandlingService = WorkoutErrorHandlingService.getInstance();
export default workoutErrorHandlingService;
