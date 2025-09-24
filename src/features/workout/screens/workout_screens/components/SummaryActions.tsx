/**
 * @file src/features/workout/screens/workout_screens/components/SummaryActions.tsx
 * @brief Action buttons component for WorkoutSummaryScreen
 */

import React from "react";
import { Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import AppButton from "../../../../../components/common/AppButton";
import { theme } from "../../../../../core/theme";

interface SummaryActionsProps {
  fadeAnim: Animated.Value;
  isLoading: boolean;
  onSaveWorkout: () => void;
  onSkipAndGoBack: () => void;
}

export const SummaryActions: React.FC<SummaryActionsProps> = ({
  fadeAnim,
  isLoading,
  onSaveWorkout,
  onSkipAndGoBack,
}) => {
  return (
    <Animated.View style={[styles.actionButtons, { opacity: fadeAnim }]}>
      <AppButton
        title="שמור אימון"
        variant="primary"
        size="large"
        onPress={onSaveWorkout}
        style={styles.saveButton}
        disabled={isLoading}
      />

      <TouchableOpacity
        style={styles.skipButton}
        onPress={onSkipAndGoBack}
        disabled={isLoading}
      >
        <Text style={styles.skipText}>דלג ועבור למסך הראשי</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    position: "absolute",
    bottom: 0,
    start: 0,
    end: 0,
    backgroundColor: "white",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    marginBottom: theme.spacing.md,
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
  skipText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textDecorationLine: "underline",
  },
});
