import axios from "axios";
import type { User } from "../../types";

// Supabase REST API Configuration
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

if (!isSupabaseEnabled) {
  throw new Error(
    "⚠️ Supabase configuration missing. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// Create Supabase axios instance
const api = axios.create({
  baseURL: `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1`,
  timeout: 10000,
  headers: {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
    Prefer: "return=representation",
  },
});

// Add request/response interceptors for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.message);
    if (error.response?.data) {
      console.error("   Error Data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  // Health check - verify Supabase connection
  health: async () => {
    const { data } = await api.get<{ id: string }[]>(`/users`, {
      params: { select: "id", limit: 1 },
    });
    return data ? "ok" : "fail";
  },

  list: async () => {
    const { data } = await api.get<User[]>(`/users`, {
      params: { select: "*" },
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<User[]>(`/users`, {
      params: { select: "*", id: `eq.${id}` },
    });
    return data?.[0] as User;
  },

  getByEmail: async (email: string) => {
    const { data } = await api.get<User[]>(`/users`, {
      params: { select: "*", email: `eq.${email}` },
    });
    return data?.[0] as User;
  },

  create: async (user: Pick<User, "name" | "email"> & Partial<User>) => {
    const { data } = await api.post<User[]>(`/users`, user);
    return (
      data && Array.isArray(data) ? data[0] : (data as unknown as User)
    ) as User;
  },

  update: async (id: string, updates: Partial<User>) => {
    const { data } = await api.patch<User[]>(`/users`, updates, {
      params: { id: `eq.${id}` },
    });
    return (
      data && Array.isArray(data) ? data[0] : (data as unknown as User)
    ) as User;
  },

  remove: async (id: string) => {
    const { status } = await api.delete(`/users`, {
      params: { id: `eq.${id}` },
    });
    return status === 204 || status === 200;
  },
};
