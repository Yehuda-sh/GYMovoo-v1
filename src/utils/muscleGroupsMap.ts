/**
 * @file src/utils/muscleGroupsMap.ts
 * @description מיפוי קבוצות שרירים עיקריות לאפליקציה, כולל שמות בעברית/אנגלית, מזהה, מילות מפתח וקישור לתרגילים
 */

/**
 * MuscleGroup - מודול שרירים אינטראקטיבי
 * id: מזהה לוגי אחיד
 * svgId: מזהה path ב-SVG (לשימוש במפה אינטראקטיבית)
 * nameHe/nameEn: שמות בעברית/אנגלית
 * keywords: מילות מפתח לחיפוש
 * exercisesIds: מזהי תרגילים רלוונטיים
 */
export interface MuscleGroup {
  id: string;
  svgId: string; // מזהה path ב-SVG
  nameHe: string;
  nameEn: string;
  keywords: string[];
  exercisesIds: string[];
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    id: "biceps",
    svgId: "biceps_L,R", // לדוג' svgId תואם ל-path ב-SVG (אפשר גם biceps_L/biceps_R)
    nameHe: "יד קדמית",
    nameEn: "Biceps",
    keywords: ["בייספס", "יד קדמית", "biceps", "arm curl"],
    exercisesIds: [],
  },
  {
    id: "triceps",
    svgId: "triceps_L,R",
    nameHe: "יד אחורית",
    nameEn: "Triceps",
    keywords: ["טרייספס", "יד אחורית", "triceps", "arm extension"],
    exercisesIds: [],
  },
  {
    id: "chest_upper",
    svgId: "chest_upper",
    nameHe: "חזה עליון",
    nameEn: "Upper Chest",
    keywords: ["חזה עליון", "upper chest", "incline"],
    exercisesIds: [],
  },
  {
    id: "chest_middle",
    svgId: "chest_middle",
    nameHe: "חזה אמצעי",
    nameEn: "Middle Chest",
    keywords: ["חזה אמצעי", "middle chest", "bench press"],
    exercisesIds: [],
  },
  {
    id: "chest_lower",
    svgId: "chest_lower",
    nameHe: "חזה תחתון",
    nameEn: "Lower Chest",
    keywords: ["חזה תחתון", "lower chest", "decline"],
    exercisesIds: [],
  },
  {
    id: "quads",
    svgId: "quads_L,R",
    nameHe: "ירך קדמית",
    nameEn: "Quadriceps",
    keywords: ["ירך קדמית", "quads", "quadriceps"],
    exercisesIds: [],
  },
  {
    id: "hamstrings",
    svgId: "hamstrings_L,R",
    nameHe: "ירך אחורית",
    nameEn: "Hamstrings",
    keywords: ["ירך אחורית", "hamstrings"],
    exercisesIds: [],
  },
  {
    id: "glutes",
    svgId: "glutes",
    nameHe: "ישבן",
    nameEn: "Glutes",
    keywords: ["ישבן", "glutes", "butt"],
    exercisesIds: [],
  },
  {
    id: "calves",
    svgId: "calves_L,R",
    nameHe: "תאומים",
    nameEn: "Calves",
    keywords: ["תאומים", "calves"],
    exercisesIds: [],
  },
  {
    id: "shoulder_front",
    svgId: "shoulder_front_L,R",
    nameHe: "כתף קדמית",
    nameEn: "Front Deltoid",
    keywords: ["כתף קדמית", "anterior deltoid", "front delt"],
    exercisesIds: [],
  },
  {
    id: "shoulder_side",
    svgId: "shoulder_side_L,R",
    nameHe: "כתף אמצעית",
    nameEn: "Lateral Deltoid",
    keywords: ["כתף אמצעית", "lateral deltoid", "side delt"],
    exercisesIds: [],
  },
  {
    id: "shoulder_rear",
    svgId: "shoulder_rear_L,R",
    nameHe: "כתף אחורית",
    nameEn: "Rear Deltoid",
    keywords: ["כתף אחורית", "posterior deltoid", "rear delt"],
    exercisesIds: [],
  },
  {
    id: "trapezius",
    svgId: "trapezius",
    nameHe: "טרפז",
    nameEn: "Trapezius",
    keywords: ["טרפז", "trapezius", "trap"],
    exercisesIds: [],
  },
  {
    id: "lats",
    svgId: "lats_L,R",
    nameHe: "רחב גבי",
    nameEn: "Lats",
    keywords: ["רחב גבי", "lats", "latissimus dorsi"],
    exercisesIds: [],
  },
  {
    id: "upper_back",
    svgId: "upper_back",
    nameHe: "גב עליון",
    nameEn: "Upper Back",
    keywords: ["גב עליון", "upper back"],
    exercisesIds: [],
  },
  {
    id: "lower_back",
    svgId: "lower_back",
    nameHe: "גב תחתון",
    nameEn: "Lower Back",
    keywords: ["גב תחתון", "lower back"],
    exercisesIds: [],
  },
  {
    id: "abs_upper",
    svgId: "abs_upper",
    nameHe: "בטן עליונה",
    nameEn: "Upper Abs",
    keywords: ["בטן עליונה", "upper abs"],
    exercisesIds: [],
  },
  {
    id: "abs_lower",
    svgId: "abs_lower",
    nameHe: "בטן תחתונה",
    nameEn: "Lower Abs",
    keywords: ["בטן תחתונה", "lower abs"],
    exercisesIds: [],
  },
  {
    id: "obliques",
    svgId: "obliques_L,R",
    nameHe: "אלכסונים",
    nameEn: "Obliques",
    keywords: ["אלכסונים", "obliques"],
    exercisesIds: [],
  },
  {
    id: "forearms",
    svgId: "forearms_L,R",
    nameHe: "אמות",
    nameEn: "Forearms",
    keywords: ["אמות", "forearms"],
    exercisesIds: [],
  },
];
