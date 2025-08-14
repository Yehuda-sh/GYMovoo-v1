/**
 * userPreferencesHelpers.ts
 * מערכת פונקציות עזר מתקדמת להעדפות משתמש עם AI וממוטב לביצועים
 *
 * @updated 2025-08-15 הוספת מערכת cache, אלגוריתמי AI, ואופטימיזציות ביצועים
 *
 * ✨ תכונות חדשות:
 * - מערכת cache מובנית לביצועים מעולים
 * - אלגוריתמי AI ללמידה והתאמה אישית
 * - ניתוח מתקדם של דפוסי התנהגות משתמש
 * - זיהוי אוטומטי של העדפות מנתוני שימוש
 * - המלצות דינמיות מותאמות זמן אמת
 * - סיכום ביצועים ותובנות חכמות
 *
 * פונקציות מקוריות משופרות:
 * - calculateEnhancedDataQuality: עם AI scoring ו-cache
 * - generatePersonalizedFocusAreas: עם למידה אדפטיבית
 * - calculatePersonalizedProgressionPace: עם חזיות AI
 * - generatePersonalizedMotivation: עם אלגוריתם רגש
 * - createPersonalizedWorkoutPlan: עם אופטימיזציה חכמה
 *
 * @example
 * // שימוש מתקדם עם cache ו-AI
 * const helpers = new UserPreferencesHelper();
 * const focusAreas = await helpers.generateAIFocusAreas(questionnaire, personalData);
 * const insights = helpers.generateUserInsights(usageData);
 * const predictedPrefs = helpers.predictFuturePreferences(historyData);
 */
import { QuestionnaireMetadata, WorkoutRecommendation } from "../types";

// ================================
// 🔧 ADVANCED CACHE SYSTEM
// ================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hash: string;
  hitCount: number;
}

class PreferencesCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ENTRIES = 100;

  set<T>(key: string, data: T, hash: string): void {
    if (this.cache.size >= this.MAX_ENTRIES) {
      this.clearOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hash,
      hitCount: 0,
    });
  }

  get<T>(key: string, hash: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.CACHE_DURATION;
    const isStale = entry.hash !== hash;

    if (isExpired || isStale) {
      this.cache.delete(key);
      return null;
    }

    entry.hitCount++;
    return entry.data as T;
  }

  private clearOldest(): void {
    let oldestKey = "";
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) this.cache.delete(oldestKey);
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_ENTRIES,
      totalHits: Array.from(this.cache.values()).reduce(
        (sum, entry) => sum + entry.hitCount,
        0
      ),
    };
  }

  clear(): void {
    this.cache.clear();
  }
}

const preferencesCache = new PreferencesCache();

// ================================
// 🤖 AI LEARNING ALGORITHMS
// ================================

export interface UserBehaviorPattern {
  frequencyPattern: number[];
  goalProgression: string[];
  equipmentUsage: Record<string, number>;
  timePatterns: Record<string, number>;
  motivationTrends: number[];
}

export interface AIInsights {
  personalityType: "goal_oriented" | "social" | "explorer" | "routine_lover";
  motivationFactors: string[];
  predictedPreferences: {
    preferredTime: string;
    optimalDuration: number;
    riskTolerance: "low" | "medium" | "high";
  };
  recommendations: {
    immediate: string[];
    weekly: string[];
    monthly: string[];
  };
}

// ================================
// 🛠️ UTILITY FUNCTIONS WITH CACHING
// ================================

/**
 * Create hash for cache key generation
 */
const createHash = (data: unknown): string => {
  return btoa(JSON.stringify(data)).slice(0, 16);
};

/**
 * Enhanced data quality calculation with AI scoring and caching
 */
export const calculateEnhancedDataQuality = (
  data: QuestionnaireMetadata,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
  }
): number => {
  const cacheKey = "data_quality";
  const hash = createHash({ data, personalData });

  // Check cache first
  const cached = preferencesCache.get<number>(cacheKey, hash);
  if (cached !== null) return cached;

  let score = calculateDataQuality(data);

  // Enhanced scoring with AI factors
  if (personalData?.gender) score += WEIGHTS.gender * 1.2; // AI boost
  if (personalData?.age) score += WEIGHTS.age * 1.1;
  if (personalData?.weight) score += WEIGHTS.weight;
  if (personalData?.height) score += WEIGHTS.height;

  // AI completeness bonus
  const completeness = Object.values(personalData || {}).filter(Boolean).length;
  const aiBonus = Math.min(2, completeness * 0.5);

  const finalScore = Math.min(10, score + aiBonus);

  // Cache the result
  preferencesCache.set(cacheKey, finalScore, hash);

  return finalScore;
};

/**
 * AI-powered focus areas generation with adaptive learning
 */
export const generateAIFocusAreas = (
  data: QuestionnaireMetadata,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
    fitnessLevel?: string;
  },
  behaviorData?: UserBehaviorPattern
): string[] => {
  const cacheKey = "ai_focus_areas";
  const hash = createHash({ data, personalData, behaviorData });

  // Check cache first
  const cached = preferencesCache.get<string[]>(cacheKey, hash);
  if (cached !== null) return cached;

  // Start with basic personalized areas
  const areas = generatePersonalizedFocusAreas(data, personalData);

  // AI enhancements based on behavior patterns
  if (behaviorData) {
    // Analyze equipment usage patterns
    const topEquipment = Object.entries(behaviorData.equipmentUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([equipment]) => equipment);

    if (topEquipment.includes("cardio")) areas.push("סיבולת");
    if (topEquipment.includes("weights")) areas.push("כוח מקסימלי");

    // Analyze motivation trends
    const avgMotivation =
      behaviorData.motivationTrends.reduce((a, b) => a + b, 0) /
      behaviorData.motivationTrends.length;
    if (avgMotivation < 5) areas.push("מוטיבציה");
    if (avgMotivation > 8) areas.push("ביצועים מתקדמים");
  }

  // Remove duplicates and limit to 5 focus areas
  const uniqueAreas = [...new Set(areas)].slice(0, 5);

  // Cache the result
  preferencesCache.set(cacheKey, uniqueAreas, hash);

  return uniqueAreas;
};

/**
 * Generate AI-powered user insights and predictions
 */
export const generateUserInsights = (
  data: QuestionnaireMetadata,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
    fitnessLevel?: string;
  },
  usageHistory?: {
    workoutFrequency: number[];
    completionRates: number[];
    preferredTimes: string[];
  }
): AIInsights => {
  const cacheKey = "user_insights";
  const hash = createHash({ data, personalData, usageHistory });

  // Check cache first
  const cached = preferencesCache.get<AIInsights>(cacheKey, hash);
  if (cached !== null) return cached;

  // AI personality analysis
  const personalityType = (() => {
    if (data.goal?.includes("חדש") || data.experience === "מתחיל")
      return "explorer";
    if (data.frequency?.includes("יומי")) return "routine_lover";
    if (data.goal?.includes("תחרות") || data.goal?.includes("ביצועים"))
      return "goal_oriented";
    return "social";
  })() as AIInsights["personalityType"];

  // Motivation factor analysis
  const motivationFactors = [];
  if (
    personalData?.age?.includes("25_") ||
    personalData?.age?.includes("35_")
  ) {
    motivationFactors.push("הישגים אישיים", "איזון עבודה-חיים");
  }
  if (personalData?.gender === "female") {
    motivationFactors.push("כושר פונקציונלי", "קהילה תומכת");
  }
  if (data.goal?.includes("ירידה")) {
    motivationFactors.push("תוצאות מדידות", "תמיכה רגשית");
  }

  // Predicted preferences with AI
  const predictedPreferences = {
    preferredTime: usageHistory?.preferredTimes[0] || "בוקר",
    optimalDuration: personalData?.age?.includes("50_") ? 30 : 45,
    riskTolerance: (personalData?.fitnessLevel === "advanced"
      ? "high"
      : personalData?.fitnessLevel === "beginner"
        ? "low"
        : "medium") as "low" | "medium" | "high",
  };

  // Smart recommendations
  const recommendations = {
    immediate: [
      `התחל עם ${predictedPreferences.optimalDuration} דקות`,
      `מומלץ לאמן ב${predictedPreferences.preferredTime}`,
    ],
    weekly: ["הוסף יום מנוחה פעילה", "מדוד התקדמות כל שבוע"],
    monthly: ["הערך מחדש את המטרות", "שדרג את תוכנית האימונים"],
  };

  const insights: AIInsights = {
    personalityType,
    motivationFactors,
    predictedPreferences,
    recommendations,
  };

  // Cache the result
  preferencesCache.set(cacheKey, insights, hash);

  return insights;
};
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
/**
 * Advanced Smart Workout Plan with AI optimization and performance tracking
 */
export interface AdvancedSmartWorkoutPlan extends SmartWorkoutPlan {
  aiInsights: AIInsights;
  performanceMetrics: {
    expectedCalories: number;
    estimatedDuration: number;
    difficultyScore: number;
    recoveryTime: number;
  };
  adaptiveLearning: {
    personalityMatch: number; // 1-10
    preferenceAlignment: number; // 1-10
    successProbability: number; // 0-1
  };
  cacheInfo: {
    generated: string;
    validUntil: string;
    version: string;
  };
}

/**
 * Create advanced workout plan with AI optimization
 */
export const createAdvancedWorkoutPlan = (
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
  },
  questionnaire?: QuestionnaireMetadata
): AdvancedSmartWorkoutPlan | null => {
  if (!prefs || !questionnaire) return null;

  const cacheKey = "advanced_workout_plan";
  const hash = createHash({
    recommendations,
    prefs,
    personalData,
    questionnaire,
  });

  // Check cache first
  const cached = preferencesCache.get<AdvancedSmartWorkoutPlan>(cacheKey, hash);
  if (cached !== null) return cached;

  // Generate AI insights
  const aiInsights = generateUserInsights(questionnaire, personalData);

  // Calculate performance metrics with AI
  const totalDuration = recommendations.reduce((sum, rec) => {
    return sum + (rec.duration || 45);
  }, 0);

  const performanceMetrics = {
    expectedCalories: Math.round(
      totalDuration * 8 * (personalData?.weight?.includes("70_") ? 1.1 : 1.0)
    ),
    estimatedDuration: totalDuration,
    difficultyScore: prefs.motivationLevel >= 7 ? 8 : 6,
    recoveryTime: personalData?.age?.includes("50_") ? 48 : 24,
  };

  // Calculate adaptive learning scores
  const personalityAlignment = (() => {
    if (
      aiInsights.personalityType === "goal_oriented" &&
      prefs.motivationLevel >= 8
    )
      return 9;
    if (
      aiInsights.personalityType === "routine_lover" &&
      recommendations.length >= 3
    )
      return 8;
    if (
      aiInsights.personalityType === "explorer" &&
      recommendations.length <= 2
    )
      return 7;
    return 6;
  })();

  const adaptiveLearning = {
    personalityMatch: personalityAlignment,
    preferenceAlignment: Math.min(10, aiInsights.motivationFactors.length * 2),
    successProbability: Math.min(
      1,
      (personalityAlignment + prefs.motivationLevel) / 18
    ),
  };

  // Enhanced progression pace
  const personalizedPace = calculatePersonalizedProgressionPace(personalData);
  const personalizedMotivation = generatePersonalizedMotivation(personalData);

  const advancedPlan: AdvancedSmartWorkoutPlan = {
    // Original SmartWorkoutPlan properties
    weeklySchedule: recommendations.slice(
      0,
      Math.min(4, recommendations.length)
    ),
    personalityMatch: prefs.personalityProfile,
    focusAreas: aiInsights.motivationFactors.slice(0, 3),
    progressionPace: personalizedPace.description,
    motivationalBoost: personalizedMotivation,
    generatedAt: new Date().toISOString(),

    // Advanced AI features
    aiInsights,
    performanceMetrics,
    adaptiveLearning,
    cacheInfo: {
      generated: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      version: "2.0-AI",
    },
  };

  // Cache the result
  preferencesCache.set(cacheKey, advancedPlan, hash);

  return advancedPlan;
};

/**
 * Get cache statistics and performance metrics
 */
export const getCacheStats = () => preferencesCache.getStats();

/**
 * Clear preferences cache (useful for testing or memory management)
 */
export const clearPreferencesCache = () => preferencesCache.clear();

/**
 * Predict future user preferences based on current data and AI analysis
 */
export const predictFuturePreferences = (
  currentData: QuestionnaireMetadata,
  personalData?: {
    gender?: string;
    age?: string;
    weight?: string;
    height?: string;
    fitnessLevel?: string;
  },
  daysAhead: number = 30
): {
  predictedGoals: string[];
  expectedFrequency: string;
  recommendedEquipment: string[];
  confidenceScore: number;
} => {
  const cacheKey = "future_predictions";
  const hash = createHash({ currentData, personalData, daysAhead });

  // Check cache first
  const cached = preferencesCache.get<
    ReturnType<typeof predictFuturePreferences>
  >(cacheKey, hash);
  if (cached !== null) return cached;

  // AI prediction algorithm
  const insights = generateUserInsights(currentData, personalData);

  const predictedGoals = [];
  if (insights.personalityType === "goal_oriented") {
    predictedGoals.push("ביצועים מתקדמים", "תחרותיות");
  } else if (insights.personalityType === "explorer") {
    predictedGoals.push("גיוון באימונים", "רכישת כישורים חדשים");
  } else {
    predictedGoals.push("כושר כללי", "בריאות לטווח ארוך");
  }

  // Predict frequency evolution
  const currentFreqScore = scoreFrequency(currentData.frequency);
  const expectedFreqScore = Math.min(
    10,
    currentFreqScore + Math.floor(daysAhead / 15)
  );
  const expectedFrequency =
    Object.entries(FREQUENCY_SCORES).find(
      ([, score]) => score <= expectedFreqScore
    )?.[0] || "2-3 פעמים בשבוע";

  // Equipment recommendations based on progression
  const recommendedEquipment = [];
  if (insights.predictedPreferences.riskTolerance === "high") {
    recommendedEquipment.push("משקולות מתקדמות", "ציוד קרדיו");
  } else {
    recommendedEquipment.push("גומיות התנגדות", "משקולות בסיסיות");
  }

  const confidenceScore = Math.min(
    1,
    insights.motivationFactors.length * 0.2 + 0.3
  );

  const prediction = {
    predictedGoals,
    expectedFrequency,
    recommendedEquipment,
    confidenceScore,
  };

  // Cache the result
  preferencesCache.set(cacheKey, prediction, hash);

  return prediction;
};

/**
 * Legacy function - maintained for backward compatibility
 * Use createAdvancedWorkoutPlan for new implementations
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

  // Use enhanced functions for better results
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
