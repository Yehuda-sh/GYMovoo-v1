/**
 * @file src/data/twoStageQuestionnaireData.ts
 * @brief שאלון דו-שלבי: חלק ראשון לאימונים, חלק שני לפרופיל אישי
 * @brief Two-stage questionnaire: first for training, second for personal profile
 * @dependencies Question interface from questionnaireData
 * @notes מאפשר התחלה מהירה באימונים ואיסוף מידע נוסף בהמשך
 * @notes Allows quick start with training and collect additional info later
 */

import { Question } from "./questionnaireData";

// ==================== שלב 1: שאלות אימון חיוניות ====================
// Stage 1: Essential training questions (6-7 questions)
export const TRAINING_QUESTIONS: Question[] = [
  {
    id: "age",
    question: "מה הגיל שלך?",
    icon: "calendar",
    type: "single",
    options: ["מתחת ל-18", "18-30", "31-45", "46-60", "60+"],
    required: true,
    helpText: "הגיל עוזר לנו להתאים את עצימות האימונים",
  },

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

  {
    id: "experience",
    question: "מה רמת הניסיון שלך?",
    icon: "arm-flex",
    type: "single",
    options: ["מתחיל (פחות משנה)", "בינוני (1-3 שנים)", "מתקדם (3+ שנים)"],
    required: true,
    helpText: "רמת הניסיון קובעת את מורכבות התרגילים",
  },

  // השאלה הקריטית - מיקום אימון
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

  {
    id: "frequency",
    question: "כמה פעמים בשבוע תוכל להתאמן?",
    icon: "calendar-week",
    type: "single",
    options: ["2-3 פעמים", "4-5 פעמים", "6+ פעמים"],
    required: true,
    helpText: "תדירות האימונים משפיעה על חלוקת התוכנית",
  },

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

// שאלות דינמיות לשלב האימונים
export const TRAINING_DYNAMIC_QUESTIONS: Question[] = [
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

// ==================== שלב 2: שאלות פרופיל אישי ====================
// Stage 2: Personal profile questions (can be filled later)
export const PROFILE_QUESTIONS: Question[] = [
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
    id: "diet_type",
    question: "האם אתה עוקב אחרי תזונה מסוימת?",
    icon: "food-apple",
    type: "single",
    options: [
      "רגיל - אוכל הכל",
      "צמחוני",
      "טבעוני",
      "ללא גלוטן",
      "דל פחמימות",
      "אחר",
    ],
    required: false,
    helpText: "נתאים המלצות תזונה לסגנון החיים שלך",
  },

  {
    id: "sleep_hours",
    question: "כמה שעות שינה אתה ישן בממוצע?",
    icon: "sleep",
    type: "single",
    options: ["פחות מ-6", "6-7 שעות", "7-8 שעות", "8+ שעות"],
    required: false,
    helpText: "שינה איכותית חיונית להתאוששות",
  },

  {
    id: "stress_level",
    question: "מה רמת הלחץ שלך ביומיום?",
    icon: "emoticon-neutral",
    type: "single",
    options: ["נמוכה", "בינונית", "גבוהה"],
    required: false,
    helpText: "לחץ משפיע על התאוששות ותוצאות",
  },

  {
    id: "water_intake",
    question: "כמה מים אתה שותה ביום?",
    icon: "cup-water",
    type: "single",
    options: ["פחות מליטר", "1-2 ליטר", "2-3 ליטר", "3+ ליטר"],
    required: false,
    helpText: "הידרציה חשובה לביצועים ולהתאוששות",
  },
];

// פונקציות עזר
export function getTrainingQuestions(answers: any): Question[] {
  const allQuestions = [...TRAINING_QUESTIONS];

  console.log("🔍 getTrainingQuestions - בדיקת שאלות דינמיות:", {
    answers,
    location: answers?.location,
    dynamicQuestionsCount: TRAINING_DYNAMIC_QUESTIONS.length,
  });

  TRAINING_DYNAMIC_QUESTIONS.forEach((q) => {
    const shouldInclude = !q.condition || q.condition(answers);
    console.log(`🔍 שאלה דינמית ${q.id}:`, {
      hasCondition: !!q.condition,
      conditionResult: shouldInclude,
      answersForCondition: answers,
    });

    if (shouldInclude) {
      allQuestions.push(q);
    }
  });

  console.log("🔍 getTrainingQuestions - שאלות סופיות:", {
    totalQuestions: allQuestions.length,
    questionIds: allQuestions.map((q) => q.id),
  });

  return allQuestions;
}

export function getProfileQuestions(): Question[] {
  return PROFILE_QUESTIONS;
}

// בדיקה האם המשתמש השלים את שלב האימונים
export function hasCompletedTrainingStage(questionnaire: any): boolean {
  const requiredFields = [
    "age",
    "goal",
    "experience",
    "location",
    "frequency",
    "duration",
  ];

  console.log("🔍 hasCompletedTrainingStage בדיקה:", {
    questionnaire,
    requiredFields,
    results: requiredFields.map((field) => ({
      field,
      exists: questionnaire && questionnaire[field],
      value: questionnaire?.[field],
    })),
  });

  return requiredFields.every((field) => questionnaire && questionnaire[field]);
}

// בדיקה האם המשתמש השלים את הפרופיל האישי
export function hasCompletedProfileStage(questionnaire: any): boolean {
  const profileFields = ["gender", "height", "weight"];

  console.log("🔍 hasCompletedProfileStage בדיקה:", {
    questionnaire,
    profileFields,
    results: profileFields.map((field) => ({
      field,
      value: questionnaire?.[field],
      exists:
        questionnaire && questionnaire[field] ? questionnaire[field] : null,
    })),
  });

  return profileFields.every((field) => questionnaire && questionnaire[field]);
}

// הודעה למשתמש על השלבים
export const QUESTIONNAIRE_STAGES = {
  training: {
    title: "שלב 1: הגדרות אימון",
    subtitle: "נתחיל עם השאלות החשובות ביותר לבניית תוכנית האימונים שלך",
    icon: "dumbbell",
    estimatedTime: "2-3 דקות",
  },
  profile: {
    title: "שלב 2: פרופיל אישי",
    subtitle: "מידע נוסף שיעזור לנו להתאים לך המלצות תזונה ומעקב מתקדם",
    icon: "account-details",
    estimatedTime: "3-4 דקות",
    canSkip: true,
  },
};

// סיכום:
// שלב 1: 6-8 שאלות אימון חיוניות - חובה
// שלב 2: 7 שאלות פרופיל אישי - אופציונלי, ניתן למלא אחר כך
