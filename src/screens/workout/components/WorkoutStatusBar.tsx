/**
 * @file WorkoutStatusBar.tsx
 * @description רכיב סטטוס בר אימון - מציג טיימר מנוחה או התרגיל הבא
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

interface WorkoutStatusBarProps {
  isRestActive: boolean;
  restTimeLeft?: number;
  onAddRestTime?: (seconds: number) => void;
  onSubtractRestTime?: (seconds: number) => void;
  onSkipRest?: () => void;
  nextExercise?: { name: string };
  onSkipToNext?: () => void;
}

export const WorkoutStatusBar: React.FC<WorkoutStatusBarProps> = ({
  isRestActive,
  restTimeLeft = 0,
  onAddRestTime,
  onSubtractRestTime,
  onSkipRest,
  nextExercise,
  onSkipToNext,
}) => {
  const shouldShow = isRestActive || (nextExercise && !isRestActive);

  if (!shouldShow) {
    return null;
  }

  // מצב טיימר מנוחה
  if (isRestActive) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {/* כפתור -10 שניות */}
          {onSubtractRestTime && (
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => onSubtractRestTime(10)}
            >
              <MaterialCommunityIcons
                name="minus"
                size={20}
                color={theme.colors.error}
              />
              <Text style={styles.timeButtonText}>10</Text>
            </TouchableOpacity>
          )}

          {/* טיימר מרכזי */}
          <View style={styles.timerWrapper}>
            <MaterialCommunityIcons
              name="timer-sand"
              size={20}
              color={theme.colors.success}
            />
            <Text style={styles.timerText}>{formatTime(restTimeLeft)}</Text>
            <Text style={styles.timerLabel}>מנוחה</Text>
          </View>

          {/* כפתור +10 שניות */}
          {onAddRestTime && (
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => onAddRestTime(10)}
            >
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={theme.colors.success}
              />
              <Text style={styles.timeButtonText}>10</Text>
            </TouchableOpacity>
          )}

          {/* כפתור דילוג */}
          {onSkipRest && (
            <TouchableOpacity style={styles.skipButton} onPress={onSkipRest}>
              <MaterialCommunityIcons
                name="skip-forward"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // מצב התרגיל הבא
  if (nextExercise) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.exerciseInfo}>
            <MaterialCommunityIcons
              name="flash"
              size={18}
              color={theme.colors.warning}
            />
            <Text style={styles.exerciseLabel}>הבא בתור</Text>
          </View>

          <Text style={styles.exerciseName} numberOfLines={2}>
            {nextExercise.name}
          </Text>

          {onSkipToNext && (
            <TouchableOpacity style={styles.skipButton} onPress={onSkipToNext}>
              <MaterialCommunityIcons
                name="play-circle"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },

  content: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },

  timeButton: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    minWidth: 50,
  },

  timeButtonText: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: 2,
  },

  timerWrapper: {
    alignItems: "center",
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginVertical: 4,
  },

  timerLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  skipButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  exerciseInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  exerciseLabel: {
    fontSize: 12,
    color: theme.colors.warning,
    fontWeight: "600",
  },

  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginHorizontal: 12,
  },
});

export default WorkoutStatusBar;
