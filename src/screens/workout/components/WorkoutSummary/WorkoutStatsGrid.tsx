/**
 * @file src/screens/workout/components/WorkoutSummary/WorkoutStatsGrid.tsx
 * @brief רכיב סטטיסטיקות אימון מפולח
 * @description מציג סטטיסטיקות אימון בצורה קומפקטית וברורה
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { formatVolume } from "../../../../utils";
import { formatDuration } from "../../../../utils/formatters";

interface WorkoutStatsGridProps {
  totalExercises: number;
  completedExercises: number;
  totalSets: number;
  completedSets: number;
  totalVolume: number;
  totalReps: number;
  progressPercentage: number;
  personalRecords: number;
  duration: number;
  plannedSets: number;
}

export const WorkoutStatsGrid: React.FC<WorkoutStatsGridProps> = React.memo(
  ({
    totalExercises,
    completedExercises,
    totalSets,
    completedSets,
    totalVolume,
    totalReps,
    progressPercentage,
    personalRecords,
    duration,
    plannedSets,
  }) => {
    const isRTL = theme.isRTL;

    return (
      <View
        style={styles.statsGrid}
        accessible={true}
        accessibilityLabel={`סיכום אימון: משך ${formatDuration(
          duration
        )}, ${completedSets} מתוך ${plannedSets} סטים הושלמו, ${completedExercises} מתוך ${totalExercises} תרגילים הושלמו, נפח כולל ${formatVolume(
          totalVolume
        )}, חזרות ${totalReps}`}
        testID="stats-grid"
      >
        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color={theme.colors.primary}
          />
          <Text
            style={styles.statValue}
            accessibilityRole="text"
            accessibilityLabel={`משך האימון ${formatDuration(duration)}`}
            testID="stat-duration"
          >
            {formatDuration(duration)}
          </Text>
          <Text style={styles.statLabel}>משך האימון</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="format-list-checks"
            size={24}
            color={theme.colors.info || theme.colors.primary}
          />
          <Text
            style={styles.statValue}
            accessibilityRole="text"
            accessibilityLabel={`${completedExercises} מתוך ${totalExercises} תרגילים הושלמו`}
            testID="stat-exercises"
          >
            {completedExercises}/{totalExercises}
          </Text>
          <Text style={styles.statLabel}>תרגילים הושלמו</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="checkbox-marked-circle-outline"
            size={24}
            color={theme.colors.success}
          />
          <Text
            style={styles.statValue}
            accessibilityRole="text"
            accessibilityLabel={`${totalSets} מתוך ${plannedSets} סטים`}
            testID="stat-sets"
          >
            {totalSets}/{plannedSets}
          </Text>
          <Text style={styles.statLabel}>סטים הושלמו</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="weight-kilogram"
            size={24}
            color={theme.colors.accent}
          />
          <Text
            style={styles.statValue}
            accessibilityRole="text"
            accessibilityLabel={`נפח כולל ${formatVolume(totalVolume)}`}
            testID="stat-volume"
          >
            {formatVolume(totalVolume)}
          </Text>
          <Text style={styles.statLabel}>ק"ג נפח כולל</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="counter"
            size={24}
            color={theme.colors.primary}
          />
          <Text
            style={styles.statValue}
            accessibilityRole="text"
            accessibilityLabel={`סך חזרות ${totalReps}`}
            testID="stat-reps"
          >
            {totalReps}
          </Text>
          <Text style={styles.statLabel}>סה"כ חזרות</Text>
        </View>

        {personalRecords > 0 && (
          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="star"
              size={24}
              color={theme.colors.warning}
            />
            <Text
              style={styles.statValue}
              accessibilityRole="text"
              accessibilityLabel={`${personalRecords} שיאים אישיים`}
              testID="stat-prs"
            >
              {personalRecords}
            </Text>
            <Text style={styles.statLabel}>שיאים אישיים!</Text>
          </View>
        )}
      </View>
    );
  }
);

WorkoutStatsGrid.displayName = "WorkoutStatsGrid";

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  statLabel: {
    fontSize: theme.typography.caption.fontSize - 1,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
});
