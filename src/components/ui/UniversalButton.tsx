/**
 * @file src/components/ui/UniversalButton.tsx
 * @brief כפתור אוניברסלי עם וריאציות עיצוב וגדלים משופר + אופטימיזציה לכושר מובייל
 * @dependencies theme, LinearGradient, Ionicons, React.memo, expo-haptics
 * @notes תומך ב-primary, secondary, outline, ghost, gradient, danger, workout + haptic feedback
 * @recurring_errors וודא העברת variant נכון, ברירת מחדל primary, workout למסכי אימון
 * @version 3.0 - Fitness mobile optimization, workout variant, haptic feedback, RTL fix, 44px validation
 */

import React, { useMemo, useCallback } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TouchableOpacityProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../styles/theme";
import LoadingSpinner from "../common/LoadingSpinner";

interface UniversalButtonProps extends TouchableOpacityProps {
  title: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "gradient"
    | "danger"
    | "workout"; // 🏋️ מצב אימון פעיל - כפתורים גדולים במיוחד
  size?: "small" | "medium" | "large";
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  enableHapticFeedback?: boolean; // 🎯 משוב מושגי לכל לחיצה
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
    enableHapticFeedback = false, // 🎯 ברירת מחדל לא פעיל
    style,
    accessibilityLabel,
    accessibilityHint,
    testID = "universal-button",
    hitSlop = { top: 20, bottom: 20, left: 20, right: 20 }, // 🏋️ הגדלת hitSlop לכושר
    ...props
  }) => {
    const isDisabled = disabled || loading;

    // 🎯 פונקציית haptic feedback לאפליקציות כושר
    // Haptic feedback function for fitness apps
    const handlePress = useCallback(() => {
      if (enableHapticFeedback && !isDisabled) {
        // משוב מושגי בהתאם לvariant
        const feedbackIntensity =
          variant === "workout" || variant === "danger"
            ? Haptics.ImpactFeedbackStyle.Heavy
            : Haptics.ImpactFeedbackStyle.Medium;
        Haptics.impactAsync(feedbackIntensity);
      }
      onPress?.();
    }, [enableHapticFeedback, isDisabled, variant, onPress]);

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
      let baseStyles;
      switch (size) {
        case "small":
          baseStyles = {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            fontSize: theme.typography.buttonSmall.fontSize,
            iconSize: 16,
          };
          break;
        case "large":
          baseStyles = {
            paddingHorizontal: theme.spacing.xxl,
            paddingVertical: theme.spacing.lg,
            fontSize: theme.typography.buttonLarge.fontSize,
            iconSize: 24,
          };
          break;
        default:
          baseStyles = {
            paddingHorizontal: theme.spacing.xl,
            paddingVertical: theme.spacing.md,
            fontSize: theme.typography.button.fontSize,
            iconSize: 20,
          };
      }

      // 🏋️ workout variant - כפתורים גדולים במיוחד לאימון
      if (variant === "workout") {
        baseStyles = {
          paddingHorizontal: theme.spacing.xxl * 1.5,
          paddingVertical: theme.spacing.xl,
          fontSize: theme.typography.buttonLarge.fontSize * 1.2,
          iconSize: 28,
        };
      }

      // ✅ validation גודל מינימלי 44px לנגישות
      const minHeight = 44;
      const currentHeight =
        baseStyles.paddingVertical * 2 + baseStyles.fontSize;
      if (currentHeight < minHeight) {
        const additionalPadding = (minHeight - baseStyles.fontSize) / 2;
        baseStyles.paddingVertical = Math.max(
          baseStyles.paddingVertical,
          additionalPadding
        );
      }

      return baseStyles;
    }, [size, variant]);

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
        case "workout":
          // 🏋️ מצב אימון - עיצוב בולט ונגיש
          return {
            backgroundColor: theme.colors.primary,
            borderWidth: 2,
            borderColor: theme.colors.secondary,
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
            <LoadingSpinner
              size="small"
              color={variantStyles.textColor}
              variant="bounce"
              testID="button-loading"
            />
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
          onPress={handlePress}
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
        onPress={handlePress}
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
    writingDirection: "rtl", // 🔴 תיקון RTL חובה לטקסטים עבריים
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
