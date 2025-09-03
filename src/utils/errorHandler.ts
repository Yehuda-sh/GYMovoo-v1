/**
 * Simple error handling utilities
 */

import { logger } from "./logger";

/**
 * Report error with optional context
 */
export const reportError = (error: unknown, context?: Record<string, unknown>): void => {
  // Simple error logging - works for both dev and production
  logger.error("Error", getErrorMessage(error), { context });
};

/**
 * Get error message from any error type
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "Unknown error occurred";
};

/**
 * Error handler object for backward compatibility
 */
export const errorHandler = {
  reportError,
};
