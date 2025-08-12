/**
 * @file src/screens/welcome/__tests__/WelcomeScreen.test.tsx
 * @description בדיקות ל-WelcomeScreen - ניווט, UI, התחברות מהירה
 * @description Tests for WelcomeScreen - navigation, UI, quick login
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../WelcomeScreen";
import { useUserStore } from "../../../stores/userStore";
import { localDataService } from "../../../services/localDataService";

// Mock dependencies
jest.mock("../../../stores/userStore");
jest.mock("../../../services/localDataService");
jest.mock("../../../constants/welcomeScreenTexts", () => ({
  WELCOME_SCREEN_TEXTS: {
    HEADERS: {
      APP_NAME: "GYMovoo",
      TAGLINE: "המהפכה הדיגיטלית",
    },
    FEATURES: {
      PERSONAL_PLANS: "תכניות אישיות",
      PROGRESS_TRACKING: "מעקב התקדמות",
      QUICK_WORKOUTS: "אימונים מהירים",
      SUPPORTIVE_COMMUNITY: "קהילה תומכת",
    },
    ACTIONS: {
      START_NOW: "התחל עכשיו",
    },
    PROMOTION: {
      FREE_TRIAL: "ניסיון חינם",
      DIVIDER_TEXT: "או",
    },
    A11Y: {
      START_JOURNEY: "התחל מסע",
      START_JOURNEY_HINT: "מעבר להרשמה",
    },
  },
  generateActiveUsersCount: () => 1250,
  formatActiveUsersText: (count: number) => `${count} משתמשים פעילים עכשיו`,
}));

const mockNavigate = jest.fn();
const mockSetUser = jest.fn();

const MockedUserStore = useUserStore as jest.MockedFunction<
  typeof useUserStore
>;
const MockedLocalDataService = localDataService as jest.Mocked<
  typeof localDataService
>;

// Navigation wrapper for testing
const Stack = createStackNavigator();
const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={() => <>{children}</>} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe("WelcomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock navigation
    jest.doMock("@react-navigation/native", () => ({
      ...jest.requireActual("@react-navigation/native"),
      useNavigation: () => ({
        navigate: mockNavigate,
      }),
    }));

    // Mock user store
    MockedUserStore.mockReturnValue({
      setUser: mockSetUser,
      user: null,
      isLoggedIn: false,
    });
  });

  describe("UI Rendering", () => {
    it("renders welcome screen correctly", () => {
      const { getByText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      expect(getByText("GYMovoo")).toBeTruthy();
      expect(getByText("המהפכה הדיגיטלית")).toBeTruthy();
      expect(getByText("התחל עכשיו")).toBeTruthy();
      expect(getByText("התחברות מהירה")).toBeTruthy();
      expect(getByText("התחברות עם Google")).toBeTruthy();
    });

    it("displays active users count", () => {
      const { getByText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      expect(getByText("1250 משתמשים פעילים עכשיו")).toBeTruthy();
    });

    it("displays all feature icons and texts", () => {
      const { getByText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      expect(getByText("תכניות אישיות")).toBeTruthy();
      expect(getByText("מעקב התקדמות")).toBeTruthy();
      expect(getByText("אימונים מהירים")).toBeTruthy();
      expect(getByText("קהילה תומכת")).toBeTruthy();
    });
  });

  describe("Navigation Actions", () => {
    it("navigates to Register when start button is pressed", () => {
      const { getByText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      const startButton = getByText("התחל עכשיו");
      fireEvent.press(startButton);

      expect(mockNavigate).toHaveBeenCalledWith("Register");
    });

    it("shows Google coming soon message when Google button is pressed", async () => {
      const { getByText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      const googleButton = getByText("התחברות עם Google");
      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(getByText("שגיאה")).toBeTruthy();
      });
    });
  });

  describe("Quick Login Functionality", () => {
    it("logs in successfully when users exist in local storage", async () => {
      const mockUser = {
        id: "user123",
        name: "Test User",
        email: "test@example.com",
      };

      MockedLocalDataService.getUsers.mockReturnValue([mockUser]);

      const { getByText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      const quickLoginButton = getByText("התחברות מהירה");
      fireEvent.press(quickLoginButton);

      await waitFor(() => {
        expect(MockedLocalDataService.getUsers).toHaveBeenCalled();
        expect(mockSetUser).toHaveBeenCalledWith(mockUser);
        expect(mockNavigate).toHaveBeenCalledWith("MainApp");
      });
    });

    it("shows error modal when no users exist in local storage", async () => {
      MockedLocalDataService.getUsers.mockReturnValue([]);

      const { getByText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      const quickLoginButton = getByText("התחברות מהירה");
      fireEvent.press(quickLoginButton);

      await waitFor(() => {
        expect(MockedLocalDataService.getUsers).toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(getByText("שגיאה")).toBeTruthy();
        expect(
          getByText("לא נמצא משתמש אמיתי במאגר. יש להוסיף משתמש דרך הרשמה.")
        ).toBeTruthy();
      });
    });

    it("handles multiple users correctly by selecting first user", async () => {
      const mockUsers = [
        { id: "user1", name: "First User", email: "first@example.com" },
        { id: "user2", name: "Second User", email: "second@example.com" },
      ];

      MockedLocalDataService.getUsers.mockReturnValue(mockUsers);

      const { getByText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      const quickLoginButton = getByText("התחברות מהירה");
      fireEvent.press(quickLoginButton);

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockUsers[0]);
        expect(mockNavigate).toHaveBeenCalledWith("MainApp");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper accessibility labels", () => {
      const { getByLabelText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      expect(getByLabelText("התחל מסע")).toBeTruthy();
      expect(getByLabelText("התחברות מהירה למשתמש אמיתי")).toBeTruthy();
      expect(getByLabelText("התחברות מהירה עם גוגל")).toBeTruthy();
    });
  });

  describe("Error Modal", () => {
    it("closes error modal when confirm button is pressed", async () => {
      MockedLocalDataService.getUsers.mockReturnValue([]);

      const { getByText, queryByText } = render(
        <NavigationWrapper>
          <WelcomeScreen />
        </NavigationWrapper>
      );

      // Trigger error modal
      const quickLoginButton = getByText("התחברות מהירה");
      fireEvent.press(quickLoginButton);

      await waitFor(() => {
        expect(getByText("שגיאה")).toBeTruthy();
      });

      // Close modal
      const confirmButton = getByText("אישור");
      fireEvent.press(confirmButton);

      await waitFor(() => {
        expect(queryByText("שגיאה")).toBeFalsy();
      });
    });
  });
});
