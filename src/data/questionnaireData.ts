/**
 * @file src/data/questionnaireData.ts
 * @brief מאגר כל השאלות, התשובות, התמונות והלוגיקה של השאלון
 * @brief Repository of all questions, answers, images and questionnaire logic
 * @description כל הנתונים של השאלון במקום אחד לתחזוקה קלה
 * @description All questionnaire data in one place for easy maintenance
 */

import { ImageSourcePropType } from "react-native";

// סוגי שאלות
// Question types
export type QuestionType =
  | "single"
  | "multiple"
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
  dynamicOptions?: (answers: any) => string[] | OptionWithImage[];
  followUp?: (answer: any) => Question | null;
  required?: boolean;
  helpText?: string;
  defaultValue?: any;
}

// ציוד לבית
// Home equipment
export const HOME_EQUIPMENT: OptionWithImage[] = [
  {
    id: "none",
    label: "ללא ציוד",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3048/3048402.png" }, // bodyweight icon
    description: "אימונים עם משקל גוף בלבד",
    isDefault: true,
  },
  {
    id: "dumbbells",
    label: "משקולות יד",
    image: {
      uri: "https://storage.googleapis.com/gemini-prod/images/a6c7104b-9e96-410a-85d7-f47285199b0c",
    }, // dumbbells
    description: "זוג משקולות מתכווננות",
    isPremium: true,
  },
  {
    id: "resistance_bands",
    label: "גומיות התנגדות",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/7491/7491421.png" }, // resistance bands
    description: "סט גומיות בעוצמות שונות",
  },
  {
    id: "pullup_bar",
    label: "מוט מתח",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3048/3048425.png" }, // pull up bar
    description: "להתקנה על משקוף הדלת",
  },
  {
    id: "yoga_mat",
    label: "מזרן יוגה",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/2647/2647625.png" }, // yoga mat
    description: "מזרן לתרגילי רצפה",
  },
  {
    id: "kettlebell",
    label: "קטלבל",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3043/3043090.png" }, // kettlebell
    description: "משקולת כדורית עם ידית",
    isPremium: true,
  },
  {
    id: "foam_roller",
    label: "רולר",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/7261/7261885.png" }, // foam roller
    description: "לשחרור שרירים",
  },
  {
    id: "trx",
    label: "רצועות TRX",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/7261/7261767.png" }, // suspension trainer
    description: "רצועות אימון פונקציונלי",
    isPremium: true,
  },
  {
    id: "bench",
    label: "ספסל אימונים",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3311/3311579.png" }, // workout bench
    description: "ספסל מתכוונן",
    isPremium: true,
  },
];

// ציוד לחדר כושר
// Gym equipment
export const GYM_EQUIPMENT: OptionWithImage[] = [
  {
    id: "free_weights",
    label: "משקולות חופשיות",
    image: require("../../assets/adjustable_dumbbells.png"), // dumbbells
    description: "משקולות יד ומוטות",
    isDefault: true,
  },
  {
    id: "barbell",
    label: "מוט ישר",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3043/3043120.png" }, // barbell
    description: "מוט אולימפי עם משקולות",
    isDefault: true,
  },
  {
    id: "smith_machine",
    label: "מכונת סמית",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/7261/7261910.png" }, // smith machine
    description: "מוט מונחה על מסילות",
  },
  {
    id: "cable_machine",
    label: "מכונת כבלים",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3311/3311631.png" }, // cable machine
    description: "מערכת גלגלות וכבלים",
  },
  {
    id: "leg_press",
    label: "מכונת לחיצת רגליים",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3311/3311598.png" }, // leg press
    description: "לחיצת רגליים בזווית",
  },
  {
    id: "chest_press",
    label: "מכונת לחיצת חזה",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3311/3311587.png" }, // chest press
    description: "לחיצת חזה במכונה",
  },
  {
    id: "lat_pulldown",
    label: "מכונת פולי עליון",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3311/3311639.png" }, // lat pulldown
    description: "משיכה לרחב",
  },
  {
    id: "rowing_machine",
    label: "מכונת חתירה",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3048/3048395.png" }, // rowing machine
    description: "לאימון קרדיו",
  },
  {
    id: "treadmill",
    label: "הליכון",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3048/3048381.png" }, // treadmill
    description: "להליכה וריצה",
  },
  {
    id: "bike",
    label: "אופני כושר",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3048/3048389.png" }, // exercise bike
    description: "לאימון קרדיו",
  },
  {
    id: "squat_rack",
    label: "כלוב סקוואט",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/7261/7261844.png" }, // squat rack
    description: "לסקוואט ולחיצת כתפיים",
  },
  {
    id: "preacher_curl",
    label: "ספסל פריצ'ר",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3311/3311615.png" }, // preacher bench
    description: "לכיפוף מרפקים",
  },
];

// אפשרויות תזונה עם תמונות
// Diet options with images
export const DIET_OPTIONS: OptionWithImage[] = [
  {
    id: "none",
    label: "אין תזונה מיוחדת",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/2515/2515183.png" }, // food variety
    description: "אוכל מכל סוגי המזון",
  },
  {
    id: "vegan",
    label: "טבעוני",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/2329/2329865.png" }, // vegan symbol
    description: "ללא מוצרים מן החי",
  },
  {
    id: "vegetarian",
    label: "צמחוני",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/2329/2329860.png" }, // vegetarian symbol
    description: "ללא בשר ודגים",
  },
  {
    id: "keto",
    label: "קטוגני",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3144/3144240.png" }, // avocado (keto symbol)
    description: "דל פחמימות, עתיר שומן",
  },
  {
    id: "paleo",
    label: "פליאו",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/2729/2729007.png" }, // meat icon
    description: "תזונת הציידים-לקטים",
  },
  {
    id: "low_carb",
    label: "דל פחמימות",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/2515/2515263.png" }, // no bread
    description: "הגבלת פחמימות",
  },
  {
    id: "other",
    label: "אחר",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/2515/2515275.png" }, // diet plan
    description: "תזונה מותאמת אישית",
  },
];

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
  // שאלת ציוד לבית
  // Home equipment question
  {
    id: "home_equipment",
    question: "איזה ציוד יש לך בבית?",
    subtitle: "💡 שקול רכישת ציוד נוסף לאימונים מגוונים ותוצאות טובות יותר",
    icon: "home-variant",
    type: "multiple",
    condition: (answers) =>
      answers.location === "בית" || answers.location === "גם וגם",
    dynamicOptions: () => HOME_EQUIPMENT,
    helpText: "ללא ציוד הוא ברירת המחדל - בחר ציוד נוסף אם יש",
    required: true,
    defaultValue: ["none"],
  },

  // שאלת ציוד לחדר כושר
  // Gym equipment question
  {
    id: "gym_equipment",
    question: "איזה ציוד זמין לך בחדר הכושר?",
    subtitle: "רוב חדרי הכושר כוללים משקולות חופשיות ומוטות",
    icon: "dumbbell",
    type: "multiple",
    condition: (answers) =>
      answers.location === "חדר כושר" || answers.location === "גם וגם",
    dynamicOptions: () => GYM_EQUIPMENT,
    helpText: "בחר את כל הציוד הזמין בחדר הכושר שלך",
    required: true,
    defaultValue: ["free_weights", "barbell"],
  },

  // שאלות נוספות לפי מטרה - ניסוחים משופרים
  // Additional questions by goal - improved phrasing
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
    icon: "food-apple",
    type: "single",
    dynamicOptions: () => DIET_OPTIONS,
    required: true,
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

// פונקציה לקבלת תמונה של ציוד
// Function to get equipment image
export function getEquipmentImage(
  equipmentId: string
): ImageSourcePropType | undefined {
  const allEquipment = [...HOME_EQUIPMENT, ...GYM_EQUIPMENT];
  const equipment = allEquipment.find((e) => e.id === equipmentId);
  return equipment?.image;
}

// פונקציה לבדיקה אם ציוד הוא פרימיום
// Function to check if equipment is premium
export function isEquipmentPremium(equipmentId: string): boolean {
  const allEquipment = [...HOME_EQUIPMENT, ...GYM_EQUIPMENT];
  const equipment = allEquipment.find((e) => e.id === equipmentId);
  return equipment?.isPremium || false;
}
