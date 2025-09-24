/**
 * @file src/features/workout/screens/workout_screens/ActiveWorkoutScreen.tsx
 * @brief Refactored ActiveWorkoutScreen using modular architecture
 */

import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../../core/theme";
import { useActiveWorkoutData } from "./hooks/useActiveWorkoutData";
import { WorkoutHeader } from "./components/WorkoutHeader";
import { LiveStatsBar } from "./components/LiveStatsBar";
import { RestTimerOverlay } from "./components/RestTimerOverlay";
import { ActiveExercisesList } from "./components/ActiveExercisesList";
import { WorkoutFooter } from "./components/WorkoutFooter";

const ActiveWorkoutScreen: React.FC = () => {
  const data = useActiveWorkoutData();
  const progressAnim = new Animated.Value(0);

  if (data.exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>אין תרגילים באימון</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={data.workoutActions.onAddExercise}
          >
            <Text style={styles.addButtonText}>הוסף תרגיל</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WorkoutHeader
        workoutTitle={data.workoutData.name || "אימון פעיל"}
        workoutTime={data.workoutTime}
        isTimerRunning={data.isTimerRunning}
        onToggleTimer={data.workoutActions.onToggleTimer}
      />

      <LiveStatsBar
        completedSets={data.liveStats?.completedSets || 0}
        totalVolume={Math.round(data.liveStats?.totalVolume || 0)}
        totalReps={data.liveStats?.totalReps || 0}
        progressPercentage={data.liveStats?.progressPercentage || 0}
      />

      <ActiveExercisesList
        exercises={data.exercises}
        onUpdateSet={data.exerciseActions.onUpdateSet}
        onCompleteSet={data.exerciseActions.onCompleteSet}
        onAddSet={data.exerciseActions.onAddSet}
        onRemoveSet={data.exerciseActions.onDeleteSet}
        onRemoveExercise={(_id: string) => {}} // TODO: implement
      />

      <WorkoutFooter
        onAddExercise={data.workoutActions.onAddExercise}
        onFinishWorkout={data.workoutActions.onFinishWorkout}
        isWorkoutEmpty={data.exercises.length === 0}
      />

      {data.restTimer.visible && (
        <RestTimerOverlay
          isVisible={data.restTimer.visible}
          remainingTime={data.restTimer.restTime}
          totalTime={data.restTimer.restTime}
          onSkip={data.restTimer.onSkip}
          onAddTime={() => {}} // TODO: implement
          progressAnimation={progressAnim}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
  },
  addButtonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ActiveWorkoutScreen;
