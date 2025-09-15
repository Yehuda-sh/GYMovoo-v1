/**
 * @file src/utils/rtlHelpers.ts
 * @description עזרי RTL חיוניים לממשק עברי - בשימוש כבד ברחבי האפליקציה
 */

import { I18nManager } from "react-native";
import { logger } from "./logger";

/**
 * אתחול RTL פשוט
 */
export const initializeRTL = (): void => {
  try {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
    logger.info("RTL", "RTL initialized successfully", {
      isRTL: I18nManager.isRTL,
    });
  } catch (error) {
    logger.error("RTL", "RTL initialization failed", error);
  }
};

/**
 * מצב RTL מרכזי - פשוט ויעיל
 */
export const isRTL = (): boolean => {
  return I18nManager.isRTL;
};
