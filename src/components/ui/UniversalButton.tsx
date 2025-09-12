/**
 * @file src/components/ui/UniversalButton.tsx
 * @brief כפתור אוניברסלי עם וריאציות עיצוב משופר + אופטימיזציה לכושר מובייל
 * @dependencies theme, React.memo
 * @notes תומך ב-primary, outline
 * @version 4.0 - Simplified version with only used features
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { theme } from "../../core/theme";

interface UniversalButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "outline";
  onPress?: () => void;
}

export const UniversalButton: React.FC<UniversalButtonProps> = React.memo(
  ({ title, variant = "primary", onPress, style, ...props }) => {
    // סגנונות לפי וריאנט
    const variantStyles = React.useMemo(() => {
      switch (variant) {
        case "outline":
          return {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: theme.colors.primary,
            textColor: theme.colors.primary,
          };
        default: // primary
          return {
            backgroundColor: theme.colors.primary,
            borderWidth: 0,
            textColor: theme.colors.white,
          };
      }
    }, [variant]);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[
          styles.button,
          {
            backgroundColor: variantStyles.backgroundColor,
            borderWidth: variantStyles.borderWidth,
            borderColor: variantStyles.borderColor,
          },
          style,
        ]}
        {...props}
      >
        <Text
          style={[
            styles.text,
            {
              color: variantStyles.textColor,
            },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

// 🔧 תמיכה ב-displayName לדיבוג
// displayName support for debugging
UniversalButton.displayName = "UniversalButton";

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    minHeight: 44, // נגישות
    ...theme.shadows.medium,
  },
  text: {
    fontSize: theme.typography.button.fontSize,
    fontWeight: "600",
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
});

export default UniversalButton;
