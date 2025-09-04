/**
 * @file __tests__/ErrorBoundary.test.tsx
 * @brief טסט מקיף ל-ErrorBoundary עם RTL ו-fallback UI
 * @dependencies @testing-library/react-native, jest
 */

import React from "react";
import { Text } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { errorHandler } from "../utils/errorHandler";
import { logger } from "../utils/logger";

// Mock של errorHandler
jest.mock("../utils/errorHandler", () => ({
  errorHandler: {
    reportError: jest.fn(),
  },
}));

// Mock של logger - תואם לפרמטרים האמיתיים
jest.mock("../utils/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// קומפוננט שזורק שגיאה לצרכי בדיקה
const ThrowingComponent: React.FC<{ shouldThrow: boolean }> = ({
  shouldThrow,
}) => {
  if (shouldThrow) {
    throw new Error("Test error for ErrorBoundary");
  }
  return <Text testID="working-component">Component is working</Text>;
};

describe("ErrorBoundary", () => {
  const mockReportError = errorHandler.reportError as jest.MockedFunction<
    typeof errorHandler.reportError
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    // מונע הדפסות שגיאה מיותרות בטסטים
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("should render children when no error occurs", () => {
    const { getByTestId, queryByText } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(getByTestId("working-component")).toBeTruthy();
    expect(queryByText("משהו השתבש")).toBeNull();
  });

  it("should render fallback UI when error occurs", () => {
    const { getByText, queryByTestId } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // בדיקה שהפולבק מוצג
    expect(getByText("משהו השתבש")).toBeTruthy();
    expect(getByText("אנחנו עובדים על פתרון הבעיה. אנא נסה שוב.")).toBeTruthy();
    expect(getByText("נסה שוב")).toBeTruthy();

    // בדיקה שהקומפוננט המקורי לא מוצג
    expect(queryByTestId("working-component")).toBeNull();
  });

  it("should call errorHandler.reportError when error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockReportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
        source: "ErrorBoundary",
      })
    );
  });

  it("should support custom fallback message", () => {
    const customMessage = "הודעת שגיאה מותאמת";

    const { getByText } = render(
      <ErrorBoundary fallbackMessage={customMessage}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText(customMessage)).toBeTruthy();
  });

  it("should reset error state when retry button is pressed", async () => {
    const shouldThrowRef = { current: true };

    const TestComponent: React.FC = () => {
      return <ThrowingComponent shouldThrow={shouldThrowRef.current} />;
    };

    const { getByText, queryByTestId, rerender } = render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    // בדיקה שהשגיאה מוצגת תחילה
    expect(getByText("משהו השתבש")).toBeTruthy();

    // שנה את המצב לפני הלחיצה על retry
    shouldThrowRef.current = false;

    // לחיצה על נסה שוב
    fireEvent.press(getByText("נסה שוב"));

    // רינדור מחדש עם המצב החדש
    rerender(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    // בדיקה שהקומפוננט חזר לפעולה
    await waitFor(
      () => {
        expect(queryByTestId("working-component")).toBeTruthy();
      },
      { timeout: 2000 } // Increased timeout to account for retry delay
    );
  });

  it("should show error details in development mode", () => {
    // הגדרת מצב פיתוח
    const originalDev = (global as any).__DEV__;
    (global as any).__DEV__ = true;

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText("פרטי שגיאה (פיתוח):")).toBeTruthy();
    expect(getByText("Test error for ErrorBoundary")).toBeTruthy();

    // החזרת מצב מקורי
    (global as any).__DEV__ = originalDev;
  });

  it("should have proper accessibility attributes", () => {
    const { getByLabelText } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryButton = getByLabelText("נסה שוב");
    expect(retryButton).toBeTruthy();
    expect(retryButton.props.accessibilityHint).toBe(
      "מנסה לטעון מחדש את האפליקציה"
    );
  });

  it("should support different variants", () => {
    const { getByText, queryByText } = render(
      <ErrorBoundary variant="minimal">
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // בווריאנט minimal אין כותרת וגם לא פרטי שגיאה
    expect(queryByText("משהו השתבש")).toBeNull();
    expect(queryByText("פרטי שגיאה (פיתוח):")).toBeNull();
  });

  it("should call logger.error with correct parameters", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(logger.error).toHaveBeenCalledWith(
      "ErrorBoundary",
      "Component error caught",
      expect.objectContaining({
        error: "Test error for ErrorBoundary",
        errorType: "unknown",
        retryCount: 0,
      })
    );
  });

  it("should show feedback button when enabled", () => {
    const { getByText } = render(
      <ErrorBoundary showFeedbackButton={true}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText("שלח משוב")).toBeTruthy();
  });
});
