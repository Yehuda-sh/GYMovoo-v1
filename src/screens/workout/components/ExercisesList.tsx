/**
 * @file src/screens/workout/components/ExercisesList.tsx
 * @brief רשימה וירטואלית מותאמת לתרגילי אימון עם אופטימיזציות ביצועים
 * @dependencies FlatList, ExerciseRow
 * @notes ביצועים מותאמים עם windowing, batching ו-memoization
 */

import React, { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, ListRenderItem, View } from "react-native";
import ExerciseRow from "./ExerciseRow";
import { WorkoutExercise, Set } from "../types/workout.types";
import { theme } from "../../../styles/theme";
import { logger } from "../../../utils/logger";

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

/**
 * רשימה וירטואלית לתרגילי אימון עם אופטימיזציות ביצועים מתקדמות
 * Virtualized list for workout exercises with advanced performance optimizations
 */
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
    // Performance tracking במצב פיתוח
    const renderStart = useMemo(() => {
      if (__DEV__) {
        console.warn("🚀 ExercisesList STARTING RENDER:", {
          exercisesCount: exercises.length,
          exercisesData: exercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            setsCount: ex.sets?.length || 0,
            hasValidSets: !!(ex.sets && ex.sets.length > 0),
          })),
        });
        return Date.now();
      }
      return 0;
    }, [exercises]);

    React.useEffect(() => {
      if (__DEV__ && renderStart > 0) {
        const renderEnd = Date.now();
        if (renderEnd - renderStart > 50) {
          logger.debug(
            "Performance",
            `ExercisesList render took ${(renderEnd - renderStart).toFixed(2)}ms for ${exercises.length} exercises`
          );
        }
      }
    }, [renderStart, exercises.length]);

    // מפתח יציב לכל פריט
    const keyExtractor = useCallback((item: WorkoutExercise) => item.id, []);

    // פונקציית רינדור מוממושת
    const renderItem: ListRenderItem<WorkoutExercise> = useCallback(
      ({ item, index }) => {
        if (__DEV__) {
          console.warn("🔥 ExercisesList rendering item:", {
            index,
            exerciseId: item.id,
            exerciseName: item.name,
            setsCount: item.sets?.length || 0,
          });
        }

        return (
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
        );
      },
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

    // Callback לסיום רינדור רשימה
    const onEndReached = useCallback(() => {
      if (__DEV__) {
        logger.debug("Performance", "ExercisesList: Reached end of list");
      }
    }, []);

    return (
      <View style={styles.container}>
        <FlatList
          data={exercises}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          // אופטימיזציות ביצועים מתקדמות
          removeClippedSubviews={true}
          initialNumToRender={6}
          windowSize={7}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={16}
          // UI והתנהגות
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
          testID="exercises-list"
          // Callbacks לביצועים
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          // אופטימיזציות נוספות
          disableVirtualization={false}
          legacyImplementation={false}
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
