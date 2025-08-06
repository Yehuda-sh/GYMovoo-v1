/**
 * @file src/screens/workout/ActiveWorkoutScreen.tsx
 * @brief מסך אימון פעיל - מעקב אחר אימון מלא של יום נבחר
 * @version 3.2.0
 * @author GYMovoo Development Team
 * @created 2024-12-15
 * @modified 2025-08-02
 *
 * @description
 * מסך אימון פעיל מלא המציג את כל התרגילים של האימון הנבחר עם:
 * - הצגת כל התרגילים של האימון בפריסה אחת
 * - מעקב אחר כל הסטים, משקלים וחזרות בכל תרגיל
 * - טיימר מנוחה אוטומטי לכל תרגיל
 * - מעקב התקדמות כללי של האימון (נפח, זמן, חזרות)
 * - שמירת כל הנתונים בזמן אמת
 * - אפשרות להוסיף/למחוק סטים ותרגילים
 * - 🆕 הזזת סטים בתוך תרגיל (drag & drop) במצב עריכה
 *
 * @features
 * - ✅ הצגת אימון מלא עם כל התרגילים
 * - ✅ מעקב אחר כל התרגילים, סטים ומשקלים
 * - ✅ טיימר מנוחה אוטומטי לכל תרגיל
 * - ✅ סטטיסטיקות אימון כלליות (נפח, זמן, חזרות, התקדמות)
 * - ✅ שמירת התקדמות בזמן אמת
 * - ✅ מצב אימון פעיל עם כל הפקדים
 * - ✅ גלילה חלקה בין תרגילים
 * - 🆕 onReorderSets - הזזת סטים במצב עריכה עם חצי מעלית (v3.2.0)
 *
 * @props
 * - workoutData: נתוני האימון המלא
 * - dayName: שם היום (חזה + טריצפס, גב + ביצפס וכו')
 * - exercises: רשימת כל התרגילים באימון
 *
 * @navigation
 * route.params: {
 *   workoutData: {
 *     name: string,
 *     dayName: string,
 *     exercises: Exercise[],
 *     startTime?: string
 *   }
 * }
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";

// Components
import ExerciseCard from "./components/ExerciseCard";
import { WorkoutStatusBar } from "./components/WorkoutStatusBar";
import { FloatingActionButton } from "../../components";

// Hooks & Services
import { useRestTimer } from "./hooks/useRestTimer";
import { useWorkoutTimer } from "./hooks/useWorkoutTimer";

// Utils
import {
  calculateWorkoutStats,
  formatVolume,
  workoutLogger,
} from "../../utils";

// Types
import { Exercise, Set } from "./types/workout.types";

const ActiveWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // קבלת פרמטרים מהניווט - עכשיו מקבלים אימון מלא
  const { workoutData } =
    (route.params as {
      workoutData?: {
        name?: string;
        dayName?: string;
        startTime?: string;
        exercises?: Exercise[];
      };
    }) || {};

  // Debug logging - מותנה בפיתוח
  useEffect(() => {
    workoutLogger.info("נטענו נתוני אימון", {
      workoutName: workoutData?.name,
      exerciseCount: workoutData?.exercises?.length || 0,
      exercises: workoutData?.exercises?.map((ex) => ex.name) || [],
    });
  }, [workoutData]);

  // סטייט לכל התרגילים באימון
  const [exercises, setExercises] = useState<Exercise[]>(
    workoutData?.exercises || []
  );
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);

  // פונקציות להרחבה וכיווץ של תרגילים
  const toggleExerciseExpansion = useCallback((exerciseId: string) => {
    setExpandedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  }, []);

  const isExerciseExpanded = useCallback(
    (exerciseId: string) => {
      return expandedExercises.includes(exerciseId);
    },
    [expandedExercises]
  );

  // סטטיסטיקות האימון המלא - אופטימיזציה עם יוטיליטי
  const workoutStats = useMemo(() => {
    return calculateWorkoutStats(exercises);
  }, [exercises]);

  // טיימרים
  const workoutId = `active-workout-${Date.now()}`;
  const { formattedTime, isRunning, startTimer, pauseTimer } =
    useWorkoutTimer(workoutId);
  const {
    isRestTimerActive,
    restTimeRemaining,
    startRestTimer,
    skipRestTimer,
    addRestTime,
    subtractRestTime,
  } = useRestTimer();

  // התחלת טיימר אוטומטית
  useEffect(() => {
    startTimer();
    return () => {
      pauseTimer();
      if (isRestTimerActive) {
        skipRestTimer();
      }
    };
  }, []);

  // עדכון סט בתרגיל - אופטימיזציה עם לוגר
  const handleUpdateSet = useCallback(
    (exerciseId: string, setId: string, updates: Partial<Set>) => {
      workoutLogger.setCompleted(exerciseId, setId, updates);

      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: exercise.sets.map((set: Set) => {
                if (set.id === setId) {
                  return { ...set, ...updates };
                }
                return set;
              }),
            };
          }
          return exercise;
        })
      );
    },
    []
  );

  // השלמת סט
  const handleCompleteSet = useCallback(
    (exerciseId: string, setId: string) => {
      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            const newExercise = {
              ...exercise,
              sets: exercise.sets.map((set: Set) => {
                if (set.id === setId) {
                  const isCompleting = !set.completed;

                  // אם מסמנים כמושלם ואין ערכים ממשיים, השתמש בערכי המטרה
                  if (isCompleting && !set.actualReps && !set.actualWeight) {
                    return {
                      ...set,
                      completed: isCompleting,
                      actualReps: set.targetReps,
                      actualWeight: set.targetWeight,
                    };
                  }

                  return { ...set, completed: isCompleting };
                }
                return set;
              }),
            };

            // התחל טיימר מנוחה אוטומטית
            const completedSet = newExercise.sets.find(
              (s: Set) => s.id === setId
            );
            if (completedSet?.completed) {
              const restDuration = exercise.restTime || 60;
              startRestTimer(restDuration, exercise.name);
            }

            return newExercise;
          }
          return exercise;
        })
      );
    },
    [startRestTimer]
  );

  // הוספת סט לתרגיל
  const handleAddSet = useCallback((exerciseId: string) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          const lastSet = exercise.sets[exercise.sets.length - 1];
          const newSet: Set = {
            id: `${exercise.id}_set_${Date.now()}`,
            type: "working",
            targetReps: lastSet?.targetReps || 10,
            targetWeight: lastSet?.targetWeight || 0,
            completed: false,
            isPR: false,
          };

          return {
            ...exercise,
            sets: [...exercise.sets, newSet],
          };
        }
        return exercise;
      })
    );
  }, []);

  // מחיקת סט מתרגיל
  const handleDeleteSet = useCallback(
    (exerciseId: string, setId: string) => {
      const exercise = exercises.find((ex) => ex.id === exerciseId);
      if (exercise && exercise.sets.length <= 1) {
        Alert.alert("שגיאה", "חייב להיות לפחות סט אחד בתרגיל");
        return;
      }

      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: exercise.sets.filter((set: Set) => set.id !== setId),
            };
          }
          return exercise;
        })
      );
    },
    [exercises]
  );

  // הזזת סטים בתוך תרגיל - אופטימיזציה עם לוגר
  const handleReorderSets = useCallback(
    (exerciseId: string, fromIndex: number, toIndex: number) => {
      workoutLogger.reorderSets(exerciseId, fromIndex, toIndex);

      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            const newSets = [...exercise.sets];
            const [movedSet] = newSets.splice(fromIndex, 1);
            newSets.splice(toIndex, 0, movedSet);

            return {
              ...exercise,
              sets: newSets,
            };
          }
          return exercise;
        })
      );
    },
    []
  );

  // סיום האימון המלא
  const handleFinishWorkout = useCallback(() => {
    const hasCompletedExercises = workoutStats.completedExercises > 0;

    if (!hasCompletedExercises) {
      Alert.alert(
        "אין תרגילים שהושלמו",
        "יש להשלים לפחות תרגיל אחד לפני סיום האימון",
        [{ text: "בסדר", style: "default" }]
      );
      return;
    }

    Alert.alert(
      "סיום אימון",
      `האם ברצונך לסיים את האימון?\n\nסטטיסטיקות:\n• ${workoutStats.completedExercises}/${workoutStats.totalExercises} תרגילים הושלמו\n• ${workoutStats.completedSets}/${workoutStats.totalSets} סטים הושלמו\n• ${workoutStats.totalVolume} ק"ג נפח כללי`,
      [
        { text: "המשך באימון", style: "cancel" },
        {
          text: "סיים אימון",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  }, [workoutStats, navigation]);

  // הוספת תרגיל חדש לאימון הפעיל
  const handleAddExercise = useCallback(() => {
    navigation.navigate("ExerciseList", {
      fromScreen: "ActiveWorkout",
      mode: "selection",
      onSelectExercise: (selectedExercise: Exercise) => {
        // הוסף את התרגיל החדש לרשימת התרגילים
        const newExercise: Exercise = {
          ...selectedExercise,
          id: `${selectedExercise.id}_${Date.now()}`, // ID יחודי
          sets: [
            {
              id: `${selectedExercise.id}_set_${Date.now()}`,
              type: "working",
              targetReps: 10,
              targetWeight: 0,
              completed: false,
              isPR: false,
            },
          ],
        };

        setExercises((prev) => [...prev, newExercise]);

        // חזור למסך האימון הפעיל
        navigation.goBack();
      },
    });
  }, [navigation]);

  if (exercises.length === 0) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <BackButton />
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={80}
          color={theme.colors.error}
        />
        <Text style={styles.errorText}>לא נמצאו תרגילים באימון</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton absolute={false} variant="minimal" />

        <View style={styles.headerInfo}>
          <Text style={styles.exerciseTitle}>
            {workoutData?.name || "אימון פעיל"}
          </Text>
          <Text style={styles.progressText}>
            {workoutStats.completedExercises}/{workoutStats.totalExercises}{" "}
            תרגילים • {workoutStats.progressPercentage}% הושלם
          </Text>
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>

        <View style={styles.headerActions}>
          {/* כפתור הפסקה/המשכה עם טקסט */}
          <TouchableOpacity
            style={[styles.headerButton, styles.timerButton]}
            onPress={() => (isRunning ? pauseTimer() : startTimer())}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isRunning ? "עצור טיימר" : "התחל טיימר"}
          >
            <MaterialCommunityIcons
              name={isRunning ? "pause" : "play"}
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.headerButtonText}>
              {isRunning ? "השהה" : "המשך"}
            </Text>
          </TouchableOpacity>

          {/* כפתור סיים אימון עם טקסט */}
          <TouchableOpacity
            style={[styles.headerButton, styles.finishButtonSmall]}
            onPress={handleFinishWorkout}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="סיים אימון"
          >
            <MaterialCommunityIcons
              name="flag-checkered"
              size={18}
              color={theme.colors.success}
            />
            <Text style={styles.finishButtonSmallText}>סיים</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Bar - Rest Timer */}
      <WorkoutStatusBar
        isRestActive={isRestTimerActive}
        restTimeLeft={restTimeRemaining}
        onAddRestTime={addRestTime}
        onSubtractRestTime={subtractRestTime}
        onSkipRest={skipRestTimer}
        nextExercise={null}
        onSkipToNext={() => {}}
      />

      {/* Workout Stats - פורמט משופר */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{workoutStats.completedSets}</Text>
          <Text style={styles.statLabel}>סטים הושלמו</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatVolume(workoutStats.totalVolume)}
          </Text>
          <Text style={styles.statLabel}>נפח (ק"ג)</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{workoutStats.totalReps}</Text>
          <Text style={styles.statLabel}>חזרות</Text>
        </View>
      </View>

      {/* All Exercises List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            sets={exercise.sets}
            onUpdateSet={(setId: string, updates: Partial<Set>) =>
              handleUpdateSet(exercise.id, setId, updates)
            }
            onAddSet={() => handleAddSet(exercise.id)}
            onCompleteSet={(setId: string) =>
              handleCompleteSet(exercise.id, setId)
            }
            onDeleteSet={(setId: string) => handleDeleteSet(exercise.id, setId)}
            onReorderSets={(fromIndex: number, toIndex: number) =>
              handleReorderSets(exercise.id, fromIndex, toIndex)
            }
            onRemoveExercise={() => {
              Alert.alert(
                "מחיקת תרגיל",
                "האם אתה בטוח שברצונך למחוק את התרגיל?",
                [
                  { text: "ביטול", style: "cancel" },
                  {
                    text: "מחק",
                    style: "destructive",
                    onPress: () => {
                      setExercises((prev) =>
                        prev.filter((ex) => ex.id !== exercise.id)
                      );
                    },
                  },
                ]
              );
            }}
            onStartRest={(duration: number) => {
              startRestTimer(duration, exercise.name);
            }}
            isFirst={index === 0}
            isLast={index === exercises.length - 1}
          />
        ))}
      </ScrollView>

      {/* Finish Workout Button */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.finishWorkoutButton}
          onPress={handleFinishWorkout}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="סיים אימון"
        >
          <Text style={styles.finishButtonText}>סיים אימון</Text>
          <MaterialCommunityIcons
            name="check"
            size={24}
            color={theme.colors.card}
          />
        </TouchableOpacity>
      </View>

      {/* FloatingActionButton להוספת תרגילים */}
      <FloatingActionButton
        onPress={handleAddExercise}
        icon="add"
        label="הוסף תרגיל"
        visible={true}
        bottom={120} // מעל הכפתור סיים אימון
        size="medium"
        accessibilityLabel="הוסף תרגיל חדש לאימון"
        accessibilityHint="לחץ כדי לבחור תרגיל חדש להוספה לאימון הנוכחי"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    textAlign: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.small,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: theme.spacing.md,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  timeText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  // 🆕 סטיילים משופרים לכפתורי ההדר
  headerActions: {
    flexDirection: "row-reverse",
    gap: theme.spacing.sm,
    alignItems: "center",
  },

  // סטייל משותף לכפתורי הדר
  headerButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    minWidth: 70,
    justifyContent: "center",
    borderWidth: 1,
  },

  timerButton: {
    backgroundColor: theme.colors.primary + "20",
    borderColor: theme.colors.primary + "30",
    minWidth: 80,
  },

  finishButtonSmall: {
    backgroundColor: theme.colors.success + "20",
    borderColor: theme.colors.success + "30",
  },

  headerButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },

  finishButtonSmallText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.success,
  },
  statsContainer: {
    flexDirection: "row-reverse",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    ...theme.shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  navigationContainer: {
    flexDirection: "row-reverse",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  navButton: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  prevButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  navButtonText: {
    color: theme.colors.card,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  finishButton: {
    flex: 2,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  finishButtonText: {
    color: theme.colors.card,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  finishWorkoutButton: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
});

export default ActiveWorkoutScreen;
