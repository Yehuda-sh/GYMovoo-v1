// src/constants/equipmentTranslations.ts
/**
 * @file מסמך תרגום מרכזי לציוד כושר
 * @description מיפוי מאנגלית לעברית לכל הציוד במערכת
 * משתמש במיפוי הקיים מ-questionnaire.ts ומרכז הכל במקום אחד
 */

import type { EquipmentType } from "../services/workout/types/questionnaire";

// ================== תרגום ציוד בסיסי ==================

/**
 * מיפוי מקודי ציוד באנגלית לתרגום עברי
 * משתמש בפורמט עקבי לכל המערכת
 */
export const EQUIPMENT_TRANSLATIONS: Record<string, string> = {
  // ציוד בסיסי
  bodyweight: "משקל גוף",
  bodyweight_only: "משקל גוף בלבד",

  // ציוד ביתי בסיסי
  mat_available: "מזרון זמין",
  chair_available: "כיסא זמין",
  wall_space: "מקום קיר",
  stairs_available: "מדרגות זמינות",
  water_bottles: "בקבוקי מים",

  // ציוד מקצועי - פורמט עקבי
  dumbbells: "משקולות יד",
  yogaMat: "מזרון יוגה",
  yoga_mat: "מזרון יוגה",
  resistanceBands: "גומיות התנגדות",
  resistance_bands: "גומיות התנגדות",
  jumpRope: "חבל קפיצה",
  jump_rope: "חבל קפיצה",
  pullupBar: "מתקן מתח",
  pullup_bar: "מתקן מתח",
  pull_up_bar: "מתקן מתח",
  barbell: "מוט משקולות",
  barbells: "מוטות משקולות",
  kettlebell: "קטלבל",
  kettlebells: "קטלבלים",

  // ציוד מתקדם
  exercise_ball: "כדור פיטנס",
  stability_ball: "כדור יציבות",
  medicine_ball: "כדור רפואי",
  trx: "רצועות TRX",
  foam_roller: "רולר עיסוי",

  // ציוד חדר כושר
  free_weights: "משקולות חופשיות",
  cable_machine: "מכונת כבלים",
  cables: "כבלים",
  machines: "מכונות",
  squat_rack: "מתקן סקוואט",
  bench_press: "ספסל דחיפה",
  leg_press: "מכונת לחיצת רגליים",
  chest_press: "מכונת לחיצת חזה",
  lat_pulldown: "מכונת משיכת גב",
  preacher_curl: "מכונת כפיפת זרועות",
  smith_machine: "מכונת סמית",

  // קרדיו
  treadmill: "הליכון",
  bike: "אופניים",
  rowing_machine: "מכונת חתירה",
};

// ================== תרגום טיפוסי ציוד ==================

/**
 * תרגום טיפוסי ציוד מהמערכת הפנימית
 * מתואם עם questionnaire.ts
 */
export const EQUIPMENT_TYPE_TRANSLATIONS: Record<EquipmentType, string> = {
  bodyweight: "משקל גוף",
  dumbbells: "משקולות יד",
  resistance_bands: "גומיות התנגדות",
  kettlebells: "קטלבלים",
  yoga_mat: "מזרון יוגה",
  pull_up_bar: "מתקן מתח",
  barbells: "מוטות משקולות",
  machines: "מכונות",
  cables: "כבלים",
  trx: "TRX",
  medicine_ball: "כדור רפואי",
  stability_ball: "כדור יציבות",
  foam_roller: "רולר עיסוי",
};

// ================== פונקציות עזר ==================

/**
 * מחזיר תרגום לעברית של ציוד
 * @param equipmentId - מזהה הציוד באנגלית
 * @returns התרגום לעברית או הערך המקורי אם לא נמצא
 */
export const translateEquipment = (equipmentId: string): string => {
  return EQUIPMENT_TRANSLATIONS[equipmentId] || equipmentId;
};

/**
 * מחזיר תרגום של רשימת ציוד
 * @param equipmentList - רשימת ציוד באנגלית
 * @returns רשימת ציוד בעברית
 */
export const translateEquipmentList = (equipmentList: string[]): string[] => {
  return equipmentList.map(translateEquipment);
};

/**
 * מחזיר תרגום של טיפוס ציוד
 * @param equipmentType - טיפוס הציוד
 * @returns התרגום לעברית
 */
export const translateEquipmentType = (
  equipmentType: EquipmentType
): string => {
  return EQUIPMENT_TYPE_TRANSLATIONS[equipmentType] || equipmentType;
};

// ================== תצוגה מפורמטת ==================

/**
 * מפרמט רשימת ציוד לתצוגה עם פסיקים
 * @param equipmentList - רשימת ציוד באנגלית
 * @returns מחרוזת מפורמטת בעברית
 */
export const formatEquipmentDisplay = (equipmentList: string[]): string => {
  if (!equipmentList || equipmentList.length === 0) {
    return "משקל גוף";
  }

  const translated = translateEquipmentList(equipmentList);
  return translated.join(", ");
};
