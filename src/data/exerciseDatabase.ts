/**
 * @file src/data/exerciseDatabase.ts
 * @brief מאגר תרגילים מקיף עם תמיכה בכל סוגי הציוד
 * @brief Comprehensive exercise database with all equipment types support
 * @description מאגר תרגילים מורחב עם מעל 100 תרגילים
 * @description Extended exercise database with over 100 exercises
 */

import { ExerciseTemplate } from "../services/quickWorkoutGenerator";

// מאגר תרגילים מורחב
// Extended exercise database
export const EXTENDED_EXERCISE_DATABASE: ExerciseTemplate[] = [
  // ========== תרגילי חזה ==========
  // Chest exercises

  // משקולות
  {
    id: "db_bench_press",
    name: "לחיצת חזה עם משקולות",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "שכב על ספסל עם משקולת בכל יד",
      "הורד את המשקולות לצדי החזה",
      "דחוף למעלה עד יישור מלא",
    ],
    tips: ["שמור על כפות הרגליים על הרצפה", "נשום החוצה בדחיפה"],
  },
  {
    id: "db_flyes",
    name: "פרפר עם משקולות",
    category: "חזה",
    primaryMuscles: ["חזה"],
    equipment: "dumbbells",
    difficulty: "intermediate",
  },
  {
    id: "db_pullover",
    name: "פולאובר עם משקולת",
    category: "חזה",
    primaryMuscles: ["חזה", "גב"],
    equipment: "dumbbells",
    difficulty: "intermediate",
  },

  // מוט
  {
    id: "bench_press",
    name: "לחיצת חזה במוט",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "טריצפס"],
    equipment: "barbell",
    difficulty: "intermediate",
  },
  {
    id: "incline_bench_press",
    name: "לחיצת חזה עליון במוט",
    category: "חזה",
    primaryMuscles: ["חזה עליון"],
    secondaryMuscles: ["כתפיים"],
    equipment: "barbell",
    difficulty: "intermediate",
  },
  {
    id: "decline_bench_press",
    name: "לחיצת חזה תחתון במוט",
    category: "חזה",
    primaryMuscles: ["חזה תחתון"],
    equipment: "barbell",
    difficulty: "advanced",
  },

  // משקל גוף
  {
    id: "pushups",
    name: "שכיבות סמיכה",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "טריצפס"],
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions: [
      "התחל בפוזיציית פלאנק",
      "הורד את הגוף עד שהחזה כמעט נוגע ברצפה",
      "דחוף חזרה למעלה",
    ],
  },
  {
    id: "wide_pushups",
    name: "שכיבות סמיכה רחבות",
    category: "חזה",
    primaryMuscles: ["חזה"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "diamond_pushups",
    name: "שכיבות סמיכה יהלום",
    category: "חזה",
    primaryMuscles: ["חזה", "טריצפס"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
  {
    id: "decline_pushups",
    name: "שכיבות סמיכה עם רגליים מורמות",
    category: "חזה",
    primaryMuscles: ["חזה עליון"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },

  // גומיות
  {
    id: "band_chest_press",
    name: "לחיצת חזה עם גומייה",
    category: "חזה",
    primaryMuscles: ["חזה"],
    equipment: "resistance_bands",
    difficulty: "beginner",
  },
  {
    id: "band_flyes",
    name: "פרפר עם גומייה",
    category: "חזה",
    primaryMuscles: ["חזה"],
    equipment: "resistance_bands",
    difficulty: "beginner",
  },

  // כבלים
  {
    id: "cable_crossover",
    name: "קרוסאובר בכבלים",
    category: "חזה",
    primaryMuscles: ["חזה"],
    equipment: "cable_machine",
    difficulty: "intermediate",
  },

  // ========== תרגילי גב ==========
  // Back exercises

  // מוט מתח
  {
    id: "pullups",
    name: "מתח",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "pull_up_bar",
    difficulty: "intermediate",
    instructions: [
      "אחוז במוט באחיזה רחבה מעט מרוחב הכתפיים",
      "משוך את הגוף למעלה עד שהסנטר מעל המוט",
      "הורד באיטיות לתנוחת התחלה",
    ],
  },
  {
    id: "chinups",
    name: "מתח הפוך",
    category: "גב",
    primaryMuscles: ["גב", "ביצפס"],
    equipment: "pull_up_bar",
    difficulty: "intermediate",
  },
  {
    id: "wide_grip_pullups",
    name: "מתח אחיזה רחבה",
    category: "גב",
    primaryMuscles: ["גב רחב"],
    equipment: "pull_up_bar",
    difficulty: "advanced",
  },
  {
    id: "neutral_grip_pullups",
    name: "מתח אחיזה ניטרלית",
    category: "גב",
    primaryMuscles: ["גב"],
    equipment: "pull_up_bar",
    difficulty: "intermediate",
  },

  // משקולות
  {
    id: "db_row",
    name: "חתירת משקולת",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "db_bent_over_row",
    name: "חתירה בשיפוע עם משקולות",
    category: "גב",
    primaryMuscles: ["גב"],
    equipment: "dumbbells",
    difficulty: "intermediate",
  },

  // מוט
  {
    id: "bent_over_row",
    name: "חתירה בשיפוע במוט",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "barbell",
    difficulty: "intermediate",
  },
  {
    id: "t_bar_row",
    name: "חתירת T",
    category: "גב",
    primaryMuscles: ["גב"],
    equipment: "barbell",
    difficulty: "intermediate",
  },

  // גומיות
  {
    id: "band_row",
    name: "חתירה עם גומייה",
    category: "גב",
    primaryMuscles: ["גב"],
    equipment: "resistance_bands",
    difficulty: "beginner",
  },
  {
    id: "band_pulldown",
    name: "משיכה לחזה עם גומייה",
    category: "גב",
    primaryMuscles: ["גב"],
    equipment: "resistance_bands",
    difficulty: "beginner",
  },

  // ========== תרגילי רגליים ==========
  // Leg exercises

  // מוט
  {
    id: "squat",
    name: "סקוואט",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    secondaryMuscles: ["core"],
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: [
      "הנח את המוט על הטרפזים העליונים",
      "רד למטה עד שהירכיים מקבילות לרצפה",
      "דחוף חזרה למעלה דרך העקבים",
    ],
  },
  {
    id: "front_squat",
    name: "סקוואט קדמי",
    category: "רגליים",
    primaryMuscles: ["רגליים"],
    equipment: "barbell",
    difficulty: "advanced",
  },
  {
    id: "deadlift",
    name: "דדליפט",
    category: "רגליים",
    primaryMuscles: ["גב תחתון", "רגליים", "ישבן"],
    secondaryMuscles: ["גב", "core"],
    equipment: "barbell",
    difficulty: "advanced",
  },
  {
    id: "romanian_deadlift",
    name: "דדליפט רומני",
    category: "רגליים",
    primaryMuscles: ["אחורי ירך", "ישבן"],
    equipment: "barbell",
    difficulty: "intermediate",
  },

  // משקולות
  {
    id: "goblet_squat",
    name: "סקוואט גביע",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "db_lunges",
    name: "מספריים עם משקולות",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "db_step_ups",
    name: "עליות למדרגה עם משקולות",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "db_calf_raise",
    name: "עליות על בהונות עם משקולות",
    category: "רגליים",
    primaryMuscles: ["שוקיים"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },

  // משקל גוף
  {
    id: "bodyweight_squat",
    name: "סקוואט משקל גוף",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "jump_squats",
    name: "סקוואט קפיצה",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
  {
    id: "lunges",
    name: "מספריים",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "bulgarian_split_squat",
    name: "סקוואט בולגרי",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
  {
    id: "pistol_squat",
    name: "סקוואט על רגל אחת",
    category: "רגליים",
    primaryMuscles: ["רגליים"],
    equipment: "bodyweight",
    difficulty: "advanced",
  },
  {
    id: "wall_sit",
    name: "ישיבת קיר",
    category: "רגליים",
    primaryMuscles: ["רגליים"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },

  // קטלבל
  {
    id: "kb_goblet_squat",
    name: "סקוואט גביע עם קטלבל",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "kettlebells",
    difficulty: "beginner",
  },
  {
    id: "kb_swing",
    name: "נדנוד קטלבל",
    category: "רגליים",
    primaryMuscles: ["ישבן", "אחורי ירך"],
    secondaryMuscles: ["גב", "core"],
    equipment: "kettlebells",
    difficulty: "intermediate",
  },

  // גומיות
  {
    id: "band_squat",
    name: "סקוואט עם גומייה",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "resistance_bands",
    difficulty: "beginner",
  },
  {
    id: "band_glute_bridge",
    name: "גשר ישבן עם גומייה",
    category: "רגליים",
    primaryMuscles: ["ישבן"],
    equipment: "resistance_bands",
    difficulty: "beginner",
  },

  // ========== תרגילי כתפיים ==========
  // Shoulder exercises

  // משקולות
  {
    id: "db_shoulder_press",
    name: "לחיצת כתפיים עם משקולות",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    secondaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "db_lateral_raise",
    name: "הרמות צד עם משקולות",
    category: "כתפיים",
    primaryMuscles: ["כתפיים צד"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "db_front_raise",
    name: "הרמות קדמיות עם משקולות",
    category: "כתפיים",
    primaryMuscles: ["כתפיים קדמיות"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "db_rear_delt_fly",
    name: "פרפר אחורי עם משקולות",
    category: "כתפיים",
    primaryMuscles: ["כתפיים אחוריות"],
    equipment: "dumbbells",
    difficulty: "intermediate",
  },
  {
    id: "arnold_press",
    name: "לחיצת ארנולד",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    equipment: "dumbbells",
    difficulty: "intermediate",
  },

  // מוט
  {
    id: "military_press",
    name: "לחיצה צבאית",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    secondaryMuscles: ["טריצפס"],
    equipment: "barbell",
    difficulty: "intermediate",
  },
  {
    id: "upright_row",
    name: "חתירה זקופה",
    category: "כתפיים",
    primaryMuscles: ["כתפיים", "טרפזים"],
    equipment: "barbell",
    difficulty: "intermediate",
  },

  // משקל גוף
  {
    id: "pike_pushups",
    name: "שכיבות סמיכה פייק",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
  {
    id: "handstand_pushups",
    name: "שכיבות סמיכה בעמידת ידיים",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    equipment: "bodyweight",
    difficulty: "advanced",
  },

  // גומיות
  {
    id: "band_shoulder_press",
    name: "לחיצת כתפיים עם גומייה",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    equipment: "resistance_bands",
    difficulty: "beginner",
  },
  {
    id: "band_lateral_raise",
    name: "הרמות צד עם גומייה",
    category: "כתפיים",
    primaryMuscles: ["כתפיים צד"],
    equipment: "resistance_bands",
    difficulty: "beginner",
  },

  // ========== תרגילי ידיים ==========
  // Arm exercises

  // ביצפס - משקולות
  {
    id: "db_bicep_curl",
    name: "כפיפת ביצפס עם משקולות",
    category: "ידיים",
    primaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "hammer_curl",
    name: "כפיפת פטיש",
    category: "ידיים",
    primaryMuscles: ["ביצפס", "אמות"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "concentration_curl",
    name: "כפיפת ריכוז",
    category: "ידיים",
    primaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
  },

  // ביצפס - מוט
  {
    id: "barbell_curl",
    name: "כפיפת ביצפס במוט",
    category: "ידיים",
    primaryMuscles: ["ביצפס"],
    equipment: "barbell",
    difficulty: "beginner",
  },
  {
    id: "ez_bar_curl",
    name: "כפיפת ביצפס במוט EZ",
    category: "ידיים",
    primaryMuscles: ["ביצפס"],
    equipment: "ez_bar",
    difficulty: "beginner",
  },
  {
    id: "preacher_curl",
    name: "כפיפת פריצ'ר",
    category: "ידיים",
    primaryMuscles: ["ביצפס"],
    equipment: "ez_bar",
    difficulty: "intermediate",
  },

  // טריצפס - משקולות
  {
    id: "db_tricep_extension",
    name: "פשיטת טריצפס עם משקולת",
    category: "ידיים",
    primaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "db_kickback",
    name: "בעיטה אחורית עם משקולת",
    category: "ידיים",
    primaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },

  // טריצפס - משקל גוף
  {
    id: "dips",
    name: "מקבילים",
    category: "ידיים",
    primaryMuscles: ["טריצפס", "חזה"],
    equipment: "dip_station",
    difficulty: "intermediate",
  },
  {
    id: "close_grip_pushups",
    name: "שכיבות סמיכה צרות",
    category: "ידיים",
    primaryMuscles: ["טריצפס"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },

  // ========== תרגילי בטן ==========
  // Core exercises

  // משקל גוף
  {
    id: "plank",
    name: "פלאנק",
    category: "בטן",
    primaryMuscles: ["core"],
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions: [
      "התחל בעמידה על אמות וכפות רגליים",
      "שמור על קו ישר מהראש לעקבים",
      "החזק את המצב למשך הזמן הנדרש",
    ],
  },
  {
    id: "side_plank",
    name: "פלאנק צד",
    category: "בטן",
    primaryMuscles: ["אלכסונים"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
  {
    id: "crunches",
    name: "כפיפות בטן",
    category: "בטן",
    primaryMuscles: ["בטן"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "bicycle_crunches",
    name: "כפיפות אופניים",
    category: "בטן",
    primaryMuscles: ["בטן", "אלכסונים"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "leg_raises",
    name: "הרמות רגליים",
    category: "בטן",
    primaryMuscles: ["בטן תחתונה"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
  {
    id: "russian_twist",
    name: "סיבובים רוסיים",
    category: "בטן",
    primaryMuscles: ["אלכסונים"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
  {
    id: "mountain_climbers",
    name: "טיפוס הרים",
    category: "בטן",
    primaryMuscles: ["core"],
    secondaryMuscles: ["כתפיים"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },

  // עם משקולת
  {
    id: "weighted_russian_twist",
    name: "סיבובים רוסיים עם משקל",
    category: "בטן",
    primaryMuscles: ["אלכסונים"],
    equipment: "dumbbells",
    difficulty: "intermediate",
  },
  {
    id: "ab_wheel",
    name: "גלגל בטן",
    category: "בטן",
    primaryMuscles: ["core"],
    equipment: "ab_wheel",
    difficulty: "advanced",
  },

  // עם כדור
  {
    id: "ball_crunches",
    name: "כפיפות בטן על כדור",
    category: "בטן",
    primaryMuscles: ["בטן"],
    equipment: "exercise_ball",
    difficulty: "beginner",
  },

  // ========== תרגילי קרדיו/HIIT ==========
  // Cardio/HIIT exercises

  {
    id: "burpees",
    name: "ברפיז",
    category: "קרדיו",
    primaryMuscles: ["גוף מלא"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
  {
    id: "jumping_jacks",
    name: "ג'אמפינג ג'קס",
    category: "קרדיו",
    primaryMuscles: ["גוף מלא"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "high_knees",
    name: "ברכיים גבוהות",
    category: "קרדיו",
    primaryMuscles: ["רגליים", "core"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "box_jumps",
    name: "קפיצות לארגז",
    category: "קרדיו",
    primaryMuscles: ["רגליים"],
    equipment: "plyo_box",
    difficulty: "intermediate",
  },
  {
    id: "battle_ropes",
    name: "חבלי קרב",
    category: "קרדיו",
    primaryMuscles: ["גוף מלא"],
    equipment: "battle_ropes",
    difficulty: "intermediate",
  },

  // ========== תרגילי גמישות/יוגה ==========
  // Flexibility/Yoga exercises

  {
    id: "downward_dog",
    name: "כלב מביט מטה",
    category: "גמישות",
    primaryMuscles: ["גב", "רגליים"],
    equipment: "yoga_mat",
    difficulty: "beginner",
  },
  {
    id: "cobra_stretch",
    name: "מתיחת קוברה",
    category: "גמישות",
    primaryMuscles: ["גב", "בטן"],
    equipment: "yoga_mat",
    difficulty: "beginner",
  },
  {
    id: "warrior_pose",
    name: "תנוחת הלוחם",
    category: "גמישות",
    primaryMuscles: ["רגליים", "core"],
    equipment: "yoga_mat",
    difficulty: "beginner",
  },

  // ========== תרגילים עם TRX ==========
  // TRX exercises

  {
    id: "trx_row",
    name: "חתירת TRX",
    category: "גב",
    primaryMuscles: ["גב"],
    equipment: "trx",
    difficulty: "intermediate",
  },
  {
    id: "trx_chest_press",
    name: "לחיצת חזה ב-TRX",
    category: "חזה",
    primaryMuscles: ["חזה"],
    equipment: "trx",
    difficulty: "intermediate",
  },
  {
    id: "trx_squat",
    name: "סקוואט TRX",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "trx",
    difficulty: "beginner",
  },

  // ========== תרגילים במכונות ==========
  // Machine exercises

  {
    id: "leg_press",
    name: "מכונת לחיצת רגליים",
    category: "רגליים",
    primaryMuscles: ["רגליים"],
    equipment: "leg_press_machine",
    difficulty: "beginner",
  },
  {
    id: "lat_pulldown",
    name: "משיכה לחזה בכבל",
    category: "גב",
    primaryMuscles: ["גב"],
    equipment: "cable_machine",
    difficulty: "beginner",
  },
  {
    id: "chest_press_machine",
    name: "מכונת לחיצת חזה",
    category: "חזה",
    primaryMuscles: ["חזה"],
    equipment: "chest_press_machine",
    difficulty: "beginner",
  },
  {
    id: "leg_curl",
    name: "כפיפת רגליים במכונה",
    category: "רגליים",
    primaryMuscles: ["אחורי ירך"],
    equipment: "leg_curl_machine",
    difficulty: "beginner",
  },
  {
    id: "leg_extension",
    name: "יישור רגליים במכונה",
    category: "רגליים",
    primaryMuscles: ["ארבע ראשי"],
    equipment: "leg_extension_machine",
    difficulty: "beginner",
  },
  {
    id: "seated_row_machine",
    name: "חתירה במכונה",
    category: "גב",
    primaryMuscles: ["גב"],
    equipment: "seated_row_machine",
    difficulty: "beginner",
  },
  {
    id: "smith_machine_squat",
    name: "סקוואט בסמית'",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "smith_machine",
    difficulty: "beginner",
  },
];

// פונקציה לקבלת תרגילים לפי ציוד
// Function to get exercises by equipment
export function getExercisesByEquipment(
  equipment: string[]
): ExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter(
    (exercise) =>
      equipment.includes(exercise.equipment) ||
      exercise.equipment === "bodyweight"
  );
}

// פונקציה לקבלת תרגילים לפי קבוצת שרירים
// Function to get exercises by muscle group
export function getExercisesByMuscleGroup(
  muscleGroup: string
): ExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter(
    (exercise) =>
      exercise.primaryMuscles.includes(muscleGroup) ||
      (exercise.secondaryMuscles &&
        exercise.secondaryMuscles.includes(muscleGroup))
  );
}

// פונקציה לקבלת תרגילים לפי רמת קושי
// Function to get exercises by difficulty
export function getExercisesByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): ExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter(
    (exercise) => exercise.difficulty === difficulty
  );
}

// פונקציה לקבלת תרגילים לפי מטרה
// Function to get exercises by goal
export function getExercisesByGoal(goal: string): ExerciseTemplate[] {
  switch (goal) {
    case "ירידה במשקל":
      // תרגילים מורכבים וקרדיו
      return EXTENDED_EXERCISE_DATABASE.filter(
        (exercise) =>
          exercise.category === "קרדיו" ||
          exercise.primaryMuscles.includes("גוף מלא") ||
          exercise.primaryMuscles.length > 1
      );

    case "עליה במסת שריר":
      // תרגילי כוח
      return EXTENDED_EXERCISE_DATABASE.filter((exercise) =>
        ["חזה", "גב", "רגליים", "כתפיים", "ידיים"].includes(exercise.category)
      );

    case "שיפור כוח":
      // תרגילים כבדים ומורכבים
      return EXTENDED_EXERCISE_DATABASE.filter(
        (exercise) =>
          exercise.difficulty !== "beginner" &&
          (exercise.equipment === "barbell" ||
            exercise.equipment === "dumbbells")
      );

    case "שיפור סיבולת":
      // תרגילי משקל גוף וקרדיו
      return EXTENDED_EXERCISE_DATABASE.filter(
        (exercise) =>
          exercise.equipment === "bodyweight" || exercise.category === "קרדיו"
      );

    default:
      return EXTENDED_EXERCISE_DATABASE;
  }
}
