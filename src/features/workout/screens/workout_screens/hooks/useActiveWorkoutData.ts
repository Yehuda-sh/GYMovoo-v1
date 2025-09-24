/**
 * @file src/features/workout/screens/workout_screens/hooks/useActiveWorkoutData.ts
 * @brief Custom hook for ActiveWorkoutScreen - following proven methodology
 * Extracts all business logic from 946-line monolithic component
 */

import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";
import { nextWorkoutLogicService } from "../../../services/nextWorkoutLogicService";
import { calculateWorkoutStats } from "../../../utils/workoutStatsCalculator";
import { WorkoutExercise, Set } from "../../../../../core/types/workout.types";
import { RootStackParamList } from "../../../../../navigation/types";

type ActiveWorkoutRouteProp = RouteProp<RootStackParamList, "ActiveWorkout">;

export const useActiveWorkoutData = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<ActiveWorkoutRouteProp>();

  const { workoutData, pendingExercise } = route.params || {};

  // State management - all 7 useState hooks from original
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    workoutData?.exercises || []
  );
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTime, setRestTime] = useState(60);

  // Helper functions
  const createDefaultSet = (equipment?: string): Set => {
    let suggestedWeight = 0;
    let suggestedReps = 12;

    switch (equipment) {
      case "dumbbells":
        suggestedWeight = 5;
        break;
      case "barbell":
        suggestedWeight = 20;
        break;
      case "kettlebell":
        suggestedWeight = 8;
        break;
      case "resistance_bands":
        suggestedWeight = 0;
        suggestedReps = 15;
        break;
      case "bodyweight":
        suggestedWeight = 0;
        suggestedReps = 10;
        break;
      default:
        suggestedWeight = 5;
        break;
    }

    return {
      id: `${Date.now()}`,
      type: "working",
      targetWeight: suggestedWeight,
      targetReps: suggestedReps,
      completed: false,
    };
  };

  const calculateRestTime = (exercise: WorkoutExercise): number => {
    const equipment = exercise.equipment;
    const primaryMuscle = exercise.primaryMuscles?.[0];
    if (equipment === "barbell" || equipment === "squat_rack") return 120;
    if (primaryMuscle === "legs" || primaryMuscle === "quadriceps") return 90;
    if (equipment === "bodyweight" || equipment === "resistance_bands")
      return 45;
    return 60;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Live stats calculation
  const liveStats = useMemo(() => {
    if (!exercises?.length) return null;

    const formattedExercises = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      category: exercise.category || "Unknown",
      primaryMuscles: exercise.primaryMuscles || ["Unknown"],
      equipment: exercise.equipment || "Unknown",
      sets: (exercise.sets || []).map((set) => ({
        id: set.id,
        type: set.type || ("working" as const),
        targetReps: set.targetReps,
        actualReps: set.completed ? set.actualReps || set.targetReps : 0,
        targetWeight: set.targetWeight,
        actualWeight: set.completed ? set.actualWeight || set.targetWeight : 0,
        completed: set.completed,
        isPR: set.isPR || false,
        timeToComplete: set.timeToComplete || 0,
      })),
    }));

    return calculateWorkoutStats(formattedExercises);
  }, [exercises]);

  // Timer management - useEffect #1
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Auto-start timer - useEffect #2
  useEffect(() => {
    setIsTimerRunning(true);
    return () => setIsTimerRunning(false);
  }, []);

  // Handle pending exercise - useEffect #3
  useEffect(() => {
    if (pendingExercise && pendingExercise.id) {
      const newExercise: WorkoutExercise = {
        id: pendingExercise.id,
        name: pendingExercise.name,
        category: "Unknown",
        primaryMuscles: [pendingExercise.muscleGroup || "Unknown"],
        equipment: pendingExercise.equipment || "bodyweight",
        sets: [createDefaultSet(pendingExercise.equipment || "bodyweight")],
      };
      setExercises((prev) => [...prev, newExercise]);
    }
  }, [pendingExercise]);

  // Exercise actions
  const handleCompleteSet = (exerciseId: string, setId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    const set = exercise?.sets?.find((s) => s.id === setId);

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: (ex.sets || []).map((s) =>
                s.id === setId ? { ...s, completed: !s.completed } : s
              ),
            }
          : ex
      )
    );

    if (exercise && set && !set.completed) {
      const currentSetIndex =
        exercise.sets?.findIndex((s) => s.id === setId) || 0;
      const hasMoreSetsInExercise =
        exercise.sets && currentSetIndex < exercise.sets.length - 1;
      const currentExerciseIndex = exercises.findIndex(
        (ex) => ex.id === exerciseId
      );
      const hasMoreExercises = currentExerciseIndex < exercises.length - 1;

      if (hasMoreSetsInExercise || hasMoreExercises) {
        const restDuration = calculateRestTime(exercise);
        setRestTime(restDuration);
        setShowRestTimer(true);
      }
    }
  };

  const handleAddSet = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise || !exercise.sets) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const defaultSet = createDefaultSet(exercise.equipment);

    const newSet: Set = {
      ...defaultSet,
      targetWeight:
        lastSet?.actualWeight ||
        lastSet?.targetWeight ||
        defaultSet.targetWeight,
      targetReps:
        lastSet?.actualReps || lastSet?.targetReps || defaultSet.targetReps,
    };

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: [...(ex.sets || []), newSet] }
          : ex
      )
    );
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise || !exercise.sets || exercise.sets.length <= 1) {
      Alert.alert("שגיאה", "חייב להיות לפחות סט אחד בתרגיל");
      return;
    }

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: (ex.sets || []).filter((s) => s.id !== setId) }
          : ex
      )
    );
  };

  const handleUpdateSet = (
    exerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: number
  ) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: (ex.sets || []).map((s) =>
                s.id === setId
                  ? field === "weight"
                    ? { ...s, actualWeight: value, targetWeight: value }
                    : { ...s, actualReps: value, targetReps: value }
                  : s
              ),
            }
          : ex
      )
    );
  };

  const handleAddExercise = () => {
    navigation.navigate("ExercisesScreen", {
      fromScreen: "ActiveWorkout",
      mode: "selection",
      onSelectExercise: (selectedExercise: WorkoutExercise) => {
        const newExercise: WorkoutExercise = {
          ...selectedExercise,
          sets: [createDefaultSet(selectedExercise.equipment)],
        };
        setExercises((prev) => [...prev, newExercise]);
        navigation.goBack();
      },
    });
  };

  const handleFinishWorkout = () => {
    const completedSets = liveStats?.completedSets || 0;
    const totalVolume = liveStats?.totalVolume || 0;
    const totalSets = liveStats?.totalSets || 0;

    if (completedSets === 0) {
      Alert.alert("שגיאה", "יש להשלים לפחות סט אחד לפני סיום האימון");
      return;
    }

    Alert.alert(
      "סיום אימון",
      `האם ברצונך לסיים את האימון?\n\n• ${completedSets}/${totalSets} סטים הושלמו\n• ${totalVolume} ק"ג נפח כללי`,
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "סיים",
          style: "destructive",
          onPress: async () => {
            const workoutSummaryData = {
              workoutName: workoutData?.name || "אימון פעיל",
              exercises: exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                sets: (exercise.sets || []).map((s) => ({
                  reps: s.actualReps || s.targetReps || 0,
                  weight: s.actualWeight || s.targetWeight || 0,
                  completed: s.completed,
                })),
                restTime: 60,
              })),
              totalDuration: Math.floor(workoutTime / 60),
              totalSets: liveStats?.totalSets || 0,
              totalReps: liveStats?.totalReps || 0,
              totalVolume: liveStats?.totalVolume || 0,
              personalRecords: [],
              completedAt: new Date().toISOString(),
              difficulty: 3,
            };

            await nextWorkoutLogicService.updateWorkoutCompleted(0);
            navigation.navigate("WorkoutSummary", {
              workoutData: workoutSummaryData,
            });
          },
        },
      ]
    );
  };

  // Rest timer actions
  const handleRestTimerComplete = () => setShowRestTimer(false);
  const handleRestTimerSkip = () => setShowRestTimer(false);
  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);

  return {
    // Data
    exercises,
    workoutData,
    workoutTime: formatTime(workoutTime),
    liveStats,
    isTimerRunning,

    // Rest timer
    restTimer: {
      visible: showRestTimer,
      restTime,
      onComplete: handleRestTimerComplete,
      onSkip: handleRestTimerSkip,
    },

    // Actions
    exerciseActions: {
      onCompleteSet: handleCompleteSet,
      onAddSet: handleAddSet,
      onDeleteSet: handleDeleteSet,
      onUpdateSet: handleUpdateSet,
    },

    workoutActions: {
      onAddExercise: handleAddExercise,
      onFinishWorkout: handleFinishWorkout,
      onToggleTimer: toggleTimer,
    },
  };
};
