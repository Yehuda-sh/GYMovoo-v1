/**
 * Progressive Overload Service - פשוט ויעיל
 * מעקב אחרי התקדמות ותמיכה בהגברה הדרגתית
 */

import { logger } from "../../utils/logger";
import { ExerciseTemplate } from "../../screens/workout/types/workout.types";
import { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { workoutStorageService } from "./workoutStorageService";

export interface ProgressSuggestion {
  exerciseId: string;
  action: "increase_weight" | "increase_reps" | "maintain";
  currentWeight?: number | undefined;
  newWeight?: number | undefined;
  currentReps?: number | undefined;
  newReps?: number | undefined;
  reason: string;
}

export interface ExerciseProgress {
  exerciseId: string;
  lastWeight?: number | undefined;
  lastReps?: number | undefined;
  lastSets?: number | undefined;
  workoutCount: number;
  isProgressing: boolean;
}

class ProgressiveOverloadService {
  /**
   * קבל הצעה להתקדמות בתרגיל
   */
  async getProgressionSuggestion(exerciseId: string): Promise<ProgressSuggestion | null> {
    try {
      const progress = await this.getExerciseProgress(exerciseId);
      if (!progress) {
        return {
          exerciseId,
          action: "maintain",
          reason: "תרגיל חדש - התמקד בטכניקה תקינה"
        };
      }

      return this.generateSuggestion(progress);
    } catch (error) {
      logger.error("ProgressiveOverloadService", "Failed to get suggestion", error);
      return null;
    }
  }

  /**
   * קבל התקדמות של תרגיל מההיסטוריה
   */
  async getExerciseProgress(exerciseId: string): Promise<ExerciseProgress | null> {
    try {
      const history = await workoutStorageService.getHistory();
      const recentWorkouts = history
        .filter(w => w.workout.exercises?.some(e => e.id === exerciseId))
        .slice(0, 5); // 5 אימונים אחרונים

      if (recentWorkouts.length === 0) return null;

      const exerciseData = this.extractExerciseData(exerciseId, recentWorkouts);
      return exerciseData;
    } catch (error) {
      logger.error("ProgressiveOverloadService", "Failed to get progress", error);
      return null;
    }
  }

  /**
   * חלץ נתוני תרגיל מאימונים אחרונים
   */
  private extractExerciseData(exerciseId: string, workouts: WorkoutWithFeedback[]): ExerciseProgress {
    let totalWeight = 0;
    let totalReps = 0;
    let totalSets = 0;
    let exerciseCount = 0;

    // עבור על האימונים ומצא את התרגיל
    workouts.forEach(workout => {
      const exercise = workout.workout.exercises?.find(e => e.id === exerciseId);
      if (exercise && exercise.sets && Array.isArray(exercise.sets)) {
        exerciseCount++;
        exercise.sets.forEach(set => {
          if (set.actualWeight || set.targetWeight) {
            totalWeight += set.actualWeight || set.targetWeight;
          }
          if (set.actualReps || set.targetReps) {
            totalReps += set.actualReps || set.targetReps;
          }
          totalSets++;
        });
      }
    });

    const avgWeight = totalWeight > 0 ? Math.round(totalWeight / totalSets) : undefined;
    const avgReps = totalReps > 0 ? Math.round(totalReps / totalSets) : undefined;

    return {
      exerciseId,
      lastWeight: avgWeight,
      lastReps: avgReps,
      lastSets: Math.round(totalSets / exerciseCount),
      workoutCount: exerciseCount,
      isProgressing: exerciseCount >= 3 // רק אם יש 3+ אימונים
    };
  }

  /**
   * צור הצעה להתקדמות
   */
  private generateSuggestion(progress: ExerciseProgress): ProgressSuggestion {
    const { exerciseId, lastWeight, lastReps, workoutCount } = progress;

    // אם פחות מ-3 אימונים - אל תשנה כלום
    if (workoutCount < 3) {
      return {
        exerciseId,
        action: "maintain",
        currentWeight: lastWeight,
        currentReps: lastReps,
        reason: "המשך עם אותם פרמטרים - צבור יותר ניסיון"
      };
    }

    // הגבר משקל אם יש משקל נוכחי
    if (lastWeight && lastWeight > 0) {
      const weightIncrease = lastWeight <= 20 ? 2.5 : 5; // עלייה קטנה או גדולה
      return {
        exerciseId,
        action: "increase_weight",
        currentWeight: lastWeight,
        newWeight: lastWeight + weightIncrease,
        currentReps: lastReps,
        reason: `הגבר משקל ב-${weightIncrease} ק"ג`
      };
    }

    // אם אין משקל - הגבר חזרות
    if (lastReps && lastReps > 0) {
      const repsIncrease = lastReps < 10 ? 2 : 1; // עלייה בחזרות
      return {
        exerciseId,
        action: "increase_reps",
        currentReps: lastReps,
        newReps: lastReps + repsIncrease,
        reason: `הוסף ${repsIncrease} חזרות נוספות`
      };
    }

    // ברירת מחדל
    return {
      exerciseId,
      action: "maintain",
      reason: "המשך עם הפרמטרים הנוכחיים"
    };
  }

  /**
   * יישם הצעות התקדמות על תוכנית אימון
   */
  async enhanceWorkoutWithProgression(exercises: ExerciseTemplate[]): Promise<ExerciseTemplate[]> {
    const enhanced: ExerciseTemplate[] = [];

    for (const exercise of exercises) {
      const suggestion = await this.getProgressionSuggestion(exercise.exerciseId);
      
      if (suggestion && suggestion.action !== "maintain") {
        const updatedExercise = { ...exercise };
        
        // עדכן משקל או חזרות
        if (suggestion.newWeight) {
          updatedExercise.notes = `${updatedExercise.notes} • משקל מוצע: ${suggestion.newWeight}kg`;
        }
        if (suggestion.newReps) {
          updatedExercise.reps = suggestion.newReps.toString();
        }
        
        updatedExercise.notes = `${updatedExercise.notes} • ${suggestion.reason}`;
        enhanced.push(updatedExercise);
      } else {
        enhanced.push(exercise);
      }
    }

    return enhanced;
  }

  /**
   * קבל סיכום התקדמות כללי
   */
  async getProgressSummary(): Promise<{
    totalExercises: number;
    progressingExercises: number;
    recommendations: string[];
  }> {
    try {
      const history = await workoutStorageService.getHistory();
      const recentWorkouts = history.slice(0, 10);
      
      if (recentWorkouts.length === 0) {
        return {
          totalExercises: 0,
          progressingExercises: 0,
          recommendations: ["התחל להתאמן בקביעות"]
        };
      }

      // מצא תרגילים ייחודיים
      const exerciseIds = new Set<string>();
      recentWorkouts.forEach(workout => {
        workout.workout.exercises?.forEach(exercise => {
          exerciseIds.add(exercise.id);
        });
      });

      const recommendations = [
        "שמור על עקביות באימונים",
        "הגבר עומס בהדרגה",
        "תעד את הביצועים שלך"
      ];

      return {
        totalExercises: exerciseIds.size,
        progressingExercises: Math.floor(exerciseIds.size * 0.7), // הערכה
        recommendations
      };
    } catch (error) {
      logger.error("ProgressiveOverloadService", "Failed to get summary", error);
      return {
        totalExercises: 0,
        progressingExercises: 0,
        recommendations: ["בעיה בטעינת נתונים"]
      };
    }
  }
}

export const progressiveOverloadService = new ProgressiveOverloadService();
