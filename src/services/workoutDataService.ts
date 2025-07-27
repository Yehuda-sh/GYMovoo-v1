/**
 * @file src/services/workoutDataService.ts
 * @brief שירות פשוט לניהול נתוני אימון - גרסה בסיסית שעובדת
 * @brief Simple workout data management service - basic working version
 * @dependencies questionnaireService, userStore
 * @notes גרסה פשוטה ויציבה לניהול נתוני אימון
 * @notes Simple and stable version for workout data management
 */

import { questionnaireService } from "./questionnaireService";
import { useUserStore } from "../stores/userStore";
import { EXTENDED_EXERCISE_DATABASE } from "../data/exerciseDatabase";
import {
  WorkoutPlan,
  WorkoutTemplate,
  ExerciseTemplate,
} from "../screens/workout/types/workout.types";

// מחלקת נתוני אימון פשוטה
// Simple workout data class
export class WorkoutDataService {
  /**
   * קבלת נתוני משתמש מאוחדים מכל המקורות
   * Get unified user data from all sources
   */
  static async getUserWorkoutData() {
    const { user } = useUserStore.getState();

    try {
      // 1. נסה לקבל נתונים מהשירות (החדש)
      const preferences = await questionnaireService.getUserPreferences();
      if (preferences) {
        return {
          source: "service",
          data: preferences,
          isComplete: true,
        };
      }

      // 2. אם אין, נסה מה-store החדש
      if (user?.questionnaireData?.metadata) {
        return {
          source: "store_new",
          data: user.questionnaireData.metadata,
          isComplete: true,
        };
      }

      // 3. אם אין, נסה להמיר מהפורמט הישן
      if (user?.questionnaire) {
        const converted = this.convertOldFormat(user.questionnaire);
        return {
          source: "store_old_converted",
          data: converted,
          isComplete: false,
        };
      }

      // 4. אין נתונים כלל
      return {
        source: "none",
        data: null,
        isComplete: false,
      };
    } catch (error) {
      console.error("Error getting user workout data:", error);
      return {
        source: "error",
        data: null,
        isComplete: false,
      };
    }
  }

  /**
   * המרת נתונים מפורמט ישן לחדש
   * Convert data from old to new format
   */
  private static convertOldFormat(oldAnswers: {
    [key: number]: string | string[];
  }) {
    return {
      frequency: oldAnswers[4] as string,
      duration: oldAnswers[5] as string,
      goal: oldAnswers[2] as string,
      experience: oldAnswers[3] as string,
      location: oldAnswers[6] as string,
      migrated: true,
      migratedAt: new Date().toISOString(),
    };
  }

  /**
   * יצירת תוכנית אימון בסיסית
   * Generate basic workout plan
   */
  static async generateBasicWorkoutPlan(): Promise<WorkoutPlan | null> {
    const userDataResult = await this.getUserWorkoutData();

    if (!userDataResult.data) {
      throw new Error("NO_QUESTIONNAIRE_DATA");
    }

    const metadata = userDataResult.data;

    try {
      const equipment = await questionnaireService.getAvailableEquipment();

      // פרמטרים בסיסיים
      const daysPerWeek = this.parseFrequency((metadata as any).frequency || "3");
      const duration = this.parseDuration((metadata as any).duration || "45");
      const difficulty = this.mapExperienceToDifficulty((metadata as any).experience || "beginner");

      // יצירת אימונים פשוטים
      const workouts = this.createBasicWorkouts(
        daysPerWeek,
        equipment,
        metadata
      );

      return {
        id: `basic-plan-${Date.now()}`,
        name: `תוכנית ${metadata.goal || "אימון"}`,
        description: `תוכנית בסיסית ל${
          metadata.goal || "אימון"
        } - ${daysPerWeek} ימים בשבוע`,
        difficulty: difficulty,
        duration: duration,
        frequency: daysPerWeek,
        workouts: workouts,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [(metadata as Record<string, any>).goal, "Basic"].filter(Boolean) as string[],
      };
    } catch (error) {
      console.error("Error generating basic workout plan:", error);
      return null;
    }
  }

  /**
   * יצירת אימונים בסיסיים
   * Create basic workouts
   */
  private static createBasicWorkouts(
    daysPerWeek: number,
    equipment: string[],
    metadata: any
  ): WorkoutTemplate[] {
    const workoutNames = this.getWorkoutNames(daysPerWeek);
    const workouts: WorkoutTemplate[] = [];

    workoutNames.forEach((name, index) => {
      // בחירת תרגילים בסיסיים
      const exercises = this.selectBasicExercises(name, equipment);

      workouts.push({
        id: `workout-${index + 1}`,
        name: name,
        exercises: exercises,
        estimatedDuration: 45, // זמן קבוע
        targetMuscles: this.getTargetMusclesForDay(name),
        equipment: equipment,
      });
    });

    return workouts;
  }

  /**
   * בחירת תרגילים בסיסיים
   * Select basic exercises
   */
  private static selectBasicExercises(
    workoutName: string,
    equipment: string[]
  ): ExerciseTemplate[] {
    const targetMuscles = this.getTargetMusclesForDay(workoutName);

    // סינון תרגילים מתאימים
    const suitableExercises = EXTENDED_EXERCISE_DATABASE.filter((exercise) => {
      const muscleMatch = targetMuscles.some(
        (muscle) =>
          exercise.primaryMuscles.includes(muscle) ||
          exercise.category === muscle
      );
      const equipmentMatch =
        equipment.includes(exercise.equipment) ||
        exercise.equipment === "bodyweight";
      const levelMatch = exercise.difficulty === "beginner";

      return muscleMatch && equipmentMatch && levelMatch;
    });

    // בחירת 4-6 תרגילים
    const selectedExercises = suitableExercises.slice(0, 6);

    return selectedExercises.map((exercise) => ({
      exerciseId: exercise.id,
      sets: 3,
      reps: "10-12",
      restTime: 60,
      notes: "התחל עם משקל קל",
    }));
  }

  /**
   * קבלת שמות אימונים לפי מספר ימים
   * Get workout names by number of days
   */
  private static getWorkoutNames(days: number): string[] {
    const WORKOUT_DAYS = {
      1: ["אימון מלא"],
      2: ["פלג גוף עליון", "פלג גוף תחתון"],
      3: ["דחיפה", "משיכה", "רגליים"],
      4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים"],
      5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים"],
      6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן"],
    };

    return WORKOUT_DAYS[days as keyof typeof WORKOUT_DAYS] || WORKOUT_DAYS[3];
  }

  /**
   * קבלת שרירי יעד ליום
   * Get target muscles for day
   */
  private static getTargetMusclesForDay(dayName: string): string[] {
    const muscleMap: { [key: string]: string[] } = {
      "אימון מלא": ["חזה", "גב", "רגליים", "כתפיים"],
      "פלג גוף עליון": ["חזה", "גב", "כתפיים", "ידיים"],
      "פלג גוף תחתון": ["רגליים", "ישבן"],
      דחיפה: ["חזה", "כתפיים", "טריצפס"],
      משיכה: ["גב", "ביצפס"],
      רגליים: ["רגליים", "ישבן"],
      "חזה + טריצפס": ["חזה", "טריצפס"],
      "גב + ביצפס": ["גב", "ביצפס"],
      כתפיים: ["כתפיים"],
      ידיים: ["ביצפס", "טריצפס"],
      בטן: ["בטן"],
    };

    return muscleMap[dayName] || ["גוף מלא"];
  }

  /**
   * פונקציות עזר
   * Helper functions
   */
  private static parseFrequency(frequency: string): number {
    const frequencyMap: { [key: string]: number } = {
      "1-2": 2,
      "3-4": 3,
      "5-6": 5,
      "כל יום": 6,
    };
    return frequencyMap[frequency] || 3;
  }

  private static parseDuration(duration: string): number {
    if (!duration) return 45;
    return parseInt(duration.split("-")[0]) || 45;
  }

  private static mapExperienceToDifficulty(
    experience: string
  ): "beginner" | "intermediate" | "advanced" {
    const map: { [key: string]: "beginner" | "intermediate" | "advanced" } = {
      "מתחיל (0-6 חודשים)": "beginner",
      "בינוני (6-24 חודשים)": "intermediate",
      "מתקדם (2+ שנים)": "advanced",
      מקצועי: "advanced",
    };
    return map[experience] || "beginner";
  }
}
