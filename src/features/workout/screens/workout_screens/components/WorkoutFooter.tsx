/**
 * @file src/features/workout/screens/workout_screens/components/WorkoutFooter.tsx
 * @brief Footer component for ActiveWorkoutScreen with action buttons
 */

import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";

interface WorkoutFooterProps {
  onAddExercise: () => void;
  onFinishWorkout: () => void;
  isWorkoutEmpty: boolean;
}

export const WorkoutFooter: React.FC<WorkoutFooterProps> = ({
  onAddExercise,
  onFinishWorkout,
  isWorkoutEmpty,
}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.addButton} onPress={onAddExercise}>
        <MaterialCommunityIcons
          name="plus"
          size={24}
          color={theme.colors.primary}
        />
        <Text style={styles.addButtonText}>הוסף תרגיל</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.finishButton,
          isWorkoutEmpty && styles.finishButtonDisabled,
        ]}
        onPress={onFinishWorkout}
        disabled={isWorkoutEmpty}
      >
        <MaterialCommunityIcons
          name="check"
          size={24}
          color={
            isWorkoutEmpty ? theme.colors.textSecondary : theme.colors.card
          }
        />
        <Text
          style={[
            styles.finishButtonText,
            isWorkoutEmpty && styles.finishButtonTextDisabled,
          ]}
        >
          סיים אימון
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  finishButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
  },
  finishButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.card,
  },
  finishButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
});
