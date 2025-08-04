/**
 * @file src/components/ui/UniversalButton.tsx
 * @brief כפתור אוניברסלי עם וריאציות עיצוב וגדלים משופר
 * @dependencies theme, LinearGradient, Ionicons, React.memo
 * @notes תומך ב-primary, secondary, outline, ghost, gradient, danger
 * @recurring_errors וודא העברת variant נכון, ברירת מחדל primary
 * @version 2.0 - Enhanced with React.memo, useMemo, testID, danger variant
 */

import React, { useMemo } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface UniversalButtonProps extends TouchableOpacityProps {
  title: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "gradient"
    | "danger";
  size?: "small" | "medium" | "large";
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
}

export const UniversalButton: React.FC<UniversalButtonProps> = React.memo(
  ({
    title,
    variant = "primary",
    size = "medium",
    icon,
    iconPosition = "left",
    loading = false,
    disabled = false,
    fullWidth = false,
    onPress,
    style,
    accessibilityLabel,
    accessibilityHint,
    testID = "universal-button",
    hitSlop = { top: 10, bottom: 10, left: 10, right: 10 },
    ...props
  }) => {
    const isDisabled = disabled || loading;

    // יצירת תווית נגישות מותאמת
    const getAccessibilityLabel = useMemo(() => {
      if (accessibilityLabel) return accessibilityLabel;
      if (loading) return `${title}, טוען`;
      return title;
    }, [accessibilityLabel, title, loading]);

    const getAccessibilityHint = useMemo(() => {
      if (accessibilityHint) return accessibilityHint;
      if (loading) return "הכפתור טוען, אנא המתן";
      if (disabled) return "כפתור לא זמין";
      return "הקש כדי להפעיל";
    }, [accessibilityHint, loading, disabled]);

    // גדלים דינמיים // Dynamic sizes
    const sizeStyles = useMemo(() => {
      switch (size) {
        case "small":
          return {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            fontSize: theme.typography.buttonSmall.fontSize,
            iconSize: 16,
          };
        case "large":
          return {
            paddingHorizontal: theme.spacing.xxl,
            paddingVertical: theme.spacing.lg,
            fontSize: theme.typography.buttonLarge.fontSize,
            iconSize: 24,
          };
        default:
          return {
            paddingHorizontal: theme.spacing.xl,
            paddingVertical: theme.spacing.md,
            fontSize: theme.typography.button.fontSize,
            iconSize: 20,
          };
      }
    }, [size]);

    // סגנונות לפי וריאנט // Variant styles
    const variantStyles = useMemo(() => {
      switch (variant) {
        case "secondary":
          return {
            backgroundColor: theme.colors.secondary,
            borderWidth: 0,
            textColor: theme.colors.white,
          };
        case "outline":
          return {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: theme.colors.primary,
            textColor: theme.colors.primary,
          };
        case "ghost":
          return {
            backgroundColor: "transparent",
            borderWidth: 0,
            textColor: theme.colors.primary,
          };
        case "gradient":
          return {
            backgroundColor: "transparent",
            borderWidth: 0,
            textColor: theme.colors.white,
          };
        case "danger":
          return {
            backgroundColor: theme.colors.error,
            borderWidth: 0,
            textColor: theme.colors.white,
          };
        default:
          return {
            backgroundColor: theme.colors.primary,
            borderWidth: 0,
            textColor: theme.colors.white,
          };
      }
    }, [variant]);

    // תוכן הכפתור // Button content
    const renderContent = useMemo(
      () => (
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="small" color={variantStyles.textColor} />
          ) : (
            <>
              {icon && iconPosition === "left" && (
                <Ionicons
                  name={icon}
                  size={sizeStyles.iconSize}
                  color={variantStyles.textColor}
                  style={styles.iconLeft}
                />
              )}
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: sizeStyles.fontSize,
                    color: variantStyles.textColor,
                  },
                ]}
              >
                {title}
              </Text>
              {icon && iconPosition === "right" && (
                <Ionicons
                  name={icon}
                  size={sizeStyles.iconSize}
                  color={variantStyles.textColor}
                  style={styles.iconRight}
                />
              )}
            </>
          )}
        </View>
      ),
      [
        loading,
        variantStyles.textColor,
        icon,
        iconPosition,
        sizeStyles.iconSize,
        sizeStyles.fontSize,
        title,
      ]
    );

    // כפתור גרדיאנט // Gradient button
    if (variant === "gradient" && !isDisabled) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          disabled={isDisabled}
          style={[fullWidth && styles.fullWidth, style]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={getAccessibilityLabel}
          accessibilityHint={getAccessibilityHint}
          accessibilityState={{
            disabled: isDisabled,
            busy: loading,
          }}
          testID={testID}
          hitSlop={hitSlop}
          {...props}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.button,
              {
                paddingHorizontal: sizeStyles.paddingHorizontal,
                paddingVertical: sizeStyles.paddingVertical,
              },
            ]}
          >
            {renderContent}
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    // כפתור רגיל // Regular button
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={isDisabled}
        style={[
          styles.button,
          {
            backgroundColor: variantStyles.backgroundColor,
            borderWidth: variantStyles.borderWidth,
            borderColor: variantStyles.borderColor,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
            opacity: isDisabled ? 0.5 : 1,
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel}
        accessibilityHint={getAccessibilityHint}
        accessibilityState={{
          disabled: isDisabled,
          busy: loading,
        }}
        testID={testID}
        hitSlop={hitSlop}
        {...props}
      >
        {renderContent}
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
    ...theme.shadows.medium,
  },
  contentContainer: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  iconLeft: {
    marginRight: theme.isRTL ? 0 : theme.spacing.sm,
    marginLeft: theme.isRTL ? theme.spacing.sm : 0,
  },
  iconRight: {
    marginLeft: theme.isRTL ? 0 : theme.spacing.sm,
    marginRight: theme.isRTL ? theme.spacing.sm : 0,
  },
  fullWidth: {
    width: "100%",
  },
});

export default UniversalButton;
