/**
 * @file src/screens/workout/hooks/useWorkoutGeneration.ts
 * @brief Specialized workout generation hook - Hook מתמחה לגנרציה של תרגילים
 * @dependencies workoutLogicService, equipmentCatalog
 * @created August 2025 - Specialized workout exercise generation
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useMemo } from "react";
import { ExerciseTemplate } from "../types/workout.types";
import {
  selectExercisesForDay,
  getMuscleGroupsForDay,
  getSetsForExperience,
  getRepsForGoal,
  getRestTimeForGoal,
} from "../services/workoutLogicService";
import { useUserEquipment } from "../../../stores/userStore";
import {
  normalizeEquipment,
  canPerform,
  checkExerciseAvailability,
  type EquipmentTag,
} from "../../../utils/equipmentCatalog";
import { allExercises } from "../../../data/exercises";
import { logger } from "../../../utils/logger";
import { DEFAULT_GOAL, DEFAULT_EXPERIENCE } from "../utils/workoutConstants";

/**
 * Interface for exercise generation parameters
 */
export interface ExerciseGenerationParams {
  muscleGroup: string;
  equipment?: string[];
  experience?: string;
  goal?: string;
  excludeExercises?: string[];
  maxExercises?: number;
  minSets?: number;
  maxSets?: number;
}

/**
 * Interface for exercise substitution parameters
 */
export interface ExerciseSubstitutionParams {
  originalExercise: any;
  availableEquipment: string[];
  muscleGroup?: string;
  experience?: string;
  goal?: string;
}

/**
 * Interface for exercise generation result
 */
export interface ExerciseGenerationResult {
  exercises: ExerciseTemplate[];
  substitutions: Array<{
    original: string;
    substitute: string;
    reason: string;
  }>;
  warnings: string[];
  availabilityScore: number;
}

/**
 * Interface for single exercise generation
 */
export interface SingleExerciseResult {
  exercise: ExerciseTemplate | null;
  isSubstitution: boolean;
  substitutionReason?: string;
  availableAlternatives: any[];
}

/**
 * Specialized hook for workout exercise generation
 */
export const useWorkoutGeneration = () => {
  // ===============================================
  // 🏗️ State Management
  // ===============================================

  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedExercises, setLastGeneratedExercises] = useState<
    ExerciseTemplate[]
  >([]);
  const [generationHistory, setGenerationHistory] = useState<
    ExerciseTemplate[][]
  >([]);

  // Get user equipment from store
  const userEquipment = useUserEquipment();

  // ===============================================
  // 🎯 Core Exercise Generation Functions
  // ===============================================

  /**
   * Generate exercises for specific muscle group with advanced filtering
   */
  const generateExercisesForMuscleGroup = useCallback(
    async (
      params: ExerciseGenerationParams
    ): Promise<ExerciseGenerationResult> => {
      setIsGenerating(true);

      try {
        logger.debug(
          "WorkoutGeneration",
          "Generating exercises for muscle group",
          {
            muscleGroup: params.muscleGroup,
            equipmentCount: (params.equipment || userEquipment).length,
            maxExercises: params.maxExercises || 6,
          }
        );

        const equipment = params.equipment || userEquipment;
        const normalizedEquipment = normalizeEquipment(equipment);
        const experience = params.experience || DEFAULT_EXPERIENCE;
        const goal = params.goal || DEFAULT_GOAL;

        // Generate exercises using the logic service
        const generatedExercises = selectExercisesForDay(
          params.muscleGroup,
          normalizedEquipment,
          experience,
          60, // Default duration for calculations
          { goal }
        );

        // Apply additional filtering and limits
        let filteredExercises = generatedExercises;

        // Exclude specific exercises if requested
        if (params.excludeExercises?.length) {
          filteredExercises = filteredExercises.filter(
            (ex) => !params.excludeExercises!.includes(ex.exerciseId)
          );
        }

        // Limit number of exercises
        if (params.maxExercises) {
          filteredExercises = filteredExercises.slice(0, params.maxExercises);
        }

        // Adjust sets based on parameters
        if (params.minSets || params.maxSets) {
          filteredExercises = filteredExercises.map((ex) => ({
            ...ex,
            sets: Math.max(
              params.minSets || ex.sets,
              Math.min(params.maxSets || ex.sets, ex.sets)
            ),
          }));
        }

        // Calculate availability score
        const availabilityScore = calculateAvailabilityScore(
          filteredExercises,
          normalizedEquipment
        );

        // Update state
        setLastGeneratedExercises(filteredExercises);
        setGenerationHistory((prev) => [...prev.slice(-4), filteredExercises]);

        logger.debug("WorkoutGeneration", "Exercise generation completed", {
          exerciseCount: filteredExercises.length,
          availabilityScore,
        });

        return {
          exercises: filteredExercises,
          substitutions: [], // Would be calculated based on actual substitutions made
          warnings:
            availabilityScore < 0.5 ? ["ציוד מוגבל - נעשו תחליפים רבים"] : [],
          availabilityScore,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "שגיאה ביצירת תרגילים";

        logger.error("WorkoutGeneration", "Exercise generation failed", {
          error: errorMessage,
          params,
        });

        return {
          exercises: [],
          substitutions: [],
          warnings: [errorMessage],
          availabilityScore: 0,
        };
      } finally {
        setIsGenerating(false);
      }
    },
    [userEquipment]
  );

  // ===============================================
  // 🔄 Exercise Substitution Functions
  // ===============================================

  /**
   * Find substitute exercise based on available equipment
   */
  const findExerciseSubstitute = useCallback(
    (params: ExerciseSubstitutionParams): SingleExerciseResult => {
      const {
        originalExercise,
        availableEquipment,
        muscleGroup,
        experience,
        goal,
      } = params;
      const normalizedEquipment = normalizeEquipment(availableEquipment);

      // Check if original exercise can be performed
      if (canPerform([originalExercise.equipment], normalizedEquipment)) {
        return {
          exercise: createExerciseTemplate(
            originalExercise,
            experience || DEFAULT_EXPERIENCE,
            goal || DEFAULT_GOAL
          ),
          isSubstitution: false,
          availableAlternatives: [],
        };
      }

      // Find alternatives in the same muscle group
      const muscleGroups = muscleGroup
        ? [muscleGroup]
        : getMuscleGroupsForDay(originalExercise.primaryMuscles?.[0] || "חזה");

      const alternatives = allExercises.filter((exercise: any) => {
        // Check if exercise targets similar muscles
        const targetsSimilarMuscles = exercise.primaryMuscles?.some(
          (muscle: string) =>
            muscleGroups.some(
              (group) => muscle.includes(group) || group.includes(muscle)
            )
        );

        // Check if can be performed with available equipment
        const canBePerformed = canPerform(
          [exercise.equipment],
          normalizedEquipment
        );

        return (
          targetsSimilarMuscles &&
          canBePerformed &&
          exercise.id !== originalExercise.id
        );
      });

      if (alternatives.length > 0) {
        // Score alternatives and pick the best one
        const scoredAlternatives = alternatives.map((exercise: any) => {
          const availability = checkExerciseAvailability(
            [exercise.equipment],
            normalizedEquipment
          );
          return {
            ...exercise,
            score:
              availability.available && !availability.needsSubstitutes
                ? 1.0
                : availability.available
                  ? 0.8
                  : 0.3,
          };
        });

        scoredAlternatives.sort((a, b) => b.score - a.score);
        const bestAlternative = scoredAlternatives[0];

        return {
          exercise: createExerciseTemplate(
            bestAlternative,
            experience || DEFAULT_EXPERIENCE,
            goal || DEFAULT_GOAL
          ),
          isSubstitution: true,
          substitutionReason: `תחליף ל-${originalExercise.id} בגלל ציוד לא זמין`,
          availableAlternatives: scoredAlternatives.slice(1, 4), // Top 3 other alternatives
        };
      }

      // No suitable substitute found - return bodyweight alternative
      return {
        exercise: {
          exerciseId: "bodyweight_alternative",
          sets: getSetsForExperience(experience || DEFAULT_EXPERIENCE),
          reps: getRepsForGoal(goal || DEFAULT_GOAL),
          restTime: getRestTimeForGoal(goal || DEFAULT_GOAL),
          notes: `תחליף משקל גוף ל-${originalExercise.id}`,
        },
        isSubstitution: true,
        substitutionReason: "לא נמצא תחליף מתאים - נבחר תרגיל משקל גוף",
        availableAlternatives: [],
      };
    },
    []
  );

  // ===============================================
  // 🎲 Random Exercise Generation
  // ===============================================

  /**
   * Generate random exercise from available equipment
   */
  const generateRandomExercise = useCallback(
    (
      muscleGroup?: string,
      equipment?: string[],
      excludeIds?: string[]
    ): SingleExerciseResult => {
      const availableEquipment = normalizeEquipment(equipment || userEquipment);
      const targetMuscles = muscleGroup
        ? getMuscleGroupsForDay(muscleGroup)
        : [];

      // Filter exercises
      const availableExercises = allExercises.filter((exercise: any) => {
        // Check equipment compatibility
        const equipmentMatch = canPerform(
          [exercise.equipment],
          availableEquipment
        );

        // Check muscle group if specified
        const muscleMatch =
          !muscleGroup ||
          exercise.primaryMuscles?.some((muscle: string) =>
            targetMuscles.some(
              (target) => muscle.includes(target) || target.includes(muscle)
            )
          );

        // Check exclusions
        const notExcluded = !excludeIds?.includes(exercise.id);

        return equipmentMatch && muscleMatch && notExcluded;
      });

      if (availableExercises.length === 0) {
        return {
          exercise: null,
          isSubstitution: false,
          availableAlternatives: [],
        };
      }

      // Pick random exercise
      const randomIndex = Math.floor(Math.random() * availableExercises.length);
      const selectedExercise = availableExercises[randomIndex];

      return {
        exercise: createExerciseTemplate(
          selectedExercise,
          DEFAULT_EXPERIENCE,
          DEFAULT_GOAL
        ),
        isSubstitution: false,
        availableAlternatives: availableExercises
          .slice(0, 5)
          .filter((ex) => ex.id !== selectedExercise.id),
      };
    },
    [userEquipment]
  );

  // ===============================================
  // 🔍 Equipment Analysis Functions
  // ===============================================

  /**
   * Analyze equipment coverage for specific muscle groups
   */
  const analyzeEquipmentCoverage = useCallback(
    (muscleGroups: string[], equipment?: string[]) => {
      const availableEquipment = normalizeEquipment(equipment || userEquipment);

      const coverage = muscleGroups.map((muscleGroup) => {
        const relevantExercises = allExercises.filter((exercise: any) =>
          exercise.primaryMuscles?.some(
            (muscle: string) =>
              muscle.includes(muscleGroup) || muscleGroup.includes(muscle)
          )
        );

        const performableExercises = relevantExercises.filter((exercise: any) =>
          canPerform([exercise.equipment], availableEquipment)
        );

        return {
          muscleGroup,
          totalExercises: relevantExercises.length,
          performableExercises: performableExercises.length,
          coveragePercentage:
            relevantExercises.length > 0
              ? Math.round(
                  (performableExercises.length / relevantExercises.length) * 100
                )
              : 0,
          missingEquipment: findMissingEquipmentForMuscleGroup(
            muscleGroup,
            availableEquipment
          ),
        };
      });

      return coverage;
    },
    [userEquipment]
  );

  /**
   * Get equipment recommendations for better exercise variety
   */
  const getEquipmentRecommendations = useCallback(
    (targetMuscleGroups: string[]) => {
      const currentEquipment = normalizeEquipment(userEquipment);
      const recommendations: Array<{
        equipment: EquipmentTag;
        impact: number;
        reason: string;
      }> = [];

      // Analyze which equipment would unlock the most exercises
      const allEquipmentTypes: EquipmentTag[] = [
        "dumbbell",
        "barbell",
        "kettlebell",
        "resistance_bands",
        "pullup_bar",
        "bench",
        "squat_rack",
        "cable",
      ];

      allEquipmentTypes.forEach((equipmentType) => {
        if (!currentEquipment.includes(equipmentType)) {
          const testEquipment = [...currentEquipment, equipmentType];
          const currentCoverage = analyzeEquipmentCoverage(
            targetMuscleGroups,
            currentEquipment
          );
          const newCoverage = analyzeEquipmentCoverage(
            targetMuscleGroups,
            testEquipment
          );

          const totalCurrentExercises = currentCoverage.reduce(
            (sum, mg) => sum + mg.performableExercises,
            0
          );
          const totalNewExercises = newCoverage.reduce(
            (sum, mg) => sum + mg.performableExercises,
            0
          );

          const impact = totalNewExercises - totalCurrentExercises;

          if (impact > 0) {
            recommendations.push({
              equipment: equipmentType,
              impact,
              reason: `יוסיף ${impact} תרגילים נוספים`,
            });
          }
        }
      });

      return recommendations.sort((a, b) => b.impact - a.impact).slice(0, 5);
    },
    [userEquipment, analyzeEquipmentCoverage]
  );

  // ===============================================
  // 🔧 Helper Functions
  // ===============================================

  const createExerciseTemplate = (
    exercise: any,
    experience: string,
    goal: string
  ): ExerciseTemplate => ({
    exerciseId: exercise.id,
    sets: getSetsForExperience(experience),
    reps: getRepsForGoal(goal),
    restTime: getRestTimeForGoal(goal),
    notes: exercise.instructions || "בצע את התרגיל לפי ההנחיות",
  });

  const calculateAvailabilityScore = (
    exercises: ExerciseTemplate[],
    equipment: string[]
  ): number => {
    if (exercises.length === 0) return 0;

    // This is a simplified calculation - in a real implementation,
    // we'd check each exercise's equipment requirements
    return equipment.length > 0 ? Math.min(1.0, equipment.length / 5) : 0.3;
  };

  const findMissingEquipmentForMuscleGroup = (
    muscleGroup: string,
    currentEquipment: string[]
  ): string[] => {
    // Simplified implementation - in reality would analyze actual exercise requirements
    const commonEquipmentForMuscles: Record<string, EquipmentTag[]> = {
      חזה: ["dumbbell", "barbell", "bench"],
      גב: ["pullup_bar", "dumbbell", "cable"],
      רגליים: ["squat_rack", "barbell", "dumbbell"],
      כתפיים: ["dumbbell", "cable", "barbell"],
    };

    const recommendedEquipment = commonEquipmentForMuscles[muscleGroup] || [];
    return recommendedEquipment.filter((eq) => !currentEquipment.includes(eq));
  };

  // ===============================================
  // 🎯 Memoized Return
  // ===============================================

  return useMemo(
    () => ({
      // Generation functions
      generateExercisesForMuscleGroup,
      findExerciseSubstitute,
      generateRandomExercise,

      // Analysis functions
      analyzeEquipmentCoverage,
      getEquipmentRecommendations,

      // State
      isGenerating,
      lastGeneratedExercises,
      generationHistory,

      // Utility
      userEquipment,
    }),
    [
      generateExercisesForMuscleGroup,
      findExerciseSubstitute,
      generateRandomExercise,
      analyzeEquipmentCoverage,
      getEquipmentRecommendations,
      isGenerating,
      lastGeneratedExercises,
      generationHistory,
      userEquipment,
    ]
  );
};
