/**
 * @file src/components/common/BackButton.tsx
 * @brief ✨ כפתור חזרה אוניברסלי משופר עם אינטגרציה מלאה ל-theme
 * @dependencies React Navigation, Ionicons, theme
 * @notes כולל תמיכה במיקום מוחלט ויחסי, נגישות מלאה, fallback navigation
 * @version 2.6 - RTL icon support, emergency navigation, enhanced logging
 */

import React, { useMemo } from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { logger } from "../../utils/logger";

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
    const navigateToHome = () => {
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
    };

    const handlePress = () => {
      if (disabled) return;

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
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={onLongPress}
        style={buttonStyle}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        testID={testID || "back-button"}
        hitSlop={{
          top: hitSlopValue,
          bottom: hitSlopValue,
          left: hitSlopValue,
          right: hitSlopValue,
        }}
      >
        <MaterialCommunityIcons
          name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
          size={iconSize}
          color={iconColor}
          testID="back-button-icon"
        />
      </TouchableOpacity>
    );
  }
);

BackButton.displayName = "BackButton";

export default BackButton;
