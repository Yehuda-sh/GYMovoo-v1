/**
 * @file src/utils/equipmentCatalog.ts
 * @description ניהול ונרמול תגי ציוד, תחליפים ובדיקת זמינות
 * @brief Equipment catalog with normalization, substitutions and availability checks
 */

export type EquipmentTag =
  | "bodyweight"
  | "dumbbell"
  | "barbell"
  | "machine"
  | "kettlebell"
  | "band"
  | "cable"
  | "bench"
  | "pullup_bar"
  | "foam_roller"
  | "yoga_mat"
  | "trx"
  | "squat_rack"
  | "smith_machine"
  | "leg_press"
  | "lat_pulldown"
  | "chest_press"
  | "preacher_curl"
  | "rowing_machine"
  | "treadmill"
  | "bike"
  | "free_weights"
  | "cable_machine"
  | "resistance_bands";

/**
 * מיפוי כינויים וסינונימים לתגים סטנדרטיים
 * Mapping of aliases and synonyms to standard tags
 */
export const EQUIPMENT_SYNONYMS: Record<string, EquipmentTag> = {
  // Dumbbell variations
  db: "dumbbell",
  dumbbells: "dumbbell",
  dumbells: "dumbbell",
  weights: "dumbbell",

  // Barbell variations
  bb: "barbell",
  barbells: "barbell",
  olympic_bar: "barbell",

  // Machine variations
  machines: "machine",
  gym_machine: "machine",
  weight_machine: "machine",

  // Kettlebell variations
  kb: "kettlebell",
  kettlebells: "kettlebell",
  kettle_bell: "kettlebell",

  // Band variations
  bands: "band",
  resistance_band: "band",
  resistance_bands: "resistance_bands",
  elastic_band: "band",
  elastic_bands: "band",

  // Cable variations
  cables: "cable",
  cable_system: "cable",
  pulley: "cable",
  cable_machine: "cable_machine",

  // Bench variations
  workout_bench: "bench",
  weight_bench: "bench",
  exercise_bench: "bench",

  // Pullup bar variations
  pull_up_bar: "pullup_bar",
  pullup: "pullup_bar",
  chin_up_bar: "pullup_bar",

  // Bodyweight variations
  body_weight: "bodyweight",
  no_equipment: "bodyweight",
  none: "bodyweight",

  // Other equipment
  mat: "yoga_mat",
  exercise_mat: "yoga_mat",
  roller: "foam_roller",
  suspension: "trx",
  suspension_trainer: "trx",
  free_weight: "free_weights",
  cardio_machine: "treadmill",
  stationary_bike: "bike",
  exercise_bike: "bike",
};

/**
 * נרמול רשימת ציוד - ניקוי, המרת סינונימים וסינון כפילויות
 * Normalize equipment list - clean, convert synonyms, filter duplicates
 */
export function normalizeEquipment(
  equipment?: string[] | null
): EquipmentTag[] {
  if (!equipment || !Array.isArray(equipment)) {
    return ["bodyweight"]; // Default fallback
  }

  const normalized = new Set<EquipmentTag>();

  // Always include bodyweight as base capability
  normalized.add("bodyweight");

  for (const item of equipment) {
    if (!item || typeof item !== "string") continue;

    const cleaned = item.toLowerCase().trim().replace(/\s+/g, "_");

    // Direct match first
    if (isValidEquipmentTag(cleaned)) {
      normalized.add(cleaned as EquipmentTag);
      continue;
    }

    // Try synonym lookup
    const synonym = EQUIPMENT_SYNONYMS[cleaned];
    if (synonym) {
      normalized.add(synonym);
    }
  }

  return Array.from(normalized);
}

/**
 * בדיקה אם תג הוא ציוד תקני
 * Check if tag is a valid equipment tag
 */
function isValidEquipmentTag(tag: string): boolean {
  const validTags: EquipmentTag[] = [
    "bodyweight",
    "dumbbell",
    "barbell",
    "machine",
    "kettlebell",
    "band",
    "cable",
    "bench",
    "pullup_bar",
    "foam_roller",
    "yoga_mat",
    "trx",
    "squat_rack",
    "smith_machine",
    "leg_press",
    "lat_pulldown",
    "chest_press",
    "preacher_curl",
    "rowing_machine",
    "treadmill",
    "bike",
    "free_weights",
    "cable_machine",
    "resistance_bands",
  ];

  return validTags.includes(tag as EquipmentTag);
}

/**
 * בדיקת זמינות - האם אפשר לבצע תרגיל עם הציוד הזמין
 * Availability check - can perform exercise with available equipment
 */
export function canPerform(
  required: EquipmentTag[],
  owned: EquipmentTag[]
): boolean {
  if (!required || required.length === 0) {
    return true; // No requirements means always available
  }

  if (!owned || owned.length === 0) {
    return required.every((tag) => tag === "bodyweight");
  }

  // Check if all required equipment is available
  return required.every(
    (requiredTag) => owned.includes(requiredTag) || requiredTag === "bodyweight" // Bodyweight is always available
  );
}

/**
 * סדר עדיפויות לתחליפי ציוד
 * Priority order for equipment substitutions
 */
export const SUBSTITUTIONS: Record<EquipmentTag, EquipmentTag[]> = {
  // Machine alternatives (prefer functional movements)
  machine: ["cable", "free_weights", "dumbbell", "band", "bodyweight"],
  smith_machine: ["barbell", "dumbbell", "bodyweight"],
  leg_press: ["squat_rack", "dumbbell", "bodyweight"],
  lat_pulldown: ["pullup_bar", "cable", "band", "bodyweight"],
  chest_press: ["dumbbell", "barbell", "bench", "bodyweight"],
  preacher_curl: ["dumbbell", "barbell", "cable", "band"],

  // Barbell alternatives
  barbell: ["dumbbell", "kettlebell", "cable", "band", "bodyweight"],

  // Dumbbell alternatives
  dumbbell: ["kettlebell", "band", "cable", "bodyweight"],

  // Cable alternatives
  cable: ["band", "dumbbell", "bodyweight"],
  cable_machine: ["band", "dumbbell", "bodyweight"],

  // Kettlebell alternatives
  kettlebell: ["dumbbell", "band", "bodyweight"],

  // Band alternatives
  band: ["cable", "bodyweight"],
  resistance_bands: ["cable", "bodyweight"],

  // Specialized equipment alternatives
  bench: ["yoga_mat", "bodyweight"],
  pullup_bar: ["band", "cable", "bodyweight"],
  squat_rack: ["dumbbell", "bodyweight"],

  // Cardio equipment alternatives
  treadmill: ["bodyweight"],
  bike: ["bodyweight"],
  rowing_machine: ["cable", "band", "bodyweight"],

  // Accessory equipment alternatives
  foam_roller: ["bodyweight"],
  yoga_mat: ["bodyweight"],
  trx: ["band", "bodyweight"],
  free_weights: ["dumbbell", "bodyweight"],

  // Bodyweight has no substitutes (it's the base)
  bodyweight: [],
};

/**
 * מציאת תחליף זמין לציוד חסר
 * Find available substitute for missing equipment
 */
export function findSubstitute(
  requiredTag: EquipmentTag,
  ownedEquipment: EquipmentTag[]
): EquipmentTag | null {
  const alternatives = SUBSTITUTIONS[requiredTag] || [];

  for (const alternative of alternatives) {
    if (ownedEquipment.includes(alternative)) {
      return alternative;
    }
  }

  // If no substitute found and bodyweight is owned, return it as last resort
  if (ownedEquipment.includes("bodyweight")) {
    return "bodyweight";
  }

  return null;
}

/**
 * בדיקה אם תרגיל ניתן לביצוע או דורש תחליף
 * Check if exercise can be performed or needs substitution
 */
export function getExerciseAvailability(
  exerciseEquipment: EquipmentTag[],
  ownedEquipment: EquipmentTag[]
): {
  canPerform: boolean;
  substitutions?: Partial<Record<EquipmentTag, EquipmentTag>>;
  isFullySupported: boolean;
} {
  if (canPerform(exerciseEquipment, ownedEquipment)) {
    return {
      canPerform: true,
      isFullySupported: true,
    };
  }

  // Try to find substitutions for missing equipment
  const substitutions: Partial<Record<EquipmentTag, EquipmentTag>> = {};
  let hasValidSubstitutes = true;

  for (const requiredTag of exerciseEquipment) {
    if (!ownedEquipment.includes(requiredTag)) {
      const substitute = findSubstitute(requiredTag, ownedEquipment);
      if (substitute) {
        substitutions[requiredTag] = substitute;
      } else {
        hasValidSubstitutes = false;
        break;
      }
    }
  }

  return {
    canPerform: hasValidSubstitutes,
    substitutions:
      Object.keys(substitutions).length > 0 ? substitutions : undefined,
    isFullySupported: false,
  };
}
