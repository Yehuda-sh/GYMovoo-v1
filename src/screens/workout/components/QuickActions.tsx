/**
 * @file src/screens/workout/components/QuickActions.tsx
 * @description Quick action buttons for workout plan management
 *
 * Features:
 * - Basic workout plan generation
 * - AI workout plan generation (premium feature)
 * - Start workout functionality
 */

import { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface QuickActionsProps {
  onRegenerateBasic: () => void;
  onRegenerateAI: () => void;
  onStartWorkout: () => void;
  canAccessAI: boolean;
  hasWorkoutPlan: boolean;
  loading: boolean;
}

const QuickActions = memo(
  ({
    onRegenerateBasic,
    onRegenerateAI,
    onStartWorkout,
    canAccessAI,
    hasWorkoutPlan,
    loading,
  }: QuickActionsProps) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>פעולות מהירות</Text>

        <View style={styles.actionsGrid}>
          {/* Regenerate Basic Plan */}
          <TouchableOpacity
            style={[styles.actionButton, styles.basicButton]}
            onPress={onRegenerateBasic}
            disabled={loading}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={24}
              color={theme.colors.text}
            />
            <Text style={styles.actionText}>תוכנית בסיסית</Text>
          </TouchableOpacity>

          {/* Regenerate AI Plan */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.aiButton,
              !canAccessAI && styles.disabledButton,
            ]}
            onPress={onRegenerateAI}
            disabled={loading || !canAccessAI}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="brain"
              size={28}
              color={
                canAccessAI ? theme.colors.primary : theme.colors.textSecondary
              }
            />
            <Text
              style={[styles.actionText, !canAccessAI && styles.disabledText]}
            >
              תוכנית AI
            </Text>
            {!canAccessAI && (
              <MaterialCommunityIcons
                name="lock"
                size={18}
                color={theme.colors.textSecondary}
                style={styles.lockIcon}
              />
            )}
          </TouchableOpacity>

          {/* Start Workout */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.startButton,
              !hasWorkoutPlan && styles.disabledButton,
            ]}
            onPress={onStartWorkout}
            disabled={loading || !hasWorkoutPlan}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="play-circle"
              size={32}
              color={
                hasWorkoutPlan
                  ? theme.colors.success
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.actionText,
                hasWorkoutPlan ? styles.startText : styles.disabledText,
              ]}
            >
              התחל אימון
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 96,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  basicButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
  },
  aiButton: {
    backgroundColor: `${theme.colors.primary}10`,
    borderColor: theme.colors.primary,
  },
  startButton: {
    backgroundColor: `${theme.colors.success}10`,
    borderColor: theme.colors.success,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.border,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 10,
    textAlign: "center",
  },
  startText: {
    color: theme.colors.success,
    fontWeight: "bold",
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  lockIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    opacity: 0.7,
  },
});

QuickActions.displayName = "QuickActions";

export default QuickActions;
