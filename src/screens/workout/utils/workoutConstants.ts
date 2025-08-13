/**
 * @file src/screens/workout/utils/workoutConstants.ts
 * @description קבועים ואפשרויות למערכת האימון
 * English: Constants and options for workout system
 * @updated 2025-08-10 הוספת קבועים מותאמים אישית לפי נתונים אישיים
 */

// ✅ Import PersonalData from central utils
import { PersonalData } from "../../../utils/personalDataUtils";

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

// ✅ זמני מנוחה מותאמים אישית
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

// אפשרויות RPE (מאמץ נתפס)
// RPE options (Rate of Perceived Exertion)
export const RPE_SCALE = [
  { value: 6, label: "קל מאוד", color: "#34C759" },
  { value: 7, label: "קל", color: "#5AC757" },
  { value: 7.5, label: "בינוני", color: "#FFCC00" },
  { value: 8, label: "מאתגר", color: "#FF9500" },
  { value: 8.5, label: "קשה", color: "#FF6B35" },
  { value: 9, label: "קשה מאוד", color: "#FF3B30" },
  { value: 9.5, label: "כמעט מקסימום", color: "#C7253E" },
  { value: 10, label: "מקסימום", color: "#8B0000" },
] as const;

// ✅ המלצות RPE מותאמות אישית
export const getPersonalizedRPERecommendations = (
  personalData?: PersonalData
): RpeRecommendations => {
  const recommendations: RpeRecommendations = {
    warmup: { min: 6, max: 7, description: "חימום קל" },
    working: { min: 7.5, max: 8.5, description: "סטי עבודה" },
    intensity: { min: 8.5, max: 9.5, description: "סטים אינטנסיביים" },
    maxEffort: { min: 9.5, max: 10, description: "מאמץ מקסימלי" },
  };

  if (!personalData) return recommendations;

  // התאמה לגיל
  if (personalData.age) {
    if (isOlderAgeRange(personalData.age)) {
      // מבוגרים - יותר זהירים עם אינטנסיביות
      recommendations.working = {
        min: 7,
        max: 8,
        description: "סטי עבודה (מתואם לגיל)",
      };
      recommendations.intensity = {
        min: 8,
        max: 9,
        description: "סטים אינטנסיביים (זהירות)",
      };
      recommendations.maxEffort = {
        min: 9,
        max: 9.5,
        description: "מאמץ גבוה (לא מקסימלי)",
      };
    } else if (isYoungerAgeRange(personalData.age)) {
      // צעירים - יכולים ללכת יותר חזק
      recommendations.working = {
        min: 8,
        max: 9,
        description: "סטי עבודה (אנרגיה צעירה)",
      };
      recommendations.intensity = {
        min: 9,
        max: 10,
        description: "סטים אינטנסיביים (מלא גז)",
      };
    }
  }

  // התאמה לרמת כושר
  if (personalData.fitnessLevel === "beginner") {
    // מתחילים - מתחילים עם RPE נמוך יותר
    recommendations.warmup = {
      min: 6,
      max: 6.5,
      description: "חימום עדין למתחיל",
    };
    recommendations.working = {
      min: 7,
      max: 8,
      description: "סטי עבודה (למידה)",
    };
    recommendations.intensity = { min: 8, max: 8.5, description: "אתגר מתון" };
    recommendations.maxEffort = {
      min: 8.5,
      max: 9,
      description: "מאמץ גבוה (לא מקסימלי)",
    };
  } else if (personalData.fitnessLevel === "advanced") {
    // מתקדמים - יכולים ללכת חזק יותר
    recommendations.working = {
      min: 8,
      max: 9,
      description: "סטי עבודה מתקדמים",
    };
    recommendations.intensity = {
      min: 9,
      max: 10,
      description: "אינטנסיביות גבוהה",
    };
    recommendations.maxEffort = {
      min: 9.5,
      max: 10,
      description: "מאמץ מקסימלי מתקדם",
    };
  }

  // התאמה לפי מין - נשים לפעמים נוטות להיות זהירות יותר
  if (personalData.gender === "female") {
    // עידוד לנשים ללכת חזק יותר (שבירת מחסומים מנטליים)
    recommendations.working.description += " - את יכולה יותר!";
    recommendations.intensity.description += " - שברי מחסומים!";
  }

  return recommendations;
};

// הודעות עידוד
// Encouragement messages
export const ENCOURAGEMENT_MESSAGES = {
  newPR: [
    "🏆 שיא אישי חדש! כל הכבוד!",
    "💪 וואו! שברת את השיא הקודם!",
    "🔥 אש! שיא חדש נרשם!",
    "⚡ מדהים! עברת את הגבול!",
  ],
  goodSet: ["💪 סט מעולה!", "👏 עבודה טובה!", "🎯 ממוקד וחזק!", "✨ המשך ככה!"],
  lastSet: [
    "🏁 סט אחרון! תן הכל!",
    "💯 אחרון חביב! בוא נסיים חזק!",
    "🚀 סט סיום! תדחוף!",
  ],
  workoutComplete: [
    "🎉 סיימת! אימון מדהים!",
    "🏅 כל הכבוד! אימון הושלם בהצלחה!",
    "✅ מעולה! עוד אימון מאחוריך!",
    "🌟 פנטסטי! המשך כך!",
  ],
} as const;

// ✅ הודעות עידוד מותאמות אישית
export const getPersonalizedEncouragement = (
  type: keyof typeof ENCOURAGEMENT_MESSAGES,
  personalData?: PersonalData
): string => {
  const baseMessages = ENCOURAGEMENT_MESSAGES[type];

  if (!personalData) {
    return baseMessages[Math.floor(Math.random() * baseMessages.length)];
  }

  let personalizedMessages: string[] = [];

  // הודעות מותאמות למין
  if (personalData.gender === "female") {
    switch (type) {
      case "newPR":
        personalizedMessages = [
          "👑 שיא חדש! את פשוט מדהימה!",
          "💎 יופי של שיא! girl power!",
          "🌟 את שוברת גבולות! כל הכבוד!",
          "✨ שיא אישי חדש! את מלכה!",
        ];
        break;
      case "workoutComplete":
        personalizedMessages = [
          "🌸 סיימת! את לוחמת אמיתית!",
          "💖 אימון מושלם! את מעוררת השראה!",
          "🦋 מדהים! ממשיכה להאמין בעצמך!",
          "👸 אלופה! עוד אימון מאחוריך!",
        ];
        break;
    }
  } else if (personalData.gender === "male") {
    switch (type) {
      case "newPR":
        personalizedMessages = [
          "🔥 שיא חדש! אלוף אמיתי!",
          "⚡ מפלצת! שברת את השיא!",
          "🏆 גבר של פלדה! כל הכבוד!",
          "💀 חיה! שיא אישי חדש!",
        ];
        break;
      case "workoutComplete":
        personalizedMessages = [
          "⚔️ סיימת! לוחם אמיתי!",
          "🔨 אימון של גיבור! כל הכבוד!",
          "🗿 סולידי! עוד אימון מאחוריך!",
          "👑 מלך! המשך לשלוט!",
        ];
        break;
    }
  }

  // הודעות מותאמות לגיל
  if (personalData.age) {
    if (isOlderAgeRange(personalData.age)) {
      switch (type) {
        case "newPR":
          personalizedMessages.push(
            "🏅 שיא מרשים בגילך! מעורר השראה!",
            "💎 ותיק מנצח! שיא חדש!",
            "👴 גיל זה רק מספר! שיא מדהים!"
          );
          break;
        case "workoutComplete":
          personalizedMessages.push(
            "🌟 אימון מופתי! מוכיח שגיל זה רק מספר!",
            "🏆 מעורר השראה! המשך ככה!",
            "💪 חזק ובריא! כל הכבוד!"
          );
          break;
      }
    } else if (isYoungerAgeRange(personalData.age)) {
      switch (type) {
        case "newPR":
          personalizedMessages.push(
            "🚀 צעיר ועוצמתי! שיא מדהים!",
            "⚡ אנרגיה צעירה! שבירת גבולות!",
            "🔥 דור הזהב! שיא חדש!"
          );
          break;
      }
    }
  }

  // הודעות מותאמות לרמת כושר
  if (personalData.fitnessLevel === "beginner") {
    switch (type) {
      case "newPR":
        personalizedMessages.push(
          "🌱 התקדמות מעולה למתחיל! שיא ראשון!",
          "📈 בדרך הנכונה! שיא מדהים!",
          "🎯 התחלה מושלמת! שיא חדש!"
        );
        break;
      case "workoutComplete":
        personalizedMessages.push(
          "👶 מתחיל מוצלח! כל אימון הוא ניצחון!",
          "🌟 בונה בסיס חזק! המשך ככה!",
          "📚 לומד ומתקדם! מעולה!"
        );
        break;
    }
  } else if (personalData.fitnessLevel === "advanced") {
    switch (type) {
      case "newPR":
        personalizedMessages.push(
          "🎖️ מתקדם אמיתי! שיא ברמה גבוהה!",
          "🏆 אליטה! שיא של מקצוען!",
          "⚡ רמה עליונה! שיא מדהים!"
        );
        break;
    }
  }

  // אם יש הודעות מותאמות אישית, בחר מהן
  if (personalizedMessages.length > 0) {
    return personalizedMessages[
      Math.floor(Math.random() * personalizedMessages.length)
    ];
  }

  // אחרת, חזור להודעות הבסיסיות
  return baseMessages[Math.floor(Math.random() * baseMessages.length)];
};

// משקלי פלטות סטנדרטיים (ק"ג)
// Standard plate weights (kg)
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

// הגדרות צלילים
// Sound settings
export const SOUND_OPTIONS = {
  countdown: {
    beep: "countdown_beep.mp3",
    tick: "countdown_tick.mp3",
    voice: "countdown_voice.mp3",
  },
  complete: "rest_complete.mp3",
  newPR: "achievement.mp3",
  workoutStart: "workout_start.mp3",
  workoutEnd: "workout_complete.mp3",
} as const;

// הגדרות רטט
// Vibration patterns
export const VIBRATION_PATTERNS = {
  restComplete: [0, 200, 100, 200] as number[], // רטט כפול
  countdown: [0, 50] as number[], // רטט קצר
  newPR: [0, 100, 50, 100, 50, 300] as number[], // רטט חגיגי
};

// אנימציות למסך סיכום
// Summary screen animations
export const SUMMARY_ANIMATIONS = {
  duration: 3000,
  types: ["confetti", "fireworks", "fire", "stars"],
  colors: ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF", "#5856D6"],
} as const;

// הגדרות שמירה אוטומטית
// Auto-save settings
export const AUTO_SAVE = {
  interval: 30000, // כל 30 שניות
  maxDrafts: 5, // מקסימום טיוטות
  draftExpiry: 7 * 24 * 60 * 60 * 1000, // 7 ימים
} as const;
