/**
 * @file src/components/common/BackButton.tsx
 * @brief ✨ כפתור חזרה אוניברסלי משופר עם אינטגרציה מלאה ל-theme
 * @dependencies React Navigation, Ionicons, theme
 * @notes כולל תמיכה במיקום מוחלט ויחסי, נגישות מלאה, fallback navigation
 * @version 2.4 - Refactored for improved type safety and theme integration
 */

import React, { useMemo } from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

// Define a more flexible navigation type for this component's purpose
interface NavProp {
  canGoBack: () => boolean;
  goBack: () => void;
  navigate: (screen: string, params?: Record<string, unknown>) => void;
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
    iconName = "chevron-right",
    hitSlop, // Default value removed, will be handled by theme
  }) => {
    const navigation = useNavigation<NavProp>();

    const buttonStyle = useMemo(
      () =>
        theme.components.getBackButtonStyle({
          absolute,
          variant,
          customStyle: style as ViewStyle,
        }),
      [absolute, variant, style]
    );

    const iconSize = useMemo(
      () => theme.components.getBackButtonIconSize(variant, size),
      [variant, size]
    );

    // Centralized logic for icon color via theme
    const iconColor = useMemo(
      () => theme.components.getBackButtonIconColor(disabled),
      [disabled]
    );

    // Centralized logic for hitSlop via theme
    const hitSlopValue = useMemo(
      () => theme.components.getBackButtonHitSlop(variant, hitSlop),
      [variant, hitSlop]
    );

    const handlePress = () => {
      if (disabled) return;
      if (onPress) {
        onPress();
      } else if (navigation.canGoBack()) {
        navigation.goBack();
      } else if (fallbackScreen) {
        // Improved type safety, no more 'as unknown'
        navigation.navigate(fallbackScreen, fallbackParams || {});
      } else {
        console.warn(
          "⚠️ BackButton: No history to go back to and no fallback screen provided"
        );
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
        testID={testID}
        hitSlop={{
          top: hitSlopValue,
          bottom: hitSlopValue,
          left: hitSlopValue,
          right: hitSlopValue,
        }}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
    );
  }
);

BackButton.displayName = "BackButton";

export default BackButton;
