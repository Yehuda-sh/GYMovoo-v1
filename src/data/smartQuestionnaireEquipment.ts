/**
 * @file src/data/smartQuestionnaireEquipment.ts
 * @brief ציוד לשאלון חכם מסודר לפי קטגוריות
 * @description Equipment for smart questionnaire organized by categories
 */

import { SmartOption } from "./newSmartQuestionnaire";

// ==================== ציוד לאימונים ללא ציוד (חפצים ביתיים) ====================
export const BODYWEIGHT_EQUIPMENT_OPTIONS: SmartOption[] = [
  {
    id: "bodyweight_only",
    label: "רק משקל גוף",
    description: "אין חפצים נוספים",
    image: require("../../assets/bodyweight.png"),
    metadata: { equipment: ["bodyweight"] },
    aiInsight: "הבסיס הכי טבעי!",
  },
  {
    id: "mat_available",
    label: "מזרון/שטיח",
    description: "לתרגילי רצפה נוחים",
    image: require("../../assets/yoga_mat.png"),
    metadata: { equipment: ["mat"] },
    aiInsight: "נוחות לתרגילי ליבה!",
  },
  {
    id: "chair_available",
    label: "כיסא יציב",
    description: "לתרגילי דחיפה וכוח",
    metadata: { equipment: ["chair"] },
    aiInsight: "כיסא פותח הרבה אפשרויות!",
  },
  {
    id: "wall_space",
    label: "קיר פנוי",
    description: "לתרגילי קיר ומתיחות",
    metadata: { equipment: ["wall"] },
    aiInsight: "הקיר הוא הכלי הכי יציב!",
  },
  {
    id: "stairs_available",
    label: "מדרגות",
    description: "לאימוני קרדיו וכוח רגליים",
    metadata: { equipment: ["stairs"] },
    aiInsight: "מדרגות = חדר כושר טבעי!",
  },
  {
    id: "towel_available",
    label: "מגבת",
    description: "להתנגדות ומתיחות",
    metadata: { equipment: ["towel"] },
    aiInsight: "מגבת יכולה להיות גומית התנגדות!",
  },
  {
    id: "water_bottles",
    label: "בקבוקי מים מלאים",
    description: "כמשקולות קלות",
    metadata: { equipment: ["water_bottles"] },
    aiInsight: "משקולות ביתיות מושלמות!",
  },
  {
    id: "pillow_available",
    label: "כרית",
    description: "לתמיכה ותרגילי יציבות",
    metadata: { equipment: ["pillow"] },
    aiInsight: "תמיכה נוחה לתרגילים!",
  },
  {
    id: "table_sturdy",
    label: "שולחן חזק",
    description: "לתרגילי שכיבה תמיכה",
    metadata: { equipment: ["table"] },
    aiInsight: "פלטפורמה מעולה לתרגילים!",
  },
  {
    id: "backpack_heavy",
    label: "תיק עם ספרים",
    description: "להוספת משקל לתרגילים",
    metadata: { equipment: ["weighted_backpack"] },
    aiInsight: "משקל נוסף לאתגר גדול יותר!",
  },
];

// ==================== ציוד ביתי ====================
export const HOME_EQUIPMENT_OPTIONS: SmartOption[] = [
  {
    id: "dumbbells_home",
    label: "דמבלים",
    description: "משקולות יד - קבועות או מתכווננות",
    image: require("../../assets/dumbbells.png"),
    metadata: { equipment: ["dumbbells"] },
    aiInsight: "הציוד הכי גמיש לכוח!",
  },
  {
    id: "resistance_bands",
    label: "גומיות התנגדות",
    description: "רצועות אלסטיות להתנגדות משתנה",
    image: require("../../assets/resistance_bands.png"),
    metadata: { equipment: ["resistance_bands"] },
    aiInsight: "קלות ויעילות מדהימה!",
  },
  {
    id: "kettlebell_home",
    label: "קטלבל",
    description: "משקולת עם ידית לתרגילים דינמיים",
    image: require("../../assets/kettlebell.png"),
    metadata: { equipment: ["kettlebell"] },
    aiInsight: "כוח + קרדיו בכלי אחד!",
  },
  {
    id: "yoga_mat_home",
    label: "מזרן יוגה",
    description: "בסיס נוח לתרגילי רצפה",
    image: require("../../assets/yoga_mat.png"),
    metadata: { equipment: ["yoga_mat"] },
    aiInsight: "בסיס חיוני לתרגילי ליבה!",
  },
  {
    id: "pullup_bar",
    label: "מוט מתח",
    description: "מוט מתכוונן לדלת",
    image: require("../../assets/pullup_bar.png"),
    metadata: { equipment: ["pullup_bar"] },
    aiInsight: "פותח עולם של תרגילי גב!",
  },
  {
    id: "foam_roller",
    label: "גלגל מסאז'",
    description: "לשחרור שרירים והתאוששות",
    image: require("../../assets/foam_roller.png"),
    metadata: { equipment: ["foam_roller"] },
    aiInsight: "התאוששות חכמה!",
  },
  {
    id: "exercise_ball",
    label: "כדור פיזיותרפיה",
    description: "לתרגילי יציבות וליבה",
    metadata: { equipment: ["exercise_ball"] },
    aiInsight: "יציבות ואיזון מושלמים!",
  },
  {
    id: "jump_rope",
    label: "חבל קפיצה",
    description: "לאימוני קרדיו מהירים",
    metadata: { equipment: ["jump_rope"] },
    aiInsight: "קרדיו יעיל בזמן קצר!",
  },
  {
    id: "home_bench",
    label: "ספסל אימונים",
    description: "ספסל מתכוונן לבית",
    image: require("../../assets/bench.png"),
    metadata: { equipment: ["bench"] },
    aiInsight: "פותח אפשרויות אינסופיות!",
  },
  {
    id: "barbell_home",
    label: "ברבל ביתי",
    description: "מוט עם משקולות לבית",
    image: require("../../assets/barbell.png"),
    metadata: { equipment: ["barbell"] },
    aiInsight: "רמה מקצועית בבית!",
  },
];

// ==================== ציוד חדר כושר ====================
export const GYM_EQUIPMENT_OPTIONS: SmartOption[] = [
  {
    id: "free_weights_gym",
    label: "משקולות חופשיות",
    description: "דמבלים וברבלים עם צלחות משקל",
    image: require("../../assets/free_weights.png"),
    metadata: { equipment: ["dumbbells", "barbell"] },
    aiInsight: "הבסיס של אימוני כוח אמיתיים!",
  },
  {
    id: "squat_rack_gym",
    label: "מתקן סקוואט",
    description: "מדף ברבל עם מגני בטיחות",
    image: require("../../assets/squat_rack.png"),
    metadata: { equipment: ["squat_rack"] },
    aiInsight: "המלך של תרגילי הרגליים!",
  },
  {
    id: "bench_press_gym",
    label: "ספסל לחיצה",
    description: "ספסל מתכוונן עם מדף ברבל",
    image: require("../../assets/bench.png"),
    metadata: { equipment: ["bench_press"] },
    aiInsight: "חיוני לאימוני חזה מקצועיים!",
  },
  {
    id: "cable_machine_gym",
    label: "מכונת כבלים",
    description: "מערכת פולי רב-תכליתית",
    image: require("../../assets/cable_machine.png"),
    metadata: { equipment: ["cable_machine"] },
    aiInsight: "גמישות אינסופית לכל השרירים!",
  },
  {
    id: "leg_press_gym",
    label: "מכונת לג פרס",
    description: "מכונה ללחיצת רגליים בישיבה",
    image: require("../../assets/leg_press.png"),
    metadata: { equipment: ["leg_press"] },
    aiInsight: "כוח רגליים מקסימלי בבטיחות!",
  },
  {
    id: "lat_pulldown_gym",
    label: "מכונת לט פולדאון",
    description: "משיכה למטה לשרירי הגב",
    image: require("../../assets/lat_pulldown.png"),
    metadata: { equipment: ["lat_pulldown"] },
    aiInsight: "מושלמת לפיתוח גב רחב!",
  },
  {
    id: "smith_machine_gym",
    label: "מכונת סמית'",
    description: "ברבל מונחה על מסילות בטוחות",
    image: require("../../assets/smith_machine.png"),
    metadata: { equipment: ["smith_machine"] },
    aiInsight: "בטיחות מקסימלית עם עומסים כבדים!",
  },
  {
    id: "cardio_machines_gym",
    label: "מכונות קרדיו",
    description: "הליכון, אליפטיקל, אופני כושר",
    image: require("../../assets/treadmill.png"),
    metadata: { equipment: ["treadmill", "elliptical"] },
    aiInsight: "חיוני לחימום וקרדיו איכותי!",
  },
  {
    id: "chest_press_gym",
    label: "מכונת חזה",
    description: "לחיצת חזה במכונה מונחית",
    image: require("../../assets/chest_press.png"),
    metadata: { equipment: ["chest_press"] },
    aiInsight: "בטוחה ויעילה לפיתוח החזה!",
  },
  {
    id: "rowing_machine_gym",
    label: "מכונת חתירה",
    description: "אימון גב וקרדיו משולב",
    image: require("../../assets/rowing_machine.png"),
    metadata: { equipment: ["rowing_machine"] },
    aiInsight: "אימון מלא לכל הגוף בתנועה אחת!",
  },
];

// ==================== פונקציות עזר ====================

/**
 * מחזיר רשימת ציוד לפי קטגוריה
 */
export function getEquipmentByCategory(category: string): SmartOption[] {
  switch (category) {
    case "bodyweight_equipment_options":
      return BODYWEIGHT_EQUIPMENT_OPTIONS;
    case "home_equipment_options":
      return HOME_EQUIPMENT_OPTIONS;
    case "gym_equipment_options":
      return GYM_EQUIPMENT_OPTIONS;
    default:
      return [];
  }
}

/**
 * מחזיר כל הציוד הזמין
 */
export function getAllEquipmentOptions(): SmartOption[] {
  return [
    ...BODYWEIGHT_EQUIPMENT_OPTIONS,
    ...HOME_EQUIPMENT_OPTIONS,
    ...GYM_EQUIPMENT_OPTIONS,
  ];
}

/**
 * מחפש ציוד לפי ID
 */
export function findEquipmentById(id: string): SmartOption | undefined {
  return getAllEquipmentOptions().find((eq) => eq.id === id);
}

/**
 * חילוץ כל סוגי הציוד מתשובות השאלון
 */
export function extractEquipmentFromAnswers(
  answers: Record<string, any>
): string[] {
  const extractedEquipment: string[] = [];

  Object.values(answers).forEach((answer: any) => {
    if (Array.isArray(answer)) {
      answer.forEach((option: any) => {
        if (option?.metadata?.equipment) {
          extractedEquipment.push(...option.metadata.equipment);
        }
      });
    } else if (answer?.metadata?.equipment) {
      extractedEquipment.push(...answer.metadata.equipment);
    }
  });

  return Array.from(new Set(extractedEquipment));
}
