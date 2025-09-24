/**
 * @file src/features/workout/utils/debugWorkoutPlan.ts
 * @description Debug utilities for workout plan generation (no `any`, exactOptionalPropertyTypes-safe)
 */

type DebugExercise = {
  id?: string;
  name?: string;
  equipment?: string;
};

type DebugWorkout = {
  id?: string;
  name?: string;
  exercises?: DebugExercise[];
};

type DebugPlan = {
  id?: string;
  name?: string;
  description?: string;
  workouts?: DebugWorkout[];
};

// ---------- type guards & helpers ----------
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const asString = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

const buildExercise = (raw: unknown): DebugExercise => {
  const out: DebugExercise = {};
  if (!isObject(raw)) return out;

  const id = asString(raw.id);
  const name = asString(raw.name);
  const equipment = asString(raw.equipment);

  if (id !== undefined) out.id = id;
  if (name !== undefined) out.name = name;
  if (equipment !== undefined) out.equipment = equipment;

  return out;
};

const asExercises = (v: unknown): DebugExercise[] | undefined => {
  if (!Array.isArray(v)) return undefined;
  const mapped = v
    .map(buildExercise)
    .filter((ex) => Object.keys(ex).length > 0);
  return mapped.length ? mapped : undefined;
};

const buildWorkout = (raw: unknown): DebugWorkout => {
  const out: DebugWorkout = {};
  if (!isObject(raw)) return out;

  const id = asString(raw.id);
  const name = asString(raw.name);
  const exercises = asExercises(raw.exercises);

  if (id !== undefined) out.id = id;
  if (name !== undefined) out.name = name;
  if (exercises !== undefined) out.exercises = exercises;

  return out;
};

const asWorkouts = (v: unknown): DebugWorkout[] | undefined => {
  if (!Array.isArray(v)) return undefined;
  const mapped = v.map(buildWorkout).filter((w) => Object.keys(w).length > 0);
  return mapped.length ? mapped : undefined;
};

const asDebugPlan = (plan: unknown): DebugPlan | null => {
  if (!isObject(plan)) return null;

  const out: DebugPlan = {};
  const id = asString(plan.id);
  const name = asString(plan.name);
  const description = asString(plan.description);
  const workouts = asWorkouts(plan.workouts);

  if (id !== undefined) out.id = id;
  if (name !== undefined) out.name = name;
  if (description !== undefined) out.description = description;
  if (workouts !== undefined) out.workouts = workouts;

  return Object.keys(out).length ? out : null;
};

// ---------- public API ----------
export const debugWorkoutPlan = (plan: unknown, source: string): void => {
  const p = asDebugPlan(plan);

  const firstWorkout = p?.workouts?.[0];
  const summary = {
    planExists: Boolean(p),
    planId: p?.id,
    planName: p?.name,
    planDescription: p?.description,
    workoutsCount: p?.workouts?.length ?? 0,
    firstWorkout: firstWorkout
      ? {
          id: firstWorkout.id,
          name: firstWorkout.name,
          exercisesCount: firstWorkout.exercises?.length ?? 0,
          exercises:
            firstWorkout.exercises?.map((ex) => ({
              id: ex.id,
              name: ex.name,
              equipment: ex.equipment,
            })) ?? [],
        }
      : null,
    fullPlan: p,
  };

  // אם יש לכם logger ייעודי — החליפו ל-logger.info/debug בהתאם
  console.log(`🔍 DEBUG ${source}:`, summary);
};

// טיפוס מינימלי לתשובות שאלון (לצורכי בדיקות)
export type QuestionnaireAnswersLite = {
  gender: "male" | "female";
  age: number;
  weight: number;
  height: number;
  fitness_goal:
    | "muscle_building"
    | "weight_loss"
    | "endurance"
    | "general_fitness";
  experience_level: "beginner" | "intermediate" | "advanced";
  availability: number | string;
  workout_duration: string | number;
  workout_location: "gym" | "home" | "outdoor";
  equipment_available: string[];
};

export const testQuestionnaireAnswers: QuestionnaireAnswersLite = {
  gender: "male",
  age: 25,
  weight: 75,
  height: 180,
  fitness_goal: "muscle_building",
  experience_level: "intermediate",
  availability: 4,
  workout_duration: "45",
  workout_location: "gym",
  equipment_available: [
    "dumbbells",
    "barbells",
    "machines",
    "cables",
    "pull_up_bar",
    "medicine_ball",
    "stability_ball",
    "foam_roller",
  ],
};
