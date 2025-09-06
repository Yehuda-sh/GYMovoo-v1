/**
 * @file src/utils/rtlHelpers.ts
 * @description עזרי RTL מאופטמים לממשק עברי - RTL Helper Utilities
 */

import { I18nManager, TextStyle, ViewStyle } from "react-native";

// ===============================================
// 🌐 RTL Configuration - הגדרות RTL
// ===============================================

/**
 * תצורת RTL עם אפשרויות
 */
interface RTLConfig {
  allowRTL: boolean;
  forceRTL: boolean;
  autoDetect: boolean;
}

const DEFAULT_RTL_CONFIG: RTLConfig = {
  allowRTL: true,
  forceRTL: true, // כיוון שזה אפליקציה עברית
  autoDetect: false,
};

/**
 * Unicode ranges לזיהוי טקסט עברי מדויק
 */
const HEBREW_UNICODE_RANGES = [
  [0x0590, 0x05ff], // Hebrew
  [0xfb1d, 0xfb4f], // Hebrew Presentation Forms
] as const;

// ===============================================
// 🚀 RTL Initialization - אתחול RTL
// ===============================================

/**
 * אתחול RTL עם תצורה מותאמת
 */
export const initializeRTL = (config: Partial<RTLConfig> = {}): boolean => {
  const finalConfig = { ...DEFAULT_RTL_CONFIG, ...config };

  try {
    I18nManager.allowRTL(finalConfig.allowRTL);

    if (finalConfig.forceRTL) {
      I18nManager.forceRTL(true);
    }

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
export const isRTL = (() => {
  if (_cachedIsRTL === null) {
    _cachedIsRTL = I18nManager.isRTL;
  }
  return _cachedIsRTL;
})();

/**
 * רענון cache של RTL state
 */
export const refreshRTLState = (): boolean => {
  _cachedIsRTL = I18nManager.isRTL;
  return _cachedIsRTL;
};

// ===============================================
// 🧭 Direction & Alignment - כיוון ויישור
// ===============================================

/**
 * קבלת כיוון flex בהתבסס על RTL
 */
export const getFlexDirection = (reverse = false): "row" | "row-reverse" => {
  if (reverse) return isRTL ? "row" : "row-reverse";
  return isRTL ? "row-reverse" : "row";
};

/**
 * קבלת יישור טקסט
 */
export const getTextAlign = (
  alignment: "start" | "end" | "center" | "justify" = "start"
): "left" | "right" | "center" | "justify" => {
  switch (alignment) {
    case "center":
    case "justify":
      return alignment;
    case "start":
      return isRTL ? "right" : "left";
    case "end":
      return isRTL ? "left" : "right";
    default:
      return isRTL ? "right" : "left";
  }
};

/**
 * קבלת כיוון writing direction
 */
export const getWritingDirection = (): "ltr" | "rtl" => {
  return isRTL ? "rtl" : "ltr";
};

/**
 * קבלת שם אייקון חץ לניווט
 */
export const getArrowIcon = (
  direction: "forward" | "back" = "forward"
): string => {
  if (direction === "forward") {
    return isRTL ? "chevron-left" : "chevron-right";
  }
  return isRTL ? "chevron-right" : "chevron-left";
};

// ===============================================
// 🔍 Text Detection - זיהוי טקסט
// ===============================================

/**
 * בדיקה מתקדמת אם טקסט מכיל תווים עבריים
 */
export const containsHebrew = (text: string): boolean => {
  if (!text || typeof text !== "string") return false;

  return HEBREW_UNICODE_RANGES.some(([start, end]) => {
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      if (charCode >= start && charCode <= end) {
        return true;
      }
    }
    return false;
  });
};

/**
 * זיהוי אוטומטי של כיוון טקסט
 */
export const detectTextDirection = (text: string): "ltr" | "rtl" => {
  return containsHebrew(text) ? "rtl" : "ltr";
};

// ===============================================
// 🎨 Style Helpers - עזרי עיצוב
// ===============================================

/**
 * סגנון טקסט RTL מתקדם
 */
export const getRTLTextStyle = (
  options: {
    alignment?: "start" | "end" | "center" | "justify";
    direction?: "auto" | "ltr" | "rtl";
  } = {}
): TextStyle => {
  const { alignment = "start", direction = "auto" } = options;

  return {
    textAlign: getTextAlign(alignment),
    writingDirection: direction === "auto" ? getWritingDirection() : direction,
  };
};

/**
 * סגנון container RTL מתקדם
 */
export const getRTLContainerStyle = (
  options: {
    reverse?: boolean;
    justifyContent?: ViewStyle["justifyContent"];
    alignItems?: ViewStyle["alignItems"];
  } = {}
): ViewStyle => {
  const { reverse = false, justifyContent, alignItems } = options;

  return {
    flexDirection: getFlexDirection(reverse),
    ...(justifyContent && { justifyContent }),
    ...(alignItems && { alignItems }),
  };
};

// ===============================================
// 🔄 Style Conversion - המרת סגנונות
// ===============================================

/**
 * המרה מתקדמת של properties ל-RTL
 */
export const convertToRTL = (style: ViewStyle): ViewStyle => {
  if (!isRTL) return style;

  const rtlStyle = { ...style };

  // Handle margin properties
  if (style.marginLeft !== undefined || style.marginRight !== undefined) {
    if (style.marginLeft !== undefined) {
      rtlStyle.marginEnd = style.marginLeft;
      delete rtlStyle.marginLeft;
    }
    if (style.marginRight !== undefined) {
      rtlStyle.marginStart = style.marginRight;
      delete rtlStyle.marginRight;
    }
  }

  // Handle padding properties
  if (style.paddingLeft !== undefined || style.paddingRight !== undefined) {
    if (style.paddingLeft !== undefined) {
      rtlStyle.paddingEnd = style.paddingLeft;
      delete rtlStyle.paddingLeft;
    }
    if (style.paddingRight !== undefined) {
      rtlStyle.paddingStart = style.paddingRight;
      delete rtlStyle.paddingRight;
    }
  }

  // Handle border properties
  if (
    style.borderLeftWidth !== undefined ||
    style.borderRightWidth !== undefined
  ) {
    if (style.borderLeftWidth !== undefined) {
      rtlStyle.borderEndWidth = style.borderLeftWidth;
      delete rtlStyle.borderLeftWidth;
    }
    if (style.borderRightWidth !== undefined) {
      rtlStyle.borderStartWidth = style.borderRightWidth;
      delete rtlStyle.borderRightWidth;
    }
  }

  // Handle position properties
  if (style.left !== undefined || style.right !== undefined) {
    if (style.left !== undefined) {
      rtlStyle.end = style.left;
      delete rtlStyle.left;
    }
    if (style.right !== undefined) {
      rtlStyle.start = style.right;
      delete rtlStyle.right;
    }
  }

  return rtlStyle;
};

/**
 * החלפת ערכי left/right לRTL
 */
export const swapHorizontalValues = <T>(
  leftValue: T,
  rightValue: T
): { left: T; right: T } => {
  return isRTL
    ? { left: rightValue, right: leftValue }
    : { left: leftValue, right: rightValue };
};

// ===============================================
// 🚀 Auto-Initialization - אתחול אוטומטי
// ===============================================

// אתחול אוטומטי של RTL
initializeRTL();
