/**
 * @file src/services/workoutDataService.ts
 * @description שירות פשוט לניהול נתוני אימון
 * English: Simple workout data service
 *
 * @features
 * - קבלת נתוני משתמש מכל המקורות
 * - המרת פורמטים ישנים לחדשים
 * - יצירת תוכניות אימון בסיסיות
 *
 * @dependencies questionnaireService, userStore
 * @used_by WorkoutPlansScreen, services/index.ts
 */

import { questionnaireService } from "./questionnaireService";
import { useUserStore } from "../stores/userStore";
import { Exercise } from "../data/exercises/types";
import { MuscleGroup } from "../constants/exercise";
import { getSmartFilteredExercises } from "../data/exercises";
import {
  WorkoutPlan,
  WorkoutTemplate,
  ExerciseTemplate,
} from "../screens/workout/types/workout.types";

// טיפוס עבור metadata של תוכנית אימון
interface WorkoutMetadata {
  frequency?: string;
  duration?: string;
  experience?: string;
  goal?: string;
  location?: string;
  home_equipment?: string[];
  gym_equipment?: string[];
  [key: string]: string | number | string[] | undefined;
}

// מחלקת נתוני אימון פשוטה
// Simple workout data service
export class WorkoutDataService {
  /**
   * קבלת נתוני משתמש מאוחדים מכל המקורות
   * Get unified user workout data from all sources
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
      if (user?.questionnairedata?.metadata) {
        return {
          source: "store_new",
          data: user.questionnairedata.metadata,
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
   * Create basic workout plan
   */
  static async generateBasicWorkoutPlan(): Promise<WorkoutPlan | null> {
    const userDataResult = await this.getUserWorkoutData();

    if (!userDataResult.data) {
      throw new Error("NO_QUESTIONNAIRE_DATA");
    }

    const metadata = userDataResult.data as WorkoutMetadata;

    try {
      const equipment = await questionnaireService.getAvailableEquipment();

      // פרמטרים בסיסיים
      const daysPerWeek = this.parseFrequency(metadata.frequency || "3");
      const duration = this.parseDuration(metadata.duration || "45");
      const difficulty = this.mapExperienceToDifficulty(
        metadata.experience || "beginner"
      );

      // יצירת אימונים פשוטים
      const workouts = this.createBasicWorkouts(daysPerWeek, equipment);

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
        tags: [metadata.goal, "Basic"].filter(Boolean) as string[],
      };
    } catch (error) {
      console.error("Error generating basic workout plan:", error);
      return null;
    }
  }

  /**
   * יצירת אימונים בסיסיים
   */
  private static createBasicWorkouts(
    daysPerWeek: number,
    equipment: string[]
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
   */
  private static selectBasicExercises(
    workoutName: string,
    equipment: string[]
  ): ExerciseTemplate[] {
    const targetMuscles = this.getTargetMusclesForDay(workoutName);

    // שימוש בפונקציית הסינון החכמה
    const environments: ("home" | "gym" | "outdoor")[] = ["home"];
    let suitableExercises = getSmartFilteredExercises(environments, equipment);

    // סינון נוסף לפי שרירי היעד
    suitableExercises = suitableExercises.filter((exercise: Exercise) => {
      const primary = exercise.primaryMuscles;
      const targetMusclesTyped = targetMuscles as MuscleGroup[];
      const muscleMatch = targetMusclesTyped.some(
        (muscle) => primary?.includes(muscle) || exercise.category === muscle
      );
      const levelMatch = exercise.difficulty === "beginner";

      return muscleMatch && levelMatch;
    });

    // בחירת 4-6 תרגילים
    const selectedExercises = suitableExercises.slice(0, 6);

    return selectedExercises.map((exercise: Exercise) => ({
      exerciseId: exercise.id,
      sets: 3,
      reps: "10-12",
      restTime: 60,
      notes: "התחל עם משקל קל",
    }));
  }

  /**
   * קבלת שמות אימונים לפי מספר ימים
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
   * קביעת שרירי יעד ליום אימון
   */
  private static getTargetMusclesForDay(workoutName: string): string[] {
    const muscleMap: { [key: string]: string[] } = {
      דחיפה: ["chest", "shoulders", "triceps"],
      משיכה: ["back", "biceps"],
      רגליים: ["quadriceps", "hamstrings", "glutes", "calves"],
      "חזה + טריצפס": ["chest", "triceps"],
      "גב + ביצפס": ["back", "biceps"],
      כתפיים: ["shoulders"],
      "בטן וליבה": ["core"],
      "גוף עליון": ["chest", "back", "shoulders", "biceps", "triceps"],
      "גוף תחתון": ["quadriceps", "hamstrings", "glutes", "calves"],
      "גוף מלא": [
        "chest",
        "back",
        "quadriceps",
        "hamstrings",
        "glutes",
        "shoulders",
        "biceps",
        "triceps",
        "core",
      ],
      חזה: ["chest"],
      גב: ["back"],
      ידיים: ["biceps", "triceps"],
      בטן: ["core"],
      "אימון מלא": [
        "chest",
        "back",
        "quadriceps",
        "hamstrings",
        "glutes",
        "shoulders",
        "biceps",
        "triceps",
      ],
      "פלג גוף עליון": ["chest", "back", "shoulders", "biceps", "triceps"],
      "פלג גוף תחתון": ["quadriceps", "hamstrings", "glutes", "calves"],
    };

    return muscleMap[workoutName] || muscleMap["גוף מלא"];
  }

  /**
   * פונקציות עזר
   */
  private static parseFrequency(frequency: string): number {
    const frequencyMap: { [key: string]: number } = {
      // פורמט עברי (ישן)
      "1-2": 2,
      "3-4": 3,
      "5-6": 5,
      "כל יום": 6,
      // פורמט אנגלי (חדש)
      "2_times": 2,
      "3_times": 3,
      "4_times": 4,
      "5_times": 5,
      "6_times": 6,
      daily: 7,
      "2 times per week": 2,
      "3 times per week": 3,
      "4 times per week": 4,
      "5 times per week": 5,
      "6 times per week": 6,
      "7 times per week": 7,
    };
    return frequencyMap[frequency] || 3;
  }

  private static parseDuration(duration: string): number {
    if (!duration) return 45;

    // תמיכה בפורמט אנגלי חדש
    if (duration.includes("_min")) {
      const match = duration.match(/(\d+)(?:_(\d+))?_min/);
      if (match) {
        const a = parseInt(match[1], 10);
        const b = match[2] ? parseInt(match[2], 10) : undefined;
        if (!isNaN(a) && !isNaN(b as number)) {
          return Math.round((a + (b as number)) / 2);
        }
        if (!isNaN(a)) return a;
      }
      return 45;
    }

    // פורמט עברי ישן
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
