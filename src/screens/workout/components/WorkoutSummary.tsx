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
const isRTL = theme.isRTL; // תמיכה ב-RTL
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

export const styles = StyleSheet.create({
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
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  workoutName: {
    fontSize: theme.typography.body.fontSize + 2,
    color: theme.colors.text,
    opacity: 0.9,
    marginTop: theme.spacing.sm,
    textAlign: isRTL ? "right" : "left",
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL ? "right" : "left",
  },
  exerciseSummary: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  exerciseName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: isRTL ? "right" : "left",
  },
  exerciseStats: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    // gap: theme.spacing.md, // gap לא עובד בכל פלטפורמה!
  },
  exerciseStat: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.sm / 2, // תחליף ל-gap
  },
  prBadge: {
    backgroundColor: theme.colors.warning,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  prText: {
    fontSize: theme.typography.captionSmall.fontSize,
    color: theme.colors.background,
    fontWeight: "500",
  },
  actions: {
    padding: theme.spacing.lg,
    flexDirection: "column",
    // gap: theme.spacing.md, // תחליף ל-gap
  },
  saveButton: {
    borderRadius: theme.radius.md,
    overflow: "hidden",
    // אפשר לקחת מ-theme.components.primaryButton אם רוצים עיצוב קבוע
  },
  saveButtonGradient: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    // gap: theme.spacing.sm,
  },
  saveButtonText: {
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
    color: theme.colors.text,
  },
  closeButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: theme.colors.textSecondary,
  },
});
