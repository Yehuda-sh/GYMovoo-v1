/**
 * @file src/services/auth/quickLoginService.ts
 * @description שירות התחברות מהירה מבוסס session Supab    // אם אין session או שהוא פג, ננסה לרענן
    if (!currentSession?.user || !currentSession.expires_at) {
      if (__DEV__) {
        logger.debug("quickLoginService", `${logContext} No valid session found`);
      }
      return { ok: false, reason: "NO_SESSION" };
    }ם
 * @description Quick login service based on existing Supabase session
 * 
 * עקרונות:
 * - Supabase = מקור אמת יחיד
 * - AsyncStorage = cache בלבד (נתונים לא-רגישים)
 * - אין אחסון סיסמאות
 * - רק session refresh ו-user hydration
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase/client";
import { userApi } from "../api/userApi";
import { useUserStore } from "../../stores/userStore";
import { logger } from "../../utils/logger";
import { errorHandler } from "../../utils/errorHandler";
import { StorageKeys } from "../../constants/StorageKeys";

export type QuickLoginResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "NO_SESSION" | "REFRESH_FAILED" | "FETCH_USER_FAILED" };

/**
 * בדיקה האם Quick Login זמין
 * @returns true אם יש session זמין או בר-רענון
 */
export const isQuickLoginAvailable = async (): Promise<boolean> => {
  try {
    if (!supabase) {
      if (__DEV__) {
        logger.debug("quickLoginService", "Supabase client not available");
      }
      return false;
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      if (__DEV__) {
        logger.debug("quickLoginService", "Session check error", error.message);
      }
      return false;
    }

    // אם יש session תקף
    if (session?.user && session.expires_at) {
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at;
      
      // אם ה-session עדיין תקף לפחות ל-5 דקות
      if (expiresAt > now + 300) {
        return true;
      }
    }

    // אם יש refresh token, ננסה לרענן
    if (session?.refresh_token) {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: session.refresh_token
      });
      
      if (!refreshError && refreshData.session?.user) {
        return true;
      }
    }

    return false;
  } catch (error) {
    if (__DEV__) {
      logger.debug("quickLoginService", "isQuickLoginAvailable error", String(error));
    }
    return false;
  }
};

/**
 * ניסיון התחברות מהירה
 * @param opts אפשרויות נוספות
 * @returns תוצאת ההתחברות
 */
export const tryQuickLogin = async (opts?: { reason?: string }): Promise<QuickLoginResult> => {
  const logContext = opts?.reason ? `[${opts.reason}]` : "";
  
  try {
    if (!supabase) {
      if (__DEV__) {
        logger.debug("quickLoginService", `${logContext} Supabase client not available`);
      }
      return { ok: false, reason: "NO_SESSION" };
    }

    // שלב 1: בדיקת session קיים
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      if (__DEV__) {
        logger.debug("quickLoginService", `${logContext} Session error`, sessionError.message);
      }
      errorHandler.reportError(sessionError, { 
        source: 'quickLoginService/getSession',
        context: logContext 
      });
      return { ok: false, reason: "NO_SESSION" };
    }

    let currentSession = session;

    // שלב 2: אם אין session או שהוא פג, ננסה לרענן
    if (!currentSession?.user || !currentSession.expires_at) {
      if (__DEV__) {
        logger.debug("quickLoginService", `${logContext} No valid session found`);
      }
      return { ok: false, reason: "NO_SESSION" };
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = currentSession.expires_at;

    // אם ה-session פג או עומד לפוג בקרוב (פחות מ-5 דקות)
    if (expiresAt <= now + 300) {
      if (!currentSession.refresh_token) {
        if (__DEV__) {
          logger.debug("quickLoginService", `${logContext} Session expired and no refresh token`);
        }
        return { ok: false, reason: "NO_SESSION" };
      }

      // ניסיון רענון
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: currentSession.refresh_token
      });

      if (refreshError || !refreshData.session?.user) {
        if (__DEV__) {
          logger.debug("quickLoginService", `${logContext} Session refresh failed`, refreshError?.message || "Unknown error");
        }
        errorHandler.reportError(refreshError || new Error("Refresh failed"), { 
          source: 'quickLoginService/refreshSession',
          context: logContext 
        });
        return { ok: false, reason: "REFRESH_FAILED" };
      }

      currentSession = refreshData.session;
      if (__DEV__) {
        logger.debug("quickLoginService", `${logContext} Session refreshed successfully`);
      }
    }

    // שלב 3: שליפת נתוני המשתמש מ-Supabase
    const authUserId = currentSession.user.id;
    
    try {
      const user = await userApi.getByAuthId(authUserId);
      
      if (!user) {
        if (__DEV__) {
          logger.debug("quickLoginService", `${logContext} User not found for auth ID: ${authUserId}`);
        }
        errorHandler.reportError(new Error(`User not found for auth ID: ${authUserId}`), { 
          source: 'quickLoginService/fetchUser',
          context: logContext 
        });
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
          logger.debug("quickLoginService", `${logContext} Cache save failed`, String(storageError));
        }
      }

      if (__DEV__) {
        logger.debug("quickLoginService", `${logContext} Quick login successful`, 
          `userId: ${user.id}, userName: ${user.name}, userEmail: ${user.email}`);
      }

      return { ok: true, userId: user.id! };

    } catch (fetchError) {
      if (__DEV__) {
        logger.debug("quickLoginService", `${logContext} User fetch error`, String(fetchError));
      }
      errorHandler.reportError(fetchError as Error, { 
        source: 'quickLoginService/fetchUser',
        context: logContext 
      });
      return { ok: false, reason: "FETCH_USER_FAILED" };
    }

  } catch (error) {
    if (__DEV__) {
      logger.debug("quickLoginService", `${logContext} Unexpected error`, String(error));
    }
    errorHandler.reportError(error as Error, { 
      source: 'quickLoginService/tryQuickLogin',
      context: logContext 
    });
    return { ok: false, reason: "NO_SESSION" };
  }
};
