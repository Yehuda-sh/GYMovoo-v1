/**
 * @file src/screens/workout/components/shared/TimerDisplay.tsx
 * @brief תצוגת טיימר מאוחדת עם אנימציות
 * @version 1.0.0
 * @author GYMovoo Development Team
 * @created 2025-08-05
 *
 * @description
 * רכיב תצוגת טיימר מאוחד התומך במצבים שונים
 * עם אנימציות אוטומטיות ועיצוב מותאם
 *
 * @features
 * - ✅ 2 גדלים: compact, full
 * - ✅ אנימציות אוטומטיות בספירה לאחור
 * - ✅ התראות ויזואליות
 * - ✅ תמיכה במצב השהיה
 * - ✅ נגישות מלאה
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../styles/theme";
import { formatTime } from "../../../../utils";

type TimerSize = "compact" | "full";

export interface TimerDisplayProps {
  timeLeft: number;
  size?: TimerSize;
  onPress?: () => void;
  isPaused?: boolean;
  label?: string;
  pulseAnimation?: Animated.Value;
  countdownAnimation?: Animated.Value;
  urgentThreshold?: number; // ערך סף להתראה אדומה
  reducedMotion?: boolean; // ביטול אנימציות
  testID?: string;
}

const SIZE_CONFIG = {
  compact: {
    textStyle: { fontSize: 28, fontWeight: "700" as const },
    labelStyle: { fontSize: 12, marginTop: 2 },
    containerStyle: { alignItems: "center" as const, flex: 1 },
  },
  full: {
    textStyle: {
      fontSize: 64,
      fontWeight: "700" as const,
      letterSpacing: -3,
      textShadowColor: "rgba(0,0,0,0.3)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    },
    labelStyle: { fontSize: 16, marginTop: 8 },
    containerStyle: { alignItems: "center" as const },
  },
} as const;

const DEBUG = process.env.EXPO_PUBLIC_DEBUG_TIMER === "1";
const dlog = (m: string, data?: unknown) => {
  if (DEBUG) console.warn(`⏲️ TimerDisplay: ${m}`, data || "");
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  size = "full",
  onPress,
  isPaused = false,
  label = "זמן מנוחה",
  pulseAnimation,
  countdownAnimation,
  urgentThreshold = 5,
  reducedMotion = false,
  testID,
}) => {
  const config = SIZE_CONFIG[size];
  const isUrgent = timeLeft <= urgentThreshold;
  const textColor = isUrgent ? theme.colors.error : theme.colors.text;

  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft]);

  if (DEBUG) {
    dlog("render", { timeLeft, size, isPaused, isUrgent });
  }

  // Full size with animations and circle background (hooks above ensure order)
  const animatedStyle = useMemo(() => {
    if (reducedMotion) return undefined;
    const transforms = [
      ...(pulseAnimation ? [{ scale: pulseAnimation }] : []),
      ...(countdownAnimation ? [{ scale: countdownAnimation }] : []),
    ];
    return transforms.length ? { transform: transforms } : undefined;
  }, [pulseAnimation, countdownAnimation, reducedMotion]);

  if (size === "compact") {
    return (
      <View
        style={config.containerStyle}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${label}: נותרו ${timeLeft} שניות`}
        testID={testID || "TimerDisplay-compact"}
      >
        <Text
          style={[
            config.textStyle,
            {
              color: textColor,
              fontVariant: ["tabular-nums"],
            },
          ]}
        >
          {formattedTime}
        </Text>
        <Text
          style={[config.labelStyle, { color: theme.colors.textSecondary }]}
        >
          {label}
        </Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[config.containerStyle, animatedStyle]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${isPaused ? "מושהה, " : ""}נותרו ${timeLeft} שניות`}
      accessibilityState={{ disabled: false, busy: false }}
      testID={testID || "TimerDisplay-full"}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        disabled={!onPress}
      >
        <View style={styles.timerContainer}>
          {/* רקע מעגלי לטיימר */}
          <View style={styles.timerCircle}>
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
            ]}
          >
            {formattedTime}
          </Text>

          {isPaused && (
            <View style={styles.pauseOverlay}>
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
};

const styles = StyleSheet.create({
  timerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  timerCircle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
  },
  pauseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${theme.colors.background}E6`,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
});
