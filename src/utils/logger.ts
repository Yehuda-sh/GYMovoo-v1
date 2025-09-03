/**
 * Simple logging utilities for development
 */

const IS_DEV = __DEV__ || process.env.NODE_ENV === "development";

/**
 * Simple logger with development gating
 */
export const logger = {
  debug: (category: string, message: string, data?: unknown) => {
    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.log(`🔍 [${category}] ${message}`, data || "");
    }
  },

  info: (category: string, message: string, data?: unknown) => {
    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.log(`ℹ️ [${category}] ${message}`, data || "");
    }
  },

  warn: (category: string, message: string, data?: unknown) => {
    console.warn(`⚠️ [${category}] ${message}`, data || "");
  },

  error: (category: string, message: string, error?: unknown) => {
    console.error(`❌ [${category}] ${message}`, error || "");
  },
};

/**
 * Workout-specific logger for backward compatibility
 */
export const workoutLogger = {
  info: (message: string, data?: unknown) => logger.info("Workout", message, data),
  error: (message: string, error?: unknown) => logger.error("Workout", message, error),
  warn: (message: string, data?: unknown) => logger.warn("Workout", message, data),
  debug: (message: string, data?: unknown) => logger.debug("Workout", message, data),
};
