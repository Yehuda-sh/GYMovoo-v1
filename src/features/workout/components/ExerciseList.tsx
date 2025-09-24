/**
 * @file src/features/workout/components/ExerciseList.tsx
 * @brief Exercise accordion list with muscle group tags - extracted from WorkoutPlansScreen
 * Handles exercise expansion, muscle group colors, and exercise details
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../../core/theme";

interface ExerciseLite {
  id?: string;
  name?: string;
  targetMuscles?: string[];
  equipment?: string;
  sets?: Array<{
    id?: string;
    reps?: number;
    weight?: number;
  }>;
}

interface WorkoutDayLite {
  id?: string;
  name?: string;
  exercises?: ExerciseLite[];
}

interface ExerciseListProps {
  selectedWorkout: WorkoutDayLite | undefined;
  expandedExercises: Set<string>;
  onExercisePress: (exercise: ExerciseLite) => void;
  onToggleExpansion: (exerciseId: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  selectedWorkout,
  expandedExercises,
  onExercisePress,
  onToggleExpansion,
}) => {
  // Simple muscle group name detection (from original component)
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

  if (!selectedWorkout?.exercises?.length) {
    return (
      <View style={styles.noExercisesContainer}>
        <Text style={styles.noExercisesText}>אין תרגילים זמינים</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.exercisesList}>
        <Text style={styles.exercisesHeader}>תרגילים:</Text>
        <Text style={styles.exercisesSubHeader}>
          לחץ על תרגיל כדי לראות פרטים מלאים
        </Text>

        {/* הנחיות כלליות למתחילים - מודגשות */}
        <View style={styles.prominentBeginnerTips}>
          <Text style={styles.prominentBeginnerTipsTitle}>
            🎯 הנחיות חשובות למתחילים
          </Text>
          <Text style={styles.prominentBeginnerTipsText}>
            💪 התחל עם משקלים קלים ובנה הדרגתית{"\n\n"}✅ טכניקה נכונה חשובה
            יותר ממשקל כבד{"\n\n"}
            📉 אם קשה לסיים את כל החזרות - הקל במשקל{"\n\n"}
            📈 אם קל מדי - הוסף משקל בהדרגה
          </Text>
        </View>

        {selectedWorkout.exercises.map((exercise, exerciseIndex) => {
          const exerciseId = exercise.id || `exercise-${exerciseIndex}`;
          const isExpanded = expandedExercises.has(exerciseId);
          const muscleName = getMuscleGroupName(exercise.name || "");
          // Simple muscle group color mapping (extracted from original)
          const getMuscleGroupColorSimple = (exerciseName: string): string => {
            const name = exerciseName.toLowerCase();

            if (
              name.includes("חזה") ||
              name.includes("דחיפ") ||
              name.includes("push") ||
              name.includes("bench")
            ) {
              return "#FF6B35"; // כתום - חזה
            }
            if (
              name.includes("גב") ||
              name.includes("משיכ") ||
              name.includes("pull") ||
              name.includes("רואינג")
            ) {
              return "#4A90E2"; // כחול - גב
            }
            if (
              name.includes("כתף") ||
              name.includes("shoulder") ||
              name.includes("דלתא")
            ) {
              return "#FFA726"; // צהוב-כתום - כתפיים
            }
            if (
              name.includes("זרוע") ||
              name.includes("ביצפס") ||
              name.includes("טריצפס") ||
              name.includes("bicep") ||
              name.includes("tricep")
            ) {
              return "#66BB6A"; // ירוק - זרועות
            }
            if (
              name.includes("רגל") ||
              name.includes("כפיפה") ||
              name.includes("דריכה") ||
              name.includes("squat") ||
              name.includes("leg")
            ) {
              return "#EF5350"; // אדום - רגליים
            }
            if (
              name.includes("ליבה") ||
              name.includes("בטן") ||
              name.includes("פלאנק") ||
              name.includes("קרנץ'")
            ) {
              return "#AB47BC"; // סגול - ליבה
            }
            if (
              name.includes("קרדיו") ||
              name.includes("ריצה") ||
              name.includes("jumping") ||
              name.includes("burpee") ||
              name.includes("cardio")
            ) {
              return "#E91E63"; // ורוד - קרדיו
            }

            return "#95A5A6"; // אפור - ברירת מחדל
          };

          const muscleColor = getMuscleGroupColorSimple(exercise.name || "");

          return (
            <View key={exerciseId} style={styles.exerciseAccordion}>
              <TouchableOpacity
                style={styles.exerciseAccordionHeader}
                onPress={() => onToggleExpansion(exerciseId)}
                accessibilityLabel={`${isExpanded ? "סגור" : "פתח"} פרטי תרגיל ${exercise.name}`}
                accessibilityHint="לחץ כדי לפתוח או לסגור פרטי התרגיל"
              >
                <View style={styles.exerciseHeaderRow}>
                  {/* Muscle Group Color Tag */}
                  <View
                    style={[
                      styles.muscleGroupTag,
                      { backgroundColor: muscleColor },
                    ]}
                  >
                    <Text style={styles.muscleGroupTagText}>{muscleName}</Text>
                  </View>

                  <View style={styles.exerciseHeaderInfo}>
                    <Text style={styles.exerciseHeaderName}>
                      {exercise.name}
                    </Text>
                    <Text style={styles.exerciseHeaderSummary}>
                      {exercise.sets?.length || 3} סטים •{" "}
                      {exercise.sets?.[0]?.reps || 12} חזרות
                    </Text>
                  </View>

                  {/* Expand/Collapse Icon */}
                  <View style={styles.expandIcon}>
                    <Text style={styles.expandIconText}>
                      {isExpanded ? "▲" : "▼"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Expanded Content */}
              {isExpanded && (
                <View style={styles.exerciseAccordionContent}>
                  <View style={styles.exerciseDetailRow}>
                    <View style={styles.exerciseImage}>
                      <Text style={styles.exerciseImagePlaceholder}>💪</Text>
                    </View>

                    <View style={styles.exerciseDetailInfo}>
                      <Text style={styles.exerciseEquipment}>
                        🏋️ {exercise.equipment}
                      </Text>
                      {exercise.equipment !== "bodyweight" && (
                        <Text style={styles.exerciseWeightTip}>
                          משקל: התחל קל ובנה הדרגתית
                        </Text>
                      )}
                      <TouchableOpacity
                        style={styles.moreDetailsButton}
                        onPress={() => onExercisePress(exercise)}
                      >
                        <Text style={styles.moreDetailsButtonText}>
                          פרטים מלאים
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  noExercisesContainer: {
    padding: 20,
    alignItems: "center",
  },
  noExercisesText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  exercisesList: {
    marginTop: 8,
  },
  exercisesHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  exercisesSubHeader: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  prominentBeginnerTips: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  prominentBeginnerTipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  prominentBeginnerTipsText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  exerciseAccordion: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  exerciseAccordionHeader: {
    padding: 12,
  },
  exerciseHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  muscleGroupTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 60,
    alignItems: "center",
  },
  muscleGroupTagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  exerciseHeaderInfo: {
    flex: 1,
  },
  exerciseHeaderName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  exerciseHeaderSummary: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  expandIcon: {
    padding: 4,
  },
  expandIconText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
  exerciseAccordionContent: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  exerciseDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  exerciseImage: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  exerciseImagePlaceholder: {
    fontSize: 24,
  },
  exerciseDetailInfo: {
    flex: 1,
  },
  exerciseEquipment: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  exerciseWeightTip: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  moreDetailsButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  moreDetailsButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ExerciseList;
