/**
 * @file src/utils/rtlHelpers.ts
 * @brief כלי עזר בסיסיים לתמיכה ב-RTL | Basic RTL support utilities
 * @dependencies react-native I18nManager, genderAdaptation
 * @notes פונקציות בסיסיות לטיפול בכיווניות RTL - פונקציות מתקדמות ב-theme.ts
 * @recurring_errors שימוש ב-marginLeft/Right במקום Start/End, חסר textAlign: "right"
 * @updated 2025-08-04 ניקוי כפילויות והעברת פונקציות מתקדמות ל-theme.ts
 */

import { I18nManager, TextStyle, ViewStyle } from "react-native";
// ייבוא פונקציות מגדר מקובץ המתמחה
import {
  adaptBasicTextToGender,
  makeTextGenderNeutral,
  getDynamicGenderText,
} from "./genderAdaptation";

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
 * @param center האם למרכז את הטקסט
 * @param forceHebrew האם לכפות יישור עברי (לטקסטים בעברית בלבד)
 */
export const getTextAlign = (
  center: boolean = false,
  forceHebrew: boolean = true
): "left" | "right" | "center" => {
  if (center) return "center";
  // בממשק עברי, כל הטקסטים יישרו לימין אלא אם נאמר אחרת
  if (forceHebrew && isRTL) return "right";
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
 * @param text הטקסט לעיבוד
 * @param forceRTL האם לכפות כיוון RTL
 */
export const wrapMixedText = (
  text: string,
  forceRTL: boolean = true
): string => {
  // הוספת סימני כיווניות לטקסט מעורב | Add directional marks for mixed text
  if (isRTL && /[a-zA-Z]/.test(text)) {
    return forceRTL ? `\u200F${text}\u200F` : text; // RTL mark
  }
  return text;
};

/**
 * חישוב מיקום למודאלים ותפריטים | Calculate position for modals and menus
 * @param basePosition מיקום בסיסי
 * @param offset היסט נוסף (אופציונלי)
 */
export const getModalPosition = (
  basePosition: { x: number; y: number },
  offset: { x?: number; y?: number } = {}
) => ({
  x: isRTL
    ? basePosition.x + (offset.x || 0)
    : basePosition.x - (offset.x || 0),
  y: basePosition.y + (offset.y || 0),
});

/**
 * בדיקה אם טקסט מכיל עברית | Check if text contains Hebrew
 */
export const containsHebrew = (text: string): boolean => {
  return /[\u0590-\u05FF]/.test(text);
};

/**
 * יצירת סגנון בסיסי RTL לטקסט | Create basic RTL text style
 * לפונקציות מתקדמות יותר - ראה theme.ts
 */
export const getBasicRTLTextStyle = (): TextStyle => ({
  textAlign: "right",
  writingDirection: "rtl",
});

/**
 * יצירת סגנון בסיסי RTL לקונטיינר | Create basic RTL container style
 * לפונקציות מתקדמות יותר - ראה theme.ts
 */
export const getBasicRTLContainerStyle = (): ViewStyle => ({
  alignItems: "flex-end",
  flexDirection: getFlexDirection(),
});

// ✨ פונקציות מתקדמות הועברו ל-theme.ts לטובת איחוד המערכת
// Advanced functions moved to theme.ts for system unification

export default {
  // פונקציות RTL בסיסיות
  isRTL,
  getFlexDirection,
  getTextAlign,
  getReverseTextAlign,
  getArrowIcon,

  // פונקציות סגנון בסיסי
  getBasicRTLTextStyle,
  getBasicRTLContainerStyle,

  // פונקציות המרה
  convertMargin,
  convertPadding,

  // פונקציות טקסט
  wrapMixedText,
  containsHebrew,

  // פונקציות התאמת מגדר - מייבא מ-genderAdaptation.ts
  adaptBasicTextToGender,
  makeTextGenderNeutral,
  getDynamicGenderText,

  // פונקציות UI
  getModalPosition,
};
