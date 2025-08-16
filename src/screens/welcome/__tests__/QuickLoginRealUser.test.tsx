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

describe("QuickLoginRealUser", () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
  });

  test("בחר משתמש אמיתי (id שאינו demo_) ומגדיר ב-store", async () => {
    const fakeUsers = [
      {
        id: "real_1",
        name: "User One",
        smartquestionnairedata: { answers: { age: "26_35" } },
      },
      {
        id: "real_2",
        name: "User Two",
        smartquestionnairedata: { answers: { age: "18_25" } },
      },
    ];
    mockList.mockResolvedValueOnce(fakeUsers as any);

    const { getByText } = render(<WelcomeScreen />);
    const btn = getByText("התחברות מהירה");
    fireEvent.press(btn);

    await waitFor(() => {
      const st = useUserStore.getState();
      expect(st.user).not.toBeNull();
      expect(st.user && st.user.id && st.user.id.startsWith("demo_")).toBe(
        false
      );
    });
  });
});
