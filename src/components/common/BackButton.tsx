/**
 * @file src/components/common/BackButton.tsx
 * @brief ✨ כפתור חזרה אוניברסלי משופר עם אינטגרציה מלאה ל-theme + ביצועים מתקדמים
 * @dependencies React Navigation, MaterialCommunityIcons, theme, expo-haptics
 * @notes כולל תמיכה במיקום מוחלט ויחסי, נגישות מלאה, fallback navigation, haptic feedback
 * @version 2.7 - Enhanced with haptic feedback, loading state, reducedMotion, Pressable upgrade
 * @updated 2025-09-02 - Performance optimizations and modern React Native patterns
 */

import React, { useMemo, useCallback } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../core/theme";
import { logger } from "../../utils/logger";
import LoadingSpinner from "./LoadingSpinner";

// Define a more flexible navigation type for this component's purpose
interface NavProp {
  canGoBack: () => boolean;
  goBack: () => void;
  navigate: (screen: string, params?: Record<string, unknown>) => void;
  reset?: (state: { index: number; routes: { name: string }[] }) => void;
}

type BackButtonVariant = "default" | "minimal" | "large";

interface BackButtonProps {
  absolute?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  fallbackScreen?: string;
  fallbackParams?: Record<string, unknown>;
  size?: number;
  variant?: BackButtonVariant;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  hitSlop?: number;

  // 🆕 Enhanced Features
  loading?: boolean; // מצב טעינה
  haptic?: boolean; // רטט בלחיצה
  hapticType?: "light" | "medium" | "heavy"; // סוג הרטט
  reducedMotion?: boolean; // השבתת אנימציות
}

const BackButton: React.FC<BackButtonProps> = React.memo(
  ({
    absolute = true,
    onPress,
    onLongPress,
    fallbackScreen,
    fallbackParams,
    size,
    variant = "default",
    style,
    disabled = false,
    accessibilityLabel = "חזור",
    accessibilityHint = "לחץ כדי לחזור למסך הקודם",
    testID,
    iconName = theme.icons.chevron,
    hitSlop, // Default value removed, will be handled by theme
    // Enhanced Features
    loading = false,
    haptic = false,
    hapticType = "light",
    reducedMotion = false,
  }) => {
    const navigation = useNavigation<NavProp>();

    const buttonStyle = useMemo(
      () =>
        theme.components.getBackButtonStyle({
          absolute,
          variant: variant as "default" | "minimal" | "large",
          customStyle: style as ViewStyle,
        }),
      [absolute, variant, style]
    );

    const iconSize = useMemo(
      () =>
        theme.components.getBackButtonIconSize(
          variant as "default" | "minimal" | "large",
          size
        ),
      [variant, size]
    );

    // Centralized logic for icon color via theme
    const iconColor = useMemo(
      () => theme.components.getBackButtonIconColor(disabled),
      [disabled]
    );

    // Centralized logic for hitSlop via theme
    const hitSlopValue = useMemo(
      () =>
        theme.components.getBackButtonHitSlop(
          variant as "default" | "minimal" | "large",
          hitSlop
        ),
      [variant, hitSlop]
    );

    /**
     * ניווט למסך בית במקרה חירום
     * Navigate to home screen as emergency fallback
     */
    const navigateToHome = useCallback(() => {
      try {
        if (navigation.reset) {
          navigation.reset({
            index: 0,
            routes: [{ name: "MainApp" }],
          });
        } else {
          navigation.navigate("MainApp");
        }
      } catch (error) {
        logger.error("BackButton", "Failed to navigate to home", error);
      }
    }, [navigation]);

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

    const handlePress = useCallback(() => {
      if (disabled || loading) return;

      // Trigger haptic feedback
      triggerHapticFeedback();

      try {
        if (onPress) {
          onPress();
        } else if (navigation.canGoBack()) {
          navigation.goBack();
        } else if (fallbackScreen) {
          // Improved type safety, no more 'as unknown'
          navigation.navigate(fallbackScreen, fallbackParams || {});
        } else {
          logger.warn(
            "BackButton",
            "No history to go back to and no fallback screen provided",
            {
              currentScreen: fallbackScreen,
              hasCustomHandler: !!onPress,
            }
          );
          // Navigate to home as a last resort
          navigateToHome();
        }
      } catch (error) {
        logger.error("BackButton", "Navigation error", error);
      }
    }, [
      disabled,
      loading,
      triggerHapticFeedback,
      onPress,
      navigation,
      fallbackScreen,
      fallbackParams,
      navigateToHome,
    ]);

    const handleLongPress = useCallback(() => {
      if (disabled || loading || !onLongPress) return;
      triggerHapticFeedback();
      onLongPress();
    }, [disabled, loading, onLongPress, triggerHapticFeedback]);

    // 🎯 Interactive state
    const isInteractive = !disabled && !loading;

    return (
      <Pressable
        onPress={isInteractive ? handlePress : undefined}
        onLongPress={isInteractive ? handleLongPress : undefined}
        style={({ pressed }) => [
          buttonStyle,
          {
            opacity: pressed && !reducedMotion ? 0.7 : 1,
            transform:
              pressed && !reducedMotion ? [{ scale: 0.95 }] : [{ scale: 1 }],
          },
        ]}
        disabled={!isInteractive}
        accessibilityLabel={
          loading ? `${accessibilityLabel} - טוען` : accessibilityLabel
        }
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !isInteractive, busy: loading }}
        testID={testID || "back-button"}
        hitSlop={{
          top: hitSlopValue,
          bottom: hitSlopValue,
          left: hitSlopValue,
          right: hitSlopValue,
        }}
      >
        {loading ? (
          <LoadingSpinner
            size="small"
            variant="fade"
            testID={`${testID || "back-button"}-loading`}
          />
        ) : (
          <MaterialCommunityIcons
            name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
            size={iconSize}
            color={iconColor}
            testID="back-button-icon"
          />
        )}
      </Pressable>
    );
  }
);

BackButton.displayName = "BackButton";

export default BackButton;
