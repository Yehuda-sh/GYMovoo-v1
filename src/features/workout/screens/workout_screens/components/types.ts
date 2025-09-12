/**
 * @file src/screens/workout/components/types.ts
 * @description TypeScript interfaces for workout screen components
 *
 * Core types for workout components including props interfaces,
 * variant definitions, and shared types for type safety.
 */

import {
  WorkoutExercise,
  Set as WorkoutSet,
} from "../../../../../core/types/workout.types";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "minimal";

// WorkoutHeader Props
export interface WorkoutHeaderProps {
  workoutName: string;
  elapsedTime: string;
  onTimerPress: () => void;
  onNamePress: () => void;
  onMenuPress?: () => void;
  completedSets?: number;
  totalSets?: number;
  totalVolume?: number;
  personalRecords?: number;
}

// WorkoutDashboard Props
export interface WorkoutDashboardProps {
  totalVolume: number;
  completedSets: number;
  totalSets: number;
  pace: number;
  personalRecords: number;
  elapsedTime?: string;
  onHide?: () => void;
  isEditMode?: boolean;
}

// ExerciseCard Props
export interface ExerciseCardProps {
  exercise: WorkoutExercise;
  sets: WorkoutSet[];
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
  onAddSet: () => void;
  onDeleteSet?: (setId: string) => void;
  onCompleteSet: (setId: string, isCompleting?: boolean) => void;
  onRemoveExercise: () => void;
  onStartRest?: (duration: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onTitlePress?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isPaused?: boolean;
  showHistory?: boolean;
  showNotes?: boolean;
  personalRecord?: { weight: number; reps: number };
  lastWorkout?: {
    date: string;
    bestSet: { weight: number; reps: number };
  };
  onDuplicate?: () => void;
  onReplace?: () => void;
}

// SetRow Props
export interface SetRowProps {
  set: ExtendedSet;
  setNumber: number;
  onUpdate: (updates: Partial<ExtendedSet>) => void;
  onDelete: () => void;
  onComplete: () => void;
  onLongPress: () => void;
  isActive?: boolean;
  exercise: WorkoutExercise;
}

// Extended Set interface
export interface ExtendedSet extends WorkoutSet {
  previousWeight?: number;
  previousReps?: number;
}

// ExerciseMenu Props
export interface ExerciseMenuProps {
  visible: boolean;
  onClose: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReplace?: () => void;
  onAddSet?: () => void;
  onDeleteLastSet?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  hasLastSet?: boolean;
  isEditMode?: boolean;
  isBatchMode?: boolean;
  selectedExercises?: string[];
  onBatchDelete?: () => void;
  onBatchMove?: (direction: "up" | "down") => void;
}

// Additional shared types
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
