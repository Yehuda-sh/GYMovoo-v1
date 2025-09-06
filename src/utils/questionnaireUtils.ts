/**
 * @file src/utils/questionnaireUtils.ts
 * @description יוטיליטיז לטיפול בשאלונים ואימות נתונים אישיים - Questionnaire & Personal Data Utilities
 */

import { User } from "../types";
import { fieldMapper } from "./fieldMapper";
import { PersonalData } from "./personalDataUtils";

// ===============================================
// 📊 Configuration & Constants - הגדרות וקבועים
// ===============================================

/** הגדרות validation וטווחים */
interface ValidationConfig {
  age: { min: number; max: number };
  weight: { min: number; max: number };
  height: { min: number; max: number };
}

/** קונפיגורציה לטווחי הנתונים */
interface RangeConfig {
  boundaries: number[];
  labels: string[];
}

/** הגדרות ברירת מחדל לאימות */
const VALIDATION_CONFIG: ValidationConfig = {
  age: { min: 15, max: 100 },
  weight: { min: 40, max: 200 },
  height: { min: 140, max: 220 },
};

/** טווחי גיל מותאמים */
const AGE_RANGES: RangeConfig = {
  boundaries: [25, 35, 45, 55, 65],
  labels: ["18_24", "25_34", "35_44", "45_54", "55_64", "65_plus"],
};

/** טווחי משקל מותאמים */
const WEIGHT_RANGES: RangeConfig = {
  boundaries: [60, 70, 80, 90, 100, 110, 120],
  labels: [
    "50_59",
    "60_69",
    "70_79",
    "80_89",
    "90_99",
    "100_109",
    "110_119",
    "120_plus",
  ],
};

/** טווחי גובה מותאמים */
const HEIGHT_RANGES: RangeConfig = {
  boundaries: [160, 170, 180, 190],
  labels: ["150_159", "160_169", "170_179", "180_189", "190_plus"],
};

/** ערכים תקינים לשדות קטגוריאליים */
const VALID_VALUES = {
  gender: new Set(["male", "female"] as const),
  fitnessLevel: new Set(["beginner", "intermediate", "advanced"] as const),
} as const;

// ===============================================
// 🔧 Helper Functions - פונקציות עזר
// ===============================================

/**
 * פונקציה כללית והבטוחה להמרת ערך לטווח
 * @param value הערך לבדיקה
 * @param config קונפיגורציית הטווחים
 * @returns מחרוזת הטווח המתאימה
 */
function getValueRange(value: number, config: RangeConfig): string {
  const { boundaries, labels } = config;

  // Type guard to ensure arrays are not empty
  if (boundaries.length === 0 || labels.length === 0) {
    throw new Error("Invalid range configuration: empty arrays");
  }

  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i];
    const label = labels[i];
    if (boundary !== undefined && label !== undefined && value < boundary) {
      return label;
    }
  }

  return labels[labels.length - 1] || "";
}

/**
 * בדיקת תקינות מספר עם validation מתקדם
 * @param value הערך לבדיקה
 * @param fieldName שם השדה לצורך שגיאה
 * @param min ערך מינימלי
 * @param max ערך מקסימלי
 * @returns המספר הנקי או undefined אם לא תקין
 */
function validateNumericValue(
  value: unknown,
  fieldName: string,
  min: number,
  max: number
): number | undefined {
  const numValue = Number(value);

  if (isNaN(numValue)) {
    console.warn(`Invalid ${fieldName}: ${value} is not a number`);
    return undefined;
  }

  if (numValue < min || numValue > max) {
    console.warn(
      `Invalid ${fieldName}: ${numValue} is out of range [${min}-${max}]`
    );
    return undefined;
  }

  return numValue;
}

/**
 * בדיקת תקינות ערכים קטגוריאליים
 * @param value הערך לבדיקה
 * @param validSet סט הערכים התקינים
 * @param fieldName שם השדה
 * @returns הערך אם תקין או undefined
 */
function validateCategoricalValue<T extends string>(
  value: unknown,
  validSet: Set<T>,
  fieldName: string
): T | undefined {
  const stringValue = String(value) as T;

  if (!validSet.has(stringValue)) {
    console.warn(`Invalid ${fieldName}: ${value} not in allowed values`);
    return undefined;
  }

  return stringValue;
}

// ===============================================
// 🎯 Range Conversion Functions - פונקציות המרת טווחים
// ===============================================

/**
 * המרת גיל לטווח מותאם אישית
 * @param age הגיל במספרים
 * @returns מחרוזת הטווח
 */
export const getAgeRange = (age: number): string =>
  getValueRange(age, AGE_RANGES);

/**
 * המרת משקל לטווח מותאם אישית
 * @param weight המשקל בק"ג
 * @returns מחרוזת הטווח
 */
export const getWeightRange = (weight: number): string =>
  getValueRange(weight, WEIGHT_RANGES);

/**
 * המרת גובה לטווח מותאם אישית
 * @param height הגובה בס"מ
 * @returns מחרוזת הטווח
 */
export const getHeightRange = (height: number): string =>
  getValueRange(height, HEIGHT_RANGES);

// ===============================================
// 🔍 Main Functions - פונקציות ראשיות
// ===============================================

/**
 * חילוץ תשובות שאלון מהמשתמש בצורה בטוחה
 * @param user אובייקט המשתמש
 * @returns התשובות או undefined אם לא קיימות
 */
export function extractSmartAnswers(user: unknown) {
  try {
    return fieldMapper.getSmartAnswers(user);
  } catch (error) {
    console.error("Error extracting smart answers:", error);
    return undefined;
  }
}

/**
 * חילוץ ואימות נתונים אישיים מהמשתמש - מתקדם ובטוח
 * @param user אובייקט המשתמש מה-state
 * @returns נתונים אישיים מאומתים או undefined במקרה של שגיאה
 */
export function getPersonalDataFromUser(
  user: User | null | undefined
): PersonalData | undefined {
  try {
    // חילוץ תשובות בצורה בטוחה
    const answers = extractSmartAnswers(user);
    if (!answers) {
      console.warn("No questionnaire answers found for user");
      return undefined;
    }

    const { gender, age, weight, height, fitnessLevel } = answers;

    // אימות מתקדם עם helper functions
    const validatedGender = validateCategoricalValue(
      gender,
      VALID_VALUES.gender,
      "gender"
    );

    const validatedFitnessLevel = validateCategoricalValue(
      fitnessLevel,
      VALID_VALUES.fitnessLevel,
      "fitnessLevel"
    );

    if (!validatedGender || !validatedFitnessLevel) {
      return undefined;
    }

    // אימות נתונים מספריים עם הגדרות מתקדמות
    const validatedAge = validateNumericValue(
      age,
      "age",
      VALIDATION_CONFIG.age.min,
      VALIDATION_CONFIG.age.max
    );

    const validatedWeight = validateNumericValue(
      weight,
      "weight",
      VALIDATION_CONFIG.weight.min,
      VALIDATION_CONFIG.weight.max
    );

    const validatedHeight = validateNumericValue(
      height,
      "height",
      VALIDATION_CONFIG.height.min,
      VALIDATION_CONFIG.height.max
    );

    if (
      validatedAge === undefined ||
      validatedWeight === undefined ||
      validatedHeight === undefined
    ) {
      return undefined;
    }

    // יצירת אובייקט התוצאה עם המרות טווחים מתקדמות
    const result: PersonalData = {
      gender: validatedGender,
      age: getAgeRange(validatedAge),
      weight: getWeightRange(validatedWeight),
      height: getHeightRange(validatedHeight),
      fitnessLevel: validatedFitnessLevel,
    };

    console.log("Successfully validated personal data for user", {
      originalAge: validatedAge,
      ageRange: result.age,
      originalWeight: validatedWeight,
      weightRange: result.weight,
      originalHeight: validatedHeight,
      heightRange: result.height,
    });

    return result;
  } catch (error) {
    console.error("Error in getPersonalDataFromUser:", error);
    return undefined;
  }
}

// ===============================================
// 🎁 Additional Utility Functions - פונקציות תועלת נוספות
// ===============================================

/**
 * בדיקה האם המשתמש השלים את השאלון
 * @param user אובייקט המשתמש
 * @returns true אם השאלון הושלם
 */
export function isQuestionnaireCompleted(
  user: User | null | undefined
): boolean {
  const personalData = getPersonalDataFromUser(user);
  return personalData !== undefined;
}

/**
 * קבלת רשימת השדות החסרים בשאלון
 * @param user אובייקט המשתמש
 * @returns מערך של שמות השדות החסרים
 */
export function getMissingQuestionnaireFields(
  user: User | null | undefined
): string[] {
  const answers = extractSmartAnswers(user);
  if (!answers) return ["all_fields"];

  const missing: string[] = [];
  const { gender, age, weight, height, fitnessLevel } = answers;

  if (!validateCategoricalValue(gender, VALID_VALUES.gender, "gender")) {
    missing.push("gender");
  }

  if (
    !validateCategoricalValue(
      fitnessLevel,
      VALID_VALUES.fitnessLevel,
      "fitnessLevel"
    )
  ) {
    missing.push("fitnessLevel");
  }

  if (
    !validateNumericValue(
      age,
      "age",
      VALIDATION_CONFIG.age.min,
      VALIDATION_CONFIG.age.max
    )
  ) {
    missing.push("age");
  }

  if (
    !validateNumericValue(
      weight,
      "weight",
      VALIDATION_CONFIG.weight.min,
      VALIDATION_CONFIG.weight.max
    )
  ) {
    missing.push("weight");
  }

  if (
    !validateNumericValue(
      height,
      "height",
      VALIDATION_CONFIG.height.min,
      VALIDATION_CONFIG.height.max
    )
  ) {
    missing.push("height");
  }

  return missing;
}

/**
 * קבלת מידע סטטיסטי על הנתונים האישיים
 * @param personalData הנתונים האישיים המעובדים
 * @returns אובייקט עם מידע סטטיסטי
 */
export function getPersonalDataStats(personalData: PersonalData) {
  return {
    ageCategory: personalData.age,
    weightCategory: personalData.weight,
    heightCategory: personalData.height,
    isBeginner: personalData.fitnessLevel === "beginner",
    isAdvanced: personalData.fitnessLevel === "advanced",
    demographicProfile: `${personalData.gender}_${personalData.age}_${personalData.fitnessLevel}`,
  };
}

/**
 * המרה חזרה מטווח לערך משוער (לצורך חישובים)
 * @param ageRange הטווח גיל
 * @returns ערך גיל משוער באמצע הטווח
 */
export function estimateAgeFromRange(ageRange: string): number {
  const ageMap: Record<string, number> = {
    "18_24": 21,
    "25_34": 29.5,
    "35_44": 39.5,
    "45_54": 49.5,
    "55_64": 59.5,
    "65_plus": 70,
  };

  return ageMap[ageRange] || 30; // Default fallback
}

/**
 * קבלת הגדרות validation נוכחיות
 * @returns אובייקט הגדרות הvalidation
 */
export function getValidationConfig(): ValidationConfig {
  return { ...VALIDATION_CONFIG };
}

/**
 * עדכון הגדרות validation (לשימוש מתקדם)
 * @param newConfig הגדרות חדשות
 */
export function updateValidationConfig(
  newConfig: Partial<ValidationConfig>
): void {
  Object.assign(VALIDATION_CONFIG, newConfig);
}
