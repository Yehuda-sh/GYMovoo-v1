/**
 * @file src/utils/workoutNamesSync.example.ts
 * @brief דוגמאות שימוש בכלי סנכרון שמות אימונים משודרגים | Examples using improved workout names sync utilities
 * @created 2025-07-30
 */

import {
  getWorkoutIndexByName,
  adaptWorkoutNameToGender,
  getGenderAdaptedWorkoutPlan,
  isValidWorkoutName,
  getWorkoutNameVariations,
  findWorkoutNameWithTolerance,
  validateWorkoutNamesSync,
} from "./workoutNamesSync";

// ===== דוגמאות לשימוש בפונקציות החדשות =====

/**
 * דוגמה לחיפוש אימון עם התאמת מגדר
 */
export const ExampleGenderAdaptedWorkoutSearch = () => {
  console.log("=== חיפוש אימון עם התאמת מגדר ===");

  const workoutName = "פלג גוף עליון";
  const weeklyPlan = ["פלג גוף עליון", "פלג גוף תחתון"];
  const userGender: "male" | "female" | "other" = "female";

  // התאמת שם אימון למגדר
  const adaptedName = adaptWorkoutNameToGender(workoutName, userGender);
  console.log(`🏋️ Original: ${workoutName}`);
  console.log(`👤 Adapted for ${userGender}: ${adaptedName}`);

  // חיפוש אינדקס עם התאמה
  const index = getWorkoutIndexByName(workoutName, weeklyPlan, userGender);
  console.log(`📍 Index in plan: ${index}`);
};

/**
 * דוגמה לקבלת תוכנית אימונים מותאמת
 */
export const ExampleGenderAdaptedWorkoutPlan = () => {
  console.log("=== תוכנית אימונים מותאמת למגדר ===");

  const daysPerWeek = 3;
  const userGender: "male" | "female" | "other" = "male";

  const adaptedPlan = getGenderAdaptedWorkoutPlan(daysPerWeek, userGender);

  console.log(`📅 Plan for ${daysPerWeek} days/week (${userGender}):`);
  adaptedPlan.forEach((workout, index) => {
    console.log(`  Day ${index + 1}: ${workout}`);
  });
};

/**
 * דוגמה לוולידציה של שמות אימונים
 */
export const ExampleWorkoutNameValidation = () => {
  console.log("=== וולידציה של שמות אימונים ===");

  const testCases = [
    { name: "אימון מלא", days: 1, gender: "male" as const },
    { name: "פלג גוף עליון מתקדמת", days: 2, gender: "female" as const },
    { name: "אימון לא קיים", days: 3, gender: "other" as const },
  ];

  testCases.forEach(({ name, days, gender }) => {
    const isValid = isValidWorkoutName(name, days, gender);
    console.log(
      `${isValid ? "✅" : "❌"} "${name}" (${days} days, ${gender}): ${isValid}`
    );
  });
};

/**
 * דוגמה לקבלת וריאציות שם אימון
 */
export const ExampleWorkoutNameVariations = () => {
  console.log("=== וריאציות שמות אימונים ===");

  const workoutName = "פלג גוף עליון";
  const variations = getWorkoutNameVariations(workoutName);

  console.log(`🔄 Variations for "${workoutName}":`);
  variations.forEach((variation, index) => {
    console.log(`  ${index + 1}. ${variation}`);
  });
};

/**
 * דוגמה לחיפוש חכם עם סובלנות לטעויות
 */
export const ExampleSmartWorkoutSearch = () => {
  console.log("=== חיפוש חכם עם סובלנות לטעויות ===");

  const testSearches = [
    "פלג עליון", // חלקי
    "גוף עליון", // חלקי
    "דחיפה", // מדויק
    "אימון לא קיים", // לא קיים
  ];

  const daysPerWeek = 3;
  const userGender: "male" | "female" | "other" = "female";

  testSearches.forEach((searchTerm) => {
    const result = findWorkoutNameWithTolerance(
      searchTerm,
      daysPerWeek,
      userGender
    );
    console.log(`🔍 Search: "${searchTerm}" → ${result || "Not found"}`);
  });
};

/**
 * דוגמה לוולידציה מלאה של המערכת
 */
export const ExampleFullSystemValidation = () => {
  console.log("=== וולידציה מלאה של מערכת שמות אימונים ===");

  // וולידציה בסיסית
  validateWorkoutNamesSync();

  console.log("\n--- וולידציה עם מגדר ---");

  // וולידציה עם כל סוגי המגדר
  const genders: ("male" | "female" | "other")[] = ["male", "female", "other"];

  genders.forEach((gender) => {
    console.log(`\n👤 Gender: ${gender}`);
    validateWorkoutNamesSync(gender);
  });
};

/**
 * דוגמה לאינטגרציה עם השאלון החכם
 */
export const ExampleSmartQuestionnaireIntegration = () => {
  console.log("=== אינטגרציה עם השאלון החכם ===");

  // סימולציה של נתוני שאלון
  const questionnaireData = {
    gender: "female" as const,
    workoutDays: 4,
    selectedWorkouts: ["חזה + טריצפס", "גב + ביצפס"],
  };

  console.log("📋 Questionnaire data:", questionnaireData);

  // קבלת תוכנית מותאמת
  const adaptedPlan = getGenderAdaptedWorkoutPlan(
    questionnaireData.workoutDays,
    questionnaireData.gender
  );

  console.log("📅 Adapted workout plan:");
  adaptedPlan.forEach((workout, index) => {
    console.log(`  Day ${index + 1}: ${workout}`);
  });

  // וולידציה של בחירות המשתמש
  console.log("\n🔍 Validating user selections:");
  questionnaireData.selectedWorkouts.forEach((workout) => {
    const isValid = isValidWorkoutName(
      workout,
      questionnaireData.workoutDays,
      questionnaireData.gender
    );
    console.log(`${isValid ? "✅" : "❌"} "${workout}": ${isValid}`);
  });
};

/**
 * דוגמה למעקב ולוגינג מתקדם
 */
export const ExampleAdvancedLoggingIntegration = () => {
  console.log("=== לוגינג מתקדם למעקב אחרי שימוש ===");

  const logWorkoutSelection = (
    workoutName: string,
    userGender: "male" | "female" | "other",
    daysPerWeek: number
  ) => {
    const adaptedName = adaptWorkoutNameToGender(workoutName, userGender);
    const isValid = isValidWorkoutName(workoutName, daysPerWeek, userGender);
    const variations = getWorkoutNameVariations(workoutName);

    console.log(`📊 Workout Selection Log:`);
    console.log(`  Original: ${workoutName}`);
    console.log(`  Adapted: ${adaptedName}`);
    console.log(`  Valid: ${isValid}`);
    console.log(`  Gender: ${userGender}`);
    console.log(`  Days/week: ${daysPerWeek}`);
    console.log(`  Available variations: ${variations.length}`);

    if (!isValid) {
      const suggestion = findWorkoutNameWithTolerance(
        workoutName,
        daysPerWeek,
        userGender
      );
      console.log(`  💡 Suggestion: ${suggestion || "None"}`);
    }
  };

  // דוגמאות לוגינג
  logWorkoutSelection("פלג גוף עליון", "female", 2);
  logWorkoutSelection("אימון לא מוכר", "male", 3);
};
