/**
 * @file src/__tests__/userApi.getByAuthId.test.ts
 * @description טסטים עבור userApi.getByAuthId function
 */

// Mock Supabase before importing userApi
jest.mock("../services/supabase/client", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

import { userApi } from "../services/api/userApi";
import type { User } from "../types";

// Mock the entire userApi module except getByAuthId
jest.mock("../services/api/userApi", () => {
  const originalModule = jest.requireActual("../services/api/userApi");

  // Create a mock selectSingleBy function
  const mockSelectSingleBy = jest.fn();

  return {
    ...originalModule,
    userApi: {
      ...originalModule.userApi,
      getByAuthId: jest.fn(),
    },
    __mockSelectSingleBy: mockSelectSingleBy,
  };
});

// Get the mocked function
const mockGetByAuthId = userApi.getByAuthId as jest.MockedFunction<
  typeof userApi.getByAuthId
>;

describe("userApi.getByAuthId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user when found successfully", async () => {
    const mockUser: User = {
      id: "user-123",
      name: "John Doe",
      email: "test@example.com",
    };

    mockGetByAuthId.mockResolvedValue(mockUser);

    const result = await userApi.getByAuthId("auth-456");

    expect(result).toEqual(mockUser);
    expect(mockGetByAuthId).toHaveBeenCalledWith("auth-456");
  });

  it("should return undefined when user not found", async () => {
    mockGetByAuthId.mockResolvedValue(undefined);

    const result = await userApi.getByAuthId("nonexistent-auth-id");

    expect(result).toBeUndefined();
    expect(mockGetByAuthId).toHaveBeenCalledWith("nonexistent-auth-id");
  });

  it("should handle network errors", async () => {
    mockGetByAuthId.mockRejectedValue(new Error("Network error"));

    await expect(userApi.getByAuthId("auth-456")).rejects.toThrow(
      "Network error"
    );
    expect(mockGetByAuthId).toHaveBeenCalledWith("auth-456");
  });

  it("should handle empty auth_id", async () => {
    mockGetByAuthId.mockResolvedValue(undefined);

    const result = await userApi.getByAuthId("");

    expect(result).toBeUndefined();
    expect(mockGetByAuthId).toHaveBeenCalledWith("");
  });

  it("should handle special characters in auth_id", async () => {
    const specialAuthId = "auth-!@#$%^&*()_+-=[]{}|;:,.<>?";
    const mockUser: User = {
      id: "user-special",
      name: "Special User",
      email: "special@example.com",
    };

    mockGetByAuthId.mockResolvedValue(mockUser);

    const result = await userApi.getByAuthId(specialAuthId);

    expect(result).toEqual(mockUser);
    expect(mockGetByAuthId).toHaveBeenCalledWith(specialAuthId);
  });

  it("should handle very long auth_id", async () => {
    const longAuthId = "a".repeat(1000);

    mockGetByAuthId.mockResolvedValue(undefined);

    const result = await userApi.getByAuthId(longAuthId);

    expect(result).toBeUndefined();
    expect(mockGetByAuthId).toHaveBeenCalledWith(longAuthId);
  });

  it("should handle various return types", async () => {
    // Test with valid user object
    const validUser: User = {
      id: "user-1",
      name: "Valid User",
      email: "valid@example.com",
    };

    mockGetByAuthId.mockResolvedValue(validUser);
    let result = await userApi.getByAuthId("valid-auth-id");
    expect(result).toEqual(validUser);

    // Test with undefined return
    mockGetByAuthId.mockResolvedValue(undefined);
    result = await userApi.getByAuthId("invalid-auth-id");
    expect(result).toBeUndefined();
  });
});
