/**
 * @file useAuth.ts
 * @description Hook לניהול מצב האימות במערכת
 */

import { useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  LoginCredentials,
  User,
  AuthError,
  RegisterCredentials,
  UserPreferences,
} from "../types";
import {
  mockLogin,
  mockRegister,
  mockLogout,
  mockResetPassword,
} from "../services/mockAuthService";
import { logger } from "../../../utils/logger";

// מפתחות אחסון
const STORAGE_KEYS = {
  REMEMBER_ME: "auth_remember_me",
  SAVED_EMAIL: "auth_saved_email",
};

// טיפוס למצב האימות בחנות
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
}

// חנות Zustand לניהול מצב האימות
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // בסביבת פיתוח נשתמש בשירות מדומה
      const user = await mockLogin(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
      logger.info("Auth", "User logged in successfully", { userId: user.id });
      return;
    } catch (error) {
      const authError = error as AuthError;
      set({ error: authError, isLoading: false });
      logger.error("Auth", "Login failed", { error: authError });
      return Promise.reject(authError);
    }
  },

  register: async (userData: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // בסביבת פיתוח נשתמש בשירות מדומה
      const user = await mockRegister(userData);
      set({ user, isAuthenticated: true, isLoading: false });
      logger.info("Auth", "User registered successfully", { userId: user.id });
      return;
    } catch (error) {
      const authError = error as AuthError;
      set({ error: authError, isLoading: false });
      logger.error("Auth", "Registration failed", { error: authError });
      return Promise.reject(authError);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // בסביבת פיתוח נשתמש בשירות מדומה
      await mockLogout();
      set({ user: null, isAuthenticated: false, isLoading: false });
      logger.info("Auth", "User logged out");
      return;
    } catch (error) {
      const authError = error as AuthError;
      set({ error: authError, isLoading: false });
      logger.error("Auth", "Logout failed", { error: authError });
      return Promise.reject(authError);
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      // בסביבת פיתוח נשתמש בשירות מדומה
      const success = await mockResetPassword(email);
      set({ isLoading: false });
      logger.info("Auth", "Password reset requested", { email });
      return success;
    } catch (error) {
      const authError = error as AuthError;
      set({ error: authError, isLoading: false });
      logger.error("Auth", "Password reset failed", { error: authError });
      return Promise.reject(authError);
    }
  },

  clearError: () => set({ error: null }),
}));

/**
 * פונקציה לשמירת העדפות משתמש קשורות לאימות
 */
const saveAuthPreferences = async (preferences: {
  rememberMe: boolean;
  email?: string | undefined;
}): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.REMEMBER_ME,
      String(preferences.rememberMe)
    );

    if (preferences.email) {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, preferences.email);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL);
    }
  } catch (error) {
    logger.error("Auth", "Failed to save auth preferences", error);
  }
};

/**
 * הוק לניהול אימות המשתמש
 * מספק פונקציות להתחברות, הרשמה, התנתקות ואיפוס סיסמה
 */
export const useAuth = () => {
  const navigation = useNavigation();

  // שימוש בחנות האימות
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    clearError,
  } = useAuthStore();

  // טיפול בשגיאות אימות
  useEffect(() => {
    if (error) {
      Alert.alert("שגיאה", error.message);
      clearError();
    }
  }, [error, clearError]);

  /**
   * פונקציה להתחברות משתמש
   * @param credentials פרטי התחברות
   * @param rememberMe האם לזכור את המשתמש
   */
  const handleLogin = useCallback(
    async (credentials: LoginCredentials, rememberMe: boolean = false) => {
      try {
        await login(credentials);

        // שמירת העדפת "זכור אותי" אם נבחרה
        if (user) {
          await saveAuthPreferences({
            rememberMe,
            email: rememberMe ? credentials.email : undefined,
          });
        }

        // @ts-ignore - מעבר למסך הראשי (יש להתאים את הטיפוס של הניווט)
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } catch (err) {
        // השגיאה מטופלת ע"י האפקט לעיל
      }
    },
    [login, navigation, user]
  );

  /**
   * פונקציה להרשמת משתמש
   * @param userData נתוני המשתמש להרשמה
   */
  const handleRegister = useCallback(
    async (userData: RegisterCredentials) => {
      try {
        await register(userData);

        // מעבר למסך הראשי לאחר הרשמה מוצלחת
        // @ts-ignore - מעבר למסך הראשי (יש להתאים את הטיפוס של הניווט)
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } catch (err) {
        // השגיאה מטופלת ע"י האפקט לעיל
      }
    },
    [register, navigation]
  );

  /**
   * פונקציה להתנתקות מהמערכת
   */
  const handleLogout = useCallback(async () => {
    try {
      await logout();

      // מעבר למסך ההתחברות
      // @ts-ignore - מעבר למסך הראשי (יש להתאים את הטיפוס של הניווט)
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (err) {
      // השגיאה מטופלת ע"י האפקט לעיל
    }
  }, [logout, navigation]);

  /**
   * פונקציה לאיפוס סיסמה
   * @param email כתובת המייל לאיפוס סיסמה
   */
  const handleResetPassword = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        return await resetPassword(email);
      } catch (err) {
        // השגיאה מטופלת ע"י האפקט לעיל
        return false;
      }
    },
    [resetPassword]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    resetPassword: handleResetPassword,
  };
};
