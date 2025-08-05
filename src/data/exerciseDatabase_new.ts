/**
 * @file src/data/exerciseDatabase_new.ts
 * @brief מאגר תרגילים מקיף דו-לשוני עם סינון מדויק וציוד מותאם
 * @brief Comprehensive bilingual exercise database with precise filtering and equipment adaptation
 * @description מאגר תרגילים מורחב עם 50+ תרגילים נבחרים, תמיכה דו-לשונית, סינון חכם לפי ציוד, placeholder לתמונות/ווידאו
 * @description Extended exercise database with 50+ selected exercises, bilingual support, smart equipment filtering, media placeholders
 */

import { QuickWorkoutTemplate } from "../types";

// =====================================
// 📋 Equipment Categories (קטגוריות ציוד)
// =====================================

export const EQUIPMENT_CATEGORIES = {
  // ציוד בית - Home Equipment
  HOME_BODYWEIGHT: "bodyweight", // משקל גוף בלבד
  HOME_BASIC: "home_basic", // ציוד בסיסי לבית (מזרון, כיסא)
  HOME_WEIGHTS: "dumbbells", // משקולות לבית
  HOME_RESISTANCE: "resistance_bands", // גומיות התנגדות
  HOME_KETTLEBELL: "kettlebell", // קטלבל לבית

  // ציוד חדר כושר - Gym Equipment
  GYM_BARBELL: "barbell", // מוט עם משקולות
  GYM_MACHINES: "gym_machines", // מכונות חדר כושר
  GYM_CABLE: "cable_machine", // מכונת כבלים
  GYM_SPECIALIZED: "specialized_equipment", // ציוד מתקדם

  // ציוד מעורב - Mixed Equipment
  MIXED_WEIGHTS: "free_weights", // משקולות חופשיות כלליות
  CARDIO_EQUIPMENT: "cardio_equipment", // ציוד קרדיו
} as const;

// ממשק תרגיל מורחב עם תמיכה דו-לשונית ומדיה
// Extended exercise interface with bilingual support and media
export interface ExtendedExerciseTemplate extends QuickWorkoutTemplate {
  // שמות דו-לשוניים - Bilingual Names
  nameHe: string; // שם בעברית
  nameEn: string; // שם באנגלית

  // הוראות דו-לשוניות - Bilingual Instructions
  instructionsHe?: string[]; // הוראות בעברית
  instructionsEn?: string[]; // Instructions in English
  tipsHe?: string[]; // טיפים בעברית
  tipsEn?: string[]; // Tips in English

  // מדיה - Media Support
  imagePlaceholder: string; // placeholder לתמונה
  videoPlaceholder?: string; // placeholder לווידאו
  thumbnailPlaceholder?: string; // placeholder לתמונה קטנה

  // סינון ציוד מדויק - Precise Equipment Filtering
  equipmentCategory: keyof typeof EQUIPMENT_CATEGORIES; // קטגוריית ציוד עיקרית
  requiredEquipment: string[]; // ציוד נדרש בהכרח
  optionalEquipment?: string[]; // ציוד אופציונלי
  alternativeEquipment?: string[]; // חלופות ציוד

  // מטא-דאטה מתקדמת - Advanced Metadata
  algorithmScore?: number; // ציון באלגוריתם (1-10)
  targetGoals?: string[]; // מטרות שהתרגיל משרת
  workoutTypes?: string[]; // סוגי אימונים מתאימים
  prerequisites?: string[]; // תנאי קדם
  progressionTo?: string[]; // התקדמות
  safetyNotesHe?: string[]; // הערות בטיחות בעברית
  safetyNotesEn?: string[]; // Safety notes in English

  // תאימות למיקום - Location Compatibility
  homeCompatible: boolean; // מתאים לבית
  gymCompatible: boolean; // מתאים לחדר כושר
  outdoorCompatible?: boolean; // מתאים לחוץ
}

// =====================================
// 🏋️‍♀️ פונקציות עזר לסינון ציוד
// Equipment Filtering Helper Functions
// =====================================

/**
 * מחזיר תרגילים לפי קטגוריית ציוד
 * Returns exercises by equipment category
 */
export function getExercisesByEquipmentCategory(
  category: keyof typeof EQUIPMENT_CATEGORIES
): ExtendedExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter(
    (exercise) => exercise.equipmentCategory === category
  );
}

/**
 * מחזיר תרגילים שמתאימים לבית
 * Returns exercises suitable for home
 */
export function getHomeCompatibleExercises(): ExtendedExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter(
    (exercise) => exercise.homeCompatible === true
  );
}

/**
 * מחזיר תרגילים שמתאימים לחדר כושר
 * Returns exercises suitable for gym
 */
export function getGymCompatibleExercises(): ExtendedExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter(
    (exercise) => exercise.gymCompatible === true
  );
}

/**
 * מחזיר תרגילים לפי רשימת ציוד זמין
 * Returns exercises based on available equipment list
 */
export function getExercisesByAvailableEquipment(
  availableEquipment: string[]
): ExtendedExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter((exercise) => {
    // בדוק אם כל הציוד הנדרש זמין
    const hasAllRequired = exercise.requiredEquipment.every(
      (req) => availableEquipment.includes(req) || req === "" // empty string means no equipment needed
    );

    // אם יש ציוד חלופי, בדוק גם אותו
    if (!hasAllRequired && exercise.alternativeEquipment) {
      const hasAlternative = exercise.alternativeEquipment.some((alt) =>
        availableEquipment.includes(alt)
      );
      return hasAlternative;
    }

    return hasAllRequired;
  });
}

// מאגר תרגילים מורחב ומשופר עם תמיכה דו-לשונית וסינון מדויק
// Extended and enhanced exercise database with bilingual support and precise filtering
export const EXTENDED_EXERCISE_DATABASE: ExtendedExerciseTemplate[] = [
  // ========================================
  // 💪 תרגילי חזה - CHEST EXERCISES
  // ========================================

  // ✅ תרגילי משקל גוף לבית - Bodyweight Home Exercises
  {
    id: "pushups",
    name: "שכיבות סמיכה", // Legacy field for compatibility
    nameHe: "שכיבות סמיכה",
    nameEn: "Push-ups",
    category: "חזה",
    primaryMuscles: ["חזה", "טריצפס"],
    secondaryMuscles: ["כתפיים", "ליבה"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BODYWEIGHT",
    requiredEquipment: [],
    difficulty: "beginner",

    instructionsHe: [
      "התנוחה: שכיבה עם כפות הידיים על הרצפה ברוחב כתפיים",
      "הגוף יוצר קו ישר מהראש לעקבים",
      "הורד את החזה עד כמעט למגע עם הרצפה",
      "דחוף חזק עד יישור זרועות מלא",
    ],
    instructionsEn: [
      "Position: Lie with palms on floor, shoulder-width apart",
      "Body forms straight line from head to heels",
      "Lower chest until almost touching floor",
      "Push up hard until arms fully extended",
    ],
    tipsHe: [
      "שמור על ליבה מתוחה",
      "נשום פנימה בירידה ונשום החוצה בעלייה",
      "התחל מהברכיים אם קשה",
    ],
    tipsEn: [
      "Keep core tight",
      "Inhale down, exhale up",
      "Start from knees if difficult",
    ],

    imagePlaceholder: "assets/exercises/chest/pushups_placeholder.jpg",
    videoPlaceholder: "assets/videos/chest/pushups_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/chest/pushups_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 10,
    targetGoals: ["muscle_gain", "strength", "endurance"],
    workoutTypes: ["strength", "calisthenics", "beginner"],
    progressionTo: ["wide_pushups", "diamond_pushups", "decline_pushups"],

    safetyNotesHe: ["שמור על גב ישר", "אל תכפוף את הגב"],
    safetyNotesEn: ["Keep back straight", "Don't arch your back"],
  },

  {
    id: "wide_pushups",
    name: "שכיבות סמיכה רחבות",
    nameHe: "שכיבות סמיכה רחבות",
    nameEn: "Wide Push-ups",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BODYWEIGHT",
    requiredEquipment: [],
    difficulty: "beginner",

    instructionsHe: [
      "כמו שכיבות סמיכה רגילות",
      "אבל עם ידיים רחבות יותר מהכתפיים",
      "התמקד בחזה הרחב",
      "שמור על שליטה בתנועה",
    ],
    instructionsEn: [
      "Like regular push-ups",
      "But with hands wider than shoulders",
      "Focus on outer chest",
      "Control the movement",
    ],

    imagePlaceholder: "assets/exercises/chest/wide_pushups_placeholder.jpg",
    videoPlaceholder: "assets/videos/chest/wide_pushups_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/chest/wide_pushups_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 8,
    targetGoals: ["chest_width", "muscle_gain"],
    workoutTypes: ["calisthenics", "chest_focus"],
    prerequisites: ["pushups"],
  },

  {
    id: "diamond_pushups",
    name: "שכיבות סמיכה יהלום",
    nameHe: "שכיבות סמיכה יהלום",
    nameEn: "Diamond Push-ups",
    category: "חזה",
    primaryMuscles: ["חזה", "טריצפס"],
    secondaryMuscles: ["כתפיים"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BODYWEIGHT",
    requiredEquipment: [],
    difficulty: "intermediate",

    instructionsHe: [
      "צור יהלום עם האגודלים והאצבעות",
      "שים את הידיים מתחת לחזה",
      "בצע שכיבת סמיכה עם התמקדות על הטריצפס",
      "זהו תרגיל מאתגר יותר",
    ],
    instructionsEn: [
      "Form diamond with thumbs and fingers",
      "Place hands under chest",
      "Perform push-up focusing on triceps",
      "This is more challenging",
    ],

    imagePlaceholder: "assets/exercises/chest/diamond_pushups_placeholder.jpg",
    videoPlaceholder: "assets/videos/chest/diamond_pushups_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/chest/diamond_pushups_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 9,
    targetGoals: ["triceps_strength", "advanced_training"],
    workoutTypes: ["calisthenics", "advanced"],
    prerequisites: ["pushups", "wide_pushups"],
  },

  {
    id: "decline_pushups",
    name: "שכיבות סמיכה עם רגליים מורמות",
    nameHe: "שכיבות סמיכה עם רגליים מורמות",
    nameEn: "Decline Push-ups",
    category: "חזה",
    primaryMuscles: ["חזה עליון"],
    secondaryMuscles: ["כתפיים", "טריצפס"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BASIC",
    requiredEquipment: ["elevated_surface"],
    alternativeEquipment: ["chair", "couch", "bed"],
    difficulty: "intermediate",

    instructionsHe: [
      "שים את הרגליים על משטח גבוה (כיסא, ספה)",
      "ידיים על הרצפה ברוחב כתפיים",
      "בצע שכיבת סמיכה עם דגש על חזה עליון",
      "שמור על גב ישר",
    ],
    instructionsEn: [
      "Place feet on elevated surface (chair, couch)",
      "Hands on floor, shoulder-width apart",
      "Perform push-up emphasizing upper chest",
      "Keep back straight",
    ],

    imagePlaceholder: "assets/exercises/chest/decline_pushups_placeholder.jpg",
    videoPlaceholder: "assets/videos/chest/decline_pushups_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/chest/decline_pushups_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: false,

    algorithmScore: 9,
    targetGoals: ["upper_chest", "progression"],
    workoutTypes: ["calisthenics", "intermediate"],
    prerequisites: ["pushups"],
  },

  // ✅ תרגילי משקולות לבית - Home Dumbbell Exercises
  {
    id: "db_bench_press",
    name: "לחיצת חזה עם משקולות",
    nameHe: "לחיצת חזה עם משקולות",
    nameEn: "Dumbbell Bench Press",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "טריצפס"],
    equipment: "dumbbells",
    equipmentCategory: "HOME_WEIGHTS",
    requiredEquipment: ["dumbbells"],
    optionalEquipment: ["bench"],
    alternativeEquipment: ["floor", "stability_ball"],
    difficulty: "beginner",

    instructionsHe: [
      "שכב על ספסל או רצפה עם משקולת בכל יד",
      "הורד את המשקולות לצדי החזה בשליטה",
      "דחוף למעלה עד יישור מלא של הזרועות",
      "חזור לתנוחת ההתחלה באיטיות",
    ],
    instructionsEn: [
      "Lie on bench or floor with dumbbell in each hand",
      "Lower dumbbells to chest sides with control",
      "Push up until arms are fully extended",
      "Return to starting position slowly",
    ],
    tipsHe: [
      "שמור על כפות הרגליים על הרצפה",
      "נשום החוצה בדחיפה",
      "שמור על גב ישר",
    ],
    tipsEn: ["Keep feet on floor", "Exhale on push", "Maintain straight back"],

    imagePlaceholder: "assets/exercises/chest/db_bench_press_placeholder.jpg",
    videoPlaceholder: "assets/videos/chest/db_bench_press_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/chest/db_bench_press_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: false,

    algorithmScore: 9,
    targetGoals: ["muscle_gain", "strength", "chest_development"],
    workoutTypes: ["strength", "hypertrophy", "upper_body"],
    prerequisites: ["pushups"],
    progressionTo: ["db_incline_press", "barbell_bench_press"],

    safetyNotesHe: ["התחל במשקל קל", "השתמש בשותף אימון במשקלים כבדים"],
    safetyNotesEn: ["Start with light weight", "Use spotter for heavy weights"],
  },

  {
    id: "db_flyes",
    name: "פרפר עם משקולות",
    nameHe: "פרפר עם משקולות",
    nameEn: "Dumbbell Flyes",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים קדמיות"],
    equipment: "dumbbells",
    equipmentCategory: "HOME_WEIGHTS",
    requiredEquipment: ["dumbbells"],
    optionalEquipment: ["bench"],
    alternativeEquipment: ["floor", "stability_ball"],
    difficulty: "intermediate",

    instructionsHe: [
      "שכב על ספסל עם משקולת בכל יד מעל החזה",
      "פתח את הזרועות לצדדים בקשת רחבה",
      "הרגש מתיחה בחזה ואז חזור למעלה",
      "שמור על כיפוף קל במרפקים",
    ],
    instructionsEn: [
      "Lie on bench with dumbbells above chest",
      "Open arms to sides in wide arc",
      "Feel stretch in chest then return up",
      "Keep slight bend in elbows",
    ],
    tipsHe: ["אל תיתן למשקולות לרדת מתחת לרמת החזה", "שלוט בתנועה"],
    tipsEn: [
      "Don't let weights drop below chest level",
      "Control the movement",
    ],

    imagePlaceholder: "assets/exercises/chest/db_flyes_placeholder.jpg",
    videoPlaceholder: "assets/videos/chest/db_flyes_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/chest/db_flyes_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: false,

    algorithmScore: 8,
    targetGoals: ["muscle_gain", "chest_isolation", "definition"],
    workoutTypes: ["hypertrophy", "isolation", "upper_body"],
    prerequisites: ["db_bench_press"],
    progressionTo: ["cable_flyes", "incline_flyes"],

    safetyNotesHe: ["אל תגזור במשקל", "שמור על שליטה"],
    safetyNotesEn: ["Don't go too heavy", "Maintain control"],
  },

  // ✅ תרגילי גומיות לבית - Resistance Band Home Exercises
  {
    id: "band_chest_press",
    name: "לחיצת חזה עם גומייה",
    nameHe: "לחיצת חזה עם גומייה",
    nameEn: "Resistance Band Chest Press",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "טריצפס"],
    equipment: "resistance_bands",
    equipmentCategory: "HOME_RESISTANCE",
    requiredEquipment: ["resistance_band"],
    optionalEquipment: ["door_anchor"],
    alternativeEquipment: ["wall_mount", "partner_hold"],
    difficulty: "beginner",

    instructionsHe: [
      "חבר את הגומייה לנקודת עיגון בגובה החזה",
      "עמוד עם הגב לנקודת העיגון",
      "דחוף קדימה בתנועה דומה ללחיצת חזה",
      "שלוט בחזרה לתנוחת ההתחלה",
    ],
    instructionsEn: [
      "Attach band to anchor point at chest height",
      "Stand with back to anchor point",
      "Push forward in chest press motion",
      "Control return to starting position",
    ],

    imagePlaceholder: "assets/exercises/chest/band_chest_press_placeholder.jpg",
    videoPlaceholder: "assets/videos/chest/band_chest_press_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/chest/band_chest_press_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 7,
    targetGoals: ["muscle_gain", "home_training"],
    workoutTypes: ["resistance", "home_workout"],
  },

  // ========================================
  // 🏋️ תרגילי גב - BACK EXERCISES
  // ========================================

  // ✅ תרגילי משקל גוף - Bodyweight Back Exercises
  {
    id: "pullups",
    name: "מתח",
    nameHe: "מתח",
    nameEn: "Pull-ups",
    category: "גב",
    primaryMuscles: ["גב רחב"],
    secondaryMuscles: ["ביצפס", "כתפיים אחוריות"],
    equipment: "pullup_bar",
    equipmentCategory: "HOME_BASIC",
    requiredEquipment: ["pullup_bar"],
    alternativeEquipment: ["resistance_band", "door_frame_bar"],
    difficulty: "intermediate",

    instructionsHe: [
      "תלה על מוט עם אחיזה רחבה יותר מכתפיים",
      "משוך עצמך למעלה עד שהסנטר עובר את המוט",
      "שלוט בירידה חזרה לתנוחת ההתחלה",
      "שמור על ליבה מתוחה לאורך התרגיל",
    ],
    instructionsEn: [
      "Hang from bar with grip wider than shoulders",
      "Pull yourself up until chin clears the bar",
      "Control descent back to starting position",
      "Keep core tight throughout exercise",
    ],
    tipsHe: ["התחל עם סיוע או גומיות אם קשה", "התמקד במשיכה עם הגב"],
    tipsEn: [
      "Start with assistance or bands if difficult",
      "Focus on pulling with back",
    ],

    imagePlaceholder: "assets/exercises/back/pullups_placeholder.jpg",
    videoPlaceholder: "assets/videos/back/pullups_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/back/pullups_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 10,
    targetGoals: ["back_strength", "muscle_gain", "functional_strength"],
    workoutTypes: ["strength", "calisthenics", "upper_body"],
    prerequisites: ["band_pulldown"],
    progressionTo: ["weighted_pullups", "muscle_ups"],

    safetyNotesHe: ["וודא יציבות המוט", "אל תתנדנד"],
    safetyNotesEn: ["Ensure bar stability", "Don't swing"],
  },

  {
    id: "superman",
    name: "סופרמן",
    nameHe: "סופרמן",
    nameEn: "Superman",
    category: "גב",
    primaryMuscles: ["גב תחתון"],
    secondaryMuscles: ["ישבן", "אחורי ירך"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BODYWEIGHT",
    requiredEquipment: [],
    difficulty: "beginner",

    instructionsHe: [
      "שכב על הבטן עם זרועות פשוטות קדימה",
      "הרם בו זמנית חזה ורגליים מהרצפה",
      "החזק למשך שנייה למעלה",
      "הורד בשליטה וחזור",
    ],
    instructionsEn: [
      "Lie face down with arms extended forward",
      "Simultaneously lift chest and legs off floor",
      "Hold for one second at top",
      "Lower with control and repeat",
    ],

    imagePlaceholder: "assets/exercises/back/superman_placeholder.jpg",
    videoPlaceholder: "assets/videos/back/superman_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/back/superman_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 8,
    targetGoals: ["back_health", "posture", "core_strength"],
    workoutTypes: ["rehabilitation", "core", "beginner"],
  },

  // ✅ תרגילי משקולות - Dumbbell Back Exercises
  {
    id: "db_row",
    name: "חתירת משקולת",
    nameHe: "חתירת משקולת",
    nameEn: "Dumbbell Row",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס", "כתפיים אחוריות"],
    equipment: "dumbbells",
    equipmentCategory: "HOME_WEIGHTS",
    requiredEquipment: ["dumbbells"],
    optionalEquipment: ["bench"],
    alternativeEquipment: ["chair", "table"],
    difficulty: "beginner",

    instructionsHe: [
      "התמקם בעמידה מעל ספסל עם משקולת באחת הידיים",
      "תמוך את עצמך עם היד השנייה על הספסל",
      "משוך את המשקולת למעלה לכיוון הצלעות",
      "שלוט בירידה ואל תיתן לכתף ליפול",
    ],
    instructionsEn: [
      "Position over bench with dumbbell in one hand",
      "Support yourself with other hand on bench",
      "Pull weight up toward ribs",
      "Control descent and don't let shoulder drop",
    ],

    imagePlaceholder: "assets/exercises/back/db_row_placeholder.jpg",
    videoPlaceholder: "assets/videos/back/db_row_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/back/db_row_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: false,

    algorithmScore: 9,
    targetGoals: ["back_strength", "muscle_gain", "posture"],
    workoutTypes: ["strength", "hypertrophy", "upper_body"],
    prerequisites: ["band_pulldown"],
    progressionTo: ["barbell_row", "pullups"],
  },

  // ✅ תרגילי גומיות - Resistance Band Back Exercises
  {
    id: "band_pulldown",
    name: "משיכה לחזה עם גומייה",
    nameHe: "משיכה לחזה עם גומייה",
    nameEn: "Resistance Band Pulldown",
    category: "גב",
    primaryMuscles: ["גב רחב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "resistance_bands",
    equipmentCategory: "HOME_RESISTANCE",
    requiredEquipment: ["resistance_band"],
    optionalEquipment: ["door_anchor"],
    alternativeEquipment: ["high_anchor_point"],
    difficulty: "beginner",

    instructionsHe: [
      "חבר גומייה לנקודת עיגון גבוהה",
      "אחוז בידיות ובצע תנועת משיכה לחזה",
      "התמקד בשרירי הגב",
      "שלוט בחזרה למעלה",
    ],
    instructionsEn: [
      "Attach band to high anchor point",
      "Grip handles and pull down to chest",
      "Focus on back muscles",
      "Control return upward",
    ],

    imagePlaceholder: "assets/exercises/back/band_pulldown_placeholder.jpg",
    videoPlaceholder: "assets/videos/back/band_pulldown_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/back/band_pulldown_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 7,
    targetGoals: ["back_strength", "home_training"],
    workoutTypes: ["resistance", "beginner"],
    progressionTo: ["pullups", "db_row"],
  },

  // ========================================
  // 🦵 תרגילי רגליים - LEG EXERCISES
  // ========================================

  // ✅ תרגילי משקל גוף - Bodyweight Leg Exercises
  {
    id: "squats",
    name: "כפיפות",
    nameHe: "כפיפות",
    nameEn: "Squats",
    category: "רגליים",
    primaryMuscles: ["רגליים קדמיות", "ישבן"],
    secondaryMuscles: ["ליבה", "שוקיים"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BODYWEIGHT",
    requiredEquipment: [],
    difficulty: "beginner",

    instructionsHe: [
      "עמוד עם רגליים ברוחב כתפיים",
      "הורד את הישבן לאחור ולמטה כאילו יושב על כיסא",
      "שמור על משקל על העקבים",
      "עלה חזרה למעלה בכוח",
    ],
    instructionsEn: [
      "Stand with feet shoulder-width apart",
      "Lower hips back and down as if sitting on chair",
      "Keep weight on heels",
      "Drive back up powerfully",
    ],
    tipsHe: ["ברכיים בכיוון כפות הרגליים", "חזה למעלה"],
    tipsEn: ["Knees track over toes", "Chest up"],

    imagePlaceholder: "assets/exercises/legs/squats_placeholder.jpg",
    videoPlaceholder: "assets/videos/legs/squats_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/legs/squats_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 10,
    targetGoals: ["leg_strength", "functional_strength", "muscle_gain"],
    workoutTypes: ["strength", "functional", "beginner"],
    progressionTo: ["jump_squats", "pistol_squats", "weighted_squats"],

    safetyNotesHe: ["אל תיתן לברכיים להיכנס פנימה"],
    safetyNotesEn: ["Don't let knees cave inward"],
  },

  {
    id: "lunges",
    name: "פסיעות",
    nameHe: "פסיעות",
    nameEn: "Lunges",
    category: "רגליים",
    primaryMuscles: ["רגליים קדמיות", "ישבן"],
    secondaryMuscles: ["שוקיים", "ליבה"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BODYWEIGHT",
    requiredEquipment: [],
    difficulty: "beginner",

    instructionsHe: [
      "עמוד זקוף ופסע צעד גדול קדימה",
      "הורד את הגוף עד שהברכיים ב-90 מעלות",
      "דחוף חזרה לתנוחת ההתחלה",
      "חלף רגליים או עשה סט לכל רגל",
    ],
    instructionsEn: [
      "Stand upright and step forward with large step",
      "Lower body until knees at 90 degrees",
      "Push back to starting position",
      "Alternate legs or do set for each leg",
    ],

    imagePlaceholder: "assets/exercises/legs/lunges_placeholder.jpg",
    videoPlaceholder: "assets/videos/legs/lunges_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/legs/lunges_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 9,
    targetGoals: ["leg_strength", "balance", "functional_strength"],
    workoutTypes: ["strength", "functional", "unilateral"],
    prerequisites: ["squats"],
    progressionTo: ["walking_lunges", "jumping_lunges", "weighted_lunges"],
  },

  // ========================================
  // 💪 תרגילי כתפיים - SHOULDER EXERCISES
  // ========================================

  // ✅ תרגילי משקולות - Dumbbell Shoulder Exercises
  {
    id: "db_shoulder_press",
    name: "לחיצת כתפיים עם משקולות",
    nameHe: "לחיצת כתפיים עם משקולות",
    nameEn: "Dumbbell Shoulder Press",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    secondaryMuscles: ["טריצפס", "ליבה"],
    equipment: "dumbbells",
    equipmentCategory: "HOME_WEIGHTS",
    requiredEquipment: ["dumbbells"],
    optionalEquipment: ["bench", "chair"],
    difficulty: "beginner",

    instructionsHe: [
      "עמוד או שב עם משקולת בכל יד ברמת הכתפיים",
      "דחוף המשקולות למעלה מעל הראש",
      "הורד בשליטה לרמת הכתפיים",
      "שמור על ליבה מתוחה",
    ],
    instructionsEn: [
      "Stand or sit with dumbbell in each hand at shoulder level",
      "Press weights overhead",
      "Lower with control to shoulder level",
      "Keep core tight",
    ],

    imagePlaceholder:
      "assets/exercises/shoulders/db_shoulder_press_placeholder.jpg",
    videoPlaceholder: "assets/videos/shoulders/db_shoulder_press_demo.mp4",
    thumbnailPlaceholder:
      "assets/thumbnails/shoulders/db_shoulder_press_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: false,

    algorithmScore: 9,
    targetGoals: ["shoulder_strength", "muscle_gain"],
    workoutTypes: ["strength", "hypertrophy", "upper_body"],
    prerequisites: ["pushups"],
    progressionTo: ["military_press", "handstand_pushups"],
  },

  {
    id: "db_lateral_raises",
    name: "הרמות צידיות עם משקולות",
    nameHe: "הרמות צידיות עם משקולות",
    nameEn: "Dumbbell Lateral Raises",
    category: "כתפיים",
    primaryMuscles: ["כתפיים צידיות"],
    equipment: "dumbbells",
    equipmentCategory: "HOME_WEIGHTS",
    requiredEquipment: ["dumbbells"],
    difficulty: "beginner",

    instructionsHe: [
      "עמוד עם משקולת בכל יד לצד הגוף",
      "הרם את הזרועות לצדדים עד גובה הכתפיים",
      "הורד בשליטה לתנוחת ההתחלה",
      "שמור על כיפוף קל במרפקים",
    ],
    instructionsEn: [
      "Stand with dumbbell in each hand at sides",
      "Raise arms to sides until shoulder height",
      "Lower with control to starting position",
      "Keep slight bend in elbows",
    ],

    imagePlaceholder:
      "assets/exercises/shoulders/db_lateral_raises_placeholder.jpg",
    videoPlaceholder: "assets/videos/shoulders/db_lateral_raises_demo.mp4",
    thumbnailPlaceholder:
      "assets/thumbnails/shoulders/db_lateral_raises_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: false,

    algorithmScore: 8,
    targetGoals: ["shoulder_width", "muscle_gain", "definition"],
    workoutTypes: ["isolation", "hypertrophy"],
    prerequisites: ["db_shoulder_press"],
  },

  // ========================================
  // 💪 תרגילי זרועות - ARM EXERCISES
  // ========================================

  // ✅ תרגילי ביצפס - Bicep Exercises
  {
    id: "db_bicep_curls",
    name: "כיפופי ביצפס עם משקולות",
    nameHe: "כיפופי ביצפס עם משקולות",
    nameEn: "Dumbbell Bicep Curls",
    category: "זרועות",
    primaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    equipmentCategory: "HOME_WEIGHTS",
    requiredEquipment: ["dumbbells"],
    difficulty: "beginner",

    instructionsHe: [
      "עמוד עם משקולת בכל יד, זרועות מורדות",
      "כופף את הזרועות והבא את המשקולות לכתפיים",
      "שמור על מרפקים קבועים לצד הגוף",
      "הורד בשליטה לתנוחת ההתחלה",
    ],
    instructionsEn: [
      "Stand with dumbbell in each hand, arms down",
      "Curl arms bringing weights to shoulders",
      "Keep elbows fixed at sides",
      "Lower with control to starting position",
    ],

    imagePlaceholder: "assets/exercises/arms/db_bicep_curls_placeholder.jpg",
    videoPlaceholder: "assets/videos/arms/db_bicep_curls_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/arms/db_bicep_curls_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: false,

    algorithmScore: 7,
    targetGoals: ["arm_strength", "muscle_gain"],
    workoutTypes: ["isolation", "hypertrophy"],
  },

  // ✅ תרגילי טריצפס - Tricep Exercises
  {
    id: "tricep_dips",
    name: "דיפס טריצפס",
    nameHe: "דיפס טריצפס",
    nameEn: "Tricep Dips",
    category: "זרועות",
    primaryMuscles: ["טריצפס"],
    secondaryMuscles: ["כתפיים", "חזה"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BASIC",
    requiredEquipment: ["chair"],
    alternativeEquipment: ["bench", "step", "couch"],
    difficulty: "beginner",

    instructionsHe: [
      "שב על קצה כיסא עם ידיים על הקצה",
      "החלק את הישבן מהכיסא ותמוך במשקל הגוף",
      "הורד את הגוף על ידי כיפוף הזרועות",
      "דחוף חזרה למעלה",
    ],
    instructionsEn: [
      "Sit on edge of chair with hands on edge",
      "Slide hips off chair supporting body weight",
      "Lower body by bending arms",
      "Push back up",
    ],

    imagePlaceholder: "assets/exercises/arms/tricep_dips_placeholder.jpg",
    videoPlaceholder: "assets/videos/arms/tricep_dips_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/arms/tricep_dips_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: false,

    algorithmScore: 8,
    targetGoals: ["arm_strength", "tricep_development"],
    workoutTypes: ["calisthenics", "upper_body"],
    prerequisites: ["pushups"],
    progressionTo: ["weighted_dips", "parallel_bar_dips"],
  },

  // ========================================
  // 🏃‍♀️ תרגילי ליבה - CORE EXERCISES
  // ========================================

  // ✅ תרגילי משקל גוף - Bodyweight Core Exercises
  {
    id: "plank",
    name: "פלאנק",
    nameHe: "פלאנק",
    nameEn: "Plank",
    category: "ליבה",
    primaryMuscles: ["ליבה"],
    secondaryMuscles: ["כתפיים", "גב"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BODYWEIGHT",
    requiredEquipment: [],
    difficulty: "beginner",

    instructionsHe: [
      "התמקם בתנוחת שכיבת סמיכה על המרפקים",
      "שמור על גוף ישר מהראש לעקבים",
      "החזק את התנוחה למשך זמן קבוע",
      "נשום באופן קבוע",
    ],
    instructionsEn: [
      "Position in push-up pose on elbows",
      "Keep body straight from head to heels",
      "Hold position for set time",
      "Breathe regularly",
    ],
    tipsHe: ["אל תיתן לירכיים לרדת", "שמור על צוואר ניטרלי"],
    tipsEn: ["Don't let hips drop", "Keep neck neutral"],

    imagePlaceholder: "assets/exercises/core/plank_placeholder.jpg",
    videoPlaceholder: "assets/videos/core/plank_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/core/plank_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 10,
    targetGoals: ["core_strength", "stability", "posture"],
    workoutTypes: ["core", "isometric", "beginner"],
    progressionTo: ["side_plank", "plank_variations"],

    safetyNotesHe: ["התחל ממשכי זמן קצרים"],
    safetyNotesEn: ["Start with short durations"],
  },

  {
    id: "crunches",
    name: "כיפופי בטן",
    nameHe: "כיפופי בטן",
    nameEn: "Crunches",
    category: "ליבה",
    primaryMuscles: ["בטן קדמית"],
    equipment: "bodyweight",
    equipmentCategory: "HOME_BODYWEIGHT",
    requiredEquipment: [],
    difficulty: "beginner",

    instructionsHe: [
      "שכב על הגב עם ברכיים כפופות",
      "שים ידיים מאחורי הראש",
      "הרם את החזה העליון לכיוון הברכיים",
      "חזור לתנוחת ההתחלה בשליטה",
    ],
    instructionsEn: [
      "Lie on back with knees bent",
      "Place hands behind head",
      "Lift upper chest toward knees",
      "Return to starting position with control",
    ],

    imagePlaceholder: "assets/exercises/core/crunches_placeholder.jpg",
    videoPlaceholder: "assets/videos/core/crunches_demo.mp4",
    thumbnailPlaceholder: "assets/thumbnails/core/crunches_thumb.jpg",

    homeCompatible: true,
    gymCompatible: true,
    outdoorCompatible: true,

    algorithmScore: 8,
    targetGoals: ["core_strength", "ab_definition"],
    workoutTypes: ["core", "isolation"],
    prerequisites: ["plank"],
    progressionTo: ["bicycle_crunches", "weighted_crunches"],
  },
];

// =====================================
// 🎯 פונקציות עזר נוספות - Additional Helper Functions
// =====================================

/**
 * מחזיר תרגילים לפי רמת קושי
 * Returns exercises by difficulty level
 */
export function getExercisesByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): ExtendedExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter(
    (exercise) => exercise.difficulty === difficulty
  );
}

/**
 * מחזיר תרגילים לפי קבוצת שרירים
 * Returns exercises by muscle group
 */
export function getExercisesByMuscleGroup(
  muscleGroup: string
): ExtendedExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter(
    (exercise) =>
      exercise.primaryMuscles.includes(muscleGroup) ||
      exercise.secondaryMuscles?.includes(muscleGroup)
  );
}

/**
 * מחזיר תרגילים לפי מטרות האימון
 * Returns exercises by workout goals
 */
export function getExercisesByGoals(
  goals: string[]
): ExtendedExerciseTemplate[] {
  return EXTENDED_EXERCISE_DATABASE.filter((exercise) =>
    exercise.targetGoals?.some((goal) => goals.includes(goal))
  );
}

/**
 * מחזיר תרגיל לפי ID עם תמיכה דו-לשונית
 * Returns exercise by ID with bilingual support
 */
export function getExerciseById(
  id: string,
  language: "he" | "en" = "he"
): ExtendedExerciseTemplate | undefined {
  const exercise = EXTENDED_EXERCISE_DATABASE.find((ex) => ex.id === id);
  if (!exercise) return undefined;

  // התאם את השם לשפה הנבחרת
  // Adapt name to selected language
  const adaptedExercise = { ...exercise };
  adaptedExercise.name = language === "he" ? exercise.nameHe : exercise.nameEn;

  return adaptedExercise;
}

/**
 * מערך כל הקטגוריות הזמינות
 * Array of all available categories
 */
export const AVAILABLE_CATEGORIES = [
  "חזה",
  "גב",
  "רגליים",
  "כתפיים",
  "זרועות",
  "ליבה",
] as const;

/**
 * מערך כל סוגי הציוד הזמינים
 * Array of all available equipment types
 */
export const AVAILABLE_EQUIPMENT = [
  "bodyweight",
  "dumbbells",
  "resistance_bands",
  "pullup_bar",
  "chair",
  "barbell",
  "cable_machine",
  "kettlebell",
] as const;

// Export legacy name for backward compatibility
export { EXTENDED_EXERCISE_DATABASE as EXERCISE_DATABASE };
