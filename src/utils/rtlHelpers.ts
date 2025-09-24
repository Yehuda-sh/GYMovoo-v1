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
      locale =
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        NativeModules.SettingsManager?.settings?.AppleLanguage;
    } else {
      locale =
        NativeModules.I18nManager?.localeIdentifier ||
        NativeModules.I18nManager?.getConstants?.()?.localeIdentifier ||
        NativeModules.Locale?.locale;
    }

    if (!locale) {
      logger.debug("RTL", "Device language not detected, using default");
    }
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
    const savedPreference = await loadRTLPreference();

    const deviceLanguage = getDeviceLanguage();
    const isHebrewDevice =
      deviceLanguage.startsWith("he") ||
      deviceLanguage.includes("IL") ||
      deviceLanguage.startsWith("iw");

    const shouldBeRTL = savedPreference ?? isHebrewDevice;

    if (I18nManager.allowRTL && I18nManager.forceRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(shouldBeRTL);
    }

    isRTLEnabled = shouldBeRTL;
    isInitialized = true;

    await saveRTLPreference(shouldBeRTL);

    logger.info("RTL", "RTL initialized", { isRTL: isRTLEnabled });
  } catch (error) {
    logger.error("RTL", "RTL initialization failed", error);
    isRTLEnabled = DEFAULT_RTL;
    isInitialized = true;
  }
};

/**
 * מצב RTL מרכזי
 */
export const isRTL = (): boolean => {
  if (!isInitialized) {
    return DEFAULT_RTL;
  }
  return isRTLEnabled;
};

/**
 * החלף כיוון RTL (לבדיקות או הגדרות משתמש)
 */
export const toggleRTL = async (): Promise<void> => {
  isRTLEnabled = !isRTLEnabled;
  await saveRTLPreference(isRTLEnabled);
  // 👇 הוספה קטנה ליציבות
  if (I18nManager.allowRTL) {
    I18nManager.allowRTL(true);
  }
  if (I18nManager.forceRTL) {
    I18nManager.forceRTL(isRTLEnabled);
  }
  emitRTLChange();
  logger.info("RTL", "RTL toggled", { newValue: isRTLEnabled });
};

/**
 * כיסוי דו-כיווניות (BiDi)
 */
export const wrapBidi = (text: string): string => {
  const LRE = "\u202A";
  const RLE = "\u202B";
  const PDF = "\u202C";
  const needsIsolation = /[A-Za-z0-9]/.test(text) && /[א-ת]/.test(text);
  if (!needsIsolation) return text;
  return isRTL() ? `${RLE}${text}${PDF}` : `${LRE}${text}${PDF}`;
};

/**
 * נירמול מספרים
 */
export const normalizeNumber = (value: string | number): string => {
  const str = String(value)
    .trim()
    .replace(/\u00A0/g, " ");
  return str.replace(/^0+(?=\d)/, "");
};

/**
 * זמן יחסי בעברית
 */
export const formatRelativeTimeIntl = (targetDate: Date | number): string => {
  const now = Date.now();
  const target = targetDate instanceof Date ? targetDate.getTime() : targetDate;
  const diffMs = target - now;
  const tensePast = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
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

const NARROW_NBSP = "\u202F";
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
 * פורמט משך כללי
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
  if (!h && s && style !== "long") parts.push(`${s}ש׳׳`);
  return parts.join(" ") || (style === "long" ? "0 שניות" : "0ש׳׳");
};

/**
 * היפוך start/end ל-left/right
 */
export const mirrorStyle = <T extends Record<string, unknown>>(style: T): T => {
  if (!isRTL()) return style;
  const map: Record<string, string> = {
    marginStart: "marginRight",
    marginEnd: "marginLeft",
    paddingStart: "paddingRight",
    paddingEnd: "paddingLeft",
    borderStartWidth: "borderRightWidth",
    borderEndWidth: "borderLeftWidth",
    // ✅ הוספנו גם צבעים
    borderStartColor: "borderRightColor",
    borderEndColor: "borderLeftColor",
    start: "right",
    end: "left",
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
 * טקסט עברי בסביבת LTR
 */
export const enforceHebrew = (text: string): string => {
  if (!text) return text;
  if (!/[א-ת]/.test(text)) return text;
  const RLM = "\u200F";
  return `${RLM}${text}${RLM}`;
};

/**
 * קיצור מילים עבריות
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

export const getTextDirection = (): "rtl" | "ltr" => (isRTL() ? "rtl" : "ltr");
export const getTextAlign = (): "right" | "left" =>
  isRTL() ? "right" : "left";
export const getFlexDirection = (): "row-reverse" | "row" =>
  isRTL() ? "row-reverse" : "row";

export const getDynamicStyles = (spacing?: number) => {
  const rtl = isRTL();
  return {
    marginStart: rtl ? 0 : spacing,
    marginEnd: rtl ? spacing : 0,
    paddingStart: rtl ? 0 : spacing,
    paddingEnd: rtl ? spacing : 0,
    textAlign: rtl ? ("right" as const) : ("left" as const),
    writingDirection: rtl ? ("rtl" as const) : ("ltr" as const),
  };
};

export const getRTLStyles = () => ({
  flexDirection: getFlexDirection(),
  textAlign: getTextAlign(),
  writingDirection: getTextDirection(),
});

export const getStartEndStyles = (start?: number, end?: number) => {
  const rtl = isRTL();
  return { start: rtl ? end : start, end: rtl ? start : end };
};

export const needsRestart = (): boolean => {
  return I18nManager.isRTL !== isRTLEnabled;
};

export const formatHebrewNumber = (num: number): string =>
  num.toLocaleString("he-IL");

export const formatHebrewDate = (date: Date): string =>
  date.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

export const formatHebrewDateShort = (date: Date): string =>
  date.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
  });

export const formatHebrewTime = (date: Date): string =>
  date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });

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
      // ✅ תיקון הטקסטים
      text: rtl ? "חזור" : "Back",
    },
    nextButton: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
      iconName: rtl ? "chevron-left" : "chevron-right",
      text: rtl ? "הבא" : "Next",
    },
  };
};

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

export const getHorizontalScrollStyles = () => {
  const rtl = isRTL();
  return {
    container: { flexDirection: rtl ? "row-reverse" : ("row" as const) },
    item: { marginStart: rtl ? 0 : 8, marginEnd: rtl ? 8 : 0 },
  };
};

export const getModalStyles = () => {
  const rtl = isRTL();
  return {
    container: { alignItems: rtl ? "flex-end" : ("flex-start" as const) },
    content: { marginStart: rtl ? 0 : 20, marginEnd: rtl ? 20 : 0 },
  };
};

export const getTableStyles = () => {
  const rtl = isRTL();
  return {
    headerRow: { flexDirection: rtl ? "row-reverse" : ("row" as const) },
    dataRow: { flexDirection: rtl ? "row-reverse" : ("row" as const) },
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

export const getToastStyles = () => {
  const rtl = isRTL();
  return {
    container: {
      alignSelf: rtl ? "flex-end" : ("flex-start" as const),
      marginStart: rtl ? 0 : 20,
      marginEnd: rtl ? 20 : 0,
    },
    text: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

export const getCardStyles = () => {
  const rtl = isRTL();
  return {
    container: {
      borderStartWidth: rtl ? 0 : 4,
      borderEndWidth: rtl ? 4 : 0,
      borderLeftColor: rtl ? "transparent" : undefined,
      borderRightColor: rtl ? undefined : "transparent",
    },
    header: { flexDirection: rtl ? "row-reverse" : ("row" as const) },
    title: {
      marginStart: rtl ? 0 : 8,
      marginEnd: rtl ? 8 : 0,
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

export const getListStyles = () => {
  const rtl = isRTL();
  return {
    item: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
      paddingStart: rtl ? 0 : 16,
      paddingEnd: rtl ? 16 : 0,
    },
    icon: { marginStart: rtl ? 0 : 12, marginEnd: rtl ? 12 : 0 },
    text: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

export const getButtonStyles = () => {
  const rtl = isRTL();
  return {
    container: { flexDirection: rtl ? "row-reverse" : ("row" as const) },
    icon: { marginStart: rtl ? 0 : 8, marginEnd: rtl ? 8 : 0 },
    text: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
  };
};

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
  if (num >= 1 && num <= 10) return hebrewNumbers[num] || num.toString();
  return num.toString();
};

export const formatWeightRTL = (weight: number): string =>
  `${formatHebrewNumber(weight)} ק"ג`;

export const formatHeightRTL = (height: number): string =>
  `${formatHebrewNumber(height)} ס"מ`;

export const formatCaloriesRTL = (calories: number): string =>
  `${formatHebrewNumber(calories)} קלוריות`;

export const formatWorkoutTimeRTL = (minutes: number): string => {
  if (minutes < 60) return `${formatHebrewNumber(minutes)} דקות`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${formatHebrewNumber(hours)} שעות`;
  return `${formatHebrewNumber(hours)} שעות ו-${formatHebrewNumber(
    remainingMinutes
  )} דקות`;
};

export const isRTLCompatible = (): boolean => {
  try {
    return I18nManager.isRTL || isRTL();
  } catch {
    return false;
  }
};

/**
 * ⚠️ getRTLConfig מחזיר גם *שמות מאפיינים* (כמו "marginRight").
 * השתמש בו כדי לבחור מאפיין דינמית, לא להזרקה ישירה ל-style.
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

export const wrapTextWithEmoji = (
  text: string,
  emoji: string,
  position: "start" | "end" = "end"
): string => {
  if (!text || !emoji) return text;
  if (isRTL()) return `${text} ${emoji}`;
  return position === "start" ? `${emoji} ${text}` : `${text} ${emoji}`;
};

export const formatTitleWithEmoji = (title: string, emoji: string): string =>
  wrapTextWithEmoji(title, emoji, "end");

export const formatButtonWithIcon = (
  text: string,
  icon: string,
  type: "emoji" | "icon" = "emoji"
): string => {
  if (type === "emoji") return wrapTextWithEmoji(text, icon, "end");
  return text;
};

export const getEmojiButtonStyles = () => {
  const rtl = isRTL();
  return {
    container: {
      flexDirection: rtl ? "row-reverse" : ("row" as const),
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 8,
    },
    text: {
      textAlign: rtl ? "right" : ("left" as const),
      writingDirection: rtl ? "rtl" : ("ltr" as const),
    },
    icon: { marginStart: rtl ? 0 : 8, marginEnd: rtl ? 8 : 0 },
  };
};

export const getTitleStyles = (level: "h1" | "h2" | "h3" = "h1") => {
  const rtl = isRTL();
  const baseSizes = { h1: 28, h2: 22, h3: 18 } as const;
  const baseStyles = {
    fontSize: baseSizes[level],
    fontWeight: (level === "h1" ? "bold" : "600") as "bold" | "600",
    marginBottom: level === "h1" ? 24 : level === "h2" ? 16 : 12,
    writingDirection: rtl ? "rtl" : ("ltr" as const),
  };
  if (level === "h1") {
    return { ...baseStyles, textAlign: "center" as const };
  }
  return {
    ...baseStyles,
    textAlign: (rtl ? "right" : "left") as "right" | "left",
  };
};

export const hasEmoji = (text: string): boolean => {
  if (!text) return false;
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
};

export const separateTextAndEmoji = (
  text: string
): { text: string; emoji: string } => {
  if (!hasEmoji(text)) return { text, emoji: "" };
  const emojiRegex =
    /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu;
  const emojis = text.match(emojiRegex) || [];
  const lastEmoji = emojis[emojis.length - 1] || "";
  const cleanText = text.replace(emojiRegex, "").trim();
  return { text: cleanText, emoji: lastEmoji };
};

export const getActionEmoji = (action: string): string => {
  const emojiMap: Record<string, string> = {
    start: "▶️",
    play: "▶️",
    add: "➕",
    plus: "➕",
    delete: "🗑️",
    remove: "❌",
    edit: "✏️",
    save: "💾",
    check: "✅",
    cancel: "❌",
    info: "ℹ️",
    warning: "⚠️",
    error: "❌",
    success: "🎉",
    workout: "💪",
    exercise: "🏋️",
    weight: "⚖️",
    time: "⏱️",
    calories: "🔥",
    heart: "❤️",
    star: "⭐",
    trophy: "🏆",
    target: "🎯",
    settings: "⚙️",
    profile: "👤",
    home: "🏠",
    stats: "📊",
    calendar: "📅",
    search: "🔍",
    filter: "🔽",
    sort: "📶",
    refresh: "🔄",
    sync: "🔄",
    download: "⬇️",
    upload: "⬆️",
    share: "📤",
    export: "📤",
    import: "📥",
  };
  return emojiMap[action.toLowerCase()] || "";
};

export const createActionText = (text: string, action: string): string => {
  const emoji = getActionEmoji(action);
  return emoji ? wrapTextWithEmoji(text, emoji, "end") : text;
};
