/**
 * @file cardio.ts
 * @description תרגילי קרדיו - מאגר לאימונים אירוביים ביתיים
 * @description Cardio exercises - aerobic home workout database
 * @category Exercise Database
 * @features 13 exercises, equipment-free, varied intensity levels
 * @updated 2025-08-15 Enhanced with intensity levels and performance metrics
 */

import { Exercise } from "./types";

// Cardio intensity levels and classifications
const CARDIO_INTENSITY = {
  LOW: [
    "shadow_boxing_1",
    "invisible_jump_rope_1",
    "high_knees_1",
    "butt_kicks_1",
    "fast_feet_1",
  ],
  MODERATE: [
    "jumping_jacks_1",
    "mountain_climbers_1",
    "lateral_shuffles_1",
    "plank_jacks_1",
    "skaters_1",
  ],
  HIGH: ["burpee_1", "burpees_no_pushup_1"],
} as const;

// Exercise duration recommendations (in seconds)
const CARDIO_DURATIONS = {
  BEGINNER: { work: 20, rest: 40 },
  INTERMEDIATE: { work: 30, rest: 30 },
  ADVANCED: { work: 45, rest: 15 },
} as const;

export const cardioExercises: Exercise[] = [
  {
    id: "jumping_jacks_1",
    name: "קפיצות פתיחה",
    nameLocalized: {
      he: "קפיצות פתיחה וסגירה",
      en: "Jumping Jacks",
    },
    category: "cardio",
    primaryMuscles: ["quadriceps", "hamstrings"],
    secondaryMuscles: ["shoulders", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד זקוף עם רגליים צמודות וידיים בצדי הגוף",
        "קפוץ ופתח את הרגליים ברוחב הכתפיים",
        "בו זמנית הרם את הידיים מעל הראש",
        "קפוץ שוב וחזור לעמדת ההתחלה",
      ],
      en: [
        "Stand upright with feet together and arms at sides",
        "Jump and spread feet to shoulder-width apart",
        "Simultaneously raise arms overhead",
        "Jump again and return to starting position",
      ],
    },
    tips: {
      he: [
        "שמור על קצב קבוע ומתמיד",
        "נחיתה רכה על כרית כף הרגל",
        "שמור על הליבה מתוחה",
        "התחל עם 30 שניות ועלה בהדרגה",
      ],
      en: [
        "Maintain steady, consistent pace",
        "Land softly on balls of feet",
        "Keep core engaged",
        "Start with 30 seconds and progress gradually",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בברכיים",
        "התחל לאט והגדל עצימות",
        "ודא משטח יציב",
        "שתה מים במהלך האימון",
      ],
      en: [
        "Stop if you feel knee pain",
        "Start slow and increase intensity",
        "Ensure stable surface",
        "Stay hydrated during workout",
      ],
    },
    media: {
      image: "exercises/jumping_jacks.jpg",
      video: "exercises/jumping_jacks.mp4",
      thumbnail: "exercises/jumping_jacks_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },

  {
    id: "burpee_1",
    name: "ברפי",
    nameLocalized: {
      he: "ברפי מלא",
      en: "Full Burpee",
    },
    category: "cardio",
    // Full body mapped to representative major groups
    primaryMuscles: ["shoulders", "chest", "back", "core"],
    secondaryMuscles: ["quadriceps", "hamstrings", "glutes"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: [
        "עמוד זקוף עם רגליים ברוחב כתפיים",
        "רד לכיפוף ברכיים ושים את הידיים על הרצפה",
        "קפוץ עם הרגליים אחורה לעמדת פלאנק",
        "בצע שכיבת סמיכה אחת",
        "קפוץ עם הרגליים קדימה לכיפוף ברכיים",
        "קפוץ למעלה עם הידיים מעל הראש",
      ],
      en: [
        "Stand upright with feet shoulder-width apart",
        "Squat down and place hands on floor",
        "Jump feet back into plank position",
        "Perform one push-up",
        "Jump feet forward back to squat",
        "Jump up with arms overhead",
      ],
    },
    tips: {
      he: [
        "התחל לאט ובצע בטכניקה נכונה",
        "נשום לאורך כל התרגיל",
        "אם קשה - בצע ללא קפיצה בסוף",
      ],
      en: [
        "Start slow with proper technique",
        "Breathe throughout entire exercise",
        "If difficult - skip final jump",
      ],
    },
    safetyNotes: {
      he: [
        "תרגיל מתקדם - התחל עם גרסה מקלה",
        "הפסק אם מרגיש סחרחורת",
        "ודא משטח לא חלק",
      ],
      en: [
        "Advanced exercise - start with easier version",
        "Stop if feeling dizzy",
        "Ensure non-slip surface",
      ],
    },
    media: {
      image: "exercises/burpee_full.jpg",
      video: "exercises/burpee_full.mp4",
      thumbnail: "exercises/burpee_full_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "loud",
  },

  {
    id: "mountain_climbers_1",
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
        "העלה ברך אחת לעבר החזה",
        "החלף רגליים במהירות",
        "המשך להחליף במקצב מהיר",
      ],
      en: [
        "Start in plank position with straight arms",
        "Bring one knee toward chest",
        "Switch legs quickly",
        "Continue alternating at fast pace",
      ],
    },
    tips: {
      he: ["שמור על ירכיים יציבות", "אל תתן לישבן להתרומם", "נשום באופן קבוע"],
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
    id: "high_knees_1",
    name: "ברכיים גבוהות",
    nameLocalized: { he: "ברכיים גבוהות", en: "High Knees" },
    category: "cardio",
    primaryMuscles: ["quadriceps", "hamstrings"],
    secondaryMuscles: ["calves", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["רוץ במקום", "העלה ברכיים לגובה המותן"],
      en: ["Run in place", "Drive knees to hip height"],
    },
    tips: { he: ["שמור קצב"], en: ["Maintain rhythm"] },
    safetyNotes: { he: ["נחיתה רכה"], en: ["Soft landing"] },
    media: {
      image: "exercises/high_knees.jpg",
      video: "",
      thumbnail: "exercises/high_knees_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },
  {
    id: "butt_kicks_1",
    name: "בעיטות לעכוז",
    nameLocalized: { he: "בעיטות לעכוז", en: "Butt Kicks" },
    category: "cardio",
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["quadriceps", "calves"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["רוץ במקום", "הקפץ עקבים לעכוז"],
      en: ["Run in place", "Kick heels to glutes"],
    },
    tips: { he: ["תנועה קצבית"], en: ["Keep steady tempo"] },
    safetyNotes: { he: ["הרחק מרהיטים"], en: ["Clear surroundings"] },
    media: {
      image: "exercises/butt_kicks.jpg",
      video: "",
      thumbnail: "exercises/butt_kicks_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },
  {
    id: "burpees_no_pushup_1",
    name: "בורפי ללא שכיבה",
    nameLocalized: { he: "בורפי ללא שכיבה", en: "Burpee (No Push-Up)" },
    category: "cardio",
    primaryMuscles: ["quadriceps", "core"],
    secondaryMuscles: ["shoulders", "calves"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: ["סקווט-פלנק-קפיצה"],
      en: ["Squat-plank-jump sequence"],
    },
    tips: { he: ["שליטה בנחיתה"], en: ["Control landing"] },
    safetyNotes: { he: ["הימנע מגב שקוע"], en: ["Avoid low back sag"] },
    media: {
      image: "exercises/burpee.jpg",
      video: "",
      thumbnail: "exercises/burpee_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "loud",
  },
  {
    id: "skaters_1",
    name: "סקייטרס",
    nameLocalized: { he: "סקייטרס", en: "Skaters" },
    category: "cardio",
    primaryMuscles: ["glutes", "quadriceps"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["קפיצה אלכסונית צד לצד"],
      en: ["Lateral bound side to side"],
    },
    tips: { he: ["נחיתה רכה"], en: ["Soft landings"] },
    safetyNotes: { he: ["שמור ברך מיושרת"], en: ["Track knee alignment"] },
    media: {
      image: "exercises/skaters.jpg",
      video: "",
      thumbnail: "exercises/skaters_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "moderate",
  },
  {
    id: "jump_rope_invisible_1",
    name: "דילוג חבל דמיוני",
    nameLocalized: { he: "דילוג חבל דמיוני", en: "Invisible Jump Rope" },
    category: "cardio",
    primaryMuscles: ["calves"],
    secondaryMuscles: ["quadriceps", "shoulders"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["הקפצות קטנות", "סיבוב ידיים דמיוני"],
      en: ["Small hops", "Simulate rope turns"],
    },
    tips: { he: ["נחיתה על כריות כף רגל"], en: ["Land on balls of feet"] },
    safetyNotes: { he: ["הימנע ממשטח חלק"], en: ["Avoid slippery floor"] },
    media: {
      image: "exercises/invisible_jump_rope.jpg",
      video: "",
      thumbnail: "exercises/invisible_jump_rope_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },
  {
    id: "lateral_shuffles_1",
    name: "שפל צדדי",
    nameLocalized: { he: "שפל צדדי", en: "Lateral Shuffles" },
    category: "cardio",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: { he: ["תנועת צד מהירה"], en: ["Quick side steps"] },
    tips: { he: ["ישבן נמוך"], en: ["Stay low"] },
    safetyNotes: { he: ["שמור משטח פנוי"], en: ["Clear area"] },
    media: {
      image: "exercises/lateral_shuffles.jpg",
      video: "",
      thumbnail: "exercises/lateral_shuffles_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "moderate",
  },
  {
    id: "plank_jacks_1",
    name: "פלאנק ג'אמפס",
    nameLocalized: { he: "פלאנק ג'אמפס", en: "Plank Jacks" },
    category: "cardio",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "glutes"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["פלאנק גבוה", "קפיצת רגליים החוצה ופנימה"],
      en: ["High plank", "Hop feet out and in"],
    },
    tips: { he: ["החזק ליבה"], en: ["Brace core"] },
    safetyNotes: { he: ["אל תקשית גב"], en: ["Don't arch back"] },
    media: {
      image: "exercises/plank_jacks.jpg",
      video: "",
      thumbnail: "exercises/plank_jacks_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "moderate",
  },
  {
    id: "fast_feet_1",
    name: "רגליים מהירות",
    nameLocalized: { he: "רגליים מהירות", en: "Fast Feet" },
    category: "cardio",
    primaryMuscles: ["calves", "quadriceps"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: { he: ["צעדים קצרים מהירים"], en: ["Short quick steps"] },
    tips: { he: ["הישאר קל"], en: ["Stay light"] },
    safetyNotes: { he: ["נעליים תומכות"], en: ["Wear supportive shoes"] },
    media: {
      image: "exercises/fast_feet.jpg",
      video: "",
      thumbnail: "exercises/fast_feet_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },
  {
    id: "shadow_boxing_1",
    name: "שדואו בוקסינג",
    nameLocalized: { he: "שדואו בוקסינג", en: "Shadow Boxing" },
    category: "cardio",
    primaryMuscles: ["shoulders", "core"],
    secondaryMuscles: ["triceps", "biceps"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["זרוק אגרופים באוויר"],
      en: ["Throw punches in the air"],
    },
    tips: { he: ["שמור guard"], en: ["Maintain guard"] },
    safetyNotes: { he: ["אל תנעל מרפקים"], en: ["Don't lock elbows"] },
    media: {
      image: "exercises/shadow_boxing.jpg",
      video: "",
      thumbnail: "exercises/shadow_boxing_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },
];

// ===============================================
// 🏃‍♂️ Cardio Utility Functions - פונקציות עזר לקרדיו
// ===============================================

/**
 * Get cardio exercises by intensity level
 * קבלת תרגילי קרדיו לפי רמת עצימות
 */
export function getCardioByIntensity(
  intensity: "low" | "moderate" | "high"
): Exercise[] {
  const intensityMap = {
    low: CARDIO_INTENSITY.LOW,
    moderate: CARDIO_INTENSITY.MODERATE,
    high: CARDIO_INTENSITY.HIGH,
  };

  const targetIds = intensityMap[intensity];
  return cardioExercises.filter((exercise) =>
    (targetIds as readonly string[]).includes(exercise.id)
  );
}

/**
 * Get quiet cardio exercises (apartment-friendly)
 * קבלת תרגילי קרדיו שקטים (מתאים לדירה)
 */
export function getQuietCardioExercises(): Exercise[] {
  return cardioExercises.filter(
    (exercise) =>
      exercise.noiseLevel === "quiet" || exercise.noiseLevel === "moderate"
  );
}

/**
 * Get high-impact vs low-impact cardio
 * קבלת תרגילי קרדיו עם עומס גבוה/נמוך על המפרקים
 */
export function getCardioByImpact(type: "low" | "high"): Exercise[] {
  const lowImpactIds = [
    "shadow_boxing_1",
    "mountain_climbers_1",
    "plank_jacks_1",
  ];
  const highImpactIds = [
    "jumping_jacks_1",
    "burpee_1",
    "high_knees_1",
    "butt_kicks_1",
    "skaters_1",
  ];

  const targetIds = type === "low" ? lowImpactIds : highImpactIds;
  return cardioExercises.filter((exercise) => targetIds.includes(exercise.id));
}

/**
 * Generate HIIT workout from cardio exercises
 * יצירת אימון HIIT מתרגילי קרדיו
 */
export function generateHIITWorkout(
  difficulty: "beginner" | "intermediate" | "advanced",
  duration: number = 15 // minutes
): {
  exercises: Exercise[];
  workTime: number;
  restTime: number;
  rounds: number;
} {
  const durations =
    CARDIO_DURATIONS[difficulty.toUpperCase() as keyof typeof CARDIO_DURATIONS];
  const exerciseCount = 6;
  const roundTime = durations.work + durations.rest;
  const rounds = Math.floor((duration * 60) / (roundTime * exerciseCount));

  // Select varied exercises across intensities
  const lowIntensity = getCardioByIntensity("low").slice(0, 2);
  const moderateIntensity = getCardioByIntensity("moderate").slice(0, 3);
  const highIntensity =
    difficulty === "advanced" ? getCardioByIntensity("high").slice(0, 1) : [];

  const selectedExercises = [
    ...lowIntensity,
    ...moderateIntensity,
    ...highIntensity,
  ];

  return {
    exercises: selectedExercises.slice(0, exerciseCount),
    workTime: durations.work,
    restTime: durations.rest,
    rounds: Math.max(1, rounds),
  };
}

/**
 * Get cardio exercises by space requirements
 * קבלת תרגילי קרדיו לפי דרישות מקום
 */
export function getCardioBySpace(
  spaceType: "minimal" | "small" | "medium"
): Exercise[] {
  return cardioExercises.filter((exercise) => {
    if (spaceType === "minimal") return exercise.spaceRequired === "minimal";
    if (spaceType === "small")
      return ["minimal", "small"].includes(exercise.spaceRequired);
    return ["minimal", "small", "medium"].includes(exercise.spaceRequired);
  });
}

/**
 * Calculate estimated calories burned
 * חישוב משוער של קלוריות שנשרפו
 */
export function estimateCaloriesBurned(
  exerciseId: string,
  durationMinutes: number,
  weightKg: number = 70
): number {
  // Calorie burn rates per minute for 70kg person (approximate)
  const calorieRates: { [key: string]: number } = {
    jumping_jacks_1: 8,
    burpee_1: 12,
    mountain_climbers_1: 9,
    high_knees_1: 7,
    butt_kicks_1: 7,
    burpees_no_pushup_1: 10,
    skaters_1: 8,
    invisible_jump_rope_1: 9,
    lateral_shuffles_1: 6,
    plank_jacks_1: 7,
    fast_feet_1: 6,
    shadow_boxing_1: 5,
  };

  const baseRate = calorieRates[exerciseId] || 7;
  const weightFactor = weightKg / 70; // Adjust for different weights

  return Math.round(baseRate * durationMinutes * weightFactor);
}

// Export utility constants for external use
export { CARDIO_INTENSITY, CARDIO_DURATIONS };
