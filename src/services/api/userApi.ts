import axios from "axios";
import { Platform } from "react-native";
import type { User } from "../../types";

const fromEnv =
  process.env.EXPO_PUBLIC_STORAGE_BASE_URL || process.env.STORAGE_BASE_URL;
let BASE_URL = fromEnv || "http://localhost:3001";
// אמולטור אנדרואיד: localhost מתייחס למכשיר, לא למחשב המארח
if (!fromEnv && Platform.OS === "android" && BASE_URL.includes("localhost")) {
  BASE_URL = "http://10.0.2.2:3001";
}

export const userApi = {
  health: () => axios.get(`${BASE_URL}/health`).then((r) => r.data),
  list: () => axios.get(`${BASE_URL}/users`).then((r) => r.data as User[]),
  getById: (id: string) =>
    axios.get(`${BASE_URL}/users/${id}`).then((r) => r.data as User),
  getByEmail: (email: string) =>
    axios
      .get(`${BASE_URL}/users/by-email/${encodeURIComponent(email)}`)
      .then((r) => r.data as User),
  create: (user: Pick<User, "name" | "email"> & Partial<User>) =>
    axios.post(`${BASE_URL}/users`, user).then((r) => r.data as User),
  update: (id: string, updates: Partial<User>) =>
    axios.put(`${BASE_URL}/users/${id}`, updates).then((r) => r.data as User),
  remove: (id: string) =>
    axios.delete(`${BASE_URL}/users/${id}`).then((r) => r.status === 204),
};
