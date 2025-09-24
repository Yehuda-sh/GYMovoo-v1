/**
 * @file src/features/questionnaire/services/questionnaireService.ts
 * @description Service for questionnaire data management and workout plan generation
 * שירות לניהול נתוני השאלון ויצירת תוכניות אימון
 */

import { useUserStore } from "../../../stores/userStore";
import { WorkoutPlanGenerator } from "../../../services/workout/WorkoutPlanGenerator";
import { logger } from "../../../utils/logger";

// ===== Types used by this service =====

export interface WorkoutExercise {
  id: string;
  name: string;
  equipment: string;
  sets: Array<{
    id: string;
    reps: number;
    weight: number;
    duration: number;
    restTime: number;
    completed: boolean;
  }>;
  targetMuscles: string[];
  instructions: string[];
  restTime: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface WorkoutRecommendation {
  id: string;
  name: string;
  description: string;
  type: "strength" | "cardio" | "hiit" | "flexibility" | "mixed";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  equipment: string[];
  targetMuscles: string[];
  estimatedCalories: number;
  exercises?: WorkoutExercise[];
  restTime?: number;
  sets?: number;
  reps?: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes per session
  difficulty: "beginner" | "intermediate" | "advanced";
  workouts: WorkoutRecommendation[];
  type: string;
  isActive: boolean;
  frequency?: string;
  tags?: string[];
}

// ===== Types expected by WorkoutPlanGenerator (inferred envelope) =====

type GeneratorDifficulty = "beginner" | "intermediate" | "advanced";

interface GeneratorExercise {
  id: string;
  name: string;
  equipment: string;
  sets: number;
  restTime: number;
  targetMuscles: string[];
  difficulty: GeneratorDifficulty;
}

interface GeneratorDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  estimatedDuration: number;
  totalCaloriesBurn?: number;
  exercises: GeneratorExercise[];
}

interface GeneratorPlan {
  id: string;
  name: string;
  description: string;
  estimatedTimePerSession: number;
  difficultyLevel: GeneratorDifficulty;
  daysPerWeek: number;
  targetFitnessGoal: string;
  equipmentRequired: string[];
  weeklySchedule: GeneratorDay[];
}

// ===== Input shape for the generator (normalized) =====

interface GeneratorAnswersInput {
  gender?: string;
  age?: number;
  weight?: number;
  height?: number;
  fitness_goal?: string;
  experience_level?: GeneratorDifficulty;
  availability?: number; // days per week
  workout_duration?: string; // minutes as string, e.g. "45"
  workout_location?: string;
  equipment_available?: string[];
}

// ===== Shape of the smart questionnaire answers we store =====

interface SmartAnswers {
  gender?: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: GeneratorDifficulty;
  goals?: string[];
  equipment?: string[];
  availability?: string[] | number; // smart: ids array (e.g. ["3_days"]) OR number
  sessionDuration?: string; // e.g. "30_45_min"
  workoutLocation?: string;
  nutrition?: string[];

  // legacy/alt keys we still support:
  fitness_goal?: string;
  experience_level?: GeneratorDifficulty;
  workout_duration?: string;
  workout_location?: string;
  equipment_available?: string[];
}

// ---- Helpers ----

const mapAvailability = (val?: string | string[]): number | undefined => {
  const id = Array.isArray(val) ? val[0] : val;
  switch (id) {
    case "2_days":
      return 2;
    case "3_days":
      return 3;
    case "4_days":
      return 4;
    case "5_days":
      return 5;
    default:
      return undefined;
  }
};

const mapDuration = (id?: string): string | undefined => {
  switch (id) {
    case "15_30_min":
      return "30";
    case "30_45_min":
      return "45";
    case "45_60_min":
      return "60";
    case "60_plus_min":
      return "75";
    default:
      return undefined;
  }
};

const ensureEquipment = (arr?: string[]): string[] => {
  const set = new Set<string>(arr ?? []);
  if (set.size === 0) set.add("bodyweight");
  return Array.from(set);
};

const addIfDefined = <
  K extends keyof GeneratorAnswersInput,
  T extends GeneratorAnswersInput,
>(
  obj: T,
  key: K,
  value: GeneratorAnswersInput[K] | undefined
): void => {
  if (value !== undefined) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - index assignment is safe for our exact keys
    obj[key] = value;
  }
};

// Convert smart questionnaire answers (as stored in user.questionnaireData.answers)
// into the generator's expected input, *without* placing explicit `undefined` on fields.
const normalizeAnswersForGenerator = (
  answers: SmartAnswers
): GeneratorAnswersInput => {
  const gender = answers.gender;
  const age = answers.age;
  const weight = answers.weight;
  const height = answers.height;

  const fitness_goal: string | undefined =
    (Array.isArray(answers.goals) && answers.goals[0]) ||
    answers.fitness_goal ||
    "general_fitness";

  const experience_level: GeneratorDifficulty | undefined =
    answers.fitnessLevel || answers.experience_level;

  // availability can arrive as number or array-of-id
  let availability: number | undefined;
  const availRaw = answers.availability;
  if (typeof availRaw === "number") {
    availability = availRaw;
  } else {
    availability = mapAvailability(availRaw);
  }

  const workout_duration: string | undefined =
    mapDuration(answers.sessionDuration) || answers.workout_duration;

  const workout_location: string | undefined =
    answers.workoutLocation || answers.workout_location;

  const equipment_available: string[] | undefined = ensureEquipment(
    answers.equipment || answers.equipment_available || []
  );

  // Build object while skipping keys that are `undefined` (important with exactOptionalPropertyTypes)
  const out: GeneratorAnswersInput = {};
  addIfDefined(out, "gender", gender);
  addIfDefined(out, "age", age);
  addIfDefined(out, "weight", weight);
  addIfDefined(out, "height", height);
  addIfDefined(out, "fitness_goal", fitness_goal);
  addIfDefined(out, "experience_level", experience_level);
  addIfDefined(out, "availability", availability);
  addIfDefined(out, "workout_duration", workout_duration);
  addIfDefined(out, "workout_location", workout_location);
  addIfDefined(out, "equipment_available", equipment_available);

  return out;
};

/**
 * Simplified questionnaire service focused on workout plan generation
 * שירות שאלון מפושט המתמקד ביצירת תוכניות אימון
 */
class QuestionnaireService {
  /**
   * Generate smart workout plan based on user preferences
   * יצירת תוכנית אימון חכמה בהתבסס על העדפות המשתמש
   */
  async generateSmartWorkoutPlan(): Promise<WorkoutPlan[]> {
    try {
      logger.info("questionnaireService", "generateSmartWorkoutPlan called");

      const user = useUserStore.getState().user;
      logger.debug("questionnaireService", "User from store", {
        userId: user?.id,
      });

      // Build normalized input for generator
      let genInput: GeneratorAnswersInput;

      if (user?.questionnaireData?.answers) {
        genInput = normalizeAnswersForGenerator(
          user.questionnaireData.answers as SmartAnswers
        );
      } else {
        // Fallback defaults (no undefined values)
        genInput = {
          gender: "male",
          age: 25,
          weight: 75,
          height: 180,
          fitness_goal: "general_fitness",
          experience_level: "beginner",
          availability: 3,
          workout_duration: "45",
          workout_location: "home_bodyweight",
          equipment_available: ["bodyweight", "yoga_mat"],
        };
        logger.warn(
          "questionnaireService",
          "No questionnaire data found. Using default generator input"
        );
      }

      // Guardrails: fill minimal missing fields (do NOT assign undefined)
      if (genInput.availability === undefined) genInput.availability = 3;
      if (genInput.workout_duration === undefined)
        genInput.workout_duration = "45";
      if (
        genInput.equipment_available === undefined ||
        genInput.equipment_available.length === 0
      ) {
        genInput.equipment_available = ["bodyweight"];
      }
      if (genInput.experience_level === undefined)
        genInput.experience_level = "beginner";

      logger.debug("questionnaireService", "Generator input", genInput);

      // Generate
      const generator = new WorkoutPlanGenerator(genInput);
      const generatedPlan = generator.generateWorkoutPlan() as GeneratorPlan;

      logger.info("questionnaireService", "Plan generated", {
        planId: generatedPlan?.id,
        daysPerWeek: generatedPlan?.daysPerWeek,
      });

      // Convert to UI-friendly plan shape
      const plan: WorkoutPlan = {
        id: generatedPlan.id,
        name: generatedPlan.name,
        description: generatedPlan.description,
        duration: generatedPlan.estimatedTimePerSession,
        difficulty: generatedPlan.difficultyLevel,
        workouts: generatedPlan.weeklySchedule.map(
          (day): WorkoutRecommendation => ({
            id: `workout-${day.dayNumber}`,
            name: day.dayName,
            description: day.focus,
            type: "strength",
            difficulty: generatedPlan.difficultyLevel,
            duration: day.estimatedDuration,
            equipment: generatedPlan.equipmentRequired,
            targetMuscles: [day.focus],
            estimatedCalories: Math.round(day.totalCaloriesBurn ?? 0),
            exercises: day.exercises.map(
              (exercise): WorkoutExercise => ({
                id: exercise.id,
                name: exercise.name,
                equipment: exercise.equipment,
                sets: Array.from(
                  { length: Math.max(1, exercise.sets) },
                  (_, i) => ({
                    id: `set-${i + 1}`,
                    reps: 10,
                    weight: 0,
                    duration: 30,
                    restTime: exercise.restTime,
                    completed: false,
                  })
                ),
                targetMuscles: exercise.targetMuscles,
                instructions: [exercise.name],
                restTime: exercise.restTime,
                difficulty: exercise.difficulty,
              })
            ),
            restTime: 60,
            sets: 3,
            reps: 12,
          })
        ),
        type: "smart",
        isActive: true,
        frequency: `${generatedPlan.daysPerWeek} פעמים בשבוע`,
        tags: [generatedPlan.targetFitnessGoal],
      };

      return [plan];
    } catch (error) {
      logger.error("questionnaireService", "Error generating plan", error);
      return [];
    }
  }
}

/**
 * Questionnaire service singleton instance
 * מופע יחידי של שירות השאלון
 */
export const questionnaireService = new QuestionnaireService();

/**
 * Class export for advanced integration scenarios
 * יצוא מחלקה לתרחישי אינטגרציה מתקדמים
 */
export { QuestionnaireService };
