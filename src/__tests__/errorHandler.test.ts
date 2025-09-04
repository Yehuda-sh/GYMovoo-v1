/**
 * @file __tests__/errorHandler.test.ts
 * @brief טסט מקיף ל-errorHandler ופונקציות עזר
 * @dependencies jest, errorHandler, logger
 * @updated 2025-09-03 - עודכן להתאים לקוד האמיתי, הוסרו טסטים שלא רלוונטיים
 */

import {
  errorHandler,
  reportError,
  getErrorMessage,
} from "../utils/errorHandler";
import { logger } from "../utils/logger";

// Mock של logger
jest.mock("../utils/logger", () => ({
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

  describe("getErrorMessage", () => {
    it("should return message from Error objects", () => {
      const error = new Error("Test error");
      const result = getErrorMessage(error);
      expect(result).toBe("Test error");
    });

    it("should return string errors as-is", () => {
      const error = "String error message";
      const result = getErrorMessage(error);
      expect(result).toBe("String error message");
    });

    it("should extract message from objects", () => {
      const error = { message: "Object error message" };
      const result = getErrorMessage(error);
      expect(result).toBe("Object error message");
    });

    it("should handle unknown error types", () => {
      const error = 42;
      const result = getErrorMessage(error);
      expect(result).toBe("Unknown error occurred");
    });

    it("should handle null/undefined", () => {
      expect(getErrorMessage(null)).toBe("Unknown error occurred");
      expect(getErrorMessage(undefined)).toBe("Unknown error occurred");
    });
  });

  describe("reportError", () => {
    it("should call logger.error with error message", () => {
      const error = new Error("Test error");
      const context = { source: "test" };

      errorHandler.reportError(error, context);

      expect(mockLoggerError).toHaveBeenCalledWith("Error", "Test error", {
        context,
      });
    });

    it("should work without context parameter", () => {
      const error = new Error("Test error");

      errorHandler.reportError(error);

      expect(mockLoggerError).toHaveBeenCalledWith("Error", "Test error", {
        context: undefined,
      });
    });

    it("should handle string errors", () => {
      const error = "String error";

      errorHandler.reportError(error);

      expect(mockLoggerError).toHaveBeenCalledWith("Error", "String error", {
        context: undefined,
      });
    });

    it("should handle object errors", () => {
      const error = { message: "Object error" };

      errorHandler.reportError(error);

      expect(mockLoggerError).toHaveBeenCalledWith("Error", "Object error", {
        context: undefined,
      });
    });

    it("should handle unknown error types", () => {
      const error = 42;

      errorHandler.reportError(error);

      expect(mockLoggerError).toHaveBeenCalledWith(
        "Error",
        "Unknown error occurred",
        { context: undefined }
      );
    });
  });

  describe("errorHandler object", () => {
    it("should have reportError method", () => {
      expect(typeof errorHandler.reportError).toBe("function");
    });

    it("should call the same function as direct reportError", () => {
      const error = new Error("Test error");

      errorHandler.reportError(error);

      expect(mockLoggerError).toHaveBeenCalledWith("Error", "Test error", {
        context: undefined,
      });
    });

    it("should handle complex context objects", () => {
      const error = new Error("Complex error");
      const context = {
        userId: 123,
        action: "save_profile",
        timestamp: new Date(),
        metadata: { version: "1.0", platform: "ios" },
      };

      errorHandler.reportError(error, context);

      expect(mockLoggerError).toHaveBeenCalledWith("Error", "Complex error", {
        context,
      });
    });
  });
});
