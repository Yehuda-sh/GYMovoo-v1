// Quick login service based on existing Supabase session
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase/client";
import { userApi } from "../api/userApi";
import { useUserStore } from "../../stores/userStore";
import { StorageKeys } from "../../constants/StorageKeys";

if (!supabase) {
  throw new Error("Supabase client not initialized");
}

export type QuickLoginResult =
  | { ok: true; userId: string }
  | {
      ok: false;
      reason:
        | "NO_SESSION"
        | "REFRESH_FAILED"
        | "FETCH_USER_FAILED"
        | "UNKNOWN_ERROR";
    };

export const isQuickLoginAvailable = async (): Promise<boolean> => {
  const result = await tryQuickLogin();
  return result.ok;
};

export const tryQuickLogin = async (): Promise<QuickLoginResult> => {
  try {
    // Check if user explicitly logged out
    const userLoggedOut = await AsyncStorage.getItem(
      StorageKeys.USER_LOGGED_OUT
    );
    if (userLoggedOut === "true") return { ok: false, reason: "NO_SESSION" };

    // Get current session
    if (!supabase) return { ok: false, reason: "NO_SESSION" };

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session?.user?.id)
      return { ok: false, reason: "NO_SESSION" };

    let currentSession = session;

    // Check if session needs refresh (less than 5 minutes remaining)
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at || 0;

    if (expiresAt <= now + 300) {
      if (!session.refresh_token) return { ok: false, reason: "NO_SESSION" };

      // Try to refresh session
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token: session.refresh_token,
        });

      if (refreshError || !refreshData.session?.user) {
        return { ok: false, reason: "REFRESH_FAILED" };
      }

      currentSession = refreshData.session;
    }

    // Fetch user data
    const authUserId = currentSession.user.id;
    const user = await userApi.getByAuthId(authUserId);

    if (!user?.id) return { ok: false, reason: "FETCH_USER_FAILED" };

    // Update user store
    useUserStore.getState().setUser(user);

    // Clear logout flag and save cache
    try {
      await AsyncStorage.removeItem(StorageKeys.USER_LOGGED_OUT);
      if (user.id)
        await AsyncStorage.setItem(StorageKeys.LAST_USER_ID, user.id);
      if (user.email)
        await AsyncStorage.setItem(StorageKeys.LAST_EMAIL, user.email);
    } catch {
      // Cache operations are non-critical
    }

    return { ok: true, userId: user.id };
  } catch (error) {
    console.error("Quick login failed with unexpected error:", error);
    return { ok: false, reason: "UNKNOWN_ERROR" };
  }
};
