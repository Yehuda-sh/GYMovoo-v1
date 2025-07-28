/**
 * @file src/utils/rtlHelpers.ts
 * @brief כלי עזר לתמיכה מלאה ב-RTL | RTL support utilities
 * @dependencies react-native I18nManager
 * @notes כל הפונקציות לטיפול בכיווניות RTL במקום אחד
 * @recurring_errors שימוש ב-marginLeft/Right במקום Start/End
 */

import { I18nManager, StyleSheet } from "react-native";

/**
 * בדיקה האם הממשק ב-RTL | Check if interface is RTL
 */
export const isRTL = I18nManager.isRTL;

/**
 * קביעת כיוון flexDirection מותנה | Conditional flexDirection
 */
export const getFlexDirection = (
  reverse: boolean = false
): "row" | "row-reverse" => {
  if (reverse) {
    return isRTL ? "row" : "row-reverse";
  }
  return isRTL ? "row-reverse" : "row";
};

/**
 * קביעת יישור טקסט מותנה | Conditional text alignment
 */
export const getTextAlign = (
  center: boolean = false
): "left" | "right" | "center" => {
  if (center) return "center";
  return isRTL ? "right" : "left";
};

/**
 * יישור הפוך - לטקסט אנגלי בממשק עברי | Reverse alignment for English text in Hebrew UI
 */
export const getReverseTextAlign = (): "left" | "right" => {
  return isRTL ? "left" : "right";
};

/**
 * קביעת שם אייקון חץ מותנה | Conditional arrow icon name
 */
export const getArrowIcon = (forward: boolean = true): string => {
  if (forward) {
    return isRTL ? "chevron-left" : "chevron-right";
  } else {
    return isRTL ? "chevron-right" : "chevron-left";
  }
};

/**
 * יצירת סגנונות RTL מותנים | Create conditional RTL styles
 */
export const createRTLStyle = (styles: {
  marginStart?: number;
  marginEnd?: number;
  paddingStart?: number;
  paddingEnd?: number;
  textAlign?: "left" | "right" | "center";
  flexDirection?: "row" | "row-reverse";
}) => {
  return StyleSheet.create({
    container: {
      marginStart: styles.marginStart,
      marginEnd: styles.marginEnd,
      paddingStart: styles.paddingStart,
      paddingEnd: styles.paddingEnd,
      textAlign: styles.textAlign || getTextAlign(),
      flexDirection: styles.flexDirection || getFlexDirection(),
    },
  });
};

/**
 * המרת margin ישן ל-Start/End | Convert old margin to Start/End
 */
export const convertMargin = (left?: number, right?: number) => ({
  marginStart: isRTL ? right : left,
  marginEnd: isRTL ? left : right,
});

/**
 * המרת padding ישן ל-Start/End | Convert old padding to Start/End
 */
export const convertPadding = (left?: number, right?: number) => ({
  paddingStart: isRTL ? right : left,
  paddingEnd: isRTL ? left : right,
});

/**
 * טיפול בטקסט מעורב עברית-אנגלית | Handle mixed Hebrew-English text
 */
export const wrapMixedText = (text: string): string => {
  // הוספת סימני כיווניות לטקסט מעורב | Add directional marks for mixed text
  if (isRTL && /[a-zA-Z]/.test(text)) {
    return `\u200F${text}\u200F`; // RTL mark
  }
  return text;
};

/**
 * חישוב מיקום למודאלים ותפריטים | Calculate position for modals and menus
 */
export const getModalPosition = (basePosition: { x: number; y: number }) => ({
  x: isRTL ? basePosition.x : basePosition.x,
  y: basePosition.y,
});

export default {
  isRTL,
  getFlexDirection,
  getTextAlign,
  getReverseTextAlign,
  getArrowIcon,
  createRTLStyle,
  convertMargin,
  convertPadding,
  wrapMixedText,
  getModalPosition,
};
