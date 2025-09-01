import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../utils/logger";
import { USER_STORE_CONSTANTS } from "./userStoreConstants";

// =======================================
// 🎯 AsyncStorage Helper Functions
// פונקציות עזר ל-AsyncStorage
// =======================================

/**
 * Safely clears all AsyncStorage data with logging
 */
export const clearAllStorageData = async (context: string): Promise<void> => {
  try {
    logger.info("Storage", `${context} - Starting complete data clear`);

    const allKeys = await AsyncStorage.getAllKeys();
    logger.debug("Storage", `Found ${allKeys.length} keys in AsyncStorage`);

    await AsyncStorage.multiRemove(allKeys);

    logger.info("Storage", `${context} - Data clear completed successfully`);
  } catch (error) {
    logger.error("Storage", `${context} - Error clearing data`, error);
    throw error;
  }
};

/**
 * Safely gets a value from AsyncStorage with error handling
 */
export const safeAsyncStorageGet = async <T>(
  key: string,
  defaultValue?: T
): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue || null;
  } catch (error) {
    logger.error("Storage", `Error getting ${key} from AsyncStorage`, error);
    return defaultValue || null;
  }
};

/**
 * Safely sets a value in AsyncStorage with error handling
 */
export const safeAsyncStorageSet = async <T>(
  key: string,
  value: T
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    logger.error("Storage", `Error setting ${key} in AsyncStorage`, error);
    throw error;
  }
};

// =======================================
// 🎯 Server Sync Helper Functions
// פונקציות עזר לסנכרון שרת
// =======================================

/**
 * Creates a debounced server sync function
 */
export const createDebouncedSync = (
  syncFunction: () => Promise<void>,
  debounceMs: number = USER_STORE_CONSTANTS.SYNC.DEBOUNCE_MS
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (reason?: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      try {
        await syncFunction();
        logger.debug(
          "ServerSync",
          `Sync completed${reason ? ` (${reason})` : ""}`
        );
      } catch (error) {
        logger.error(
          "ServerSync",
          `Sync failed${reason ? ` (${reason})` : ""}`,
          error
        );
      }
    }, debounceMs);
  };
};

/**
 * Validates if a user should be synced (not demo user, has valid ID)
 */
export const shouldSyncUser = (userId?: string | null): boolean => {
  if (!userId || typeof userId !== "string") {
    return false;
  }

  return !userId.startsWith(USER_STORE_CONSTANTS.DEMO_USER.ID_PREFIX);
};

// =======================================
// 🎯 Demo User Helper Functions
// פונקציות עזר למשתמש דמו
// =======================================

/**
 * Generates a demo user ID
 */
export const generateDemoUserId = (): string => {
  return `${USER_STORE_CONSTANTS.DEMO_USER.ID_PREFIX}${Date.now()}`;
};

/**
 * Creates default demo user data
 */
export const createDefaultDemoUser = () => ({
  id: generateDemoUserId(),
  name: USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_NAME,
  gender: USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_GENDER,
  age: USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_AGE,
  experience: USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_EXPERIENCE,
  height: USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_HEIGHT,
  weight: USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_WEIGHT,
  fitnessGoals: [] as string[],
  availableDays: USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_AVAILABLE_DAYS,
  sessionDuration: USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_SESSION_DURATION,
  equipment: [] as string[],
  preferredTime: USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_PREFERRED_TIME,
  createdFromQuestionnaire: true,
  questionnaireTimestamp: new Date().toISOString(),
});

// =======================================
// 🎯 Validation Helper Functions
// פונקציות עזר לאימות
// =======================================

/**
 * Validates minimum questionnaire answers
 */
export const hasMinimumQuestionnaireAnswers = (
  answers?: Record<string, unknown>
): boolean => {
  if (!answers) return false;

  const answerCount = Object.keys(answers).length;
  return (
    answerCount >= USER_STORE_CONSTANTS.VALIDATION.MIN_QUESTIONNAIRE_ANSWERS
  );
};

/**
 * Generic error handler for store operations
 */
export const handleStoreError = (
  error: unknown,
  operation: string,
  context: string = "UserStore"
): void => {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(context, `Error in ${operation}`, { error: message });
};

// =======================================
// 🎯 State Update Helper Functions
// פונקציות עזר לעדכון סטייט
// =======================================

/**
 * Creates a safe state update function that preserves existing user data
 */
export const createSafeUserUpdate = <T extends Record<string, unknown>>(
  updateFunction: (currentUser: T | null) => T | null
) => {
  return (state: { user: T | null }) => ({
    user: updateFunction(state.user),
  });
};

/**
 * Updates user state and schedules server sync
 */
export const updateUserAndScheduleSync = <T extends Record<string, unknown>>(
  updateFunction: (currentUser: T | null) => T | null,
  scheduleSync: (reason: string) => void,
  syncReason: string
) => {
  return (state: { user: T | null }) => {
    const updatedUser = updateFunction(state.user);
    // Schedule sync after state update
    setTimeout(() => scheduleSync(syncReason), 0);
    return { user: updatedUser };
  };
};
