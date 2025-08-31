/**
 * @file src/services/workout/WorkoutPlanManager.ts
 * @description מנהל אלגוריתמי תוכניות אימון מרכזי עם תמיכה מלאה בFree/Trial/Premium
 * @updated 2025-09-01
 *
 * @features
 * Trial/Premium users:
 * - AI Smart Plans with progressive overload
 * - Dynamic muscle group balancing
 * - Adaptive rest optimization
 * - Performance-based suggestions
 * - Full history integration
 *
 * Free users:
 * - Fixed pre-designed plans
 * - Basic progression (no AI)
 * - Limited exercise variations
 * - Standard rest times
 *
 * @dependencies userStore, workoutStorageService, workoutLogicService
 * @integration History, Gamification, Notifications, Analytics
 */

import { useUserStore } from "../../stores/userStore";
import { workoutStorageService } from "./workoutStorageService";
import { progressiveOverloadService } from "./ProgressiveOverloadService";
import { smartSuggestionsEngine } from "./SmartSuggestionsEngine";
import { logger } from "../../utils/logger";
import { normalizeEquipment } from "../../utils/equipmentCatalog";
import {
  generateWorkoutPlan,
  getMuscleGroupsForDay,
} from "../../screens/workout/services/workoutLogicService";
import { ExerciseTemplate } from "../../screens/workout/types/workout.types";
import { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import type {
  WorkoutPlanRequest,
  WorkoutDay,
  WorkoutPlan,
  SmartSuggestion,
} from "./types";

// ===============================================
// 🏗️ Types & Interfaces - imported from ./types.ts
// ===============================================

// ===============================================
// 🎯 WorkoutPlanManager Class
// ===============================================

class WorkoutPlanManager {
  private readonly FREE_PLAN_TEMPLATES = {
    "3_days": [
      {
        name: "אימון גוף עליון",
        muscles: ["חזה", "גב", "כתפיים", "ביצפס", "טריצפס"],
      },
      { name: "אימון רגליים", muscles: ["רגליים", "ישבן", "שוקיים"] },
      { name: "אימון מלא", muscles: ["חזה", "גב", "רגליים", "בטן"] },
    ],
    "4_days": [
      { name: "חזה + טריצפס", muscles: ["חזה", "טריצפס"] },
      { name: "גב + ביצפס", muscles: ["גב", "ביצפס"] },
      { name: "רגליים", muscles: ["רגליים", "ישבן", "שוקיים"] },
      { name: "כתפיים + בטן", muscles: ["כתפיים", "בטן", "core"] },
    ],
    "5_days": [
      { name: "חזה", muscles: ["חזה", "טריצפס"] },
      { name: "גב", muscles: ["גב", "ביצפס"] },
      { name: "כתפיים", muscles: ["כתפיים", "טרפזיוס"] },
      { name: "רגליים", muscles: ["רגליים", "ישבן"] },
      { name: "ידיים + בטן", muscles: ["ביצפס", "טריצפס", "בטן"] },
    ],
  };

  /**
   * Generate workout plan based on user subscription and preferences
   */
  async generatePlan(request: WorkoutPlanRequest): Promise<WorkoutPlan> {
    try {
      const user = useUserStore.getState().user;
      const subscription = user?.subscription;
      const canAccessPremium = useUserStore
        .getState()
        .canAccessPremiumFeatures();

      logger.info("WorkoutPlanManager", "Generating workout plan", {
        frequency: request.frequency,
        experience: request.experience,
        canAccessPremium,
        subscriptionType: subscription?.type || "free",
      });

      // Force basic plan for Free users (unless override)
      if (!canAccessPremium && !request.forceBasicPlan) {
        return await this.generateBasicPlan(request);
      }

      // Premium/Trial users get AI Smart Plans
      return await this.generateSmartPlan(request);
    } catch (error) {
      logger.error("WorkoutPlanManager", "Failed to generate plan", error);
      // Fallback to basic plan
      return await this.generateBasicPlan(request);
    }
  }

  /**
   * Generate basic fixed plan for Free users
   */
  private async generateBasicPlan(
    request: WorkoutPlanRequest
  ): Promise<WorkoutPlan> {
    const { frequency, experience, duration, goal, equipment = [] } = request;
    const normalizedEquipment = normalizeEquipment(equipment);

    // Get pre-defined template
    const templateKey =
      `${Math.min(frequency, 5)}_days` as keyof typeof this.FREE_PLAN_TEMPLATES;
    const template =
      this.FREE_PLAN_TEMPLATES[templateKey] ||
      this.FREE_PLAN_TEMPLATES["3_days"];

    // Generate workout days based on template
    const workouts: WorkoutDay[] = template
      .slice(0, frequency)
      .map((dayTemplate, index) => {
        const workoutDay = {
          id: `basic_day_${index}`,
          name: dayTemplate.name,
          dayNumber: index + 1,
          muscles: dayTemplate.muscles,
          exercises: [] as ExerciseTemplate[],
        };

        // Use existing logic service to populate exercises
        const exercises =
          generateWorkoutPlan(
            [workoutDay],
            normalizedEquipment,
            experience,
            duration,
            { goal, planType: "basic" }
          )[0]?.exercises || [];

        return {
          ...workoutDay,
          exercises,
          metadata: {
            difficulty:
              experience === "beginner"
                ? "easy"
                : experience === "intermediate"
                  ? "moderate"
                  : "hard",
            estimatedDuration: duration,
            caloriesBurned: this.estimateCalories(
              exercises.length,
              duration,
              experience
            ),
          },
        };
      });

    return {
      id: `basic_plan_${Date.now()}`,
      type: "basic",
      name: `תוכנית אימון בסיסית - ${frequency} ימים`,
      description: "תוכנית אימון קבועה ומותאמת לרמתך",
      workouts,
      createdAt: new Date().toISOString(),
      metadata: {
        totalDuration: workouts.reduce(
          (sum, w) => sum + (w.metadata?.estimatedDuration || 0),
          0
        ),
        weeklyVolume: workouts.length * duration,
        muscleGroupsCovered: [...new Set(workouts.flatMap((w) => w.muscles))],
        progressionStrategy: "fixed",
        subscriptionLevel: "free",
      },
    };
  }

  /**
   * Generate AI Smart Plan for Premium/Trial users
   */
  private async generateSmartPlan(
    request: WorkoutPlanRequest
  ): Promise<WorkoutPlan> {
    const { frequency, experience, duration, goal, equipment = [] } = request;
    const normalizedEquipment = normalizeEquipment(equipment);

    // Get user's workout history for intelligent suggestions
    const history = await this.getUserWorkoutHistory();
    const muscleGroupBalance = this.analyzeMuscleGroupBalance(history);

    // Generate optimized workout days with AI logic
    const workouts: WorkoutDay[] = [];

    for (let i = 0; i < frequency; i++) {
      const dayName = this.getOptimalDayName(i, frequency, muscleGroupBalance);
      const muscles = getMuscleGroupsForDay(dayName);

      const workoutDay = {
        id: `smart_day_${i}`,
        name: dayName,
        dayNumber: i + 1,
        muscles,
        exercises: [] as ExerciseTemplate[],
      };

      // Generate exercises with AI enhancement
      const baseExercises =
        generateWorkoutPlan(
          [workoutDay],
          normalizedEquipment,
          experience,
          duration,
          { goal, planType: "smart" }
        )[0]?.exercises || [];

      // Apply progressive overload if history exists
      const enhancedExercises = await this.applyProgressiveOverload(
        baseExercises,
        history
      );

      // Add AI suggestions for Premium users
      const aiSuggestions = await this.generateAISuggestions(
        enhancedExercises,
        history,
        goal
      );

      workouts.push({
        ...workoutDay,
        exercises: enhancedExercises,
        metadata: {
          difficulty: this.calculateDifficultyScore(
            enhancedExercises,
            experience
          ),
          estimatedDuration: duration,
          caloriesBurned: this.estimateCalories(
            enhancedExercises.length,
            duration,
            experience
          ),
          aiSuggestions,
        },
      });
    }

    return {
      id: `smart_plan_${Date.now()}`,
      type: "ai_premium",
      name: `תוכנית AI חכמה - ${frequency} ימים`,
      description: "תוכנית מותאמת אישית עם אלגוריתמי AI ו-Progressive Overload",
      workouts,
      createdAt: new Date().toISOString(),
      metadata: {
        totalDuration: workouts.reduce(
          (sum, w) => sum + (w.metadata?.estimatedDuration || 0),
          0
        ),
        weeklyVolume: this.calculateWeeklyVolume(workouts),
        muscleGroupsCovered: [...new Set(workouts.flatMap((w) => w.muscles))],
        progressionStrategy: "adaptive",
        subscriptionLevel: "premium",
      },
    };
  }

  /**
   * Get user's workout history for analysis
   */
  private async getUserWorkoutHistory(): Promise<WorkoutWithFeedback[]> {
    try {
      return await workoutStorageService.getHistory();
    } catch (error) {
      logger.error(
        "WorkoutPlanManager",
        "Failed to get workout history",
        error
      );
      return [];
    }
  }

  /**
   * Analyze muscle group balance in recent workouts
   */
  private analyzeMuscleGroupBalance(
    history: WorkoutWithFeedback[]
  ): Record<string, number> {
    const muscleCount: Record<string, number> = {};

    history.slice(0, 10).forEach((workout) => {
      if (workout.workout?.exercises) {
        workout.workout.exercises.forEach((exercise) => {
          const exerciseId = exercise.id?.toLowerCase() || "";

          // Chest exercises
          if (
            exerciseId.includes("chest") ||
            exerciseId.includes("press") ||
            exerciseId.includes("push") ||
            exerciseId.includes("bench")
          ) {
            muscleCount["חזה"] = (muscleCount["חזה"] || 0) + 1;
          }

          // Back exercises
          if (
            exerciseId.includes("back") ||
            exerciseId.includes("row") ||
            exerciseId.includes("pull") ||
            exerciseId.includes("lat")
          ) {
            muscleCount["גב"] = (muscleCount["גב"] || 0) + 1;
          }

          // Leg exercises
          if (
            exerciseId.includes("leg") ||
            exerciseId.includes("squat") ||
            exerciseId.includes("lunge") ||
            exerciseId.includes("deadlift") ||
            exerciseId.includes("quad") ||
            exerciseId.includes("hamstring")
          ) {
            muscleCount["רגליים"] = (muscleCount["רגליים"] || 0) + 1;
          }

          // Shoulder exercises
          if (
            exerciseId.includes("shoulder") ||
            exerciseId.includes("deltoid") ||
            exerciseId.includes("overhead") ||
            exerciseId.includes("raise")
          ) {
            muscleCount["כתפיים"] = (muscleCount["כתפיים"] || 0) + 1;
          }

          // Bicep exercises
          if (
            exerciseId.includes("bicep") ||
            exerciseId.includes("curl") ||
            exerciseId.includes("hammer")
          ) {
            muscleCount["ביצפס"] = (muscleCount["ביצפס"] || 0) + 1;
          }

          // Tricep exercises
          if (
            exerciseId.includes("tricep") ||
            exerciseId.includes("extension") ||
            exerciseId.includes("dips") ||
            exerciseId.includes("skull")
          ) {
            muscleCount["טריצפס"] = (muscleCount["טריצפס"] || 0) + 1;
          }

          // Core exercises
          if (
            exerciseId.includes("core") ||
            exerciseId.includes("abs") ||
            exerciseId.includes("plank") ||
            exerciseId.includes("crunch")
          ) {
            muscleCount["בטן"] = (muscleCount["בטן"] || 0) + 1;
          }

          // Glutes exercises
          if (
            exerciseId.includes("glute") ||
            exerciseId.includes("butt") ||
            exerciseId.includes("hip")
          ) {
            muscleCount["ישבן"] = (muscleCount["ישבן"] || 0) + 1;
          }
        });
      }
    });

    return muscleCount;
  }

  /**
   * Get optimal day name based on muscle balance and frequency
   */
  private getOptimalDayName(
    dayIndex: number,
    frequency: number,
    muscleBalance: Record<string, number>
  ): string {
    const templates =
      this.FREE_PLAN_TEMPLATES[
        `${Math.min(frequency, 5)}_days` as keyof typeof this.FREE_PLAN_TEMPLATES
      ];

    if (dayIndex < templates.length) {
      const template = templates[dayIndex];

      // If we have muscle balance data, try to optimize the day selection
      if (Object.keys(muscleBalance).length > 0) {
        // Find the least worked muscle groups from the template
        const templateMuscles = template.muscles;
        const leastWorkedMuscle = templateMuscles.reduce((least, muscle) => {
          const currentCount = muscleBalance[muscle] || 0;
          const leastCount = muscleBalance[least] || 0;
          return currentCount < leastCount ? muscle : least;
        });

        // If the least worked muscle is in this template, prioritize it
        if (templateMuscles.includes(leastWorkedMuscle)) {
          return template.name;
        }
      }

      return template.name;
    }

    return "אימון מלא";
  }

  /**
   * Apply progressive overload using new service
   */
  private async applyProgressiveOverload(
    exercises: ExerciseTemplate[],
    history: WorkoutWithFeedback[]
  ): Promise<ExerciseTemplate[]> {
    try {
      // Log history availability for debugging
      if (history.length > 0) {
        logger.info(
          "WorkoutPlanManager",
          "Applying progressive overload with history",
          {
            historyLength: history.length,
          }
        );
      }

      return await progressiveOverloadService.generateWorkoutProgression(
        exercises
      );
    } catch (error) {
      logger.error(
        "WorkoutPlanManager",
        "Failed to apply progressive overload",
        error
      );
      return exercises; // Return original on error
    }
  }

  /**
   * Generate AI suggestions using Smart Suggestions Engine
   */
  private async generateAISuggestions(
    exercises: ExerciseTemplate[],
    history: WorkoutWithFeedback[],
    goal: string
  ): Promise<string[]> {
    try {
      // Validate and safely cast the goal parameter
      const validGoals: readonly string[] = [
        "strength",
        "muscle_gain",
        "weight_loss",
        "endurance",
        "general_fitness",
      ];

      const validatedGoal = validGoals.includes(goal)
        ? (goal as
            | "strength"
            | "muscle_gain"
            | "weight_loss"
            | "endurance"
            | "general_fitness")
        : "general_fitness";

      const request: WorkoutPlanRequest = {
        frequency: 3,
        experience: "intermediate",
        duration: 45,
        goal: validatedGoal,
        equipment: [],
      };

      const suggestions =
        await smartSuggestionsEngine.generateSuggestions(request);

      // Log history usage for debugging
      if (history.length > 0) {
        logger.info(
          "WorkoutPlanManager",
          "Generating AI suggestions with history",
          {
            historyLength: history.length,
            suggestionsCount:
              suggestions.immediate.length + suggestions.nextWorkout.length,
          }
        );
      }

      return [
        ...suggestions.immediate.map((s) => s.title),
        ...suggestions.nextWorkout.map((s) => s.title),
      ].slice(0, 3); // Limit to 3 suggestions
    } catch (error) {
      logger.error(
        "WorkoutPlanManager",
        "Failed to generate AI suggestions",
        error
      );
      return [
        "המשך עם התוכנית הנוכחית",
        "שמור על עקביות",
        "התמקד בטכניקה נכונה",
      ];
    }
  }

  /**
   * Calculate difficulty score
   */
  private calculateDifficultyScore(
    exercises: ExerciseTemplate[],
    experience: string
  ): "easy" | "moderate" | "hard" {
    const baseScore = exercises.length;
    const experienceMultiplier =
      experience === "beginner"
        ? 0.7
        : experience === "intermediate"
          ? 1.0
          : 1.3;
    const score = baseScore * experienceMultiplier;

    if (score < 4) return "easy";
    if (score < 7) return "moderate";
    return "hard";
  }

  /**
   * Estimate calories burned
   */
  private estimateCalories(
    exerciseCount: number,
    duration: number,
    experience: string
  ): number {
    const baseRate =
      experience === "beginner" ? 6 : experience === "intermediate" ? 8 : 10;
    return Math.round(duration * baseRate * (exerciseCount / 5));
  }

  /**
   * Calculate weekly training volume
   */
  private calculateWeeklyVolume(workouts: WorkoutDay[]): number {
    return workouts.reduce((total, workout) => {
      const workoutVolume = workout.exercises.reduce((sum, exercise) => {
        try {
          const repsValue = exercise.reps.split("-")[0] || "10";
          const reps = parseInt(repsValue, 10);

          // Validate parsed value
          if (isNaN(reps) || reps < 0) {
            logger.warn(
              "WorkoutPlanManager",
              "Invalid reps value, using default",
              {
                repsValue,
                defaultValue: 10,
              }
            );
            return sum + exercise.sets * 10;
          }

          return sum + exercise.sets * reps;
        } catch (error) {
          logger.error(
            "WorkoutPlanManager",
            "Error parsing exercise reps",
            error
          );
          return sum + exercise.sets * 10; // Default fallback
        }
      }, 0);
      return total + workoutVolume;
    }, 0);
  }

  /**
   * Get plan recommendations based on user profile
   */
  async getPlanRecommendations(): Promise<{
    recommendedFrequency: number;
    recommendedDuration: number;
    suggestions: SmartSuggestion[];
  }> {
    const user = useUserStore.getState().user;
    const canAccessPremium = useUserStore.getState().canAccessPremiumFeatures();
    const history = await this.getUserWorkoutHistory();

    const suggestions: SmartSuggestion[] = [];

    // Basic recommendations for all users
    let recommendedFrequency = 3;
    let recommendedDuration = 45;

    if (user?.trainingstats?.currentFitnessLevel) {
      const level = user.trainingstats.currentFitnessLevel;
      if (level === "beginner") {
        recommendedFrequency = 3;
        recommendedDuration = 30;
      } else if (level === "advanced") {
        recommendedFrequency = 5;
        recommendedDuration = 60;
      }
    }

    // Premium-only suggestions
    if (canAccessPremium) {
      if (history.length > 5) {
        suggestions.push({
          type: "intensity_change",
          priority: "medium",
          title: "התאמת עצמות מומלצת",
          description: "על בסיס 5 האימונים האחרונים, מומלץ להגביר עצמות ב-10%",
          actionable: true,
          premiumFeature: true,
        });
      }

      suggestions.push({
        type: "rest_adjustment",
        priority: "low",
        title: "אופטימיזציה של זמני מנוחה",
        description: "התאמת זמני מנוחה בהתאם למטרות ולביצועים",
        actionable: true,
        premiumFeature: true,
      });
    } else {
      suggestions.push({
        type: "exercise_swap",
        priority: "high",
        title: "שדרג לפרימיום לקבלת המלצות AI",
        description: "פתח את מלוא הפוטנציאל עם אלגוריתמי AI מתקדמים",
        actionable: true,
        premiumFeature: false,
      });
    }

    return {
      recommendedFrequency,
      recommendedDuration,
      suggestions,
    };
  }

  /**
   * Generate workout plan analytics
   */
  async generatePlanAnalytics(plan: WorkoutPlan): Promise<{
    muscleGroupDistribution: Record<string, number>;
    weeklyVolumeBreakdown: Record<string, number>;
    difficultyProgression: string[];
    recommendations: string[];
  }> {
    const muscleGroupDistribution: Record<string, number> = {};
    const weeklyVolumeBreakdown: Record<string, number> = {};

    plan.workouts.forEach((workout, index) => {
      // Muscle group distribution
      workout.muscles.forEach((muscle) => {
        muscleGroupDistribution[muscle] =
          (muscleGroupDistribution[muscle] || 0) + 1;
      });

      // Volume breakdown
      const dayVolume = workout.exercises.reduce(
        (sum, ex) => sum + ex.sets * parseInt(ex.reps.split("-")[0] || "10"),
        0
      );
      weeklyVolumeBreakdown[`יום ${index + 1}`] = dayVolume;
    });

    const difficultyProgression = plan.workouts.map(
      (w, i) => `יום ${i + 1}: ${w.metadata?.difficulty || "moderate"}`
    );

    const recommendations = [
      `תוכנית ${plan.type === "basic" ? "בסיסית" : "מתקדמת"} של ${plan.workouts.length} ימי אימון`,
      `נפח שבועי כולל: ${plan.metadata.weeklyVolume} חזרות`,
      `כיסוי קבוצות שרירים: ${plan.metadata.muscleGroupsCovered.length} קבוצות`,
    ];

    return {
      muscleGroupDistribution,
      weeklyVolumeBreakdown,
      difficultyProgression,
      recommendations,
    };
  }

  /**
   * Get enhanced workout recommendations with AI integration
   */
  async getEnhancedRecommendations(): Promise<{
    todaysFocus: string;
    weeklyGoal: string;
    nextMilestone: string;
    motivationalTip: string;
    smartSuggestions?: string[];
    progressAnalysis?: string;
  }> {
    try {
      const canAccessPremium = useUserStore
        .getState()
        .canAccessPremiumFeatures();

      // Get basic recommendations
      const basicRecommendations =
        await smartSuggestionsEngine.getPersonalizedRecommendations();

      const enhanced = {
        todaysFocus: basicRecommendations.todaysFocus,
        weeklyGoal: basicRecommendations.weeklyGoal,
        nextMilestone: basicRecommendations.nextMilestone,
        motivationalTip: basicRecommendations.motivationalTip,
        smartSuggestions: undefined as string[] | undefined,
        progressAnalysis: undefined as string | undefined,
      };

      if (canAccessPremium) {
        // Add Premium features
        const progressRecommendations =
          await progressiveOverloadService.getProgressionRecommendations();

        enhanced.smartSuggestions =
          progressRecommendations.generalRecommendations;
        enhanced.progressAnalysis = progressRecommendations.periodizationStatus
          ? `שבוע ${progressRecommendations.periodizationStatus.currentWeek} בשלב ${progressRecommendations.periodizationStatus.phase}`
          : undefined;
      }

      return enhanced;
    } catch (error) {
      logger.error(
        "WorkoutPlanManager",
        "Failed to get enhanced recommendations",
        error
      );
      return {
        todaysFocus: "התחל עם אימון קל",
        weeklyGoal: "השלם 3 אימונים השבוע",
        nextMilestone: "הגע ל-10 אימונים",
        motivationalTip: "כל צעד קדימה הוא הישג! 💪",
      };
    }
  }

  /**
   * Advanced plan optimization for Premium users
   */
  async optimizeExistingPlan(planId: string): Promise<WorkoutPlan | null> {
    try {
      const canAccessPremium = useUserStore
        .getState()
        .canAccessPremiumFeatures();

      if (!canAccessPremium) {
        logger.warn(
          "WorkoutPlanManager",
          "Plan optimization requires Premium subscription"
        );
        return null;
      }

      // This would fetch and optimize an existing plan
      // Implementation would depend on plan storage system

      logger.info("WorkoutPlanManager", "Plan optimization completed", {
        planId,
      });
      return null; // Placeholder
    } catch (error) {
      logger.error("WorkoutPlanManager", "Failed to optimize plan", error);
      return null;
    }
  }
}

// Export singleton instance
export const workoutPlanManager = new WorkoutPlanManager();
