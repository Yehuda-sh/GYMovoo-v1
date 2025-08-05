// קובץ בדיקה זמני
const bodyweightExercises = [
  { id: "push_up_1", name: "שכיבת סמיכה בסיסית", equipment: "none" },
  { id: "squat_bodyweight_1", name: "כיפופי ברכיים", equipment: "none" },
  { id: "plank_1", name: "פלאנק", equipment: "none" },
  { id: "mountain_climbers_1", name: "מטפסי הרים", equipment: "none" },
  { id: "lunges_1", name: "צעידות", equipment: "none" },
  { id: "wall_sit_1", name: "ישיבה על קיר", equipment: "none" },
];

console.log(`✅ יש לנו ${bodyweightExercises.length} תרגילי משקל גוף:`);
bodyweightExercises.forEach((ex) => console.log(`   - ${ex.name}`));
