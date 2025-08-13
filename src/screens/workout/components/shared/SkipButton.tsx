/**
 * @file src/screens/workout/components/shared/SkipButton.tsx
 * @brief כפתור דילוג / פעולה קצרה לשימוש חוזר (מניעת כפילויות)
 * @features
 * - מצב loading + disabled
 * - תמיכה ברטט (haptic)
 * - reducedMotion (השבתת אנימציות חיצוניות)
 * - טיפוס אייקון בטוח
 */
import React, { useMemo, useCallback } from "react";
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";

export interface SkipButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  colors: [string, string, ...string[]];
  size?: number;
  accessibilityLabel: string;
  accessibilityHint?: string;
  pulseAnimation?: Animated.Value;
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
  disabled?: boolean;
  loading?: boolean;
  haptic?: boolean;
  testID?: string;
  reducedMotion?: boolean;
}

export const SkipButton: React.FC<SkipButtonProps> = React.memo(
  ({
    onPress,
    onLongPress,
    icon,
    colors,
    size = 20,
    accessibilityLabel,
    accessibilityHint,
    pulseAnimation,
    style,
    iconColor = theme.colors.white,
    disabled = false,
    loading = false,
    haptic = false,
    testID,
    reducedMotion = false,
  }) => {
    const animatedStyle = useMemo(() => {
      if (!pulseAnimation || reducedMotion) return undefined;
      return { transform: [{ scale: pulseAnimation }] };
    }, [pulseAnimation, reducedMotion]);

    const mergedContainerStyle = useMemo(
      () => [
        styles.container,
        disabled && styles.disabled,
        loading && styles.loading,
        style,
      ],
      [disabled, loading, style]
    );

    const handlePress = useCallback(() => {
      if (disabled || loading) return;
      if (haptic) triggerVibration("short");
      onPress();
    }, [disabled, loading, haptic, onPress]);

    const handleLongPress = useCallback(() => {
      if (disabled || loading) return;
      if (haptic) triggerVibration("short");
      onLongPress?.();
    }, [disabled, loading, haptic, onLongPress]);

    return (
      <Animated.View style={animatedStyle} testID={testID || "SkipButton"}>
        <TouchableOpacity
          style={mergedContainerStyle}
          onPress={handlePress}
          onLongPress={handleLongPress}
          activeOpacity={0.7}
          hitSlop={10}
          testID={testID ? `${testID}-touchable` : "SkipButtonTouchable"}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole="button"
          accessibilityState={{ disabled, busy: loading }}
          disabled={disabled || loading}
        >
          <LinearGradient colors={colors} style={styles.gradient}>
            {loading ? (
              <ActivityIndicator size="small" color={iconColor} />
            ) : (
              <MaterialCommunityIcons
                name={icon}
                size={size}
                color={iconColor}
              />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

SkipButton.displayName = "SkipButton";

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
    ...(theme.shadows.medium as object),
  },
  gradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.85,
  },
});
