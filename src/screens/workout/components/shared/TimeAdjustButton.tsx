/**
 * @file src/screens/workout/components/shared/TimeAdjustButton.tsx
 * @brief כפתור התאמת זמן מאוחד לטיימר מנוחה
 * @version 1.0.0
 * @author GYMovoo Development Team
 * @created 2025-08-05
 *
 * @description
 * רכיב כפתור מאוחד להוספה והפחתה של זמן מטיימר מנוחה
 * תומך בגדלים ועיצובים שונים עם גרדיאנטים
 *
 * @features
 * - ✅ 2 מצבים: compact, full
 * - ✅ תמיכה בהוספה והפחתה
 * - ✅ גרדיאנטים אוטומטיים
 * - ✅ נגישות מלאה
 * - ✅ אייקונים מותאמים
 */

import React, { useCallback, useMemo } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";

type ButtonType = "add" | "subtract";
type ButtonSize = "compact" | "full";

interface TimeAdjustButtonProps {
  type: ButtonType;
  size?: ButtonSize;
  seconds?: number;
  onPress: (seconds: number) => void;
  disabled?: boolean;
  haptic?: boolean; // רטט בעת לחיצה
  gradientOverride?: [string, string, ...string[]]; // צבעים מותאמים
  reducedMotion?: boolean; // ביטול אפקטים עתידיים
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
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 40,
    },
    textStyle: { fontSize: 14, fontWeight: "600" as const },
    iconSize: 0, // אין אייקון במצב compact
    useGradient: false,
  },
  full: {
    containerStyle: {},
    buttonStyle: {
      borderRadius: 24,
      overflow: "hidden" as const,
      minWidth: 80,
      minHeight: 80,
    },
    textStyle: { fontSize: 16, fontWeight: "700" as const, marginTop: 4 },
    iconSize: 32,
    useGradient: true,
  },
} as const;

const DEBUG = process.env.EXPO_PUBLIC_DEBUG_TIMEADJUST === "1";
const dlog = (m: string, data?: unknown) => {
  if (DEBUG) console.warn(`⏱️ TimeAdjustButton: ${m}`, data || "");
};

export const TimeAdjustButton: React.FC<TimeAdjustButtonProps> = React.memo(
  ({
    type,
    size = "full",
    seconds = 10,
    onPress,
    disabled = false,
    haptic = false,
    gradientOverride,
    reducedMotion = false,
    testID,
  }) => {
    const config = BUTTON_CONFIG[type];
    const sizeConfig = SIZE_CONFIG[size];

    const value = useMemo(
      () => (type === "add" ? seconds : -seconds),
      [type, seconds]
    );

    const accessibilityLabel = `${config.accessibilityAction} ${seconds} שניות ${type === "add" ? "לטיימר" : "מהטיימר"}`;

    const gradientColors = useMemo<readonly [string, string, ...string[]]>(
      () =>
        gradientOverride
          ? gradientOverride
          : [config.color + "30", config.color + "10"],
      [gradientOverride, config.color]
    );

    const handlePress = useCallback(() => {
      if (disabled) return;
      if (haptic) triggerVibration("short");
      dlog("press", { value });
      onPress(value);
    }, [disabled, haptic, onPress, value]);

    if (size === "compact") {
      return (
        <TouchableOpacity
          onPress={handlePress}
          style={[sizeConfig.containerStyle]}
          activeOpacity={0.7}
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
        style={[
          sizeConfig.buttonStyle,
          { ...theme.shadows.medium },
          disabled && styles.disabled,
        ]}
        activeOpacity={0.7}
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: `${seconds} שניות` }}
        testID={testID || "TimeAdjustButton-full"}
      >
        <LinearGradient
          colors={gradientColors}
          style={[
            sizeConfig.buttonStyle,
            styles.fullGradientInner,
            reducedMotion && styles.noTransition,
          ]}
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
    width: 80,
    height: 80,
    padding: 16,
  },
  noTransition: {
    // future: place holder for disabling animations (if applied)
  },
  compactInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

TimeAdjustButton.displayName = "TimeAdjustButton";
