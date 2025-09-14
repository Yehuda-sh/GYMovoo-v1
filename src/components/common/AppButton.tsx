/**
 * @file src/components/common/AppButton.tsx
 * @description רכיב כפתור אחיד לכל האפליקציה
 * English: Universal button component for the entire application
 *
 * ✅ PRODUCTION-READY: Unified button with consistent design and behavior
 * - גודל מינימלי 44x44 לנגישות
 * - אנימציות לחיצה מותאמות
 * - טיפול במצב loading
 * - תמיכה בוואריאנטים מרובים
 * - נגישות מלאה
 * - תמיכה בהיפטיק פידבק
 *
 * @features
 * - ✅ גודל מינימלי 44x44px
 * - ✅ אנימציות לחיצה
 * - ✅ מצב loading
 * - ✅ וואריאנטים מרובים
 * - ✅ נגישות מלאה
 * - ✅ Haptic feedback
 * - ✅ RTL support
 */

import React, { useCallback, useMemo } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
  Pressable,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../core/theme";

// =======================================
// 🎯 Types & Interfaces
// =======================================

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "workout"
  | "minimal";

export type ButtonSize = "small" | "medium" | "large" | "full";

export interface AppButtonProps {
  // Core Props
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;

  // State Props
  disabled?: boolean;
  loading?: boolean;

  // Icon Props
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconPosition?: "left" | "right";
  iconSize?: number;

  // Style Props
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;

  // Accessibility Props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;

  // Enhanced Features
  haptic?: boolean;
  hapticType?: "light" | "medium" | "heavy";
}

// =======================================
// 🎨 Style Configuration
// =======================================

const BUTTON_CONSTANTS = {
  MIN_HEIGHT: 44, // iOS HIG minimum touch target
  MIN_WIDTH: 44,
  BORDER_RADIUS: 12,
  HIT_SLOP: { top: 8, bottom: 8, left: 8, right: 8 },
} as const;

const SIZE_CONFIG = {
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    iconSize: 16,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    iconSize: 18,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 18,
    iconSize: 20,
    minHeight: 52,
  },
  full: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 16,
    iconSize: 18,
    minHeight: 48,
  },
} as const;

// =======================================
// 🎯 Main Component
// =======================================

export const AppButton: React.FC<AppButtonProps> = React.memo(
  ({
    title,
    onPress,
    variant = "primary",
    size = "medium",
    disabled = false,
    loading = false,
    icon,
    iconPosition = "left",
    iconSize,
    style,
    textStyle,
    fullWidth = false,
    accessibilityLabel,
    accessibilityHint,
    testID,
    haptic = true,
    hapticType = "light",
  }) => {
    // =======================================
    // 🔄 State Management
    // =======================================

    // Removed lastPressTime state as double press prevention was removed

    // =======================================
    // 🎨 Style Calculations
    // =======================================

    const sizeConfig = SIZE_CONFIG[size];
    const finalIconSize = iconSize || sizeConfig.iconSize;

    const variantStyles = useMemo((): {
      container: ViewStyle;
      text: TextStyle;
    } => {
      const baseStyles = {
        container: {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
          borderColor: "transparent",
        } as ViewStyle,
        text: {
          color: theme.colors.white,
          fontWeight: "600" as const,
        } as TextStyle,
      };

      switch (variant) {
        case "secondary":
          return {
            container: {
              ...baseStyles.container,
              backgroundColor: theme.colors.secondary,
            },
            text: {
              ...baseStyles.text,
              color: theme.colors.white,
            },
          };

        case "outline":
          return {
            container: {
              ...baseStyles.container,
              backgroundColor: "transparent",
              borderWidth: 2,
              borderColor: theme.colors.primary,
            },
            text: {
              ...baseStyles.text,
              color: theme.colors.primary,
            },
          };

        case "ghost":
          return {
            container: {
              ...baseStyles.container,
              backgroundColor: "transparent",
            },
            text: {
              ...baseStyles.text,
              color: theme.colors.primary,
            },
          };

        case "danger":
          return {
            container: {
              ...baseStyles.container,
              backgroundColor: theme.colors.error,
            },
            text: {
              ...baseStyles.text,
              color: theme.colors.white,
            },
          };

        case "success":
          return {
            container: {
              ...baseStyles.container,
              backgroundColor: theme.colors.success,
            },
            text: {
              ...baseStyles.text,
              color: theme.colors.white,
            },
          };

        case "workout":
          return {
            container: {
              ...baseStyles.container,
              backgroundColor: theme.colors.accent,
            },
            text: {
              ...baseStyles.text,
              color: theme.colors.white,
              fontWeight: "700" as const,
            },
          };

        case "minimal":
          return {
            container: {
              ...baseStyles.container,
              backgroundColor: `${theme.colors.surface}80`,
              borderWidth: 1,
              borderColor: `${theme.colors.border}40`,
            },
            text: {
              ...baseStyles.text,
              color: theme.colors.text,
              fontWeight: "500" as const,
            },
          };

        default: // primary
          return baseStyles;
      }
    }, [variant]);

    const containerStyle = useMemo(
      (): ViewStyle => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: Math.max(sizeConfig.minHeight, BUTTON_CONSTANTS.MIN_HEIGHT),
        minWidth: fullWidth ? undefined : BUTTON_CONSTANTS.MIN_WIDTH,
        paddingHorizontal: sizeConfig.paddingHorizontal,
        paddingVertical: sizeConfig.paddingVertical,
        borderRadius: BUTTON_CONSTANTS.BORDER_RADIUS,
        ...variantStyles.container,
        ...(fullWidth && { width: "100%" }),
        ...(disabled && {
          opacity: 0.5,
          backgroundColor: theme.colors.surface,
        }),
        ...(loading && {
          opacity: 0.8,
        }),
      }),
      [sizeConfig, variantStyles, fullWidth, disabled, loading]
    );

    const finalTextStyle = useMemo(
      (): TextStyle => ({
        fontSize: sizeConfig.fontSize,
        textAlign: "center",
        ...variantStyles.text,
        ...(disabled && {
          color: theme.colors.textSecondary,
        }),
        ...textStyle,
      }),
      [sizeConfig, variantStyles, disabled, textStyle]
    );

    // =======================================
    // 🎯 Event Handlers
    // =======================================

    const triggerHapticFeedback = useCallback(() => {
      if (!haptic || disabled || loading) return;

      const feedbackTypes = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      };

      Haptics.impactAsync(feedbackTypes[hapticType]);
    }, [haptic, disabled, loading, hapticType]);

    const handlePress = useCallback(() => {
      if (disabled || loading) return;

      // Trigger haptic feedback
      triggerHapticFeedback();

      // Execute onPress
      onPress();
    }, [disabled, loading, triggerHapticFeedback, onPress]);

    // =======================================
    // 🎯 Content Rendering
    // =======================================

    const renderIcon = useCallback(
      (position: "left" | "right") => {
        if (!icon || iconPosition !== position) return null;

        return (
          <MaterialCommunityIcons
            name={icon}
            size={finalIconSize}
            color={
              disabled ? theme.colors.textSecondary : variantStyles.text.color
            }
            style={[
              iconPosition === "left" && { marginRight: 8 },
              iconPosition === "right" && { marginLeft: 8 },
            ]}
          />
        );
      },
      [icon, iconPosition, finalIconSize, disabled, variantStyles.text.color]
    );

    const renderContent = useMemo(() => {
      if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={variantStyles.text.color}
              style={{ marginRight: title ? 8 : 0 }}
            />
            {title && (
              <Text style={finalTextStyle} numberOfLines={1}>
                {title}
              </Text>
            )}
          </View>
        );
      }

      return (
        <View style={styles.contentContainer}>
          {renderIcon("left")}
          <Text style={finalTextStyle} numberOfLines={1}>
            {title}
          </Text>
          {renderIcon("right")}
        </View>
      );
    }, [loading, variantStyles.text.color, title, finalTextStyle, renderIcon]);

    // =======================================
    // 🎯 Component Selection
    // =======================================

    const ButtonComponent =
      Platform.OS === "ios" ? Pressable : TouchableOpacity;

    return (
      <ButtonComponent
        style={[containerStyle, style]}
        onPress={handlePress}
        disabled={disabled || loading}
        hitSlop={BUTTON_CONSTANTS.HIT_SLOP}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled: disabled || loading,
          busy: loading,
        }}
        testID={testID || `app-button-${variant}-${size}`}
        {...(Platform.OS === "ios" && {
          style: ({ pressed }: { pressed: boolean }) => [
            containerStyle,
            pressed && !disabled && !loading && styles.pressed,
            style,
          ],
        })}
      >
        {renderContent}
      </ButtonComponent>
    );
  }
);

AppButton.displayName = "AppButton";

// =======================================
// 🎨 Styles
// =======================================

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export default AppButton;
