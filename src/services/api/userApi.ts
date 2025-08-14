import axios from "axios";
import { Platform } from "react-native";
import type { User } from "../../types";

// מצב Supabase REST – אם הוגדר URL ומפתח anon, נשתמש בו ונגדיר כותרות מתאימות
const SUPABASE_URL = (
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ""
).trim();
const SUPABASE_ANON = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  ""
).trim();
const isSupabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON);

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

// יצירת axios instance
const api = isSupabaseEnabled
  ? axios.create({
      baseURL: `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1`,
      timeout: 10000,
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        Prefer: "return=representation",
      },
    })
  : axios.create({ baseURL: resolveBaseUrl(), timeout: 10000 });

// Debug: להבין מיד לאן אנו פונים
if (typeof __DEV__ !== "undefined" && __DEV__) {
  // eslint-disable-next-line no-console
  console.warn(`🔍 userApi Debug:
    - Mode: ${isSupabaseEnabled ? "Supabase" : "Local"}
    - Base URL: ${api.defaults.baseURL}
    - Has Supabase URL: ${!!SUPABASE_URL}
    - Has Supabase Key: ${!!SUPABASE_ANON}
  `);
}

// הוסף interceptor לדיבוג
api.interceptors.request.use(
  (config) => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log(
        `📤 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      if (config.params) {
        // eslint-disable-next-line no-console
        console.log("   Params:", config.params);
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log(
        `📥 API Response: ${response.status} - ${response.config.url}`
      );
      if (response.data) {
        // eslint-disable-next-line no-console
        console.log(
          "   Data:",
          Array.isArray(response.data)
            ? `Array(${response.data.length})`
            : response.data
        );
      }
    }
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.status, error.message);
    if (error.response?.data)
      console.error("   Error Data:", error.response.data);
    return Promise.reject(error);
  }
);

export const userApi = {
  // Health: במצב Supabase – ניסיון לקרוא שורה אחת מטבלת users; אחרת health endpoint רגיל
  health: async () => {
    if (isSupabaseEnabled) {
      const { data } = await api.get<{ id: string }[]>(`/users`, {
        params: { select: "id", limit: 1 },
      });
      return data ? "ok" : "fail";
    }
    const { data } = await api.get<string>(`/health`);
    return data;
  },
  list: async () => {
    if (isSupabaseEnabled) {
      const { data } = await api.get<User[]>(`/users`, {
        params: { select: "*" },
      });
      return data;
    }
    const { data } = await api.get<User[]>(`/users`);
    return data;
  },
  getById: async (id: string) => {
    if (isSupabaseEnabled) {
      const { data } = await api.get<User[]>(`/users`, {
        params: { select: "*", id: `eq.${id}` },
      });
      return data?.[0] as User;
    }
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },
  getByEmail: async (email: string) => {
    if (isSupabaseEnabled) {
      const { data } = await api.get<User[]>(`/users`, {
        params: { select: "*", email: `eq.${email}` },
      });
      return data?.[0] as User;
    }
    const { data } = await api.get<User>(
      `/users/by-email/${encodeURIComponent(email)}`
    );
    return data;
  },
  create: async (user: Pick<User, "name" | "email"> & Partial<User>) => {
    if (isSupabaseEnabled) {
      const { data } = await api.post<User[]>(`/users`, user);
      return (
        data && Array.isArray(data) ? data[0] : (data as unknown as User)
      ) as User;
    }
    const { data } = await api.post<User>(`/users`, user);
    return data;
  },
  update: async (id: string, updates: Partial<User>) => {
    if (isSupabaseEnabled) {
      const { data } = await api.patch<User[]>(`/users`, updates, {
        params: { id: `eq.${id}` },
      });
      return (
        data && Array.isArray(data) ? data[0] : (data as unknown as User)
      ) as User;
    }
    const { data } = await api.put<User>(`/users/${id}`, updates);
    return data;
  },
  remove: async (id: string) => {
    if (isSupabaseEnabled) {
      const { status } = await api.delete(`/users`, {
        params: { id: `eq.${id}` },
      });
      return status === 204 || status === 200;
    }
    const { status } = await api.delete(`/users/${id}`);
    return status === 204;
  },
};
