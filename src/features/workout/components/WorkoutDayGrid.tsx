/**
 * @file src/features/workout/components/WorkoutDayGrid.tsx
 * @brief Dynamic workout day selection grid - extracted from WorkoutPlansScreen
 * Handles responsive grid layout for workout day selection
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../../core/theme";
import UniversalCard from "../../../components/ui/UniversalCard";
interface WorkoutDayLite {
  id?: string;
  name?: string;
  exercises?: Array<{
    id?: string;
    name?: string;
    targetMuscles?: string[];
    equipment?: string;
  }>;
  targetMuscles?: string[];
}

interface WorkoutDayGridProps {
  workoutGridData: WorkoutDayLite[][];
  selectedDayIndex: number;
  onDaySelect: (index: number) => void;
  generateWorkoutDayName: (index: number) => string;
  gridConfig: {
    columns: number;
    itemWidth: number;
    gap: number;
  };
}

const WorkoutDayGrid: React.FC<WorkoutDayGridProps> = ({
  workoutGridData,
  selectedDayIndex,
  onDaySelect,
  generateWorkoutDayName,
  gridConfig,
}) => {
  // Simple muscle group name detection (extracted from original)
  const getMuscleGroupName = (exerciseName: string): string => {
    const name = exerciseName.toLowerCase();

    if (
      name.includes("דחיפ") ||
      name.includes("push") ||
      name.includes("חזה") ||
      name.includes("bench")
    )
      return "חזה";
    if (
      name.includes("משיכ") ||
      name.includes("pull") ||
      name.includes("גב") ||
      name.includes("רואינג")
    )
      return "גב";
    if (
      name.includes("כתפ") ||
      name.includes("shoulder") ||
      name.includes("דלתא")
    )
      return "כתפיים";
    if (
      name.includes("ביצפס") ||
      name.includes("טריצפס") ||
      name.includes("זרוע") ||
      name.includes("bicep") ||
      name.includes("tricep")
    )
      return "זרועות";
    if (
      name.includes("כפיפה") ||
      name.includes("כפיפות") ||
      name.includes("דריכה") ||
      name.includes("רגל") ||
      name.includes("squat") ||
      name.includes("leg")
    )
      return "רגליים";
    if (
      name.includes("בטן") ||
      name.includes("פלאנק") ||
      name.includes("ליבה") ||
      name.includes("קרנץ'") ||
      name.includes("ליבה")
    )
      return "ליבה";
    if (
      name.includes("ריצה") ||
      name.includes("jumping") ||
      name.includes("burpee") ||
      name.includes("cardio") ||
      name.includes("אירובי")
    )
      return "קרדיו";

    return "כללי";
  };

  // Generate muscle groups description
  const generateMuscleGroupDescription = (workout: WorkoutDayLite): string => {
    const muscleGroupsSet = new Set<string>();
    const exerciseTypes = new Set<string>();

    workout.exercises?.forEach((exercise) => {
      const exerciseName = exercise.name?.toLowerCase() || "";

      // Use simple muscle group mapping
      const muscleGroup = getMuscleGroupName(exerciseName);
      if (muscleGroup !== "כללי") {
        muscleGroupsSet.add(muscleGroup);
      }

      // Check for cardio
      if (
        exerciseName.includes("ריצה") ||
        exerciseName.includes("jumping") ||
        exerciseName.includes("burpee") ||
        exerciseName.includes("cardio") ||
        exerciseName.includes("אירובי")
      ) {
        exerciseTypes.add("קרדיו");
      }
    });

    // Also check target muscles if available
    if (workout.targetMuscles && workout.targetMuscles.length > 0) {
      workout.targetMuscles.forEach((muscle) => {
        const lowerMuscle = muscle.toLowerCase();
        if (lowerMuscle.includes("chest") || lowerMuscle.includes("חזה")) {
          muscleGroupsSet.add("חזה");
        }
        if (lowerMuscle.includes("back") || lowerMuscle.includes("גב")) {
          muscleGroupsSet.add("גב");
        }
        if (lowerMuscle.includes("shoulder") || lowerMuscle.includes("כתף")) {
          muscleGroupsSet.add("כתפיים");
        }
        if (lowerMuscle.includes("arm") || lowerMuscle.includes("זרוע")) {
          muscleGroupsSet.add("זרועות");
        }
        if (lowerMuscle.includes("leg") || lowerMuscle.includes("רגל")) {
          muscleGroupsSet.add("רגליים");
        }
        if (lowerMuscle.includes("core") || lowerMuscle.includes("ליבה")) {
          muscleGroupsSet.add("ליבה");
        }
      });
    }

    const groups = Array.from(muscleGroupsSet);
    const types = Array.from(exerciseTypes);
    const allGroups = [...groups, ...types];

    if (allGroups.length === 0) {
      return "אימון כללי";
    }

    if (allGroups.length === 1) {
      return allGroups[0] || "אימון כללי";
    }

    if (allGroups.length === 2) {
      return allGroups.join(" + ");
    }

    if (allGroups.length >= 3) {
      return "כל הגוף";
    }

    return allGroups.slice(0, 2).join(" + ");
  };

  if (workoutGridData.length === 0) return null;

  return (
    <UniversalCard title="בחר יום אימון">
      <View style={styles.workoutDaysGrid}>
        {workoutGridData.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((workout, columnIndex) => {
              const workoutIndex = rowIndex * gridConfig.columns + columnIndex;
              const isSelected = selectedDayIndex === workoutIndex;

              return (
                <TouchableOpacity
                  key={workout.id || workoutIndex}
                  style={[
                    styles.dayGridCard,
                    { width: gridConfig.itemWidth },
                    isSelected && styles.activeDayGridCard,
                  ]}
                  onPress={() => onDaySelect(workoutIndex)}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.dayGridCardTitle,
                      isSelected && styles.activeDayGridCardTitle,
                    ]}
                  >
                    {generateWorkoutDayName(workoutIndex)}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.dayGridCardSubtext,
                      isSelected && styles.activeDayGridCardSubtext,
                    ]}
                  >
                    {generateMuscleGroupDescription(workout) !== "כל הגוף"
                      ? generateMuscleGroupDescription(workout)
                      : "כל הגוף"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </UniversalCard>
  );
};

const styles = StyleSheet.create({
  workoutDaysGrid: {
    paddingHorizontal: 4,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayGridCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    minHeight: 70,
    justifyContent: "center",
  },
  activeDayGridCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  dayGridCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  activeDayGridCardTitle: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  dayGridCardSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  activeDayGridCardSubtext: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});

export default WorkoutDayGrid;
