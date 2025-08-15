/**
 * @file src/services/workout/workoutRecommendationService.ts
 * @description Service for generating smart workout recommendations.
 */
import { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { PersonalData } from "../../utils/personalDataUtils";
import {
  calculatePersonalizedCalories,
  getAgeStrengthFactor,
} from "../../utils/personalDataUtils";

class WorkoutRecommendationService {
  /**
   * Get personalized insights for the next workout recommendation.
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
      const recentWorkouts = history.slice(0, 5); // Last 5 workouts

      if (recentWorkouts.length === 0) {
        return {
          suggestedDuration: 45,
          suggestedIntensity: "moderate",
          recoveryRecommendation: "התחל בעדינות עם אימון ראשון",
          focusAreas: ["גוף מלא"],
          expectedCalorieBurn: personalData
            ? calculatePersonalizedCalories(45, personalData)
            : 360,
        };
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
      const suggestedDuration = Math.round(
        avgDuration * ageFactor * genderFactor
      );

      // Suggest intensity based on recent performance
      let suggestedIntensity: "low" | "moderate" | "high" = "moderate";
      if (avgVolume > 2000) {
        suggestedIntensity = ageFactor < 0.9 ? "moderate" : "high";
      } else if (avgVolume < 800) {
        suggestedIntensity = "low";
      }

      // Recovery recommendations
      const daysSinceLastWorkout = this.getDaysSinceLastWorkout(recentWorkouts);
      let recoveryRecommendation = "מוכן לאימון!";

      if (daysSinceLastWorkout < 1) {
        recoveryRecommendation = "שקול יום מנוחה נוסף";
      } else if (daysSinceLastWorkout > 3) {
        recoveryRecommendation = "התחל בעדינות אחרי ההפסקה";
      }

      // Focus areas based on recent training
      const focusAreas = this.suggestFocusAreas(recentWorkouts, personalData);

      // Expected calorie burn
      const expectedCalorieBurn = calculatePersonalizedCalories(
        suggestedDuration,
        personalData
      );

      return {
        suggestedDuration,
        suggestedIntensity,
        recoveryRecommendation,
        focusAreas,
        expectedCalorieBurn,
      };
    } catch (error) {
      console.error("Error generating next workout insights:", error);
      return {
        suggestedDuration: 45,
        suggestedIntensity: "moderate",
        recoveryRecommendation: "נסה שוב מאוחר יותר",
        focusAreas: ["גוף מלא"],
        expectedCalorieBurn: 360,
      };
    }
  }

  /**
   * Calculate days since the last workout.
   */
  private getDaysSinceLastWorkout(workouts: WorkoutWithFeedback[]): number {
    if (workouts.length === 0) return 7;

    const lastWorkout = new Date(workouts[0].feedback?.completedAt || 0);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastWorkout.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Suggest focus areas for the next workout.
   */
  private suggestFocusAreas(
    recentWorkouts: WorkoutWithFeedback[],
    personalData?: PersonalData
  ): string[] {
    const focusAreas: string[] = [];

    // Analyze recent muscle groups trained
    const recentMuscleGroups = new Set<string>();
    recentWorkouts.forEach((w) => {
      w.workout?.exercises?.forEach((ex) => {
        if (ex.primaryMuscles) {
          ex.primaryMuscles.forEach((muscle: string) =>
            recentMuscleGroups.add(muscle)
          );
        }
      });
    });

    // Suggest areas that haven't been trained recently
    const allMuscleGroups = [
      "chest",
      "back",
      "legs",
      "shoulders",
      "arms",
      "core",
    ];
    const undertrainedGroups = allMuscleGroups.filter(
      (group) => !recentMuscleGroups.has(group)
    );

    if (undertrainedGroups.length > 0) {
      focusAreas.push(...undertrainedGroups.slice(0, 2));
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
   * Generate personalized recommendations based on analytics.
   */
  generatePersonalizedRecommendations(data: {
    volumeProgression: number;
    strengthProgression: number;
    consistencyScore: number;
    fitnessScore: number;
    personalData?: PersonalData;
  }): string[] {
    const recommendations: string[] = [];

    // Consistency recommendations
    if (data.consistencyScore < 70) {
      recommendations.push("נסה לשמור על קביעות - 3-4 אימונים בשבוע אידיאליים");
    }

    // Progression recommendations
    if (data.volumeProgression < 5 && data.strengthProgression < 5) {
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
        data.fitnessScore > 70
      ) {
        recommendations.push("מצוין! אתה מוכן לעבור לרמת ביניים");
      }

      if (
        data.personalData.fitnessLevel === "advanced" &&
        data.fitnessScore < 60
      ) {
        recommendations.push("שקול להוריד את העצימות ולהתמקד בריכוז");
      }
    }

    // Performance recommendations
    if (data.fitnessScore > 80) {
      recommendations.push("ביצועים מעולים! המשך כך");
    } else if (data.fitnessScore < 40) {
      recommendations.push("קח יום מנוחה נוסף בין האימונים");
    }

    return recommendations.length > 0 ? recommendations : ["המשך לעבוד קשה!"];
  }
}

export const workoutRecommendationService = new WorkoutRecommendationService();
