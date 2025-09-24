// src/services/api/userApi.ts
// User API service for Supabase integration

import type { User } from "../../core/types/user.types";
import { fieldMapper } from "../../utils/fieldMapper";
import { supabase } from "../supabase/client";
import { logger } from "../../utils/logger";

// Narrow supabase availability once, throw early if missing.
const getSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }
  return supabase;
};

// Small helpers to keep code tidy
const mapFromDBUser = (row: Record<string, unknown>): User => {
  return fieldMapper.fromDB(row) as User;
};

const mapToDBUser = (updates: Partial<User>): Record<string, unknown> => {
  return fieldMapper.toDB(updates as Record<string, unknown>);
};

export const userApi = {
  /**
   * Health-check endpoint – useful for DI tests/mocks
   */
  health: async (): Promise<string> => "ok",

  /**
   * List all users (mapped to app shape). Returns [] on error.
   */
  list: async (): Promise<User[]> => {
    try {
      const client = getSupabase();
      const { data, error } = await client.from("users").select("*");

      if (error) {
        logger.warn("UserAPI", "Failed to list users", {
          error: error.message,
        });
        return [];
      }

      return (data ?? [])
        .map((item) => mapFromDBUser(item as Record<string, unknown>))
        .filter(Boolean);
    } catch (err) {
      logger.error("UserAPI", "Unhandled error listing users", err);
      return [];
    }
  },

  /**
   * Get a user by row id (PK). Returns undefined if not found or on error.
   */
  getById: async (id: string): Promise<User | undefined> => {
    if (!id) return undefined;

    try {
      const client = getSupabase();
      const { data, error } = await client
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        logger.warn("UserAPI", "getById failed", { id, error: error.message });
        return undefined;
      }

      return data ? mapFromDBUser(data as Record<string, unknown>) : undefined;
    } catch (err) {
      logger.error("UserAPI", "Unhandled error in getById", { id, err });
      return undefined;
    }
  },

  /**
   * Get a user by auth_id (external auth mapping). Returns undefined if not found or on error.
   */
  getByAuthId: async (authId: string): Promise<User | undefined> => {
    if (!authId) return undefined;

    try {
      const client = getSupabase();
      const { data, error } = await client
        .from("users")
        .select("*")
        .eq("auth_id", authId)
        .maybeSingle();

      if (error) {
        logger.warn("UserAPI", "getByAuthId failed", {
          authId,
          error: error.message,
        });
        return undefined;
      }

      return data ? mapFromDBUser(data as Record<string, unknown>) : undefined;
    } catch (err) {
      logger.error("UserAPI", "Unhandled error in getByAuthId", {
        authId,
        err,
      });
      return undefined;
    }
  },

  /**
   * Update a user by id, returning the mapped row.
   * Throws on invalid params or DB errors.
   */
  update: async (id: string, updates: Partial<User>): Promise<User> => {
    if (!id) throw new Error("Invalid parameters");

    try {
      const client = getSupabase();
      const payload = mapToDBUser(updates);

      const { data, error } = await client
        .from("users")
        .update(payload)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error || !data) {
        logger.error("UserAPI", "Failed to update user", {
          id,
          error: error?.message,
        });
        throw new Error("Failed to update user");
      }

      const mapped = mapFromDBUser(data as Record<string, unknown>);
      if (!mapped) throw new Error("Failed to map user data");

      logger.info("UserAPI", "User updated", { id: mapped.id });
      return mapped;
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Unknown error updating user");
    }
  },

  /**
   * Create a new user row. If DB insert fails, returns a local fallback user (dev-friendly).
   * NOTE: If your table has a DB-generated id, prefer to let Supabase create it.
   */
  create: async (userData: Omit<User, "id">): Promise<User> => {
    try {
      logger.debug("UserAPI", "Creating user", {
        user: userData.name,
        email: userData.email,
      });

      const payload = mapToDBUser(userData);
      // If your DB generates IDs, remove this line. Kept for compatibility:
      (payload as Record<string, unknown>).id =
        `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

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

      const mapped = mapFromDBUser(data as Record<string, unknown>);
      if (!mapped) throw new Error("Failed to map user data");

      logger.info("UserAPI", "User created successfully", { id: mapped.id });
      return mapped;
    } catch (error) {
      // DEV fallback (non-fatal): let app continue to function without DB
      logger.error("UserAPI", "User creation failed", error);

      // ✅ אל תכלול שדות אופציונליים כשהם undefined (תואם exactOptionalPropertyTypes)
      const localUserBase: User = {
        ...(userData as User),
        id: `local_${Date.now()}`,
      };

      const localUser: User = {
        ...localUserBase,
        ...(typeof userData.hasQuestionnaire === "boolean"
          ? { hasQuestionnaire: userData.hasQuestionnaire }
          : {}),
        ...(userData.questionnaireData
          ? { questionnaireData: userData.questionnaireData }
          : {}),
      };

      logger.warn("UserAPI", "Using local fallback user", { id: localUser.id });
      return localUser;
    }
  },
};
