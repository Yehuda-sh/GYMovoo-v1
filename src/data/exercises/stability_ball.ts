/**
 * @file src/data/exercises/stability_ball.ts
 * @brief Stability ball exercises database - core, balance, and stability training
 */

// Simple exercise interface for stability ball exercises
interface StabilityBallExercise {
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
  ballSize?: string;
}

export const stabilityBallExercises: StabilityBallExercise[] = [
  // CORE STABILITY
  {
    id: "stability_ball_plank",
    name: "פלאנק על כדור יציבות",
    nameEn: "Stability Ball Plank",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders", "back"],
    difficulty: "intermediate",
    ballSize: "55-65 cm",
    instructions: [
      "שים את הרגליים על הכדור",
      "תמוך על הידיים בתנוחת פלאנק",
      "שמור על גוף ישר מהראש לעקבים",
      "מתח את שרירי הבטן",
      "החזק את התנוחה למשך הזמן הנדרש",
    ],
    tips: ["אל תתן לירכיים לרדת", "נשוף בקביעות", "התחל עם זמנים קצרים"],
    sets: 3,
    reps: "30-60 שניות",
    restTime: 60,
    caloriesPerSet: 12,
    safetyNotes: ["וודא שהכדור מנופח כראוי", "התחל עם תמיכה על הברכיים"],
  },

  {
    id: "stability_ball_crunch",
    name: "כיווצי בטן על כדור יציבות",
    nameEn: "Stability Ball Crunch",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "core",
    secondaryMuscles: [],
    difficulty: "beginner",
    ballSize: "55-65 cm",
    instructions: [
      "שב על הכדור",
      "הלך את הרגליים קדימה עד שהגב נמצא על הכדור",
      "שים את הידיים מאחורי הראש",
      "בצע כיווץ של שרירי הבטן",
      "הרם את החזה כלפי הברכיים",
    ],
    tips: ["אל תמשוך בצוואר", "התמקד בכיווץ הבטן", "השתמש בטווח תנועה מלא"],
    sets: 3,
    reps: "15-25",
    restTime: 45,
    caloriesPerSet: 10,
  },

  {
    id: "stability_ball_rollout",
    name: "גלגול החוצה עם כדור יציבות",
    nameEn: "Stability Ball Rollout",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders", "back"],
    difficulty: "advanced",
    ballSize: "55-65 cm",
    instructions: [
      "כרע מול הכדור",
      "שים את הידיים על הכדור",
      "גלגל את הכדור קדימה תוך מתיחת הגוף",
      "שמור על ליבה מתוחה",
      "גלגל חזרה למצב התחלתי",
    ],
    tips: ["אל תתן לגב להתעקם", "תנועה איטית ומבוקרת", "התחל עם טווח קצר"],
    sets: 3,
    reps: "8-15",
    restTime: 90,
    caloriesPerSet: 14,
    safetyNotes: ["תרגיל מתקדם - התחל עם מדריך", "הפסק אם יש כאב בגב"],
  },

  // LOWER BODY STRENGTH
  {
    id: "stability_ball_squat",
    name: "כפיפות רגליים עם כדור יציבות",
    nameEn: "Stability Ball Wall Squat",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "legs",
    secondaryMuscles: ["glutes", "core"],
    difficulty: "beginner",
    ballSize: "55-65 cm",
    instructions: [
      "שים את הכדור בין הגב לקיר",
      "רגליים ברוחב כתפיים",
      "רד לכפיפות רגליים תוך גלגול הכדור",
      "ירד עד שהירכיים מקבילות לקרקע",
      "עלה חזרה למעלה דרך העקבים",
    ],
    tips: [
      "שמור על גב ישר",
      "הכדור עוזר ביציבות",
      "אל תתן לברכיים לקרוס פנימה",
    ],
    sets: 3,
    reps: "12-20",
    restTime: 60,
    caloriesPerSet: 11,
  },

  {
    id: "stability_ball_hamstring_curl",
    name: "כיפוף שרירי העורף עם כדור",
    nameEn: "Stability Ball Hamstring Curl",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "hamstrings",
    secondaryMuscles: ["glutes", "core"],
    difficulty: "intermediate",
    ballSize: "55-65 cm",
    instructions: [
      "שכב על הגב עם עקבים על הכדור",
      "הרם את הירכיים ליצירת גשר",
      "כופף את הברכיים וגלגל את הכדור לעבר הישבן",
      "מתח את שרירי העורף",
      "חזור לאט למצב התחלתי",
    ],
    tips: ["שמור על ירכיים גבוהות", "התמקד בשרירי העורף", "תנועה מבוקרת"],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 12,
  },

  {
    id: "stability_ball_single_leg_squat",
    name: "כפיפות רגליים על רגל אחת עם כדור",
    nameEn: "Single Leg Stability Ball Squat",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "legs",
    secondaryMuscles: ["glutes", "core", "balance"],
    difficulty: "advanced",
    ballSize: "55-65 cm",
    instructions: [
      "עמוד על רגל אחת",
      "הרגל השנייה מונחת על הכדור מאחור",
      "בצע כפיפות רגליים על הרגל הקדמית",
      "שמור על איזון",
      "עלה חזרה למעלה",
    ],
    tips: ["התמקד באיזון", "השתמש בזרועות לאיזון", "התחל עם טווח קטן"],
    sets: 3,
    reps: "8-12 לכל רגל",
    restTime: 60,
    caloriesPerSet: 13,
  },

  // UPPER BODY STRENGTH
  {
    id: "stability_ball_pushup",
    name: "שכיבות סמיכה עם כדור יציבות",
    nameEn: "Stability Ball Push-up",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "chest",
    secondaryMuscles: ["triceps", "shoulders", "core"],
    difficulty: "intermediate",
    ballSize: "55-65 cm",
    instructions: [
      "תנוחת פלאנק עם ידיים על הכדור",
      "שמור על גוף ישר",
      "רד לשכיבת סמיכה על הכדור",
      "דחוף את עצמך חזרה למעלה",
      "שמור על איזון על הכדור",
    ],
    tips: [
      "התחל עם רגליים רחוק מהכדור",
      "מתח את שרירי הליבה",
      "תנועה איטית ומבוקרת",
    ],
    sets: 3,
    reps: "8-15",
    restTime: 90,
    caloriesPerSet: 12,
  },

  {
    id: "stability_ball_pike",
    name: "פייק עם כדור יציבות",
    nameEn: "Stability Ball Pike",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders", "back"],
    difficulty: "advanced",
    ballSize: "55-65 cm",
    instructions: [
      "תנוחת פלאנק עם רגליים על הכדור",
      "גלגל את הכדור קדימה עם הרגליים",
      "הרם את הירכיים למעלה ליצירת צורת V",
      "שמור על זרועות ישרות",
      "חזור לתנוחת פלאנק",
    ],
    tips: ["התמקד בשרירי הבטן", "שמור על שליטה", "תרגיל מתקדם"],
    sets: 3,
    reps: "8-12",
    restTime: 90,
    caloriesPerSet: 15,
  },

  // BACK STRENGTHENING
  {
    id: "stability_ball_back_extension",
    name: "הארכת גב עם כדור יציבות",
    nameEn: "Stability Ball Back Extension",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "back",
    secondaryMuscles: ["glutes"],
    difficulty: "beginner",
    ballSize: "55-65 cm",
    instructions: [
      "שכב על הבטן על הכדור",
      "רגליים רחובות ליציבות",
      "ידיים מאחורי הראש או על החזה",
      "הרם את החזה והכתפיים",
      "כווץ את שרירי הגב התחתון",
    ],
    tips: ["אל תעלה יותר מדי", "התמקד בשרירי הגב", "תנועה איטית"],
    sets: 3,
    reps: "12-20",
    restTime: 45,
    caloriesPerSet: 9,
  },

  {
    id: "stability_ball_superman",
    name: "סופרמן עם כדור יציבות",
    nameEn: "Stability Ball Superman",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "back",
    secondaryMuscles: ["glutes", "hamstrings"],
    difficulty: "intermediate",
    ballSize: "55-65 cm",
    instructions: [
      "שכב על הבטן על הכדור",
      "הרם זרוע אחת ורגל נגדית",
      "שמור על איזון על הכדור",
      "החזק למספר שניות",
      "החלף צדדים",
    ],
    tips: ["התמקד באיזון", "תנועה איטית ומבוקרת", "התחל עם זרוע או רגל בלבד"],
    sets: 3,
    reps: "8-12 לכל צד",
    restTime: 60,
    caloriesPerSet: 10,
  },

  // BALANCE & COORDINATION
  {
    id: "stability_ball_bridge",
    name: "גשר עם כדור יציבות",
    nameEn: "Stability Ball Bridge",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "glutes",
    secondaryMuscles: ["hamstrings", "core"],
    difficulty: "beginner",
    ballSize: "55-65 cm",
    instructions: [
      "שכב על הגב עם רגליים על הכדור",
      "הרם את הירכיים ליצירת גשר",
      "כווץ את שרירי הישבן",
      "שמור על קו ישר מברכיים לכתפיים",
      "החזק למספר שניות",
    ],
    tips: ["מתח את שרירי הישבן", "אל תדחוף את הגב", "נשוף בקביעות"],
    sets: 3,
    reps: "15-25",
    restTime: 45,
    caloriesPerSet: 8,
  },

  {
    id: "stability_ball_deadbug",
    name: "חרק מת עם כדור יציבות",
    nameEn: "Stability Ball Dead Bug",
    category: "strength",
    equipment: "stability_ball",
    primaryMuscle: "core",
    secondaryMuscles: ["coordination"],
    difficulty: "intermediate",
    ballSize: "55-65 cm",
    instructions: [
      "שכב על הגב עם הכדור בין הידיים והברכיים",
      "לחץ את הכדור",
      "הורד זרוע אחת ורגל נגדית",
      "שמור על לחץ על הכדור",
      "חזור למצב התחלתי",
    ],
    tips: ["שמור על גב צמוד לקרקע", "לחץ קבוע על הכדור", "תנועה איטית ומבוקרת"],
    sets: 3,
    reps: "8-12 לכל צד",
    restTime: 60,
    caloriesPerSet: 9,
  },

  // STRETCHING & MOBILITY
  {
    id: "stability_ball_child_pose",
    name: "תנוחת הילד עם כדור יציבות",
    nameEn: "Stability Ball Child's Pose",
    category: "flexibility",
    equipment: "stability_ball",
    primaryMuscle: "back",
    secondaryMuscles: ["shoulders"],
    difficulty: "beginner",
    ballSize: "55-65 cm",
    instructions: [
      "כרע מול הכדור",
      "שים את הידיים על הכדור",
      "שב חזרה על העקבים",
      "גלגל את הכדור קדימה",
      "הרגש מתיחה בגב ובכתפיים",
    ],
    tips: ["נשוף עמוק", "החזק למשך 30-60 שניות", "הרגש מתיחה נעימה"],
    sets: 2,
    reps: "30-60 שניות",
    restTime: 30,
    caloriesPerSet: 3,
  },

  {
    id: "stability_ball_hip_stretch",
    name: "מתיחת ירכיים עם כדור יציבות",
    nameEn: "Stability Ball Hip Stretch",
    category: "flexibility",
    equipment: "stability_ball",
    primaryMuscle: "hips",
    secondaryMuscles: ["legs"],
    difficulty: "beginner",
    ballSize: "55-65 cm",
    instructions: [
      "שב על הכדור",
      "שים רגל אחת על הברך הנגדית",
      "השען קדימה בעדינות",
      "הרגש מתיחה בירך",
      "החזק ולאחר מכן החלף צדדים",
    ],
    tips: ["אל תכפוף יותר מדי", "מתיחה עדינה", "שמור על איזון"],
    sets: 2,
    reps: "30 שניות לכל צד",
    restTime: 30,
    caloriesPerSet: 2,
  },
];

// Helper functions
export const getStabilityBallExercisesByMuscle = (
  muscle: string
): StabilityBallExercise[] => {
  return stabilityBallExercises.filter(
    (exercise) =>
      exercise.primaryMuscle === muscle ||
      exercise.secondaryMuscles?.includes(muscle)
  );
};

export const getStabilityBallExercisesByDifficulty = (
  difficulty: string
): StabilityBallExercise[] => {
  return stabilityBallExercises.filter(
    (exercise) => exercise.difficulty === difficulty
  );
};

export const getStabilityBallExercisesByCategory = (
  category: string
): StabilityBallExercise[] => {
  return stabilityBallExercises.filter(
    (exercise) => exercise.category === category
  );
};

// Get core-focused stability ball workout
export const getCoreStabilityBallWorkout = (): StabilityBallExercise[] => {
  return [
    "stability_ball_plank",
    "stability_ball_crunch",
    "stability_ball_rollout",
    "stability_ball_pike",
    "stability_ball_deadbug",
  ]
    .map((id) => stabilityBallExercises.find((ex) => ex.id === id))
    .filter(Boolean) as StabilityBallExercise[];
};

// Get full body stability ball circuit
export const getFullBodyStabilityBallWorkout = (): StabilityBallExercise[] => {
  return [
    "stability_ball_squat",
    "stability_ball_pushup",
    "stability_ball_hamstring_curl",
    "stability_ball_crunch",
    "stability_ball_back_extension",
    "stability_ball_bridge",
  ]
    .map((id) => stabilityBallExercises.find((ex) => ex.id === id))
    .filter(Boolean) as StabilityBallExercise[];
};

// Get beginner stability ball routine
export const getBeginnerStabilityBallRoutine = (): StabilityBallExercise[] => {
  return stabilityBallExercises.filter(
    (exercise) => exercise.difficulty === "beginner"
  );
};

export default stabilityBallExercises;
