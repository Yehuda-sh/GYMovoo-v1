/**
 * @file src/features/workout/constants/workoutConstants.ts
 * @description Unified constants for workout system
 * @updated 2025-09-11 Moved to correct location and fixed imports
 */

// ✅ Import PersonalData from central utils
import { PersonalData } from "../../../utils/personalDataUtils";

// ===============================================
// 🏋️ Workout Plan Constants - קבועי תוכניות אימון
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

// Default values for workout generation
export const DEFAULT_EXPERIENCE = "intermediate";
export const DEFAULT_DURATION = "45-60";
export const DEFAULT_FREQUENCY = "3_times";
export const DEFAULT_GOAL = "build_muscle";

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

// ===============================================
// 🕒 Rest Timer Constants - קבועי טיימר מנוחה
// ===============================================

/**
 * Step size for rest timer adjustments (in seconds)
 * גודל צעד להתאמת טיימר מנוחה (בשניות)
 */
export const REST_ADJUST_STEP_SECONDS = 10 as const;

// Types for helper functions
export type RestTimes = {
  compound: number;
  isolation: number;
  cardio: number;
  abs: number;
  warmup: number;
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

// Default rest times by exercise type (in seconds)
export const DEFAULT_REST_TIMES: RestTimes = {
  compound: 180, // תרגילים מורכבים (סקוואט, דדליפט)
  isolation: 90, // תרגילי בידוד
  cardio: 60, // תרגילי קרדיו
  abs: 45, // תרגילי בטן
  warmup: 30, // חימום
};

// ✅ זמני מנוחה מותאמים אישית
export const getPersonalizedRestTimes = (
  personalData?: PersonalData
): RestTimes => {
  const baseTimes: RestTimes = { ...DEFAULT_REST_TIMES };

  if (!personalData) return baseTimes;

  // התאמה פשוטה לגיל - מבוגרים צריכים יותר מנוחה
  const age = personalData.age;
  if (age && (age.includes("65") || age.includes("over"))) {
    baseTimes.compound += 30;
    baseTimes.isolation += 15;
  }

  // התאמה לרמת כושר
  if (personalData.fitnessLevel === "beginner") {
    baseTimes.compound += 20;
    baseTimes.isolation += 15;
  } else if (personalData.fitnessLevel === "advanced") {
    baseTimes.compound -= 10;
    baseTimes.isolation -= 5;
  }

  // הבטחת גבולות מינימליים
  baseTimes.compound = Math.max(60, baseTimes.compound);
  baseTimes.isolation = Math.max(45, baseTimes.isolation);
  baseTimes.cardio = Math.max(30, baseTimes.cardio);
  baseTimes.abs = Math.max(30, baseTimes.abs);
  baseTimes.warmup = Math.max(20, baseTimes.warmup);

  return baseTimes;
};

// ✅ משקלי פלטות סטנדרטיים
export const PLATE_WEIGHTS = [
  { weight: 25, color: "#FF3B30", label: "25" },
  { weight: 20, color: "#007AFF", label: "20" },
  { weight: 15, color: "#FFCC00", label: "15" },
  { weight: 10, color: "#34C759", label: "10" },
  { weight: 5, color: "#5856D6", label: "5" },
  { weight: 2.5, color: "#FF9500", label: "2.5" },
  { weight: 1.25, color: "#8E8E93", label: "1.25" },
] as const;

// ✅ המלצות משקל התחלתי מותאמות אישית
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

  // התאמה פשוטה לפי מין
  if (personalData.gender === "female") {
    // נשים בדרך כלל מתחילות עם משקלים נמוכים יותר
    Object.keys(recommendations).forEach((key) => {
      recommendations[key as keyof typeof recommendations] *= 0.75;
    });
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
