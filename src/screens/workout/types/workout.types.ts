/**
 * @file src/screens/workout/types/workout.types.ts
 * @description טיפוסים עבור מסך האימון - מעודכן לינואר 2025
 * @description English: Types for workout screen - Updated January 2025
 * @updated 2025-01-17 Enhanced documentation for audit completion
 *
 * ✅ CORE & CRITICAL: קובץ טיפוסים מרכזי בשימוש נרחב
 * - 20+ files: Services, components, screens מייבאים מכאן
 * - src/types/index.ts: מייצא הכל מקובץ זה כנקודה מרכזית
 * - DataManager, WorkoutHistoryService: תלויים בטיפוסים אלה
 * - All workout components: משתמשים בממשקים המוגדרים כאן
 *
 * @architecture Core type definitions for entire workout system
 * @exports 15+ interfaces covering all workout-related data structures
 * @usage Foundation types used across services, components, and screens
 * @performance Type-only imports ensure no runtime overhead
 *
 * @interfaces
 * - Set, Exercise, WorkoutData: Core workout building blocks
 * - WorkoutPlan, WorkoutTemplate: Workout planning and templates
 * - WorkoutWithFeedback: Complete workout with user feedback
 * - WorkoutStatistics: Comprehensive analytics data
 * - PersonalRecord, ProgressData: Performance tracking
 */

// === סוגי עזר כלליים ===
// === General helper types ===
export type ISODateString = string; // מייצג מחרוזת תאריך בפורמט ISO (לשקיפות קריאה בלבד)

// === CORE WORKOUT BUILDING BLOCKS ===
// === אבני יסוד לבניית אימונים ===

// סט בודד - יחידת העבודה הבסיסית באימון
// Single set - basic work unit in workout
export interface Set {
  id: string;
  type: "warmup" | "working" | "dropset" | "failure";
  targetReps: number;
  targetWeight: number;
  actualReps?: number; // הוספת שדה חסר
  actualWeight?: number; // הוספת שדה חסר
  completed: boolean;
  restTime?: number; // זמן מנוחה אחרי הסט
  notes?: string;
  isPR?: boolean; // האם זה שיא אישי
  rpe?: number; // Rate of Perceived Exertion (1-10)
  timeToComplete?: number; // Time to complete the set in seconds
}

// תרגיל - אוסף של סטים עם מטא-דאטה
// Exercise - collection of sets with metadata
export interface Exercise {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string; // Can be "none" for bodyweight exercises, or specific equipment like "dumbbells", "barbell", etc.
  sets: Set[];
  restTime?: number; // זמן מנוחה ברירת מחדל בין סטים
  notes?: string;
  videoUrl?: string;
  imageUrl?: string;
  instructions?: string[];
  tips?: string[];
}

// === WORKOUT MANAGEMENT & PLANNING ===
// === ניהול ותכנון אימונים ===

// נתוני אימון מלאים - האימון שהמשתמש מבצע
// Complete workout data - the workout user performs
export interface WorkoutData {
  id: string;
  name: string;
  startTime: ISODateString;
  endTime?: ISODateString;
  duration: number; // בשניות
  exercises: Exercise[];
  totalVolume: number;
  totalSets?: number;
  completedSets?: number;
  caloriesBurned?: number;
  notes?: string;
  rating?: number; // 1-5
  location?: string;
  weather?: string;
  mood?: "great" | "good" | "okay" | "tired" | "bad";
}

// תוכנית אימון
// Workout plan
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // משך משוער בדקות
  frequency: number; // פעמים בשבוע
  workouts: WorkoutTemplate[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  tags?: string[];
}

// תבנית אימון
// Workout template
export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: ExerciseTemplate[];
  estimatedDuration: number;
  targetMuscles: string[];
  equipment: string[]; // Array of equipment needed, can include "none" for bodyweight workouts
}

// תבנית תרגיל
// Exercise template
export interface ExerciseTemplate {
  exerciseId: string;
  sets: number;
  reps: string; // יכול להיות טווח כמו "8-12"
  restTime: number;
  notes?: string;
}

// === PROGRESS TRACKING & ANALYTICS ===
// === מעקב התקדמות וניתוחים ===

// נתוני התקדמות פיזית
// Physical progress data
export interface ProgressData {
  date: ISODateString;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    bicep?: number;
    thigh?: number;
  };
  photos?: string[];
  notes?: string;
}

// נתוני ביצועים
// Performance data
export interface PerformanceData {
  exerciseId: string;
  exerciseName: string;
  history: PerformanceEntry[];
}

// רשומת ביצוע
// Performance entry
export interface PerformanceEntry {
  date: ISODateString;
  sets: Set[];
  totalVolume: number;
  maxWeight: number;
  maxReps: number;
  notes?: string;
}

// מצב שמירה
// Save state
export interface WorkoutDraft {
  workout: WorkoutData;
  lastSaved: ISODateString;
  version: number;
}

// === ENHANCED ANALYTICS & FEEDBACK (TypeScript Cleanup 2025) ===
// === ניתוחים מתקדמים ומשוב משופר (ניקוי TypeScript 2025) ===

// סטטיסטיקות אימון מקיפות עם חלוקה לפי מגדר
// Comprehensive workout statistics with gender breakdown
export interface WorkoutStatistics {
  total: {
    totalWorkouts: number;
    totalDuration: number;
    averageDifficulty: number;
    workoutStreak: number;
  };
  byGender: {
    male: {
      count: number;
      averageDifficulty: number;
    };
    female: {
      count: number;
      averageDifficulty: number;
    };
    other: {
      count: number;
      averageDifficulty: number;
    };
  };
}

// אימון עם משוב ומטא-דאטה מורחבת
// Workout with feedback and extended metadata
export interface WorkoutWithFeedback {
  id: string;
  workout: WorkoutData;
  feedback: {
    difficulty: number; // 1-5 stars
    feeling: string; // emoji value
    readyForMore: boolean | null;
    completedAt: ISODateString; // ISO string
    genderAdaptedNotes?: string; // הערות מותאמות למגדר המשתמש
    congratulationMessage?: string; // הודעת ברכה מותאמת למגדר
  };
  stats: {
    duration: number;
    totalSets: number;
    totalPlannedSets: number;
    totalVolume: number;
    personalRecords: number;
  };
  // זמנים מתקדמים
  startTime?: ISODateString; // זמן התחלת האימון
  endTime?: ISODateString; // זמן סיום האימון
  actualStartTime?: ISODateString; // זמן התחלה אמיתי (יכול להיות שונה מהמתוכנן)
  // מטא-דאטה מורחבת
  metadata?: {
    deviceInfo: {
      platform: string;
      screenWidth: number;
      screenHeight: number;
    };
    userGender?: "male" | "female" | "other";
    version: string;
    workoutSource: "generated" | "manual" | "demo"; // מקור האימון
  };
}

// אליאסים שימושיים לייצוא חוזים בין שירותים
export type WorkoutFeedback = WorkoutWithFeedback["feedback"];
export type WorkoutStats = WorkoutWithFeedback["stats"];

// ביצועים קודמים לתצוגה באימון הבא
// Previous performance for display in next workout
export interface PreviousPerformance {
  exerciseName: string;
  sets: Array<{
    weight: number;
    reps: number;
  }>;
  date: ISODateString;
  // שיאים אישיים
  personalRecords: {
    maxWeight: number; // המשקל הגבוה ביותר שנרשם
    maxVolume: number; // הנפח הגבוה ביותר (משקל × חזרות) בסט יחיד
    maxReps: number; // מספר החזרות הגבוה ביותר
    totalVolume: number; // נפח כולל של כל הסטים באימון זה
  };
}

// שיא אישי
// Personal record
export interface PersonalRecord {
  exerciseName: string;
  type: "weight" | "volume" | "reps"; // סוג השיא
  value: number;
  previousValue: number;
  date: ISODateString;
  improvement: number; // שיפור באחוזים או בערך מוחלט
}

// נתוני אימון היסטוריים
// Historical workout data
export interface WorkoutHistoryItem {
  id: string;
  type?: string;
  workoutName?: string;
  date?: ISODateString;
  completedAt?: ISODateString;
  startTime?: ISODateString;
  duration?: number;
  icon?: string;
  rating?: number;
  feedback?: {
    rating?: number;
  };
  [key: string]: unknown; // Allow additional properties
}

// תשובות שאלון בסיסיות
// Basic questionnaire answers
export interface QuestionnaireBasicData {
  gender: "male" | "female" | "other";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  mainGoals: string[];
  availability: string;
  [key: string]: unknown; // Allow additional properties
}
