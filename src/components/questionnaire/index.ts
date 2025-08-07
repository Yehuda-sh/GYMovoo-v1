/**
 * @file src/components/questionnaire/index.ts
 * @description נקודת כניסה מרכזית לקומפוננטות השאלון
 * Central entry point for questionnaire components
 *
 * ✅ ייצוא מרכזי של כל קומפוננטות השאלון
 * ✅ DRY - קומפוננטות מפורקות לשימוש חוזר
 * ✅ Single Source of Truth לקומפוננטות
 */

// ייצוא קומפוננטות מרכזיות
export { default as SmartOptionComponent } from "./SmartOptionComponent";
export { default as SmartProgressBar } from "./SmartProgressBar";

// ייצוא טיפוסים רלוונטיים
export { QuestionOption } from "../../data/unifiedQuestionnaire";
