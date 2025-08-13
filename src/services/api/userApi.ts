import axios from "axios";
import { Platform } from "react-native";
import type { User } from "../../types";

// קביעת BASE_URL לפי ENV עם נרמול ופתרון אוטומטי לאנדרואיד (10.0.2.2)
const resolveBaseUrl = () => {
  const rawEnv = (
    process.env.EXPO_PUBLIC_STORAGE_BASE_URL ||
    process.env.STORAGE_BASE_URL ||
    ""
  ).trim();

  // ברירת מחדל לפי פלטפורמה
  let base =
    rawEnv ||
    (Platform.OS === "android"
      ? "http://10.0.2.2:3001"
      : "http://localhost:3001");

  try {
    const url = new URL(base);
    // באנדרואיד, אם מוגדר localhost/127.0.0.1 ב-ENV → החלפה ל-10.0.2.2
    if (
      Platform.OS === "android" &&
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
    ) {
      url.hostname = "10.0.2.2";
      base = url.toString();
    }
  } catch {
    // אם ה-URL לא תקין, נשאיר את הבסיס כפי שהוא
  }

  // הסרת סלאשים בסוף למניעת // כפול
  return base.replace(/\/+$/, "");
};

const BASE_URL = resolveBaseUrl();

// יצירת axios instance עם baseURL קבוע ו-timeout
const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export const userApi = {
  health: () => api.get<string>(`/health`).then((r) => r.data),
  list: () => api.get<User[]>(`/users`).then((r) => r.data),
  getById: (id: string) => api.get<User>(`/users/${id}`).then((r) => r.data),
  getByEmail: (email: string) =>
    api
      .get<User>(`/users/by-email/${encodeURIComponent(email)}`)
      .then((r) => r.data),
  create: (user: Pick<User, "name" | "email"> & Partial<User>) =>
    api.post<User>(`/users`, user).then((r) => r.data),
  update: (id: string, updates: Partial<User>) =>
    api.put<User>(`/users/${id}`, updates).then((r) => r.data),
  remove: (id: string) =>
    api.delete(`/users/${id}`).then((r) => r.status === 204),
};
