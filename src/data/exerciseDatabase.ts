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

  // משקל גוף
  {
    id: "superman",
    name: "סופרמן",
    category: "גב",
    primaryMuscles: ["גב", "גב תחתון"],
    secondaryMuscles: ["ישבן"],
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions: [
      "שכב על הבטן עם הידיים מושטות קדימה",
      "הרם בו זמנית את החזה והרגליים מהרצפה",
      "החזק לכמה שניות ורד באיטיות",
    ],
    tips: ["התמקד בכיווץ שרירי הגב", "אל תמתח יותר מדי את הצוואר"],
  },
  {
    id: "reverse_plank",
    name: "פלאנק הפוך",
    category: "גב",
    primaryMuscles: ["גב", "גב תחתון"],
    secondaryMuscles: ["ישבן", "אחורי ירך"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    instructions: [
      "שב עם הרגליים מושטות והידיים מאחורה",
      "הרם את האגן ויצור קו ישר מראש ועד רגליים",
      "החזק את התנוחה כמה שיותר זמן",
    ],
  },
  {
    id: "prone_y_raises",
    name: "הרמות Y בשכיבה",
    category: "גב",
    primaryMuscles: ["גב עליון", "כתפיים"],
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions: [
      "שכב על הבטן עם הידיים יוצרות צורת Y",
      "הרם את הידיים והחזה מהרצפה",
      "החזק וחזור לתנוחת התחלה",
    ],
  },
  {
    id: "prone_t_raises",
    name: "הרמות T בשכיבה",
    category: "גב",
    primaryMuscles: ["גב עליון", "כתפיים אחוריות"],
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions: [
      "שכב על הבטן עם הידיים לצדדים ברמת הכתפיים",
      "הרם את הידיים והחזה מהרצפה",
      "סחוט את לוחות הכתף יחד",
    ],
  },
  {
    id: "wall_handstand_hold",
    name: "עמידת ידיים על קיר",
    category: "גב",
    primaryMuscles: ["גב", "כתפיים"],
    secondaryMuscles: ["core", "ידיים"],
    equipment: "bodyweight",
    difficulty: "advanced",
    instructions: [
      "התחל במצב פלאנק מול קיר",
      "הלך עם הרגליים על הקיר למעלה",
      "החזק את עמידת הידיים כמה שיותר זמן",
    ],
  },
  {
    id: "bridge_reverse_flies",
    name: "פרפר הפוך בגשר",
    category: "גב",
    primaryMuscles: ["גב עליון", "כתפיים אחוריות"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    instructions: [
      "שכב על הגב בתנוחת גשר (ברכיים כפופות)",
      "הרם את הזרועות לצדדים כמו פרפר",
      "סחוט את לוחות הכתף",
    ],
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

  // ========== תרגילי משקולות חופשיות נוספים - 50 תרגילים ==========
  // Additional free weights exercises - 50 exercises

  // === חזה - תרגילים נוספים ===
  {
    id: "db_incline_press_45",
    name: "לחיצת חזה עליון 45 מעלות עם משקולות",
    category: "חזה",
    primaryMuscles: ["חזה עליון"],
    secondaryMuscles: ["כתפיים קדמיות", "טריצפס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "שכב על ספסל בזווית 45 מעלות",
      "החזק משקולות ברמת החזה העליון",
      "דחוף למעלה בקו ישר",
    ],
    tips: ["אל תגביה את הכתפיים", "שלוט בירידה"],
  },
  {
    id: "db_decline_press",
    name: "לחיצת חזה תחתון עם משקולות",
    category: "חזה",
    primaryMuscles: ["חזה תחתון"],
    secondaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "שכב על ספסל בזווית ירידה",
      "החזק משקולות ברמת החזה התחתון",
      "דחוף למעלה בזווית הספסל",
    ],
    tips: ["שמור על יציבות", "נשום נכון"],
  },
  {
    id: "db_squeeze_press",
    name: "לחיצת דחיסה עם משקולות",
    category: "חזה",
    primaryMuscles: ["חזה פנימי"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "החזק משקולות במרכז החזה",
      "לחץ את המשקולות זו לזו",
      "דחוף למעלה תוך לחיצה",
    ],
    tips: ["דגש על לחיצה פנימית", "תנועה איטית ומבוקרת"],
  },
  {
    id: "single_arm_db_press",
    name: "לחיצת חזה ביד אחת",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["ליבה", "כתפיים"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "שכב על ספסל עם משקולת ביד אחת",
      "היד החופשית על הבטן ליציבות",
      "דחוף בזהירות למעלה",
    ],
    tips: ["שמור על איזון", "התחל במשקל קל"],
  },

  // === גב - תרגילים נוספים ===
  {
    id: "db_bentover_row_single",
    name: "חתירה כפופה ביד אחת",
    category: "גב",
    primaryMuscles: ["גב רחב", "גב אמצעי"],
    secondaryMuscles: ["ביצפס", "כתפיים אחוריות"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "הישען על ספסל ביד ורגל",
      "החזק משקולת ביד החופשית",
      "משוך למעלה לכיוון הצלעות",
    ],
    tips: ["גב ישר", "משוך בלהב הכתף"],
  },
  {
    id: "db_wide_row",
    name: "חתירה רחבה עם משקולות",
    category: "גב",
    primaryMuscles: ["גב רחב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "כפוף קדימה עם משקולות בידיים",
      "משוך החוצה במסלול רחב",
      "דגש על לחיצת לוחות הכתף",
    ],
    tips: ["קפיץ את החזה", "תנועה איטית"],
  },
  {
    id: "db_reverse_fly",
    name: "פרפר הפוך עם משקולות",
    category: "גב",
    primaryMuscles: ["כתפיים אחוריות", "גב עליון"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "כפוף קדימה עם משקולות קלות",
      "הרם הצדה במסלול מעוקל",
      "דגש על כתפיים אחוריות",
    ],
    tips: ["אל תשתמש במומנטום", "משקולות קלות"],
  },
  {
    id: "db_deadlift_single_leg",
    name: "דדליפט על רגל אחת",
    category: "גב",
    primaryMuscles: ["גב תחתון", "האמסטרינג"],
    secondaryMuscles: ["גלוטס", "ליבה"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "עמוד על רגל אחת עם משקולות",
      "כפוף קדימה תוך הרמת הרגל האחורית",
      "חזור למעלה בשליטה",
    ],
    tips: ["התחל ללא משקל", "דגש על איזון"],
  },

  // === כתפיים - תרגילים נוספים ===
  {
    id: "db_arnold_press",
    name: "לחיצת ארנולד עם משקולות",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    secondaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "התחל עם משקולות מול החזה",
      "סובב והרם בתנועה מעוקלת",
      "סיים עם כפות פונות החוצה",
    ],
    tips: ["תנועה איטית ומבוקרת", "אל תגזים במשקל"],
  },
  {
    id: "db_lateral_raise_seated",
    name: "הרמות צד יושב",
    category: "כתפיים",
    primaryMuscles: ["כתפיים צדיות"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "שב עם משקולות לצד הגוף",
      "הרם הצדה עד גובה הכתפיים",
      "הורד בשליטה",
    ],
    tips: ["גב צמוד לספסל", "אל תנדנד"],
  },
  {
    id: "db_front_raise_alternating",
    name: "הרמות קדמיות לסירוגין",
    category: "כתפיים",
    primaryMuscles: ["כתפיים קדמיות"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "עמוד עם משקולות לצד הגוף",
      "הרם יד אחת קדימה עד גובה הכתפיים",
      "החלף ידיים בקצב שמור",
    ],
    tips: ["עמידה יציבה", "שלוט בתנועה"],
  },
  {
    id: "db_upright_row",
    name: "חתירה זקופה עם משקולות",
    category: "כתפיים",
    primaryMuscles: ["כתפיים", "טרפז עליון"],
    secondaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "החזק משקולות מול הגוף",
      "משוך למעלה לכיוון הסנטר",
      "מרפקים גבוהים מהידיים",
    ],
    tips: ["אל תרים מעל הכתפיים", "תחזוק יציבות"],
  },

  // === ביצפס - תרגילים נוספים ===
  {
    id: "db_hammer_curl_seated",
    name: "פטיש יושב עם משקולות",
    category: "ביצפס",
    primaryMuscles: ["ביצפס", "ברכיאליס"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "שב עם משקולות בקיפה ניטרלית",
      "כופף את הזרועות כמו פטיש",
      "דגש על שליטה בירידה",
    ],
    tips: ["גב צמוד לספסל", "אל תנדנד"],
  },
  {
    id: "db_incline_curl",
    name: "כפיפות על ספסל נטוי",
    category: "ביצפס",
    primaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "שכב על ספסל נטוי עם משקולות",
      "כופף בטווח תנועה מלא",
      "הרגש מתיחה בתחתית",
    ],
    tips: ["אל תניח את הזרועות לגמרי", "תנועה מבוקרת"],
  },
  {
    id: "db_concentration_curl",
    name: "כפיפות ריכוז עם משקולת",
    category: "ביצפס",
    primaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "שב והישען עם המרפק על הירך",
      "כופף רק את האמה",
      "ריכוז מלא בביצפס",
    ],
    tips: ["תנועה איטית", "דגש על שיא הכיווץ"],
  },
  {
    id: "db_zottman_curl",
    name: "כפיפות זוטמן עם משקולות",
    category: "ביצפס",
    primaryMuscles: ["ביצפס", "אמה"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "כופף בקיפה תחתונה",
      "בשיא הכיווץ סובב לקיפה עליונה",
      "הורד איטי בקיפה עליונה",
    ],
    tips: ["שילוב של שני סוגי כפיפות", "תנועה מתקדמת"],
  },

  // === טריצפס - תרגילים נוספים ===
  {
    id: "db_overhead_extension_seated",
    name: "הרחבות טריצפס יושב",
    category: "טריצפס",
    primaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "שב עם משקולת מעל הראש",
      "הורד מאחורי הראש",
      "החזר למעלה בשליטה",
    ],
    tips: ["מרפקים קבועים", "גב ישר"],
  },
  {
    id: "db_kickback",
    name: "בעיטות טריצפס עם משקולת",
    category: "טריצפס",
    primaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "כפוף קדימה עם משקולת ביד",
      "זוע מקבילה לרצפה",
      "יישר את האמה אחורה",
    ],
    tips: ["זוע קבועה", "דגש על שיא הכיווץ"],
  },
  {
    id: "db_close_grip_press",
    name: "לחיצה צרה עם משקולות",
    category: "טריצפס",
    primaryMuscles: ["טריצפס"],
    secondaryMuscles: ["חזה פנימי"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "שכב עם משקולות צמודות",
      "דחוף למעלה בתנועה צרה",
      "דגש על טריצפס",
    ],
    tips: ["מרפקים צמודים לגוף", "טווח תנועה מלא"],
  },
  {
    id: "db_tate_press",
    name: "לחיצת טייט עם משקולות",
    category: "טריצפס",
    primaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "שכב עם משקולות מעל החזה",
      "הורד אלכסונית לכיוון החזה העליון",
      "דחוף חזרה במסלול ישר",
    ],
    tips: ["תנועה מתקדמת", "שלוט במסלול"],
  },

  // === רגליים - תרגילים נוספים ===
  {
    id: "db_split_squat",
    name: "סקוואט פצוע עם משקולות",
    category: "רגליים",
    primaryMuscles: ["קוואדריצפס", "גלוטס"],
    secondaryMuscles: ["ליבה"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "עמידה בפיצול רגליים",
      "רגל אחורית על ספסל",
      "ירד במשקל על הרגל הקדמית",
    ],
    tips: ["רגל קדמית יציבה", "ירידה מבוקרת"],
  },
  {
    id: "db_step_up",
    name: "עליות על קופסה עם משקולות",
    category: "רגליים",
    primaryMuscles: ["קוואדריצפס", "גלוטס"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "עמוד מול קופסה יציבה",
      "עלה עם רגל אחת תוך החזקת משקולות",
      "הורד בשליטה",
    ],
    tips: ["קופסה יציבה", "עליה מלאה"],
  },
  {
    id: "db_calf_raise_seated",
    name: "עליות שוקיים יושב עם משקולת",
    category: "רגליים",
    primaryMuscles: ["שוקיים"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "שב עם משקולת על הירכיים",
      "עמוד על קצות האצבעות",
      "העמד לשיא הכיווץ",
    ],
    tips: ["טווח תנועה מלא", "כיווץ בשיא"],
  },
  {
    id: "db_single_leg_rdl",
    name: "דדליפט רומני על רגל אחת",
    category: "רגליים",
    primaryMuscles: ["האמסטרינג", "גלוטס"],
    secondaryMuscles: ["ליבה"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "עמוד על רגל אחת עם משקולת",
      "כפוף קדימה תוך הרמת הרגל האחורית",
      "חזור למעלה בשליטה",
    ],
    tips: ["איזון חשוב", "תנועה איטית"],
  },

  // === בטן וליבה - תרגילים נוספים ===
  {
    id: "db_russian_twist",
    name: "סיבובים רוסיים עם משקולת",
    category: "בטן",
    primaryMuscles: ["בטן צדיות", "ליבה"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "שב עם רגליים מורמות",
      "החזק משקולת בשתי ידיים",
      "סובב מצד לצד",
    ],
    tips: ["שמור על זווית הגוף", "תנועה מבוקרת"],
  },
  {
    id: "db_woodchopper",
    name: "חיתוך עץ עם משקולת",
    category: "בטן",
    primaryMuscles: ["בטן צדיות", "ליבה"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "עמוד עם משקולת בשתי ידיים",
      "חתוך אלכסונית מלמעלה למטה",
      "החלף צדדים",
    ],
    tips: ["סובב את כל הגוף", "שמור על יציבות"],
  },
  {
    id: "db_side_bend",
    name: "כפיפות צד עם משקולת",
    category: "בטן",
    primaryMuscles: ["בטן צדיות"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "עמוד עם משקולת ביד אחת",
      "כפוף הצדה",
      "חזור למרכז ובצע לצד השני",
    ],
    tips: ["תנועה נקייה הצדה", "אל תכפוף קדימה"],
  },

  // === גוף מלא - תרגילים מורכבים ===
  {
    id: "db_man_maker",
    name: "יצרן גברים עם משקולות",
    category: "גוף מלא",
    primaryMuscles: ["גוף מלא"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "עמוד עם משקולות",
      "רד לדחיפה, בצע חתירה, קפוץ למעלה",
      "סיים עם לחיצה מעל הראש",
    ],
    tips: ["תרגיל מורכב מאוד", "התחל עם משקל קל"],
  },
  {
    id: "db_thruster",
    name: "דחיפה מעל הראש מסקוואט",
    category: "גוף מלא",
    primaryMuscles: ["רגליים", "כתפיים"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "החזק משקולות על הכתפיים",
      "בצע סקוואט",
      "בעליה דחוף מעל הראש",
    ],
    tips: ["תנועה אקספלוסיבית", "שמור על יציבות"],
  },
  {
    id: "db_turkish_getup",
    name: "קימה טורקית עם משקולת",
    category: "גוף מלא",
    primaryMuscles: ["ליבה", "כתפיים"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "שכב עם משקולת מורמת",
      "קום לעמידה תוך שמירה על המשקולת למעלה",
      "חזור לשכיבה בשליטה",
    ],
    tips: ["תרגיל מורכב מאוד", "למד את הטכניקה קודם"],
  },
  {
    id: "db_clean_and_press",
    name: "הרמה ולחיצה עם משקולות",
    category: "גוף מלא",
    primaryMuscles: ["כתפיים", "רגליים"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "הרם משקולות מהרצפה לכתפיים",
      "דחוף מעל הראש בתנועה אחת",
      "הורד בשליטה",
    ],
    tips: ["תנועה טכנית", "התפתח הדרגתי"],
  },

  // === איזון ויציבות ===
  {
    id: "db_single_arm_farmers_walk",
    name: "הליכת חקלאי ביד אחת",
    category: "ליבה",
    primaryMuscles: ["ליבה", "אחיזה"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "החזק משקולת כבדה ביד אחת",
      "הלך במרחק קצוב",
      "שמור על יציבות הגוף",
    ],
    tips: ["התחל במרחקים קצרים", "דגש על יציבות"],
  },
  {
    id: "db_suitcase_deadlift",
    name: "דדליפט מזוודה עם משקולת",
    category: "ליבה",
    primaryMuscles: ["ליבה", "גב"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: ["עמוד לצד משקולת כבדה", "הרם כמו מזוודה", "שמור על גב ישר"],
    tips: ["אל תטה הצדה", "הפעל את הליבה"],
  },

  // === תלת ראשי - תרגילים נוספים ===
  {
    id: "db_shrug",
    name: "משיכת כתפיים עם משקולות",
    category: "גב",
    primaryMuscles: ["טרפז עליון"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "עמוד עם משקולות לצד הגוף",
      "משוך כתפיים למעלה",
      "הורד בשליטה",
    ],
    tips: ["אל תסובב כתפיים", "תנועה ישרה למעלה"],
  },
  {
    id: "db_reverse_lunge",
    name: "צעד אחורה עם משקולות",
    category: "רגליים",
    primaryMuscles: ["קוואדריצפס", "גלוטס"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "עמוד עם משקולות בידיים",
      "צעד אחורה וירד לכיווי הרצפה",
      "חזור למצב התחלה",
    ],
    tips: ["שמור על יציבות", "רגל קדמית יציבה"],
  },
  {
    id: "db_stiff_leg_deadlift",
    name: "דדליפט רגליים ישרות עם משקולות",
    category: "רגליים",
    primaryMuscles: ["האמסטרינג", "גלוטס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "עמוד עם רגליים ישרות",
      "כפוף מהמותניים עם משקולות",
      "הרגש מתיחה באחורי הירך",
    ],
    tips: ["רגליים כמעט ישרות", "תנועה מהמותניים"],
  },
  {
    id: "db_farmer_walk",
    name: "הליכת חקלאי עם משקולות",
    category: "גוף מלא",
    primaryMuscles: ["ליבה", "אחיזה", "כתפיים"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "החזק משקולות כבדות בשתי הידיים",
      "הלך במרחק מתוכנן",
      "שמור על גוף זקוף",
    ],
    tips: ["התחל במרחקים קצרים", "נשימה רגועה"],
  },
  {
    id: "db_overhead_carry",
    name: "נשיאה מעל הראש עם משקולות",
    category: "כתפיים",
    primaryMuscles: ["כתפיים", "ליבה"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "החזק משקולות מעל הראש",
      "הלך תוך שמירה על המשקולות למעלה",
      "שמור על יציבות הליבה",
    ],
    tips: ["זרועות נעולות", "הליכה איטית"],
  },
  {
    id: "db_goblet_squat_pulse",
    name: "סקוואט גביע עם דפיקות",
    category: "רגליים",
    primaryMuscles: ["רגליים", "גלוטס"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "החזק משקולת מול החזה",
      "בצע סקוואט ובתחתית דפק 3 פעמים",
      "קום למעלה",
    ],
    tips: ["דפיקות קטנות", "שמור על יציבות"],
  },
  {
    id: "db_renegade_row",
    name: "חתירה מדחיפה עם משקולות",
    category: "גוף מלא",
    primaryMuscles: ["גב", "ליבה"],
    equipment: "dumbbells",
    difficulty: "advanced",
    instructions: [
      "מצב דחיפה עם ידיים על משקולות",
      "משוך משקולת אחת לכיוון הצלע",
      "החלף ידיים",
    ],
    tips: ["גוף קשיח כקרש", "אל תסתובב"],
  },
  {
    id: "db_wall_sit_press",
    name: "ישיבת קיר עם לחיצה",
    category: "גוף מלא",
    primaryMuscles: ["רגליים", "כתפיים"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "ישב עם הגב לקיר ומשקולות בידיים",
      "בצע לחיצה מעל הראש",
      "שמור על ישיבת הקיר",
    ],
    tips: ["רגליים בזווית 90 מעלות", "גב צמוד לקיר"],
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
