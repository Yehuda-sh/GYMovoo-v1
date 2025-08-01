/**
 * @file src/types/index.ts
 * @brief טיפוסים ראשיים לפרויקט GYMovoo
 * @dependencies None
 * @notes יבוא טיפוסים ראשיים מכל החלקים בפרויקט
 */

// טיפוסי ניווט
export * from "../navigation/types";

// טיפוסי אימון
export * from "../screens/workout/types/workout.types";
export * from "../screens/workout/components/types";

// טיפוסים בסיסיים
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  fitnessLevel?: string;
  goals?: string[];
  equipment?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutStatistics {
  totalWorkouts: number;
  totalTime: number;
  averageRating: number;
  personalRecords: Record<string, number>;
  lastWorkoutDate?: Date;
}

export interface QuestionnaireBasicData {
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  fitnessLevel?: string;
  goals?: string[];
  daysPerWeek?: number;
  duration?: string;
  equipment?: string[];
  completedAt?: Date;
}

export interface WorkoutHistoryItem {
  id: string;
  name: string;
  date: Date;
  duration: number;
  exercises: Exercise[];
  rating?: number;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  sets?: ExerciseSet[];
  instructions?: string[];
  tips?: string[];
}

export interface ExerciseSet {
  reps: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  completed?: boolean;
}

export interface QuestionnaireAnswers {
  [questionId: string]: string | string[] | number | boolean;
}
