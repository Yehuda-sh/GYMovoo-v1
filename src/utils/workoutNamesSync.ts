/**
 * @file src/utils/workoutNamesSync.ts
 * @description כלי לוידוא סנכרון שמות אימונים עם תמיכה בהתאמת מגדר
 * English: Utility to ensure workout names synchronization with gender adaptation support
 * @updated 2025-07-30 תמיכה בהתאמת שמות אימונים למגדר בהתבסס על השאלון החכם
 */

import { adaptBasicTextToGender, makeTextGenderNeutral } from "./rtlHelpers";

// שמות האימונים כפי שהם מוגדרים ב-WorkoutPlansScreen עם תמיכה בהתאמת מגדר
export const WORKOUT_DAYS_NAMES = {
  1: ["אימון מלא"],
  2: ["פלג גוף עליון", "פלג גוף תחתון"],
  3: ["דחיפה", "משיכה", "רגליים"],
  4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
  5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
  6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
};

/**
 * שמות אימונים עם וריאציות מגדר
 * Workout names with gender variations
 */
export const WORKOUT_NAMES_WITH_GENDER: Record<
  string,
  {
    male: string;
    female: string;
    neutral: string;
  }
> = {
  "אימון מלא": {
    male: "אימון מלא לגבר",
    female: "אימון מלא לאישה",
    neutral: "אימון מלא",
  },
  "פלג גוף עליון": {
    male: "פלג גוף עליון מתקדם",
    female: "פלג גוף עליון מתקדמת",
    neutral: "פלג גוף עליון",
  },
  "פלג גוף תחתון": {
    male: "פלג גוף תחתון מתקדם",
    female: "פלג גוף תחתון מתקדמת",
    neutral: "פלג גוף תחתון",
  },
};

/**
 * התאמת שמות אימונים למגדר
 * Adapt workout names to gender
 */
export const adaptWorkoutNameToGender = (
  workoutName: string,
  gender: "male" | "female" | "other"
): string => {
  // בדיקה אם יש וריאציה מיוחדת
  if (WORKOUT_NAMES_WITH_GENDER[workoutName]) {
    const variations = WORKOUT_NAMES_WITH_GENDER[workoutName];
    switch (gender) {
      case "male":
        return variations.male;
      case "female":
        return variations.female;
      default:
        return variations.neutral;
    }
  }

  // התאמה כללית באמצעות rtlHelpers
  if (gender === "other") {
    return makeTextGenderNeutral(workoutName);
  }

  return adaptBasicTextToGender(workoutName, gender);
};

/**
 * מקבל שם אימון ומחזיר את האינדקס שלו ברשימה השבועית עם תמיכה בהתאמת מגדר
 * Gets workout name and returns its index in the weekly list with gender adaptation support
 */
export const getWorkoutIndexByName = (
  workoutName: string,
  weeklyPlan: string[],
  userGender?: "male" | "female" | "other"
): number => {
  // אם יש מגדר, נתאים את שם האימון
  const adaptedWorkoutName = userGender
    ? adaptWorkoutNameToGender(workoutName, userGender)
    : workoutName;

  // חיפוש ישיר לפי שם מותאם
  const directIndex = weeklyPlan.findIndex(
    (name) => name === adaptedWorkoutName || name === workoutName
  );
  if (directIndex !== -1) {
    return directIndex;
  }

  // חיפוש לפי מילות מפתח מורחב
  const keywordMaps = [
    {
      keywords: ["דחיפה", "פלג גוף עליון", "חזה", "מתקדם", "מתקדמת"],
      index: 0,
    },
    {
      keywords: ["משיכה", "פלג גוף תחתון", "גב", "מתקדם", "מתקדמת"],
      index: 1,
    },
    {
      keywords: ["רגליים", "רגלים"],
      index: 2,
    },
    {
      keywords: ["כתפיים", "טריצפס", "כתף"],
      index: 3,
    },
    {
      keywords: ["ידיים", "ביצפס", "בטן", "יד"],
      index: 4,
    },
    {
      keywords: ["קרדיו", "אירובי"],
      index: 5,
    },
  ];

  for (const map of keywordMaps) {
    if (
      map.keywords.some(
        (keyword) =>
          workoutName.includes(keyword) || adaptedWorkoutName.includes(keyword)
      )
    ) {
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
    `⚠️ Could not find index for workout: "${workoutName}" (adapted: "${adaptedWorkoutName}") in plan:`,
    weeklyPlan
  );
  return 0; // ברירת מחדל
};

/**
 * בדיקת תקינות - האם השמות בהוק תואמים לשמות בWorkoutPlansScreen
 * Validation check - do hook names match WorkoutPlansScreen names
 */
export const validateWorkoutNamesSync = (
  userGender?: "male" | "female" | "other"
) => {

  if (userGender) {
    console.log(`👤 User gender: ${userGender}`);
  }

  Object.entries(WORKOUT_DAYS_NAMES).forEach(([days, names]) => {
    console.log(`📅 ${days} days per week:`);
    names.forEach((name, index) => {
      const adaptedName = userGender
        ? adaptWorkoutNameToGender(name, userGender)
        : name;

      if (adaptedName !== name) {
        console.log(
          `  ${index + 1}. ${name} → ${adaptedName} (adapted for ${userGender})`
        );
      } else {
        console.log(`  ${index + 1}. ${name}`);
      }
    });
  });

  console.log("✅ Workout names validation complete");
};

/**
 * פונקציות חדשות לתמיכה במערכת השאלון החכם
 * New functions for smart questionnaire system support
 */

/**
 * קבלת תוכנית אימונים מותאמת למגדר
 * Get gender-adapted workout plan
 */
export const getGenderAdaptedWorkoutPlan = (
  daysPerWeek: number,
  userGender: "male" | "female" | "other"
): string[] => {
  const basePlan =
    WORKOUT_DAYS_NAMES[daysPerWeek as keyof typeof WORKOUT_DAYS_NAMES];

  if (!basePlan) {
    console.warn(`⚠️ No workout plan found for ${daysPerWeek} days per week`);
    return [];
  }

  return basePlan.map((workoutName) =>
    adaptWorkoutNameToGender(workoutName, userGender)
  );
};

/**
 * בדיקה אם שם אימון חוקי ומותאם
 * Check if workout name is valid and adapted
 */
export const isValidWorkoutName = (
  workoutName: string,
  daysPerWeek: number,
  userGender?: "male" | "female" | "other"
): boolean => {
  const basePlan =
    WORKOUT_DAYS_NAMES[daysPerWeek as keyof typeof WORKOUT_DAYS_NAMES];

  if (!basePlan) return false;

  // בדיקה ישירה
  if (basePlan.includes(workoutName)) return true;

  // בדיקה עם התאמת מגדר
  if (userGender) {
    const adaptedPlan = getGenderAdaptedWorkoutPlan(daysPerWeek, userGender);
    if (adaptedPlan.includes(workoutName)) return true;

    // בדיקה אם זה שם בסיסי שיכול להיות מותאם
    return basePlan.some(
      (baseName) =>
        adaptWorkoutNameToGender(baseName, userGender) === workoutName
    );
  }

  return false;
};

/**
 * קבלת כל הוריאציות האפשריות לשם אימון
 * Get all possible variations for a workout name
 */
export const getWorkoutNameVariations = (workoutName: string): string[] => {
  const variations = [workoutName];

  // הוספת וריאציות מגדר אם קיימות
  if (WORKOUT_NAMES_WITH_GENDER[workoutName]) {
    const genderVars = WORKOUT_NAMES_WITH_GENDER[workoutName];
    variations.push(genderVars.male, genderVars.female, genderVars.neutral);
  }

  // הוספת וריאציות באמצעות rtlHelpers
  try {
    variations.push(
      adaptBasicTextToGender(workoutName, "male"),
      adaptBasicTextToGender(workoutName, "female"),
      makeTextGenderNeutral(workoutName)
    );
  } catch (error) {
    console.warn("Error generating text variations:", error);
  }

  // הסרת כפילויות
  return [...new Set(variations)];
};

/**
 * חיפוש חכם של שם אימון עם תמיכה בטעויות כתיב
 * Smart workout name search with typo tolerance
 */
export const findWorkoutNameWithTolerance = (
  searchTerm: string,
  daysPerWeek: number,
  userGender?: "male" | "female" | "other"
): string | null => {
  const basePlan =
    WORKOUT_DAYS_NAMES[daysPerWeek as keyof typeof WORKOUT_DAYS_NAMES];

  if (!basePlan) return null;

  // חיפוש מדויק
  const exactMatch = basePlan.find((name) => name === searchTerm);
  if (exactMatch) return exactMatch;

  // חיפוש עם התאמת מגדר
  if (userGender) {
    const adaptedPlan = getGenderAdaptedWorkoutPlan(daysPerWeek, userGender);
    const genderMatch = adaptedPlan.find((name) => name === searchTerm);
    if (genderMatch) return genderMatch;
  }

  // חיפוש עם סובלנות (חלקי)
  const partialMatch = basePlan.find(
    (name) => name.includes(searchTerm) || searchTerm.includes(name)
  );
  if (partialMatch) return partialMatch;

  // חיפוש לפי מילות מפתח
  const keywordMatch = basePlan.find((name) => {
    const nameWords = name.split(" ");
    const searchWords = searchTerm.split(" ");
    return nameWords.some((word) =>
      searchWords.some(
        (searchWord) => word.includes(searchWord) || searchWord.includes(word)
      )
    );
  });

  return keywordMatch || null;
};
