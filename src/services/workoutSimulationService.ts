/**
 * @file src/services/workoutSimulationService.ts
 * @brief ✅ שירות סימולציה מציאותי - נקי מקוד דמו
 * @description מדמה ביצוע אימונים אמיתיים עם נתונים של משתמשים אמיתיים
 * @updated 2025-08-10 הוסרה תלות בשירותי דמו - עבודה עם נתונים אמיתיים בלבד
 * @compatible validateWorkoutData, formatDateHebrewLocal, WorkoutWithFeedback
 */

// ✅ הסרת import של demo service
import {
  WorkoutData,
  WorkoutWithFeedback,
  Exercise,
  Set,
} from "../screens/workout/types/workout.types";
import {
  adaptExerciseNameToGender,
  generateSingleGenderAdaptedNote,
  generateGenderAdaptedCongratulation,
  UserGender,
} from "../utils/genderAdaptation";
import {
  getPersonalizedRestTimes,
  getPersonalizedStartingWeights,
} from "../screens/workout/utils/workoutConstants";
import {
  PersonalData,
  createRealisticPersonalData,
  calculatePersonalizedCalories,
  extractMidValueFromRange,
  getAgeMetabolismFactor,
} from "../utils/personalDataUtils";

// קבועים מותאמים להיסטוריה
const SIMULATION_CONSTANTS = {
  WEEKS_TO_SIMULATE: 26, // 6 חודשים
  MIN_WORKOUTS_PER_WEEK: 2,
  MAX_WORKOUTS_PER_WEEK: 5,
  MIN_DURATION_MINUTES: 30,
  MAX_DURATION_MINUTES: 90,
  BASE_START_HOUR: 17, // 17:00-22:00
  MAX_START_HOUR_RANGE: 5,
  COMPLETION_RATE: 0.85, // 85% השלמה
  PERSONAL_RECORD_CHANCE: 0.15, // 15% סיכוי לשיא
  // 💡 קבועים חדשים לשיפור הסימולציה
  PROGRESSIVE_OVERLOAD_FACTOR: 1.01, // עלייה של 1% במשקל כל שבוע
  MOTIVATION_PR_BOOST: 0.5,
  MOTIVATION_MISS_PENALTY: 0.2,
  SET_TIME_BASE: 45, // 45 שניות בסיס לסט
  SET_TIME_VARIANCE: 30, // תוספת של עד 30 שניות
} as const;

interface SimulationParameters {
  userGender: UserGender;
  experience: "beginner" | "intermediate" | "advanced";
  availableDays: number;
  sessionDuration: string;
  equipment: string[];
  currentWeek: number;
  motivation: number; // 1-10
  baseStrength: number; // Base strength multiplier for progressive overload
  personalData?: PersonalData; // Add personal data support
}

class WorkoutSimulationService {
  /**
   * יצירת נתונים אישיים מותאמים לסימולציה
   */
  private createPersonalDataFromDemo(
    gender: UserGender,
    experience: "beginner" | "intermediate" | "advanced"
  ): PersonalData {
    return createRealisticPersonalData(gender, experience);
  }

  /**
   * סימולציה מלאה של היסטוריית אימונים תואמת למסך ההיסטוריה
   */
  /**
   * סימולציה מלאה של היסטוריית אימונים תואמת למסך ההיסטוריה
   */
  async simulateHistoryCompatibleWorkouts(
    gender: UserGender,
    experience: "beginner" | "intermediate" | "advanced",
    userEquipment?: string[]
  ): Promise<WorkoutWithFeedback[]> {
    // Create personal data for simulation
    const personalData = this.createPersonalDataFromDemo(gender, experience);

    const params: SimulationParameters = {
      userGender: gender,
      experience,
      availableDays: 4,
      sessionDuration: "60 דקות",
      equipment: userEquipment || this.getDefaultEquipment(experience),
      currentWeek: 0,
      motivation: 7, // התחלה עם מוטיבציה טובה
      baseStrength: this.getBaseStrength(experience),
      personalData: personalData, // Add personal data to params
    };

    const workouts: WorkoutWithFeedback[] = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6); // 6 חודשים אחורה

    // וידוא שתאריך ההתחלה תקין
    if (isNaN(startDate.getTime())) {
      console.error("❌ Invalid start date for simulation");
      return [];
    }

    // סימולציה של 26 שבועות
    for (let week = 0; week < SIMULATION_CONSTANTS.WEEKS_TO_SIMULATE; week++) {
      params.currentWeek = week;

      // עדכון מוטיבציה לפי התקדמות
      params.motivation = this.calculateWeeklyMotivation(
        week,
        params.motivation
      );

      const weeklyWorkouts = await this.simulateWeeklyWorkouts(
        startDate,
        week,
        params
      );

      workouts.push(...weeklyWorkouts);
    }

    // מיון לפי תאריך (מהחדש לישן) - תואם להיסטוריה
    workouts.sort((a, b) => {
      const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
      return bTime - aTime;
    });

    console.warn(`✅ Simulated ${workouts.length} history-compatible workouts`);
    return workouts;
  }

  /**
   * סימולציה של אימונים שבועיים
   */
  private async simulateWeeklyWorkouts(
    startDate: Date,
    weekNumber: number,
    params: SimulationParameters
  ): Promise<WorkoutWithFeedback[]> {
    const workouts: WorkoutWithFeedback[] = [];

    // קביעת מספר אימונים בשבוע
    const baseWorkouts = Math.min(
      params.availableDays,
      this.getExpectedWorkoutsPerWeek(params.experience)
    );
    const actualWorkouts = this.calculateActualWorkouts(
      baseWorkouts,
      params.motivation
    );

    // 💡 עדכון מוטיבציה על בסיס אימונים שבוצעו מול מתוכננים
    if (actualWorkouts < baseWorkouts) {
      params.motivation -=
        (baseWorkouts - actualWorkouts) *
        SIMULATION_CONSTANTS.MOTIVATION_MISS_PENALTY;
    }

    // יצירת ימי אימון מפוזרים בשבוע
    const workoutDays = this.generateWorkoutDays(actualWorkouts);

    for (const dayOffset of workoutDays) {
      const workoutDate = new Date(
        startDate.getTime() + (weekNumber * 7 + dayOffset) * 24 * 60 * 60 * 1000
      );

      // וידוא שהתאריך תקין
      if (isNaN(workoutDate.getTime()) || workoutDate.getTime() <= 0) {
        console.warn(
          `⚠️ Skipping invalid date for week ${weekNumber}, day ${dayOffset}`
        );
        continue;
      }

      // יצירת אימון תואם להיסטוריה
      const workout = this.createSimulatedWorkout(workoutDate, params);
      workouts.push(workout);
    }

    return workouts;
  }

  /**
   * יצירת אימון בודד תואם למסך ההיסטוריה
   */
  private createSimulatedWorkout(
    date: Date,
    params: SimulationParameters
  ): WorkoutWithFeedback {
    const workoutId = `sim_${date.getTime()}_${Math.random().toString(36).substr(2, 9)}`;

    // יצירת זמני אימון מציאותיים
    const { startTime, endTime, durationSeconds } =
      this.generateRealisticTiming(date, params);

    // יצירת תרגילים מותאמים
    const exercises = this.generateSimulatedExercises(params);

    // יצירת WorkoutData תואם
    const workoutData: WorkoutData = {
      id: workoutId,
      name: this.generateSimulatedWorkoutName(params),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: durationSeconds,
      exercises: exercises,
      totalVolume: this.calculateSimulatedVolume(exercises),
    };

    // יצירת פידבק תואם (עובר validateWorkoutData)
    const feedback = this.generateSimulatedFeedback(endTime, params, exercises);

    // יצירת סטטיסטיקות תואמות
    const stats = this.generateSimulatedStats(
      exercises,
      durationSeconds,
      params
    );

    // יצירת מטא-דאטה תואמת
    const metadata = this.generateSimulatedMetadata(params);

    return {
      id: workoutId,
      workout: workoutData,
      feedback: feedback,
      stats: stats,
      metadata: metadata,
    };
  }

  /**
   * יצירת זמני אימון מציאותיים
   */
  private generateRealisticTiming(date: Date, params: SimulationParameters) {
    // שעת התחלה מציאותית
    const startHour =
      SIMULATION_CONSTANTS.BASE_START_HOUR +
      Math.floor(Math.random() * SIMULATION_CONSTANTS.MAX_START_HOUR_RANGE);
    const startMinute = Math.floor(Math.random() * 60);

    const startTime = new Date(date);
    startTime.setHours(startHour, startMinute, 0, 0);

    // משך אימון מבוסס על העדפות
    const baseDuration = this.parseDurationFromString(params.sessionDuration);
    const variance = Math.floor(Math.random() * 20) - 10; // ±10 דקות
    const actualDuration = Math.max(
      SIMULATION_CONSTANTS.MIN_DURATION_MINUTES,
      Math.min(
        SIMULATION_CONSTANTS.MAX_DURATION_MINUTES,
        baseDuration + variance
      )
    );

    const durationSeconds = actualDuration * 60;
    const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

    return { startTime, endTime, durationSeconds };
  }

  /**
   * יצירת תרגילים מותאמי סימולציה
   */
  private generateSimulatedExercises(params: SimulationParameters): Exercise[] {
    const exercises: Exercise[] = [];
    const numExercises = this.getExerciseCount(
      params.experience,
      params.sessionDuration
    );

    const exercisePool = this.getExercisePool(params.equipment);

    for (let i = 0; i < numExercises; i++) {
      const exerciseName =
        exercisePool[Math.floor(Math.random() * exercisePool.length)];
      const adaptedName = adaptExerciseNameToGender(
        exerciseName,
        params.userGender
      );

      const exercise: Exercise = {
        id: `sim_exercise_${Date.now()}_${i}`,
        name: adaptedName,
        category: this.getExerciseCategory(exerciseName),
        primaryMuscles: this.getPrimaryMuscles(exerciseName),
        secondaryMuscles: this.getSecondaryMuscles(exerciseName),
        equipment: this.getRequiredEquipment(exerciseName),
        sets: this.generateSimulatedSets(params),
        restTime: this.getRestTime(params.experience),
        notes:
          Math.random() > 0.8
            ? generateSingleGenderAdaptedNote(params.userGender, 3)
            : undefined,
      };

      exercises.push(exercise);
    }

    return exercises;
  }

  /**
   * יצירת סטים מציאותיים
   */
  private generateSimulatedSets(params: SimulationParameters): Set[] {
    const numSets = this.getSetCount(params.experience);
    const sets: Set[] = [];

    for (let i = 0; i < numSets; i++) {
      const targetReps = this.getTargetReps(params.experience);
      const targetWeight = this.getPersonalizedTargetWeight(params);
      const willComplete = Math.random() < SIMULATION_CONSTANTS.COMPLETION_RATE;
      const isPR =
        willComplete &&
        Math.random() < SIMULATION_CONSTANTS.PERSONAL_RECORD_CHANCE;

      // 💡 עדכון מוטיבציה אם יש שיא אישי
      if (isPR) {
        params.motivation = Math.min(
          10,
          params.motivation + SIMULATION_CONSTANTS.MOTIVATION_PR_BOOST
        );
      }

      const set: Set = {
        id: `sim_set_${Date.now()}_${i}`,
        type: i === 0 ? "warmup" : "working",
        targetReps: targetReps,
        targetWeight: targetWeight,
        actualReps: willComplete
          ? this.simulateActualReps(targetReps)
          : undefined,
        actualWeight: willComplete
          ? this.simulateActualWeight(targetWeight)
          : undefined,
        completed: willComplete,
        restTime: this.getPersonalizedRestTime(params),
        isPR: isPR,
        rpe: willComplete ? Math.floor(Math.random() * 4) + 6 : undefined, // 6-9 RPE
        timeToComplete: willComplete
          ? Math.floor(Math.random() * 60) + 30
          : undefined, // 30-90 seconds
      };

      sets.push(set);
    }

    return sets;
  }

  /**
   * יצירת פידבק מציאותי תואם להיסטוריה
   */
  private generateSimulatedFeedback(
    completedAt: Date,
    params: SimulationParameters,
    exercises: Exercise[]
  ) {
    const difficulty = this.calculateDifficulty(params.experience, exercises);
    const feeling = this.getRandomFeeling(params.motivation);
    const personalRecords = exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((set) => set.isPR).length,
      0
    );

    return {
      completedAt: completedAt.toISOString(), // תואם formatDateHebrewLocal
      difficulty: difficulty, // 1-5 תואם getDifficultyStars
      feeling: feeling, // emoji תואם getFeelingEmoji
      readyForMore: Math.random() > 0.4, // 60% סיכוי
      genderAdaptedNotes: generateSingleGenderAdaptedNote(
        params.userGender,
        difficulty
      ),
      congratulationMessage:
        personalRecords > 0
          ? generateGenderAdaptedCongratulation(
              params.userGender,
              personalRecords
            )
          : undefined,
    };
  }

  /**
   * יצירת סטטיסטיקות תואמות
   */
  private generateSimulatedStats(
    exercises: Exercise[],
    durationSeconds: number,
    params: SimulationParameters
  ) {
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((set) => set.completed).length,
      0
    );
    const personalRecords = exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((set) => set.isPR).length,
      0
    );
    const totalVolume = this.calculateSimulatedVolume(exercises);

    // Calculate personalized calories using central utility
    const durationMinutes = Math.round(durationSeconds / 60);
    const estimatedCalories = calculatePersonalizedCalories(
      durationMinutes,
      params.personalData
    );

    return {
      duration: durationSeconds,
      totalSets: completedSets,
      totalPlannedSets: totalSets,
      totalVolume: totalVolume,
      personalRecords: personalRecords,
      estimatedCalories: estimatedCalories, // Add personalized calories
    };
  }

  /**
   * יצירת מטא-דאטה תואמת
   */
  private generateSimulatedMetadata(params: SimulationParameters) {
    return {
      userGender: params.userGender,
      deviceInfo: {
        platform: "ios" as const,
        screenWidth: 375,
        screenHeight: 667,
      },
      version: "simulation-v2.0",
      workoutSource: "demo" as const, // תואם לערכים המותרים
    };
  }

  // פונקציות עזר

  private getBaseStrength(experience: string): number {
    switch (experience) {
      case "beginner":
        return 1.0;
      case "intermediate":
        return 1.3;
      case "advanced":
        return 1.6;
      default:
        return 1.0;
    }
  }

  private calculateWeeklyMotivation(
    week: number,
    currentMotivation: number
  ): number {
    // ירידה טבעית במוטיבציה עם זמן
    const baseDecline = week * 0.05;
    // התאוששות כל 8 שבועות
    const cycleBoost = week % 8 === 0 ? 1 : 0;

    const newMotivation = currentMotivation - baseDecline + cycleBoost;
    return Math.max(3, Math.min(10, newMotivation)); // בין 3-10
  }

  private getExpectedWorkoutsPerWeek(experience: string): number {
    switch (experience) {
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

  private calculateActualWorkouts(
    baseWorkouts: number,
    motivation: number
  ): number {
    const motivationFactor = motivation / 10;
    const actual = Math.round(baseWorkouts * motivationFactor);
    return Math.max(1, Math.min(6, actual));
  }

  private generateWorkoutDays(numWorkouts: number): number[] {
    const days: number[] = [];
    const availableDays = [0, 1, 2, 3, 4, 5, 6]; // ימי השבוע

    for (let i = 0; i < numWorkouts && availableDays.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableDays.length);
      days.push(availableDays.splice(randomIndex, 1)[0]);
    }

    return days.sort((a, b) => a - b);
  }

  private parseDurationFromString(duration: string): number {
    switch (duration) {
      case "30min":
        return 30;
      case "45min":
        return 45;
      case "60min":
        return 60;
      case "90min":
        return 90;
      default:
        return 60;
    }
  }

  /**
   * חישוב משקל אימון מותאם אישית
   */
  private getPersonalizedTargetWeight(params: SimulationParameters): number {
    if (!params.personalData) {
      return this.getTargetWeight(params.experience, params);
    }

    // Use personalized starting weights - take average of main exercises
    const personalizedWeights = getPersonalizedStartingWeights(
      params.personalData
    );
    const avgWeight =
      (personalizedWeights.squat +
        personalizedWeights.benchPress +
        personalizedWeights.row) /
      3;

    // Apply progression multiplier
    const progressMultiplier = 1 + params.currentWeek * 0.02;

    // Apply experience modifier
    const experienceMultiplier = this.getBaseStrength(params.experience);

    return Math.round(avgWeight * progressMultiplier * experienceMultiplier);
  }

  /**
   * חישוב זמן מנוחה מותאם אישית
   */
  private getPersonalizedRestTime(params: SimulationParameters): number {
    if (!params.personalData) {
      return this.getRestTime(params.experience);
    }

    // Use personalized rest times - use compound exercise rest time as base
    const personalizedRest = getPersonalizedRestTimes(params.personalData);

    // Add some variance (±15 seconds)
    const variance = Math.floor(Math.random() * 30) - 15;

    return Math.max(30, personalizedRest.compound + variance);
  }

  private getExerciseCount(experience: string, duration: string): number {
    const baseDuration = this.parseDurationFromString(duration);
    const exercisesPerHour =
      experience === "beginner" ? 6 : experience === "intermediate" ? 8 : 10;
    return Math.round((baseDuration / 60) * exercisesPerHour);
  }

  private getExercisePool(equipment: string[]): string[] {
    const allExercises = [
      "Push-ups",
      "Squats",
      "Planks",
      "Lunges",
      "Burpees", // bodyweight
      "Bench Press",
      "Deadlift",
      "Rows",
      "Overhead Press", // barbell
      "Dumbbell Press",
      "Dumbbell Rows",
      "Dumbbell Curls", // dumbbells
      "Pull-ups",
      "Dips",
      "Chin-ups", // bodyweight/bar
    ];

    // פילטור לפי ציוד זמין
    return allExercises.filter((exercise) => {
      const requiredEquipment = this.getRequiredEquipment(exercise);
      return (
        requiredEquipment === "none" || equipment.includes(requiredEquipment)
      );
    });
  }

  private getSetCount(experience: string): number {
    switch (experience) {
      case "beginner":
        return 3 + Math.floor(Math.random() * 2); // 3-4
      case "intermediate":
        return 4 + Math.floor(Math.random() * 2); // 4-5
      case "advanced":
        return 5 + Math.floor(Math.random() * 2); // 5-6
      default:
        return 3;
    }
  }

  private getTargetReps(experience: string): number {
    switch (experience) {
      case "beginner":
        return 8 + Math.floor(Math.random() * 5); // 8-12
      case "intermediate":
        return 6 + Math.floor(Math.random() * 7); // 6-12
      case "advanced":
        return 4 + Math.floor(Math.random() * 9); // 4-12
      default:
        return 10;
    }
  }

  private getTargetWeight(
    experience: string,
    params: SimulationParameters
  ): number {
    const baseWeight = this.getBaseWeight(experience);
    const progressMultiplier = 1 + params.currentWeek * 0.02; // 2% increase per week
    return Math.round(baseWeight * params.baseStrength * progressMultiplier);
  }

  private getBaseWeight(experience: string): number {
    switch (experience) {
      case "beginner":
        return 10 + Math.floor(Math.random() * 20); // 10-30 ק"ג
      case "intermediate":
        return 20 + Math.floor(Math.random() * 40); // 20-60 ק"ג
      case "advanced":
        return 40 + Math.floor(Math.random() * 60); // 40-100 ק"ג
      default:
        return 20;
    }
  }

  private getRestTime(experience: string): number {
    switch (experience) {
      case "beginner":
        return 60 + Math.floor(Math.random() * 60); // 60-120 שניות
      case "intermediate":
        return 90 + Math.floor(Math.random() * 60); // 90-150 שניות
      case "advanced":
        return 120 + Math.floor(Math.random() * 60); // 120-180 שניות
      default:
        return 90;
    }
  }

  private simulateActualReps(targetReps: number): number {
    const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
    return Math.max(1, targetReps + variance);
  }

  private simulateActualWeight(targetWeight: number): number {
    const variance = Math.floor(Math.random() * 6) - 2.5; // ±2.5 ק"ג
    return Math.max(5, Math.round(targetWeight + variance));
  }

  private calculateDifficulty(
    experience: string,
    exercises: Exercise[]
  ): number {
    const baseRPE =
      exercises.reduce((sum, ex) => {
        const avgRPE =
          ex.sets.reduce((setSum, set) => setSum + (set.rpe || 6), 0) /
          ex.sets.length;
        return sum + avgRPE;
      }, 0) / exercises.length;

    // המרה מ-RPE (6-9) לקושי (1-5)
    return Math.round(((baseRPE - 6) / 3) * 4 + 1);
  }

  private getRandomFeeling(motivation: number): string {
    const feelings = ["😄", "😊", "😐", "😞", "💪", "😴", "🔥"];

    // הרגשה מושפעת ממוטיבציה
    if (motivation >= 8) return feelings[Math.floor(Math.random() * 3)]; // 😄, 😊, 😐
    if (motivation >= 6) return feelings[2 + Math.floor(Math.random() * 3)]; // 😐, 😞, 💪
    return feelings[3 + Math.floor(Math.random() * 3)]; // 😞, 💪, 😴
  }

  private calculateSimulatedVolume(exercises: Exercise[]): number {
    return exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
        if (set.completed && set.actualReps && set.actualWeight) {
          return setTotal + set.actualReps * set.actualWeight;
        }
        return setTotal;
      }, 0);
      return total + exerciseVolume;
    }, 0);
  }

  private generateSimulatedWorkoutName(_params: SimulationParameters): string {
    const workoutTypes = [
      "אימון כוח עליון",
      "אימון כוח תחתון",
      "אימון גוף מלא",
      "אימון קרדיו",
      "אימון HIIT",
      "אימון יסוד",
      "אימון כוח וסיבולת",
    ];
    return workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
  }

  // פונקציות עזר לקטגוריות תרגילים (זהות לrealisticDemoService)
  private getExerciseCategory(exerciseName: string): string {
    const categories: Record<string, string> = {
      "Bench Press": "chest",
      Squats: "legs",
      Deadlift: "back",
      "Pull-ups": "back",
      "Push-ups": "chest",
      "Overhead Press": "shoulders",
      Rows: "back",
      Dips: "chest",
      Lunges: "legs",
      Planks: "core",
      "Dumbbell Press": "chest",
      "Dumbbell Rows": "back",
      "Dumbbell Curls": "arms",
      Burpees: "cardio",
      "Chin-ups": "back",
    };
    return categories[exerciseName] || "other";
  }

  private getPrimaryMuscles(exerciseName: string): string[] {
    const muscles: Record<string, string[]> = {
      "Bench Press": ["chest"],
      Squats: ["quadriceps", "glutes"],
      Deadlift: ["hamstrings", "glutes", "back"],
      "Pull-ups": ["back", "biceps"],
      "Push-ups": ["chest", "triceps"],
      "Overhead Press": ["shoulders"],
      Rows: ["back"],
      Dips: ["chest", "triceps"],
      Lunges: ["quadriceps", "glutes"],
      Planks: ["core"],
      "Dumbbell Press": ["chest"],
      "Dumbbell Rows": ["back"],
      "Dumbbell Curls": ["biceps"],
      Burpees: ["full_body"],
      "Chin-ups": ["back", "biceps"],
    };
    return muscles[exerciseName] || ["other"];
  }

  private getSecondaryMuscles(exerciseName: string): string[] {
    const muscles: Record<string, string[]> = {
      "Bench Press": ["triceps", "shoulders"],
      Squats: ["calves", "core"],
      Deadlift: ["traps", "core"],
      "Pull-ups": ["forearms"],
      "Push-ups": ["shoulders", "core"],
      "Overhead Press": ["triceps", "core"],
      Rows: ["biceps"],
      Dips: ["shoulders"],
      Lunges: ["calves", "core"],
      Planks: ["shoulders"],
      "Dumbbell Press": ["triceps"],
      "Dumbbell Rows": ["biceps"],
      "Dumbbell Curls": ["forearms"],
      Burpees: ["cardio"],
      "Chin-ups": ["forearms"],
    };
    return muscles[exerciseName] || [];
  }

  private getRequiredEquipment(exerciseName: string): string {
    const equipment: Record<string, string> = {
      "Bench Press": "barbell",
      Squats: "barbell",
      Deadlift: "barbell",
      "Pull-ups": "pullup_bar",
      "Push-ups": "none",
      "Overhead Press": "barbell",
      Rows: "barbell",
      Dips: "none",
      Lunges: "none",
      Planks: "none",
      "Dumbbell Press": "dumbbells",
      "Dumbbell Rows": "dumbbells",
      "Dumbbell Curls": "dumbbells",
      Burpees: "none",
      "Chin-ups": "pullup_bar",
    };
    return equipment[exerciseName] || "none";
  }

  /**
   * ✅ החזרת ציוד דיפולטיבי לפי רמת ניסיון (ללא תלות בדמו)
   */
  private getDefaultEquipment(
    experience: "beginner" | "intermediate" | "advanced"
  ): string[] {
    switch (experience) {
      case "beginner":
        return ["none"]; // מתחילים עם תרגילי משקל גוף
      case "intermediate":
        return ["none", "dumbbells"]; // הוספת משקולות
      case "advanced":
        return ["none", "dumbbells", "barbell", "cable_machine"]; // ציוד מתקדם
      default:
        return ["none"];
    }
  }

  /**
   * ⚠️ DEPRECATED: פונקציה זו הוסרה כי הייתה תלויה בשירותי דמו
   * עבור יצירת היסטוריה מציאותית, השתמש ב-simulateHistoryCompatibleWorkouts ישירות
   */
  async simulateRealisticWorkoutHistory(): Promise<WorkoutWithFeedback[]> {
    console.warn(
      "⚠️ simulateRealisticWorkoutHistory deprecated - use simulateHistoryCompatibleWorkouts with real user data"
    );

    // החזרת מערך ריק במקום תלות בדמו
    return [];
  }
}

export const workoutSimulationService = new WorkoutSimulationService();
export default workoutSimulationService;
