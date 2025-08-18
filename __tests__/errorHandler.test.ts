/**
 * @file __tests__/errorHandler.test.ts
 * @brief טסט יחידה ל-errorHandler
 * @dependencies jest
 */

import { errorHandler, normalizeError } from "../src/utils/errorHandler";
import { logger } from "../src/utils/logger";

// Mock של logger
jest.mock("../src/utils/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe("errorHandler", () => {
  const mockLoggerError = logger.error as jest.MockedFunction<
    typeof logger.error
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("normalizeError", () => {
    it("should normalize Error objects", () => {
      const error = new Error("Test error");
      error.name = "TestError";

      const normalized = normalizeError(error);

      expect(normalized).toEqual({
        name: "TestError",
        message: "Test error",
        stack: expect.any(String),
      });
    });

    it("should normalize string errors", () => {
      const error = "String error message";

      const normalized = normalizeError(error);

      expect(normalized).toEqual({
        name: "StringError",
        message: "String error message",
      });
    });

    it("should normalize object errors", () => {
      const error = {
        name: "CustomError",
        message: "Custom error message",
        stack: "custom stack trace",
      };

      const normalized = normalizeError(error);

      expect(normalized).toEqual({
        name: "CustomError",
        message: "Custom error message",
        stack: "custom stack trace",
      });
    });

    it("should handle unknown error types", () => {
      const error = 42; // number

      const normalized = normalizeError(error);

      expect(normalized).toEqual({
        name: "UnknownError",
        message: "An unknown error occurred",
      });
    });

    it("should handle null/undefined errors", () => {
      const normalizedNull = normalizeError(null);
      const normalizedUndefined = normalizeError(undefined);

      expect(normalizedNull).toEqual({
        name: "UnknownError",
        message: "An unknown error occurred",
      });

      expect(normalizedUndefined).toEqual({
        name: "UnknownError",
        message: "An unknown error occurred",
      });
    });
  });

  describe("reportError", () => {
    it("should call logger.error in development mode", () => {
      // הגדרת מצב פיתוח
      const originalDev = (global as any).__DEV__;
      (global as any).__DEV__ = true;

      const error = new Error("Test error");
      const context = { source: "test" };

      errorHandler.reportError(error, context);

      expect(mockLoggerError).toHaveBeenCalledWith(
        "ErrorHandler",
        "Error reported",
        expect.objectContaining({
          error: expect.objectContaining({
            name: "Error",
            message: "Test error",
          }),
          context,
          timestamp: expect.any(String),
        })
      );

      // החזרת מצב מקורי
      (global as any).__DEV__ = originalDev;
    });

    it("should not call logger.error in production mode", () => {
      // הגדרת מצב פרודקשן
      const originalDev = (global as any).__DEV__;
      (global as any).__DEV__ = false;

      const error = new Error("Test error");
      const context = { source: "test" };

      errorHandler.reportError(error, context);

      expect(mockLoggerError).not.toHaveBeenCalled();

      // החזרת מצב מקורי
      (global as any).__DEV__ = originalDev;
    });

    it("should work without context parameter", () => {
      const originalDev = (global as any).__DEV__;
      (global as any).__DEV__ = true;

      const error = new Error("Test error");

      errorHandler.reportError(error);

      expect(mockLoggerError).toHaveBeenCalledWith(
        "ErrorHandler",
        "Error reported",
        expect.objectContaining({
          error: expect.objectContaining({
            name: "Error",
            message: "Test error",
          }),
          context: undefined,
          timestamp: expect.any(String),
        })
      );

      (global as any).__DEV__ = originalDev;
    });

    it("should include timestamp in error report", () => {
      const originalDev = (global as any).__DEV__;
      (global as any).__DEV__ = true;

      const beforeTime = new Date().toISOString();
      errorHandler.reportError(new Error("Test"));
      const afterTime = new Date().toISOString();

      expect(mockLoggerError).toHaveBeenCalledWith(
        "ErrorHandler",
        "Error reported",
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      );

      const callArgs = mockLoggerError.mock.calls[0];
      const reportData = callArgs[2] as any;
      const timestamp = reportData.timestamp;

      // בדיקה שהזמן תקין ובפורמט ISO
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(new Date(timestamp).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeTime).getTime()
      );
      expect(new Date(timestamp).getTime()).toBeLessThanOrEqual(
        new Date(afterTime).getTime()
      );

      (global as any).__DEV__ = originalDev;
    });
  });
});
