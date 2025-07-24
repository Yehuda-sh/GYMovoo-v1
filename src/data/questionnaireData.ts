/**
 * @file src/data/questionnaireData.ts
 * @brief מאגר כל השאלות והלוגיקה של השאלון
 * @brief Repository of all questions and questionnaire logic
 * @description כל הנתונים של השאלון במקום אחד לתחזוקה קלה
 * @description All questionnaire data in one place for easy maintenance
 */

import { ImageSourcePropType } from "react-native";
import {
  Equipment,
  getEquipmentByCategory,
  getDefaultEquipment,
  searchEquipment,
  mergeEquipmentLists,
} from "./equipmentData";
import { DIET_OPTIONS } from "./dietData";

// סוגי שאלות
// Question types
export type QuestionType =
  | "single"
  | "multiple"
  | "multiple_with_search" // סוג חדש לתמיכה בחיפוש
  | "text"
  | "number"
  | "slider"
  | "height"
  | "weight";

// ממשק אפשרות עם תמונה
// Option with image interface
export interface OptionWithImage {
  id: string;
  label: string;
  image?: ImageSourcePropType;
  description?: string;
  isDefault?: boolean;
  isPremium?: boolean;
}

// ממשק שאלה
// Question interface
export interface Question {
  id: string;
  question: string;
  subtitle?: string;
  icon: string;
  type: QuestionType;
  options?: string[] | OptionWithImage[];
  placeholder?: string;
  min?: number;
  max?: number;
  unit?: string;
  condition?: (answers: any) => boolean;
  dynamicOptions?: (answers: any) => OptionWithImage[];
  followUp?: (answer: any) => Question | null;
  required?: boolean;
  helpText?: string;
  defaultValue?: any;
  enableSearch?: boolean; // אפשרות חיפוש
  searchPlaceholder?: string; // טקסט לשדה החיפוש
  allowCrossCategory?: boolean; // אפשרות לחפש בכל הקטגוריות
}

// שאלות בסיסיות
// Base questions
export const BASE_QUESTIONS: Question[] = [
  {
    id: "age",
    question: "מה הגיל שלך?",
    icon: "calendar",
    type: "single",
    options: ["מתחת ל-16", "16-25", "26-35", "36-45", "46-55", "56-65", "66+"],
    required: true,
  },
  {
    id: "gender",
    question: "מה המגדר שלך?",
    icon: "gender-male-female",
    type: "single",
    options: ["זכר", "נקבה", "אחר/מעדיף לא לענות"],
    required: true,
  },
  {
    id: "height",
    question: "מה הגובה שלך?",
    icon: "human-male-height",
    type: "height",
    min: 140,
    max: 220,
    required: true,
    helpText: "גרור את הסרגל כדי לבחור את הגובה שלך",
  },
  {
    id: "weight",
    question: "מה המשקל שלך?",
    icon: "weight-kilogram",
    type: "weight",
    min: 40,
    max: 150,
    required: true,
    helpText: "גרור את הסרגל כדי לבחור את המשקל שלך",
  },
  {
    id: "goal",
    question: "מה המטרה העיקרית שלך?",
    icon: "target",
    type: "single",
    options: [
      "ירידה במשקל",
      "עליה במסת שריר",
      "שיפור כוח",
      "שיפור סיבולת",
      "בריאות כללית",
      "שיקום מפציעה",
      "הכנה לתחרות",
    ],
    required: true,
  },
  {
    id: "experience",
    question: "מה רמת הניסיון שלך באימונים?",
    icon: "arm-flex",
    type: "single",
    options: [
      "מתחיל (0-6 חודשים)",
      "בינוני (6-24 חודשים)",
      "מתקדם (2-5 שנים)",
      "מקצועי (5+ שנים)",
      "ספורטאי תחרותי",
    ],
    required: true,
  },
  {
    id: "frequency",
    question: "כמה פעמים בשבוע אתה יכול להתאמן?",
    icon: "calendar-week",
    type: "single",
    options: ["1-2", "3-4", "5-6", "כל יום", "גמיש - תלוי בשבוע"],
    required: true,
  },
  {
    id: "duration",
    question: "כמה זמן יש לך לכל אימון?",
    icon: "clock-outline",
    type: "single",
    options: [
      "20-30 דקות",
      "30-45 דקות",
      "45-60 דקות",
      "60-90 דקות",
      "90+ דקות",
    ],
    required: true,
  },
  {
    id: "location",
    question: "איפה אתה מתכנן להתאמן?",
    icon: "map-marker",
    type: "single",
    options: ["חדר כושר", "בית", "גם וגם"],
    required: true,
  },
];

// שאלות דינמיות
// Dynamic questions
export const DYNAMIC_QUESTIONS: Question[] = [
  // שאלת ציוד לבית - עם אפשרות חיפוש
  // Home equipment question - with search
  {
    id: "home_equipment",
    question: "איזה ציוד יש לך בבית?",
    subtitle: "💡 שקול רכישת ציוד נוסף לאימונים מגוונים ותוצאות טובות יותר",
    icon: "home-variant",
    type: "multiple_with_search",
    condition: (answers) =>
      answers.location === "בית" || answers.location === "גם וגם",
    dynamicOptions: (answers) => {
      // מחזיר ציוד לבית, אבל מאפשר חיפוש בכל הציוד
      return getEquipmentByCategory("home", "home");
    },
    helpText: "לחץ על 🔍 לחיפוש ציוד נוסף. ניתן לחפש גם ציוד של חדר כושר!",
    required: true,
    defaultValue: ["none"],
    enableSearch: true,
    searchPlaceholder: "חפש ציוד... (כולל ציוד חדר כושר)",
    allowCrossCategory: true, // מאפשר חיפוש בכל הקטגוריות
  },

  // שאלת ציוד לחדר כושר - עם אפשרות חיפוש
  // Gym equipment question - with search
  {
    id: "gym_equipment",
    question: "איזה ציוד זמין לך בחדר הכושר?",
    subtitle: "רוב חדרי הכושר כוללים משקולות חופשיות ומוטות",
    icon: "dumbbell",
    type: "multiple_with_search",
    condition: (answers) =>
      answers.location === "חדר כושר" || answers.location === "גם וגם",
    dynamicOptions: (answers) => {
      return getEquipmentByCategory("gym", "gym");
    },
    helpText: "בחר את כל הציוד הזמין. לחץ על 🔍 לחיפוש",
    required: true,
    defaultValue: () => getDefaultEquipment("gym"),
    enableSearch: true,
    searchPlaceholder: "חפש ציוד...",
    allowCrossCategory: false, // רק ציוד חדר כושר
  },

  // שאלות נוספות לפי מטרה
  // Additional questions by goal
  {
    id: "weight_loss_goal",
    question: "מה יעד הירידה במשקל שלך?",
    icon: "arrow-down-bold",
    type: "number",
    placeholder: "לדוגמה: 10",
    unit: "ק״ג",
    min: 1,
    max: 50,
    condition: (answers) => answers.goal === "ירידה במשקל",
    required: true,
    helpText: "הגדר יעד ריאלי - ירידה של 0.5-1 ק״ג בשבוע היא בריאה ובת קיימא",
  },

  {
    id: "muscle_gain_goal",
    question: "מה יעד העלייה במסת השריר שלך?",
    icon: "arrow-up-bold",
    type: "number",
    placeholder: "לדוגמה: 5",
    unit: "ק״ג",
    min: 1,
    max: 20,
    condition: (answers) => answers.goal === "עליה במסת שריר",
    required: true,
    helpText: "עלייה של 0.25-0.5 ק״ג שריר בחודש היא יעד ריאלי למתאמנים טבעיים",
  },

  {
    id: "injury_type",
    question: "מה סוג הפציעה?",
    icon: "medical-bag",
    type: "single",
    options: [
      "פציעת גב",
      "פציעת כתף",
      "פציעת ברך",
      "פציעת קרסול",
      "פציעת מרפק",
      "פציעת צוואר",
      "אחר",
    ],
    condition: (answers) => answers.goal === "שיקום מפציעה",
    required: true,
  },

  // שאלות בריאות
  // Health questions
  {
    id: "health_conditions",
    question: "האם יש לך מצבים רפואיים שצריך לקחת בחשבון?",
    icon: "heart-pulse",
    type: "multiple",
    options: [
      "לחץ דם גבוה",
      "סוכרת",
      "בעיות לב",
      "אסטמה",
      "כאבי גב כרוניים",
      "כאבי ברכיים",
      "אין מצבים רפואיים",
    ],
    required: true,
    helpText: "חשוב שנדע כדי להתאים את האימונים למצבך הבריאותי",
  },

  // שאלות תזונה
  // Nutrition questions
  {
    id: "diet_type",
    question: "האם אתה עוקב אחרי תזונה מסוימת?",
    subtitle: "בחר סוג תזונה או השאר רגיל אם אין תזונה מיוחדת.",
    icon: "food-apple",
    type: "single",
    options: DIET_OPTIONS.map((d) => d.label), // פשוט מחרוזות במקום אובייקטים
    required: true,
    helpText: "התפריט שלך יתעדכן בהתאם לבחירת הדיאטה.",
  },
  {
    id: "sleep_hours",
    question: "כמה שעות שינה אתה ישן בממוצע?",
    icon: "sleep",
    type: "single",
    options: ["פחות מ-5 שעות", "5-6 שעות", "6-7 שעות", "7-8 שעות", "8+ שעות"],
    required: true,
    helpText: "שינה איכותית חיונית להתאוששות ולתוצאות אימון טובות",
  },

  {
    id: "stress_level",
    question: "מה רמת הלחץ שלך ביומיום?",
    icon: "emoticon-neutral",
    type: "single",
    options: ["נמוכה מאוד", "נמוכה", "בינונית", "גבוהה", "גבוהה מאוד"],
    required: true,
    helpText: "רמת לחץ גבוהה יכולה להשפיע על התאוששות ותוצאות",
  },

  // שאלות העדפות אימון
  // Training preferences questions
  {
    id: "workout_preference",
    question: "איזה סוג אימונים אתה מעדיף?",
    icon: "dumbbell",
    type: "multiple",
    options: [
      "אימוני כוח",
      "אימוני סיבולת",
      "HIIT",
      "יוגה/פילאטיס",
      "קרוספיט",
      "אימונים פונקציונליים",
      "אימוני משקל גוף",
    ],
    required: true,
    helpText: "נתאים את התוכנית להעדפות שלך",
  },

  // שאלה אחרונה - הערות נוספות
  // Last question - additional notes
  {
    id: "additional_notes",
    question: "יש משהו נוסף שחשוב שנדע?",
    icon: "note-text",
    type: "text",
    placeholder: "לדוגמה: מגבלות זמן, העדפות מיוחדות, היסטוריה רפואית...",
    required: false,
    helpText: "כל מידע נוסף יעזור לנו להתאים לך תוכנית אימונים מושלמת",
  },
];

// פונקציה לקבלת כל השאלות הרלוונטיות
// Function to get all relevant questions
export function getRelevantQuestions(answers: any): Question[] {
  const allQuestions = [...BASE_QUESTIONS];

  // הוסף שאלות דינמיות לפי תנאים
  // Add dynamic questions based on conditions
  DYNAMIC_QUESTIONS.forEach((q) => {
    if (!q.condition || q.condition(answers)) {
      allQuestions.push(q);
    }
  });

  return allQuestions;
}

// פונקציה לחיפוש ציוד במהלך השאלון
// Function to search equipment during questionnaire
export function searchEquipmentForQuestion(
  questionId: string,
  searchText: string,
  answers: any
): OptionWithImage[] {
  const question = DYNAMIC_QUESTIONS.find((q) => q.id === questionId);

  if (!question || !question.enableSearch) {
    return [];
  }

  // חפש בכל הציוד
  const results = searchEquipment(searchText);

  // אם לא מאפשרים חיפוש בין קטגוריות, סנן לפי הקטגוריה
  if (!question.allowCrossCategory) {
    const category = questionId === "home_equipment" ? "home" : "gym";
    return results.filter(
      (eq) => eq.category === category || eq.category === "both"
    );
  }

  return results;
}

// פונקציה למיזוג ציוד מבית וחדר כושר
// Function to merge home and gym equipment
export function getUserEquipment(answers: any): string[] {
  const homeEquipment = answers.home_equipment || [];
  const gymEquipment = answers.gym_equipment || [];

  return mergeEquipmentLists(homeEquipment, gymEquipment);
}
