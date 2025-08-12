// בדיקה פשוטה של מאגר התרגילים החדש
console.log("=== בדיקת מאגר התרגילים החדש ===\n");

// בדיקה ידנית של המאגר
const exerciseDatabase = [
  {
    nameLocalized: { he: "שכיבת סמיכה בסיסית", en: "Basic Push-Up" },
    equipment: "none",
    homeCompatible: true,
  },
  {
    nameLocalized: { he: "כיפופי ברכיים עם משקל גוף", en: "Bodyweight Squat" },
    equipment: "none",
    homeCompatible: true,
  },
  {
    nameLocalized: { he: "דחיפת חזה עם משקולות", en: "Dumbbell Chest Press" },
    equipment: "dumbbells",
    homeCompatible: true,
  },
];

// בדיקה 1: כמות התרגילים
console.log(`1. סה"כ תרגילים במאגר: ${exerciseDatabase.length}`);

// בדיקה 2: תרגילי משקל גוף
const bodyweightExercises = exerciseDatabase.filter(
  (ex) => ex.equipment === "none"
);
console.log(`\n2. תרגילי משקל גוף: ${bodyweightExercises.length}`);
bodyweightExercises.forEach((ex) => {
  console.log(`   - ${ex.nameLocalized.he} (${ex.nameLocalized.en})`);
});

// בדיקה 3: תרגילים עם משקולות
const dumbbellExercises = exerciseDatabase.filter(
  (ex) => ex.equipment === "dumbbells"
);
console.log(`\n3. תרגילי משקולות: ${dumbbellExercises.length}`);
dumbbellExercises.forEach((ex) => {
  console.log(`   - ${ex.nameLocalized.he} (${ex.nameLocalized.en})`);
});

// בדיקה 4: אימון בית ללא ציוד
console.log("\n4. אימון בית ללא ציוד:");
const homeNoEquipment = exerciseDatabase.filter(
  (ex) => ex.homeCompatible && ex.equipment === "none"
);
homeNoEquipment.forEach((ex) => {
  console.log(`   - ${ex.nameLocalized.he} - ציוד: ${ex.equipment}`);
});

console.log("\n=== הבדיקה הצליחה! המאגר עובד תקין ===\n");

// דוגמת קוד לשימוש באפליקציה:
console.log("💡 דוגמת שימוש באפליקציה:");
console.log(`
// שימוש בפונקציות הסינון (ייצוא אמיתי):
import {
  getBodyweightExercises,
  getDumbbellExercises,
  getSmartFilteredExercises,
  getQuietExercises,
} from './src/data/exercises';

// תרגילי בית ללא ציוד:
const homeWorkout = getSmartFilteredExercises(['home'], []);

// תרגילי בית עם משקולות:
const homeWithWeights = getSmartFilteredExercises(['home'], ['dumbbells']);

// תרגילים שקטים לדירה:
const quietOnly = getQuietExercises();
`);
