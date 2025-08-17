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
  barbell: "barbell",
  kettlebell: "kettle",
  free_weights: "weight",

  // גומיות וחבלים / Bands and ropes
  resistance_bands: "resistor",
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

  // ברירת מחדל / Default
  default: "help-circle-outline",
};

// מיפוי לשמות בעברית
export const EQUIPMENT_HEBREW_NAMES: Record<string, string> = {
  none: "ללא ציוד",
  bodyweight: "משקל גוף",
  dumbbells: "דמבלים",
  barbell: "ברבל",
  kettlebell: "קטלבל",
  free_weights: "משקולות חופשיות",
  resistance_bands: "גומיות התנגדות",
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
};

/**
 * אליאסים → מפתח קנוני (כדי למנוע הכפלת לוגיקה).
 * שמרנו גם את המפתחות האלטרנטיביים במפות המקור (לא שוברים קוד ישן),
 * אבל מעתה ננרמל דרך מיפוי זה. ניתן להרחיב כאן בעתיד במקום לשכפל.
 */
const EQUIPMENT_ALIASES: Record<string, string> = {
  dumbbell: "dumbbells", // מאחד יחיד לרבים
  resistance_band: "resistance_bands",
  bench_press: "bench",
};

/**
 * נרמול מפתח ציוד: lowercase, רווחים → _, הסרת תווים לא אלפא-נומריים בסיסיים,
 * טיפול בסיומת s (רבים) אם לא נמצא, ופתרון אליאסים.
 */
function normalizeEquipmentKey(raw: string): string {
  if (!raw) return "";
  const base = raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  // אליאס מפורש
  if (EQUIPMENT_ALIASES[base]) return EQUIPMENT_ALIASES[base];
  // אם לא נמצא והמילה ברבים קיימת – הפניה
  if (!EQUIPMENT_ICON_MAP[base] && base.endsWith("s")) {
    const singular = base.slice(0, -1);
    if (EQUIPMENT_ICON_MAP[singular]) return singular;
  }
  return base;
}

/**
 * איתור כפילויות (אותו אייקון למספר מפתחות) – כלי עזר לדיבוג / בדיקות.
 */
export function findDuplicateIconMappings(): Record<string, string[]> {
  const reverse: Record<string, string[]> = {};
  Object.entries(EQUIPMENT_ICON_MAP).forEach(([k, icon]) => {
    reverse[icon] = reverse[icon] ? [...reverse[icon], k] : [k];
  });
  const dups: Record<string, string[]> = {};
  Object.entries(reverse).forEach(([icon, keys]) => {
    if (keys.length > 1) dups[icon] = keys;
  });
  return dups;
}

/**
 * קבלת אייקון לציוד מסוים
 * Get icon for specific equipment
 */
export function getEquipmentIcon(equipment: string): string {
  const key = normalizeEquipmentKey(equipment);
  if (EQUIPMENT_ICON_MAP[key]) return EQUIPMENT_ICON_MAP[key];

  // fallback חיפוש חלקי (נשמר מההתנהגות הקודמת – יעיל למקרי ספיח)
  const partial = Object.keys(EQUIPMENT_ICON_MAP).find(
    (k) => key && (key.includes(k) || k.includes(key))
  );
  if (partial) return EQUIPMENT_ICON_MAP[partial];
  return EQUIPMENT_ICON_MAP.default;
}

/**
 * קבלת שם הציוד בעברית
 * Get equipment name in Hebrew
 */
export function getEquipmentHebrewName(equipment: string): string {
  const key = normalizeEquipmentKey(equipment);
  return EQUIPMENT_HEBREW_NAMES[key] || equipment;
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
  const key = normalizeEquipmentKey(equipment);
  return key in EQUIPMENT_ICON_MAP;
}
