/**
 * @file src/screens/workout/utils/workoutConstants.ts
 * @description קבועים ואפשרויות למערכת האימון
 * English: Constants and options for workout system
 */

// זמני מנוחה דיפולטיביים לפי סוג תרגיל (בשניות)
// Default rest times by exercise type (in seconds)
export const DEFAULT_REST_TIMES = {
  compound: 180, // תרגילים מורכבים (סקוואט, דדליפט)
  isolation: 90, // תרגילי בידוד
  cardio: 60, // תרגילי קרדיו
  abs: 45, // תרגילי בטן
  warmup: 30, // חימום
} as const;

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
