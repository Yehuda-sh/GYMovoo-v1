/**
 * @file src/features/workout/screens/workout_screens/components/RestTimerOverlay.tsx
 * @brief Rest timer overlay component extracted from ActiveWorkoutScreen
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";

interface RestTimerOverlayProps {
  isVisible: boolean;
  remainingTime: number;
  totalTime: number;
  onSkip: () => void;
  onAddTime: () => void;
  progressAnimation: Animated.Value;
}

export const RestTimerOverlay: React.FC<RestTimerOverlayProps> = ({
  isVisible,
  remainingTime,
  totalTime,
  onSkip,
  onAddTime,
  progressAnimation,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = ((totalTime - remainingTime) / totalTime) * 100;

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerTitle}>מנוחה</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>

          <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
          <Text style={styles.timerSubtext}>
            {Math.round(progressPercentage)}% הושלם
          </Text>

          <View style={styles.timerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onAddTime}>
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.actionText}>+30ש</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.skipButton]}
              onPress={onSkip}
            >
              <MaterialCommunityIcons
                name="skip-next"
                size={24}
                color={theme.colors.error}
              />
              <Text style={[styles.actionText, { color: theme.colors.error }]}>
                דלג
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
    minWidth: 280,
  },
  timerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  progressContainer: {
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  progressBackground: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  timerSubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  timerActions: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  skipButton: {
    backgroundColor: theme.colors.error + "20",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
