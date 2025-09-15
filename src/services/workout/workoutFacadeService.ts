import { WorkoutWithFeedback } from "../../core/types/workout.types";
import { WorkoutHistoryItem } from "../../core/types/user.types";
import { workoutStorageService } from "./workoutStorageService";

class WorkoutFacadeService {
  private readonly CONSISTENCY_THRESHOLD_DAYS = 3;
  private readonly MIN_WORKOUTS_FOR_ANALYSIS = 2;

  // Storage Methods
  async saveWorkout(workout: WorkoutWithFeedback): Promise<void> {
    if (!workout?.workout) {
      throw new Error("Invalid workout data provided");
    }
    return await workoutStorageService.saveWorkout(workout);
  }

  async getHistoryForList(): Promise<WorkoutHistoryItem[]> {
    return await workoutStorageService.getHistoryForList();
  }

  async getHistory(): Promise<WorkoutWithFeedback[]> {
    return await workoutStorageService.getHistory();
  }

  // Analytics Methods
  async getPersonalizedAnalytics(
    history: WorkoutHistoryItem[]
  ): Promise<string[]> {
    try {
      return await this.getPersonalizedWorkoutAnalytics(history);
    } catch {
      return ["אירעה שגיאה בניתוח האימונים."];
    }
  }

  // Private analytics methods
  private async getPersonalizedWorkoutAnalytics(
    history: WorkoutHistoryItem[]
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
          String(previous.completedAt || previous.date || ""),
          String(current.completedAt || current.date || "")
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
}

export default new WorkoutFacadeService();
