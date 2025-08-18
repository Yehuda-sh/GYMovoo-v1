/**
 * @file src/utils/errorHandler.ts
 * @brief מטפל שגיאות מרכזי עם דיווח נורמליזציה ותמיכת פיתוח/פרודקשן
 * @dependencies logger
 * @notes במצב פיתוח: לוג מלא, במצב פרודקשן: no-op או hook עתידי
 */

import { logger } from "./logger";

/**
 * מבנה שגיאה מנורמל
 * Normalized error structure
 */
export interface NormalizedError {
  name: string;
  message: string;
  stack?: string;
}

/**
 * נורמליזציה של שגיאה למבנה אחיד
 * Normalize error to consistent structure
 */
export const normalizeError = (err: unknown): NormalizedError => {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }

  if (typeof err === "string") {
    return {
      name: "StringError",
      message: err,
    };
  }

  if (typeof err === "object" && err !== null) {
    const objErr = err as Record<string, unknown>;
    return {
      name: String(objErr.name || "UnknownError"),
      message: String(objErr.message || "Unknown error occurred"),
      stack: objErr.stack ? String(objErr.stack) : undefined,
    };
  }

  return {
    name: "UnknownError",
    message: "An unknown error occurred",
  };
};

/**
 * דיווח שגיאה למערכת מרכזית
 * Report error to central system
 *
 * @param err השגיאה לדיווח
 * @param context קונטקסט נוסף (מקור, מידע רלוונטי)
 */
export const reportError = (
  err: unknown,
  context?: Record<string, unknown>
): void => {
  const normalizedError = normalizeError(err);

  // במצב פיתוח: לוג מלא לקונסולה
  if (__DEV__) {
    logger.error("ErrorHandler", "Error reported", {
      error: normalizedError,
      context,
      timestamp: new Date().toISOString(),
    });
  } else {
    // במצב פרודקשן: no-op כרגע
    // TODO: הוסף integration עם crash reporting service (Sentry, Crashlytics, etc.)
    // כאן יכול להיות שליחה לשירות external או local analytics
    // לעת עתה - שמירה שקטה ללא הדפסה
    // Future: External crash reporting integration point
  }
};

/**
 * מטפל שגיאות - אובייקט ראשי לייצוא
 * Error handler - main export object
 */
export const errorHandler = {
  reportError,
  normalizeError,
};
