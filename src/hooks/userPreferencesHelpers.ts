/**
 * userPreferencesHelpers.ts
 * פונקציות עזר חכמות להעדפות משתמש (מופרד לניקוי useUserPreferences)
 *
 * @updated 2025-08-10 הוספת תמיכה בנתונים אישיים (גיל, משקל, גובה, מין) מהשאלון החדש
 *
 * פונקציות חדשות:
 * - calculateEnhancedDataQuality: חישוב איכות נתונים עם נתונים אישיים
 * - generatePersonalizedFocusAreas: תחומי התמקדות מותאמים אישית
 * - calculatePersonalizedProgressionPace: קצב התקדמות לפי פרופיל אישי
 * - generatePersonalizedMotivation: מסרים מוטיבציוניים מותאמים
 * - createPersonalizedWorkoutPlan: יצירת תוכנית אימון מותאמת אישית
 *
 * @example
 * const personalData = {
 *   gender: "female",
 *   age: "35_44",
 *   weight: "60_69",
 *   height: "160_169",
 *   fitnessLevel: "intermediate"
 * };
 *
 * const focusAreas = generatePersonalizedFocusAreas(questionnaire, personalData);
 * const pace = calculatePersonalizedProgressionPace(personalData);
 * const motivation = generatePersonalizedMotivation(personalData);
 */
import { QuestionnaireMetadata, WorkoutRecommendation } from "../types";

// משקולות לחישוב איכות נתונים - כולל נתונים אישיים חדשים
export const WEIGHTS = {
  // ✅ נתונים אישיים בסיסיים
  age: 1.5, // גיל חשוב להתאמת תוכנית
  gender: 1.5, // מין חשוב להתאמת אימונים
  weight: 1, // משקל עוזר בהתאמת עומסים
  height: 1, // גובה עוזר בהתאמת תרגילים
  // נתוני אימון קיימים
  goal: 2,
  experience: 2,
  frequency: 2,
  duration: 1,
  location: 1,
} as const;

// מיפוי ניקוד לתדירות
const FREQUENCY_SCORES: Record<string, number> = {
  יומי: 10,
  "5-6 פעמים בשבוע": 9,
  "3-4 פעמים בשבוע": 7,
  "2-3 פעמים בשבוע": 5,
};

export const scoreFrequency = (freq?: string): number => {
  if (!freq) return 3;
  return FREQUENCY_SCORES[freq] ?? 3;
};

export const calculateDataQuality = (data: QuestionnaireMetadata): number => {
  let score = 0;
  if (data.age) score += WEIGHTS.age;
  if (data.gender) score += WEIGHTS.gender;
  if (data.goal) score += WEIGHTS.goal;
  if (data.experience) score += WEIGHTS.experience;
  if (data.frequency) score += WEIGHTS.frequency;
  if (data.duration) score += WEIGHTS.duration;
  if (data.location) score += WEIGHTS.location;
  return Math.min(10, score);
};

// ✅ פונקציה חדשה עם תמיכה בנתונים אישיים מהשאלון החדש
export const calculateEnhancedDataQuality = (
  data: QuestionnaireMetadata,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
  }
): number => {
  let score = calculateDataQuality(data);

  // הוספת ניקוד לנתונים אישיים חדשים
  if (personalData?.gender) score += WEIGHTS.gender;
  if (personalData?.age) score += WEIGHTS.age;
  if (personalData?.weight) score += WEIGHTS.weight;
  if (personalData?.height) score += WEIGHTS.height;

  return Math.min(10, score);
};

export const generateFocusAreas = (data: QuestionnaireMetadata): string[] => {
  const areas: string[] = [];
  if (data.goal?.includes("שריפת שומן")) areas.push("קרדיו");
  if (data.goal?.includes("בניית שריר")) areas.push("כוח");
  if (data.experience === "מתחיל") areas.push("טכניקה");
  if (data.health_conditions?.length) areas.push("בטיחות");
  return areas.length ? areas : ["כושר כללי"];
};

// ✅ פונקציה משופרת עם נתונים אישיים מהשאלון החדש
export const generatePersonalizedFocusAreas = (
  data: QuestionnaireMetadata,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
  }
): string[] => {
  const areas: string[] = [];

  // תחומי התמקדות לפי מטרות (קיימות)
  if (data.goal?.includes("שריפת שומן")) areas.push("קרדיו");
  if (data.goal?.includes("בניית שריר")) areas.push("כוח");
  if (data.experience === "מתחיל") areas.push("טכניקה");
  if (data.health_conditions?.length) areas.push("בטיחות");

  // ✅ התאמות לפי נתונים אישיים חדשים
  if (personalData?.age) {
    if (
      personalData.age.includes("50_") ||
      personalData.age.includes("over_")
    ) {
      areas.push("גמישות");
      areas.push("יציבה");
    } else if (
      personalData.age.includes("18_") ||
      personalData.age.includes("25_")
    ) {
      areas.push("כוח");
    }
  }

  if (personalData?.gender === "female") {
    areas.push("חיזוק ליבה");
    areas.push("גלוטאוס");
  } else if (personalData?.gender === "male") {
    areas.push("חזה וכתפיים");
  }

  if (personalData?.weight) {
    if (
      personalData.weight.includes("under_") ||
      personalData.weight.includes("50_")
    ) {
      areas.push("בניית מסה");
    } else if (
      personalData.weight.includes("over_90") ||
      personalData.weight.includes("over_100")
    ) {
      areas.push("קרדיו");
      areas.push("הידרציה");
    }
  }

  return areas.length ? [...new Set(areas)] : ["כושר כללי"]; // הסרת כפילויות
};

export const generateWarningFlags = (
  data: QuestionnaireMetadata,
  motivation: number,
  consistency: number
): string[] => {
  const warnings: string[] = [];
  if (motivation < 4) warnings.push("מוטיבציה נמוכה");
  if (consistency < 4) warnings.push("תדירות נמוכה");
  if (data.health_conditions?.length) warnings.push("מצב בריאותי");
  if (!data.home_equipment?.length && !data.gym_equipment?.length) {
    warnings.push("ציוד מוגבל");
  }
  return warnings;
};

export interface SmartWorkoutPlan {
  weeklySchedule: WorkoutRecommendation[];
  personalityMatch: string;
  focusAreas: string[];
  progressionPace: string;
  motivationalBoost: string;
  generatedAt: string;
}

export const createSmartWorkoutPlan = (
  recommendations: WorkoutRecommendation[],
  prefs: {
    personalityProfile: string;
    smartRecommendations: { focusAreas: string[]; progressionPace: string };
    motivationLevel: number;
  } | null
): SmartWorkoutPlan | null => {
  if (!prefs) return null;
  return {
    weeklySchedule: recommendations.slice(0, 3),
    personalityMatch: prefs.personalityProfile,
    focusAreas: prefs.smartRecommendations.focusAreas,
    progressionPace: prefs.smartRecommendations.progressionPace,
    motivationalBoost:
      prefs.motivationLevel >= 7
        ? "מוכן לפריצת דרך!"
        : "התקדמות יציבה היא המפתח",
    generatedAt: new Date().toISOString(),
  };
};

// ✅ פונקציות חדשות עם תמיכה בנתונים אישיים מהשאלון החדש

/**
 * חישוב קצב התקדמות מומלץ לפי נתונים אישיים
 */
export const calculatePersonalizedProgressionPace = (personalData?: {
  gender?: string;
  age?: string;
  weight?: string;
  height?: string;
  fitnessLevel?: string;
}): { pace: string; description: string } => {
  if (!personalData) {
    return { pace: "מתון", description: "קצב התקדמות סטנדרטי" };
  }

  let paceScore = 5; // ברירת מחדל

  // התאמה לגיל
  if (personalData.age) {
    if (personalData.age.includes("18_") || personalData.age.includes("25_")) {
      paceScore += 2; // צעירים יכולים להתקדם מהר יותר
    } else if (
      personalData.age.includes("50_") ||
      personalData.age.includes("over_")
    ) {
      paceScore -= 2; // מבוגרים צריכים התקדמות איטית יותר
    }
  }

  // התאמה לרמת כושר
  if (personalData.fitnessLevel === "beginner") {
    paceScore -= 1; // מתחילים זהירים יותר
  } else if (personalData.fitnessLevel === "advanced") {
    paceScore += 1; // מתקדמים יכולים יותר
  }

  if (paceScore >= 7) {
    return { pace: "מהיר", description: "התקדמות אגרסיבית - מוכן לאתגרים!" };
  } else if (paceScore >= 5) {
    return { pace: "מתון", description: "התקדמות יציבה ובטוחה" };
  } else {
    return { pace: "איטי", description: "התקדמות זהירה ומותאמת" };
  }
};

/**
 * יצירת מסרים מוטיבציוניים מותאמים אישית
 */
export const generatePersonalizedMotivation = (personalData?: {
  gender?: string;
  age?: string;
  weight?: string;
  height?: string;
}): string => {
  if (!personalData) return "בואו נתחיל את המסע יחד! 💪";

  let message = "בואו נתחיל את המסע יחד! 💪";

  if (personalData.age) {
    if (personalData.age.includes("18_") || personalData.age.includes("25_")) {
      message = "הזמן הכי טוב להתחיל - יש לך את כל האנרגיה! 🚀";
    } else if (
      personalData.age.includes("50_") ||
      personalData.age.includes("over_")
    ) {
      message = "הגיל הוא רק מספר - בואו נוכיח זאת יחד! 🌟";
    } else if (
      personalData.age.includes("35_") ||
      personalData.age.includes("45_")
    ) {
      message = "בגיל הזה אתה יודע בדיוק מה אתה רוצה - בואו נשיג את זה! 🎯";
    }
  }

  if (personalData.gender === "female") {
    message = message.replace("אתה", "את").replace("נוכיח", "נוכיח");
  }

  return message;
};

/**
 * יצירת תוכנית אימון חכמה ומותאמת אישית
 */
export const createPersonalizedWorkoutPlan = (
  recommendations: WorkoutRecommendation[],
  prefs: {
    personalityProfile: string;
    smartRecommendations: { focusAreas: string[]; progressionPace: string };
    motivationLevel: number;
  } | null,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
    fitnessLevel?: string;
  }
): SmartWorkoutPlan | null => {
  if (!prefs) return null;

  // שימוש בפונקציות החדשות
  const personalizedPace = calculatePersonalizedProgressionPace(personalData);
  const personalizedMotivation = generatePersonalizedMotivation(personalData);

  return {
    weeklySchedule: recommendations.slice(0, 3),
    personalityMatch: prefs.personalityProfile,
    focusAreas: prefs.smartRecommendations.focusAreas,
    progressionPace: personalizedPace.description,
    motivationalBoost: personalizedMotivation,
    generatedAt: new Date().toISOString(),
  };
};
