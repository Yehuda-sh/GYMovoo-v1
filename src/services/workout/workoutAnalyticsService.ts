import { WorkoutHistoryItem } from "../../screens/workout/types/workout.types";
import { PersonalData } from "../../utils/personalDataUtils";

class WorkoutAnalyticsService {
  private readonly CONSISTENCY_THRESHOLD_DAYS = 3;
  private readonly MIN_WORKOUTS_FOR_ANALYSIS = 2;

  async getPersonalizedWorkoutAnalytics(
    history: WorkoutHistoryItem[],
    _personalData?: PersonalData
  ): Promise<string[]> {
    try {
      const insights: string[] = [];

      if (history.length < this.MIN_WORKOUTS_FOR_ANALYSIS) {
        return [
          `השלם לפחות ${this.MIN_WORKOUTS_FOR_ANALYSIS} אימונים כדי לקבל ניתוח מותאם אישית.`,
        ];
      }

      this.analyzeConsistency(history, insights);
      this.analyzeWorkoutFrequency(history, insights);

      return insights.length > 0
        ? insights
        : ["המשך במחץ! הביצועים שלך יציבים."];
    } catch (error) {
      console.error("Error in workout analytics:", error);
      return ["אירעה שגיאה בניתוח האימונים."];
    }
  }

  getAdvancedMetrics(
    history: WorkoutHistoryItem[],
    _personalData?: PersonalData
  ): AdvancedMetrics {
    try {
      if (history.length === 0) {
        return this.getDefaultMetrics();
      }

      const consistencyScore = this.calculateConsistencyScore(history);
      const workoutTypeDistribution =
        this.calculateWorkoutTypeDistribution(history);
      const progressTrend = this.determineProgressTrend(history);

      return {
        averageIntensity: 0,
        muscleGroupDistribution: workoutTypeDistribution,
        progressTrend,
        consistencyScore,
        volumeProgression: [],
        reliability: 95,
      };
    } catch (error) {
      console.error("Error calculating advanced metrics:", error);
      return this.getDefaultMetrics();
    }
  }

  private analyzeConsistency(
    history: WorkoutHistoryItem[],
    insights: string[]
  ): void {
    if (history.length < 2) return;

    const validHistory = history.filter(
      (item) => item.completedAt || item.date
    );
    if (validHistory.length < 2) return;

    const sortedHistory = [...validHistory].sort((a, b) => {
      const dateA = new Date(a.completedAt || a.date || "").getTime();
      const dateB = new Date(b.completedAt || b.date || "").getTime();
      return dateA - dateB;
    });

    let consistentPairs = 0;
    for (let i = 1; i < sortedHistory.length; i++) {
      const current = sortedHistory[i];
      const previous = sortedHistory[i - 1];

      if (current && previous) {
        const daysDiff = this.getDaysDifference(
          previous.completedAt || previous.date || "",
          current.completedAt || current.date || ""
        );

        if (daysDiff <= this.CONSISTENCY_THRESHOLD_DAYS) {
          consistentPairs++;
        }
      }
    }

    const consistencyRate =
      (consistentPairs / (sortedHistory.length - 1)) * 100;

    if (consistencyRate >= 80) {
      insights.push("⭐ אתה מאוד עקבי באימונים!");
    } else if (consistencyRate >= 60) {
      insights.push("👍 עקביות טובה, המשך כך!");
    } else {
      insights.push("📅 נסה להיות יותר עקבי באימונים.");
    }
  }

  private analyzeWorkoutFrequency(
    history: WorkoutHistoryItem[],
    insights: string[]
  ): void {
    if (history.length < 7) return;

    const recentWeek = history.slice(-7);
    const workoutsThisWeek = recentWeek.length;

    if (workoutsThisWeek >= 5) {
      insights.push("🔥 שבוע מעולה! המשך במחץ!");
    } else if (workoutsThisWeek >= 3) {
      insights.push("💪 שבוע טוב, אבל אפשר עוד יותר!");
    } else {
      insights.push("📈 נסה להגדיל את תדירות האימונים השבוע.");
    }
  }

  private calculateWorkoutTypeDistribution(
    workouts: WorkoutHistoryItem[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {};
    const totalWorkouts = workouts.length;

    if (totalWorkouts === 0) return distribution;

    workouts.forEach((item) => {
      const workoutType = item.type || item.workoutName || "אימון כללי";
      distribution[workoutType] = (distribution[workoutType] || 0) + 1;
    });

    // Convert to percentages
    Object.keys(distribution).forEach((type) => {
      const count = distribution[type];
      if (count !== undefined) {
        distribution[type] = (count / totalWorkouts) * 100;
      }
    });

    return distribution;
  }

  private determineProgressTrend(
    workouts: WorkoutHistoryItem[]
  ): "improving" | "stable" | "declining" {
    if (workouts.length < 4) return "stable";

    const recentWorkouts = workouts.slice(-6);
    const firstHalf = recentWorkouts.slice(0, 3);
    const secondHalf = recentWorkouts.slice(3);

    const firstHalfDurations = firstHalf.map((w) => w.duration || 0);
    const secondHalfDurations = secondHalf.map((w) => w.duration || 0);

    const firstAvg =
      firstHalfDurations.reduce((sum, dur) => sum + dur, 0) /
      firstHalfDurations.length;
    const secondAvg =
      secondHalfDurations.reduce((sum, dur) => sum + dur, 0) /
      secondHalfDurations.length;

    if (firstAvg === 0) return "stable";

    const improvement = (secondAvg - firstAvg) / firstAvg;

    if (improvement > 0.1) return "improving";
    if (improvement < -0.1) return "declining";
    return "stable";
  }

  private calculateConsistencyScore(history: WorkoutHistoryItem[]): number {
    if (history.length < 2) return 0;

    const validHistory = history.filter(
      (item) => item.completedAt || item.date
    );
    if (validHistory.length < 2) return 0;

    const sortedHistory = [...validHistory].sort((a, b) => {
      const dateA = new Date(a.completedAt || a.date || "").getTime();
      const dateB = new Date(b.completedAt || b.date || "").getTime();
      return dateA - dateB;
    });

    let consistentPairs = 0;
    for (let i = 1; i < sortedHistory.length; i++) {
      const current = sortedHistory[i];
      const previous = sortedHistory[i - 1];

      if (current && previous) {
        const daysDiff = this.getDaysDifference(
          previous.completedAt || previous.date || "",
          current.completedAt || current.date || ""
        );

        if (daysDiff <= this.CONSISTENCY_THRESHOLD_DAYS) {
          consistentPairs++;
        }
      }
    }

    return (consistentPairs / (sortedHistory.length - 1)) * 100;
  }

  private getDaysDifference(date1: string, date2: string): number {
    if (!date1 || !date2) return Number.MAX_SAFE_INTEGER;

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return Number.MAX_SAFE_INTEGER;
    }

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getDefaultMetrics(): AdvancedMetrics {
    return {
      averageIntensity: 0,
      muscleGroupDistribution: {},
      progressTrend: "stable",
      consistencyScore: 0,
      volumeProgression: [],
      reliability: 0,
    };
  }
}

export interface AdvancedMetrics {
  averageIntensity: number;
  muscleGroupDistribution: Record<string, number>;
  progressTrend: "improving" | "stable" | "declining";
  consistencyScore: number;
  volumeProgression: number[];
  reliability: number;
}

export default new WorkoutAnalyticsService();
