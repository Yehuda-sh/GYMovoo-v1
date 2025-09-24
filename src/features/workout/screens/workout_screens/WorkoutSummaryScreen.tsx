/**
 * @file src/features/workout/screens/workout_screens/WorkoutSummaryScreen.tsx
 * @brief Refactored WorkoutSummaryScreen - 85% code reduction from 522 lines
 * Based on successful ProfileScreen & WorkoutPlansScreen methodology
 *
 * BEFORE: 522 lines with mixed responsibilities and inline components
 * AFTER: ~85 lines with modular architecture and single responsibility
 */

import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../../core/theme";
import { ErrorBoundary } from "../../../../components/common/ErrorBoundary";
import { useWorkoutSummaryData } from "./hooks/useWorkoutSummaryData";
import { SummaryHeader } from "./components/SummaryHeader";
import { SummaryStats } from "./components/SummaryStats";
import { PersonalRecords } from "./components/PersonalRecords";
import { ExercisesList } from "./components/ExercisesList";
import { SummaryActions } from "./components/SummaryActions";
import { EmptyState } from "./components/EmptyState";

const WorkoutSummaryScreen: React.FC = () => {
  const summaryData = useWorkoutSummaryData();

  // === Render ===
  return (
    <SafeAreaView style={styles.container}>
      <ErrorBoundary fallbackMessage="שגיאה בטעינת סיכום האימון">
        {!summaryData.workoutData ? (
          <EmptyState onGoBack={summaryData.handleSkipAndGoBack} />
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <SummaryHeader
                workoutData={summaryData.workoutData}
                fadeAnim={summaryData.fadeAnim}
              />

              <SummaryStats
                workoutData={summaryData.workoutData}
                fadeAnim={summaryData.fadeAnim}
              />

              <PersonalRecords
                personalRecords={summaryData.workoutData.personalRecords}
                fadeAnim={summaryData.fadeAnim}
              />

              <ExercisesList
                exercises={summaryData.workoutData.exercises}
                fadeAnim={summaryData.fadeAnim}
              />
            </ScrollView>

            <SummaryActions
              fadeAnim={summaryData.fadeAnim}
              isLoading={summaryData.isLoading}
              onSaveWorkout={summaryData.handleSaveWorkout}
              onSkipAndGoBack={summaryData.handleSkipAndGoBack}
            />
          </>
        )}
      </ErrorBoundary>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});

export default WorkoutSummaryScreen;
