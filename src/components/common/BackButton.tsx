/**
 * @file src/components/common/BackButton.tsx
 * @brief כפתור חזרה פשוט ויעיל עם אינטגרציה ל-theme
 * @dependencies React Navigation, MaterialCommunityIcons, theme
 */

import React, { useMemo, useCallback } from "react";
import {
  Pressable,
  StyleProp,
  ViewStyle,
  I18nManager,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme";
import { logger } from "../../utils/logger";

// Define a more flexible navigation type for this component's purpose
interface NavProp {
  canGoBack: () => boolean;
  goBack: () => void;
  navigate: (screen: string, params?: Record<string, unknown>) => void;
  reset?: (state: { index: number; routes: { name: string }[] }) => void;
}

interface BackButtonProps {
  absolute?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const BackButton: React.FC<BackButtonProps> = React.memo(
  ({
    absolute = true,
    onPress,
    style,
    disabled = false,
    accessibilityLabel = "חזור",
    accessibilityHint,
    testID,
  }) => {
    const navigation = useNavigation<NavProp>();

    // בסיס סגנון מה-theme (לא מעבירים את style פנימה)
    const baseButtonStyle = useMemo(
      () =>
        theme.components.getBackButtonStyle({
          absolute,
          variant: "default",
        }),
      [absolute]
    );

    const iconSize = useMemo(
      () => theme.components.getBackButtonIconSize("default"),
      []
    );

    const iconColor = useMemo(
      () => theme.components.getBackButtonIconColor(disabled),
      [disabled]
    );

    const hitSlopValue = useMemo(
      () => theme.components.getBackButtonHitSlop("default"),
      []
    );

    // שם האייקון לפי RTL/LTR (ללא תלות בשדות לא קיימים ב-theme)
    const iconName = useMemo(
      () =>
        (I18nManager.isRTL
          ? "chevron-right"
          : "chevron-left") as keyof typeof MaterialCommunityIcons.glyphMap,
      []
    );

    // רמז נגישות ברירת מחדל במידת הצורך
    const a11yHint = accessibilityHint ?? "חוזר למסך הקודם";

    /**
     * ניווט למסך בית במקרה חירום
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

    const handlePress = useCallback(() => {
      if (disabled) return;

      try {
        if (onPress) {
          onPress();
        } else if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          logger.warn(
            "BackButton",
            "No history to go back to, navigating to home",
            { hasCustomHandler: !!onPress }
          );
          // Navigate to home as a last resort
          navigateToHome();
        }
      } catch (error) {
        logger.error("BackButton", "Navigation error", error);
      }
    }, [disabled, onPress, navigation, navigateToHome]);

    return (
      <Pressable
        onPress={!disabled ? handlePress : undefined}
        style={({ pressed }) => [
          baseButtonStyle,
          {
            opacity: pressed ? 0.7 : 1,
            transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
          },
          style, // חיבור נקי של style חיצוני (StyleProp<ViewStyle>)
        ]}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={a11yHint}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        testID={testID || "back-button"}
        hitSlop={{
          top: hitSlopValue,
          bottom: hitSlopValue,
          left: hitSlopValue, // ← במקום start
          right: hitSlopValue, // ← במקום end
        }}
        android_ripple={
          Platform.OS === "android"
            ? { color: `${theme.colors.text}22`, borderless: false }
            : undefined
        }
      >
        <MaterialCommunityIcons
          name={iconName}
          size={iconSize}
          color={iconColor}
          testID="back-button-icon"
        />
      </Pressable>
    );
  }
);

BackButton.displayName = "BackButton";

export default BackButton;
