/**
 * @file src/screens/workout/components/WorkoutSummary/WorkoutStatsGrid.tsx
 * @brief רכיב סטטיסטיקות אימון מפולח
 * @description מציג סטטיסטיקות אימון בצורה קומפקטית וברורה
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";
import { formatVolume } from "../../../../utils";
import { formatDuration } from "../../../../utils/formatters";
import StatCard from "../../../../components/common/StatCard";

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
    progressPercentage: _progressPercentage,
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
        <StatCard
          value={formatDuration(duration)}
          label="משך האימון"
          icon="clock-outline"
          variant="compact"
          testID="stat-duration"
        />

        <StatCard
          value={`${completedExercises}/${totalExercises}`}
          label="תרגילים הושלמו"
          icon="format-list-checks"
          iconColor={theme.colors.info || theme.colors.primary}
          variant="compact"
          testID="stat-exercises"
        />

        <StatCard
          value={`${totalSets}/${plannedSets}`}
          label="סטים הושלמו"
          icon="checkbox-marked-circle-outline"
          iconColor={theme.colors.success}
          variant="compact"
          testID="stat-sets"
        />

        <StatCard
          value={formatVolume(totalVolume)}
          label="ק״ג נפח כולל"
          icon="weight-kilogram"
          iconColor={theme.colors.accent}
          variant="compact"
          testID="stat-volume"
        />

        <StatCard
          value={totalReps}
          label="סה״כ חזרות"
          icon="counter"
          variant="compact"
          testID="stat-reps"
        />

        {personalRecords > 0 && (
          <StatCard
            value={personalRecords}
            label="שיאים אישיים!"
            icon="star"
            iconColor={theme.colors.warning}
            variant="compact"
            testID="stat-prs"
          />
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
