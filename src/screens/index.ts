/**
 * @file src/screens/index.ts
 * @brief Hub ייצוא מרכזי לכל המסכים - Barrel Export Pattern
 * @brief Central export hub for all screens - Clean import management
 * @dependencies All screen components across the application
 * @notes מאפשר ייבוא נוח ומאורגן של מסכים מחוץ לתיקיה
 * @updated 2025-01-17 Enhanced documentation and organization
 *
 * ✅ ACTIVE BUT UNDERUTILIZED: Hub מוכן לשימוש נרחב
 * - כל המסכים מיוצאים ומוכנים לשימוש
 * - AppNavigator.tsx: יכול להשתמש בייצוא מרכזי
 * - Potential optimization: 18+ import statements יכולים להפוך לאחד
 *
 * @architecture Barrel exports for clean screen imports
 * @usage Ready for centralized screen imports across navigation
 * @pattern Single source of truth for all screen components
 * @optimization Reduces import complexity in navigation files
 */

// Auth screens
export { default as LoginScreen } from "./auth/LoginScreen";
export { default as RegisterScreen } from "./auth/RegisterScreen";
export { default as TermsScreen } from "./auth/TermsScreen";

// Main screens
export { default as MainScreen } from "./main/MainScreen";

// Profile screens
export { default as ProfileScreen } from "./profile/ProfileScreen";

// Workout screens
export { default as ActiveWorkoutScreen } from "./workout/ActiveWorkoutScreen";
export { default as WorkoutPlansScreen } from "./workout/WorkoutPlansScreen";

// Exercise screens
export { default as ExerciseDetailsModal } from "./exercise/ExerciseDetailsModal";
export { default as ExerciseListScreen } from "./exercise/ExerciseListScreen";
export { default as MuscleBar } from "./exercise/MuscleBar";

// Exercises screens
export { default as ExercisesScreen } from "./exercises/ExercisesScreen";

// Questionnaire screens
export { default as UnifiedQuestionnaireScreen } from "./questionnaire/UnifiedQuestionnaireScreen";

// History screens
export { default as HistoryScreen } from "./history/HistoryScreen";

// Progress screens
export { default as ProgressScreen } from "./progress/ProgressScreen";

// Notifications screens
export { default as NotificationsScreen } from "./notifications/NotificationsScreen";

// Welcome screens
export { default as WelcomeScreen } from "./welcome/WelcomeScreen";
