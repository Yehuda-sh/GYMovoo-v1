/**
 * @file src/screens/workout/components/RestTimer.tsx
 * @description קומפוננטת טיימר מנוחה עם אנימציות ופעולות
 * English: Rest timer component with animations and actions
 */

import React, { useRef, useEffect } from "react";
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
import { useRestTimer } from "../hooks/useRestTimer";

const { width: screenWidth } = Dimensions.get("window");

interface RestTimerProps {
  defaultTime?: number;
  onComplete?: () => void;
  nextExercise?: {
    name: string;
    targetWeight: number;
    targetReps: number;
  };
}

export const RestTimer: React.FC<RestTimerProps> = ({
  defaultTime = 180,
  onComplete,
  nextExercise,
}) => {
  const {
    timeLeft,
    isActive,
    progress,
    startRest,
    pauseRest,
    skipRest,
    addTime,
    subtractTime,
  } = useRestTimer({ defaultTime, onComplete });

  const slideAnim = useRef(new Animated.Value(-200)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // אנימציית כניסה/יציאה
  // Entry/exit animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: isActive ? 0 : -200,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.8,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  // אנימציית פעימה ב-3 שניות אחרונות
  // Pulse animation for last 3 seconds
  useEffect(() => {
    if (timeLeft <= 3 && timeLeft > 0) {
      Animated.loop(
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
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeLeft]);

  // אנימציית progress bar
  // Progress bar animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // פורמט זמן
  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isActive) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.blurContainer}>
        <LinearGradient
          colors={["rgba(0, 122, 255, 0.95)", "rgba(0, 100, 220, 0.95)"]}
          style={styles.gradientBackground}
        >
          {/* כותרת */}
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>⏱️ זמן מנוחה</Text>
            <TouchableOpacity onPress={skipRest} style={styles.skipButton}>
              <Text style={styles.skipText}>דלג</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* טיימר ראשי */}
          {/* Main timer */}
          <Animated.View
            style={[
              styles.timerContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Text
              style={[
                styles.timerText,
                timeLeft <= 3 && styles.timerTextUrgent,
              ]}
            >
              {formatTime(timeLeft)}
            </Text>
          </Animated.View>

          {/* פס התקדמות מעגלי */}
          {/* Circular progress */}
          <View style={styles.circularProgress}>
            <Animated.View
              style={[
                styles.progressCircle,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>

          {/* מידע על הסט הבא */}
          {/* Next set info */}
          {nextExercise && (
            <View style={styles.nextSetInfo}>
              <Text style={styles.nextSetLabel}>הסט הבא:</Text>
              <Text style={styles.nextSetDetails}>
                {nextExercise.name} - {nextExercise.targetWeight}ק"ג ×{" "}
                {nextExercise.targetReps}
              </Text>
            </View>
          )}

          {/* כפתורי פעולה */}
          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => subtractTime(15)}
              style={styles.timeButton}
            >
              <Ionicons name="remove" size={20} color={theme.colors.text} />
              <Text style={styles.timeButtonText}>15 שניות</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={pauseRest} style={styles.pauseButton}>
              <Ionicons name="pause" size={32} color={theme.colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => addTime(15)}
              style={styles.timeButton}
            >
              <Ionicons name="add" size={20} color={theme.colors.text} />
              <Text style={styles.timeButtonText}>15 שניות</Text>
            </TouchableOpacity>
          </View>

          {/* טיפ מוטיבציוני */}
          {/* Motivational tip */}
          <View style={styles.tipContainer}>
            <MaterialCommunityIcons
              name="lightbulb"
              size={16}
              color={theme.colors.warning}
            />
            <Text style={styles.tipText}>
              נשום עמוק ותכנן את הסט הבא. מנוחה איכותית = ביצוע טוב יותר! 💪
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 1000,
    borderRadius: 20,
    overflow: "hidden",
    ...theme.shadows.large,
  },
  blurContainer: {
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  gradientBackground: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
  },
  skipText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: "700",
    color: theme.colors.text,
    fontVariant: ["tabular-nums" as const],
  },
  timerTextUrgent: {
    color: theme.colors.error,
  },
  circularProgress: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressCircle: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  nextSetInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  nextSetLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  nextSetDetails: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  timeButtonText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  pauseButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 18,
  },
});
