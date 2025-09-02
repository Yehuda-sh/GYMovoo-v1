/**
 * @file src/screens/workout/components/types.ts
 * @description טיפוסי Props לכל הקומפוננטות של מסך האימון - קובץ מרכזי קריטי לארכיטקטורה
 * @description English: Props types for all workout screen components - Critical central architecture file
 *
 * ✅ ACTIVE & CRITICAL-ARCHITECTURE: קובץ טיפוסים מרכזי וקריטי לכל המערכת
 * - Central TypeScript definitions for all workout components
 * - Advanced variant system with Extract types for type safety
 * - Comprehensive interface definitions for component props
 * - Clean separation of concerns between different component types
 * - Production-ready with detailed documentation
 * - Updated for September 2025 with all current implementations
 *
 * @architecture
 * - WorkoutVariant: מערכת variants גלובלית עם Extract types
 * - Component-specific types: טיפוסים מותאמים לכל רכיב
 * - Extended interfaces: הרחבות לממשק המשתמש
 * - Common patterns: טיפוסים משותפים למניעת חזרה
 * - Type safety: מניעת שימוש בערכים לא נתמכים
 *
 * @components
 * - WorkoutHeader: 4 variants (default, minimal, gradient, integrated)
 * - WorkoutDashboard: 4 variants (default, compact, floating, bar)
 * - NextExerciseBar: 4 variants (gradient, minimal, floating, pills)
 * - WorkoutStatusBar: 4 variants (default, minimal, floating, compact)
 * - ExerciseCard: רכיב מרכזי עם הרבה props
 * - SetRow: שורת סט עם Extended interface
 * - ExerciseMenu: תפריט עם תמיכה ב-batch mode
 * - WorkoutSummary: סיכום אימון
 * - PlateCalculatorModal: מחשבון פלטות
 *
 * @type_safety
 * - Extract types למניעת שימוש בערכים לא נתמכים
 * - Strict interface definitions עם optional props ברורים
 * - Common types למניעת חזרה על קוד
 * - Extended interfaces עם backward compatibility
 *
 * @updated 2025-09-02 Enhanced documentation and fixed type inconsistencies
 */

import {
  WorkoutData,
  WorkoutExercise,
  Set as WorkoutSet,
} from "../types/workout.types";

// 📝 Type Mapping Notes - הערות על מיפוי טיפוסים
// WorkoutExercise replaces Exercise for workout-specific implementations
// WorkoutSet replaces Set for consistent typing across workout components
// PersonalRecord is defined inline where needed for specific use cases
// LastWorkout is defined inline for component-specific requirements

// Common Types למניעת חזרה על קוד ושיפור type safety
/**
 * רשימת כל ה-variants הגלובליים עם Extract types לבטיחות טיפוסים
 * Global superset of workout visual variants with Extract types for type safety.
 *
 * @deprecated "pills" variant is used only in NextExerciseBar and planned for removal
 * ✅ NOTE: "pills" משמש כרגע רק ב-NextExerciseBar ומתוכנן להסרה עתידית
 */
export type WorkoutVariant =
  | "default"
  | "minimal"
  | "gradient"
  | "integrated" // Header בלבד כרגע
  | "floating" // StatusBar, Dashboard, NextExerciseBar
  | "pills" // NEXT_EXERCISE_BAR ONLY (deprecated candidate)
  | "compact" // StatusBar + Dashboard (timer size logic)
  | "bar"; // Dashboard בלבד

// טיפוסים מצומצמים לכל קומפוננטה – מונעים שימוש בערכים לא נתמכים עם type safety
export type WorkoutHeaderVariant = Extract<
  WorkoutVariant,
  "default" | "minimal" | "gradient" | "integrated"
>;
export type WorkoutDashboardVariant = Extract<
  WorkoutVariant,
  "default" | "compact" | "floating" | "bar"
>;
export type NextExerciseBarVariant = Extract<
  WorkoutVariant,
  "gradient" | "minimal" | "floating" | "pills"
>;
export type WorkoutStatusBarVariant = Extract<
  WorkoutVariant,
  "default" | "minimal" | "floating" | "compact"
>;

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "minimal";

// 📊 Last Workout Type - טיפוס עצמאי שלא נמצא בשימוש נוכחי
// @deprecated This type is defined but not currently used. Consider removal or implementation.
export interface LastWorkout {
  date: string;
  bestSet: { weight: number; reps: number };
  totalVolume?: number;
  notes?: string;
}

// WorkoutHeader Props - עדכון עם טיפוסים משופרים ו-4 variants
export interface WorkoutHeaderProps {
  workoutName: string;
  elapsedTime: string;
  onTimerPress: () => void;
  onNamePress: () => void;
  onMenuPress?: () => void;
  variant?: WorkoutHeaderVariant;
  // Props לסגנון integrated עם סטטיסטיקות מלאות
  completedSets?: number;
  totalSets?: number;
  totalVolume?: number;
  personalRecords?: number;
}

// WorkoutDashboard Props - עדכון עם טיפוסים משופרים ו-4 variants
export interface WorkoutDashboardProps {
  totalVolume: number;
  completedSets: number;
  totalSets: number;
  pace: number;
  personalRecords: number;
  elapsedTime?: string;
  variant?: WorkoutDashboardVariant;
  onHide?: () => void; // פונקציה להעלמת הדשבורד עם CloseButton | Function to hide dashboard with CloseButton
  isEditMode?: boolean; // מצב עריכה משפיע על אייקונים | Edit mode affects icons
}

// ExerciseCard Props - עדכון מדויק לפי המימוש הנוכחי ב-ExerciseCard/index.tsx
export interface ExerciseCardProps {
  exercise: WorkoutExercise;
  sets: WorkoutSet[];
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
  onAddSet: () => void;
  onDeleteSet?: (setId: string) => void;
  onCompleteSet: (setId: string, isCompleting?: boolean) => void; // הוספת פרמטר אופציונלי
  onRemoveExercise: () => void;
  onStartRest?: (duration: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  // onShowTips?: () => void; // מוסר - הפונקציה לא משמשת עוד
  onTitlePress?: () => void; // עבור מעבר לתרגיל יחיד
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
  // פונקציה להזזת סטים - אופציונלי לעתיד
  onReorderSets?: (fromIndex: number, toIndex: number) => void;
}

// SetRow Props - עדכון לפי המימוש הנוכחי עם WorkoutSet
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

// Extended Set interface עם שדות נוספים לממשק המשתמש - מבוסס על WorkoutSet
export interface ExtendedSet extends WorkoutSet {
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

// NextExerciseBar Props - עדכון עם טיפוסים משופרים ו-4 variants
export interface NextExerciseBarProps {
  nextExercise: WorkoutExercise | null;
  onSkipToNext?: () => void;
  variant?: NextExerciseBarVariant;
}

// WorkoutStatusBar Props - עדכון עם טיפוסים משופרים ו-4 variants
export interface WorkoutStatusBarProps {
  // Rest Timer Props עם כפתורי התאמת זמן
  isRestActive: boolean;
  restTimeLeft?: number;
  onAddRestTime?: (seconds: number) => void;
  onSubtractRestTime?: (seconds: number) => void;
  onSkipRest?: () => void;

  // Next Exercise Props עם אפשרות דילוג
  nextExercise?: WorkoutExercise | null;
  onSkipToNext?: () => void;

  // Common Props עם variants מתקדמים
  variant?: WorkoutStatusBarVariant;
}

// WorkoutSummary Props - עדכון לפי המימוש הנוכחי עם visible prop
export interface WorkoutSummaryProps {
  workout: WorkoutData;
  onClose: () => void;
  onSave: () => void;
  visible: boolean; // Missing in original definition - required for modal visibility
}

// PlateCalculatorModal Props
export interface PlateCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeight?: number;
}

// Additional Types למניעת חזרה על קוד והגדרות משותפות
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
