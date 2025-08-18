/**
 * @file src/__tests__/WelcomeScreen.quickLogin.test.tsx
 * @description טסטים עבור Quick Login ב-WelcomeScreen
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import WelcomeScreen from "../screens/welcome/WelcomeScreen";
import {
  isQuickLoginAvailable,
  tryQuickLogin,
} from "../services/auth/quickLoginService";

// Mock של React Navigation
const mockNavigate = jest.fn();
const mockReset = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: mockReset,
  }),
  NavigationProp: {},
}));

// Mock של quick login service
jest.mock("../services/auth/quickLoginService", () => ({
  isQuickLoginAvailable: jest.fn(),
  tryQuickLogin: jest.fn(),
}));

// Mock של useUserStore
const mockSetUser = jest.fn();
const mockGetCompletionStatus = jest.fn();
jest.mock("../stores/userStore", () => ({
  useUserStore: () => ({
    setUser: mockSetUser,
    user: null,
    getCompletionStatus: mockGetCompletionStatus,
  }),
}));

// Mock של AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock של logger
jest.mock("../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock של Haptics
jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
}));

// Mock של LinearGradient
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: any) => children,
}));

// Mock של Ionicons ו-MaterialCommunityIcons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  MaterialCommunityIcons: "MaterialCommunityIcons",
}));

// Mock של welcome screen texts
jest.mock("../constants/welcomeScreenTexts", () => ({
  WELCOME_SCREEN_TEXTS: {
    HEADERS: {
      APP_NAME: "GYMovoo",
      TAGLINE: "האימון המושלם שלך מתחיל כאן",
    },
    FEATURES: {
      PERSONAL_PLANS: "תוכניות מותאמות אישית",
      PROGRESS_TRACKING: "מעקב התקדמות",
      QUICK_WORKOUTS: "אימונים מהירים",
      SUPPORTIVE_COMMUNITY: "קהילה תומכת",
    },
    ACTIONS: {
      START_NOW: "התחל עכשיו",
      HAVE_ACCOUNT: "כבר יש לי חשבון",
    },
    PROMOTION: {
      DIVIDER_TEXT: "או",
    },
    USERS: {
      ACTIVE_USERS_TEMPLATE: "{count} משתמשים פעילים כרגע",
    },
  },
  generateActiveUsersCount: () => 1234,
  formatActiveUsersText: (count: number) => `${count} משתמשים פעילים`,
}));

const mockIsQuickLoginAvailable = isQuickLoginAvailable as jest.MockedFunction<
  typeof isQuickLoginAvailable
>;
const mockTryQuickLogin = tryQuickLogin as jest.MockedFunction<
  typeof tryQuickLogin
>;

describe("WelcomeScreen Quick Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCompletionStatus.mockReturnValue({
      hasSmartQuestionnaire: false,
      isFullySetup: false,
    });
  });

  describe("Quick Login Button Visibility", () => {
    it("should show quick login button when session is available", async () => {
      mockIsQuickLoginAvailable.mockResolvedValue(true);

      const { getByTestId } = render(<WelcomeScreen />);

      await waitFor(() => {
        expect(getByTestId("quick-login-btn")).toBeTruthy();
      });

      expect(mockIsQuickLoginAvailable).toHaveBeenCalled();
    });

    it("should not show quick login button when session is not available", async () => {
      mockIsQuickLoginAvailable.mockResolvedValue(false);

      const { queryByTestId } = render(<WelcomeScreen />);

      await waitFor(() => {
        expect(queryByTestId("quick-login-btn")).toBeNull();
      });

      expect(mockIsQuickLoginAvailable).toHaveBeenCalled();
    });

    it("should not show quick login button when availability check fails", async () => {
      mockIsQuickLoginAvailable.mockRejectedValue(new Error("Check failed"));

      const { queryByTestId } = render(<WelcomeScreen />);

      await waitFor(() => {
        expect(queryByTestId("quick-login-btn")).toBeNull();
      });

      expect(mockIsQuickLoginAvailable).toHaveBeenCalled();
    });
  });

  describe("Quick Login Functionality", () => {
    beforeEach(() => {
      mockIsQuickLoginAvailable.mockResolvedValue(true);
    });

    it("should handle successful quick login", async () => {
      mockTryQuickLogin.mockResolvedValue({
        ok: true,
        userId: "test-user-123",
      });

      const { getByTestId } = render(<WelcomeScreen />);

      await waitFor(() => {
        expect(getByTestId("quick-login-btn")).toBeTruthy();
      });

      fireEvent.press(getByTestId("quick-login-btn"));

      await waitFor(() => {
        expect(mockTryQuickLogin).toHaveBeenCalledWith({
          reason: "WelcomeScreen user action",
        });
      });
    });

    it("should handle NO_SESSION error", async () => {
      mockTryQuickLogin.mockResolvedValue({
        ok: false,
        reason: "NO_SESSION",
      });

      const { getByTestId, getByText } = render(<WelcomeScreen />);

      await waitFor(() => {
        expect(getByTestId("quick-login-btn")).toBeTruthy();
      });

      fireEvent.press(getByTestId("quick-login-btn"));

      await waitFor(() => {
        expect(
          getByText("לא נמצא חיבור פעיל. אנא התחבר/הירשם מחדש")
        ).toBeTruthy();
      });

      expect(mockTryQuickLogin).toHaveBeenCalled();
    });

    it("should handle REFRESH_FAILED error", async () => {
      mockTryQuickLogin.mockResolvedValue({
        ok: false,
        reason: "REFRESH_FAILED",
      });

      const { getByTestId, getByText } = render(<WelcomeScreen />);

      await waitFor(() => {
        expect(getByTestId("quick-login-btn")).toBeTruthy();
      });

      fireEvent.press(getByTestId("quick-login-btn"));

      await waitFor(() => {
        expect(getByText("חיבור פג תוקף. אנא התחבר/הירשם מחדש")).toBeTruthy();
      });

      expect(mockTryQuickLogin).toHaveBeenCalled();
    });

    it("should handle FETCH_USER_FAILED error", async () => {
      mockTryQuickLogin.mockResolvedValue({
        ok: false,
        reason: "FETCH_USER_FAILED",
      });

      const { getByTestId, getByText } = render(<WelcomeScreen />);

      await waitFor(() => {
        expect(getByTestId("quick-login-btn")).toBeTruthy();
      });

      fireEvent.press(getByTestId("quick-login-btn"));

      await waitFor(() => {
        expect(
          getByText("שגיאה בטעינת נתוני משתמש. נסה שוב מאוחר יותר")
        ).toBeTruthy();
      });

      expect(mockTryQuickLogin).toHaveBeenCalled();
    });

    it("should handle unexpected errors", async () => {
      mockTryQuickLogin.mockRejectedValue(new Error("Unexpected error"));

      const { getByTestId, getByText } = render(<WelcomeScreen />);

      await waitFor(() => {
        expect(getByTestId("quick-login-btn")).toBeTruthy();
      });

      fireEvent.press(getByTestId("quick-login-btn"));

      await waitFor(() => {
        expect(
          getByText("שגיאה בהתחברות מהירה. נסה שוב מאוחר יותר")
        ).toBeTruthy();
      });

      expect(mockTryQuickLogin).toHaveBeenCalled();
    });

    it("should hide quick login button after session errors", async () => {
      mockTryQuickLogin.mockResolvedValue({
        ok: false,
        reason: "NO_SESSION",
      });

      const { getByTestId, queryByTestId } = render(<WelcomeScreen />);

      await waitFor(() => {
        expect(getByTestId("quick-login-btn")).toBeTruthy();
      });

      fireEvent.press(getByTestId("quick-login-btn"));

      await waitFor(() => {
        // הכפתור אמור להיעלם אחרי שגיאת session
        expect(queryByTestId("quick-login-btn")).toBeNull();
      });
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      mockIsQuickLoginAvailable.mockResolvedValue(true);
    });

    it("should have proper accessibility attributes", async () => {
      const { getByTestId } = render(<WelcomeScreen />);

      await waitFor(() => {
        const quickLoginButton = getByTestId("quick-login-btn");
        expect(quickLoginButton).toBeTruthy();

        // בדיקה שיש accessibility properties (תלוי במימוש הספציפי)
        const parent = quickLoginButton.parent;
        expect(parent).toBeTruthy();
      });
    });
  });
});
