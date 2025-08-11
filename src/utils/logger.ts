/**
 * @file src/utils/logger.ts
 * @brief מערכת לוגים מרכזית ומאוחדת עם גייטינג פיתוח
 * @description לוגר כללי מותנה סביבה עם תמיכה בקטגוריות
 * @updated 2025-08-11 איחוד עם workoutLogger למערכת אחודה
 */

const IS_DEVELOPMENT = __DEV__ || process.env.NODE_ENV === "development";

/**
 * מערכת לוגים מרכזית עם תמיכה בקטגוריות
 * Central logging system with category support
 */
export const logger = {
  // Debug logs (development only)
  debug: (category: string, message: string, data?: unknown) => {
    if (IS_DEVELOPMENT) {
      // eslint-disable-next-line no-console
      console.log(`🔍 [${category}] ${message}`, data || "");
    }
  },

  // Info logs (development only)
  info: (category: string, message: string, data?: unknown) => {
    if (IS_DEVELOPMENT) {
      // eslint-disable-next-line no-console
      console.log(`ℹ️ [${category}] ${message}`, data || "");
    }
  },

  // Warning logs (always show)
  warn: (category: string, message: string, data?: unknown) => {
    console.warn(`⚠️ [${category}] ${message}`, data || "");
  },

  // Error logs (always show)
  error: (category: string, message: string, error?: unknown) => {
    console.error(`❌ [${category}] ${message}`, error || "");
  },

  // Legacy support - simple logging without category
  simple: {
    debug: (...args: unknown[]) => {
      // eslint-disable-next-line no-console
      if (IS_DEVELOPMENT) console.log("[DEBUG]", ...args);
    },
    info: (...args: unknown[]) => {
      // eslint-disable-next-line no-console
      if (IS_DEVELOPMENT) console.log("[INFO]", ...args);
    },
    warn: (...args: unknown[]) => {
      console.warn(...args);
    },
    error: (...args: unknown[]) => {
      console.error(...args);
    },
  },
};

/**
 * לוגר מיוחד לאימונים - תאימות לאחור
 * Workout-specific logger - backward compatibility
 */
export const workoutLogger = {
  info: (message: string, data?: unknown) => {
    logger.info("Workout", message, data);
  },
  error: (message: string, error?: unknown) => {
    logger.error("Workout", message, error);
  },
  warn: (message: string, data?: unknown) => {
    logger.warn("Workout", message, data);
  },
  debug: (message: string, data?: unknown) => {
    logger.debug("Workout", message, data);
  },
  // Legacy functions for backward compatibility
  setCompleted: (exerciseId: string, setId: string, updates: unknown) => {
    logger.debug("Workout", `Set completed: ${exerciseId}/${setId}`, updates);
  },
  reorderSets: (exerciseId: string, fromIndex: number, toIndex: number) => {
    logger.debug(
      "Workout",
      `Sets reordered: ${exerciseId} from ${fromIndex} to ${toIndex}`
    );
  },
};

export type Logger = typeof logger;
