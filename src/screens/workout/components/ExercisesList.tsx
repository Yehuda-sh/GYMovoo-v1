/**
 * @file src/screens/workout/components/ExercisesList.tsx
 * @brief רשימה וירטואלית מותאמת לתרגילי אימון עם אופטימיזציות ביצועים
 * @dependencies FlatList, ExerciseRow
 * @notes ביצועים מותאמים עם windowing, batching ו-memoization
 */

import React, { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, ListRenderItem } from "react-native";
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
        return performance.now();
      }
      return 0;
    }, []);

    React.useEffect(() => {
      if (__DEV__ && renderStart > 0) {
        const renderEnd = performance.now();
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

    // הערכת גובה פריט בסיסית (אופציונלית - לשיפור ביצועים)
    const getItemLayout = useCallback(
      (_data: ArrayLike<WorkoutExercise> | null | undefined, index: number) => {
        // הערכה בסיסית - כרטיס תרגיל ממוצע
        const ESTIMATED_ITEM_HEIGHT = 200; // גובה בסיסי בפיקסלים
        return {
          length: ESTIMATED_ITEM_HEIGHT,
          offset: ESTIMATED_ITEM_HEIGHT * index,
          index,
        };
      },
      []
    );

    // Callback לסיום רינדור רשימה
    const onEndReached = useCallback(() => {
      if (__DEV__) {
        logger.debug("Performance", "ExercisesList: Reached end of list");
      }
    }, []);

    return (
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
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
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
});

export default ExercisesList;
