// User API service for Supabase integration
import type { User } from "../../types";
import { fieldMapper } from "../../utils/fieldMapper";
import { supabase } from "../supabase/client";

if (!supabase) {
  throw new Error("Supabase client not initialized");
}

export const userApi = {
  health: async (): Promise<string> => "ok",

  list: async (): Promise<User[]> => {
    const { data, error } = await supabase!.from("users").select("*");
    if (error) return [];
    return (data || [])
      .map(
        (item) => fieldMapper.fromDB(item as Record<string, unknown>) as User
      )
      .filter(Boolean);
  },

  getById: async (id: string): Promise<User | undefined> => {
    if (!id) return undefined;
    const { data, error } = await supabase!
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return undefined;
    return data
      ? (fieldMapper.fromDB(data as Record<string, unknown>) as User)
      : undefined;
  },

  getByAuthId: async (authId: string): Promise<User | undefined> => {
    if (!authId) return undefined;
    const { data, error } = await supabase!
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .maybeSingle();
    if (error) return undefined;
    return data
      ? (fieldMapper.fromDB(data as Record<string, unknown>) as User)
      : undefined;
  },

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    if (!id) throw new Error("Invalid parameters");

    const payload = fieldMapper.toDB(updates as Record<string, unknown>);
    const { data, error } = await supabase!
      .from("users")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error || !data) throw new Error("Failed to update user");

    const mapped = fieldMapper.fromDB(data as Record<string, unknown>) as User;
    if (!mapped) throw new Error("Failed to map user data");
    return mapped;
  },

  create: async (userData: Omit<User, "id">): Promise<User> => {
    const payload = fieldMapper.toDB(userData as Record<string, unknown>);
    const { data, error } = await supabase!
      .from("users")
      .insert(payload)
      .select()
      .maybeSingle();

    if (error || !data) throw new Error("Failed to create user");

    const mapped = fieldMapper.fromDB(data as Record<string, unknown>) as User;
    if (!mapped) throw new Error("Failed to map user data");
    return mapped;
  },
};
