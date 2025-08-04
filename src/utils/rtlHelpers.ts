/**
 * @file src/utils/rtlHelpers.ts
 * @brief כלי עזר לתמיכה מלאה ב-RTL והתאמת מגדר | RTL support and gender adaptation utilities
 * @dependencies react-native I18nManager
 * @notes כל הפונקציות לטיפול בכיווניות RTL והתאמת טקסט למגדר במקום אחד
 * @recurring_errors שימוש ב-marginLeft/Right במקום Start/End, חסר textAlign: "right"
 * @updated 2025-07-30 עם תמיכה מלאה בכל מה שלמדנו בפיתוח השאלון החכם
 */

import { I18nManager, StyleSheet, TextStyle, ViewStyle } from "react-native";

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
 * יצירת סגנון טקסט RTL מלא | Create complete RTL text style
 * פונקציה חדשה שמבוססת על הלמידה מהשאלון החכם
 */
export const getFullRTLTextStyle = (
  options: {
    textAlign?: "left" | "right" | "center";
    writingDirection?: boolean;
    width?: "100%" | number;
  } = {}
): TextStyle => ({
  textAlign: options.textAlign || "right",
  writingDirection: options.writingDirection !== false ? "rtl" : "ltr",
  width: options.width || "100%",
});

/**
 * יצירת סגנון קונטיינר RTL מלא | Create complete RTL container style
 * מבוסס על הלמידה מרכיבי הבחירה בשאלון
 */
export const getFullRTLContainerStyle = (
  options: {
    alignItems?: "flex-start" | "flex-end" | "center";
    paddingDirection?: "left" | "right";
    paddingValue?: number;
  } = {}
): ViewStyle => ({
  alignItems: options.alignItems || "flex-end",
  ...(options.paddingDirection === "right"
    ? { paddingRight: options.paddingValue || 16 }
    : options.paddingDirection === "left"
      ? { paddingLeft: options.paddingValue || 16 }
      : {}),
});

/**
 * יצירת סגנון לרכיב בחירה RTL | Create RTL selection component style
 * מותאם לכל מה שלמדנו מרכיבי optionContainer
 */
export const getSelectionComponentStyle = (isSelected: boolean = false) => ({
  container: {
    alignItems: "flex-end" as const,
    paddingRight: 16,
    width: "100%",
  },
  content: {
    alignItems: "flex-end" as const,
    width: "100%",
  },
  text: {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
    width: "100%",
  },
  indicator: {
    position: "absolute" as const,
    right: 16,
  },
});

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
 * יצירת סגנונות RTL מותנים משופרים | Create improved conditional RTL styles
 * מבוסס על כל מה שלמדנו במהלך הפיתוח
 */
export const createAdvancedRTLStyle = (config: {
  // סגנונות בסיסיים
  marginStart?: number;
  marginEnd?: number;
  paddingStart?: number;
  paddingEnd?: number;

  // תמיכה מלאה ב-RTL
  textAlign?: "left" | "right" | "center";
  flexDirection?: "row" | "row-reverse";
  alignItems?: "flex-start" | "flex-end" | "center";

  // אופציות ממשק משתמש
  isSelectionComponent?: boolean;
  isFloatingButton?: boolean;
  hasIndicator?: boolean;
}) => {
  const baseStyle: ViewStyle & TextStyle = {
    marginStart: config.marginStart,
    marginEnd: config.marginEnd,
    paddingStart: config.paddingStart,
    paddingEnd: config.paddingEnd,
    textAlign: config.textAlign || getTextAlign(),
    flexDirection: config.flexDirection || getFlexDirection(),
  };

  // תמיכה מיוחדת לרכיבי בחירה
  if (config.isSelectionComponent) {
    return StyleSheet.create({
      container: {
        ...baseStyle,
        alignItems: "flex-end",
        paddingRight: 16,
        width: "100%",
      },
      content: {
        alignItems: "flex-end",
        width: "100%",
      },
      text: {
        textAlign: "right",
        writingDirection: "rtl",
        width: "100%",
      },
    });
  }

  // תמיכה לכפתור צף
  if (config.isFloatingButton) {
    return StyleSheet.create({
      container: {
        ...baseStyle,
        position: "absolute",
        bottom: 30,
        right: 20,
        alignItems: "center",
        justifyContent: "center",
      },
    });
  }

  return StyleSheet.create({
    container: {
      ...baseStyle,
      alignItems: config.alignItems || (isRTL ? "flex-end" : "flex-start"),
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
 * פונקציות התאמת טקסט למגדר | Gender adaptation functions
 * מבוססות על מה שלמדנו מהשאלון החכם
 */

/**
 * התאמת טקסט בסיסי למגדר | Basic gender text adaptation
 */
export const adaptBasicTextToGender = (
  text: string,
  gender: "male" | "female" | "other"
): string => {
  if (gender === "other") return text;

  // המרות בסיסיות שלמדנו
  const genderMappings = {
    male: {
      "צעירה ומלאה אנרגיה": "צעיר ומלא אנרגיה",
      "מנוסה ופעילה": "מנוסה ופעיל",
      מתחילה: "מתחיל",
      מתקדמת: "מתקדם",
    },
    female: {
      "צעיר ומלא אנרגיה": "צעירה ומלאה אנרגיה",
      "מנוסה ופעיל": "מנוסה ופעילה",
      מתחיל: "מתחילה",
      מתקדם: "מתקדמת",
    },
  };

  const mappings = genderMappings[gender];
  let adaptedText = text;

  Object.entries(mappings).forEach(([from, to]) => {
    adaptedText = adaptedText.replace(new RegExp(from, "g"), to);
  });

  return adaptedText;
};

/**
 * יצירת טקסט ניטרלי מגדרית | Create gender-neutral text
 */
export const makeTextGenderNeutral = (text: string): string => {
  const neutralMappings = {
    "צעיר ומלא אנרגיה": "עם אנרגיה צעירה",
    "צעירה ומלאה אנרגיה": "עם אנרגיה צעירה",
    "מנוסה ופעיל": "עם ניסיון ופעילות",
    "מנוסה ופעילה": "עם ניסיון ופעילות",
    מתחיל: "בתחילת הדרך",
    מתחילה: "בתחילת הדרך",
    מתקדם: "ברמה מתקדמת",
    מתקדמת: "ברמה מתקדמת",
  };

  let neutralText = text;
  Object.entries(neutralMappings).forEach(([from, to]) => {
    neutralText = neutralText.replace(new RegExp(from, "g"), to);
  });

  return neutralText;
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
 * פונקציות עזר נוספות שלמדנו במהלך הפיתוח
 */

/**
 * בדיקה אם טקסט מכיל עברית | Check if text contains Hebrew
 */
export const containsHebrew = (text: string): boolean => {
  return /[\u0590-\u05FF]/.test(text);
};

/**
 * יצירת סגנון לאינדיקטור בחירה | Create selection indicator style
 */
export const getSelectionIndicatorStyle = (isSelected: boolean) => ({
  position: "absolute" as const,
  right: 16,
  top: "50%",
  transform: [{ translateY: -12 }],
  opacity: isSelected ? 1 : 0,
});

// ✨ הוסר getAnimatedFloatingButtonStyle - הועבר ל-theme.ts לאיחוד
// Removed getAnimatedFloatingButtonStyle - moved to theme.ts for unification

/**
 * טיפול בטקסטים דינמיים בהתאם למגדר | Handle dynamic gender-based texts
 */
export const getDynamicGenderText = (
  baseText: string,
  gender: "male" | "female" | "other",
  variations: {
    male?: string;
    female?: string;
    neutral?: string;
  } = {}
): string => {
  switch (gender) {
    case "male":
      return variations.male || adaptBasicTextToGender(baseText, "male");
    case "female":
      return variations.female || adaptBasicTextToGender(baseText, "female");
    case "other":
    default:
      return variations.neutral || makeTextGenderNeutral(baseText);
  }
};

export default {
  // פונקציות RTL בסיסיות
  isRTL,
  getFlexDirection,
  getTextAlign,
  getReverseTextAlign,
  getArrowIcon,

  // פונקציות RTL מתקדמות
  getFullRTLTextStyle,
  getFullRTLContainerStyle,
  getSelectionComponentStyle,
  createAdvancedRTLStyle,

  // פונקציות המרה
  convertMargin,
  convertPadding,

  // פונקציות טקסט
  wrapMixedText,
  containsHebrew,

  // פונקציות התאמת מגדר
  adaptBasicTextToGender,
  makeTextGenderNeutral,
  getDynamicGenderText,

  // פונקציות UI
  getModalPosition,
  getSelectionIndicatorStyle,
  // ✨ getAnimatedFloatingButtonStyle הוסר - נמצא כעת ב-theme.ts
  // getAnimatedFloatingButtonStyle removed - now in theme.ts
};
