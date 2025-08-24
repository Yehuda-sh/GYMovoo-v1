/**
 * @file src/screens/workout/utils/workoutConstants.ts
 * @description קבועים ואפשרויות למערכת האימון (מאוחד)
 * English: Unified constants and options for workout system
 * @updated 2025-08-24 איחוד מ-constants/workoutConstants.ts + הסרת קוד לא בשימוש + הוספת קבועי עיצוב
 * @enhancements הוספת DESIGN_CONSTANTS לתמיכה בשיפורי עיצוב מתקדמים
 */

// ✅ Import PersonalData from central utils
import { PersonalData } from "../../../utils/personalDataUtils";

// ===============================================
// � Design Constants - קבועי עיצוב מתקדמים
// ===============================================

/**
 * Advanced design constants for enhanced UI components
 * קבועי עיצוב מתקדמים לרכיבי ממשק משופרים
 * @added 2025-08-24 Support for 30+ enhanced components
 */
export const DESIGN_CONSTANTS = {
  // Enhanced shadows
  ADVANCED_SHADOW: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  // Colored shadows for primary elements
  PRIMARY_SHADOW: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  // Enhanced typography
  ENHANCED_TYPOGRAPHY: {
    LARGE_TITLE: { fontSize: 32, fontWeight: "800", letterSpacing: 0.5 },
    MEDIUM_TITLE: { fontSize: 26, fontWeight: "700", letterSpacing: 0.4 },
    ENHANCED_BUTTON: { fontSize: 18, fontWeight: "700", letterSpacing: 0.6 },
    ENHANCED_SUBTITLE: { fontSize: 18, letterSpacing: 0.3 },
  },

  // Text shadow for premium look
  TEXT_SHADOW: {
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Enhanced button styling
  BUTTON_ENHANCEMENT: {
    minHeight: 56,
    borderRadiusMultiplier: "xl", // Use theme.radius.xl
    paddingVertical: 18,
  },

  // Enhanced card styling
  CARD_ENHANCEMENT: {
    borderRadiusMultiplier: "xl", // Use theme.radius.xl
    paddingMultiplier: "xxl", // Use theme.spacing.xxl
    elevationHigh: 12,
    elevationMedium: 8,
    elevationLow: 4,
  },
} as const;

// ===============================================
// �🏋️ Workout Plan Constants - קבועי תוכניות אימון
// ===============================================

// Workout day templates (מאוחד מ-constants/)
export const WORKOUT_DAYS = {
  1: ["אימון מלא"],
  2: ["פלג גוף עליון", "פלג גוף תחתון"],
  3: ["דחיפה", "משיכה", "רגליים"],
  4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
  5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
  6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
} as const;

// Icons mapping for workout days (מאוחד מ-constants/)
export const DAY_ICONS: { [key: string]: string } = {
  "אימון מלא": "dumbbell",
  "פלג גוף עליון": "arm-flex",
  "פלג גוף תחתון": "run",
  דחיפה: "arrow-up-bold",
  משיכה: "arrow-down-bold",
  רגליים: "run",
  חזה: "shield",
  גב: "human",
  "גב + ביצפס": "human",
  כתפיים: "human-handsup",
  ידיים: "arm-flex",
  בטן: "ab-testing",
  "חזה + טריצפס": "shield",
  "כתפיים + בטן": "human-handsup",
  "ידיים + בטן": "arm-flex",
  "בטן + קרדיו": "run-fast",
} as const;

// Default values for workout generation (מאוחד מ-constants/)
export const DEFAULT_EXPERIENCE = "intermediate";
export const DEFAULT_DURATION = "45-60";
export const DEFAULT_FREQUENCY = "3_times";
export const DEFAULT_GOAL = "build_muscle";

// Experience level mappings (מאוחד מ-constants/)
export const EXPERIENCE_MAP = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
  expert: "advanced", // fallback for expert level
} as const;

// Duration mappings (מאוחד מ-constants/)
export const DURATION_MAP = {
  "30_45_min": "30-45",
  "45_60_min": "45-60",
  "60_90_min": "60-90",
  "90_plus_min": "90+",
} as const;

// Goal mappings (מאוחד מ-constants/)
export const GOAL_MAP = {
  build_muscle: "build_muscle",
  lose_weight: "weight_loss",
  get_stronger: "strength",
  improve_endurance: "endurance",
  general_fitness: "general_fitness",
  muscle_gain: "build_muscle", // alias
  weight_loss: "weight_loss",
  strength: "strength",
  endurance: "endurance",
} as const;

// Performance tracking thresholds (מאוחד מ-constants/)
export const PERFORMANCE_THRESHOLDS = {
  SLOW_RENDER_WARNING: 100, // ms
  CRITICAL_RENDER_WARNING: 200, // ms
  SLOW_RENDER_MS: 100,
  AUTO_START_DELAY: 1500,
  PRE_SELECTED_DELAY: 1000,
  // Enhanced UI performance thresholds
  ANIMATION_DURATION: 300, // ms for smooth animations
  DEBOUNCE_DELAY: 250, // ms for user input debouncing
  SHADOW_RENDER_OPTIMIZATION: true, // Enable shadow optimizations
} as const;

// Enhanced UI animation constants
export const ANIMATION_CONSTANTS = {
  SPRING_CONFIG: {
    tension: 100,
    friction: 8,
  },
  FADE_DURATION: 200,
  SLIDE_DURATION: 300,
  SCALE_DURATION: 150,
} as const;

// Accessibility and UX enhancement constants
export const ACCESSIBILITY_CONSTANTS = {
  MIN_TOUCH_TARGET_SIZE: 44, // iOS/Android minimum
  ENHANCED_TOUCH_TARGET_SIZE: 56, // Our enhanced minimum
  ENHANCED_PADDING: {
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 24,
    EXTRA_LARGE: 32,
  },
  RTL_SUPPORT: {
    WRITING_DIRECTION: "rtl" as const,
    TEXT_ALIGN_RIGHT: "right" as const,
    TEXT_ALIGN_CENTER: "center" as const,
  },
} as const;

// Haptic feedback types (מאוחד מ-constants/)
export type HapticIntensity = "light" | "medium" | "heavy";

// Global exercise state interface (מאוחד מ-constants/)
export interface GlobalExerciseState {
  usedExercises_day0?: Set<string>;
  usedExercises_day1?: Set<string>;
  usedExercises_day2?: Set<string>;
  [key: string]: Set<string> | undefined;
}

// Workout plan types (מאוחד מ-constants/)
export type PlanType = "basic" | "smart";

// Equipment display types (מאוחד מ-constants/)
export type EquipmentDisplayState = string[];

// ===============================================
// 🕒 Rest Timer Constants - קבועי טיימר מנוחה
// ===============================================

/**
 * Step size for rest timer adjustments (in seconds)
 * גודל צעד להתאמת טיימר מנוחה (בשניות)
 */
export const REST_ADJUST_STEP_SECONDS = 10 as const;

// טיפוסים מחזקים להחזרת פונקציות (ניתנים לעדכון פנימי)
export type RestTimes = {
  compound: number;
  isolation: number;
  cardio: number;
  abs: number;
  warmup: number;
};

export type RpeRange = { min: number; max: number; description: string };
export type RpeRecommendations = {
  warmup: RpeRange;
  working: RpeRange;
  intensity: RpeRange;
  maxEffort: RpeRange;
};

export type StartingWeights = {
  squat: number;
  deadlift: number;
  benchPress: number;
  overheadPress: number;
  row: number;
  curl: number;
  lateralRaise: number;
};

// ===== Helpers: normalize ranges from different ID schemes =====
// Support both unifiedQuestionnaire (e.g., "51_65", "over_65", "under_50")
// and personalDataUtils (e.g., "55_64", "65_plus", "70_79").

const isOlderAgeRange = (age?: string): boolean => {
  if (!age) return false;
  const s = String(age);
  // Unified
  if (s === "over_65" || s.startsWith("51_")) return true;
  // Legacy/personalDataUtils
  if (s === "65_plus" || s.startsWith("55_")) return true;
  return false;
};

const isYoungerAgeRange = (age?: string): boolean => {
  if (!age) return false;
  const s = String(age);
  // Unified
  if (s === "under_18" || s.startsWith("18_") || s.startsWith("25_"))
    return true;
  // Legacy/personalDataUtils
  if (s.startsWith("18_") || s.startsWith("25_")) return true;
  return false;
};

const parseNumericRange = (
  range?: string
): { min: number; max: number } | null => {
  if (!range) return null;
  const s = String(range);
  let m = s.match(/^(\d+)_([\d]+)/);
  if (m) {
    return { min: parseInt(m[1], 10), max: parseInt(m[2], 10) };
  }
  m = s.match(/^under_(\d+)/);
  if (m) {
    const n = parseInt(m[1], 10);
    return { min: 0, max: n };
  }
  m = s.match(/^over_(\d+)/);
  if (m) {
    const n = parseInt(m[1], 10);
    return { min: n, max: Number.POSITIVE_INFINITY };
  }
  // Special case: "65_plus"
  if (s === "65_plus") return { min: 65, max: Number.POSITIVE_INFINITY };
  return null;
};

const getWeightCategory = (weight?: string): "low" | "mid" | "high" => {
  const r = parseNumericRange(weight);
  if (!r) return "mid";
  // Consider <= 60kg as low, >= 90kg as high
  if (r.max <= 60) return "low";
  if (r.min >= 90) return "high";
  return "mid";
};

// זמני מנוחה דיפולטיביים לפי סוג תרגיל (בשניות)
// Default rest times by exercise type (in seconds)
export const DEFAULT_REST_TIMES: RestTimes = {
  compound: 180, // תרגילים מורכבים (סקוואט, דדליפט)
  isolation: 90, // תרגילי בידוד
  cardio: 60, // תרגילי קרדיו
  abs: 45, // תרגילי בטן
  warmup: 30, // חימום
};

// ✅ זמני מנוחה מותאמים אישית (בשימוש ב-questionnaireService)
export const getPersonalizedRestTimes = (
  personalData?: PersonalData
): RestTimes => {
  const baseTimes: RestTimes = { ...DEFAULT_REST_TIMES };

  if (!personalData) return baseTimes;

  // התאמה לגיל
  if (isOlderAgeRange(personalData.age)) {
    // מבוגרים זקוקים למנוחה יותר ארוכה
    baseTimes.compound += 30; // 210 שניות
    baseTimes.isolation += 15; // 105 שניות
  } else if (isYoungerAgeRange(personalData.age)) {
    // צעירים יכולים עם מנוחה קצרה יותר
    baseTimes.compound -= 15; // 165 שניות
    baseTimes.isolation -= 10; // 80 שניות
  }

  // התאמה לרמת כושר
  if (personalData.fitnessLevel === "beginner") {
    // מתחילים זקוקים למנוחה יותר ארוכה
    baseTimes.compound += 20;
    baseTimes.isolation += 15;
  } else if (personalData.fitnessLevel === "advanced") {
    // מתקדמים יכולים עם מנוחה קצרה יותר
    baseTimes.compound -= 10;
    baseTimes.isolation -= 5;
  }
  // הבטחת גבולות מינימליים סבירים
  baseTimes.compound = Math.max(60, baseTimes.compound);
  baseTimes.isolation = Math.max(45, baseTimes.isolation);
  baseTimes.cardio = Math.max(30, baseTimes.cardio);
  baseTimes.abs = Math.max(30, baseTimes.abs);
  baseTimes.warmup = Math.max(20, baseTimes.warmup);

  return baseTimes;
};

// סוגי סטים
// Set types
export const SET_TYPES = [
  { value: "normal", label: "רגיל", color: "#007AFF" },
  { value: "warmup", label: "חימום", color: "#FF9500" },
  { value: "dropset", label: "דרופסט", color: "#AF52DE" },
  { value: "failure", label: "כישלון", color: "#FF3B30" },
] as const;

// ✅ משקלי פלטות סטנדרטיים (בשימוש ב-PlateCalculatorModal)
export const PLATE_WEIGHTS = [
  { weight: 25, color: "#FF3B30", label: "25" },
  { weight: 20, color: "#007AFF", label: "20" },
  { weight: 15, color: "#FFCC00", label: "15" },
  { weight: 10, color: "#34C759", label: "10" },
  { weight: 5, color: "#5856D6", label: "5" },
  { weight: 2.5, color: "#FF9500", label: "2.5" },
  { weight: 1.25, color: "#8E8E93", label: "1.25" },
] as const;

// ✅ המלצות משקל התחלתי מותאמות אישית (בשימוש ב-questionnaireService)
export const getPersonalizedStartingWeights = (
  personalData?: PersonalData
): StartingWeights => {
  const recommendations: StartingWeights = {
    // משקלים בק"ג לתרגילים בסיסיים
    squat: 20,
    deadlift: 25,
    benchPress: 15,
    overheadPress: 10,
    row: 15,
    curl: 5,
    lateralRaise: 2.5,
  };

  if (!personalData) return recommendations;

  // התאמה לפי מין
  if (personalData.gender === "female") {
    // נשים בדרך כלל מתחילות עם משקלים נמוכים יותר
    recommendations.squat = 15;
    recommendations.deadlift = 20;
    recommendations.benchPress = 10;
    recommendations.overheadPress = 7.5;
    recommendations.row = 10;
    recommendations.curl = 3;
    recommendations.lateralRaise = 2;
  } else if (personalData.gender === "male") {
    // גברים יכולים להתחיל עם משקלים גבוהים יותר
    recommendations.squat = 25;
    recommendations.deadlift = 30;
    recommendations.benchPress = 20;
    recommendations.overheadPress = 12.5;
    recommendations.row = 20;
    recommendations.curl = 7.5;
    recommendations.lateralRaise = 3;
  }

  // התאמה לפי משקל גוף
  if (personalData.weight) {
    const cat = getWeightCategory(personalData.weight);
    const multiplier = cat === "low" ? 0.8 : cat === "high" ? 1.2 : 1;
    Object.keys(recommendations).forEach((key) => {
      recommendations[key as keyof typeof recommendations] *= multiplier;
    });
  }

  // התאמה לפי גיל (אחיד עם עזרי הגיל בקובץ)
  if (personalData.age) {
    if (isOlderAgeRange(personalData.age)) {
      // מבוגרים מתחילים עם משקלים נמוכים יותר
      Object.keys(recommendations).forEach((key) => {
        recommendations[key as keyof typeof recommendations] *= 0.85;
      });
    } else if (isYoungerAgeRange(personalData.age)) {
      // צעירים יכולים להתחיל עם משקלים גבוהים יותר
      Object.keys(recommendations).forEach((key) => {
        recommendations[key as keyof typeof recommendations] *= 1.1;
      });
    }
  }

  // התאמה לרמת כושר
  if (personalData.fitnessLevel === "beginner") {
    Object.keys(recommendations).forEach((key) => {
      recommendations[key as keyof typeof recommendations] *= 0.75;
    });
  } else if (personalData.fitnessLevel === "advanced") {
    Object.keys(recommendations).forEach((key) => {
      recommendations[key as keyof typeof recommendations] *= 1.3;
    });
  }

  // עיגול למשקלי פלטות סטנדרטיים
  Object.keys(recommendations).forEach((key) => {
    const value = recommendations[key as keyof typeof recommendations];
    recommendations[key as keyof typeof recommendations] =
      Math.round(value * 4) / 4; // עיגול לרבעי ק"ג
  });

  return recommendations;
};

// ✅ הגדרות שמירה אוטומטית (בשימוש ב-autoSaveService + workoutValidationService)
export const AUTO_SAVE = {
  interval: 30000, // כל 30 שניות
  maxDrafts: 5, // מקסימום טיוטות
  draftExpiry: 7 * 24 * 60 * 60 * 1000, // 7 ימים
  // Enhanced save settings
  designPreferencesKey: "user_design_preferences", // Save enhanced UI preferences
  performanceMetricsKey: "ui_performance_metrics", // Track UI performance
} as const;

// Export all design-related constants for easy access
export const UI_ENHANCEMENT_SUITE = {
  DESIGN_CONSTANTS,
  ANIMATION_CONSTANTS,
  ACCESSIBILITY_CONSTANTS,
  PERFORMANCE_THRESHOLDS,
} as const;
