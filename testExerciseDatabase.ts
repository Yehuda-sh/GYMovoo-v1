// בדיקה פשוטה לפונקציות סינון התרגילים
import { 
  exerciseDatabase, 
  getBodyweightExercises, 
  getDumbbellExercises,
  filterExercisesByEquipment,
  getSmartFilteredExercises,
  EQUIPMENT_CATEGORIES 
} from './src/data/exerciseDatabase';

console.log('=== בדיקת מאגר התרגילים ===\n');

// בדיקה 1: כמות התרגילים הכוללת
console.log(`1. סה"כ תרגילים במאגר: ${exerciseDatabase.length}`);

// בדיקה 2: תרגילים עם משקל גוף בלבד
const bodyweightExercises = getBodyweightExercises();
console.log(`2. תרגילי משקל גוף: ${bodyweightExercises.length}`);
bodyweightExercises.forEach(ex => {
  console.log(`   - ${ex.name.he} (${ex.name.en})`);
});

// בדיקה 3: תרגילים עם משקולות
const dumbbellExercises = getDumbbellExercises();
console.log(`\n3. תרגילי משקולות: ${dumbbellExercises.length}`);
dumbbellExercises.forEach(ex => {
  console.log(`   - ${ex.name.he} (${ex.name.en})`);
});

// בדיקה 4: סינון חכם - אימון בית ללא ציוד
console.log('\n4. אימון בית ללא ציוד:');
const homeNoEquipment = getSmartFilteredExercises(['home'], []);
homeNoEquipment.forEach(ex => {
  console.log(`   - ${ex.name.he} - ${ex.equipment_needed.join(', ')}`);
});

// בדיקה 5: סינון חכם - אימון בית עם משקולות
console.log('\n5. אימון בית עם משקולות:');
const homeWithDumbbells = getSmartFilteredExercises(['home'], ['dumbbells']);
homeWithDumbbells.forEach(ex => {
  console.log(`   - ${ex.name.he} - ${ex.equipment_needed.join(', ')}`);
});

// בדיקה 6: קטגוריות ציוד
console.log('\n6. קטגוריות ציוד:');
Object.entries(EQUIPMENT_CATEGORIES).forEach(([key, value]) => {
  console.log(`   ${key}: ${value.join(', ')}`);
});

console.log('\n=== סיום בדיקה ===');
