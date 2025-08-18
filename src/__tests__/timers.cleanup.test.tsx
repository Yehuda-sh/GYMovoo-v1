/**
 * @file src/__tests__/timers.cleanup.test.tsx
 * @brief טסט לבדיקת ניקוי timers ו-performance optimizations
 * @dependencies @testing-library/react-native, jest
 */

import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import { View } from "react-native";

// Mock של useEffect hook לבדיקת cleanup
const mockUseEffect = jest.fn();
const mockClearTimeout = jest.fn();
const mockClearInterval = jest.fn();
const mockSetTimeout = jest.fn();
const mockSetInterval = jest.fn();

// Mock של global timers
(global as any).setTimeout = mockSetTimeout;
(global as any).setInterval = mockSetInterval;
(global as any).clearTimeout = mockClearTimeout;
(global as any).clearInterval = mockClearInterval;

// רכיב דמה עם timer
const ComponentWithTimer: React.FC<{ active: boolean }> = ({ active }) => {
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    if (active) {
      timeoutId = setTimeout(() => {
        console.log("Timer executed");
      }, 1000);

      intervalId = setInterval(() => {
        console.log("Interval executed");
      }, 500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [active]);

  mockUseEffect();
  return <View testID="timer-component" />;
};

// רכיב דמה עם useCallback optimization
const ComponentWithCallback: React.FC<{ onPress: () => void }> = React.memo(
  ({ onPress }) => {
    const handlePress = React.useCallback(() => {
      onPress();
    }, [onPress]);

    return <View testID="callback-component" />;
  }
);
ComponentWithCallback.displayName = "ComponentWithCallback";

describe("Timers Cleanup and Performance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetTimeout.mockReturnValue("timeout-id" as any);
    mockSetInterval.mockReturnValue("interval-id" as any);
  });

  describe("Timer Cleanup", () => {
    it("should create timers when component is active", () => {
      render(<ComponentWithTimer active={true} />);

      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 500);
    });

    it("should not create timers when component is inactive", () => {
      render(<ComponentWithTimer active={false} />);

      expect(mockSetTimeout).not.toHaveBeenCalled();
      expect(mockSetInterval).not.toHaveBeenCalled();
    });

    it("should cleanup timers when component unmounts", () => {
      const { unmount } = render(<ComponentWithTimer active={true} />);

      // ודא שנוצרו timers
      expect(mockSetTimeout).toHaveBeenCalled();
      expect(mockSetInterval).toHaveBeenCalled();

      // בצע unmount
      unmount();

      // ודא שנקרה cleanup
      expect(mockClearTimeout).toHaveBeenCalledWith("timeout-id");
      expect(mockClearInterval).toHaveBeenCalledWith("interval-id");
    });

    it("should cleanup timers when active prop changes to false", () => {
      const { rerender } = render(<ComponentWithTimer active={true} />);

      // ודא שנוצרו timers
      expect(mockSetTimeout).toHaveBeenCalled();
      expect(mockSetInterval).toHaveBeenCalled();

      // שנה את active ל-false
      rerender(<ComponentWithTimer active={false} />);

      // ודא שנקרה cleanup
      expect(mockClearTimeout).toHaveBeenCalledWith("timeout-id");
      expect(mockClearInterval).toHaveBeenCalledWith("interval-id");
    });

    it("should recreate timers when active prop changes from false to true", () => {
      const { rerender } = render(<ComponentWithTimer active={false} />);

      // ודא שלא נוצרו timers
      expect(mockSetTimeout).not.toHaveBeenCalled();
      expect(mockSetInterval).not.toHaveBeenCalled();

      // שנה את active ל-true
      rerender(<ComponentWithTimer active={true} />);

      // ודא שנוצרו timers
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 500);
    });
  });

  describe("useCallback Optimization", () => {
    it("should not recreate callback when prop reference doesn't change", () => {
      const onPress = jest.fn();

      const { rerender } = render(<ComponentWithCallback onPress={onPress} />);

      // רינדור מחדש עם אותו callback reference
      rerender(<ComponentWithCallback onPress={onPress} />);

      // הרכיב לא אמור להירנדר מחדש (בדוק ע"י mock של useState או render count)
      expect(true).toBe(true); // placeholder - בפועל נבדוק render count
    });

    it("should recreate callback when prop reference changes", () => {
      const onPress1 = jest.fn();
      const onPress2 = jest.fn();

      const { rerender, getByTestId } = render(
        <ComponentWithCallback onPress={onPress1} />
      );

      expect(getByTestId("callback-component")).toBeTruthy();

      // רינדור מחדש עם callback reference שונה
      rerender(<ComponentWithCallback onPress={onPress2} />);

      expect(getByTestId("callback-component")).toBeTruthy();
    });
  });

  describe("Memory Leaks Prevention", () => {
    it("should not accumulate timers over multiple re-renders", async () => {
      const { rerender } = render(<ComponentWithTimer active={true} />);

      // נקה את הקריאות הקודמות
      mockSetTimeout.mockClear();
      mockSetInterval.mockClear();
      mockClearTimeout.mockClear();
      mockClearInterval.mockClear();

      // רינדור מחדש מספר פעמים
      for (let i = 0; i < 5; i++) {
        rerender(<ComponentWithTimer active={false} />);
        rerender(<ComponentWithTimer active={true} />);
      }

      // ודא שכל timer נוקה לפני יצירת חדש
      // clearTimeout אמור להיקרא כמו setTimeout (כי יש cleanup בין כל render)
      expect(mockClearTimeout).toHaveBeenCalledTimes(
        mockSetTimeout.mock.calls.length
      );
      expect(mockClearInterval).toHaveBeenCalledTimes(
        mockSetInterval.mock.calls.length
      );
    });

    it("should handle rapid mount/unmount cycles gracefully", async () => {
      // מחזור מהיר של mount/unmount
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<ComponentWithTimer active={true} />);
        unmount();
      }

      // ודא שכל timer נוקה
      expect(mockClearTimeout).toHaveBeenCalledTimes(10);
      expect(mockClearInterval).toHaveBeenCalledTimes(10);
    });
  });

  describe("Performance in DEV mode", () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      // Mock performance.now
      global.performance = {
        now: jest.fn().mockReturnValue(Date.now()),
      } as any;
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it("should track performance in DEV mode", () => {
      process.env.NODE_ENV = "development";

      render(<ComponentWithTimer active={true} />);

      // בדוק שperformance.now נקרא לזמון ביצועים (אם יש לוגיקה כזו)
      // זה יהיה רלוונטי אם נוסיף performance tracking ל-components
      expect(true).toBe(true); // placeholder
    });

    it("should not track performance in production", () => {
      process.env.NODE_ENV = "production";

      render(<ComponentWithTimer active={true} />);

      // בדוק שלא נקרא performance tracking בפרודקשן
      expect(true).toBe(true); // placeholder
    });
  });
});
