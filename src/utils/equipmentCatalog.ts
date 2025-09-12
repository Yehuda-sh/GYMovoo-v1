/**
 * @file src/utils/equipmentCatalog.ts
 * @description ניהול בסיסי של תגי ציוד ובדיקת זמינות
 * @brief Basic equipment management and availability checking
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
  | "free_weights"
  | "resistance_bands";

/**
 * מיפוי כינויים בסיסיים לתגים סטנדרטיים
 * Basic aliases mapping to standard tags
 */
const EQUIPMENT_ALIASES: Record<string, EquipmentTag> = {
  // Common variations only
  dumbbells: "dumbbell",
  weights: "dumbbell",
  barbells: "barbell",
  bands: "band",
  resistance_band: "resistance_bands",
  elastic_band: "band",
  cables: "cable",
  kettlebells: "kettlebell",
  bodyweight: "bodyweight",
  none: "bodyweight",
  mat: "yoga_mat",
  roller: "foam_roller",
};

/**
 * נרמול ציוד בסיסי
 * Basic equipment normalization
 */
export function normalizeEquipment(
  equipment?: string[] | null
): EquipmentTag[] {
  if (!equipment?.length) {
    return ["bodyweight"];
  }

  const normalized = new Set<EquipmentTag>(["bodyweight"]);

  for (const item of equipment) {
    if (!item || typeof item !== "string") continue;

    const cleaned = item.toLowerCase().trim().replace(/\s+/g, "_");

    // Direct match or alias lookup
    const tag = isEquipmentTag(cleaned)
      ? (cleaned as EquipmentTag)
      : EQUIPMENT_ALIASES[cleaned];
    if (tag) {
      normalized.add(tag);
    }
  }

  return Array.from(normalized);
}

/**
 * בדיקה אם תג הוא ציוד תקני
 * Check if tag is valid equipment
 */
function isEquipmentTag(tag: string): boolean {
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
    "free_weights",
    "resistance_bands",
  ];
  return validTags.includes(tag as EquipmentTag);
}
