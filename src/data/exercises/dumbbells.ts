/**
 * @file dumbbells.ts
 * @description תרגילי משקולות - מאגר לאימוני כח עם משקולות חופשיות
 * @description Dumbbell exercises - strength training with free weights database
 * @category Exercise Database
 * @features 14 exercises, full-body coverage, beginner to intermediate levels
 * @equipment Requires adjustable dumbbells (5-25kg recommended)
 * @updated 2025-08-15 Enhanced with muscle group classifications and weight recommendations
 */

import { Exercise } from "./types";

// Dumbbell exercise classifications by muscle groups
const MUSCLE_GROUP_CATEGORIES = {
  UPPER_BODY: {
    CHEST: [
      "dumbbell_chest_press_1",
      "dumbbell_chest_fly_1",
      "dumbbell_bent_arm_pull_over_1",
    ],
    SHOULDERS: ["dumbbell_shoulder_press_1", "dumbbell_lateral_raise_1"],
    BACK: ["dumbbell_row_1", "dumbbell_bent_arm_pull_over_1"],
    ARMS: [
      "dumbbell_biceps_curl_1",
      "dumbbell_hammer_curl_1",
      "dumbbell_triceps_kickback_1",
    ],
  },
  LOWER_BODY: {
    LEGS: [
      "dumbbell_squat_1",
      "dumbbell_reverse_lunge_1",
      "dumbbell_deadlift_1",
    ],
    CALVES: ["dumbbell_calf_raise_1"],
  },
  COMPOUND: [
    "dumbbell_squat_1",
    "dumbbell_deadlift_1",
    "dumbbell_reverse_lunge_1",
    "dumbbell_row_1",
  ],
} as const;

// Weight recommendations by exercise and experience level (kg)
const WEIGHT_RECOMMENDATIONS = {
  BEGINNER: {
    men: { light: 3, medium: 5, heavy: 8 },
    women: { light: 2, medium: 3, heavy: 5 },
  },
  INTERMEDIATE: {
    men: { light: 8, medium: 12, heavy: 18 },
    women: { light: 5, medium: 8, heavy: 12 },
  },
  ADVANCED: {
    men: { light: 15, medium: 22, heavy: 30 },
    women: { light: 10, medium: 15, heavy: 20 },
  },
} as const;

export const dumbbellExercises: Exercise[] = [
  {
    id: "dumbbell_chest_press_1",
    name: "דחיפת חזה עם משקולות",
    nameLocalized: {
      he: "דחיפת חזה עם משקולות",
      en: "Dumbbell Chest Press",
    },
    category: "strength",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: [
        "שכב על הגב עם משקולות בשתי הידיים",
        "התחל עם המשקולות בגובה החזה, מרפקים כפופים",
        "דחף את המשקולות כלפי מעלה עד זרועות ישרות",
        "הורד בשליטה חזרה לעמדת ההתחלה",
      ],
      en: [
        "Lie on back with dumbbells in both hands",
        "Start with dumbbells at chest level, elbows bent",
        "Press dumbbells up until arms are straight",
        "Lower with control back to starting position",
      ],
    },
    tips: {
      he: [
        "אל תנעל את המרפקים בחלק העליון",
        "שמור על שליטה מלאה בירידה",
        "המשקולות צריכות לנוע במסלול ישר",
      ],
      en: [
        "Don't lock elbows at the top",
        "Maintain full control on the descent",
        "Dumbbells should move in straight path",
      ],
    },
    safetyNotes: {
      he: [
        "השתמש במשקולות מתאימות לרמתך",
        "ודא יציבות לפני תחילת התרגיל",
        "בקש עזרה אם המשקל כבד",
      ],
      en: [
        "Use appropriate weight for your level",
        "Ensure stability before starting",
        "Ask for help if weight is heavy",
      ],
    },
    media: {
      image: "exercises/dumbbell_chest_press.jpg",
      video: "exercises/dumbbell_chest_press.mp4",
      thumbnail: "exercises/dumbbell_chest_press_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },

  {
    id: "dumbbell_squat_1",
    name: "כיפופי ברכיים עם משקולות",
    nameLocalized: {
      he: "כיפופי ברכיים עם משקולות",
      en: "Dumbbell Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: [
        "החזק משקולת בכל יד בצדי הגוף",
        "עמוד עם רגליים ברוחב כתפיים",
        "רד לכיפוף ברכיים כמו יושב על כיסא",
        "עלה בכוח דרך העקבים חזרה למעלה",
      ],
      en: [
        "Hold one dumbbell in each hand at sides",
        "Stand with feet shoulder-width apart",
        "Squat down like sitting in a chair",
        "Drive up through heels back to standing",
      ],
    },
    tips: {
      he: [
        "שמור על הגב ישר והחזה פתוח",
        "רוב המשקל על העקבים",
        "המשקולות נשארות בצדי הגוף",
      ],
      en: [
        "Keep back straight and chest up",
        "Most weight should be on heels",
        "Dumbbells stay at sides of body",
      ],
    },
    safetyNotes: {
      he: [
        "התחל עם משקולות קלות",
        "הפסק אם כואב בגב או ברכיים",
        "ודא אחיזה יציבה של המשקולות",
      ],
      en: [
        "Start with light dumbbells",
        "Stop if back or knees hurt",
        "Ensure secure grip on dumbbells",
      ],
    },
    media: {
      image: "exercises/dumbbell_squat.jpg",
      video: "exercises/dumbbell_squat.mp4",
      thumbnail: "exercises/dumbbell_squat_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },

  {
    id: "dumbbell_row_1",
    name: "חתירה עם משקולת אחת",
    nameLocalized: {
      he: "חתירה עם משקולת אחת",
      en: "Single Dumbbell Row",
    },
    category: "strength",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "shoulders"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: [
        "העמד רגל אחת על ספסל או משטח גבוה",
        "החזק משקולת ביד הנגדית",
        "השען עם היד החופשית על הספסל",
        "משוך את המשקולת לעבר הבטן",
      ],
      en: [
        "Place one foot on bench or elevated surface",
        "Hold dumbbell in opposite hand",
        "Support with free hand on bench",
        "Pull dumbbell toward abdomen",
      ],
    },
    tips: {
      he: [
        "שמור על הגב ישר לאורך התנועה",
        "משוך עם שרירי הגב, לא הזרוע",
        "הרגש את הכתף נסחבת אחורה",
      ],
      en: [
        "Keep back straight throughout movement",
        "Pull with back muscles, not arm",
        "Feel shoulder blade pulling back",
      ],
    },
    safetyNotes: {
      he: [
        "וודא יציבות לפני תחילה",
        "התחל עם משקל קל",
        "הפסק אם כואב בגב תחתון",
      ],
      en: [
        "Ensure stability before starting",
        "Start with light weight",
        "Stop if lower back hurts",
      ],
    },
    media: {
      image: "exercises/dumbbell_row.jpg",
      video: "exercises/dumbbell_row.mp4",
      thumbnail: "exercises/dumbbell_row_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },

  {
    id: "dumbbell_shoulder_press_1",
    name: "לחיצת כתפיים עם משקולות",
    nameLocalized: {
      he: "לחיצת כתפיים עם משקולות",
      en: "Dumbbell Shoulder Press",
    },
    category: "strength",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps", "core"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: ["שב או עמוד", "משקולות בגובה כתפיים", "דחוף מעלה", "הורד בשליטה"],
      en: [
        "Sit or stand",
        "Dumbbells at shoulder height",
        "Press overhead",
        "Lower with control",
      ],
    },
    tips: { he: ["אל תנעל מרפקים"], en: ["Don't lock elbows"] },
    safetyNotes: { he: ["שמור גב ניטרלי"], en: ["Maintain neutral spine"] },
    media: {
      image: "exercises/dumbbell_shoulder_press.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_shoulder_press_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },
  {
    id: "dumbbell_lateral_raise_1",
    name: "הרמות צידיות",
    nameLocalized: { he: "הרמות צידיות", en: "Dumbbell Lateral Raise" },
    category: "strength",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: {
      he: ["עמוד זקוף", "הרם משקולות לצדדים עד גובה כתפיים", "הורד לאט"],
      en: ["Stand tall", "Raise dumbbells to shoulder height", "Lower slowly"],
    },
    tips: { he: ["מרפקים מעט כפופים"], en: ["Slight bend in elbows"] },
    safetyNotes: { he: ["אל תמשוך בגב"], en: ["Don't swing body"] },
    media: {
      image: "exercises/dumbbell_lateral_raise.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_lateral_raise_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "dumbbell_biceps_curl_1",
    name: "כפיפת זרועות",
    nameLocalized: { he: "כפיפת זרועות", en: "Dumbbell Biceps Curl" },
    category: "strength",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: {
      he: ["מרפקים צמודים", "כופף עד התכווצות", "הורד בשליטה"],
      en: ["Elbows tucked", "Curl to contraction", "Lower under control"],
    },
    tips: { he: ["הימנע מתנופה"], en: ["Avoid momentum"] },
    safetyNotes: { he: ["משקל מתאים"], en: ["Choose proper weight"] },
    media: {
      image: "exercises/dumbbell_biceps_curl.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_biceps_curl_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "dumbbell_hammer_curl_1",
    name: "כפיפת האמר",
    nameLocalized: { he: "כפיפת האמר", en: "Dumbbell Hammer Curl" },
    category: "strength",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: {
      he: ["אחיזה נייטרלית", "כפיפה למעלה", "הורדה איטית"],
      en: ["Neutral grip", "Curl upward", "Slow lowering"],
    },
    tips: { he: ["שמור פרק כף יד ניטרלי"], en: ["Keep wrist neutral"] },
    safetyNotes: { he: ["לא למשוך בגב"], en: ["Don't lean back"] },
    media: {
      image: "exercises/dumbbell_hammer_curl.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_hammer_curl_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "dumbbell_triceps_kickback_1",
    name: "קיקבק טרייספס",
    nameLocalized: { he: "קיקבק טרייספס", en: "Dumbbell Triceps Kickback" },
    category: "strength",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["shoulders"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: ["הטיה קדימה", "מרפק צמוד", "יישור זרוע לאחור"],
      en: ["Lean forward", "Elbow fixed", "Extend arm back"],
    },
    tips: { he: ["שליטה בקצה"], en: ["Control at end range"] },
    safetyNotes: { he: ["אל תנעל מרפק"], en: ["Don't hyperextend elbow"] },
    media: {
      image: "exercises/dumbbell_triceps_kickback.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_triceps_kickback_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "dumbbell_deadlift_1",
    name: "דדליפט משקולות",
    nameLocalized: { he: "דדליפט משקולות", en: "Dumbbell Deadlift" },
    category: "strength",
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["back", "core"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: ["ירידה בירכיים לאחור", "שמור גב ניטרלי", "דחוף דרך עקבים"],
      en: ["Hips back", "Maintain neutral spine", "Drive through heels"],
    },
    tips: { he: ["משקולות קרוב לגוף"], en: ["Keep weights close"] },
    safetyNotes: { he: ["לא לעגל גב"], en: ["Don't round back"] },
    media: {
      image: "exercises/dumbbell_deadlift.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_deadlift_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },
  {
    id: "dumbbell_reverse_lunge_1",
    name: "לנג' לאחור משקולות",
    nameLocalized: { he: "לנג' לאחור משקולות", en: "Dumbbell Reverse Lunge" },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: ["צעד לאחור", "ברך אחורית מטה", "דחוף קדימה"],
      en: ["Step back", "Lower rear knee", "Drive forward"],
    },
    tips: { he: ["שמור יציבות"], en: ["Maintain balance"] },
    safetyNotes: { he: ["ברך קדמית מעל קרסול"], en: ["Front knee over ankle"] },
    media: {
      image: "exercises/dumbbell_reverse_lunge.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_reverse_lunge_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },
  {
    id: "dumbbell_chest_fly_1",
    name: "פליי חזה משקולות",
    nameLocalized: { he: "פליי חזה משקולות", en: "Dumbbell Chest Fly" },
    category: "strength",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["shoulders"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: ["שכב על גב", "זרועות פתוחות קלות", "סגור בקשת"],
      en: ["Lie on back", "Arms slightly bent", "Arc together"],
    },
    tips: { he: ["תנועה מבוקרת"], en: ["Slow controlled motion"] },
    safetyNotes: { he: ["אל תרד עמוק מדי"], en: ["Don't overstretch"] },
    media: {
      image: "exercises/dumbbell_chest_fly.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_chest_fly_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },
  {
    id: "dumbbell_bent_arm_pull_over_1",
    name: "פולאובר משקולות",
    nameLocalized: { he: "פולאובר משקולות", en: "Dumbbell Pullover" },
    category: "strength",
    primaryMuscles: ["back", "chest"],
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: ["שכב על ספסל", "משקולת מעל חזה", "העבר מאחורי ראש וחזרה"],
      en: [
        "Lie on bench",
        "Weight above chest",
        "Lower behind head and return",
      ],
    },
    tips: { he: ["מרפקים מעט כפופים"], en: ["Keep slight elbow bend"] },
    safetyNotes: { he: ["שלוט בתחתית"], en: ["Control bottom range"] },
    media: {
      image: "exercises/dumbbell_pullover.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_pullover_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },
  {
    id: "dumbbell_calf_raise_1",
    name: "הרמת שוקיים משקולות",
    nameLocalized: { he: "הרמת שוקיים משקולות", en: "Dumbbell Calf Raise" },
    category: "strength",
    primaryMuscles: ["calves"],
    secondaryMuscles: ["quadriceps"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: {
      he: ["עמוד זקוף", "עלה על אצבעות", "רד לאט"],
      en: ["Stand tall", "Rise onto toes", "Lower slowly"],
    },
    tips: { he: ["השהה למעלה"], en: ["Pause at top"] },
    safetyNotes: { he: ["היזהר בהחלקה"], en: ["Beware of slipping"] },
    media: {
      image: "exercises/dumbbell_calf_raise.jpg",
      video: "",
      thumbnail: "exercises/dumbbell_calf_raise_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
];

// ===============================================
// 🏋️‍♂️ Dumbbell Utility Functions - פונקציות עזר למשקולות
// ===============================================

/**
 * Get dumbbell exercises by muscle group
 * קבלת תרגילי משקולות לפי קבוצת שרירים
 */
export function getDumbbellsByMuscleGroup(
  group: "chest" | "shoulders" | "back" | "arms" | "legs"
): Exercise[] {
  const groupMap = {
    chest: MUSCLE_GROUP_CATEGORIES.UPPER_BODY.CHEST,
    shoulders: MUSCLE_GROUP_CATEGORIES.UPPER_BODY.SHOULDERS,
    back: MUSCLE_GROUP_CATEGORIES.UPPER_BODY.BACK,
    arms: MUSCLE_GROUP_CATEGORIES.UPPER_BODY.ARMS,
    legs: MUSCLE_GROUP_CATEGORIES.LOWER_BODY.LEGS,
  };

  const targetIds = groupMap[group];
  return dumbbellExercises.filter((exercise) =>
    (targetIds as readonly string[]).includes(exercise.id)
  );
}

/**
 * Get compound vs isolation dumbbell exercises
 * קבלת תרגילי משקולות מורכבים או מבודדים
 */
export function getDumbbellsByType(type: "compound" | "isolation"): Exercise[] {
  if (type === "compound") {
    return dumbbellExercises.filter((exercise) =>
      (MUSCLE_GROUP_CATEGORIES.COMPOUND as readonly string[]).includes(
        exercise.id
      )
    );
  } else {
    return dumbbellExercises.filter(
      (exercise) =>
        !(MUSCLE_GROUP_CATEGORIES.COMPOUND as readonly string[]).includes(
          exercise.id
        )
    );
  }
}

/**
 * Get weight recommendation for specific exercise
 * קבלת המלצת משקל לתרגיל ספציפי
 */
export function getWeightRecommendation(
  exerciseId: string,
  experience: "beginner" | "intermediate" | "advanced",
  gender: "men" | "women",
  intensity: "light" | "medium" | "heavy" = "medium"
): number {
  const recommendations =
    WEIGHT_RECOMMENDATIONS[
      experience.toUpperCase() as keyof typeof WEIGHT_RECOMMENDATIONS
    ];
  return recommendations[gender][intensity];
}

/**
 * Generate full-body dumbbell workout
 * יצירת אימון גוף מלא עם משקולות
 */
export function generateFullBodyDumbbellWorkout(
  experience: "beginner" | "intermediate" | "advanced"
): {
  exercises: Exercise[];
  structure: string;
  estimatedDuration: number;
} {
  // Select one exercise from each major muscle group
  const chestExercise = getDumbbellsByMuscleGroup("chest")[0];
  const backExercise = getDumbbellsByMuscleGroup("back")[0];
  const shouldersExercise = getDumbbellsByMuscleGroup("shoulders")[0];
  const armsExercise = getDumbbellsByMuscleGroup("arms")[0];
  const legsExercise = getDumbbellsByMuscleGroup("legs")[0];

  const exercises = [
    chestExercise,
    backExercise,
    shouldersExercise,
    armsExercise,
    legsExercise,
  ].filter(Boolean);

  const sets =
    experience === "beginner" ? 2 : experience === "intermediate" ? 3 : 4;
  const restBetweenSets = experience === "beginner" ? 90 : 60;
  const estimatedDuration =
    exercises.length * sets * 2 +
    (exercises.length * sets * restBetweenSets) / 60;

  return {
    exercises,
    structure: `${sets} sets × 8-12 reps, ${restBetweenSets}s rest`,
    estimatedDuration: Math.round(estimatedDuration),
  };
}

/**
 * Get progressive overload suggestion
 * קבלת הצעה לעומס מתקדם
 */
export function getProgressiveOverload(
  currentWeight: number,
  currentReps: number,
  targetReps: number = 12
): {
  action: "increase_weight" | "increase_reps" | "maintain";
  suggestion: string;
  newWeight?: number;
  newReps?: number;
} {
  if (currentReps >= targetReps) {
    return {
      action: "increase_weight",
      suggestion: 'הגדל משקל ב-2.5-5 ק"ג וחזור ל-8 חזרות',
      newWeight: currentWeight + 2.5,
      newReps: 8,
    };
  } else if (currentReps < 8) {
    return {
      action: "increase_weight",
      suggestion: 'הפחת משקל ב-2.5 ק"ג',
      newWeight: Math.max(currentWeight - 2.5, 2.5),
      newReps: currentReps,
    };
  } else {
    return {
      action: "increase_reps",
      suggestion: "הוסף חזרה נוספת בסט הבא",
      newReps: currentReps + 1,
    };
  }
}

/**
 * Calculate training volume
 * חישוב נפח אימון
 */
export function calculateTrainingVolume(
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
    weight: number;
  }[]
): {
  totalVolume: number; // kg × reps
  averageIntensity: number; // average weight
  workloadScore: number; // composite score
} {
  let totalVolume = 0;
  let totalWeight = 0;
  let totalSets = 0;

  exercises.forEach((ex) => {
    totalVolume += ex.sets * ex.reps * ex.weight;
    totalWeight += ex.weight * ex.sets;
    totalSets += ex.sets;
  });

  return {
    totalVolume,
    averageIntensity: totalWeight / totalSets,
    workloadScore: totalVolume / 100, // normalized score
  };
}

// Export utility constants for external use
export { MUSCLE_GROUP_CATEGORIES, WEIGHT_RECOMMENDATIONS };
