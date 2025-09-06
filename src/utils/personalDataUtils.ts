/**
 * @file src/utils/personalDataUtils.ts
 * @description יוטיליטיז לחישובים אישיים ופיטנס - Personal Data & Fitness Calculation Utilities
 */

// ===============================================
// 📊 Interfaces & Types - ממשקים וטיפוסים
// ===============================================

/** נתונים אישיים מורחבים לחישובי כושר */
export interface PersonalData {
  gender: "male" | "female";
  age: string; // "25_34", "35_44", etc.
  weight: string; // "70_79", "80_89", etc.
  height: string; // "170_179", "180_189", etc.
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  availability?: string; // "2_days", "3_days", etc.
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goals?:
    | "weight_loss"
    | "muscle_gain"
    | "endurance"
    | "strength"
    | "general_fitness";
  injuries?: string[]; // List of current injuries or limitations
}

/** תוצאות חישובי כושר מתקדמים */
export interface FitnessMetrics {
  bmi: number;
  bmiCategory: "underweight" | "normal" | "overweight" | "obese";
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  estimatedVO2Max?: number;
  bodyFatPercentage?: number;
  targetHeartRate: { min: number; max: number };
  recommendedCalorieIntake: number;
}

/** הגדרות קונפיגורציה לחישובים */
interface FitnessConfig {
  bmrFormula: "harris_benedict" | "mifflin_st_jeor";
  activityFactors: Map<string, number>;
  metabolismFactors: Map<string, number>;
  strengthFactors: Map<string, number>;
  fitnessFactors: Map<string, number>;
  genderFactors: Map<string, number>;
  rangeValues: Map<string, number>;
}

// ===============================================
// 🔧 Configuration & Constants - הגדרות וקבועים
// ===============================================

/** מפות לביצועים מהירים - Maps for Fast Performance */
const RANGE_VALUES = new Map<string, number>([
  // Weight ranges (kg) - טווחי משקל
  ["50_59", 55],
  ["60_69", 65],
  ["70_79", 75],
  ["80_89", 85],
  ["90_99", 95],
  ["100_109", 105],
  ["110_119", 115],
  ["120_plus", 125],

  // Height ranges (cm) - טווחי גובה
  ["150_159", 155],
  ["160_169", 165],
  ["170_179", 175],
  ["180_189", 185],
  ["190_199", 195],
  ["200_plus", 205],

  // Age ranges (years) - טווחי גיל
  ["18_24", 21],
  ["25_34", 29],
  ["35_44", 39],
  ["45_54", 49],
  ["55_64", 59],
  ["65_plus", 70],
]);

/** פקטורי מטבוליזם לפי גיל */
const METABOLISM_FACTORS = new Map<string, number>([
  ["18_24", 1.1],
  ["25_34", 1.0],
  ["35_44", 0.95],
  ["45_54", 0.9],
  ["55_64", 0.85],
  ["65_plus", 0.8],
]);

/** פקטורי כוח לפי גיל */
const STRENGTH_FACTORS = new Map<string, number>([
  ["18_24", 1.0],
  ["25_34", 0.98],
  ["35_44", 0.95],
  ["45_54", 0.9],
  ["55_64", 0.85],
  ["65_plus", 0.75],
]);

/** פקטורי כושר לפי רמה */
const FITNESS_FACTORS = new Map<string, number>([
  ["beginner", 0.9],
  ["intermediate", 1.0],
  ["advanced", 1.1],
]);

/** פקטורי מגדר */
const GENDER_FACTORS = new Map<string, number>([
  ["male", 1.2],
  ["female", 1.0],
]);

/** פקטורי פעילות יומית */
const ACTIVITY_FACTORS = new Map<string, number>([
  ["sedentary", 1.2],
  ["light", 1.375],
  ["moderate", 1.55],
  ["active", 1.725],
  ["very_active", 1.9],
]);

/** קטגוריות BMI */
const BMI_CATEGORIES = new Map<number, string>([
  [18.5, "underweight"],
  [25, "normal"],
  [30, "overweight"],
  [Infinity, "obese"],
]);

/** הגדרות ברירת מחדל */
const DEFAULT_CONFIG: FitnessConfig = {
  bmrFormula: "mifflin_st_jeor",
  activityFactors: ACTIVITY_FACTORS,
  metabolismFactors: METABOLISM_FACTORS,
  strengthFactors: STRENGTH_FACTORS,
  fitnessFactors: FITNESS_FACTORS,
  genderFactors: GENDER_FACTORS,
  rangeValues: RANGE_VALUES,
};

/**
 * קבלת קונפיגורציה נוכחית
 * @returns אובייקט הקונפיגורציה
 */
export const getFitnessConfig = (): FitnessConfig => ({ ...DEFAULT_CONFIG });

// ===============================================
// 🔧 Helper Functions - פונקציות עזר
// ===============================================

/**
 * חילוץ ערך אמצעי מטווח עם validation משופר
 * @param range מחרוזת הטווח (כמו "70_79")
 * @param defaultValue ערך ברירת מחדל
 * @returns ערך מספרי באמצע הטווח
 */
export const extractMidValueFromRange = (
  range: string,
  defaultValue: number = 70
): number => {
  const value = RANGE_VALUES.get(range);
  if (value === undefined) {
    console.warn(`Unknown range: ${range}, using default: ${defaultValue}`);
    return defaultValue;
  }
  return value;
};

/**
 * קבלת פקטור מטבוליזם לפי גיל עם error handling
 * @param age טווח הגיל
 * @returns פקטור המטבוליזם
 */
export const getAgeMetabolismFactor = (age: string): number => {
  return METABOLISM_FACTORS.get(age) || 1.0;
};

/**
 * קבלת פקטור כוח לפי גיל עם אופטימיזציה
 * @param age טווח הגיל
 * @returns פקטור הכוח
 */
export const getAgeStrengthFactor = (age: string): number => {
  return STRENGTH_FACTORS.get(age) || 1.0;
};

/**
 * קבלת פקטור כושר לפי רמה
 * @param fitnessLevel רמת הכושר
 * @returns פקטור הכושר
 */
export const getFitnessFactor = (fitnessLevel: string): number => {
  return FITNESS_FACTORS.get(fitnessLevel) || 1.0;
};

/**
 * קבלת פקטור מגדר
 * @param gender המגדר
 * @returns פקטור המגדר
 */
export const getGenderFactor = (gender: string): number => {
  return GENDER_FACTORS.get(gender) || 1.0;
};

// ===============================================
// 📊 Advanced Calculation Functions - פונקציות חישוב מתקדמות
// ===============================================

/**
 * חישוב BMI מתקדם עם קטגוריזציה
 * @param personalData נתונים אישיים
 * @returns אובייקט עם BMI וקטגוריה
 */
export const calculateBMI = (
  personalData: PersonalData
): { bmi: number; category: string } => {
  try {
    const weight = extractMidValueFromRange(personalData.weight);
    const height = extractMidValueFromRange(personalData.height) / 100; // Convert to meters

    const bmi = weight / (height * height);

    // Find BMI category
    let category = "normal";
    for (const [threshold, cat] of BMI_CATEGORIES) {
      if (bmi < threshold) {
        category = cat;
        break;
      }
    }

    return {
      bmi: Math.round(bmi * 10) / 10,
      category: category as "underweight" | "normal" | "overweight" | "obese",
    };
  } catch (error) {
    console.error("Error calculating BMI:", error);
    return { bmi: 0, category: "normal" };
  }
};

/**
 * חישוב BMR (Basal Metabolic Rate) עם נוסחת Mifflin-St Jeor
 * @param personalData נתונים אישיים
 * @returns BMR בקלוריות ליום
 */
export const calculateBMR = (personalData: PersonalData): number => {
  try {
    const weight = extractMidValueFromRange(personalData.weight);
    const height = extractMidValueFromRange(personalData.height);
    const age = extractMidValueFromRange(personalData.age);

    let bmr: number;

    if (personalData.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    return Math.round(bmr);
  } catch (error) {
    console.error("Error calculating BMR:", error);
    return 1500; // Default fallback
  }
};

/**
 * חישוב TDEE (Total Daily Energy Expenditure)
 * @param personalData נתונים אישיים
 * @returns TDEE בקלוריות ליום
 */
export const calculateTDEE = (personalData: PersonalData): number => {
  const bmr = calculateBMR(personalData);
  const activityLevel = personalData.activityLevel || "moderate";
  const activityFactor = ACTIVITY_FACTORS.get(activityLevel) || 1.55;

  return Math.round(bmr * activityFactor);
};

/**
 * הערכת VO2 Max לפי גיל ומגדר
 * @param personalData נתונים אישיים
 * @returns הערכת VO2 Max
 */
export const estimateVO2Max = (personalData: PersonalData): number => {
  const age = extractMidValueFromRange(personalData.age);
  const fitnessMultiplier = getFitnessFactor(personalData.fitnessLevel);

  let baseVO2: number;
  if (personalData.gender === "male") {
    baseVO2 = 50 - (age - 25) * 0.2; // Approximate formula for males
  } else {
    baseVO2 = 42 - (age - 25) * 0.18; // Approximate formula for females
  }

  return Math.round(baseVO2 * fitnessMultiplier);
};

/**
 * חישוב טווח דופק יעד לאימון
 * @param personalData נתונים אישיים
 * @returns אובייקט עם דופק מינימלי ומקסימלי
 */
export const calculateTargetHeartRate = (
  personalData: PersonalData
): { min: number; max: number } => {
  const age = extractMidValueFromRange(personalData.age);
  const maxHeartRate = 220 - age;

  // Different zones based on fitness level
  const zones = {
    beginner: { min: 0.5, max: 0.7 },
    intermediate: { min: 0.6, max: 0.8 },
    advanced: { min: 0.7, max: 0.9 },
  };

  const zone = zones[personalData.fitnessLevel] || zones.intermediate;

  return {
    min: Math.round(maxHeartRate * zone.min),
    max: Math.round(maxHeartRate * zone.max),
  };
};

/**
 * חישוב קלוריות מותאמות אישית לאימון - משופר ומתקדם
 * @param durationMinutes משך האימון בדקות
 * @param personalData נתונים אישיים (אופציונלי)
 * @param exerciseIntensity עוצמת האימון (1-10)
 * @returns מספר הקלוריות הנשרפות
 */
export const calculatePersonalizedCalories = (
  durationMinutes: number,
  personalData?: PersonalData,
  exerciseIntensity: number = 5
): number => {
  try {
    // Validate inputs
    if (durationMinutes <= 0) return 0;
    if (exerciseIntensity < 1 || exerciseIntensity > 10) exerciseIntensity = 5;

    // Base calculation without personal data
    if (!personalData) {
      const baseCaloriesPerMinute = 8 + (exerciseIntensity - 5) * 1.5;
      return Math.round(durationMinutes * baseCaloriesPerMinute);
    }

    // Advanced calculation with personal data
    const weight = extractMidValueFromRange(personalData.weight);
    const ageFactor = getAgeMetabolismFactor(personalData.age);
    const genderFactor = getGenderFactor(personalData.gender);
    const fitnessFactor = getFitnessFactor(personalData.fitnessLevel);

    // Intensity factor (1-10 scale to 0.7-1.8 multiplier)
    const intensityFactor = 0.7 + (exerciseIntensity - 1) * 0.12;

    // Enhanced formula considering all factors
    const baseCaloriesPerMinutePerKg = 0.15;
    const totalCalories = Math.round(
      baseCaloriesPerMinutePerKg *
        weight *
        durationMinutes *
        ageFactor *
        genderFactor *
        fitnessFactor *
        intensityFactor
    );

    return Math.max(30, totalCalories); // Minimum 30 calories
  } catch (error) {
    console.error("Error calculating personalized calories:", error);
    return Math.round(durationMinutes * 8); // Fallback
  }
};

// ===============================================
// 🎁 Comprehensive Fitness Analysis - ניתוח כושר מקיף
// ===============================================

/**
 * יצירת דוח כושר מקיף עם כל המדדים
 * @param personalData נתונים אישיים מלאים
 * @returns אובייקט עם כל המדדים הרלוונטיים
 */
export const generateFitnessMetrics = (
  personalData: PersonalData
): FitnessMetrics => {
  try {
    const bmiData = calculateBMI(personalData);
    const bmr = calculateBMR(personalData);
    const tdee = calculateTDEE(personalData);
    const vo2Max = estimateVO2Max(personalData);
    const heartRate = calculateTargetHeartRate(personalData);

    // Calculate recommended calorie intake based on goals
    let recommendedCalorieIntake = tdee;
    if (personalData.goals === "weight_loss") {
      recommendedCalorieIntake = tdee - 500; // 500 calorie deficit
    } else if (personalData.goals === "muscle_gain") {
      recommendedCalorieIntake = tdee + 300; // 300 calorie surplus
    }

    return {
      bmi: bmiData.bmi,
      bmiCategory: bmiData.category as
        | "underweight"
        | "normal"
        | "overweight"
        | "obese",
      bmr,
      tdee,
      estimatedVO2Max: vo2Max,
      targetHeartRate: heartRate,
      recommendedCalorieIntake: Math.max(1200, recommendedCalorieIntake), // Minimum 1200 calories
    };
  } catch (error) {
    console.error("Error generating fitness metrics:", error);
    // Return default values on error
    return {
      bmi: 22,
      bmiCategory: "normal",
      bmr: 1500,
      tdee: 2000,
      estimatedVO2Max: 35,
      targetHeartRate: { min: 120, max: 160 },
      recommendedCalorieIntake: 2000,
    };
  }
};

/**
 * בדיקת תקינות נתונים אישיים
 * @param personalData נתונים לבדיקה
 * @returns true אם הנתונים תקינים
 */
export const validatePersonalData = (personalData: PersonalData): boolean => {
  try {
    // Check required fields
    if (
      !personalData.gender ||
      !personalData.age ||
      !personalData.weight ||
      !personalData.height ||
      !personalData.fitnessLevel
    ) {
      return false;
    }

    // Validate ranges exist in our maps
    const hasValidWeight = RANGE_VALUES.has(personalData.weight);
    const hasValidHeight = RANGE_VALUES.has(personalData.height);
    const hasValidAge = RANGE_VALUES.has(personalData.age);
    const hasValidFitness = FITNESS_FACTORS.has(personalData.fitnessLevel);
    const hasValidGender = GENDER_FACTORS.has(personalData.gender);

    return (
      hasValidWeight &&
      hasValidHeight &&
      hasValidAge &&
      hasValidFitness &&
      hasValidGender
    );
  } catch {
    return false;
  }
};

/**
 * השוואת מדדי כושר לממוצע האוכלוסייה
 * @param personalData נתונים אישיים
 * @returns אובייקט עם השוואות
 */
export const compareToAverages = (personalData: PersonalData) => {
  const metrics = generateFitnessMetrics(personalData);
  const age = extractMidValueFromRange(personalData.age);

  // Average population data (simplified)
  const averages = {
    bmi: personalData.gender === "male" ? 26.5 : 25.8,
    vo2Max:
      personalData.gender === "male"
        ? 42 - (age - 30) * 0.2
        : 36 - (age - 30) * 0.15,
  };

  return {
    bmiComparison: metrics.bmi - averages.bmi,
    vo2MaxComparison: (metrics.estimatedVO2Max || 0) - averages.vo2Max,
    fitnessRating:
      metrics.estimatedVO2Max && metrics.estimatedVO2Max > averages.vo2Max
        ? "above_average"
        : "below_average",
  };
};

/**
 * המלצות מותאמות אישית לשיפור הכושר
 * @param personalData נתונים אישיים
 * @returns מערך המלצות
 */
export const getPersonalizedRecommendations = (
  personalData: PersonalData
): string[] => {
  const recommendations: string[] = [];
  const metrics = generateFitnessMetrics(personalData);

  // BMI-based recommendations
  if (metrics.bmiCategory === "overweight" || metrics.bmiCategory === "obese") {
    recommendations.push(
      "Focus on cardiovascular exercises and calorie deficit"
    );
    recommendations.push(
      "Consider strength training to build lean muscle mass"
    );
  } else if (metrics.bmiCategory === "underweight") {
    recommendations.push("Focus on strength training and calorie surplus");
    recommendations.push("Include compound exercises for muscle building");
  }

  // Fitness level recommendations
  if (personalData.fitnessLevel === "beginner") {
    recommendations.push("Start with 3 workouts per week, 30-45 minutes each");
    recommendations.push("Focus on form and gradual progression");
  } else if (personalData.fitnessLevel === "advanced") {
    recommendations.push(
      "Consider periodization and varied training intensities"
    );
    recommendations.push("Include sport-specific or goal-specific training");
  }

  // Age-based recommendations
  const age = extractMidValueFromRange(personalData.age);
  if (age > 50) {
    recommendations.push("Emphasize flexibility and balance exercises");
    recommendations.push("Include low-impact cardio options");
  }

  return recommendations;
};
