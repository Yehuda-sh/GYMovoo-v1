/**
 * @file src/services/workout/types/questionnaire.ts
 * @description ממשקים מאוחדים וברורים לשאלון ולתשובות
 */

// ================ ממשקי ציוד ================

/**
 * טיפוסי ציוד שמועברים למערכת האימונים
 */
export type EquipmentType =
  | "bodyweight"
  | "dumbbells"
  | "resistance_bands"
  | "kettlebells"
  | "yoga_mat"
  | "pull_up_bar"
  | "barbells"
  | "machines"
  | "cables"
  | "trx"
  | "medicine_ball"
  | "stability_ball"
  | "foam_roller";

/**
 * ציוד שנבחר בשאלון
 */
export interface SelectedEquipment {
  bodyweight_items: string[]; // חפצים ביתיים
  home_equipment: string[]; // ציוד ביתי מקצועי
  gym_equipment: string[]; // ציוד חדר כושר
}

// ================ ממשקי תשובות השאלון ================

/**
 * תשובות השאלון - גרסה מאוחדת וברורה
 */
export interface UnifiedQuestionnaireAnswers {
  // פרטים אישיים
  gender?: string;
  age?: string;
  weight?: string;
  height?: string;

  // יעדי כושר
  fitness_goal?: string[];
  experience_level?: string;

  // זמינות ומיקום
  availability?: string;
  workout_duration?: string;
  workout_location?: string;

  // ציוד - זה החלק החשוב!
  equipment: SelectedEquipment;

  // תזונה
  diet_preferences?: string;
}

// ================ פונקציות מיפוי ציוד ================

/**
 * מיפוי מבחירות השאלון לטיפוסי ציוד של המערכת
 */
export const EQUIPMENT_MAPPING: Record<string, EquipmentType[]> = {
  // חפצים ביתיים -> bodyweight
  bodyweight_only: ["bodyweight"],
  mat_available: ["yoga_mat", "bodyweight"],
  chair_available: ["bodyweight"],
  wall_space: ["bodyweight"],
  stairs_available: ["bodyweight"],
  water_bottles: ["bodyweight"],

  // ציוד ביתי מקצועי
  dumbbells: ["dumbbells"],
  resistance_bands: ["resistance_bands"],
  kettlebell: ["kettlebells"],
  yoga_mat: ["yoga_mat"],
  pullup_bar: ["pull_up_bar"],
  exercise_ball: ["stability_ball"],
  trx: ["trx"],

  // ציוד חדר כושר
  free_weights: ["dumbbells", "barbells"],
  cable_machine: ["cables"],
  squat_rack: ["barbells"],
  bench_press: ["barbells", "machines"],
  leg_press: ["machines"],
  lat_pulldown: ["machines"],
  rowing_machine: ["machines"],
  treadmill: ["machines"],
  bike: ["machines"],
};

/**
 * פונקציה שמתרגמת בחירות משתמש לטיפוסי ציוד
 */
export function mapSelectedEquipmentToTypes(
  selected: SelectedEquipment
): EquipmentType[] {
  const equipmentTypes = new Set<EquipmentType>();

  // תמיד נוסיף bodyweight כברירת מחדל
  equipmentTypes.add("bodyweight");

  // עבור כל קטגוריה של ציוד
  const allSelectedItems = [
    ...selected.bodyweight_items,
    ...selected.home_equipment,
    ...selected.gym_equipment,
  ];

  // מיפוי כל פריט שנבחר לטיפוסי ציוד
  allSelectedItems.forEach((item) => {
    const mappedTypes = EQUIPMENT_MAPPING[item];
    if (mappedTypes) {
      mappedTypes.forEach((type) => equipmentTypes.add(type));
    } else {
      console.warn(`⚠️ Unknown equipment item: ${item}`);
    }
  });

  return Array.from(equipmentTypes);
}

/**
 * פונקציה שבודקת אם ציוד מסוים זמין
 */
export function isEquipmentAvailable(
  equipmentTypes: EquipmentType[],
  requiredEquipment: EquipmentType
): boolean {
  return equipmentTypes.includes(requiredEquipment);
}

/**
 * פונקציה שמחזירה רשימת ציוד בפורמט מתאים לבדיקות
 */
export function getEquipmentDisplayNames(
  equipmentTypes: EquipmentType[]
): string[] {
  const displayNames: Record<EquipmentType, string> = {
    bodyweight: "משקל גוף",
    dumbbells: "משקולות יד",
    resistance_bands: "גומיות התנגדות",
    kettlebells: "קטלבל",
    yoga_mat: "מזרון יוגה",
    pull_up_bar: "מתקן מתח",
    barbells: "מוטות",
    machines: "מכונות",
    cables: "כבלים",
    trx: "TRX",
    medicine_ball: "כדור רפואי",
    stability_ball: "כדור פיזיו",
    foam_roller: "רולר",
  };

  return equipmentTypes.map((type) => displayNames[type] || type);
}
