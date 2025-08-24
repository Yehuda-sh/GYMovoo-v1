/**
 * @file src/screens\workout\components\ExerciseCard\SetsList.tsx
 * @brief רשימת סטים עם כותרות טבלה ועיצוב מתקדם
 * @features React.memo, אופטימיזציות ביצועים, עיצוב premium
 * @updated 2025-08-24 Enhanced with advanced design patterns and premium UI
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
    // Debug logging
    if (__DEV__) {
      console.warn("📋 SetsList rendering:", {
        setsCount: sets.length,
        isEditMode,
        sets: sets.map((s) => ({
          id: s.id,
          completed: s.completed,
          targetReps: s.targetReps,
        })),
      });
    }

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
        {sets.length > 0 ? (
          sets.map((set, index) => {
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
                  index < sets.length - 1
                    ? () => onMoveSetDown(index)
                    : undefined
                }
                onDuplicate={() => onDuplicateSet(index)}
                isFirst={index === 0}
                isLast={index === sets.length - 1}
              />
            );
          })
        ) : (
          <View style={styles.emptySets}>
            <Text style={styles.emptySetsText}>
              ⚠️ אין סטים זמינים{"\n"}
              <Text style={styles.emptySetsSubtext}>
                הוסף סטים כדי להתחיל את האימון
              </Text>
            </Text>
          </View>
        )}
      </View>
    );
  }
);

SetsList.displayName = "SetsList";

const styles = StyleSheet.create({
  setsList: {
    gap: theme.spacing.md,
  },
  setsTableHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Premium shadows for enhanced depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    // Subtle gradient-like effect with border
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary + "20",
  },
  setNumberHeader: {
    width: 56,
    alignItems: "center",
    marginStart: 10,
  },
  previousHeader: {
    flex: 1.3,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  weightHeader: {
    flex: 1.1,
    alignItems: "center",
    marginHorizontal: 6,
  },
  repsHeader: {
    flex: 1.1,
    alignItems: "center",
    marginHorizontal: 6,
  },
  actionsHeader: {
    width: 88,
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    lineHeight: 18,
    // Enhanced typography for premium feel
    textShadowColor: theme.colors.background,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  emptySets: {
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 16,
    marginTop: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border + "40",
    borderStyle: "dashed",
    // Enhanced empty state design
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
  },
  emptySetsText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.5,
    // Enhanced empty text styling
    marginTop: 4,
  },
  emptySetsSubtext: {
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.7,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default SetsList;
