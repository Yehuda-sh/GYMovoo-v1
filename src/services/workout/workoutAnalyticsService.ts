/**
 * @file src/services/workout/workoutAnalyticsService.ts
 * @version 2025-08-17
 * @description שירות ניתוח אימונים מתקדם עם תובנות מותאמות אישית
 *
 * Enhanced workout analytics service with advanced insights:
 * - Volume and intensity progression analysis
 * - Workout consistency tracking
 * - Muscle group balance monitoring
 * - Performance trend analysis
 * - Advanced metrics calculation with detailed insights
 *
 * @author GYMovoo Development Team
 * @updated 2025-08-17 - Major enhancement with advanced analytics capabilities
 */
import {
  WorkoutData,
  WorkoutHistoryItem,
  WorkoutSummary,
} from "../../screens/workout/types/workout.types";
import { PersonalData } from "../../utils/personalDataUtils";

/**
 * ממשק למדדי ביצועים מתקדמים
 * Interface for advanced performance metrics
 */
export interface AdvancedMetrics {
  averageIntensity: number; // עוצמה ממוצעת (נפח לדקה)
  muscleGroupDistribution: Record<string, number>; // התפלגות קבוצות שרירים באחוזים
  progressTrend: "improving" | "stable" | "declining"; // מגמת התקדמות
  consistencyScore: number; // ציון עקביות (0-100)
  volumeProgression: number[]; // התקדמות נפח (10 אימונים אחרונים)
}

class WorkoutAnalyticsService {
  private readonly CONSISTENCY_THRESHOLD_DAYS = 2; // סף ימים לעקביות
  private readonly VOLUME_IMPROVEMENT_THRESHOLD = 5; // אחוז מינימלי לשיפור
  private readonly MIN_WORKOUTS_FOR_ANALYSIS = 2; // מינימום אימונים לניתוח

  /**
   * קבלת ניתוח אימונים מותאם אישית עם תובנות מתקדמות
   * Get personalized workout analytics with advanced insights
   */
  async getPersonalizedWorkoutAnalytics(
    history: WorkoutHistoryItem[],
    personalData: PersonalData
  ): Promise<string[]> {
    const insights: string[] = [];

    if (history.length < this.MIN_WORKOUTS_FOR_ANALYSIS) {
      return [
        `השלם לפחות ${this.MIN_WORKOUTS_FOR_ANALYSIS} אימונים כדי לקבל ניתוח מותאם אישית.`,
      ];
    }

    // ניתוח נפח ועוצמה
    await this.analyzeVolumeProgression(history, insights);

    // ניתוח עקביות
    this.analyzeConsistency(history, personalData, insights);

    // ניתוח התפלגות קבוצות שריר
    this.analyzeMuscleGroupBalance(history, insights);

    // ניתוח מגמות ביצועים
    this.analyzePerformanceTrends(history, insights);

    return insights.length > 0 ? insights : ["המשך במחץ! הביצועים שלך יציבים."];
  }

  /**
   * ניתוח התקדמות נפח ועוצמה
   * Analyze volume and intensity progression
   */
  private async analyzeVolumeProgression(
    history: WorkoutHistoryItem[],
    insights: string[]
  ): Promise<void> {
    if (history.length < 2) return;

    const lastWorkout = history[0];
    const previousWorkout = history[1];

    if (lastWorkout.workout && previousWorkout.workout) {
      const lastVolume = this.calculateTotalVolume(
        lastWorkout.workout as WorkoutData
      );
      const prevVolume = this.calculateTotalVolume(
        previousWorkout.workout as WorkoutData
      );

      if (prevVolume > 0) {
        const volumeChange = ((lastVolume - prevVolume) / prevVolume) * 100;

        if (volumeChange >= this.VOLUME_IMPROVEMENT_THRESHOLD) {
          insights.push(
            `מעולה! הנפח הכולל שלך עלה ב-${volumeChange.toFixed(0)}% מהאימון הקודם. 💪`
          );
        } else if (volumeChange < -10) {
          insights.push(
            `הנפח ירד ב-${Math.abs(volumeChange).toFixed(0)}%. שקול להוסיף מנוחה או לבדוק את הטכניקה.`
          );
        }
      }
    }
  }

  /**
   * ניתוח עקביות האימונים
   * Analyze workout consistency
   */
  private analyzeConsistency(
    history: WorkoutHistoryItem[],
    personalData: PersonalData,
    insights: string[]
  ): void {
    const workoutDates = history
      .map((h) => (h.date ? new Date(h.date).getTime() : 0))
      .filter((d) => d > 0)
      .sort((a, b) => b - a); // סדר יורד

    if (workoutDates.length < 2) return;

    // חישוב ממוצע ימים בין אימונים
    const intervals = workoutDates
      .slice(0, -1)
      .map((date, i) => (date - workoutDates[i + 1]) / (1000 * 60 * 60 * 24));

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const targetDays = this.extractTargetFrequency(personalData.availability);

    if (avgInterval <= targetDays + this.CONSISTENCY_THRESHOLD_DAYS) {
      insights.push("עקביות מצוינת! אתה מתאמן בקצב הנכון. 🎯");
    } else {
      insights.push(
        `יש מקום לשיפור בעקביות. המרווח הממוצע בין אימונים: ${avgInterval.toFixed(1)} ימים.`
      );
    }
  }

  /**
   * ניתוח איזון קבוצות שרירים
   * Analyze muscle group balance
   */
  private analyzeMuscleGroupBalance(
    history: WorkoutHistoryItem[],
    insights: string[]
  ): void {
    const muscleGroupCount = new Map<string, number>();

    history.slice(0, 5).forEach((item) => {
      // רק 5 האימונים האחרונים
      if (item.workout) {
        const workout = item.workout as WorkoutData;
        workout.exercises?.forEach((exercise) => {
          const muscleGroup = this.extractMuscleGroup(exercise.name);
          muscleGroupCount.set(
            muscleGroup,
            (muscleGroupCount.get(muscleGroup) || 0) + 1
          );
        });
      }
    });

    if (muscleGroupCount.size > 0) {
      const total = Array.from(muscleGroupCount.values()).reduce(
        (a, b) => a + b,
        0
      );
      const mostTrained = Array.from(muscleGroupCount.entries()).sort(
        ([, a], [, b]) => b - a
      )[0];

      const percentage = (mostTrained[1] / total) * 100;

      if (percentage > 40) {
        insights.push(
          `שים לב לאיזון: ${mostTrained[0]} מהווה ${percentage.toFixed(0)}% מהאימונים. נסה לגוון. ⚖️`
        );
      } else {
        insights.push("איזון טוב בין קבוצות השרירים! 🔄");
      }
    }
  }

  /**
   * ניתוח מגמות ביצועים
   * Analyze performance trends
   */
  private analyzePerformanceTrends(
    history: WorkoutHistoryItem[],
    insights: string[]
  ): void {
    if (history.length < 3) return;

    const recentWorkouts = history.slice(0, 3);
    const volumes = recentWorkouts
      .map((item) =>
        item.workout
          ? this.calculateTotalVolume(item.workout as WorkoutData)
          : 0
      )
      .filter((vol) => vol > 0);

    if (volumes.length >= 3) {
      const trend = this.calculateTrend(volumes);

      if (trend > 0.1) {
        insights.push("מגמה עולה מעולה! הביצועים שלך משתפרים בהתמדה. 📈");
      } else if (trend < -0.1) {
        insights.push("הביצועים יורדים. שקול יום מנוחה או בדיקת התזונה. 📉");
      } else {
        insights.push("ביצועים יציבים - בסיס טוב להתקדמות הבאה. 📊");
      }
    }
  }

  /**
   * חילוץ תדירות יעד מהעדפות המשתמש
   * Extract target frequency from user preferences
   */
  private extractTargetFrequency(availability?: string): number {
    if (!availability) return 3;
    const match = availability.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 3;
  }

  /**
   * זיהוי קבוצת שריר מפעיל תרגיל
   * Extract muscle group from exercise name
   */
  private extractMuscleGroup(exerciseName: string): string {
    const name = exerciseName.toLowerCase();

    if (
      name.includes("חזה") ||
      name.includes("chest") ||
      name.includes("bench")
    )
      return "חזה";
    if (name.includes("גב") || name.includes("back") || name.includes("row"))
      return "גב";
    if (
      name.includes("רגליים") ||
      name.includes("legs") ||
      name.includes("squat")
    )
      return "רגליים";
    if (
      name.includes("כתפיים") ||
      name.includes("shoulder") ||
      name.includes("press")
    )
      return "כתפיים";
    if (
      name.includes("ביצפס") ||
      name.includes("bicep") ||
      name.includes("curl")
    )
      return "ביצפס";
    if (
      name.includes("טריצפס") ||
      name.includes("tricep") ||
      name.includes("dip")
    )
      return "טריצפס";

    return "כללי";
  }

  /**
   * חישוב מגמה מערך נתונים
   * Calculate trend from data array
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumX2 = values.reduce((sum, _, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return isFinite(slope) ? slope : 0;
  }

  /**
   * חישוב מטריקות מתקדמות לאימון
   * Calculate advanced metrics for workout analysis
   */
  calculateAdvancedMetrics(history: WorkoutHistoryItem[]): AdvancedMetrics {
    if (history.length === 0) {
      return {
        averageIntensity: 0,
        muscleGroupDistribution: {},
        progressTrend: "stable" as const,
        consistencyScore: 0,
        volumeProgression: [],
      };
    }

    const volumes = history
      .map((item) =>
        item.workout
          ? this.calculateTotalVolume(item.workout as WorkoutData)
          : 0
      )
      .filter((vol) => vol > 0);

    const trendValue = this.calculateTrend(volumes);
    const progressTrend: "improving" | "stable" | "declining" =
      trendValue > 0.1
        ? "improving"
        : trendValue < -0.1
          ? "declining"
          : "stable";

    return {
      averageIntensity: this.calculateAverageIntensity(history),
      muscleGroupDistribution: this.calculateMuscleGroupDistribution(history),
      progressTrend,
      consistencyScore: this.calculateConsistencyScore(history),
      volumeProgression: volumes.slice(0, 10).reverse(), // 10 אימונים אחרונים
    };
  }

  /**
   * חישוב עוצמה ממוצעת
   * Calculate average workout intensity
   */
  private calculateAverageIntensity(history: WorkoutHistoryItem[]): number {
    let totalIntensity = 0;
    let workoutCount = 0;

    history.forEach((item) => {
      if (item.workout) {
        const workout = item.workout as WorkoutData;
        const duration = workout.duration || 0;
        const volume = this.calculateTotalVolume(workout);

        if (duration > 0) {
          const intensity = volume / duration; // נפח לדקה
          totalIntensity += intensity;
          workoutCount++;
        }
      }
    });

    return workoutCount > 0 ? totalIntensity / workoutCount : 0;
  }

  /**
   * חישוב התפלגות קבוצות שרירים
   * Calculate muscle group distribution
   */
  private calculateMuscleGroupDistribution(
    history: WorkoutHistoryItem[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {};
    let totalExercises = 0;

    history.forEach((item) => {
      if (item.workout) {
        const workout = item.workout as WorkoutData;
        workout.exercises?.forEach((exercise) => {
          const muscleGroup = this.extractMuscleGroup(exercise.name);
          distribution[muscleGroup] = (distribution[muscleGroup] || 0) + 1;
          totalExercises++;
        });
      }
    });

    // המרה לאחוזים
    Object.keys(distribution).forEach((key) => {
      distribution[key] =
        totalExercises > 0 ? (distribution[key] / totalExercises) * 100 : 0;
    });

    return distribution;
  }

  /**
   * חישוב ציון עקביות
   * Calculate consistency score
   */
  private calculateConsistencyScore(history: WorkoutHistoryItem[]): number {
    if (history.length < 2) return 0;

    const workoutDates = history
      .map((h) => (h.date ? new Date(h.date).getTime() : 0))
      .filter((d) => d > 0)
      .sort((a, b) => b - a);

    if (workoutDates.length < 2) return 0;

    const intervals = workoutDates
      .slice(0, -1)
      .map((date, i) => (date - workoutDates[i + 1]) / (1000 * 60 * 60 * 24));

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance =
      intervals.reduce(
        (sum, interval) => sum + Math.pow(interval - avgInterval, 2),
        0
      ) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // ציון עקביות: כמה קרוב לממוצע (0-100)
    const consistencyScore = Math.max(0, 100 - (stdDev / avgInterval) * 100);
    return isFinite(consistencyScore) ? Math.round(consistencyScore) : 0;
  }

  /**
   * Calculate total volume for a workout.
   */
  calculateTotalVolume(workout: WorkoutData): number {
    return workout.exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
        if (set.completed) {
          return setTotal + (set.actualReps || 0) * (set.actualWeight || 0);
        }
        return setTotal;
      }, 0);
      return total + exerciseVolume;
    }, 0);
  }

  /**
   * Generate a summary for a completed workout.
   */
  generateWorkoutSummary(workout: WorkoutData): WorkoutSummary {
    const completedExercises = workout.exercises.filter((ex) =>
      ex.sets.some((s) => s.completed)
    );
    const totalVolume = this.calculateTotalVolume(workout);
    const totalSets = workout.exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
      0
    );
    const totalReps = workout.exercises.reduce(
      (sum, ex) =>
        sum +
        ex.sets.reduce(
          (exSum, s) => exSum + (s.completed ? s.actualReps || 0 : 0),
          0
        ),
      0
    );

    return {
      duration: workout.duration,
      totalVolume,
      totalSets,
      totalReps,
      completedExercises: completedExercises.length,
      workoutName: workout.name,
    };
  }
}

export const workoutAnalyticsService = new WorkoutAnalyticsService();
