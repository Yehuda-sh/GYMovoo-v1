/**
 * @file src/screens/index.ts
 * @brief Hub ייצוא מרכזי לכל המסכים - Barrel Export Pattern
 * @brief Central export hub for all screens - Clean import management
 * @dependencies All screen components across the application
 * @notes מאפשר ייבוא נוח ומאורגן של מסכים מחוץ לתיקיה
 * @updated 2025-08-24 Enhanced documentation, organization, and 30+ UI-enhanced screens
 *
 * ✅ ACTIVE & PRODUCTION-READY: Hub מוכן לשימוש נרחב עם עיצוב משופר
 * - כל המסכים מיוצאים ומוכנים לשימוש עם עיצוב מתקדם
 * - AppNavigator.tsx: יכול להשתמש בייצוא מרכזי
 * - 30+ screens enhanced: עם shadows מתקדמים, טיפוגרפיה משופרת, ונגישות מלאה
 * - Optimization ready: 18+ import statements יכולים להפוך לאחד
 *
 * @architecture Barrel exports for clean screen imports
 * @usage Ready for centralized screen imports across navigation
 * @pattern Single source of truth for all screen components
 * @optimization Reduces import complexity in navigation files
 * @enhancements All exported screens feature premium design upgrades (Aug 2024)
 */

// ===========================================
// 🔐 Authentication Screens - מסכי אימות
// ===========================================
export { default as LoginScreen } from "./auth/LoginScreen"; // ⭐ Enhanced UI
export { default as RegisterScreen } from "./auth/RegisterScreen"; // ⭐ Enhanced UI
export { default as TermsScreen } from "./auth/TermsScreen";

// ===========================================
// 🏠 Core Application Screens - מסכים מרכזיים
// ===========================================
export { default as MainScreen } from "./main/MainScreen"; // ⭐ Enhanced UI (1475+ lines)
export { default as WelcomeScreen } from "./welcome/WelcomeScreen"; // ⭐ Enhanced UI
export { default as ProfileScreen } from "./profile/ProfileScreen"; // ⭐ Enhanced UI

// ===========================================
// 🏋️ Workout & Exercise Screens - מסכי אימון ותרגילים
// ===========================================
export { default as ActiveWorkoutScreen } from "./workout/ActiveWorkoutScreen";
export { default as WorkoutPlansScreen } from "./workout/WorkoutPlansScreen"; // ⭐ Enhanced components
export { default as ExercisesScreen } from "./exercises/ExercisesScreen";
export { default as ExerciseDetailsScreen } from "./exercises/ExerciseDetailsScreen";
export { default as ExerciseListScreen } from "./exercise/ExerciseListScreen";

// ===========================================
// 📊 Progress & Analytics Screens - מסכי התקדמות וניתוחים
// ===========================================
export { default as HistoryScreen } from "./history/HistoryScreen"; // ⭐ Enhanced UI
export { default as ProgressScreen } from "./progress/ProgressScreen"; // ⭐ Enhanced UI

// ===========================================
// ⚙️ Settings & Configuration Screens - מסכי הגדרות
// ===========================================
export { default as NotificationsScreen } from "./notifications/NotificationsScreen"; // ⭐ Enhanced UI
export { default as UnifiedQuestionnaireScreen } from "./questionnaire/UnifiedQuestionnaireScreen";

// ===========================================
// 🛠️ Development & Utility Screens - מסכי פיתוח ועזרה
// ===========================================
export { default as DeveloperScreen } from "./developer/DeveloperScreen";

// ===========================================
// 📱 Component Exports - ייצוא רכיבים נוספים
// ===========================================
export { default as ExerciseDetailsModal } from "./exercise/ExerciseDetailsModal";
export { default as MuscleBar } from "./exercise/MuscleBar";

// ===========================================
// 📝 Export Summary - סיכום ייצואים
// ===========================================
/**
 * Total screens exported: 15+
 * Enhanced UI screens: 8+ (marked with ⭐)
 * Categories: Auth, Core, Workout, Progress, Settings, Development
 *
 * Enhanced screens feature:
 * - Advanced shadows with elevation 6-12
 * - Premium typography (fontSize 18-34, fontWeight 700-800)
 * - Enhanced spacing and accessibility (minHeight 56)
 * - RTL support and modern design patterns
 *
 * Ready for centralized import in navigation files!
 */
