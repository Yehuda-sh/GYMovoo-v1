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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  // אנימציות מאופטמות - קיבוץ ערכי useRef
  const animValues = useRef({
    slide: new Animated.Value(0), // מתחיל מ-0 במקום -300
    pulse: new Animated.Value(1),
    progress: new Animated.Value(0),
    glow: new Animated.Value(0),
    rotate: new Animated.Value(0),
    scale: new Animated.Value(0.9),
    countdownScale: new Animated.Value(1),
  }).current;

  // אנימציית כניסה משופרת
  // Enhanced entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(animValues.slide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(animValues.scale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציית גלו מתמשכת
    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValues.glow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animValues.glow, {
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
    Animated.timing(animValues.progress, {
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
        Animated.timing(animValues.rotate, {
          toValue: 1,
          duration: 60000, // סיבוב איטי
          useNativeDriver: true,
        })
      ).start();
    } else {
      animValues.rotate.stopAnimation();
    }
  }, [isPaused]);

  // אנימציית פעימה וספירה לאחור
  // Pulse and countdown animation
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation | null = null;

    if (timeLeft > 0 && timeLeft <= 5 && !isPaused) {
      // אנימציית ספירה לאחור דרמטית
      Animated.sequence([
        Animated.timing(animValues.countdownScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animValues.countdownScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animValues.pulse, {
            toValue: 1.08,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animValues.pulse, {
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
      animValues.pulse.setValue(1);
      animValues.countdownScale.setValue(1);
    };
  }, [timeLeft, isPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // אופטימיזציה של מידע הסט הבא
  const nextSetInfo = useMemo(() => {
    if (!nextExercise?.sets) return null;
    const nextSet = nextExercise.sets.find((s) => !s.completed);
    if (!nextSet) return null;
    return {
      name: nextExercise.name,
      weight: nextSet.targetWeight || 0,
      reps: nextSet.targetReps || 0,
    };
  }, [nextExercise?.name, nextExercise?.sets]);

  // ניקוי אנימציות בעת יציאה מהקומפוננטה
  useEffect(() => {
    return () => {
      // עצירת כל האנימציות הפעילות
      Object.values(animValues).forEach((animValue) => {
        animValue.stopAnimation();
      });
    };
  }, []);
  const rotateInterpolate = animValues.rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const glowOpacity = animValues.glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: animValues.scale }],
        },
      ]}
    >
      <View style={styles.compactCard}>
        <LinearGradient
          colors={[theme.colors.card, theme.colors.background]}
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
            <View style={styles.compactTimerWrapper}>
              <Text
                style={[
                  styles.compactTimerText,
                  timeLeft <= 5 && { color: theme.colors.error },
                ]}
              >
                {formatTime(timeLeft)}
              </Text>
              <Text style={styles.compactTimerLabel}>זמן מנוחה</Text>
            </View>

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
          pointerEvents="none" // מונע חסימת אינטראקציות
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
          pointerEvents="none" // מונע חסימת אינטראקציות
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
          colors={[theme.colors.card, theme.colors.background]}
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
              onPress={() => onAddTime(10)}
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
                  +10
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
                    { scale: animValues.pulse },
                    { scale: animValues.countdownScale },
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
              onPress={() => onSubtractTime(10)}
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
                  -10
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
                  opacity: animValues.progress.interpolate({
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

                <Text style={styles.nextSetName}>{nextSetInfo?.name}</Text>

                <View style={styles.nextSetStats}>
                  <View style={styles.nextSetStat}>
                    <MaterialCommunityIcons
                      name="weight-kilogram"
                      size={14}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.nextSetStatText}>
                      {nextSetInfo?.weight} קג
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
                      {nextSetInfo?.reps} חזרות
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
                    width: animValues.progress.interpolate({
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
    // הסרת position absolute - הקונטיינר ההורה כבר מטפל בזה
    left: 0,
    right: 0,
    zIndex: 10, // הפחתת z-index כדי לא לחסום כפתורים חשובים
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  compactCard: {
    borderRadius: 16,
    overflow: "hidden",
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}20`,
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
  },
  compactTimerText: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
  },
  compactTimerLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  compactTimeButton: {
    marginHorizontal: 8,
  },
  compactButtonBg: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 40,
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
  },
  compactSkipText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
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
    top: -10, // הקטנה מ-20 ל-10
    left: -10, // הקטנה מ-20 ל-10
    right: -10, // הקטנה מ-20 ל-10
    bottom: -10, // הקטנה מ-20 ל-10
    borderRadius: 30, // התאמה לגודל החדש
    zIndex: -1, // וידוא שהגלו נמצא מאחורי התוכן
  },
  rotatingBackground: {
    position: "absolute",
    width: screenWidth * 1.2, // הקטנה מ-2 ל-1.2 כדי לא לחסום אלמנטים
    height: screenWidth * 1.2, // הקטנה מ-2 ל-1.2
    left: -(screenWidth * 0.1), // התאמה לגודל החדש
    top: -(screenWidth * 0.3), // התאמה לגודל החדש
    zIndex: -1, // וידוא שהרקע נמצא מאחורי כל האלמנטים
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
    paddingTop: 24,
    paddingBottom: 16,
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
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  skipButton: {
    borderRadius: 24,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  skipGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
  },
  skipText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  mainContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  timeButton: {
    borderRadius: 24,
    overflow: "hidden",
    ...theme.shadows.medium,
    minWidth: 80,
    minHeight: 80,
  },
  timeButtonGradient: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    padding: 16,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  timerWrapper: {
    alignItems: "center",
  },
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
  timerText: {
    fontSize: 64,
    fontWeight: "700",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
    letterSpacing: -3,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
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
    width: 160,
    height: 160,
    borderRadius: 80,
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
