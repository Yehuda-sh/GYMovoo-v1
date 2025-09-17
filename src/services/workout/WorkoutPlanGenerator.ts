import { Exercise, ExerciseCategory } from "../../data/exercises/types";
import { ExerciseDifficulty, MuscleGroup } from "../../constants/exercise";
import { bodyweightExercises } from "../../data/exercises/bodyweight";
import { cardioExercises } from "../../data/exercises/cardio";
import { dumbbellExercises } from "../../data/exercises/dumbbells";
import { flexibilityExercises } from "../../data/exercises/flexibility";
import { kettlebellExercises } from "../../data/exercises/kettlebells";
import { resistanceBandExercises } from "../../data/exercises/resistanceBands";
import { trxExercises } from "../../data/exercises/trx";
import { waterWeightExercises } from "../../data/exercises/water_weights";
// Import new exercise databases
import { barbellExercises } from "../../data/exercises/barbell";
import { pullUpBarExercises } from "../../data/exercises/pull_up_bar";
import { machineExercises } from "../../data/exercises/machines";
import { cableExercises } from "../../data/exercises/cables";
import { medicineBallExercises } from "../../data/exercises/medicine_ball";
import { stabilityBallExercises } from "../../data/exercises/stability_ball";
import { foamRollerExercises } from "../../data/exercises/foam_roller";
import {
  SelectedEquipment,
  mapSelectedEquipmentToTypes,
  getEquipmentDisplayNames,
} from "./types/questionnaire";

/* -------------------------------------------------------------------------- */
/*                               Questionnaire                                */
/* -------------------------------------------------------------------------- */

// Legacy interface - לתאימות עם קוד ישן
export interface QuestionnaireAnswers {
  gender?: string;
  age?: string | number | string[];
  weight?: string | number | string[];
  height?: string | number | string[];
  fitness_goal?: string | string[];
  goals?: string[];
  experience_level?: string;
  fitnessLevel?: string;
  availability?: string | number | string[];
  workout_duration?: string;
  workout_location?: string;
  workoutLocation?: string;
  equipment_available?: string[];
  equipment?: string[];
  // שדות חדשים מהשאלון המאוחד
  bodyweight_equipment?: string[];
  home_equipment?: string[];
  gym_equipment?: string[];
}

/* -------------------------------------------------------------------------- */
/*                                 Workout Types                              */
/* -------------------------------------------------------------------------- */

export interface WorkoutExercise {
  id: string;
  name: string;
  nameLocalized: {
    he: string;
    en: string;
  };
  sets: number;
  reps: string;
  restTime: number;
  notes?: string;
  targetMuscles: string[];
  difficulty: string;
  equipment: string;
}

export interface DailyWorkout {
  dayNumber: number;
  dayName: string;
  focus: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number;
  totalCaloriesBurn?: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // weeks
  daysPerWeek: number;
  targetFitnessGoal: string;
  difficultyLevel: string;
  weeklySchedule: DailyWorkout[];
  totalCaloriesPerWeek?: number;
  progressionNotes: string[];
  equipmentRequired: string[];
  estimatedTimePerSession: number;
  createdAt: Date;
}

export interface WorkoutProfile {
  gender: string;
  ageRange: string;
  weightRange: string;
  heightRange: string;
  fitnessGoal: string;
  experienceLevel: string;
  availabilityDays: string;
  sessionDuration: string;
  workoutLocation: string;
  equipment: string[];
  injuries: string[];
  preferences: string[];
}

/* -------------------------------------------------------------------------- */
/*                           Generator Implementation                         */
/* -------------------------------------------------------------------------- */

// Adapter functions to convert new exercise formats to Exercise interface
const adaptNewExerciseFormat = (
  exercise: {
    id: string;
    name: string;
    nameEn?: string;
    category?: string;
    primaryMuscle?: string;
    secondaryMuscles?: string[];
    difficulty?: string;
    instructions?: string[];
    tips?: string[];
    safetyNotes?: string[];
  },
  equipment: string
): Exercise => {
  return {
    id: exercise.id,
    name: exercise.name,
    nameLocalized: {
      he: exercise.name,
      en: exercise.nameEn || exercise.name,
    },
    category: (exercise.category as ExerciseCategory) || "strength",
    primaryMuscles: exercise.primaryMuscle
      ? [exercise.primaryMuscle as MuscleGroup]
      : ["full_body" as MuscleGroup],
    secondaryMuscles: (exercise.secondaryMuscles as MuscleGroup[]) || [],
    equipment: equipment,
    difficulty: (exercise.difficulty as ExerciseDifficulty) || "beginner",
    instructions: {
      he: exercise.instructions || [],
      en: [],
    },
    tips: {
      he: exercise.tips || [],
      en: [],
    },
    safetyNotes: {
      he: exercise.safetyNotes || [],
      en: [],
    },
    media: {
      image: "",
      video: "",
      thumbnail: "",
    },
    homeCompatible: equipment !== "machines" && equipment !== "cables",
    gymPreferred:
      equipment === "machines" ||
      equipment === "cables" ||
      equipment === "barbells",
    outdoorSuitable:
      equipment === "bodyweight" || equipment === "resistance_bands",
    spaceRequired:
      equipment === "machines"
        ? "large"
        : equipment === "barbells"
          ? "medium"
          : "small",
    noiseLevel: equipment === "medicine_ball" ? "moderate" : "quiet",
  };
};

// Convert new exercise databases to Exercise format
const adaptedBarbellExercises = barbellExercises.map((ex) =>
  adaptNewExerciseFormat(ex, "barbells")
);
const adaptedPullUpBarExercises = pullUpBarExercises.map((ex) =>
  adaptNewExerciseFormat(ex, "pull_up_bar")
);
const adaptedMachineExercises = machineExercises.map((ex) =>
  adaptNewExerciseFormat(ex, "machines")
);
const adaptedCableExercises = cableExercises.map((ex) =>
  adaptNewExerciseFormat(ex, "cables")
);
const adaptedMedicineBallExercises = medicineBallExercises.map((ex) =>
  adaptNewExerciseFormat(ex, "medicine_ball")
);
const adaptedStabilityBallExercises = stabilityBallExercises.map((ex) =>
  adaptNewExerciseFormat(ex, "stability_ball")
);
const adaptedFoamRollerExercises = foamRollerExercises.map((ex) =>
  adaptNewExerciseFormat(ex, "foam_roller")
);

const allExercises: Exercise[] = [
  ...bodyweightExercises,
  ...cardioExercises,
  ...dumbbellExercises,
  ...flexibilityExercises,
  ...kettlebellExercises,
  ...resistanceBandExercises,
  ...trxExercises,
  ...waterWeightExercises,
  // Add new exercise databases
  ...adaptedBarbellExercises,
  ...adaptedPullUpBarExercises,
  ...adaptedMachineExercises,
  ...adaptedCableExercises,
  ...adaptedMedicineBallExercises,
  ...adaptedStabilityBallExercises,
  ...adaptedFoamRollerExercises,
];

export class WorkoutPlanGenerator {
  private userProfile: WorkoutProfile;
  private exercises: Exercise[] = allExercises;

  constructor(userAnswers: QuestionnaireAnswers) {
    this.userProfile = this.createWorkoutProfile(userAnswers);
  }

  /* ---------------------- יצירת פרופיל מהשאלון ---------------------- */
  private createWorkoutProfile(answers: QuestionnaireAnswers): WorkoutProfile {
    return {
      gender: answers.gender || "prefer_not_to_say",
      ageRange: this.getStringValue(answers.age),
      weightRange: this.getStringValue(answers.weight),
      heightRange: this.getStringValue(answers.height),
      fitnessGoal: (Array.isArray(answers.fitness_goal)
        ? answers.fitness_goal[0]
        : answers.fitness_goal ||
          answers.goals?.[0] ||
          "general_fitness") as string,
      experienceLevel:
        answers.experience_level || answers.fitnessLevel || "beginner",
      availabilityDays: this.getStringValue(answers.availability),
      sessionDuration: answers.workout_duration || "session_duration",
      workoutLocation: (answers.workout_location ||
        answers.workoutLocation ||
        "home_bodyweight") as string,
      equipment: this.extractEquipment(answers),
      injuries: [],
      preferences: [],
    };
  }

  private getStringValue(
    value: string | number | string[] | undefined
  ): string {
    if (!value) return "";
    if (typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  }

  private extractEquipment(answers: QuestionnaireAnswers): string[] {
    // יצירת מבנה ציוד מאוחד מהתשובות
    const selectedEquipment: SelectedEquipment = {
      bodyweight_items: answers.bodyweight_equipment || [],
      home_equipment: answers.home_equipment || [],
      gym_equipment: answers.gym_equipment || [],
    };

    // אם אין ציוד ספציפי, נחפש בשדות הישנים
    if (
      selectedEquipment.bodyweight_items.length === 0 &&
      selectedEquipment.home_equipment.length === 0 &&
      selectedEquipment.gym_equipment.length === 0
    ) {
      // נסה לקחת מהשדות הישנים
      const oldEquipment =
        answers.equipment_available || answers.equipment || [];
      if (oldEquipment.length > 0) {
        console.log("🔧 Using legacy equipment format:", oldEquipment);
        // נניח שזה ציוד כללי ונשים בקטגוריה מתאימה
        selectedEquipment.home_equipment = oldEquipment;
      }
    }

    console.log("🔧 Selected equipment structure:", selectedEquipment);

    // השתמש בפונקציית המיפוי החדשה
    const equipmentTypes = mapSelectedEquipmentToTypes(selectedEquipment);

    console.log("🔧 Mapped equipment types:", equipmentTypes);
    console.log(
      "🔧 Equipment display names:",
      getEquipmentDisplayNames(equipmentTypes)
    );

    return equipmentTypes;
  }

  /* ------------------- יצירת תוכנית אימון מותאמת ------------------- */
  public generateWorkoutPlan(): WorkoutPlan {
    const filteredExercises = this.filterExercisesByProfile();
    const daysPerWeek = this.getDaysPerWeek();
    const weeklySchedule = this.createWeeklySchedule(
      filteredExercises,
      daysPerWeek
    );

    return {
      id: `plan_${Date.now()}`,
      name: this.generatePlanName(),
      description: this.generatePlanDescription(),
      duration: this.getPlanDuration(),
      daysPerWeek,
      targetFitnessGoal: this.userProfile.fitnessGoal,
      difficultyLevel: this.userProfile.experienceLevel,
      weeklySchedule,
      totalCaloriesPerWeek: this.estimateWeeklyCalories(weeklySchedule),
      progressionNotes: this.generateProgressionNotes(),
      equipmentRequired: this.userProfile.equipment,
      estimatedTimePerSession: this.getSessionDuration(),
      createdAt: new Date(),
    };
  }

  /* -------------------------- סינון תרגילים -------------------------- */
  private filterExercisesByProfile(): Exercise[] {
    console.log("🔍 Filtering exercises by profile...");
    console.log("🔍 User equipment:", this.userProfile.equipment);
    console.log("🔍 User experience level:", this.userProfile.experienceLevel);
    console.log("🔍 Total exercises available:", this.exercises.length);

    const filtered = this.exercises.filter((exercise) => {
      // Experience level filtering
      if (
        this.userProfile.experienceLevel === "beginner" &&
        exercise.difficulty === "advanced"
      ) {
        return false;
      }
      if (
        this.userProfile.experienceLevel === "advanced" &&
        exercise.difficulty === "beginner"
      ) {
        return false;
      }

      // Equipment filtering
      const hasRequiredEquipment =
        this.userProfile.equipment.includes(exercise.equipment) ||
        exercise.equipment === "bodyweight" ||
        exercise.equipment === "none";

      if (hasRequiredEquipment) {
        console.log(
          `✅ Exercise included: ${exercise.name} (${exercise.equipment})`
        );
      }

      return hasRequiredEquipment;
    });

    console.log("🔍 Filtered exercises count:", filtered.length);

    // Group exercises by equipment to show distribution
    const equipmentDistribution: { [key: string]: number } = {};
    filtered.forEach((exercise) => {
      equipmentDistribution[exercise.equipment] =
        (equipmentDistribution[exercise.equipment] || 0) + 1;
    });
    console.log("🔍 Equipment distribution:", equipmentDistribution);

    return filtered;
  }

  /* ---------------------- יצירת לוח שבועי ---------------------- */
  private createWeeklySchedule(
    exercises: Exercise[],
    daysPerWeek: number
  ): DailyWorkout[] {
    const schedule: DailyWorkout[] = [];
    const focusRotation = this.getFocusRotation(daysPerWeek);

    for (let day = 1; day <= daysPerWeek; day++) {
      const focus =
        focusRotation[(day - 1) % focusRotation.length] || "כל הגוף";
      const dayExercises = this.selectExercisesForDay(exercises, focus);

      schedule.push({
        dayNumber: day,
        dayName: this.getDayName(day),
        focus,
        exercises: dayExercises,
        estimatedDuration: this.getSessionDuration(),
        notes: this.generateDayNotes(focus),
      });
    }

    return schedule;
  }

  private getFocusRotation(daysPerWeek: number): string[] {
    if (daysPerWeek >= 6) {
      return [
        "חזה וכתפיים",
        "גב וביצפס",
        "רגליים וישבן",
        "חלק עליון",
        "כל הגוף",
        "קרדיו",
      ];
    } else if (daysPerWeek >= 4) {
      return ["חלק עליון", "רגליים וישבן", "חזה וכתפיים", "גב וביצפס"];
    } else if (daysPerWeek >= 3) {
      return ["חלק עליון", "רגליים וישבן", "כל הגוף"];
    } else if (daysPerWeek === 2) {
      return ["חלק עליון", "רגליים וישבן"];
    } else {
      return ["כל הגוף"];
    }
  }

  private selectExercisesForDay(
    exercises: Exercise[],
    focus: string
  ): WorkoutExercise[] {
    const focusExercises = this.filterExercisesByFocus(exercises, focus);
    const selectedExercises = this.pickExercisesForWorkout(focusExercises);

    return selectedExercises.map((exercise) =>
      this.convertToWorkoutExercise(exercise)
    );
  }

  private filterExercisesByFocus(
    exercises: Exercise[],
    focus: string
  ): Exercise[] {
    const focusMapping: { [key: string]: string[] } = {
      "חזה וכתפיים": ["chest", "shoulders", "triceps"],
      "גב וביצפס": ["back", "biceps"],
      "רגליים וישבן": ["quadriceps", "hamstrings", "glutes", "calves"],
      "ליבה וגמישות": ["core"],
      "כל הגוף": [
        "chest",
        "back",
        "shoulders",
        "quadriceps",
        "hamstrings",
        "glutes",
        "core",
        "triceps",
        "biceps",
      ],
      קרדיו: ["cardio"],
      "חלק עליון": ["chest", "back", "shoulders", "triceps", "biceps"],
      דחיפה: ["chest", "shoulders", "triceps"],
      משיכה: ["back", "biceps"],
    };

    const targetMuscles = focusMapping[focus] || focusMapping["כל הגוף"];
    const userEquipment = this.userProfile.equipment;

    return exercises.filter((exercise) => {
      // First check if user has the required equipment
      const hasEquipment =
        userEquipment.includes(exercise.equipment) ||
        exercise.equipment === "none" ||
        exercise.equipment === "bodyweight" ||
        (userEquipment.includes("bodyweight") &&
          (exercise.equipment === "none" ||
            exercise.equipment === "bodyweight"));

      if (!hasEquipment) {
        console.log(
          `❌ Equipment filter rejected: ${exercise.name} (${exercise.equipment}) - User has: [${userEquipment.join(", ")}]`
        );
        return false;
      } else {
        console.log(
          `✅ Equipment filter passed: ${exercise.name} (${exercise.equipment})`
        );
      }

      // Then check muscle group focus
      if (focus === "קרדיו") return exercise.category === "cardio";

      // For "כל הגוף" - include exercises if user has equipment
      if (focus === "כל הגוף") {
        return true;
      }

      return exercise.primaryMuscles.some((muscle) =>
        targetMuscles?.some((target) =>
          muscle.toLowerCase().includes(target.toLowerCase())
        )
      );
    });
  }

  private pickExercisesForWorkout(exercises: Exercise[]): Exercise[] {
    const exercisesPerWorkout = this.getExercisesPerWorkout();
    console.log(
      `🎯 Selecting ${exercisesPerWorkout} exercises from ${exercises.length} available`
    );

    if (exercises.length === 0) {
      console.log("⚠️ No exercises available for selection!");
      return [];
    }

    // Get user's specific equipment choices (exclude auto-added bodyweight)
    const userEquipment = this.userProfile.equipment;
    const userChosenEquipment = userEquipment.filter(
      (eq) => eq !== "bodyweight"
    );

    console.log("🎯 User chosen equipment:", userChosenEquipment);

    // Prioritize exercises that use equipment the user specifically chose
    const userEquipmentExercises: Exercise[] = [];
    const bodyweightExercises: Exercise[] = [];
    const otherExercises: Exercise[] = [];

    exercises.forEach((exercise) => {
      // Only include exercises if user has the equipment
      if (
        !userEquipment.includes(exercise.equipment) &&
        exercise.equipment !== "bodyweight" &&
        exercise.equipment !== "none"
      ) {
        return; // Skip exercises for equipment user doesn't have
      }

      if (userChosenEquipment.includes(exercise.equipment)) {
        userEquipmentExercises.push(exercise);
      } else if (
        exercise.equipment === "bodyweight" ||
        exercise.equipment === "none"
      ) {
        bodyweightExercises.push(exercise);
      } else {
        otherExercises.push(exercise);
      }
    });

    console.log(
      `🎯 Equipment-based distribution: User equipment: ${userEquipmentExercises.length}, Bodyweight: ${bodyweightExercises.length}, Other: ${otherExercises.length}`
    );

    // Select exercises prioritizing user's chosen equipment
    const selected: Exercise[] = [];

    // First priority: exercises using user's chosen equipment (80% if possible)
    const shuffledUserEquipment = userEquipmentExercises.sort(
      () => Math.random() - 0.5
    );
    const userEquipmentCount = Math.min(
      Math.floor(exercisesPerWorkout * 0.8),
      shuffledUserEquipment.length
    );
    selected.push(...shuffledUserEquipment.slice(0, userEquipmentCount));

    // Fill remaining spots with bodyweight exercises
    if (selected.length < exercisesPerWorkout) {
      const shuffledBodyweight = bodyweightExercises.sort(
        () => Math.random() - 0.5
      );
      const bodyweightCount = Math.min(
        exercisesPerWorkout - selected.length,
        shuffledBodyweight.length
      );
      selected.push(...shuffledBodyweight.slice(0, bodyweightCount));
    }

    // Last resort: other available exercises
    if (selected.length < exercisesPerWorkout) {
      const shuffledOther = otherExercises.sort(() => Math.random() - 0.5);
      const otherCount = Math.min(
        exercisesPerWorkout - selected.length,
        shuffledOther.length
      );
      selected.push(...shuffledOther.slice(0, otherCount));
    }

    console.log(
      `🎯 Final selection:`,
      selected.map((ex) => `${ex.name} (${ex.equipment})`)
    );
    return selected;
  }

  private getExercisesPerWorkout(): number {
    const sessionDuration = this.getSessionDuration();
    const experienceLevel = this.userProfile.experienceLevel;

    console.log(
      `🕒 Session duration: ${sessionDuration} minutes, Experience: ${experienceLevel}`
    );

    // Calculate exercises based on duration and experience
    // Assuming 5-8 minutes per exercise (including rest) for beginners
    // 3-5 minutes per exercise for advanced (faster transitions)

    let timePerExercise: number;
    switch (experienceLevel) {
      case "beginner":
        timePerExercise = 7; // More time for form learning
        break;
      case "intermediate":
        timePerExercise = 5; // Balanced pace
        break;
      case "advanced":
        timePerExercise = 4; // Efficient execution
        break;
      default:
        timePerExercise = 6;
    }

    // Calculate based on time, with minimum and maximum limits
    const calculatedExercises = Math.floor(sessionDuration / timePerExercise);

    // Set reasonable limits
    const minExercises = 3;
    const maxExercises =
      experienceLevel === "advanced"
        ? 10
        : experienceLevel === "intermediate"
          ? 8
          : 6;

    const finalCount = Math.max(
      minExercises,
      Math.min(maxExercises, calculatedExercises)
    );

    console.log(
      `🎯 Time-based calculation: ${calculatedExercises}, Final count: ${finalCount}`
    );

    return finalCount;
  }

  private convertToWorkoutExercise(exercise: Exercise): WorkoutExercise {
    return {
      id: exercise.id,
      name: exercise.name,
      nameLocalized: exercise.nameLocalized,
      sets: this.calculateSets(exercise),
      reps: this.calculateReps(exercise),
      restTime: this.calculateRestTime(exercise),
      targetMuscles: exercise.primaryMuscles,
      difficulty: exercise.difficulty,
      equipment: exercise.equipment,
    };
  }

  private calculateSets(_exercise: Exercise): number {
    const baseSets = 3;
    if (this.userProfile.experienceLevel === "beginner") return baseSets - 1;
    if (this.userProfile.experienceLevel === "advanced") return baseSets + 1;
    return baseSets;
  }

  private calculateReps(exercise: Exercise): string {
    if (exercise.category === "cardio") {
      return this.userProfile.experienceLevel === "beginner"
        ? "20-30 שניות"
        : "30-45 שניות";
    }

    const goalMapping: { [key: string]: string } = {
      muscle_building: "8-12",
      strength: "4-6",
      endurance: "12-20",
      weight_loss: "10-15",
      general_fitness: "8-15",
    };

    return goalMapping[this.userProfile.fitnessGoal] || "8-12";
  }

  private calculateRestTime(exercise: Exercise): number {
    if (exercise.category === "cardio") return 30;
    if (exercise.difficulty === "advanced") return 90;
    if (exercise.difficulty === "beginner") return 45;
    return 60;
  }

  /* ---------------------- מטא נתונים לתוכנית ---------------------- */
  private generatePlanName(): string {
    const goalNames: { [key: string]: string } = {
      muscle_building: "תוכנית בניית שריר",
      strength: "תוכנית חיזוק כוח",
      endurance: "תוכנית סיבולת",
      weight_loss: "תוכנית ירידה במשקל",
      general_fitness: "תוכנית כושר כללי",
    };

    const baseName =
      goalNames[this.userProfile.fitnessGoal] || "תוכנית אימון אישית";
    const level =
      this.userProfile.experienceLevel === "beginner"
        ? "למתחילים"
        : this.userProfile.experienceLevel === "advanced"
          ? "למתקדמים"
          : "לרמה בינונית";

    return `${baseName} ${level}`;
  }

  private generatePlanDescription(): string {
    const daysPerWeek = this.getDaysPerWeek();
    const duration = this.getSessionDuration();
    return `תוכנית אימון מותאמת אישית ל${daysPerWeek} ימים בשבוע, ${duration} דקות לאימון. מיועדת למטרת ${this.userProfile.fitnessGoal} ברמת ${this.userProfile.experienceLevel}.`;
  }

  private getPlanDuration(): number {
    switch (this.userProfile.experienceLevel) {
      case "beginner":
        return 8;
      case "intermediate":
        return 12;
      case "advanced":
        return 16;
      default:
        return 10;
    }
  }

  private getSessionDuration(): number {
    const duration = this.userProfile.sessionDuration;
    if (duration.includes("30")) return 30;
    if (duration.includes("45")) return 45;
    if (duration.includes("60")) return 60;
    if (duration.includes("90")) return 90;

    switch (this.userProfile.experienceLevel) {
      case "beginner":
        return 30;
      case "intermediate":
        return 45;
      case "advanced":
        return 60;
      default:
        return 45;
    }
  }

  private estimateWeeklyCalories(schedule: DailyWorkout[]): number {
    const caloriesPerMinute = 8;
    return schedule.reduce(
      (total, day) => total + day.estimatedDuration * caloriesPerMinute,
      0
    );
  }

  private generateProgressionNotes(): string[] {
    return [
      "שבוע 1-2: התמקדות בטכניקה נכונה ולמידת התנועות",
      "שבוע 3-4: הגדלת משקולות והוספת חזרות",
      "שבוע 5-6: הגברת עומס והוספת תרגילים מתקדמים",
      "שבוע 7-8: מבחן מחדש של יכולות ועדכון התוכנית",
    ];
  }

  private getDayName(dayNumber: number): string {
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return `יום ${days[(dayNumber - 1) % 7]}`;
  }

  private generateDayNotes(focus: string): string {
    const notes: { [key: string]: string } = {
      "חזה וכתפיים": "התמקדות בתנועות דחיפה ופיתוח החלק העליון",
      "גב וביצפס": "תרגילי משיכה לחיזוק הגב והזרועות",
      "רגליים וישבן": "פיתוח כוח וסיבולת בחלק התחתון",
      "ליבה וגמישות": "חיזוק שרירי הליבה ושיפור הגמישות",
      "כל הגוף": "אימון מקיף לכל הגוף",
      קרדיו: "שיפור יכולת לב ריאה ושריפת קלוריות",
    };
    return notes[focus] || "אימון איכותי ומותאם אישית";
  }

  /* -------------------------- עזרי פרופיל -------------------------- */
  private getDaysPerWeek(): number {
    const availability = this.userProfile.availabilityDays.toLowerCase();
    if (availability.includes("7") || availability.includes("daily")) return 7;
    if (availability.includes("6")) return 6;
    if (availability.includes("5")) return 5;
    if (availability.includes("4")) return 4;
    if (availability.includes("3")) return 3;
    if (availability.includes("2")) return 2;
    if (availability.includes("1")) return 1;

    switch (this.userProfile.experienceLevel) {
      case "beginner":
        return 3;
      case "intermediate":
        return 4;
      case "advanced":
        return 5;
      default:
        return 3;
    }
  }

  public getUserProfile(): WorkoutProfile {
    return this.userProfile;
  }

  public updateUserProfile(updates: Partial<WorkoutProfile>): void {
    this.userProfile = { ...this.userProfile, ...updates };
  }
}
