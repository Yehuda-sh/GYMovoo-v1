/**
 * @file src/data/exercises/barbell.ts
 * @brief Barbell exercises database - comprehensive collection of barbell exercises for all muscle groups
 */

// Simple exercise interface for barbell exercises
interface BarbellExercise {
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

export const barbellExercises: BarbellExercise[] = [
  // CHEST EXERCISES
  {
    id: "barbell_bench_press",
    name: "לחיצת חזה עם ברבל",
    nameEn: "Barbell Bench Press",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "chest",
    secondaryMuscles: ["shoulders", "triceps"],
    difficulty: "intermediate",
    instructions: [
      "שכב על הספסל עם העיניים מתחת לברבל",
      "אחוז את הברבל ברוחב כתפיים",
      "הורד את הברבל לחזה באופן מבוקר",
      "דחוף את הברבל חזרה למעלה",
      "שמור על כתפיים יציבות ויציבה טובה",
    ],
    tips: [
      "שמור על קשר בין כתפיים לספסל",
      "נשם בעת הורדה, נשוף בעת דחיפה",
      "שלוט בתנועה לאורך כל הטווח",
    ],
    sets: 3,
    reps: "8-12",
    restTime: 120,
    caloriesPerSet: 15,
    safetyNotes: [
      "השתמש במגן בטיחות או במאמן",
      "התחמם היטב לפני ביצוע",
      "אל תהפוך את הגב יותר מדי",
    ],
  },

  {
    id: "incline_barbell_press",
    name: "לחיצת חזה עליון עם ברבל",
    nameEn: "Incline Barbell Press",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "chest",
    secondaryMuscles: ["shoulders", "triceps"],
    difficulty: "intermediate",
    instructions: [
      "התאמן על ספסל נטוי 30-45 מעלות",
      "אחוז את הברבל ברוחב מעט יותר מכתפיים",
      "הורד את הברבל לחזה העליון",
      "דחוף חזרה למעלה בקו ישר",
      "שמור על שליטה מלאה",
    ],
    tips: [
      "התמקד בחלק העליון של החזה",
      "שמור על זווית קבועה של הספסל",
      "אל תהפוך את הכתפיים קדימה",
    ],
    sets: 3,
    reps: "8-10",
    restTime: 120,
    caloriesPerSet: 14,
  },

  // BACK EXERCISES
  {
    id: "barbell_bent_over_row",
    name: "חתירה עם ברבל בעמידה כפופה",
    nameEn: "Barbell Bent Over Row",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps", "shoulders"],
    difficulty: "intermediate",
    instructions: [
      "עמוד עם רגליים ברוחב כתפיים",
      "כופף את הגו למטה עד זווית 45 מעלות",
      "אחוז את הברבל בכוח מעל כף היד",
      "משוך את הברבל אל הבטן התחתונה",
      "חזור לאט למצב התחלתי",
    ],
    tips: [
      "שמור על גב ישר לאורך כל התנועה",
      "משוך עם השרירים של הגב, לא עם הזרועות",
      "תרכוז בכיווץ של השכמות",
    ],
    sets: 3,
    reps: "8-12",
    restTime: 90,
    caloriesPerSet: 16,
    safetyNotes: [
      "שמור על גב ישר - זה קריטי!",
      "אל תעבוד עם משקל כבד מדי בהתחלה",
      "הפסק אם יש כאב בגב",
    ],
  },

  {
    id: "barbell_deadlift",
    name: "המתה עם ברבל",
    nameEn: "Barbell Deadlift",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "back",
    secondaryMuscles: ["legs", "glutes", "core"],
    difficulty: "advanced",
    instructions: [
      "עמוד מול הברבל עם רגליים ברוחב ירכיים",
      "כופף את הברכיים והירכיים",
      "אחוז את הברבל במקום שהזרועות תלויות",
      "הרם את הברבל תוך שמירה על גב ישר",
      "עמוד זקוף לחלוטין עם כתפיים אחורה",
      "הורד באותו הדרך בשליטה",
    ],
    tips: [
      "זהו תרגיל מורכב - למד את הטכניקה לפני הוספת משקל",
      "התחל מהרצפה או מגובה מתאים",
      "שמור על הברבל קרוב לגוף",
    ],
    sets: 3,
    reps: "5-8",
    restTime: 180,
    caloriesPerSet: 25,
    safetyNotes: [
      "תרגיל מתקדם - למד טכניקה נכונה תחילה!",
      "השתמש במאמן מנוסה",
      "התחמם במיוחד לפני תרגיל זה",
    ],
  },

  // LEGS EXERCISES
  {
    id: "barbell_squat",
    name: "כפיפות רגליים עם ברבל",
    nameEn: "Barbell Squat",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "legs",
    secondaryMuscles: ["glutes", "core"],
    difficulty: "intermediate",
    instructions: [
      "מקם את הברבל על החלק העליון של הגב",
      "עמוד עם רגליים ברוחב כתפיים",
      "ירד למטה כאילו יושב על כיסא",
      "שמור על הברכיים מעל אצבעות הרגליים",
      "ירד עד שהירכיים מקבילות לקרקע",
      "דחוף חזרה למעלה דרך העקבים",
    ],
    tips: [
      "שמור על החזה למעלה והמבט קדימה",
      "ירד לאט, עלה מהר יחסית",
      "נשוף בעליה, שאוף בירידה",
    ],
    sets: 3,
    reps: "8-12",
    restTime: 120,
    caloriesPerSet: 20,
    safetyNotes: [
      "השתמש במתקן בטיחות",
      "התחל עם משקל קל",
      "למד הטכניקה עם מאמן",
    ],
  },

  {
    id: "barbell_front_squat",
    name: "כפיפות רגליים קדמיות עם ברבל",
    nameEn: "Barbell Front Squat",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "legs",
    secondaryMuscles: ["core", "shoulders"],
    difficulty: "advanced",
    instructions: [
      "מקם את הברבל על החלק הקדמי של הכתפיים",
      "החזק את הברבל עם אצבעות או זרועות צולבות",
      "שמור על מרפקים גבוהים",
      "ירד למטה תוך שמירה על גו זקוף",
      "עלה חזרה למעלה בכוח",
    ],
    tips: [
      "דורש גמישות טובה בכתפיים ובפרקי ידיים",
      "התמקד בשמירה על הגו זקוף",
      "התחל עם משקלים קלים",
    ],
    sets: 3,
    reps: "6-10",
    restTime: 120,
    caloriesPerSet: 18,
  },

  // SHOULDERS EXERCISES
  {
    id: "barbell_overhead_press",
    name: "לחיצה מעל הראש עם ברבל",
    nameEn: "Barbell Overhead Press",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "shoulders",
    secondaryMuscles: ["triceps", "core"],
    difficulty: "intermediate",
    instructions: [
      "עמוד זקוף עם רגליים ברוחב כתפיים",
      "החזק את הברבל על החזה העליון",
      "דחוף את הברבל ישר למעלה",
      "נעל את הזרועות מעל הראש",
      "הורד באותו מסלול חזרה לחזה",
    ],
    tips: [
      "שמור על הליבה מתוחה",
      "אל תכופף את הגב יותר מדי",
      "דחוף את הראש קדימה כשהברבל עובר",
    ],
    sets: 3,
    reps: "6-10",
    restTime: 90,
    caloriesPerSet: 14,
    safetyNotes: ["שמור על יציבות טובה", "התחמם את הכתפיים לפני תרגיל זה"],
  },

  {
    id: "barbell_upright_row",
    name: "חתירה זקופה עם ברבל",
    nameEn: "Barbell Upright Row",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "shoulders",
    secondaryMuscles: ["traps", "biceps"],
    difficulty: "beginner",
    instructions: [
      "עמוד זקוף עם הברבל בידיים",
      "אחיזה צרה יותר מרוחב כתפיים",
      "משוך את הברבל למעלה לכיוון הסנטר",
      "הרם את המרפקים גבוה מהידיים",
      "חזור לאט למצב התחלתי",
    ],
    tips: [
      "עצור כשהמרפקים בגובה הכתפיים",
      "שמור על שליטה בתנועה",
      "אל תהפוך את הכתפיים קדימה",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 10,
  },

  // ARMS EXERCISES
  {
    id: "barbell_bicep_curl",
    name: "כיפוף ביצפס עם ברבל",
    nameEn: "Barbell Bicep Curl",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "biceps",
    secondaryMuscles: ["forearms"],
    difficulty: "beginner",
    instructions: [
      "עמוד זקוף עם הברבל בידיים",
      "זרועות תלויות לצדי הגוף",
      "כופף את הברבל למעלה לכיוון החזה",
      "כווץ את הביצפס בחלק העליון",
      "הורד לאט חזרה למצב התחלתי",
    ],
    tips: [
      "שמור על מרפקים קבועים לצדי הגוף",
      "אל תנדנד את הגוף",
      "התמקד בשליטה בתנועה",
    ],
    sets: 3,
    reps: "10-15",
    restTime: 60,
    caloriesPerSet: 8,
  },

  {
    id: "barbell_close_grip_bench",
    name: "לחיצת ספסל אחיזה צרה עם ברבל",
    nameEn: "Close Grip Barbell Bench Press",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "triceps",
    secondaryMuscles: ["chest", "shoulders"],
    difficulty: "intermediate",
    instructions: [
      "שכב על הספסל כמו בלחיצת חזה רגילה",
      "אחוז את הברבל באחיזה צרה (רוחב כפות ידיים)",
      "הורד את הברבל לחזה התחתון",
      "דחוף חזרה למעלה בהדגשה על הטריצפס",
      "שמור על מרפקים קרובים לגוף",
    ],
    tips: [
      "אחיזה לא צרה מדי - עלולה לגרום ללחץ על פרקי ידיים",
      "התמקד בעבודת הטריצפס",
      "שמור על מרפקים יציבים",
    ],
    sets: 3,
    reps: "8-12",
    restTime: 90,
    caloriesPerSet: 12,
  },

  // CORE EXERCISES
  {
    id: "barbell_rollout",
    name: "גלגול עם ברבל",
    nameEn: "Barbell Rollout",
    category: "strength",
    equipment: "barbell",
    primaryMuscle: "core",
    secondaryMuscles: ["shoulders", "back"],
    difficulty: "advanced",
    instructions: [
      "תתחל על הברכיים עם הברבל מול הגוף",
      "אחוז את הברבל ברוחב כתפיים",
      "גלגל את הברבל קדימה עד למתיחה מלאה",
      "שמור על הליבה מתוחה לאורך כל התנועה",
      "חזור לאט למצב התחלתי",
    ],
    tips: [
      "התחל עם טווח תנועה קטן",
      "שמור על הגב ישר",
      "זהו תרגיל מתקדם לליבה",
    ],
    sets: 3,
    reps: "5-10",
    restTime: 90,
    caloriesPerSet: 15,
    safetyNotes: ["תרגיל מתקדם - לא מתאים למתחילים", "הפסק אם יש כאב בגב"],
  },
];

// Helper function to get exercises by muscle group
export const getBarbellExercisesByMuscle = (
  muscle: string
): BarbellExercise[] => {
  return barbellExercises.filter(
    (exercise) =>
      exercise.primaryMuscle === muscle ||
      exercise.secondaryMuscles?.includes(muscle)
  );
};

// Helper function to get exercises by difficulty
export const getBarbellExercisesByDifficulty = (
  difficulty: string
): BarbellExercise[] => {
  return barbellExercises.filter(
    (exercise) => exercise.difficulty === difficulty
  );
};

export default barbellExercises;
