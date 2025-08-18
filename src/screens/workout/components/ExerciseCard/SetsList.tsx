/**
 * @file src/screens/workout/components/ExerciseCard/SetsList.tsx
 * @brief רשימת סטים עם כותרות טבלה
 * @features React.memo, אופטימיזציות ביצועים
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";
import SetRow from "./SetRow";
import { Set as WorkoutSet } from "../../types/workout.types";

interface SetsListProps {
  sets: WorkoutSet[];
  isEditMode: boolean;
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
  onDeleteSet?: (setId: string) => void;
  onCompleteSet: (setId: string, isCompleting?: boolean) => void;
  onSetLongPress: (setId: string) => void;
  onMoveSetUp: (setIndex: number) => void;
  onMoveSetDown: (setIndex: number) => void;
  onDuplicateSet: (setIndex: number) => void;
}

// Centralize table headers into a constant object
const TABLE_HEADERS = {
  setNumber: "סט",
  previous: "קודם",
  weight: "משקל",
  reps: "חזרות",
  actions: "פעולות",
};

const SetsList: React.FC<SetsListProps> = React.memo(
  ({
    sets,
    isEditMode,
    onUpdateSet,
    onDeleteSet,
    onCompleteSet,
    onSetLongPress,
    onMoveSetUp,
    onMoveSetDown,
    onDuplicateSet,
  }) => {
    return (
      <View style={styles.setsList}>
        {/* Table headers */}
        <View style={styles.setsTableHeader}>
          <View style={styles.setNumberHeader}>
            <Text style={styles.headerText}>{TABLE_HEADERS.setNumber}</Text>
          </View>
          <View style={styles.previousHeader}>
            <Text style={styles.headerText}>{TABLE_HEADERS.previous}</Text>
          </View>
          <View style={styles.weightHeader}>
            <Text style={styles.headerText}>{TABLE_HEADERS.weight}</Text>
          </View>
          <View style={styles.repsHeader}>
            <Text style={styles.headerText}>{TABLE_HEADERS.reps}</Text>
          </View>
          <View style={styles.actionsHeader}>
            <Text style={styles.headerText}>{TABLE_HEADERS.actions}</Text>
          </View>
        </View>

        {/* Sets rows */}
        {sets.map((set, index) => {
          const handleUpdate = (updates: Partial<WorkoutSet>) => {
            onUpdateSet(set.id, updates);
          };

          const handleComplete = () => {
            const currentSet = sets.find((s) => s.id === set.id);
            const isCompleting = !currentSet?.completed;
            onCompleteSet(set.id, isCompleting);
          };

          return (
            <SetRow
              key={set.id}
              set={set}
              setNumber={index + 1}
              onUpdate={handleUpdate}
              onDelete={() => onDeleteSet?.(set.id)}
              onComplete={handleComplete}
              onLongPress={() => onSetLongPress(set.id)}
              isActive={index === 0 && !set.completed}
              isEditMode={isEditMode}
              onMoveUp={index > 0 ? () => onMoveSetUp(index) : undefined}
              onMoveDown={
                index < sets.length - 1 ? () => onMoveSetDown(index) : undefined
              }
              onDuplicate={() => onDuplicateSet(index)}
              isFirst={index === 0}
              isLast={index === sets.length - 1}
            />
          );
        })}
      </View>
    );
  }
);

SetsList.displayName = "SetsList";

const styles = StyleSheet.create({
  setsList: {
    gap: theme.spacing.sm,
  },
  setsTableHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  setNumberHeader: {
    width: 50,
    alignItems: "center",
    marginStart: 8,
  },
  previousHeader: {
    flex: 1.2,
    alignItems: "center",
  },
  weightHeader: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  repsHeader: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionsHeader: {
    width: 80,
    alignItems: "center",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
});

export default SetsList;
