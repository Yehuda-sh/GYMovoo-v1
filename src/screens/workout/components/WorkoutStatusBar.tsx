// cspell:ignore גרדיאנט, מינימליסטי, כדורים, דמבל, מוטיבציה, טיימר/**
/* @file src/screens/workout/components/WorkoutStatusBar.tsx
 * @description רכיב משולב המציג טיימר מנוחה או התרגיל הבא בהתאם למצב
 * English: Combined component showing rest timer or next exercise based on workout state
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";
import { Exercise } from "../types/workout.types";

interface WorkoutStatusBarProps {
  // Rest Timer Props
  isRestActive: boolean;
  restTimeLeft?: number;
  onAddRestTime?: (seconds: number) => void;
  onSubtractRestTime?: (seconds: number) => void;
  onSkipRest?: () => void;

  // Next Exercise Props
  nextExercise?: Exercise | null;
  onSkipToNext?: () => void;

  // Common Props
}

// פורמט זמן | Format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const WorkoutStatusBar: React.FC<WorkoutStatusBarProps> = ({
  isRestActive,
  restTimeLeft = 0,
  onAddRestTime,
  onSubtractRestTime,
  onSkipRest,
  nextExercise,
  onSkipToNext,
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  // קביעת מה להציג | Determine what to show
  const shouldShow = isRestActive || (nextExercise && !isRestActive);

  useEffect(() => {
    // אנימציית כניסה/יציאה | Entry/exit animation
    Animated.spring(slideAnim, {
      toValue: shouldShow ? 0 : 100,
      friction: 10,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // אנימציית פעימה לכפתור פעיל | Pulse animation for active button
    const hasActiveButton =
      (isRestActive && onSkipRest) || (!isRestActive && onSkipToNext);

    if (shouldShow && hasActiveButton) {
      pulseAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
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
  }, [shouldShow, isRestActive, onSkipRest, onSkipToNext]);

  if (!shouldShow) {
    return null;
  }

  const handleVibrate = () => {
    if (Platform.OS !== "web") {
      Vibration.vibrate(50);
    }
  };

  // מצב טיימר מנוחה | Rest timer mode
  if (isRestActive) {
    return (
      <Animated.View
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      >
        <LinearGradient
          colors={[
            theme.colors.success + "25", // ירוק לטיימר | Green for timer
            theme.colors.success + "15", // גרדיאנט ירוק | Green gradient
            theme.colors.card + "F0",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.content}>
            {/* כפתור -10 שניות | -10 seconds button */}
            {onSubtractRestTime && (
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  handleVibrate();
                  onSubtractRestTime(10);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.timeButtonText}>-10</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  handleVibrate();
                  onAddRestTime(10);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.timeButtonText}>+10</Text>
              </TouchableOpacity>
            )}

            {/* כפתור דילוג | Skip button */}
            {onSkipRest && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => {
                    handleVibrate();
                    onSkipRest();
                  }}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[theme.colors.success, theme.colors.success + "DD"]} // גרדיאנט ירוק | Green gradient
                    style={styles.skipButtonInner}
                  >
                    <MaterialCommunityIcons
                      name="skip-forward"
                      size={20}
                      color="white"
                    />
                  </LinearGradient>
                </TouchableOpacity>
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
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      >
        <LinearGradient
          colors={[
            theme.colors.primary + "25", // כחול לתרגיל הבא | Blue for next exercise
            theme.colors.primaryGradientEnd + "25",
            theme.colors.card + "F0",
          ]}
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
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => {
                    handleVibrate();
                    onSkipToNext();
                  }}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primary + "DD"]} // גרדיאנט כחול | Blue gradient
                    style={styles.skipButtonInner}
                  >
                    <MaterialCommunityIcons
                      name="play-circle"
                      size={24}
                      color="white"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    zIndex: 100,
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
  timeButton: {
    backgroundColor: theme.colors.success + "20",
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.success + "40",
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.success,
  },
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

  // כפתור משותף | Shared button styles
  skipButton: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
    ...theme.shadows.medium,
  },
  skipButtonInner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
});
