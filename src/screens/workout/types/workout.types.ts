/**
 * @file src/screens/workout/types/workout.types.ts
 * @description טיפוסים עבור מסך האימון
 * English: Types for workout screen
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
}

// תרגיל
// Exercise
export interface Exercise {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string;
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
  equipment: string[];
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
