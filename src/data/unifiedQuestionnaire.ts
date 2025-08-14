/**
 * @file src/data/unifiedQuestionnaire.ts
 * @brief מערכת שאלון אחודה וחדשה - החלפת כל המערכות הקיימות
 * @description Unified questionnaire system to replace all existing questionnaire files
 *
 * 🎯 מטרה: להחליף את כל קבצי השאלון הקיימים במערכת אחת פשוטה ויעילה
 * ✅ תמיכה מלאה בגלילה ו-ScrollView
 * ✅ ממשק פשוט וברור
 * ✅ ציוד מאורגן ונפרד
 * ✅ תמיכה ב-RTL ועברית
 */

import { ImageSourcePropType } from "react-native";
import type { SmartQuestionnaireData } from "../types";
import {
  ALL_EQUIPMENT,
  HOME_EQUIPMENT,
  GYM_EQUIPMENT,
  CARDIO_EQUIPMENT,
  getEquipmentById,
} from "./equipmentData";

// ================== מערכת Cache ואופטימיזציות ==================

/**
 * Cache מהיר לשאלות תכופות
 * Fast cache for frequent questionnaire operations
 */
const QuestionnaireCache = {
  questionsById: new Map<string, Question>(),
  relevantQuestions: new Map<string, Question[]>(),
  equipmentValidation: new Map<string, boolean>(),

  clear() {
    this.questionsById.clear();
    this.relevantQuestions.clear();
    this.equipmentValidation.clear();
  },

  initialize() {
    // Pre-populate questions cache
    UNIFIED_QUESTIONS.forEach((q) => {
      this.questionsById.set(q.id, q);
    });
  },

  getQuestionById(id: string): Question | null {
    if (this.questionsById.size === 0) this.initialize();
    return this.questionsById.get(id) || null;
  },
};

/**
 * Equipment validation using equipmentData.ts
 * אימות ציוד באמצעות מאגר הציוד המרכזי
 */
function validateEquipmentId(equipmentId: string): boolean {
  const cacheKey = equipmentId;
  if (QuestionnaireCache.equipmentValidation.has(cacheKey)) {
    return QuestionnaireCache.equipmentValidation.get(cacheKey)!;
  }

  const isValid = getEquipmentById(equipmentId) !== undefined;
  QuestionnaireCache.equipmentValidation.set(cacheKey, isValid);
  return isValid;
}

/**
 * Smart equipment mapping from questionnaire to equipmentData
 * מיפוי חכם של ציוד מהשאלון למאגר הציוד
 */
function mapQuestionnaireToEquipment(questionnaireIds: string[]): string[] {
  const validEquipment = new Set<string>();

  questionnaireIds.forEach((id) => {
    // Direct mapping for exact matches
    if (validateEquipmentId(id)) {
      validEquipment.add(id);
      return;
    }

    // Special mappings for questionnaire-specific IDs
    const mappings: Record<string, string[]> = {
      mat_available: ["yoga_mat"],
      chair_available: ["chair"], // If available in equipmentData
      free_weights: ["dumbbells", "barbell"],
      bodyweight_only: ["none"],
    };

    if (mappings[id]) {
      mappings[id].forEach((equipId) => {
        if (validateEquipmentId(equipId)) {
          validEquipment.add(equipId);
        }
      });
    }
  });

  return Array.from(validEquipment);
}

// ================== בסיסי - Basic Types ==================

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  image?: ImageSourcePropType | string;
  isDefault?: boolean;
}

export interface Question {
  id: string;
  title: string;
  subtitle?: string;
  question: string;
  helpText?: string;
  icon: string;
  type: "single" | "multiple";
  options: QuestionOption[];
  required?: boolean;
}

// ================== ציוד - Equipment Data ==================

// ציוד ביתי - משקל גוף
export const BODYWEIGHT_OPTIONS: QuestionOption[] = [
  {
    id: "bodyweight_only",
    label: "רק משקל גוף",
    description: "אין חפצים נוספים",
  },
  {
    id: "mat_available",
    label: "מזרון/שטיח",
    description: "לתרגילי רצפה נוחים",
  },
  {
    id: "chair_available",
    label: "כיסא יציב",
    description: "לתרגילי דחיפה וכוח",
  },
  {
    id: "wall_space",
    label: "קיר פנוי",
    description: "לתרגילי קיר ומתיחות",
  },
  {
    id: "stairs_available",
    label: "מדרגות",
    description: "לאימוני קרדיו וכוח רגליים",
  },
  {
    id: "towel_available",
    label: "מגבת",
    description: "להתנגדות ומתיחות",
  },
  {
    id: "water_bottles",
    label: "בקבוקי מים מלאים",
    description: "כמשקולות קלות",
  },
  {
    id: "pillow_available",
    label: "כרית",
    description: "לתמיכה ותרגילי יציבות",
  },
  {
    id: "table_sturdy",
    label: "שולחן חזק",
    description: "לתרגילי שכיבה תמיכה",
  },
  {
    id: "backpack_heavy",
    label: "תיק עם ספרים",
    description: "להוספת משקל לתרגילים",
  },
  {
    id: "water_gallon",
    label: "כד מים גדול",
    description: "כמשקולת כבדה יותר",
  },
  {
    id: "sandbag",
    label: "שק חול/אורז",
    description: "להוספת משקל משתנה",
  },
  {
    id: "tire",
    label: "צמיג רכב",
    description: "לאימוני כוח ופונקציונליים",
  },
];

// ציוד ביתי - מתקדם
export const HOME_EQUIPMENT_OPTIONS: QuestionOption[] = [
  {
    id: "dumbbells",
    label: "משקולות יד",
    description: "מגוון משקלים",
  },
  {
    id: "resistance_bands",
    label: "רצועות התנגדות",
    description: "עמידות שונות",
  },
  {
    id: "kettlebell",
    label: "קטלבל",
    description: "אימון פונקציונלי",
  },
  {
    id: "yoga_mat",
    label: "מזרון יוגה",
    description: "לתרגילי רצפה",
  },
  {
    id: "pullup_bar",
    label: "מתקן מתח",
    description: "למשיכות ותליות",
  },
  {
    id: "foam_roller",
    label: "גליל קצף",
    description: "להתאוששות",
  },
  {
    id: "exercise_ball",
    label: "כדור פיטנס",
    description: "ליציבות וכוח ליבה",
  },
  {
    id: "trx",
    label: "רצועות TRX",
    description: "אימון השעיה",
  },
];

// ציוד חדר כושר
export const GYM_EQUIPMENT_OPTIONS: QuestionOption[] = [
  {
    id: "free_weights",
    label: "משקולות חופשיות",
    description: "משקולות יד ומוטות",
  },
  {
    id: "cable_machine",
    label: "מכונת כבלים",
    description: "תרגילים מגוונים",
  },
  {
    id: "squat_rack",
    label: "מתקן סקוואט",
    description: "לתרגילי רגליים",
  },
  {
    id: "bench_press",
    label: "ספסל דחיפה",
    description: "לתרגילי חזה",
  },
  {
    id: "leg_press",
    label: "מכונת רגליים",
    description: "לחיזוק רגליים",
  },
  {
    id: "lat_pulldown",
    label: "מכונת גב",
    description: "למשיכות גב",
  },
  {
    id: "smith_machine",
    label: "מכונת סמית'",
    description: "תרגילים בטוחים",
  },
  {
    id: "rowing_machine",
    label: "מכונת חתירה",
    description: "קרדיו וכוח",
  },
  {
    id: "treadmill",
    label: "הליכון",
    description: "ריצה והליכה",
  },
  {
    id: "bike",
    label: "אופני כושר",
    description: "קרדיו ורגליים",
  },
];

// אפשרויות דיאטה
export const DIET_OPTIONS: QuestionOption[] = [
  {
    id: "none_diet",
    label: "אין הגבלות",
    description: "אוכל הכל",
  },
  {
    id: "vegetarian",
    label: "צמחוני",
    description: "ללא בשר ודגים",
  },
  {
    id: "vegan",
    label: "טבעוני",
    description: "ללא מוצרים מן החי",
  },
  {
    id: "keto",
    label: "קטוגנית",
    description: "דל פחמימות",
  },
  {
    id: "paleo",
    label: "פליאו",
    description: "מזון טבעי",
  },
];

// ================== השאלות - Questions ==================

export const UNIFIED_QUESTIONS: Question[] = [
  // שאלה 0.1: מין
  {
    id: "gender",
    title: "👤 מה המין שלך?",
    subtitle: "מידע זה יעזור לנו להתאים את התוכנית",
    question: "בחר את המין שלך",
    helpText: "התוכנית תותאם למין שבחרת",
    icon: "👤",
    type: "single",
    options: [
      {
        id: "male",
        label: "זכר",
        description: "תוכנית מותאמת לגברים",
      },
      {
        id: "female",
        label: "נקבה",
        description: "תוכנית מותאמת לנשים",
      },
      {
        id: "prefer_not_to_say",
        label: "מעדיף/ה לא לציין",
        description: "תוכנית כללית",
      },
    ],
  },

  // שאלה 0.2: גיל
  {
    id: "age",
    title: "🎂 כמה אתה בן/בת?",
    subtitle: "הגיל יעזור לנו להתאים את עצימות האימונים",
    question: "בחר את קבוצת הגיל שלך",
    helpText: "האימונים יותאמו לגיל שלך",
    icon: "🎂",
    type: "single",
    options: [
      {
        id: "under_18",
        label: "מתחת ל-18",
        description: "אימונים מותאמים לצעירים",
      },
      {
        id: "18_25",
        label: "18-25",
        description: "אימונים אנרגטיים",
      },
      {
        id: "26_35",
        label: "26-35",
        description: "איזון בין עצימות למניעה",
      },
      {
        id: "36_50",
        label: "36-50",
        description: "דגש על מניעת פציעות",
      },
      {
        id: "51_65",
        label: "51-65",
        description: "שמירה על כושר ותפקוד",
      },
      {
        id: "over_65",
        label: "מעל 65",
        description: "אימונים עדינים ובטוחים",
      },
    ],
  },

  // שאלה 0.3: משקל (אופציונלי)
  {
    id: "weight",
    title: "⚖️ כמה אתה שוקל/ת?",
    subtitle: "מידע זה יעזור לחישוב עומס אימון מדויק (אופציונלי)",
    question: "בחר את טווח המשקל שלך",
    helpText: "המידע יסייע בהתאמת עצימות התרגילים",
    icon: "⚖️",
    type: "single",
    options: [
      {
        id: "under_50",
        label: 'מתחת ל-50 ק"ג',
        description: "משקל קל",
      },
      {
        id: "50_60",
        label: '50-60 ק"ג',
        description: "משקל נמוך-בינוני",
      },
      {
        id: "61_70",
        label: '61-70 ק"ג',
        description: "משקל בינוני",
      },
      {
        id: "71_80",
        label: '71-80 ק"ג',
        description: "משקל בינוני-גבוה",
      },
      {
        id: "81_90",
        label: '81-90 ק"ג',
        description: "משקל גבוה",
      },
      {
        id: "91_100",
        label: '91-100 ק"ג',
        description: "משקל גבוה יותר",
      },
      {
        id: "over_100",
        label: 'מעל 100 ק"ג',
        description: "משקל כבד",
      },
      {
        id: "prefer_not_to_say_weight",
        label: "מעדיף/ה לא לציין",
        description: "תוכנית כללית",
      },
    ],
  },

  // שאלה 0.4: גובה (אופציונלי)
  {
    id: "height",
    title: "📏 מה הגובה שלך?",
    subtitle: "מידע זה יעזור להתאמת תרגילים (אופציונלי)",
    question: "בחר את טווח הגובה שלך",
    helpText: "הגובה משפיע על מנפי תנועה ובחירת תרגילים",
    icon: "📏",
    type: "single",
    options: [
      {
        id: "under_150",
        label: 'מתחת ל-150 ס"מ',
        description: "גובה נמוך",
      },
      {
        id: "150_160",
        label: '150-160 ס"מ',
        description: "גובה נמוך-בינוני",
      },
      {
        id: "161_170",
        label: '161-170 ס"מ',
        description: "גובה בינוני",
      },
      {
        id: "171_180",
        label: '171-180 ס"מ',
        description: "גובה בינוני-גבוה",
      },
      {
        id: "181_190",
        label: '181-190 ס"מ',
        description: "גובה גבוה",
      },
      {
        id: "over_190",
        label: 'מעל 190 ס"מ',
        description: "גובה גבוה מאוד",
      },
      {
        id: "prefer_not_to_say_height",
        label: "מעדיף/ה לא לציין",
        description: "תוכנית כללית",
      },
    ],
  },

  // שאלה 1: מטרת כושר
  {
    id: "fitness_goal",
    title: "🎯 מה המטרה שלך?",
    subtitle: "בחר את המטרה העיקרית שלך",
    question: "איך תרצה להשתפר?",
    helpText: "בחר את המטרה הכי חשובה לך כרגע",
    icon: "🎯",
    type: "single",
    options: [
      {
        id: "lose_weight",
        label: "ירידה במשקל",
        description: "שריפת שומן ויצירת גירעון קלורי",
      },
      {
        id: "build_muscle",
        label: "בניית שריר",
        description: "הגדלת מסת שריר וכוח",
      },
      {
        id: "general_fitness",
        label: "כושר כללי",
        description: "שיפור בריאות וכושר",
      },
      {
        id: "athletic_performance",
        label: "ביצועים ספורטיביים",
        description: "שיפור כוח, מהירות וסיבולת",
      },
    ],
  },

  // שאלה 2: רמת ניסיון
  {
    id: "experience_level",
    title: "💪 איך הניסיון שלך?",
    subtitle: "בחר את הרמה שמתאימה לך",
    question: "כמה ניסיון יש לך באימונים?",
    helpText: "התשובה תקבע את רמת הקושי של התוכנית",
    icon: "💪",
    type: "single",
    options: [
      {
        id: "beginner",
        label: "מתחיל",
        description: "פחות מ-6 חודשים ניסיון",
      },
      {
        id: "intermediate",
        label: "בינוני",
        description: "6 חודשים עד 2 שנים",
      },
      {
        id: "advanced",
        label: "מתקדם",
        description: "יותר מ-2 שנים ניסיון",
      },
    ],
  },

  // שאלה 3: זמינות
  {
    id: "availability",
    title: "📅 כמה זמן יש לך?",
    subtitle: "בחר את הזמינות שלך",
    question: "כמה ימים בשבוע תוכל להתאמן?",
    helpText: "תוכנית תותאם לזמן הפנוי שלך",
    icon: "📅",
    type: "single",
    options: [
      {
        id: "2_days",
        label: "2 ימים בשבוע",
        description: "אימונים קצרים ויעילים",
      },
      {
        id: "3_days",
        label: "3 ימים בשבוע",
        description: "איזון בין אימון למנוחה",
      },
      {
        id: "4_days",
        label: "4 ימים בשבוע",
        description: "אימונים מגוונים ומתקדמים",
      },
      {
        id: "5_days",
        label: "5+ ימים בשבוע",
        description: "אימונים אינטנסיביים",
      },
    ],
  },

  // שאלה 4: משך אימון
  {
    id: "session_duration",
    title: "⏱️ כמה זמן לאימון?",
    subtitle: "בחר את משך האימון המועדף",
    question: "כמה זמן תרצה להקדיש לכל אימון?",
    helpText: "התוכנית תותאם למשך הזמן שבחרת",
    icon: "⏱️",
    type: "single",
    options: [
      {
        id: "15_30_min",
        label: "15-30 דקות",
        description: "אימונים קצרים ואינטנסיביים",
      },
      {
        id: "30_45_min",
        label: "30-45 דקות",
        description: "אימונים סטנדרטיים",
      },
      {
        id: "45_60_min",
        label: "45-60 דקות",
        description: "אימונים מקיפים",
      },
      {
        id: "60_plus_min",
        label: "יותר מ-60 דקות",
        description: "אימונים ארוכים ומפורטים",
      },
    ],
  },

  // שאלה 5: מיקום אימון
  {
    id: "workout_location",
    title: "🏠 איפה תתאמן?",
    subtitle: "בחר את מיקום האימון העיקרי",
    question: "איפה אתה מעדיף להתאמן?",
    helpText: "התוכנית תותאם למיקום ולציוד הזמין",
    icon: "🏠",
    type: "single",
    options: [
      {
        id: "home_bodyweight",
        label: "בית - משקל גוף",
        description: "אימונים ביתיים ללא ציוד מיוחד",
      },
      {
        id: "home_equipment",
        label: "בית - עם ציוד",
        description: "יש לי ציוד ביתי לאימונים",
      },
      {
        id: "gym",
        label: "חדר כושר",
        description: "גישה לחדר כושר מצויד",
      },
      {
        id: "mixed",
        label: "משולב",
        description: "שילוב של בית וחדר כושר",
      },
    ],
  },

  // שאלה 6: ציוד ביתי (רק אם בחר בית)
  {
    id: "bodyweight_equipment",
    title: "🏠 איזה חפצים יש לך בבית?",
    subtitle: "בחר את כל החפצים הזמינים",
    question: "איזה חפצים ביתיים יש לך לאימונים?",
    helpText: "בחר את כל האפשרויות הזמינות לך",
    icon: "🏠",
    type: "multiple",
    options: BODYWEIGHT_OPTIONS,
  },

  // שאלה 7: ציוד ביתי מתקדם (רק אם בחר בית עם ציוד)
  {
    id: "home_equipment",
    title: "🏋️ איזה ציוד יש לך בבית?",
    subtitle: "בחר את כל הציוד הזמין",
    question: "איזה ציוד כושר יש לך בבית?",
    helpText: "בחר את כל הציוד שיש לך גישה אליו",
    icon: "🏋️",
    type: "multiple",
    options: HOME_EQUIPMENT_OPTIONS,
  },

  // שאלה 8: ציוד חדר כושר (רק אם בחר חדר כושר)
  {
    id: "gym_equipment",
    title: "🏟️ איזה ציוד יש בחדר הכושר?",
    subtitle: "בחר את הציוד הזמין בחדר הכושר שלך",
    question: "איזה ציוד זמין בחדר הכושר שלך?",
    helpText: "בחר את כל הציוד שאתה יכול להשתמש בו",
    icon: "🏟️",
    type: "multiple",
    options: GYM_EQUIPMENT_OPTIONS,
  },

  // שאלה 9: העדפות דיאטה
  {
    id: "diet_preferences",
    title: "🥗 איך אתה אוכל?",
    subtitle: "בחר את סוג התזונה שלך",
    question: "איזה סוג תזונה אתה מעדיף?",
    helpText: "התוכנית תכלול המלצות תזונה מתאימות",
    icon: "🥗",
    type: "single",
    options: DIET_OPTIONS,
  },
];

// ================== מנהל השאלון - Questionnaire Manager ==================

export interface QuestionnaireAnswer {
  questionId: string;
  answer: QuestionOption | QuestionOption[];
  timestamp: string;
}

export interface QuestionnaireResults {
  answers: QuestionnaireAnswer[];
  completedAt: string;
  totalQuestions: number;
  answeredQuestions: number;
}

export class UnifiedQuestionnaireManager {
  private questions: Question[] = UNIFIED_QUESTIONS;
  private currentQuestionIndex: number = 0;
  private answers: Map<string, QuestionnaireAnswer> = new Map();
  private history: number[] = [];

  constructor() {
    const DEBUG_UQM = false;
    if (DEBUG_UQM) {
      console.warn("🎯 UnifiedQuestionnaireManager initialized");
    }
    // Initialize cache on first use
    QuestionnaireCache.initialize();
  }

  // ================== בסיסי - Core Navigation ==================

  // קבל שאלה נוכחית
  getCurrentQuestion(): Question | null {
    const question = this.questions[this.currentQuestionIndex];

    // בדוק אם השאלה מותנית
    if (question && this.shouldSkipQuestion(question)) {
      // דלג לשאלה הבאה
      if (this.nextQuestion()) {
        return this.getCurrentQuestion();
      }
      return null;
    }

    return question || null;
  }

  // בדוק אם צריך לדלג על שאלה
  private shouldSkipQuestion(question: Question): boolean {
    const workoutLocationAnswer = this.answers.get("workout_location");

    if (!workoutLocationAnswer) return false;

    const location = Array.isArray(workoutLocationAnswer.answer)
      ? workoutLocationAnswer.answer[0]?.id
      : workoutLocationAnswer.answer.id;

    // דלג על שאלות ציוד לא רלוונטיות
    if (
      question.id === "bodyweight_equipment" &&
      location !== "home_bodyweight"
    ) {
      return true;
    }
    if (question.id === "home_equipment" && location !== "home_equipment") {
      return true;
    }
    if (
      question.id === "gym_equipment" &&
      location !== "gym" &&
      location !== "mixed"
    ) {
      return true;
    }

    return false;
  }

  // ענה על שאלה
  answerQuestion(
    questionId: string,
    answer: QuestionOption | QuestionOption[]
  ): void {
    const questionAnswer: QuestionnaireAnswer = {
      questionId,
      answer,
      timestamp: new Date().toISOString(),
    };

    this.answers.set(questionId, questionAnswer);
    const DEBUG_UQM = false;
    if (DEBUG_UQM) {
      console.warn(`✅ Answered question: ${questionId}`, answer);
    }
  }

  // עבור לשאלה הבאה
  nextQuestion(): boolean {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.history.push(this.currentQuestionIndex);
      this.currentQuestionIndex++;
      return true;
    }
    return false;
  }

  // חזור לשאלה הקודמת
  previousQuestion(): boolean {
    if (this.history.length > 0) {
      this.currentQuestionIndex = this.history.pop()!;
      return true;
    }
    return false;
  }

  // מעבר לשאלה האחרונה שנענתה
  goToLastAnswered(): boolean {
    if (this.answers.size === 0) return false;
    const lastAnsweredId = Array.from(this.answers.keys()).pop();
    if (!lastAnsweredId) return false;
    const idx = this.questions.findIndex((q) => q.id === lastAnsweredId);
    if (idx >= 0) {
      this.currentQuestionIndex = idx;
      return true;
    }
    return false;
  }

  // חישוב אינדקס השאלה הראשונה שלא נענתה (ורלוונטית)
  private getFirstUnansweredIndex(): number {
    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      if (this.shouldSkipQuestion(q)) continue;
      if (!this.answers.has(q.id)) return i;
    }
    // אם כולן נענו או לא נמצאה – החזר אחרונה
    return Math.max(0, this.questions.length - 1);
  }

  // מעבר לשאלה הבאה שלא נענתה
  goToNextUnanswered(): boolean {
    const idx = this.getFirstUnansweredIndex();
    if (idx >= 0) {
      this.currentQuestionIndex = idx;
      return true;
    }
    return false;
  }

  // בדוק אם ניתן לחזור אחורה
  canGoBack(): boolean {
    return this.history.length > 0;
  }

  // קבל התקדמות
  getProgress(): number {
    const totalRelevantQuestions = this.getTotalRelevantQuestions();
    return totalRelevantQuestions > 0
      ? (this.answers.size / totalRelevantQuestions) * 100
      : 0;
  }

  // קבל מספר השאלות הרלוונטיות
  private getTotalRelevantQuestions(): number {
    // ספור רק שאלות רלוונטיות בהתבסס על תשובות
    let count = 0;

    for (const question of this.questions) {
      if (!this.shouldSkipQuestion(question)) {
        count++;
      }
    }

    return Math.max(count, 5); // לפחות 5 שאלות
  }

  // קבל כל התשובות
  getAllAnswers(): QuestionnaireAnswer[] {
    return Array.from(this.answers.values());
  }

  // קבל שאלה לפי ID
  getQuestionById(questionId: string): Question | null {
    return QuestionnaireCache.getQuestionById(questionId);
  }

  // ================== פונקציות עזר מתקדמות - Advanced Utils ==================

  /**
   * Validate answers for completeness and correctness
   * אימות תשובות לשלמות ונכונות
   */
  validateAnswers(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required questions
    const requiredQuestions = this.questions.filter(
      (q) => q.required && !this.shouldSkipQuestion(q)
    );
    requiredQuestions.forEach((q) => {
      if (!this.answers.has(q.id)) {
        errors.push(`שאלה נדרשת לא נענתה: ${q.title}`);
      }
    });

    // Validate equipment selections
    this.answers.forEach((answer, questionId) => {
      if (questionId.includes("equipment")) {
        const answerIds = Array.isArray(answer.answer)
          ? answer.answer.map((a) => a.id)
          : [answer.answer.id];

        answerIds.forEach((id) => {
          if (!validateEquipmentId(id) && id !== "none") {
            warnings.push(`ציוד לא מוכר: ${id}`);
          }
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get questionnaire statistics and analytics
   * קבלת סטטיסטיקות וניתוחים של השאלון
   */
  getAnalytics(): {
    completionRate: number;
    timeSpent: number;
    equipmentCount: number;
    recommendedProfile: string;
    strengthAreas: string[];
  } {
    const totalQuestions = this.getTotalRelevantQuestions();
    const answeredQuestions = this.answers.size;
    const completionRate =
      totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    // Calculate estimated time spent (rough estimate)
    const timeSpent = this.answers.size * 30; // 30 seconds per question average

    // Count unique equipment
    const equipment = this.normalizeEquipment();
    const equipmentCount = equipment.length;

    // Determine recommended profile
    const experience = this.getAnswerId("experience_level") || "beginner";
    const goal = this.getAnswerId("fitness_goal") || "general_fitness";
    const location = this.getAnswerId("workout_location") || "home_bodyweight";

    const recommendedProfile = `${experience}_${goal}_${location}`;

    // Identify strength areas based on answers
    const strengthAreas: string[] = [];
    if (equipmentCount > 3) strengthAreas.push("equipment_variety");
    if (this.getAnswerId("availability") === "5_days")
      strengthAreas.push("high_commitment");
    if (this.getAnswerId("session_duration") === "60_plus_min")
      strengthAreas.push("endurance_focused");

    return {
      completionRate,
      timeSpent,
      equipmentCount,
      recommendedProfile,
      strengthAreas,
    };
  }

  /**
   * Get personalized recommendations based on answers
   * קבלת המלצות מותאמות אישית על בסיס התשובות
   */
  getPersonalizedRecommendations(): {
    workoutFrequency: string;
    sessionDuration: string;
    primaryFocus: string[];
    equipmentSuggestions: string[];
    nutritionTips: string[];
  } {
    const goal = this.getAnswerId("fitness_goal");
    const experience = this.getAnswerId("experience_level");
    const availability = this.getAnswerId("availability");
    const equipment = this.normalizeEquipment();

    // Workout frequency recommendations
    const frequencyMap: Record<string, string> = {
      beginner: "2-3 ימים בשבוע להתחלה",
      intermediate: "3-4 ימים בשבוע לקידום",
      advanced: "4-5 ימים בשבוע לביצועים מיטביים",
    };

    // Primary focus areas
    const focusMap: Record<string, string[]> = {
      lose_weight: ["קרדיו", "HIIT", "שריפת קלוריות"],
      build_muscle: ["כוח", "בניית מסה", "חלבונים"],
      general_fitness: ["איזון", "כושר כללי", "מגוון תרגילים"],
      athletic_performance: ["ביצועים", "מהירות", "כוח פונקציונלי"],
    };

    // Equipment suggestions based on current equipment and goals
    const currentEquipment = new Set(equipment);
    const equipmentSuggestions: string[] = [];

    if (goal === "build_muscle" && !currentEquipment.has("dumbbells")) {
      equipmentSuggestions.push("משקולות יד למגוון תרגילים");
    }
    if (goal === "lose_weight" && !currentEquipment.has("jump_rope")) {
      equipmentSuggestions.push("חבל קפיצה לקרדיו אפקטיבי");
    }

    // Nutrition tips based on goal
    const nutritionMap: Record<string, string[]> = {
      lose_weight: ["גירעון קלורי מתון", "חלבון גבוה", "הרבה ירקות"],
      build_muscle: ["עודף קלורי קל", "חלבון גבוה", "פחמימות סביב אימונים"],
      general_fitness: ["תזונה מאוזנת", "הידרציה טובה", "מגוון מזונות"],
      athletic_performance: [
        "תזמון תזונה",
        "התאוששות מהירה",
        "אנרגיה בזמן אימון",
      ],
    };

    return {
      workoutFrequency:
        frequencyMap[experience || "beginner"] || "התאמה אישית נדרשת",
      sessionDuration:
        this.getAnswerId("session_duration") || "30-45 דקות מומלץ",
      primaryFocus: focusMap[goal || "general_fitness"] || ["כושר כללי"],
      equipmentSuggestions,
      nutritionTips: nutritionMap[goal || "general_fitness"] || [
        "תזונה מאוזנת",
      ],
    };
  }

  // קבל תוצאות מלאות
  getResults(): QuestionnaireResults {
    return {
      answers: this.getAllAnswers(),
      completedAt: new Date().toISOString(),
      totalQuestions: this.getTotalRelevantQuestions(),
      answeredQuestions: this.answers.size,
    };
  }

  // בדוק אם השאלון הושלם
  isCompleted(): boolean {
    return (
      this.currentQuestionIndex >= this.questions.length - 1 &&
      this.answers.size >= this.getTotalRelevantQuestions()
    );
  }

  // איפוס השאלון
  reset(): void {
    this.currentQuestionIndex = 0;
    this.answers.clear();
    this.history = [];
    console.warn("🔄 Questionnaire reset"); // ✅ שונה ל-console.warn
  }

  // ================== פונקציות עזר פנימיות - Internal Helper Functions ==================

  // עזר: קבל מזהי תשובה לשאלה (מערך)
  private getAnswerIds(questionId: string): string[] {
    const ans = this.answers.get(questionId)?.answer;
    if (!ans) return [];
    return Array.isArray(ans) ? ans.map((o) => o.id) : [ans.id];
  }

  // עזר: קבל מזהה יחיד (אם יש)
  private getAnswerId(questionId: string): string | undefined {
    return this.getAnswerIds(questionId)[0];
  }

  // נרמול ציוד לפורמט string[] אחיד לשאר האפליקציה
  private normalizeEquipment(): string[] {
    const location = this.getAnswerId("workout_location");
    const bodyweightIds = new Set(this.getAnswerIds("bodyweight_equipment"));
    const homeIds = new Set(this.getAnswerIds("home_equipment"));
    const gymIds = new Set(this.getAnswerIds("gym_equipment"));

    const result = new Set<string>();

    // ✅ תיקון חשוב: ודא שתמיד יש ציוד זמין, גם אם המשתמש לא בחר כלום
    // משקל גוף — הוסף דגל כללי אם זה המיקום העיקרי או אם אין ציוד אחר
    if (
      location === "home_bodyweight" ||
      (homeIds.size === 0 && gymIds.size === 0)
    ) {
      result.add("none"); // ✅ תואם לתיקון ב-workoutDataService - "none" עבור משקל גוף
    }

    // ✅ מיפוי חכם באמצעות mapQuestionnaireToEquipment
    const bodyweightEquipment = mapQuestionnaireToEquipment(
      Array.from(bodyweightIds)
    );
    const homeEquipment = mapQuestionnaireToEquipment(Array.from(homeIds));
    const gymEquipment = mapQuestionnaireToEquipment(Array.from(gymIds));

    // הוסף את כל הציוד המתואם
    [...bodyweightEquipment, ...homeEquipment, ...gymEquipment].forEach(
      (eq) => {
        if (eq && validateEquipmentId(eq)) {
          result.add(eq);
        }
      }
    );

    // ✅ תיקון חשוב: ודא שתמיד יש לפחות ציוד אחד
    if (result.size === 0) {
      result.add("none"); // ברירת מחדל לתרגילי משקל גוף
    }

    const equipmentArray = Array.from(result);
    console.warn("🔧 Equipment normalized (smart):", equipmentArray); // ✅ דיבוג לעקוב אחר הציוד

    return equipmentArray;
  }

  // ================== יצואים מתקדמים - Advanced Exports ==================

  // יצוא לשכבת הנתונים החכמה (SmartQuestionnaireData)
  toSmartQuestionnaireData(): SmartQuestionnaireData {
    const goalsId = this.getAnswerId("fitness_goal");
    const experienceId = this.getAnswerId("experience_level");
    const availabilityId = this.getAnswerId("availability");
    const durationId = this.getAnswerId("session_duration");
    const locationId = this.getAnswerId("workout_location");
    const dietId = this.getAnswerId("diet_preferences");

    // ✅ נתונים אישיים חדשים
    const genderId = this.getAnswerId("gender");
    const ageId = this.getAnswerId("age");
    const weightId = this.getAnswerId("weight");
    const heightId = this.getAnswerId("height");

    const equipment = this.normalizeEquipment();

    return {
      answers: {
        // ✅ נתונים אישיים - עכשיו נאספים בשאלון המאוחד
        gender: genderId,
        age: ageId,
        weight: weightId,
        height: heightId,
        // נתונים קיימים
        fitnessLevel: experienceId,
        goals: goalsId ? [goalsId] : [],
        equipment,
        availability: availabilityId ? [availabilityId] : [],
        sessionDuration: durationId,
        workoutLocation: locationId,
        nutrition: dietId ? [dietId] : [],
      },
      metadata: {
        completedAt: new Date().toISOString(),
        version: "2.2", // ✅ עדכון גרסה עם השיפורים החדשים
        sessionId: `unified_${Date.now()}`,
        completionTime: Math.max(60, this.answers.size * 10),
        questionsAnswered: this.answers.size,
        totalQuestions: this.getTotalRelevantQuestions(),
        deviceInfo: {
          platform: "mobile",
          screenWidth: 0,
          screenHeight: 0,
        },
        // ✅ מטאדטה מתקדמת חדשה
        analytics: this.getAnalytics(),
        validation: this.validateAnswers(),
        recommendations: this.getPersonalizedRecommendations(),
      },
    } as SmartQuestionnaireData;
  }

  /**
   * Export to comprehensive user profile format
   * יצוא לפורמט פרופיל משתמש מקיף
   */
  toUserProfile(): {
    personal: Record<string, any>;
    fitness: Record<string, any>;
    preferences: Record<string, any>;
    equipment: string[];
    analytics: Record<string, any>;
    recommendations: Record<string, any>;
  } {
    const smart = this.toSmartQuestionnaireData();
    const analytics = this.getAnalytics();
    const recommendations = this.getPersonalizedRecommendations();

    return {
      personal: {
        gender: smart.answers.gender,
        age: smart.answers.age,
        weight: smart.answers.weight,
        height: smart.answers.height,
      },
      fitness: {
        level: smart.answers.fitnessLevel,
        goals: smart.answers.goals,
        availability: smart.answers.availability,
        sessionDuration: smart.answers.sessionDuration,
        location: smart.answers.workoutLocation,
      },
      preferences: {
        nutrition: smart.answers.nutrition,
        workoutLocation: smart.answers.workoutLocation,
      },
      equipment: smart.answers.equipment || [],
      analytics,
      recommendations,
    };
  }

  /**
   * Export to JSON format for backup/restore
   * יצוא לפורמט JSON לגיבוי/שחזור
   */
  toJSON(): string {
    return JSON.stringify(
      {
        version: "2.2",
        timestamp: new Date().toISOString(),
        questionnaire: {
          answers: Array.from(this.answers.entries()),
          currentIndex: this.currentQuestionIndex,
          history: this.history,
        },
        analytics: this.getAnalytics(),
        validation: this.validateAnswers(),
      },
      null,
      2
    );
  }

  /**
   * Restore from JSON backup
   * שחזור מגיבוי JSON
   */
  fromJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.version && data.questionnaire) {
        this.answers = new Map(data.questionnaire.answers);
        this.currentQuestionIndex = data.questionnaire.currentIndex || 0;
        this.history = data.questionnaire.history || [];
        return true;
      }
    } catch (error) {
      console.warn("Failed to restore from JSON:", error);
    }
    return false;
  }

  // יצוא לשכבת תאימות לשאלון הישן (למסכי פרופיל ישנים)
  toLegacyQuestionnaire(): Record<string, unknown> {
    const smart = this.toSmartQuestionnaireData();
    const a = smart.answers;
    return {
      // ✅ נתונים אישיים זמינים מהשאלון החדש
      gender: a.gender,
      age: a.age,
      weight: a.weight,
      height: a.height,
      // נתונים קיימים
      equipment: a.equipment,
      available_equipment: a.equipment,
      goal: a.goals,
      experience: a.fitnessLevel,
      location: a.workoutLocation,
      frequency: a.availability?.[0],
      duration: a.sessionDuration,
      nutrition: a.nutrition,
    };
  }
}

export default UnifiedQuestionnaireManager;

// ===============================================
// 🌟 Global Utility Exports - יצוא פונקציות עזר גלובליות
// ===============================================

/**
 * Create questionnaire manager with pre-filled demo data
 * יצירת מנהל שאלון עם נתוני דמו מוכנים
 */
export function createDemoQuestionnaireManager(): UnifiedQuestionnaireManager {
  const manager = new UnifiedQuestionnaireManager();

  // Pre-fill with realistic demo answers
  manager.answerQuestion("gender", { id: "male", label: "זכר" });
  manager.answerQuestion("age", { id: "26_35", label: "26-35" });
  manager.answerQuestion("fitness_goal", {
    id: "build_muscle",
    label: "בניית שריר",
  });
  manager.answerQuestion("experience_level", {
    id: "intermediate",
    label: "בינוני",
  });
  manager.answerQuestion("availability", {
    id: "3_days",
    label: "3 ימים בשבוע",
  });
  manager.answerQuestion("session_duration", {
    id: "45_60_min",
    label: "45-60 דקות",
  });
  manager.answerQuestion("workout_location", {
    id: "home_equipment",
    label: "בית - עם ציוד",
  });
  manager.answerQuestion("home_equipment", [
    { id: "dumbbells", label: "משקולות יד" },
    { id: "resistance_bands", label: "רצועות התנגדות" },
    { id: "yoga_mat", label: "מזרון יוגה" },
  ]);
  manager.answerQuestion("diet_preferences", {
    id: "none_diet",
    label: "אין הגבלות",
  });

  return manager;
}

/**
 * Validate equipment compatibility with questionnaire
 * אימות תאימות ציוד עם השאלון
 */
export function validateQuestionnaireEquipment(equipmentList: string[]): {
  valid: string[];
  invalid: string[];
  suggestions: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];
  const suggestions: string[] = [];

  equipmentList.forEach((eq) => {
    if (validateEquipmentId(eq)) {
      valid.push(eq);
    } else {
      invalid.push(eq);
      // Suggest alternatives
      if (eq === "weights") suggestions.push("dumbbells");
      if (eq === "bands") suggestions.push("resistance_bands");
    }
  });

  return { valid, invalid, suggestions };
}

/**
 * Get equipment categories for questionnaire filtering
 * קבלת קטגוריות ציוד לסינון בשאלון
 */
export function getQuestionnaireEquipmentCategories(): {
  bodyweight: QuestionOption[];
  home: QuestionOption[];
  gym: QuestionOption[];
} {
  return {
    bodyweight: BODYWEIGHT_OPTIONS,
    home: HOME_EQUIPMENT_OPTIONS,
    gym: GYM_EQUIPMENT_OPTIONS,
  };
}

// Export all question constants for external use
// (Already exported above - no need to re-export)
