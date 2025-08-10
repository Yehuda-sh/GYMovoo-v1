/**
 * @file src/screens/workout/types/workout.types.ts
 * @description טיפוסים עבור מסך האימון - מעודכן לינואר 2025
 * English: Types for workout screen - Updated January 2025
 * @updated 2025-01-31 - הוספת interfaces חדשים מ-TypeScript Cleanup
 */

// סט בודד
// Single set
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

// תרגיל
// Exercise
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

// נתוני אימון מלאים
// Complete workout data
export interface WorkoutData {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
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
  createdAt: string;
  updatedAt: string;
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

// נתוני התקדמות
// Progress data
export interface ProgressData {
  date: string;
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
  date: string;
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
  lastSaved: string;
  version: number;
}

// === TypeScript Cleanup Interfaces (ינואר 2025) ===
// === TypeScript Cleanup Interfaces (January 2025) ===

// סטטיסטיקות אימון מקיפות
// Comprehensive workout statistics
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
    completedAt: string; // ISO string
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
  startTime?: string; // זמן התחלת האימון
  endTime?: string; // זמן סיום האימון
  actualStartTime?: string; // זמן התחלה אמיתי (יכול להיות שונה מהמתוכנן)
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

// ביצועים קודמים לתצוגה באימון הבא
// Previous performance for display in next workout
export interface PreviousPerformance {
  exerciseName: string;
  sets: Array<{
    weight: number;
    reps: number;
  }>;
  date: string;
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
  date: string;
  improvement: number; // שיפור באחוזים או בערך מוחלט
}

// נתוני אימון היסטוריים
// Historical workout data
export interface WorkoutHistoryItem {
  id: string;
  type?: string;
  workoutName?: string;
  date?: string;
  completedAt?: string;
  startTime?: string;
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
