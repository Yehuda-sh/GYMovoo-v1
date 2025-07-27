/**
 * @file src/screens/workout/components/RestTimerCompact.tsx
 * @description טיימר מנוחה קומפקטי ומינימליסטי
 * English: Compact and minimalist rest timer
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";

interface RestTimerCompactProps {
  timeLeft: number;
  isPaused: boolean;
  onPause: () => void;
  onSkip: () => void;
  onAddTime: (seconds: number) => void;
  onSubtractTime: (seconds: number) => void;
}

export const RestTimerCompact: React.FC<RestTimerCompactProps> = ({
  timeLeft,
  isPaused,
  onPause,
  onSkip,
  onAddTime,
  onSubtractTime,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // אנימציית כניסה
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  // אנימציית פעימה כשנותרו פחות מ-10 שניות
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0 && !isPaused) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeLeft, isPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.compactCard}>
        <LinearGradient
          colors={[`${theme.colors.card}F8`, `${theme.colors.background}F0`]}
          style={styles.gradientBackground}
        >
          <View style={styles.compactContent}>
            {/* כפתור הפחתת זמן */}
            <TouchableOpacity
              onPress={() => onSubtractTime(10)}
              style={styles.compactTimeButton}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.compactButtonBg,
                  { backgroundColor: theme.colors.warning + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.compactButtonText,
                    { color: theme.colors.warning },
                  ]}
                >
                  -10
                </Text>
              </View>
            </TouchableOpacity>

            {/* טיימר מרכזי קומפקטי */}
            <TouchableOpacity
              onPress={onPause}
              style={styles.compactTimerWrapper}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.compactTimerText,
                  timeLeft <= 10 && { color: theme.colors.error },
                ]}
              >
                {formatTime(timeLeft)}
              </Text>
              <Text style={styles.compactTimerLabel}>
                {isPaused ? "הושהה" : "זמן מנוחה"}
              </Text>
            </TouchableOpacity>

            {/* כפתור הוספת זמן */}
            <TouchableOpacity
              onPress={() => onAddTime(10)}
              style={styles.compactTimeButton}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.compactButtonBg,
                  { backgroundColor: theme.colors.success + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.compactButtonText,
                    { color: theme.colors.success },
                  ]}
                >
                  +10
                </Text>
              </View>
            </TouchableOpacity>

            {/* כפתור דילוג */}
            <TouchableOpacity
              onPress={onSkip}
              style={styles.compactSkipButton}
              activeOpacity={0.7}
            >
              <Text style={styles.compactSkipText}>דלג</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  compactCard: {
    borderRadius: 16,
    overflow: "hidden",
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}15`,
  },
  gradientBackground: {
    borderRadius: 16,
  },
  compactContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  compactTimerWrapper: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
  },
  compactTimerText: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
    letterSpacing: -1,
  },
  compactTimerLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  compactTimeButton: {
    marginHorizontal: 4,
  },
  compactButtonBg: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 44,
    alignItems: "center",
  },
  compactButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  compactSkipButton: {
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  compactSkipText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
});
