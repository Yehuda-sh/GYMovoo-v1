/**
 * @file src/screens/welcome/__tests__/QuickLoginRealUser.test.tsx
 * @brief בדיקות עבור התחברות מהירה במסך הברוכים הבאים
 * @description בודק את פונקציונליות ההתחברות המהירה ב-WelcomeScreen
 *
 * Features tested:
 * - התחברות מהירה עם פורמט תוצאה נכון
 * - הסתרת כפתור כשהשירות לא זמין
 * - אינטגרציה עם quickLoginService
 *
 * @updated 2025-09-05 תוקן המבנה והוסרו mocks מיותרים
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import WelcomeScreen from "../WelcomeScreen";

// Mock useUserStore
const mockSetUser = jest.fn();
const mockGetState = jest.fn();
jest.mock("../../../stores/userStore", () => ({
  useUserStore: () => ({
    setUser: mockSetUser,
    getState: mockGetState,
  }),
}));

// Mock navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ reset: jest.fn(), navigate: jest.fn() }),
}));

// Mock logger
jest.mock("../../../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock welcome texts
jest.mock("../../../constants/welcomeScreenTexts", () => ({
  WELCOME_SCREEN_TEXTS: {
    HEADERS: {
      APP_NAME: "GYMovoo",
      TAGLINE: "המסע שלך להתעוררות",
    },
    FEATURES: {
      PERSONAL_PLANS: "תוכניות אישיות",
      PROGRESS_TRACKING: "מעקב התקדמות",
      QUICK_WORKOUTS: "אימונים מהירים",
      SUPPORTIVE_COMMUNITY: "קהילה תומכת",
    },
    ACTIONS: {
      START_NOW: "התחל עכשיו",
      HAVE_ACCOUNT: "יש לך חשבון?",
    },
    A11Y: {
      START_JOURNEY: "התחל המסע",
      START_JOURNEY_HINT: "התחל את המסע לכושר",
    },
    PROMOTION: {
      DIVIDER_TEXT: "או",
    },
  },
  getWelcomeContentPackage: jest.fn().mockReturnValue({
    greeting: "ברוכים הבאים",
    subtitle: "בואו נתחיל",
    userStats: "משתמשים פעילים",
  }),
  getWelcomeTextCacheStats: jest.fn().mockReturnValue({}),
  formatEnhancedUserStats: jest.fn().mockReturnValue("סטטיסטיקות"),
}));

// Basic noop mocks
jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

// Mock quick login service with correct API format
jest.mock("../../../services/auth/quickLoginService", () => ({
  isQuickLoginAvailable: jest.fn().mockResolvedValue(true),
  tryQuickLogin: jest.fn().mockImplementation(async () => {
    // Simulate successful quick login with correct return format
    const testUser = {
      id: "test_user_123",
      name: "Test User",
      email: "test@example.com",
      smartquestionnairedata: {
        answers: { age: "26_35" },
        metadata: {
          completedAt: new Date().toISOString(),
          version: "1.0",
        },
      },
    };
    mockSetUser(testUser);
    return { ok: true, userId: "test_user_123" }; // Correct format
  }),
}));

describe("QuickLoginRealUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("בדיקה שהתחברות מהירה עובדת עם הפורמט הנכון", async () => {
    const { getByText } = render(<WelcomeScreen />);

    // Wait for quick login button to appear
    const btn = await waitFor(() => getByText("כניסה מהירה"));
    fireEvent.press(btn);

    // Verify that setUser was called with the expected user data
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "test_user_123",
          name: "Test User",
          email: "test@example.com",
        })
      );
    });
  });

  test("בדיקה שהכפתור לא מופיע כשהשירות לא זמין", async () => {
    // Mock service unavailable
    const {
      isQuickLoginAvailable,
    } = require("../../../services/auth/quickLoginService");
    isQuickLoginAvailable.mockResolvedValue(false);

    const { queryByText } = render(<WelcomeScreen />);

    // Quick login button should not be visible
    await waitFor(() => {
      expect(queryByText("כניסה מהירה")).toBeNull();
    });
  });
});
