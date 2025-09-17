/**
 * @file src/data/exercises/pull_up_bar.ts
 * @brief Pull-up bar exercises database - comprehensive collection for back, arms and core
 */

// Simple exercise interface for pull-up bar exercises
interface PullUpBarExercise {
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

export const pullUpBarExercises: PullUpBarExercise[] = [
  // BACK EXERCISES - PRIMARY
  {
    id: "standard_pull_up",
    name: "מתח סטנדרטי",
    nameEn: "Standard Pull-up",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps", "shoulders"],
    difficulty: "intermediate",
    instructions: [
      "תלה על המוט עם אחיזה רחבה יותר מכתפיים",
      "כפות ידיים פונות החוצה",
      "משוך את הגוף למעלה עד שהסנטר מעל המוט",
      "התמקד בשרירי הגב",
      "הורד לאט עד למתיחה מלאה של הזרועות",
    ],
    tips: [
      "התחל עם מתח חלקי אם לא מצליח מתח מלא",
      "התמקד בכיווץ השכמות",
      "שמור על הליבה מתוחה",
    ],
    sets: 3,
    reps: "3-10",
    restTime: 120,
    caloriesPerSet: 12,
    safetyNotes: [
      "התחל עם עזרה או רצועת עזר אם נדרש",
      "הפסק אם יש כאב בכתפיים",
    ],
  },

  {
    id: "wide_grip_pull_up",
    name: "מתח אחיזה רחבה",
    nameEn: "Wide Grip Pull-up",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps", "shoulders"],
    difficulty: "advanced",
    instructions: [
      "תלה על המוט עם אחיזה רחבה מאוד",
      "כפות ידיים פונות החוצה",
      "משוך את הגוף למעלה עם דגש על רוחב הגב",
      "נסה להביא את החזה העליון למוט",
      "הורד לאט בשליטה מלאה",
    ],
    tips: [
      "תרגיל קשה במיוחד",
      "דורש כוח רב בגב",
      "התמקד בהפעלת שרירי הגב הרחבים",
    ],
    sets: 3,
    reps: "2-8",
    restTime: 150,
    caloriesPerSet: 15,
  },

  {
    id: "chin_up",
    name: "מתח הפוך (צ'ין-אפ)",
    nameEn: "Chin-up",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "biceps",
    secondaryMuscles: ["back", "shoulders"],
    difficulty: "intermediate",
    instructions: [
      "תלה על המוט עם אחיזה ברוחב כתפיים",
      "כפות ידיים פונות אליך",
      "משוך את הגוף למעלה עם דגש על הביצפס",
      "הבא את הסנטר מעל המוט",
      "הורד לאט למתיחה מלאה",
    ],
    tips: [
      "קל יותר ממתח רגיל לרוב האנשים",
      "מתאים מאוד לפיתוח הביצפס",
      "דרך טובה להתחיל ללמוד מתחים",
    ],
    sets: 3,
    reps: "4-12",
    restTime: 120,
    caloriesPerSet: 10,
  },

  {
    id: "commando_pull_up",
    name: "מתח קומנדו",
    nameEn: "Commando Pull-up",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "back",
    secondaryMuscles: ["core", "biceps"],
    difficulty: "advanced",
    instructions: [
      "תלה על המוט עם הגוף לאורך המוט",
      "משוך את הגוף למעלה לצד אחד של המוט",
      "הבא את הראש לצד אחד של המוט",
      "הורד ועבור לצד השני בחזרה הבאה",
      "החלף צדדים בכל חזרה",
    ],
    tips: ["תרגיל מתקדם מאוד", "עובד על האסימטריה", "מפתח כוח פונקציונלי"],
    sets: 3,
    reps: "2-6",
    restTime: 180,
    caloriesPerSet: 18,
  },

  // CORE EXERCISES
  {
    id: "hanging_leg_raise",
    name: "הרמת רגליים בתליה",
    nameEn: "Hanging Leg Raise",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders", "forearms"],
    difficulty: "intermediate",
    instructions: [
      "תלה על המוט עם זרועות ישרות",
      "הרם את הרגליים הישרות עד זווית 90 מעלות",
      "כווץ את שרירי הבטן",
      "הורד לאט בשליטה מלאה",
      "שמור על זרועות יציבות",
    ],
    tips: [
      "התחל עם הרמת ברכיים אם קשה",
      "שמור על השכמות יציבות",
      "נשוף בעליה, שאוף בירידה",
    ],
    sets: 3,
    reps: "8-15",
    restTime: 90,
    caloriesPerSet: 10,
  },

  {
    id: "hanging_knee_raise",
    name: "הרמת ברכיים בתליה",
    nameEn: "Hanging Knee Raise",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "core",
    secondaryMuscles: ["hip_flexors"],
    difficulty: "beginner",
    instructions: [
      "תלה על המוט עם זרועות ישרות",
      "הרם את הברכיים לכיוון החזה",
      "כווץ את שרירי הבטן בחלק העליון",
      "הורד לאט בשליטה",
      "אל תנדנד את הגוף",
    ],
    tips: [
      "גרסה קלה יותר להרמת רגליים",
      "מתאים למתחילים",
      "התמקד בשליטה ולא במהירות",
    ],
    sets: 3,
    reps: "10-20",
    restTime: 60,
    caloriesPerSet: 8,
  },

  {
    id: "hanging_windshield_wipers",
    name: "מגבי שמשות בתליה",
    nameEn: "Hanging Windshield Wipers",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "core",
    secondaryMuscles: ["obliques", "shoulders"],
    difficulty: "advanced",
    instructions: [
      "תלה על המוט עם רגליים הרומות ל-90 מעלות",
      "נע את הרגליים מצד לצד כמו מגבי שמשות",
      "שמור על הרגליים ברמה גבוהה",
      "התמקד בעבודת שרירי הבטן הצדדיים",
      "שלוט בתנועה לחלוטין",
    ],
    tips: [
      "תרגיל מאוד מתקדם",
      "דורש כוח רב בליבה ובכתפיים",
      "התחל עם טווח תנועה קטן",
    ],
    sets: 3,
    reps: "4-10",
    restTime: 120,
    caloriesPerSet: 15,
    safetyNotes: [
      "תרגיל מתקדם מאוד",
      "לא מתאים למתחילים",
      "הפסק אם יש כאב בכתפיים",
    ],
  },

  {
    id: "hanging_l_sit",
    name: "L-Sit בתליה",
    nameEn: "Hanging L-Sit",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders", "hip_flexors"],
    difficulty: "advanced",
    instructions: [
      "תלה על המוט עם זרועות ישרות",
      "הרם את הרגליים לזווית 90 מעלות",
      "החזק את המצב למספר שניות",
      "שמור על רגליים ישרות ומקבילות לקרקע",
      "נשום בצורה מבוקרת",
    ],
    tips: ["תרגיל איזומטרי מתקדם", "התחל עם החזקות קצרות", "בנה כוח בהדרגה"],
    sets: 3,
    reps: "5-20 שניות",
    restTime: 120,
    caloriesPerSet: 12,
  },

  // FOREARMS & GRIP
  {
    id: "dead_hang",
    name: "תליה סטטית",
    nameEn: "Dead Hang",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "forearms",
    secondaryMuscles: ["shoulders", "back"],
    difficulty: "beginner",
    instructions: [
      "תלה על המוט עם אחיזה נוחה",
      "החזק את המצב כמה שיותר זמן",
      "שמור על זרועות ישרות",
      "רגל בגוף רגוע ויציב",
      "נשם באופן טבעי",
    ],
    tips: ["מתאים לחיזוק אחיזה", "בסיס לכל תרגילי המתח", "התחל עם זמנים קצרים"],
    sets: 3,
    reps: "10-60 שניות",
    restTime: 90,
    caloriesPerSet: 5,
  },

  {
    id: "muscle_up",
    name: "מאסל-אפ",
    nameEn: "Muscle-up",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "back",
    secondaryMuscles: ["triceps", "shoulders", "core"],
    difficulty: "expert",
    instructions: [
      "התחל עם מתח רגיל",
      "כשאתה מגיע לחלק העליון, החלף לתנועת דיפ",
      "דחוף את הגוף מעל המוט",
      "גמור עם זרועות ישרות מעל המוט",
      "חזור לאט למצב תליה",
    ],
    tips: ["תרגיל מתקדם מאוד", "דורש כוח רב ותיאום", "למד מתחים ודיפים לפני"],
    sets: 3,
    reps: "1-5",
    restTime: 180,
    caloriesPerSet: 25,
    safetyNotes: ["תרגיל מתמחים בלבד", "דורש הכנה ארוכה", "השתמש במגן אם אפשר"],
  },

  // DYNAMIC EXERCISES
  {
    id: "kipping_pull_up",
    name: "מתח קיפינג",
    nameEn: "Kipping Pull-up",
    category: "strength",
    equipment: "pull_up_bar",
    primaryMuscle: "back",
    secondaryMuscles: ["core", "shoulders"],
    difficulty: "intermediate",
    instructions: [
      "התחל בתליה עם תנופה קלה של הגוף",
      "השתמש בתנופה כדי לעזור במתח",
      "משוך את הגוף למעלה בתנועה דינמית",
      "חזור למצב תליה עם שליטה",
      "שמור על קצב קבוע",
    ],
    tips: [
      "שיטה להגדיל מספר חזרות",
      "לא מחליף מתח קלאסי",
      "מתאים לאימוני כושר אירובי",
    ],
    sets: 3,
    reps: "5-15",
    restTime: 90,
    caloriesPerSet: 14,
  },
];

// Helper functions
export const getPullUpBarExercisesByMuscle = (
  muscle: string
): PullUpBarExercise[] => {
  return pullUpBarExercises.filter(
    (exercise) =>
      exercise.primaryMuscle === muscle ||
      exercise.secondaryMuscles?.includes(muscle)
  );
};

export const getPullUpBarExercisesByDifficulty = (
  difficulty: string
): PullUpBarExercise[] => {
  return pullUpBarExercises.filter(
    (exercise) => exercise.difficulty === difficulty
  );
};

// Get progression exercises for pull-ups
export const getPullUpProgression = (): PullUpBarExercise[] => {
  const exerciseIds = [
    "dead_hang",
    "hanging_knee_raise",
    "chin_up",
    "standard_pull_up",
    "wide_grip_pull_up",
    "muscle_up",
  ];
  return exerciseIds
    .map((id) => pullUpBarExercises.find((ex) => ex.id === id))
    .filter(Boolean) as PullUpBarExercise[];
};

export default pullUpBarExercises;
