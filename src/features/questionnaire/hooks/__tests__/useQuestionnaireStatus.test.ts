/**
 * @file src/features/questionnaire/hooks/__tests__/useQuestionnaireStatus.test.ts
 * @description בדיקות מעודכנות ל-hook מצב השאלון
 * @updated 2025-09-03 עדכון לממשק החדש והמפושט
 */

// Mock environment variables
process.env.EXPO_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "test-key";

// Mock userApi
jest.mock("../../../../services/api/userApi", () => ({
  userApi: {},
}));

import { renderHook } from "@testing-library/react-native";
import {
  useQuestionnaireStatus,
  useIsQuestionnaireComplete,
  useUserWithQuestionnaire,
} from "../useQuestionnaireStatus";
import { useUserStore } from "../../../../stores/userStore";
import type { User } from "../../../../types";

// Mock the user store
jest.mock("../../../../stores/userStore", () => ({
  useUserStore: jest.fn(),
}));

const mockUseUserStore = useUserStore as jest.MockedFunction<
  typeof useUserStore
>;

describe("useQuestionnaireStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return isComplete=false for null user", () => {
    // Given
    mockUseUserStore.mockReturnValue({
      user: null,
    } as any);

    // When
    const { result } = renderHook(() => useQuestionnaireStatus());

    // Then
    expect(result.current.isComplete).toBe(false);
    expect(result.current.isStarted).toBe(false);
    expect(result.current.isPartial).toBe(false);
    expect(result.current.hasData).toBe(false);
  });

  it("should return isComplete=true for a user with complete questionnaire data", () => {
    // Given
    mockUseUserStore.mockReturnValue({
      user: {
        id: "test-user",
        email: "test@example.com",
        hasCompletedQuestionnaire: true,
        questionnaireData: {
          version: "2.0",
          height: 180,
          weight: 80,
          gender: "male",
          goals: ["strength"],
          trainingDays: [1, 3, 5],
          trainingDuration: 60,
          diet: "none",
          equipment: ["dumbbells", "barbell"],
        },
      } as User,
    } as any);

    // When
    const { result } = renderHook(() => useQuestionnaireStatus());

    // Then
    expect(result.current.isComplete).toBe(true);
    expect(result.current.isStarted).toBe(true);
    expect(result.current.isPartial).toBe(false);
    expect(result.current.hasData).toBe(true);
  });

  it("should return isPartial=true for a user with partial questionnaire data", () => {
    // Given
    mockUseUserStore.mockReturnValue({
      user: {
        id: "test-user",
        email: "test@example.com",
        hasCompletedQuestionnaire: false,
        questionnaireData: {
          version: "2.0",
          height: 180,
          weight: 80,
          gender: "male",
          // Missing required fields: goals, trainingDays, trainingDuration, etc.
        },
      } as User,
    } as any);

    // When
    const { result } = renderHook(() => useQuestionnaireStatus());

    // Then
    expect(result.current.isComplete).toBe(false);
    expect(result.current.isStarted).toBe(true);
    expect(result.current.isPartial).toBe(true);
    expect(result.current.hasData).toBe(true);
  });

  it("should return hasData=true if user has any questionnaire data", () => {
    // Given
    mockUseUserStore.mockReturnValue({
      user: {
        id: "test-user",
        email: "test@example.com",
        hasCompletedQuestionnaire: false,
        questionnaireData: {
          // Just one field is enough to be considered "has data"
          height: 180,
        },
      } as User,
    } as any);

    // When
    const { result } = renderHook(() => useQuestionnaireStatus());

    // Then
    expect(result.current.isComplete).toBe(false);
    expect(result.current.isStarted).toBe(true);
    expect(result.current.isPartial).toBe(true);
    expect(result.current.hasData).toBe(true);
  });

  it("should return isComplete=false if user is missing required questionnaire fields", () => {
    // Given
    mockUseUserStore.mockReturnValue({
      user: {
        id: "test-user",
        email: "test@example.com",
        hasCompletedQuestionnaire: true, // This is true but data is incomplete
        questionnaireData: {
          version: "2.0",
          height: 180,
          // Missing required fields
        },
      } as User,
    } as any);

    // When
    const { result } = renderHook(() => useQuestionnaireStatus());

    // Then
    expect(result.current.isComplete).toBe(false);
    expect(result.current.isStarted).toBe(true);
    expect(result.current.isPartial).toBe(true);
    expect(result.current.hasData).toBe(true);
  });

  it("should handle empty arrays in questionnaire data", () => {
    // Given
    mockUseUserStore.mockReturnValue({
      user: {
        id: "test-user",
        email: "test@example.com",
        hasCompletedQuestionnaire: true,
        questionnaireData: {
          version: "2.0",
          height: 180,
          weight: 80,
          gender: "male",
          goals: [], // Empty array
          trainingDays: [], // Empty array
          trainingDuration: 60,
          diet: "none",
          equipment: [], // Empty array
        },
      } as User,
    } as any);

    // When
    const { result } = renderHook(() => useQuestionnaireStatus());

    // Then
    expect(result.current.isComplete).toBe(false); // Should be false with empty arrays
  });

  it("should handle undefined questionnaire data", () => {
    // Given
    mockUseUserStore.mockReturnValue({
      user: {
        id: "test-user",
        email: "test@example.com",
        hasCompletedQuestionnaire: false,
        questionnaireData: undefined,
      } as User,
    } as any);

    // When
    const { result } = renderHook(() => useQuestionnaireStatus());

    // Then
    expect(result.current.isComplete).toBe(false);
    expect(result.current.isStarted).toBe(false);
    expect(result.current.isPartial).toBe(false);
    expect(result.current.hasData).toBe(false);
  });
});

describe("useIsQuestionnaireComplete", () => {
  it("should return the isComplete value from useQuestionnaireStatus", () => {
    // Given
    mockUseUserStore.mockReturnValue({
      user: {
        id: "test-user",
        email: "test@example.com",
        hasCompletedQuestionnaire: true,
        questionnaireData: {
          version: "2.0",
          height: 180,
          weight: 80,
          gender: "male",
          goals: ["strength"],
          trainingDays: [1, 3, 5],
          trainingDuration: 60,
          diet: "none",
          equipment: ["dumbbells", "barbell"],
        },
      } as User,
    } as any);

    // When
    const { result } = renderHook(() => useIsQuestionnaireComplete());

    // Then
    expect(result.current).toBe(true);
  });
});

describe("useUserWithQuestionnaire", () => {
  it("should return null if user is null", () => {
    // Given
    mockUseUserStore.mockReturnValue({
      user: null,
    } as any);

    // When
    const { result } = renderHook(() => useUserWithQuestionnaire());

    // Then
    expect(result.current).toBeNull();
  });

  it("should return user with questionnaireStatus", () => {
    // Given
    const user = {
      id: "test-user",
      email: "test@example.com",
      hasCompletedQuestionnaire: true,
      questionnaireData: {
        version: "2.0",
        height: 180,
        weight: 80,
        gender: "male",
        goals: ["strength"],
        trainingDays: [1, 3, 5],
        trainingDuration: 60,
        diet: "none",
        equipment: ["dumbbells", "barbell"],
      },
    } as User;

    mockUseUserStore.mockReturnValue({
      user,
    } as any);

    // When
    const { result } = renderHook(() => useUserWithQuestionnaire());

    // Then
    expect(result.current).toEqual({
      ...user,
      questionnaireStatus: {
        isComplete: true,
        isStarted: true,
        isPartial: false,
        hasData: true,
      },
    });
  });
});
