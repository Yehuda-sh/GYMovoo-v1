/**
 * @file src/components/common/BackButton.tsx
 * @brief ✨ כפתור חזרה אוניברסלי משופר עם אינטגרציה מלאה ל-theme
 * @dependencies React Navigation, Ionicons, theme
 * @notes כולל תמיכה במיקום מוחלט ויחסי, נגישות מלאה, fallback navigation
 * @version 2.3 - Added fallback navigation support for better UX
 */

import React, { useMemo } from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

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
    hitSlop = 10,
  }) => {
    const navigation = useNavigation();

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

    const handlePress = () => {
      if (disabled) return;
      if (onPress) onPress();
      else if (navigation.canGoBack()) navigation.goBack();
      else if (fallbackScreen)
        (
          navigation as unknown as {
            navigate: (
              screen: string,
              params?: Record<string, unknown>
            ) => void;
          }
        ).navigate(fallbackScreen, fallbackParams || {});
      else
        console.warn(
          "⚠️ BackButton: No history to go back to and no fallback screen provided"
        );
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
          top: hitSlop,
          bottom: hitSlop,
          left: hitSlop,
          right: hitSlop,
        }}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={iconSize}
          color={disabled ? theme.colors.textTertiary : theme.colors.text}
        />
      </TouchableOpacity>
    );
  }
);

BackButton.displayName = "BackButton";

export default BackButton;
