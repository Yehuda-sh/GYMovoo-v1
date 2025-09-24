/**
 * @file src/features/workout/components/WorkoutPlanActions.tsx
 * @brief Action buttons for starting workouts - extracted from WorkoutPlansScreen
 * Clean, focused component for workout initiation actions
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../../../components/common/AppButton";

interface WorkoutPlanActionsProps {
  selectedDayIndex: number;
  generateWorkoutDayName: (index: number) => string;
  onStartWorkout: () => void;
}

const WorkoutPlanActions: React.FC<WorkoutPlanActionsProps> = ({
  selectedDayIndex,
  generateWorkoutDayName,
  onStartWorkout,
}) => {
  return (
    <View style={styles.container}>
      <AppButton
        title={`התחל ${generateWorkoutDayName(selectedDayIndex)}`}
        onPress={onStartWorkout}
        accessibilityLabel={`התחל ${generateWorkoutDayName(selectedDayIndex)}`}
        accessibilityHint="לחץ כדי להתחיל את האימון הנבחר"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
});

export default WorkoutPlanActions;
