/**
 * Equipment to icons mapping and Hebrew names
 */

// Equipment to MaterialCommunityIcons mapping
export const EQUIPMENT_ICON_MAP: Record<string, string> = {
  // Basic equipment
  none: "human",
  bodyweight: "human",

  // Weights
  dumbbells: "dumbbell",
  dumbbell: "dumbbell",
  barbell: "barbell",
  kettlebell: "kettle",
  free_weights: "weight",

  // Bands and ropes
  resistance_bands: "resistor",
  resistance_band: "resistor",
  trx: "power-socket",

  // Gym machines
  cable_machine: "cable-data",
  smith_machine: "office-building",
  leg_press: "car-seat",
  lat_pulldown: "arrow-down-thick",
  chest_press: "arrow-expand-horizontal",
  rowing_machine: "rowing",

  // Cardio
  treadmill: "run",
  bike: "bike",
  elliptical: "bike-fast",

  // Accessories
  yoga_mat: "meditation",
  foam_roller: "cylinder",
  exercise_ball: "circle",
  medicine_ball: "basketball",
  pullup_bar: "minus",

  // Additional equipment
  bench: "table-chair",
  bench_press: "table-chair",
  squat_rack: "gate",
  preacher_curl: "chair-school",

  // Default
  default: "help-circle-outline",
};

// Equipment Hebrew names
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
  bench: "ספסל",
  bench_press: "ספסל",
  squat_rack: "מתקן סקוואט",
  preacher_curl: "ספסל כיפופים",
};

/**
 * Normalize equipment name for lookup
 */
function normalizeEquipmentName(equipment: string): string {
  if (!equipment) return "";
  return equipment.toLowerCase().trim().replace(/\s+/g, "_");
}

/**
 * Get icon for equipment
 */
export function getEquipmentIcon(equipment: string): string {
  const normalized = normalizeEquipmentName(equipment);
  return EQUIPMENT_ICON_MAP[normalized] || EQUIPMENT_ICON_MAP.default;
}

/**
 * Get Hebrew name for equipment
 */
export function getEquipmentHebrewName(equipment: string): string {
  const normalized = normalizeEquipmentName(equipment);
  return EQUIPMENT_HEBREW_NAMES[normalized] || equipment;
}
