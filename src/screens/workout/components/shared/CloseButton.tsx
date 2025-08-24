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
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

export interface CloseButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
  size?: "small" | "medium" | "large";
  position?: "center" | "start" | "end";
  marginTop?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  variant?: "solid" | "outline" | "ghost";
  disabled?: boolean;
  testID?: string;
  iconName?: IconName; // allows reuse beyond close (e.g., "chevron-down")
  style?: StyleProp<ViewStyle>;
}

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const CloseButton: React.FC<CloseButtonProps> = ({
  onPress,
  onLongPress,
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
  const config = React.useMemo(() => {
    const map = {
      small: { width: 32, height: 32, borderRadius: 16, iconSize: 16 },
      medium: { width: 40, height: 40, borderRadius: 20, iconSize: 20 },
      large: { width: 48, height: 48, borderRadius: 24, iconSize: 24 },
    } as const;
    return map[size];
  }, [size]);

  const alignment = React.useMemo(() => {
    const map = {
      center: "center",
      start: "flex-start",
      end: "flex-end",
    } as const;
    return map[position];
  }, [position]);

  const variantStyle = (() => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: `${theme.colors.surface}90`,
          borderWidth: 2,
          borderColor: `${theme.colors.primary}40`,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        } as ViewStyle;
      case "ghost":
        return {
          backgroundColor: `${theme.colors.surface}60`,
          borderWidth: 0,
          shadowOpacity: 0.08,
          elevation: 2,
        } as ViewStyle;
      default:
        return {} as ViewStyle; // solid (default styles apply)
    }
  })();

  const disabledStyle: ViewStyle | undefined = disabled
    ? {
        opacity: 0.4,
        shadowOpacity: 0.05,
        elevation: 1,
        borderColor: `${theme.colors.cardBorder}30`,
      }
    : undefined;

  return (
    <Pressable
      testID={testID}
      onPress={disabled ? undefined : onPress}
      onLongPress={disabled ? undefined : onLongPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      hitSlop={size === "small" ? 12 : size === "medium" ? 10 : 8}
      style={({ pressed }) => [
        styles.closeButton,
        variantStyle,
        {
          width: config.width,
          height: config.height,
          borderRadius: config.borderRadius,
          marginTop,
          alignSelf: alignment,
          transform: pressed ? [{ scale: 0.88 }] : [{ scale: 1 }],
          backgroundColor:
            variant === "solid"
              ? pressed
                ? `${theme.colors.surface}80`
                : theme.colors.surface
              : variantStyle.backgroundColor,
          opacity: pressed ? 0.85 : 1,
        },
        disabledStyle,
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={config.iconSize}
        color={
          disabled
            ? theme.colors.textTertiary
            : variant === "outline" || variant === "ghost"
              ? theme.colors.primary
              : theme.colors.textSecondary
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    // שיפורי צללים מתקדמים
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}50`,
    // שיפורי אינטראקציה
    ...(Platform.OS === "ios" && {
      shadowPath: undefined, // יאפשר צל טבעי יותר
    }),
  },
});
