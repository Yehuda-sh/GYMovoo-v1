/**
 * @file src/hooks/__tests__/useQuestionnaireStatus.test.ts
 * @description בדיקות מעודכנות ל-hook מצב השאלון
 * @updated 2025-09-03 עדכון לממשק החדש והמפושט
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
  useUserWithQuestionnaire,
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

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current).toEqual({
      hasQuestionnaire: false,
      isComplete: false,
      dataSource: "none",
    });
  });

  test("should return correct status for user with smart questionnaire data", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      smartquestionnairedata: {
        metadata: {
          completedAt: "2023-08-01T10:00:00Z",
          version: "1.0",
        },
        answers: {},
      },
    };

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current).toEqual({
      hasQuestionnaire: true,
      isComplete: true,
      dataSource: "smart",
      completedAt: "2023-08-01T10:00:00Z",
    });
  });

  test("should return correct status for user with legacy questionnaire data", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      questionnairedata: {
        completedAt: "2023-07-01T10:00:00Z",
        answers: {},
      },
    };

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current).toEqual({
      hasQuestionnaire: true,
      isComplete: true,
      dataSource: "legacy",
      completedAt: "2023-07-01T10:00:00Z",
    });
  });

  test("should return correct status for user with basic questionnaire", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      questionnaire: {},
      hasQuestionnaire: true,
    };

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current).toEqual({
      hasQuestionnaire: true,
      isComplete: true,
      dataSource: "basic",
    });
  });

  test("should return incomplete for basic questionnaire without hasQuestionnaire flag", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      questionnaire: {},
      hasQuestionnaire: false,
    };

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current).toEqual({
      hasQuestionnaire: true,
      isComplete: false,
      dataSource: "basic",
    });
  });

  test("should prioritize smart questionnaire over legacy", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      smartquestionnairedata: {
        metadata: {
          completedAt: "2023-08-01T10:00:00Z",
          version: "1.0",
        },
        answers: {},
      },
      questionnairedata: {
        completedAt: "2023-07-01T10:00:00Z",
        answers: {},
      },
    };

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current.dataSource).toBe("smart");
    expect(result.current.completedAt).toBe("2023-08-01T10:00:00Z");
  });

  test("should handle null user gracefully", () => {
    mockUseUserStore.mockReturnValue(null);

    const { result } = renderHook(() => useQuestionnaireStatus());

    expect(result.current).toEqual({
      hasQuestionnaire: false,
      isComplete: false,
      dataSource: "none",
    });
  });
});

describe("useIsQuestionnaireComplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return true when questionnaire is complete", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      hasQuestionnaire: true,
      questionnaire: {},
    };

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useIsQuestionnaireComplete());
    expect(result.current).toBe(true);
  });

  test("should return false when questionnaire is not complete", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
    };

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useIsQuestionnaireComplete());
    expect(result.current).toBe(false);
  });
});

describe("useUserWithQuestionnaire", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return user, status and isReady correctly", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      smartquestionnairedata: {
        metadata: {
          completedAt: "2023-08-01T10:00:00Z",
          version: "1.0",
        },
        answers: {},
      },
    };

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useUserWithQuestionnaire());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.status.hasQuestionnaire).toBe(true);
    expect(result.current.status.isComplete).toBe(true);
    expect(result.current.status.dataSource).toBe("smart");
    expect(result.current.isReady).toBe(true);
  });

  test("should return isReady false when no questionnaire", () => {
    const mockUser: Partial<User> = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
    };

    mockUseUserStore.mockReturnValue(mockUser as User);

    const { result } = renderHook(() => useUserWithQuestionnaire());

    expect(result.current.isReady).toBe(false);
  });

  test("should handle null user gracefully", () => {
    mockUseUserStore.mockReturnValue(null);

    const { result } = renderHook(() => useUserWithQuestionnaire());

    expect(result.current.user).toBe(null);
    expect(result.current.isReady).toBe(false);
  });
});
