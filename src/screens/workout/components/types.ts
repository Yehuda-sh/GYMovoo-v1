/**
 * @file src/screens/workout/components/types.ts
 * @description טיפוסי Props לכל הקומפוננטות של מסך האימון - עודכן לינואר 2025
 * English: Props types for all workout screen components - Updated January 2025
 * @updated 2025-01-31 - עדכון לפי המימושים הנוכחיים של הקומפוננטות
 */

import {
  Exercise,
  Set,
  WorkoutData,
  PersonalRecord,
} from "../types/workout.types";

// Common Types למניעת חזרה
export type WorkoutVariant =
  | "default"
  | "minimal"
  | "gradient"
  | "integrated"
  | "compact"
  | "bar"
  | "floating"
  | "pills";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "minimal";

// Last Workout Type
export interface LastWorkout {
  date: string;
  bestSet: { weight: number; reps: number };
  totalVolume?: number;
  notes?: string;
}

// WorkoutHeader Props - עדכון עם טיפוסים משופרים
export interface WorkoutHeaderProps {
  workoutName: string;
  elapsedTime: string;
  onTimerPress: () => void;
  onNamePress: () => void;
  onMenuPress?: () => void;
  variant?: WorkoutVariant;
  // Props לסגנון integrated
  completedSets?: number;
  totalSets?: number;
  totalVolume?: number;
  personalRecords?: number;
}

// WorkoutDashboard Props - עדכון עם טיפוסים משופרים
export interface WorkoutDashboardProps {
  totalVolume: number;
  completedSets: number;
  totalSets: number;
  pace: number;
  personalRecords: number;
  elapsedTime?: string;
  variant?: WorkoutVariant;
  className?: string;
}

// RestTimer Props - עדכון לפי המימוש הנוכחי
export interface RestTimerProps {
  timeLeft: number;
  progress: number; // A value between 0 and 1
  isPaused: boolean;
  nextExercise?: Exercise | null;
  onPause: () => void;
  onSkip: () => void;
  onAddTime: (seconds: number) => void;
  onSubtractTime: (seconds: number) => void;
}

// ExerciseCard Props - עדכון עם טיפוסים חדשים
export interface ExerciseCardProps {
  exercise: Exercise;
  sets: Set[];
  onUpdateSet: (setId: string, updates: Partial<Set>) => void;
  onAddSet: () => void;
  onDeleteSet?: (setId: string) => void;
  onCompleteSet: (setId: string) => void;
  onRemoveExercise: () => void;
  onStartRest?: (duration: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onShowTips?: () => void;
  onTitlePress?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isPaused?: boolean;
  showHistory?: boolean;
  showNotes?: boolean;
  personalRecord?: PersonalRecord;
  lastWorkout?: LastWorkout;
  onDuplicate?: () => void;
  onReplace?: () => void;
}

// SetRow Props - עדכון לפי המימוש הנוכחי
export interface SetRowProps {
  set: ExtendedSet;
  setNumber: number;
  onUpdate: (updates: Partial<ExtendedSet>) => void;
  onDelete: () => void;
  onComplete: () => void;
  onLongPress: () => void;
  isActive?: boolean;
  exercise: Exercise;
}

// Extended Set interface עם שדות נוספים לממשק המשתמש
export interface ExtendedSet extends Set {
  previousWeight?: number;
  previousReps?: number;
}

// ExerciseMenu Props - עדכון לפי המימוש הנוכחי + תמיכה במצב עריכה
export interface ExerciseMenuProps {
  visible: boolean;
  onClose: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReplace?: () => void;
  onAddSet?: () => void; // הוספת סט
  onDeleteLastSet?: () => void; // מחיקת סט אחרון
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  hasLastSet?: boolean; // האם יש סט אחרון למחיקה
  isEditMode?: boolean; // מצבעריכה - משפיע על הצגת התפריט
  // Batch mode props
  isBatchMode?: boolean;
  selectedExercises?: string[];
  onBatchDelete?: () => void;
  onBatchMove?: (direction: "up" | "down") => void;
}

// NextExerciseBar Props - עדכון עם טיפוסים משופרים
export interface NextExerciseBarProps {
  nextExercise: Exercise | null;
  onSkipToNext?: () => void;
  variant?: WorkoutVariant;
}

// WorkoutStatusBar Props - עדכון עם טיפוסים משופרים
export interface WorkoutStatusBarProps {
  // Rest Timer Props
  isRestActive: boolean;
  restTimeLeft?: number;
  onAddRestTime?: (seconds: number) => void;
  onSubtractRestTime?: (seconds: number) => void;
  onSkipRest?: () => void;

  // Next Exercise Props
  nextExercise?: Exercise | null;
  onSkipToNext?: () => void;

  // Common Props
  variant?: WorkoutVariant;
}

// WorkoutSummary Props - עדכון לפי המימוש הנוכחי
export interface WorkoutSummaryProps {
  workout: WorkoutData;
  onClose: () => void;
  onSave: () => void;
}

// PlateCalculatorModal Props
export interface PlateCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeight?: number;
}

// ExerciseTipsModal Props
export interface ExerciseTipsModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseName: string;
  exercise?: Exercise;
}

// Additional Types למניעת חזרה
export interface WorkoutStats {
  totalSets: number;
  completedSets: number;
  totalVolume: number;
  totalReps: number;
  personalRecords: number;
  duration?: number;
}

export interface TimerState {
  isActive: boolean;
  timeLeft: number;
  progress: number;
  isPaused: boolean;
}

export interface WorkoutSettings {
  autoRest: boolean;
  restTimerDuration: number;
  showNotes: boolean;
  showHistory: boolean;
  vibrationEnabled: boolean;
}
