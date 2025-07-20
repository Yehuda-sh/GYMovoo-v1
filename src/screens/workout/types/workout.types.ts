/**
 * @file src/screens/workout/types/workout.types.ts
 * @description טייפים מרכזיים למערכת האימון
 * English: Core types for workout system
 */

// טייפ בסיסי של סט
// Basic set type
export interface WorkoutSet {
  id: string;
  weight: string;
  reps: string;
  completed: boolean;
  type: "normal" | "warmup" | "dropset" | "failure";
  previousWeight?: string;
  previousReps?: string;
  rpe?: number; // Rating of Perceived Exertion (1-10)
  rir?: number; // Reps in Reserve
  isPR?: boolean;
  notes?: string;
  restTime?: number; // זמן מנוחה ספציפי לסט
}

// טייפ תרגיל באימון
// Exercise in workout type
export interface WorkoutExercise {
  id: string;
  exerciseId: string; // מזהה מתוך מאגר התרגילים
  name: string;
  muscle: string;
  sets: WorkoutSet[];
  restTime: number; // זמן מנוחה דיפולטיבי
  notes?: string;
  targetVolume?: number;
  currentVolume: number;
  lastWorkoutVolume?: number;
  personalRecord?: {
    weight: number;
    reps: number;
    date: string;
  };
  videoUrl?: string;
  thumbnailUrl?: string;
  order: number; // מיקום בסדר התרגילים
  supersetWith?: string[]; // מזהי תרגילים בסופרסט
  isSuperset?: boolean;
  technique?: string; // הוראות ביצוע
}

// טייפ אימון מלא
// Complete workout type
export interface Workout {
  id: string;
  name: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: number; // בשניות
  exercises: WorkoutExercise[];
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  caloriesBurned?: number;
  notes?: string;
  isCompleted: boolean;
  isDraft?: boolean;
  lastSaved?: string;
}

// סטטיסטיקות אימון
// Workout statistics
export interface WorkoutStats {
  totalVolume: number;
  totalSets: number;
  completedSets: number;
  totalReps: number;
  duration: string;
  averageRestTime: number;
  personalRecords: number;
  musclesWorked: string[];
  intensity: "low" | "medium" | "high";
  pace: number; // סטים לדקה
  estimatedCalories: number;
}

// הגדרות טיימר מנוחה
// Rest timer settings
export interface RestTimerSettings {
  defaultRestTime: number;
  autoStart: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  countdownAt: number; // התחל ספירה לאחור ב-X שניות
  countdownSound: "beep" | "tick" | "voice";
}

// מצב סופרסט
// Superset mode
export type SupersetMode =
  | "normal"
  | "superset"
  | "dropset"
  | "giantset"
  | "circuit";

// אנימציות סיכום
// Summary animations
export interface SummaryAnimation {
  type: "confetti" | "fireworks" | "fire" | "stars";
  duration: number;
  intensity: number;
}

// טייפ לשמירה אוטומטית
// Auto-save type
export interface WorkoutDraft {
  workout: Workout;
  lastSaved: string;
  deviceId?: string;
  version: number;
}
