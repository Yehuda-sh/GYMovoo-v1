/**
 * @file flexibility.ts
 * @description מערכת תרגילי גמישות ומתיחות מתקדמת
 * Advanced flexibility and stretching exercises system
 * @date 2025-08-15
 * @enhanced Added categorization, utility functions, and progression system
 */

import { Exercise } from "./types";

// ===============================================
// 🧘‍♀️ Flexibility Categories & Metadata
// ===============================================

export const FLEXIBILITY_CATEGORIES = {
  RESTORATIVE: {
    RELAXATION: ["child_pose_1"],
    SPINE_MOBILITY: ["cat_cow_1", "spinal_twist_supine_1"],
  },
  TARGETED_STRETCHES: {
    HIP_COMPLEX: ["hip_flexor_stretch_1", "glute_stretch_lying_1"],
    LEG_STRETCHES: [
      "hamstring_stretch_standing_1",
      "quad_stretch_standing_1",
      "calf_stretch_wall_1",
    ],
    MOBILITY: ["ankle_mobility_circles_1"],
  },
  DYNAMIC_FLOWS: {
    FULL_BODY: ["downward_dog_1"],
  },
} as const;

export const STRETCH_INTENSITY = {
  GENTLE: ["child_pose_1", "cat_cow_1", "ankle_mobility_circles_1"],
  MODERATE: [
    "hip_flexor_stretch_1",
    "glute_stretch_lying_1",
    "spinal_twist_supine_1",
  ],
  DEEP: [
    "hamstring_stretch_standing_1",
    "quad_stretch_standing_1",
    "calf_stretch_wall_1",
    "downward_dog_1",
  ],
} as const;

export const STRETCH_DURATION = {
  SHORT: {
    duration: "15-30s",
    exercises: ["ankle_mobility_circles_1", "cat_cow_1"],
  },
  MEDIUM: {
    duration: "30-60s",
    exercises: [
      "hip_flexor_stretch_1",
      "quad_stretch_standing_1",
      "calf_stretch_wall_1",
    ],
  },
  LONG: {
    duration: "60-120s",
    exercises: [
      "child_pose_1",
      "glute_stretch_lying_1",
      "hamstring_stretch_standing_1",
      "downward_dog_1",
    ],
  },
  EXTENDED: { duration: "2-5min", exercises: ["spinal_twist_supine_1"] },
} as const;

export const BODY_AREAS = {
  UPPER_BODY: [
    "child_pose_1",
    "cat_cow_1",
    "spinal_twist_supine_1",
    "downward_dog_1",
  ],
  LOWER_BODY: [
    "hip_flexor_stretch_1",
    "glute_stretch_lying_1",
    "hamstring_stretch_standing_1",
    "quad_stretch_standing_1",
    "calf_stretch_wall_1",
  ],
  EXTREMITIES: ["ankle_mobility_circles_1"],
} as const;

export const flexibilityExercises: Exercise[] = [
  {
    id: "child_pose_1",
    name: "תנוחת הילד",
    nameLocalized: {
      he: "תנוחת הילד",
      en: "Child's Pose",
    },
    category: "flexibility",
    primaryMuscles: ["back"],
    secondaryMuscles: ["shoulders", "hips", "glutes"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "רד לכריעה על הברכיים ברוחב הירכיים",
        "ישב בחזרה על העקבים",
        "השתטח קדימה עם הידיים מושטות לפנים",
        "הנח את המצח על הרצפה",
        "נשום עמוק והרגע את כל הגוף",
      ],
      en: [
        "Kneel down with knees hip-width apart",
        "Sit back on your heels",
        "Fold forward with arms extended in front",
        "Rest forehead on the floor",
        "Breathe deeply and relax entire body",
      ],
    },
    tips: {
      he: [
        "נשום עמוק ואיטי",
        "הרגע את כל הגוף",
        "אם קשה לשבת על עקבים - שים כרית",
        "אפשר להרחיב ברכיים לנוחות רבה יותר",
      ],
      en: [
        "Breathe deeply and slowly",
        "Relax entire body",
        "Use pillow between calves and thighs if needed",
        "Can widen knees for more comfort",
      ],
    },
    safetyNotes: {
      he: [
        "אל תכפה אם כואב בברכיים",
        "עצור אם מרגיש חוסר נוחות",
        "התאם לגמישות שלך",
      ],
      en: [
        "Don't force if knees hurt",
        "Stop if feeling discomfort",
        "Adapt to your flexibility",
      ],
    },
    media: {
      image: "exercises/child_pose.jpg",
      video: "exercises/child_pose.mp4",
      thumbnail: "exercises/child_pose_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "hip_flexor_stretch_1",
    name: "מתיחת כפיפות ירך",
    nameLocalized: { he: "מתיחת כפיפות ירך", en: "Hip Flexor Stretch" },
    category: "flexibility",
    primaryMuscles: ["hips"],
    secondaryMuscles: ["quadriceps"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["כריעה קדמית", "דחוף אגן קדימה"],
      en: ["Half kneeling", "Press hips forward"],
    },
    tips: { he: ["חזה זקוף"], en: ["Keep chest tall"] },
    safetyNotes: { he: ["הימנע מקשת יתר"], en: ["Avoid over-arching"] },
    media: {
      image: "exercises/hip_flexor_stretch.jpg",
      video: "",
      thumbnail: "exercises/hip_flexor_stretch_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "cat_cow_1",
    name: "חתול פרה",
    nameLocalized: { he: "חתול פרה", en: "Cat Cow" },
    category: "flexibility",
    primaryMuscles: ["back"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["קימור והקשתה של עמוד השדרה"],
      en: ["Alternate flex and extend spine"],
    },
    tips: { he: ["נשימה מסונכרנת"], en: ["Match breath to movement"] },
    safetyNotes: { he: ["תנועה עדינה"], en: ["Gentle range"] },
    media: {
      image: "exercises/cat_cow.jpg",
      video: "",
      thumbnail: "exercises/cat_cow_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "glute_stretch_lying_1",
    name: "מתיחת עכוז שכיבה",
    nameLocalized: { he: "מתיחת עכוז שכיבה", en: "Supine Glute Stretch" },
    category: "flexibility",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["השחל קרסול מעל ברך", "משוך ירך לכיוון החזה"],
      en: ["Figure-4 position", "Pull thigh toward chest"],
    },
    tips: { he: ["כתפיים ברצפה"], en: ["Keep shoulders down"] },
    safetyNotes: { he: ["הימנע מלחץ בברך"], en: ["Avoid knee pain"] },
    media: {
      image: "exercises/supine_glute_stretch.jpg",
      video: "",
      thumbnail: "exercises/supine_glute_stretch_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "spinal_twist_supine_1",
    name: "פיתול שדרה שכיבה",
    nameLocalized: { he: "פיתול שדרה שכיבה", en: "Supine Spinal Twist" },
    category: "flexibility",
    primaryMuscles: ["back"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["שכב על הגב", "פיתול עדין לצד"],
      en: ["Lie on back", "Gently rotate lower body"],
    },
    tips: { he: ["כתפיים נשארות למטה"], en: ["Keep shoulders grounded"] },
    safetyNotes: { he: ["תנועה איטית"], en: ["Move slowly"] },
    media: {
      image: "exercises/supine_spinal_twist.jpg",
      video: "",
      thumbnail: "exercises/supine_spinal_twist_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "calf_stretch_wall_1",
    name: "מתיחת שוק קיר",
    nameLocalized: { he: "מתיחת שוק קיר", en: "Wall Calf Stretch" },
    category: "flexibility",
    primaryMuscles: ["calves"],
    secondaryMuscles: ["hamstrings"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["כף רגל קדימה לקיר", "דחוף עקב לרצפה"],
      en: ["Foot forward to wall", "Press heel down"],
    },
    tips: { he: ["ברך ישרה"], en: ["Keep knee straight"] },
    safetyNotes: { he: ["תמיכה בידיים"], en: ["Use wall support"] },
    media: {
      image: "exercises/wall_calf_stretch.jpg",
      video: "",
      thumbnail: "exercises/wall_calf_stretch_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "hamstring_stretch_standing_1",
    name: "מתיחת דו ראשי עומד",
    nameLocalized: {
      he: "מתיחת דו ראשי עומד",
      en: "Standing Hamstring Stretch",
    },
    category: "flexibility",
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["רגל קדימה עקב על הקרקע", "הטה אגן אחורה"],
      en: ["One foot forward heel down", "Hinge hips back"],
    },
    tips: { he: ["גב ארוך"], en: ["Long spine"] },
    safetyNotes: { he: ["לא לנעול ברך"], en: ["Don't lock knee"] },
    media: {
      image: "exercises/standing_hamstring_stretch.jpg",
      video: "",
      thumbnail: "exercises/standing_hamstring_stretch_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "ankle_mobility_circles_1",
    name: "סיבובי קרסול",
    nameLocalized: { he: "סיבובי קרסול", en: "Ankle Circles" },
    category: "flexibility",
    primaryMuscles: ["calves"],
    secondaryMuscles: ["calves"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["הרם רגל וסובב קרסול"],
      en: ["Lift foot, rotate ankle"],
    },
    tips: { he: ["כיוונים לשני הצדדים"], en: ["Both directions"] },
    safetyNotes: { he: ["תנועה נשלטת"], en: ["Controlled motion"] },
    media: {
      image: "exercises/ankle_circles.jpg",
      video: "",
      thumbnail: "exercises/ankle_circles_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "quad_stretch_standing_1",
    name: "מתיחת ירך קדמית עומד",
    nameLocalized: { he: "מתיחת ירך קדמית עומד", en: "Standing Quad Stretch" },
    category: "flexibility",
    primaryMuscles: ["quadriceps"],
    secondaryMuscles: ["hips"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["אחוז קרסול מאחור", "קרב עקב לישבן"],
      en: ["Grab ankle behind", "Bring heel to glute"],
    },
    tips: { he: ["ברכיים צמודות"], en: ["Knees together"] },
    safetyNotes: { he: ["שמור שיווי משקל"], en: ["Hold balance support"] },
    media: {
      image: "exercises/standing_quad_stretch.jpg",
      video: "",
      thumbnail: "exercises/standing_quad_stretch_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "downward_dog_1",
    name: "כלב פונה מטה",
    nameLocalized: {
      he: "כלב פונה מטה",
      en: "Downward Facing Dog",
    },
    category: "flexibility",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["hamstrings", "calves", "back"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "התחל בעמדה של ידיים וברכיים",
        "שים אצבעות כפות הרגליים על הרצפה",
        "הרם את הירכיים למעלה ואחורה",
        "יישר את הרגליים ויצור צורת משולש הפוך",
      ],
      en: [
        "Start in hands and knees position",
        "Tuck toes under",
        "Lift hips up and back",
        "Straighten legs to form inverted V shape",
      ],
    },
    tips: {
      he: [
        "הפעל לחץ דרך כפות הידיים",
        "מתח את העקבים לעבר הרצפה",
        "אל תנעל את הברכיים",
      ],
      en: [
        "Press down through palms",
        "Reach heels toward floor",
        "Don't lock out knees",
      ],
    },
    safetyNotes: {
      he: [
        "אל תכפה את העקבים לרצפה",
        "הפסק אם כואב בפרקי הידיים",
        "שמור על הצוואר רגוע",
      ],
      en: [
        "Don't force heels to floor",
        "Stop if wrists hurt",
        "Keep neck relaxed",
      ],
    },
    media: {
      image: "exercises/downward_dog.jpg",
      video: "exercises/downward_dog.mp4",
      thumbnail: "exercises/downward_dog_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "silent",
  },
];

// ===============================================
// 🧘‍♀️ Flexibility Utility Functions - פונקציות עזר לגמישות
// ===============================================

/**
 * Get flexibility exercises by intensity level
 * קבלת תרגילי גמישות לפי רמת עוצמה
 */
export function getFlexibilityByIntensity(
  intensity: "gentle" | "moderate" | "deep"
): Exercise[] {
  const intensityMap = {
    gentle: STRETCH_INTENSITY.GENTLE,
    moderate: STRETCH_INTENSITY.MODERATE,
    deep: STRETCH_INTENSITY.DEEP,
  };

  const targetIds = intensityMap[intensity];
  return flexibilityExercises.filter((exercise) =>
    (targetIds as readonly string[]).includes(exercise.id)
  );
}

/**
 * Get stretches by target body area
 * קבלת מתיחות לפי אזור גוף
 */
export function getStretchesByBodyArea(
  area: "upper_body" | "lower_body" | "extremities"
): Exercise[] {
  const areaMap = {
    upper_body: BODY_AREAS.UPPER_BODY,
    lower_body: BODY_AREAS.LOWER_BODY,
    extremities: BODY_AREAS.EXTREMITIES,
  };

  const targetIds = areaMap[area];
  return flexibilityExercises.filter((exercise) =>
    (targetIds as readonly string[]).includes(exercise.id)
  );
}

/**
 * Get stretches by recommended duration
 * קבלת מתיחות לפי משך זמן מומלץ
 */
export function getStretchesByDuration(
  duration: "short" | "medium" | "long" | "extended"
): Exercise[] {
  const durationMap = {
    short: STRETCH_DURATION.SHORT.exercises,
    medium: STRETCH_DURATION.MEDIUM.exercises,
    long: STRETCH_DURATION.LONG.exercises,
    extended: STRETCH_DURATION.EXTENDED.exercises,
  };

  const targetIds = durationMap[duration];
  return flexibilityExercises.filter((exercise) =>
    (targetIds as readonly string[]).includes(exercise.id)
  );
}

/**
 * Generate post-workout cool-down routine
 * יצירת שגרת התרגעות לאחר אימון
 */
export function generateCoolDownRoutine(
  workoutType: "strength" | "cardio" | "full_body" = "full_body",
  duration: number = 10 // minutes
): {
  exercises: Exercise[];
  routine: string;
  totalDuration: number;
} {
  let selectedExercises: Exercise[] = [];

  if (workoutType === "strength") {
    // Focus on muscle relaxation and joint mobility
    selectedExercises = [
      ...getFlexibilityByIntensity("gentle").slice(0, 2),
      ...getStretchesByBodyArea("upper_body").slice(0, 2),
      ...getStretchesByBodyArea("lower_body").slice(0, 2),
    ];
  } else if (workoutType === "cardio") {
    // Focus on leg stretches and heart rate reduction
    selectedExercises = [
      ...getFlexibilityByIntensity("gentle").slice(0, 1),
      ...getStretchesByBodyArea("lower_body"),
      ...getFlexibilityByIntensity("moderate").slice(0, 1),
    ];
  } else {
    // Full body balanced routine
    selectedExercises = [
      ...getFlexibilityByIntensity("gentle").slice(0, 1),
      ...getStretchesByBodyArea("upper_body").slice(0, 2),
      ...getStretchesByBodyArea("lower_body").slice(0, 3),
      ...getFlexibilityByIntensity("moderate").slice(0, 1),
    ];
  }

  // Remove duplicates
  const uniqueExercises = Array.from(
    new Map(selectedExercises.map((ex) => [ex.id, ex])).values()
  ).slice(0, Math.min(6, Math.floor(duration / 1.5))); // ~1.5 min per exercise

  return {
    exercises: uniqueExercises,
    routine: `Cool-down routine: ${uniqueExercises.length} stretches, 1-2 minutes each`,
    totalDuration: uniqueExercises.length * 1.5,
  };
}

/**
 * Generate morning mobility routine
 * יצירת שגרת ניידות בוקר
 */
export function generateMorningMobilityRoutine(): {
  exercises: Exercise[];
  routine: string;
  estimatedDuration: number;
} {
  // Focus on gentle activation and joint mobility
  const morningStretches = [
    ...getFlexibilityByIntensity("gentle"),
    ...getStretchesByDuration("short"),
  ];

  // Remove duplicates and select most appropriate
  const uniqueExercises = Array.from(
    new Map(morningStretches.map((ex) => [ex.id, ex])).values()
  ).slice(0, 5);

  return {
    exercises: uniqueExercises,
    routine: "Morning mobility: 5 gentle stretches, 30-45 seconds each",
    estimatedDuration: 5, // minutes
  };
}

/**
 * Get targeted stretches for specific muscle groups
 * קבלת מתיחות ממוקדות לקבוצות שרירים ספציפיות
 */
export function getTargetedStretches(
  muscleGroup:
    | "core"
    | "shoulders"
    | "chest"
    | "back"
    | "biceps"
    | "triceps"
    | "forearms"
    | "quadriceps"
    | "hamstrings"
    | "glutes"
    | "calves"
    | "hips"
    | "neck"
): Exercise[] {
  return flexibilityExercises.filter(
    (exercise) =>
      (exercise.primaryMuscles as string[]).includes(muscleGroup) ||
      (exercise.secondaryMuscles as string[])?.includes(muscleGroup)
  );
}

/**
 * Calculate flexibility session intensity
 * חישוב עוצמת סשן גמישות
 */
export function calculateFlexibilityIntensity(exercises: Exercise[]): {
  averageIntensity: string;
  totalDuration: number;
  difficultyScore: number;
} {
  let gentleCount = 0;
  let moderateCount = 0;
  let deepCount = 0;

  exercises.forEach((ex) => {
    if ((STRETCH_INTENSITY.GENTLE as readonly string[]).includes(ex.id))
      gentleCount++;
    else if ((STRETCH_INTENSITY.MODERATE as readonly string[]).includes(ex.id))
      moderateCount++;
    else if ((STRETCH_INTENSITY.DEEP as readonly string[]).includes(ex.id))
      deepCount++;
  });

  const totalCount = exercises.length;
  const difficultyScore =
    (gentleCount * 1 + moderateCount * 2 + deepCount * 3) / totalCount;

  let averageIntensity = "gentle";
  if (difficultyScore >= 2.5) averageIntensity = "deep";
  else if (difficultyScore >= 1.5) averageIntensity = "moderate";

  return {
    averageIntensity,
    totalDuration: exercises.length * 1.5, // Average 1.5 minutes per stretch
    difficultyScore: Math.round(difficultyScore * 10) / 10,
  };
}

// Remove duplicate export (constants already exported above)
// Export utility constants for external use was moved to inline exports
