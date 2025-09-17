/**
 * @file src/data/exercises/cables.ts
 * @brief Cable machine exercises database - functional training for all muscle groups
 */

// Simple exercise interface for cable exercises
interface CableExercise {
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
  cableHeight?: "high" | "mid" | "low";
}

export const cableExercises: CableExercise[] = [
  // CHEST EXERCISES
  {
    id: "cable_chest_fly",
    name: "מעוף חזה עם כבלים",
    nameEn: "Cable Chest Fly",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "chest",
    secondaryMuscles: ["shoulders"],
    difficulty: "intermediate",
    cableHeight: "mid",
    instructions: [
      "עמוד במרכז מכונת הכבלים",
      "אחוז כבל בכל יד עם זרועות פתוחות",
      "הבא את הידיים יחד בקו מעגלי",
      "כווץ את שרירי החזה במרכז",
      "חזור לאט למצב התחלתי",
    ],
    tips: [
      "שמור על כיפוף קל במרפקים",
      "התמקד בתנועה מעגלית",
      "אל תתן לכבלים למשוך אותך",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 90,
    caloriesPerSet: 12,
  },

  {
    id: "cable_chest_press",
    name: "לחיצת חזה עם כבלים",
    nameEn: "Cable Chest Press",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "chest",
    secondaryMuscles: ["triceps", "shoulders"],
    difficulty: "beginner",
    cableHeight: "mid",
    instructions: [
      "עמוד עם הגב למכונת הכבלים",
      "אחוז כבל בכל יד בגובה החזה",
      "דחוף את הכבלים קדימה עד למתיחה מלאה",
      "כווץ את שרירי החזה",
      "חזור לאט למצב התחלתי",
    ],
    tips: ["שמור על עמידה יציבה", "נשוף בדחיפה קדימה", "שלוט בחזרה"],
    sets: 3,
    reps: "10-15",
    restTime: 90,
    caloriesPerSet: 13,
  },

  // BACK EXERCISES
  {
    id: "cable_lat_pulldown",
    name: "משיכת לט עם כבלים",
    nameEn: "Cable Lat Pulldown",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps", "shoulders"],
    difficulty: "beginner",
    cableHeight: "high",
    instructions: [
      "כרע על ברך אחת מול מכונת הכבלים",
      "אחוז את הכבל באחיזה רחבה",
      "משוך את הכבל למטה אל החזה",
      "כווץ את השכמות יחד",
      "חזור לאט למעלה בשליטה",
    ],
    tips: [
      "משוך עם השכמות, לא עם הזרועות",
      "שמור על חזה למעלה",
      "אל תהרים את הכתפיים",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 90,
    caloriesPerSet: 14,
  },

  {
    id: "cable_row_standing",
    name: "חתירה עמידה עם כבלים",
    nameEn: "Standing Cable Row",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps", "shoulders"],
    difficulty: "intermediate",
    cableHeight: "mid",
    instructions: [
      "עמוד מול מכונת הכבלים",
      "אחוז את הכבל בשתי ידיים",
      "משוך את הכבל אל הבטן",
      "כווץ את השכמות יחד",
      "חזור לאט למצב התחלתי",
    ],
    tips: ["שמור על גב ישר", "משוך עם השכמות", "אל תנדנד את הגוף"],
    sets: 3,
    reps: "12-15",
    restTime: 90,
    caloriesPerSet: 13,
  },

  {
    id: "cable_face_pull",
    name: "משיכה לפנים עם כבלים",
    nameEn: "Cable Face Pull",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "shoulders",
    secondaryMuscles: ["back"],
    difficulty: "intermediate",
    cableHeight: "high",
    instructions: [
      "עמוד מול מכונת הכבלים",
      "אחוז את הכבל ברצועת משיכה",
      "משוך את הכבל אל הפנים",
      "הפרד את הידיים כשהן מגיעות לפנים",
      "כווץ את הכתפיים האחוריות",
    ],
    tips: [
      "התמקד בכתפיים האחוריות",
      "שמור על מרפקים גבוהים",
      "תרגיל מעולה ליציבה",
    ],
    sets: 3,
    reps: "15-20",
    restTime: 60,
    caloriesPerSet: 10,
  },

  // SHOULDER EXERCISES
  {
    id: "cable_lateral_raise",
    name: "הרמה צידית עם כבלים",
    nameEn: "Cable Lateral Raise",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "shoulders",
    secondaryMuscles: [],
    difficulty: "beginner",
    cableHeight: "low",
    instructions: [
      "עמוד בצד של מכונת הכבלים",
      "אחוז כבל ביד הרחוקה",
      "הרם את הזרוע לצד עד גובה הכתף",
      "כווץ את הכתף הצידית",
      "הורד לאט חזרה למטה",
    ],
    tips: [
      "אל תעלה מעל גובה הכתף",
      "שמור על כיפוף קל במרפק",
      "התמקד בכתף הצידית",
    ],
    sets: 3,
    reps: "12-15",
    restTime: 60,
    caloriesPerSet: 9,
  },

  {
    id: "cable_front_raise",
    name: "הרמה קדמית עם כבלים",
    nameEn: "Cable Front Raise",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "shoulders",
    secondaryMuscles: [],
    difficulty: "beginner",
    cableHeight: "low",
    instructions: [
      "עמוד עם הגב למכונת הכבלים",
      "אחוז כבל ביד אחת",
      "הרם את הזרוע קדימה עד גובה הכתף",
      "כווץ את הכתף הקדמית",
      "הורד לאט חזרה למטה",
    ],
    tips: ["שמור על זרוע כמעט ישרה", "אל תעלה מעל גובה הכתף", "שלוט בתנועה"],
    sets: 3,
    reps: "12-15",
    restTime: 60,
    caloriesPerSet: 8,
  },

  // ARM EXERCISES
  {
    id: "cable_bicep_curl",
    name: "כיפוף ביצפס עם כבלים",
    nameEn: "Cable Bicep Curl",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "biceps",
    secondaryMuscles: [],
    difficulty: "beginner",
    cableHeight: "low",
    instructions: [
      "עמוד מול מכונת הכבלים",
      "אחוז את הכבל באחיזה תחתונה",
      "כופף את הזרועות למעלה",
      "כווץ את הביצפס בחלק העליון",
      "הורד לאט חזרה למטה",
    ],
    tips: ["שמור על מרפקים צמודים לגוף", "אל תנדנד את הגוף", "התמקד בביצפס"],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 8,
  },

  {
    id: "cable_tricep_pushdown",
    name: "דחיפת טריצפס עם כבלים",
    nameEn: "Cable Tricep Pushdown",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "triceps",
    secondaryMuscles: [],
    difficulty: "beginner",
    cableHeight: "high",
    instructions: [
      "עמוד מול מכונת הכבלים",
      "אחוז את הכבל באחיזה עליונה",
      "דחוף את הכבל למטה עד למתיחה מלאה",
      "כווץ את הטריצפס בתחתית",
      "חזור לאט למעלה",
    ],
    tips: [
      "שמור על מרפקים צמודים לגוף",
      "אל תהרים את הכתפיים",
      "התמקד בטריצפס",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 9,
  },

  {
    id: "cable_hammer_curl",
    name: "כיפוף פטיש עם כבלים",
    nameEn: "Cable Hammer Curl",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "biceps",
    secondaryMuscles: ["forearms"],
    difficulty: "beginner",
    cableHeight: "low",
    instructions: [
      "עמוד מול מכונת הכבלים",
      "אחוז את הכבל באחיזה נייטרלית",
      "כופף את הזרועות למעלה",
      "שמור על כפות ידיים פונות זו לזו",
      "הורד לאט חזרה למטה",
    ],
    tips: [
      "אחיזה נייטרלית לאורך כל התרגיל",
      "שמור על מרפקים יציבים",
      "עובד גם על שרירי האמה",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 8,
  },

  // LEG EXERCISES
  {
    id: "cable_squat",
    name: "כפיפות רגליים עם כבלים",
    nameEn: "Cable Squat",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "legs",
    secondaryMuscles: ["glutes", "core"],
    difficulty: "intermediate",
    cableHeight: "low",
    instructions: [
      "עמוד מול מכונת הכבלים",
      "אחוז את הכבל בשתי ידיים",
      "רגליים ברוחב כתפיים",
      "ירד למטה כמו ישיבה על כיסא",
      "עלה חזרה למעלה דרך העקבים",
    ],
    tips: [
      "הכבל עוזר לשמור על איזון",
      "שמור על גב ישר",
      "ירד עד שהירכיים מקבילות לקרקע",
    ],
    sets: 3,
    reps: "12-20",
    restTime: 90,
    caloriesPerSet: 15,
  },

  {
    id: "cable_kickback",
    name: "בעיטה אחורה עם כבלים",
    nameEn: "Cable Kickback",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "glutes",
    secondaryMuscles: ["hamstrings"],
    difficulty: "beginner",
    cableHeight: "low",
    instructions: [
      "התחבר לכבל עם רצועת קרסול",
      "עמוד מול המכונה על רגל אחת",
      "בעט את הרגל החופשית אחורה",
      "כווץ את שריר הישבן",
      "חזור לאט למצב התחלתי",
    ],
    tips: ["שמור על גו זקוף", "התמקד בשריר הישבן", "תנועה מבוקרת"],
    sets: 3,
    reps: "12-15 לכל רגל",
    restTime: 60,
    caloriesPerSet: 10,
  },

  // CORE EXERCISES
  {
    id: "cable_wood_chop",
    name: "חיתוך עץ עם כבלים",
    nameEn: "Cable Wood Chop",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders", "back"],
    difficulty: "intermediate",
    cableHeight: "high",
    instructions: [
      "עמוד בצד של מכונת הכבלים",
      "אחוז את הכבל בשתי ידיים",
      "משוך את הכבל באלכסון מעלה-מטה",
      "סובב את הגו בתנועה",
      "חזור לאט למצב התחלתי",
    ],
    tips: [
      "התנועה צריכה לבוא מהליבה",
      "שמור על זרועות יחסית ישרות",
      "תרגיל פונקציונלי מעולה",
    ],
    sets: 3,
    reps: "10-15 לכל צד",
    restTime: 60,
    caloriesPerSet: 12,
  },

  {
    id: "cable_crunch",
    name: "כיווצי בטן עם כבלים",
    nameEn: "Cable Crunch",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "core",
    secondaryMuscles: [],
    difficulty: "beginner",
    cableHeight: "high",
    instructions: [
      "כרע מול מכונת הכבלים",
      "אחוז את הכבל מאחורי הראש",
      "כווץ את שרירי הבטן וכופף קדימה",
      "החזק בחלק התחתון",
      "חזור לאט למצב התחלתי",
    ],
    tips: ["התנועה צריכה לבוא מהבטן", "אל תמשוך בצוואר", "התמקד בכיווץ"],
    sets: 3,
    reps: "15-25",
    restTime: 60,
    caloriesPerSet: 10,
  },

  // FUNCTIONAL EXERCISES
  {
    id: "cable_pallof_press",
    name: "פאלוף פרס עם כבלים",
    nameEn: "Cable Pallof Press",
    category: "strength",
    equipment: "cables",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders"],
    difficulty: "intermediate",
    cableHeight: "mid",
    instructions: [
      "עמוד בצד של מכונת הכבלים",
      "אחוז את הכבל בשתי ידיים לפני החזה",
      "דחוף את הכבל ישר קדימה",
      "התנגד לסיבוב של הכבל",
      "חזור לאט לחזה",
    ],
    tips: [
      "התמקד בלא לתת לגוף להסתובב",
      "תרגיל מעולה ליציבות הליבה",
      "שמור על עמידה יציבה",
    ],
    sets: 3,
    reps: "8-12 לכל צד",
    restTime: 60,
    caloriesPerSet: 11,
  },
];

// Helper functions
export const getCableExercisesByMuscle = (muscle: string): CableExercise[] => {
  return cableExercises.filter(
    (exercise) =>
      exercise.primaryMuscle === muscle ||
      exercise.secondaryMuscles?.includes(muscle)
  );
};

export const getCableExercisesByDifficulty = (
  difficulty: string
): CableExercise[] => {
  return cableExercises.filter(
    (exercise) => exercise.difficulty === difficulty
  );
};

export const getCableExercisesByHeight = (
  height: "high" | "mid" | "low"
): CableExercise[] => {
  return cableExercises.filter((exercise) => exercise.cableHeight === height);
};

// Get full body cable workout
export const getFullBodyCableWorkout = (): CableExercise[] => {
  return [
    "cable_chest_press",
    "cable_lat_pulldown",
    "cable_squat",
    "cable_shoulder_press",
    "cable_bicep_curl",
    "cable_tricep_pushdown",
    "cable_wood_chop",
  ]
    .map((id) => cableExercises.find((ex) => ex.id === id))
    .filter(Boolean) as CableExercise[];
};

export default cableExercises;
