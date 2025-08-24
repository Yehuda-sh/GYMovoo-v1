/**
 * @file src/services/workout/ProgressiveOverloadService.ts
 * @brief Advanced Progressive Overload service with history integration
 * @description Comprehensive service for progressive overload management, including:
 *              - AI-driven progression analysis (Premium)
 *              - Performance-based adaptations
 *              - Periodization strategies
 *              - Volume and intensity management
 *              - Deload week detection
 *              - Manual and automatic progression
 *              - Integration with workout history, analytics, notifications
 * @features
 *   Free users:
 *     - Basic progression rules
 *     - Simple weight/reps adjustments
 *     - Manual progression only
 *   Premium users:
 *     - AI-driven progression analysis
 *     - Performance-based adaptations
 *     - Periodization strategies
 *     - Volume and intensity management
 *     - Deload week detection
 * @dependencies workoutStorageService, userStore, dumbbells utilities
 * @integration WorkoutPlanManager, Analytics, Notifications
 * @status ACTIVE - Core overload analytics service
 * @updated 2025-08-25 - Modernized documentation and export
 */

import { workoutStorageService } from "./workoutStorageService";
import { useUserStore } from "../../stores/userStore";
import { logger } from "../../utils/logger";
import { ExerciseTemplate } from "../../screens/workout/types/workout.types";
import { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { ProgressiveOverloadSuggestion } from "./types";

// ===============================================
// 🏗️ Types & Interfaces
// ===============================================

export interface ExerciseProgress {
  exerciseId: string;
  currentWeek: {
    weight?: number;
    reps?: number;
    sets?: number;
    volume: number; // weight × reps × sets
  };
  lastWeek?: {
    weight?: number;
    reps?: number;
    sets?: number;
    volume: number;
  };
  trend: "improving" | "stagnant" | "declining";
  progressionRate: number; // % change per week
}

export interface OverloadAnalysis {
  exerciseId: string;
  performanceHistory: ExerciseProgress[];
  currentPhase: "loading" | "overreach" | "deload" | "adaptation";
  suggestedAction: ProgressiveOverloadSuggestion;
  confidenceScore: number; // 0-1
  premiumInsight?: string;
}

export interface PeriodizationPlan {
  currentWeek: number;
  totalWeeks: number;
  phase: "accumulation" | "intensification" | "realization" | "deload";
  volumeMultiplier: number; // 0.7-1.3
  intensityMultiplier: number; // 0.8-1.1
  recommendations: string[];
}

// ===============================================
// 🎯 ProgressiveOverloadService Class
// ===============================================

class ProgressiveOverloadService {
  /**
   * Analyze exercise progression and generate overload suggestions
   */
  async analyzeExerciseProgression(
    exerciseId: string
  ): Promise<OverloadAnalysis | null> {
    try {
      const history = await workoutStorageService.getHistory();
      const canAccessPremium = useUserStore
        .getState()
        .canAccessPremiumFeatures();

      // Extract exercise data from history
      const exerciseHistory = this.extractExerciseHistory(exerciseId, history);

      if (exerciseHistory.length === 0) {
        return this.generateFirstTimeAnalysis(exerciseId);
      }

      // Basic analysis for all users
      const basicAnalysis = this.performBasicAnalysis(exerciseHistory);

      // Premium users get advanced analysis
      if (canAccessPremium) {
        return this.performAdvancedAnalysis(
          exerciseId,
          exerciseHistory,
          basicAnalysis
        );
      }

      return this.generateBasicOverloadAnalysis(exerciseId, basicAnalysis);
    } catch (error) {
      logger.error(
        "ProgressiveOverloadService",
        "Failed to analyze progression",
        error
      );
      return null;
    }
  }

  /**
   * Generate progressive overload suggestions for a workout plan
   */
  async generateWorkoutProgression(
    exercises: ExerciseTemplate[]
  ): Promise<ExerciseTemplate[]> {
    const canAccessPremium = useUserStore.getState().canAccessPremiumFeatures();
    const enhancedExercises: ExerciseTemplate[] = [];

    for (const exercise of exercises) {
      const analysis = await this.analyzeExerciseProgression(
        exercise.exerciseId
      );

      if (analysis && analysis.suggestedAction) {
        const enhancedExercise = this.applyProgressionToExercise(
          exercise,
          analysis.suggestedAction
        );
        enhancedExercises.push(enhancedExercise);
      } else {
        enhancedExercises.push(exercise);
      }
    }

    // Premium users get periodization recommendations
    if (canAccessPremium) {
      return this.applyPeriodization(enhancedExercises);
    }

    return enhancedExercises;
  }

  /**
   * Extract exercise history from workout data
   */
  private extractExerciseHistory(
    exerciseId: string,
    history: WorkoutWithFeedback[]
  ): ExerciseProgress[] {
    const progressData: ExerciseProgress[] = [];

    // Group workouts by week
    const weeklyData = this.groupWorkoutsByWeek(history);

    weeklyData.forEach((weekWorkouts, _weekIndex) => {
      const exerciseData = this.findExerciseInWeek(exerciseId, weekWorkouts);

      if (exerciseData) {
        const progress: ExerciseProgress = {
          exerciseId,
          currentWeek: exerciseData,
          trend: this.calculateTrend(
            exerciseData,
            progressData[progressData.length - 1]?.currentWeek
          ),
          progressionRate: this.calculateProgressionRate(
            exerciseData,
            progressData[progressData.length - 1]?.currentWeek
          ),
        };

        if (progressData.length > 0) {
          progress.lastWeek = progressData[progressData.length - 1].currentWeek;
        }

        progressData.push(progress);
      }
    });

    return progressData.slice(-8); // Keep last 8 weeks
  }

  /**
   * Group workouts by week
   */
  private groupWorkoutsByWeek(
    history: WorkoutWithFeedback[]
  ): WorkoutWithFeedback[][] {
    const weeklyGroups: WorkoutWithFeedback[][] = [];

    // Sort by date (newest first)
    const sortedHistory = history.sort(
      (a, b) =>
        new Date(b.feedback.completedAt).getTime() -
        new Date(a.feedback.completedAt).getTime()
    );

    let currentWeek: WorkoutWithFeedback[] = [];
    let currentWeekStart: Date | null = null;

    sortedHistory.forEach((workout) => {
      const workoutDate = new Date(workout.feedback.completedAt);

      if (
        !currentWeekStart ||
        this.getWeeksDifference(workoutDate, currentWeekStart) >= 1
      ) {
        if (currentWeek.length > 0) {
          weeklyGroups.push([...currentWeek]);
        }
        currentWeek = [workout];
        currentWeekStart = workoutDate;
      } else {
        currentWeek.push(workout);
      }
    });

    if (currentWeek.length > 0) {
      weeklyGroups.push(currentWeek);
    }

    return weeklyGroups.slice(0, 8); // Keep last 8 weeks
  }

  /**
   * Find exercise data in weekly workouts
   */
  private findExerciseInWeek(
    exerciseId: string,
    weekWorkouts: WorkoutWithFeedback[]
  ): ExerciseProgress["currentWeek"] | null {
    let totalWeight = 0;
    let totalReps = 0;
    let totalSets = 0;
    let exerciseCount = 0;

    weekWorkouts.forEach((workout) => {
      workout.workout.exercises?.forEach((exercise) => {
        if (exercise.id === exerciseId) {
          exerciseCount++;
          // Estimate values from sets data if available
          if (exercise.sets && Array.isArray(exercise.sets)) {
            exercise.sets.forEach((set) => {
              if (set.actualWeight || set.targetWeight) {
                totalWeight += set.actualWeight || set.targetWeight;
              }
              if (set.actualReps || set.targetReps) {
                totalReps += set.actualReps || set.targetReps;
              }
              totalSets++;
            });
          }
        }
      });
    });

    if (exerciseCount === 0) return null;

    const avgWeight = totalWeight > 0 ? totalWeight / totalSets : undefined;
    const avgReps = totalReps > 0 ? totalReps / totalSets : undefined;
    const volume = totalWeight * totalReps;

    return {
      weight: avgWeight,
      reps: avgReps,
      sets: totalSets / exerciseCount,
      volume,
    };
  }

  /**
   * Calculate trend between weeks
   */
  private calculateTrend(
    current: ExerciseProgress["currentWeek"],
    previous?: ExerciseProgress["currentWeek"]
  ): "improving" | "stagnant" | "declining" {
    if (!previous) return "improving";

    const volumeChange = (current.volume - previous.volume) / previous.volume;

    if (volumeChange > 0.05) return "improving";
    if (volumeChange < -0.05) return "declining";
    return "stagnant";
  }

  /**
   * Calculate progression rate
   */
  private calculateProgressionRate(
    current: ExerciseProgress["currentWeek"],
    previous?: ExerciseProgress["currentWeek"]
  ): number {
    if (!previous || previous.volume === 0) return 0;
    return ((current.volume - previous.volume) / previous.volume) * 100;
  }

  /**
   * Calculate weeks difference
   */
  private getWeeksDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }

  /**
   * Perform basic analysis for all users
   */
  private performBasicAnalysis(history: ExerciseProgress[]): {
    trend: string;
    recommendation: string;
  } {
    if (history.length < 2) {
      return {
        trend: "insufficient_data",
        recommendation: "continue_current_plan",
      };
    }

    const recentProgress = history.slice(-3);
    const improvingCount = recentProgress.filter(
      (p) => p.trend === "improving"
    ).length;
    const stagnantCount = recentProgress.filter(
      (p) => p.trend === "stagnant"
    ).length;

    if (stagnantCount >= 2) {
      return {
        trend: "plateauing",
        recommendation: "increase_intensity",
      };
    }

    if (improvingCount >= 2) {
      return {
        trend: "progressing",
        recommendation: "continue_progression",
      };
    }

    return {
      trend: "variable",
      recommendation: "monitor_closely",
    };
  }

  /**
   * Generate first-time analysis for new exercises
   */
  private generateFirstTimeAnalysis(exerciseId: string): OverloadAnalysis {
    const user = useUserStore.getState().user;
    const experience = user?.trainingstats?.currentFitnessLevel || "beginner";

    return {
      exerciseId,
      performanceHistory: [],
      currentPhase: "loading",
      suggestedAction: {
        exerciseId,
        suggestion: {
          action: "maintain",
          reasoning: `תרגיל חדש - התמקד בטכניקה תקינה למשך ${experience === "beginner" ? "2-3" : "1-2"} שבועות`,
        },
      },
      confidenceScore: 0.8,
    };
  }

  /**
   * Generate basic overload analysis for Free users
   */
  private generateBasicOverloadAnalysis(
    exerciseId: string,
    basicAnalysis: { trend: string; recommendation: string }
  ): OverloadAnalysis {
    let action: ProgressiveOverloadSuggestion["suggestion"]["action"] =
      "maintain";
    let reasoning = "המשך עם המשקל הנוכחי";

    if (basicAnalysis.recommendation === "increase_intensity") {
      action = "increase_weight";
      reasoning = 'הגבר משקל ב-2.5 ק"ג או הוסף חזרה נוספת';
    } else if (basicAnalysis.recommendation === "continue_progression") {
      action = "increase_reps";
      reasoning = "הוסף חזרה נוספת או הגבר משקל מעט";
    }

    return {
      exerciseId,
      performanceHistory: [],
      currentPhase: "loading",
      suggestedAction: {
        exerciseId,
        suggestion: {
          action,
          reasoning,
        },
      },
      confidenceScore: 0.6,
    };
  }

  /**
   * Perform advanced analysis for Premium users
   */
  private performAdvancedAnalysis(
    exerciseId: string,
    history: ExerciseProgress[],
    _basicAnalysis: { trend: string; recommendation: string }
  ): OverloadAnalysis {
    // Advanced periodization logic
    const currentPhase = this.determineCurrentPhase(history);
    const periodization = this.generatePeriodizationPlan(history);

    // AI-driven suggestion
    const advancedSuggestion = this.generateAdvancedSuggestion(
      exerciseId,
      history,
      currentPhase,
      periodization
    );

    return {
      exerciseId,
      performanceHistory: history,
      currentPhase,
      suggestedAction: advancedSuggestion,
      confidenceScore: 0.9,
      premiumInsight: this.generatePremiumInsight(
        history,
        currentPhase,
        periodization
      ),
    };
  }

  /**
   * Determine current training phase
   */
  private determineCurrentPhase(
    history: ExerciseProgress[]
  ): "loading" | "overreach" | "deload" | "adaptation" {
    if (history.length < 4) return "loading";

    const recentTrends = history.slice(-4).map((h) => h.trend);
    const stagnantCount = recentTrends.filter((t) => t === "stagnant").length;
    const decliningCount = recentTrends.filter((t) => t === "declining").length;

    if (decliningCount >= 2) return "deload";
    if (stagnantCount >= 3) return "overreach";
    if (recentTrends.every((t) => t === "improving")) return "adaptation";

    return "loading";
  }

  /**
   * Generate periodization plan
   */
  private generatePeriodizationPlan(
    history: ExerciseProgress[]
  ): PeriodizationPlan {
    const currentWeek = history.length;
    const weekInCycle = (currentWeek - 1) % 4; // 4-week cycles

    let phase: PeriodizationPlan["phase"];
    let volumeMultiplier: number;
    let intensityMultiplier: number;

    switch (weekInCycle) {
      case 0: // Week 1
        phase = "accumulation";
        volumeMultiplier = 1.0;
        intensityMultiplier = 0.9;
        break;
      case 1: // Week 2
        phase = "accumulation";
        volumeMultiplier = 1.1;
        intensityMultiplier = 0.95;
        break;
      case 2: // Week 3
        phase = "intensification";
        volumeMultiplier = 0.9;
        intensityMultiplier = 1.05;
        break;
      case 3: // Week 4
        phase = "deload";
        volumeMultiplier = 0.7;
        intensityMultiplier = 0.8;
        break;
      default:
        phase = "accumulation";
        volumeMultiplier = 1.0;
        intensityMultiplier = 1.0;
    }

    return {
      currentWeek: weekInCycle + 1,
      totalWeeks: 4,
      phase,
      volumeMultiplier,
      intensityMultiplier,
      recommendations: this.getPeriodizationRecommendations(phase),
    };
  }

  /**
   * Get periodization recommendations
   */
  private getPeriodizationRecommendations(
    phase: PeriodizationPlan["phase"]
  ): string[] {
    switch (phase) {
      case "accumulation":
        return [
          "התמקד בנפח גבוה",
          "שמור על טכניקה מושלמת",
          "הוסף חזרות או סטים",
        ];
      case "intensification":
        return ["הגבר עצמות", "קצר מנוחות", "משקלים כבדים יותר"];
      case "deload":
        return ["שבוע קל לשחזור", "הפחת נפח ב-30%", "התמקד בתנועתיות"];
      case "realization":
        return ["בדיקת שיאים אישיים", "טכניקה מושלמת", "מנוחות ארוכות"];
      default:
        return ["המשך לפי התוכנית"];
    }
  }

  /**
   * Generate advanced suggestion for Premium users
   */
  private generateAdvancedSuggestion(
    exerciseId: string,
    history: ExerciseProgress[],
    phase: string,
    periodization: PeriodizationPlan
  ): ProgressiveOverloadSuggestion {
    const latestProgress = history[history.length - 1];

    // Base suggestion on periodization phase
    if (phase === "deload") {
      return {
        exerciseId,
        suggestion: {
          action: "maintain",
          newWeight: latestProgress?.currentWeek.weight
            ? latestProgress.currentWeek.weight * 0.8
            : undefined,
          reasoning: "שבוע דילוד - הפחת עומס ב-20% לשחזור",
        },
      };
    }

    if (periodization.phase === "intensification") {
      return {
        exerciseId,
        suggestion: {
          action: "increase_weight",
          newWeight: latestProgress?.currentWeek.weight
            ? latestProgress.currentWeek.weight * 1.05
            : undefined,
          reasoning: "שבוע אינטנסיפיקציה - הגבר משקל ב-5%",
        },
      };
    }

    // Default progression based on performance
    if (latestProgress && latestProgress.trend === "improving") {
      return {
        exerciseId,
        suggestion: {
          action: "increase_reps",
          newReps: latestProgress.currentWeek.reps
            ? Math.ceil(latestProgress.currentWeek.reps * 1.1)
            : undefined,
          reasoning: "ביצועים משתפרים - הוסף 10% חזרות",
        },
      };
    }

    return {
      exerciseId,
      suggestion: {
        action: "maintain",
        reasoning: "שמור על רמה נוכחית ומוניטור ביצועים",
      },
    };
  }

  /**
   * Generate premium insight
   */
  private generatePremiumInsight(
    history: ExerciseProgress[],
    phase: string,
    periodization: PeriodizationPlan
  ): string {
    const avgProgressionRate =
      history.reduce((sum, h) => sum + h.progressionRate, 0) / history.length;

    let insight = `📊 ניתוח AI: קצב התקדמות ממוצע ${avgProgressionRate.toFixed(1)}% לשבוע. `;

    if (avgProgressionRate > 5) {
      insight += "התקדמות מעולה! ";
    } else if (avgProgressionRate < 1) {
      insight += "התקדמות איטית, שקול שינוי אסטרטגיה. ";
    }

    insight += `שלב נוכחי: ${this.getPhaseDescription(phase)}. `;
    insight += `מומלץ: ${periodization.recommendations[0]}.`;

    return insight;
  }

  /**
   * Get phase description in Hebrew
   */
  private getPhaseDescription(phase: string): string {
    switch (phase) {
      case "loading":
        return "טעינה";
      case "overreach":
        return "עומס יתר";
      case "deload":
        return "דילוד";
      case "adaptation":
        return "הסתגלות";
      default:
        return "לא ידוע";
    }
  }

  /**
   * Apply progression suggestion to exercise
   */
  private applyProgressionToExercise(
    exercise: ExerciseTemplate,
    suggestion: ProgressiveOverloadSuggestion
  ): ExerciseTemplate {
    const updatedExercise = { ...exercise };

    // Update sets/reps/weight based on suggestion
    if (suggestion.suggestion.newWeight) {
      updatedExercise.notes += ` • משקל מוצע: ${suggestion.suggestion.newWeight}kg`;
    }

    if (suggestion.suggestion.newReps) {
      updatedExercise.reps = suggestion.suggestion.newReps.toString();
    }

    if (suggestion.suggestion.newSets) {
      updatedExercise.sets = suggestion.suggestion.newSets;
    }

    // Add reasoning to notes
    updatedExercise.notes += ` • ${suggestion.suggestion.reasoning}`;

    return updatedExercise;
  }

  /**
   * Apply periodization to workout exercises
   */
  private applyPeriodization(
    exercises: ExerciseTemplate[]
  ): ExerciseTemplate[] {
    // This is a simplified version - full periodization would be more complex
    return exercises.map((exercise) => ({
      ...exercise,
      notes: exercise.notes + " • תוכנית מותאמת מערכת הפריודיזציה",
    }));
  }

  /**
   * Get progression recommendations for user
   */
  async getProgressionRecommendations(): Promise<{
    generalRecommendations: string[];
    exerciseSpecific: OverloadAnalysis[];
    periodizationStatus?: PeriodizationPlan;
  }> {
    const canAccessPremium = useUserStore.getState().canAccessPremiumFeatures();

    const generalRecommendations = [
      "שמור על יומן אימונים עקבי",
      "הגבר עומס בהדרגה - 2.5-5% לשבוע",
      "תן לגוף זמן מספיק להתאוששות",
    ];

    if (canAccessPremium) {
      generalRecommendations.push(
        "השתמש במערכת הפריודיזציה לתוצאות מיטביות",
        "עקוב אחר מגמות הביצועים שלך",
        "קבל התראות חכמות להתאמת התוכנית"
      );
    }

    return {
      generalRecommendations,
      exerciseSpecific: [], // Would be populated with specific exercise analyses
      periodizationStatus: canAccessPremium
        ? this.generatePeriodizationPlan([])
        : undefined,
    };
  }
}

// Export singleton instance
export const progressiveOverloadService = new ProgressiveOverloadService();
