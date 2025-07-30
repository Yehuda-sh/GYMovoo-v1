// src/components/index.ts

// Common components - נגישים ותומכי RTL
export { default as BackButton } from "./common/BackButton"; // 3 variants, replaces manual back buttons
export { default as DefaultAvatar } from "./common/DefaultAvatar"; // Auto accessibility labels
export { default as LoadingSpinner } from "./common/LoadingSpinner"; // Progress indicator role
export { default as EmptyState } from "./common/EmptyState"; // Full content description
export { default as IconButton } from "./common/IconButton"; // Custom or auto labels
export { default as ConfirmationModal } from "./common/ConfirmationModal"; // RTL replacement for Alert.alert
export { default as InputField } from "./common/InputField"; // Auto labels from placeholder/label

// UI components - משופרים עם נגישות
export { default as ScreenContainer } from "./ui/ScreenContainer";
export { default as UniversalButton } from "./ui/UniversalButton"; // Dynamic accessibility labels
export { default as UniversalCard } from "./ui/UniversalCard";

// Workout components - מיוחדים עם אנימציות
export { default as FloatingActionButton } from "./workout/FloatingActionButton"; // Context-aware labels
export { NextWorkoutCard } from "./workout/NextWorkoutCard"; // Comprehensive card description
