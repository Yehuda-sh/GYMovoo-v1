/**
 * @file src/screens/workout/components/QuickActions.tsx
 * @brief Quick Action Buttons Component for Workout Plans
 * @updated August 2025 - Optimized with haptic feedback and accessibility
 */

import React, { memo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
    const handleRegenerateBasic = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onRegenerateBasic();
    }, [onRegenerateBasic]);

    const handleRegenerateAI = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onRegenerateAI();
    }, [onRegenerateAI]);

    const handleStartWorkout = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onStartWorkout();
    }, [onStartWorkout]);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>פעולות מהירות</Text>

        <View style={styles.actionsGrid}>
          {/* Regenerate Basic Plan */}
          <TouchableOpacity
            style={[styles.actionButton, styles.basicButton]}
            onPress={handleRegenerateBasic}
            disabled={loading}
            accessibilityLabel="יצירת תוכנית בסיסית חדשה"
            accessibilityHint="ליצור תוכנית אימון בסיסית מותאמת"
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
            onPress={handleRegenerateAI}
            disabled={loading || !canAccessAI}
            accessibilityLabel="יצירת תוכנית AI חדשה"
            accessibilityHint={
              canAccessAI ? "ליצור תוכנית מותאמת עם AI" : "נדרש מנוי פעיל"
            }
          >
            <MaterialCommunityIcons
              name="brain"
              size={24}
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
                size={16}
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
            onPress={handleStartWorkout}
            disabled={loading || !hasWorkoutPlan}
            accessibilityLabel="התחלת אימון"
            accessibilityHint={
              hasWorkoutPlan ? "להתחיל אימון עכשיו" : "צריך תוכנית אימון תחילה"
            }
          >
            <MaterialCommunityIcons
              name="play-circle"
              size={24}
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
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  basicButton: {
    backgroundColor: theme.colors.surface,
  },
  aiButton: {
    backgroundColor: theme.colors.primaryLight,
  },
  startButton: {
    backgroundColor: theme.colors.surface,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: theme.colors.surfaceVariant,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 8,
    textAlign: "center",
  },
  startText: {
    color: theme.colors.success,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  lockIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

QuickActions.displayName = "QuickActions";

export default QuickActions;
