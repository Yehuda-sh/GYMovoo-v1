/**
 * @file src/screens/index.ts
 * @brief ייצוא מרכזי לכל המסכים
 * @dependencies All screen components
 * @notes מאפשר ייבוא נוח של מסכים מחוץ לתיקיה
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
export { default as QuickWorkoutScreen } from "./workout/QuickWorkoutScreen";
export { default as WorkoutPlansScreen } from "./workout/WorkoutPlansScreen";

// Exercise screens
export { default as ExerciseDetailsModal } from "./exercise/ExerciseDetailsModal";
export { default as ExerciseListScreen } from "./exercise/ExerciseListScreen";
export { default as MuscleBar } from "./exercise/MuscleBar";

// Exercises screens
export { default as ExercisesScreen } from "./exercises/ExercisesScreen";

// Questionnaire screens
export { default as AgeSelector } from "./questionnaire/AgeSelector";
export { default as DietSelector } from "./questionnaire/DietSelector";
export { default as EquipmentSelector } from "./questionnaire/EquipmentSelector";
export { default as HeightSlider } from "./questionnaire/HeightSlider";
export { default as SmartQuestionnaireScreen } from "./questionnaire/SmartQuestionnaireScreen";
export { default as WeightSlider } from "./questionnaire/WeightSlider";

// History screens
export { default as HistoryScreen } from "./history/HistoryScreen";

// Progress screens
export { default as ProgressScreen } from "./progress/ProgressScreen";

// Notifications screens
export { default as NotificationsScreen } from "./notifications/NotificationsScreen";

// Welcome screens
export { default as WelcomeScreen } from "./welcome/WelcomeScreen";
