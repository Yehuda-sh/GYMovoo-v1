/**
 * @file src/components/common/IconButton.tsx
 * @brief כפתור אייקון אוניברסלי עם נגישות מתקדמת ותמיכה מלאה ב-RTL
 * @brief Universal icon button with advanced accessibility and full RTL support
 * @dependencies Ionicons, theme, TouchableOpacity
 * @notes תמיכה מלאה בנגישות, hitSlop מותאם, ואינטגרציה עם מערכת העיצוב
 * @notes Full accessibility support, custom hitSlop, integrated with design system
 * @updated 2025-08-04 אופטימיזציה וחלקיקה מ-FloatingActionButton לשימוש מגוון
 */

// src/components/common/IconButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  disabled?: boolean;
  style?: ViewStyle;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
  accessibilityLabel?: string;
  accessibilityHint?: string;
  // 🆕 שיפורים חדשים // New enhancements
  variant?: "default" | "circle" | "square";
  testID?: string;
}

const IconButton: React.FC<IconButtonProps> = React.memo(
  ({
    icon,
    onPress,
    size = 24,
    color = theme.colors.text,
    backgroundColor = "transparent",
    borderRadius,
    padding = theme.spacing.sm,
    disabled = false,
    style,
    hitSlop = { top: 10, bottom: 10, left: 10, right: 10 },
    accessibilityLabel,
    accessibilityHint,
    variant = "default",
    testID = "icon-button",
  }) => {
    // 🎨 חישוב סגנונות דינמיים לפי variant
    // Dynamic styling calculation based on variant
    const containerStyle = React.useMemo(() => {
      const baseStyle = [styles.button] as any[];

      // חישוב borderRadius לפי variant
      let calculatedBorderRadius = borderRadius;
      if (!borderRadius) {
        switch (variant) {
          case "circle": {
            const circleRadius = (size + padding * 2) / 2;
            calculatedBorderRadius = circleRadius;
            break;
          }
          case "square": {
            calculatedBorderRadius = theme.radius.sm;
            break;
          }
          default: {
            calculatedBorderRadius = theme.radius.md;
          }
        }
      }

      const dynamicStyle = {
        backgroundColor,
        borderRadius: calculatedBorderRadius,
        padding,
        opacity: disabled ? 0.5 : 1,
      };

      baseStyle.push(dynamicStyle);
      if (style) baseStyle.push(style);
      return baseStyle;
    }, [
      variant,
      backgroundColor,
      borderRadius,
      padding,
      disabled,
      style,
      size,
    ]);

    // 🎯 יצירת תווית נגישות מחושבת
    // Generate computed accessibility label
    const getAccessibilityLabel = React.useMemo(() => {
      if (accessibilityLabel) return accessibilityLabel;

      // תרגום שמות אייקונים נפוצים לעברית
      const iconTranslations: Record<string, string> = {
        close: "סגור",
        menu: "תפריט",
        search: "חיפוש",
        heart: "לב",
        star: "כוכב",
        share: "שתף",
        edit: "ערוך",
        delete: "מחק",
        add: "הוסף",
        remove: "הסר",
        settings: "הגדרות",
        home: "בית",
        back: "חזור",
        forward: "קדימה",
        play: "נגן",
        pause: "הקש",
        stop: "עצור",
      };

      return iconTranslations[icon] || `כפתור ${icon}`;
    }, [accessibilityLabel, icon]);

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        hitSlop={hitSlop}
        style={containerStyle}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel}
        accessibilityHint={
          accessibilityHint ||
          (disabled ? "כפתור לא זמין" : "הקש פעמיים להפעלה")
        }
        accessibilityState={{
          disabled: disabled,
        }}
        testID={testID}
      >
        <Ionicons
          name={icon}
          size={size}
          color={disabled ? theme.colors.textSecondary : color}
          accessible={false} // האב כבר נגיש
        />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});

// 🔧 תמיכה ב-displayName לדיבוג
// displayName support for debugging
IconButton.displayName = "IconButton";

export default IconButton;
