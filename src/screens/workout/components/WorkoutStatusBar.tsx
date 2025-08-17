// cspell:ignore גרדיאנט, מינימליסטי, כדורים, דמבל, מוטיבציה, טיימר
/**
 * @file src/screens/workout/components/WorkoutStatusBar.tsx
 * @description רכיב משולב המציג טיימר מנוחה או התרגיל הבא בהתאם למצב - רכיב מתקדם משופר
 * @description English: Combined component showing rest timer or next exercise based on workout state - Enhanced advanced component
 *
 * ✅ ACTIVE & WELL-OPTIMIZED: רכיב מתקדם ומאופטם למצבי אימון שונים
 * - Advanced state-based component with dual functionality
 * - Performance optimized with React patterns and animation cleanup
 * - Modular architecture using shared components
 * - Multiple variants for different UI contexts
 * - Full integration with workout services and utilities
 *
 * @features
 * - ✅ Rest timer with add/subtract time controls (+/-10s)
 * - ✅ Next exercise preview with skip functionality
 * - ✅ Multiple variants: default, minimal, floating
 * - ✅ Optimized with React.memo and useCallback
 * - ✅ Centralized helper functions (formatTime, triggerVibration)
 * - ✅ Full RTL support and accessibility
 * - ✅ Smooth animations with proper cleanup
 * - ✅ Integrated logging system
 * - ✅ Haptic feedback on interactions
 *
 * @performance
 * - React.memo for re-render prevention
 * - useCallback for stable function references
 * - useRef for animation values persistence
 * - Centralized animation configuration
 * - Proper cleanup in useEffect
 * - Conditional rendering based on state
 *
 * @accessibility
 * - Screen reader support with proper labels
 * - Clear button roles and hints
 * - RTL text alignment and layout
 * - Descriptive accessibility labels
 *
 * @variants
 * - default: Bottom-positioned with full features
 * - minimal: Simplified version with reduced padding
 * - floating: Card-style floating above content
 *
 * @integrations
 * - SkipButton: כפתור דילוג משותף
 * - TimeAdjustButton: כפתורי הוספה/הפחתה של זמן
 * - TimerDisplay: תצוגת טיימר מאוחדת
 * - workoutLogger: מערכת לוגינג מותנית
 * - triggerVibration: משוב הפטי
 * - animationConfig: קונפיגורציות אנימציה מרכזיות
 *
 * @updated 2025-08-17 Enhanced documentation and status for audit completion
 */

import React, { useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";
import {
  triggerVibration,
  animationConfig,
  workoutLogger,
} from "../../../utils";
import { SkipButton } from "./shared/SkipButton";
import { TimeAdjustButton, TimerDisplay } from "./shared";
import { REST_ADJUST_STEP_SECONDS } from "../utils/workoutConstants";
import type { WorkoutStatusBarProps } from "./types";

export const WorkoutStatusBar: React.FC<WorkoutStatusBarProps> = React.memo(
  ({
    isRestActive,
    restTimeLeft = 0,
    onAddRestTime,
    onSubtractRestTime,
    onSkipRest,
    nextExercise,
    onSkipToNext,
    variant = "default",
  }) => {
    const slideAnim = useRef(new Animated.Value(100)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

    // קביעת מה להציג | Determine what to show
    const shouldShow = isRestActive || (nextExercise && !isRestActive);

    // קביעת סגנון לפי variant | Determine style by variant
    const getContainerStyle = useCallback(() => {
      const baseStyle = styles.container;
      switch (variant) {
        case "minimal":
          return [baseStyle, styles.containerMinimal];
        case "floating":
          return [baseStyle, styles.containerFloating];
        default:
          return baseStyle;
      }
    }, [variant]);

    const getGradientColors = useCallback(
      (isRest: boolean): [string, string, ...string[]] => {
        if (variant === "minimal") {
          return [theme.colors.card, theme.colors.card];
        }

        if (isRest) {
          return [
            theme.colors.success + "25",
            theme.colors.success + "15",
            theme.colors.card + "F0",
          ];
        } else {
          return [
            theme.colors.primary + "25",
            theme.colors.primaryGradientEnd + "25",
            theme.colors.card + "F0",
          ];
        }
      },
      [variant]
    );

    // אופטימיזציה של handleVibrate עם useCallback
    const handleVibrate = useCallback(() => {
      triggerVibration(50);
    }, []);

    // אופטימיזציה של כפתורי דילוג עם useCallback ולוגים
    const handleSkipRest = useCallback(() => {
      workoutLogger.info("WorkoutStatusBar", "דילוג על טיימר מנוחה");
      handleVibrate();
      onSkipRest?.();
    }, [onSkipRest, handleVibrate]);

    const handleSkipToNext = useCallback(() => {
      workoutLogger.info(
        "WorkoutStatusBar",
        `מעבר לתרגיל הבא: ${nextExercise?.name || "לא ידוע"}`
      );
      handleVibrate();
      onSkipToNext?.();
    }, [onSkipToNext, handleVibrate, nextExercise?.name]);

    useEffect(() => {
      // לוג שינוי מצב תצוגה
      if (shouldShow) {
        const mode = isRestActive ? "טיימר מנוחה" : "תרגיל הבא";
        workoutLogger.info("WorkoutStatusBar", `הצגת רכיב: ${mode}`);
      } else {
        workoutLogger.debug("WorkoutStatusBar", "הסתרת רכיב");
      }

      // אנימציית כניסה/יציאה משופרת | Enhanced entry/exit animation
      const springConfig = {
        ...animationConfig.spring,
        friction: variant === "floating" ? 8 : 10,
        tension: variant === "floating" ? 50 : 40,
      };

      Animated.spring(slideAnim, {
        toValue: shouldShow ? 0 : 100,
        ...springConfig,
      }).start();

      // אנימציית פעימה לכפתור פעיל | Pulse animation for active button
      const hasActiveButton =
        (isRestActive && onSkipRest) || (!isRestActive && onSkipToNext);

      if (shouldShow && hasActiveButton && variant !== "minimal") {
        const pulseConfig = {
          ...animationConfig.pulse,
          toValue: variant === "floating" ? 1.08 : 1.05,
        };

        pulseAnimationRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, pulseConfig),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        );
        pulseAnimationRef.current.start();
      } else {
        pulseAnimationRef.current?.stop();
        pulseAnim.setValue(1);
      }

      return () => {
        pulseAnimationRef.current?.stop();
      };
    }, [
      shouldShow,
      isRestActive,
      onSkipRest,
      onSkipToNext,
      variant,
      pulseAnim,
      slideAnim,
    ]);

    if (!shouldShow) {
      return null;
    }

    // מצב טיימר מנוחה | Rest timer mode
    if (isRestActive) {
      return (
        <Animated.View
          style={[
            getContainerStyle(),
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={getGradientColors(true)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.content}>
              {/* כפתור -10 שניות | Unified TimeAdjustButton subtract */}
              {onSubtractRestTime && (
                <TimeAdjustButton
                  type="subtract"
                  size="compact"
                  onPress={(value) => onSubtractRestTime?.(Math.abs(value))}
                  seconds={REST_ADJUST_STEP_SECONDS}
                  testID="WorkoutStatusBar-subtract"
                />
              )}

              {/* טיימר מרכזי מאוחד */}
              <View style={styles.timerWrapper}>
                <MaterialCommunityIcons
                  name="timer-sand"
                  size={20}
                  color={theme.colors.success}
                  style={styles.timerIcon}
                />
                <TimerDisplay
                  timeLeft={restTimeLeft}
                  size="compact"
                  label="מנוחה"
                  testID="WorkoutStatusBar-timer"
                />
              </View>

              {/* כפתור +10 שניות | Unified TimeAdjustButton add */}
              {onAddRestTime && (
                <TimeAdjustButton
                  type="add"
                  size="compact"
                  onPress={(value) => onAddRestTime?.(value)}
                  seconds={REST_ADJUST_STEP_SECONDS}
                  testID="WorkoutStatusBar-add"
                />
              )}

              {/* כפתור דילוג | Skip button */}
              {onSkipRest && (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <SkipButton
                    onPress={handleSkipRest}
                    icon="skip-forward"
                    colors={[theme.colors.success, theme.colors.success + "DD"]}
                    accessibilityLabel="דלג על זמן המנוחה"
                  />
                </Animated.View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      );
    }

    // מצב התרגיל הבא | Next exercise mode
    if (nextExercise) {
      return (
        <Animated.View
          style={[
            getContainerStyle(),
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={getGradientColors(false)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.content}>
              {/* מידע התרגיל | Exercise info */}
              <View style={styles.exerciseInfo}>
                <MaterialCommunityIcons
                  name="flash"
                  size={20}
                  color={theme.colors.warning}
                />
                <Text style={styles.exerciseLabel}>הבא בתור</Text>
              </View>

              {/* שם התרגיל | Exercise name */}
              <Text style={styles.exerciseName} numberOfLines={2}>
                {nextExercise.name}
              </Text>

              {/* כפתור מעבר | Skip button */}
              {onSkipToNext && (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <SkipButton
                    onPress={handleSkipToNext}
                    icon="play-circle"
                    colors={[theme.colors.primary, theme.colors.primary + "DD"]}
                    accessibilityLabel={`מעבר לתרגיל הבא: ${nextExercise.name}`}
                    size={24}
                  />
                </Animated.View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      );
    }

    return null;
  }
);

WorkoutStatusBar.displayName = "WorkoutStatusBar";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    zIndex: 100,
  },
  containerMinimal: {
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  containerFloating: {
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: theme.radius.xl,
    paddingBottom: 0,
  },
  gradientBackground: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
    borderBottomWidth: 0,
    ...theme.shadows.large,
    elevation: 8,
  },
  content: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },

  // Removed legacy inline timer styles after unifying with TimerDisplay
  timerWrapper: {
    alignItems: "center",
    flex: 1,
  },
  timerIcon: {
    marginBottom: 4,
  },

  // תרגיל הבא | Next exercise styles
  exerciseInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  exerciseLabel: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginHorizontal: 12,
  },
});
