import { allExercises } from "../src/data/exercises/index";
import { EQUIPMENT_TYPES } from "../src/data/exercises/exerciseFilters";
import { Exercise } from "../src/data/exercises/types";

/**
 * בדיקה אוטומטית לגיוון תרגילים לכל ציוד ושריר
 * @param exercises מערך תרגילים
 * @param minCount מינימום תרגילים לכל שריר
 * @returns אובייקט חוסרים + דוח מסוף
 */
function checkEquipmentMuscleVariety(
  exercises: Exercise[],
  minCount: number = 3
): Record<string, Record<string, number>> {
  // מיפוי ציוד -> שריר -> כמות תרגילים
  const result: Record<string, Record<string, number>> = {};
  const missing: Record<string, Record<string, number>> = {};

  exercises.forEach((ex) => {
    const equipment = ex.equipment;
    if (!equipment) return;
    // נניח שיש שדה primaryMuscles (מערך)
    const muscles: string[] = Array.isArray(ex.primaryMuscles)
      ? ex.primaryMuscles
      : [ex.primaryMuscles];
    if (!result[equipment]) result[equipment] = {};
    muscles.forEach((muscle) => {
      if (!result[equipment][muscle]) result[equipment][muscle] = 0;
      result[equipment][muscle]++;
    });
  });

  // דוח מסוף
  console.warn("\n📊 בדיקת גיוון תרגילים לכל ציוד ושריר:");
  Object.entries(result).forEach(([equipment, muscleMap]) => {
    Object.entries(muscleMap).forEach(([muscle, count]) => {
      if (count < minCount) {
        if (!missing[equipment]) missing[equipment] = {};
        missing[equipment][muscle] = count;
        console.warn(
          `❗ חסר גיוון: ציוד '${equipment}' לשריר '${muscle}' - רק ${count} תרגילים (מינימום ${minCount})`
        );
      }
    });
  });
  if (Object.keys(missing).length === 0) {
    console.warn("✅ כל הציוד עומד בגיוון הנדרש לכל השרירים!");
  }
  return missing;
}

// הפעלת הבדיקה על כל הציוד
const minCount = 3;
const missing = checkEquipmentMuscleVariety(allExercises, minCount);
console.warn("\n🔎 אובייקט חוסרים:", JSON.stringify(missing, null, 2));
