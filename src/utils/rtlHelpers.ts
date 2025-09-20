/**
 * @file src/utils/rtlHelpers.ts
 * @description עזרי RTL חיוניים לממשק עברי - בשימוש כבד ברחבי האפליקציה
 */

import { I18nManager, NativeModules, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";

// קבועים
const RTL_STORAGE_KEY = "@GYMovoo:rtl_preference";
const DEFAULT_RTL = true; // ברירת מחדל לעברית

// שמירת מצב RTL מקומי
let isRTLEnabled = DEFAULT_RTL;
let isInitialized = false;

// Event listeners עבור שינוי מצב RTL (מאפשר לרענן UI בלי ריענון כללי)
type RTLEventListener = (isRTL: boolean) => void;
const rtlListeners = new Set<RTLEventListener>();

export const subscribeRTL = (listener: RTLEventListener): (() => void) => {
  rtlListeners.add(listener);
  // החזרה של unsubscribe
  return () => rtlListeners.delete(listener);
};

const emitRTLChange = () => {
  for (const l of rtlListeners) {
    try {
      l(isRTLEnabled);
    } catch (err) {
      logger.error("RTL", "Listener failed", err);
    }
  }
};

/**
 * בדיקת שפת המכשיר משופרת
 */
const getDeviceLanguage = (): string => {
  try {
    let locale: string | undefined;

    if (Platform.OS === "ios") {
      // iOS - בדיקה מקיפה
      locale =
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        NativeModules.SettingsManager?.settings?.AppleLanguage;
    } else {
      // Android - בדיקה מקיפה
      locale =
        NativeModules.I18nManager?.localeIdentifier ||
        NativeModules.I18nManager?.getConstants?.()?.localeIdentifier ||
        NativeModules.Locale?.locale;
    }

    logger.debug("RTL", "Device language detected", {
      locale,
      platform: Platform.OS,
    });
    return locale || "he_IL";
  } catch (error) {
    logger.error("RTL", "Failed to get device language", error);
    return "he_IL";
  }
};

/**
 * טעינת העדפת RTL מהאחסון המקומי
 */
const loadRTLPreference = async (): Promise<boolean> => {
  try {
    const saved = await AsyncStorage.getItem(RTL_STORAGE_KEY);
    if (saved !== null) {
      return saved === "true";
    }
  } catch (error) {
    logger.error("RTL", "Failed to load RTL preference", error);
  }
  return DEFAULT_RTL;
};

/**
 * שמירת העדפת RTL באחסון המקומי
 */
const saveRTLPreference = async (isRTL: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(RTL_STORAGE_KEY, String(isRTL));
  } catch (error) {
    logger.error("RTL", "Failed to save RTL preference", error);
  }
};

/**
 * אתחול RTL משופר עם fallback וזיכרון
 */
export const initializeRTL = async (): Promise<void> => {
  try {
    // טען העדפה שמורה
    const savedPreference = await loadRTLPreference();

    // בדוק שפת מכשיר
    const deviceLanguage = getDeviceLanguage();
    const isHebrewDevice =
      deviceLanguage.startsWith("he") ||
      deviceLanguage.includes("IL") ||
      deviceLanguage.startsWith("iw"); // Hebrew old code

    // קבע RTL - העדפה שמורה או לפי שפת המכשיר
    const shouldBeRTL = savedPreference ?? isHebrewDevice;

    // אתחל RTL במערכת
    if (I18nManager.allowRTL && I18nManager.forceRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(shouldBeRTL);
    }

    // שמור במשתנה מקומי
    isRTLEnabled = shouldBeRTL;
    isInitialized = true;

    // שמור העדפה
    await saveRTLPreference(shouldBeRTL);

    logger.info("RTL", "RTL initialized successfully", {
      isRTL: isRTLEnabled,
      I18nManagerRTL: I18nManager.isRTL,
      deviceLanguage,
      isHebrewDevice,
      savedPreference,
    });
  } catch (error) {
    logger.error("RTL", "RTL initialization failed", error);
    // במקרה של כשלון, השתמש בברירת מחדל
    isRTLEnabled = DEFAULT_RTL;
    isInitialized = true;
  }
};

/**
 * מצב RTL מרכזי - משופר עם fallback וvalidation
 */
export const isRTL = (): boolean => {
  // אם לא אותחל עדיין, החזר ברירת מחדל
  if (!isInitialized) {
    logger.warn("RTL", "isRTL called before initialization, returning default");
    return DEFAULT_RTL;
  }

  // החזר ערך מקומי (יותר אמין מ-I18nManager)
  return isRTLEnabled;
};

/**
 * החלף כיוון RTL (לבדיקות או הגדרות משתמש)
 */
export const toggleRTL = async (): Promise<void> => {
  isRTLEnabled = !isRTLEnabled;
  await saveRTLPreference(isRTLEnabled);
  if (I18nManager.forceRTL) {
    I18nManager.forceRTL(isRTLEnabled);
  }
  emitRTLChange();
  logger.info("RTL", "RTL toggled", { newValue: isRTLEnabled });
};

/**
 * כיסוי דו-כיווניות (BiDi) בטקסטים עם תווים לטיניים ומספרים כדי למנוע ערבוב
 * שימוש: wrapBidi("Workout 30 דקות")
 */
export const wrapBidi = (text: string): string => {
  // סימני כיווניות אוניברסליים
  const LRE = "\u202A"; // Left-to-Right Embedding
  const RLE = "\u202B"; // Right-to-Left Embedding
  const PDF = "\u202C"; // Pop Directional Formatting
  const needsIsolation = /[A-Za-z0-9]/.test(text) && /[א-ת]/.test(text);
  if (!needsIsolation) return text;
  return isRTL() ? `${RLE}${text}${PDF}` : `${LRE}${text}${PDF}`;
};

/**
 * נירמול מספרים – הסרת אפסים מובילים והמרת רווחים לא נשברים
 */
export const normalizeNumber = (value: string | number): string => {
  const str = String(value)
    .trim()
    .replace(/\u00A0/g, " ");
  return str.replace(/^0+(?=\d)/, "");
};

/**
 * תצוגת זמן יחסי בעברית (כמו "לפני 3 דקות" / "בעוד 5 ימים")
 */
export const formatRelativeTimeIntl = (targetDate: Date | number): string => {
  const now = Date.now();
  const target = targetDate instanceof Date ? targetDate.getTime() : targetDate;
  const diffMs = target - now;
  const tensePast = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const units: [unit: Intl.RelativeTimeFormatUnit, ms: number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["week", 1000 * 60 * 60 * 24 * 7],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  for (const [unit, ms] of units) {
    if (absMs >= ms || unit === "second") {
      const value = Math.round(absMs / ms) * (tensePast ? -1 : 1);
      return new Intl.RelativeTimeFormat("he-IL", { numeric: "auto" }).format(
        value,
        unit
      );
    }
  }
  return "";
};

/**
 * יחידות צרות (ללא רווח או עם רווח דק) – שימושי לממשק חוסך מקום
 */
const NARROW_NBSP = "\u202F"; // Narrow no-break space
export const formatCompactUnit = (
  value: number,
  unit: "kg" | "cm" | "kcal" | "min" | "hr"
): string => {
  const n = formatHebrewNumber(value);
  switch (unit) {
    case "kg":
      return `${n}${NARROW_NBSP}ק"ג`;
    case "cm":
      return `${n}${NARROW_NBSP}ס"מ`;
    case "kcal":
      return `${n}${NARROW_NBSP}קל׳`;
    case "min":
      return `${n}${NARROW_NBSP}ד׳`;
    case "hr":
      return `${n}${NARROW_NBSP}ש׳`;
    default:
      return n;
  }
};

/**
 * פורמט משך כללי (לדוגמה: 1ש׳ 32ד׳ או 05:12 כשהוא קצר)
 */
export const formatDurationSeconds = (
  seconds: number,
  opts?: { style?: "long" | "short" | "clock" }
): string => {
  const style = opts?.style || "short";
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (style === "clock") {
    if (h > 0)
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  const parts: string[] = [];
  if (h) parts.push(style === "long" ? `${h} שעות` : `${h}ש׳`);
  if (m) parts.push(style === "long" ? `${m} דקות` : `${m}ד׳`);
  if (!h && s && style !== "long") parts.push(`${s}ש׳׳`); // שניות במצב קצר רק אם אין שעות
  return parts.join(" ") || (style === "long" ? "0 שניות" : "0ש׳׳");
};

/**
 * היפוך margin/padding/border בהתאם ל-RTL – שימושי למרכיבי צד שלישי
 */
// שימוש ב-unknown במקום any כדי לשמר בטיחות סוגים
export const mirrorStyle = <T extends Record<string, unknown>>(style: T): T => {
  if (!isRTL()) return style;
  const map: Record<string, string> = {
    marginLeft: "marginRight",
    marginRight: "marginLeft",
    paddingLeft: "paddingRight",
    paddingRight: "paddingLeft",
    borderLeftWidth: "borderRightWidth",
    borderRightWidth: "borderLeftWidth",
    left: "right",
    right: "left",
  };
  const cloned: Record<string, unknown> = { ...style };
  for (const key of Object.keys(style)) {
    if (map[key] != null && cloned[map[key]] == null) {
      cloned[map[key]] = style[key];
      delete cloned[key];
    }
  }
  return cloned as T;
};

/**
 * החזרת טקסט בעברית עטוף כראוי במקרה של UI שמאלץ LTR (לדוגמה רכיבי צד שלישי)
 */
export const enforceHebrew = (text: string): string => {
  if (!text) return text;
  if (!/[א-ת]/.test(text)) return text; // אין עברית – לא משנה
  // שימוש ב-RLM כדי להגן על הטקסט בהקשר LTR
  const RLM = "\u200F";
  return `${RLM}${text}${RLM}`;
};

/**
 * קיצור מילים עבריות (למצבים צפופים כמו תגיות)
 */
export const abbreviateHebrew = (word: string): string => {
  const map: Record<string, string> = {
    דקות: "ד׳",
    שעות: "ש׳",
    קלוריות: "קל׳",
    אימונים: "אימ׳",
    משקל: "מש׳",
  };
  return map[word] || word;
};

/**
 * כיוון טקסט דינמי
 */
export const getTextDirection = (): "rtl" | "ltr" => {
  return isRTL() ? "rtl" : "ltr";
};

/**
 * יישור טקסט דינמי
 */
export const getTextAlign = (): "right" | "left" => {
  return isRTL() ? "right" : "left";
};

/**
 * כיוון flex דינמי
 */
export const getFlexDirection = (): "row-reverse" | "row" => {
  return isRTL() ? "row-reverse" : "row";
};

/**
 * מרווחים דינמיים משופרים
 */
export const getDynamicStyles = (spacing?: number) => {
  const rtl = isRTL();
  return {
    marginLeft: rtl ? 0 : spacing,
    marginRight: rtl ? spacing : 0,
    paddingLeft: rtl ? 0 : spacing,
    paddingRight: rtl ? spacing : 0,
    textAlign: rtl ? ("right" as const) : ("left" as const),
    writingDirection: rtl ? ("rtl" as const) : ("ltr" as const),
  };
};

/**
 * סגנונות RTL מלאים לאלמנט
 */
export const getRTLStyles = () => ({
  flexDirection: getFlexDirection(),
  textAlign: getTextAlign(),
  writingDirection: getTextDirection(),
});

/**
 * המרת start/end ל-left/right
 */
export const getStartEndStyles = (start?: number, end?: number) => {
  const rtl = isRTL();
  return {
    left: rtl ? end : start,
    right: rtl ? start : end,
  };
};

/**
 * בדיקה אם צריך restart אחרי שינוי RTL
 */
export const needsRestart = (): boolean => {
  return I18nManager.isRTL !== isRTLEnabled;
};

/**
 * פורמט מספרים בעברית
 */
export const formatHebrewNumber = (num: number): string => {
  return num.toLocaleString("he-IL");
};

/**
 * פורמט תאריכים בעברית
 */
export const formatHebrewDate = (date: Date): string => {
  return date.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

/**
 * פורמט תאריך קצר בעברית
 */
export const formatHebrewDateShort = (date: Date): string => {
  return date.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
  });
};

/**
 * פורמט זמן בעברית
 */
export const formatHebrewTime = (date: Date): string => {
  return date.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * המרת כיוון אייקונים ל-RTL
 */
export const getRTLIconName = (iconName: string): string => {
  const rtl = isRTL();

  const iconMappings: Record<string, string> = {
    "chevron-left": rtl ? "chevron-right" : "chevron-left",
    "chevron-right": rtl ? "chevron-left" : "chevron-right",
    "arrow-left": rtl ? "arrow-right" : "arrow-left",
    "arrow-right": rtl ? "arrow-left" : "arrow-right",
    "arrow-back": rtl ? "arrow-forward" : "arrow-back",
    "arrow-forward": rtl ? "arrow-back" : "arrow-forward",
    menu: rtl ? "menu-right" : "menu-left",
    back: rtl ? "forward" : "back",
    forward: rtl ? "back" : "forward",
  };

  return iconMappings[iconName] || iconName;
};

/**
 * סגנונות דינמיים לכפתורי ניווט
 */
export const getNavigationButtonStyles = () => {
  const rtl = isRTL();

  return {
    backButton: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
      iconName: rtl ? "chevron-right" : "chevron-left",
      text: rtl ? "הבא" : "Back",
    },
    nextButton: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
      iconName: rtl ? "chevron-left" : "chevron-right",
      text: rtl ? "הקודם" : "Next",
    },
  };
};

/**
 * סגנונות דינמיים לטפסים
 */
export const getFormStyles = () => {
  const rtl = isRTL();

  return {
    input: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
    label: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
    error: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

/**
 * סגנונות דינמיים לגלילה אופקית
 */
export const getHorizontalScrollStyles = () => {
  const rtl = isRTL();

  return {
    container: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
    },
    item: {
      marginLeft: rtl ? 0 : 8,
      marginRight: rtl ? 8 : 0,
    },
  };
};

/**
 * סגנונות דינמיים למודלים
 */
export const getModalStyles = () => {
  const rtl = isRTL();

  return {
    container: {
      alignItems: rtl ? "flex-end" : ("flex-start" as const),
    },
    content: {
      marginLeft: rtl ? 0 : 20,
      marginRight: rtl ? 20 : 0,
    },
  };
};

/**
 * סגנונות דינמיים לטבלאות
 */
export const getTableStyles = () => {
  const rtl = isRTL();

  return {
    headerRow: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
    },
    dataRow: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
    },
    headerCell: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
    dataCell: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

/**
 * סגנונות דינמיים להתראות
 */
export const getToastStyles = () => {
  const rtl = isRTL();

  return {
    container: {
      alignSelf: rtl ? "flex-end" : ("flex-start" as const),
      marginLeft: rtl ? 0 : 20,
      marginRight: rtl ? 20 : 0,
    },
    text: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

/**
 * סגנונות דינמיים לכרטיסים
 */
export const getCardStyles = () => {
  const rtl = isRTL();

  return {
    container: {
      borderLeftWidth: rtl ? 0 : 4,
      borderRightWidth: rtl ? 4 : 0,
      borderLeftColor: rtl ? "transparent" : undefined,
      borderRightColor: rtl ? undefined : "transparent",
    },
    header: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
    },
    title: {
      marginLeft: rtl ? 0 : 8,
      marginRight: rtl ? 8 : 0,
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

/**
 * סגנונות דינמיים לרשימות
 */
export const getListStyles = () => {
  const rtl = isRTL();

  return {
    item: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
      paddingLeft: rtl ? 0 : 16,
      paddingRight: rtl ? 16 : 0,
    },
    icon: {
      marginLeft: rtl ? 0 : 12,
      marginRight: rtl ? 12 : 0,
    },
    text: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

/**
 * סגנונות דינמיים לכפתורים
 */
export const getButtonStyles = () => {
  const rtl = isRTL();

  return {
    container: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
    },
    icon: {
      marginLeft: rtl ? 0 : 8,
      marginRight: rtl ? 8 : 0,
    },
    text: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

/**
 * המרת ערך מספרי למילים בעברית
 */
export const numberToHebrewWords = (num: number): string => {
  const hebrewNumbers = [
    "",
    "אחד",
    "שניים",
    "שלושה",
    "ארבעה",
    "חמישה",
    "שישה",
    "שבעה",
    "שמונה",
    "תשעה",
    "עשרה",
  ];

  if (num >= 1 && num <= 10) {
    return hebrewNumbers[num] || num.toString();
  }

  return num.toString();
};

/**
 * פורמט משקל בעברית (RTL)
 */
export const formatWeightRTL = (weight: number): string => {
  return `${formatHebrewNumber(weight)} ק"ג`;
};

/**
 * פורמט גובה בעברית (RTL)
 */
export const formatHeightRTL = (height: number): string => {
  return `${formatHebrewNumber(height)} ס"מ`;
};

/**
 * פורמט קלוריות בעברית (RTL)
 */
export const formatCaloriesRTL = (calories: number): string => {
  return `${formatHebrewNumber(calories)} קלוריות`;
};

/**
 * פורמט זמן אימון בעברית (RTL)
 */
export const formatWorkoutTimeRTL = (minutes: number): string => {
  if (minutes < 60) {
    return `${formatHebrewNumber(minutes)} דקות`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${formatHebrewNumber(hours)} שעות`;
  }

  return `${formatHebrewNumber(hours)} שעות ו-${formatHebrewNumber(remainingMinutes)} דקות`;
};

/**
 * בדיקת תאימות RTL למכשיר
 */
export const isRTLCompatible = (): boolean => {
  try {
    return I18nManager.isRTL || isRTL();
  } catch {
    return false;
  }
};

/**
 * קבלת הגדרות RTL מלאות
 */
export const getRTLConfig = () => {
  const rtl = isRTL();

  return {
    isRTL: rtl,
    textAlign: rtl ? "right" : "left",
    writingDirection: rtl ? "rtl" : "ltr",
    flexDirection: rtl ? "row-reverse" : "row",
    alignItems: rtl ? "flex-end" : "flex-start",
    justifyContent: rtl ? "flex-end" : "flex-start",
    marginStart: rtl ? "marginRight" : "marginLeft",
    marginEnd: rtl ? "marginLeft" : "marginRight",
    paddingStart: rtl ? "paddingRight" : "paddingLeft",
    paddingEnd: rtl ? "paddingLeft" : "paddingRight",
    borderStartWidth: rtl ? "borderRightWidth" : "borderLeftWidth",
    borderEndWidth: rtl ? "borderLeftWidth" : "borderRightWidth",
  };
};
