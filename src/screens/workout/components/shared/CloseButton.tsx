/**
 * @file src/screens/workout/components/shared/CloseButton.tsx
 * @brief כפתור סגירה מאוחד עם ווריאנטים שונים
 * @version 1.0.0
 * @author GYMovoo Development Team
 * @created 2025-08-05
 *
 * @description
 * רכיב כפתור סגירה מאוחד המשמש בכל רכיבי האימון
 * תומך בגדלים ועיצובים שונים לפי ה-variant
 *
 * @features
 * - ✅ 3 גדלים: small, medium, large
 * - ✅ אנימציית מגע
 * - ✅ נגישות מלאה
 * - ✅ התאמה לתמה
 * - ✅ התמקמות דינמית
 *
 * @accessibility
 * תמיכה מלאה ב-Screen Readers עם accessibilityLabel מותאם
 */

import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

interface CloseButtonProps {
  onPress: () => void;
  size?: "small" | "medium" | "large";
  position?: "center" | "start" | "end";
  marginTop?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  variant?: "solid" | "outline" | "ghost";
  disabled?: boolean;
  testID?: string;
  iconName?: IconName; // allows reuse beyond close (e.g., "chevron-down")
  style?: ViewStyle;
}

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const CloseButton: React.FC<CloseButtonProps> = ({
  onPress,
  size = "medium",
  position = "center",
  marginTop = theme.spacing.sm,
  accessibilityLabel = "סגור",
  accessibilityHint = "הקש כדי לסגור",
  variant = "solid",
  disabled = false,
  testID = "close-button",
  iconName = "close",
  style,
}) => {
  const sizeConfig = {
    small: { width: 28, height: 28, borderRadius: 14, iconSize: 14 },
    medium: { width: 32, height: 32, borderRadius: 16, iconSize: 16 },
    large: { width: 36, height: 36, borderRadius: 18, iconSize: 18 },
  };

  const alignmentConfig = {
    center: "center",
    start: "flex-start",
    end: "flex-end",
  } as const;

  const config = sizeConfig[size];

  const variantStyle = (() => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: theme.colors.transparent,
          borderWidth: 1,
          borderColor: theme.colors.border,
        } as ViewStyle;
      case "ghost":
        return {
          backgroundColor: theme.colors.transparent,
          borderWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
        } as ViewStyle;
      default:
        return {} as ViewStyle; // solid (default styles apply)
    }
  })();

  const disabledStyle: ViewStyle | undefined = disabled
    ? { opacity: 0.45 }
    : undefined;

  return (
    <Pressable
      testID={testID}
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      hitSlop={10}
      style={({ pressed }) => [
        styles.closeButton,
        variantStyle,
        {
          width: config.width,
          height: config.height,
          borderRadius: config.borderRadius,
          marginTop,
          alignSelf: alignmentConfig[position],
          transform: pressed ? [{ scale: 0.92 }] : undefined,
          backgroundColor:
            variant === "solid"
              ? pressed
                ? theme.colors.surfaceVariant
                : theme.colors.background
              : variantStyle.backgroundColor,
        },
        disabledStyle,
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={config.iconSize}
        color={
          disabled ? theme.colors.textTertiary : theme.colors.textSecondary
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
