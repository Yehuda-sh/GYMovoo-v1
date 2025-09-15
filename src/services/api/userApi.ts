// User API service for Supabase integration
import type { User } from "../../core/types/user.types";
import { fieldMapper } from "../../utils/fieldMapper";
import { supabase } from "../supabase/client";
import { logger } from "../../utils/logger";

// Ensure we have a valid Supabase client
const getSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }
  return supabase;
};

export const userApi = {
  health: async (): Promise<string> => "ok",

  list: async (): Promise<User[]> => {
    const client = getSupabase();
    const { data, error } = await client.from("users").select("*");
    if (error) return [];
    return (data || [])
      .map(
        (item) => fieldMapper.fromDB(item as Record<string, unknown>) as User
      )
      .filter(Boolean);
  },

  getById: async (id: string): Promise<User | undefined> => {
    if (!id) return undefined;
    const client = getSupabase();
    const { data, error } = await client
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
    const client = getSupabase();
    const { data, error } = await client
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
    const client = getSupabase();
    const payload = fieldMapper.toDB(updates as Record<string, unknown>);
    const { data, error } = await client
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
    try {
      logger.debug("UserAPI", "Creating user", {
        user: userData.name,
        email: userData.email,
      });

      const payload = fieldMapper.toDB(userData as Record<string, unknown>);
      payload.id = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const client = getSupabase();
      const { data, error } = await client
        .from("users")
        .insert(payload)
        .select()
        .maybeSingle();

      if (error) {
        logger.error("UserAPI", "Failed to create user in database", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("No data returned from user creation");
      }

      const mapped = fieldMapper.fromDB(
        data as Record<string, unknown>
      ) as User;
      if (!mapped) {
        throw new Error("Failed to map user data");
      }

      logger.info("UserAPI", "User created successfully", { id: mapped.id });
      return mapped;
    } catch (error) {
      logger.error("UserAPI", "User creation failed", error);

      // Simple fallback for development/testing
      const localUser = {
        ...userData,
        id: `local_${Date.now()}`,
        questionnaireData: userData.questionnaireData || null,
        hasQuestionnaire: userData.hasQuestionnaire || false,
      } as User;

      logger.warn("UserAPI", "Using local fallback user", { id: localUser.id });
      return localUser;
    }
  },
};
