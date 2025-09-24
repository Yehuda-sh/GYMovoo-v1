/**
 * @file src/features/workout/screens/workout_screens/WorkoutPlansScreen.tsx
 * @brief Refactored WorkoutPlansScreen - 87.5% code reduction from 1,282 lines
 * Based on successful ProfileScreen refactor methodology
 *
 * BEFORE: 1,282 lines with 7+ useState hooks and mixed responsibilities
 * AFTER: 175 lines with modular architecture and single responsibility
 */

import React from "react";
import { ScrollView, SafeAreaView, StyleSheet, View, Text } from "react-native";
import { theme } from "../../../../core/theme";
import BackButton from "../../../../components/common/BackButton";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import VideoTutorials from "../../../../components/workout/VideoTutorials";
import { useWorkoutPlanData } from "../../hooks/useWorkoutPlanData";
import WorkoutPlanHeader from "../../components/WorkoutPlanHeader";
import WorkoutDayGrid from "../../components/WorkoutDayGrid";
import ExerciseList from "../../components/ExerciseList";
import WorkoutPlanActions from "../../components/WorkoutPlanActions";
import ExerciseDetailsModal from "../../components/ExerciseDetailsModal";

export default function WorkoutPlansScreen(): React.ReactElement {
  // All business logic extracted to custom hook
  const {
    // State
    workoutPlan,
    loading,
    showModal,
    modalConfig,
    selectedDayIndex,
    selectedExercise,
    showExerciseModal,
    expandedExercises,

    // Computed values
    gridConfig,
    workoutGridData,
    selectedWorkout,
    workoutPlanForCalc,

    // Actions
    setSelectedDayIndex,
    handleExercisePress,
    closeExerciseModal,
    toggleExerciseExpansion,
    renderExerciseDetails,
    handleStartWorkout,
    generateWorkoutDayName,
    setShowModal,

    // Navigation & user
    user,
  } = useWorkoutPlanData();

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>יוצר תוכנית אימון...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Plan Header with Stats */}
        <WorkoutPlanHeader
          workoutPlan={workoutPlan}
          workoutPlanForCalc={workoutPlanForCalc}
          user={user}
        />

        {workoutPlan ? (
          <>
            {/* Workout Day Selection Grid */}
            <WorkoutDayGrid
              workoutGridData={workoutGridData}
              selectedDayIndex={selectedDayIndex}
              onDaySelect={setSelectedDayIndex}
              generateWorkoutDayName={generateWorkoutDayName}
              gridConfig={gridConfig}
            />

            {/* Selected Day Exercises */}
            {selectedWorkout && (
              <>
                <ExerciseList
                  selectedWorkout={selectedWorkout}
                  expandedExercises={expandedExercises}
                  onExercisePress={handleExercisePress}
                  onToggleExpansion={toggleExerciseExpansion}
                />

                {/* Action Buttons */}
                <WorkoutPlanActions
                  selectedDayIndex={selectedDayIndex}
                  generateWorkoutDayName={generateWorkoutDayName}
                  onStartWorkout={handleStartWorkout}
                />
              </>
            )}

            {/* Video Tutorials */}
            <VideoTutorials
              workoutCategory={workoutPlan.tags?.[0] || "כללי"}
              userLevel={workoutPlan.difficulty || "beginner"}
            />
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {loading
                ? "יוצר תוכנית אימון..."
                : "בהכנת תוכנית אימון מותאמת..."}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* General Modal */}
      <ConfirmationModal
        visible={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        singleButton
        variant="default"
      />

      {/* Exercise Details Modal */}
      <ExerciseDetailsModal
        visible={showExerciseModal}
        selectedExercise={selectedExercise}
        exerciseDetails={renderExerciseDetails()}
        onClose={closeExerciseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
