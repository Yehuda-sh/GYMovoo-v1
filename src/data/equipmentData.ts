/**
 * @file src/data/equipmentData.ts
 * @brief מאגר ציוד מתקדם ומאורגן - עם פונקציות עזר חכמות ואופטימיזציה
 * @description Advanced organized equipment database with smart utilities and optimization
 * @date 2025-08-15
 * @enhanced Added smart recommendations, caching, and advanced filtering
 */

import { ImageSourcePropType } from "react-native";

// ממשק ציוד פשוט ויעיל
export interface Equipment {
  id: string;
  label: string;
  image?: ImageSourcePropType;
  description?: string;
  isDefault?: boolean;
  isPremium?: boolean;
  category: "home" | "gym" | "cardio";
  tags: string[];
  algorithmWeight?: number; // משקל באלגוריתם (1-10)
  recommendedFor?: string[]; // המלצות לפי רמת כושר
  aliases?: string[]; // מזהים חלופיים לתאימות מערכות
}

// ===============================================
// 🏋️‍♂️ Equipment Categories & Metadata
// ===============================================

export const EQUIPMENT_CATEGORIES = {
  HOME_BASIC: ["none", "dumbbells", "resistance_bands", "yoga_mat"],
  HOME_INTERMEDIATE: [
    "kettlebell",
    "pull_up_bar",
    "exercise_ball",
    "jump_rope",
  ],
  HOME_ADVANCED: ["barbell", "adjustable_dumbbells", "suspension_trainer"],
  GYM_STRENGTH: ["squat_rack", "bench_press", "free_weights", "cable_machine"],
  GYM_MACHINES: ["lat_pulldown", "leg_press", "smith_machine", "chest_press"],
  CARDIO_BASIC: ["treadmill", "stationary_bike", "elliptical"],
  CARDIO_ADVANCED: ["rowing_machine", "battle_ropes", "punching_bag"],
} as const;

export const EQUIPMENT_BY_WORKOUT_TYPE = {
  STRENGTH: [
    "dumbbells",
    "barbell",
    "kettlebell",
    "squat_rack",
    "bench_press",
    "free_weights",
  ],
  CARDIO: [
    "treadmill",
    "stationary_bike",
    "rowing_machine",
    "jump_rope",
    "battle_ropes",
  ],
  FLEXIBILITY: ["yoga_mat", "foam_roller", "resistance_bands"],
  FUNCTIONAL: [
    "kettlebell",
    "suspension_trainer",
    "medicine_ball",
    "battle_ropes",
  ],
} as const;

export const SPACE_REQUIREMENTS = {
  MINIMAL: ["none", "resistance_bands", "jump_rope", "foam_roller"],
  SMALL: ["dumbbells", "kettlebell", "yoga_mat", "exercise_ball"],
  MEDIUM: ["pull_up_bar", "bench", "suspension_trainer"],
  LARGE: ["barbell", "squat_rack", "treadmill", "rowing_machine"],
} as const;

// ==================== ציוד ביתי - 20 פריטים הכי נפוצים ====================
export const HOME_EQUIPMENT: Equipment[] = [
  {
    id: "none",
    label: "ללא ציוד",
    image: require("../../assets/bodyweight.png"),
    description: "אימונים עם משקל גוף בלבד",
    isDefault: true,
    category: "home",
    tags: ["bodyweight", "no equipment", "ללא ציוד", "משקל גוף"],
    algorithmWeight: 10,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "dumbbells",
    label: "דמבלים",
    image: require("../../assets/dumbbells.png"),
    description: "משקולות ידניות למגוון תרגילי כוח",
    category: "home",
    tags: ["dumbbells", "weights", "דמבלים", "משקולות"],
    algorithmWeight: 9,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "resistance_bands",
    label: "גומיות התנגדות",
    image: require("../../assets/resistance_bands.png"),
    description: "גומיות למגוון תרגילי כוח ומתיחה",
    category: "home",
    tags: ["resistance", "bands", "גומיות", "התנגדות"],
    algorithmWeight: 8,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "yoga_mat",
    label: "מזרון יוגה",
    image: require("../../assets/yoga_mat.png"),
    description: "מזרון לתרגילי רצפה, יוגה ומתיחה",
    category: "home",
    tags: ["mat", "yoga", "מזרון", "יוגה"],
    algorithmWeight: 8,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "kettlebell",
    label: "קטלבל",
    image: require("../../assets/kettlebell.png"),
    description: "משקולת עם ידית לתרגילי כוח ופונקציונליים",
    category: "home",
    tags: ["kettlebell", "functional", "קטלבל", "פונקציונלי", "כדור אימון"],
    algorithmWeight: 8,
    recommendedFor: ["intermediate", "advanced"],
    aliases: ["kettlebells"],
  },
  {
    id: "pull_up_bar",
    label: "מתח למשיכות",
    image: require("../../assets/pullup_bar.png"),
    description: "מתח לדלת או קיר למשיכות וסנטר",
    category: "home",
    tags: ["pullup", "bar", "משיכות", "מתח"],
    algorithmWeight: 9,
    recommendedFor: ["intermediate", "advanced"],
    aliases: ["pullup_bar"],
  },
  {
    id: "exercise_ball",
    label: "כדור פילאטיס",
    image: require("../../assets/exercise-default.png"),
    description: "כדור גדול לתרגילי יציבות וליבה",
    category: "home",
    tags: ["ball", "stability", "כדור", "יציבות"],
    algorithmWeight: 7,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "jump_rope",
    label: "חבל קפיצה",
    image: require("../../assets/exercise-default.png"),
    description: "חבל לקפיצות ואימון קרדיו",
    category: "home",
    tags: ["jump rope", "cardio", "חבל קפיצה", "קרדיו"],
    algorithmWeight: 7,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "foam_roller",
    label: "רולר עיסוי",
    image: require("../../assets/foam_roller.png"),
    description: "רולר לעיסוי שרירים והתאוששות",
    category: "home",
    tags: ["foam roller", "recovery", "רולר", "עיסוי"],
    algorithmWeight: 6,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "bench",
    label: "ספסל אימונים",
    image: require("../../assets/bench.png"),
    description: "ספסל מתכוונן לתרגילי חזה וגב",
    category: "home",
    tags: ["bench", "ספסל", "חזה", "גב"],
    algorithmWeight: 8,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "barbell",
    label: "ברבל",
    image: require("../../assets/barbell.png"),
    description: "מוט ברזל עם משקולות לתרגילי כוח",
    category: "home",
    tags: ["barbell", "weights", "ברבל", "משקולות"],
    algorithmWeight: 9,
    recommendedFor: ["intermediate", "advanced"],
    isPremium: true,
  },
  {
    id: "adjustable_dumbbells",
    label: "דמבלים מתכווננים",
    image: require("../../assets/dumbbells.png"),
    description: "דמבלים עם משקל מתכוונן",
    category: "home",
    tags: ["adjustable", "dumbbells", "מתכווננים", "דמבלים"],
    algorithmWeight: 9,
    recommendedFor: ["intermediate", "advanced"],
    isPremium: true,
  },
  {
    id: "suspension_trainer",
    label: "מערכת TRX",
    image: require("../../assets/trx.png"),
    description: "מערכת רצועות לאימון תלייה",
    category: "home",
    tags: ["TRX", "suspension", "תלייה", "רצועות"],
    algorithmWeight: 8,
    recommendedFor: ["intermediate", "advanced"],
    aliases: ["trx"],
  },
  {
    id: "water_bottles",
    label: "בקבוקי מים",
    image: require("../../assets/exercise-default.png"),
    description: "בקבוקי מים כמשקולות זמניות",
    category: "home",
    tags: ["water bottles", "improvised", "בקבוקי מים", "אלתרנטיבי"],
    algorithmWeight: 5,
    recommendedFor: ["beginner"],
    aliases: ["water_bottle"],
  },
  {
    id: "water_gallon",
    label: "גלון מים",
    image: require("../../assets/exercise-default.png"),
    description: "גלון מים גדול (4-5 ליטר) כמשקולת",
    category: "home",
    tags: ["water gallon", "heavy", "גלון מים", "כבד"],
    algorithmWeight: 6,
    recommendedFor: ["intermediate"],
  },
  {
    id: "sandbag",
    label: "שק חול",
    image: require("../../assets/exercise-default.png"),
    description: "שק מלא בחול לאימון פונקציונלי",
    category: "home",
    tags: ["sandbag", "functional", "שק חול", "פונקציונלי"],
    algorithmWeight: 7,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "tire",
    label: "צמיג",
    image: require("../../assets/exercise-default.png"),
    description: "צמיג גדול לתרגילי כוח אקספלוסיביים",
    category: "home",
    tags: ["tire", "explosive", "צמיג", "כוח"],
    algorithmWeight: 9,
    recommendedFor: ["advanced"],
    isPremium: true,
  },
  {
    id: "medicine_ball",
    label: "כדור רפואי",
    image: require("../../assets/exercise-default.png"),
    description: "כדור כבד לתרגילי כוח ויציבות",
    category: "home",
    tags: ["medicine ball", "power", "כדור רפואי", "כוח"],
    algorithmWeight: 7,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "resistance_tubes",
    label: "צינורות התנגדות",
    image: require("../../assets/resistance_bands.png"),
    description: "צינורות גומי עם ידיות",
    category: "home",
    tags: ["tubes", "resistance", "צינורות", "התנגדות"],
    algorithmWeight: 7,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "ab_wheel",
    label: "גלגל בטן",
    image: require("../../assets/exercise-default.png"),
    description: "גלגל לחיזוק שרירי הבטן",
    category: "home",
    tags: ["ab wheel", "core", "גלגל בטן", "ליבה"],
    algorithmWeight: 6,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "step_platform",
    label: "במת סטפ",
    image: require("../../assets/exercise-default.png"),
    description: "במה לתרגילי סטפ ופליומטריים",
    category: "home",
    tags: ["step", "platform", "סטפ", "במה"],
    algorithmWeight: 6,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "balance_board",
    label: "קרש איזון",
    image: require("../../assets/exercise-default.png"),
    description: "קרש לשיפור איזון ויציבות",
    category: "home",
    tags: ["balance", "stability", "איזון", "יציבות"],
    algorithmWeight: 5,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "weight_vest",
    label: "אפוד משקל",
    image: require("../../assets/exercise-default.png"),
    description: "אפוד עם משקולות לאימון משקל גוף",
    category: "home",
    tags: ["weight vest", "bodyweight", "אפוד משקל", "משקל גוף"],
    algorithmWeight: 7,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "parallette_bars",
    label: "מקבילים קטנים",
    image: require("../../assets/exercise-default.png"),
    description: "מקבילים נמוכים לתרגילי כוח",
    category: "home",
    tags: ["parallettes", "bodyweight", "מקבילים", "כוח"],
    algorithmWeight: 6,
    recommendedFor: ["intermediate", "advanced"],
  },
];

// ==================== ציוד חדר כושר - 20 פריטים הכי נפוצים ====================
export const GYM_EQUIPMENT: Equipment[] = [
  {
    id: "squat_rack",
    label: "מתקן סקוואט",
    image: require("../../assets/squat_rack.png"),
    description: "מתקן לתרגילי סקוואט ובר",
    category: "gym",
    tags: ["squat rack", "power rack", "סקוואט", "מתקן"],
    algorithmWeight: 10,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "bench_press",
    label: "מכונת חזה",
    image: require("../../assets/bench.png"),
    description: "ספסל ומתקן ללחיצת חזה",
    category: "gym",
    tags: ["bench press", "chest", "חזה", "לחיצה"],
    algorithmWeight: 10,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "cable_machine",
    label: "מכונת כבלים",
    image: require("../../assets/cable_machine.png"),
    description: "מכונה רב-תכליתית עם כבלים",
    category: "gym",
    tags: ["cable", "functional", "כבלים", "רב-תכלית"],
    algorithmWeight: 9,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "lat_pulldown",
    label: "מכונת משיכות גב",
    image: require("../../assets/lat_pulldown.png"),
    description: "מכונה למשיכות גב עליון",
    category: "gym",
    tags: ["lat pulldown", "back", "גב", "משיכות"],
    algorithmWeight: 9,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "leg_press",
    label: "מכונת רגליים",
    image: require("../../assets/leg_press.png"),
    description: "מכונה ללחיצת רגליים",
    category: "gym",
    tags: ["leg press", "legs", "רגליים", "לחיצה"],
    algorithmWeight: 9,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "smith_machine",
    label: "מכונת סמית'",
    image: require("../../assets/smith_machine.png"),
    description: "מכונה עם בר מונחה בפסים",
    category: "gym",
    tags: ["smith machine", "guided", "סמית'", "מונחה"],
    algorithmWeight: 8,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "free_weights",
    label: "משקולות חופשיות",
    image: require("../../assets/free_weights.png"),
    description: "דמבלים וברבלים במגוון משקלים",
    category: "gym",
    tags: ["free weights", "dumbbells", "משקולות", "חופשיות"],
    algorithmWeight: 10,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "preacher_curl",
    label: "מכונת בייספס",
    image: require("../../assets/preacher_curl.png"),
    description: "ספסל לתרגילי ביצפס מבודדים",
    category: "gym",
    tags: ["preacher curl", "biceps", "ביצפס", "מבודד"],
    algorithmWeight: 7,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "chest_press",
    label: "מכונת חזה ישיבה",
    image: require("../../assets/chest_press.png"),
    description: "מכונה ללחיצת חזה בישיבה",
    category: "gym",
    tags: ["chest press", "seated", "חזה", "ישיבה"],
    algorithmWeight: 8,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "shoulder_press",
    label: "מכונת כתפיים",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה ללחיצת כתפיים",
    category: "gym",
    tags: ["shoulder press", "shoulders", "כתפיים", "לחיצה"],
    algorithmWeight: 8,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "leg_extension",
    label: "מכונת הרחבת רגליים",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה להרחבת הרגליים (קוואדס)",
    category: "gym",
    tags: ["leg extension", "quadriceps", "קוואדס", "הרחבה"],
    algorithmWeight: 7,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "leg_curl",
    label: "מכונת כיפוף רגליים",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה לכיפוף הרגליים (האמסטרינג)",
    category: "gym",
    tags: ["leg curl", "hamstrings", "האמסטרינג", "כיפוף"],
    algorithmWeight: 7,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "calf_raise",
    label: "מכונת שוקיים",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה לחיזוק שרירי השוק",
    category: "gym",
    tags: ["calf raise", "calves", "שוקיים", "הרמה"],
    algorithmWeight: 6,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "dip_station",
    label: "מתקן דיפס",
    image: require("../../assets/exercise-default.png"),
    description: "מתקן לתרגילי דיפס",
    category: "gym",
    tags: ["dips", "triceps", "דיפס", "טריצפס"],
    algorithmWeight: 8,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "hyperextension",
    label: "מכונת גב תחתון",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה לחיזוק הגב התחתון",
    category: "gym",
    tags: ["hyperextension", "lower back", "גב תחתון", "הרחבה"],
    algorithmWeight: 6,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "pec_deck",
    label: "מכונת פק דק",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה לריכוז חזה",
    category: "gym",
    tags: ["pec deck", "chest fly", "חזה", "ריכוז"],
    algorithmWeight: 7,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "seated_row",
    label: "מכונת חתירה",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה לחתירה בישיבה",
    category: "gym",
    tags: ["seated row", "back", "חתירה", "גב"],
    algorithmWeight: 8,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "tricep_dip",
    label: "מכונת טריצפס",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה לתרגילי טריצפס",
    category: "gym",
    tags: ["tricep", "assisted dip", "טריצפס", "מסייע"],
    algorithmWeight: 7,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "olympic_bar",
    label: "בר אולימפי",
    image: require("../../assets/barbell.png"),
    description: 'בר סטנדרטי 20 ק"ג לתרגילי כוח',
    category: "gym",
    tags: ["olympic bar", "powerlifting", "אולימפי", "כוח"],
    algorithmWeight: 10,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "power_tower",
    label: "מגדל כוח",
    image: require("../../assets/exercise-default.png"),
    description: "מתקן רב-תכליתי למשיכות ודיפס",
    category: "gym",
    tags: ["power tower", "multi-function", "מגדל כוח", "רב-תכלית"],
    algorithmWeight: 9,
    recommendedFor: ["intermediate", "advanced"],
  },
];

// ==================== ציוד קרדיו וכללי - 20 פריטים הכי נפוצים ====================
export const CARDIO_EQUIPMENT: Equipment[] = [
  {
    id: "treadmill",
    label: "הליכון",
    image: require("../../assets/treadmill.png"),
    description: "מכונת ריצה והליכה",
    category: "cardio",
    tags: ["treadmill", "running", "הליכון", "ריצה"],
    algorithmWeight: 10,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "rowing_machine",
    label: "מכונת חתירה",
    image: require("../../assets/rowing_machine.png"),
    description: "מכונה לאימון חתירה וקרדיו מלא",
    category: "cardio",
    tags: ["rowing", "full body", "חתירה", "גוף מלא"],
    algorithmWeight: 9,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "elliptical",
    label: "אליפטי",
    image: require("../../assets/exercise-default.png"),
    description: "מכונת קרדיו אליפטית",
    category: "cardio",
    tags: ["elliptical", "low impact", "אליפטי", "חסכוני פגיעות"],
    algorithmWeight: 8,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "stationary_bike",
    label: "אופניים נייחים",
    image: require("../../assets/bike.png"),
    description: "אופניים לאימון קרדיו",
    category: "cardio",
    tags: ["bike", "cycling", "אופניים", "רכיבה"],
    algorithmWeight: 9,
    recommendedFor: ["beginner", "intermediate", "advanced"],
    aliases: ["bike"],
  },
  {
    id: "spin_bike",
    label: "אופני ספין",
    image: require("../../assets/bike.png"),
    description: "אופניים לאימוני ספין אינטנסיביים",
    category: "cardio",
    tags: ["spin", "intense", "ספין", "אינטנסיבי"],
    algorithmWeight: 8,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "stair_climber",
    label: "מכונת מדרגות",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה לעליית מדרגות",
    category: "cardio",
    tags: ["stair climber", "stairs", "מדרגות", "עליה"],
    algorithmWeight: 7,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "battle_ropes",
    label: "חבלי קרב",
    image: require("../../assets/exercise-default.png"),
    description: "חבלים כבדים לאימון תפרצותי",
    category: "cardio",
    tags: ["battle ropes", "HIIT", "חבלי קרב", "תפרצותי"],
    algorithmWeight: 8,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "punching_bag",
    label: "שק חבטות",
    image: require("../../assets/exercise-default.png"),
    description: "שק לאימוני אגרוף וקרדיו",
    category: "cardio",
    tags: ["punching bag", "boxing", "שק חבטות", "אגרוף"],
    algorithmWeight: 8,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "agility_ladder",
    label: "סולם זריזות",
    image: require("../../assets/exercise-default.png"),
    description: "סולם לתרגילי זריזות ומהירות",
    category: "cardio",
    tags: ["agility", "speed", "זריזות", "מהירות"],
    algorithmWeight: 6,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "speed_rope",
    label: "חבל מהירות",
    image: require("../../assets/exercise-default.png"),
    description: "חבל קפיצה מקצועי למהירות",
    category: "cardio",
    tags: ["speed rope", "jump rope", "חבל מהירות", "קפיצה"],
    algorithmWeight: 7,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "plyometric_box",
    label: "קופסת קפיצות",
    image: require("../../assets/exercise-default.png"),
    description: "קופסה לתרגילי קפיצה ופליומטריים",
    category: "cardio",
    tags: ["plyometric", "jump", "קפיצות", "פליומטרי"],
    algorithmWeight: 7,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "cone_markers",
    label: "חרוטי סימון",
    image: require("../../assets/exercise-default.png"),
    description: "חרוטים לתרגילי זריזות ומהירות",
    category: "cardio",
    tags: ["cones", "agility", "חרוטים", "זריזות"],
    algorithmWeight: 5,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "cross_trainer",
    label: "מכונת קרוס",
    image: require("../../assets/exercise-default.png"),
    description: "מכונת אימון משולב",
    category: "cardio",
    tags: ["cross trainer", "combined", "קרוס", "משולב"],
    algorithmWeight: 8,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "recumbent_bike",
    label: "אופניים שכיבה",
    image: require("../../assets/bike.png"),
    description: "אופניים עם תמיכת גב",
    category: "cardio",
    tags: ["recumbent", "comfortable", "שכיבה", "נוח"],
    algorithmWeight: 7,
    recommendedFor: ["beginner", "rehabilitation"],
  },
  {
    id: "air_bike",
    label: "אופני אוויר",
    image: require("../../assets/bike.png"),
    description: "אופניים עם התנגדות אוויר",
    category: "cardio",
    tags: ["air bike", "resistance", "אוויר", "התנגדות"],
    algorithmWeight: 8,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "skierg",
    label: "מכונת סקי",
    image: require("../../assets/exercise-default.png"),
    description: "מכונה המדמה תנועות סקי",
    category: "cardio",
    tags: ["ski erg", "upper body", "סקי", "גוף עליון"],
    algorithmWeight: 7,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "versa_climber",
    label: "מטפס ורסה",
    image: require("../../assets/exercise-default.png"),
    description: "מכונת טיפוס גוף מלא",
    category: "cardio",
    tags: ["versa climber", "climbing", "טיפוס", "גוף מלא"],
    algorithmWeight: 8,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "balance_dome",
    label: "כדום איזון",
    image: require("../../assets/exercise-default.png"),
    description: "חצי כדור לאימוני איזון",
    category: "cardio",
    tags: ["balance", "stability", "איזון", "יציבות"],
    algorithmWeight: 6,
    recommendedFor: ["beginner", "intermediate"],
  },
  {
    id: "tire_flip",
    label: "צמיג אימונים",
    image: require("../../assets/exercise-default.png"),
    description: "צמיג כבד לתרגילי כוח ופונקציונליים",
    category: "cardio",
    tags: ["tire", "functional", "צמיג", "פונקציונלי"],
    algorithmWeight: 8,
    recommendedFor: ["advanced"],
  },
  {
    id: "sled_push",
    label: "מזחלת דחיפה",
    image: require("../../assets/exercise-default.png"),
    description: "מזחלת משקל לדחיפה ומשיכה",
    category: "cardio",
    tags: ["sled", "pushing", "מזחלת", "דחיפה"],
    algorithmWeight: 8,
    recommendedFor: ["intermediate", "advanced"],
  },
];

// ==================== מאגר ציוד מאוחד ====================
export const ALL_EQUIPMENT: Equipment[] = [
  ...HOME_EQUIPMENT,
  ...GYM_EQUIPMENT,
  ...CARDIO_EQUIPMENT,
];

// ==================== פונקציות עזר ====================

/**
 * Cache מהיר לחיפושים תכופים
 * Fast cache for frequent searches
 */
const EquipmentCache = {
  byId: new Map<string, Equipment>(),
  byCategory: new Map<string, Equipment[]>(),
  byLevel: new Map<string, Equipment[]>(),

  clear() {
    this.byId.clear();
    this.byCategory.clear();
    this.byLevel.clear();
  },

  initialize() {
    // Pre-populate ID cache
    ALL_EQUIPMENT.forEach((eq) => {
      this.byId.set(eq.id, eq);
      eq.aliases?.forEach((alias) => this.byId.set(alias, eq));
    });
  },
};

export function getEquipmentById(equipmentId: string): Equipment | undefined {
  const normalized = equipmentId.trim();

  // Fast cache lookup
  if (EquipmentCache.byId.size === 0) {
    EquipmentCache.initialize();
  }

  return EquipmentCache.byId.get(normalized);
}

export function getEquipmentByCategory(
  category: "home" | "gym" | "cardio"
): Equipment[] {
  // Cache lookup
  const cacheKey = category;
  if (EquipmentCache.byCategory.has(cacheKey)) {
    return EquipmentCache.byCategory.get(cacheKey)!;
  }

  let result: Equipment[];
  switch (category) {
    case "home":
      result = HOME_EQUIPMENT;
      break;
    case "gym":
      result = GYM_EQUIPMENT;
      break;
    case "cardio":
      result = CARDIO_EQUIPMENT;
      break;
    default:
      result = [];
  }

  EquipmentCache.byCategory.set(cacheKey, result);
  return result;
}

export function getEquipmentByLevel(level: string): Equipment[] {
  // Cache lookup
  if (EquipmentCache.byLevel.has(level)) {
    return EquipmentCache.byLevel.get(level)!;
  }

  const result = ALL_EQUIPMENT.filter((eq) =>
    eq.recommendedFor?.includes(level)
  );
  EquipmentCache.byLevel.set(level, result);
  return result;
}

export function getPremiumEquipment(): Equipment[] {
  return ALL_EQUIPMENT.filter((eq) => eq.isPremium);
}

export function searchEquipment(query: string): Equipment[] {
  const lowerQuery = query.toLowerCase();
  return ALL_EQUIPMENT.filter((eq) => {
    const labelMatch = eq.label.toLowerCase().includes(lowerQuery);
    const descriptionMatch = eq.description?.toLowerCase().includes(lowerQuery);
    const tagMatch = eq.tags.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );
    const aliasMatch = eq.aliases?.some((a) =>
      a.toLowerCase().includes(lowerQuery)
    );
    return labelMatch || descriptionMatch || tagMatch || aliasMatch;
  });
}

// ===============================================
// 🎯 Advanced Equipment Utilities - פונקציות עזר מתקדמות
// ===============================================

/**
 * Get equipment recommendations based on user profile
 * קבלת המלצות ציוד על בסיס פרופיל המשתמש
 */
export function getSmartEquipmentRecommendations(userProfile: {
  experience: "beginner" | "intermediate" | "advanced";
  environment: "home" | "gym" | "both";
  budget: "low" | "medium" | "high";
  space: "minimal" | "small" | "medium" | "large";
  workoutTypes: ("strength" | "cardio" | "flexibility" | "functional")[];
}): Equipment[] {
  let candidates = ALL_EQUIPMENT.filter((eq) =>
    eq.recommendedFor?.includes(userProfile.experience)
  );

  // Filter by environment
  if (userProfile.environment !== "both") {
    candidates = candidates.filter(
      (eq) =>
        eq.category === userProfile.environment || eq.category === "cardio"
    );
  }

  // Filter by budget (premium items for medium/high budget)
  if (userProfile.budget === "low") {
    candidates = candidates.filter((eq) => !eq.isPremium);
  }

  // Filter by space requirements (simplified approach)
  const spaceBasedIds = {
    minimal: ["none", "resistance_bands", "jump_rope", "foam_roller"],
    small: ["dumbbells", "yoga_mat", "kettlebell", "pull_up_bar"],
    medium: ["exercise_ball", "suspension_trainer", "barbell", "bench"],
    large: ["squat_rack", "treadmill", "rowing_machine", "smith_machine"],
  };

  const allowedIds = spaceBasedIds[userProfile.space] || [];
  if (allowedIds.length > 0) {
    candidates = candidates.filter((eq) => allowedIds.includes(eq.id));
  }

  // Sort by algorithm weight (higher = better)
  return candidates
    .sort((a, b) => (b.algorithmWeight || 0) - (a.algorithmWeight || 0))
    .slice(0, 8); // Top 8 recommendations
}

/**
 * Get equipment by workout type
 * קבלת ציוד לפי סוג אימון
 */
export function getEquipmentByWorkoutType(
  workoutType: "strength" | "cardio" | "flexibility" | "functional"
): Equipment[] {
  // Simplified mapping based on workout types
  const workoutEquipmentMap = {
    strength: [
      "dumbbells",
      "barbell",
      "squat_rack",
      "kettlebell",
      "pull_up_bar",
      "bench",
    ],
    cardio: ["treadmill", "rowing_machine", "jump_rope", "exercise_bike"],
    flexibility: ["yoga_mat", "foam_roller", "resistance_bands"],
    functional: [
      "suspension_trainer",
      "kettlebell",
      "exercise_ball",
      "resistance_bands",
    ],
  };

  const equipmentIds = workoutEquipmentMap[workoutType] || [];
  return equipmentIds
    .map((id) => getEquipmentById(id))
    .filter(Boolean) as Equipment[];
}

/**
 * Get equipment by space requirement
 * קבלת ציוד לפי דרישות מקום
 */
export function getEquipmentBySpace(
  spaceType: "minimal" | "small" | "medium" | "large"
): Equipment[] {
  const spaceEquipmentMap = {
    minimal: ["none", "resistance_bands", "jump_rope", "foam_roller"],
    small: ["dumbbells", "yoga_mat", "kettlebell", "pull_up_bar"],
    medium: ["exercise_ball", "suspension_trainer", "barbell", "bench"],
    large: ["squat_rack", "treadmill", "rowing_machine", "smith_machine"],
  };

  const equipmentIds = spaceEquipmentMap[spaceType] || [];
  return equipmentIds
    .map((id) => getEquipmentById(id))
    .filter(Boolean) as Equipment[];
}

/**
 * Generate equipment compatibility score
 * יצירת ציון תאימות ציוד
 */
export function calculateEquipmentCompatibility(
  equipment: Equipment,
  userPreferences: {
    experience: string;
    environment: string;
    budget: string;
  }
): number {
  let score = 0;

  // Experience match (40%)
  if (equipment.recommendedFor?.includes(userPreferences.experience)) {
    score += 4;
  }

  // Environment match (30%)
  if (
    equipment.category === userPreferences.environment ||
    userPreferences.environment === "both"
  ) {
    score += 3;
  }

  // Budget compatibility (20%)
  if (userPreferences.budget === "high" || !equipment.isPremium) {
    score += 2;
  }

  // Algorithm weight bonus (10%)
  score += (equipment.algorithmWeight || 0) * 0.1;

  return Math.round(score * 10) / 10; // Round to 1 decimal
}

/**
 * Get equipment alternatives and substitutes
 * קבלת ציוד חלופי ותחליפים
 */
export function getEquipmentAlternatives(equipmentId: string): Equipment[] {
  const equipment = getEquipmentById(equipmentId);
  if (!equipment) return [];

  // Find equipment with similar tags or category
  return ALL_EQUIPMENT.filter(
    (eq) =>
      eq.id !== equipmentId &&
      eq.category === equipment.category &&
      eq.tags.some((tag) => equipment.tags.includes(tag))
  ).slice(0, 5);
}

export function getEquipmentStats(): {
  total: number;
  byCategory: { home: number; gym: number; cardio: number };
  byLevel: { beginner: number; intermediate: number; advanced: number };
} {
  return {
    total: ALL_EQUIPMENT.length,
    byCategory: {
      home: HOME_EQUIPMENT.length,
      gym: GYM_EQUIPMENT.length,
      cardio: CARDIO_EQUIPMENT.length,
    },
    byLevel: {
      beginner: getEquipmentByLevel("beginner").length,
      intermediate: getEquipmentByLevel("intermediate").length,
      advanced: getEquipmentByLevel("advanced").length,
    },
  };
}

export function validateEquipmentDatabase(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const allIds = new Set<string>();

  ALL_EQUIPMENT.forEach((equipment, index) => {
    // בדיקת ID כפול
    if (allIds.has(equipment.id)) {
      errors.push(`ID כפול: ${equipment.id}`);
    }
    allIds.add(equipment.id);

    // בדיקת שדות חובה
    if (!equipment.id || !equipment.label || !equipment.category) {
      errors.push(`שדות חובה חסרים עבור פריט ${index}`);
    }

    // בדיקת משקל אלגוריתם
    if (
      equipment.algorithmWeight &&
      (equipment.algorithmWeight < 1 || equipment.algorithmWeight > 10)
    ) {
      warnings.push(
        `משקל אלגוריתם לא תקין עבור ${equipment.label}: ${equipment.algorithmWeight}`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export default ALL_EQUIPMENT;
