/**
 * @file src/services/workout/WorkoutPlanGeneratorTest.ts
 * @description Test file to verify WorkoutPlanGenerator integration (typed, resilient)
 */

import { WorkoutPlanGenerator } from "./WorkoutPlanGenerator";

/** ----- Local helper types (non-strict, for testing ergonomics) ----- */
type Difficulty = "beginner" | "intermediate" | "advanced";

interface TestExercise {
  id?: string;
  name?: string;
  equipment?: string;
  category?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
}

interface TestDay {
  dayIndex?: number;
  name?: string;
  focus?: string;
  exercises: TestExercise[];
}

interface TestPlan {
  name: string;
  duration: number; // weeks
  daysPerWeek: number;
  weeklySchedule: TestDay[];
  equipmentRequired: string[];
  targetFitnessGoal?: string;
  difficultyLevel?: Difficulty | string;
}

interface SampleAnswers {
  gender: "male" | "female" | "other";
  age: number;
  weight: number; // kg
  height: number; // cm
  fitness_goal:
    | "muscle_building"
    | "weight_loss"
    | "endurance"
    | "strength"
    | "general_fitness";
  experience_level: Difficulty;
  availability: number; // days per week
  workout_duration: string; // minutes, as string (matches your generator’s expectation)
  workout_location: "gym" | "home" | "outdoor";
  equipment_available: string[];
}

/** Small util to safely read arrays */
const asArray = <T>(v: unknown, fallback: T[] = []): T[] =>
  Array.isArray(v) ? (v as T[]) : fallback;

/** Normalize common equipment naming differences to your unified keys */
const normalizeEquipment = (eq: string): string => {
  const key = eq.trim().toLowerCase();

  const map: Record<string, string> = {
    // common variants → unified keys you use across the app
    barbell: "barbell",
    barbells: "barbell",
    dumbbell: "dumbbells",
    dumbbells: "dumbbells",
    machine: "machines",
    machines: "machines",
    cable: "cables",
    cables: "cables",
    cable_machine: "cables",
    pullup_bar: "pull_up_bar",
    pull_up_bar: "pull_up_bar",
    medicineball: "medicine_ball",
    "medicine ball": "medicine_ball",
    medicine_ball: "medicine_ball",
    stabilityball: "stability_ball",
    "stability ball": "stability_ball",
    stability_ball: "stability_ball",
    foamroller: "foam_roller",
    "foam roller": "foam_roller",
    foam_roller: "foam_roller",
    bodyweight: "bodyweight",
    free_weights: "free_weights",
    trx: "trx",
    kettlebell: "kettlebell",
  };

  return map[key] ?? key;
};

/** Pretty log helpers */
const hr = (c = "-") => console.log(c.repeat(60));
const log = (...args: unknown[]) => console.log(...args);

/**
 * Test function to verify the integration works.
 * Returns a structured result object for programmatic assertions.
 */
export const testWorkoutPlanGeneration = () => {
  hr();
  log("🚀 Testing WorkoutPlanGenerator integration…");

  // Sample questionnaire answers for testing
  const sampleAnswers: SampleAnswers = {
    gender: "male",
    age: 25,
    weight: 75,
    height: 180,
    fitness_goal: "muscle_building",
    experience_level: "intermediate",
    availability: 4,
    workout_duration: "45", // string by design
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
    ].map(normalizeEquipment),
  };

  try {
    // Create generator with sample answers
    const generator = new WorkoutPlanGenerator(sampleAnswers);

    // Generate workout plan
    const rawPlan = generator.generateWorkoutPlan();

    // Coerce to our soft TestPlan shape for logging/validations
    const plan = rawPlan as unknown as TestPlan;

    // Basic defensive checks (won’t throw unless absolutely necessary)
    if (!plan || typeof plan !== "object") {
      throw new Error("Generator returned an invalid plan (non-object).");
    }

    const weeklySchedule = asArray<TestDay>(plan.weeklySchedule);
    const allExercises = weeklySchedule.flatMap((day) =>
      asArray<TestExercise>(day?.exercises)
    );

    const equipmentFromPlan = new Set<string>();
    allExercises.forEach((ex) => {
      if (ex?.equipment)
        equipmentFromPlan.add(normalizeEquipment(ex.equipment));
    });

    const equipmentRequired = asArray<string>(plan.equipmentRequired).map(
      normalizeEquipment
    );

    hr();
    log("✅ WorkoutPlan generated successfully!");
    hr();
    log("📊 Plan details:");
    log(`• Name:             ${plan.name ?? "(no name)"}`);
    log(`• Duration:         ${plan.duration ?? "?"} weeks`);
    log(`• Days per week:    ${plan.daysPerWeek ?? "?"}`);
    log(`• Sessions:         ${weeklySchedule.length}`);
    log(
      `• Equipment req.:   ${
        equipmentRequired.length ? equipmentRequired.join(", ") : "(none)"
      }`
    );
    log(`• Target:           ${plan.targetFitnessGoal ?? "(n/a)"}`);
    log(`• Difficulty:       ${plan.difficultyLevel ?? "(n/a)"}`);

    // Equipment types actually used inside exercises
    const equipmentTypes = Array.from(equipmentFromPlan.values());
    hr();
    log(`🎯 Found ${allExercises.length} total exercises`);
    log(
      `🛠️  Equipment types used: ${
        equipmentTypes.length ? equipmentTypes.join(", ") : "(none)"
      }`
    );

    // Check for coverage of “new” equipment families
    const NEW_EQUIPMENT_KEYS = new Set<string>([
      "barbell",
      "machines",
      "cables",
      "pull_up_bar",
      "medicine_ball",
      "stability_ball",
      "foam_roller",
    ]);

    const hasNewEquipment = equipmentTypes.some((eq) =>
      NEW_EQUIPMENT_KEYS.has(eq)
    );

    if (hasNewEquipment) {
      log("🎉 SUCCESS: New exercise databases are being used!");
    } else {
      log("⚠️  WARNING: Only using original exercise databases");
    }

    hr();
    return {
      success: true as const,
      plan,
      stats: {
        totalExercises: allExercises.length,
        equipmentTypes,
        hasNewEquipment,
        sessions: weeklySchedule.length,
      },
    };
  } catch (error) {
    hr();
    console.error("❌ Error generating workout plan:", error);
    hr();
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export default testWorkoutPlanGeneration;
