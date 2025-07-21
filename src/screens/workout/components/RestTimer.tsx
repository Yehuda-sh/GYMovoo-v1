/**
 * @file src/screens/workout/components/RestTimer.tsx
 * @description קומפוננטת טיימר מנוחה עם עיצוב משופר
 * English: Rest timer component with a redesigned UI
 */

import React, { useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import { Exercise } from "../types/workout.types";

interface RestTimerProps {
  timeLeft: number;
  progress: number; // A value between 0 and 1
  isPaused: boolean; // New prop to show play/pause icon
  nextExercise?: Exercise | null;
  onPause: () => void;
  onSkip: () => void;
  onAddTime: (seconds: number) => void;
  onSubtractTime: (seconds: number) => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  timeLeft,
  progress,
  isPaused,
  nextExercise,
  onPause,
  onSkip,
  onAddTime,
  onSubtractTime,
}) => {
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // אנימציית כניסה
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  // אנימציית התקדמות
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000, // Match the timer interval
      useNativeDriver: false, // width animation not supported by native driver
    }).start();
  }, [progress]);

  // אנימציית פעימה עם פונקציית ניקוי
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation | null = null;
    if (timeLeft > 0 && timeLeft <= 5 && !isPaused) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    }
    return () => {
      pulseAnimation?.stop();
      pulseAnim.setValue(1);
    };
  }, [timeLeft, isPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const nextSetInfo = useMemo(() => {
    if (!nextExercise) return null;
    const nextSet = nextExercise.sets.find((s) => !s.completed);
    if (!nextSet) return null;
    return `${nextExercise.name} - ${
      nextSet.targetWeight || nextSet.previousWeight || 0
    }ק"ג × ${nextSet.targetReps || nextSet.previousReps || 0}`;
  }, [nextExercise]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <LinearGradient
        colors={[`${theme.colors.card}F2`, `${theme.colors.background}F2`]}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <Text style={styles.title}>⏱️ זמן מנוחה</Text>
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>דלג</Text>
            <Ionicons
              name="play-skip-forward"
              size={18}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <TouchableOpacity
            onPress={() => onSubtractTime(15)}
            style={styles.timeButton}
          >
            <Ionicons name="remove" size={24} color={theme.colors.text} />
            <Text style={styles.timeButtonText}>-15</Text>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.timerContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <TouchableOpacity onPress={onPause}>
              <Text
                style={[
                  styles.timerText,
                  timeLeft <= 5 && styles.timerTextUrgent,
                ]}
              >
                {formatTime(timeLeft)}
              </Text>
              {isPaused && (
                <View style={styles.pauseIconContainer}>
                  <Ionicons
                    name={"play"}
                    size={24}
                    color={`${theme.colors.white}99`}
                  />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            onPress={() => onAddTime(15)}
            style={styles.timeButton}
          >
            <Ionicons name="add" size={24} color={theme.colors.text} />
            <Text style={styles.timeButtonText}>+15</Text>
          </TouchableOpacity>
        </View>

        {nextSetInfo && (
          <View style={styles.nextSetInfo}>
            <Text style={styles.nextSetLabel}>הסט הבא:</Text>
            <Text style={styles.nextSetDetails} numberOfLines={1}>
              {nextSetInfo}
            </Text>
          </View>
        )}

        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
    borderRadius: 20,
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}40`,
  },
  gradientBackground: {
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 16,
    gap: 4,
  },
  skipText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  timerContainer: {
    alignItems: "center",
  },
  timerText: {
    fontSize: 64,
    fontWeight: "bold",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
  },
  timerTextUrgent: {
    color: theme.colors.error,
  },
  pauseIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080", // תיקון: שימוש בצבע שחור חצי-שקוף
  },
  timeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${theme.colors.primary}20`,
  },
  timeButtonText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  nextSetInfo: {
    marginHorizontal: 20,
    backgroundColor: `${theme.colors.primary}15`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  nextSetLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  nextSetDetails: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  progressBar: {
    height: 6,
    backgroundColor: `${theme.colors.primary}20`,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
});
