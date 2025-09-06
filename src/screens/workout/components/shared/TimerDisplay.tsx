/**
 * @file src/screens/workout/components/shared/TimerDisplay.tsx
 * @brief תצוגת טיימר מאוחדת עם אנימציות
 * @version 1.0.0
 * @description
 * רכיב תצוגת טיימר מאוחד התומך במצבים שונים
 * @features
 * - 2 גדלים: compact, full
 * - אנימציות אוטומטיות בספירה לאחור
 * - התראות ויזואליות
 * - תמיכה במצב השהיה
 * - נגישות מלאה עם תמיכה בעברית
 */

import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../styles/theme";
import { formatWorkoutTime } from "../../../../utils";

type TimerSize = "compact" | "full";

export interface TimerDisplayProps {
  timeLeft: number;
  size?: TimerSize;
  onPress?: () => void;
  isPaused?: boolean;
  label?: string;
  pulseAnimation?: Animated.Value;
  countdownAnimation?: Animated.Value;
  urgentThreshold?: number;
  testID?: string;
  accessibilityHint?: string;
  containerStyle?: StyleProp<ViewStyle>;
  timeStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const SIZE_CONFIG = {
  compact: {
    textStyle: { fontSize: 32, fontWeight: "800" as const, letterSpacing: 0.5 },
    labelStyle: { fontSize: 13, marginTop: 4, fontWeight: "600" as const },
    containerStyle: { alignItems: "center" as const, flex: 1 },
  },
  full: {
    textStyle: {
      fontSize: 72,
      fontWeight: "900" as const,
      letterSpacing: -4,
      textShadowColor: "rgba(0,0,0,0.4)",
      textShadowOffset: { width: 0, height: 3 },
      textShadowRadius: 8,
    },
    labelStyle: { fontSize: 18, marginTop: 12, fontWeight: "600" as const },
    containerStyle: { alignItems: "center" as const },
  },
} as const;

export const TimerDisplay: React.FC<TimerDisplayProps> = React.memo(
  ({
    timeLeft,
    size = "full",
    onPress,
    isPaused = false,
    label = "זמן מנוחה",
    pulseAnimation,
    countdownAnimation,
    urgentThreshold = 5,
    testID,
    accessibilityHint,
    containerStyle,
    timeStyle,
    labelStyle,
  }) => {
    const config = SIZE_CONFIG[size];
    const isUrgent = timeLeft <= urgentThreshold;
    const textColor = isUrgent ? theme.colors.error : theme.colors.text;

    const formattedTime = useMemo(() => {
      return formatWorkoutTime(timeLeft);
    }, [timeLeft]);

    const handlePress = useCallback(() => {
      onPress?.();
    }, [onPress]);

    const animatedStyle = useMemo(() => {
      const transforms = [
        ...(pulseAnimation ? [{ scale: pulseAnimation }] : []),
        ...(countdownAnimation ? [{ scale: countdownAnimation }] : []),
      ];
      return transforms.length ? { transform: transforms } : undefined;
    }, [pulseAnimation, countdownAnimation]);

    const accessibilityLabel = `${label}: ${isPaused ? "מושהה, " : ""}נותרו ${timeLeft} שניות${isUrgent ? ", זמן אזהרה" : ""}`;

    if (size === "compact") {
      return (
        <View
          style={[config.containerStyle, containerStyle]}
          accessible
          accessibilityRole="text"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          testID={testID || "TimerDisplay-compact"}
        >
          <Text
            style={[
              config.textStyle,
              {
                color: textColor,
                fontVariant: ["tabular-nums"],
              },
              timeStyle,
            ]}
          >
            {formattedTime}
          </Text>
          <Text
            style={[
              config.labelStyle,
              { color: theme.colors.textSecondary },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      );
    }

    return (
      <Animated.View
        style={[config.containerStyle, animatedStyle, containerStyle]}
        accessible
        accessibilityRole="text"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled: false,
          busy: !isPaused && timeLeft > 0,
          selected: isUrgent,
        }}
        testID={testID || "TimerDisplay-full"}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.6}
          hitSlop={14}
          disabled={!onPress}
          accessible={!!onPress}
          accessibilityRole={onPress ? "button" : undefined}
          accessibilityLabel={
            onPress ? `${isPaused ? "הפעל" : "השהה"} טיימר` : undefined
          }
          testID={testID ? `${testID}-touch` : "TimerDisplayTouch"}
        >
          <View style={styles.timerContainer}>
            <View
              style={[styles.timerCircle, isUrgent && styles.timerCircleUrgent]}
              accessible={false}
            >
              <LinearGradient
                colors={
                  isUrgent
                    ? [theme.colors.error + "20", theme.colors.error + "10"]
                    : [theme.colors.primary + "20", theme.colors.primary + "10"]
                }
                style={StyleSheet.absoluteFillObject}
              />
            </View>

            <Text
              style={[
                config.textStyle,
                {
                  color: textColor,
                  fontVariant: ["tabular-nums"],
                },
                timeStyle,
              ]}
              accessible={false}
            >
              {formattedTime}
            </Text>

            {isPaused && (
              <View style={styles.pauseOverlay} accessible={false}>
                <Ionicons
                  name="play-circle"
                  size={48}
                  color={theme.colors.white}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  timerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  timerCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: "hidden",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: `${theme.colors.primary}20`,
  },
  timerCircleUrgent: {
    borderColor: `${theme.colors.error}30`,
    shadowColor: theme.colors.error,
    shadowOpacity: 0.3,
  },
  pauseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${theme.colors.background}F0`,
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});

TimerDisplay.displayName = "TimerDisplay";
