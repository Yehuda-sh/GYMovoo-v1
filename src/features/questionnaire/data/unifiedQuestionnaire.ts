// cspell:ignore מזרון פיטנס קטוגנית שריפת
/**
 * @file src/features/questionnaire/data/unifiedQuestionnaire.ts
 * @description מערכת שאלון אחודה ופשוטה
 * Unified questionnaire system
 */

import {
  Question,
  QuestionOption,
  QuestionnaireAnswer,
  QuestionnaireResults,
  QuestionnaireData,
  QUESTIONNAIRE_VERSION,
} from "../types";
import { wrapTextWithEmoji } from "../../../utils/rtlHelpers";

// ================== אפשרויות השאלון ==================

const BODYWEIGHT_OPTIONS: QuestionOption[] = [
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
  { id: "wall_space", label: "קיר פנוי", description: "לתרגילי קיר ומתיחות" },
  {
    id: "stairs_available",
    label: "מדרגות",
    description: "לאימוני קרדיו וכוח רגליים",
  },
  {
    id: "water_bottles",
    label: "בקבוקי מים מלאים",
    description: "כמשקולות קלות",
  },
];

const HOME_EQUIPMENT_OPTIONS: QuestionOption[] = [
  { id: "dumbbells", label: "משקולות יד", description: "מגוון משקלים" },
  {
    id: "resistance_bands",
    label: "רצועות התנגדות",
    description: "עמידות שונות",
  },
  { id: "kettlebell", label: "קטלבל", description: "אימון פונקציונלי" },
  { id: "yoga_mat", label: "מזרון יוגה", description: "לתרגילי רצפה" },
  { id: "pullup_bar", label: "מתקן מתח", description: "למשיכות ותליות" },
  {
    id: "exercise_ball",
    label: "כדור פיטנס",
    description: "ליציבות וכוח ליבה",
  },
  { id: "trx", label: "רצועות TRX", description: "אימון השעיה" },
];

const GYM_EQUIPMENT_OPTIONS: QuestionOption[] = [
  {
    id: "free_weights",
    label: "משקולות חופשיות",
    description: "משקולות יד ומוטות",
  },
  { id: "cable_machine", label: "מכונת כבלים", description: "תרגילים מגוונים" },
  { id: "squat_rack", label: "מתקן סקוואט", description: "לתרגילי רגליים" },
  { id: "bench_press", label: "ספסל דחיפה", description: "לתרגילי חזה" },
  { id: "leg_press", label: "מכונת רגליים", description: "לחיזוק רגליים" },
  { id: "lat_pulldown", label: "מכונת גב", description: "למשיכות גב" },
  { id: "rowing_machine", label: "מכונת חתירה", description: "קרדיו וכוח" },
  { id: "treadmill", label: "הליכון", description: "ריצה והליכה" },
  { id: "bike", label: "אופני כושר", description: "קרדיו ורגליים" },
];

const DIET_OPTIONS: QuestionOption[] = [
  { id: "none_diet", label: "אין הגבלות", description: "אוכל הכל" },
  { id: "vegetarian", label: "צמחוני", description: "ללא בשר ודגים" },
  { id: "vegan", label: "טבעוני", description: "ללא מוצרים מן החי" },
  { id: "keto", label: "קטוגנית", description: "דל פחמימות" },
  { id: "paleo", label: "פליאו", description: "מזון טבעי" },
];

// ================== השאלות ==================

export const UNIFIED_QUESTIONS: Question[] = [
  {
    id: "gender",
    title: wrapTextWithEmoji("מה המין שלך?", "👤"),
    subtitle: "מידע זה יעזור לנו להתאים את התוכנית",
    question: "בחר את המין שלך",
    helpText: "התוכנית תותאם למין שבחרת",
    icon: "👤",
    type: "single",
    options: [
      { id: "male", label: "זכר", description: "תוכנית מותאמת לגברים" },
      { id: "female", label: "נקבה", description: "תוכנית מותאמת לנשים" },
      {
        id: "prefer_not_to_say",
        label: "מעדיף/ה לא לציין",
        description: "תוכנית כללית",
      },
    ],
  },
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
      { id: "18_25", label: "18-25", description: "אימונים אנרגטיים" },
      { id: "26_35", label: "26-35", description: "איזון בין עצימות למניעה" },
      { id: "36_50", label: "36-50", description: "דגש על מניעת פציעות" },
      { id: "51_65", label: "51-65", description: "שמירה על כושר ותפקוד" },
      { id: "over_65", label: "מעל 65", description: "אימונים עדינים ובטוחים" },
    ],
  },
  {
    id: "weight",
    title: wrapTextWithEmoji("כמה אתה שוקל/ת?", "⚖️"),
    subtitle: "מידע זה יעזור לחישוב עומס אימון מדויק (אופציונלי)",
    question: "בחר את טווח המשקל שלך",
    helpText: "המידע יסייע בהתאמת עצימות התרגילים",
    icon: "⚖️",
    type: "single",
    options: [
      { id: "under_50", label: 'מתחת ל-50 ק"ג', description: "משקל קל" },
      { id: "50_60", label: '50-60 ק"ג', description: "משקל נמוך-בינוני" },
      { id: "61_70", label: '61-70 ק"ג', description: "משקל בינוני" },
      { id: "71_80", label: '71-80 ק"ג', description: "משקל בינוני-גבוה" },
      { id: "81_90", label: '81-90 ק"ג', description: "משקל גבוה" },
      { id: "91_100", label: '91-100 ק"ג', description: "משקל גבוה יותר" },
      { id: "over_100", label: 'מעל 100 ק"ג', description: "משקל כבד" },
      {
        id: "prefer_not_to_say_weight",
        label: "מעדיף/ה לא לציין",
        description: "תוכנית כללית",
      },
    ],
  },
  {
    id: "height",
    title: "📏 מה הגובה שלך?",
    subtitle: "מידע זה יעזור להתאמת תרגילים (אופציונלי)",
    question: "בחר את טווח הגובה שלך",
    helpText: "הגובה משפיע על מנפי תנועה ובחירת תרגילים",
    icon: "📏",
    type: "single",
    options: [
      { id: "under_150", label: 'מתחת ל-150 ס"מ', description: "גובה נמוך" },
      { id: "150_160", label: '150-160 ס"מ', description: "גובה נמוך-בינוני" },
      { id: "161_170", label: '161-170 ס"מ', description: "גובה בינוני" },
      { id: "171_180", label: '171-180 ס"מ', description: "גובה בינוני-גבוה" },
      { id: "181_190", label: '181-190 ס"מ', description: "גובה גבוה" },
      { id: "over_190", label: 'מעל 190 ס"מ', description: "גובה גבוה מאוד" },
      {
        id: "prefer_not_to_say_height",
        label: "מעדיף/ה לא לציין",
        description: "תוכנית כללית",
      },
    ],
  },
  {
    id: "fitness_goal",
    title: wrapTextWithEmoji("מה המטרה שלך?", "🎯"),
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
  {
    id: "experience_level",
    title: wrapTextWithEmoji("איך הניסיון שלך?", "💪"),
    subtitle: "בחר את הרמה שמתאימה לך",
    question: "כמה ניסיון יש לך באימונים?",
    helpText: "התשובה תקבע את רמת הקושי של התוכנית",
    icon: "💪",
    type: "single",
    options: [
      { id: "beginner", label: "מתחיל", description: "פחות מ-6 חודשים ניסיון" },
      {
        id: "intermediate",
        label: "בינוני",
        description: "יש ניסיון בסיסי",
      },
      { id: "advanced", label: "מתקדם", description: "יותר מ-2 שנים ניסיון" },
    ],
  },
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
  {
    id: "session_duration",
    title: wrapTextWithEmoji("כמה זמן לאימון?", "⏱️"),
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
      { id: "45_60_min", label: "45-60 דקות", description: "אימונים מקיפים" },
      {
        id: "60_plus_min",
        label: "יותר מ-60 דקות",
        description: "אימונים ארוכים ומפורטים",
      },
    ],
  },
  {
    id: "workout_location",
    title: wrapTextWithEmoji("איפה תתאמן?", "🏠"),
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
      { id: "gym", label: "חדר כושר", description: "גישה לחדר כושר מצויד" },
      { id: "mixed", label: "משולב", description: "שילוב של בית וחדר כושר" },
    ],
  },
  {
    id: "bodyweight_equipment",
    title: wrapTextWithEmoji("איזה חפצים יש לך בבית?", "🏠"),
    subtitle: "בחר את כל החפצים הזמינים",
    question: "איזה חפצים ביתיים יש לך לאימונים?",
    helpText: "בחר את כל האפשרויות הזמינות לך",
    icon: "🏠",
    type: "multiple",
    options: BODYWEIGHT_OPTIONS,
  },
  {
    id: "home_equipment",
    title: wrapTextWithEmoji("איזה ציוד יש לך בבית?", "🏋️"),
    subtitle: "בחר את כל הציוד הזמין",
    question: "איזה ציוד כושר יש לך בבית?",
    helpText: "בחר את כל הציוד שיש לך גישה אליו",
    icon: "🏋️",
    type: "multiple",
    options: HOME_EQUIPMENT_OPTIONS,
  },
  {
    id: "gym_equipment",
    title: wrapTextWithEmoji("איזה ציוד יש בחדר הכושר?", "🏟️"),
    subtitle: "בחר את הציוד הזמין בחדר הכושר שלך",
    question: "איזה ציוד זמין בחדר הכושר שלך?",
    helpText: "בחר את כל הציוד שאתה יכול להשתמש בו",
    icon: "🏟️",
    type: "multiple",
    options: GYM_EQUIPMENT_OPTIONS,
  },
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

// Helper function to get equipment by ID
export function getEquipmentById(id: string) {
  const allEquipment = [
    ...BODYWEIGHT_OPTIONS,
    ...HOME_EQUIPMENT_OPTIONS,
    ...GYM_EQUIPMENT_OPTIONS,
  ];
  return allEquipment.find((equipment) => equipment.id === id) || null;
}

// ================== מנהל השאלון ==================

export class UnifiedQuestionnaireManager {
  private questions: Question[] = UNIFIED_QUESTIONS;
  private currentQuestionIndex: number = 0;
  private answers: Map<string, QuestionnaireAnswer> = new Map();
  private history: number[] = [];

  /**
   * מאתר את האינדקס הראשון לשאלה רלוונטית (שאינה מדולגת) החל מ־startIndex
   * אם לא נמצאה – מחזיר this.questions.length
   */
  private getFirstRelevantIndex(startIndex: number): number {
    let idx = Math.max(0, startIndex);
    while (idx < this.questions.length) {
      const q = this.questions[idx];
      if (!q) break;
      if (this.shouldSkipQuestion(q)) {
        idx += 1;
        continue;
      }
      break;
    }
    return idx;
  }

  /**
   * מבט לרשומה הנוכחית (ללא שינוי state)
   */
  private peekCurrentQuestion(): Question | null {
    const idx = this.getFirstRelevantIndex(this.currentQuestionIndex);
    if (idx >= this.questions.length) return null;
    const q = this.questions[idx]; // Question | undefined
    return q ?? null; // ממיר ל- Question | null
  }

  // קבל שאלה נוכחית
  getCurrentQuestion(): Question | null {
    return this.peekCurrentQuestion();
  }

  // בדוק אם צריך לדלג על שאלה
  private shouldSkipQuestion(question: Question): boolean {
    const workoutLocationAnswer = this.answers.get("workout_location");
    if (!workoutLocationAnswer) return false;

    const location = Array.isArray(workoutLocationAnswer.answer)
      ? workoutLocationAnswer.answer[0]?.id
      : workoutLocationAnswer.answer.id;

    if (
      question.id === "bodyweight_equipment" &&
      location !== "home_bodyweight"
    )
      return true;
    if (question.id === "home_equipment" && location !== "home_equipment")
      return true;
    if (
      question.id === "gym_equipment" &&
      location !== "gym" &&
      location !== "mixed"
    )
      return true;

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
      const lastIndex = this.history.pop();
      if (lastIndex !== undefined) {
        this.currentQuestionIndex = lastIndex;
        return true;
      }
    }
    return false;
  }

  // בדוק אם ניתן לחזור אחורה
  canGoBack(): boolean {
    return this.history.length > 0;
  }

  // קבל האינדקס הנוכחי
  getCurrentQuestionIndex(): number {
    return this.currentQuestionIndex;
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
    // Return the total number of questions in the UNIFIED_QUESTIONS array
    // This ensures all questions are considered when calculating progress and completion
    return this.questions.length;
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
    // מהי השאלה הרלוונטית הנוכחית?
    const current = this.peekCurrentQuestion();
    if (!current) {
      // אין שאלות רלוונטיות נוספות
      return true;
    }

    // האם יש תשובה לשאלה הנוכחית?
    if (!this.answers.has(current.id)) {
      return false;
    }

    // חפש שאלה רלוונטית הבאה אחרי הנוכחית
    const nextIdx = this.getFirstRelevantIndex(this.currentQuestionIndex + 1);
    return nextIdx >= this.questions.length;
  }

  // איפוס השאלון
  reset(): void {
    this.currentQuestionIndex = 0;
    this.answers.clear();
    this.history = [];
  }

  // יצוא לשכבת הנתונים החכמה
  toSmartQuestionnaireData(): QuestionnaireData {
    const getAnswerId = (questionId: string): string | undefined => {
      const ans = this.answers.get(questionId)?.answer;
      if (!ans) return undefined;
      return Array.isArray(ans) ? ans[0]?.id : ans.id;
    };

    const getAnswerIds = (questionId: string): string[] => {
      const ans = this.answers.get(questionId)?.answer;
      if (!ans) return [];
      return Array.isArray(ans) ? ans.map((o) => o.id) : [ans.id];
    };

    const normalizeEquipment = (): string[] => {
      const location = getAnswerId("workout_location");
      const bodyweightIds = getAnswerIds("bodyweight_equipment");
      const homeIds = getAnswerIds("home_equipment");
      const gymIds = getAnswerIds("gym_equipment");

      const result = new Set<string>();

      if (
        location === "home_bodyweight" ||
        (homeIds.length === 0 && gymIds.length === 0)
      ) {
        result.add("none");
      }

      // מיפוי פשוט של ציוד
      const allEquipmentIds = [...bodyweightIds, ...homeIds, ...gymIds];
      allEquipmentIds.forEach((id) => {
        if (getEquipmentById(id)) {
          result.add(id);
        } else {
          // מיפויים פשוטים
          if (id === "mat_available") result.add("yoga_mat");
          if (id === "free_weights") result.add("dumbbells");
        }
      });

      if (result.size === 0) {
        result.add("none");
      }

      return Array.from(result);
    };

    const parseAge = (): number | undefined => {
      const ageId = getAnswerId("age");
      if (!ageId) return undefined;
      const ageMap: Record<string, number> = {
        under_18: 16,
        "18_25": 22,
        "26_35": 30,
        "36_50": 43,
        "51_65": 58,
        over_65: 70,
      };
      return ageMap[ageId];
    };

    const parseWeight = (): number | undefined => {
      const weightId = getAnswerId("weight");
      if (!weightId) return undefined;
      const weightMap: Record<string, number> = {
        under_50: 45,
        "50_60": 55,
        "61_70": 65,
        "71_80": 75,
        "81_90": 85,
        "91_100": 95,
        over_100: 105,
      };
      return weightMap[weightId];
    };

    const parseHeight = (): number | undefined => {
      const heightId = getAnswerId("height");
      if (!heightId) return undefined;
      const heightMap: Record<string, number> = {
        under_150: 145,
        "150_160": 155,
        "161_170": 165,
        "171_180": 175,
        "181_190": 185,
        over_190: 195,
      };
      return heightMap[heightId];
    };

    return {
      answers: {
        gender: getAnswerId("gender") as
          | "male"
          | "female"
          | "other"
          | undefined,
        age: parseAge(),
        weight: parseWeight(),
        height: parseHeight(),
        fitnessLevel: getAnswerId("experience_level") as
          | "beginner"
          | "intermediate"
          | "advanced"
          | undefined,
        goals: getAnswerId("fitness_goal")
          ? [getAnswerId("fitness_goal") as string]
          : [],
        equipment: normalizeEquipment(),
        availability: getAnswerId("availability")
          ? [getAnswerId("availability") as string]
          : [],
        sessionDuration: getAnswerId("session_duration"),
        workoutLocation: getAnswerId("workout_location"),
        nutrition: getAnswerId("diet_preferences")
          ? [getAnswerId("diet_preferences") as string]
          : [],
        // הוספת השדות החדשים לתאימות עם המערכת החדשה
        bodyweight_equipment: getAnswerIds("bodyweight_equipment"),
        home_equipment: getAnswerIds("home_equipment"),
        gym_equipment: getAnswerIds("gym_equipment"),
      },
      metadata: {
        completedAt: new Date().toISOString(),
        version: QUESTIONNAIRE_VERSION,
        sessionId: `unified_${Date.now()}`,
        completionTime: Math.max(60, this.answers.size * 10),
        questionsAnswered: this.answers.size,
        totalQuestions: this.getTotalRelevantQuestions(),
        deviceInfo: {
          platform: "mobile",
          screenWidth: 0,
          screenHeight: 0,
        },
      },
    } as QuestionnaireData;
  }
}

export default UnifiedQuestionnaireManager;
