/**
 * @file temporaryImages.ts
 * @description תמונות זמניות לתרגילים
 * Temporary images for exercises
 */

// מיפוי תמונות זמניות מ-Unsplash ואתרים ציבוריים
export const temporaryExerciseImages: Record<string, string> = {
  // Push-ups / שכיבות סמיכה
  push_up:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",

  // Squats / כיפופי ברכיים
  squat:
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",

  // Pull-ups / מתחים
  pull_up:
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",

  // Plank / פלאנק
  plank:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",

  // Lunges / נעילות
  lunge:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",

  // Burpees / ברפיס
  burpee:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",

  // Mountain climbers / מטפסי הרים
  mountain_climber:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",

  // Dumbbells / משקולות
  dumbbell:
    "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop",

  // Cardio / קרדיו
  cardio:
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=300&fit=crop",

  // Stretching / מתיחות
  stretch:
    "https://images.unsplash.com/photo-1506629905607-45094eba8fce?w=400&h=300&fit=crop",

  // תמונה כללית לתרגילים
  default:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
};

/**
 * מחזיר תמונה זמנית על בסיס שם התרגיל
 */
export function getTemporaryImage(exerciseName: string): string {
  const name = exerciseName.toLowerCase();

  // חיפוש לפי מילות מפתח
  if (name.includes("push") || name.includes("סמיכה")) {
    return temporaryExerciseImages.push_up;
  }
  if (
    name.includes("squat") ||
    name.includes("כיפוף") ||
    name.includes("ברכיים")
  ) {
    return temporaryExerciseImages.squat;
  }
  if (name.includes("pull") || name.includes("מתח")) {
    return temporaryExerciseImages.pull_up;
  }
  if (name.includes("plank") || name.includes("פלאנק")) {
    return temporaryExerciseImages.plank;
  }
  if (name.includes("lunge") || name.includes("נעילה")) {
    return temporaryExerciseImages.lunge;
  }
  if (name.includes("burpee") || name.includes("ברפי")) {
    return temporaryExerciseImages.burpee;
  }
  if (name.includes("mountain") || name.includes("הרים")) {
    return temporaryExerciseImages.mountain_climber;
  }
  if (
    name.includes("dumbbell") ||
    name.includes("משקולת") ||
    name.includes("דמבל")
  ) {
    return temporaryExerciseImages.dumbbell;
  }
  if (
    name.includes("cardio") ||
    name.includes("קרדיו") ||
    name.includes("ריצה")
  ) {
    return temporaryExerciseImages.cardio;
  }
  if (name.includes("stretch") || name.includes("מתיחה")) {
    return temporaryExerciseImages.stretch;
  }

  // תמונה ברירת מחדל
  return temporaryExerciseImages.default;
}
