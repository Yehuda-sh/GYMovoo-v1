/**
 * @file src/screens/workout/components/shared/CloseButton.tsx
 * @brief כפתור סגירה מאוחד עם ווריאנטים שונים + אופטימיזציות ביצועים
 * @version 1.1.0
 * @author GYMovoo Development Team
 * @created 2025-08-05
 * @updated 2025-09-02 - Added React.memo, haptic feedback, loading state, performance optimizations
 *
 * @description
 * רכיב כפתור סגירה מאוחד המשמש בכל רכיבי האימון
 * תומך בגדלים ועיצובים שונים לפי ה-variant עם תמיכה ברטט ומצבי טעינה
 *
 * @features
 * - ✅ 3 גדלים: small, medium, large
 * - ✅ אנימציית מגע חלקה
 * - ✅ נגישות מלאה עם Screen Readers
 * - ✅ התאמה לתמה
 * - ✅ התמקמות דינמית
 * - 🆕 React.memo לאופטימיזציית ביצועים
 * - 🆕 Haptic feedback (רטט)
 * - 🆕 Loading state
 * - 🆕 Enhanced hitSlop למובייל
 * - 🆕 ReducedMotion support
 *
 * @accessibility
 * תמיכה מלאה ב-Screen Readers עם accessibilityLabel מותאם
 * hitSlop מוגדל לחוויית מגע מובייל משופרת
 *
 * @performance
 * - React.memo למניעת re-renders מיותרים
 * - useMemo לחישובים כבדים
 * - useCallback לפונקציות handlers
 */

import React, { useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../../../styles/theme";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

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

  // 🆕 Enhanced Features
  loading?: boolean; // מצב טעינה
  haptic?: boolean; // רטט בלחיצה
  hapticType?: "light" | "medium" | "heavy"; // סוג הרטט
  reducedMotion?: boolean; // השבתת אנימציות
}

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const CloseButton: React.FC<CloseButtonProps> = React.memo(
  ({
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
    // Enhanced Features
    loading = false,
    haptic = false,
    hapticType = "light",
    reducedMotion = false,
  }) => {
    // 🎯 Configuration מאופטם עם useMemo
    const config = React.useMemo(() => {
      const map = {
        small: { width: 32, height: 32, borderRadius: 16, iconSize: 16 },
        medium: { width: 40, height: 40, borderRadius: 20, iconSize: 20 },
        large: { width: 48, height: 48, borderRadius: 24, iconSize: 24 },
      } as const;
      return map[size];
    }, [size]);

    // 🎯 Alignment מאופטם עם useMemo
    const alignment = React.useMemo(() => {
      const map = {
        center: "center",
        start: "flex-start",
        end: "flex-end",
      } as const;
      return map[position];
    }, [position]);

    // 🎯 Haptic feedback handler
    const triggerHapticFeedback = useCallback(() => {
      if (haptic && !disabled && !loading) {
        const feedbackTypes = {
          light: Haptics.ImpactFeedbackStyle.Light,
          medium: Haptics.ImpactFeedbackStyle.Medium,
          heavy: Haptics.ImpactFeedbackStyle.Heavy,
        };
        Haptics.impactAsync(feedbackTypes[hapticType]);
      }
    }, [haptic, disabled, loading, hapticType]);

    // 🎯 Enhanced press handler עם haptic feedback
    const handlePress = useCallback(() => {
      if (disabled || loading) return;
      triggerHapticFeedback();
      onPress();
    }, [disabled, loading, triggerHapticFeedback, onPress]);

    // 🎯 Enhanced long press handler
    const handleLongPress = useCallback(() => {
      if (disabled || loading || !onLongPress) return;
      triggerHapticFeedback();
      onLongPress();
    }, [disabled, loading, onLongPress, triggerHapticFeedback]);

    // 🎯 Enhanced hitSlop למובייל (20px במקום 8-12)
    const hitSlopValue = React.useMemo(() => {
      const baseHitSlop = 20; // משופר לחוויית mobile טובה יותר
      return {
        top: baseHitSlop,
        bottom: baseHitSlop,
        left: baseHitSlop,
        right: baseHitSlop,
      };
    }, []);

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

    // 🎯 Loading and disabled states
    const isInteractive = !disabled && !loading;

    return (
      <Pressable
        testID={testID}
        onPress={isInteractive ? handlePress : undefined}
        onLongPress={isInteractive ? handleLongPress : undefined}
        disabled={!isInteractive}
        accessibilityRole="button"
        accessibilityLabel={
          loading ? `${accessibilityLabel} - טוען` : accessibilityLabel
        }
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !isInteractive, busy: loading }}
        hitSlop={hitSlopValue}
        style={({ pressed }) => [
          styles.closeButton,
          variantStyle,
          {
            width: config.width,
            height: config.height,
            borderRadius: config.borderRadius,
            marginTop,
            alignSelf: alignment,
            transform:
              pressed && !reducedMotion ? [{ scale: 0.88 }] : [{ scale: 1 }],
            backgroundColor:
              variant === "solid"
                ? pressed && !reducedMotion
                  ? `${theme.colors.surface}80`
                  : theme.colors.surface
                : variantStyle.backgroundColor,
            opacity: pressed && !reducedMotion ? 0.85 : 1,
          },
          disabledStyle,
          style,
        ]}
      >
        {loading ? (
          <LoadingSpinner
            size="small"
            variant="fade"
            testID={`${testID}-loading`}
          />
        ) : (
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
        )}
      </Pressable>
    );
  }
);

// 🎯 Display name לטובת debugging
CloseButton.displayName = "CloseButton";

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
