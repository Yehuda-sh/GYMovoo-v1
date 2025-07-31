/**
 * @file src/screens/workout/ActiveWorkoutScreen.tsx
 * @brief מסך מצב אימון - מעקב אחר אימון מלא של יום נבחר
 * @version 3.0.0
 * @author GYMovoo Development Team
 * @created 2024-12-15
 * @modified 2025-07-31
 *
 * @description
 * מסך מצב אימון מלא המציג את כל התרגילים של האימון הנבחר עם:
 * - הצגת כל התרגילים של האימון
 * - מעקב אחר כל הסטים, משקלים וחזרות
 * - טיימר מנוחה אוטומטי לכל תרגיל
 * - מעקב התקדמות כללי של האימון
 * - שמירת כל הנתונים בזמן אמת
 *
 * @features
 * - ✅ הצגת אימון מלא של יום נבחר
 * - ✅ מעקב אחר כל התרגילים, סטים ומשקלים
 * - ✅ טיימר מנוחה אוטומטי לכל תרגיל
 * - ✅ סטטיסטיקות אימון כלליות (נפח, זמן, חזרות)
 * - ✅ שמירת התקדמות בזמן אמת
 * - ✅ מצב אימון פעיל עם כל הפקדים
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

// Components
import ExerciseCard from "./components/ExerciseCard";
import { WorkoutStatusBar } from "./components/WorkoutStatusBar";

// Hooks & Services
import { useRestTimer } from "./hooks/useRestTimer";
import { useWorkoutTimer } from "./hooks/useWorkoutTimer";

// Types
import { Exercise, Set } from "./types/workout.types";

const ActiveWorkoutScreen: React.FC = () => {
  console.log("🎬 ActiveWorkoutScreen - מסך מצב אימון מלא");

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

  console.log("🏋️ ActiveWorkout - נתוני אימון:", {
    workoutName: workoutData?.name,
    dayName: workoutData?.dayName,
    exercisesCount: workoutData?.exercises?.length,
  });

  // סטייט לכל התרגילים באימון
  const [exercises, setExercises] = useState<Exercise[]>(
    workoutData?.exercises || []
  );
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  // משתנים נגזרים
  const exercise = exercises[currentExerciseIndex];
  const exerciseIndex = currentExerciseIndex;
  const totalExercises = exercises.length;

  // סטטיסטיקות התרגיל הנוכחי
  const exerciseStats = useMemo(() => {
    if (!exercise?.sets) {
      return {
        completedSets: 0,
        totalSets: 0,
        totalVolume: 0,
        totalReps: 0,
      };
    }

    let completedSets = 0;
    let totalVolume = 0;
    let totalReps = 0;

    exercise.sets.forEach((set: Set) => {
      if (set.completed) {
        completedSets++;
        const reps = set.actualReps || set.targetReps || 0;
        const weight = set.actualWeight || set.targetWeight || 0;
        totalReps += reps;
        totalVolume += reps * weight;
      }
    });

    return {
      completedSets,
      totalSets: exercise.sets.length,
      totalVolume,
      totalReps,
    };
  }, [exercise]);

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

  // סטטיסטיקות האימון הכללי
  // הוסר workoutStats כי לא בשימוש

  // עדכון תרגיל ברשימה
  // הוסר updateExercise כי לא בשימוש

  // עדכון סט בתרגיל
  const handleUpdateSet = useCallback(
    (exerciseId: string, setId: string, updates: Partial<Set>) => {
      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: exercise.sets.map((set: Set) =>
                set.id === setId ? { ...set, ...updates } : set
              ),
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

  // ניווט לתרגיל הקודם
  const handlePrevious = useCallback(() => {
    if (exerciseIndex > 0) {
      console.log(`🔙 מעבר לתרגיל הקודם: ${exerciseIndex - 1}`);
      setCurrentExerciseIndex(exerciseIndex - 1);
    }
  }, [exerciseIndex]);

  // ניווט לתרגיל הבא
  const handleNext = useCallback(() => {
    if (exerciseIndex < totalExercises - 1) {
      console.log(`🔄 מעבר לתרגיל הבא: ${exerciseIndex + 1}`);
      setCurrentExerciseIndex(exerciseIndex + 1);
    } else {
      console.log("✅ סיום האימון - כל התרגילים הושלמו");
      navigation.goBack();
    }
  }, [exerciseIndex, totalExercises, navigation]);

  // סיום תרגיל
  const handleFinishExercise = useCallback(() => {
    if (exerciseStats.completedSets === 0) {
      Alert.alert(
        "אין סטים שהושלמו",
        "יש להשלים לפחות סט אחד לפני המעבר לתרגיל הבא",
        [{ text: "בסדר", style: "default" }]
      );
      return;
    }

    handleNext();
  }, [exerciseStats.completedSets, handleNext]);

  if (!exercise) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={80}
          color={theme.colors.error}
        />
        <Text style={styles.errorText}>שגיאה בטעינת התרגיל</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>חזור</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="חזור לאימון הכללי"
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
          <Text style={styles.progressText}>
            תרגיל {exerciseIndex + 1} מתוך {totalExercises}
          </Text>
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>

        <TouchableOpacity
          style={styles.timerButton}
          onPress={() => (isRunning ? pauseTimer() : startTimer())}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isRunning ? "עצור טיימר" : "התחל טיימר"}
        >
          <MaterialCommunityIcons
            name={isRunning ? "pause" : "play"}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Status Bar - Rest Timer */}
      <WorkoutStatusBar
        isRestActive={isRestTimerActive}
        restTimeLeft={restTimeRemaining}
        onAddRestTime={addRestTime}
        onSubtractRestTime={subtractRestTime}
        onSkipRest={skipRestTimer}
        nextExercise={null} // לא רלוונטי במסך תרגיל יחיד
        onSkipToNext={() => {}}
      />

      {/* Exercise Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{exerciseStats.completedSets}</Text>
          <Text style={styles.statLabel}>סטים הושלמו</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{exerciseStats.totalVolume}</Text>
          <Text style={styles.statLabel}>נפח כללי (ק"ג)</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{exerciseStats.totalReps}</Text>
          <Text style={styles.statLabel}>חזרות</Text>
        </View>
      </View>

      {/* Exercise Card */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ExerciseCard
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
          onRemoveExercise={() => {
            Alert.alert(
              "מחיקת תרגיל",
              "האם אתה בטוח שברצונך למחוק את התרגיל?",
              [
                { text: "ביטול", style: "cancel" },
                {
                  text: "מחק",
                  style: "destructive",
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          }}
          onStartRest={(duration: number) => {
            startRestTimer(duration, exercise.name);
          }}
          // בטל פונקציות לא רלוונטיות במסך תרגיל יחיד
          onMoveUp={undefined}
          onMoveDown={undefined}
          onDuplicate={undefined}
          isFirst={true}
          isLast={true}
        />
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.prevButton,
            exerciseIndex === 0 && styles.disabledButton,
          ]}
          onPress={handlePrevious}
          disabled={exerciseIndex === 0}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="תרגיל קודם"
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={
              exerciseIndex === 0
                ? theme.colors.textSecondary
                : theme.colors.card
            }
          />
          <Text
            style={[
              styles.navButtonText,
              exerciseIndex === 0 && styles.disabledText,
            ]}
          >
            הקודם
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishExercise}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={
            exerciseIndex === totalExercises - 1 ? "סיים אימון" : "תרגיל הבא"
          }
        >
          <Text style={styles.finishButtonText}>
            {exerciseIndex === totalExercises - 1 ? "סיים אימון" : "הבא"}
          </Text>
          <MaterialCommunityIcons
            name={
              exerciseIndex === totalExercises - 1 ? "check" : "chevron-left"
            }
            size={24}
            color={theme.colors.card}
          />
        </TouchableOpacity>
      </View>
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
  backButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.md,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: theme.colors.card,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
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
  timerButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.md,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
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
});

export default ActiveWorkoutScreen;
