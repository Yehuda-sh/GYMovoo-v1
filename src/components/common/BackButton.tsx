/**
 * @file src/components/common/BackButton.tsx
 * @brief כפתור חזרה פשוט ויעיל עם אינטגרציה ל-theme
 * @dependencies React Navigation, MaterialCommunityIcons, theme
 */

import React, { useMemo, useCallback } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
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
  testID?: string;
}

const BackButton: React.FC<BackButtonProps> = React.memo(
  ({
    absolute = true,
    onPress,
    style,
    disabled = false,
    accessibilityLabel = "חזור",
    testID,
  }) => {
    const navigation = useNavigation<NavProp>();

    const buttonStyle = useMemo(
      () =>
        theme.components.getBackButtonStyle({
          absolute,
          variant: "default",
          customStyle: style as ViewStyle,
        }),
      [absolute, style]
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
            {
              hasCustomHandler: !!onPress,
            }
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
          buttonStyle,
          {
            opacity: pressed ? 0.7 : 1,
            transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
          },
        ]}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
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
          name={
            theme.icons.chevron as keyof typeof MaterialCommunityIcons.glyphMap
          }
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
