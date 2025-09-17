/**
 * @file src/data/exercises/machines.ts
 * @brief Gym machine exercises database - comprehensive collection for all muscle groups
 */

// Simple exercise interface for machine exercises
interface MachineExercise {
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
}

export const machineExercises: MachineExercise[] = [
  // CHEST MACHINES
  {
    id: "chest_press_machine",
    name: "מכונת לחיצת חזה",
    nameEn: "Chest Press Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "chest",
    secondaryMuscles: ["shoulders", "triceps"],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם הגב צמוד לכרית",
      "אחוז את הידיות בגובה החזה",
      "דחוף את הידיות קדימה עד למתיחה מלאה",
      "כווץ את שרירי החזה בחלק העליון",
      "חזור לאט למצב התחלתי",
    ],
    tips: [
      "שמור על כתפיים צמודות לכרית",
      "נשוף בדחיפה, שאוף בחזרה",
      "שלוט בתנועה לאורך כל הטווח",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 90,
    caloriesPerSet: 12,
    safetyNotes: ["התאם את הגובה בהתאם לגובהך", "התחל עם משקל קל"],
  },

  {
    id: "pec_deck_machine",
    name: "מכונת פק-דק",
    nameEn: "Pec Deck Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "chest",
    secondaryMuscles: ["shoulders"],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם הגב ישר",
      "הנח את הזרועות על הכריות",
      "הבא את המרפקים יחד בקו ישר",
      "כווץ את שרירי החזה",
      "חזור לאט למצב התחלתי",
    ],
    tips: [
      "שמור על זרועות במקביל לקרקע",
      "התמקד בכיווץ שרירי החזה",
      "אל תלך רחוק מדי אחורה",
    ],
    sets: 3,
    reps: "12-15",
    restTime: 60,
    caloriesPerSet: 10,
  },

  // LEG MACHINES
  {
    id: "leg_press_machine",
    name: "מכונת לחיצת רגליים",
    nameEn: "Leg Press Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "legs",
    secondaryMuscles: ["glutes"],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם הגב צמוד לכרית",
      "הנח את הרגליים על הפלטפורמה ברוחב כתפיים",
      "הורד את המשקל עד שהברכיים ב-90 מעלות",
      "דחוף חזרה למעלה דרך העקבים",
      "אל תנעל את הברכיים לחלוטין",
    ],
    tips: ["שמור על הגב צמוד לכרית", "נשוף בדחיפה למעלה", "שלוט בירידה"],
    sets: 3,
    reps: "12-20",
    restTime: 120,
    caloriesPerSet: 18,
    safetyNotes: ["לא תורידו יותר מ-90 מעלות בברכיים", "שמרו על עמדה יציבה"],
  },

  {
    id: "leg_extension_machine",
    name: "מכונת יישור רגליים",
    nameEn: "Leg Extension Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "legs",
    secondaryMuscles: [],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם הגב ישר",
      "הנח את הרגליים מתחת לכרית",
      "הרם את הרגליים עד למתיחה מלאה",
      "כווץ את שרירי הירך הקדמיים",
      "הורד לאט חזרה למצב התחלתי",
    ],
    tips: ["אל תנעל את הברכיים בכוח", "התמקד בשליטה בתנועה", "שמור על גב ישר"],
    sets: 3,
    reps: "12-15",
    restTime: 60,
    caloriesPerSet: 12,
  },

  {
    id: "leg_curl_machine",
    name: "מכונת כיפוף רגליים",
    nameEn: "Leg Curl Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "legs",
    secondaryMuscles: ["glutes"],
    difficulty: "beginner",
    instructions: [
      "שכב על הבטן על המכונה",
      "הנח את הרגליים מתחת לכרית",
      "כופף את הרגליים לכיוון הישבן",
      "כווץ את שרירי הירך האחוריים",
      "הורד לאט חזרה למצב התחלתי",
    ],
    tips: [
      "אל תהרים את הירכיים מהכרית",
      "התמקד בשרירי הירך האחוריים",
      "שלוט בתנועה",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 11,
  },

  {
    id: "calf_raise_machine",
    name: "מכונת הרמת עקבים",
    nameEn: "Calf Raise Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "calves",
    secondaryMuscles: [],
    difficulty: "beginner",
    instructions: [
      "עמוד על המכונה עם הכתפיים מתחת לכריות",
      "הנח את כפות הרגליים על הפלטפורמה",
      "הרם את העקבים גבוה ככל האפשר",
      "כווץ את שרירי השוק",
      "הורד לאט למתיחה מלאה",
    ],
    tips: ["השתמש בטווח תנועה מלא", "התחזק בחלק העליון", "הורד לאט ובשליטה"],
    sets: 4,
    reps: "15-25",
    restTime: 45,
    caloriesPerSet: 8,
  },

  // BACK MACHINES
  {
    id: "lat_pulldown_machine",
    name: "מכונת משיכת לט",
    nameEn: "Lat Pulldown Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps", "shoulders"],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם הירכיים מתחת לכרית",
      "אחוז את המוט באחיזה רחבה",
      "משוך את המוט למטה אל החזה העליון",
      "כווץ את השכמות יחד",
      "חזור לאט למעלה בשליטה",
    ],
    tips: [
      "משוך עם השכמות, לא עם הזרועות",
      "הנח קדימה מעט",
      "שמור על חזה למעלה",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 90,
    caloriesPerSet: 14,
  },

  {
    id: "seated_cable_row",
    name: "חתירה ישיבה במכונה",
    nameEn: "Seated Cable Row",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps", "shoulders"],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם רגליים קלות כפופות",
      "אחוז את הידית עם זרועות מתוחות",
      "משוך את הידית אל הבטן",
      "כווץ את השכמות יחד",
      "חזור לאט למצב התחלתי",
    ],
    tips: ["שמור על גב ישר", "משוך עם הגב, לא עם הזרועות", "אל תנדנד את הגוף"],
    sets: 3,
    reps: "10-15",
    restTime: 90,
    caloriesPerSet: 13,
  },

  // SHOULDER MACHINES
  {
    id: "shoulder_press_machine",
    name: "מכונת לחיצת כתפיים",
    nameEn: "Shoulder Press Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "shoulders",
    secondaryMuscles: ["triceps"],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם הגב ישר",
      "אחוז את הידיות בגובה הכתפיים",
      "דחוף את הידיות למעלה מעל הראש",
      "אל תנעל את הזרועות לחלוטין",
      "הורד לאט חזרה למצב התחלתי",
    ],
    tips: [
      "שמור על הליבה מתוחה",
      "אל תדחוף יותר מדי מאחורי הראש",
      "שלוט בתנועה",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 90,
    caloriesPerSet: 11,
  },

  {
    id: "lateral_raise_machine",
    name: "מכונת הרמה צידית",
    nameEn: "Lateral Raise Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "shoulders",
    secondaryMuscles: [],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם הגב ישר",
      "הנח את הזרועות בכריות הצידיות",
      "הרם את הזרועות לצדדים עד גובה הכתפיים",
      "כווץ את הכתפיים הצידיות",
      "הורד לאט חזרה למטה",
    ],
    tips: [
      "אל תעלה מעל גובה הכתפיים",
      "שמור על תנועה מבוקרת",
      "התמקד בכתפיים הצידיות",
    ],
    sets: 3,
    reps: "12-15",
    restTime: 60,
    caloriesPerSet: 9,
  },

  // ARM MACHINES
  {
    id: "bicep_curl_machine",
    name: "מכונת כיפוף ביצפס",
    nameEn: "Bicep Curl Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "biceps",
    secondaryMuscles: [],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם החזה צמוד לכרית",
      "הנח את הזרועות על הכרית האלכסונית",
      "אחוז את הידיות ופותח את הזרועות",
      "כופף את הזרועות למעלה",
      "כווץ את הביצפס בחלק העליון",
    ],
    tips: ["שמור על מרפקים יציבים", "אל תנדנד את הגוף", "התמקד בכיווץ הביצפס"],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 8,
  },

  {
    id: "tricep_extension_machine",
    name: "מכונת יישור טריצפס",
    nameEn: "Tricep Extension Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "triceps",
    secondaryMuscles: [],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם הגב ישר",
      "הנח את המרפקים על הכרית",
      "אחוז את הידיות עם זרועות כפופות",
      "יישר את הזרועות למטה",
      "כווץ את הטריצפס בתחתית",
    ],
    tips: [
      "שמור על מרפקים צמודים לגוף",
      "אל תנעל את הזרועות בכוח",
      "התמקד בטריצפס",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 8,
  },

  // CORE MACHINES
  {
    id: "ab_crunch_machine",
    name: "מכונת כיווצי בטן",
    nameEn: "Ab Crunch Machine",
    category: "strength",
    equipment: "machine",
    primaryMuscle: "core",
    secondaryMuscles: [],
    difficulty: "beginner",
    instructions: [
      "שב על המכונה עם הגב צמוד לכרית",
      "הנח את הידיים על הידיות",
      "כווץ את שרירי הבטן וכופף קדימה",
      "החזק בחלק התחתון",
      "חזור לאט למצב התחלתי",
    ],
    tips: ["התמקד בשרירי הבטן", "נשוף בכיווץ", "אל תמשוך בצוואר"],
    sets: 3,
    reps: "15-25",
    restTime: 60,
    caloriesPerSet: 10,
  },

  // CARDIO MACHINES
  {
    id: "treadmill_walk",
    name: "הליכה על הליכון",
    nameEn: "Treadmill Walking",
    category: "cardio",
    equipment: "machine",
    primaryMuscle: "legs",
    secondaryMuscles: ["cardiovascular"],
    difficulty: "beginner",
    instructions: [
      "עלה על ההליכון בזהירות",
      "התחל במהירות נמוכה",
      "שמור על יציבה זקופה",
      "נדנד את הזרועות באופן טבעי",
      "הגדל מהירות בהדרגה",
    ],
    tips: ["תמיד החזק במעקות בתחילה", "שמור על מבט קדימה", "נשם באופן קבוע"],
    sets: 1,
    reps: "15-45 דקות",
    restTime: 0,
    caloriesPerSet: 150,
  },

  {
    id: "stationary_bike",
    name: "אופניים נייחים",
    nameEn: "Stationary Bike",
    category: "cardio",
    equipment: "machine",
    primaryMuscle: "legs",
    secondaryMuscles: ["cardiovascular"],
    difficulty: "beginner",
    instructions: [
      "התאם את גובה הכיסא",
      "החזק בידיות",
      "התחל לדווש בקצב נוח",
      "שמור על גב ישר",
      "הגדל התנגדות בהדרגה",
    ],
    tips: [
      "הברכיים לא צריכות להיות ישרות לחלוטין",
      "נשם בקביעות",
      "שמור על קצב קבוע",
    ],
    sets: 1,
    reps: "15-45 דקות",
    restTime: 0,
    caloriesPerSet: 200,
  },

  {
    id: "rowing_machine",
    name: "מכונת חתירה",
    nameEn: "Rowing Machine",
    category: "cardio",
    equipment: "machine",
    primaryMuscle: "back",
    secondaryMuscles: ["legs", "cardiovascular"],
    difficulty: "intermediate",
    instructions: [
      "שב על המכונה עם רגליים קשורות",
      "אחוז את הידית בשתי ידיים",
      "התחל בדחיפה ברגליים",
      "משוך את הידית אל הבטן",
      "חזור בסדר הפוך - זרועות, גו, רגליים",
    ],
    tips: [
      "הרגליים עושות את רוב העבודה",
      "שמור על גב ישר",
      "תיאום בין רגליים וזרועות",
    ],
    sets: 1,
    reps: "10-30 דקות",
    restTime: 0,
    caloriesPerSet: 250,
  },
];

// Helper functions
export const getMachineExercisesByMuscle = (
  muscle: string
): MachineExercise[] => {
  return machineExercises.filter(
    (exercise) =>
      exercise.primaryMuscle === muscle ||
      exercise.secondaryMuscles?.includes(muscle)
  );
};

export const getMachineExercisesByDifficulty = (
  difficulty: string
): MachineExercise[] => {
  return machineExercises.filter(
    (exercise) => exercise.difficulty === difficulty
  );
};

export const getMachineExercisesByCategory = (
  category: string
): MachineExercise[] => {
  return machineExercises.filter((exercise) => exercise.category === category);
};

// Get beginner-friendly machine circuit
export const getBeginnerMachineCircuit = (): MachineExercise[] => {
  return [
    "chest_press_machine",
    "lat_pulldown_machine",
    "leg_press_machine",
    "shoulder_press_machine",
    "bicep_curl_machine",
    "tricep_extension_machine",
    "ab_crunch_machine",
  ]
    .map((id) => machineExercises.find((ex) => ex.id === id))
    .filter(Boolean) as MachineExercise[];
};

export default machineExercises;
