/**
 * @file src/services/workoutSimulationService.ts
 * @brief סימולציה של ביצוע אימונים מציאותיים עם וריאציות והתקדמות
 * @description מדמה איך משתמש אמיתי מבצע אימונים - עם דילוגים, עייפות, שיפורים
 * @updated 2025-07-30 שיפורים כלליים והוספת תמיכה בהתאמת מגדר
 */

import {
  realisticDemoService,
  WorkoutSession,
  WorkoutExercise,
  ExerciseSet,
  WorkoutFeedback,
} from "./realisticDemoService";
import {
  adaptExerciseNameToGender,
  generateSingleGenderAdaptedNote,
  UserGender,
} from "../utils/genderAdaptation";

interface SimulationParameters {
  userExperience: "beginner" | "intermediate" | "advanced";
  motivation: number; // 1-10
  availableTime: number; // דקות
  energyLevel: number; // 1-10
  equipmentAvailable: string[];
  currentStreak: number;
  // הוספת תמיכה בהתאמת מגדר
  // Added gender adaptation support
  gender?: UserGender;
  personalizedGoals?: string[];
}

class WorkoutSimulationService {
  /**
   * סימולציה של 6 חודשי אימונים מציאותיים
   */
  async simulateRealisticWorkoutHistory(): Promise<void> {
    // יצירת סימולציית אימונים מציאותית של 6 חודשים
    const user = await realisticDemoService.getDemoUser();
    if (!user) {
      console.error("No demo user found for workout simulation");
      return;
    }

    // פרמטרי סימולציה ראשוניים
    let currentParams: SimulationParameters = {
      userExperience: user.questionnaireData.fitness_experience,
      motivation: 7, // מתחיל במוטיבציה גבוהה
      availableTime: this.parseSessionDuration(
        user.questionnaireData.session_duration
      ),
      energyLevel: 7,
      equipmentAvailable: user.questionnaireData.available_equipment,
      currentStreak: 0,
      // הוספת נתוני מגדר בסיסיים
      gender: user.questionnaireData.gender || "other",
      personalizedGoals: user.questionnaireData.goals || [],
    };

    // סימולציה של 26 שבועות (6 חודשים)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    let totalWorkouts = 0;
    let missedWorkouts = 0;

    // סימולציה של 26 שבועות (6 חודשים)
    for (let week = 0; week < 26; week++) {
      // התאמת פרמטרים לפי התקדמות
      currentParams = this.updateSimulationParameters(
        currentParams,
        week,
        totalWorkouts
      );

      // סימולציה של אימונים השבוע
      const weeklyWorkouts = await this.simulateWeeklyWorkouts(
        startDate,
        week,
        currentParams,
        user.questionnaireData.available_days
      );

      totalWorkouts += weeklyWorkouts.completed;
      missedWorkouts += weeklyWorkouts.missed;

      // עדכון רצף
      if (weeklyWorkouts.completed > 0) {
        currentParams.currentStreak += weeklyWorkouts.completed;
      } else {
        currentParams.currentStreak = 0;
      }

      // הפסקה קצרה כל 8 שבועות
      if (week === 7 || week === 15) {
        currentParams.motivation = Math.max(currentParams.motivation - 1, 4);
        currentParams.energyLevel = Math.max(currentParams.energyLevel - 1, 5);
      }
    }

    // סיכום סופי עם סטטיסטיקות חיוניות
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
      const workoutDate = new Date(startDate);
      workoutDate.setDate(
        workoutDate.getDate() + weekNumber * 7 + actualDays[dayIndex]
      );

      // החלטה אם לבצע את האימון
      const willWorkout = this.decideToWorkout(params, dayIndex, weekNumber);

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
    const workoutType = this.selectWorkoutType(params, weekNumber);

    // יצירת תרגילים לאימון
    const plannedExercises = this.generateWorkoutExercises(workoutType, params);

    // סימולציה של ביצוע בפועל
    const actualExercises = this.simulateExerciseExecution(
      plannedExercises,
      params
    );

    // חישוב זמני אימון מציאותיים
    const duration = this.calculateActualDuration(actualExercises, params);
    const startTime = this.generateRealisticStartTime(date, params);
    const endTime = new Date(new Date(startTime).getTime() + duration * 60000);

    // יצירת פידבק מציאותי
    const feedback = this.generateRealisticFeedback(
      actualExercises,
      params,
      duration
    );

    // חישוב נתוני השוואה
    const plannedVsActual = this.calculatePlannedVsActual(
      plannedExercises,
      actualExercises
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
      plannedVsActual,
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

    // ספריית תרגילים לפי סוג אימון
    const exerciseLibrary = {
      strength: [
        { name: "Squat", sets: 4, reps: 8, weight: 60 },
        { name: "Bench Press", sets: 4, reps: 8, weight: 50 },
        { name: "Deadlift", sets: 3, reps: 6, weight: 70 },
        { name: "Pull-ups", sets: 3, reps: 10, weight: 0 },
        { name: "Overhead Press", sets: 3, reps: 10, weight: 35 },
      ],
      cardio: [
        { name: "Treadmill", sets: 1, reps: 30, weight: 0 }, // 30 דקות
        { name: "Cycling", sets: 1, reps: 25, weight: 0 },
        { name: "Rowing", sets: 4, reps: 5, weight: 0 }, // 4x5 דקות
        { name: "Jump Rope", sets: 5, reps: 2, weight: 0 }, // 5x2 דקות
      ],
      flexibility: [
        { name: "Yoga Flow", sets: 1, reps: 20, weight: 0 },
        { name: "Static Stretching", sets: 1, reps: 15, weight: 0 },
        { name: "Foam Rolling", sets: 1, reps: 10, weight: 0 },
      ],
    };

    const availableExercises =
      exerciseLibrary[workoutType as keyof typeof exerciseLibrary] ||
      exerciseLibrary.strength;

    // בחירת 3-6 תרגילים בהתאם לזמן וניסיון
    const exerciseCount =
      params.userExperience === "beginner"
        ? 3
        : params.userExperience === "intermediate"
          ? 4
          : 5;

    const selectedExercises = this.shuffleArray([...availableExercises]).slice(
      0,
      exerciseCount
    );

    selectedExercises.forEach((exercise) => {
      // התאמת שם התרגיל למגדר
      const adaptedName = adaptExerciseNameToGender(
        exercise.name,
        params.gender
      );

      exercises.push({
        name: adaptedName,
        targetSets: exercise.sets,
        targetReps: exercise.reps,
        targetWeight: exercise.weight > 0 ? exercise.weight : undefined,
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
    const actualExercises: WorkoutExercise[] = plannedExercises.map(
      (exercise) => {
        const actualExercise: WorkoutExercise = { ...exercise, actualSets: [] };

        // החלטה אם לדלג על התרגיל (5% סיכוי)
        if (Math.random() < 0.05 && params.motivation < 6) {
          actualExercise.skipped = true;
          actualExercise.notes = "דולג בגלל חוסר מוטיבציה";
          return actualExercise;
        }

        // ביצוע סטים
        for (let setIndex = 0; setIndex < exercise.targetSets; setIndex++) {
          // החלטה אם לדלג על סט (10% סיכוי בסטים אחרונים)
          const skipProbability =
            setIndex >= exercise.targetSets - 1 ? 0.1 : 0.03;

          if (Math.random() < skipProbability && params.energyLevel < 5) {
            continue;
          }

          // סימולציה של ביצוע הסט
          const actualSet = this.simulateSetExecution(
            exercise,
            setIndex,
            params
          );
          actualExercise.actualSets.push(actualSet);
        }

        return actualExercise;
      }
    );

    return actualExercises;
  }

  /**
   * סימולציה של ביצוע סט בודד
   */
  private simulateSetExecution(
    exercise: WorkoutExercise,
    setIndex: number,
    params: SimulationParameters
  ): ExerciseSet {
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
    // חישוב ביצועים כלליים
    const completedSets = exercises.reduce(
      (sum, ex) => sum + ex.actualSets.length,
      0
    );
    const totalPlannedSets = exercises.reduce(
      (sum, ex) => sum + ex.targetSets,
      0
    );
    const completionRate = completedSets / totalPlannedSets;

    // דירוג כללי בהתאם לביצועים
    let overallRating = 3; // בסיס
    if (completionRate > 0.9) overallRating = 5;
    else if (completionRate > 0.8) overallRating = 4;
    else if (completionRate < 0.6) overallRating = 2;

    // השפעת מוטיבציה ואנרגיה
    if (params.motivation >= 8 && params.energyLevel >= 8)
      overallRating = Math.min(5, overallRating + 1);
    if (params.motivation <= 4 || params.energyLevel <= 4)
      overallRating = Math.max(1, overallRating - 1);

    // רמת קושי
    const averageRPE =
      exercises.reduce((sum, ex) => {
        const setsRPE = ex.actualSets.reduce(
          (setSum, set) => setSum + set.perceivedExertion,
          0
        );
        return sum + setsRPE / Math.max(ex.actualSets.length, 1);
      }, 0) / exercises.length;

    let difficulty: "too_easy" | "perfect" | "too_hard" = "perfect";
    if (averageRPE < 5) difficulty = "too_easy";
    else if (averageRPE > 8) difficulty = "too_hard";

    // רמת הנאה
    let enjoyment: "low" | "medium" | "high" = "medium";
    if (overallRating >= 4 && completionRate > 0.8) enjoyment = "high";
    else if (overallRating <= 2 || completionRate < 0.6) enjoyment = "low";

    // מצבי רוח מציאותיים
    const moods = ["😢", "😐", "😊", "🤩"];
    const moodIndex = Math.min(3, Math.max(0, overallRating - 2));

    // הערות מציאותיות מותאמות למגדר
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
      mood: moods[moodIndex] as WorkoutFeedback["mood"],
      notes: selectedNote,
      timeConstraints: duration > params.availableTime,
      equipmentIssues: Math.random() < 0.05, // 5% סיכוי לבעיות ציוד
    };
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
    if (weekNumber > 8 && params.userExperience === "beginner") {
      newParams.userExperience = "intermediate";
    } else if (weekNumber > 16 && params.userExperience === "intermediate") {
      newParams.userExperience = "advanced";
    }

    // שיפור מוטיבציה בהתאם לביצועים
    if (totalWorkouts > 0 && weekNumber % 4 === 0) {
      // כל 4 שבועות - בדיקת מוטיבציה לפי ביצועים
      const weeklyAverage = totalWorkouts / (weekNumber || 1);
      if (weeklyAverage >= 3) {
        newParams.motivation = Math.min(9, params.motivation + 0.5);
      }
    }

    // שינויים במוטיבציה (מחזוריים)
    if (weekNumber % 4 === 0) {
      // כל 4 שבועות - וריאציה במוטיבציה
      const motivationChange = (Math.random() - 0.5) * 2; // ±1
      newParams.motivation = Math.max(
        3,
        Math.min(9, params.motivation + motivationChange)
      );
    }

    // שינויים באנרגיה (מחזוריים)
    if (weekNumber % 3 === 0) {
      const energyChange = (Math.random() - 0.5) * 2; // ±1
      newParams.energyLevel = Math.max(
        4,
        Math.min(9, params.energyLevel + energyChange)
      );
    }

    // התאמת זמן זמין (לעיתים יש יותר/פחות זמן)
    if (Math.random() < 0.1) {
      // 10% סיכוי לשינוי
      const timeChange = (Math.random() - 0.5) * 20; // ±10 דקות
      newParams.availableTime = Math.max(
        30,
        Math.min(90, params.availableTime + timeChange)
      );
    }

    return newParams;
  }

  // פונקציות עזר
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

  private determineActualWorkoutDays(
    planned: number,
    params: SimulationParameters
  ): number[] {
    const possibleDays = [0, 1, 2, 3, 4, 5, 6]; // ימי השבוע

    // וריאציה מציאותית - לפעמים פחות ימים, לפעמים יותר
    let actualDays = planned;
    if (params.motivation < 5) actualDays = Math.max(1, planned - 1);
    else if (params.motivation > 8 && Math.random() < 0.3)
      actualDays = planned + 1;

    // בחירת ימים רנדומליים
    const shuffled = this.shuffleArray(possibleDays);
    return shuffled.slice(0, Math.min(actualDays, 6)); // מקסימום 6 ימים
  }

  private decideToWorkout(
    params: SimulationParameters,
    dayIndex: number,
    weekNumber: number
  ): boolean {
    let probability = 0.8; // 80% סיכוי בסיסי

    // השפעת מוטיבציה
    probability += (params.motivation - 5) * 0.05;

    // השפעת אנרגיה
    probability += (params.energyLevel - 5) * 0.03;

    // עייפות מצטברת
    if (params.currentStreak > 5) probability -= 0.1;

    // יום בשבוע (פחות סיכוי בסוף השבוע)
    if (dayIndex >= 5) probability -= 0.1;

    // התחלת שנה חדשה / מוטיבציה גבוהה
    if (weekNumber < 4) probability += 0.1;

    return Math.random() < Math.max(0.2, Math.min(0.95, probability));
  }

  private selectWorkoutType(
    params: SimulationParameters,
    weekNumber: number
  ): string {
    const types = ["strength", "cardio", "flexibility"];

    // וריאציה לפי שבוע - יותר קרדיו בתחילת תוכנית
    if (weekNumber < 4 && params.userExperience === "beginner") {
      return "cardio";
    }

    // התפלגות בהתאם לניסיון
    if (params.userExperience === "beginner") {
      // מתחילים - יותר קרדיו וגמישות
      const weights = [0.4, 0.5, 0.1];
      return this.weightedRandomSelect(types, weights);
    } else if (params.userExperience === "intermediate") {
      // בינוניים - איזון
      const weights = [0.6, 0.3, 0.1];
      return this.weightedRandomSelect(types, weights);
    } else {
      // מתקדמים - יותר כוח
      const weights = [0.7, 0.2, 0.1];
      return this.weightedRandomSelect(types, weights);
    }
  }

  private calculateActualDuration(
    exercises: WorkoutExercise[],
    params: SimulationParameters
  ): number {
    let totalTime = 10; // חימום

    exercises.forEach((exercise) => {
      if (exercise.skipped) return;

      exercise.actualSets.forEach((set) => {
        totalTime += 2; // זמן ביצוע סט
        totalTime += set.restTime / 60; // מנוחה בדקות
      });
    });

    totalTime += 5; // קירור

    // התאמה לפי רמת ניסיון - מתחילים לוקחים יותר זמן
    if (params.userExperience === "beginner") {
      totalTime *= 1.2; // 20% יותר זמן
    } else if (params.userExperience === "advanced") {
      totalTime *= 0.9; // 10% פחות זמן
    }

    // וריאציה מציאותית
    const variation = (Math.random() - 0.5) * 0.2; // ±10%
    return Math.max(15, Math.round(totalTime * (1 + variation)));
  }

  private generateRealisticStartTime(
    date: Date,
    params: SimulationParameters
  ): string {
    // זמן אימון על פי העדפות והרמת מגדר
    let baseHour = 18; // ערב - ברירת מחדל

    // התאמת זמן לפי מגדר ותכונות
    if (params.gender === "female") {
      baseHour = 17; // נשים נוטות להתאמן מוקדם יותר
    } else if (params.gender === "male") {
      baseHour = 19; // גברים נוטים להתאמן מאוחר יותר
    }

    // התאמת זמן לפי רמת ניסיון
    if (params.userExperience === "advanced") {
      baseHour -= 1; // מתקדמים מתאמנים מוקדם יותר
    }

    const variation = Math.floor(Math.random() * 4) - 2; // ±2 שעות
    const actualHour = Math.max(6, Math.min(22, baseHour + variation));
    const minutes = Math.floor(Math.random() * 60);

    const startTime = new Date(date);
    startTime.setHours(actualHour, minutes, 0, 0);

    return startTime.toISOString();
  }

  private calculatePlannedVsActual(
    planned: WorkoutExercise[],
    actual: WorkoutExercise[]
  ) {
    const plannedSets = planned.reduce((sum, ex) => sum + ex.targetSets, 0);
    const completedSets = actual.reduce(
      (sum, ex) => sum + ex.actualSets.length,
      0
    );
    const skippedSets = plannedSets - completedSets;

    return {
      plannedExercises: planned.length,
      completedExercises: actual.filter((ex) => !ex.skipped).length,
      skippedSets,
      totalSetsPlanned: plannedSets,
      totalSetsCompleted: completedSets,
    };
  }

  // פונקציות עזר כלליות
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

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
}

export const workoutSimulationService = new WorkoutSimulationService();
