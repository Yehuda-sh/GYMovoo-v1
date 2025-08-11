/**
 * @file src/utils/rtlHelpers.ts
 * @brief כלי עזר מלאים לתמיכה ב-RTL | Complete RTL support utilities
 * @dependencies react-native I18nManager, genderAdaptation
 * @notes מקור מרכזי יחיד לכל פונקציות RTL - פונקציות מתקדמות ב-theme.ts
 * @updated 2025-08-11 ניקוי deprecated functions ושיפור תיעוד
 */

import { I18nManager, TextStyle, ViewStyle } from "react-native";
// ייבוא פונקציות מגדר מקובץ המתמחה
import {
  adaptBasicTextToGender,
  makeTextGenderNeutral,
  getDynamicGenderText,
} from "./genderAdaptation";

/**
 * מכריח RTL בכל האפליקציה | Forces RTL for the entire application
 * הועבר מ-rtlConfig.ts במסגרת מיזוג מלא | Moved from rtlConfig.ts as part of full merge
 */
export const initializeRTL = () => {
  // הפעלת RTL מאולץ
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  return I18nManager.isRTL;
};

/**
 * בדיקה האם הממשק ב-RTL | Check if interface is RTL
 * זוהי ההגדרה המרכזית היחידה של isRTL בפרויקט!
 * This is the ONLY central definition of isRTL in the project!
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

// ✨ פונקציות סגנון חדשות ומומלצות | New and recommended style functions
const propertyMap: { [key: string]: string } = {
  marginLeft: "marginStart",
  marginRight: "marginEnd",
  paddingLeft: "paddingStart",
  paddingRight: "paddingEnd",
  borderLeftWidth: "borderStartWidth",
  borderRightWidth: "borderEndWidth",
  borderLeftColor: "borderStartColor",
  borderRightColor: "borderEndColor",
  left: "start",
  right: "end",
};

/**
 * Converts a style object to use RTL-aware logical properties.
 * Replaces `marginLeft` with `marginStart`, `right` with `end`, etc.
 * This is the modern and recommended way to handle layout styles.
 * @param style The style object to convert.
 * @returns A new style object with logical properties.
 */
export const rtlify = <T extends ViewStyle | TextStyle>(style: T): T => {
  const rtlStyle = {} as T;
  for (const key in style) {
    const styleKey = key as keyof T;
    const mappedKey = propertyMap[key];
    if (mappedKey) {
      const rtlKey = mappedKey as keyof T;
      rtlStyle[rtlKey] = style[styleKey];
    } else {
      rtlStyle[styleKey] = style[styleKey];
    }
  }
  return rtlStyle;
};

/**
 * Adjusts the `transform` style property for RTL layouts.
 * Specifically, it negates `translateX` values.
 * @param transforms The array of transform objects.
 * @returns A new array of transform objects adjusted for RTL.
 */
export const rtlifyTransform = (
  transforms: ViewStyle["transform"]
): ViewStyle["transform"] => {
  if (!isRTL || !Array.isArray(transforms)) {
    return transforms;
  }
  return transforms.map((transform) => {
    if ("translateX" in transform && transform.translateX !== undefined) {
      return { ...transform, translateX: -transform.translateX };
    }
    // Future: handle rotate, skewX, etc. if needed
    return transform;
  });
};

// ✨ פונקציות מתקדמות הועברו ל-theme.ts לטובת איחוד המערכת
// Advanced functions moved to theme.ts for system unification

/**
 * ייצוא ברירת המחדל - כל הפונקציות RTL כולל אתחול
 * Default export - all RTL functions including initialization
 *
 * 📋 מידע חשוב:
 * - isRTL: ההגדרה המרכזית היחידה בפרויקט
 * - initializeRTL: הועבר מ-rtlConfig.ts למיזוג מלא
 * - פונקציות מתקדמות זמינות ב-theme.rtlHelpers
 * - פונקציות מגדר זמינות ב-genderAdaptation.ts
 *
 * 🔗 דוגמאות שימוש:
 * import { isRTL, initializeRTL, getFlexDirection } from '../utils/rtlHelpers';
 * import rtlHelpers from '../utils/rtlHelpers';
 */
export default {
  // פונקציות RTL בסיסיות ואתחול | Basic RTL functions and initialization
  isRTL,
  initializeRTL,
  getFlexDirection,
  getTextAlign,
  getReverseTextAlign,
  getArrowIcon,

  // פונקציות סגנון בסיסי | Basic style functions
  getBasicRTLTextStyle,
  getBasicRTLContainerStyle,
  rtlify,
  rtlifyTransform,

  // פונקציות טקסט | Text functions
  wrapMixedText,
  containsHebrew,

  // פונקציות התאמת מגדר - מייבא מ-genderAdaptation.ts
  // Gender adaptation functions - imported from genderAdaptation.ts
  adaptBasicTextToGender,
  makeTextGenderNeutral,
  getDynamicGenderText,

  // פונקציות UI | UI functions
  getModalPosition,
};

// אתחול אוטומטי ב-RTL בזמן import - הועבר מ-rtlConfig.ts
// Automatic RTL initialization on import - moved from rtlConfig.ts
initializeRTL();
