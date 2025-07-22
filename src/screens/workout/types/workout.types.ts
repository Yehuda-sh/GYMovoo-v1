/**
 * @file src/screens/workout/types/workout.types.ts
 * @description טייפים וממשקים למערכת האימונים
 * English: Types and interfaces for workout system
 */

// סוגי סטים
// Set types
export type SetType =
  | "normal"
  | "warmup"
  | "working"
  | "dropset"
  | "failure"
  | "restpause"
  | "rest-pause";

// סט בודד
// Single set
export interface Set {
  id: string;
  reps?: number;
  weight?: number;
  completed: boolean;
  type?: SetType; // שימוש ב-SetType במקום רשימה נפרדת
  rpe?: number; // Rate of Perceived Exertion (1-10)
  rir?: number; // Reps in Reserve
  notes?: string;
  restTime?: number;
  isPersonalRecord?: boolean;
  targetReps?: number;
  targetWeight?: number;
  previousWeight?: number;
  previousReps?: number;
  isPR?: boolean;
  dropFromWeight?: number;
}

// Alias למען תאימות אחורה
// Alias for backward compatibility
export type WorkoutSet = Set;

// תרגיל
// Exercise
export interface Exercise {
  id: string;
  name: string;
  category?: string;
  image?: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment?: string;
  sets: Set[];
  notes?: string;
  restTimeBetweenSets?: number;
  targetVolume?: number;
  currentVolume?: number;
  personalRecord?: {
    weight: number;
    reps: number;
    date?: string;
  };
}

// Alias למען תאימות אחורה
// Alias for backward compatibility
export type WorkoutExercise = Exercise;

// נתוני אימון
// Workout data
export interface WorkoutData {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  exercises: Exercise[];
  notes?: string;
  totalVolume?: number;
  caloriesBurned?: number;
  mood?: number;
  energy?: number;
}

// Alias למען תאימות אחורה
// Alias for backward compatibility
export type Workout = WorkoutData;

// טיוטת אימון לשמירה אוטומטית
// Workout draft for auto-save
export interface WorkoutDraft {
  workout: WorkoutData;
  lastSaved: string;
  deviceId?: string;
  version: number;
}

// שיא אישי
// Personal record
export interface PersonalRecord {
  exerciseName: string;
  type: "weight" | "reps" | "volume" | "time";
  value: number;
  previousValue: number;
  date: string;
  improvement?: number;
}

// תבנית אימון
// Workout template
export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Omit<Exercise, "sets">[];
  tags?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedDuration?: number;
  targetMuscles?: string[];
}

// סטטיסטיקות אימון
// Workout statistics
export interface WorkoutStats {
  totalSets: number;
  completedSets: number;
  totalReps: number;
  totalVolume: number;
  averageRpe?: number;
  personalRecords: number;
  exercisesCompleted: number;
  restTimeTotal: number;
}

// היסטוריית סט
// Set history
export interface SetHistory {
  date: string;
  weight: number;
  reps: number;
  rpe?: number;
  notes?: string;
}

// יעד אימון
// Workout goal
export interface WorkoutGoal {
  type: "volume" | "sets" | "time" | "exercises";
  target: number;
  current: number;
  unit?: string;
}
