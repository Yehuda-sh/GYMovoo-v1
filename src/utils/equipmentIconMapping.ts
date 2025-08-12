/**
 * @file src/utils/equipmentIconMapping.ts
 * @description מיפוי בין סוגי ציוד לאייקונים של MaterialCommunityIcons ושמות בעברית
 * Equipment to icons mapping and Hebrew names for MaterialCommunityIcons
 */

// מיפוי מקיף בין ציוד לאייקונים
export const EQUIPMENT_ICON_MAP: Record<string, string> = {
  // ציוד בסיסי / Basic equipment
  none: "human",
  bodyweight: "human",

  // משקולות / Weights
  dumbbells: "dumbbell",
  dumbbell: "dumbbell",
  barbell: "barbell",
  kettlebell: "kettle",
  free_weights: "weight",

  // גומיות וחבלים / Bands and ropes
  resistance_bands: "resistor",
  resistance_band: "resistor",
  trx: "power-socket",

  // מכונות חדר כושר / Gym machines
  cable_machine: "cable-data",
  smith_machine: "office-building",
  leg_press: "car-seat",
  lat_pulldown: "arrow-down-thick",
  chest_press: "arrow-expand-horizontal",
  rowing_machine: "rowing",

  // קרדיו / Cardio
  treadmill: "run",
  bike: "bike",
  elliptical: "bike-fast",

  // אביזרים / Accessories
  yoga_mat: "meditation",
  foam_roller: "cylinder",
  exercise_ball: "circle",
  medicine_ball: "basketball",
  pullup_bar: "minus",

  // ציוד מאולתר / Improvised equipment
  water_bottles: "bottle-water",
  water_gallon: "cup-water",
  sandbag: "bag-personal",
  tire: "tire",
  backpack_heavy: "backpack",

  // ציוד נוסף / Additional equipment
  bench: "table-chair",
  squat_rack: "gate",
  preacher_curl: "chair-school",
  // אליאס תואם לשאלון המאוחד
  bench_press: "table-chair",

  // ברירת מחדל / Default
  default: "help-circle-outline",
};

// מיפוי לשמות בעברית
export const EQUIPMENT_HEBREW_NAMES: Record<string, string> = {
  none: "ללא ציוד",
  bodyweight: "משקל גוף",
  dumbbells: "דמבלים",
  dumbbell: "דמבלים",
  barbell: "ברבל",
  kettlebell: "קטלבל",
  free_weights: "משקולות חופשיות",
  resistance_bands: "גומיות התנגדות",
  resistance_band: "גומיות התנגדות",
  trx: "רצועות TRX",
  cable_machine: "מכונת כבלים",
  smith_machine: "מכונת סמית",
  leg_press: "מכבש רגליים",
  lat_pulldown: "מכונת לאט",
  chest_press: "מכבש חזה",
  rowing_machine: "מכונת חתירה",
  treadmill: "הליכון",
  bike: "אופניים",
  elliptical: "אליפטיקל",
  yoga_mat: "מזרון יוגה",
  foam_roller: "גליל קצף",
  exercise_ball: "כדור פיטנס",
  medicine_ball: "כדור רפואי",
  pullup_bar: "מתקן מתח",
  water_bottles: "בקבוקי מים",
  water_gallon: "כד מים",
  sandbag: "שק חול",
  tire: "צמיג",
  backpack_heavy: "תיק כבד",
  bench: "ספסל",
  squat_rack: "מתקן סקוואט",
  preacher_curl: "ספסל כיפופים",
  // אליאס תואם לשאלון המאוחד
  bench_press: "ספסל דחיפה",
};

/**
 * קבלת אייקון לציוד מסוים
 * Get icon for specific equipment
 */
export function getEquipmentIcon(equipment: string): string {
  // נרמל את השם (הורד רווחים, הפוך לאותיות קטנות)
  const normalizedEquipment =
    equipment?.toLowerCase()?.replace(/\s+/g, "_") || "";

  // חיפוש ישיר
  if (EQUIPMENT_ICON_MAP[normalizedEquipment]) {
    return EQUIPMENT_ICON_MAP[normalizedEquipment];
  }

  // חיפוש חלקי לכיסוי מקרי קצה
  const partialMatch = Object.keys(EQUIPMENT_ICON_MAP).find(
    (key) =>
      normalizedEquipment.includes(key) || key.includes(normalizedEquipment)
  );

  if (partialMatch) {
    return EQUIPMENT_ICON_MAP[partialMatch];
  }

  // ברירת מחדל
  return EQUIPMENT_ICON_MAP.default;
}

/**
 * קבלת שם הציוד בעברית
 * Get equipment name in Hebrew
 */
export function getEquipmentHebrewName(equipment: string): string {
  const normalizedEquipment =
    equipment?.toLowerCase()?.replace(/\s+/g, "_") || "";
  return EQUIPMENT_HEBREW_NAMES[normalizedEquipment] || equipment;
}

/**
 * קבלת כל האייקונים הזמינים
 * Get all available icons
 */
export function getAllEquipmentIcons(): Record<string, string> {
  return { ...EQUIPMENT_ICON_MAP };
}

/**
 * בדיקה אם קיים אייקון לציוד
 * Check if icon exists for equipment
 */
export function hasEquipmentIcon(equipment: string): boolean {
  const normalizedEquipment =
    equipment?.toLowerCase()?.replace(/\s+/g, "_") || "";
  return normalizedEquipment in EQUIPMENT_ICON_MAP;
}
