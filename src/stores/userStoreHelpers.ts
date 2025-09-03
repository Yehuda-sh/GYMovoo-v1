import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../utils/logger";

// =======================================
// 🎯 AsyncStorage Helper Functions
// פונקציות עזר ל-AsyncStorage
// =======================================

/**
 * Safely clears all AsyncStorage data with logging
 * Used for complete data reset operations
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
