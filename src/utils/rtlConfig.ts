/**
 * @file src/utils/rtlConfig.ts
 * @brief הגדרות RTL גלובליות לאפליקציה העברית
 * @description מכריח RTL בכל האפליקציה בלי תלות בהגדרות המכשיר
 * @version 2.0.0 - ניקוי לוגים - RTL עובד בהצלחה
 */

import { I18nManager } from "react-native";

/**
 * מכריח RTL בכל האפליקציה
 * Forces RTL for the entire application
 */
export const initializeRTL = () => {
  // הפעלת RTL מאולץ
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  return I18nManager.isRTL;
};

/**
 * מחזיר את מצב RTL הנוכחי
 * Returns current RTL state
 */
export const getRTLState = () => ({
  isRTL: I18nManager.isRTL,
  allowRTL: I18nManager.allowRTL,
  doLeftAndRightSwapInRTL: I18nManager.doLeftAndRightSwapInRTL,
});

/**
 * בדיקה אם RTL פעיל
 * Check if RTL is active
 */
export const isRTLActive = (): boolean => {
  return I18nManager.isRTL;
};

// אתחול אוטומטי בזמן import
initializeRTL();
