/**
 * @file src/services/quickWorkoutGenerator.ts
 * @brief שירות ליצירת אימונים מהירים מותאמים אישית
 * @brief Service for generating personalized quick workouts
 * @dependencies questionnaireService, exerciseDatabase
 * @notes יוצר אימונים דינמיים על בסיס נתוני המשתמש
 * @notes Creates dynamic workouts based on user data
 */

import {
  questionnaireService,
  QuestionnaireMetadata,
} from "./questionnaireService";
import { Exercise, Set } from "../screens/workout/types/workout.types";
import { getExercisesByEquipment } from "../data/exerciseDatabase";

// טיפוסים
// Types
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

// מאגר תרגילים בסיסי - עדיין נשמר למקרה הצורך
// Basic exercise database - kept for fallback needs
const EXERCISE_DATABASE: ExerciseTemplate[] = [
  // תרגילי חזה
  // Chest exercises
  {
    id: "bench_press",
    name: "לחיצת חזה במוט",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "טריצפס"],
    equipment: "barbell",
    difficulty: "intermediate",
  },
  {
    id: "db_bench_press",
    name: "לחיצת חזה עם משקולות",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "pushups",
    name: "שכיבות סמיכה",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "טריצפס"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "incline_db_press",
    name: "לחיצת חזה עליון עם משקולות",
    category: "חזה",
    primaryMuscles: ["חזה עליון"],
    secondaryMuscles: ["כתפיים"],
    equipment: "dumbbells",
    difficulty: "intermediate",
  },

  // תרגילי גב
  // Back exercises
  {
    id: "pullups",
    name: "מתח",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "pull_up_bar",
    difficulty: "intermediate",
  },
  {
    id: "bent_over_row",
    name: "חתירה בשיפוע",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "barbell",
    difficulty: "intermediate",
  },
  {
    id: "db_row",
    name: "חתירת משקולת",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },

  // תרגילי רגליים
  // Leg exercises
  {
    id: "squat",
    name: "סקוואט",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    secondaryMuscles: ["core"],
    equipment: "barbell",
    difficulty: "intermediate",
  },
  {
    id: "bodyweight_squat",
    name: "סקוואט משקל גוף",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "lunges",
    name: "מספריים",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "deadlift",
    name: "דדליפט",
    category: "רגליים",
    primaryMuscles: ["גב תחתון", "רגליים", "ישבן"],
    secondaryMuscles: ["גב", "core"],
    equipment: "barbell",
    difficulty: "advanced",
  },

  // תרגילי כתפיים
  // Shoulder exercises
  {
    id: "shoulder_press",
    name: "לחיצת כתפיים",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    secondaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "lateral_raise",
    name: "הרמות צד",
    category: "כתפיים",
    primaryMuscles: ["כתפיים צד"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },

  // תרגילי ידיים
  // Arm exercises
  {
    id: "bicep_curl",
    name: "כפיפת ביצפס",
    category: "ידיים",
    primaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "tricep_extension",
    name: "פשיטת טריצפס",
    category: "ידיים",
    primaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },

  // תרגילי בטן
  // Core exercises
  {
    id: "plank",
    name: "פלאנק",
    category: "בטן",
    primaryMuscles: ["core"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "crunches",
    name: "כפיפות בטן",
    category: "בטן",
    primaryMuscles: ["בטן"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "russian_twist",
    name: "סיבובים רוסיים",
    category: "בטן",
    primaryMuscles: ["אלכסונים"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
];

/**
 * מחלקה ליצירת אימונים מהירים
 * Quick workout generator class
 */
export class QuickWorkoutGenerator {
  /**
   * יצירת אימון מהיר מותאם אישית
   * Generate personalized quick workout
   */
  static async generateQuickWorkout(): Promise<Exercise[]> {
    const preferences = await questionnaireService.getUserPreferences();
    const equipment = await questionnaireService.getAvailableEquipment();
    const duration = await questionnaireService.getPreferredDuration();
    const experience = await questionnaireService.getUserExperience();
    const goal = await questionnaireService.getUserGoal();

    // חישוב מספר תרגילים לפי משך האימון
    // Calculate number of exercises based on duration
    const exerciseCount = Math.floor(duration / 10); // ~10 דקות לתרגיל

    // בחירת תרגילים מתאימים
    // Select appropriate exercises
    const exercises = this.selectExercises(
      exerciseCount,
      equipment,
      experience,
      goal,
      preferences
    );

    // יצירת סטים לכל תרגיל
    // Create sets for each exercise
    return exercises.map((template, index) =>
      this.createExerciseWithSets(template, index, experience, goal)
    );
  }

  /**
   * בחירת תרגילים מתאימים
   * Select appropriate exercises
   */
  private static selectExercises(
    count: number,
    equipment: string[],
    experience: string,
    goal: string,
    _preferences: QuestionnaireMetadata | null
  ): ExerciseTemplate[] {
    // סינון תרגילים לפי ציוד זמין
    // Filter exercises by available equipment
    let availableExercises = getExercisesByEquipment(equipment);

    // סינון לפי רמת קושי
    // Filter by difficulty level
    const difficulty = this.getDifficultyLevel(experience);
    availableExercises = availableExercises.filter((ex) => {
      if (difficulty === "beginner") return ex.difficulty === "beginner";
      if (difficulty === "intermediate") return ex.difficulty !== "advanced";
      return true; // advanced can do all
    });

    // בחירה לפי מטרה
    // Select by goal
    const selectedExercises: ExerciseTemplate[] = [];

    switch (goal) {
      case "ירידה במשקל":
        // דגש על תרגילים מורכבים וקרדיו
        // Focus on compound exercises and cardio
        selectedExercises.push(
          ...this.selectCompoundExercises(availableExercises, count)
        );
        break;

      case "עליה במסת שריר":
        // דגש על תרגילי כוח
        // Focus on strength exercises
        selectedExercises.push(
          ...this.selectMuscleBuilding(availableExercises, count)
        );
        break;

      case "שיפור כוח":
        // דגש על תרגילים כבדים
        // Focus on heavy exercises
        selectedExercises.push(
          ...this.selectStrengthExercises(availableExercises, count)
        );
        break;

      case "שיפור סיבולת":
        // דגש על חזרות גבוהות
        // Focus on high reps
        selectedExercises.push(
          ...this.selectEnduranceExercises(availableExercises, count)
        );
        break;

      default:
        // אימון מאוזן
        // Balanced workout
        selectedExercises.push(
          ...this.selectBalancedExercises(availableExercises, count)
        );
    }

    return selectedExercises;
  }

  /**
   * יצירת תרגיל עם סטים
   * Create exercise with sets
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
   * Generate sets for exercise
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
    // Warmup set if needed
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
    // Regular sets
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
   * Calculate number of sets
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
    // Adjust for experience
    if (experience === "מתחיל (0-6 חודשים)") return Math.min(baseCount, 3);
    if (experience === "מקצועי (5+ שנים)") return baseCount + 1;

    return baseCount;
  }

  /**
   * חישוב חזרות ומשקל
   * Calculate reps and weight
   */
  private static getRepsAndWeight(
    template: ExerciseTemplate,
    goal: string,
    experience: string
  ): { reps: number; weight: number } {
    // חזרות לפי מטרה
    // Reps by goal
    const repsMap: { [key: string]: number } = {
      "ירידה במשקל": 15,
      "עליה במסת שריר": 10,
      "שיפור כוח": 5,
      "שיפור סיבולת": 20,
      "בריאות כללית": 12,
    };

    const reps = repsMap[goal] || 12;

    // משקל לפי תרגיל וניסיון
    // Weight by exercise and experience
    if (template.equipment === "bodyweight") return { reps, weight: 0 };

    // משקלים התחלתיים משוערים
    // Estimated starting weights
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
    // Adjust for goal
    let weight = baseWeight;
    if (goal === "שיפור כוח") weight *= 1.2;
    if (goal === "שיפור סיבולת") weight *= 0.7;

    return { reps, weight: Math.round(weight) };
  }

  /**
   * חישוב זמן מנוחה
   * Calculate rest time
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
    // Adjust for difficulty
    if (difficulty === "advanced") return rest * 1.2;
    if (difficulty === "beginner") return rest * 0.8;

    return rest;
  }

  // פונקציות עזר לבחירת תרגילים
  // Helper functions for exercise selection

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
    // Select at least one exercise from each muscle group
    Object.values(groups).forEach((group) => {
      if (selected.length < count && group.length > 0) {
        selected.push(group[Math.floor(Math.random() * group.length)]);
      }
    });

    // השלם את המספר הנדרש
    // Complete the required number
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
    // Prefer barbell exercises
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
    // Prefer bodyweight exercises
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
    // Select exercises from different categories
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
  // General helper functions

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
// Export convenience function
export async function generateQuickWorkout(): Promise<Exercise[]> {
  return QuickWorkoutGenerator.generateQuickWorkout();
}
