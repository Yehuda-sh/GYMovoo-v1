/**
 * @file water_weights.ts
 * @description תרגילים עם בקבוקי מים בלבד - פשוט ופרקטי!
 * Water bottle only exercises - Simple & Practical!
 */

import { Exercise } from "./types";

// ===== CONSTANTS =====
const BOTTLE_SIZES = {
  SMALL: "0.5", // חצי ליטר - למתחילים
  MEDIUM: "1.0", // ליטר - רמה בינונית
  LARGE: "1.5", // ליטר וחצי - למתקדמים
  XL: "2.0", // 2 ליטר - מאתגר
  SIXPACK: "6x1.5", // שישייה בתיק - למתקדמים מאוד
} as const;

// ===== HELPER FUNCTIONS =====

/**
 * יוצר תרגיל עם ערכי ברירת מחדל לבקבוקי מים
 */
function createBottleExercise(
  data: Partial<Exercise> & {
    id: string;
    name: string;
    nameLocalized: { he: string; en: string };
    primaryMuscles: string[];
    instructions: { he: string[]; en: string[] };
  }
): Exercise {
  return {
    // ברירות מחדל לכל התרגילים
    category: "strength",
    equipment: "water_bottles",
    difficulty: "beginner",
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
    secondaryMuscles: [],

    // נתוני התרגיל הספציפי
    ...data,

    // מדיה אוטומטית
    media: {
      image: `/images/${data.id}.jpg`,
      video: `/videos/${data.id}.mp4`,
      thumbnail: `/images/${data.id}_thumb.jpg`,
      ...data.media,
    },
  } as Exercise;
}

/**
 * טיפים סטנדרטיים לכל גודל בקבוק
 */
const bottleTips = {
  beginner: {
    he: [
      `התחל עם ${BOTTLE_SIZES.SMALL} ליטר`,
      "מלא רק 3/4 בהתחלה לשליטה טובה יותר",
      "הוסף מים בהדרגה",
      "אפשר להוסיף חול למשקל נוסף",
    ],
    en: [
      `Start with ${BOTTLE_SIZES.SMALL} liter`,
      "Fill only 3/4 at first for better control",
      "Add water gradually",
      "Can add sand for extra weight",
    ],
  },
  intermediate: {
    he: [
      `השתמש ב-${BOTTLE_SIZES.MEDIUM}-${BOTTLE_SIZES.LARGE} ליטר`,
      "וודא שהמכסה סגור היטב",
      "אחוז בחוזקה באזור הצר של הבקבוק",
      "עבוד לאט ובשליטה",
    ],
    en: [
      `Use ${BOTTLE_SIZES.MEDIUM}-${BOTTLE_SIZES.LARGE} liter`,
      "Ensure cap is tight",
      "Grip firmly at bottle neck",
      "Work slow and controlled",
    ],
  },
};

/**
 * הוראות בטיחות כלליות
 */
const safetyNotes = {
  he: ["ודא שהבקבוק סגור היטב", "התחל עם משקל קל", "שמור על טכניקה נכונה"],
  en: [
    "Ensure bottle is tightly closed",
    "Start with light weight",
    "Maintain proper form",
  ],
};

// ===== התרגילים - רק עם בקבוקי מים! =====

export const waterBottleExercises: Exercise[] = [
  // === תרגילי פלג גוף עליון ===

  createBottleExercise({
    id: "bottle_bicep_curl",
    name: "כיפוף זרוע",
    nameLocalized: {
      he: "כיפוף זרוע עם בקבוקים",
      en: "Bottle Bicep Curl",
    },
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    instructions: {
      he: [
        "בקבוק בכל יד, ידיים לצד הגוף",
        "כופף מרפקים ועלה עם הבקבוקים לכתפיים",
        "הורד לאט חזרה",
        `חזור 12-15 פעמים`,
      ],
      en: [
        "Bottle in each hand, arms at sides",
        "Bend elbows and curl bottles to shoulders",
        "Lower slowly back down",
        "Repeat 12-15 times",
      ],
    },
    tips: bottleTips.beginner,
    safetyNotes,
  }),

  createBottleExercise({
    id: "bottle_shoulder_press",
    name: "לחיצת כתפיים",
    nameLocalized: {
      he: "לחיצת כתפיים עם בקבוקים",
      en: "Bottle Shoulder Press",
    },
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps", "core"],
    instructions: {
      he: [
        "בקבוק בכל יד בגובה הכתפיים",
        "לחץ למעלה עד יישור הידיים",
        "הורד חזרה לכתפיים",
        "10-12 חזרות",
      ],
      en: [
        "Bottles at shoulder height",
        "Press up until arms straight",
        "Lower back to shoulders",
        "10-12 reps",
      ],
    },
    tips: bottleTips.intermediate,
    safetyNotes,
  }),

  createBottleExercise({
    id: "bottle_tricep_extension",
    name: "יישור טרייספס",
    nameLocalized: {
      he: "יישור טרייספס עם בקבוק",
      en: "Bottle Tricep Extension",
    },
    primaryMuscles: ["triceps"],
    instructions: {
      he: [
        `בקבוק ${BOTTLE_SIZES.LARGE} ליטר בשתי ידיים`,
        "הרם מעל הראש",
        "הורד מאחורי הראש בכיפוף מרפקים",
        "החזר למעלה",
      ],
      en: [
        `${BOTTLE_SIZES.LARGE} liter bottle in both hands`,
        "Raise overhead",
        "Lower behind head by bending elbows",
        "Return up",
      ],
    },
    tips: bottleTips.intermediate,
    safetyNotes,
  }),

  createBottleExercise({
    id: "bottle_chest_fly",
    name: "פתיחת חזה",
    nameLocalized: {
      he: "פתיחת חזה עם בקבוקים",
      en: "Bottle Chest Fly",
    },
    primaryMuscles: ["chest"],
    secondaryMuscles: ["shoulders"],
    instructions: {
      he: [
        "שכב על הגב עם בקבוק בכל יד",
        "ידיים מעל החזה",
        "פתח לצדדים עד מתיחה בחזה",
        "החזר למרכז",
      ],
      en: [
        "Lie on back with bottle in each hand",
        "Arms above chest",
        "Open to sides until chest stretch",
        "Return to center",
      ],
    },
    tips: bottleTips.beginner,
    safetyNotes,
    spaceRequired: "small",
  }),

  createBottleExercise({
    id: "bottle_bent_row",
    name: "חתירה בכפיפה",
    nameLocalized: {
      he: "חתירה בכפיפה עם בקבוקים",
      en: "Bottle Bent-Over Row",
    },
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "core"],
    difficulty: "intermediate",
    instructions: {
      he: [
        "כופף קדימה עם גב ישר",
        "בקבוק בכל יד",
        "משוך בקבוקים לבטן",
        "הורד בשליטה",
      ],
      en: [
        "Bend forward with straight back",
        "Bottle in each hand",
        "Pull bottles to stomach",
        "Lower controlled",
      ],
    },
    tips: bottleTips.intermediate,
    safetyNotes,
  }),

  // === תרגילי רגליים וישבן ===

  createBottleExercise({
    id: "bottle_squat",
    name: "סקוואט עם בקבוקים",
    nameLocalized: {
      he: "סקוואט עם בקבוקים",
      en: "Bottle Squat",
    },
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    instructions: {
      he: [
        `בקבוק ${BOTTLE_SIZES.LARGE} בשתי ידיים בגובה החזה`,
        "רגליים ברוחב כתפיים",
        "רד למטה כמו ישיבה על כיסא",
        "עלה דרך העקבים",
      ],
      en: [
        `${BOTTLE_SIZES.LARGE} bottle held at chest`,
        "Feet shoulder-width",
        "Lower like sitting on chair",
        "Push up through heels",
      ],
    },
    tips: bottleTips.intermediate,
    safetyNotes,
    spaceRequired: "small",
  }),

  createBottleExercise({
    id: "bottle_lunges",
    name: "מכרעים עם בקבוקים",
    nameLocalized: {
      he: "מכרעים עם בקבוקים",
      en: "Bottle Lunges",
    },
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves"],
    difficulty: "intermediate",
    instructions: {
      he: [
        "בקבוק בכל יד לצד הגוף",
        "צעד גדול קדימה",
        "רד עד 90 מעלות בברכיים",
        "חזור והחלף רגל",
      ],
      en: [
        "Bottle in each hand at sides",
        "Big step forward",
        "Lower to 90 degrees at knees",
        "Return and switch legs",
      ],
    },
    tips: bottleTips.beginner,
    safetyNotes: {
      he: [...safetyNotes.he, "שמור על ברך מעל הקרסול"],
      en: [...safetyNotes.en, "Keep knee above ankle"],
    },
    spaceRequired: "medium",
  }),

  createBottleExercise({
    id: "bottle_deadlift",
    name: "דדליפט עם בקבוקים",
    nameLocalized: {
      he: "דדליפט עם בקבוקים",
      en: "Bottle Deadlift",
    },
    primaryMuscles: ["hamstrings", "glutes", "back"],
    secondaryMuscles: ["core"],
    difficulty: "intermediate",
    instructions: {
      he: [
        "בקבוק בכל יד מול הירכיים",
        "כופף ירכיים והורד בקבוקים לאורך הרגליים",
        "שמור על גב ישר",
        "עלה חזרה דרך הירכיים",
      ],
      en: [
        "Bottles in front of thighs",
        "Hinge hips and lower bottles along legs",
        "Keep back straight",
        "Rise back through hips",
      ],
    },
    tips: bottleTips.intermediate,
    safetyNotes,
  }),

  createBottleExercise({
    id: "bottle_calf_raises",
    name: "עליות על בהונות",
    nameLocalized: {
      he: "עליות על בהונות עם בקבוקים",
      en: "Bottle Calf Raises",
    },
    primaryMuscles: ["calves"],
    instructions: {
      he: [
        "בקבוק בכל יד",
        "עמוד ישר",
        "עלה על בהונות גבוה ככל האפשר",
        "רד לאט",
      ],
      en: [
        "Bottle in each hand",
        "Stand straight",
        "Rise on toes as high as possible",
        "Lower slowly",
      ],
    },
    tips: {
      he: ["15-20 חזרות", "החזק למעלה 2 שניות", "אפשר על רגל אחת למתקדמים"],
      en: [
        "15-20 reps",
        "Hold at top for 2 seconds",
        "Can do single-leg for advanced",
      ],
    },
    safetyNotes,
  }),

  // === תרגילי ליבה ===

  createBottleExercise({
    id: "bottle_russian_twist",
    name: "סיבובי רוסיה",
    nameLocalized: {
      he: "סיבובי רוסיה עם בקבוק",
      en: "Bottle Russian Twist",
    },
    primaryMuscles: ["core"],
    secondaryMuscles: ["core"], // obliques הם חלק מה-core
    instructions: {
      he: [
        "שב עם ברכיים כפופות",
        "הטה גוף אחורה 45 מעלות",
        `אחוז בקבוק ${BOTTLE_SIZES.LARGE}`,
        "סובב מצד לצד",
      ],
      en: [
        "Sit with knees bent",
        "Lean back 45 degrees",
        `Hold ${BOTTLE_SIZES.LARGE} bottle`,
        "Rotate side to side",
      ],
    },
    tips: {
      he: ["הרם רגליים למתקדמים", "20-30 סיבובים", "נשום בקצביות"],
      en: ["Lift feet for advanced", "20-30 twists", "Breathe rhythmically"],
    },
    safetyNotes,
  }),

  createBottleExercise({
    id: "bottle_weighted_situps",
    name: "כפיפות בטן עם משקל",
    nameLocalized: {
      he: "כפיפות בטן עם בקבוק",
      en: "Weighted Sit-ups",
    },
    primaryMuscles: ["core"],
    instructions: {
      he: ["שכב על הגב", "החזק בקבוק על החזה", "עלה לישיבה", "רד בשליטה"],
      en: [
        "Lie on back",
        "Hold bottle on chest",
        "Rise to sitting",
        "Lower controlled",
      ],
    },
    tips: bottleTips.beginner,
    safetyNotes,
  }),

  // === תרגילים משולבים (Full Body) ===

  createBottleExercise({
    id: "bottle_thrusters",
    name: "ת'ראסטרס",
    nameLocalized: {
      he: "סקוואט ולחיצה עם בקבוקים",
      en: "Bottle Thrusters",
    },
    primaryMuscles: ["quadriceps", "shoulders", "glutes"],
    secondaryMuscles: ["core", "triceps"],
    difficulty: "intermediate",
    instructions: {
      he: [
        "בקבוקים בגובה הכתפיים",
        "בצע סקוואט מלא",
        "בעלייה, לחץ בקבוקים מעל הראש",
        "חזור למצב התחלה",
      ],
      en: [
        "Bottles at shoulder height",
        "Perform full squat",
        "On rise, press bottles overhead",
        "Return to start",
      ],
    },
    tips: {
      he: ["תנועה רציפה אחת", "נצל את המומנטום", "8-10 חזרות", "מצוין לקרדיו"],
      en: [
        "One continuous movement",
        "Use the momentum",
        "8-10 reps",
        "Great for cardio",
      ],
    },
    safetyNotes,
    spaceRequired: "small",
  }),

  createBottleExercise({
    id: "bottle_burpees",
    name: "ברפיז עם בקבוקים",
    nameLocalized: {
      he: "ברפיז עם בקבוקים",
      en: "Bottle Burpees",
    },
    primaryMuscles: ["core"], // full_body לא קיים בטיפוס, נשתמש ב-core
    secondaryMuscles: ["shoulders", "chest", "quadriceps"],
    difficulty: "advanced",
    instructions: {
      he: [
        "התחל עם בקבוק בכל יד",
        "הנח בקבוקים, קפוץ לפלאנק",
        "עשה שכיבת סמיכה",
        "קפוץ חזרה, הרם בקבוקים מעל הראש",
      ],
      en: [
        "Start with bottle in each hand",
        "Place bottles, jump to plank",
        "Do a push-up",
        "Jump back, raise bottles overhead",
      ],
    },
    tips: {
      he: ["תרגיל מאתגר מאוד", "5-8 חזרות להתחלה", "מצוין לשריפת קלוריות"],
      en: [
        "Very challenging exercise",
        "5-8 reps to start",
        "Great for calorie burn",
      ],
    },
    safetyNotes: {
      he: [...safetyNotes.he, "לא למתחילים"],
      en: [...safetyNotes.en, "Not for beginners"],
    },
    spaceRequired: "medium",
  }),

  // === שישיית מים - למתקדמים ===

  createBottleExercise({
    id: "sixpack_carry",
    name: "נשיאת שישייה",
    nameLocalized: {
      he: "נשיאת שישיית מים",
      en: "Six-Pack Carry",
    },
    primaryMuscles: ["core", "shoulders", "forearms"],
    secondaryMuscles: ["back"],
    equipment: "water_sixpack",
    difficulty: "advanced",
    instructions: {
      he: [
        "הכנס שישיית בקבוקים לתיק חזק",
        "אחוז בידית התיק ביד אחת",
        "הלך 20-30 צעדים",
        "החלף יד וחזור",
      ],
      en: [
        "Put six-pack in strong bag",
        "Hold bag handle in one hand",
        "Walk 20-30 steps",
        "Switch hands and return",
      ],
    },
    tips: {
      he: [
        "שישייה = כ-9 ק״ג",
        "שמור על גוף זקוף",
        "אל תיטה לצד",
        "מצוין לחיזוק הליבה",
      ],
      en: [
        "Six-pack = ~9 kg",
        "Keep body upright",
        "Don't lean to side",
        "Great for core strength",
      ],
    },
    safetyNotes: {
      he: ["ודא שהתיק חזק", "התחל עם 3-4 בקבוקים", "עצור אם מרגיש כאב בגב"],
      en: [
        "Ensure bag is strong",
        "Start with 3-4 bottles",
        "Stop if feeling back pain",
      ],
    },
    spaceRequired: "medium",
  }),
];

// ===== פונקציות עזר פרקטיות =====

/**
 * מחזיר תוכנית אימון מלאה עם בקבוקים
 */
export function getFullWorkout(
  difficulty: "beginner" | "intermediate" | "advanced"
) {
  const workout = {
    beginner: [
      "bottle_bicep_curl",
      "bottle_shoulder_press",
      "bottle_squat",
      "bottle_russian_twist",
    ],
    intermediate: [
      "bottle_bent_row",
      "bottle_thrusters",
      "bottle_lunges",
      "bottle_deadlift",
      "bottle_russian_twist",
    ],
    advanced: [
      "bottle_burpees",
      "sixpack_carry",
      "bottle_thrusters",
      "bottle_deadlift",
      "bottle_russian_twist",
    ],
  };

  return waterBottleExercises.filter((ex) =>
    workout[difficulty].includes(ex.id)
  );
}

/**
 * מחזיר כמה בקבוקים צריך לכל רמה
 */
export function getRequiredBottles(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return `2 בקבוקים של ${BOTTLE_SIZES.SMALL}-${BOTTLE_SIZES.MEDIUM} ליטר`;
    case "intermediate":
      return `2 בקבוקים של ${BOTTLE_SIZES.LARGE} ליטר`;
    case "advanced":
      return `שישיית ${BOTTLE_SIZES.LARGE} או 2 בקבוקים של ${BOTTLE_SIZES.XL} ליטר`;
    default:
      return `2 בקבוקים של ${BOTTLE_SIZES.MEDIUM} ליטר`;
  }
}

/**
 * טיפים להכנת הבקבוקים
 */
export const bottlePreparationTips = {
  he: [
    "מלא בקבוקים עד 90% למניעת נזילות",
    "הדק את המכסה חזק מאוד",
    "עטוף בסקוטצ׳ טייפ לאחיזה טובה יותר",
    "התחל עם מים, מתקדמים יכולים להוסיף חול",
    "סמן את הבקבוקים לפי משקל",
  ],
  en: [
    "Fill bottles to 90% to prevent leaks",
    "Tighten cap very firmly",
    "Wrap with tape for better grip",
    "Start with water, advanced can add sand",
    "Mark bottles by weight",
  ],
};

// ===== סטטיסטיקות פשוטות =====
export const stats = {
  totalExercises: waterBottleExercises.length,
  beginnerExercises: waterBottleExercises.filter(
    (e) => e.difficulty === "beginner"
  ).length,
  upperBody: waterBottleExercises.filter((e) =>
    (["biceps", "triceps", "shoulders", "chest", "back"] as const).some((m) =>
      e.primaryMuscles.includes(m)
    )
  ).length,
  lowerBody: waterBottleExercises.filter((e) =>
    (["quadriceps", "glutes", "hamstrings", "calves"] as const).some((m) =>
      e.primaryMuscles.includes(m)
    )
  ).length,
  core: waterBottleExercises.filter((e) => e.primaryMuscles.includes("core"))
    .length,
};
export const waterWeightExercises = waterBottleExercises;
