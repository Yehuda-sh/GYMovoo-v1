/**
 * @file src/utils/rtlHelpers.ts
 * @description עזרי RTL בסיסיים לממשק עברי
 */

import { I18nManager } from "react-native";

/**
 * אתחול RTL פשוט
 */
export const initializeRTL = (): boolean => {
  try {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
    return I18nManager.isRTL;
  } catch (error) {
    console.warn("RTL initialization failed:", error);
    return false;
  }
};

// Cache RTL state for performance
let _cachedIsRTL: boolean | null = null;

/**
 * מצב RTL מרכזי עם caching לביצועים
 */
export const isRTL = (): boolean => {
  if (_cachedIsRTL === null) {
    _cachedIsRTL = I18nManager.isRTL;
  }
  return _cachedIsRTL;
};
