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
      console.log(`🔍 [${category}] ${message}`, data || "");
    }
  },

  info: (category: string, message: string, data?: unknown) => {
    if (IS_DEV) {
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
