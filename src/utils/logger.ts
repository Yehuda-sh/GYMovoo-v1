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
      if (data !== undefined) {
        console.log(`🔍 [${category}] ${message}`, data);
      } else {
        console.log(`🔍 [${category}] ${message}`);
      }
    }
  },

  info: (category: string, message: string, data?: unknown) => {
    if (IS_DEV) {
      if (data !== undefined) {
        console.info(`ℹ️ [${category}] ${message}`, data);
      } else {
        console.info(`ℹ️ [${category}] ${message}`);
      }
    }
  },

  warn: (category: string, message: string, data?: unknown) => {
    if (data !== undefined) {
      console.warn(`⚠️ [${category}] ${message}`, data);
    } else {
      console.warn(`⚠️ [${category}] ${message}`);
    }
  },

  error: (category: string, message: string, error?: unknown) => {
    if (error !== undefined) {
      console.error(`❌ [${category}] ${message}`, error);
    } else {
      console.error(`❌ [${category}] ${message}`);
    }
  },
};
