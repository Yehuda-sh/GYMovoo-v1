/**
 * @file src/data/dietData.ts
 * @brief נתוני תזונה ודיאטות | Diet and nutrition data
 * @description אפשרויות תזונה עם תמונות ותיאורים מבוססות על ממשקים מאוחדים
 * @description Diet options with images and descriptions based on unified interfaces
 * @version 2.0 - Updated with unified interfaces and enhanced data structure
 */

import { OptionWithImage, BaseOption } from "./newSmartQuestionnaire";

// ================== UNIFIED DIET INTERFACES | ממשקי תזונה מאוחדים ==================

// Nutritional profile interface for structured nutrition data
// ממשק פרופיל תזונתי למידע תזונתי מובנה
export interface NutritionalProfile {
  carbs: "low" | "medium" | "high"; // רמת פחמימות
  protein: "low" | "medium" | "high"; // רמת חלבון
  fat: "low" | "medium" | "high"; // רמת שומן
  fiber: "low" | "medium" | "high"; // רמת סיבים תזונתיים
  processingLevel: "minimal" | "moderate" | "high"; // רמת עיבוד
  calorieRange?: "very-low" | "low" | "moderate" | "high"; // טווח קלוריות
}

// Enhanced diet option interface extending the unified base
// ממשק אפשרות תזונה מורחב המרחיב את הבסיס המאוחד
export interface DietOption extends OptionWithImage {
  // Nutritional information | מידע תזונתי
  allowedFoods?: string[]; // מזונות מותרים
  forbiddenFoods?: string[]; // מזונות אסורים
  nutritionalProfile?: NutritionalProfile; // פרופיל תזונתי מובנה

  // Practical information | מידע מעשי
  sampleMeal?: string; // דוגמה לארוחה
  linkToGuide?: string; // מדריך/כתבה מורחבת
  difficultyLevel?: "easy" | "medium" | "hard"; // רמת קושי

  // Health considerations | שיקולים בריאותיים
  healthBenefits?: string[]; // יתרונות בריאותיים
  warnings?: string[]; // אזהרות או התוויות נגד
  recommendedFor?: string[]; // מומלץ עבור
}

// קטגוריות עיקריות לסינון
export const DIET_CATEGORIES = {
  GENERAL: "כללי",
  PLANT_BASED: "צמחי",
  LOW_CARB: "דל פחמימות",
  SPECIAL_NEEDS: "צרכים מיוחדים",
  LIFESTYLE: "אורח חיים",
} as const;

// מפת אייקונים מקומיים
export const DIET_ICONS = {
  none_diet: require("../../assets/none_diet.png"),
  vegan: require("../../assets/vegan.png"),
  vegetarian: require("../../assets/vegetarian.png"),
  keto: require("../../assets/keto.png"),
  paleo: require("../../assets/paleo.png"),
  other_meal: require("../../assets/other_meal.png"),
} as const;

// ================== ENHANCED DIET DATA | נתוני תזונה משופרים ==================

// אפשרויות תזונה עם נתונים מובנים ומידע מקיף
// Diet options with structured data and comprehensive information
export const DIET_OPTIONS: DietOption[] = [
  {
    id: "none_diet",
    label: "אין תזונה מיוחדת",
    image: DIET_ICONS.none_diet,
    description: "אוכל מכל סוגי המזון ללא הגבלות מיוחדות.",
    isDefault: true,
    tags: ["רגיל", "מאוזן", "לא מגביל", "כללי"],
    category: "כללי",
    allowedFoods: ["כל סוגי המזון"],
    forbiddenFoods: [],
    nutritionalProfile: {
      carbs: "medium",
      protein: "medium",
      fat: "medium",
      fiber: "medium",
      processingLevel: "moderate",
      calorieRange: "moderate",
    },
    sampleMeal: "עוף עם אורז, ירקות מאודים, לחם מלא ויוגורט.",
    difficultyLevel: "easy",
    healthBenefits: ["גמישות תזונתית", "קל למימוש", "מגוון רחב"],
    recommendedFor: ["מתחילים", "אנשים עסוקים", "ללא הגבלות רפואיות"],
    linkToGuide:
      "https://www.health.gov.il/Subjects/FoodAndNutrition/Pages/default.aspx",
  },
  {
    id: "vegan",
    label: "טבעוני",
    image: DIET_ICONS.vegan,
    description: "ללא מוצרים מן החי (כולל ביצים, דבש, חלב).",
    tags: ["ללא חיות", "צומח", "אתי", "סביבתי"],
    category: "צמחי",
    allowedFoods: [
      "ירקות",
      "פירות",
      "דגנים",
      "קטניות",
      "אגוזים",
      "טופו",
      "חלב צמחי",
    ],
    forbiddenFoods: ["בשר", "דגים", "חלב", "ביצים", "דבש", "מוצרי חלב"],
    nutritionalProfile: {
      carbs: "high",
      protein: "medium",
      fat: "medium",
      fiber: "high",
      processingLevel: "minimal",
      calorieRange: "moderate",
    },
    sampleMeal: "קציצות עדשים עם קינואה, סלט ירוק וטחינה.",
    difficultyLevel: "medium",
    healthBenefits: [
      "עשיר בסיבים",
      "נמוך בשומן רווי",
      "אנטי דלקתי",
      "ידידותי לסביבה",
    ],
    warnings: ["צריך תוספי B12", "תכנון מזון מדויק", "מחסור אפשרי בחלבון"],
    recommendedFor: [
      "מודעים סביבתית",
      "מחפשי אורח חיים בריא",
      "בעלי בעיות עיכול",
    ],
    linkToGuide: "https://vegan-friendly.co.il/vegan-diet/",
  },
  {
    id: "vegetarian",
    label: "צמחוני",
    image: DIET_ICONS.vegetarian,
    description: "ללא בשר ודגים, כולל מוצרי חלב וביצים.",
    tags: ["צומח", "ללא בשר", "ביצים", "חלב"],
    category: "צמחי",
    allowedFoods: [
      "ירקות",
      "פירות",
      "דגנים",
      "קטניות",
      "ביצים",
      "מוצרי חלב",
      "אגוזים",
    ],
    forbiddenFoods: ["בשר", "עוף", "דגים", "מרק בשר"],
    nutritionalProfile: {
      carbs: "medium",
      protein: "medium",
      fat: "medium",
      fiber: "high",
      processingLevel: "minimal",
      calorieRange: "moderate",
    },
    sampleMeal: "אומלט ירקות עם גבינה, טוסט מלא ויוגורט פירות.",
    difficultyLevel: "easy",
    healthBenefits: ["עשיר בסיבים", "מקור טוב לחלבון", "קל ליישום"],
    recommendedFor: [
      "מתחילים בתזונה צמחית",
      "רוצים להפחית בשר",
      "בעלי מערכת עיכול רגישה",
    ],
    linkToGuide: "https://www.csc.org.il/diet/vegetarian/",
  },
  {
    id: "keto",
    label: "קטוגני",
    image: DIET_ICONS.keto,
    description: "דל פחמימות ועתיר שומן לכניסה לקטוזיס.",
    isPremium: true,
    tags: ["דל פחמימות", "שומן גבוה", "קטוזיס", "הרזיה"],
    category: "דל פחמימות",
    allowedFoods: [
      "בשר",
      "דגים",
      "ביצים",
      "גבינות שמנות",
      "אגוזים",
      "אבוקדו",
      "ירקות ירוקים",
    ],
    forbiddenFoods: ["לחם", "אורז", "פסטה", "תפוחי אדמה", "סוכר", "רוב הפירות"],
    nutritionalProfile: {
      carbs: "low",
      protein: "medium",
      fat: "high",
      fiber: "low",
      processingLevel: "minimal",
      calorieRange: "moderate",
    },
    sampleMeal: "סלמון בחמאה עם אבוקדו וסלט חסה.",
    difficultyLevel: "hard",
    healthBenefits: ["הרזיה מהירה", "בקרת סוכר", "בהירות נפשית", "הפחתת דלקות"],
    warnings: [
      "דורש ליווי רפואי",
      "תופעות לוואי בהתחלה",
      "לא מתאים לכל בעיה רפואית",
    ],
    recommendedFor: ["רוצים להרזות", "סוכרתיים סוג 2", "מקרים של אפילפסיה"],
    linkToGuide:
      "https://www.dietnet.co.il/%D7%93%D7%99%D7%90%D7%98%D7%94-%D7%A7%D7%98%D7%95%D7%92%D7%A0%D7%99%D7%AA/",
  },
  {
    id: "paleo",
    label: "פליאו",
    image: DIET_ICONS.paleo,
    description: "תזונת 'אדם קדמון' - מזון לא מעובד וטבעי.",
    tags: ["פלאו", "קדום", "לא מעובד", "טבעי"],
    category: "אורח חיים",
    allowedFoods: ["בשר", "דגים", "ירקות", "פירות", "אגוזים", "שורשים", "בטטה"],
    forbiddenFoods: ["דגנים", "סוכר", "מוצרי חלב", "מזון מעובד", "קטניות"],
    nutritionalProfile: {
      carbs: "medium",
      protein: "high",
      fat: "medium",
      fiber: "high",
      processingLevel: "minimal",
      calorieRange: "moderate",
    },
    sampleMeal: "סטייק עם בטטה צלויה, ברוקולי ואגוזים.",
    difficultyLevel: "medium",
    healthBenefits: ["מזון לא מעובד", "עשיר בחלבון", "בקרת סוכר טובה"],
    warnings: ["יקר יחסית", "הגבלות רבות", "חסרים תזונתיים אפשריים"],
    recommendedFor: ["מחפשי אורח חיים טבעי", "בעיות עיכול", "רגישות למזונות"],
    linkToGuide: "https://www.paleodiet.co.il/",
  },
  {
    id: "low_carb",
    label: "דל פחמימות",
    image: "https://cdn-icons-png.flaticon.com/512/1686/1686051.png",
    description: "הפחתה בכמות הפחמימות בתפריט היומי.",
    tags: ["פחמימות נמוכות", "הרזיה", "בקרת סוכר"],
    category: "דל פחמימות",
    allowedFoods: ["בשר", "ירקות", "ביצים", "דגים", "גבינות", "אגוזים"],
    forbiddenFoods: ["לחם", "פסטה", "אורז", "סוכר", "מתוקים"],
    nutritionalProfile: {
      carbs: "low",
      protein: "high",
      fat: "medium",
      fiber: "medium",
      processingLevel: "moderate",
      calorieRange: "low",
    },
    sampleMeal: "פרגית בתנור עם ירקות מאודים וסלט.",
    difficultyLevel: "medium",
    healthBenefits: ["הרזיה", "בקרת סוכר", "שובע ממושך"],
    recommendedFor: ["רוצים להרזות", "סוכרתיים", "מטבוליזם איטי"],
    linkToGuide: "https://www.dietician.org.il/?CategoryID=287&ArticleID=605",
  },
  {
    id: "mediterranean",
    label: "ים תיכונית",
    image: "https://cdn-icons-png.flaticon.com/512/3075/3075973.png",
    description: "דגש על ירקות, דגים, שמן זית ודגנים מלאים.",
    isPremium: true,
    tags: ["בריא", "מגוון", "שמן זית", "ים תיכוני"],
    category: "אורח חיים",
    allowedFoods: [
      "ירקות",
      "פירות",
      "דגים",
      "שמן זית",
      "קטניות",
      "דגנים מלאים",
      "יין (במתינות)",
    ],
    forbiddenFoods: ["מעובדים", "סוכר מוסף", "בשר אדום מרובה"],
    nutritionalProfile: {
      carbs: "medium",
      protein: "medium",
      fat: "medium",
      fiber: "high",
      processingLevel: "minimal",
      calorieRange: "moderate",
    },
    sampleMeal: "דג ברוטב עגבניות עם סלט, זיתים ופרוסת לחם מלא.",
    difficultyLevel: "easy",
    healthBenefits: [
      "בריאות הלב",
      "אנטי דלקתי",
      "מקור טוב לאומגה 3",
      "איכות חיים",
    ],
    recommendedFor: ["כל הגילאים", "בריאות הלב", "מחפשי איזון", "אוהבי טעמים"],
    linkToGuide:
      "https://www.health.gov.il/Subjects/FoodAndNutrition/Pages/mediterranean_diet.aspx",
  },
  {
    id: "intermittent_fasting",
    label: "צום לסירוגין",
    image: "https://cdn-icons-png.flaticon.com/512/2553/2553672.png",
    description: "אכילה בחלונות זמן קבועים (למשל 16:8).",
    tags: ["צום", "חילוף חומרים", "16:8", "זמנים"],
    category: "אורח חיים",
    allowedFoods: ["כל המזון – בחלון אכילה מוגדר"],
    forbiddenFoods: ["אכילה מחוץ לחלון הזמן"],
    nutritionalProfile: {
      carbs: "medium",
      protein: "medium",
      fat: "medium",
      fiber: "medium",
      processingLevel: "moderate",
      calorieRange: "low",
    },
    sampleMeal: "חביתה עם ירקות, אגוזים, גבינה בולגרית.",
    difficultyLevel: "medium",
    healthBenefits: ["הרזיה", "חילוף חומרים טוב", "בהירות נפשית", "בקרת סוכר"],
    warnings: ["לא מתאים לכל אחד", "יכול לגרום לעייפות", "דורש הסתגלות"],
    recommendedFor: ["רוצים להרזות", "חילוף חומרים איטי", "אנשים עסוקים"],
    linkToGuide:
      "https://www.dietnet.co.il/%D7%A6%D7%95%D7%9D-%D7%9C%D7%A1%D7%99%D7%A8%D7%95%D7%92%D7%99%D7%9F/",
  },
  {
    id: "gluten_free",
    label: "ללא גלוטן",
    image: "https://cdn-icons-png.flaticon.com/512/2718/2718224.png",
    description: "ללא חיטה ודגנים שמכילים גלוטן.",
    tags: ["צליאק", "אלרגיה", "ללא חיטה", "רפואי"],
    category: "צרכים מיוחדים",
    allowedFoods: ["בשר", "ירקות", "פירות", "אורז", 'תפו"א', "קטניות", "דגים"],
    forbiddenFoods: [
      "חיטה",
      "שעורה",
      "שיפון",
      "לחמים רגילים",
      "בירה",
      "עוגות רגילות",
    ],
    nutritionalProfile: {
      carbs: "medium",
      protein: "medium",
      fat: "medium",
      fiber: "medium",
      processingLevel: "moderate",
      calorieRange: "moderate",
    },
    sampleMeal: "שניצל תירס עם אורז, ירקות וסלט.",
    difficultyLevel: "medium",
    healthBenefits: ["מקלה על צליאק", "מפחיתה דלקות", "עיכול טוב יותר"],
    warnings: ["יקר יחסית", "הגבלות חברתיות", "צריך לבדוק תוויות"],
    recommendedFor: ["חולי צליאק", "רגישות לגלוטן", "בעיות עיכול"],
    linkToGuide: "https://www.celiac.org.il/template/default.aspx?maincat=1",
  },
  {
    id: "high_protein",
    label: "עתיר חלבון",
    image: "https://cdn-icons-png.flaticon.com/512/1046/1046872.png",
    description: "תפריט עם דגש על כמות חלבון גבוהה.",
    tags: ["חלבון גבוה", "ספורט", "כושר", "שרירים"],
    category: "ספורט",
    allowedFoods: [
      "בשר רזה",
      "דגים",
      "ביצים",
      "טופו",
      "קטניות",
      "גבינות רזות",
      "אבקות חלבון",
    ],
    forbiddenFoods: ["סוכר מוסף", "שומן טראנס", "חטיפים מעובדים"],
    nutritionalProfile: {
      carbs: "medium",
      protein: "high",
      fat: "low",
      fiber: "medium",
      processingLevel: "moderate",
      calorieRange: "moderate",
    },
    sampleMeal: "יוגורט יווני עם גרנולה, ביצה קשה וחמאת בוטנים.",
    difficultyLevel: "easy",
    healthBenefits: [
      "בניית שרירים",
      "שובע ממושך",
      "שריפת שומן",
      "התאוששות מהירה",
    ],
    recommendedFor: ["ספורטאים", "מתאמנים", "רוצים להרזות", "גיל מבוגר"],
    linkToGuide: "https://www.dietitian.org.il/?CategoryID=287&ArticleID=569",
  },
];

// ================== ENHANCED HELPER FUNCTIONS | פונקציות עזר משופרות ==================

/**
 * מחזיר אפשרות תזונה לפי ID עם type safety
 */
export const getDietById = (id: string): DietOption | undefined => {
  return DIET_OPTIONS.find((diet) => diet.id === id);
};

/**
 * מחזיר את האפשרות ברירת המחדל
 */
export const getDefaultDiet = (): DietOption => {
  return DIET_OPTIONS.find((diet) => diet.isDefault) || DIET_OPTIONS[0];
};

/**
 * מסנן אפשרויות תזונה לפי תגיות עם חיפוש מתקדם
 */
export const searchDietsByTags = (searchTerm: string): DietOption[] => {
  const term = searchTerm.toLowerCase();
  return DIET_OPTIONS.filter(
    (diet) =>
      diet.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
      diet.label.toLowerCase().includes(term) ||
      diet.description?.toLowerCase().includes(term) ||
      diet.allowedFoods?.some((food) => food.toLowerCase().includes(term)) ||
      diet.healthBenefits?.some((benefit) =>
        benefit.toLowerCase().includes(term)
      )
  );
};

/**
 * מחזיר רשימת כל התגיות הזמינות
 */
export const getAllDietTags = (): string[] => {
  const allTags = DIET_OPTIONS.flatMap((diet) => diet.tags || []);
  return [...new Set(allTags)].sort();
};

/**
 * מסנן דיאטות לפי קטגוריה
 */
export const getDietsByCategory = (category: string): DietOption[] => {
  return DIET_OPTIONS.filter((diet) => diet.category === category);
};

/**
 * מחזיר דיאטות מתאימות לפי פרופיל תזונתי
 */
export const getDietsByNutritionalProfile = (
  profile: Partial<NutritionalProfile>
): DietOption[] => {
  return DIET_OPTIONS.filter((diet) => {
    if (!diet.nutritionalProfile) return false;

    return Object.entries(profile).every(([key, value]) => {
      const dietValue =
        diet.nutritionalProfile![key as keyof NutritionalProfile];
      return dietValue === value;
    });
  });
};

/**
 * מחזיר דיאטות מתאימות לפי רמת קושי
 */
export const getDietsByDifficulty = (
  difficulty: "easy" | "medium" | "hard"
): DietOption[] => {
  return DIET_OPTIONS.filter((diet) => diet.difficultyLevel === difficulty);
};

/**
 * מחזיר דיאטות מתאימות למטרה מסוימת
 */
export const getRecommendedDietsForGoal = (goal: string): DietOption[] => {
  const goalMappings: Record<string, string[]> = {
    הרזיה: ["keto", "low_carb", "intermittent_fasting", "high_protein"],
    "בניית שרירים": ["high_protein", "mediterranean"],
    "בריאות כללית": ["mediterranean", "vegetarian", "vegan"],
    "בעיות עיכול": ["gluten_free", "paleo", "vegan"],
    סוכרת: ["keto", "low_carb", "mediterranean"],
    "בריאות הלב": ["mediterranean", "vegan", "vegetarian"],
  };

  const relevantIds = goalMappings[goal] || [];
  return DIET_OPTIONS.filter((diet) => relevantIds.includes(diet.id));
};

/**
 * מחזיר הערכת התאמה של דיאטה למשתמש (ציון 0-100)
 */
export const calculateDietCompatibility = (
  dietId: string,
  userProfile: {
    goals?: string[];
    allergies?: string[];
    experience?: "beginner" | "intermediate" | "advanced";
    timeAvailable?: "low" | "medium" | "high";
  }
): number => {
  const diet = getDietById(dietId);
  if (!diet) return 0;

  let score = 50; // ציון בסיס

  // התאמה למטרות
  if (userProfile.goals) {
    userProfile.goals.forEach((goal) => {
      const recommendedDiets = getRecommendedDietsForGoal(goal);
      if (recommendedDiets.some((d) => d.id === dietId)) {
        score += 20;
      }
    });
  }

  // התאמה לרמת ניסיון
  if (userProfile.experience) {
    const difficultyScores = { easy: 30, medium: 20, hard: 10 };
    const experienceMapping = {
      beginner: "easy",
      intermediate: "medium",
      advanced: "hard",
    };

    if (diet.difficultyLevel === experienceMapping[userProfile.experience]) {
      score +=
        difficultyScores[diet.difficultyLevel as keyof typeof difficultyScores];
    }
  }

  // הפחתת ציון עבור אלרגיות
  if (userProfile.allergies && diet.forbiddenFoods) {
    const hasAllergens = userProfile.allergies.some((allergy) =>
      diet.forbiddenFoods!.some((food) =>
        food.toLowerCase().includes(allergy.toLowerCase())
      )
    );
    if (hasAllergens) score -= 30;
  }

  return Math.min(Math.max(score, 0), 100);
};

/**
 * מחזיר סטטיסטיקות על נתוני התזונה
 */
export const getDietStatistics = () => {
  const categories = [...new Set(DIET_OPTIONS.map((d) => d.category))];
  const difficulties = [...new Set(DIET_OPTIONS.map((d) => d.difficultyLevel))];

  return {
    totalDiets: DIET_OPTIONS.length,
    categories: categories.map((cat) => ({
      name: cat,
      count: DIET_OPTIONS.filter((d) => d.category === cat).length,
    })),
    difficulties: difficulties.map((diff) => ({
      level: diff,
      count: DIET_OPTIONS.filter((d) => d.difficultyLevel === diff).length,
    })),
    premiumCount: DIET_OPTIONS.filter((d) => d.isPremium).length,
    withNutritionalProfile: DIET_OPTIONS.filter((d) => d.nutritionalProfile)
      .length,
  };
};
