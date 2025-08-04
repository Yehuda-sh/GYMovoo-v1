/**
 * @file src/data/extendedQuestionnaireData.ts
 * @brief שאלון מורחב אופצ  last_upd  //   last_updated?: Date; // מתי עודכן לאחרונה

  // שדות כלליים
  [key: string]: unknown;
}

// ==================== פרטים אישיים חסרים ====================
// Personal details missing from smart questionnaire============= פרטים אישיים חסרים ================================== פרטים אישיים חסרים ====================
// Personal details missing from smart questionnaire=============== פרטים אישיים חסרים ================================== פרטים אישיים חסרים ====================
// Personal details missing from smart questionnaire
  [key: string]: unknown;
}

// ==================== פרטים אישיים חסרים ====================
// Personal details missing from smart questionnaire============== פרטים אישיים חסרים ====================; // מתי עודכן לאחרונה

  // שדות כלליים
  [key: string]: unknown;
}

// ==================== פרטים אישיים חסרים ====================ם
  [key: string]: unknown;
}

// ==================== פרטים אישיים חסרים =================================== פרטים אישיים חסרים ====================גוריתם חכם: פרטים אישיים והעדפות מתקדמות
 * @brief Extended optional questionnaire with smart algorithm: personal details and advanced preferences
 * @notes משלים את השאלון החכם עם מידע נוסף לחידוד תוכניות ואלגוריתם התאמה
 * @notes Complements the smart questionnaire with additional info for refined programs and matching algorithm
 * @version 2.0 - Updated with unified interfaces
 */

import {
  QuestionType,
  QuestionMetadata,
  BaseOption,
} from "./questionnaireData";

// ================== UNIFIED QUESTION INTERFACES | ממשקי שאלות מאוחדים ==================

// Base question interface using unified types
// ממשק שאלה בסיסי עם טיפוסים מאוחדים
export interface Question {
  id: string;
  question: string;
  subtitle?: string;
  icon: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  unit?: string;
  required?: boolean;
  helpText?: string;
  defaultValue?: any;
}

// Extended question with algorithm metadata
// שאלה מורחבת עם מטא-דאטה לאלגוריתם
export interface ExtendedQuestion extends Question, QuestionMetadata {
  // כל השדות כבר מוגדרים בממשקים הבסיסיים
}

// טיפוס עבור תשובות השאלון המורחב עם מטא-דאטה
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

  // מטא-דאטה לאלגוריתם
  completion_score?: number; // ציון השלמת השאלון (0-100)
  personalization_level?: "basic" | "intermediate" | "advanced"; // רמת אישיות
  algorithm_priorities?: string[]; // עדיפויות לאלגוריתם
  last_updated?: Date; // מתי עודכן לאחרונה

  // שדות כלליים
  [key: string]: unknown;
}

// ממשק מורחב לשאלות עם נתוני אלגוريתם
interface ExtendedQuestion extends Question {
  algorithmWeight?: number; // משקל בחישוב האלגוריתם (1-10)
  impactArea?: string[]; // תחומים שהשאלה משפיעה עליהם
  customIcon?: string; // אייקון מותאם עתידי
  priority?: "critical" | "high" | "medium" | "low"; // עדיפות השאלה
}

// ==================== פרטים אישיים חסרים ====================
// Personal details missing from smart questionnaire
export const PERSONAL_DETAILS_QUESTIONS: ExtendedQuestion[] = [
  {
    id: "gender",
    question: "מה המגדר שלך?",
    icon: "gender-male-female",
    type: "single",
    options: ["זכר", "נקבה", "אחר/מעדיף לא לענות"],
    required: false,
    helpText: "עוזר לנו להתאים המלצות תזונה וקלוריות",
    algorithmWeight: 8,
    impactArea: ["nutrition", "calories", "workout_intensity"],
    priority: "high",
    customIcon: "questionnaire/gender.png",
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
    algorithmWeight: 9,
    impactArea: ["calories", "BMI", "exercise_scaling"],
    priority: "critical",
    customIcon: "questionnaire/height.png",
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
    algorithmWeight: 9,
    impactArea: ["calories", "BMI", "workout_intensity"],
    priority: "critical",
    customIcon: "questionnaire/weight.png",
  },

  {
    id: "age_range",
    question: "באיזה טווח גילאים אתה נמצא?",
    icon: "calendar",
    type: "single",
    options: ["16-25", "26-35", "36-45", "46-55", "56-65", "65+"],
    required: false,
    helpText: "עוזר לנו להתאים את עצימות האימונים והמלצות התזונה",
    algorithmWeight: 7,
    impactArea: ["workout_intensity", "recovery", "nutrition"],
    priority: "high",
    customIcon: "questionnaire/age.png",
  },
]; // ==================== מטרות ומחויבות ====================
// Goals and commitment level
export const GOALS_COMMITMENT_QUESTIONS: ExtendedQuestion[] = [
  {
    id: "training_main_goal",
    question: "מה המטרה העיקרית שלך מהאימונים?",
    icon: "target",
    type: "single",
    options: [
      "ירידה במשקל",
      "עלייה במסת שריר",
      "שיפור כושר גופני",
      "הגדלת כוח",
      "רק להיות פעיל יותר",
      "שיפור במצב הרוח",
    ],
    required: false,
    algorithmWeight: 10,
    impactArea: ["workout_type", "exercise_selection", "intensity"],
    priority: "critical",
    customIcon: "questionnaire/goal.png",
  },

  {
    id: "weekly_commitment",
    question: "כמה פעמים בשבוע אתה מתכוון להתאמן?",
    icon: "calendar-week",
    type: "single",
    options: ["1-2 פעמים", "3 פעמים", "4 פעמים", "5+ פעמים"],
    required: false,
    algorithmWeight: 9,
    impactArea: ["workout_frequency", "progression", "recovery"],
    priority: "critical",
    customIcon: "questionnaire/frequency.png",
  },

  {
    id: "workout_duration",
    question: "כמה זמן אתה יכול להקדיש לאימון?",
    icon: "clock",
    type: "single",
    options: ["פחות מ-30 דקות", "30-45 דקות", "45-60 דקות", "יותר משעה"],
    required: false,
    helpText: "זמן שאתה יכול להקדיש לאימון בכל פעם",
    algorithmWeight: 8,
    impactArea: ["workout_duration", "exercise_count", "intensity"],
    priority: "high",
    customIcon: "questionnaire/duration.png",
  },

  {
    id: "motivation_factors",
    question: "מה מניע אותך להתאמן?",
    icon: "lightning-bolt",
    type: "multiple",
    options: [
      "לחזור לכושר",
      "למנוע מחלות",
      "להרגיש טוב יותר עם עצמי",
      "להרגיש יותר אנרגטי",
      "לשפר את ביטחון העצמי",
      "להתאמן עם חברים",
      "למלא זמן פוי",
    ],
    required: false,
    algorithmWeight: 6,
    impactArea: ["motivation", "workout_type", "social_features"],
    priority: "medium",
    customIcon: "questionnaire/motivation.png",
  },
];

// ==================== העדפות תזונה ====================
// Nutrition preferences
export const NUTRITION_QUESTIONS: ExtendedQuestion[] = [
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
    algorithmWeight: 8,
    impactArea: ["nutrition", "meal_planning", "calories"],
    priority: "high",
    customIcon: "questionnaire/diet.png",
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
    algorithmWeight: 9,
    impactArea: ["nutrition", "safety", "meal_planning"],
    priority: "critical",
    customIcon: "questionnaire/allergies.png",
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
    algorithmWeight: 6,
    impactArea: ["meal_planning", "nutrition", "time_management"],
    priority: "medium",
    customIcon: "questionnaire/meal_prep.png",
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
    algorithmWeight: 5,
    impactArea: ["meal_planning", "nutrition", "recipe_complexity"],
    priority: "medium",
    customIcon: "questionnaire/cooking.png",
  },
];

// ==================== אורח חיים ובריאות ====================
// Lifestyle and health
export const LIFESTYLE_QUESTIONS: ExtendedQuestion[] = [
  {
    id: "sleep_hours",
    question: "כמה שעות שינה אתה ישן בממוצע?",
    icon: "sleep",
    type: "single",
    options: ["פחות מ-6", "6-7 שעות", "7-8 שעות", "8+ שעות"],
    required: false,
    helpText: "שינה איכותית חיונית להתאוששות ולתוצאות טובות",
    algorithmWeight: 7,
    impactArea: ["recovery", "performance", "health"],
    priority: "high",
    customIcon: "questionnaire/sleep.png",
  },

  {
    id: "stress_level",
    question: "מה רמת הלחץ שלך ביומיום?",
    icon: "emoticon-neutral",
    type: "single",
    options: ["נמוכה", "בינונית", "גבוהה", "גבוהה מאוד"],
    required: false,
    helpText: "לחץ משפיע על התאוששות, תוצאות וצורכי תזונה",
    algorithmWeight: 6,
    impactArea: ["recovery", "workout_intensity", "nutrition"],
    priority: "medium",
    customIcon: "questionnaire/stress.png",
  },

  {
    id: "water_intake",
    question: "כמה מים אתה שותה ביום בממוצע?",
    icon: "cup-water",
    type: "single",
    options: ["פחות מליטר", "1-2 ליטר", "2-3 ליטר", "3+ ליטר"],
    required: false,
    helpText: "הידרציה חשובה לביצועים ולהתאוששות",
    algorithmWeight: 5,
    impactArea: ["performance", "recovery", "health"],
    priority: "medium",
    customIcon: "questionnaire/water.png",
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
    algorithmWeight: 7,
    impactArea: ["calories", "workout_intensity", "recovery"],
    priority: "high",
    customIcon: "questionnaire/activity.png",
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

// ==================== Smart Questionnaire Analysis Functions ====================

/**
 * Calculate questionnaire completion score based on algorithm weights
 * Returns score from 0-100 based on importance of answered questions
 */
export function calculateCompletionScore(
  answers: ExtendedQuestionnaireAnswers
): number {
  let totalWeight = 0;
  let answeredWeight = 0;

  const allQuestions = [
    ...PERSONAL_DETAILS_QUESTIONS,
    ...GOALS_COMMITMENT_QUESTIONS,
    ...NUTRITION_QUESTIONS,
    // Add other question arrays as they're enhanced
  ];

  allQuestions.forEach((question) => {
    const weight = question.algorithmWeight ?? 1;
    totalWeight += weight;

    const answer = answers[question.id as keyof ExtendedQuestionnaireAnswers];
    if (answer && answer !== "" && answer !== null && answer !== undefined) {
      answeredWeight += weight;
    }
  });

  return totalWeight > 0 ? Math.round((answeredWeight / totalWeight) * 100) : 0;
}

/**
 * Calculate personalization level based on critical questions answered
 * Returns level from 1-5 based on completeness of key information
 */
export function calculatePersonalizationLevel(
  answers: ExtendedQuestionnaireAnswers
): number {
  const criticalQuestions = [
    "training_main_goal",
    "weekly_commitment",
    "height",
    "weight",
    "gender",
  ];

  const highPriorityQuestions = [
    "age_range",
    "workout_duration",
    "diet_type",
    "food_allergies",
  ];

  let criticalAnswered = 0;
  let highPriorityAnswered = 0;

  criticalQuestions.forEach((questionId) => {
    const answer = answers[questionId as keyof ExtendedQuestionnaireAnswers];
    if (answer && answer !== "" && answer !== null && answer !== undefined) {
      criticalAnswered++;
    }
  });

  highPriorityQuestions.forEach((questionId) => {
    const answer = answers[questionId as keyof ExtendedQuestionnaireAnswers];
    if (answer && answer !== "" && answer !== null && answer !== undefined) {
      highPriorityAnswered++;
    }
  });

  // Level calculation based on answered questions
  if (criticalAnswered >= 4) return 5; // Highest personalization
  if (criticalAnswered >= 3 && highPriorityAnswered >= 2) return 4;
  if (criticalAnswered >= 2) return 3;
  if (criticalAnswered >= 1) return 2;
  return 1; // Basic level
}

/**
 * Get priority-based question recommendations for incomplete questionnaire
 * Returns array of question IDs sorted by importance for personalization
 */
export function getRecommendedQuestions(
  answers: ExtendedQuestionnaireAnswers,
  maxRecommendations: number = 5
): string[] {
  const allQuestions = [
    ...PERSONAL_DETAILS_QUESTIONS,
    ...GOALS_COMMITMENT_QUESTIONS,
    ...NUTRITION_QUESTIONS,
  ];

  const unansweredQuestions = allQuestions
    .filter((question) => {
      const answer = answers[question.id as keyof ExtendedQuestionnaireAnswers];
      return (
        !answer || answer === "" || answer === null || answer === undefined
      );
    })
    .sort((a, b) => {
      // Sort by priority: critical > high > medium > low
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority ?? "low"] || 0;
      const bPriority = priorityOrder[b.priority ?? "low"] || 0;

      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }

      // If same priority, sort by algorithm weight
      const aWeight = a.algorithmWeight ?? 1;
      const bWeight = b.algorithmWeight ?? 1;
      return bWeight - aWeight;
    })
    .slice(0, maxRecommendations)
    .map((question) => question.id);

  return unansweredQuestions;
}

/**
 * Calculate algorithm priorities based on user answers
 * Returns object with weighted priorities for different aspects
 */
export function calculateAlgorithmPriorities(
  answers: ExtendedQuestionnaireAnswers
): Record<string, number> {
  const priorities: Record<string, number> = {
    weight_loss: 0,
    muscle_gain: 0,
    fitness_improvement: 0,
    strength_building: 0,
    nutrition_focus: 0,
    time_efficiency: 0,
    recovery_focus: 0,
    beginner_friendly: 0,
  };

  // Main goal impact
  if (answers.training_main_goal === "ירידה במשקל") {
    priorities.weight_loss = 10;
    priorities.nutrition_focus = 8;
  } else if (answers.training_main_goal === "עלייה במסת שריר") {
    priorities.muscle_gain = 10;
    priorities.nutrition_focus = 7;
  } else if (answers.training_main_goal === "שיפור כושר גופני") {
    priorities.fitness_improvement = 10;
  } else if (answers.training_main_goal === "הגדלת כוח") {
    priorities.strength_building = 10;
  }

  // Time constraints impact
  if (answers.workout_duration === "פחות מ-30 דקות") {
    priorities.time_efficiency = 9;
  } else if (answers.workout_duration === "30-45 דקות") {
    priorities.time_efficiency = 6;
  }

  // Frequency impact on recovery
  if (answers.weekly_commitment === "1-2 פעמים") {
    priorities.beginner_friendly = 8;
    priorities.recovery_focus = 6;
  } else if (answers.weekly_commitment === "5+ פעמים") {
    priorities.recovery_focus = 9;
  }

  // Diet focus
  if (answers.diet_type && answers.diet_type !== "רגיל - אוכל הכל") {
    priorities.nutrition_focus += 3;
  }

  if (answers.food_allergies && answers.food_allergies.length > 1) {
    priorities.nutrition_focus += 2;
  }

  return priorities;
}

/**
 * Get smart questionnaire insights based on current answers
 * Returns insights and recommendations for better personalization
 */
export function getQuestionnaireInsights(
  answers: ExtendedQuestionnaireAnswers
): {
  completionScore: number;
  personalizationLevel: number;
  recommendedQuestions: string[];
  algorithmPriorities: Record<string, number>;
  insights: string[];
  nextSteps: string[];
} {
  const completionScore = calculateCompletionScore(answers);
  const personalizationLevel = calculatePersonalizationLevel(answers);
  const recommendedQuestions = getRecommendedQuestions(answers);
  const algorithmPriorities = calculateAlgorithmPriorities(answers);

  const insights: string[] = [];
  const nextSteps: string[] = [];

  // Generate insights based on completion
  if (completionScore >= 80) {
    insights.push("פרופיל מלא וחדר! נוכל לתת לך המלצות מותאמות אישית מעולות");
  } else if (completionScore >= 60) {
    insights.push("פרופיל טוב! עוד כמה שאלות יכולות לשפר את ההמלצות");
  } else if (completionScore >= 40) {
    insights.push(
      "פרופיל בסיסי. שאלות נוספות יכולות לשפר משמעותית את ההתאמה האישית"
    );
  } else {
    insights.push(
      "פרופיל לא שלם. מומלץ להשלים שאלות נוספות להמלצות טובות יותר"
    );
  }

  // Generate next steps
  if (recommendedQuestions.length > 0) {
    nextSteps.push(
      `מומלץ להשלים ${recommendedQuestions.length} שאלות נוספות לשיפור ההתאמה`
    );
  }

  if (personalizationLevel < 3) {
    nextSteps.push(
      "השלמת פרטים בסיסיים (גובה, משקל, מטרה) תשפר משמעותית את ההמלצות"
    );
  }

  return {
    completionScore,
    personalizationLevel,
    recommendedQuestions,
    algorithmPriorities,
    insights,
    nextSteps,
  };
}
