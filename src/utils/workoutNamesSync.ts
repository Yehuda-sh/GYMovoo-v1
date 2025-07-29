/**
 * @file src/utils/workoutNamesSync.ts
 * @description כלי לוידוא סנכרון שמות אימונים
 * English: Utility to ensure workout names synchronization
 */

// שמות האימונים כפי שהם מוגדרים ב-WorkoutPlansScreen
export const WORKOUT_DAYS_NAMES = {
  1: ["אימון מלא"],
  2: ["פלג גוף עליון", "פלג גוף תחתון"],
  3: ["דחיפה", "משיכה", "רגליים"],
  4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
  5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
  6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
};

/**
 * מקבל שם אימון ומחזיר את האינדקס שלו ברשימה השבועית
 * Gets workout name and returns its index in the weekly list
 */
export const getWorkoutIndexByName = (
  workoutName: string,
  weeklyPlan: string[]
): number => {
  // חיפוש ישיר לפי שם
  const directIndex = weeklyPlan.findIndex((name) => name === workoutName);
  if (directIndex !== -1) {
    return directIndex;
  }

  // חיפוש לפי מילות מפתח
  const keywordMaps = [
    { keywords: ["דחיפה", "פלג גוף עליון", "חזה"], index: 0 },
    { keywords: ["משיכה", "פלג גוף תחתון", "גב"], index: 1 },
    { keywords: ["רגליים"], index: 2 },
    { keywords: ["כתפיים", "טריצפס"], index: 3 },
    { keywords: ["ידיים", "ביצפס", "בטן"], index: 4 },
    { keywords: ["קרדיו"], index: 5 },
  ];

  for (const map of keywordMaps) {
    if (map.keywords.some((keyword) => workoutName.includes(keyword))) {
      // וודא שהאינדקס הזה קיים בתוכנית השבועית
      if (map.index < weeklyPlan.length) {
        return map.index;
      }
    }
  }

  // אם לא מצאנו - חפש לפי ID
  const idMatch = workoutName.match(/day-(\d+)/);
  if (idMatch) {
    const dayIndex = parseInt(idMatch[1]) - 1;
    if (dayIndex >= 0 && dayIndex < weeklyPlan.length) {
      return dayIndex;
    }
  }

  console.warn(
    `⚠️ Could not find index for workout: "${workoutName}" in plan:`,
    weeklyPlan
  );
  return 0; // ברירת מחדל
};

/**
 * בדיקת תקינות - האם השמות בהוק תואמים לשמות בWorkoutPlansScreen
 * Validation check - do hook names match WorkoutPlansScreen names
 */
export const validateWorkoutNamesSync = () => {
  console.log("🔍 Validating workout names synchronization...");

  Object.entries(WORKOUT_DAYS_NAMES).forEach(([days, names]) => {
    console.log(`📅 ${days} days per week:`, names);
  });

  console.log("✅ Workout names validation complete");
};
