/**
 * @file src/features/workout/utils/workoutHelpers.ts
 * @description יוטיליטיז מאופטמים לאימונים
 */

// ===============================================
//  Workout Feedback - משוב לאימון
// ===============================================

const FEELING_EMOJIS = new Map([
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
  ["טוב", "👍"],
  ["בסדר", "😐"],
  ["עייף", "😴"],
  ["אנרגטי", "⚡"],
]);

/**
 * המרת תחושה לemoji
 */
export const getFeelingEmoji = (feeling: string): string => {
  if (!feeling || typeof feeling !== "string") return "😐";
  return FEELING_EMOJIS.get(feeling.toLowerCase().trim()) || "😐";
};

/**
 * המרת קושי לכוכבים
 */
export const getDifficultyStars = (difficulty: number): string => {
  if (typeof difficulty !== "number" || isNaN(difficulty)) return "⭐";
  const clampedDifficulty = Math.max(1, Math.min(5, Math.round(difficulty)));
  return "⭐".repeat(clampedDifficulty);
};
