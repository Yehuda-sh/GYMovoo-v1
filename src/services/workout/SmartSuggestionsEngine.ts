/**
 * @file src/services/workout/SmartSuggestionsEngine.ts
 * @description מנוע הצעות חכמות AI לתוכניות אימון
 *
 * @features
 * Free users:
 * - Basic exercise suggestions
 * - Simple muscle group rotation
 * - Random workout variation
 *
 * Premium users:
 * - AI-driven personalized suggestions
 * - Performance-based recommendations
 * - Advanced periodization
 * - Adaptive difficulty adjustment
 * - Real-time feedback integration
 *
 * @dependencies WorkoutPlanManager, ProgressiveOverloadService, userStore
 * @integration History, Gamification, Notifications
 */

import { workoutStorageService } from "./workoutStorageService";
import { progressiveOverloadService } from "./ProgressiveOverloadService";
import { useUserStore } from "../../stores/userStore";
import { logger } from "../../utils/logger";
import { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { WorkoutPlanRequest, WorkoutDay } from "./types";

// ===============================================
// 🎯 Types & Interfaces
// ===============================================

export interface SuggestionContext {
  userHistory: WorkoutWithFeedback[];
  recentPerformance: PerformanceMetrics;
  userPreferences: UserPreferences;
  currentFitnessLevel: "beginner" | "intermediate" | "advanced";
  trainingGoals: string[];
  availableEquipment: string[];
  timeConstraints: {
    sessionDuration: number; // minutes
    weeklyFrequency: number;
  };
}

export interface PerformanceMetrics {
  averageWorkoutRating: number; // 1-5
  completionRate: number; // 0-1
  progressionTrend: "improving" | "plateauing" | "declining";
  muscleGroupBalance: Record<string, number>; // muscle group -> training frequency
  volumeProgression: number; // % change in volume over time
  strengthGains: Record<string, number>; // exercise -> % improvement
}

export interface UserPreferences {
  favoriteExercises: string[];
  dislikedExercises: string[];
  preferredWorkoutDuration: number;
  intensityPreference: "low" | "moderate" | "high";
  varietyPreference: "routine" | "moderate" | "high";
  challengeLevel: number; // 1-10
}

export interface SmartSuggestion {
  id: string;
  type:
    | "exercise_swap"
    | "workout_variation"
    | "difficulty_adjustment"
    | "volume_change"
    | "deload_recommendation";
  title: string;
  description: string;
  reasoning: string;
  confidence: number; // 0-1
  isPremium: boolean;
  actionData: {
    originalExercise?: string;
    suggestedExercise?: string;
    volumeChange?: number;
    difficultyChange?: number;
    newWorkoutStructure?: WorkoutDay;
  };
}

export interface SuggestionPack {
  immediate: SmartSuggestion[]; // Apply now
  nextWorkout: SmartSuggestion[]; // For next session
  longTerm: SmartSuggestion[]; // Strategic changes
  premiumOnly: SmartSuggestion[]; // Requires subscription
}

// ===============================================
// 🤖 SmartSuggestionsEngine Class
// ===============================================

class SmartSuggestionsEngine {
  /**
   * Generate comprehensive workout suggestions
   */
  async generateSuggestions(
    request: WorkoutPlanRequest
  ): Promise<SuggestionPack> {
    try {
      const context = await this.buildSuggestionContext(request);
      const canAccessPremium = useUserStore
        .getState()
        .canAccessPremiumFeatures();

      const suggestions: SuggestionPack = {
        immediate: [],
        nextWorkout: [],
        longTerm: [],
        premiumOnly: [],
      };

      // Basic suggestions for all users
      suggestions.immediate.push(
        ...(await this.generateBasicSuggestions(context))
      );
      suggestions.nextWorkout.push(
        ...(await this.generateWorkoutVariations(context))
      );

      // Premium suggestions
      if (canAccessPremium) {
        suggestions.immediate.push(
          ...(await this.generateAdvancedSuggestions(context))
        );
        suggestions.longTerm.push(
          ...(await this.generateStrategicSuggestions(context))
        );
      } else {
        suggestions.premiumOnly.push(
          ...(await this.generateAdvancedSuggestions(context))
        );
        suggestions.premiumOnly.push(
          ...(await this.generateStrategicSuggestions(context))
        );
      }

      return suggestions;
    } catch (error) {
      logger.error(
        "SmartSuggestionsEngine",
        "Failed to generate suggestions",
        error
      );
      return this.getDefaultSuggestions();
    }
  }

  /**
   * Build comprehensive context for suggestions
   */
  private async buildSuggestionContext(
    request: WorkoutPlanRequest
  ): Promise<SuggestionContext> {
    const user = useUserStore.getState().user;
    const history = await workoutStorageService.getHistory();

    return {
      userHistory: history.slice(-10), // Last 10 workouts
      recentPerformance: await this.analyzePerformance(history),
      userPreferences: this.extractUserPreferences(user, history),
      currentFitnessLevel:
        user?.trainingstats?.currentFitnessLevel || "beginner",
      trainingGoals: request.goal ? [request.goal] : [],
      availableEquipment: request.equipment || [],
      timeConstraints: {
        sessionDuration: request.duration || 45,
        weeklyFrequency: request.frequency || 3,
      },
    };
  }

  /**
   * Analyze user performance metrics
   */
  private async analyzePerformance(
    history: WorkoutWithFeedback[]
  ): Promise<PerformanceMetrics> {
    if (history.length === 0) {
      return {
        averageWorkoutRating: 3.5,
        completionRate: 1.0,
        progressionTrend: "improving",
        muscleGroupBalance: {},
        volumeProgression: 0,
        strengthGains: {},
      };
    }

    // Calculate average rating
    const ratingsSum = history.reduce(
      (sum, w) => sum + (w.workout.rating || 3),
      0
    );
    const averageWorkoutRating = ratingsSum / history.length;

    // Calculate completion rate
    const completedWorkouts = history.filter((w) => w.workout.endTime).length;
    const completionRate = completedWorkouts / history.length;

    // Analyze muscle group balance
    const muscleGroupBalance = this.analyzeMuscleGroupBalance(history);

    // Calculate volume progression
    const volumeProgression = this.calculateVolumeProgression(history);

    // Determine progression trend
    const progressionTrend = this.determineProgressionTrend(
      history,
      volumeProgression
    );

    return {
      averageWorkoutRating,
      completionRate,
      progressionTrend,
      muscleGroupBalance,
      volumeProgression,
      strengthGains: {}, // Would be calculated from detailed set data
    };
  }

  /**
   * Extract user preferences from profile and history
   */
  private extractUserPreferences(
    user: unknown,
    history: WorkoutWithFeedback[]
  ): UserPreferences {
    // Analyze workout history to infer preferences
    const exerciseFrequency: Record<string, number> = {};
    const workoutRatings: Record<string, number[]> = {};

    history.forEach((workout) => {
      workout.workout.exercises?.forEach((exercise) => {
        exerciseFrequency[exercise.id] =
          (exerciseFrequency[exercise.id] || 0) + 1;

        if (workout.workout.rating) {
          if (!workoutRatings[exercise.id]) workoutRatings[exercise.id] = [];
          workoutRatings[exercise.id].push(workout.workout.rating);
        }
      });
    });

    // Identify favorites (high frequency + high rating)
    const favoriteExercises = Object.entries(exerciseFrequency)
      .filter(([exerciseId, frequency]) => {
        const avgRating =
          workoutRatings[exerciseId]?.reduce((a, b) => a + b, 0) /
          (workoutRatings[exerciseId]?.length || 1);
        return frequency >= 3 && avgRating >= 4;
      })
      .map(([exerciseId]) => exerciseId);

    // Identify dislikes (low rating or frequently skipped)
    const dislikedExercises = Object.entries(workoutRatings)
      .filter(([_, ratings]) => {
        const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        return avgRating <= 2.5;
      })
      .map(([exerciseId]) => exerciseId);

    return {
      favoriteExercises,
      dislikedExercises,
      preferredWorkoutDuration: 45,
      intensityPreference: "moderate" as const,
      varietyPreference: "moderate" as const,
      challengeLevel: 5,
    };
  }

  /**
   * Generate basic suggestions for all users
   */
  private async generateBasicSuggestions(
    context: SuggestionContext
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Muscle group balance suggestion
    const imbalanced = this.findMuscleImbalances(
      context.recentPerformance.muscleGroupBalance
    );
    if (imbalanced.length > 0) {
      suggestions.push({
        id: "muscle_balance",
        type: "workout_variation",
        title: "איזון קבוצות שרירים",
        description: `הוסף תרגילים ל${imbalanced.join(", ")}`,
        reasoning: "חשוב לשמור על איזון בין קבוצות השרירים",
        confidence: 0.8,
        isPremium: false,
        actionData: {},
      });
    }

    // Completion rate suggestion
    if (context.recentPerformance.completionRate < 0.7) {
      suggestions.push({
        id: "reduce_volume",
        type: "volume_change",
        title: "הפחתת נפח אימון",
        description: "קצר את האימונים לשיפור שיעור השלמה",
        reasoning: "שיעור השלמה נמוך מעיד על עומס מוגזם",
        confidence: 0.7,
        isPremium: false,
        actionData: {
          volumeChange: -0.2,
        },
      });
    }

    // Variety suggestion
    if (context.userPreferences.varietyPreference === "high") {
      suggestions.push({
        id: "add_variety",
        type: "exercise_swap",
        title: "הוספת גיוון",
        description: "נסה תרגילים חדשים לשמירה על עניין",
        reasoning: "גיוון עוזר למניעת שעמום ושיפור מוטיבציה",
        confidence: 0.6,
        isPremium: false,
        actionData: {},
      });
    }

    return suggestions;
  }

  /**
   * Generate workout variations
   */
  private async generateWorkoutVariations(
    context: SuggestionContext
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Time-based variations
    if (context.timeConstraints.sessionDuration < 30) {
      suggestions.push({
        id: "quick_workout",
        type: "workout_variation",
        title: "אימון מהיר",
        description: "אימון יעיל ב-20 דקות עם תרגילי כוח משולבים",
        reasoning: "מותאם לזמן המוגבל שלך",
        confidence: 0.8,
        isPremium: false,
        actionData: {},
      });
    }

    // Equipment-based variations
    if (context.availableEquipment.includes("bodyweight")) {
      suggestions.push({
        id: "bodyweight_variation",
        type: "workout_variation",
        title: "אימון משקל גוף",
        description: "אימון יעיל ללא ציוד",
        reasoning: "ניצול מיטבי של הציוד הזמין",
        confidence: 0.7,
        isPremium: false,
        actionData: {},
      });
    }

    return suggestions;
  }

  /**
   * Generate advanced AI suggestions (Premium)
   */
  private async generateAdvancedSuggestions(
    context: SuggestionContext
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Performance-based progression
    if (context.recentPerformance.progressionTrend === "plateauing") {
      suggestions.push({
        id: "plateau_break",
        type: "difficulty_adjustment",
        title: "שבירת רמת ביצועים",
        description: "שינוי אסטרטגיית אימון להמשך התקדמות",
        reasoning: "ניתוח AI מראה על עצירה בהתקדמות - זמן לשינוי",
        confidence: 0.9,
        isPremium: true,
        actionData: {
          difficultyChange: 0.15,
        },
      });
    }

    // Adaptive intensity
    if (context.recentPerformance.averageWorkoutRating < 3.0) {
      suggestions.push({
        id: "intensity_adjustment",
        type: "difficulty_adjustment",
        title: "התאמת עצמות",
        description: "הפחתת עצמות לשיפור חוויית האימון",
        reasoning: "דירוגים נמוכים מעידים על עומס גבוה מדי",
        confidence: 0.85,
        isPremium: true,
        actionData: {
          difficultyChange: -0.1,
        },
      });
    }

    // Smart exercise suggestions based on performance
    const progressiveOverloadAnalyses = await Promise.all(
      context.userHistory
        .slice(-1)[0]
        ?.workout.exercises?.slice(0, 3)
        .map(
          async (exercise) =>
            await progressiveOverloadService.analyzeExerciseProgression(
              exercise.id
            )
        ) || []
    );

    progressiveOverloadAnalyses.forEach((analysis) => {
      if (analysis && analysis.premiumInsight) {
        suggestions.push({
          id: `progressive_${analysis.exerciseId}`,
          type: "exercise_swap",
          title: "הצעה מבוססת ביצועים",
          description: analysis.premiumInsight,
          reasoning: "ניתוח מתקדם של התקדמות בתרגיל",
          confidence: analysis.confidenceScore,
          isPremium: true,
          actionData: {
            originalExercise: analysis.exerciseId,
          },
        });
      }
    });

    return suggestions;
  }

  /**
   * Generate strategic long-term suggestions (Premium)
   */
  private async generateStrategicSuggestions(
    context: SuggestionContext
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Periodization recommendation
    if (context.userHistory.length >= 8) {
      suggestions.push({
        id: "periodization",
        type: "workout_variation",
        title: "תכנון פריודיזציה",
        description: "מעבר לתוכנית מחזורית לתוצאות מיטביות",
        reasoning: "אחרי 8+ אימונים, פריודיזציה תשפר את התוצאות",
        confidence: 0.9,
        isPremium: true,
        actionData: {},
      });
    }

    // Deload recommendation
    if (context.recentPerformance.progressionTrend === "declining") {
      suggestions.push({
        id: "deload_week",
        type: "deload_recommendation",
        title: "שבוע דילוד",
        description: "הפחתת עומס לשחזור ושיפור ביצועים",
        reasoning: "ירידה בביצועים מעידה על צורך במנוחה פעילה",
        confidence: 0.95,
        isPremium: true,
        actionData: {
          volumeChange: -0.4,
        },
      });
    }

    // Goal-specific adjustments
    if (
      context.trainingGoals.includes("strength") &&
      context.recentPerformance.volumeProgression < 5
    ) {
      suggestions.push({
        id: "strength_focus",
        type: "workout_variation",
        title: "מיקוד בכוח",
        description: "התאמת התוכנית להשגת יעדי כוח",
        reasoning: "יעד הכוח דורש התאמות ספציפיות בתוכנית",
        confidence: 0.8,
        isPremium: true,
        actionData: {},
      });
    }

    return suggestions;
  }

  /**
   * Helper methods for analysis
   */
  private analyzeMuscleGroupBalance(
    history: WorkoutWithFeedback[]
  ): Record<string, number> {
    const muscleGroupCount: Record<string, number> = {};

    history.forEach((workout) => {
      workout.workout.exercises?.forEach((exercise) => {
        exercise.primaryMuscles?.forEach((muscle) => {
          muscleGroupCount[muscle] = (muscleGroupCount[muscle] || 0) + 1;
        });
      });
    });

    return muscleGroupCount;
  }

  private findMuscleImbalances(
    muscleBalance: Record<string, number>
  ): string[] {
    const muscles = Object.entries(muscleBalance);
    if (muscles.length === 0) return [];

    const avgFrequency =
      muscles.reduce((sum, [_, count]) => sum + count, 0) / muscles.length;

    return muscles
      .filter(([_, count]) => count < avgFrequency * 0.5)
      .map(([muscle]) => muscle);
  }

  private calculateVolumeProgression(history: WorkoutWithFeedback[]): number {
    if (history.length < 4) return 0;

    const recentVolume =
      history.slice(-2).reduce((sum, w) => sum + w.workout.totalVolume, 0) / 2;
    const previousVolume =
      history.slice(-4, -2).reduce((sum, w) => sum + w.workout.totalVolume, 0) /
      2;

    if (previousVolume === 0) return 0;
    return ((recentVolume - previousVolume) / previousVolume) * 100;
  }

  private determineProgressionTrend(
    history: WorkoutWithFeedback[],
    volumeProgression: number
  ): "improving" | "plateauing" | "declining" {
    if (volumeProgression > 5) return "improving";
    if (volumeProgression < -5) return "declining";
    return "plateauing";
  }

  /**
   * Get default suggestions when AI analysis fails
   */
  private getDefaultSuggestions(): SuggestionPack {
    return {
      immediate: [
        {
          id: "default_basic",
          type: "workout_variation",
          title: "המשך התוכנית",
          description: "המשך עם התוכנית הנוכחית",
          reasoning: "עקביות היא המפתח להצלחה",
          confidence: 0.5,
          isPremium: false,
          actionData: {},
        },
      ],
      nextWorkout: [],
      longTerm: [],
      premiumOnly: [],
    };
  }

  /**
   * Apply suggestion to workout plan
   */
  async applySuggestion(
    suggestionId: string,
    currentWorkout: WorkoutDay
  ): Promise<WorkoutDay> {
    // Implementation would depend on specific suggestion type
    // This is a simplified version
    return currentWorkout;
  }

  /**
   * Get personalized recommendations for user dashboard
   */
  async getPersonalizedRecommendations(): Promise<{
    todaysFocus: string;
    weeklyGoal: string;
    nextMilestone: string;
    motivationalTip: string;
  }> {
    const user = useUserStore.getState().user;
    const canAccessPremium = useUserStore.getState().canAccessPremiumFeatures();
    const history = await workoutStorageService.getHistory();

    if (canAccessPremium && history.length > 0) {
      return this.generatePersonalizedRecommendations(user, history);
    }

    return this.getBasicRecommendations();
  }

  private generatePersonalizedRecommendations(
    user: unknown,
    history: WorkoutWithFeedback[]
  ): {
    todaysFocus: string;
    weeklyGoal: string;
    nextMilestone: string;
    motivationalTip: string;
  } {
    const recentWorkout = history[0];
    const weeklyWorkouts = history.filter((w) => {
      const workoutDate = new Date(w.workout.startTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate > weekAgo;
    });

    return {
      todaysFocus: this.getTodaysFocus(recentWorkout),
      weeklyGoal: `השלם ${Math.max(1, 4 - weeklyWorkouts.length)} אימונים נוספים השבוע`,
      nextMilestone: this.getNextMilestone(user, history),
      motivationalTip: this.getMotivationalTip(history),
    };
  }

  private getTodaysFocus(recentWorkout: WorkoutWithFeedback): string {
    if (!recentWorkout) return "התחל עם אימון קל לחימום";

    const daysSinceLastWorkout = Math.floor(
      (new Date().getTime() -
        new Date(recentWorkout.workout.startTime).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastWorkout === 0) return "מנוחה פעילה - מתיחות או הליכה קלה";
    if (daysSinceLastWorkout === 1) return "אימון עצמה בינונית";
    if (daysSinceLastWorkout >= 3) return "חזרה הדרגתית לאימונים";

    return "אימון רגיל לפי התוכנית";
  }

  private getNextMilestone(
    _user: unknown,
    history: WorkoutWithFeedback[]
  ): string {
    const totalWorkouts = history.length;

    if (totalWorkouts < 10)
      return `השלם ${10 - totalWorkouts} אימונים נוספים לביצוע הראשון`;
    if (totalWorkouts < 50)
      return `הגע ל-50 אימונים (נותרו ${50 - totalWorkouts})`;
    if (totalWorkouts < 100) return `יעד ה-100 אימונים בהישג יד!`;

    return "המשך המסע שלך למצוינות";
  }

  private getMotivationalTip(_history: WorkoutWithFeedback[]): string {
    const tips = [
      "כל אימון הוא צעד קדימה 💪",
      "עקביות חשובה יותר מעצמה 🎯",
      "האתגרים של היום הם הכוח של מחר ⚡",
      "הגוף שלך יכול - המוח שלך צריך להאמין 🧠",
      "כל התחלה קשה, אבל כל סיום מתגמל 🏆",
    ];

    return tips[Math.floor(Math.random() * tips.length)];
  }

  private getBasicRecommendations(): {
    todaysFocus: string;
    weeklyGoal: string;
    nextMilestone: string;
    motivationalTip: string;
  } {
    return {
      todaysFocus: "התחל עם אימון בסיסי",
      weeklyGoal: "השלם 3 אימונים השבוע",
      nextMilestone: "השלם 10 אימונים ראשונים",
      motivationalTip: "הצלחה מתחילה בצעד הראשון! 🚀",
    };
  }
}

// Export singleton instance
export const smartSuggestionsEngine = new SmartSuggestionsEngine();
