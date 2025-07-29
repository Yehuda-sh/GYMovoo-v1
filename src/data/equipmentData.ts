/**
 * @file src/data/equipmentData.ts
 * @brief מאגר ציוד מקיף לבית וחדר כושר
 * @brief Comprehensive equipment database for home and gym
 * @description כולל ציוד נפוץ עם קטגוריות ותגיות לחיפוש
 * @description Includes common equipment with categories and search tags
 */

import { ImageSourcePropType } from "react-native";

// ממשק ציוד מורחב
// Extended equipment interface
export interface Equipment {
  id: string;
  label: string;
  image?: ImageSourcePropType;
  description?: string;
  isDefault?: boolean;
  isPremium?: boolean;
  category: "home" | "gym" | "both";
  tags: string[];
}

// מאגר ציוד מאוחד
// Unified equipment database
export const ALL_EQUIPMENT: Equipment[] = [
  // ==================== ציוד בסיסי (ללא ציוד) ====================
  {
    id: "none",
    label: "ללא ציוד",
    image: require("../../assets/bodyweight.png"),
    description: "אימונים עם משקל גוף בלבד",
    isDefault: true,
    category: "both",
    tags: ["bodyweight", "no equipment", "ללא ציוד", "משקל גוף"],
  },
  {
    id: "bodyweight",
    label: "משקל גוף",
    image: require("../../assets/bodyweight.png"),
    description: "אימונים עם משקל גוף בלבד",
    category: "both",
    tags: ["bodyweight", "משקל גוף", "ללא ציוד"],
  },
  {
    id: "mat",
    label: "מזרון/שטיח",
    image: require("../../assets/yoga_mat.png"),
    description: "לתרגילי רצפה נוחים",
    category: "home",
    tags: ["mat", "מזרון", "שטיח", "רצפה"],
  },
  {
    id: "chair",
    label: "כיסא יציב",
    image: require("../../assets/bodyweight.png"),
    description: "לתרגילי דחיפה וכוח",
    category: "home",
    tags: ["chair", "כיסא", "תמיכה"],
  },
  {
    id: "wall",
    label: "קיר פנוי",
    image: require("../../assets/bodyweight.png"),
    description: "לתרגילי קיר ומתיחות",
    category: "home",
    tags: ["wall", "קיר", "תמיכה"],
  },
  {
    id: "stairs",
    label: "מדרגות",
    image: require("../../assets/bodyweight.png"),
    description: "לאימוני קרדיו וכוח רגליים",
    category: "home",
    tags: ["stairs", "מדרגות", "קרדיו"],
  },
  {
    id: "towel",
    label: "מגבת",
    image: require("../../assets/bodyweight.png"),
    description: "להתנגדות ומתיחות",
    category: "home",
    tags: ["towel", "מגבת", "התנגדות"],
  },
  {
    id: "water_bottles",
    label: "בקבוקי מים",
    image: require("../../assets/bodyweight.png"),
    description: "כמשקולות קלות",
    category: "home",
    tags: ["water bottles", "בקבוקי מים", "משקולות קלות"],
  },
  {
    id: "pillow",
    label: "כרית",
    image: require("../../assets/bodyweight.png"),
    description: "לתמיכה ותרגילי יציבות",
    category: "home",
    tags: ["pillow", "כרית", "תמיכה"],
  },
  {
    id: "table",
    label: "שולחן חזק",
    image: require("../../assets/bodyweight.png"),
    description: "לתרגילי שכיבה תמיכה",
    category: "home",
    tags: ["table", "שולחן", "תמיכה"],
  },
  {
    id: "weighted_backpack",
    label: "תיק עם ספרים",
    image: require("../../assets/bodyweight.png"),
    description: "להוספת משקל לתרגילים",
    category: "home",
    tags: ["backpack", "תיק", "משקל נוסף"],
  },

  // ==================== ציוד ביתי מתקדם ====================
  {
    id: "pull_up_bar",
    label: "מתקן מתח",
    image: require("../../assets/pullup_bar.png"),
    description: "מתקן לתרגילי מתח ביתי",
    category: "home",
    tags: ["pull up", "מתח", "גב"],
  },
  {
    id: "bench_press",
    label: "ספסל לחיצה",
    image: require("../../assets/bench.png"),
    description: "ספסל עם מדף ברבל",
    category: "gym",
    tags: ["bench press", "ספסל", "חזה"],
  },
  {
    id: "cable_machine",
    label: "מכונת כבלים",
    image: require("../../assets/cable_machine.png"),
    description: "מערכת פולי רב-תכליתית",
    category: "gym",
    tags: ["cable", "כבלים", "פולי"],
  },
  {
    id: "leg_press",
    label: "מכונת רגליים",
    image: require("../../assets/leg_press.png"),
    description: "מכונה לתרגילי רגליים",
    category: "gym",
    tags: ["leg press", "רגליים", "מכונה"],
  },
  {
    id: "lat_pulldown",
    label: "מכונת גב",
    image: require("../../assets/lat_pulldown.png"),
    description: "מכונה לתרגילי גב",
    category: "gym",
    tags: ["lat pulldown", "גב", "משיכה"],
  },
  {
    id: "chest_press",
    label: "מכונת חזה",
    image: require("../../assets/chest_press.png"),
    description: "מכונה לתרגילי חזה",
    category: "gym",
    tags: ["chest press", "חזה", "דחיפה"],
  },
  {
    id: "preacher_curl",
    label: "ספסל ביצפס",
    image: require("../../assets/preacher_curl.png"),
    description: "ספסל מיוחד לתרגילי ביצפס",
    category: "gym",
    tags: ["preacher curl", "ביצפס", "ידיים"],
  },
  {
    id: "smith_machine",
    label: "מכונת סמית'",
    image: require("../../assets/smith_machine.png"),
    description: "מדף ברבל מונחה על פסים",
    category: "gym",
    tags: ["smith machine", "ברבל מונחה", "בטיחות"],
  },
  {
    id: "rowing_machine",
    label: "מכונת חתירה",
    image: require("../../assets/rowing_machine.png"),
    description: "מכונה לאימון קרדיו וגב",
    category: "gym",
    tags: ["rowing", "חתירה", "קרדיו"],
  },
  {
    id: "treadmill",
    label: "הליכון",
    image: require("../../assets/treadmill.png"),
    description: "מכונת ריצה וקרדיו",
    category: "gym",
    tags: ["treadmill", "ריצה", "קרדיו"],
  },
  {
    id: "stationary_bike",
    label: "אופניים נייחים",
    image: require("../../assets/bike.png"),
    description: "אופניים לאימון קרדיו",
    category: "gym",
    tags: ["bike", "אופניים", "קרדיו"],
  },
  {
    id: "pullup_bar",
    label: "מוט מתח",
    image: require("../../assets/pullup_bar.png"),
    description: "מוט מתכוונן לדלת",
    category: "home",
    tags: ["pullup bar", "מתח", "גב"],
  },
  {
    id: "exercise_ball",
    label: "כדור פיזיותרפיה",
    image: require("../../assets/bodyweight.png"),
    description: "לתרגילי יציבות וליבה",
    category: "home",
    tags: ["exercise ball", "כדור", "יציבות"],
  },
  {
    id: "jump_rope",
    label: "חבל קפיצה",
    image: require("../../assets/bodyweight.png"),
    description: "לאימוני קרדיו מהירים",
    category: "home",
    tags: ["jump rope", "חבל", "קרדיו"],
  },
  {
    id: "bench",
    label: "ספסל אימונים",
    image: require("../../assets/bench.png"),
    description: "ספסל מתכוונן",
    category: "both",
    tags: ["bench", "ספסל", "תמיכה"],
  },
  {
    id: "elliptical",
    label: "מכונת אליפטיקל",
    image: require("../../assets/bodyweight.png"),
    description: "מכונת קרדיו עם תנועה אליפטית",
    category: "gym",
    tags: ["elliptical", "קרדיו", "מכונה"],
  },

  // ==================== משקולות ומוטות ====================
  {
    id: "dumbbells",
    label: "משקולות יד",
    image: require("../../assets/dumbbells.png"),
    description: "זוג משקולות מתכווננות או קבועות",
    category: "both",
    tags: ["dumbbells", "משקולות", "משקולות יד", "זוג משקולות"],
  },
  {
    id: "adjustable_dumbbells",
    label: "משקולות מתכווננות",
    // image: require("../../assets/adjustable_dumbbells.png"),
    description: "משקולות עם משקל מתכוונן",
    isPremium: true,
    category: "home",
    tags: ["adjustable", "מתכוונן", "משקולות מתכווננות"],
  },
  {
    id: "barbell",
    label: "מוט ישר",
    image: require("../../assets/barbell.png"),
    description: "מוט אולימפי עם משקולות",
    isDefault: true,
    category: "gym",
    tags: ["barbell", "מוט", "מוט ישר", "אולימפי"],
  },
  {
    id: "ez_bar",
    label: "מוט EZ",
    // image: require("../../assets/ez_bar.png"),
    description: "מוט מעוקל לאימוני זרועות",
    category: "both",
    tags: ["ez bar", "מוט מעוקל", "curl bar"],
  },
  {
    id: "trap_bar",
    label: "מוט טראפ",
    // image: require("../../assets/trap_bar.png"),
    description: "מוט משושה לדדליפט",
    category: "gym",
    tags: ["trap bar", "hex bar", "מוט משושה"],
  },

  // ==================== גומיות ורצועות ====================
  {
    id: "resistance_bands",
    label: "גומיות התנגדות",
    image: require("../../assets/resistance_bands.png"),
    description: "סט גומיות בעוצמות שונות",
    category: "both",
    tags: ["bands", "גומיות", "resistance", "התנגדות"],
  },
  {
    id: "mini_bands",
    label: "גומיות מיני",
    // image: require("../../assets/mini_bands.png"),
    description: "גומיות קטנות לרגליים וידיים",
    category: "both",
    tags: ["mini bands", "גומיות קטנות", "loop bands"],
  },
  {
    id: "tube_bands",
    label: "גומיות צינור",
    // image: require("../../assets/tube_bands.png"),
    description: "גומיות עם ידיות",
    category: "home",
    tags: ["tube", "צינור", "ידיות"],
  },

  // ==================== מתחים ומקבילים ====================
  {
    id: "pullup_bar",
    label: "מוט מתח",
    image: require("../../assets/pullup_bar.png"),
    description: "להתקנה על משקוף הדלת",
    category: "home",
    tags: ["pullup", "מתח", "chinup", "עליות"],
  },
  {
    id: "dip_station",
    label: "מקבילים",
    // image: require("../../assets/dip_station.png"),
    description: "מתקן למקבילים",
    category: "both",
    tags: ["dips", "מקבילים", "parallel bars"],
  },
  {
    id: "power_tower",
    label: "מגדל כוח",
    // image: require("../../assets/power_tower.png"),
    description: "מתקן משולב - מתח, מקבילים, בטן",
    isPremium: true,
    category: "home",
    tags: ["power tower", "מגדל", "משולב"],
  },

  // ==================== משקולות מיוחדות ====================
  {
    id: "kettlebell",
    label: "קטלבל",
    image: require("../../assets/kettlebell.png"),
    description: "משקולת כדורית עם ידית",
    category: "both",
    tags: ["kettlebell", "קטלבל", "כדורית"],
  },
  {
    id: "medicine_ball",
    label: "כדור כוח",
    // image: require("../../assets/medicine_ball.png"),
    description: "כדור משוקלל לאימונים",
    category: "both",
    tags: ["medicine ball", "כדור כוח", "כדור משוקלל"],
  },
  {
    id: "slam_ball",
    label: "כדור סלאם",
    // image: require("../../assets/slam_ball.png"),
    description: "כדור לזריקות",
    category: "both",
    tags: ["slam ball", "כדור זריקה"],
  },
  {
    id: "bulgarian_bag",
    label: "שק בולגרי",
    // image: require("../../assets/bulgarian_bag.png"),
    description: "שק חצי סהר לאימונים פונקציונליים",
    isPremium: true,
    category: "both",
    tags: ["bulgarian", "בולגרי", "שק"],
  },
  {
    id: "sandbag",
    label: "שק חול",
    // image: require("../../assets/sandbag.png"),
    description: "שק חול לאימוני כוח פונקציונלי",
    category: "both",
    tags: ["sandbag", "שק חול", "חול"],
  },

  // ==================== ספסלים ומשטחים ====================
  {
    id: "flat_bench",
    label: "ספסל ישר",
    // image: require("../../assets/flat_bench.png"),
    description: "ספסל אימונים ישר",
    category: "both",
    tags: ["bench", "ספסל", "ישר"],
  },
  {
    id: "adjustable_bench",
    label: "ספסל מתכוונן",
    // image: require("../../assets/adjustable_bench.png"),
    description: "ספסל עם זוויות מתכווננות",
    isPremium: true,
    category: "both",
    tags: ["adjustable bench", "ספסל מתכוונן", "זוויות"],
  },
  {
    id: "yoga_mat",
    label: "מזרן יוגה",
    image: require("../../assets/yoga_mat.png"),
    description: "מזרן לתרגילי רצפה",
    category: "both",
    tags: ["mat", "מזרן", "יוגה", "yoga"],
  },
  {
    id: "ab_mat",
    label: "מזרן בטן",
    // image: require("../../assets/ab_mat.png"),
    description: "מזרן מעוקל לתרגילי בטן",
    category: "both",
    tags: ["ab mat", "מזרן בטן", "בטן"],
  },

  // ==================== אביזרי שיקום ומתיחות ====================
  {
    id: "foam_roller",
    label: "רולר",
    image: require("../../assets/foam_roller.png"),
    description: "לשחרור שרירים",
    category: "both",
    tags: ["roller", "רולר", "שחרור", "foam"],
  },
  {
    id: "massage_ball",
    label: "כדור עיסוי",
    // image: require("../../assets/massage_ball.png"),
    description: "כדור קטן לעיסוי נקודתי",
    category: "both",
    tags: ["massage", "עיסוי", "כדור עיסוי"],
  },
  {
    id: "stretch_strap",
    label: "רצועת מתיחה",
    // image: require("../../assets/stretch_strap.png"),
    description: "רצועה עם לולאות למתיחות",
    category: "both",
    tags: ["stretch", "מתיחה", "רצועה"],
  },

  // ==================== TRX ואימון תלייה ====================
  {
    id: "trx",
    label: "רצועות TRX",
    image: require("../../assets/trx.png"),
    description: "רצועות אימון פונקציונלי",
    isPremium: true,
    category: "both",
    tags: ["trx", "suspension", "רצועות", "תלייה"],
  },
  {
    id: "gymnastic_rings",
    label: "טבעות התעמלות",
    // image: require("../../assets/gymnastic_rings.png"),
    description: "טבעות לאימוני התעמלות",
    category: "both",
    tags: ["rings", "טבעות", "התעמלות"],
  },

  // ==================== מכונות חדר כושר ====================
  {
    id: "smith_machine",
    label: "מכונת סמית",
    image: require("../../assets/smith_machine.png"),
    description: "מוט מונחה על מסילות",
    category: "gym",
    tags: ["smith", "סמית", "מונחה"],
  },
  {
    id: "cable_machine",
    label: "מכונת כבלים",
    image: require("../../assets/cable_machine.png"),
    description: "מערכת גלגלות וכבלים",
    category: "gym",
    tags: ["cable", "כבלים", "גלגלות"],
  },
  {
    id: "lat_pulldown",
    label: "מכונת פולי עליון",
    image: require("../../assets/lat_pulldown.png"),
    description: "משיכה לרחב",
    category: "gym",
    tags: ["lat", "pulldown", "פולי", "רחב"],
  },
  {
    id: "leg_press",
    label: "מכונת לחיצת רגליים",
    image: require("../../assets/leg_press.png"),
    description: "לחיצת רגליים בזווית",
    category: "gym",
    tags: ["leg press", "רגליים", "לחיצה"],
  },
  {
    id: "leg_curl",
    label: "מכונת כיפוף ברכיים",
    // image: require("../../assets/leg_curl.png"),
    description: "לאימון שרירי הירך האחוריים",
    category: "gym",
    tags: ["leg curl", "כיפוף", "ירך אחורי"],
  },
  {
    id: "leg_extension",
    label: "מכונת יישור ברכיים",
    // image: require("../../assets/leg_extension.png"),
    description: "לאימון שרירי הירך הקדמיים",
    category: "gym",
    tags: ["leg extension", "יישור", "ירך קדמי"],
  },
  {
    id: "chest_press",
    label: "מכונת לחיצת חזה",
    image: require("../../assets/chest_press.png"),
    description: "לחיצת חזה במכונה",
    category: "gym",
    tags: ["chest press", "חזה", "לחיצה"],
  },
  {
    id: "pec_deck",
    label: "מכונת פרפר",
    // image: require("../../assets/pec_deck.png"),
    description: "מכונה לבידוד שרירי החזה",
    category: "gym",
    tags: ["pec deck", "פרפר", "חזה"],
  },
  {
    id: "shoulder_press",
    label: "מכונת לחיצת כתפיים",
    // image: require("../../assets/shoulder_press.png"),
    description: "לחיצת כתפיים במכונה",
    category: "gym",
    tags: ["shoulder press", "כתפיים", "לחיצה"],
  },
  {
    id: "preacher_curl",
    label: "ספסל פריצ'ר",
    image: require("../../assets/preacher_curl.png"),
    description: "לכיפוף מרפקים",
    category: "gym",
    tags: ["preacher", "פריצר", "ביצפס"],
  },

  // ==================== מתקני קרוספיט ====================
  {
    id: "squat_rack",
    label: "כלוב סקוואט",
    image: require("../../assets/squat_rack.png"),
    description: "לסקוואט ולחיצת כתפיים",
    category: "gym",
    tags: ["squat rack", "כלוב", "סקוואט"],
  },
  {
    id: "power_rack",
    label: "כלוב כוח",
    // image: require("../../assets/power_rack.png"),
    description: "כלוב מלא עם בטיחות",
    category: "gym",
    tags: ["power rack", "כלוב כוח", "בטיחות"],
  },
  {
    id: "battle_ropes",
    label: "חבלי קרב",
    // image: require("../../assets/battle_ropes.png"),
    description: "חבלים כבדים לאימוני HIIT",
    category: "both",
    tags: ["battle ropes", "חבלים", "קרב"],
  },
  {
    id: "plyo_box",
    label: "קופסת קפיצה",
    // image: require("../../assets/plyo_box.png"),
    description: "לאימוני פליומטריה",
    category: "both",
    tags: ["plyo box", "קפיצה", "פליומטריה"],
  },
  {
    id: "wall_ball",
    label: "כדור קיר",
    // image: require("../../assets/wall_ball.png"),
    description: "כדור רך לזריקות לקיר",
    category: "both",
    tags: ["wall ball", "כדור קיר", "קרוספיט"],
  },

  // ==================== מכשירי קרדיו ====================
  {
    id: "treadmill",
    label: "הליכון",
    image: require("../../assets/treadmill.png"),
    description: "להליכה וריצה",
    category: "both",
    isPremium: true,
    tags: ["treadmill", "הליכון", "ריצה", "הליכה"],
  },
  {
    id: "stationary_bike",
    label: "אופני כושר",
    image: require("../../assets/bike.png"),
    description: "אופניים נייחים",
    category: "both",
    tags: ["bike", "אופניים", "cycling"],
  },
  {
    id: "spin_bike",
    label: "אופני ספינינג",
    // image: require("../../assets/spin_bike.png"),
    description: "אופני ספינינג מקצועיים",
    category: "both",
    isPremium: true,
    tags: ["spin", "ספינינג", "spinning"],
  },
  {
    id: "elliptical",
    label: "אליפטיקל",
    // image: require("../../assets/elliptical.png"),
    description: "מכשיר אימון אליפטי",
    category: "both",
    tags: ["elliptical", "אליפטיקל", "אליפטי"],
  },
  {
    id: "rowing_machine",
    label: "מכונת חתירה",
    image: require("../../assets/rowing_machine.png"),
    description: "לאימון קרדיו וכוח",
    category: "both",
    tags: ["rowing", "חתירה", "rower"],
  },
  {
    id: "stair_climber",
    label: "מדרגות",
    // image: require("../../assets/stair_climber.png"),
    description: "מכשיר טיפוס מדרגות",
    category: "gym",
    tags: ["stairs", "מדרגות", "טיפוס"],
  },
  {
    id: "air_bike",
    label: "אופני אוויר",
    // image: require("../../assets/air_bike.png"),
    description: "אופניים עם התנגדות אוויר",
    category: "both",
    tags: ["air bike", "assault bike", "אוויר"],
  },

  // ==================== אביזרים נוספים ====================
  {
    id: "weight_belt",
    label: "חגורת משקל",
    // image: require("../../assets/weight_belt.png"),
    description: "להוספת משקל במתח ומקבילים",
    category: "both",
    tags: ["belt", "חגורה", "משקל"],
  },
  {
    id: "lifting_straps",
    label: "רצועות הרמה",
    // image: require("../../assets/lifting_straps.png"),
    description: "לאחיזה טובה יותר",
    category: "both",
    tags: ["straps", "רצועות", "אחיזה"],
  },
  {
    id: "gloves",
    label: "כפפות אימון",
    // image: require("../../assets/gloves.png"),
    description: "להגנה על כפות הידיים",
    category: "both",
    tags: ["gloves", "כפפות", "הגנה"],
  },
  {
    id: "jump_rope",
    label: "חבל קפיצה",
    // image: require("../../assets/jump_rope.png"),
    description: "לאימוני קרדיו וזריזות",
    category: "both",
    tags: ["jump rope", "חבל", "קפיצה"],
  },
  {
    id: "agility_ladder",
    label: "סולם זריזות",
    // image: require("../../assets/agility_ladder.png"),
    description: "לאימוני זריזות וקואורדינציה",
    category: "both",
    tags: ["ladder", "סולם", "זריזות"],
  },
  {
    id: "cones",
    label: "קונוסים",
    // image: require("../../assets/cones.png"),
    description: "לאימוני זריזות",
    category: "both",
    tags: ["cones", "קונוסים", "סימון"],
  },
  {
    id: "balance_board",
    label: "לוח שיווי משקל",
    // image: require("../../assets/balance_board.png"),
    description: "לאימוני שיווי משקל",
    category: "both",
    tags: ["balance", "שיווי משקל", "לוח"],
  },
  {
    id: "bosu_ball",
    label: "כדור בוסו",
    // image: require("../../assets/bosu_ball.png"),
    description: "חצי כדור לאימוני יציבות",
    category: "both",
    tags: ["bosu", "בוסו", "יציבות"],
  },
  {
    id: "stability_ball",
    label: "כדור פיזיו",
    // image: require("../../assets/stability_ball.png"),
    description: "כדור גדול לאימוני יציבות",
    category: "both",
    tags: ["stability ball", "פיזיו", "כדור גדול"],
  },
  {
    id: "ankle_weights",
    label: "משקולות קרסול",
    // image: require("../../assets/ankle_weights.png"),
    description: "משקולות להצמדה לקרסוליים",
    category: "both",
    tags: ["ankle weights", "קרסול", "משקולות קרסול"],
  },
  {
    id: "weighted_vest",
    label: "אפוד משקל",
    // image: require("../../assets/weighted_vest.png"),
    description: "אפוד עם משקל נוסף",
    isPremium: true,
    category: "both",
    tags: ["vest", "אפוד", "משקל"],
  },
];

// פונקציות עזר
// Helper functions

/**
 * מחזיר ציוד לפי קטגוריה
 * Get equipment by category
 */
export function getEquipmentByCategory(
  category: "home" | "gym" | "both",
  includeLocation?: "home" | "gym"
): Equipment[] {
  return ALL_EQUIPMENT.filter((eq) => {
    if (category === "both") return true;
    if (eq.category === "both") return true;
    if (includeLocation && eq.category === includeLocation) return true;
    return eq.category === category;
  });
}

/**
 * חיפוש ציוד לפי טקסט
 * Search equipment by text
 */
export function searchEquipment(searchText: string): Equipment[] {
  const search = searchText.toLowerCase();
  return ALL_EQUIPMENT.filter(
    (eq) =>
      eq.label.toLowerCase().includes(search) ||
      eq.description?.toLowerCase().includes(search) ||
      eq.tags.some((tag) => tag.toLowerCase().includes(search))
  );
}

/**
 * מחזיר ציוד ברירת מחדל
 * Get default equipment
 */
export function getDefaultEquipment(category: "home" | "gym"): string[] {
  return ALL_EQUIPMENT.filter(
    (eq) => eq.isDefault && (eq.category === category || eq.category === "both")
  ).map((eq) => eq.id);
}

/**
 * מחזיר ציוד פרימיום
 * Get premium equipment
 */
export function getPremiumEquipment(): Equipment[] {
  return ALL_EQUIPMENT.filter((eq) => eq.isPremium);
}

/**
 * מיזוג רשימות ציוד
 * Merge equipment lists
 */
export function mergeEquipmentLists(
  homeEquipment: string[],
  gymEquipment: string[]
): string[] {
  return [...new Set([...homeEquipment, ...gymEquipment])];
}
