/**
 * @file src/data/simplifiedQuestionnaireData.ts
 * @brief שאלון מצומצם עם דגש על בחירת מיקום אימון
 * @brief Simplified questionnaire focusing on training location selection
 * @dependencies None
 * @notes שאלון קצר וממוקד לחוויית משתמש טובה יותר
 * @notes Short focused questionnaire for better UX
 */

import { Question } from "./questionnaireData";

// שאלות בסיס חיוניות בלבד
// Essential base questions only
export const SIMPLIFIED_BASE_QUESTIONS: Question[] = [
  // שאלה 1: גיל
  {
    id: "age",
    question: "מה הגיל שלך?",
    icon: "calendar",
    type: "single",
    options: ["מתחת ל-18", "18-30", "31-45", "46-60", "60+"],
    required: true,
    helpText: "הגיל עוזר לנו להתאים את עצימות האימונים",
  },

  // שאלה 2: מטרה
  {
    id: "goal",
    question: "מה המטרה העיקרית שלך?",
    icon: "target",
    type: "single",
    options: [
      "ירידה במשקל",
      "עליה במסת שריר",
      "שיפור כושר כללי",
      "חיזוק וחיטוב",
    ],
    required: true,
    helpText: "המטרה שלך קובעת את סוג האימונים",
  },

  // שאלה 3: ניסיון
  {
    id: "experience",
    question: "מה רמת הניסיון שלך?",
    icon: "arm-flex",
    type: "single",
    options: ["מתחיל (פחות משנה)", "בינוני (1-3 שנים)", "מתקדם (3+ שנים)"],
    required: true,
    helpText: "רמת הניסיון קובעת את מורכבות התרגילים",
  },

  // שאלה 4: מיקום האימון - השאלה הקריטית!
  {
    id: "location",
    question: "איפה תעדיף להתאמן?",
    subtitle: "בחר את האפשרות המתאימה לך ביותר",
    icon: "map-marker",
    type: "single",
    options: [
      {
        id: "home",
        label: "אימונים בבית",
        description: "אימונים ללא ציוד או עם ציוד מינימלי",
      },
      {
        id: "gym",
        label: "אימונים בחדר כושר",
        description: "גישה למגוון רחב של ציוד ומכונות",
      },
    ],
    required: true,
    helpText: "נבנה לך תוכנית המותאמת למיקום האימון שבחרת",
  },

  // שאלה 5: תדירות
  {
    id: "frequency",
    question: "כמה פעמים בשבוע תוכל להתאמן?",
    icon: "calendar-week",
    type: "single",
    options: ["2-3 פעמים", "4-5 פעמים", "6+ פעמים"],
    required: true,
    helpText: "תדירות האימונים משפיעה על חלוקת התוכנית",
  },

  // שאלה 6: משך אימון
  {
    id: "duration",
    question: "כמה זמן יש לך לכל אימון?",
    icon: "clock-outline",
    type: "single",
    options: ["30 דקות", "45 דקות", "60+ דקות"],
    required: true,
    helpText: "משך האימון קובע את כמות התרגילים",
  },
];

// שאלות דינמיות לפי בחירת מיקום
// Dynamic questions based on location choice
export const SIMPLIFIED_DYNAMIC_QUESTIONS: Question[] = [
  // שאלת ציוד לבית - רק אם בחרו אימונים בבית
  {
    id: "home_equipment",
    question: "האם יש לך ציוד בבית?",
    subtitle: "סמן את הציוד הזמין לך (אופציונלי)",
    icon: "home-variant",
    type: "multiple",
    condition: (answers) => answers.location === "home",
    options: [
      {
        id: "none",
        label: "אין לי ציוד",
        description: "אימונים עם משקל גוף בלבד",
        isDefault: true,
      },
      {
        id: "resistance_bands",
        label: "גומיות התנגדות",
        description: "גומיות באורכים ועוצמות שונות",
      },
      {
        id: "dumbbells",
        label: "משקולות קטנות",
        description: "זוג משקולות עד 10 ק״ג",
      },
      {
        id: "yoga_mat",
        label: "מזרן",
        description: "מזרן לתרגילי רצפה",
      },
    ],
    required: false,
    helpText: "אם אין לך ציוד, נבנה תוכנית עם תרגילי משקל גוף",
  },

  // שאלה פשוטה על נגישות לציוד בחדר כושר
  {
    id: "gym_access",
    question: "לאיזה סוג חדר כושר יש לך גישה?",
    icon: "dumbbell",
    type: "single",
    condition: (answers) => answers.location === "gym",
    options: [
      {
        id: "basic_gym",
        label: "חדר כושר בסיסי",
        description: "משקולות, מוטות ומכונות בסיסיות",
      },
      {
        id: "full_gym",
        label: "חדר כושר מאובזר",
        description: "כל הציוד כולל מכונות מתקדמות",
      },
    ],
    required: true,
    helpText: "נתאים את התרגילים לציוד הזמין",
  },

  // שאלה על מגבלות בריאותיות - חשובה לכולם
  {
    id: "limitations",
    question: "האם יש לך מגבלות בריאותיות?",
    icon: "medical-bag",
    type: "text",
    placeholder: "לדוגמה: כאבי גב, ברכיים רגישות... (לא חובה)",
    required: false,
    helpText: "מידע זה יעזור לנו להתאים תרגילים בטוחים עבורך",
  },
];

// פונקציה לקבלת השאלות המצומצמות
export function getSimplifiedQuestions(answers: any): Question[] {
  const allQuestions = [...SIMPLIFIED_BASE_QUESTIONS];

  // הוסף שאלות דינמיות רלוונטיות
  SIMPLIFIED_DYNAMIC_QUESTIONS.forEach((q) => {
    if (!q.condition || q.condition(answers)) {
      allQuestions.push(q);
    }
  });

  return allQuestions;
}

// סיכום: 6-8 שאלות בלבד במקום 15+
// Summary: Only 6-8 questions instead of 15+
