/**
 * @file src/services/workout/workoutRecommendationService.ts
 * @description Service for generating smart workout recommendations based on user history and personal data.
 * @updated 2025-09-01
 *
 * @features
 * - Personalized workout duration and intensity recommendations
 * - Recovery time analysis based on workout history
 * - Muscle group balance suggestions
 * - Age and gender-adjusted recommendations
 * - Performance-based progression insights
 *
 * @dependencies WorkoutWithFeedback, PersonalData, personalDataUtils
 * @integration WorkoutPlanManager, Analytics, UserStore
 */
import { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { PersonalData } from "../../utils/personalDataUtils";
import {
  calculatePersonalizedCalories,
  getAgeStrengthFactor,
} from "../../utils/personalDataUtils";
import { logger } from "../../utils/logger";

class WorkoutRecommendationService {
  // Constants for recommendation thresholds
  private readonly RECENT_WORKOUTS_COUNT = 5;
  private readonly HIGH_VOLUME_THRESHOLD = 2000;
  private readonly LOW_VOLUME_THRESHOLD = 800;
  private readonly CONSISTENCY_THRESHOLD = 70;
  private readonly PROGRESSION_THRESHOLD = 5;
  private readonly HIGH_FITNESS_THRESHOLD = 80;
  private readonly LOW_FITNESS_THRESHOLD = 40;
  private readonly ADVANCED_LOW_FITNESS_THRESHOLD = 60;
  private readonly BEGINNER_HIGH_FITNESS_THRESHOLD = 70;

  // Recovery time constants (in days)
  private readonly RECOVERY_TOO_SOON = 1;
  private readonly RECOVERY_BREAK_THRESHOLD = 3;
  private readonly DEFAULT_DAYS_SINCE_WORKOUT = 7;

  // Default values
  private readonly DEFAULT_DURATION = 45;
  private readonly DEFAULT_CALORIE_BURN = 360;
  private readonly MAX_FOCUS_AREAS = 2;

  // Muscle groups for analysis - using centralized constants
  private readonly ALL_MUSCLE_GROUPS = [
    "chest",
    "back",
    "shoulders",
    "biceps",
    "triceps",
    "forearms",
    "core",
    "quadriceps",
    "hamstrings",
    "glutes",
    "calves",
    "hips",
    "neck",
  ] as const;
  /**
   * Get personalized insights for the next workout recommendation.
   *
   * @param history - Array of recent workouts with feedback
   * @param personalData - Optional personal data for more accurate recommendations
   * @returns Personalized workout insights including duration, intensity, recovery, and focus areas
   */
  async getPersonalizedNextWorkoutInsights(
    history: WorkoutWithFeedback[],
    personalData?: PersonalData
  ): Promise<{
    suggestedDuration: number; // minutes
    suggestedIntensity: "low" | "moderate" | "high";
    recoveryRecommendation: string;
    focusAreas: string[];
    expectedCalorieBurn: number;
  }> {
    try {
      // Validate input parameters
      if (!Array.isArray(history)) {
        logger.warn(
          "WorkoutRecommendationService",
          "Invalid history parameter",
          {
            historyType: typeof history,
          }
        );
        return this.getDefaultInsights(personalData);
      }

      const recentWorkouts = history.slice(0, this.RECENT_WORKOUTS_COUNT);

      if (recentWorkouts.length === 0) {
        return this.getDefaultInsights(personalData);
      }

      // Calculate average duration and intensity
      const avgDuration =
        recentWorkouts.reduce(
          (sum, w) => sum + Math.round((w.workout?.duration || 0) / 60),
          0
        ) / recentWorkouts.length;

      const avgVolume =
        recentWorkouts.reduce(
          (sum, w) => sum + (w.stats?.totalVolume || 0),
          0
        ) / recentWorkouts.length;

      // Age-adjusted recommendations
      const ageFactor = personalData
        ? getAgeStrengthFactor(personalData.age)
        : 1.0;
      const genderFactor = personalData?.gender === "female" ? 0.9 : 1.0;

      // Suggest duration (with age adjustments)
      const suggestedDuration = Math.max(
        20, // Minimum 20 minutes
        Math.min(
          90, // Maximum 90 minutes
          Math.round(avgDuration * ageFactor * genderFactor)
        )
      );

      // Suggest intensity based on recent performance
      const suggestedIntensity = this.calculateSuggestedIntensity(
        avgVolume,
        ageFactor
      );

      // Recovery recommendations
      const daysSinceLastWorkout = this.getDaysSinceLastWorkout(recentWorkouts);
      const recoveryRecommendation =
        this.getRecoveryRecommendation(daysSinceLastWorkout);

      // Focus areas based on recent training
      const focusAreas = this.suggestFocusAreas(recentWorkouts, personalData);

      // Expected calorie burn
      const expectedCalorieBurn = calculatePersonalizedCalories(
        suggestedDuration,
        personalData
      );

      logger.info(
        "WorkoutRecommendationService",
        "Generated workout insights",
        {
          suggestedDuration,
          suggestedIntensity,
          daysSinceLastWorkout,
          focusAreasCount: focusAreas.length,
          expectedCalorieBurn,
        }
      );

      return {
        suggestedDuration,
        suggestedIntensity,
        recoveryRecommendation,
        focusAreas,
        expectedCalorieBurn,
      };
    } catch (error) {
      logger.error(
        "WorkoutRecommendationService",
        "Failed to generate next workout insights",
        error
      );
      return this.getDefaultInsights(personalData);
    }
  }

  /**
   * Get default insights when no history is available
   */
  private getDefaultInsights(personalData?: PersonalData): {
    suggestedDuration: number;
    suggestedIntensity: "low" | "moderate" | "high";
    recoveryRecommendation: string;
    focusAreas: string[];
    expectedCalorieBurn: number;
  } {
    return {
      suggestedDuration: this.DEFAULT_DURATION,
      suggestedIntensity: "moderate",
      recoveryRecommendation: "התחל בעדינות עם אימון ראשון",
      focusAreas: ["גוף מלא"],
      expectedCalorieBurn: personalData
        ? calculatePersonalizedCalories(this.DEFAULT_DURATION, personalData)
        : this.DEFAULT_CALORIE_BURN,
    };
  }

  /**
   * Calculate suggested intensity based on volume and age factor
   */
  private calculateSuggestedIntensity(
    avgVolume: number,
    ageFactor: number
  ): "low" | "moderate" | "high" {
    if (avgVolume > this.HIGH_VOLUME_THRESHOLD) {
      return ageFactor < 0.9 ? "moderate" : "high";
    } else if (avgVolume < this.LOW_VOLUME_THRESHOLD) {
      return "low";
    }
    return "moderate";
  }

  /**
   * Get recovery recommendation based on days since last workout
   */
  private getRecoveryRecommendation(daysSinceLastWorkout: number): string {
    if (daysSinceLastWorkout < this.RECOVERY_TOO_SOON) {
      return "שקול יום מנוחה נוסף";
    } else if (daysSinceLastWorkout > this.RECOVERY_BREAK_THRESHOLD) {
      return "התחל בעדינות אחרי ההפסקה";
    }
    return "מוכן לאימון!";
  }

  /**
   * Calculate days since the last workout.
   */
  private getDaysSinceLastWorkout(workouts: WorkoutWithFeedback[]): number {
    if (workouts.length === 0) return this.DEFAULT_DAYS_SINCE_WORKOUT;

    const lastWorkout = new Date(workouts[0].feedback?.completedAt || 0);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastWorkout.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Suggest focus areas for the next workout based on recent training history.
   *
   * @param recentWorkouts - Array of recent workouts to analyze
   * @param personalData - Optional personal data for fitness level consideration
   * @returns Array of suggested focus areas (muscle groups or training types)
   */
  private suggestFocusAreas(
    recentWorkouts: WorkoutWithFeedback[],
    personalData?: PersonalData
  ): string[] {
    const focusAreas: string[] = [];

    // Analyze recent muscle groups trained
    const recentMuscleGroups = new Set<string>();
    recentWorkouts.forEach((workout) => {
      workout.workout?.exercises?.forEach((exercise) => {
        if (exercise.primaryMuscles) {
          exercise.primaryMuscles.forEach((muscle: string) =>
            recentMuscleGroups.add(muscle.toLowerCase())
          );
        }
      });
    });

    // Suggest areas that haven't been trained recently
    const undertrainedGroups = this.ALL_MUSCLE_GROUPS.filter(
      (group) => !recentMuscleGroups.has(group)
    );

    if (undertrainedGroups.length > 0) {
      // Convert English muscle groups to Hebrew for consistency
      const hebrewMappings: Record<string, string> = {
        chest: "חזה",
        back: "גב",
        legs: "רגליים",
        shoulders: "כתפיים",
        arms: "ידיים",
        core: "בטן",
      };

      const hebrewGroups = undertrainedGroups
        .slice(0, this.MAX_FOCUS_AREAS)
        .map((group) => hebrewMappings[group] || group);

      focusAreas.push(...hebrewGroups);
    } else {
      // If all groups were trained, suggest based on fitness level
      if (personalData?.fitnessLevel === "beginner") {
        focusAreas.push("גוף מלא");
      } else {
        focusAreas.push("כוח", "סיבולת");
      }
    }

    return focusAreas.length > 0 ? focusAreas : ["גוף מלא"];
  }

  /**
   * Generate personalized recommendations based on analytics data.
   *
   * @param data - Analytics data including progression metrics and personal information
   * @returns Array of personalized recommendation strings
   */
  generatePersonalizedRecommendations(data: {
    volumeProgression: number;
    strengthProgression: number;
    consistencyScore: number;
    fitnessScore: number;
    personalData?: PersonalData;
  }): string[] {
    const recommendations: string[] = [];

    // Validate input data
    if (
      typeof data.consistencyScore !== "number" ||
      typeof data.fitnessScore !== "number" ||
      typeof data.volumeProgression !== "number" ||
      typeof data.strengthProgression !== "number"
    ) {
      logger.warn(
        "WorkoutRecommendationService",
        "Invalid analytics data provided",
        {
          dataKeys: Object.keys(data),
        }
      );
      return ["המשך לעבוד קשה!"];
    }

    // Consistency recommendations
    if (data.consistencyScore < this.CONSISTENCY_THRESHOLD) {
      recommendations.push("נסה לשמור על קביעות - 3-4 אימונים בשבוע אידיאליים");
    }

    // Progression recommendations
    if (
      data.volumeProgression < this.PROGRESSION_THRESHOLD &&
      data.strengthProgression < this.PROGRESSION_THRESHOLD
    ) {
      recommendations.push("הגדל בהדרגה את המשקל או מספר החזרות");
    }

    // Age-specific recommendations
    if (data.personalData) {
      const ageFactor = getAgeStrengthFactor(data.personalData.age);
      if (ageFactor < 0.9) {
        recommendations.push("התמקד ביציבות ומניעת פציעות - איכות על פני כמות");
      }

      // Fitness level recommendations
      if (
        data.personalData.fitnessLevel === "beginner" &&
        data.fitnessScore > this.BEGINNER_HIGH_FITNESS_THRESHOLD
      ) {
        recommendations.push("מצוין! אתה מוכן לעבור לרמת ביניים");
      }

      if (
        data.personalData.fitnessLevel === "advanced" &&
        data.fitnessScore < this.ADVANCED_LOW_FITNESS_THRESHOLD
      ) {
        recommendations.push("שקול להוריד את העצימות ולהתמקד בריכוז");
      }
    }

    // Performance recommendations
    if (data.fitnessScore > this.HIGH_FITNESS_THRESHOLD) {
      recommendations.push("ביצועים מעולים! המשך כך");
    } else if (data.fitnessScore < this.LOW_FITNESS_THRESHOLD) {
      recommendations.push("קח יום מנוחה נוסף בין האימונים");
    }

    logger.info(
      "WorkoutRecommendationService",
      "Generated personalized recommendations",
      {
        recommendationsCount: recommendations.length,
        consistencyScore: data.consistencyScore,
        fitnessScore: data.fitnessScore,
      }
    );

    return recommendations.length > 0 ? recommendations : ["המשך לעבוד קשה!"];
  }
}

export const workoutRecommendationService = new WorkoutRecommendationService();
