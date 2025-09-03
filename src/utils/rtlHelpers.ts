/**
 * RTL Helper Utilities for Hebrew interface
 */

import { I18nManager, TextStyle, ViewStyle } from "react-native";

// Initialize RTL for the app
export const initializeRTL = (): boolean => {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  return I18nManager.isRTL;
};

// Central RTL state - only definition in project
export const isRTL = I18nManager.isRTL;

// Get flex direction based on RTL
export const getFlexDirection = (reverse = false): "row" | "row-reverse" => {
  if (reverse) return isRTL ? "row" : "row-reverse";
  return isRTL ? "row-reverse" : "row";
};

// Get text alignment
export const getTextAlign = (center = false): "left" | "right" | "center" => {
  if (center) return "center";
  return isRTL ? "right" : "left";
};

// Get arrow icon name for navigation
export const getArrowIcon = (forward = true): string => {
  if (forward) return isRTL ? "chevron-left" : "chevron-right";
  return isRTL ? "chevron-right" : "chevron-left";
};

// Check if text contains Hebrew characters
export const containsHebrew = (text: string): boolean => {
  return /[\u0590-\u05FF]/.test(text);
};

// Basic RTL text style
export const getRTLTextStyle = (): TextStyle => ({
  textAlign: isRTL ? "right" : "left",
  writingDirection: isRTL ? "rtl" : "ltr",
});

// Basic RTL container style
export const getRTLContainerStyle = (): ViewStyle => ({
  flexDirection: getFlexDirection(),
});

// Convert layout properties to RTL-aware equivalents
export const convertToRTL = (style: ViewStyle): ViewStyle => {
  if (!isRTL) return style;
  
  const rtlStyle = { ...style };
  
  // Handle margin/padding
  if (style.marginLeft !== undefined || style.marginRight !== undefined) {
    rtlStyle.marginStart = style.marginRight;
    rtlStyle.marginEnd = style.marginLeft;
    delete rtlStyle.marginLeft;
    delete rtlStyle.marginRight;
  }
  
  if (style.paddingLeft !== undefined || style.paddingRight !== undefined) {
    rtlStyle.paddingStart = style.paddingRight;
    rtlStyle.paddingEnd = style.paddingLeft;
    delete rtlStyle.paddingLeft;
    delete rtlStyle.paddingRight;
  }
  
  return rtlStyle;
};

// Auto-initialize RTL
initializeRTL();
