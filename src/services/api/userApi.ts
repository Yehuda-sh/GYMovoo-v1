// User API service for Supabase integration
import type { User } from "../../types";
import { fieldMapper } from "../../utils/fieldMapper";
import { supabase } from "../supabase/client";

const client = supabase;
if (!client) {
  throw new Error("Supabase client not initialized");
}

const mapFromDB = (raw: unknown): User | undefined => {
  if (!raw) return undefined;
  return fieldMapper.fromDB(raw as Record<string, unknown>) as User;
};

const mapToDB = (value: unknown): Record<string, unknown> =>
  fieldMapper.toDB(value as Record<string, unknown>);

export const userApi = {
  health: async (): Promise<string> => {
    if (!client) return "fail";
    const { error } = await client
      .from("users")
      .select("id")
      .limit(1)
      .maybeSingle();
    return error ? "fail" : "ok";
  },

  list: async (): Promise<User[]> => {
    if (!client) return [];
    const { data, error } = await client.from("users").select("*");
    if (error) return [];
    return (data || []).map(mapFromDB).filter(Boolean) as User[];
  },

  getById: async (id: string): Promise<User | undefined> => {
    if (!client || !id) return undefined;
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return undefined;
    return mapFromDB(data);
  },

  getByAuthId: async (authId: string): Promise<User | undefined> => {
    if (!client || !authId) return undefined;
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .maybeSingle();
    if (error) return undefined;
    return mapFromDB(data);
  },

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    if (!client || !id) throw new Error("Invalid parameters");

    const payload = mapToDB(updates);
    const { data, error } = await client
      .from("users")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error || !data) throw new Error("Failed to update user");

    const mapped = mapFromDB(data);
    if (!mapped) throw new Error("Failed to map user data");
    return mapped;
  },
};
