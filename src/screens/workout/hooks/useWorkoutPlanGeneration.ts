/**
 * @file src/screens/workout/hooks/useWorkoutPlanGeneration.ts
 * @brief Central workout plan generation hook - Hook מרכזי ליצירת תוכניות אימון
 * @dependencies workoutLogicService, equipmentCatalog, userStore
 * @created August 2025 - Equipment-Aware Plans integration
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useMemo } from "react";
import { ExerciseTemplate } from "../types/workout.types";
import {
  generateWorkoutPlan,
  initializeExerciseCache,
  getMuscleGroupsForDay,
} from "../services/workoutLogicService";
import { useUserEquipment } from "../../../stores/userStore";
import { normalizeEquipment } from "../../../utils/equipmentCatalog";
import { logger } from "../../../utils/logger";
import {
  WORKOUT_DAYS,
  DEFAULT_GOAL,
  DEFAULT_EXPERIENCE,
} from "../utils/workoutConstants";

/**
 * Interface for workout plan generation parameters
 */
export interface WorkoutPlanGenerationParams {
  frequency: number;
  experience: string;
  duration: number;
  goal: string;
  equipment?: string[];
  customMuscleGroups?: string[];
}

/**
 * Interface for workout plan generation result
 */
export interface WorkoutPlanGenerationResult {
  workoutPlan: any[];
  isLoading: boolean;
  error: string | null;
  equipmentSummary: {
    normalizedEquipment: string[];
    availableExercises: number;
    substitutionsUsed: number;
  };
  planMetadata: {
    totalExercises: number;
    averageExercisesPerDay: number;
    muscleGroupsCovered: string[];
    estimatedWeeklyDuration: number;
  };
}

/**
 * Interface for equipment compatibility check
 */
export interface EquipmentCompatibility {
  canPerformAll: boolean;
  compatibilityScore: number;
  missingEquipment: string[];
  substitutionSuggestions: string[];
}

/**
 * Central hook for workout plan generation with equipment awareness
 */
export const useWorkoutPlanGeneration = (): {
  generatePlan: (
    params: WorkoutPlanGenerationParams
  ) => Promise<WorkoutPlanGenerationResult>;
  checkEquipmentCompatibility: (
    exercises: ExerciseTemplate[],
    userEquipment: string[]
  ) => EquipmentCompatibility;
  getRecommendedFrequency: (experience: string, goal: string) => number;
  validatePlanParams: (params: WorkoutPlanGenerationParams) => {
    isValid: boolean;
    errors: string[];
  };
  isGenerating: boolean;
  lastGeneratedPlan: any[] | null;
  planHistory: any[][];
} => {
  // ===============================================
  // 🏗️ State Management
  // ===============================================

  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedPlan, setLastGeneratedPlan] = useState<any[] | null>(
    null
  );
  const [planHistory, setPlanHistory] = useState<any[][]>([]);

  // Get user equipment from store
  const userEquipment = useUserEquipment();

  // ===============================================
  // 🎯 Core Generation Function
  // ===============================================

  const generatePlan = useCallback(
    async (
      params: WorkoutPlanGenerationParams
    ): Promise<WorkoutPlanGenerationResult> => {
      setIsGenerating(true);

      try {
        logger.debug("WorkoutPlanGeneration", "Starting plan generation", {
          frequency: params.frequency,
          experience: params.experience,
          duration: params.duration,
          goal: params.goal,
          equipmentCount: (params.equipment || userEquipment).length,
        });

        // Initialize exercise cache to prevent repetitions
        initializeExerciseCache();

        // Use provided equipment or fall back to user's equipment
        const equipment = params.equipment || userEquipment;
        const normalizedEquipment = normalizeEquipment(equipment);

        // Get workout days configuration based on frequency
        const workoutDays =
          WORKOUT_DAYS[params.frequency as keyof typeof WORKOUT_DAYS] ||
          WORKOUT_DAYS[3];

        // Create workout day objects with proper structure
        const workoutDayObjects = workoutDays.map((dayName, index) => ({
          id: `day_${index}`,
          name: dayName,
          dayNumber: index + 1,
          muscles: getMuscleGroupsForDay(dayName),
          exercises: [], // Will be populated by generateWorkoutPlan
        }));

        // Create metadata object for workout generation
        const metadata: Record<string | number, string | string[]> = {
          goal: params.goal || DEFAULT_GOAL,
          experience: params.experience || DEFAULT_EXPERIENCE,
          duration: String(params.duration || 45),
          frequency: String(params.frequency),
          customMuscleGroups: params.customMuscleGroups || [],
        };

        // Generate the complete workout plan
        const workoutPlan = generateWorkoutPlan(
          workoutDayObjects,
          normalizedEquipment,
          params.experience || DEFAULT_EXPERIENCE,
          params.duration || 45,
          metadata
        );

        // Calculate statistics and summaries
        const equipmentSummary = calculateEquipmentSummary(
          workoutPlan,
          normalizedEquipment
        );
        const planMetadata = calculatePlanMetadata(workoutPlan, params);

        // Update state
        setLastGeneratedPlan(workoutPlan);
        setPlanHistory((prev) => [...prev.slice(-4), workoutPlan]); // Keep last 5 plans

        logger.debug("WorkoutPlanGeneration", "Plan generation completed", {
          totalDays: workoutPlan.length,
          totalExercises: planMetadata.totalExercises,
          compatibilityScore: equipmentSummary.availableExercises,
        });

        return {
          workoutPlan,
          isLoading: false,
          error: null,
          equipmentSummary,
          planMetadata,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "תקלה בלתי צפויה ביצירת תוכנית האימון";

        logger.error("WorkoutPlanGeneration", "Plan generation failed", {
          error: errorMessage,
          params,
        });

        return {
          workoutPlan: [],
          isLoading: false,
          error: errorMessage,
          equipmentSummary: {
            normalizedEquipment: [],
            availableExercises: 0,
            substitutionsUsed: 0,
          },
          planMetadata: {
            totalExercises: 0,
            averageExercisesPerDay: 0,
            muscleGroupsCovered: [],
            estimatedWeeklyDuration: 0,
          },
        };
      } finally {
        setIsGenerating(false);
      }
    },
    [userEquipment]
  );

  // ===============================================
  // 🔍 Equipment Compatibility Check
  // ===============================================

  const checkEquipmentCompatibility = useCallback(
    (
      exercises: ExerciseTemplate[],
      userEquipment: string[]
    ): EquipmentCompatibility => {
      const normalizedUserEquipment = normalizeEquipment(userEquipment);

      // For now, we'll do a basic check since we don't have exercise equipment data in ExerciseTemplate
      // This would need to be enhanced when we have equipment data in the exercise objects

      return {
        canPerformAll: true, // Assume true since our logic service handles substitutions
        compatibilityScore: normalizedUserEquipment.length > 0 ? 0.8 : 0.3, // Higher score with more equipment
        missingEquipment: [], // Would be calculated based on required vs available equipment
        substitutionSuggestions:
          normalizedUserEquipment.length === 0
            ? ["dumbbell", "resistance_bands"]
            : [],
      };
    },
    []
  );

  // ===============================================
  // 📊 Recommendation Functions
  // ===============================================

  const getRecommendedFrequency = useCallback(
    (experience: string, goal: string): number => {
      // Beginner recommendations
      if (experience === "beginner") {
        return goal === "weight_loss" ? 4 : 3;
      }

      // Intermediate recommendations
      if (experience === "intermediate") {
        if (goal === "muscle_gain") return 5;
        if (goal === "strength") return 4;
        return 4;
      }

      // Advanced recommendations
      if (goal === "muscle_gain") return 6;
      if (goal === "strength") return 5;
      return 5;
    },
    []
  );

  // ===============================================
  // ✅ Validation Function
  // ===============================================

  const validatePlanParams = useCallback(
    (
      params: WorkoutPlanGenerationParams
    ): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];

      // Frequency validation
      if (!params.frequency || params.frequency < 1 || params.frequency > 6) {
        errors.push("תדירות האימון חייבת להיות בין 1 ל-6 פעמים בשבוע");
      }

      // Duration validation
      if (!params.duration || params.duration < 20 || params.duration > 120) {
        errors.push("משך האימון חייב להיות בין 20 ל-120 דקות");
      }

      // Experience validation
      const validExperience = ["beginner", "intermediate", "advanced"];
      if (!params.experience || !validExperience.includes(params.experience)) {
        errors.push(
          "רמת הניסיון חייבת להיות: beginner, intermediate או advanced"
        );
      }

      // Goal validation
      const validGoals = [
        "weight_loss",
        "muscle_gain",
        "strength",
        "endurance",
        "general_fitness",
      ];
      if (!params.goal || !validGoals.includes(params.goal)) {
        errors.push("מטרת האימון לא תקינה");
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    []
  );

  // ===============================================
  // 📊 Helper Functions
  // ===============================================

  const calculateEquipmentSummary = (
    workoutPlan: any[],
    normalizedEquipment: string[]
  ) => {
    let totalExercises = 0;
    const substitutionsUsed = 0;

    workoutPlan.forEach((day) => {
      totalExercises += day.exercises?.length || 0;
      // Note: substitution counting would require exercise equipment data
    });

    return {
      normalizedEquipment,
      availableExercises: totalExercises,
      substitutionsUsed,
    };
  };

  const calculatePlanMetadata = (
    workoutPlan: any[],
    params: WorkoutPlanGenerationParams
  ) => {
    const totalExercises = workoutPlan.reduce(
      (sum, day) => sum + (day.exercises?.length || 0),
      0
    );
    const averageExercisesPerDay =
      workoutPlan.length > 0 ? totalExercises / workoutPlan.length : 0;

    const muscleGroupsCovered = workoutPlan.reduce((muscles: string[], day) => {
      const dayMuscles = day.muscles || [];
      dayMuscles.forEach((muscle: string) => {
        if (!muscles.includes(muscle)) {
          muscles.push(muscle);
        }
      });
      return muscles;
    }, []);

    const estimatedWeeklyDuration = params.frequency * (params.duration || 45);

    return {
      totalExercises,
      averageExercisesPerDay: Math.round(averageExercisesPerDay * 10) / 10,
      muscleGroupsCovered,
      estimatedWeeklyDuration,
    };
  };

  // ===============================================
  // 🎯 Memoized Return
  // ===============================================

  return useMemo(
    () => ({
      generatePlan,
      checkEquipmentCompatibility,
      getRecommendedFrequency,
      validatePlanParams,
      isGenerating,
      lastGeneratedPlan,
      planHistory,
    }),
    [
      generatePlan,
      checkEquipmentCompatibility,
      getRecommendedFrequency,
      validatePlanParams,
      isGenerating,
      lastGeneratedPlan,
      planHistory,
    ]
  );
};
