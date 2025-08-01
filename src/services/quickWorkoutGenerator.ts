/**
 * @file src/services/quickWorkoutGenerator.ts
 * @brief שירות ליצירת אימונים מהירים מותאמים אישית
 * @dependencies questionnaireService, exerciseDatabase
 * @notes יוצר אימונים דינמיים על בסיס נתוני המשתמש
 */

import { questionnaireService } from "./questionnaireService";
import { Exercise, Set } from "../screens/workout/types/workout.types";
import { getExercisesByEquipment } from "../data/exerciseDatabase";

export interface ExerciseTemplate {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions?: string[];
  tips?: string[];
}

/**
 * מחלקה ליצירת אימונים מהירים
 */
export class QuickWorkoutGenerator {
  /**
   * יצירת אימון מהיר מותאם אישית
   */
  static async generateQuickWorkout(): Promise<Exercise[]> {
    const equipment = await questionnaireService.getAvailableEquipment();
    const duration = await questionnaireService.getPreferredDuration();
    const experience = await questionnaireService.getUserExperience();
    const goal = await questionnaireService.getUserGoal();

    // חישוב מספר תרגילים לפי משך האימון (~10 דקות לתרגיל)
    const exerciseCount = Math.floor(duration / 10);

    // בחירת תרגילים מתאימים
    const exercises = this.selectExercises(
      exerciseCount,
      equipment,
      experience,
      goal
    );

    // יצירת סטים לכל תרגיל
    return exercises.map((template, index) =>
      this.createExerciseWithSets(template, index, experience, goal)
    );
  }

  /**
   * בחירת תרגילים מתאימים
   */
  private static selectExercises(
    count: number,
    equipment: string[],
    experience: string,
    goal: string
  ): ExerciseTemplate[] {
    // סינון תרגילים לפי ציוד זמין
    let availableExercises = getExercisesByEquipment(equipment);

    // סינון לפי רמת קושי
    const difficulty = this.getDifficultyLevel(experience);
    availableExercises = availableExercises.filter((ex) => {
      if (difficulty === "beginner") return ex.difficulty === "beginner";
      if (difficulty === "intermediate") return ex.difficulty !== "advanced";
      return true; // advanced can do all
    });

    // בחירה לפי מטרה
    const selectedExercises: ExerciseTemplate[] = [];

    switch (goal) {
      case "ירידה במשקל":
        // דגש על תרגילים מורכבים וקרדיו
        selectedExercises.push(
          ...this.selectCompoundExercises(availableExercises, count)
        );
        break;

      case "עליה במסת שריר":
        // דגש על תרגילי כוח
        selectedExercises.push(
          ...this.selectMuscleBuilding(availableExercises, count)
        );
        break;

      case "שיפור כוח":
        // דגש על תרגילים כבדים
        selectedExercises.push(
          ...this.selectStrengthExercises(availableExercises, count)
        );
        break;

      case "שיפור סיבולת":
        // דגש על חזרות גבוהות
        selectedExercises.push(
          ...this.selectEnduranceExercises(availableExercises, count)
        );
        break;

      default:
        // אימון מאוזן
        selectedExercises.push(
          ...this.selectBalancedExercises(availableExercises, count)
        );
    }

    return selectedExercises;
  }

  /**
   * יצירת תרגיל עם סטים
   */
  private static createExerciseWithSets(
    template: ExerciseTemplate,
    index: number,
    experience: string,
    goal: string
  ): Exercise {
    const sets = this.generateSets(template, experience, goal);

    return {
      id: `${template.id}_${Date.now()}_${index}`,
      name: template.name,
      category: template.category,
      primaryMuscles: template.primaryMuscles,
      secondaryMuscles: template.secondaryMuscles,
      equipment: template.equipment,
      sets: sets,
      restTime: this.calculateRestTime(goal, template.difficulty),
      notes: template.tips?.join("\n"),
    };
  }

  /**
   * יצירת סטים לתרגיל
   */
  private static generateSets(
    template: ExerciseTemplate,
    experience: string,
    goal: string
  ): Set[] {
    const setCount = this.getSetCount(goal, experience);
    const { reps, weight } = this.getRepsAndWeight(template, goal, experience);

    const sets: Set[] = [];

    // סט חימום אם צריך
    if (template.equipment !== "bodyweight" && weight > 40) {
      sets.push({
        id: `${template.id}_warmup`,
        type: "warmup",
        targetReps: Math.min(reps + 5, 20),
        targetWeight: Math.round(weight * 0.5),
        completed: false,
        isPR: false,
      });
    }

    // סטים רגילים
    for (let i = 0; i < setCount; i++) {
      sets.push({
        id: `${template.id}_set_${i + 1}`,
        type: "working",
        targetReps: reps,
        targetWeight: weight,
        completed: false,
        isPR: false,
      });
    }

    return sets;
  }

  /**
   * חישוב מספר סטים
   */
  private static getSetCount(goal: string, experience: string): number {
    const baseCount =
      {
        "ירידה במשקל": 3,
        "עליה במסת שריר": 4,
        "שיפור כוח": 5,
        "שיפור סיבולת": 3,
        "בריאות כללית": 3,
      }[goal] || 3;

    // התאמה לניסיון
    if (experience === "מתחיל (0-6 חודשים)") return Math.min(baseCount, 3);
    if (experience === "מקצועי (5+ שנים)") return baseCount + 1;

    return baseCount;
  }

  /**
   * חישוב חזרות ומשקל
   */
  private static getRepsAndWeight(
    template: ExerciseTemplate,
    goal: string,
    experience: string
  ): { reps: number; weight: number } {
    // חזרות לפי מטרה
    const repsMap: { [key: string]: number } = {
      "ירידה במשקל": 15,
      "עליה במסת שריר": 10,
      "שיפור כוח": 5,
      "שיפור סיבולת": 20,
      "בריאות כללית": 12,
    };

    const reps = repsMap[goal] || 12;

    // משקל לפי תרגיל וניסיון
    if (template.equipment === "bodyweight") return { reps, weight: 0 };

    // משקלים התחלתיים משוערים
    const weightMap: { [key: string]: { [key: string]: number } } = {
      bench_press: { מתחיל: 40, בינוני: 60, מתקדם: 80 },
      db_bench_press: { מתחיל: 15, בינוני: 25, מתקדם: 35 },
      bent_over_row: { מתחיל: 30, בינוני: 50, מתקדם: 70 },
      db_row: { מתחיל: 12, בינוני: 20, מתקדם: 30 },
      squat: { מתחיל: 40, בינוני: 70, מתקדם: 100 },
      deadlift: { מתחיל: 50, בינוני: 80, מתקדם: 120 },
      shoulder_press: { מתחיל: 10, בינוני: 15, מתקדם: 25 },
      lateral_raise: { מתחיל: 5, בינוני: 8, מתקדם: 12 },
      bicep_curl: { מתחיל: 8, בינוני: 12, מתקדם: 18 },
      tricep_extension: { מתחיל: 8, בינוני: 12, מתקדם: 18 },
    };

    const expLevel = this.getExperienceLevel(experience);
    const baseWeight = weightMap[template.id]?.[expLevel] || 10;

    // התאמה למטרה
    let weight = baseWeight;
    if (goal === "שיפור כוח") weight *= 1.2;
    if (goal === "שיפור סיבולת") weight *= 0.7;

    return { reps, weight: Math.round(weight) };
  }

  /**
   * חישוב זמן מנוחה
   */
  private static calculateRestTime(goal: string, difficulty: string): number {
    const baseRest: { [key: string]: number } = {
      "ירידה במשקל": 45,
      "עליה במסת שריר": 90,
      "שיפור כוח": 180,
      "שיפור סיבולת": 30,
      "בריאות כללית": 60,
    };

    const rest = baseRest[goal] || 60;

    // התאמה לקושי
    if (difficulty === "advanced") return rest * 1.2;
    if (difficulty === "beginner") return rest * 0.8;

    return rest;
  }

  // פונקציות עזר לבחירת תרגילים

  private static selectCompoundExercises(
    exercises: ExerciseTemplate[],
    count: number
  ): ExerciseTemplate[] {
    const compound = exercises.filter(
      (ex) =>
        ex.primaryMuscles.length > 1 ||
        (ex.secondaryMuscles && ex.secondaryMuscles.length > 0)
    );
    return this.shuffleAndTake(compound, count);
  }

  private static selectMuscleBuilding(
    exercises: ExerciseTemplate[],
    count: number
  ): ExerciseTemplate[] {
    const groups = this.groupByCategory(exercises);
    const selected: ExerciseTemplate[] = [];

    // בחר לפחות תרגיל אחד מכל קבוצת שרירים
    Object.values(groups).forEach((group) => {
      if (selected.length < count && group.length > 0) {
        selected.push(group[Math.floor(Math.random() * group.length)]);
      }
    });

    // השלם את המספר הנדרש
    while (selected.length < count && exercises.length > selected.length) {
      const remaining = exercises.filter((ex) => !selected.includes(ex));
      if (remaining.length > 0) {
        selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
      } else {
        break;
      }
    }

    return selected;
  }

  private static selectStrengthExercises(
    exercises: ExerciseTemplate[],
    count: number
  ): ExerciseTemplate[] {
    // העדף תרגילים עם מוט
    const barbell = exercises.filter((ex) => ex.equipment === "barbell");
    const others = exercises.filter((ex) => ex.equipment !== "barbell");

    const selected = [...barbell.slice(0, Math.min(count - 1, barbell.length))];
    const remaining = count - selected.length;

    if (remaining > 0) {
      selected.push(...this.shuffleAndTake(others, remaining));
    }

    return selected;
  }

  private static selectEnduranceExercises(
    exercises: ExerciseTemplate[],
    count: number
  ): ExerciseTemplate[] {
    // העדף תרגילי משקל גוף
    const bodyweight = exercises.filter((ex) => ex.equipment === "bodyweight");
    const others = exercises.filter((ex) => ex.equipment !== "bodyweight");

    const selected = [
      ...bodyweight.slice(0, Math.min(count - 1, bodyweight.length)),
    ];
    const remaining = count - selected.length;

    if (remaining > 0) {
      selected.push(...this.shuffleAndTake(others, remaining));
    }

    return selected;
  }

  private static selectBalancedExercises(
    exercises: ExerciseTemplate[],
    count: number
  ): ExerciseTemplate[] {
    const groups = this.groupByCategory(exercises);
    const selected: ExerciseTemplate[] = [];
    const categories = Object.keys(groups);

    // בחר תרגילים מקטגוריות שונות
    let i = 0;
    while (selected.length < count && categories.length > 0) {
      const category = categories[i % categories.length];
      const group = groups[category];

      if (group.length > 0) {
        const index = Math.floor(Math.random() * group.length);
        selected.push(group[index]);
        group.splice(index, 1);
      }

      i++;
    }

    return selected;
  }

  // פונקציות עזר כלליות

  private static getDifficultyLevel(
    experience: string
  ): "beginner" | "intermediate" | "advanced" {
    if (experience.includes("מתחיל")) return "beginner";
    if (experience.includes("מקצועי") || experience.includes("תחרותי"))
      return "advanced";
    return "intermediate";
  }

  private static getExperienceLevel(
    experience: string
  ): "מתחיל" | "בינוני" | "מתקדם" {
    if (experience.includes("מתחיל")) return "מתחיל";
    if (experience.includes("מתקדם") || experience.includes("מקצועי"))
      return "מתקדם";
    return "בינוני";
  }

  private static groupByCategory(exercises: ExerciseTemplate[]): {
    [category: string]: ExerciseTemplate[];
  } {
    return exercises.reduce(
      (groups, ex) => {
        if (!groups[ex.category]) groups[ex.category] = [];
        groups[ex.category].push(ex);
        return groups;
      },
      {} as { [category: string]: ExerciseTemplate[] }
    );
  }

  private static shuffleAndTake<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

// יצוא פונקציה נוחה
export async function generateQuickWorkout(): Promise<Exercise[]> {
  return QuickWorkoutGenerator.generateQuickWorkout();
}
