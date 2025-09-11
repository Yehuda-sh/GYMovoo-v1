/**
 * @file WorkoutHeader.tsx
 * @description רכיב הדר אימון פשוט ופונקציונלי
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import BackButton from "../../../components/common/BackButton";

interface WorkoutHeaderProps {
  workoutName: string;
  elapsedTime: string;
  onTimerPress: () => void;
  onNamePress: () => void;
  onMenuPress?: () => void;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workoutName,
  elapsedTime,
  onTimerPress,
  onNamePress,
  onMenuPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.menuButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={24}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      <View style={styles.centerContainer}>
        <TouchableOpacity
          onPress={onNamePress}
          style={styles.nameContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.workoutName} numberOfLines={1}>
            {workoutName}
          </Text>
          <Ionicons
            name="pencil"
            size={14}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTimerPress}
          style={styles.timerContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.timerText}>{elapsedTime}</Text>
          <Ionicons
            name="timer-outline"
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <BackButton absolute={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },

  menuButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },

  centerContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },

  nameContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  workoutName: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "right",
  },

  timerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
  },

  timerText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
