import type { User } from "../../types";
import { fieldMapper } from "../../utils/fieldMapper";
import { supabase } from "../supabase/client";

// Local non-null assertion – we already validated env vars during client creation.
const sb = supabase as NonNullable<typeof supabase> | null;
if (!sb) {
  throw new Error(
    "Supabase client not initialized. Ensure EXPO_PUBLIC_SUPABASE_URL & EXPO_PUBLIC_SUPABASE_ANON_KEY are set."
  );
}

// After runtime guard we can safely assert non-null
const client = sb!;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const devLog = (...args: any[]) => {
  if (__DEV__) console.warn("[userApi]", ...args);
};

// Helpers to reduce duplication
const mapFromDB = (raw: unknown): User | undefined => {
  if (!raw) return undefined;
  return fieldMapper.fromDB(raw as Record<string, unknown>) as User;
};
const mapToDB = (value: unknown): Record<string, unknown> =>
  fieldMapper.toDB(value as Record<string, unknown>);

async function selectSingleBy(
  column: string,
  value: string
): Promise<User | undefined> {
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq(column, value)
    .limit(1)
    .maybeSingle();
  if (error) {
    devLog(`selectSingleBy error (${column})`, error.message);
    return undefined;
  }
  return mapFromDB(data);
}

export const userApi = {
  // Health check - verify Supabase connection
  health: async (): Promise<string> => {
    const { data, error } = await client
      .from("users")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (error) {
      devLog("health error", error.message);
      return "fail";
    }
    return data ? "ok" : "fail";
  },

  list: async (): Promise<User[]> => {
    const { data, error } = await client.from("users").select("*");
    if (error) {
      devLog("list error", error.message);
      return [];
    }
    return (data || [])
      .map((u) => mapFromDB(u) as User)
      .filter(Boolean) as User[];
  },

  getById: async (id: string): Promise<User | undefined> => {
    return selectSingleBy("id", id);
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    return selectSingleBy("email", email);
  },

  getByAuthId: async (authId: string): Promise<User | undefined> => {
    return selectSingleBy("auth_id", authId);
  },

  create: async (
    user: Pick<User, "name" | "email"> & Partial<User>
  ): Promise<User> => {
    const payload = mapToDB(user);
    const { data, error } = await client
      .from("users")
      .insert(payload)
      .select()
      .maybeSingle();
    if (error || !data) {
      throw error || new Error("Failed to create user");
    }
    const mapped = mapFromDB(data);
    if (!mapped) throw new Error("Mapping failure on create");
    return mapped;
  },

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    const payload = mapToDB(updates);
    const { data, error } = await client
      .from("users")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error || !data) {
      throw error || new Error("Failed to update user");
    }
    const mapped = mapFromDB(data);
    if (!mapped) throw new Error("Mapping failure on update");
    return mapped;
  },

  remove: async (id: string): Promise<boolean> => {
    const { error } = await client.from("users").delete().eq("id", id);
    if (error) {
      devLog("remove error", error.message);
      return false;
    }
    return true;
  },
};
