import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import WelcomeScreen from "../WelcomeScreen";
// Mock userApi early to avoid Supabase env validation
const mockList = jest.fn();
jest.mock("../../../services/api/userApi", () => ({
  userApi: {
    list: (...args: any[]) => mockList(...args),
  },
}));
import { userApi } from "../../../services/api/userApi";

// Mock useUserStore
const mockSetUser = jest.fn();
const mockGetState = jest.fn();
jest.mock("../../../stores/userStore", () => ({
  useUserStore: () => ({
    setUser: mockSetUser,
    getState: mockGetState,
  }),
}));
import { useUserStore } from "../../../stores/userStore";

// Mock navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ reset: jest.fn(), navigate: jest.fn() }),
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

// Mock quick login service
jest.mock("../../../services/auth/quickLoginService", () => ({
  isQuickLoginAvailable: jest.fn().mockResolvedValue(true),
  tryQuickLogin: jest.fn().mockImplementation(async () => {
    // Simulate setting a demo user
    const demoUser = {
      id: "demo_1",
      name: "Demo User One",
      isDemo: true,
      smartquestionnairedata: {
        answers: { age: 26 },
        metadata: {
          completedAt: new Date().toISOString(),
          version: "1.0",
        },
      },
    };
    mockSetUser(demoUser);
    return { success: true };
  }),
}));

describe("QuickLoginRealUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("בחר משתמש דמו בלבד לבטיחות", async () => {
    const fakeUsers = [
      {
        id: "demo_1",
        name: "Demo User One",
        isDemo: true,
        smartquestionnairedata: { answers: { age: "26_35" } },
      },
      {
        id: "real_2",
        name: "Real User Two",
        isDemo: false,
        smartquestionnairedata: { answers: { age: "18_25" } },
      },
    ];
    mockList.mockResolvedValueOnce(fakeUsers as any);

    const { getByText } = render(<WelcomeScreen />);
    const btn = await waitFor(() => getByText("כניסה מהירה"));
    fireEvent.press(btn);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "demo_1",
          isDemo: true,
        })
      );
    });
  });
});
