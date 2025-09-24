/**
 * @file src/features/workout/screens/workout_screens/components/ActiveExercisesList.tsx
 * @brief Active exercises list component with ExerciseItem for ActiveWorkoutScreen
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { WorkoutExercise } from "../../../../../core/types/workout.types";

// Extended interface for active workout with additional UI fields
interface ActiveWorkoutExercise extends WorkoutExercise {
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  restTime?: number;
}

interface ExerciseItemProps {
  exercise: ActiveWorkoutExercise;
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: number
  ) => void;
  onCompleteSet: (exerciseId: string, setId: string) => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  onUpdateSet,
  onCompleteSet,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
}) => {
  const completedSets =
    exercise.sets?.filter((set) => set.completed).length || 0;
  const targetSets = exercise.targetSets || exercise.sets?.length || 1;
  const progressPercentage = (completedSets / targetSets) * 100;

  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseProgress}>
            {completedSets}/{targetSets} סטים ({Math.round(progressPercentage)}
            %)
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemoveExercise(exercise.id)}
        >
          <MaterialIcons name="delete" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progressPercentage}%` }]}
        />
      </View>

      <View style={styles.setsContainer}>
        <View style={styles.setHeader}>
          <Text style={styles.setHeaderText}>סט</Text>
          <Text style={styles.setHeaderText}>משקל</Text>
          <Text style={styles.setHeaderText}>חזרות</Text>
          <Text style={styles.setHeaderText}>✓</Text>
        </View>

        {(exercise.sets || []).map((set, index) => (
          <View key={set.id} style={styles.setRow}>
            <Text style={styles.setNumber}>{index + 1}</Text>

            <TextInput
              style={styles.setInput}
              value={(set.actualWeight || set.targetWeight || 0).toString()}
              onChangeText={(text) =>
                onUpdateSet(exercise.id, set.id, "weight", parseInt(text) || 0)
              }
              keyboardType="numeric"
              placeholder="0"
            />

            <TextInput
              style={styles.setInput}
              value={(set.actualReps || set.targetReps || 0).toString()}
              onChangeText={(text) =>
                onUpdateSet(exercise.id, set.id, "reps", parseInt(text) || 0)
              }
              keyboardType="numeric"
              placeholder="0"
            />

            <View style={styles.setActions}>
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  set.completed && styles.completeButtonActive,
                ]}
                onPress={() => onCompleteSet(exercise.id, set.id)}
              >
                <MaterialIcons
                  name="check"
                  size={20}
                  color={
                    set.completed ? theme.colors.card : theme.colors.primary
                  }
                />
              </TouchableOpacity>

              {(exercise.sets?.length || 0) > 1 && (
                <TouchableOpacity
                  style={styles.removeSetButton}
                  onPress={() => onRemoveSet(exercise.id, set.id)}
                >
                  <MaterialIcons
                    name="remove"
                    size={16}
                    color={theme.colors.error}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addSetButton}
          onPress={() => onAddSet(exercise.id)}
        >
          <MaterialCommunityIcons
            name="plus"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.addSetText}>הוסף סט</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface ActiveExercisesListProps {
  exercises: ActiveWorkoutExercise[];
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: number
  ) => void;
  onCompleteSet: (exerciseId: string, setId: string) => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

export const ActiveExercisesList: React.FC<ActiveExercisesListProps> = ({
  exercises,
  onUpdateSet,
  onCompleteSet,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
}) => {
  return (
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ExerciseItem
          exercise={item}
          onUpdateSet={onUpdateSet}
          onCompleteSet={onCompleteSet}
          onAddSet={onAddSet}
          onRemoveSet={onRemoveSet}
          onRemoveExercise={onRemoveExercise}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: theme.spacing.md,
    paddingBottom: 100, // Space for footer
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  exerciseProgress: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  setsContainer: {
    gap: theme.spacing.sm,
  },
  setHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  setHeaderText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  setNumber: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  setInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    textAlign: "center",
    fontSize: 16,
    color: theme.colors.text,
  },
  setActions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  completeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  completeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  removeSetButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.error + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  addSetText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
