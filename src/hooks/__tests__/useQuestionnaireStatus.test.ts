/**
 * @file src/hooks/__tests__/useQuestionnaireStatus.test.ts
 * @description בדיקות ל-hook מצב השאלון
 */

// Mock environment variables
process.env.EXPO_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "test-key";

// Mock userApi
jest.mock("../../services/api/userApi", () => ({
  userApi: {},
}));

import { renderHook } from "@testing-library/react-native";
import {
  useQuestionnaireStatus,
  useIsQuestionnaireComplete,
} from "../useQuestionnaireStatus";
import { useUserStore } from "../../stores/userStore";
import type { User } from "../../types";

// Mock the user store
jest.mock("../../stores/userStore");
const mockUseUserStore = useUserStore as jest.MockedFunction<
  typeof useUserStore
>;

describe("useQuestionnaireStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return correct status for user without questionnaire", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
    };

    mockUseUserStore.mockReturnValue({
      user: mockUser as User,
      setUser: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current).toEqual({
      hasQuestionnaire: false,
      isComplete: false,
      hasTrainingStage: false,
      hasProfileStage: false,
      dataSource: "none",
    });
  });

  test("should return correct status for user with hasQuestionnaire flag", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      hasQuestionnaire: true,
    };

    mockUseUserStore.mockReturnValue({
      user: mockUser as User,
      setUser: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current.hasQuestionnaire).toBe(false); // No actual questionnaire data
    expect(result.current.isComplete).toBe(true); // But hasQuestionnaire flag is true
  });

  test("useIsQuestionnaireComplete should work correctly", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      hasQuestionnaire: true,
    };

    mockUseUserStore.mockReturnValue({
      user: mockUser as User,
      setUser: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useIsQuestionnaireComplete());
    expect(result.current).toBe(true);
  });

  test("should handle null user gracefully", () => {
    mockUseUserStore.mockReturnValue({
      user: null,
      setUser: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current).toEqual({
      hasQuestionnaire: false,
      isComplete: false,
      hasTrainingStage: false,
      hasProfileStage: false,
      dataSource: "none",
    });
  });
});
