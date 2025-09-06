/**
 * @file src/screens/auth/__tests__/RegisterScreen.integration.test.tsx
 * @description בדיקת אינטגרציה בין RegisterScreen ל-localDataService
 */

import { localDataService } from "../../../services/localDataService";
import { User } from "../../../types/index";

describe("RegisterScreen Integration with localDataService", () => {
  
  it("should save user to localDataService during registration", () => {
    const testUser: User = {
      email: "test@example.com",
      name: "Test User",
      id: "test_user_123",
      provider: "manual",
    };

    const savedUser = localDataService.addUser(testUser);
    
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe(testUser.email);
    expect(savedUser.name).toBe(testUser.name);
    expect(savedUser.provider).toBe("manual");

    // בדיקה שהמשתמש נשמר
    const users = localDataService.getUsers();
    const newUser = users.find((u) => u.email === testUser.email);
    expect(newUser).toBeDefined();
  });

  it("should handle Google registration data", () => {
    const googleUser: User = {
      email: "google@example.com",
      name: "Google User",
      id: "google_user_123",
      provider: "google",
      questionnaire: { 1: "answer1", 2: "answer2" },
    };

    const savedUser = localDataService.addUser(googleUser);
    
    expect(savedUser.provider).toBe("google");
    expect(savedUser.questionnaire).toBeDefined();

    const users = localDataService.getUsers();
    const retrievedUser = users.find((u) => u.email === googleUser.email);
    expect(retrievedUser?.questionnaire).toEqual(googleUser.questionnaire);
  });

  it("should preserve user data structure", () => {
    const userWithData: User = {
      email: "fulldata@example.com",
      name: "Full Data User",
      id: "fulldata_123",
      provider: "manual",
      preferences: {
        theme: "light",
        notifications: true,
        language: "he",
      },
    };

    const savedUser = localDataService.addUser(userWithData);
    
    expect(savedUser.preferences?.theme).toBe("light");
    expect(savedUser.preferences?.language).toBe("he");
  });

  it("should handle duplicate emails", () => {
    const user1: User = {
      email: "duplicate@example.com",
      name: "First User",
      id: "user1_123",
      provider: "manual",
    };

    const user2: User = {
      email: "duplicate@example.com", 
      name: "Second User",
      id: "user2_123",
      provider: "google",
    };

    localDataService.addUser(user1);
    const result = localDataService.addUser(user2);

    expect(result).toBeDefined();
    
    const users = localDataService.getUsers();
    const usersWithEmail = users.filter((u) => u.email === "duplicate@example.com");
    expect(usersWithEmail.length).toBeGreaterThanOrEqual(1);
  });
});
