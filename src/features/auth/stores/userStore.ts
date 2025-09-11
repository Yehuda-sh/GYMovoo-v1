/**
 * @file index.ts
 * @description יצירת חנות המשתמש לאחסון מצב האימות והנתונים
 */

import { create } from "zustand";
import type { User, AuthState } from "../types";

export interface UserStore extends AuthState {
  // פעולות
  setUser: (user: User | null) => void;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // מצב התחלתי
  isLoggedIn: false,
  user: null,
  authToken: null,

  // פעולות
  setUser: (user: User | null) => set({ user, isLoggedIn: !!user }),
  setAuthToken: (authToken: string | null) => set({ authToken }),
  logout: () => set({ isLoggedIn: false, user: null, authToken: null }),
}));

// מייצא את החנות עצמה לשימוש ישיר
export const userStore = useUserStore;
