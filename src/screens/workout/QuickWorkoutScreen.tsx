/**
 * @file src/screens/workout/QuickWorkoutScreen.tsx
 * @description מסך אימון מהיר עם עיצוב משופר וקומפקטי
 * English: Quick workout screen with improved and compact design
 */
// cspell:ignore קומפוננטות, קומפוננטה, סקוואט, במודאלים, לדשבורד, הדשבורד

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  FlatList,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

// Components - תיקון הייבוא
import { WorkoutHeader } from "./components/WorkoutHeader";
import { WorkoutDashboard } from "./components/WorkoutDashboard";
import { RestTimer } from "./components/RestTimer";
import ExerciseCard from "./components/ExerciseCard"; // שינוי לייבוא default
import { NextExerciseBar } from "./components/NextExerciseBar";
import { WorkoutSummary } from "./components/WorkoutSummary";
import { PlateCalculatorModal } from "./components/PlateCalculatorModal";
import { ExerciseTipsModal } from "./components/ExerciseTipsModal";

// Hooks & Services
import { useWorkoutTimer } from "./hooks/useWorkoutTimer";
import { useRestTimer } from "./hooks/useRestTimer";
import autoSaveService from "./services/autoSaveService";

// Types
import { Exercise, WorkoutData, Set } from "./types/workout.types";

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
        isPR: false,
      },
      {
        id: "1-2",
        type: "working",
        targetReps: 12,
        targetWeight: 60,
        previousWeight: 55,
        previousReps: 10,
        completed: false,
        isPR: false,
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
        isPR: false,
      },
    ],
  },
];

// Hook לניהול האימון
// Workout management hook
const useWorkoutManager = (initialData: Exercise[]) => {
  const [workoutName, setWorkoutName] = useState("אימון מהיר");
  const [exercises, setExercises] = useState<Exercise[]>(initialData);

  const handleUpdateSet = useCallback(
    (exerciseId: string, setId: string, updates: Partial<Set>) => {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === setId ? { ...s, ...updates } : s
                ),
              }
            : ex
        )
      );
    },
    []
  );

  const handleAddSet = useCallback((exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: Set = {
          id: `${exerciseId}-${Date.now()}`,
          type: "working",
          targetReps: lastSet?.targetReps || 10,
          targetWeight: lastSet?.targetWeight || 0,
          completed: false,
          isPR: false,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    );
  }, []);

  const handleDeleteSet = useCallback((exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
          : ex
      )
    );
  }, []);

  const handleDeleteExercise = useCallback((exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  }, []);

  const handleDuplicateExercise = useCallback((exerciseId: string) => {
    setExercises((prev) => {
      const index = prev.findIndex((ex) => ex.id === exerciseId);
      if (index === -1) return prev;
      const original = prev[index];
      const duplicate: Exercise = {
        ...original,
        id: `${exerciseId}-copy-${Date.now()}`,
        sets: original.sets.map((set) => ({
          ...set,
          id: `${set.id}-copy-${Date.now()}`,
          completed: false,
        })),
      };
      const newExercises = [...prev];
      newExercises.splice(index + 1, 0, duplicate);
      return newExercises;
    });
  }, []);

  const handleAddExercise = useCallback((exercise: any) => {
    const newExercise: Exercise = {
      id: `exercise-${Date.now()}`,
      name: exercise.name,
      category: exercise.category || "אחר",
      primaryMuscles: exercise.primaryMuscles || [],
      secondaryMuscles: exercise.secondaryMuscles || [],
      equipment: exercise.equipment || "ללא",
      sets: [
        {
          id: `set-${Date.now()}`,
          type: "working",
          targetReps: 10,
          targetWeight: 0,
          completed: false,
          isPR: false,
        },
      ],
    };
    setExercises((prev) => [...prev, newExercise]);
    return newExercise.id;
  }, []);

  const handleReorderSets = useCallback(
    (exerciseId: string, setId: string, direction: "up" | "down") => {
      setExercises((prev) =>
        prev.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          const setIndex = ex.sets.findIndex((s) => s.id === setId);
          if (setIndex === -1) return ex;
          const newIndex = direction === "up" ? setIndex - 1 : setIndex + 1;
          if (newIndex < 0 || newIndex >= ex.sets.length) return ex;
          const reorderedSets = [...ex.sets];
          [reorderedSets[setIndex], reorderedSets[newIndex]] = [
            reorderedSets[newIndex],
            reorderedSets[setIndex],
          ];
          return { ...ex, sets: reorderedSets };
        })
      );
    },
    []
  );

  return {
    workoutName,
    setWorkoutName,
    exercises,
    handlers: {
      handleUpdateSet,
      handleAddSet,
      handleDeleteSet,
      handleDeleteExercise,
      handleDuplicateExercise,
      handleAddExercise,
      handleReorderSets,
    },
  };
};

// קומפוננטה ראשית
// Main component
export const QuickWorkoutScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  // States
  const { workoutName, setWorkoutName, exercises, handlers } =
    useWorkoutManager(initialExercises);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    initialExercises[0]?.id || null
  );
  const [showSummary, setShowSummary] = useState(false);
  const [isDashboardVisible, setDashboardVisible] = useState(false);
  const dashboardAnim = useRef(new Animated.Value(-200)).current;

  // Modal States
  const [modals, setModals] = useState({
    exercisePicker: false,
    plateCalculator: false,
    exerciseTips: false,
  });
  const [modalData, setModalData] = useState({
    plateCalculatorWeight: 60,
    selectedExercise: null as Exercise | null,
  });

  // Hooks
  const { elapsedTime, isRunning, startTimer, pauseTimer } = useWorkoutTimer();
  const {
    timeLeft,
    progress,
    isActive: isResting,
    isPaused,
    startRest,
    pauseRest,
    skipRest,
    addTime,
    subtractTime,
  } = useRestTimer({
    defaultTime: 90,
    onComplete: () => console.log("Rest timer completed!"),
  });

  // אנימציית הדשבורד
  // Dashboard animation
  useEffect(() => {
    Animated.spring(dashboardAnim, {
      toValue: isDashboardVisible ? 0 : -250,
      useNativeDriver: true,
    }).start();
  }, [isDashboardVisible]);

  // Auto-save logic & timer start
  useEffect(() => {
    startTimer();
  }, []);

  useEffect(() => {
    if (exercises.length > 0 && isRunning) {
      const workoutData: WorkoutData = {
        id: "draft",
        name: workoutName,
        startTime: new Date().toISOString(),
        exercises,
        duration: elapsedTime,
      };
      autoSaveService.saveWorkoutState(workoutData);
    }
  }, [exercises, workoutName, elapsedTime, isRunning]);

  // Memoized calculations
  const stats = useMemo(() => {
    let completedSets = 0,
      totalSets = 0,
      totalVolume = 0,
      personalRecords = 0;
    for (const ex of exercises) {
      totalSets += ex.sets.length;
      for (const set of ex.sets) {
        if (set.completed) {
          completedSets++;
          totalVolume += (set.weight || 0) * (set.reps || 0);
          if (set.isPR) personalRecords++;
        }
      }
    }
    return { completedSets, totalSets, totalVolume, personalRecords };
  }, [exercises]);

  const nextExercise = useMemo(() => {
    const currentIdx = exercises.findIndex(
      (ex) => ex.id === expandedExerciseId
    );
    return (
      exercises.find(
        (ex, idx) => idx > currentIdx && ex.sets.some((s) => !s.completed)
      ) || null
    );
  }, [exercises, expandedExerciseId]);

  const formattedElapsedTime = useMemo(() => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [elapsedTime]);

  const handleToggleExpand = (exerciseId: string) => {
    setExpandedExerciseId((prevId) =>
      prevId === exerciseId ? null : exerciseId
    );
  };

  const handleEditWorkoutName = () => {
    Alert.prompt(
      "שם האימון",
      "הכנס שם חדש לאימון",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "אישור",
          onPress: (newName) => {
            if (newName && newName.trim()) {
              setWorkoutName(newName.trim());
            }
          },
        },
      ],
      "plain-text",
      workoutName
    );
  };

  if (showSummary) {
    return (
      <WorkoutSummary
        workout={{
          id: "final",
          name: workoutName,
          startTime: "",
          exercises,
          duration: elapsedTime,
        }}
        onClose={() => navigation.goBack()}
        onSave={() => navigation.goBack()}
      />
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <WorkoutHeader
          workoutName={workoutName}
          elapsedTime={formattedElapsedTime}
          onTimerPress={() => setDashboardVisible((prev) => !prev)}
          onNamePress={handleEditWorkoutName}
        />

        {isResting && (
          <RestTimer
            timeLeft={timeLeft}
            progress={progress}
            isPaused={isPaused}
            nextExercise={nextExercise}
            onPause={pauseRest}
            onSkip={skipRest}
            onAddTime={addTime}
            onSubtractTime={subtractTime}
          />
        )}

        <FlatList
          ref={flatListRef}
          data={exercises}
          keyExtractor={(item) => item.id}
          style={styles.listStyle}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          renderItem={({ item: exercise, index }) => (
            <ExerciseCard
              exercise={exercise}
              sets={exercise.sets}
              onUpdateSet={(setId: string, updates: Partial<Set>) =>
                handlers.handleUpdateSet(exercise.id, setId, updates)
              }
              onAddSet={() => handlers.handleAddSet(exercise.id)}
              onDeleteSet={(setId: string) =>
                handlers.handleDeleteSet(exercise.id, setId)
              }
              onCompleteSet={(setId: string) => {
                const set = exercise.sets.find((s: Set) => s.id === setId);
                if (set && !set.completed) {
                  handlers.handleUpdateSet(exercise.id, setId, {
                    completed: true,
                  });
                  startRest(90); // Default rest time
                }
              }}
              onRemoveExercise={() =>
                handlers.handleDeleteExercise(exercise.id)
              }
              onStartRest={startRest}
              onMoveUp={
                index > 0
                  ? () => {
                      // TODO: implement move up
                    }
                  : undefined
              }
              onMoveDown={
                index < exercises.length - 1
                  ? () => {
                      // TODO: implement move down
                    }
                  : undefined
              }
              isFirst={index === 0}
              isLast={index === exercises.length - 1}
              isPaused={isPaused}
              showHistory={true}
              showNotes={true}
            />
          )}
          ListFooterComponent={
            <>
              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => {
                  (navigation as any).navigate("ExerciseList", {
                    mode: "selection",
                    onSelectExercise: (exercise: any) => {
                      const newId = handlers.handleAddExercise(exercise);
                      setExpandedExerciseId(newId);
                    },
                  });
                }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={22}
                  color={theme.colors.primary}
                />
                <Text style={styles.addExerciseText}>הוסף תרגיל</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.finishButton}
                onPress={() => {
                  pauseTimer();
                  setShowSummary(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.finishButtonText}>סיים אימון</Text>
              </TouchableOpacity>
            </>
          }
        />

        <NextExerciseBar
          nextExercise={nextExercise}
          onSkipToNext={() => {
            if (nextExercise) {
              setExpandedExerciseId(nextExercise.id);
              const index = exercises.findIndex(
                (ex) => ex.id === nextExercise.id
              );
              if (index !== -1) {
                flatListRef.current?.scrollToIndex({
                  index,
                  animated: true,
                });
              }
            }
          }}
        />
      </KeyboardAvoidingView>

      {/* Dashboard Drawer */}
      <Animated.View
        style={[
          styles.dashboardDrawer,
          {
            transform: [{ translateY: dashboardAnim }],
          },
        ]}
      >
        <WorkoutDashboard
          completedSets={stats.completedSets}
          totalSets={stats.totalSets}
          totalVolume={stats.totalVolume}
          personalRecords={stats.personalRecords}
          pace={0} // TODO: calculate actual pace
        />
        <TouchableOpacity
          style={styles.closeDashboard}
          onPress={() => setDashboardVisible(false)}
        >
          <MaterialCommunityIcons
            name="chevron-up"
            size={24}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Modals */}
      {modals.plateCalculator && (
        <PlateCalculatorModal
          visible={modals.plateCalculator}
          onClose={() =>
            setModals((prev) => ({ ...prev, plateCalculator: false }))
          }
          currentWeight={modalData.plateCalculatorWeight}
        />
      )}
      {modals.exerciseTips && modalData.selectedExercise && (
        <ExerciseTipsModal
          visible={modals.exerciseTips}
          onClose={() =>
            setModals((prev) => ({ ...prev, exerciseTips: false }))
          }
          exerciseName={modalData.selectedExercise.name}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listStyle: {
    flex: 1,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 60,
  },
  addExerciseButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
  },
  addExerciseText: {
    marginRight: theme.spacing.sm,
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  finishButton: {
    backgroundColor: theme.colors.success,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    ...theme.shadows.medium,
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dashboardDrawer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.large,
  },
  closeDashboard: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

// הוספת export default בסוף הקובץ
export default QuickWorkoutScreen;
