/**
 * @file src/services/auth/quickLoginService.ts
 * @description שירות התחברות מהירה מבוסס session Supabase
 * @description Quick login service based on existing Supabase session
 *
 * עקרונות:
 * - Supabase = מקור אמת יחיד
 * - AsyncStorage = cache בלבד (נתונים לא-רגישים)
 * - אין אחסון סיסמאות
 * - רק session refresh ו-user hydration
 *
 * @features
 * - ✅ בדיקת זמינות התחברות מהירה
 * - ✅ רענון session אוטומטי
 * - ✅ טעינת נתוני משתמש מ-Supabase
 * - ✅ שמירת cache לא-רגיש
 * - ✅ טיפול מקיף בשגיאות
 * - ✅ לוגים מפורטים לפיתוח
 *
 * @architecture
 * - Session Management: Supabase auth session handling
 * - User Hydration: Fetch user data from Supabase
 * - Cache Strategy: AsyncStorage for non-sensitive data
 * - Error Handling: Comprehensive error reporting
 * - Logging: Development-friendly debug logs
 *
 * @dependencies supabase client, userApi, userStore, AsyncStorage
 * @updated 2025-09-01 - Enhanced with constants, helper functions, type safety, and improved JSDoc
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase/client";
import { userApi } from "../api/userApi";
import { useUserStore } from "../../stores/userStore";
import { logger } from "../../utils/logger";
import { errorHandler } from "../../utils/errorHandler";
import { StorageKeys } from "../../constants/StorageKeys";

// Constants for session management
const SESSION_CONSTANTS = {
  MIN_VALIDITY_BUFFER: 300, // 5 minutes in seconds
  LOG_PREFIX: "quickLoginService",
} as const;

/**
 * Helper function to validate session expiry
 * @param expiresAt Session expiry timestamp
 * @param bufferSeconds Buffer time in seconds (default: 5 minutes)
 * @returns boolean indicating if session is still valid
 */
const isSessionValid = (
  expiresAt: number,
  bufferSeconds: number = SESSION_CONSTANTS.MIN_VALIDITY_BUFFER
): boolean => {
  const now = Math.floor(Date.now() / 1000);
  return expiresAt > now + bufferSeconds;
};

/**
 * Type guard to check if session is properly structured
 * @param session Supabase session object
 * @returns boolean indicating if session has required properties
 */
const isValidSession = (
  session: unknown
): session is {
  user: { id: string };
  expires_at: number;
  refresh_token?: string;
} => {
  if (!session || typeof session !== "object") return false;

  const s = session as Record<string, unknown>;
  return (
    "user" in s &&
    "expires_at" in s &&
    s.user !== null &&
    typeof s.user === "object" &&
    "id" in (s.user as Record<string, unknown>) &&
    typeof (s.user as Record<string, unknown>).id === "string" &&
    typeof s.expires_at === "number"
  );
};

/**
 * Helper function to log debug messages with consistent prefix
 * @param message Debug message
 * @param context Optional context string
 * @param data Optional additional data
 */
const logDebug = (
  message: string,
  context?: string,
  data?: string | number | boolean | object | null | undefined
) => {
  if (__DEV__) {
    const fullMessage = context ? `${context} ${message}` : message;
    logger.debug(SESSION_CONSTANTS.LOG_PREFIX, fullMessage, data);
  }
};

export type QuickLoginResult =
  | { ok: true; userId: string }
  | {
      ok: false;
      reason: "NO_SESSION" | "REFRESH_FAILED" | "FETCH_USER_FAILED";
    };

/**
 * בדיקה האם Quick Login זמין
 * @description Checks if quick login is available by validating Supabase session
 * @returns Promise<boolean> - true if session is valid or can be refreshed
 *
 * @example
 * ```typescript
 * const available = await isQuickLoginAvailable();
 * if (available) {
 *   // Show quick login option
 * }
 * ```
 */
export const isQuickLoginAvailable = async (): Promise<boolean> => {
  try {
    if (!supabase) {
      logDebug("Supabase client not available");
      return false;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      logDebug("Session check error", undefined, error.message);
      return false;
    }

    // אם יש session תקף
    if (session && isValidSession(session)) {
      // אם ה-session עדיין תקף לפחות ל-5 דקות
      if (isSessionValid(session.expires_at)) {
        return true;
      }
    }

    // אם יש refresh token, ננסה לרענן
    if (session?.refresh_token) {
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token: session.refresh_token,
        });

      if (!refreshError && refreshData.session?.user) {
        return true;
      }
    }

    return false;
  } catch (error) {
    logDebug("isQuickLoginAvailable error", undefined, String(error));
    return false;
  }
};

/**
 * ניסיון התחברות מהירה
 * @description Attempts quick login using existing Supabase session
 * @param opts Optional configuration with reason for logging context
 * @returns Promise<QuickLoginResult> - Success with userId or failure with reason
 *
 * @example
 * ```typescript
 * const result = await tryQuickLogin({ reason: "WelcomeScreen" });
 * if (result.ok) {
 *   // Login successful, navigate to main app
 *   navigation.reset({ routes: [{ name: "MainApp" }] });
 * } else {
 *   // Handle login failure
 *   console.log("Login failed:", result.reason);
 * }
 * ```
 */
export const tryQuickLogin = async (opts?: {
  reason?: string;
}): Promise<QuickLoginResult> => {
  const logContext = opts?.reason ? `[${opts.reason}]` : "";

  try {
    if (!supabase) {
      logDebug("Supabase client not available", logContext);
      return { ok: false, reason: "NO_SESSION" };
    }

    // שלב 1: בדיקת session קיים
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      logDebug("Session error", logContext, sessionError.message);
      errorHandler.reportError(sessionError, {
        source: "quickLoginService/getSession",
        context: logContext,
      });
      return { ok: false, reason: "NO_SESSION" };
    }

    let currentSession = session;

    // שלב 2: אם אין session או שהוא פג, ננסה לרענן
    if (!currentSession || !isValidSession(currentSession)) {
      logDebug("No valid session found", logContext);
      return { ok: false, reason: "NO_SESSION" };
    }

    const expiresAt = currentSession.expires_at;

    // אם ה-session פג או עומד לפוג בקרוב (פחות מ-5 דקות)
    if (!isSessionValid(expiresAt)) {
      if (!currentSession.refresh_token) {
        logDebug("Session expired and no refresh token", logContext);
        return { ok: false, reason: "NO_SESSION" };
      }

      // ניסיון רענון
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token: currentSession.refresh_token,
        });

      if (refreshError || !refreshData.session?.user) {
        logDebug(
          "Session refresh failed",
          logContext,
          refreshError?.message || "Unknown error"
        );
        errorHandler.reportError(refreshError || new Error("Refresh failed"), {
          source: "quickLoginService/refreshSession",
          context: logContext,
        });
        return { ok: false, reason: "REFRESH_FAILED" };
      }

      currentSession = refreshData.session;
      logDebug("Session refreshed successfully", logContext);
    }

    // שלב 3: שליפת נתוני המשתמש מ-Supabase
    const authUserId = currentSession.user.id;

    try {
      const user = await userApi.getByAuthId(authUserId);

      if (!user) {
        logDebug(`User not found for auth ID: ${authUserId}`, logContext);
        errorHandler.reportError(
          new Error(`User not found for auth ID: ${authUserId}`),
          {
            source: "quickLoginService/fetchUser",
            context: logContext,
          }
        );
        return { ok: false, reason: "FETCH_USER_FAILED" };
      }

      // שלב 4: עדכון userStore
      useUserStore.getState().setUser(user);

      // שלב 5: שמירת נתונים לא-רגישים ב-cache
      try {
        if (user.id) {
          await AsyncStorage.setItem(StorageKeys.LAST_USER_ID, user.id);
        }
        if (user.email) {
          await AsyncStorage.setItem(StorageKeys.LAST_EMAIL, user.email);
        }
      } catch (storageError) {
        // אם שמירת cache נכשלת, זה לא קריטי
        if (__DEV__) {
          logDebug("Cache save failed", logContext, String(storageError));
        }
      }

      logDebug(
        "Quick login successful",
        logContext,
        `userId: ${user.id}, userName: ${user.name}, userEmail: ${user.email}`
      );

      return { ok: true, userId: user.id! };
    } catch (fetchError) {
      if (__DEV__) {
        logDebug("User fetch error", logContext, String(fetchError));
      }
      errorHandler.reportError(fetchError as Error, {
        source: "quickLoginService/fetchUser",
        context: logContext,
      });
      return { ok: false, reason: "FETCH_USER_FAILED" };
    }
  } catch (error) {
    if (__DEV__) {
      logDebug("Unexpected error", logContext, String(error));
    }
    errorHandler.reportError(error as Error, {
      source: "quickLoginService/tryQuickLogin",
      context: logContext,
    });
    return { ok: false, reason: "NO_SESSION" };
  }
};
