/**
 * @file src/utils/logger.ts
 * @brief מערכת לוגים מרכזית ומאוחדת עם גייטינג פיתוח
 * @description לוגר כללי מותנה סביבה עם תמיכה בקטגוריות, טיימינג ופיצ'רים מתקדמים
 * @description Advanced logging system with categories, timing, and development gating
 *
 * @features
 * - ✅ Environment-based gating (development only)
 * - ✅ Category-based organization
 * - ✅ Performance timing utilities
 * - ✅ Structured error logging
 * - ✅ Configurable log levels
 * - ✅ Legacy compatibility
 * - ✅ Type-safe operations
 * - ✅ Child logger creation
 * - ✅ Group logging
 * - ✅ Data truncation
 * - ✅ Timestamp formatting
 *
 * @example
 * ```typescript
 * // Basic logging
 * logger.debug("Auth", "User login attempt", { userId: "123" });
 *
 * // Performance timing
 * const timer = logger.startTimer("Database", "User query");
 * // ... do work ...
 * timer.end();
 *
 * // Group logging
 * logger.group("Auth", "Login Process", () => {
 *   logger.debug("Auth", "Validating credentials");
 *   logger.info("Auth", "Login successful");
 * });
 *
 * // Create child logger
 * const authLogger = logger.createChild("Auth");
 * authLogger.info("User authenticated", { userId: "123" });
 *
 * // Error logging with context
 * logger.error("API", "Failed to fetch data", error, {
 *   endpoint: "/api/users",
 *   userId: "123"
 * });
 * ```
 *
 * @updated 2025-09-01 - Enhanced with timing, better types, and advanced features
 */

// Enhanced types for better type safety
export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogData = unknown;
export type LogContext = Record<string, LogData>;

// Configuration interface
interface LoggerConfig {
  enableColors: boolean;
  enableTimestamps: boolean;
  maxDataLength: number;
  enableStackTrace: boolean;
}

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
  enableColors: true,
  enableTimestamps: true,
  maxDataLength: 500,
  enableStackTrace: false,
};

// Environment detection with memoization for performance
const IS_DEVELOPMENT = __DEV__ || process.env.NODE_ENV === "development";

// Utility functions
const formatTimestamp = (): string => {
  return new Date().toISOString().replace("T", " ").slice(0, -5);
};

const truncateData = (data: LogData, maxLength: number): LogData => {
  if (!data) return data;

  const dataString = JSON.stringify(data);
  if (dataString.length <= maxLength) return data;

  return `${dataString.slice(0, maxLength)}... [TRUNCATED]`;
};

const getLogEmoji = (level: LogLevel): string => {
  switch (level) {
    case "debug":
      return "🔍";
    case "info":
      return "ℹ️";
    case "warn":
      return "⚠️";
    case "error":
      return "❌";
    default:
      return "📝";
  }
};

/**
 * מערכת לוגים מרכזית עם תמיכה בקטגוריות
 * Central logging system with category support
 */
export const logger = {
  // Debug logs (development only)
  debug: (
    category: string,
    message: string,
    data?: LogData,
    context?: LogContext
  ) => {
    if (IS_DEVELOPMENT) {
      const timestamp = DEFAULT_CONFIG.enableTimestamps
        ? formatTimestamp()
        : "";
      const emoji = DEFAULT_CONFIG.enableColors
        ? getLogEmoji("debug")
        : "[DEBUG]";
      const formattedData = data
        ? truncateData(data, DEFAULT_CONFIG.maxDataLength)
        : "";

      // eslint-disable-next-line no-console
      console.log(
        `${emoji} ${timestamp} [${category}] ${message}`,
        formattedData,
        context || ""
      );
    }
  },

  // Info logs (development only)
  info: (
    category: string,
    message: string,
    data?: LogData,
    context?: LogContext
  ) => {
    if (IS_DEVELOPMENT) {
      const timestamp = DEFAULT_CONFIG.enableTimestamps
        ? formatTimestamp()
        : "";
      const emoji = DEFAULT_CONFIG.enableColors
        ? getLogEmoji("info")
        : "[INFO]";
      const formattedData = data
        ? truncateData(data, DEFAULT_CONFIG.maxDataLength)
        : "";

      // eslint-disable-next-line no-console
      console.log(
        `${emoji} ${timestamp} [${category}] ${message}`,
        formattedData,
        context || ""
      );
    }
  },

  // Warning logs (always show)
  warn: (
    category: string,
    message: string,
    data?: LogData,
    context?: LogContext
  ) => {
    const timestamp = DEFAULT_CONFIG.enableTimestamps ? formatTimestamp() : "";
    const emoji = DEFAULT_CONFIG.enableColors ? getLogEmoji("warn") : "[WARN]";
    const formattedData = data
      ? truncateData(data, DEFAULT_CONFIG.maxDataLength)
      : "";

    console.warn(
      `${emoji} ${timestamp} [${category}] ${message}`,
      formattedData,
      context || ""
    );
  },

  // Error logs (always show)
  error: (
    category: string,
    message: string,
    error?: LogData,
    context?: LogContext
  ) => {
    const timestamp = DEFAULT_CONFIG.enableTimestamps ? formatTimestamp() : "";
    const emoji = DEFAULT_CONFIG.enableColors
      ? getLogEmoji("error")
      : "[ERROR]";
    const formattedError = error
      ? truncateData(error, DEFAULT_CONFIG.maxDataLength)
      : "";

    console.error(
      `${emoji} ${timestamp} [${category}] ${message}`,
      formattedError,
      context || ""
    );

    // Add stack trace in development
    if (
      IS_DEVELOPMENT &&
      DEFAULT_CONFIG.enableStackTrace &&
      error instanceof Error
    ) {
      console.error("Stack trace:", error.stack);
    }
  },

  // Legacy support - simple logging without category
  simple: {
    debug: (...args: LogData[]) => {
      if (IS_DEVELOPMENT) {
        const timestamp = DEFAULT_CONFIG.enableTimestamps
          ? formatTimestamp()
          : "";
        console.warn(`🔍 ${timestamp} [DEBUG]`, ...args);
      }
    },
    info: (...args: LogData[]) => {
      if (IS_DEVELOPMENT) {
        const timestamp = DEFAULT_CONFIG.enableTimestamps
          ? formatTimestamp()
          : "";
        console.warn(`ℹ️ ${timestamp} [INFO]`, ...args);
      }
    },
    warn: (...args: LogData[]) => {
      const timestamp = DEFAULT_CONFIG.enableTimestamps
        ? formatTimestamp()
        : "";
      console.warn(`⚠️ ${timestamp} [WARN]`, ...args);
    },
    error: (...args: LogData[]) => {
      const timestamp = DEFAULT_CONFIG.enableTimestamps
        ? formatTimestamp()
        : "";
      console.error(`❌ ${timestamp} [ERROR]`, ...args);
    },
  },

  // Performance timing utilities
  startTimer: (category: string, operation: string) => {
    const startTime = performance.now();
    const timerId = `${category}-${operation}-${Date.now()}`;

    if (IS_DEVELOPMENT) {
      logger.debug(category, `⏱️ Started: ${operation}`, { timerId });
    }

    return {
      end: (additionalData?: LogData) => {
        const endTime = performance.now();
        const duration = Math.round((endTime - startTime) * 100) / 100; // Round to 2 decimal places

        const logData =
          additionalData &&
          typeof additionalData === "object" &&
          !Array.isArray(additionalData)
            ? {
                timerId,
                duration,
                ...(additionalData as Record<string, unknown>),
              }
            : { timerId, duration };

        logger.info(
          category,
          `⏱️ Completed: ${operation} (${duration}ms)`,
          logData
        );

        return duration;
      },
      cancel: () => {
        if (IS_DEVELOPMENT) {
          logger.debug(category, `⏱️ Cancelled: ${operation}`, { timerId });
        }
      },
    };
  },

  // Group logging for better organization
  group: (category: string, label: string, fn: () => void) => {
    if (IS_DEVELOPMENT) {
      // eslint-disable-next-line no-console
      console.group(`📁 [${category}] ${label}`);
    }

    try {
      fn();
    } finally {
      if (IS_DEVELOPMENT) {
        // eslint-disable-next-line no-console
        console.groupEnd();
      }
    }
  },

  // Configuration access
  getConfig: () => ({ ...DEFAULT_CONFIG }),

  // Create child logger with predefined category
  createChild: (category: string) => ({
    debug: (message: string, data?: LogData, context?: LogContext) =>
      logger.debug(category, message, data, context),
    info: (message: string, data?: LogData, context?: LogContext) =>
      logger.info(category, message, data, context),
    warn: (message: string, data?: LogData, context?: LogContext) =>
      logger.warn(category, message, data, context),
    error: (message: string, error?: LogData, context?: LogContext) =>
      logger.error(category, message, error, context),
    startTimer: (operation: string) => logger.startTimer(category, operation),
    group: (label: string, fn: () => void) => logger.group(category, label, fn),
  }),
};

/**
 * לוגר מיוחד לאימונים - תאימות לאחור
 * Workout-specific logger - backward compatibility
 */
export const workoutLogger = {
  info: (message: string, data?: LogData, context?: LogContext) => {
    logger.info("Workout", message, data, context);
  },
  error: (message: string, error?: LogData, context?: LogContext) => {
    logger.error("Workout", message, error, context);
  },
  warn: (message: string, data?: LogData, context?: LogContext) => {
    logger.warn("Workout", message, data, context);
  },
  debug: (message: string, data?: LogData, context?: LogContext) => {
    logger.debug("Workout", message, data, context);
  },
  // Legacy functions for backward compatibility
  setCompleted: (exerciseId: string, setId: string, updates: LogData) => {
    logger.debug("Workout", `Set completed: ${exerciseId}/${setId}`, updates);
  },
  reorderSets: (exerciseId: string, fromIndex: number, toIndex: number) => {
    logger.debug(
      "Workout",
      `Sets reordered: ${exerciseId} from ${fromIndex} to ${toIndex}`
    );
  },
  // New performance monitoring
  startExerciseTimer: (exerciseId: string) => {
    return logger.startTimer("Workout", `Exercise-${exerciseId}`);
  },
  startWorkoutTimer: (workoutId: string) => {
    return logger.startTimer("Workout", `Workout-${workoutId}`);
  },
};

export type Logger = typeof logger;
