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

// Components
import { WorkoutHeader } from "./components/WorkoutHeader";
import { WorkoutDashboard } from "./components/WorkoutDashboard";
import { RestTimer } from "./components/RestTimer";
import { ExerciseCard } from "./components/ExerciseCard";
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
        const lastSet = ex.sets[ex.sets.length - 1] || {};
        const newSet: Set = {
          id: `${Date.now()}`,
          type: "working",
          completed: false,
          reps: lastSet.targetReps || 12,
          weight: lastSet.targetWeight || 0,
          previousReps: lastSet.reps,
          previousWeight: lastSet.weight,
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
    Alert.alert("מחיקת תרגיל", "האם אתה בטוח שברצונך למחוק תרגיל זה?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: () =>
          setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId)),
      },
    ]);
  }, []);

  const handleDuplicateExercise = useCallback(
    (exerciseId: string) => {
      const exerciseToDuplicate = exercises.find((ex) => ex.id === exerciseId);
      if (!exerciseToDuplicate) return;
      const duplicatedExercise: Exercise = {
        ...exerciseToDuplicate,
        id: `${Date.now()}`,
        sets: exerciseToDuplicate.sets.map((set) => ({
          ...set,
          id: `${Date.now()}-${set.id}`,
          completed: false,
        })),
      };
      const index = exercises.findIndex((ex) => ex.id === exerciseId);
      const newExercises = [...exercises];
      newExercises.splice(index + 1, 0, duplicatedExercise);
      setExercises(newExercises);
    },
    [exercises]
  );

  const handleAddExercise = useCallback((exerciseOption: any) => {
    const newExercise: Exercise = {
      ...exerciseOption,
      id: `${Date.now()}`,
      sets: [
        {
          id: `${Date.now()}-1`,
          type: "working",
          completed: false,
          targetReps: 12,
          isPR: false,
        },
      ],
    };
    setExercises((prev) => [...prev, newExercise]);
    return newExercise.id;
  }, []);

  const handleReorderSets = useCallback(
    (exerciseId: string, reorderedSets: Set[]) => {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === exerciseId ? { ...ex, sets: reorderedSets } : ex
        )
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
              exerciseNumber={index + 1}
              isExpanded={expandedExerciseId === exercise.id}
              onToggleExpand={() => handleToggleExpand(exercise.id)}
              onUpdateSet={(setId, updates) =>
                handlers.handleUpdateSet(exercise.id, setId, updates)
              }
              onAddSet={() => handlers.handleAddSet(exercise.id)}
              onDeleteSet={(setId) =>
                handlers.handleDeleteSet(exercise.id, setId)
              }
              onDelete={() => handlers.handleDeleteExercise(exercise.id)}
              onDuplicate={() => handlers.handleDuplicateExercise(exercise.id)}
              onStartRest={startRest}
              onShowPlateCalculator={(weight) => {
                setModalData((p) => ({ ...p, plateCalculatorWeight: weight }));
                setModals((p) => ({ ...p, plateCalculator: true }));
              }}
              onShowTips={() => {
                console.log("🎯 onShowTips called for:", exercise.name);
                setModalData((p) => ({ ...p, selectedExercise: exercise }));
                setModals((p) => ({ ...p, exerciseTips: true }));
                console.log("📊 Modal state after update:", {
                  exerciseTips: true,
                  selectedExercise: exercise,
                });
              }}
              onReorderSets={(reorderedSets) =>
                handlers.handleReorderSets(exercise.id, reorderedSets)
              }
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

        <Animated.View
          style={[
            styles.dashboardContainer,
            { transform: [{ translateY: dashboardAnim }] },
          ]}
        >
          <WorkoutDashboard
            totalVolume={stats.totalVolume}
            completedSets={stats.completedSets}
            totalSets={stats.totalSets}
            pace={stats.completedSets / (elapsedTime / 60 || 1)}
            personalRecords={stats.personalRecords}
          />
        </Animated.View>

        <NextExerciseBar
          nextExercise={nextExercise}
          onSkipToNext={() =>
            nextExercise && handleToggleExpand(nextExercise.id)
          }
        />
      </KeyboardAvoidingView>

      {/* Modals wrapper עם z-index גבוה */}
      <View style={styles.modalsWrapper} pointerEvents="box-none">
        <PlateCalculatorModal
          visible={modals.plateCalculator}
          onClose={() =>
            setModals((prev) => ({ ...prev, plateCalculator: false }))
          }
          currentWeight={modalData.plateCalculatorWeight}
        />

        <ExerciseTipsModal
          visible={modals.exerciseTips}
          onClose={() => {
            console.log("🚫 ExerciseTipsModal onClose called");
            setModals((prev) => ({ ...prev, exerciseTips: false }));
          }}
          exerciseName={modalData.selectedExercise?.name || ""}
        />
      </View>
    </>
  );
};

// הוסף את הסגנונות החדשים:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listStyle: {
    flex: 1,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 150,
  },
  addExerciseButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: theme.colors.cardBorder,
    borderStyle: "dashed",
    borderRadius: 16,
  },
  addExerciseText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    textAlign: "right",
  },
  finishButton: {
    backgroundColor: theme.colors.success,
    padding: 16,
    borderRadius: 16,
    margin: 16,
    alignItems: "center",
    ...theme.shadows.medium,
  },
  finishButtonText: {
    color: theme.colors.white || "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  dashboardContainer: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  // הסגנון החדש למודלים
  modalsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 999, // עבור Android
  },
});
