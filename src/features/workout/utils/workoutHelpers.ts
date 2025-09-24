/**
 * @file src/features/workout/utils/workoutHelpers.ts
 * @description Utilities למשוב אימון: מיפוי תחושה לאימוג'י + המרת קושי לכוכבים
 */

// cspell:ignore יוטיליטיז מאופטמים אימוג'י מצויין אנליטיקה

// ===============================================
//  Workout Feedback - משוב לאימון
// ===============================================

/**
 * מיפוי תחושות -> אימוג'י (מפתחות באנגלית/עברית באותיות קטנות)
 */
const FEELING_EMOJIS = new Map<string, string>([
  // English
  ["challenging", "😤"],
  ["strong", "💪"],
  ["enjoyable", "😊"],
  ["easy", "😴"],
  ["excellent", "🔥"],
  ["good", "👍"],
  ["okay", "😐"],
  ["tired", "😴"],
  ["energetic", "⚡"],

  // Hebrew
  ["מאתגר", "😤"],
  ["חזק", "💪"],
  ["מהנה", "😊"],
  ["קל", "😴"],
  ["מעולה", "🔥"],
  ["מצוין", "🔥"],
  ["מצויין", "🔥"], // וריאציה נפוצה
  ["טוב", "👍"],
  ["בסדר", "😐"],
  ["עייף", "😴"],
  ["אנרגטי", "⚡"],
]);

/**
 * דפוסים לזיהוי תחושות מתוך משפטים ארוכים/סינונימים
 * (הסדר חשוב – נבדק מלמעלה למטה)
 */
const FEELING_PATTERNS: Array<[RegExp, string]> = [
  // מצוין / מעולה
  [/\b(excellent|amazing|awesome|great|fantastic|superb)\b/i, "🔥"],
  [/(מעולה|מצוין|מצויין)/, "🔥"],

  // טוב
  [/\b(very good|pretty good|good)\b/i, "👍"],
  [/(טוב מאוד|די טוב|טוב)/, "👍"],

  // מהנה/נחמד
  [/\b(fun|enjoyable|nice)\b/i, "😊"],
  [/(מהנה|נחמד)/, "😊"],

  // חזק/אנרגטי
  [/\b(strong|powerful|pumped)\b/i, "💪"],
  [/\b(energetic|full of energy)\b/i, "⚡"],
  [/(חזק|אנרגטי)/, "💪"],

  // מאתגר/קשה
  [/\b(challenging|hard|tough|intense)\b/i, "😤"],
  [/(מאתגר|קשה|קשוח)/, "😤"],

  // עייף / קל / בסדר
  [/\b(tired|exhausted|sleepy)\b/i, "😴"],
  [/(עייף|מותש)/, "😴"],
  [/\b(easy|light)\b/i, "😴"],
  [/(קל)/, "😴"],
  [/\b(ok|okay|fine|meh)\b/i, "😐"],
  [/(בסדר|סביר)/, "😐"],
];

/**
 * המרת תחושה לאימוג'י (סובלני לשפות/סינונימים)
 */
export const getFeelingEmoji = (feeling?: string): string => {
  if (typeof feeling !== "string") return "😐";
  const norm = feeling.trim().toLowerCase();
  if (!norm) return "😐";

  // ניסיון מיפוי ישיר
  const direct = FEELING_EMOJIS.get(norm);
  if (direct) return direct;

  // ניסיון התאמה לפי תבניות במשפט מלא
  for (const [pattern, emoji] of FEELING_PATTERNS) {
    if (pattern.test(feeling)) return emoji;
  }

  return "😐";
};

/**
 * המרת קושי לכוכבים (1–5). אם מתקבל ערך לא תקין – מחזיר כוכב אחד.
 */
export const getDifficultyStars = (difficulty?: number): string => {
  if (typeof difficulty !== "number" || !Number.isFinite(difficulty))
    return "⭐";
  const clamped = Math.max(1, Math.min(5, Math.round(difficulty)));
  return "⭐".repeat(clamped);
};

/**
 * תווית טקסטואלית לקושי – שימושי לנגישות/אנליטיקה.
 */
export const getDifficultyLabel = (difficulty?: number): string => {
  if (typeof difficulty !== "number" || !Number.isFinite(difficulty))
    return "בינוני";
  const d = Math.round(Math.max(1, Math.min(5, difficulty)));
  switch (d) {
    case 1:
      return "קל";
    case 2:
      return "קל-בינוני";
    case 3:
      return "בינוני";
    case 4:
      return "קשה";
    case 5:
      return "קשה מאוד";
    default:
      return "בינוני";
  }
};
