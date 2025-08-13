/**
 * @file src/services/quickWorkoutGenerator.ts
 * @description שירות ליצירת אימונים מהירים מותאמים אישית (חלקית פעיל)
 * English: Quick workout generation service with personalized adaptations (partially active)
 *
 * @features
 * - יצירת אימונים מהירים עם סינון חכם | Quick workout generation with smart filtering
 * - מטריצות נתונים מרכזיות לסטים וחזרות | Centralized data matrices for sets and reps
 * - בחירת תרגילים לפי מטרה ומיקום | Exercise selection by goal and location
 * - חישוב משקלים ומנוחה מותאמים | Adaptive weight and rest calculations
 * - תמיכה בסביבות אימון שונות | Multiple workout environment support
 *
 * @status ⚠️ PARTIALLY ACTIVE - Exported but not used in production
 * @used_by services/index.ts export, mentioned in WORKOUT_SCREENS_GUIDE.md
 * @overlap ⚠️ Significant overlap with WorkoutDataService functionality
 * @alternative WorkoutPlansScreen uses WorkoutDataService for similar functionality
 * @recommendation Consider consolidating with WorkoutDataService or mark as deprecated
 * @updated 2025-08-11 Added usage status and consolidation recommendations
 */

import { questionnaireService } from "./questionnaireService";
import { WorkoutExercise, ExerciseSet } from "../types";
import { Exercise } from "../data/exercises/types";
import {
  getSmartFilteredExercises,
  filterExercisesByEquipment,
} from "../data/exercises";

// =======================================
// 🎯 קונסטנטים ומטריצות נתונים מרכזיות
// Central Data Matrices and Constants
// =======================================

/**
 * מטריצת סטים לפי מטרה - מרכוז נתונים
 * Sets matrix by goal - centralized data
 */
const GOAL_SETS_MATRIX = {
  "ירידה במשקל": 3,
  "עליה במסת שריר": 4,
  "שיפור כוח": 5,
  "שיפור סיבולת": 3,
  "בריאות כללית": 3,
} as const;

/**
 * מטריצת חזרות לפי מטרה - מרכוז נתונים
 * Reps matrix by goal - centralized data
 */
const GOAL_REPS_MATRIX = {
  "ירידה במשקל": 15,
  "עליה במסת שריר": 10,
  "שיפור כוח": 5,
  "שיפור סיבולת": 20,
  "בריאות כללית": 12,
} as const;

/**
 * מטריצת זמני מנוחה בסיסיים לפי מטרה - מרכוז נתונים
 * Rest times matrix by goal - centralized data
 */
const GOAL_REST_TIMES_MATRIX = {
  "ירידה במשקל": 45,
  "עליה במסת שריר": 90,
  "שיפור כוח": 180,
  "שיפור סיבולת": 30,
  "בריאות כללית": 60,
} as const;

/**
 * מטריצת משקלים התחלתיים לפי תרגיל וניסיון - מרכוז נתונים
 * Starting weights matrix by exercise and experience - centralized data
 */
const EXERCISE_WEIGHTS_MATRIX: {
  [exerciseId: string]: { [level: string]: number };
} = {
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
} as const;

/**
 * מודפקטורי משקל לפי מטרה - מרכוז נתונים
 * Weight modifiers by goal - centralized data
 */
const GOAL_WEIGHT_MODIFIERS = {
  "שיפור כוח": 1.2,
  "שיפור סיבולת": 0.7,
} as const;

/**
 * מודפקטורי קושי לזמן מנוחה - מרכוז נתונים
 * Difficulty modifiers for rest time - centralized data
 */
const DIFFICULTY_REST_MODIFIERS = {
  advanced: 1.2,
  beginner: 0.8,
  intermediate: 1,
} as const;

/**
 * פונקציות עזר מאוחדות לעבודה עם רמות ניסיון
 * Unified helper functions for experience levels
 */
const ExperienceUtils = {
  /**
   * המרת ניסיון מעברית לאנגלית
   * Convert experience from Hebrew to English
   */
  toDifficultyLevel(
    experience: string
  ): "beginner" | "intermediate" | "advanced" {
    if (experience.includes("מתחיל")) return "beginner";
    if (experience.includes("מקצועי") || experience.includes("תחרותי"))
      return "advanced";
    return "intermediate";
  },

  /**
   * המרת ניסיון לרמה עברית
   * Convert experience to Hebrew level
   */
  toHebrewLevel(experience: string): "מתחיל" | "בינוני" | "מתקדם" {
    if (experience.includes("מתחיל")) return "מתחיל";
    if (experience.includes("מתקדם") || experience.includes("מקצועי"))
      return "מתקדם";
    return "בינוני";
  },

  /**
   * מודפקטור סטים לפי ניסיון
   * Sets modifier by experience
   */
  getSetModifier(experience: string, baseCount: number): number {
    if (experience.includes("מתחיל")) return Math.min(baseCount, 3);
    if (experience.includes("מקצועי")) return baseCount + 1;
    return baseCount;
  },
} as const;

/**
 * מחלקה ליצירת אימונים מהירים
 * Quick workout generation class
 * @deprecated Consider using WorkoutDataService.generateAIWorkoutPlan() instead
 */
export class QuickWorkoutGenerator {
  /**
   * יצירת אימון מהיר מותאם אישית עם סינון חכם
   * Enhanced quick workout generation with smart filtering
   */
  static async generateQuickWorkout(): Promise<WorkoutExercise[]> {
    const equipment = await questionnaireService.getAvailableEquipment();
    const duration = await questionnaireService.getPreferredDuration();
    const experience = await questionnaireService.getUserExperience();
    const goal = await questionnaireService.getUserGoal();

    // חישוב מספר תרגילים לפי משך האימון (~10 דקות לתרגיל)
    const exerciseCount = Math.max(1, Math.floor(duration / 10));

    // 🎯 סינון חכם לפי סביבה וציוד - הפונקציה המרכזית!
    // אם בחרו בית ללא ציוד - רק תרגילי משקל גוף
    const environments = await this.getUserEnvironments();
    const exercises = this.selectExercises(
      exerciseCount,
      environments,
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
   * קבלת סביבות אימון מועדפות של המשתמש
   * Get user's preferred workout environments
   */
  private static async getUserEnvironments(): Promise<
    ("home" | "gym" | "outdoor")[]
  > {
    // ברירת מחדל - בית (ניתן להוסיף שאלה בשאלון)
    return ["home"];
  }

  /**
   * בחירת תרגילים עם סינון חכם - פונקציה מעודכנת
   * Smart exercise selection with precise filtering
   */
  private static selectExercises(
    count: number,
    environments: ("home" | "gym" | "outdoor")[],
    equipment: string[],
    experience: string,
    goal: string
  ): Exercise[] {
    // 🔥 השימוש בפונקציה החכמה החדשה - זה הלב של הפתרון!
    // אם בחרו בית ללא ציוד - יחזיר רק תרגילי משקל גוף
    let availableExercises = getSmartFilteredExercises(environments, equipment);

    // אם אין תרגילים זמינים - נסיון נוסף עם סינון פחות מגביל
    if (availableExercises.length === 0) {
      console.warn(
        "🔍 No exercises found with smart filter, trying equipment-only filter"
      );
      availableExercises = filterExercisesByEquipment(equipment);
    }

    // סינון לפי רמת קושי
    const difficulty = ExperienceUtils.toDifficultyLevel(experience);
    availableExercises = availableExercises.filter((ex: Exercise) => {
      if (difficulty === "beginner") return ex.difficulty === "beginner";
      if (difficulty === "intermediate") return ex.difficulty !== "advanced";
      return true; // advanced can do all
    });

    console.warn(
      `🎯 Available exercises after filtering: ${availableExercises.length}`
    );
    console.warn(`📍 Environments: ${environments.join(", ")}`);
    console.warn(`🔧 Equipment: ${equipment.join(", ") || "None"}`);

    // מטריצת בחירה לפי מטרה - מעודכנת
    const goalToSelectionMethod = {
      "ירידה במשקל": () =>
        this.selectCompoundExercises(availableExercises, count),
      "עליה במסת שריר": () =>
        this.selectMuscleBuilding(availableExercises, count),
      "שיפור כוח": () =>
        this.selectStrengthExercises(availableExercises, count),
      "שיפור סיבולת": () =>
        this.selectEnduranceExercises(availableExercises, count),
      "בריאות כללית": () =>
        this.selectBalancedExercises(availableExercises, count),
    };

    // בחירה לפי מטרה או אימון מאוזן כברירת מחדל
    const selectionMethod =
      goalToSelectionMethod[goal as keyof typeof goalToSelectionMethod];
    return selectionMethod
      ? selectionMethod()
      : this.selectBalancedExercises(availableExercises, count);
  }

  /**
   * יצירת תרגיל עם סטים - מעודכן לטיפוס החדש
   * Create exercise with sets - updated for new type
   */
  private static createExerciseWithSets(
    template: Exercise,
    index: number,
    experience: string,
    goal: string
  ): WorkoutExercise {
    const sets = this.generateSets(template, experience, goal);

    return {
      id: `${template.id}_${Date.now()}_${index}`,
      name: template.nameLocalized.he, // 🌍 שימוש בשם בעברית
      category: template.category,
      primaryMuscles: template.primaryMuscles,
      secondaryMuscles: template.secondaryMuscles,
      equipment: template.equipment,
      sets: sets,
      restTime: this.calculateRestTime(goal, template.difficulty),
      notes: template.tips?.he?.join("\n") || "", // 🌍 טיפים בעברית
    };
  }

  /**
   * יצירת סטים לתרגיל - מעודכן לטיפוס החדש
   * Generate sets for exercise - updated for new type
   */
  private static generateSets(
    template: Exercise,
    experience: string,
    goal: string
  ): ExerciseSet[] {
    const setCount = this.getSetCount(goal, experience);
    const { reps, weight } = this.getRepsAndWeight(template, goal, experience);

    const sets: ExerciseSet[] = [];

    // סט חימום אם צריך - מותאם לטיפוס החדש
    if (template.equipment !== "none" && weight > 40) {
      sets.push({
        id: `${template.id}_warmup`,
        type: "warmup",
        targetReps: Math.min(reps + 5, 20),
        targetWeight: Math.round(weight * 0.5),
        completed: false,
        isPR: false,
        reps: Math.min(reps + 5, 20),
        weight: Math.round(weight * 0.5),
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
        reps: reps,
        weight: weight,
      });
    }

    return sets;
  }

  /**
   * חישוב מספר סטים - משתמש במטריצה מרכזית
   * Calculate set count - uses centralized matrix
   */
  private static getSetCount(goal: string, experience: string): number {
    const baseCount =
      GOAL_SETS_MATRIX[goal as keyof typeof GOAL_SETS_MATRIX] || 3;
    return ExperienceUtils.getSetModifier(experience, baseCount);
  }

  /**
   * חישוב חזרות ומשקל - משתמש במטריצות מרכזיות
   * Calculate reps and weight - uses centralized matrices
   */
  private static getRepsAndWeight(
    template: Exercise,
    goal: string,
    experience: string
  ): { reps: number; weight: number } {
    const reps = GOAL_REPS_MATRIX[goal as keyof typeof GOAL_REPS_MATRIX] || 12;

    // משקל לפי תרגיל וניסיון - משתמש במטריצה מרכזית
    if (template.equipment === "bodyweight") return { reps, weight: 0 }; // 🏠 תרגילי גוף

    const expLevel = ExperienceUtils.toHebrewLevel(experience);
    const baseWeight = EXERCISE_WEIGHTS_MATRIX[template.id]?.[expLevel] || 10;

    // מודפקטור מטרה - משתמש בקונסטנט מרכזי
    const modifier =
      GOAL_WEIGHT_MODIFIERS[goal as keyof typeof GOAL_WEIGHT_MODIFIERS] || 1;
    const weight = Math.round(baseWeight * modifier);

    return { reps, weight };
  }

  /**
   * חישוב זמן מנוחה - משתמש במטריצות מרכזיות
   * Calculate rest time - uses centralized matrices
   */
  private static calculateRestTime(goal: string, difficulty: string): number {
    const rest =
      GOAL_REST_TIMES_MATRIX[goal as keyof typeof GOAL_REST_TIMES_MATRIX] || 60;
    const modifier =
      DIFFICULTY_REST_MODIFIERS[
        difficulty as keyof typeof DIFFICULTY_REST_MODIFIERS
      ] || 1;
    return Math.round(rest * modifier);
  }

  // פונקציות עזר לבחירת תרגילים - מעודכנות לטיפוס החדש

  /**
   * בחירת תרגילים מורכבים (מערבים קבוצות שרירים רבות) - מעודכן לטיפוס החדש
   */
  private static selectCompoundExercises(
    exercises: Exercise[],
    count: number
  ): Exercise[] {
    return this.filterAndSelect(
      exercises,
      (ex) =>
        ex.primaryMuscles.length > 1 ||
        !!(ex.secondaryMuscles && ex.secondaryMuscles.length > 0),
      count
    );
  }

  /**
   * בחירת תרגילים לבניית שריר (מגוון קבוצות שרירים) - מעודכן לטיפוס החדש
   */
  private static selectMuscleBuilding(
    exercises: Exercise[],
    count: number
  ): Exercise[] {
    const groups = this.groupByCategory(exercises);
    const selected: Exercise[] = [];

    // בחר לפחות תרגיל אחד מכל קבוצת שרירים
    Object.values(groups).forEach((group) => {
      if (selected.length < count && group.length > 0) {
        selected.push(group[Math.floor(Math.random() * group.length)]);
      }
    });

    // השלם את המספר הנדרש
    return this.fillRemaining(selected, exercises, count);
  }

  /**
   * בחירת תרגילי כוח (העדפה למוט) - מעודכן לטיפוס החדש
   */
  private static selectStrengthExercises(
    exercises: Exercise[],
    count: number
  ): Exercise[] {
    return this.prioritizeByEquipment(exercises, "barbell", count);
  }

  /**
   * בחירת תרגילי סיבולת (העדפה למשקל גוף אבל כולל ציוד) - מעודכן לטיפוס החדש
   * @deprecated Functionality overlaps with WorkoutDataService
   */
  private static selectEnduranceExercises(
    exercises: Exercise[],
    count: number
  ): Exercise[] {
    // ✅ FIX: Don't force "none" equipment - use balanced selection for endurance
    return this.selectBalancedExercises(exercises, count);
  }

  /**
   * בחירת תרגילים מאוזנים (מקטגוריות שונות) - מעודכן לטיפוס החדש
   */
  private static selectBalancedExercises(
    exercises: Exercise[],
    count: number
  ): Exercise[] {
    const groups = this.groupByCategory(exercises);
    const selected: Exercise[] = [];
    const categories = Object.keys(groups);

    // בחר תרגילים מקטגוריות שונות בסיבוב
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

  // פונקציות עזר כלליות - מעודכנות לטיפוס החדש

  /**
   * סינון ובחירה לפי תנאי - מעודכן לטיפוס החדש
   */
  private static filterAndSelect(
    exercises: Exercise[],
    condition: (ex: Exercise) => boolean,
    count: number
  ): Exercise[] {
    const filtered = exercises.filter(condition);
    return this.shuffleAndTake(filtered, count);
  }

  /**
   * השלמת מספר תרגילים נדרש - מעודכן לטיפוס החדש
   */
  private static fillRemaining(
    selected: Exercise[],
    allExercises: Exercise[],
    targetCount: number
  ): Exercise[] {
    while (
      selected.length < targetCount &&
      allExercises.length > selected.length
    ) {
      const remaining = allExercises.filter((ex) => !selected.includes(ex));
      if (remaining.length > 0) {
        selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
      } else {
        break;
      }
    }
    return selected;
  }

  /**
   * בחירה עם עדיפות לציוד מסוים - מעודכן לטיפוס החדש
   */
  private static prioritizeByEquipment(
    exercises: Exercise[],
    preferredEquipment: string,
    count: number
  ): Exercise[] {
    const preferred = exercises.filter(
      (ex) => ex.equipment === preferredEquipment
    );
    const others = exercises.filter(
      (ex) => ex.equipment !== preferredEquipment
    );

    const selected = [
      ...preferred.slice(0, Math.min(count - 1, preferred.length)),
    ];
    const remaining = count - selected.length;

    if (remaining > 0) {
      selected.push(...this.shuffleAndTake(others, remaining));
    }

    return selected;
  }

  private static groupByCategory(exercises: Exercise[]): {
    [category: string]: Exercise[];
  } {
    return exercises.reduce(
      (groups, ex) => {
        if (!groups[ex.category]) groups[ex.category] = [];
        groups[ex.category].push(ex);
        return groups;
      },
      {} as { [category: string]: Exercise[] }
    );
  }

  private static shuffleAndTake<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

// יצוא פונקציה נוחה
// Convenience export function
// @deprecated Use WorkoutDataService.generateAIWorkoutPlan() for better results
export async function generateQuickWorkout(): Promise<WorkoutExercise[]> {
  return QuickWorkoutGenerator.generateQuickWorkout();
}
