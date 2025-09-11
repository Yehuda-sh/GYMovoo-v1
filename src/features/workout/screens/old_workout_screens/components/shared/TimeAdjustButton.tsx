/**
 * @file src/screens/workout/components/shared/TimeAdjustButton.tsx
 * @brief כפתור התאמת זמן מאוחד לטיימר מנוחה
 * @version 1.0.0
 * @description
 * רכיב כפתור מאוחד להוספה והפחתה של זמן מטיימר מנוחה
 * @features
 * - 2 מצבים: compact, full
 * - תמיכה בהוספה והפחתה
 * - גרדיאנטים אוטומטיים
 * - נגישות מלאה
 */

import React, { useCallback } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";

type ButtonType = "add" | "subtract";
type ButtonSize = "compact" | "full";

export interface TimeAdjustButtonProps {
  type: ButtonType;
  size?: ButtonSize;
  seconds?: number;
  onPress: (seconds: number) => void;
  onLongPress?: (seconds: number) => void;
  disabled?: boolean;
  haptic?: boolean;
  gradientOverride?: [string, string, ...string[]];
  testID?: string;
}

const BUTTON_CONFIG = {
  add: {
    icon: "add-circle" as const,
    color: theme.colors.success,
    text: "+",
    accessibilityAction: "הוסף",
  },
  subtract: {
    icon: "remove-circle" as const,
    color: theme.colors.warning,
    text: "-",
    accessibilityAction: "הפחת",
  },
} as const;

const SIZE_CONFIG = {
  compact: {
    containerStyle: { marginHorizontal: 8 },
    buttonStyle: {
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 10,
      minWidth: 48,
    },
    textStyle: { fontSize: 15, fontWeight: "700" as const },
    iconSize: 0,
  },
  full: {
    containerStyle: {},
    buttonStyle: {
      borderRadius: 28,
      overflow: "hidden" as const,
      minWidth: 88,
      minHeight: 88,
    },
    textStyle: { fontSize: 17, fontWeight: "800" as const, marginTop: 6 },
    iconSize: 36,
  },
} as const;

const DEBUG = process.env.EXPO_PUBLIC_DEBUG_TIMEADJUST === "1";

export const TimeAdjustButton: React.FC<TimeAdjustButtonProps> = React.memo(
  ({
    type,
    size = "full",
    seconds = 10,
    onPress,
    onLongPress,
    disabled = false,
    haptic = false,
    gradientOverride,
    testID,
  }) => {
    const config = BUTTON_CONFIG[type];
    const sizeConfig = SIZE_CONFIG[size];
    const value = type === "add" ? seconds : -seconds;
    const accessibilityLabel = `${config.accessibilityAction} ${seconds} שניות ${type === "add" ? "לטיימר" : "מהטיימר"}`;
    const gradientColors = gradientOverride || [
      config.color + "30",
      config.color + "10",
    ];

    const handlePress = useCallback(() => {
      if (disabled) return;
      if (haptic) triggerVibration("short");
      if (DEBUG) console.warn(`⏱️ TimeAdjustButton: press`, { value });
      onPress(value);
    }, [disabled, haptic, onPress, value]);

    const handleLongPress = useCallback(() => {
      if (disabled) return;
      if (haptic) triggerVibration("short");
      if (DEBUG) console.warn(`⏱️ TimeAdjustButton: longPress`, { value });
      onLongPress?.(value);
    }, [disabled, haptic, onLongPress, value]);

    if (size === "compact") {
      return (
        <TouchableOpacity
          onPress={handlePress}
          onLongPress={handleLongPress}
          style={[sizeConfig.containerStyle]}
          activeOpacity={0.6}
          hitSlop={12}
          disabled={disabled}
          accessible
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{ text: `${seconds} שניות` }}
          testID={testID || "TimeAdjustButton-compact"}
        >
          <View
            style={[
              sizeConfig.buttonStyle,
              styles.compactInner,
              { backgroundColor: config.color + "20" },
              disabled && styles.disabled,
            ]}
          >
            <Text style={[sizeConfig.textStyle, { color: config.color }]}>
              {config.text}
              {seconds}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    // full size
    return (
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={[
          sizeConfig.buttonStyle,
          { ...theme.shadows.medium },
          disabled && styles.disabled,
        ]}
        activeOpacity={0.6}
        hitSlop={12}
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: `${seconds} שניות` }}
        testID={testID || "TimeAdjustButton-full"}
      >
        <LinearGradient
          colors={gradientColors}
          style={[sizeConfig.buttonStyle, styles.fullGradientInner]}
        >
          {sizeConfig.iconSize > 0 && (
            <Ionicons
              name={config.icon}
              size={sizeConfig.iconSize}
              color={config.color}
            />
          )}
          <Text style={[sizeConfig.textStyle, { color: config.color }]}>
            {config.text}
            {seconds}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  fullGradientInner: {
    alignItems: "center",
    justifyContent: "center",
    width: 88,
    height: 88,
    padding: 18,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  compactInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
    shadowOpacity: 0.05,
    elevation: 1,
  },
});

TimeAdjustButton.displayName = "TimeAdjustButton";
