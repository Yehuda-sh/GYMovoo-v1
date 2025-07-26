/**
 * @file src/screens/workout/components/RestTimer.tsx
 * @description קומפוננטת טיימר מנוחה עם עיצוב מתקדם ואנימציות משופרות
 * English: Rest timer component with advanced design and enhanced animations
 */

import React, { useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { theme } from "../../../styles/theme";
import { Exercise } from "../types/workout.types";

const { width: screenWidth } = Dimensions.get("window");

interface RestTimerProps {
  timeLeft: number;
  progress: number; // A value between 0 and 1
  isPaused: boolean;
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
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const countdownScaleAnim = useRef(new Animated.Value(1)).current;

  // אנימציית כניסה משופרת
  // Enhanced entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציית גלו מתמשכת
    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // אנימציית התקדמות
  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // אנימציית סיבוב לרקע הטיימר
  // Timer background rotation animation
  useEffect(() => {
    if (!isPaused) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 60000, // סיבוב איטי
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
    }
  }, [isPaused]);

  // אנימציית פעימה וספירה לאחור
  // Pulse and countdown animation
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation | null = null;

    if (timeLeft > 0 && timeLeft <= 5 && !isPaused) {
      // אנימציית ספירה לאחור דרמטית
      Animated.sequence([
        Animated.timing(countdownScaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(countdownScaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    }

    return () => {
      pulseAnimation?.stop();
      pulseAnim.setValue(1);
      countdownScaleAnim.setValue(1);
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
    return {
      name: nextExercise.name,
      weight: nextSet.targetWeight || 0,
      reps: nextSet.targetReps || 0,
    };
  }, [nextExercise]);
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      {/* רקע מטושטש */}
      {/* Blurred background */}
      {Platform.OS !== "web" && (
        <BlurView intensity={40} tint="dark" style={styles.blurBackground} />
      )}

      <View style={styles.mainCard}>
        {/* אפקט גלו */}
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
              transform: [{ scale: 1.1 }],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.primary + "40", theme.colors.primary + "00"]}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        {/* רקע מסתובב */}
        {/* Rotating background */}
        <Animated.View
          style={[
            styles.rotatingBackground,
            {
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart + "10",
              theme.colors.primaryGradientEnd + "05",
            ]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <LinearGradient
          colors={[`${theme.colors.card}F5`, `${theme.colors.background}F5`]}
          style={styles.gradientBackground}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name="timer-sand"
                size={20}
                color={theme.colors.primary}
                style={styles.titleIcon}
              />
              <Text style={styles.title}>זמן מנוחה</Text>
            </View>

            <TouchableOpacity
              onPress={onSkip}
              style={styles.skipButton}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[
                  theme.colors.primary + "30",
                  theme.colors.primary + "10",
                ]}
                style={styles.skipGradient}
              >
                <Ionicons
                  name="play-skip-forward"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={styles.skipText}>דלג</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
            {/* כפתור הוספת זמן */}
            {/* Add time button */}
            <TouchableOpacity
              onPress={() => onAddTime(15)}
              style={styles.timeButton}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[
                  theme.colors.success + "30",
                  theme.colors.success + "10",
                ]}
                style={styles.timeButtonGradient}
              >
                <Ionicons
                  name="add-circle"
                  size={32}
                  color={theme.colors.success}
                />
                <Text
                  style={[
                    styles.timeButtonText,
                    { color: theme.colors.success },
                  ]}
                >
                  +15
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* טיימר מרכזי */}
            {/* Central timer */}
            <Animated.View
              style={[
                styles.timerWrapper,
                {
                  transform: [
                    { scale: pulseAnim },
                    { scale: countdownScaleAnim },
                  ],
                },
              ]}
            >
              <TouchableOpacity onPress={onPause} activeOpacity={0.8}>
                <View style={styles.timerContainer}>
                  {/* רקע מעגלי לטיימר */}
                  {/* Circular timer background */}
                  <View style={styles.timerCircle}>
                    <LinearGradient
                      colors={
                        timeLeft <= 5
                          ? [
                              theme.colors.error + "20",
                              theme.colors.error + "10",
                            ]
                          : [
                              theme.colors.primary + "20",
                              theme.colors.primary + "10",
                            ]
                      }
                      style={StyleSheet.absoluteFillObject}
                    />
                  </View>

                  <Text
                    style={[
                      styles.timerText,
                      timeLeft <= 5 && styles.timerTextUrgent,
                    ]}
                  >
                    {formatTime(timeLeft)}
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

            {/* כפתור הפחתת זמן */}
            {/* Subtract time button */}
            <TouchableOpacity
              onPress={() => onSubtractTime(15)}
              style={styles.timeButton}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[
                  theme.colors.warning + "30",
                  theme.colors.warning + "10",
                ]}
                style={styles.timeButtonGradient}
              >
                <Ionicons
                  name="remove-circle"
                  size={32}
                  color={theme.colors.warning}
                />
                <Text
                  style={[
                    styles.timeButtonText,
                    { color: theme.colors.warning },
                  ]}
                >
                  -15
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* מידע על הסט הבא */}
          {/* Next set info */}
          {nextSetInfo && (
            <Animated.View
              style={[
                styles.nextSetInfo,
                {
                  opacity: progressAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.8, 0.6],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={[
                  theme.colors.primary + "15",
                  theme.colors.primary + "05",
                ]}
                style={styles.nextSetGradient}
              >
                <View style={styles.nextSetHeader}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.nextSetLabel}>הסט הבא</Text>
                </View>

                <Text style={styles.nextSetName}>{nextSetInfo.name}</Text>

                <View style={styles.nextSetStats}>
                  <View style={styles.nextSetStat}>
                    <MaterialCommunityIcons
                      name="weight-kilogram"
                      size={14}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.nextSetStatText}>
                      {nextSetInfo.weight} ק"ג
                    </Text>
                  </View>

                  <View style={styles.nextSetDivider} />

                  <View style={styles.nextSetStat}>
                    <MaterialCommunityIcons
                      name="repeat"
                      size={14}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.nextSetStatText}>
                      {nextSetInfo.reps} חזרות
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          )}

          {/* פס התקדמות משופר */}
          {/* Enhanced progress bar */}
          <View style={styles.progressContainer}>
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
              >
                <LinearGradient
                  colors={[
                    theme.colors.primaryGradientStart,
                    theme.colors.primaryGradientEnd,
                  ]}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>

            {/* נקודות ציון בהתקדמות */}
            {/* Progress milestones */}
            <View style={styles.progressMilestones}>
              {[25, 50, 75].map((milestone) => (
                <View
                  key={milestone}
                  style={[
                    styles.milestone,
                    { left: `${milestone}%` },
                    progress * 100 >= milestone && styles.milestoneActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </LinearGradient>
      </View>
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
  },
  blurBackground: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 24,
  },
  mainCard: {
    borderRadius: 24,
    overflow: "hidden",
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}30`,
  },
  glowEffect: {
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 40,
  },
  rotatingBackground: {
    position: "absolute",
    width: screenWidth * 2,
    height: screenWidth * 2,
    left: -(screenWidth * 0.5),
    top: -(screenWidth * 0.8),
  },
  gradientBackground: {
    borderRadius: 24,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  titleContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  titleIcon: {
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  skipButton: {
    borderRadius: 20,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  skipGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  skipText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  mainContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  timeButton: {
    borderRadius: 20,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  timeButtonGradient: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    padding: 12,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  timerWrapper: {
    alignItems: "center",
  },
  timerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  timerCircle: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
  },
  timerText: {
    fontSize: 56,
    fontWeight: "700",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
    letterSpacing: -2,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timerTextUrgent: {
    color: theme.colors.error,
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
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  nextSetInfo: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  nextSetGradient: {
    padding: 16,
  },
  nextSetHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  nextSetLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  nextSetName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "right",
  },
  nextSetStats: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  nextSetStat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  nextSetStatText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  nextSetDivider: {
    width: 1,
    height: 16,
    backgroundColor: theme.colors.divider,
  },
  progressContainer: {
    position: "relative",
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: `${theme.colors.primary}15`,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  progressMilestones: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  milestone: {
    position: "absolute",
    width: 2,
    height: 8,
    backgroundColor: `${theme.colors.primary}30`,
    transform: [{ translateX: -1 }],
  },
  milestoneActive: {
    backgroundColor: theme.colors.white,
  },
});
