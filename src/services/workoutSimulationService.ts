/**
 * @file src/services/workoutSimulationService.ts
 * @brief סימולציה של ביצוע אימונים מציאותיים עם וריאציות והתקדמות
 * @description מדמה איך משתמש אמיתי מבצע אימונים - עם דילוגים, עייפות, שיפורים
 * @updated 2025-08-05 שיפורים כלליים והסרת כפילויות קוד
 */

import {
  realisticDemoService,
  WorkoutSession,
  WorkoutExercise,
  RealisticExerciseSet,
  WorkoutFeedback,
} from "./realisticDemoService";
import {
  adaptExerciseNameToGender,
  generateSingleGenderAdaptedNote,
  UserGender,
} from "../utils/genderAdaptation";
// יבוא המבנה החדש של התרגילים
import {
  getBodyweightExercises,
  getDumbbellExercises,
  getCardioExercises,
  getFlexibilityExercises,
  getExercisesByCategory,
  getExercisesByEquipment,
} from "../data/exercises/index";

// קבועים למניעת magic numbers
const SIMULATION_CONSTANTS = {
  WEEKS_TO_SIMULATE: 26, // 6 חודשים
  BREAK_WEEKS: [7, 15] as const, // הפסקות כל 8 שבועות
  SKIP_EXERCISE_PROBABILITY: 0.05,
  SKIP_SET_PROBABILITY: 0.03,
  EQUIPMENT_ISSUE_PROBABILITY: 0.05,
  DEFAULT_PROBABILITY: 0.8,
  WARMUP_TIME: 10, // דקות חימום
  COOLDOWN_TIME: 5, // דקות קירור
  PERFORMANCE_VARIATION: 0.2, // ±10% וריאציה
} as const;

interface SimulationParameters {
  userExperience: "beginner" | "intermediate" | "advanced";
  motivation: number; // 1-10
  availableTime: number; // דקות
  energyLevel: number; // 1-10
  equipmentAvailable: string[];
  currentStreak: number;
  gender?: UserGender;
  personalizedGoals?: string[];
}

class WorkoutSimulationService {
  /**
   * סימולציה של 6 חודשי אימונים מציאותיים
   */
  async simulateRealisticWorkoutHistory(): Promise<void> {
    const user = await realisticDemoService.getDemoUser();
    if (!user) {
      console.error("No demo user found for workout simulation");
      return;
    }

    // פרמטרי סימולציה ראשוניים
    let currentParams: SimulationParameters = {
      userExperience: user.questionnaireData.fitness_experience,
      motivation: 7,
      availableTime: this.parseSessionDuration(
        user.questionnaireData.session_duration
      ),
      energyLevel: 7,
      equipmentAvailable: user.questionnaireData.available_equipment,
      currentStreak: 0,
      gender: user.questionnaireData.gender || "other",
      personalizedGoals: user.questionnaireData.goals || [],
    };

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    // וידוא שתאריך ההתחלה תקין
    if (isNaN(startDate.getTime())) {
      console.error("❌ Invalid start date calculation");
      return;
    }

    console.log(
      `📅 Starting simulation from: ${startDate.toISOString().split("T")[0]}`
    );

    let totalWorkouts = 0;
    let missedWorkouts = 0;

    // סימולציה של 26 שבועות (6 חודשים)
    for (let week = 0; week < SIMULATION_CONSTANTS.WEEKS_TO_SIMULATE; week++) {
      currentParams = this.updateSimulationParameters(
        currentParams,
        week,
        totalWorkouts
      );

      const availableDays = user.questionnaireData.available_days || 3;
      const weeklyWorkouts = await this.simulateWeeklyWorkouts(
        startDate,
        week,
        currentParams,
        availableDays
      );

      totalWorkouts += weeklyWorkouts.completed;
      missedWorkouts += weeklyWorkouts.missed;

      // עדכון רצף
      currentParams.currentStreak =
        weeklyWorkouts.completed > 0
          ? currentParams.currentStreak + weeklyWorkouts.completed
          : 0;

      // הפסקה קצרה כל 8 שבועות
      if (week === 7 || week === 15) {
        currentParams.motivation = Math.max(currentParams.motivation - 1, 4);
        currentParams.energyLevel = Math.max(currentParams.energyLevel - 1, 5);
      }
    }

    const completionRate = Math.round(
      (totalWorkouts / (totalWorkouts + missedWorkouts)) * 100
    );
    console.log(
      `✅ Workout simulation completed: ${totalWorkouts} workouts (${completionRate}% completion rate)`
    );
  }

  /**
   * סימולציה של אימונים שבועיים
   */
  private async simulateWeeklyWorkouts(
    startDate: Date,
    weekNumber: number,
    params: SimulationParameters,
    plannedDays: number
  ): Promise<{ completed: number; missed: number }> {
    let completed = 0;
    let missed = 0;

    // קביעת ימי אימון בשבוע (עם וריאציות)
    const actualDays = this.determineActualWorkoutDays(plannedDays, params);

    for (let dayIndex = 0; dayIndex < actualDays.length; dayIndex++) {
      // יצירת תאריך בטוח עם validate
      const workoutDate = new Date(startDate.getTime());
      const daysToAdd = weekNumber * 7 + actualDays[dayIndex];

      // בדיקה שהתאריך תקין
      if (daysToAdd < 0 || daysToAdd > 365 * 2) {
        console.warn(
          `⚠️ Invalid date calculation: ${daysToAdd} days from start`
        );
        continue;
      }

      workoutDate.setDate(workoutDate.getDate() + daysToAdd);

      // וידוא שהתאריך תקין
      if (isNaN(workoutDate.getTime())) {
        console.warn(
          `⚠️ Invalid date created for week ${weekNumber}, day ${dayIndex}`
        );
        continue;
      }

      // החלטה אם לבצע את האימון
      const willWorkout = this.decideToWorkout(params);

      if (willWorkout) {
        // סימולציה של אימון מציאותי
        const workout = await this.simulateRealisticWorkout(
          workoutDate,
          params,
          weekNumber
        );
        await realisticDemoService.addWorkoutSession(workout);
        completed++;
      } else {
        missed++;
      }
    }

    return { completed, missed };
  }

  /**
   * סימולציה של אימון בודד מציאותי
   */
  private async simulateRealisticWorkout(
    date: Date,
    params: SimulationParameters,
    weekNumber: number
  ): Promise<WorkoutSession> {
    // בחירת סוג אימון
    const workoutType = this.selectWorkoutType(params);

    // יצירת תרגילים לאימון
    const plannedExercises = this.generateWorkoutExercises(workoutType, params);

    // סימולציה של ביצוע בפועל
    const actualExercises = this.simulateExerciseExecution(
      plannedExercises,
      params
    );

    // חישוב זמני אימון מציאותיים
    const plannedDuration = plannedExercises.length * 15; // הערכה: 15 דקות לתרגיל
    const duration = this.calculateActualDuration(plannedDuration, params);
    const startTime = this.generateRealisticStartTime();

    // יצירת זמן סיום בטוח
    const startTimeDate = new Date(
      `${date.toISOString().split("T")[0]}T${startTime}:00`
    );
    const endTime = new Date(startTimeDate.getTime() + duration * 60000);

    // וידוא שהתאריכים תקינים
    if (isNaN(startTimeDate.getTime()) || isNaN(endTime.getTime())) {
      console.warn(
        `⚠️ Invalid time calculation for workout on ${date.toISOString()}`
      );
      // יצירת פידבק פשוט עבור fallback
      const fallbackFeedback = this.generateRealisticFeedback(
        actualExercises,
        params,
        duration
      );

      const workout: WorkoutSession = {
        id: `workout_${date.getTime()}`,
        date: date.toISOString().split("T")[0],
        startTime: `18:00`,
        endTime: new Date(date.getTime() + duration * 60000).toISOString(),
        duration,
        type: workoutType,
        exercises: actualExercises,
        feedback: fallbackFeedback,
        plannedVsActual: {
          plannedExercises: plannedExercises.length,
          completedExercises: actualExercises.length,
          skippedSets: 0,
          totalSetsPlanned: plannedExercises.length * 3,
          totalSetsCompleted: actualExercises.length * 3,
        },
      };
      return workout;
    }

    // יצירת פידבק מציאותי
    const feedback = this.generateRealisticFeedback(
      actualExercises,
      params,
      duration
    );

    // חישוב נתוני השוואה
    const plannedVsActual = this.calculatePlannedVsActual(
      plannedExercises.length,
      actualExercises.length
    );

    const workout: WorkoutSession = {
      id: `workout_${date.getTime()}`,
      date: date.toISOString().split("T")[0],
      startTime: startTime,
      endTime: endTime.toISOString(),
      duration,
      type: workoutType,
      exercises: actualExercises,
      feedback,
      plannedVsActual: {
        plannedExercises: plannedExercises.length,
        completedExercises: actualExercises.length,
        skippedSets: 0, // נחשב לאחר מכן
        totalSetsPlanned: plannedExercises.length * 3, // הערכה: 3 סטים לתרגיל
        totalSetsCompleted: actualExercises.length * 3,
      },
    };

    return workout;
  }

  /**
   * יצירת תרגילים לאימון
   */
  private generateWorkoutExercises(
    workoutType: string,
    params: SimulationParameters
  ): WorkoutExercise[] {
    const exercises: WorkoutExercise[] = [];

    // קבלת תרגילים מהמבנה החדש לפי סוג אימון
    let availableExercises: any[] = [];

    switch (workoutType) {
      case "strength":
        // שילוב תרגילי משקל גוף ומשקולות
        const bodyweightExs = getBodyweightExercises();
        const dumbbellExs = getDumbbellExercises();

        // התאמת תרגילים לציוד זמין
        if (params.equipmentAvailable.includes("dumbbells")) {
          availableExercises = [...bodyweightExs, ...dumbbellExs];
        } else {
          availableExercises = bodyweightExs;
        }
        break;

      case "cardio":
        availableExercises = getCardioExercises();
        break;

      case "flexibility":
        availableExercises = getFlexibilityExercises();
        break;

      default:
        // ברירת מחדל - תרגילי משקל גוף
        availableExercises = getBodyweightExercises();
    }

    // בחירת 3-6 תרגילים בהתאם לזמן וניסיון
    const exerciseCount =
      params.userExperience === "beginner"
        ? 3
        : params.userExperience === "intermediate"
          ? 4
          : 5;

    const selectedExercises = this.shuffleArray([...availableExercises]).slice(
      0,
      Math.min(exerciseCount, availableExercises.length)
    );

    selectedExercises.forEach((exercise) => {
      // התאמת שם התרגיל למגדר
      const adaptedName = adaptExerciseNameToGender(
        exercise.nameLocalized.he, // שם בעברית
        params.gender
      );

      // הגדרת ערכי ברירת מחדל לפי קטגוריה
      let defaultSets = 3;
      let defaultReps = 10;
      let defaultWeight = undefined;

      if (exercise.category === "strength") {
        defaultSets = exercise.equipment === "dumbbells" ? 3 : 4;
        defaultReps = exercise.equipment === "dumbbells" ? 8 : 12;
        defaultWeight = exercise.equipment === "dumbbells" ? 15 : undefined;
      } else if (exercise.category === "cardio") {
        defaultSets = 1;
        defaultReps = 20; // דקות
      } else if (exercise.category === "core") {
        defaultSets = 3;
        defaultReps = 30; // שניות למשל פלאנק
      }

      exercises.push({
        name: adaptedName,
        targetSets: defaultSets,
        targetReps: defaultReps,
        targetWeight: defaultWeight,
        actualSets: [], // יתמלא בסימולציה
        skipped: false,
      });
    });

    return exercises;
  }

  /**
   * סימולציה של ביצוע תרגילים בפועל
   */
  private simulateExerciseExecution(
    plannedExercises: WorkoutExercise[],
    params: SimulationParameters
  ): WorkoutExercise[] {
    return plannedExercises.map((exercise) => {
      const actualExercise: WorkoutExercise = { ...exercise, actualSets: [] };

      // החלטה אם לדלג על התרגיל
      if (this.shouldSkipExercise(params)) {
        actualExercise.skipped = true;
        actualExercise.notes = "דולג בגלל חוסר מוטיבציה";
        return actualExercise;
      }

      // ביצוע סטים
      for (let setIndex = 0; setIndex < exercise.targetSets; setIndex++) {
        if (this.shouldSkipSet(setIndex, exercise.targetSets, params)) {
          continue;
        }

        const actualSet = this.simulateSetExecution(exercise, setIndex, params);
        actualExercise.actualSets.push(actualSet);
      }

      return actualExercise;
    });
  }

  /**
   * בדיקה אם לדלג על תרגיל
   */
  private shouldSkipExercise(params: SimulationParameters): boolean {
    return (
      Math.random() < SIMULATION_CONSTANTS.SKIP_EXERCISE_PROBABILITY &&
      params.motivation < 6
    );
  }

  /**
   * בדיקה אם לדלג על סט
   */
  private shouldSkipSet(
    setIndex: number,
    totalSets: number,
    params: SimulationParameters
  ): boolean {
    const skipProbability =
      setIndex >= totalSets - 1
        ? 0.1
        : SIMULATION_CONSTANTS.SKIP_SET_PROBABILITY;
    return Math.random() < skipProbability && params.energyLevel < 5;
  }

  /**
   * סימולציה של ביצוע סט בודד
   */
  private simulateSetExecution(
    exercise: WorkoutExercise,
    setIndex: number,
    params: SimulationParameters
  ): RealisticExerciseSet {
    // וריאציות מציאותיות בביצועים
    const motivationEffect = params.motivation / 10;
    const energyEffect = params.energyLevel / 10;

    // חישוב חזרות בפועל
    let actualReps = exercise.targetReps;

    // הפחתה בגלל עייפות
    if (setIndex > 0) {
      const reduction = Math.random() * 3; // 0-3 חזרות פחות
      actualReps = Math.max(1, Math.round(actualReps - reduction));
    }

    // השפעת מוטיבציה ואנרגיה
    const performanceMultiplier = (motivationEffect + energyEffect) / 2;
    if (performanceMultiplier > 0.8) {
      // ביצועים טובים - אולי חזרה נוספת
      if (Math.random() < 0.3) actualReps += 1;
    } else if (performanceMultiplier < 0.5) {
      // ביצועים חלשים - פחות חזרות
      actualReps = Math.max(1, actualReps - Math.floor(Math.random() * 2));
    }

    // משקל בפועל (עם וריאציות קטנות)
    let actualWeight = exercise.targetWeight;
    if (actualWeight && actualWeight > 0) {
      const weightVariation = (Math.random() - 0.5) * 0.1; // ±5% וריאציה
      actualWeight = Math.round(actualWeight * (1 + weightVariation));
    }

    // זמן מנוחה מציאותי
    const baseRestTime = exercise.targetWeight ? 120 : 60; // 2 דקות לכוח, 1 דקה לקרדיו
    const restTimeVariation = (Math.random() - 0.5) * 30; // ±15 שניות
    const actualRestTime = Math.max(30, baseRestTime + restTimeVariation);

    // רמת מאמץ נתפסת (RPE)
    let rpe = 6; // בסיס
    if (setIndex === exercise.targetSets - 1) rpe += 1; // סט אחרון קשה יותר
    if (actualReps > exercise.targetReps) rpe += 1; // חזרות נוספות
    if (params.energyLevel < 5) rpe += 1; // אנרגיה נמוכה
    rpe = Math.min(10, Math.max(1, rpe));

    return {
      reps: actualReps,
      weight: actualWeight,
      restTime: actualRestTime,
      perceivedExertion: rpe,
      completed: true,
    };
  }

  /**
   * יצירת פידבק מציאותי
   */
  private generateRealisticFeedback(
    exercises: WorkoutExercise[],
    params: SimulationParameters,
    duration: number
  ): WorkoutFeedback {
    const { completedSets, totalPlannedSets } =
      this.calculateSetStatistics(exercises);
    const completionRate = completedSets / totalPlannedSets;

    const overallRating = this.calculateOverallRating(completionRate, params);
    const averageRPE = this.calculateAverageRPE(exercises);
    const difficulty = this.determineDifficulty(averageRPE);
    const enjoyment = this.determineEnjoyment(overallRating, completionRate);

    const selectedNote = generateSingleGenderAdaptedNote(
      params.gender,
      averageRPE > 6 ? 4 : 3
    );

    return {
      overallRating,
      difficulty,
      enjoyment,
      energyLevel: params.energyLevel,
      fatigueLevel: Math.min(10, 11 - params.energyLevel + duration / 10),
      mood: this.getMoodEmoji(overallRating),
      notes: selectedNote,
      timeConstraints: duration > params.availableTime,
      equipmentIssues:
        Math.random() < SIMULATION_CONSTANTS.EQUIPMENT_ISSUE_PROBABILITY,
    };
  }

  /**
   * חישוב סטטיסטיקות סטים
   */
  private calculateSetStatistics(exercises: WorkoutExercise[]) {
    const completedSets = exercises.reduce(
      (sum, ex) => sum + ex.actualSets.length,
      0
    );
    const totalPlannedSets = exercises.reduce(
      (sum, ex) => sum + ex.targetSets,
      0
    );
    return { completedSets, totalPlannedSets };
  }

  /**
   * חישוב דירוג כללי
   */
  private calculateOverallRating(
    completionRate: number,
    params: SimulationParameters
  ): number {
    let rating = 3; // בסיס

    if (completionRate > 0.9) rating = 5;
    else if (completionRate > 0.8) rating = 4;
    else if (completionRate < 0.6) rating = 2;

    // השפעת מוטיבציה ואנרגיה
    if (params.motivation >= 8 && params.energyLevel >= 8) {
      rating = Math.min(5, rating + 1);
    }
    if (params.motivation <= 4 || params.energyLevel <= 4) {
      rating = Math.max(1, rating - 1);
    }

    return rating;
  }

  /**
   * חישוב ממוצע RPE
   */
  private calculateAverageRPE(exercises: WorkoutExercise[]): number {
    return (
      exercises.reduce((sum, ex) => {
        const setsRPE = ex.actualSets.reduce(
          (setSum, set) => setSum + set.perceivedExertion,
          0
        );
        return sum + setsRPE / Math.max(ex.actualSets.length, 1);
      }, 0) / exercises.length
    );
  }

  /**
   * קביעת רמת קושי
   */
  private determineDifficulty(
    averageRPE: number
  ): "too_easy" | "perfect" | "too_hard" {
    if (averageRPE < 5) return "too_easy";
    if (averageRPE > 8) return "too_hard";
    return "perfect";
  }

  /**
   * קביעת רמת הנאה
   */
  private determineEnjoyment(
    overallRating: number,
    completionRate: number
  ): "low" | "medium" | "high" {
    if (overallRating >= 4 && completionRate > 0.8) return "high";
    if (overallRating <= 2 || completionRate < 0.6) return "low";
    return "medium";
  }

  /**
   * קבלת אמוטיקון מצב רוח
   */
  private getMoodEmoji(overallRating: number): WorkoutFeedback["mood"] {
    const moods = ["😢", "😐", "😊", "🤩"];
    const moodIndex = Math.min(3, Math.max(0, overallRating - 2));
    return moods[moodIndex] as WorkoutFeedback["mood"];
  }

  /**
   * עדכון פרמטרי סימולציה לאורך זמן
   */
  private updateSimulationParameters(
    params: SimulationParameters,
    weekNumber: number,
    totalWorkouts: number
  ): SimulationParameters {
    const newParams = { ...params };

    // התקדמות בניסיון
    newParams.userExperience = this.updateExperienceLevel(
      params.userExperience,
      weekNumber
    );

    // עדכון מוטיבציה כל 4 שבועות
    if (weekNumber % 4 === 0) {
      newParams.motivation = this.updateMotivation(
        params,
        totalWorkouts,
        weekNumber
      );
    }

    // עדכון אנרגיה כל 3 שבועות
    if (weekNumber % 3 === 0) {
      newParams.energyLevel = this.updateEnergyLevel(params.energyLevel);
    }

    // התאמת זמן זמין (10% סיכוי לשינוי)
    if (Math.random() < 0.1) {
      newParams.availableTime = this.updateAvailableTime(params.availableTime);
    }

    return newParams;
  }

  /**
   * עדכון רמת ניסיון
   */
  private updateExperienceLevel(
    currentExperience: string,
    weekNumber: number
  ): "beginner" | "intermediate" | "advanced" {
    if (weekNumber > 16 && currentExperience === "intermediate") {
      return "advanced";
    }
    if (weekNumber > 8 && currentExperience === "beginner") {
      return "intermediate";
    }
    return currentExperience as "beginner" | "intermediate" | "advanced";
  }

  /**
   * עדכון מוטיבציה
   */
  private updateMotivation(
    params: SimulationParameters,
    totalWorkouts: number,
    weekNumber: number
  ): number {
    let newMotivation = params.motivation;

    // שיפור מוטיבציה בהתאם לביצועים
    if (totalWorkouts > 0) {
      const weeklyAverage = totalWorkouts / (weekNumber || 1);
      if (weeklyAverage >= 3) {
        newMotivation = Math.min(9, params.motivation + 0.5);
      }
    }

    // וריאציה מחזורית במוטיבציה
    const motivationChange = (Math.random() - 0.5) * 2; // ±1
    newMotivation = Math.max(3, Math.min(9, newMotivation + motivationChange));

    return newMotivation;
  }

  /**
   * עדכון רמת אנרגיה
   */
  private updateEnergyLevel(currentEnergy: number): number {
    const energyChange = (Math.random() - 0.5) * 2; // ±1
    return Math.max(4, Math.min(9, currentEnergy + energyChange));
  }

  /**
   * עדכון זמן זמין
   */
  private updateAvailableTime(currentTime: number): number {
    const timeChange = (Math.random() - 0.5) * 20; // ±10 דקות
    return Math.max(30, Math.min(90, currentTime + timeChange));
  }

  // ===== פונקציות עזר =====

  /**
   * פרסור משך האימון מהשאלון
   */
  private parseSessionDuration(duration: string): number {
    const durationMap: Record<string, number> = {
      "45-60": 52,
      "30-45": 37,
      "60+": 70,
    };

    const match = Object.keys(durationMap).find((key) =>
      duration.includes(key)
    );
    return match ? durationMap[match] : 45;
  }

  /**
   * קביעת ימי אימון בפועל (עם וריאציות)
   */
  private determineActualWorkoutDays(
    planned: number,
    params: SimulationParameters
  ): number[] {
    // בדיקת תקינות הפרמטרים
    if (!planned || planned < 1 || planned > 7) {
      console.warn(`⚠️ Invalid planned days: ${planned}, using default 3`);
      planned = 3;
    }

    const possibleDays = [0, 1, 2, 3, 4, 5, 6];

    // וריאציה מציאותית בכמות הימים
    let actualDays = planned;
    if (params.motivation < 5) {
      actualDays = Math.max(1, planned - 1);
    } else if (params.motivation > 8 && Math.random() < 0.3) {
      actualDays = Math.min(6, planned + 1); // הוספת הגבלה עליונה
    }

    // בדיקה נוספת
    actualDays = Math.max(1, Math.min(6, actualDays));

    // בחירת ימים רנדומליים
    const shuffled = this.shuffleArray(possibleDays);
    const selectedDays = shuffled.slice(0, actualDays);

    console.log(
      `📅 Selected ${selectedDays.length} workout days: [${selectedDays.join(", ")}]`
    );
    return selectedDays;
  }

  /**
   * ערבוב מערך (פישר-ייטס אלגוריתם)
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * בחירה רנדומלית עם משקלים
   */
  private weightedRandomSelect(items: string[], weights: number[]): string {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }

    return items[0]; // fallback
  }

  /**
   * החלטה האם להתאמן היום
   */
  private decideToWorkout(params: SimulationParameters): boolean {
    const motivationFactor = params.motivation / 10;
    const energyFactor = params.energyLevel / 10;
    const streakBonus = Math.min(params.currentStreak * 0.1, 0.3);

    const probability = (motivationFactor + energyFactor + streakBonus) / 3;
    return Math.random() < probability;
  }

  /**
   * בחירת סוג אימון
   */
  private selectWorkoutType(params: SimulationParameters): string {
    const experience = params.userExperience;
    const timeAvailable = params.availableTime;

    if (timeAvailable < 20) {
      return "quick";
    } else if (timeAvailable < 45) {
      return "standard";
    } else if (experience === "advanced") {
      return "intensive";
    } else {
      return "standard";
    }
  }

  /**
   * חישוב משך אימון בפועל
   */
  private calculateActualDuration(
    plannedDuration: number,
    params: SimulationParameters
  ): number {
    const experienceMultiplier = this.getExperienceMultiplier(
      params.userExperience
    );
    const motivationFactor = params.motivation / 10;
    const energyFactor = params.energyLevel / 10;

    const efficiency =
      (experienceMultiplier + motivationFactor + energyFactor) / 3;
    const variation =
      (Math.random() - 0.5) * SIMULATION_CONSTANTS.PERFORMANCE_VARIATION;

    return Math.round(plannedDuration * efficiency * (1 + variation));
  }

  /**
   * יצירת זמן התחלה מציאותי
   */
  private generateRealisticStartTime(): string {
    return this.selectStartTimeSlot();
  }

  /**
   * השוואת מתוכנן מול בפועל
   */
  private calculatePlannedVsActual(planned: number, actual: number): string {
    const ratio = actual / planned;

    if (ratio > 1.1) {
      return "exceeded";
    } else if (ratio < 0.8) {
      return "below";
    } else {
      return "on-target";
    }
  }

  /**
   * קבלת מכפיל ניסיון
   */
  private getExperienceMultiplier(experience: string): number {
    switch (experience) {
      case "beginner":
        return 0.7;
      case "intermediate":
        return 0.9;
      case "advanced":
        return 1.1;
      default:
        return 0.8;
    }
  }

  /**
   * בחירת זמן התחלה
   */
  private selectStartTimeSlot(): string {
    const timeSlots = [
      "06:00",
      "06:30",
      "07:00",
      "07:30",
      "08:00",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
    ];
    return timeSlots[Math.floor(Math.random() * timeSlots.length)];
  }
}

export const workoutSimulationService = new WorkoutSimulationService();
