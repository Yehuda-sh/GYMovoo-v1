/**
 * @file src/screens/workout/components/WorkoutDashboard.tsx
 * @description Workout dashboard displaying live statistics and progress
 *
 * Features:
 * - Real-time workout statistics display
 * - Completion percentage tracking
 * - RTL support and basic accessibility
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import type { WorkoutDashboardProps } from "./types";

export const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({
  totalVolume,
  completedSets,
  totalSets,
  pace,
  personalRecords,
  elapsedTime,
  onHide,
  isEditMode = false,
}) => {
  const completionPercentage =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dashboard}
        onPress={onHide}
        disabled={!onHide}
        activeOpacity={0.8}
      >
        {/* Timer */}
        {elapsedTime && (
          <View style={styles.stat}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={theme.colors.text}
            />
            <Text style={styles.statValue}>{elapsedTime}</Text>
            <Text style={styles.statLabel}>זמן</Text>
          </View>
        )}

        {/* Volume */}
        <View style={styles.stat}>
          <FontAwesome5
            name="weight-hanging"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.statValue}>{Math.round(totalVolume)} ק"ג</Text>
          <Text style={styles.statLabel}>נפח</Text>
        </View>

        {/* Sets */}
        <View style={styles.stat}>
          <MaterialCommunityIcons
            name={isEditMode ? "pencil" : "format-list-checks"}
            size={20}
            color={isEditMode ? theme.colors.warning : theme.colors.success}
          />
          <Text style={styles.statValue}>
            {isEditMode ? "✏️" : `${completedSets}/${totalSets}`}
          </Text>
          <Text style={styles.statLabel}>{isEditMode ? "עריכה" : "סטים"}</Text>
        </View>

        {/* Pace */}
        <View style={styles.stat}>
          <MaterialCommunityIcons
            name="speedometer"
            size={20}
            color={theme.colors.warning}
          />
          <Text style={styles.statValue}>{pace.toFixed(1)}</Text>
          <Text style={styles.statLabel}>קצב</Text>
        </View>

        {/* Personal Records */}
        {personalRecords > 0 && (
          <View style={styles.stat}>
            <MaterialCommunityIcons
              name="trophy"
              size={20}
              color={theme.colors.secondary}
            />
            <Text style={styles.statValue}>{personalRecords}</Text>
            <Text style={styles.statLabel}>שיאים</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${completionPercentage}%` }]}
        />
      </View>

      {/* Close Button */}
      {onHide && (
        <TouchableOpacity style={styles.closeButton} onPress={onHide}>
          <MaterialCommunityIcons
            name="close"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  dashboard: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  stat: {
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  closeButton: {
    alignSelf: "center",
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
  },
});
