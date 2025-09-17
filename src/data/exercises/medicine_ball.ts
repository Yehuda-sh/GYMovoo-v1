/**
 * @file src/data/exercises/medicine_ball.ts
 * @brief Medicine ball exercises database - power, explosive, and functional training
 */

// Simple exercise interface for medicine ball exercises
interface MedicineBallExercise {
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
  ballWeight?: string;
}

export const medicineBallExercises: MedicineBallExercise[] = [
  // CORE POWER EXERCISES
  {
    id: "medicine_ball_slam",
    name: "הטחת כדור רפואי",
    nameEn: "Medicine Ball Slam",
    category: "power",
    equipment: "medicine_ball",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders", "back", "legs"],
    difficulty: "intermediate",
    ballWeight: "4-8 kg",
    instructions: [
      "עמוד עם רגליים ברוחב כתפיים",
      "הרם את הכדור מעל הראש",
      "השתמש בכל הגוף כדי להטיח את הכדור למטה",
      "כרע מעט כדי לספוג את הפגיעה",
      "הרם את הכדור וחזור על התרגיל",
    ],
    tips: [
      "השתמש בכל הגוף, לא רק הזרועות",
      "התמקד בכוח ובמהירות",
      "וודא שהכדור מתאים להטחה",
    ],
    sets: 3,
    reps: "8-12",
    restTime: 60,
    caloriesPerSet: 15,
    safetyNotes: [
      "השתמש בכדור מיועד להטחה",
      "וודא שיש מקום מספיק מסביב",
      "התחל במשקל קל",
    ],
  },

  {
    id: "medicine_ball_twist",
    name: "סיבובי גו עם כדור רפואי",
    nameEn: "Medicine Ball Russian Twist",
    category: "strength",
    equipment: "medicine_ball",
    primaryMuscle: "core",
    secondaryMuscles: ["obliques"],
    difficulty: "beginner",
    ballWeight: "2-5 kg",
    instructions: [
      "שב על הרצפה עם ברכיים כפופות",
      "אחוז את הכדור הרפואי בשתי ידיים",
      "הרם את הרגליים מהקרקע (אופציונלי)",
      "סובב את הגו מצד לצד",
      "גע בכדור בקרקע בכל צד",
    ],
    tips: [
      "שמור על גב ישר",
      "התנועה צריכה לבוא מהמותניים",
      "נשוף באמצע התנועה",
    ],
    sets: 3,
    reps: "20-30",
    restTime: 45,
    caloriesPerSet: 10,
  },

  {
    id: "medicine_ball_woodchopper",
    name: "חיתוך עץ עם כדור רפואי",
    nameEn: "Medicine Ball Woodchopper",
    category: "power",
    equipment: "medicine_ball",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders", "back", "legs"],
    difficulty: "intermediate",
    ballWeight: "3-6 kg",
    instructions: [
      "עמוד עם רגליים ברוחב כתפיים",
      "אחוז את הכדור מעל כתף אחת",
      "הבא את הכדור באלכסון אל הירך הנגדית",
      "כרע מעט ברגליים במהלך התנועה",
      "חזור לאט למצב התחלתי",
    ],
    tips: ["התנועה צריכה לבוא מהליבה", "שמור על גב ישר", "בצע תנועה חלקה"],
    sets: 3,
    reps: "10-15 לכל צד",
    restTime: 60,
    caloriesPerSet: 12,
  },

  // UPPER BODY POWER
  {
    id: "medicine_ball_chest_pass",
    name: "מסירת חזה עם כדור רפואי",
    nameEn: "Medicine Ball Chest Pass",
    category: "power",
    equipment: "medicine_ball",
    primaryMuscle: "chest",
    secondaryMuscles: ["triceps", "shoulders", "core"],
    difficulty: "beginner",
    ballWeight: "2-5 kg",
    instructions: [
      "עמוד מול קיר במרחק מטר",
      "אחוז את הכדור לפני החזה",
      "דחוף את הכדור בכוח אל הקיר",
      "תפוס את הכדור כשהוא חוזר",
      "מיד בצע מסירה נוספת",
    ],
    tips: [
      "השתמש בכל שרירי החזה",
      "התמקד בכוח ובמהירות",
      "שמור על עמידה יציבה",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 11,
  },

  {
    id: "medicine_ball_overhead_slam",
    name: "הטחה מעל הראש עם כדור רפואי",
    nameEn: "Medicine Ball Overhead Slam",
    category: "power",
    equipment: "medicine_ball",
    primaryMuscle: "shoulders",
    secondaryMuscles: ["core", "back", "triceps"],
    difficulty: "intermediate",
    ballWeight: "4-8 kg",
    instructions: [
      "עמוד עם רגליים ברוחב כתפיים",
      "הרם את הכדור ישר מעל הראש",
      "השתמש בכל הגוף להטחת הכדור מטה",
      "כרע כדי לקחת את הכדור",
      "עמוד וחזור על התרגיל",
    ],
    tips: ["מתח את שרירי הבטן", "הטחה חזקה ומבוקרת", "התחל במשקל קל"],
    sets: 3,
    reps: "8-12",
    restTime: 90,
    caloriesPerSet: 14,
  },

  // LOWER BODY POWER
  {
    id: "medicine_ball_squat_throw",
    name: "כפיפות רגליים עם זריקה",
    nameEn: "Medicine Ball Squat Throw",
    category: "power",
    equipment: "medicine_ball",
    primaryMuscle: "legs",
    secondaryMuscles: ["glutes", "core", "shoulders"],
    difficulty: "intermediate",
    ballWeight: "3-6 kg",
    instructions: [
      "עמוד עם הכדור לפני החזה",
      "בצע כפיפות רגליים עמוקות",
      "כשאתה עולה, זרוק את הכדור מעלה",
      "תפוס את הכדור כשהוא יורד",
      "מיד עבור לכפיפה הבאה",
    ],
    tips: [
      "השתמש בכוח הרגליים לזריקה",
      "שמור על גב ישר",
      "זריקה חזקה וישרה מעלה",
    ],
    sets: 3,
    reps: "8-12",
    restTime: 90,
    caloriesPerSet: 13,
  },

  {
    id: "medicine_ball_lunge_twist",
    name: "פסיעות עם סיבוב כדור",
    nameEn: "Medicine Ball Lunge with Twist",
    category: "strength",
    equipment: "medicine_ball",
    primaryMuscle: "legs",
    secondaryMuscles: ["glutes", "core", "obliques"],
    difficulty: "intermediate",
    ballWeight: "2-5 kg",
    instructions: [
      "עמוד עם הכדור לפני החזה",
      "בצע פסיעה קדימה לתנוחת לונג",
      "סובב את הגו והכדור לצד הרגל הקדמית",
      "חזור למרכז ועמוד חזרה",
      "חזור על התרגיל לצד השני",
    ],
    tips: ["שמור על איזון טוב", "הסיבוב צריך לבוא מהמותניים", "ירד עמוק בלונג"],
    sets: 3,
    reps: "10-15 לכל צד",
    restTime: 60,
    caloriesPerSet: 12,
  },

  // FUNCTIONAL MOVEMENTS
  {
    id: "medicine_ball_deadlift",
    name: "הרמה מתה עם כדור רפואי",
    nameEn: "Medicine Ball Deadlift",
    category: "strength",
    equipment: "medicine_ball",
    primaryMuscle: "hamstrings",
    secondaryMuscles: ["glutes", "back", "core"],
    difficulty: "beginner",
    ballWeight: "3-8 kg",
    instructions: [
      "עמוד עם הכדור בידיים",
      "רגליים ברוחב כתפיים",
      "הרד את הכדור תוך כיפוף בירכיים",
      "שמור על גב ישר",
      "עמוד חזרה דרך הדחיפה בעקבים",
    ],
    tips: [
      "התנועה צריכה לבוא מהירכיים",
      "שמור על הכדור קרוב לגוף",
      "מתח את שרירי הליבה",
    ],
    sets: 3,
    reps: "12-15",
    restTime: 60,
    caloriesPerSet: 11,
  },

  {
    id: "medicine_ball_burpee",
    name: "ברפי עם כדור רפואי",
    nameEn: "Medicine Ball Burpee",
    category: "cardio",
    equipment: "medicine_ball",
    primaryMuscle: "full_body",
    secondaryMuscles: ["cardio"],
    difficulty: "advanced",
    ballWeight: "2-5 kg",
    instructions: [
      "עמוד עם הכדור בידיים",
      "שים את הכדור על הקרקע וקפוץ לפלאנק",
      "בצע שכיבת סמיכה עם ידיים על הכדור",
      "קפוץ בחזרה לכיפוף",
      "הרם את הכדור וקפוץ מעלה",
    ],
    tips: [
      "תרגיל מתקדם ואינטנסיבי",
      "התחל בלי שכיבת סמיכה",
      "שמור על איזון על הכדור",
    ],
    sets: 3,
    reps: "5-10",
    restTime: 120,
    caloriesPerSet: 18,
    safetyNotes: ["התחל בקצב איטי", "וודא שהכדור יציב", "הפסק אם יש כאב"],
  },

  // UPPER BODY STRENGTH
  {
    id: "medicine_ball_pushup",
    name: "שכיבות סמיכה עם כדור רפואי",
    nameEn: "Medicine Ball Push-up",
    category: "strength",
    equipment: "medicine_ball",
    primaryMuscle: "chest",
    secondaryMuscles: ["triceps", "shoulders", "core"],
    difficulty: "intermediate",
    ballWeight: "גודל סטנדרטי",
    instructions: [
      "תנוחת פלאנק עם יד אחת על הכדור",
      "בצע שכיבת סמיכה",
      "הגלגל את הכדור ליד השנייה",
      "בצע שכיבת סמיכה נוספת",
      "המשך לחליף ידיים",
    ],
    tips: [
      "שמור על ליבה חזקה",
      "תנועה מבוקרת של הכדור",
      "התחל מהברכיים אם קשה",
    ],
    sets: 3,
    reps: "8-15",
    restTime: 90,
    caloriesPerSet: 12,
  },

  // CARDIO & CONDITIONING
  {
    id: "medicine_ball_wall_ball",
    name: "זריקות קיר עם כדור רפואי",
    nameEn: "Medicine Ball Wall Ball",
    category: "cardio",
    equipment: "medicine_ball",
    primaryMuscle: "legs",
    secondaryMuscles: ["shoulders", "core", "cardio"],
    difficulty: "intermediate",
    ballWeight: "4-8 kg",
    instructions: [
      "עמוד מול קיר במרחק זרוע",
      "אחוז את הכדור לפני החזה",
      "בצע כפיפות רגליים עמוקות",
      "זרוק את הכדור למעלה על הקיר",
      "תפוס וחזור מיד לכפיפה",
    ],
    tips: [
      "השתמש בכוח הרגליים לזריקה",
      "שמור על קצב קבוע",
      "נשמה בקצב עם התנועה",
    ],
    sets: 4,
    reps: "15-25",
    restTime: 90,
    caloriesPerSet: 16,
  },

  // BALANCE & STABILITY
  {
    id: "medicine_ball_single_leg_deadlift",
    name: "הרמה מתה על רגל אחת עם כדור",
    nameEn: "Single Leg Medicine Ball Deadlift",
    category: "strength",
    equipment: "medicine_ball",
    primaryMuscle: "hamstrings",
    secondaryMuscles: ["glutes", "core", "balance"],
    difficulty: "advanced",
    ballWeight: "2-5 kg",
    instructions: [
      "עמוד על רגל אחת עם הכדור",
      "הרד את הכדור תוך הרמת הרגל האחורית",
      "שמור על גב ישר וליבה מתוחה",
      "חזור לעמידה על רגל אחת",
      "החלף רגליים",
    ],
    tips: ["התמקד באיזון ובשליטה", "התחל בלי משקל", "תנועה איטית ומבוקרת"],
    sets: 3,
    reps: "8-12 לכל רגל",
    restTime: 60,
    caloriesPerSet: 10,
  },
];

// Helper functions
export const getMedicineBallExercisesByMuscle = (
  muscle: string
): MedicineBallExercise[] => {
  return medicineBallExercises.filter(
    (exercise) =>
      exercise.primaryMuscle === muscle ||
      exercise.secondaryMuscles?.includes(muscle)
  );
};

export const getMedicineBallExercisesByDifficulty = (
  difficulty: string
): MedicineBallExercise[] => {
  return medicineBallExercises.filter(
    (exercise) => exercise.difficulty === difficulty
  );
};

export const getMedicineBallExercisesByCategory = (
  category: string
): MedicineBallExercise[] => {
  return medicineBallExercises.filter(
    (exercise) => exercise.category === category
  );
};

// Get power-focused medicine ball workout
export const getPowerMedicineBallWorkout = (): MedicineBallExercise[] => {
  return [
    "medicine_ball_slam",
    "medicine_ball_chest_pass",
    "medicine_ball_squat_throw",
    "medicine_ball_overhead_slam",
    "medicine_ball_woodchopper",
  ]
    .map((id) => medicineBallExercises.find((ex) => ex.id === id))
    .filter(Boolean) as MedicineBallExercise[];
};

// Get full body medicine ball circuit
export const getFullBodyMedicineBallCircuit = (): MedicineBallExercise[] => {
  return [
    "medicine_ball_squat_throw",
    "medicine_ball_chest_pass",
    "medicine_ball_twist",
    "medicine_ball_lunge_twist",
    "medicine_ball_overhead_slam",
    "medicine_ball_deadlift",
  ]
    .map((id) => medicineBallExercises.find((ex) => ex.id === id))
    .filter(Boolean) as MedicineBallExercise[];
};

export default medicineBallExercises;
