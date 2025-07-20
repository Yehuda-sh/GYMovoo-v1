/**
 * @file src/screens/workout/QuickWorkoutScreen.tsx
 * @description מסך אימון מהיר - המסך הראשי שמשלב את כל קומפוננטות האימון
 * English: Quick workout screen - main screen integrating all workout components
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

// קומפוננטות
// Components
import { WorkoutHeader } from "./components/WorkoutHeader";
import { WorkoutDashboard } from "./components/WorkoutDashboard";
import { RestTimer } from "./components/RestTimer";
import { ExerciseCard } from "./components/ExerciseCard";
import { NextExerciseBar } from "./components/NextExerciseBar";
import { ExercisePickerModal } from "./components/ExercisePickerModal";
import { WorkoutSummary } from "./components/WorkoutSummary";
import { PlateCalculatorModal } from "./components/PlateCalculatorModal";
import { ExerciseTipsModal } from "./components/ExerciseTipsModal";

// Hooks & Services
import { useWorkoutTimer } from "./hooks/useWorkoutTimer";
import { useRestTimer } from "./hooks/useRestTimer";
import autoSaveService from "./services/autoSaveService";

// Types
import { Exercise, WorkoutData, Set } from "./types/workout.types";

// דוגמת תרגילים ראשונית
// Initial exercises example
const initialExercises: Exercise[] = [
  {
    id: "1",
    name: "לחיצת חזה במוט",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "שרירי היד האחוריים"],
    equipment: "מוט",
    sets: [
      {
        id: "1-1",
        type: "warmup",
        targetReps: 15,
        targetWeight: 40,
        completed: false,
      },
      {
        id: "1-2",
        type: "working",
        targetReps: 12,
        targetWeight: 60,
        previousWeight: 55,
        previousReps: 10,
        completed: false,
      },
    ],
  },
  {
    id: "2",
    name: "סקוואט עם מוט",
    category: "רגליים",
    primaryMuscles: ["ארבע ראשי", "עכוז"],
    secondaryMuscles: ["שרירי הירך האחוריים", "סובך"],
    equipment: "מוט",
    sets: [
      {
        id: "2-1",
        type: "working",
        targetReps: 10,
        targetWeight: 80,
        completed: false,
      },
    ],
  },
];

export const QuickWorkoutScreen = () => {
  const navigation = useNavigation();

  // State
  const [workoutName, setWorkoutName] = useState("אימון מהיר");
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null
  );
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showPlateCalculator, setShowPlateCalculator] = useState(false);
  const [showExerciseTips, setShowExerciseTips] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [plateCalculatorWeight, setPlateCalculatorWeight] = useState(60);

  // Hooks
  const {
    elapsedTime: duration,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useWorkoutTimer();
  const {
    timeLeft: restTime,
    isActive: isResting,
    startRest,
    pauseRest,
    resetRest,
    addTime: adjustRestTime,
  } = useRestTimer({});

  // שמירה אוטומטית
  // Auto save
  useEffect(() => {
    if (exercises.length > 0 && isRunning) {
      const workoutData: WorkoutData = {
        id: Date.now().toString(),
        name: workoutName,
        startTime: new Date().toISOString(),
        exercises,
        duration,
      };
      autoSaveService.saveWorkoutState(workoutData);
    }
  }, [exercises, workoutName, duration, isRunning]);

  // התחלת טיימר עם האימון
  // Start timer with workout
  useEffect(() => {
    if (!isRunning && exercises.length > 0) {
      startTimer();
    }
  }, []);

  // חישוב סטטיסטיקות
  // Calculate statistics
  const calculateStats = useCallback(() => {
    const completedSets = exercises.reduce(
      (total, ex) => total + ex.sets.filter((s) => s.completed).length,
      0
    );
    const totalSets = exercises.reduce(
      (total, ex) => total + ex.sets.length,
      0
    );
    const totalVolume = exercises.reduce(
      (total, ex) =>
        total +
        ex.sets.reduce(
          (sum, set) =>
            sum + (set.completed ? (set.weight || 0) * (set.reps || 0) : 0),
          0
        ),
      0
    );
    const personalRecords = exercises
      .flatMap((ex) => ex.sets)
      .filter((set) => set.isPersonalRecord).length;

    return { completedSets, totalSets, totalVolume, personalRecords };
  }, [exercises]);

  // הוספת תרגיל
  // Add exercise
  const handleAddExercise = (exerciseOption: any) => {
    const newExercise: Exercise = {
      ...exerciseOption,
      id: Date.now().toString(),
      sets: [
        {
          id: `${Date.now()}-1`,
          reps: 12,
          weight: 0,
          completed: false,
          type: "working",
        },
      ],
    };
    setExercises([...exercises, newExercise]);
    setExpandedExerciseId(newExercise.id);
  };

  // עדכון סט
  // Update set
  const handleUpdateSet = (
    exerciseId: string,
    setId: string,
    updates: Partial<Set>
  ) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) =>
              set.id === setId ? { ...set, ...updates } : set
            ),
          };
        }
        return ex;
      })
    );
  };

  // הוספת סט
  // Add set
  const handleAddSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSet: Set = {
            id: `${Date.now()}-${ex.sets.length + 1}`,
            reps: lastSet?.reps || 12,
            weight: lastSet?.weight || 0,
            completed: false,
            type: "working",
          };
          return {
            ...ex,
            sets: [...ex.sets, newSet],
          };
        }
        return ex;
      })
    );
  };

  // מחיקת סט
  // Delete set
  const handleDeleteSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.filter((set) => set.id !== setId),
          };
        }
        return ex;
      })
    );
  };

  // סימון סט כהושלם
  // Mark set as completed
  const handleSetComplete = (exerciseId: string, setId: string) => {
    handleUpdateSet(exerciseId, setId, { completed: true });
    startRest();
  };

  // מחיקת תרגיל
  // Delete exercise
  const handleDeleteExercise = (exerciseId: string) => {
    Alert.alert("מחיקת תרגיל", "האם אתה בטוח שברצונך למחוק תרגיל זה?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: () => {
          setExercises(exercises.filter((ex) => ex.id !== exerciseId));
        },
      },
    ]);
  };

  // שכפול תרגיל
  // Duplicate exercise
  const handleDuplicateExercise = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (exercise) {
      const duplicated: Exercise = {
        ...exercise,
        id: Date.now().toString(),
        sets: exercise.sets.map((set) => ({
          ...set,
          id: `${Date.now()}-${set.id}`,
          completed: false,
        })),
      };
      const index = exercises.findIndex((ex) => ex.id === exerciseId);
      const newExercises = [...exercises];
      newExercises.splice(index + 1, 0, duplicated);
      setExercises(newExercises);
    }
  };

  // סיום אימון
  // Finish workout
  const handleFinishWorkout = () => {
    pauseTimer();
    setShowSummary(true);
  };

  // מציאת התרגיל הבא
  // Find next exercise
  const getNextExercise = () => {
    const currentIndex = exercises.findIndex((ex) =>
      ex.sets.some((set) => !set.completed)
    );
    if (currentIndex < exercises.length - 1) {
      return exercises[currentIndex + 1];
    }
    return null;
  };

  // דילוג לתרגיל הבא
  // Skip to next exercise
  const handleSkipToNext = () => {
    const nextExercise = getNextExercise();
    if (nextExercise) {
      setExpandedExerciseId(nextExercise.id);
      // גלילה אוטומטית לתרגיל הבא
      // Auto scroll to next exercise
    }
  };

  // פתיחת מחשבון פלטות
  // Open plate calculator
  const handleOpenPlateCalculator = (weight: number) => {
    setPlateCalculatorWeight(weight);
    setShowPlateCalculator(true);
  };

  // פתיחת טיפים
  // Open tips
  const handleShowTips = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseTips(true);
  };

  const { completedSets, totalSets, totalVolume, personalRecords } =
    calculateStats();

  if (showSummary) {
    return (
      <WorkoutSummary
        workout={{
          id: Date.now().toString(),
          name: workoutName,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          duration,
          exercises,
        }}
        onClose={() => {
          autoSaveService.deleteDraft(Date.now().toString());
          navigation.goBack();
        }}
        onSave={() => {
          // שמירת אימון
          console.log("שומר אימון...");
          autoSaveService.deleteDraft(Date.now().toString());
          navigation.goBack();
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <WorkoutHeader
        workoutName={workoutName}
        onWorkoutNameChange={setWorkoutName}
        elapsedTime={`${Math.floor(duration / 60)}:${(duration % 60)
          .toString()
          .padStart(2, "0")}`}
        onFinish={handleFinishWorkout}
        onPause={isRunning ? pauseTimer : startTimer}
        isPaused={!isRunning}
      />

      {/* Dashboard */}
      <WorkoutDashboard
        totalVolume={totalVolume}
        completedSets={completedSets}
        totalSets={totalSets}
        pace={completedSets / Math.max(duration / 60, 1)}
        personalRecords={personalRecords}
      />

      {/* Rest Timer */}
      {isResting && <RestTimer />}

      {/* Exercises List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            exerciseNumber={index + 1}
            isExpanded={expandedExerciseId === exercise.id}
            onToggleExpand={() =>
              setExpandedExerciseId(
                expandedExerciseId === exercise.id ? null : exercise.id
              )
            }
            onUpdateSet={(setId, updates) =>
              handleUpdateSet(exercise.id, setId, updates)
            }
            onAddSet={() => handleAddSet(exercise.id)}
            onDeleteSet={(setId) => handleDeleteSet(exercise.id, setId)}
            onDelete={() => handleDeleteExercise(exercise.id)}
            onDuplicate={() => handleDuplicateExercise(exercise.id)}
            onStartRest={startRest}
            onShowPlateCalculator={handleOpenPlateCalculator}
            onShowTips={() => handleShowTips(exercise)}
          />
        ))}

        {/* Add Exercise Button */}
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => setShowExercisePicker(true)}
        >
          <MaterialCommunityIcons
            name="plus-circle"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.addExerciseText}>הוסף תרגיל</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Next Exercise Bar */}
      {getNextExercise() && (
        <NextExerciseBar
          nextExercise={getNextExercise()}
          onSkipToNext={handleSkipToNext}
        />
      )}

      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        visible={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelectExercise={handleAddExercise}
        currentExercises={exercises}
      />

      {/* Plate Calculator Modal */}
      <PlateCalculatorModal
        visible={showPlateCalculator}
        onClose={() => setShowPlateCalculator(false)}
        currentWeight={plateCalculatorWeight}
      />

      {/* Exercise Tips Modal */}
      <ExerciseTipsModal
        visible={showExerciseTips}
        onClose={() => setShowExerciseTips(false)}
        exerciseName={selectedExercise?.name || ""}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  addExerciseButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
  },
  addExerciseText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
});

export default QuickWorkoutScreen;
