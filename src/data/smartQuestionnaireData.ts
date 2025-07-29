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
  };
  aiInsight?: string;
}

// ממשק לשאלה
export interface SmartQuestion {
  id: string;
  title: string;
  subtitle?: string;
  question: string;
  type: SmartQuestionType;
  icon: string;
  category: "essential";
  options?: SmartOption[];
  required: boolean;
  helpText?: string;

  aiLogic: {
    generateFeedback: (answer: any, previousAnswers: any) => AIFeedback;
    influenceNextQuestions?: (answer: any) => string[];
  };
}

// פונקציות עזר למשוב AI
const AIFeedbackGenerator = {
  positive: (message: string): AIFeedback => ({
    message,
    type: "positive",
    icon: "✨",
  }),

  suggestion: (message: string): AIFeedback => ({
    message,
    type: "suggestion",
    icon: "💡",
  }),

  insight: (message: string): AIFeedback => ({
    message,
    type: "insight",
    icon: "🎯",
  }),
};

// השאלות החדשות - מוחלפות!
export const SMART_QUESTIONNAIRE: SmartQuestion[] = [
  // שאלה 1 - גיל
  {
    id: "age",
    title: "כמה אתה בן/בת?",
    subtitle: "הגיל עוזר לנו להתאים את התוכנית בצורה מיטבית",
    question: "מה הגיל שלך?",
    type: "single",
    icon: "👤",
    category: "essential",
    required: true,

    options: [
      {
        id: "18-25",
        label: "18-25",
        description: "צעיר ומלא אנרגיה",
        aiInsight: "גיל מעולה להתחיל בניית הרגלים בריאים!",
      },
      {
        id: "26-35",
        label: "26-35",
        description: "בשיא הכוחות",
        aiInsight: "הגיל המושלם לאימונים אינטנסיביים!",
      },
      {
        id: "36-45",
        label: "36-45",
        description: "ניסיון חיים + מוטיבציה",
        aiInsight: "שילוב מושלם של ניסיון ומוטיבציה!",
      },
      {
        id: "46-55",
        label: "46-55",
        description: "בוגר ומנוסה",
        aiInsight: "הגיל הטוב ביותר לאימונים חכמים ומדוקדקים!",
      },
      {
        id: "56+",
        label: "56+",
        description: "חכם ופעיל",
        aiInsight: "כל הכבוד! אימונים בגיל הזה הם השקעה בעתיד!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.positive(option.aiInsight || "בחירה מעולה!");
      },
    },

    helpText: "הגיל מאפשר לנו להתאים את עצימות האימונים",
  },

  // שאלה 2 - מטרה
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
        description: "שריפת קלוריות ושיפור הרכב הגוף",
        aiInsight: "נתמקד באימונים שורפי קלוריות עם קרדיו ו-HIIT!",
      },
      {
        id: "muscle_gain",
        label: "עליה במסת שריר",
        description: "בניית שרירים וחיזוק הגוף",
        aiInsight: "נבנה תוכנית כוח מתקדמת עם דגש על צמיחת שרירים!",
      },
      {
        id: "strength_improvement",
        label: "שיפור כוח",
        description: "הגברת כוח ויכולת פיזית",
        aiInsight: "נתמקד בתרגילים מורכבים ובהעלאת משקולות!",
      },
      {
        id: "endurance_improvement",
        label: "שיפור סיבולת",
        description: "הגברת סיבולת לב-ריאה ושרירית",
        aiInsight: "נבנה תוכנית סיבולת עם אימוני קרדיו מתקדמים!",
      },
      {
        id: "general_health",
        label: "בריאות כללית",
        description: "שמירה על כושר ובריאות טובה",
        aiInsight: "נשלב את כל סוגי האימונים לבריאות מיטבית!",
      },
      {
        id: "injury_rehab",
        label: "שיקום מפציעה",
        description: "החלמה והתחזקות אחרי פציעה",
        aiInsight: "נתמקד באימונים עדינים ובשיקום מתקדם!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.insight(option.aiInsight || "מטרה ברורה!");
      },
    },

    helpText: "המטרה תקבע את סוג האימונים והתרגילים",
  },

  // שאלה 3 - רמת ניסיון
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
        description: "חדש לעולם האימונים",
        aiInsight: "נתחיל בעדינות ונבנה בסיס חזק!",
      },
      {
        id: "intermediate",
        label: "בינוני (6-24 חודשים)",
        description: "יש לי קצת ניסיון",
        aiInsight: "זמן לקחת את זה לשלב הבא!",
      },
      {
        id: "advanced",
        label: "מתקדם (2-5 שנים)",
        description: "מאמן בקביעות כבר כמה שנים",
        aiInsight: "אתה מוכן לאתגרים מתקדמים!",
      },
      {
        id: "expert",
        label: "מקצועי (5+ שנים)",
        description: "ניסיון רב ויידע מעמיק",
        aiInsight: "בואו ניצור משהו מאתגר ומותאם אישית!",
      },
      {
        id: "athlete",
        label: "ספורטאי תחרותי",
        description: "אימונים ברמה תחרותית",
        aiInsight: "נבנה תוכנית ברמה פרו לביצועים מקסימליים!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.positive(option.aiInsight || "מעולה!");
      },
    },

    helpText: "רמת הניסיון תקבע את עצימות ומורכבות האימונים",
  },

  // שאלה 4 - תדירות
  {
    id: "frequency",
    title: "כמה פעמים בשבוע תרצה להתאמן?",
    subtitle: "תדירות האימונים חשובה לבניית תוכנית מתאימה",
    question: "כמה פעמים בשבוע אתה יכול להתאמן?",
    type: "single",
    icon: "📅",
    category: "essential",
    required: true,

    options: [
      {
        id: "2-times",
        label: "2 פעמים בשבוע",
        description: "אימונים קצרים ויעילים",
        aiInsight: "נמקסם כל אימון עם תרגילים מורכבים!",
      },
      {
        id: "3-times",
        label: "3 פעמים בשבוע",
        description: "קצב נוח ויעיל",
        aiInsight: "הקצב המושלם להתחלה וקידום!",
      },
      {
        id: "4-times",
        label: "4 פעמים בשבוע",
        description: "מחויבות גבוהה לכושר",
        aiInsight: "נוכל לפצל ולהתמחות בקבוצות שרירים!",
      },
      {
        id: "5-times",
        label: "5 פעמים בשבוע",
        description: "האימונים הם חלק מהשגרה",
        aiInsight: "רמת מחויבות מרשימה! נבנה תוכנית מתקדמת!",
      },
      {
        id: "6-7-times",
        label: "6-7 פעמים בשבוע",
        description: "אימונים הם אורח חיים",
        aiInsight: "אורח חיים של אתלטים! נוסיף גיוון ומנוחה חכמה!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.positive(option.aiInsight || "בחירה חכמה!");
      },
    },

    helpText: "התדירות תקבע את פיצול האימונים",
  },

  // שאלה 5 - משך אימון
  {
    id: "duration",
    title: "כמה זמן יש לך לאימון?",
    subtitle: "משך האימון יקבע את תכנון התרגילים",
    question: "כמה זמן אתה יכול להקדיש לאימון?",
    type: "single",
    icon: "⏱️",
    category: "essential",
    required: true,

    options: [
      {
        id: "20-30-min",
        label: "20-30 דקות",
        description: "אימון קצר ויעיל",
        aiInsight: "נמקסם כל דקה עם אימוני HIIT אינטנסיביים!",
      },
      {
        id: "30-45-min",
        label: "30-45 דקות",
        description: "זמן נוח לאימון מלא",
        aiInsight: "הזמן המושלם לאימון מקיף ויעיל!",
      },
      {
        id: "45-60-min",
        label: "45-60 דקות",
        description: "אימון מפורט ויסודי",
        aiInsight: "זמן מעולה לפיתוח כל קבוצות השרירים!",
      },
      {
        id: "60-90-min",
        label: "60-90 דקות",
        description: "אימון ארוך ומעמיק",
        aiInsight: "זמן רב לבניית כוח ומסת שריר מתקדמת!",
      },
      {
        id: "90-plus-min",
        label: "90+ דקות",
        description: "אימון מקצועי מורחב",
        aiInsight: "זמן לאימונים ברמת אתלטים מקצועיים!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.suggestion(
          option.aiInsight || "בחירה מעולה!"
        );
      },
    },

    helpText: "משך האימון יקבע את מספר התרגילים והסטים",
  },

  // שאלה ראשית - איזה ציוד זמין
  {
    id: "equipment_availability",
    title: "איזה ציוד זמין לך לאימונים?",
    subtitle: "בחר את המצב שהכי מתאים לך",
    question: "איזה ציוד יש לך לאימונים?",
    type: "single",
    icon: "🏋️",
    category: "essential",
    required: true,

    options: [
      {
        id: "no_equipment",
        label: "ללא ציוד (בבית עם חפצים בסיסיים)",
        description: "משקל גוף + מזרון + כיסא + חפצים ביתיים",
        aiInsight:
          "אימונים עם משקל גוף וחפצים ביתיים יכולים להיות סופר יעילים!",
      },
      {
        id: "home_equipment",
        label: "יש לי ציוד בבית",
        description: "דמבלים, גומיות, או ציוד ביתי אחר",
        aiInsight: "ציוד ביתי פותח הרבה אפשרויות לאימונים מגוונים!",
      },
      {
        id: "gym_access",
        label: "יש לי גישה לחדר כושר",
        description: "מנוי בחדר כושר עם ציוד מקצועי",
        aiInsight: "חדר כושר נותן גישה לציוד מקצועי ואפשרויות אינסופיות!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.positive(option.aiInsight || "בחירה מעולה!");
      },

      influenceNextQuestions: (answer) => {
        const option = answer as SmartOption;

        switch (option?.id) {
          case "no_equipment":
            return ["bodyweight_equipment_options"];
          case "home_equipment":
            return ["home_equipment_options"];
          case "gym_access":
            return ["gym_equipment_options"];
          default:
            return [];
        }
      },
    },

    helpText: "זה יקבע איזה שאלות תקבל הבא",
  },

  // ========== אימונים ללא ציוד (עם חפצים ביתיים) ==========
  {
    id: "bodyweight_equipment_options",
    title: "איזה חפצים יש לך בבית?",
    subtitle: "בחר את מה שזמין לך לאימונים עם משקל גוף",
    question: "איזה חפצים בסיסיים יש לك בבית?",
    type: "multiple",
    icon: "🏠",
    category: "essential",
    required: true,

    options: [
      {
        id: "bodyweight_only",
        label: "רק משקל גוף",
        description: "אין חפצים נוספים",
        image: require("../../assets/bodyweight.png"),
        metadata: { equipment: ["bodyweight"] },
        aiInsight: "הבסיס הכי טבעי!",
      },
      {
        id: "mat_available",
        label: "מזרון/שטיח",
        description: "לתרגילי רצפה נוחים",
        image: require("../../assets/yoga_mat.png"),
        metadata: { equipment: ["mat"] },
        aiInsight: "נוחות לתרגילי ליבה!",
      },
      {
        id: "chair_available",
        label: "כיסא יציב",
        description: "לתרגילי דחיפה וכוח",
        metadata: { equipment: ["chair"] },
        aiInsight: "כיסא פותח הרבה אפשרויות!",
      },
      {
        id: "wall_space",
        label: "קיר פנוי",
        description: "לתרגילי קיר ומתיחות",
        metadata: { equipment: ["wall"] },
        aiInsight: "הקיר הוא הכלי הכי יציב!",
      },
      {
        id: "stairs_available",
        label: "מדרגות",
        description: "לאימוני קרדיו וכוח רגליים",
        metadata: { equipment: ["stairs"] },
        aiInsight: "מדרגות = חדר כושר טבעי!",
      },
      {
        id: "towel_available",
        label: "מגבת",
        description: "להתנגדות ומתיחות",
        metadata: { equipment: ["towel"] },
        aiInsight: "מגבת יכולה להיות גומית התנגדות!",
      },
      {
        id: "water_bottles",
        label: "בקבוקי מים מלאים",
        description: "כמשקולות קלות",
        metadata: { equipment: ["water_bottles"] },
        aiInsight: "משקולות ביתיות מושלמות!",
      },
      {
        id: "pillow_available",
        label: "כרית",
        description: "לתמיכה ותרגילי יציבות",
        metadata: { equipment: ["pillow"] },
        aiInsight: "תמיכה נוחה לתרגילים!",
      },
      {
        id: "table_sturdy",
        label: "שולחן חזק",
        description: "לתרגילי שכיבה תמיכה",
        metadata: { equipment: ["table"] },
        aiInsight: "פלטפורמה מעולה לתרגילים!",
      },
      {
        id: "backpack_heavy",
        label: "תיק עם ספרים",
        description: "להוספת משקל לתרגילים",
        metadata: { equipment: ["weighted_backpack"] },
        aiInsight: "משקל נוסף לאתגר גדול יותר!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer) => {
        const options = answer as SmartOption[];
        const count = Array.isArray(options) ? options.length : 0;

        if (count === 0) {
          return AIFeedbackGenerator.suggestion("בחר לפחות אפשרות אחת");
        } else if (count >= 5) {
          return AIFeedbackGenerator.insight(
            "מעולה! יש לך הרבה אפשרויות לאימונים מגוונים"
          );
        } else {
          return AIFeedbackGenerator.positive(
            "נהדר! נכין אימונים יצירתיים עם מה שיש לך"
          );
        }
      },
    },

    helpText: "חפצים ביתיים יכולים להפוך אימון רגיל לאימון מעניין ויעיל",
  },

  // ========== ציוד ביתי ==========
  {
    id: "home_equipment_options",
    title: "איזה ציוד יש לך בבית?",
    subtitle: "בחר כמה פריטים שרוצה - כל ציוד נוסף מרחיב אפשרויות!",
    question: "איזה ציוד אימונים יש לך בבית? (ניתן לבחור מספר אפשרויות)",
    type: "multiple",
    icon: "🏠",
    category: "essential",
    required: true,

    options: [
      {
        id: "dumbbells_home",
        label: "דמבלים",
        description: "משקולות יד - קבועות או מתכווננות",
        image: require("../../assets/dumbbells.png"),
        metadata: { equipment: ["dumbbells"] },
        aiInsight: "הציוד הכי גמיש לכוח!",
      },
      {
        id: "resistance_bands",
        label: "גומיות התנגדות",
        description: "רצועות אלסטיות להתנגדות משתנה",
        image: require("../../assets/resistance_bands.png"),
        metadata: { equipment: ["resistance_bands"] },
        aiInsight: "קלות ויעילות מדהימה!",
      },
      {
        id: "kettlebell_home",
        label: "קטלבל",
        description: "משקולת עם ידית לתרגילים דינמיים",
        image: require("../../assets/kettlebell.png"),
        metadata: { equipment: ["kettlebell"] },
        aiInsight: "כוח + קרדיו בכלי אחד!",
      },
      {
        id: "yoga_mat_home",
        label: "מזרן יוגה",
        description: "בסיס נוח לתרגילי רצפה",
        image: require("../../assets/yoga_mat.png"),
        metadata: { equipment: ["yoga_mat"] },
        aiInsight: "בסיס חיוני לתרגילי ליבה!",
      },
      {
        id: "pullup_bar",
        label: "מוט מתח",
        description: "מוט מתכוונן לדלת",
        image: require("../../assets/pullup_bar.png"),
        metadata: { equipment: ["pullup_bar"] },
        aiInsight: "פותח עולם של תרגילי גב!",
      },
      {
        id: "foam_roller",
        label: "גלגל מסאז'",
        description: "לשחרור שרירים והתאוששות",
        image: require("../../assets/foam_roller.png"),
        metadata: { equipment: ["foam_roller"] },
        aiInsight: "התאוששות חכמה!",
      },
      {
        id: "exercise_ball",
        label: "כדור פיזיותרפיה",
        description: "לתרגילי יציבות וליבה",
        metadata: { equipment: ["exercise_ball"] },
        aiInsight: "יציבות ואיזון מושלמים!",
      },
      {
        id: "jump_rope",
        label: "חבל קפיצה",
        description: "לאימוני קרדיו מהירים",
        metadata: { equipment: ["jump_rope"] },
        aiInsight: "קרדיו יעיל בזמן קצר!",
      },
      {
        id: "home_bench",
        label: "ספסל אימונים",
        description: "ספסל מתכוונן לבית",
        image: require("../../assets/bench.png"),
        metadata: { equipment: ["bench"] },
        aiInsight: "פותח אפשרויות אינסופיות!",
      },
      {
        id: "barbell_home",
        label: "ברבל ביתי",
        description: "מוט עם משקולות לבית",
        image: require("../../assets/barbell.png"),
        metadata: { equipment: ["barbell"] },
        aiInsight: "רמה מקצועית בבית!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer) => {
        const options = answer as SmartOption[];
        const count = Array.isArray(options) ? options.length : 0;

        if (count === 0) {
          return AIFeedbackGenerator.suggestion("בחר את הציוד הזמין לך");
        } else if (count >= 6) {
          return AIFeedbackGenerator.insight(
            "חדר כושר ביתי מלא! נוכל ליצור תוכניות מקצועיות"
          );
        } else {
          return AIFeedbackGenerator.positive(
            "מעולה! יש לך ציוד טוב לאימונים מגוונים"
          );
        }
      },
    },

    helpText: "בחר רק את הציוד שבאמת יש לך או שאתה מתכנן לקנות",
  },

  // ========== ציוד חדר כושר ==========
  {
    id: "gym_equipment_options",
    title: "איזה ציוד יש בחדר הכושר שלך?",
    subtitle: "בחר את הציוד הזמין או שאתה הכי אוהב להשתמש בו",
    question: "איזה ציוד זמין לך בחדר הכושר? (ניתן לבחור מספר אפשרויות)",
    type: "multiple",
    icon: "🏋️‍♂️",
    category: "essential",
    required: true,

    options: [
      {
        id: "free_weights_gym",
        label: "משקולות חופשיות",
        description: "דמבלים וברבלים עם צלחות משקל",
        image: require("../../assets/free_weights.png"),
        metadata: { equipment: ["dumbbells", "barbell"] },
        aiInsight: "הבסיס של אימוני כוח אמיתיים!",
      },
      {
        id: "squat_rack_gym",
        label: "מתקן סקוואט",
        description: "מדף ברבל עם מגני בטיחות",
        image: require("../../assets/squat_rack.png"),
        metadata: { equipment: ["squat_rack"] },
        aiInsight: "המלך של תרגילי הרגליים!",
      },
      {
        id: "bench_press_gym",
        label: "ספסל לחיצה",
        description: "ספסל מתכוונן עם מדף ברבל",
        image: require("../../assets/bench.png"),
        metadata: { equipment: ["bench_press"] },
        aiInsight: "חיוני לאימוני חזה מקצועיים!",
      },
      {
        id: "cable_machine_gym",
        label: "מכונת כבלים",
        description: "מערכת פולי רב-תכליתית",
        image: require("../../assets/cable_machine.png"),
        metadata: { equipment: ["cable_machine"] },
        aiInsight: "גמישות אינסופית לכל השרירים!",
      },
      {
        id: "leg_press_gym",
        label: "מכונת לג פרס",
        description: "מכונה ללחיצת רגליים בישיבה",
        image: require("../../assets/leg_press.png"),
        metadata: { equipment: ["leg_press"] },
        aiInsight: "כוח רגליים מקסימלי בבטיחות!",
      },
      {
        id: "lat_pulldown_gym",
        label: "מכונת לט פולדאון",
        description: "משיכה למטה לשרירי הגב",
        image: require("../../assets/lat_pulldown.png"),
        metadata: { equipment: ["lat_pulldown"] },
        aiInsight: "מושלמת לפיתוח גב רחב!",
      },
      {
        id: "smith_machine_gym",
        label: "מכונת סמית'",
        description: "ברבל מונחה על מסילות בטוחות",
        image: require("../../assets/smith_machine.png"),
        metadata: { equipment: ["smith_machine"] },
        aiInsight: "בטיחות מקסימלית עם עומסים כבדים!",
      },
      {
        id: "cardio_machines_gym",
        label: "מכונות קרדיו",
        description: "הליכון, אליפטיקל, אופני כושר",
        image: require("../../assets/treadmill.png"),
        metadata: { equipment: ["treadmill", "elliptical"] },
        aiInsight: "חיוני לחימום וקרדיו איכותי!",
      },
      {
        id: "chest_press_gym",
        label: "מכונת חזה",
        description: "לחיצת חזה במכונה מונחית",
        image: require("../../assets/chest_press.png"),
        metadata: { equipment: ["chest_press"] },
        aiInsight: "בטוחה ויעילה לפיתוח החזה!",
      },
      {
        id: "rowing_machine_gym",
        label: "מכונת חתירה",
        description: "אימון גב וקרדיו משולב",
        image: require("../../assets/rowing_machine.png"),
        metadata: { equipment: ["rowing_machine"] },
        aiInsight: "אימון מלא לכל הגוף בתנועה אחת!",
      },
    ],

    aiLogic: {
      generateFeedback: (answer) => {
        const options = answer as SmartOption[];
        const count = Array.isArray(options) ? options.length : 0;

        if (count === 0) {
          return AIFeedbackGenerator.suggestion(
            "בחר את הציוד הזמין בחדר הכושר"
          );
        } else if (count >= 7) {
          return AIFeedbackGenerator.insight(
            "חדר כושר מדהים! נוכל ליצור תוכניות ברמה מקצועית גבוהה"
          );
        } else {
          return AIFeedbackGenerator.positive("מעולה! יש לך גישה לציוד איכותי");
        }
      },
    },

    helpText: "בחר את הציוד שאתה הכי נוח להשתמש בו או שזמין ברוב הזמן",
  },
];

// פונקציות לניהול השאלון
export class SmartQuestionnaireManager {
  private answers: Map<string, any> = new Map();
  private currentQuestionIndex = 0;
  private questionsToShow: string[] = [
    "age",
    "goal",
    "experience",
    "frequency",
    "duration",
    "equipment_availability",
  ];

  getCurrentQuestion(): SmartQuestion | null {
    if (this.currentQuestionIndex >= this.questionsToShow.length) {
      return null;
    }

    const questionId = this.questionsToShow[this.currentQuestionIndex];
    return SMART_QUESTIONNAIRE.find((q) => q.id === questionId) || null;
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

    // עדכן רשימת שאלות עתידיות
    if (question.aiLogic.influenceNextQuestions) {
      const newQuestions = question.aiLogic.influenceNextQuestions(answer);
      if (newQuestions && newQuestions.length > 0) {
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
