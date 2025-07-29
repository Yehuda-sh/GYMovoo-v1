/**
 * @file src/data/extendedQuestionnaireData.ts
 * @brief שאלון מורחב אופציונלי: פרטים אישיים והעדפות מתקדמות
 * @brief Extended optional questionnaire: personal details and advanced preferences
 * @dependencies Question interface from questionnaireData
 * @notes משלים את השאלון החכם עם מידע נוסף לחידוד תוכניות
 * @notes Complements the smart questionnaire with additional info for refined programs
 */

import { Question } from "./questionnaireData";

// טיפוס עבור תשובות השאלון המורחב
export interface ExtendedQuestionnaireAnswers {
  // פרטים אישיים (חסרים מהשאלון החכם)
  gender?: string;
  height?: number;
  weight?: number;
  age_range?: string;

  // העדפות תזונה
  diet_type?: string;
  food_allergies?: string[];
  meal_prep_time?: string;
  cooking_skill?: string;

  // אורח חיים ובריאות
  sleep_hours?: string;
  stress_level?: string;
  water_intake?: string;
  activity_level?: string;

  // העדפות אימון מתקדמות
  workout_style_preference?: string[];
  music_preference?: string;
  workout_time_preference?: string;
  recovery_methods?: string[];

  // מטרות מפורטות
  body_areas_focus?: string[];
  specific_skills?: string[];

  // שדות כלליים
  [key: string]: unknown;
}

// ==================== פרטים אישיים חסרים ====================
// Personal details missing from smart questionnaire
export const PERSONAL_DETAILS_QUESTIONS: Question[] = [
  {
    id: "gender",
    question: "מה המגדר שלך?",
    icon: "gender-male-female",
    type: "single",
    options: ["זכר", "נקבה", "אחר/מעדיף לא לענות"],
    required: false,
    helpText: "עוזר לנו להתאים המלצות תזונה וקלוריות",
  },

  {
    id: "height",
    question: "מה הגובה שלך?",
    icon: "human-male-height",
    type: "height",
    min: 140,
    max: 220,
    required: false,
    helpText: "גרור את הסרגל כדי לבחור את הגובה שלך",
  },

  {
    id: "weight",
    question: "מה המשקל שלך?",
    icon: "weight-kilogram",
    type: "weight",
    min: 40,
    max: 150,
    required: false,
    helpText: "גרור את הסרגל כדי לבחור את המשקל שלך",
  },

  {
    id: "age_range",
    question: "באיזה טווח גילאים אתה נמצא?",
    icon: "calendar",
    type: "single",
    options: ["16-25", "26-35", "36-45", "46-55", "56-65", "65+"],
    required: false,
    helpText: "עוזר לנו להתאים את עצימות האימונים והמלצות התזונה",
  },
];

// ==================== העדפות תזונה ====================
// Nutrition preferences
export const NUTRITION_QUESTIONS: Question[] = [
  {
    id: "diet_type",
    question: "איזה סוג תזונה מתאים לך?",
    icon: "food-apple",
    type: "single",
    options: [
      "רגיל - אוכל הכל",
      "צמחוני",
      "טבעוני",
      "כשר",
      "חלאל",
      "ללא גלוטן",
      "דל פחמימות (קטו/לואו קארב)",
      "ים-תיכוני",
      "אחר",
    ],
    required: false,
    helpText: "נתאים המלצות תזונה לסגנון החיים שלך",
  },

  {
    id: "food_allergies",
    question: "האם יש לך אלרגיות או רגישויות למזון?",
    icon: "alert-circle",
    type: "multiple",
    options: [
      "אין אלרגיות",
      "גלוטן",
      "לקטוז/חלב",
      "אגוזים",
      "ביצים",
      "דגים/פירות ים",
      "סויה",
      "אחר",
    ],
    required: false,
    helpText: "חשוב לדעת כדי להמליץ על מזונות בטוחים",
  },

  {
    id: "meal_prep_time",
    question: "כמה זמן יש לך להכנת אוכל ביום?",
    icon: "clock-outline",
    type: "single",
    options: [
      "פחות מ-15 דקות",
      "15-30 דקות",
      "30-60 דקות",
      "יותר משעה",
      "אני לא מבשל בכלל",
    ],
    required: false,
    helpText: "נתאים המלצות תזונה לזמן הפנוי שלך",
  },

  {
    id: "cooking_skill",
    question: "איך תגדיר את כישורי הבישול שלך?",
    icon: "chef-hat",
    type: "single",
    options: [
      "מתחיל - רק מאכלים פשוטים",
      "בסיסי - יודע לבשל ארוחות רגילות",
      "טוב - נוח לי במטבח",
      "מתקדם - אוהב לנסות מתכונים חדשים",
    ],
    required: false,
    helpText: "נתאים רמת מורכבות המתכונים עבורך",
  },
];

// ==================== אורח חיים ובריאות ====================
// Lifestyle and health
export const LIFESTYLE_QUESTIONS: Question[] = [
  {
    id: "sleep_hours",
    question: "כמה שעות שינה אתה ישן בממוצע?",
    icon: "sleep",
    type: "single",
    options: ["פחות מ-6", "6-7 שעות", "7-8 שעות", "8+ שעות"],
    required: false,
    helpText: "שינה איכותית חיונית להתאוששות ולתוצאות טובות",
  },

  {
    id: "stress_level",
    question: "מה רמת הלחץ שלך ביומיום?",
    icon: "emoticon-neutral",
    type: "single",
    options: ["נמוכה", "בינונית", "גבוהה", "גבוהה מאוד"],
    required: false,
    helpText: "לחץ משפיע על התאוששות, תוצאות וצורכי תזונה",
  },

  {
    id: "water_intake",
    question: "כמה מים אתה שותה ביום בממוצע?",
    icon: "cup-water",
    type: "single",
    options: ["פחות מליטר", "1-2 ליטר", "2-3 ליטר", "3+ ליטר"],
    required: false,
    helpText: "הידרציה חשובה לביצועים ולהתאוששות",
  },

  {
    id: "activity_level",
    question: "מלבד האימונים, כמה פעיל אתה ביום?",
    icon: "run",
    type: "single",
    options: [
      "יושב רוב היום (עבודת משרד)",
      "פעיל בינוני (מעט הליכה)",
      "פעיל (הרבה הליכה/עמידה)",
      "פעיל מאוד (עבודה פיזית)",
    ],
    required: false,
    helpText: "עוזר לחשב צורכי קלוריות מדויקים יותר",
  },
];

// ==================== העדפות אימון מתקדמות ====================
// Advanced workout preferences
export const WORKOUT_PREFERENCES_QUESTIONS: Question[] = [
  {
    id: "workout_style_preference",
    question: "איזה סגנונות אימון אתה הכי נהנה מהם?",
    subtitle: "בחר עד 3 סגנונות (יעזור לנו לגוון את התוכניות)",
    icon: "dumbbell",
    type: "multiple",
    options: [
      "אימוני כוח קלאסיים",
      "אימונים פונקציונליים",
      "HIIT (אימוני אינטרוול)",
      "יוגה/פילאטיס",
      "אימוני גמישות ומתיחות",
      "אימוני ליבה וייצוב",
      "אימוני קרדיו",
      "אימונים עם משקל גוף",
    ],
    required: false,
    helpText: "נשלב את הסגנונות שאתה אוהב יותר בתוכניות (עד 3 בחירות)",
  },

  {
    id: "workout_time_preference",
    question: "מתי אתה מעדיף להתאמן?",
    icon: "clock-time-four",
    type: "single",
    options: [
      "בוקר מוקדם (6:00-8:00)",
      "בוקר (8:00-11:00)",
      "צהריים (11:00-14:00)",
      "אחה״צ (14:00-17:00)",
      "ערב (17:00-20:00)",
      "לילה מאוחר (20:00+)",
      "אין לי העדפה",
    ],
    required: false,
    helpText: "נתאים המלצות תזונה וחימום לזמן האימון",
  },

  {
    id: "recovery_methods",
    question: "איזה שיטות התאוששות אתה משתמש בהן?",
    icon: "spa",
    type: "multiple",
    options: [
      "אין - רק מנוחה",
      "מתיחות לאחר אימון",
      "רולר לעיסוי שרירים",
      "אמבטיה חמה/קרה",
      "מדיטציה/נשימות",
      "עיסוי מקצועי",
      "סאונה/מקלחת קיטור",
      "שינה נוספת",
    ],
    required: false,
    helpText: "נכיר את הרגלי ההתאוששות שלך ונמליץ על שיטות נוספות",
  },
];

// ==================== מטרות מפורטות ====================
// Detailed goals
export const DETAILED_GOALS_QUESTIONS: Question[] = [
  {
    id: "body_areas_focus",
    question: "באיזה אזורי גוף אתה הכי רוצה להתמקד?",
    subtitle: "בחר עד 3 אזורים (נדגיש אותם בתוכניות)",
    icon: "human-male",
    type: "multiple",
    options: [
      "בטן וליבה",
      "חזה ושרירי דחיפה",
      "גב ושרירי משיכה",
      "כתפיים וידיים",
      "רגליים וישבן",
      "גמישות כללית",
      "יציבה וייצוב",
      "כושר לב-ריאה",
    ],
    required: false,
    helpText: "נדגיש את האזורים הללו בתוכניות שלך (עד 3 בחירות)",
  },

  {
    id: "specific_skills",
    question: "האם יש כישורים ספציפיים שאתה רוצה לפתח?",
    icon: "trophy",
    type: "multiple",
    options: [
      "אין מטרות ספציפיות",
      "לעשות מתחים (Pull-ups)",
      "לעשות שכיבות סמיכה מושלמות",
      "לשפר איזון וקואורדינציה",
      "להיות גמיש יותר",
      "לרוץ מרחק ארוך יותר",
      "להרים משקלים כבדים יותר",
      "ללמוד תרגילים מתקדמים",
    ],
    required: false,
    helpText: "נבנה תרגילי הדרגה לפיתוח הכישורים הללו",
  },
];

// פונקציות עזר
export function getAllExtendedQuestions(): Question[] {
  return [
    ...PERSONAL_DETAILS_QUESTIONS,
    ...NUTRITION_QUESTIONS,
    ...LIFESTYLE_QUESTIONS,
    ...WORKOUT_PREFERENCES_QUESTIONS,
    ...DETAILED_GOALS_QUESTIONS,
  ];
}

export function getPersonalDetailsQuestions(): Question[] {
  return PERSONAL_DETAILS_QUESTIONS;
}

export function getNutritionQuestions(): Question[] {
  return NUTRITION_QUESTIONS;
}

export function getLifestyleQuestions(): Question[] {
  return LIFESTYLE_QUESTIONS;
}

export function getWorkoutPreferencesQuestions(): Question[] {
  return WORKOUT_PREFERENCES_QUESTIONS;
}

export function getDetailedGoalsQuestions(): Question[] {
  return DETAILED_GOALS_QUESTIONS;
}

// בדיקה האם המשתמש השלים פרטים אישיים בסיסיים
export function hasBasicPersonalDetails(
  questionnaire: ExtendedQuestionnaireAnswers | null | undefined
): boolean {
  if (!questionnaire) return false;

  // אם יש גובה ומשקל - יש פרטים בסיסיים
  return !!(questionnaire.height && questionnaire.weight);
}

// בדיקה האם המשתמש השלים העדפות תזונה
export function hasNutritionPreferences(
  questionnaire: ExtendedQuestionnaireAnswers | null | undefined
): boolean {
  if (!questionnaire) return false;

  // אם יש סוג תזונה או אלרגיות - יש העדפות תזונה
  return !!(questionnaire.diet_type || questionnaire.food_allergies);
}

// בדיקה האם המשתמש השלים מידע על אורח חיים
export function hasLifestyleInfo(
  questionnaire: ExtendedQuestionnaireAnswers | null | undefined
): boolean {
  if (!questionnaire) return false;

  // אם יש מידע על שינה או לחץ - יש מידע על אורח חיים
  return !!(questionnaire.sleep_hours || questionnaire.stress_level);
}

// בדיקה האם המשתמש השלים העדפות אימון מתקדמות
export function hasAdvancedWorkoutPreferences(
  questionnaire: ExtendedQuestionnaireAnswers | null | undefined
): boolean {
  if (!questionnaire) return false;

  // אם יש העדפות סגנון או זמן אימון - יש העדפות מתקדמות
  return !!(
    questionnaire.workout_style_preference ||
    questionnaire.workout_time_preference
  );
}

// הודעה למשתמש על השאלון המורחב
export const EXTENDED_QUESTIONNAIRE_INFO = {
  title: "שאלון מורחב אופציונלי",
  subtitle: "מידע נוסף שיעזור לנו להתאים לך תוכניות מדויקות יותר",
  icon: "account-details-star",
  estimatedTime: "5-8 דקות",
  canSkip: true,
  sections: {
    personal: {
      title: "פרטים אישיים",
      subtitle: "גובה, משקל וגיל לחישובי קלוריות מדויקים",
      questionsCount: PERSONAL_DETAILS_QUESTIONS.length,
      priority: "high",
    },
    nutrition: {
      title: "העדפות תזונה",
      subtitle: "תזונה, אלרגיות וזמן הכנת אוכל",
      questionsCount: NUTRITION_QUESTIONS.length,
      priority: "high",
    },
    lifestyle: {
      title: "אורח חיים ובריאות",
      subtitle: "שינה, לחץ ופעילות יומית",
      questionsCount: LIFESTYLE_QUESTIONS.length,
      priority: "medium",
    },
    workout_preferences: {
      title: "העדפות אימון מתקדמות",
      subtitle: "סגנונות אימון, זמנים והתאוששות",
      questionsCount: WORKOUT_PREFERENCES_QUESTIONS.length,
      priority: "medium",
    },
    detailed_goals: {
      title: "מטרות מפורטות",
      subtitle: "אזורי גוף ספציפיים וכישורים",
      questionsCount: DETAILED_GOALS_QUESTIONS.length,
      priority: "low",
    },
  },
  benefits: [
    "תוכניות אימון מותאמות אישית יותר",
    "המלצות תזונה מדויקות לפי הצרכים שלך",
    "חישוב קלוריות מדויק על בסיס הנתונים שלך",
    "התאמת זמני אימון ושיטות התאוששות",
    "מעקב מתקדם אחרי התקדמות",
    "המלצות מזון המתאימות לאלרגיות ולהעדפות",
  ],
};

// סיכום החדש:
// שאלון מורחב אופציונלי עם 5 קטגוריות:
// 1. פרטים אישיים (4 שאלות) - עדיפות גבוהה
// 2. העדפות תזונה (4 שאלות) - עדיפות גבוהה
// 3. אורח חיים ובריאות (4 שאלות) - עדיפות בינונית
// 4. העדפות אימון מתקדמות (3 שאלות) - עדיפות בינונית
// 5. מטרות מפורטות (2 שאלות) - עדיפות נמוכה
// סה״כ: 17 שאלות אופציונליות שמשפרות את דיוק ההמלצות
