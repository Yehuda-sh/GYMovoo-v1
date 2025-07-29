/**
 * @file src/data/smartQuestionnaireData.ts
 * @brief שאלון חכם מאוחד עם משוב AI בזמן אמת
 * @description האבולוציה הבאה של מערכת השאלונים - שאלון אחד חכם עם AI
 * @author AI Assistant
 * @date 2025-07-29
 */

import { ImageSourcePropType } from "react-native";

// טיפוסים בסיסיים
export type SmartQuestionType =
  | "single"
  | "multiple"
  | "slider"
  | "location_equipment"
  | "time_preference"
  | "goal_focused"
  | "experience_assessment";

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

// ממשק לאפשרות מתקדמת
export interface SmartOption {
  id: string;
  label: string;
  description?: string;
  image?: ImageSourcePropType;
  metadata?: {
    equipment?: string[];
    intensity?: "low" | "medium" | "high" | "adaptive" | "varied";
    focus?: string[];
    recommendation?: string;
    modifications?: string[];
    style?: string[];
  };
  aiInsight?: string; // תובנה מיוחדת מה-AI
}

// ממשק לשאלה חכמה
export interface SmartQuestion {
  id: string;
  title: string;
  subtitle?: string;
  question: string;
  type: SmartQuestionType;
  icon: string;
  category: "essential" | "optimization" | "personalization";

  // אפשרויות
  options?: SmartOption[];

  // הגדרות מיוחדות
  settings?: {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  };

  // לוגיקה של AI
  aiLogic: {
    generateFeedback: (answer: any, previousAnswers: any) => AIFeedback;
    influenceNextQuestions?: (answer: any) => string[]; // אילו שאלות להציג הבא
    generateRecommendations?: (answer: any, previousAnswers: any) => string[];
  };

  // מתי להציג את השאלה
  showCondition?: (previousAnswers: any) => boolean;

  required: boolean;
  helpText?: string;
}

// פונקציות עזר למשוב AI חכם
const AIFeedbackGenerator = {
  // משוב חיובי כללי
  positive: (message: string, insight?: string): AIFeedback => ({
    message,
    type: "positive",
    icon: "✨",
    ...(insight && { actionable: { text: insight, action: () => {} } }),
  }),

  // הצעה לשיפור
  suggestion: (message: string, actionText?: string): AIFeedback => ({
    message,
    type: "suggestion",
    icon: "💡",
    ...(actionText && { actionable: { text: actionText, action: () => {} } }),
  }),

  // תובנה מעמיקה
  insight: (message: string): AIFeedback => ({
    message,
    type: "insight",
    icon: "🎯",
  }),

  // אזהרה עדינה
  warning: (message: string): AIFeedback => ({
    message,
    type: "warning",
    icon: "⚠️",
  }),
};

// 🎯 השאלות החכמות החדשות
export const SMART_QUESTIONNAIRE: SmartQuestion[] = [
  // שאלה 1: מיקום וציוד חכם
  {
    id: "location_equipment",
    title: "איפה תתאמן?",
    subtitle: "בואי נמצא את המקום המושלם בשבילך",
    question: "איפה אתה מעדיף להתאמן?",
    type: "location_equipment",
    icon: "🏋️",
    category: "essential",
    required: true,

    options: [
      {
        id: "home_no_equipment",
        label: "בבית - ללא ציוד",
        description: "אימוני משקל גוף יעילים",
        metadata: {
          equipment: ["bodyweight"],
          intensity: "medium",
          focus: ["flexibility", "endurance"],
        },
        aiInsight: "מושלם למתחילים! אימוני משקל גוף יכולים להיות מאוד יעילים",
      },
      {
        id: "home_basic",
        label: "בבית - ציוד בסיסי",
        description: "דאמבלס, מזרן, גומיות",
        metadata: {
          equipment: ["dumbbells", "yoga_mat", "resistance_bands"],
          intensity: "medium",
          focus: ["strength", "flexibility"],
        },
        aiInsight: "שילוב מעולה של נוחות וגמישות באימונים",
      },
      {
        id: "home_advanced",
        label: "בבית - חדר כושר ביתי",
        description: "ציוד מלא כמו בחדר כושר",
        metadata: {
          equipment: ["barbell", "dumbbells", "bench", "squat_rack"],
          intensity: "high",
          focus: ["strength", "muscle_building"],
        },
        aiInsight: "יש לך הכל! נוכל לבנות תוכניות מתקדמות מאוד",
      },
      {
        id: "gym_standard",
        label: "חדר כושר",
        description: "גישה לכל הציוד והמכונות",
        metadata: {
          equipment: ["all_equipment"],
          intensity: "high",
          focus: ["variety", "progression"],
        },
        aiInsight: "אפשרויות אינסופיות! נוכל ליצור תוכניות מגוונות ומאתגרות",
      },
    ],

    aiLogic: {
      generateFeedback: (answer, previousAnswers) => {
        const option = answer as SmartOption;

        if (option.id === "home_no_equipment") {
          return AIFeedbackGenerator.positive(
            "בחירה מעולה! אימוני משקל גוף יכולים להיות יעילים מאוד",
            "רבים מהחזקים בעולם התחילו עם שכיבות סמיכה פשוטות"
          );
        }

        if (option.id === "gym_standard") {
          return AIFeedbackGenerator.insight(
            "מגוון הציוד בחדר הכושר יאפשר לנו ליצור תוכניות מגוונות ומרגשות!"
          );
        }

        return AIFeedbackGenerator.positive(
          `${option.aiInsight}`,
          "נתאים את התוכנית בדיוק לציוד שיש לך"
        );
      },

      influenceNextQuestions: (answer) => {
        // כרגע לא מוסיפים שאלות נוספות - כל השאלות החיוניות כבר נכללות
        // בעתיד נוכל להוסיף כאן לוגיקה לשאלות דינמיות
        return [];
      },
    },

    helpText: "הבחירה הזו תשפיע על כל התוכנית שלך",
  },

  // שאלה 2: מטרה חכמה עם AI
  {
    id: "smart_goal",
    title: "מה המטרה שלך?",
    subtitle: "בואי נמקד בדיוק במה שחשוב לך",
    question: "מה הכי חשוב לך להשיג?",
    type: "goal_focused",
    icon: "🎯",
    category: "essential",
    required: true,

    options: [
      {
        id: "lose_weight",
        label: "לרדת במשקל",
        description: "שריפת שומנים וירידה במשקל",
        metadata: {
          intensity: "medium",
          focus: ["cardio", "strength", "nutrition"],
        },
        aiInsight: "שילוב של קרדיו וכוח + תזונה נכונה = הצלחה מובטחת!",
      },
      {
        id: "build_muscle",
        label: "לבנות שרירים",
        description: "עליה במסת שריר וכוח",
        metadata: {
          intensity: "high",
          focus: ["strength", "hypertrophy", "nutrition"],
        },
        aiInsight: "בניית שרירים דורשת עקביות - אבל התוצאות משלמות!",
      },
      {
        id: "get_fit",
        label: "להיות בכושר",
        description: "כושר כללי וחיוניות",
        metadata: {
          intensity: "medium",
          focus: ["general_fitness", "endurance", "strength"],
        },
        aiInsight: "כושר כללי זה הבסיס לכל דבר טוב בחיים!",
      },
      {
        id: "feel_better",
        label: "להרגיש טוב יותר",
        description: "בריאות נפשית ופיזית",
        metadata: {
          intensity: "low",
          focus: ["wellness", "mobility", "stress_relief"],
        },
        aiInsight: "הספורט הוא התרופה הטבעית הכי טובה לגוף ולנפש!",
      },
      {
        id: "get_strong",
        label: "להיות חזק יותר",
        description: "כוח ויכולת פונקציונלית",
        metadata: {
          intensity: "high",
          focus: ["strength", "power", "functional"],
        },
        aiInsight: "כוח פונקציונלי ישפר את איכות החיים שלך בכל תחום!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer, previousAnswers) => {
        const option = answer as SmartOption;

        if (option.id === "lose_weight") {
          return AIFeedbackGenerator.positive(
            "מטרה מעולה! נשלב אימוני כוח עם קרדיו לתוצאות מקסימליות",
            "80% מהירידה במשקל מתחילה במטבח - נתן לך טיפים!"
          );
        }

        if (option.id === "build_muscle") {
          return AIFeedbackGenerator.insight(
            "בניית שרירים היא מסע מרגש! נמקד בתרגילים מורכבים ובהעמסה מתקדמת"
          );
        }

        return AIFeedbackGenerator.positive(
          `${option.aiInsight}`,
          "נתאים את התוכנית בדיוק למטרה שלך"
        );
      },

      generateRecommendations: (answer, previousAnswers) => {
        const option = answer as SmartOption;
        if (option.id === "lose_weight") {
          return [
            "נתחיל עם 3-4 אימונים בשבוע",
            "נשלב קרדיו וכוח באופן מיטבי",
            "נתמקד בתזונה בריאה",
          ];
        }
        return [];
      },
    },

    helpText: "המטרה שלך תקבע את כל האסטרטגיה",
  },

  // שאלה 3: ניסיון חכם
  {
    id: "experience_smart",
    title: "מה הניסיון שלך?",
    subtitle: "נכיר אותך טוב יותר",
    question: "איך תמדד את הניסיון שלך באימונים?",
    type: "experience_assessment",
    icon: "💪",
    category: "essential",
    required: true,

    options: [
      {
        id: "complete_beginner",
        label: "מתחיל לגמרי",
        description: "חדש לעולם הספורט",
        metadata: {
          intensity: "low",
          focus: ["basics", "form", "habit_building"],
        },
        aiInsight: "כולם התחילו איפשהו! נתמקד ביסודות החשובים",
      },
      {
        id: "some_experience",
        label: "יש לי קצת ניסיון",
        description: "התאמנתי בעבר או מתאמן מדי פעם",
        metadata: { intensity: "medium", focus: ["progression", "technique"] },
        aiInsight: "יש לך בסיס טוב! נבנה עליו ונשפר את הטכניקה",
      },
      {
        id: "experienced",
        label: "מנוסה",
        description: "מתאמן בקביעות כבר תקופה",
        metadata: { intensity: "high", focus: ["advanced", "specialization"] },
        aiInsight: "מצוין! נוכל לעבוד על טכניקות מתקדמות",
      },
      {
        id: "athlete",
        label: "ספורטאי",
        description: "רמה גבוהה או תחרותית",
        metadata: {
          intensity: "high",
          focus: ["performance", "periodization"],
        },
        aiInsight: "רמה גבוהה! נמקד בביצועים ופריצת מגבלות",
      },
    ],

    aiLogic: {
      generateFeedback: (answer, previousAnswers) => {
        const option = answer as SmartOption;

        if (option.id === "complete_beginner") {
          return AIFeedbackGenerator.positive(
            "מושלם! המסע הכי מרגש מתחיל עכשיו",
            "המשפט הכי חשוב: 'התחלה טובה היא חצי מההצלחה'"
          );
        }

        if (option.id === "athlete") {
          return AIFeedbackGenerator.insight(
            "מרשים! נוכל ליצור תוכניות מתקדמות מאוד ומותאמות לביצועים"
          );
        }

        return AIFeedbackGenerator.positive(
          `${option.aiInsight}`,
          "נתאים את רמת הקושי בדיוק לניסיון שלך"
        );
      },
    },

    helpText: "כנות פה חשובה - זה יקבע את רמת הקושי",
  },

  // שאלה 4: זמן וזמינות חכמה
  {
    id: "time_smart",
    title: "כמה זמן יש לך?",
    subtitle: "נמצא את הקצב המושלם בשבילך",
    question: "כמה זמן אתה יכול להקדיש לאימון?",
    type: "time_preference",
    icon: "⏰",
    category: "essential",
    required: true,

    options: [
      {
        id: "time_15_30",
        label: "15-30 דקות",
        description: "אימונים קצרים ויעילים",
        metadata: { intensity: "high", focus: ["hiit", "express"] },
        aiInsight: "אימונים קצרים יכולים להיות סופר יעילים עם הגישה הנכונה!",
      },
      {
        id: "time_30_45",
        label: "30-45 דקות",
        description: "הזמן הסטנדרטי המומלץ",
        metadata: { intensity: "medium", focus: ["balanced", "standard"] },
        aiInsight: "הזמן המושלם! מספיק לאימון יסודי ולא יותר מדי",
      },
      {
        id: "time_45_60",
        label: "45-60 דקות",
        description: "אימון מקיף ויסודי",
        metadata: { intensity: "medium", focus: ["comprehensive", "detailed"] },
        aiInsight: "נוכל ליצור אימונים מקיפים עם חימום וקירור מלאים",
      },
      {
        id: "time_flexible",
        label: "זה משתנה",
        description: "לפעמים יותר, לפעמים פחות",
        metadata: { intensity: "adaptive", focus: ["flexible", "adaptive"] },
        aiInsight: "נכין לך אפשרויות גמישות - אימון קצר ארוך לפי הצורך",
      },
    ],

    aiLogic: {
      generateFeedback: (answer, previousAnswers) => {
        const option = answer as SmartOption;

        if (option.id === "time_15_30") {
          return AIFeedbackGenerator.positive(
            "מעולה! אימונים קצרים ויעילים יכולים להיות מאוד יעילים",
            "HIIT של 20 דקות יכול לשרוף יותר קלוריות מאשר שעה של קרדיו איטי"
          );
        }

        if (option.id === "time_flexible") {
          return AIFeedbackGenerator.insight(
            "חשיבה חכמה! נכין לך תוכניות גמישות שמתאימות לכל יום"
          );
        }

        return AIFeedbackGenerator.positive(
          `${option.aiInsight}`,
          "נתאים את האימונים בדיוק לזמן שיש לך"
        );
      },
    },

    helpText: "תחשוב על ממוצע - כמה זמן בדרך כלל יש לך",
  },

  // שאלה 5: תדירות חכמה
  {
    id: "frequency_smart",
    title: "כמה פעמים בשבוע?",
    subtitle: "נמצא את הקצב הנכון לך",
    question: "כמה פעמים בשבוע אתה יכול להתאמן?",
    type: "single",
    icon: "🗓️",
    category: "essential",
    required: true,

    options: [
      {
        id: "freq_2",
        label: "פעמיים בשבוע",
        description: "בסיס טוב להתחלה",
        metadata: { intensity: "medium", focus: ["full_body", "basics"] },
        aiInsight: "פעמיים בשבוע זה בסיס מעולה! האורח חיים הבריא מתחיל פה",
      },
      {
        id: "freq_3",
        label: "3 פעמים בשבוע",
        description: "הקצב האידיאלי למרבית האנשים",
        metadata: { intensity: "medium", focus: ["split_routine", "balanced"] },
        aiInsight: "הקצב הזהב! 3 פעמים בשבוע זה מושלם לתוצאות ולמניעת שחיקה",
      },
      {
        id: "freq_4_5",
        label: "4-5 פעמים בשבוע",
        description: "רמה גבוהה ומחויבות",
        metadata: { intensity: "high", focus: ["split_routine", "advanced"] },
        aiInsight: "רמה גבוהה! נוכל ליצור תוכניות מתמחות לכל קבוצת שרירים",
      },
      {
        id: "freq_daily",
        label: "כמעט כל יום",
        description: "אימונים הם חלק מהחיים שלי",
        metadata: { intensity: "varied", focus: ["periodization", "recovery"] },
        aiInsight: "מרשים! נחשוב על מחזוריות ומנוחה כדי למנוע שחיקה",
      },
    ],

    aiLogic: {
      generateFeedback: (answer, previousAnswers) => {
        const option = answer as SmartOption;

        if (option.id === "freq_2") {
          return AIFeedbackGenerator.positive(
            "התחלה חכמה! עדיף איכות על כמות",
            "דיסציפלינה עם 2 אימונים טובה מ-5 אימונים לא עקביים"
          );
        }

        if (option.id === "freq_daily") {
          return AIFeedbackGenerator.suggestion(
            "מעולה! נוסיף ימי התאוששות פעילה לתוכנית",
            "מנוחה היא חלק מהאימון - בימי הביניים נעשה יוגה או הליכה"
          );
        }

        return AIFeedbackGenerator.positive(
          `${option.aiInsight}`,
          "נבנה תוכנית שמתאימה בדיוק לקצב שלך"
        );
      },
    },

    helpText: "חשוב על מה שבאמת ריאליסטי לטווח הארוך",
  },

  // שאלה 6: מגבלות ובעיות
  {
    id: "limitations_smart",
    title: "יש מגבלות?",
    subtitle: "נדאג שהאימונים יהיו בטוחים ומתאימים",
    question: "יש לך מגבלות או בעיות שכדאי שנדע עליהן?",
    type: "multiple",
    icon: "⚕️",
    category: "essential",
    required: false,

    options: [
      {
        id: "back_pain",
        label: "כאבי גב",
        description: "בעיות עם הגב התחתון או העליון",
        metadata: { modifications: ["core_focus", "avoid_heavy_deadlifts"] },
        aiInsight: "נמקד בחיזוק הליבה ובשיפור היציבה - זה יעזור מאוד!",
      },
      {
        id: "knee_issues",
        label: "בעיות ברכיים",
        description: "כאבים או פציעות ברכיים",
        metadata: { modifications: ["low_impact", "strengthen_quads"] },
        aiInsight: "נבחר תרגילים ידידותיים לברכיים ונחזק את השרירים מסביב",
      },
      {
        id: "shoulder_problems",
        label: "בעיות כתפיים",
        description: "כאבים או מגבלות תנועה",
        metadata: { modifications: ["avoid_overhead", "mobility_focus"] },
        aiInsight: "נעבוד על ניידות הכתפיים ונמנע מתרגילים מעל הראש",
      },
      {
        id: "time_pressure",
        label: "לחץ זמן",
        description: "קשה לי למצוא זמן קבוע",
        metadata: { modifications: ["flexible_timing", "quick_workouts"] },
        aiInsight: "נכין לך אימונים גמישים שאפשר לעשות בכל זמן",
      },
      {
        id: "beginner_anxiety",
        label: "חרדה של מתחיל",
        description: "מפחד להתחיל או לא בטוח בעצמי",
        metadata: { modifications: ["gentle_start", "confidence_building"] },
        aiInsight: "כולם היו פעם מתחילים! נתחיל בעדינות ונבנה ביטחון",
      },
      {
        id: "no_limitations",
        label: "אין מגבלות מיוחדות",
        description: "מרגיש טוב ומוכן לכל דבר",
        metadata: { modifications: [] },
        aiInsight: "מעולה! נוכל ליצור תוכניות מגוונות וליהנות מהחופש",
      },
    ],

    aiLogic: {
      generateFeedback: (answer, previousAnswers) => {
        const options = answer as SmartOption[];

        if (!Array.isArray(options)) {
          return AIFeedbackGenerator.positive("תודה על השיתוף!");
        }

        if (options.some((opt) => opt.id === "no_limitations")) {
          return AIFeedbackGenerator.positive(
            "נהדר! נוכל ליצור תוכניות מגוונות ומאתגרות",
            "עדיין נתחיל בזהירות ונבנה בהדרגה"
          );
        }

        if (options.length > 0) {
          return AIFeedbackGenerator.insight(
            "תודה על הכנות! נתאים את האימונים בדיוק למגבלות שלך"
          );
        }

        return AIFeedbackGenerator.positive("הבנתי, נמשיך!");
      },
    },

    helpText: "אפשר לבחור כמה אפשרויות או לדלג",
  },

  // שאלה 7: העדפות אימון
  {
    id: "workout_preferences",
    title: "איך אתה אוהב להתאמן?",
    subtitle: "נכיר את הסגנון שלך",
    question: "איזה סגנון אימון מתאים לך יותר?",
    type: "multiple",
    icon: "🎵",
    category: "optimization",
    required: false,

    options: [
      {
        id: "high_intensity",
        label: "אוהב אתגרים קשים",
        description: "כל אימון צריך לדחוף אותי לגבול",
        metadata: { style: ["hiit", "challenging", "intense"] },
        aiInsight: "אנרגיה גבוהה! נכין לך אימונים שבאמת ידחפו אותך",
      },
      {
        id: "steady_pace",
        label: "מעדיף קצב קבוע",
        description: "אוהב אימונים יציבים ומבוקרים",
        metadata: { style: ["steady", "controlled", "methodical"] },
        aiInsight: "גישה חכמה! התמדה וקביעות הן המפתח להצלחה",
      },
      {
        id: "variety_lover",
        label: "אוהב גיוון",
        description: "כל אימון צריך להיות שונה",
        metadata: { style: ["varied", "creative", "diverse"] },
        aiInsight: "נוכל ליצור לך אימונים מגוונים שלא ישעממו לעולם!",
      },
      {
        id: "music_motivated",
        label: "אימון עם מוזיקה",
        description: "המוזיקה נותנת לי אנרגיה",
        metadata: { style: ["rhythmic", "energetic", "music_based"] },
        aiInsight: "המוזיקה היא דלק מצוין! נכלול המלצות פלייליסט",
      },
      {
        id: "quiet_focused",
        label: "אימון שקט וממוקד",
        description: "אוהב להתרכז ולחשוב על הטכניקה",
        metadata: { style: ["mindful", "technical", "focused"] },
        aiInsight: "גישה מדיטטיבית! נמקד בטכניקה וחיבור גוף-נפש",
      },
      {
        id: "social_workout",
        label: "אוהב אימונים חברתיים",
        description: "יותר כיף להתאמן עם אחרים",
        metadata: { style: ["social", "group", "partner"] },
        aiInsight: "אנרגיה חברתית! נכלול רעיונות לאימונים עם חברים",
      },
    ],

    aiLogic: {
      generateFeedback: (answer, previousAnswers) => {
        const options = answer as SmartOption[];

        if (!Array.isArray(options) || options.length === 0) {
          return AIFeedbackGenerator.positive("בסדר, נמשיך!");
        }

        const styles = options.map((opt) => opt.label).join(", ");
        return AIFeedbackGenerator.insight(
          `הבנתי את הסגנון שלך: ${styles}. נכין אימונים שבאמת יתאימו לך!`
        );
      },
    },

    helpText: "אפשר לבחור כמה אפשרויות שמתאימות לך",
  },
];

// פונקציות לניהול השאלון החכם
export class SmartQuestionnaireManager {
  private answers: Map<string, any> = new Map();
  private currentQuestionIndex = 0;
  private questionsToShow: string[] = [];

  constructor() {
    // התחל עם השאלות החיוניות - תמיד יצור רשימה חדשה
    this.questionsToShow = SMART_QUESTIONNAIRE.filter(
      (q) => q.category === "essential"
    )
      .map((q) => q.id)
      .slice(); // יצור עותק חדש של המערך
  }

  getCurrentQuestion(): SmartQuestion | null {
    // בדיקה וניקוי אגרסיבי של השאלות הזרות
    const beforeCount = this.questionsToShow.length;
    this.questionsToShow = this.questionsToShow.filter(
      (id) => !["home_motivation", "time_flexibility"].includes(id)
    );
    const afterCount = this.questionsToShow.length;

    if (this.currentQuestionIndex >= this.questionsToShow.length) {
      return null;
    }

    const questionId = this.questionsToShow[this.currentQuestionIndex];

    const foundQuestion = SMART_QUESTIONNAIRE.find((q) => q.id === questionId);

    return foundQuestion || null;
  }

  answerQuestion(questionId: string, answer: any): AIFeedback | null {
    this.answers.set(questionId, answer);

    const question = SMART_QUESTIONNAIRE.find((q) => q.id === questionId);
    if (!question) return null;

    // יצור משוב AI
    const feedback = question.aiLogic.generateFeedback(
      answer,
      Object.fromEntries(this.answers)
    );

    // עדכן רשימת שאלות עתידיות אם צריך
    if (question.aiLogic.influenceNextQuestions) {
      const newQuestions = question.aiLogic.influenceNextQuestions(answer);

      if (newQuestions && newQuestions.length > 0) {
        this.questionsToShow.push(...newQuestions);
      }
    }

    return feedback;
  }

  nextQuestion(): boolean {
    this.currentQuestionIndex++;

    return this.currentQuestionIndex < this.questionsToShow.length;
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

  getAllAnswers(): Record<string, any> {
    return Object.fromEntries(this.answers);
  }

  isComplete(): boolean {
    return this.currentQuestionIndex >= this.questionsToShow.length;
  }
}

export default SMART_QUESTIONNAIRE;
// Force refresh
