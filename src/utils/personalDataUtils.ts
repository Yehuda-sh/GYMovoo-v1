/**
 * @file src/utils/personalDataUtils.ts
 * @description טיפוסים בסיסיים לנתונים אישיים
 */

/** נתונים אישיים בסיסיים */
export interface PersonalData {
  gender: "male" | "female";
  age: string; // "25_34", "35_44", etc.
  weight: string; // "70_79", "80_89", etc.
  height: string; // "170_179", "180_189", etc.
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  availability?: string; // "2_days", "3_days", etc.
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goals?:
    | "weight_loss"
    | "muscle_gain"
    | "endurance"
    | "strength"
    | "general_fitness";
  injuries?: string[]; // List of current injuries or limitations
}
