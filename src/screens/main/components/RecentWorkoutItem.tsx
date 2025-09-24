import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../core/theme";
import { isRTL, wrapBidi } from "../../../utils/rtlHelpers";
import { formatWorkoutDate, getWorkoutIcon } from "../../../utils/formatters";
import { formatRating } from "../utils/mainScreenHelpers";
import { MAIN_SCREEN_TEXTS } from "../../../constants/mainScreenTexts";

import type { WorkoutHistoryItem } from "../../../core/types/user.types";

interface RecentWorkoutItemProps {
  workout: WorkoutHistoryItem;
}

export const RecentWorkoutItem: React.FC<RecentWorkoutItemProps> = ({
  workout,
}) => {
  const title =
    workout?.workoutName ||
    workout?.name ||
    (workout?.type === "strength"
      ? MAIN_SCREEN_TEXTS.WORKOUT_TYPES.STRENGTH
      : MAIN_SCREEN_TEXTS.WORKOUT_TYPES.GENERAL);

  const dateValue = workout?.completedAt || workout?.date || new Date();

  const durationMinutes = (() => {
    const seconds = workout?.duration;
    return typeof seconds === "number"
      ? Math.max(1, Math.round(seconds / 60))
      : undefined;
  })();

  const iconName = getWorkoutIcon(
    workout?.type,
    title
  ) as keyof typeof MaterialCommunityIcons.glyphMap;

  const ratingValue = workout?.rating || 4.0;

  return (
    <View style={styles.recentWorkoutItem}>
      <View style={styles.workoutIcon}>
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle}>{wrapBidi(title)}</Text>
        <Text style={styles.workoutDate}>
          {wrapBidi(
            formatWorkoutDate(dateValue, durationMinutes) || "תאריך לא ידוע"
          )}
        </Text>
      </View>
      <View style={styles.workoutRating}>
        <MaterialCommunityIcons
          name="star"
          size={16}
          color={theme.colors.warning}
        />
        <Text style={styles.ratingText}>
          {formatRating(ratingValue) || "4.0"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recentWorkoutItem: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.xs,
    backgroundColor: `${theme.colors.card}FA`,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}40`,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderTopColor: `${theme.colors.primary}15`,
    borderTopWidth: 2,
  },
  workoutIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginStart: isRTL() ? theme.spacing.lg : 0,
    marginEnd: isRTL() ? 0 : theme.spacing.lg,
    backgroundColor: `${theme.colors.backgroundElevated}F5`,
    borderWidth: 2.5,
    borderColor: `${theme.colors.primary}25`,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderTopColor: `${theme.colors.primary}35`,
    borderBottomColor: `${theme.colors.primary}15`,
  },
  workoutInfo: {
    flex: 1,
    alignItems: isRTL() ? "flex-end" : "flex-start",
    paddingEnd: isRTL() ? theme.spacing.sm : 0,
    paddingStart: isRTL() ? 0 : theme.spacing.sm,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: isRTL() ? "right" : "left",
    marginBottom: 6,
    writingDirection: isRTL() ? "rtl" : "ltr",
    letterSpacing: 0.3,
  },
  workoutDate: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
    letterSpacing: 0.2,
  },
  workoutRating: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    marginEnd: isRTL() ? theme.spacing.md : 0,
    marginStart: isRTL() ? 0 : theme.spacing.md,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginEnd: isRTL() ? 4 : 0,
    marginStart: isRTL() ? 0 : 4,
  },
});
