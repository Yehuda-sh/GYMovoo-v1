/**
 * @file src/components/index.ts
 * @brief מרכז ייצוא רכיבים משותפים - GYMovoo
 * @brief Shared components export hub - GYMovoo
 * @description ייצוא מרכזי לכל הרכיבים הנגישים ותומכי RTL
 * @description Central export for all accessible and RTL-supporting components
 * @updated 2025-08-04 Enhanced with improved organization and consistency
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

// ===============================================
// 🎨 UI Components - רכיבי ממשק משתמש
// ===============================================
// רכיבי ממשק מתקדמים ואוניברסליים / Advanced and universal UI components

export { default as ScreenContainer } from "./ui/ScreenContainer"; // מיכל מסך אוניברסלי עם header ו-scroll
export { default as UniversalButton } from "./ui/UniversalButton"; // כפתור אוניברסלי - 6 variants עם React.memo ⭐
export { default as UniversalCard } from "./ui/UniversalCard"; // כרטיס אוניברסלי - 5 variants עם React.memo ⭐

// ===============================================
// 🏋️ Workout Components - רכיבי אימון
// ===============================================
// רכיבים מיוחדים לאימונים עם אנימציות / Specialized workout components with animations

// 🚧 לשימוש עתידי / For future use
export { default as FloatingActionButton } from "./workout/FloatingActionButton"; // כפתור צף מותאם לאימונים - מתוכנן לשילוב עתידי
export { NextWorkoutCard } from "./workout/NextWorkoutCard"; // כרטיס האימון הבא - מיועד להחליף implementation ידני

// ===============================================
// 📊 Export Summary - סיכום ייצואים
// ===============================================
// סה"כ: 12 רכיבים | פעילים: 10 | משופרים: 7 | עם React.memo: 2 | לשימוש עתידי: 2
// Total: 12 components | Active: 10 | Enhanced: 7 | With React.memo: 2 | Future use: 2
