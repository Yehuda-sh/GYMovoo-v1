/**
 * @file src/screens/workout/components/types.ts
 * @description טיפוסי Props לכל הקומפוננטות של מסך האימון
 * English: Props types for all workout screen components
 */

import { Exercise, Set, WorkoutData } from "../types/workout.types";

// WorkoutHeader Props
export interface WorkoutHeaderProps {
  workoutName: string;
  elapsedTime: string;
  onEditName: () => void;
  onToggleDashboard: () => void;
}

// WorkoutDashboard Props
export interface WorkoutDashboardProps {
  stats: {
    totalSets: number;
    completedSets: number;
    totalVolume: number;
    totalReps: number;
    currentPace: number;
    expectedDuration: number;
  };
  currentPace: number;
}

// RestTimer Props
export interface RestTimerProps {
  timeRemaining: number;
  exerciseName: string;
  onSkip: () => void;
  onPause: () => void;
  onResume: () => void;
}

// ExerciseCard Props
export interface ExerciseCardProps {
  exercise: Exercise;
  exerciseIndex: number;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onStartRest: (duration: number) => void;
  onOpenPlateCalculator: (weight: number) => void;
  onOpenTips: () => void;
}

// SetRow Props
export interface SetRowProps {
  set: Set;
  setIndex: number;
  exerciseName: string;
  onUpdateSet: (updatedSet: Set) => void;
  onStartRest: (duration: number) => void;
  isLastSet: boolean;
}

// ExerciseMenu Props
export interface ExerciseMenuProps {
  visible: boolean;
  onClose: () => void;
  onReplaceExercise: () => void;
  onViewHistory: () => void;
  onAddNote: () => void;
  onSkipExercise: () => void;
}

// NextExerciseBar Props
export interface NextExerciseBarProps {
  exerciseName: string;
  muscleGroup: string;
}

// WorkoutSummary Props
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
}
