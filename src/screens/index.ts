// Navigation core screens
export { default as MainScreen } from "./main/MainScreen";
export { default as WorkoutPlansScreen } from "../features/workout/screens/workout_screens/WorkoutPlansScreen";
export { default as HistoryScreen } from "./history/HistoryScreen";
export { default as ProfileScreen } from "../features/profile/screens/ProfileScreen";
export { default as ActiveWorkoutScreen } from "../features/workout/screens/workout_screens/ActiveWorkoutScreen";

// Authentication & onboarding screens
export { default as WelcomeScreen } from "./welcome/WelcomeScreen";
// Note: RegisterScreen moved to features/auth/screens/ and is exported from features/auth/index.ts
