/**
 * @file src/data/dietData.ts
 * @brief נתוני תזונה ודיאטות
 * @brief Diet and nutrition data
 * @description אפשרויות תזונה עם תמונות ותיאורים
 * @description Diet options with images and descriptions
 */

import { ImageSourcePropType } from "react-native";

// ממשק אפשרות תזונה
// Diet option interface
export interface DietOption {
  id: string;
  label: string;
  image?: string; // קישור ישיר לאינטרנט
  description?: string;
  isDefault?: boolean;
  isPremium?: boolean;
  tags?: string[]; // מילים לחיפוש/סינון
  allowedFoods?: string[]; // מזונות עיקריים
  forbiddenFoods?: string[]; // מזונות שנמנעים מהם
  sampleMeal?: string; // דוגמה לארוחה
  linkToGuide?: string; // מדריך/כתבה מורחבת
}

// אפשרויות תזונה עם תמונות
// Diet options with images
export const DIET_OPTIONS: DietOption[] = [
  {
    id: "none_diet",
    label: "אין תזונה מיוחדת",
    image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    description: "אוכל מכל סוגי המזון.",
    isDefault: true,
    tags: ["רגיל", "מאוזן", "לא מגביל"],
    allowedFoods: ["כל סוגי המזון"],
    forbiddenFoods: [],
    sampleMeal: "עוף עם אורז, ירקות, לחם מלא ויוגורט.",
    linkToGuide:
      "https://www.health.gov.il/Subjects/FoodAndNutrition/Pages/default.aspx",
  },
  {
    id: "vegan",
    label: "טבעוני",
    image:
      "https://cdn.pixabay.com/photo/2016/03/31/19/14/leaf-1295329_1280.png",
    description: "ללא מוצרים מן החי (כולל ביצים, דבש, חלב).",
    tags: ["ללא חיות", "צומח"],
    allowedFoods: ["ירקות, פירות, דגנים, קטניות, אגוזים, טופו"],
    forbiddenFoods: ["בשר, דגים, חלב, ביצים, דבש"],
    sampleMeal: "קציצות עדשים עם קינואה וסלט ירוק.",
    linkToGuide: "https://vegan-friendly.co.il/vegan-diet/",
  },
  {
    id: "vegetarian",
    label: "צמחוני",
    image: "https://cdn-icons-png.flaticon.com/512/135/135620.png",
    description: "ללא בשר ודגים, כולל מוצרי חלב וביצים.",
    tags: ["צומח", "ללא בשר"],
    allowedFoods: ["ירקות, פירות, דגנים, קטניות, ביצים, מוצרי חלב"],
    forbiddenFoods: ["בשר, עוף, דגים"],
    sampleMeal: "אומלט ירקות עם גבינה וטוסט.",
    linkToGuide: "https://www.csc.org.il/diet/vegetarian/",
  },
  {
    id: "keto",
    label: "קטוגני",
    image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    description: "דל פחמימות, עתיר שומן. הרבה שומן, מעט פחמימה.",
    tags: ["דל פחמימות", "שומן גבוה"],
    allowedFoods: ["בשר, דגים, ביצים, גבינות שמנות, אגוזים, אבוקדו, ירוקים"],
    forbiddenFoods: ["לחם, אורז, פסטה, תפוחי אדמה, סוכר, פירות (למעט יער)"],
    sampleMeal: "סלמון עם אבוקדו וסלט חסה.",
    linkToGuide:
      "https://www.dietnet.co.il/%D7%93%D7%99%D7%90%D7%98%D7%94-%D7%A7%D7%98%D7%95%D7%92%D7%A0%D7%99%D7%AA/",
  },
  {
    id: "paleo",
    label: "פליאו",
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995595.png",
    description: "תזונת 'אדם קדמון', הרבה חלבון, לא מעובד.",
    tags: ["פלאו", "קדום", "לא מעובד"],
    allowedFoods: ["בשר, דגים, ירקות, פירות, אגוזים, שורשים"],
    forbiddenFoods: ["דגנים, סוכר, מוצרי חלב, מזון מעובד"],
    sampleMeal: "סטייק עם בטטה צלויה וסלט.",
    linkToGuide: "https://www.paleodiet.co.il/",
  },
  {
    id: "low_carb",
    label: "דל פחמימות",
    image: "https://cdn-icons-png.flaticon.com/512/1686/1686051.png",
    description: "הפחתה בכמות הפחמימות בתפריט.",
    tags: ["פחמימות נמוכות", "הרזיה"],
    allowedFoods: ["בשר, ירקות, ביצים, דגים, גבינות"],
    forbiddenFoods: ["לחם, פסטה, אורז, סוכר"],
    sampleMeal: "פרגית בתנור עם ירקות מאודים.",
    linkToGuide: "https://www.dietician.org.il/?CategoryID=287&ArticleID=605",
  },
  {
    id: "mediterranean",
    label: "ים תיכונית",
    image: "https://cdn-icons-png.flaticon.com/512/3075/3075973.png",
    description: "דגש על ירקות, דגים, שמן זית ודגנים מלאים.",
    tags: ["בריא", "מגוון", "שמן זית"],
    allowedFoods: ["ירקות, פירות, דגים, שמן זית, קטניות, דגנים מלאים"],
    forbiddenFoods: ["מעובדים, בשר אדום (לעיתים רחוקות)"],
    sampleMeal: "דג ברוטב עגבניות עם סלט ופרוסת לחם מלא.",
    linkToGuide:
      "https://www.health.gov.il/Subjects/FoodAndNutrition/Pages/mediterranean_diet.aspx",
  },
  {
    id: "intermittent_fasting",
    label: "צום לסירוגין",
    image: "https://cdn-icons-png.flaticon.com/512/2553/2553672.png",
    description: "אכילה בחלונות זמן קבועים (למשל 16:8).",
    tags: ["צום", "חילוף חומרים"],
    allowedFoods: ["כל המזון – בחלון אכילה מוגדר"],
    forbiddenFoods: ["אין, פרט לאכילה מחוץ לזמן שנקבע"],
    sampleMeal: "חביתה עם ירקות, אגוזים, גבינה בולגרית.",
    linkToGuide:
      "https://www.dietnet.co.il/%D7%A6%D7%95%D7%9D-%D7%9C%D7%A1%D7%99%D7%A8%D7%95%D7%92%D7%99%D7%9F/",
  },
  {
    id: "gluten_free",
    label: "ללא גלוטן",
    image: "https://cdn-icons-png.flaticon.com/512/2718/2718224.png",
    description: "ללא חיטה ודגנים שמכילים גלוטן.",
    tags: ["צליאק", "אלרגיה", "ללא חיטה"],
    allowedFoods: ['בשר, ירקות, פירות, אורז, תפו"א, קטניות'],
    forbiddenFoods: ["חיטה, שעורה, שיפון, לחמים רגילים, בירה"],
    sampleMeal: "שניצל תירס עם אורז וסלט.",
    linkToGuide: "https://www.celiac.org.il/template/default.aspx?maincat=1",
  },
  {
    id: "high_protein",
    label: "עתיר חלבון",
    image: "https://cdn-icons-png.flaticon.com/512/1046/1046872.png",
    description: "תפריט עם דגש על הרבה חלבון.",
    tags: ["חלבון גבוה", "ספורט"],
    allowedFoods: ["בשר רזה, דגים, ביצים, טופו, קטניות, גבינות רזות"],
    forbiddenFoods: ["סוכר, שומן טראנס, חטיפים"],
    sampleMeal: "יוגורט עם גרנולה וביצים קשות.",
    linkToGuide: "https://www.dietitian.org.il/?CategoryID=287&ArticleID=569",
  },
];
