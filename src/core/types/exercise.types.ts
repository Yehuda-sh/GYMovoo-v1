/**
 * טיפוסים מרכזיים לתרגילים
 * @file src/core/types/exercise.types.ts
 * @description הגדרות טיפוס הקשורות לתרגילים
 */

/**
 * קבוצות שרירים
 */
export type MuscleGroup =
  | "chest" // חזה
  | "back" // גב
  | "shoulders" // כתפיים
  | "biceps" // שרירי יד קדמיים
  | "triceps" // שרירי יד אחוריים
  | "legs" // רגליים
  | "abs" // בטן
  | "glutes" // עכוז
  | "calves" // שוקיים
  | "forearms" // אמות
  | "traps" // שרירי הצוואר
  | "cardio" // לב-ריאה
  | "full_body"; // גוף מלא

/**
 * סוגי תרגילים
 */
export type ExerciseType =
  | "strength" // כוח
  | "cardio" // סיבולת לב-ריאה
  | "flexibility" // גמישות
  | "balance" // שיווי משקל
  | "functional"; // תנועתיות פונקציונלית

/**
 * רמות קושי לתרגיל
 */
export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "all";

/**
 * הגדרת תרגיל
 */
export interface Exercise {
  /** מזהה ייחודי */
  id: string;
  /** שם התרגיל */
  name: string;
  /** תיאור התרגיל */
  description: string;
  /** הנחיות לביצוע */
  instructions: string[];
  /** קבוצת שרירים עיקרית */
  primaryMuscle: MuscleGroup;
  /** קבוצות שרירים משניות */
  secondaryMuscles: MuscleGroup[];
  /** סוג התרגיל */
  type: ExerciseType;
  /** רמת קושי */
  difficulty: DifficultyLevel;
  /** ציוד נדרש */
  equipment: string[];
  /** תגיות נוספות */
  tags: string[];
  /** תמונה להמחשה */
  imageUrl?: string;
  /** סרטון הדרכה */
  videoUrl?: string;
  /** האם תרגיל פרימיום */
  isPremium?: boolean;
  /** טיפים לביצוע */
  tips?: string[];
  /** תרגילים חלופיים */
  alternatives?: string[];
}

/**
 * מידע על ווריאציה (גרסה) של תרגיל
 */
export interface ExerciseVariation {
  /** מזהה ייחודי */
  id: string;
  /** מזהה התרגיל המקורי */
  parentExerciseId: string;
  /** שם הווריאציה */
  name: string;
  /** תיאור הווריאציה */
  description: string;
  /** הנחיות מיוחדות */
  instructions?: string[];
  /** ציוד שונה/נוסף */
  equipment?: string[];
  /** רמת קושי */
  difficulty: DifficultyLevel;
  /** הבדל מהתרגיל המקורי */
  differenceFromParent: string;
  /** תמונה להמחשה */
  imageUrl?: string;
}

/**
 * אזורי כאב שתרגיל עלול להשפיע עליהם
 */
export interface ExercisePainArea {
  /** אזור הכאב */
  area: string;
  /** רמת הסיכון */
  riskLevel: "low" | "medium" | "high";
  /** הערות והתאמות */
  adaptations?: string[];
}
