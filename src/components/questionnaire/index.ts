/**
 * @file src/components/questionnaire/index.ts
 * @description נקודת כניסה מרכזית לקומפוננטות השאלון
 * Central entry point for questionnaire components
 *
 * 🔄 עדכון 2025-08-07: המערכת עברה למערכת שאלון אחודה חדשה
 * Update 2025-08-07: System migrated to new unified questionnaire system
 *
 * � מיקום המערכת החדשה:
 * New system location:
 * - src/data/unifiedQuestionnaire.ts (נתונים ולוגיקה)
 * - src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx (UI)
 *
 * 📝 הקומפוננטות למטה נשמרות לצורכי תאימות/שימוש עתידי
 * Components below are kept for compatibility/future use
 */

// ייצוא טיפוסים רלוונטיים מהמערכת האחודה החדשה
// Export relevant types from the new unified system
export {
  QuestionOption,
  Question,
  QuestionnaireResults,
  UnifiedQuestionnaireManager,
} from "../../data/unifiedQuestionnaire";

// ייצוא קומפוננטות מורשת (לא בשימוש פעיל)
// Legacy components export (not actively used)
export { default as SmartOptionComponent } from "./SmartOptionComponent";
