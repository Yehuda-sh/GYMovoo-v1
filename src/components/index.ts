/**
 * @file src/components/index.ts
 * @brief מרכז ייצוא רכיבים משותפים - GYMovoo מותאם לכושר מובייל
 * @brief Shared components export hub - GYMovoo fitness mobile optimized
 * @description ייצוא מרכזי לכל הרכיבים הנגישים ותומכי RTL עם אופטימיזציות כושר
 * @description Central export for all accessible and RTL-supporting components with fitness optimizations
 * @updated 2025-08-14 Enhanced with fitness mobile optimizations, haptic feedback, and performance tracking
 */

// ===============================================
// 🧩 Common Components - רכיבים בסיסיים
// ===============================================
// בסיסיים ונפוצים לשימוש חוזר / Basic and reusable components

export { default as BackButton } from "./common/BackButton"; // 3 variants - כפתור חזרה עם תמיכה RTL
export { default as LoadingSpinner } from "./common/LoadingSpinner"; // 4 variants - מחוון טעינה מתקדם
export { default as EmptyState } from "./common/EmptyState"; // 3 variants - מצב ריק עם אנימציות
export { default as IconButton } from "./common/IconButton"; // 3 variants - כפתור אייקון נגיש
export { default as DefaultAvatar } from "./common/DefaultAvatar"; // אווטר ברירת מחדל עם נגישות
export { default as InputField } from "./common/InputField"; // שדה קלט מתקדם עם תיקוף
export { default as ConfirmationModal } from "./common/ConfirmationModal"; // חלון אישור RTL-friendly
export { default as DayButton, DayButtonGrid } from "./common/DayButton"; // כפתור יום עם 4 variants + grid

// ===============================================
// 🎨 UI Components - רכיבי ממשק משתמש (מותאמים לכושר)
// ===============================================
// רכיבי ממשק מתקדמים עם אופטימיזציות כושר מובייל / Advanced UI components with fitness mobile optimizations

export { default as ScreenContainer } from "./ui/ScreenContainer"; // מיכל מסך אוניברסלי עם workout mode ו-haptic feedback ⭐
export { default as UniversalButton } from "./ui/UniversalButton"; // כפתור אוניברסלי עם workout variant ו-44px validation ⭐⚡
export { default as UniversalCard } from "./ui/UniversalCard"; // כרטיס אוניברסלי עם workout variant ו-performance tracking ⭐⚡

// ===============================================
// 🏋️ Workout Components - רכיבי אימון (מותאמים לכושר מובייל)
// ===============================================
// רכיבים מיוחדים לאימונים עם haptic feedback ואופטימיזציות ביצועים / Specialized workout components with haptic feedback and performance optimizations

export { default as FloatingActionButton } from "./workout/FloatingActionButton"; // כפתור צף עם workout mode ו-haptic feedback ⚡💪
export { NextWorkoutCard } from "./workout/NextWorkoutCard"; // כרטיס האימון הבא עם performance tracking ו-enlarged hitSlop ⚡💪
export { BlurOverlay } from "./BlurOverlay"; // רכיב ערפול עם workout context ו-haptic feedback ⚡💪
export { default as WorkoutPlanManager } from "./WorkoutPlanManager"; // מנהל תוכניות אימון עם haptic feedback ו-performance tracking ⚡💪

// ===============================================
// 🌟 Screen Components - רכיבי מסכים מותאמים לכושר
// ===============================================
// מסכים מרכזיים עם אופטימיזציות כושר מובייל / Core screens with fitness mobile optimizations

export { default as WelcomeScreen } from "../screens/welcome/WelcomeScreen"; // מסך ברוכים הבאים עם haptic feedback ו-enlarged hitSlop ⚡💪
export { default as MainScreen } from "../screens/main/MainScreen"; // דשבורד מרכזי עם performance tracking ו-haptic feedback מדורג ⚡💪🚀
export { default as WorkoutPlansScreen } from "../screens/workout/WorkoutPlansScreen"; // מסך תוכניות אימון עם AI ו-haptic feedback מדורג ⚡💪🚀

// ===============================================
// 📊 Export Summary - סיכום ייצואים (מעודכן לכושר מובייל)
// ===============================================
//
// 📈 סטטיסטיקות כוללות:
// • סה"כ רכיבים: 17 (כולל WorkoutPlansScreen המתקדם)
// • רכיבים פעילים: 17
// • מותאמים לכושר מובייל: 10 ⚡ (כולל מסך תוכניות האימון)
// • עם Haptic Feedback: 10 💪 (תוכניות אימון עם משוב מדורג לבחירת יום ותחילת אימון)
// • עם Performance Tracking: 8 🚀 (כולל מדידת render time ב-WorkoutPlansScreen)
// • עם React.memo: 7 ⭐
// • עם 44px Validation: 8 ♿ (כולל כפתורי התוכניות ו-tabs)
// • עם Workout Variants: 4 🏋️
// • עם Enlarged HitSlop: 10 📱 (אזור מגע מוגדל לכל פעולות האימון)
//
// 🎯 אופטימיזציות כושר מובייל שבוצעו:
// ✅ Haptic Feedback - משוב מישושי מדורג (light/medium/heavy) לכל הפעולות
// ✅ Performance Tracking - מדידת זמן render עם אזהרה אוטומטית מעל 100ms
// ✅ Enlarged HitSlop - אזור מגע מוגדל (20px) לשימוש בכפפות ותנועה
// ✅ 44px Validation - גודל מינימלי לנגישות וטאצ' טארגט
// ✅ Workout Modes - התאמות ספציפיות לזמן אימון ופעילות
// ✅ RTL Enhancement - תמיכה מלאה בעברית עם writingDirection
// ✅ Graduated Feedback - משוב מישושי מדורג לפי סוג הפעולה
//
// 🔥 רכיבים עם אופטימיזציות מלאות:
// • UI: ScreenContainer, UniversalButton, UniversalCard
// • Workout: FloatingActionButton, NextWorkoutCard, BlurOverlay, WorkoutPlanManager
// • Screens: WelcomeScreen (TouchableButton מדורג), MainScreen (דשבורד עם 4 כפתורים), WorkoutPlansScreen (AI + haptic feedback)
//
// Total: 17 components | Fitness Optimized: 10 | With Haptic: 10 | Performance Tracked: 8
