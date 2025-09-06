/**
 * @file Exercises List Component
 * @description רשימה וירטואלית לתרגילי אימון
 */

import React, { useCallback } from "react";
import { FlatList, StyleSheet, ListRenderItem, View } from "react-native";
import ExerciseRow from "./ExerciseRow";
import { WorkoutExercise, Set } from "../types/workout.types";
import { theme } from "../../../styles/theme";

interface ExercisesListProps {
  exercises: WorkoutExercise[];
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    updates: Partial<Set>
  ) => void;
  onAddSet: (exerciseId: string) => void;
  onCompleteSet: (exerciseId: string, setId: string) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onReorderSets: (
    exerciseId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onStartRest: (duration: number, exerciseName: string) => void;
}

const ExercisesList: React.FC<ExercisesListProps> = React.memo(
  ({
    exercises,
    onUpdateSet,
    onAddSet,
    onCompleteSet,
    onDeleteSet,
    onReorderSets,
    onRemoveExercise,
    onStartRest,
  }) => {
    const keyExtractor = (item: WorkoutExercise) => item.id;

    const renderItem: ListRenderItem<WorkoutExercise> = useCallback(
      ({ item, index }) => (
        <ExerciseRow
          exercise={item}
          index={index}
          totalCount={exercises.length}
          onUpdateSet={onUpdateSet}
          onAddSet={onAddSet}
          onCompleteSet={onCompleteSet}
          onDeleteSet={onDeleteSet}
          onReorderSets={onReorderSets}
          onRemoveExercise={onRemoveExercise}
          onStartRest={onStartRest}
        />
      ),
      [
        exercises.length,
        onUpdateSet,
        onAddSet,
        onCompleteSet,
        onDeleteSet,
        onReorderSets,
        onRemoveExercise,
        onStartRest,
      ]
    );

    return (
      <View style={styles.container}>
        <FlatList
          data={exercises}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          testID="exercises-list"
        />
      </View>
    );
  }
);

ExercisesList.displayName = "ExercisesList";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
});

export default ExercisesList;
