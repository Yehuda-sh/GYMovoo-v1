/**
 * @file src/screens/workout/components/WorkoutSummary.tsx
 * @description מסך סיכום אימון
 * English: Workout summary screen
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import { WorkoutData } from "../types/workout.types";

interface WorkoutSummaryProps {
  workout: WorkoutData;
  onClose: () => void;
  onSave: () => void;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  workout,
  onClose,
  onSave,
}) => {
  // חישוב סטטיסטיקות
  const stats = {
    duration: Math.floor((workout.duration || 0) / 60),
    totalSets: workout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0
    ),
    totalVolume: workout.exercises.reduce(
      (acc, ex) =>
        acc +
        ex.sets.reduce(
          (setAcc, set) =>
            set.completed
              ? setAcc + (set.weight || 0) * (set.reps || 0)
              : setAcc,
          0
        ),
      0
    ),
    personalRecords: workout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.isPersonalRecord).length,
      0
    ),
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} שעות ו-${mins} דקות`;
    }
    return `${mins} דקות`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.primaryGradientStart,
          theme.colors.primaryGradientEnd,
        ]}
        style={styles.header}
      >
        <MaterialCommunityIcons
          name="trophy"
          size={64}
          color={theme.colors.text}
        />
        <Text style={styles.congratsText}>כל הכבוד! 🎉</Text>
        <Text style={styles.workoutName}>{workout.name || "אימון מהיר"}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* סטטיסטיקות */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={32}
              color={theme.colors.primary}
            />
            <Text style={styles.statValue}>
              {formatDuration(stats.duration)}
            </Text>
            <Text style={styles.statLabel}>משך האימון</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={32}
              color={theme.colors.success}
            />
            <Text style={styles.statValue}>{stats.totalSets}</Text>
            <Text style={styles.statLabel}>סטים הושלמו</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="weight-kilogram"
              size={32}
              color={theme.colors.accent}
            />
            <Text style={styles.statValue}>
              {stats.totalVolume.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>ק"ג נפח כולל</Text>
          </View>

          {stats.personalRecords > 0 && (
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="star"
                size={32}
                color={theme.colors.warning}
              />
              <Text style={styles.statValue}>{stats.personalRecords}</Text>
              <Text style={styles.statLabel}>שיאים אישיים!</Text>
            </View>
          )}
        </View>

        {/* פירוט תרגילים */}
        <Text style={styles.sectionTitle}>סיכום תרגילים</Text>
        {workout.exercises.map((exercise, index) => {
          const completedSets = exercise.sets.filter((s) => s.completed);
          const exerciseVolume = completedSets.reduce(
            (acc, set) => acc + (set.weight || 0) * (set.reps || 0),
            0
          );

          return (
            <View key={index} style={styles.exerciseSummary}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseStats}>
                <Text style={styles.exerciseStat}>
                  {completedSets.length} סטים
                </Text>
                <Text style={styles.exerciseStat}>
                  {exerciseVolume.toLocaleString()} ק"ג נפח
                </Text>
                {exercise.sets.some((s) => s.isPersonalRecord) && (
                  <View style={styles.prBadge}>
                    <Text style={styles.prText}>שיא חדש!</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* כפתורי פעולה */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={styles.saveButtonGradient}
          >
            <MaterialCommunityIcons
              name="content-save"
              size={20}
              color={theme.colors.text}
            />
            <Text style={styles.saveButtonText}>שמור אימון</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>סגור</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  workoutName: {
    fontSize: 18,
    color: theme.colors.text,
    opacity: 0.9,
    marginTop: theme.spacing.sm,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  exerciseSummary: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  exerciseStats: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  exerciseStat: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  prBadge: {
    backgroundColor: theme.colors.warning,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  prText: {
    fontSize: 12,
    color: theme.colors.background,
    fontWeight: "500",
  },
  actions: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  saveButton: {
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  saveButtonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  closeButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
