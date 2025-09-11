/**
 * @file src/screens\workout\components\ExerciseCard\SetsList.tsx
 * @brief רשימת סטים עם כותרות טבלה ועיצוב מתקדם
 * @features React.memo, אופטימיזציות ביצועים, עיצוב premium
 * @updated 2025-08-24 Enhanced with advanced design patterns and premium UI
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";
import { Set as WorkoutSet } from "../../types/workout.types";
import SetRow from "./SetRow";

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

// Header configuration with styles
const HEADER_CONFIG = [
  {
    key: "setNumber",
    label: TABLE_HEADERS.setNumber,
    style: "setNumberHeader",
  },
  { key: "previous", label: TABLE_HEADERS.previous, style: "previousHeader" },
  { key: "weight", label: TABLE_HEADERS.weight, style: "weightHeader" },
  { key: "reps", label: TABLE_HEADERS.reps, style: "repsHeader" },
  { key: "actions", label: TABLE_HEADERS.actions, style: "actionsHeader" },
] as const;

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
          {HEADER_CONFIG.map(({ key, label, style }) => (
            <View key={key} style={styles[style]}>
              <Text style={styles.headerText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Sets rows */}
        {sets.length > 0 ? (
          sets.map((set, index) => {
            const handleUpdate = (updates: Partial<WorkoutSet>) => {
              onUpdateSet(set.id, updates);
            };

            const handleComplete = () => {
              const isCompleting = !set.completed;
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
                {...(index > 0 && { onMoveUp: () => onMoveSetUp(index) })}
                {...(index < sets.length - 1 && {
                  onMoveDown: () => onMoveSetDown(index),
                })}
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
    shadowColor: theme.colors.shadow,
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
    shadowColor: theme.colors.shadow,
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
