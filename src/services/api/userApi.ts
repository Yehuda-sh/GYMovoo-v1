/**
 * @file src/services/api/userApi.ts
 * @brief Supabase user management API with enhanced error handling and validation
 * @description Comprehensive user API service for Supabase integration, providing
 *              CRUD operations, health checks, and data validation with Hebrew support.
 *              Includes field mapping, error handling, and performance optimizations.
 * @version 1.1.0
 * @status ACTIVE - Core user management service with Supabase integration
 * @updated 2025-09-01 - Enhanced error handling, validation, and additional utility functions
 *
 * 🚀 Features:
 * - Complete CRUD operations for users
 * - Field mapping between app and database schemas
 * - Comprehensive error handling and logging
 * - Input validation and data integrity checks
 * - Health check functionality
 * - Type-safe operations with TypeScript
 * - Hebrew language support in error messages
 */
import type { User } from "../../types";
import { fieldMapper } from "../../utils/fieldMapper";
import { supabase } from "../supabase/client";
import { logger } from "../../utils/logger";

// Local non-null assertion – we already validated env vars during client creation.
const sb = supabase as NonNullable<typeof supabase> | null;
if (!sb) {
  throw new Error(
    "Supabase client not initialized. Ensure EXPO_PUBLIC_SUPABASE_URL & EXPO_PUBLIC_SUPABASE_ANON_KEY are set."
  );
}

// After runtime guard we can safely assert non-null
const client = sb!;

// Constants for validation and limits
const VALIDATION_CONSTANTS = {
  MAX_USER_ID_LENGTH: 100,
  MAX_EMAIL_LENGTH: 254,
  MAX_SEARCH_QUERY_LENGTH: 100,
  MAX_BULK_CREATE_SIZE: 100,
  MAX_SEARCH_RESULTS: 50,
  MIN_SEARCH_QUERY_LENGTH: 2,
} as const;

// Enhanced logging with proper typing and logger integration
const devLog = (
  message: string,
  ...args: (string | number | boolean | object | null | undefined | unknown)[]
) => {
  if (__DEV__) {
    logger.debug("userApi", message, ...args);
  }
};

// Input validation helpers
const validateUserId = (id: string): boolean => {
  return (
    typeof id === "string" &&
    id.length > 0 &&
    id.length <= VALIDATION_CONSTANTS.MAX_USER_ID_LENGTH
  );
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    typeof email === "string" &&
    emailRegex.test(email) &&
    email.length <= VALIDATION_CONSTANTS.MAX_EMAIL_LENGTH
  );
};

const validateUserData = (
  user: Partial<User>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (
    user.name !== undefined &&
    (typeof user.name !== "string" || user.name.trim().length === 0)
  ) {
    errors.push("שם המשתמש חייב להיות מחרוזת לא ריקה");
  }

  if (user.email !== undefined && !validateEmail(user.email)) {
    errors.push("כתובת האימייל לא תקינה");
  }

  return { isValid: errors.length === 0, errors };
};

// Helpers to reduce duplication
const mapFromDB = (raw: unknown): User | undefined => {
  if (!raw) return undefined;
  return fieldMapper.fromDB(raw as Record<string, unknown>) as User;
};
const mapToDB = (value: unknown): Record<string, unknown> =>
  fieldMapper.toDB(value as Record<string, unknown>);

// Helper function for consistent error handling
const handleSupabaseError = (
  error: unknown,
  operation: string,
  defaultMessage: string
): never => {
  const message = error instanceof Error ? error.message : defaultMessage;
  devLog(`${operation} error`, message);
  throw error instanceof Error ? error : new Error(defaultMessage);
};

// Helper function for consistent data mapping with error handling
const mapAndValidateUser = (data: unknown, operation: string): User => {
  const mapped = mapFromDB(data);
  if (!mapped) {
    devLog(`Mapping failure on ${operation}`, data);
    throw new Error(`Mapping failure on ${operation}`);
  }
  return mapped;
};

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
    if (!validateUserId(id)) {
      devLog("Invalid user ID provided", id);
      return undefined;
    }
    return selectSingleBy("id", id);
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    if (!validateEmail(email)) {
      devLog("Invalid email provided", email);
      return undefined;
    }
    return selectSingleBy("email", email);
  },

  getByAuthId: async (authId: string): Promise<User | undefined> => {
    if (!validateUserId(authId)) {
      devLog("Invalid auth ID provided", authId);
      return undefined;
    }
    return selectSingleBy("auth_id", authId);
  },

  create: async (
    user: Pick<User, "name" | "email"> & Partial<User>
  ): Promise<User> => {
    const validation = validateUserData(user);
    if (!validation.isValid) {
      const errorMessage = `Validation failed: ${validation.errors.join(", ")}`;
      devLog("Create validation failed", validation.errors);
      throw new Error(errorMessage);
    }

    const payload = mapToDB(user);
    const { data, error } = await client
      .from("users")
      .insert(payload)
      .select()
      .maybeSingle();
    if (error || !data) {
      handleSupabaseError(error, "Create", "Failed to create user");
    }
    return mapAndValidateUser(data, "create");
  },

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    if (!validateUserId(id)) {
      devLog("Invalid user ID for update", id);
      throw new Error("מזהה משתמש לא תקין");
    }

    const validation = validateUserData(updates);
    if (!validation.isValid) {
      const errorMessage = `Validation failed: ${validation.errors.join(", ")}`;
      devLog("Update validation failed", validation.errors);
      throw new Error(errorMessage);
    }

    const payload = mapToDB(updates);
    const { data, error } = await client
      .from("users")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error || !data) {
      handleSupabaseError(error, "Update", "Failed to update user");
    }
    return mapAndValidateUser(data, "update");
  },

  remove: async (id: string): Promise<boolean> => {
    if (!validateUserId(id)) {
      devLog("Invalid user ID for removal", id);
      throw new Error("מזהה משתמש לא תקין");
    }

    const { error } = await client.from("users").delete().eq("id", id);
    if (error) {
      devLog("Remove error", error.message);
      return false;
    }
    return true;
  },

  // Additional utility functions
  exists: async (id: string): Promise<boolean> => {
    if (!validateUserId(id)) {
      devLog("Invalid user ID for exists check", id);
      return false;
    }

    try {
      const { data, error } = await client
        .from("users")
        .select("id")
        .eq("id", id)
        .limit(1)
        .maybeSingle();

      if (error) {
        devLog("Exists check error", error.message);
        return false;
      }

      return !!data;
    } catch (error) {
      devLog("Exists check failed", error);
      return false;
    }
  },

  count: async (): Promise<number> => {
    try {
      const { count, error } = await client
        .from("users")
        .select("*", { count: "exact", head: true });

      if (error) {
        devLog("Count error", error.message);
        return 0;
      }

      return count || 0;
    } catch (error) {
      devLog("Count failed", error);
      return 0;
    }
  },

  search: async (query: string, limit: number = 10): Promise<User[]> => {
    if (
      !query ||
      typeof query !== "string" ||
      query.trim().length < VALIDATION_CONSTANTS.MIN_SEARCH_QUERY_LENGTH
    ) {
      devLog("Invalid search query", query);
      return [];
    }

    try {
      const { data, error } = await client
        .from("users")
        .select("*")
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(Math.min(limit, VALIDATION_CONSTANTS.MAX_SEARCH_RESULTS)); // Max 50 results

      if (error) {
        devLog("Search error", error.message);
        return [];
      }

      return (data || [])
        .map((u) => mapFromDB(u) as User)
        .filter(Boolean) as User[];
    } catch (error) {
      devLog("Search failed", error);
      return [];
    }
  },

  // Bulk operations
  bulkCreate: async (
    users: (Pick<User, "name" | "email"> & Partial<User>)[]
  ): Promise<User[]> => {
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("Users array is required and cannot be empty");
    }

    if (users.length > VALIDATION_CONSTANTS.MAX_BULK_CREATE_SIZE) {
      throw new Error("Cannot create more than 100 users at once");
    }

    // Validate all users
    const validationErrors: string[] = [];
    users.forEach((user, index) => {
      const validation = validateUserData(user);
      if (!validation.isValid) {
        validationErrors.push(
          `User ${index + 1}: ${validation.errors.join(", ")}`
        );
      }
    });

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed:\n${validationErrors.join("\n")}`);
    }

    const payloads = users.map((user) => mapToDB(user));
    const { data, error } = await client
      .from("users")
      .insert(payloads)
      .select();

    if (error || !data) {
      handleSupabaseError(error, "Bulk create", "Failed to create users");
    }

    const mapped = (data || [])
      .map((u) => mapFromDB(u) as User)
      .filter(Boolean) as User[];

    if (mapped.length !== users.length) {
      devLog("Bulk create mapping failure", {
        expected: users.length,
        actual: mapped.length,
      });
      throw new Error("Some users failed to be created");
    }

    return mapped;
  },

  // Advanced health check with detailed diagnostics
  healthCheck: async (): Promise<{
    status: "ok" | "degraded" | "fail";
    details: {
      connection: boolean;
      read: boolean;
      write: boolean;
      responseTime: number;
    };
    message: string;
  }> => {
    const startTime = Date.now();
    const result = {
      status: "ok" as "ok" | "degraded" | "fail",
      details: {
        connection: false,
        read: false,
        write: false,
        responseTime: 0,
      },
      message: "",
    };

    try {
      // Test basic connection
      const { data: connectionData, error: connectionError } = await client
        .from("users")
        .select("id")
        .limit(1)
        .maybeSingle();

      result.details.connection = !connectionError;
      result.details.read = !!connectionData;

      // Test write capability by attempting to update a non-existent record
      // This tests permissions without creating actual data
      const { error: writeError } = await client
        .from("users")
        .update({ name: "test" })
        .eq("id", "non-existent-test-id")
        .select()
        .limit(1);

      // If there's no permission error, write is considered working
      // (The update will fail because the record doesn't exist, but that's expected)
      result.details.write = !writeError || writeError.code === "PGRST116"; // PGRST116 = no rows found
      result.details.responseTime = Date.now() - startTime;

      // Determine status
      if (
        result.details.connection &&
        result.details.read &&
        result.details.write
      ) {
        result.status = "ok";
        result.message = "כל השירותים פועלים כראוי";
      } else if (result.details.connection && result.details.read) {
        result.status = "degraded";
        result.message = "שירות קריאה תקין, בעיית כתיבה";
      } else {
        result.status = "fail";
        result.message = "שירות לא זמין";
      }
    } catch (error) {
      result.status = "fail";
      result.message = "שגיאה בבדיקת תקינות";
      result.details.responseTime = Date.now() - startTime;
      devLog("Health check failed", error);
    }

    return result;
  },
};
