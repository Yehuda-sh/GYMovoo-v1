/**
 * @file src/components/workout/FloatingActionButton.tsx
 * @brief ✨ כפתור פעולה צף מותאם לכושר מובייל - עם משוב מושגי ואופטימיזציות ביצועים
 * @dependencies React Native, Animated, Ionicons, expo-haptics, theme
 * @notes מיקום RTL, אנימציות חלקות, גדלים מרובים, haptic feedback, workout mode
 * @version 3.0 - Fitness mobile optimized with haptic feedback and performance tracking
 */

import React, { useRef, useEffect, useMemo, useCallback } from "react";
import {
  TouchableOpacity,
  Animated,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../styles/theme";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  visible?: boolean;
  bottom?: number;
  size?: "small" | "medium" | "large";
  color?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  // ✨ תכונות כושר מובייל חדשות
  workout?: boolean;
  intensity?: "light" | "medium" | "heavy";
  enableHaptic?: boolean;
  hitSlop?: number;
}

export default function FloatingActionButton({
  onPress,
  icon = "add",
  label,
  visible = true,
  bottom = 80,
  size = "medium",
  color = theme.colors.primary,
  accessibilityLabel,
  accessibilityHint,
  // ✨ ברירות מחדל לכושר מובייל
  workout = false,
  intensity = "medium",
  enableHaptic = true,
  hitSlop = 20,
}: FloatingActionButtonProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // ✨ Performance tracking לרכיבי כושר
  const renderStartTime = useMemo(() => performance.now(), []);

  // ✨ Haptic feedback מותאם לעוצמה
  const triggerHaptic = useCallback(() => {
    if (!enableHaptic) return;

    switch (intensity) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [enableHaptic, intensity]);

  // ✨ משוב ביצועים אוטומטי
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime;
    if (renderTime > 100) {
      console.warn(
        `⚠️ FloatingActionButton render time: ${renderTime.toFixed(2)}ms`
      );
    }
  }, [renderStartTime]);

  // ✨ Enhanced handlePress עם haptic feedback
  const handlePress = useCallback(() => {
    triggerHaptic();
    onPress();
  }, [triggerHaptic, onPress]);

  const currentSize = theme.components.floatingButtonSizes[size];

  // ✨ אימות גודל 44px לנגישות
  const validButtonSize = Math.max(currentSize.button, 44);
  const isWorkoutMode = workout;

  // ✨ ממדים מותאמים לאימון
  const workoutEnhancements = useMemo(() => {
    if (!isWorkoutMode) return {};

    return {
      minWidth: validButtonSize,
      minHeight: validButtonSize,
      transform: [{ scale: 1.1 }], // כפתור מוגדל יותר באימון
      shadowOpacity: 0.4, // צל חזק יותר
      elevation: 8,
    };
  }, [isWorkoutMode, validButtonSize]);

  // ✨ אנימציות פשוטות ויעילות - Simple and efficient animations
  useEffect(() => {
    const animation = visible
      ? Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      : Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);

    animation.start();
  }, [visible, scaleAnim, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { bottom, transform: [{ scale: scaleAnim }] }]}
    >
      {/* תווית אופציונלית - Optional label */}
      {label && (
        <Animated.View
          style={[
            styles.labelContainer,
            {
              opacity: scaleAnim,
              transform: [
                {
                  translateX: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.labelText}>{label}</Text>
        </Animated.View>
      )}

      {/* כפתור - Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isWorkoutMode ? theme.colors.primary : color,
            width: validButtonSize,
            height: validButtonSize,
            borderRadius: validButtonSize / 2,
            ...workoutEnhancements,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
        hitSlop={{
          top: hitSlop,
          bottom: hitSlop,
          left: hitSlop,
          right: hitSlop,
        }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label || `כפתור ${icon}`}
        accessibilityHint={
          accessibilityHint ||
          (isWorkoutMode ? "כפתור פעולה צף באימון" : "כפתור פעולה צף")
        }
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons
            name={icon}
            size={currentSize.icon}
            color="#fff"
            accessible={false}
          />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ✨ סגנונות פשוטים וברורים - Simple and clear styles
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: theme.spacing.lg, // RTL - צד שמאל
    flexDirection: "row-reverse",
    alignItems: "center",
    zIndex: 999,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
  },
  labelContainer: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
    writingDirection: "rtl",
  },
});
