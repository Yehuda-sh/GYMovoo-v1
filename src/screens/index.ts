// src/screens/index.ts
/**
 * @file src/screens/index.ts
 * @description ייצוא מרכזי של מסכי האפליקציה
 */

// --- Core / Main Tabs ---
export { default as MainScreen } from "./main/MainScreen";
export { default as WorkoutPlansScreen } from "../features/workout/screens/workout_screens/WorkoutPlansScreen";
export { default as HistoryScreen } from "./history/HistoryScreen";
export { default as ProfileScreen } from "../features/profile/screens/ProfileScreen";

// --- Workout Flow ---
export { default as ActiveWorkoutScreen } from "../features/workout/screens/workout_screens/ActiveWorkoutScreen";
export { default as WorkoutSummaryScreen } from "../features/workout/screens/workout_screens/WorkoutSummaryScreen";

// --- Exercises ---
export { default as ExercisesScreen } from "./exercises/ExercisesScreen";
export { default as ExerciseDetailsScreen } from "./exercises/ExerciseDetailsScreen";

// --- Profile / Personal Info ---
export { PersonalInfoScreen } from "../features/profile/screens/PersonalInfoScreen";

// --- Auth & Onboarding ---
export { default as WelcomeScreen } from "./welcome/WelcomeScreen";

// (אופציונלי, רק לפיתוח)
// export { default as DeveloperScreen } from "./developer/DeveloperScreen";
