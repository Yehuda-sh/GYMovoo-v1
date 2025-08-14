/**
 * @file bodyweight.ts
 * @description תרגילי משקל גוף - מאגר מלא לאימונים ביתיים
 * @description Bodyweight exercises - complete home workout database
 * @category Exercise Database
 * @features 16 exercises, beginner to advanced, full-body coverage
 * @updated 2025-08-15 Enhanced categorization and progression
 */

import { Exercise } from "./types";

// Exercise difficulty progression constants
const PROGRESSION_LEVELS = {
  BEGINNER: [
    "push_up_1",
    "squat_bodyweight_1",
    "plank_1",
    "wall_sit_1",
    "glute_bridge_1",
    "superman_hold_1",
  ],
  INTERMEDIATE: [
    "mountain_climbers_bodyweight_1",
    "decline_push_up_1",
    "side_plank_1",
    "bicycle_crunch_1",
    "bear_crawl_1",
    "chair_tricep_dip_1",
  ],
  ADVANCED: ["single_leg_hip_thrust_1", "jump_squat_bodyweight_1"],
} as const;

// Exercise categories for better organization
const EXERCISE_CATEGORIES = {
  UPPER_BODY: [
    "push_up_1",
    "incline_push_up_1",
    "decline_push_up_1",
    "chair_tricep_dip_1",
  ],
  LOWER_BODY: [
    "squat_bodyweight_1",
    "lunges_1",
    "wall_sit_1",
    "glute_bridge_1",
    "single_leg_hip_thrust_1",
    "jump_squat_bodyweight_1",
  ],
  CORE: ["plank_1", "side_plank_1", "bicycle_crunch_1", "superman_hold_1"],
  CARDIO: [
    "mountain_climbers_bodyweight_1",
    "bear_crawl_1",
    "jump_squat_bodyweight_1",
  ],
  FULL_BODY: ["mountain_climbers_bodyweight_1", "bear_crawl_1"],
} as const;

export const bodyweightExercises: Exercise[] = [
  {
    id: "push_up_1",
    name: "שכיבת סמיכה בסיסית",
    nameLocalized: {
      he: "שכיבת סמיכה בסיסית",
      en: "Basic Push-Up",
    },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "השתטח על הבטן עם כפות הידיים על הרצפה ברוחב הכתפיים",
        "שמור על קו ישר מהראש עד העקבים",
        "הורד את החזה לעבר הרצפה עד שהמרפקים ב-90 מעלות",
        "דחף חזרה למעלה לעמדת ההתחלה בכוח",
      ],
      en: [
        "Lie face down with palms on floor shoulder-width apart",
        "Maintain straight line from head to heels",
        "Lower chest toward floor until elbows at 90 degrees",
        "Push back up to starting position with force",
      ],
    },
    tips: {
      he: [
        "שמור על שרירי הליבה מתוחים כל הזמן",
        "נשם פנימה בירידה, החוצה בעלייה",
        "אל תתן לירכיים לרדת או להתרומם",
        "התחל על הברכיים אם קשה מדי",
      ],
      en: [
        "Keep core muscles tight throughout",
        "Breathe in going down, out going up",
        "Don't let hips sag or pike up",
        "Start on knees if too difficult",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בכתפיים",
        "אל תכופף את פרקי הידיים יותר מדי",
        "התחל עם מעט חזרות והגדל בהדרגה",
      ],
      en: [
        "Stop if you feel shoulder pain",
        "Don't overextend wrists",
        "Start with few reps and progress gradually",
      ],
    },
    media: {
      image: "exercises/push_up_basic.jpg",
      video: "exercises/push_up_basic.mp4",
      thumbnail: "exercises/push_up_basic_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "squat_bodyweight_1",
    name: "כיפופי ברכיים",
    nameLocalized: {
      he: "כיפופי ברכיים עם משקל גוף",
      en: "Bodyweight Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד עם הרגליים ברוחב הכתפיים",
        "הושט ידיים קדימה לאיזון",
        "הורד את הירכיים אחורה ומטה כמו יושב על כיסא",
        "רד עד שהירכיים במקביל לרצפה",
        "דחף דרך העקבים לחזור למעלה",
      ],
      en: [
        "Stand with feet shoulder-width apart",
        "Extend arms forward for balance",
        "Lower hips back and down like sitting in chair",
        "Descend until thighs parallel to floor",
        "Drive through heels to return up",
      ],
    },
    tips: {
      he: [
        "שמור על החזה פתוח והגב ישר",
        "הברכיים צריכות לעקוב אחר כיוון האצבעות",
        "התמקד בהפעלת הישבן",
        "התחל עם עומק קטן והגדל בהדרגה",
      ],
      en: [
        "Keep chest up and back straight",
        "Knees should track over toes",
        "Focus on engaging glutes",
        "Start shallow and increase depth gradually",
      ],
    },
    safetyNotes: {
      he: [
        "אל תתן לברכיים ליפול פנימה",
        "הפסק אם כואב בברכיים או גב",
        "אל תרד מהר מדי",
      ],
      en: [
        "Don't let knees collapse inward",
        "Stop if knees or back hurt",
        "Don't descend too quickly",
      ],
    },
    media: {
      image: "exercises/squat_bodyweight.jpg",
      video: "exercises/squat_bodyweight.mp4",
      thumbnail: "exercises/squat_bodyweight_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },

  {
    id: "plank_1",
    name: "פלאנק",
    nameLocalized: {
      he: "פלאנק סטנדרטי",
      en: "Standard Plank",
    },
    category: "core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "back"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "התחל בעמדת שכיבת סמיכה ורד על המרפקים",
        "שמור על קו ישר מהראש עד העקבים",
        "הפעל את שרירי הליבה וחזק אותם",
        "החזק את העמדה למשך הזמן הנדרש",
        "נשם באופן קבוע",
      ],
      en: [
        "Start in push-up position and lower to forearms",
        "Maintain straight line from head to heels",
        "Engage and tighten core muscles",
        "Hold position for required duration",
        "Breathe regularly throughout",
      ],
    },
    tips: {
      he: [
        "נשם באופן קבוע, אל תעצור את הנשימה",
        "התמקד בהפעלת שרירי הבטן העמוקים",
        "שמור על הצוואר במצב נייטרלי",
        "אל תתן לירכיים לרדת",
      ],
      en: [
        "Breathe regularly, don't hold breath",
        "Focus on deep abdominal muscles",
        "Keep neck in neutral position",
        "Don't let hips drop",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בגב תחתון",
        "התחל עם זמנים קצרים",
        "אל תתרומם יותר מדי גבוה",
      ],
      en: [
        "Stop if you feel lower back pain",
        "Start with shorter durations",
        "Don't raise hips too high",
      ],
    },
    media: {
      image: "exercises/plank_standard.jpg",
      video: "exercises/plank_standard.mp4",
      thumbnail: "exercises/plank_standard_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "mountain_climbers_bodyweight_1",
    name: "מטפסי הרים",
    nameLocalized: {
      he: "מטפסי הרים",
      en: "Mountain Climbers",
    },
    category: "cardio",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "quadriceps", "hamstrings"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: [
        "התחל בעמדת פלאנק עם זרועות ישרות",
        "מעלה ברך אחת לעבר החזה",
        "החלף רגליים במהירות",
        "המשך להחליף בקצב מהיר",
      ],
      en: [
        "Start in plank position with straight arms",
        "Bring one knee toward chest",
        "Switch legs quickly",
        "Continue alternating at fast pace",
      ],
    },
    tips: {
      he: ["שמור על ירכיים יציבות", "אל תתן לישבן להתרומם", "נשם באופן קבוע"],
      en: ["Keep hips stable", "Don't let hips rise up", "Breathe regularly"],
    },
    safetyNotes: {
      he: [
        "התחל לאט והגדל מהירות בהדרגה",
        "הפסק אם כואב בפרקי הידיים",
        "שמור על גב ישר",
      ],
      en: [
        "Start slow and increase speed gradually",
        "Stop if wrists hurt",
        "Keep back straight",
      ],
    },
    media: {
      image: "exercises/mountain_climbers.jpg",
      video: "exercises/mountain_climbers.mp4",
      thumbnail: "exercises/mountain_climbers_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },

  {
    id: "lunges_1",
    name: "צעידות",
    nameLocalized: {
      he: "צעידות (לנג'ס)",
      en: "Lunges",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד זקוף עם רגליים ברוחב ירכיים",
        "צעד קדימה עם רגל אחת",
        "הורד את הגוף עד שהברך האחורית כמעט נוגעת ברצפה",
        "דחף חזרה למעלה לעמדת ההתחלה",
        "חזור עם הרגל השנייה",
      ],
      en: [
        "Stand upright with feet hip-width apart",
        "Step forward with one leg",
        "Lower body until back knee nearly touches floor",
        "Push back up to starting position",
        "Repeat with other leg",
      ],
    },
    tips: {
      he: [
        "שמור על הגוף זקוף",
        "הברך הקדמית צריכה להיות מעל הקרסול",
        "התמקד על האיזון",
        "התחל עם צעדים קטנים",
      ],
      en: [
        "Keep torso upright",
        "Front knee should be over ankle",
        "Focus on balance",
        "Start with smaller steps",
      ],
    },
    safetyNotes: {
      he: [
        "אל תתן לברך הקדמית לחרוג מעל האצבעות",
        "הפסק אם כואב בברכיים",
        "התחל עם גרסה נייחת",
      ],
      en: [
        "Don't let front knee go past toes",
        "Stop if knees hurt",
        "Start with stationary version",
      ],
    },
    media: {
      image: "exercises/lunges.jpg",
      video: "exercises/lunges.mp4",
      thumbnail: "exercises/lunges_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },

  {
    id: "wall_sit_1",
    name: "ישיבה על קיר",
    nameLocalized: {
      he: "ישיבה על קיר",
      en: "Wall Sit",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד עם הגב לקיר",
        "החלק את הגב למטה לאורך הקיר",
        "רד עד שהירכיים במקביל לרצפה",
        "שמור על הברכיים בזווית 90 מעלות",
        "החזק את העמדה",
      ],
      en: [
        "Stand with back against wall",
        "Slide back down along wall",
        "Lower until thighs parallel to floor",
        "Keep knees at 90 degree angle",
        "Hold position",
      ],
    },
    tips: {
      he: [
        "התחל עם זמנים קצרים",
        "שמור על הגב צמוד לקיר",
        "נשם באופן קבוע",
        "התמקד על שרירי הרגליים",
      ],
      en: [
        "Start with short durations",
        "Keep back flat against wall",
        "Breathe regularly",
        "Focus on leg muscles",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם כואב בברכיים",
        "אל תרד מתחת ל-90 מעלות",
        "התחל עם 15-30 שניות",
      ],
      en: [
        "Stop if knees hurt",
        "Don't go below 90 degrees",
        "Start with 15-30 seconds",
      ],
    },
    media: {
      image: "exercises/wall_sit.jpg",
      video: "exercises/wall_sit.mp4",
      thumbnail: "exercises/wall_sit_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: false,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "incline_push_up_1",
    name: "שכיבת סמיכה שיפוע חיובי",
    nameLocalized: { he: "שכיבת סמיכה שיפוע חיובי", en: "Incline Push-Up" },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "הנח ידיים על שולחן/ספסל יציב",
        "שמור גוף בקו ישר",
        "כופף מרפקים והורד חזה",
        "דחוף חזרה",
      ],
      en: [
        "Place hands on stable elevated surface",
        "Keep body straight",
        "Lower chest by bending elbows",
        "Push back up",
      ],
    },
    tips: { he: ["יותר קל מעמידה רגילה"], en: ["Easier than floor version"] },
    safetyNotes: { he: ["ודא שהמשטח יציב"], en: ["Ensure surface is stable"] },
    media: {
      image: "exercises/incline_push_up.jpg",
      video: "",
      thumbnail: "exercises/incline_push_up_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "decline_push_up_1",
    name: "שכיבת סמיכה שיפוע שלילי",
    nameLocalized: { he: "שכיבת סמיכה שיפוע שלילי", en: "Decline Push-Up" },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: [
        "הנח רגליים על ספסל",
        "כפות ידיים על הרצפה",
        "הורד חזה בשליטה",
        "דחוף למעלה",
      ],
      en: [
        "Feet on bench",
        "Hands on floor",
        "Lower chest under control",
        "Press back up",
      ],
    },
    tips: { he: ["שמור ליבה חזקה"], en: ["Keep core tight"] },
    safetyNotes: { he: ["אל תקרוס במותן"], en: ["Don't let hips sag"] },
    media: {
      image: "exercises/decline_push_up.jpg",
      video: "",
      thumbnail: "exercises/decline_push_up_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "quiet",
  },
  {
    id: "glute_bridge_1",
    name: "גשר ישבן",
    nameLocalized: { he: "גשר ישבן", en: "Glute Bridge" },
    category: "strength",
    primaryMuscles: ["glutes", "hamstrings"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["שכב על הגב", "כופף ברכיים", "הרם אגן", "הורד בשליטה"],
      en: ["Lie on back", "Bend knees", "Lift hips", "Lower with control"],
    },
    tips: { he: ["הפעל ישבן למעלה"], en: ["Squeeze glutes at top"] },
    safetyNotes: {
      he: ["אל תעמיס גב תחתון"],
      en: ["Don't overextend lower back"],
    },
    media: {
      image: "exercises/glute_bridge.jpg",
      video: "",
      thumbnail: "exercises/glute_bridge_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "single_leg_hip_thrust_1",
    name: "דחיקת אגן רגל אחת",
    nameLocalized: { he: "דחיקת אגן רגל אחת", en: "Single-Leg Hip Thrust" },
    category: "strength",
    primaryMuscles: ["glutes", "hamstrings"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: ["גב על ספה", "רגל אחת באוויר", "הרם אגן", "הורד"],
      en: [
        "Upper back on bench",
        "Other leg elevated",
        "Drive hips up",
        "Lower",
      ],
    },
    tips: { he: ["שלוט בירידה"], en: ["Control the descent"] },
    safetyNotes: { he: ["שמור יציבות"], en: ["Maintain stability"] },
    media: {
      image: "exercises/single_leg_hip_thrust.jpg",
      video: "",
      thumbnail: "exercises/single_leg_hip_thrust_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "side_plank_1",
    name: "פלאנק צד",
    nameLocalized: { he: "פלאנק צד", en: "Side Plank" },
    category: "core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "glutes"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["שכב על צד", "מרפק מתחת לכתף", "הרם אגן", "החזק"],
      en: ["Lie on side", "Elbow under shoulder", "Lift hips", "Hold"],
    },
    tips: { he: ["אל תתן לאגן ליפול"], en: ["Don't let hips drop"] },
    safetyNotes: { he: ["הפסק בכאב כתף"], en: ["Stop if shoulder pain"] },
    media: {
      image: "exercises/side_plank.jpg",
      video: "",
      thumbnail: "exercises/side_plank_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "bicycle_crunch_1",
    name: "כפיפות בטן אופניים",
    nameLocalized: { he: "כפיפות בטן אופניים", en: "Bicycle Crunch" },
    category: "core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["hips"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["שכב על הגב", "מרפק לברך נגדית בקצב", "המשך להחליף"],
      en: ["Lie on back", "Elbow to opposite knee", "Keep alternating"],
    },
    tips: { he: ["שליטה בסיבוב"], en: ["Control the twist"] },
    safetyNotes: { he: ["אל תמשוך בצוואר"], en: ["Don't pull neck"] },
    media: {
      image: "exercises/bicycle_crunch.jpg",
      video: "",
      thumbnail: "exercises/bicycle_crunch_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "jump_squat_bodyweight_1",
    name: "סקוואט קפיצה",
    nameLocalized: { he: "סקוואט קפיצה", en: "Jump Squat" },
    category: "cardio",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves", "core"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: ["רד לסקוואט", "קפוץ למעלה", "נחת רך"],
      en: ["Descend to squat", "Explode upward", "Land softly"],
    },
    tips: {
      he: ["שמור ברכיים מיושרות לכיוון האצבעות"],
      en: ["Track knees over toes"],
    },
    safetyNotes: { he: ["הימנע מעייפות יתר"], en: ["Avoid excessive fatigue"] },
    media: {
      image: "exercises/jump_squat.jpg",
      video: "",
      thumbnail: "exercises/jump_squat_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },
  {
    id: "bear_crawl_1",
    name: "זחילת דוב",
    nameLocalized: { he: "זחילת דוב", en: "Bear Crawl" },
    category: "cardio",
    primaryMuscles: ["core", "shoulders"],
    secondaryMuscles: ["quadriceps", "glutes"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["ידיים וברכיים", "הרם ברכיים מעט", "זחול קדימה"],
      en: ["Hands and knees", "Lift knees slightly", "Crawl forward"],
    },
    tips: { he: ["תנועות קצרות"], en: ["Use short steps"] },
    safetyNotes: { he: ["שמור גב ניטרלי"], en: ["Maintain neutral spine"] },
    media: {
      image: "exercises/bear_crawl.jpg",
      video: "",
      thumbnail: "exercises/bear_crawl_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "moderate",
  },
  {
    id: "superman_hold_1",
    name: "סופרמן",
    nameLocalized: { he: "סופרמן", en: "Superman Hold" },
    category: "strength",
    primaryMuscles: ["back", "glutes"],
    secondaryMuscles: ["hamstrings", "shoulders"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["שכב על הבטן", "הרם ידיים ורגליים", "החזק"],
      en: ["Lie prone", "Lift arms and legs", "Hold"],
    },
    tips: { he: ["צמצם עומס צוואר"], en: ["Keep neck neutral"] },
    safetyNotes: { he: ["הפסק בכאב גב"], en: ["Stop if back pain"] },
    media: {
      image: "exercises/superman_hold.jpg",
      video: "",
      thumbnail: "exercises/superman_hold_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "chair_tricep_dip_1",
    name: "דיפס על כיסא",
    nameLocalized: { he: "דיפס על כיסא", en: "Chair Tricep Dip" },
    category: "strength",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["shoulders", "chest"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["ידיים על קצה כיסא", "כופף מרפקים 90°", "דחוף למעלה"],
      en: ["Hands on chair edge", "Lower to ~90°", "Press back up"],
    },
    tips: { he: ["מרפקים לאחור"], en: ["Keep elbows back"] },
    safetyNotes: { he: ["הימנע עומס כתף"], en: ["Avoid shoulder strain"] },
    media: {
      image: "exercises/chair_dip.jpg",
      video: "",
      thumbnail: "exercises/chair_dip_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },
];

// ===============================================
// 🔧 Utility Functions - פונקציות עזר
// ===============================================

/**
 * Get exercises by difficulty level
 * קבלת תרגילים לפי רמת קושי
 */
export function getBodyweightExercisesByDifficulty(
  level: "beginner" | "intermediate" | "advanced"
): Exercise[] {
  return bodyweightExercises.filter(
    (exercise) => exercise.difficulty === level
  );
}

/**
 * Get exercises by primary muscle group
 * קבלת תרגילים לפי קבוצת שרירים עיקרית
 */
export function getBodyweightExercisesByMuscle(muscle: string): Exercise[] {
  return bodyweightExercises.filter((exercise) =>
    exercise.primaryMuscles.includes(muscle as Exercise["primaryMuscles"][0])
  );
}

/**
 * Get exercises suitable for small spaces
 * קבלת תרגילים מתאימים לחללים קטנים
 */
export function getMinimalSpaceExercises(): Exercise[] {
  return bodyweightExercises.filter(
    (exercise) => exercise.spaceRequired === "minimal"
  );
}

/**
 * Get silent exercises (apartment-friendly)
 * קבלת תרגילים שקטים (מתאים לדירה)
 */
export function getSilentExercises(): Exercise[] {
  return bodyweightExercises.filter(
    (exercise) => exercise.noiseLevel === "silent"
  );
}

/**
 * Get progression path for specific exercise
 * קבלת מסלול התקדמות לתרגיל ספציפי
 */
export function getExerciseProgression(exerciseId: string): Exercise[] {
  const progressions: { [key: string]: string[] } = {
    push_up_1: ["incline_push_up_1", "push_up_1", "decline_push_up_1"],
    plank_1: ["plank_1", "side_plank_1"],
    squat_bodyweight_1: ["squat_bodyweight_1", "jump_squat_bodyweight_1"],
    glute_bridge_1: ["glute_bridge_1", "single_leg_hip_thrust_1"],
  };

  const ids = progressions[exerciseId] || [exerciseId];
  return bodyweightExercises.filter((ex) => ids.includes(ex.id));
}

/**
 * Generate quick workout routine
 * יצירת סדרת אימון מהירה
 */
export function generateQuickBodyweightWorkout(
  duration: "short" | "medium" | "long",
  difficulty: "beginner" | "intermediate" | "advanced"
): Exercise[] {
  const exerciseCount = { short: 4, medium: 6, long: 8 }[duration];
  const availableExercises = getBodyweightExercisesByDifficulty(difficulty);

  // Ensure variety across muscle groups
  const selected: Exercise[] = [];
  const categories = ["strength", "core", "cardio"];

  categories.forEach((category) => {
    const categoryExercises = availableExercises.filter(
      (ex) => ex.category === category
    );
    if (categoryExercises.length > 0) {
      selected.push(categoryExercises[0]);
    }
  });

  // Fill remaining slots
  while (
    selected.length < exerciseCount &&
    selected.length < availableExercises.length
  ) {
    const remaining = availableExercises.filter((ex) => !selected.includes(ex));
    if (remaining.length > 0) {
      selected.push(remaining[0]);
    } else {
      break;
    }
  }

  return selected.slice(0, exerciseCount);
}

// Export utility constants for external use
export { PROGRESSION_LEVELS, EXERCISE_CATEGORIES };
