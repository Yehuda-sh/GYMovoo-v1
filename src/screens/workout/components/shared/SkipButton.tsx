/**
 * @file src/screens/workout/components/shared/SkipButton.tsx
 * @brief רכיב כפתור דילוג משותף
 * @description מונע כפילויות בין WorkoutStatusBar, RestTimer ו-NextExerciseBar
 */

import React from "react";
import { TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../styles/theme";

interface SkipButtonProps {
  onPress: () => void;
  icon: string;
  colors: [string, string, ...string[]];
  size?: number;
  accessibilityLabel: string;
  pulseAnimation?: Animated.Value;
  style?: any;
  iconColor?: string;
}

export const SkipButton: React.FC<SkipButtonProps> = React.memo(
  ({
    onPress,
    icon,
    colors,
    size = 20,
    accessibilityLabel,
    pulseAnimation,
    style,
    iconColor = "white",
  }) => {
    const ButtonWrapper = pulseAnimation ? Animated.View : React.Fragment;
    const wrapperProps = pulseAnimation
      ? { style: { transform: [{ scale: pulseAnimation }] } }
      : {};

    return (
      <ButtonWrapper {...wrapperProps}>
        <TouchableOpacity
          style={[
            {
              borderRadius: theme.radius.xl,
              overflow: "hidden",
              borderWidth: 2,
              borderColor: theme.colors.primary + "30",
              ...theme.shadows.medium,
            },
            style,
          ]}
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
        >
          <LinearGradient
            colors={colors}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              minWidth: 50,
            }}
          >
            <MaterialCommunityIcons
              name={icon as any}
              size={size}
              color={iconColor}
            />
          </LinearGradient>
        </TouchableOpacity>
      </ButtonWrapper>
    );
  }
);
