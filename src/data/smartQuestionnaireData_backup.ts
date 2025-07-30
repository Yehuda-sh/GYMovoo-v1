/**
 * @file src/data/smartQuestionnaireData.ts
 * @brief שאלון דינמי חדש עם ציוד מסודר (מוחלף!)
 * @date 2025-01-28
 */

import { ImageSourcePropType } from "react-native";

// טיפוסים בסיסיים
export type SmartQuestionType = "single" | "multiple";

// ממשק למשוב AI
export interface AIFeedback {
  message: string;
  type: "positive" | "suggestion" | "warning" | "insight";
  icon: string;
  actionable?: {
    text: string;
    action: () => void;
  };
}

// ממשק לאפשרות
export interface SmartOption {
  id: string;
  label: string;
  description?: string;
  image?: ImageSourcePropType;
  metadata?: {
    equipment?: string[];
    intensity?: "low" | "medium" | "high";
    duration?: number;
    muscleGroups?: string[];
  };
  aiInsight?: string;
}

// ממשק לשאלה חכמה
export interface SmartQuestion {
  id: string;
  title: string;
  subtitle?: string;
  question: string;
  type: SmartQuestionType;
  icon: string;
  category: "essential" | "preference" | "advanced";
  required: boolean;
  options?: SmartOption[];
  aiInsights?: Record<string, string>;
  helpText?: string;
  dependsOn?: {
    questionId: string;
    optionId: string;
  };
}

export const SMART_QUESTIONNAIRE: SmartQuestion[] = [
  // שאלה 0: מגדר (חדש!)
  {
    id: "gender",
    title: "מה המגדר שלך?",
    subtitle: "כדי שנוכל לפנות אליך בצורה הנכונה",
    question: "איך תרצה שנפנה אליך?",
    type: "single",
    icon: "👤",
    category: "essential",
    required: true,

    options: [
      {
        id: "male",
        label: "זכר",
        description: "נפנה אליך בלשון זכר",
      },
      {
        id: "female",
        label: "נקבה",
        description: "נפנה אליך בלשון נקבה",
      },
      {
        id: "other",
        label: "אחר/לא מעוניין/ת לציין",
        description: "נפנה אליך בלשון ניטרלית",
      },
    ],

    aiInsights: {
      male: "נפנה אליך בלשון זכר בכל השאלות הבאות",
      female: "נפנה אליך בלשון נקבה בכל השאלות הבאות",
      other: "נפנה אליך בלשון ניטרלית בכל השאלות הבאות",
    },
  },

  // שאלה 1: גיל
  {
    id: "age",
    title: "בן/בת כמה את/ה?",
    subtitle: "הגיל עוזר לנו להתאים את התוכנית בצורה מיטבית",
    question: "בן/בת כמה את/ה?",
    type: "single",
    icon: "👤",
    category: "essential",
    required: true,

    options: [
      {
        id: "18-25",
        label: "18-25",
        description: "צעיר ומלא אנרגיה",
        metadata: {
          intensity: "high",
          muscleGroups: ["legs", "core", "upper"],
        },
        aiInsight: "בגיל הזה הגוף מתאושש מהר ויכול לעמוד באימונים אינטנסיביים",
      },
      {
        id: "26-35",
        label: "26-35",
        description: "בשיא הכוחות",
        metadata: {
          intensity: "high",
          muscleGroups: ["legs", "core", "upper", "functional"],
        },
        aiInsight: "גיל מעולה לבניית כוח ושיפור הביצועים",
      },
      {
        id: "36-45",
        label: "36-45",
        description: "ניסיון חיים + מוטיבציה",
        metadata: {
          intensity: "medium",
          muscleGroups: ["core", "functional", "flexibility"],
        },
        aiInsight: "כדאי להתמקד באימוני כוח פונקציונליים וגמישות",
      },
      {
        id: "46-55",
        label: "46-55",
        description: "בוגר ונמרץ",
        metadata: {
          intensity: "medium",
          muscleGroups: ["core", "balance", "flexibility"],
        },
        aiInsight: "חשוב לשמור על מסת שריר ולהתמקד באיזון וגמישות",
      },
      {
        id: "56+",
        label: "56+",
        description: "חכם ופעיל",
        metadata: {
          intensity: "low",
          muscleGroups: ["balance", "flexibility", "functional"],
        },
        aiInsight: "אימונים מותאמים לשמירה על תפקוד יומיומי וחיוניות",
      },
    ],

    aiInsights: {
      "18-25": "🔥 בגיל הזה אפשר לדחוף קשה! נתמקד באימונים אינטנסיביים",
      "26-35": "💪 הגיל המושלם לבניית בסיס חזק - נשלב כוח וקרדיו",
      "36-45": "🎯 נתאים אימונים חכמים שישמרו על הבריאות לטווח הארוך",
      "46-55": "⚡ נשמור על הכוח ונוסיף גמישות ויציבות",
      "56+": "🌟 אימונים מותאמים לשמירה על איכות חיים גבוהה",
    },
  },

  // שאלה 2: מטרה
  {
    id: "goal",
    title: "מה המטרה שלך?",
    subtitle: "המטרה הראשית תקבע את כיוון התוכנית",
    question: "מה המטרה העיקרית שלך מאימונים?",
    type: "single",
    icon: "🎯",
    category: "essential",
    required: true,

    options: [
      {
        id: "weight_loss",
        label: "ירידה במשקל",
        description: "שריפת שומן ועיצוב הגוף",
        metadata: {
          intensity: "high",
          duration: 45,
          muscleGroups: ["cardio", "full_body"],
        },
        aiInsight: "נשלב אימוני קרדיו עם אימוני כוח לשריפת קלוריות מקסימלית",
      },
      {
        id: "muscle_gain",
        label: "בניית שריר",
        description: "הגדלת מסת שריר וכוח",
        metadata: {
          intensity: "high",
          duration: 60,
          muscleGroups: ["upper", "lower", "core"],
        },
        aiInsight: "נתמקד באימוני כוח פרוגרסיביים עם מנוחה מותאמת",
      },
      {
        id: "fitness_general",
        label: "כושר כללי",
        description: "שיפור הבריאות והחיוניות",
        metadata: {
          intensity: "medium",
          duration: 40,
          muscleGroups: ["full_body", "cardio"],
        },
        aiInsight: "נשלב סוגי אימונים שונים לכושר מאוזן ובריא",
      },
      {
        id: "strength",
        label: "כוח וביצועים",
        description: "שיפור הביצועים הספורטיביים",
        metadata: {
          intensity: "high",
          duration: 50,
          muscleGroups: ["functional", "explosive"],
        },
        aiInsight: "נבנה תוכנית ממוקדת בביצועים עם אימוני כוח מתקדמים",
      },
      {
        id: "health",
        label: "בריאות ותחזוקה",
        description: "שמירה על בריאות כללית",
        metadata: {
          intensity: "low",
          duration: 30,
          muscleGroups: ["flexibility", "balance", "core"],
        },
        aiInsight: "נתמקד באימונים בטוחים לשמירה על תפקוד הגוף",
      },
    ],

    aiInsights: {
      weight_loss: "🔥 נבנה תוכנית שריפת שומן עם שילוב חכם של קרדיו וכוח!",
      muscle_gain: "💪 נתמקד בבניית שריר עם אימוני כוח מדורגים ותזונה",
      fitness_general: "🏃‍♂️ נשלב מגוון אימונים לכושר מאוזן ובריא",
      strength: "⚡ נבנה כוח אמיתי עם אימונים מתקדמים וטכניקות מקצועיות",
      health: "🌿 נשמור על הבריאות עם אימונים בטוחים ואפקטיביים",
    },
  },

  // שאלה 3: ניסיון
  {
    id: "experience",
    title: "מה רמת הניסיון שלך?",
    subtitle: "נתאים את רמת הקושי בהתאם לניסיון שלך",
    question: "כמה ניסיון יש לך באימונים?",
    type: "single",
    icon: "⭐",
    category: "essential",
    required: true,

    options: [
      {
        id: "beginner",
        label: "מתחיל (0-6 חודשים)",
        description: "חדש בעולם הכושר",
        metadata: {
          intensity: "low",
          duration: 30,
        },
        aiInsight: "נתחיל בבסיסים ונבנה יסודות חזקים בצורה בטוחה",
      },
      {
        id: "intermediate",
        label: "בינוני (6 חודשים - 2 שנים)",
        description: "יש בסיס, רוצה להתקדם",
        metadata: {
          intensity: "medium",
          duration: 45,
        },
        aiInsight: "נעלה רמה עם טכניקות חדשות ואתגרים מבוקרים",
      },
      {
        id: "advanced",
        label: "מתקדם (2+ שנים)",
        description: "ניסיון רב, מחפש אתגרים",
        metadata: {
          intensity: "high",
          duration: 60,
        },
        aiInsight: "נתמקד באימונים מתקדמים ווריאציות מאתגרות",
      },
    ],

    aiInsights: {
      beginner: "🌱 נבנה בסיס חזק! נתחיל בטכניקה נכונה ונתקדם בהדרגה",
      intermediate: "📈 זמן לעלות רמה! נוסיף שונות ואתגרים חדשים",
      advanced: "🚀 בואו נדחוף את הגבולות עם אימונים מתקדמים!",
    },

    helpText: "הניסיון קובע את רמת הבטיחות והאתגר בתוכנית",
  },

  // שאלה 4 - תדירות
  {
    id: "frequency",
    title: "כמה פעמים בשבוע תרצה להתאמן?",
    subtitle: "תדירות האימונים חשובה לבניית תוכנית מתאימה",
    question: "כמה פעמים בשבוע את/ה יכול/ה להתאמן?",
    type: "single",
    icon: "📅",
    category: "essential",
    required: true,

    options: [
      {
        id: "2-times",
        label: "2 פעמים בשבוע",
        description: "מינימום יעיל לתחזוקה",
        metadata: {
          intensity: "medium",
          duration: 50,
        },
        aiInsight: "נמקסם כל אימון עם שילוב של כוח וקרדיו",
      },
      {
        id: "3-times",
        label: "3 פעמים בשבוע",
        description: "מאוזן ובר קיימא",
        metadata: {
          intensity: "medium",
          duration: 45,
        },
        aiInsight: "התדירות הזו מאפשרת התקדמות טובה עם מנוחה מספקת",
      },
      {
        id: "4-times",
        label: "4 פעמים בשבוע",
        description: "התקדמות מהירה",
        metadata: {
          intensity: "medium",
          duration: 40,
        },
        aiInsight: "נחלק את האימונים בחכמה לקבוצות שרירים שונות",
      },
      {
        id: "5-plus",
        label: "5+ פעמים בשבוע",
        description: "מחויב ומתמסר",
        metadata: {
          intensity: "varied",
          duration: 35,
        },
        aiInsight: "נגוון את האימונים ונשמור על איזון בין עומס ומנוחה",
      },
    ],

    aiInsights: {
      "2-times": "💯 נמקסם כל אימון! תוכנית מרוכזת ויעילה",
      "3-times": "🎯 האיזון המושלם בין התקדמות והתאוששות",
      "4-times": "🔄 נחלק את האימונים בחכמה לקבוצות שרירים",
      "5-plus": "🏆 מדהים! נבנה תוכנית מגוונת עם מיקוד שונה בכל יום",
    },

    helpText: "התדירות תקבע את פיצול האימונים",
  },

  // שאלה 5 - משך אימון
  {
    id: "duration",
    title: "כמה זמן יש לך לאימון?",
    subtitle: "משך האימון יקבע את תכנון התרגילים",
    question: "כמה זמן את/ה יכול/ה להקדיש לאימון?",
    type: "single",
    icon: "⏱️",
    category: "essential",
    required: true,

    options: [
      {
        id: "20-30",
        label: "20-30 דקות",
        description: "קצר ויעיל",
        metadata: {
          intensity: "high",
          duration: 25,
        },
        aiInsight: "נתמקד באימונים אינטנסיביים עם תרגילים מורכבים",
      },
      {
        id: "30-45",
        label: "30-45 דקות",
        description: "מאוזן ונוח",
        metadata: {
          intensity: "medium",
          duration: 40,
        },
        aiInsight: "זמן מושלם לאימון מקיף עם חימום וסיום נכונים",
      },
      {
        id: "45-60",
        label: "45-60 דקות",
        description: "מפורט ויסודי",
        metadata: {
          intensity: "medium",
          duration: 55,
        },
        aiInsight: "נוכל להתמקד בפרטים ולהוסיף וריאציות מגוונות",
      },
      {
        id: "60-plus",
        label: "60+ דקות",
        description: "אין מגבלת זמן",
        metadata: {
          intensity: "varied",
          duration: 75,
        },
        aiInsight: "נבנה אימון מקיף עם חלקים מיוחדים ומגוונים",
      },
    ],

    aiInsights: {
      "20-30": "⚡ אימונים קצרים ואפקטיביים! HIIT וסופרסטים",
      "30-45": "🎯 הזמן המושלם לאימון מקיף ואיכותי",
      "45-60": "📚 נוכל להתמקד בטכניקה ולהוסיף פרטים חשובים",
      "60-plus": "🎪 נבנה חוויית אימון מלאה עם כל הרכיבים!",
    },
  },

  // שאלה 6: זמינות ציוד בסיסי
  {
    id: "equipment_availability",
    title: "איזה חפצים יש לך בבית?",
    subtitle: "נתאים את התרגילים לציוד הזמין לך",
    question: "איזה חפצים בסיסיים יש לך בבית?",
    type: "multiple",
    icon: "🏠",
    category: "essential",
    required: true,

    options: [
      {
        id: "bodyweight_only",
        label: "משקל גוף בלבד",
        description: "אין ציוד נוסף",
        metadata: {
          equipment: ["bodyweight"],
        },
        aiInsight: "אימוני משקל גוף יכולים להיות יעילים מאוד!",
      },
      {
        id: "basic_home",
        label: "ציוד בסיסי בבית",
        description: "משטח, מים, מקום לתרגול",
        metadata: {
          equipment: ["mat", "space"],
        },
        aiInsight: "נשתמש בציוד הבית ובמשקל הגוף ליצירת אימונים מגוונים",
      },
      {
        id: "some_weights",
        label: "כמה משקולות/דמבלים",
        description: "ציוד משקולות בסיסי",
        metadata: {
          equipment: ["dumbbells", "weights"],
        },
        aiInsight: "משקולות מוסיפות אפשרויות רבות לאימוני כוח!",
      },
      {
        id: "home_gym",
        label: "חדר כושר ביתי",
        description: "ציוד מקצועי בבית",
        metadata: {
          equipment: ["full_home_gym"],
        },
        aiInsight: "עם ציוד מקצועי נוכל לבנות תוכנית מתקדמת מאוד!",
      },
      {
        id: "gym_access",
        label: "גישה לחדר כושר",
        description: "יכול להגיע לחדר כושר",
        metadata: {
          equipment: ["gym_equipment"],
        },
        aiInsight: "חדר כושר מאפשר גישה לכל סוגי הציוד והאימונים!",
      },
    ],

    aiInsights: {
      bodyweight_only: "💪 משקל גוף הוא הציוד הכי יעיל שיש! נתחיל עכשיו",
      basic_home: "🏠 הבית הוא החדר כושר הכי נוח - תמיד זמין!",
      some_weights: "🏋️ משקולות פותחות עולם שלם של אפשרויות!",
      home_gym: "🎯 חדר כושר ביתי = חירות מלאה ותוצאות מקסימליות!",
      gym_access: "🏆 עם גישה לחדר כושר השמיים הם הגבול!",
    },

    helpText: "בחר את הציוד שאתה הכי נוח להשתמש בו או שזמין ברוב הזמן",
  },
];

// פונקציות לניהול השאלון
export class SmartQuestionnaireManager {
  private answers: Map<string, any> = new Map();
  private currentQuestionIndex = 0;
  private questionsToShow: string[] = [
    "gender",
    "age",
    "goal",
    "experience",
    "frequency",
    "duration",
    "equipment_availability",
  ];

  // פונקציה להתאמת טקסט לפי מגדר
  private adaptTextToGender(text: string): string {
    const gender = this.answers.get("gender");

    if (!gender || gender.id === "other") {
      // לשון ניטרלית - נשאיר כפי שיש
      return text;
    }

    if (gender.id === "male") {
      // לשון זכר
      return text
        .replace(/את\/ה/g, "אתה")
        .replace(/יכול\/ה/g, "יכול")
        .replace(/רוצה/g, "רוצה")
        .replace(/תרצה/g, "תרצה")
        .replace(/מעוניין\/ת/g, "מעוניין");
    }

    if (gender.id === "female") {
      // לשון נקבה
      return text
        .replace(/את\/ה/g, "את")
        .replace(/יכול\/ה/g, "יכולה")
        .replace(/רוצה/g, "רוצה")
        .replace(/תרצה/g, "תרצי")
        .replace(/מעוניין\/ת/g, "מעוניינת");
    }

    return text;
  }

  getCurrentQuestion(): SmartQuestion | null {
    if (this.currentQuestionIndex >= this.questionsToShow.length) {
      return null;
    }

    const questionId = this.questionsToShow[this.currentQuestionIndex];
    const originalQuestion = SMART_QUESTIONNAIRE.find(
      (q) => q.id === questionId
    );

    if (!originalQuestion) return null;

    // התאם את הטקסטים לפי המגדר (אלא אם זו שאלת המגדר עצמה)
    if (questionId === "gender") {
      return originalQuestion;
    }

    return {
      ...originalQuestion,
      title: this.adaptTextToGender(originalQuestion.title),
      subtitle: originalQuestion.subtitle
        ? this.adaptTextToGender(originalQuestion.subtitle)
        : undefined,
      question: this.adaptTextToGender(originalQuestion.question),
      helpText: originalQuestion.helpText
        ? this.adaptTextToGender(originalQuestion.helpText)
        : undefined,
    };
  }

  answerQuestion(questionId: string, answer: any): AIFeedback | null {
    this.answers.set(questionId, answer);

    const question = SMART_QUESTIONNAIRE.find((q) => q.id === questionId);
    if (!question) return null;

    // יצירת משוב AI
    let feedback: AIFeedback | null = null;

    if (Array.isArray(answer)) {
      // תשובות מרובות
      const selectedIds = answer.map((opt: SmartOption) => opt.id);
      const messages = selectedIds.map(
        (id: string) => question.aiInsights?.[id] || "בחירה מעולה!"
      );

      feedback = {
        message: messages.join(" "),
        type: "positive",
        icon: "🎯",
      };
    } else {
      // תשובה יחידה
      const message = question.aiInsights?.[answer.id] || "בחירה חכמה!";
      feedback = {
        message,
        type: "positive",
        icon: "👍",
      };
    }

    // לוגיקה דינמית להוספת שאלות בהתאם לתשובות
    if (questionId === "equipment_availability") {
      const selectedOptions = Array.isArray(answer) ? answer : [answer];
      const newQuestions: string[] = [];

      selectedOptions.forEach((option: SmartOption) => {
        if (option.id === "bodyweight_only") {
          newQuestions.push("bodyweight_equipment_options");
        } else if (option.id === "basic_home" || option.id === "some_weights") {
          newQuestions.push("home_equipment_options");
        } else if (option.id === "gym_access") {
          newQuestions.push("gym_equipment_options");
        }
      });

      if (newQuestions.length > 0) {
        // הסר שאלות קיימות דומות והוסף החדשות
        this.questionsToShow = this.questionsToShow.filter(
          (q) =>
            ![
              "bodyweight_equipment_options",
              "home_equipment_options",
              "gym_equipment_options",
            ].includes(q)
        );
        this.questionsToShow.push(...newQuestions);
      }
    }

    return feedback;
  }

  nextQuestion(): boolean {
    this.currentQuestionIndex++;
    return this.currentQuestionIndex < this.questionsToShow.length;
  }

  getAllAnswers(): Record<string, any> {
    const answers = Object.fromEntries(this.answers);

    // חילוץ ציוד מהתשובות
    const extractedEquipment: string[] = [];

    // בדיקת כל התשובות לחילוץ ציוד
    Object.values(answers).forEach((answer: any) => {
      if (Array.isArray(answer)) {
        answer.forEach((option: any) => {
          if (option?.metadata?.equipment) {
            extractedEquipment.push(...option.metadata.equipment);
          }
        });
      } else if (answer?.metadata?.equipment) {
        extractedEquipment.push(...answer.metadata.equipment);
      }
    });

    // הוספת הציוד החולץ
    answers.available_equipment = [...new Set(extractedEquipment)];

    return answers;
  }

  isComplete(): boolean {
    return this.currentQuestionIndex >= this.questionsToShow.length;
  }

  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.questionsToShow.length,
      percentage: Math.round(
        ((this.currentQuestionIndex + 1) / this.questionsToShow.length) * 100
      ),
    };
  }
}

export default SMART_QUESTIONNAIRE;
