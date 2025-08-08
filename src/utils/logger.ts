/**
 * Central lightweight logger with __DEV__ gating.
 * Use debug/info for development-only noise, warn/error always output.
 */
export const logger = {
  // Dev-only verbose logs (mapped to warn to pass lint rule allowing warn/error only)
  debug: (...args: unknown[]) => {
    if (__DEV__) console.warn("[DEBUG]", ...args);
  },
  // General info (dev gated)
  info: (...args: unknown[]) => {
    if (__DEV__) console.warn("[INFO]", ...args);
  },
  // Warnings (always show)
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  // Errors (always show)
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};

export type Logger = typeof logger;
