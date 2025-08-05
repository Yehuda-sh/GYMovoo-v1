// cspell:ignore גרדיאנט, מינימליסטי, כדורים, דמבל, מוטיבציה, טיימר/**
/* @file src/screens/workout/components/WorkoutStatusBar.tsx
 * @description רכיב משולב המציג טיימר מנוחה או התרגיל הבא בהתאם למצב
 * English: Combined component showing rest timer or next exercise based on workout state
 *
 * @features
 * - ✅ Rest timer with add/subtract time controls
 * - ✅ Next exercise preview with skip functionality
 * - ✅ Multiple variants: default, minimal, floating
 * - ✅ Optimized with React.memo and useCallback
 * - ✅ Centralized helper functions (formatTime, triggerVibration)
 * - ✅ Full RTL support and accessibility
 * - ✅ Smooth animations with cleanup
 *
 * @performance
 * - React.memo for re-render prevention
 * - useCallback for stable function references
 * - Centralized animation configuration
 * - Proper cleanup in useEffect
 *
 * @accessibility
 * - Screen reader support with proper labels
 * - Clear button roles and hints
 * - RTL text alignment and layout
 *
 * @updated 2025-08-02 - Code optimization and helper functions integration
 */

import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";
import {
  formatTime,
  triggerVibration,
  animationConfig,
} from "../../../utils/workoutHelpers";
import { workoutLogger } from "../../../utils/workoutLogger";
import { SkipButton } from "./shared/SkipButton";
import { TimeButton } from "./shared/TimeButton";
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

    // אופטימיזציה של כפתורי זמן עם useCallback ולוגים
    const handleAddTime = useCallback(() => {
      workoutLogger.info("WorkoutStatusBar", "הוספת 10 שניות לטיימר מנוחה");
      handleVibrate();
      onAddRestTime?.(10);
    }, [onAddRestTime, handleVibrate]);

    const handleSubtractTime = useCallback(() => {
      workoutLogger.info("WorkoutStatusBar", "הפחתת 10 שניות מטיימר מנוחה");
      handleVibrate();
      onSubtractRestTime?.(10);
    }, [onSubtractRestTime, handleVibrate]);

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
    }, [shouldShow, isRestActive, onSkipRest, onSkipToNext, variant]);

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
              {/* כפתור -10 שניות | -10 seconds button */}
              {onSubtractRestTime && (
                <TimeButton
                  onPress={handleSubtractTime}
                  text="-10"
                  color={theme.colors.error}
                  accessibilityLabel="הפחת 10 שניות מהטיימר"
                />
              )}

              {/* טיימר מרכזי | Central timer */}
              <View style={styles.timerContainer}>
                <MaterialCommunityIcons
                  name="timer-sand"
                  size={20}
                  color={theme.colors.success}
                />
                <Text style={styles.timerText}>{formatTime(restTimeLeft)}</Text>
                <Text style={styles.timerLabel}>מנוחה</Text>
              </View>

              {/* כפתור +10 שניות | +10 seconds button */}
              {onAddRestTime && (
                <TimeButton
                  onPress={handleAddTime}
                  text="+10"
                  color={theme.colors.success}
                  accessibilityLabel="הוסף 10 שניות לטיימר"
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

  // טיימר מנוחה | Rest timer styles
  timerContainer: {
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.success,
    textAlign: "center",
  },
  timerLabel: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: "500",
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
