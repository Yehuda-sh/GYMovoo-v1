/**
 * @file src/data/exercises/foam_roller.ts
 * @brief Foam roller exercises database - recovery, mobility, and self-massage
 */

// Simple exercise interface for foam roller exercises
interface FoamRollerExercise {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  equipment: string;
  primaryMuscle: string;
  secondaryMuscles?: string[];
  difficulty: string;
  instructions: string[];
  tips: string[];
  sets: number;
  reps: string;
  restTime: number;
  caloriesPerSet: number;
  safetyNotes?: string[];
  rollerType?: string;
  intensity?: "light" | "moderate" | "firm";
}

export const foamRollerExercises: FoamRollerExercise[] = [
  // LOWER BODY RECOVERY
  {
    id: "foam_roller_quads",
    name: "גלגול שרירי הירך הקדמיים",
    nameEn: "Foam Rolling Quadriceps",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "legs",
    secondaryMuscles: [],
    difficulty: "beginner",
    rollerType: "standard",
    intensity: "moderate",
    instructions: [
      "שכב על הבטן עם הרולר מתחת לירכיים",
      "תמוך על הידיים",
      "גלגל לאט מהירכיים לברכיים",
      "עצור על נקודות רגישות למספר שניות",
      "חזור בכיוון ההפוך",
    ],
    tips: [
      "אל תגלגל על הברכיים עצמן",
      "נשוף עמוק במהלך הגלגול",
      "התחל בלחץ קל",
    ],
    sets: 2,
    reps: "10-15 גלגולים",
    restTime: 30,
    caloriesPerSet: 4,
    safetyNotes: ["אל תגלגל על מפרקים", "הפסק אם יש כאב חד"],
  },

  {
    id: "foam_roller_hamstrings",
    name: "גלגול שרירי העורף",
    nameEn: "Foam Rolling Hamstrings",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "hamstrings",
    secondaryMuscles: [],
    difficulty: "beginner",
    rollerType: "standard",
    intensity: "moderate",
    instructions: [
      "שב עם הרולר מתחת לשרירי העורף",
      "תמוך על הידיים מאחור",
      "הרם את הירכיים ממש מהקרקע",
      "גלגל מהישבן עד לברכיים",
      "עצור על נקודות רגישות",
    ],
    tips: [
      "אל תשב עם כל המשקל על הרולר",
      "השתמש בידיים לשליטה בלחץ",
      "גלגל לאט ובקצב קבוע",
    ],
    sets: 2,
    reps: "10-15 גלגולים",
    restTime: 30,
    caloriesPerSet: 4,
  },

  {
    id: "foam_roller_calves",
    name: "גלגול שרירי השוק",
    nameEn: "Foam Rolling Calves",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "calves",
    secondaryMuscles: [],
    difficulty: "beginner",
    rollerType: "standard",
    intensity: "light",
    instructions: [
      "שב עם הרולר מתחת לשוקיים",
      "תמוך על הידיים",
      "גלגל מהקרסולים עד לברכיים",
      "עבור על כל חלקי השוק",
      "שים דגש על אזורים רגישים",
    ],
    tips: [
      "אזור רגיש - התחל בעדינות",
      "אל תגלגל על הכותרת",
      "הרם רגל אחת לעוצמה גבוהה יותר",
    ],
    sets: 2,
    reps: "10-12 גלגולים",
    restTime: 30,
    caloriesPerSet: 3,
  },

  {
    id: "foam_roller_it_band",
    name: "גלגול רצועת IT",
    nameEn: "Foam Rolling IT Band",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "legs",
    secondaryMuscles: ["hips"],
    difficulty: "intermediate",
    rollerType: "firm",
    intensity: "firm",
    instructions: [
      "שכב על הצד עם הרולר מתחת לצד החיצוני של הירך",
      "תמוך על היד התחתונה",
      "הרגל העליונה מונחת על הקרקע לתמיכה",
      "גלגל מהירך עד הברך",
      "עבוד על כל האורך של הרצועה",
    ],
    tips: [
      "אזור מאוד רגיש - התחל בעדינות",
      "השתמש ברגל העליונה לשליטה בלחץ",
      "אל תגלגל על הברך",
    ],
    sets: 2,
    reps: "8-12 גלגולים לכל צד",
    restTime: 45,
    caloriesPerSet: 5,
    safetyNotes: ["רצועת IT רגישה - התחל בזהירות", "הפסק אם יש כאב חד"],
  },

  {
    id: "foam_roller_glutes",
    name: "גלגול שרירי הישבן",
    nameEn: "Foam Rolling Glutes",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "glutes",
    secondaryMuscles: ["hips"],
    difficulty: "beginner",
    rollerType: "standard",
    intensity: "moderate",
    instructions: [
      "שב על הרולר",
      "הצלב רגל אחת על השנייה",
      "השען לאחור על הידיים",
      "גלגל על שריר הישבן",
      "התמקד באזורים מתוחים",
    ],
    tips: [
      "שים דגש על צד אחד בכל פעם",
      "השתמש בזרועות לשליטה",
      "גלגל לאט ובמבוקר",
    ],
    sets: 2,
    reps: "10-15 גלגולים לכל צד",
    restTime: 30,
    caloriesPerSet: 4,
  },

  // UPPER BODY RECOVERY
  {
    id: "foam_roller_upper_back",
    name: "גלגול הגב העליון",
    nameEn: "Foam Rolling Upper Back",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "back",
    secondaryMuscles: ["shoulders"],
    difficulty: "beginner",
    rollerType: "standard",
    intensity: "moderate",
    instructions: [
      "שכב על הגב עם הרולר מתחת לכתפיים",
      "שלב את הידיים על החזה",
      "הרם את הירכיים מהקרקע",
      "גלגל מהכתפיים עד אמצע הגב",
      "עצור על נקודות מתוחות",
    ],
    tips: ["תמוך בראש עם הידיים", "אל תגלגל על הגב התחתון", "נשוף עמוק"],
    sets: 2,
    reps: "10-15 גלגולים",
    restTime: 30,
    caloriesPerSet: 4,
  },

  {
    id: "foam_roller_lats",
    name: "גלגול שרירי הלטיסימוס",
    nameEn: "Foam Rolling Latissimus Dorsi",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "back",
    secondaryMuscles: [],
    difficulty: "intermediate",
    rollerType: "standard",
    intensity: "moderate",
    instructions: [
      "שכב על הצד עם הזרוע התחתונה מתוחה",
      "הרולר מתחת לבית השחי",
      "גלגל מבית השחי עד אמצע הגב",
      "השתמש ברגליים לתנועה",
      "החלף צדדים",
    ],
    tips: [
      "זווית מעט את הגוף לכיוון הבטן",
      "התמקד על הלטיסימוס",
      "תנועה איטית",
    ],
    sets: 2,
    reps: "8-12 גלגולים לכל צד",
    restTime: 30,
    caloriesPerSet: 4,
  },

  // MOBILITY & FLEXIBILITY
  {
    id: "foam_roller_thoracic_extension",
    name: "הארכת עמוד השדרה החזי",
    nameEn: "Thoracic Spine Extension",
    category: "mobility",
    equipment: "foam_roller",
    primaryMuscle: "back",
    secondaryMuscles: ["chest"],
    difficulty: "beginner",
    rollerType: "standard",
    intensity: "light",
    instructions: [
      "שכב עם הרולר מתחת לאמצע הגב",
      "שלב את הידיים מאחורי הראש",
      "הארך את עמוד השדרה מעל הרולר",
      "החזק למספר שניות",
      "חזור למצב התחלתי",
    ],
    tips: ["תנועה עדינה", "אל תדחוף את הראש", "התמקד בפתיחת החזה"],
    sets: 3,
    reps: "5-8 הארכות",
    restTime: 30,
    caloriesPerSet: 3,
  },

  {
    id: "foam_roller_hip_flexors",
    name: "גלגול כופפי הירכיים",
    nameEn: "Foam Rolling Hip Flexors",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "hips",
    secondaryMuscles: ["legs"],
    difficulty: "intermediate",
    rollerType: "standard",
    intensity: "moderate",
    instructions: [
      "שכב על הבטן עם הרולר מתחת לירך",
      "רגל אחת בצד לתמיכה",
      "גלגל מעצם הירך עד אמצע הירך",
      "עצור על נקודות רגישות",
      "החלף צדדים",
    ],
    tips: ["אזור רגיש - היזהר", "אל תגלגל על עצם הירך", "השתמש בפיקוח"],
    sets: 2,
    reps: "8-10 גלגולים לכל צד",
    restTime: 45,
    caloriesPerSet: 4,
    safetyNotes: ["אזור רגיש - התחל בעדינות", "אל תגלגל על עצמות"],
  },

  // SPECIFIC PROBLEM AREAS
  {
    id: "foam_roller_plantar_fascia",
    name: "גלגול כף הרגל",
    nameEn: "Plantar Fascia Rolling",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "feet",
    secondaryMuscles: [],
    difficulty: "beginner",
    rollerType: "small/ball",
    intensity: "light",
    instructions: [
      "עמוד ותמוך על דבר מה",
      "שים כדור קטן או רולר מתחת לכף הרגל",
      "גלגל מהעקב עד הבהונות",
      "הפעל לחץ עדין",
      "התמקד על אזורים רגישים",
    ],
    tips: ["התחל בלחץ קל", "מעולה אחרי ריצה", "בצע לפני השינה"],
    sets: 2,
    reps: "1-2 דקות לכל רגל",
    restTime: 30,
    caloriesPerSet: 2,
  },

  {
    id: "foam_roller_piriformis",
    name: "גלגול שריר הפיריפורמיס",
    nameEn: "Foam Rolling Piriformis",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "glutes",
    secondaryMuscles: ["hips"],
    difficulty: "intermediate",
    rollerType: "firm",
    intensity: "firm",
    instructions: [
      "שב על הרולר",
      "הצלב רגל אחת על השנייה",
      "השען לכיוון הרגל המוצלבת",
      "גלגל על האזור העמוק של הישבן",
      "עצור על נקודות רגישות",
    ],
    tips: [
      "שריר עמוק - דורש סבלנות",
      "השתמש בידיים לשליטה",
      "יכול להיות לא נוח בהתחלה",
    ],
    sets: 2,
    reps: "10-15 גלגולים לכל צד",
    restTime: 45,
    caloriesPerSet: 5,
  },

  // RECOVERY ROUTINES
  {
    id: "foam_roller_full_body_flow",
    name: "זרימת גלגול לכל הגוף",
    nameEn: "Full Body Foam Rolling Flow",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "full_body",
    secondaryMuscles: [],
    difficulty: "beginner",
    rollerType: "standard",
    intensity: "moderate",
    instructions: [
      "התחל משרירי השוק",
      "עבור לשרירי העורף",
      "המשך לשרירי הישבן",
      "גלגל את שרירי הירך הקדמיים",
      "סיים עם הגב העליון",
    ],
    tips: [
      "בלה 10-15 דקות לסיבוב מלא",
      "מעולה אחרי אימון",
      "נשוף עמוק לאורך הדרך",
    ],
    sets: 1,
    reps: "סיבוב מלא",
    restTime: 0,
    caloriesPerSet: 25,
  },

  // TRIGGER POINT RELEASE
  {
    id: "foam_roller_trigger_points",
    name: "שחרור נקודות הדק",
    nameEn: "Trigger Point Release",
    category: "recovery",
    equipment: "foam_roller",
    primaryMuscle: "varies",
    secondaryMuscles: [],
    difficulty: "intermediate",
    rollerType: "firm",
    intensity: "firm",
    instructions: [
      "מצא נקודה רגישה",
      "עצור על הנקודה",
      "הפעל לחץ קבוע למשך 30-90 שניות",
      "נשוף עמוק",
      "הרגש איך הרגישות פוחתת",
    ],
    tips: ["סבלנות - לוקח זמן", "אל תדחוק יותר מדי", "טכניקה מתקדמת"],
    sets: 1,
    reps: "כפי הצורך",
    restTime: 30,
    caloriesPerSet: 3,
    safetyNotes: ["עצור אם הכאב חד מדי", "לא מתאים לדלקות חדות"],
  },

  // PRE-WORKOUT ACTIVATION
  {
    id: "foam_roller_dynamic_prep",
    name: "הכנה דינמית עם רולר",
    nameEn: "Dynamic Foam Rolling Prep",
    category: "warmup",
    equipment: "foam_roller",
    primaryMuscle: "full_body",
    secondaryMuscles: [],
    difficulty: "beginner",
    rollerType: "standard",
    intensity: "light",
    instructions: [
      "גלגולים מהירים וקלים",
      "התמקד על שרירים שישתתפו באימון",
      "אל תעצור על נקודות רגישות",
      "זמן קצר לכל אזור",
      "הכן את השרירים לפעילות",
    ],
    tips: ["לפני האימון - קל ומהיר", "30 שניות לכל אזור", "אל תגרום לעייפות"],
    sets: 1,
    reps: "5-10 גלגולים מהירים",
    restTime: 0,
    caloriesPerSet: 8,
  },
];

// Helper functions
export const getFoamRollerExercisesByMuscle = (
  muscle: string
): FoamRollerExercise[] => {
  return foamRollerExercises.filter(
    (exercise) =>
      exercise.primaryMuscle === muscle ||
      exercise.secondaryMuscles?.includes(muscle)
  );
};

export const getFoamRollerExercisesByCategory = (
  category: string
): FoamRollerExercise[] => {
  return foamRollerExercises.filter(
    (exercise) => exercise.category === category
  );
};

export const getFoamRollerExercisesByIntensity = (
  intensity: "light" | "moderate" | "firm"
): FoamRollerExercise[] => {
  return foamRollerExercises.filter(
    (exercise) => exercise.intensity === intensity
  );
};

// Get post-workout recovery routine
export const getPostWorkoutRecoveryRoutine = (): FoamRollerExercise[] => {
  return [
    "foam_roller_quads",
    "foam_roller_hamstrings",
    "foam_roller_calves",
    "foam_roller_glutes",
    "foam_roller_upper_back",
  ]
    .map((id) => foamRollerExercises.find((ex) => ex.id === id))
    .filter(Boolean) as FoamRollerExercise[];
};

// Get pre-workout mobility routine
export const getPreWorkoutMobilityRoutine = (): FoamRollerExercise[] => {
  return [
    "foam_roller_dynamic_prep",
    "foam_roller_thoracic_extension",
    "foam_roller_hip_flexors",
  ]
    .map((id) => foamRollerExercises.find((ex) => ex.id === id))
    .filter(Boolean) as FoamRollerExercise[];
};

// Get lower body recovery focus
export const getLowerBodyRecoveryFocus = (): FoamRollerExercise[] => {
  return [
    "foam_roller_quads",
    "foam_roller_hamstrings",
    "foam_roller_it_band",
    "foam_roller_calves",
    "foam_roller_glutes",
    "foam_roller_hip_flexors",
  ]
    .map((id) => foamRollerExercises.find((ex) => ex.id === id))
    .filter(Boolean) as FoamRollerExercise[];
};

// Get upper body recovery focus
export const getUpperBodyRecoveryFocus = (): FoamRollerExercise[] => {
  return [
    "foam_roller_upper_back",
    "foam_roller_lats",
    "foam_roller_thoracic_extension",
  ]
    .map((id) => foamRollerExercises.find((ex) => ex.id === id))
    .filter(Boolean) as FoamRollerExercise[];
};

export default foamRollerExercises;
