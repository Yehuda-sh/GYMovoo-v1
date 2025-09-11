/**
 * טיפוסים מרכזיים לאימונים
 * @file src/core/types/workout.types.ts
 * @description הגדרות טיפוס הקשורות לאימונים והיסטוריית אימונים
 */

/**
 * סט שהושלם של תרגיל
 */
export interface CompletedSet {
  /** משקל (ק"ג) */
  weight?: number;
  /** מספר חזרות */
  reps?: number;
  /** משך זמן (שניות) לסטים מבוססי זמן */
  duration?: number;
  /** האם הסט הושלם */
  completed: boolean;
  /** הערות לסט */
  notes?: string;
}

/**
 * תרגיל שהושלם באימון
 */
export interface CompletedExercise {
  /** מזהה התרגיל */
  exerciseId: string;
  /** שם התרגיל */
  exerciseName: string;
  /** רשימת סטים שבוצעו */
  sets: CompletedSet[];
  /** משך זמן כולל של התרגיל (שניות) */
  duration?: number;
  /** האם זה תרגיל חימום */
  isWarmup?: boolean;
}

/**
 * היסטוריית אימון
 */
export interface WorkoutHistory {
  /** מזהה ייחודי לאימון */
  id: string;
  /** תאריך ביצוע האימון */
  date: Date;
  /** משך זמן כולל (שניות) */
  duration: number;
  /** רשימת תרגילים שבוצעו */
  exercises: CompletedExercise[];
  /** הערות לאימון */
  notes?: string;
  /** דירוג האימון (1-5) */
  rating?: number;
  /** מזהה תוכנית האימון (אם היה חלק מתוכנית) */
  programId?: string;
  /** שם האימון */
  name?: string;
}

/**
 * שיא אישי
 */
export interface PersonalRecord {
  /** מזהה התרגיל */
  exerciseId: string;
  /** שם התרגיל */
  exerciseName: string;
  /** ערך השיא */
  value: number;
  /** תאריך השגת השיא */
  date: Date;
  /** סוג השיא (משקל/חזרות/זמן) */
  type: "weight" | "reps" | "duration";
  /** האם שיא נוכחי */
  isCurrent: boolean;
}

/**
 * סטטיסטיקות אימון מצטברות
 */
export interface TrainingStats {
  /** מספר אימונים כולל */
  totalWorkouts: number;
  /** זמן אימון כולל (שניות) */
  totalTime: number;
  /** תאריך התחלת אימונים */
  startDate: Date;
  /** שיאים אישיים */
  personalRecords: PersonalRecord[];
  /** סטטיסטיקה לפי קבוצות שרירים */
  muscleGroupStats: {
    /** שם קבוצת השרירים */
    muscleGroup: string;
    /** מספר אימונים */
    workoutCount: number;
    /** נפח אימון כולל (משקל * חזרות) */
    totalVolume: number;
  }[];
  /** סטטיסטיקה לפי חודשים */
  monthlyStats: {
    /** חודש ושנה */
    month: string;
    /** מספר אימונים */
    workoutCount: number;
    /** זמן אימון כולל (שניות) */
    totalTime: number;
  }[];
}

/**
 * תבנית תוכנית אימונים
 */
export interface WorkoutTemplate {
  /** מזהה ייחודי לתבנית */
  id: string;
  /** שם התבנית */
  name: string;
  /** תיאור התבנית */
  description: string;
  /** קטגוריית האימון */
  category: string;
  /** רמת קושי */
  difficulty: "beginner" | "intermediate" | "advanced";
  /** זמן משוער (דקות) */
  estimatedTime: number;
  /** האם יצירה אישית */
  isCustom: boolean;
  /** רשימת תרגילים בתבנית */
  exercises: {
    /** מזהה התרגיל */
    exerciseId: string;
    /** שם התרגיל */
    exerciseName: string;
    /** מספר סטים מומלץ */
    sets: number;
    /** טווח חזרות מומלץ */
    repsRange: [number, number];
    /** האם תרגיל חימום */
    isWarmup?: boolean;
    /** הערות לביצוע */
    notes?: string;
  }[];
}
