/**
 * @file userPreferencesHelpers.ts
 * @description פונקציות עזר פשוטות להעדפות משתמש
 * @updated 2025-09-03 פישוט וניקוי קוד מיותר - הסרת AI ו-Cache מיותרים
 */
import { WorkoutRecommendation } from "../types";
import { QuestionnaireData } from "../features/questionnaire/types";

// ============================================
// BASIC INTERFACES - ממשקים בסיסיים בלבד
// ============================================

export interface SmartWorkoutPlan {
  weeklySchedule: WorkoutRecommendation[];
  personalityMatch: string;
  focusAreas: string[];
  progressionPace: string;
  motivationalBoost: string;
  generatedAt: string;
}

// Adapter function to maintain backward compatibility
interface LegacyQuestionnaireStructure {
  // Common fields
  age?: string | number | undefined;
  gender?: string | undefined;
  goal?: string | string[] | undefined;
  experience?: string | undefined;
  frequency?: string | string[] | undefined;
  duration?: string | undefined;
  location?: string | undefined;
  equipment?: string[] | undefined;
  health_conditions?: string[] | undefined;
  home_equipment?: string[] | undefined;
  gym_equipment?: string[] | undefined;
  completedAt?: string | undefined;
  version?: string | undefined;
  [key: string]: unknown;
}

const adaptQuestionnaireData = (
  data: QuestionnaireData
): LegacyQuestionnaireStructure => {
  if (!data || !data.answers) return {};

  const answers = data.answers;

  return {
    // Map new structure to old expected structure
    age: answers.age,
    gender: answers.gender,
    goal: answers.fitness_goal || answers.goals,
    experience: answers.experience_level || answers.fitnessLevel,
    frequency: answers.availability,
    duration: answers.workout_duration || answers.sessionDuration,
    location: answers.workout_location || answers.workoutLocation,
    equipment: answers.equipment,
    health_conditions: answers.health_conditions,
    home_equipment: answers.home_equipment,
    gym_equipment: answers.gym_equipment,
    completedAt: data.metadata?.completedAt,
    version: data.metadata?.version,
    ...answers, // Include all other properties from answers
  };
};

// ============================================
// BASIC UTILITY FUNCTIONS - פונקציות עזר בסיסיות
// ============================================

export const WEIGHTS = {
  // נתונים אישיים בסיסיים
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
  "3-4 פעמים בשבוع": 7,
  "2-3 פעמים בשבוע": 5,
};

export const scoreFrequency = (freq?: string): number => {
  if (!freq) return 3;
  return FREQUENCY_SCORES[freq] ?? 3;
};

export const calculateDataQuality = (data: QuestionnaireData): number => {
  const adaptedData = adaptQuestionnaireData(data);
  let score = 0;
  if (adaptedData.age) score += WEIGHTS.age;
  if (adaptedData.gender) score += WEIGHTS.gender;
  if (adaptedData.goal) score += WEIGHTS.goal;
  if (adaptedData.experience) score += WEIGHTS.experience;
  if (adaptedData.frequency) score += WEIGHTS.frequency;
  if (adaptedData.duration) score += WEIGHTS.duration;
  if (adaptedData.location) score += WEIGHTS.location;
  return Math.min(10, score);
};

export const generateFocusAreas = (data: QuestionnaireData): string[] => {
  const adaptedData = adaptQuestionnaireData(data);
  const areas: string[] = [];
  if (
    Array.isArray(adaptedData.goal) &&
    adaptedData.goal.includes("שריפת שומן")
  )
    areas.push("קרדיו");
  if (
    Array.isArray(adaptedData.goal) &&
    adaptedData.goal.includes("בניית שריר")
  )
    areas.push("כוח");
  if (adaptedData.experience === "מתחיל") areas.push("טכניקה");
  if (adaptedData.health_conditions?.length) areas.push("בטיחות");
  return areas.length ? areas : ["כושר כללי"];
};

export const generateWarningFlags = (
  data: QuestionnaireData,
  motivation: number,
  consistency: number
): string[] => {
  const adaptedData = adaptQuestionnaireData(data);
  const warnings: string[] = [];
  if (motivation < 4) warnings.push("מוטיבציה נמוכה");
  if (consistency < 4) warnings.push("תדירות נמוכה");
  if (
    Array.isArray(adaptedData.health_conditions) &&
    adaptedData.health_conditions.length
  )
    warnings.push("מצב בריאותי");
  if (
    (!Array.isArray(adaptedData.home_equipment) ||
      !adaptedData.home_equipment.length) &&
    (!Array.isArray(adaptedData.gym_equipment) ||
      !adaptedData.gym_equipment.length)
  ) {
    warnings.push("ציוד מוגבל");
  }
  return warnings;
};

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

// ============================================
// ENHANCED FUNCTIONS - פונקציות משופרות עם נתונים אישיים
// ============================================

/**
 * חישוב איכות נתונים משופר עם נתונים אישיים
 */
export const calculateEnhancedDataQuality = (
  data: QuestionnaireData,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
  }
): number => {
  let score = calculateDataQuality(data);

  // הוספת ניקוד לנתונים אישיים
  if (personalData?.gender) score += WEIGHTS.gender;
  if (personalData?.age) score += WEIGHTS.age;
  if (personalData?.weight) score += WEIGHTS.weight;
  if (personalData?.height) score += WEIGHTS.height;

  return Math.min(10, score);
};

/**
 * יצירת תחומי התמקדות מותאמים אישית
 */
export const generatePersonalizedFocusAreas = (
  data: QuestionnaireData,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
  }
): string[] => {
  const adaptedData = adaptQuestionnaireData(data);
  const areas: string[] = [];

  // תחומי התמקדות לפי מטרות בסיסיות
  if (
    Array.isArray(adaptedData.goal) &&
    adaptedData.goal.includes("שריפת שומן")
  )
    areas.push("קרדיו");
  if (
    Array.isArray(adaptedData.goal) &&
    adaptedData.goal.includes("בניית שריר")
  )
    areas.push("כוח");
  if (adaptedData.experience === "מתחיל") areas.push("טכניקה");
  if (
    Array.isArray(adaptedData.health_conditions) &&
    adaptedData.health_conditions.length
  )
    areas.push("בטיחות");

  // התאמות לפי נתונים אישיים
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

  return areas.length ? [...new Set(areas)] : ["כושר כללי"];
};

/**
 * חישוב קצב התקדמות מותאם אישית
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
    paceScore -= 1;
  } else if (personalData.fitnessLevel === "advanced") {
    paceScore += 1;
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
 * יצירת תוכנית אימון מותאמת אישית
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

  // שימוש בפונקציות משופרות למסרים מותאמים אישית
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
