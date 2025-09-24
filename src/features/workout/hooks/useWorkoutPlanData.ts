/**
 * @file src/features/workout/hooks/useWorkoutPlanData.ts
 * @brief Custom hook for WorkoutPlansScreen business logic - extracted from 1175-line monolith
 * Based on successful ProfileScreen refactor methodology (95.8% reduction)
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { useUserStore } from "../../../stores/userStore";
import { questionnaireService } from "../../questionnaire/services/questionnaireService";
import type {
  WorkoutExercise,
  WorkoutPlan,
} from "../../../core/types/workout.types";
import type { RootStackParamList } from "../../../navigation/types";

// Types from original file
type Difficulty = "beginner" | "intermediate" | "advanced" | string;

interface WorkoutSetLite {
  id?: string;
  reps?: number;
  weight?: number;
  duration?: number;
}

interface ExerciseLite {
  id?: string;
  name?: string;
  targetMuscles?: string[];
  equipment?: string;
  difficulty?: Difficulty;
  instructions?: string[];
  restTime?: number;
  sets?: WorkoutSetLite[];
}

interface WorkoutDayLite {
  id?: string;
  name?: string;
  exercises?: ExerciseLite[];
  targetMuscles?: string[];
  duration?: number;
}

interface WorkoutPlanLite {
  id?: string;
  name?: string;
  description?: string;
  duration?: number;
  difficulty?: Difficulty;
  workouts?: WorkoutDayLite[];
  type?: string;
  isActive?: boolean;
  frequency?: string;
  tags?: string[];
}

interface ModalConfig {
  title: string;
  message: string;
}

export const useWorkoutPlanData = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.user);
  const { width: screenWidth } = useWindowDimensions();

  // State management - extracted from original component
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanLite | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: "",
    message: "",
  });
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseLite | null>(
    null
  );
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set()
  );

  // Dynamic Grid Configuration - extracted and optimized
  const gridConfig = useMemo(() => {
    const workouts = workoutPlan?.workouts ?? [];
    const workoutCount = workouts.length;

    if (workoutCount === 0)
      return { columns: 1, itemWidth: screenWidth - 64, gap: 12 };

    const minItemWidth = 110;
    const universalCardPadding = 32;
    const gridContainerPadding = 8;
    const safetyMargin = 24;
    const totalFixedSpace =
      universalCardPadding + gridContainerPadding + safetyMargin;
    const availableWidth = screenWidth - totalFixedSpace;

    let columns = Math.floor(availableWidth / minItemWidth);
    columns = Math.max(1, Math.min(columns, workoutCount));

    if (workoutCount <= 2) {
      columns = Math.min(2, workoutCount);
    } else if (workoutCount === 3) {
      columns = Math.min(3, columns);
    }

    const totalGapSpace = 12 * (columns - 1);
    const itemWidth = Math.floor((availableWidth - totalGapSpace) / columns);

    return {
      columns,
      itemWidth: Math.max(minItemWidth, itemWidth),
      gap: 12,
    };
  }, [workoutPlan?.workouts, screenWidth]);

  // Workout grid data - extracted
  const workoutGridData = useMemo(() => {
    const workouts = workoutPlan?.workouts ?? [];
    const rows: WorkoutDayLite[][] = [];
    for (let i = 0; i < workouts.length; i += gridConfig.columns) {
      rows.push(workouts.slice(i, i + gridConfig.columns));
    }
    return rows;
  }, [workoutPlan?.workouts, gridConfig.columns]);

  // Business logic functions - extracted
  const generateWorkoutDayName = (index: number): string => {
    const letters = ["A", "B", "C", "D", "E", "F", "G"];
    return letters[index] || `יום ${index + 1}`;
  };

  const showMessage = (title: string, message: string) => {
    setModalConfig({ title, message });
    setShowModal(true);
  };

  const handleExercisePress = (exercise: ExerciseLite) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
  };

  const closeExerciseModal = () => {
    setShowExerciseModal(false);
    setSelectedExercise(null);
  };

  const toggleExerciseExpansion = (exerciseId: string) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const renderExerciseDetails = (): string => {
    if (!selectedExercise) return "";

    const parts: string[] = [];

    // Equipment
    if (selectedExercise.equipment) {
      parts.push(`🏋️ ציוד: ${selectedExercise.equipment}`);
    }

    // Target muscles
    if (selectedExercise.targetMuscles?.length) {
      parts.push(`🎯 שרירים: ${selectedExercise.targetMuscles.join(", ")}`);
    }

    // Sets and reps
    const sets = selectedExercise.sets?.length || 3;
    const reps = selectedExercise.sets?.[0]?.reps || 12;
    const weight = selectedExercise.sets?.[0]?.weight;

    parts.push(`📊 ${sets} סטים × ${reps} חזרות`);

    if (weight) {
      parts.push(`⚖️ משקל מומלץ: ${weight}kg`);
    }

    // Rest time
    if (selectedExercise.restTime) {
      parts.push(`⏱️ מנוחה: ${selectedExercise.restTime} שניות`);
    }

    // Instructions
    if (selectedExercise.instructions?.length) {
      parts.push(`📝 הוראות ביצוע:`);
      selectedExercise.instructions.forEach((instruction, index) => {
        parts.push(`${index + 1}. ${instruction}`);
      });
    } else {
      // Default instructions based on equipment
      parts.push(`📝 הוראות ביצוע:`);
      if (selectedExercise.equipment === "bodyweight") {
        parts.push("• התמקד בטכניקה נכונה");
        parts.push("• בצע בקצב איטי ומבוקר");
        parts.push("• נשום באופן סדיר");
      } else {
        parts.push("• התחל עם משקל קל");
        parts.push("• שמור על יציבות הגוף");
        parts.push("• הרם בזריזות, הנמך באיטיות");
      }
    }

    // Difficulty tips
    const difficulty = selectedExercise.difficulty || "beginner";
    parts.push(
      `💡 טיפים לרמה ${difficulty === "beginner" ? "מתחיל" : difficulty === "intermediate" ? "בינוני" : "מתקדם"}:`
    );

    if (difficulty === "beginner") {
      parts.push("• התחל עם 50% מהמשקל המרבי");
      parts.push("• התמקד בלמידת התנועה");
      parts.push("• אל תחפף על הטכניקה");
    } else if (difficulty === "intermediate") {
      parts.push("• הדרגתית הוסף משקל או חזרות");
      parts.push("• שמור על קצב אימון קבוע");
      parts.push("• הקפד על מנוחה מספקת");
    } else {
      parts.push("• נסה וריאציות מאתגרות");
      parts.push("• שלב טכניקות עדינות");
      parts.push("• התמקד בשיפור איכות התנועה");
    }

    return parts.join("\n\n");
  };

  const handleStartWorkout = () => {
    const workouts = workoutPlan?.workouts ?? [];
    if (workouts.length === 0) {
      showMessage("שגיאה", "לא ניתן למצוא תבנית אימון");
      return;
    }

    const workout = workouts[selectedDayIndex];

    navigation.navigate("ActiveWorkout", {
      workoutData: {
        name: workoutPlan?.name ?? "אימון יומי",
        dayName: workout?.name ?? "יום אימון",
        startTime: new Date().toISOString(),
        exercises: (workout?.exercises ?? []) as unknown as WorkoutExercise[],
      },
    });
  };

  // Auto-generate workout plan - extracted
  useEffect(() => {
    const initializeWorkoutPlan = async () => {
      console.log("🎯 Auto-initializing workout plan...");

      if (!user) {
        console.log("❌ No user found for auto-generation");
        return;
      }

      if (!workoutPlan) {
        console.log("📋 No existing plan, generating new one...");

        try {
          setLoading(true);

          const plans =
            (await questionnaireService.generateSmartWorkoutPlan()) as
              | WorkoutPlanLite[]
              | undefined;

          const plan =
            Array.isArray(plans) && plans.length > 0 ? plans[0] : null;

          if (plan) {
            console.log("✅ Auto-generated workout plan:", plan);
            setWorkoutPlan(plan);
          } else {
            console.log("❌ Failed to auto-generate plan");
            showMessage("שגיאה", "לא הצלחנו ליצור תוכנית אימון אוטומטית");
          }
        } catch (err) {
          console.error("❌ Error in auto-generation:", err);
          showMessage("שגיאה", "שגיאה ביצירת תוכנית אימון");
        } finally {
          setLoading(false);
        }
      } else {
        console.log("✅ Workout plan already exists, skipping generation");
      }
    };

    initializeWorkoutPlan();
  }, [user, workoutPlan]);

  // Computed values
  const currentWorkoutPlan = workoutPlan;
  const workouts = currentWorkoutPlan?.workouts ?? [];
  const selectedWorkout = workouts[selectedDayIndex];

  // Convert for CalorieCalculator compatibility
  const workoutPlanForCalc = currentWorkoutPlan
    ? (currentWorkoutPlan as unknown as WorkoutPlan)
    : undefined;

  return {
    // State
    workoutPlan: currentWorkoutPlan,
    loading,
    showModal,
    modalConfig,
    selectedDayIndex,
    selectedExercise,
    showExerciseModal,
    expandedExercises,

    // Computed values
    gridConfig,
    workoutGridData,
    workouts,
    selectedWorkout,
    workoutPlanForCalc,

    // Actions
    setSelectedDayIndex,
    showMessage,
    handleExercisePress,
    closeExerciseModal,
    toggleExerciseExpansion,
    renderExerciseDetails,
    handleStartWorkout,
    generateWorkoutDayName,
    setShowModal,

    // Navigation & user
    navigation,
    user,
  };
};
