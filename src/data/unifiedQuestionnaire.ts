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
    label: "גליל פואם",
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
    console.log("🎯 UnifiedQuestionnaireManager initialized");
  }

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
    console.log(`✅ Answered question: ${questionId}`, answer);
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
    return this.questions.find((q) => q.id === questionId) || null;
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
    console.log("🔄 Questionnaire reset");
  }
}

export default UnifiedQuestionnaireManager;
