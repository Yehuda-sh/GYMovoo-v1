/**
 * @file src/services/scientificAIService.ts
 * @brief אלגוריתם AI מתקדם להתאמת אימונים על בסיס מדעי
 * @dependencies exerciseDatabase.ts, scientificQuestionnaireData.ts, workoutAI.ts
 * @notes מערכת AI מקצועית עם בסיס מדעי חזק למניעת פציעות ומקסום תוצאות
 * @recurring_errors להקפיד על בטיחות המשתמש ולא לתת ייעוץ רפואי
 */

import { EXTENDED_EXERCISE_DATABASE } from "../data/exerciseDatabase";
import { SensitiveQuestionData } from "../data/scientificQuestionnaireData";

export interface ScientificUserProfile {
  // מידע בסיסי
  ageRange: string;
  gender?: string;
  bodyAcceptance: number;

  // רקע כושר
  fitnessExperience: string;
  currentActivity: string;

  // מטרות
  primaryGoal: string;
  bodyFocusAreas: string[];

  // זמינות
  availableDays: number;
  sessionDuration: number;

  // ציוד ומקום
  workoutLocation: string;
  availableEquipment: string[];

  // בריאות
  healthStatus?: string;
  previousInjuries?: string[];

  // פסיכולוגיה
  motivationType: string;
  workoutStylePreference: string;

  // בדיקות כושר (אופציונלי)
  fitnessTestInterest?: string;
}

interface WorkoutRecommendation {
  exercises: any[];
  intensity: "low" | "moderate" | "high";
  volume: {
    setsPerExercise: number;
    repsRange: { min: number; max: number };
    restBetweenSets: number;
  };
  duration: number;
  frequency: number;
  progression: {
    weeklyIncrease: number;
    deloadWeek: number;
  };
  safetyNotes: string[];
  motivationalTips: string[];
}

export class ScientificAIService {
  /**
   * אלגוריתם ראשי ליצירת תוכנית אימון מדעית ואישית
   * מבוסס על עקרונות Progressive Overload ו-Periodization
   */
  public generateScientificWorkout(
    profile: ScientificUserProfile
  ): WorkoutRecommendation {
    console.log("🧠 יוצר תוכנית אימון מבוססת מדע...");

    // שלב 1: הערכת בטיחות וסינון תרגילים
    const safeExercises = this.filterSafeExercises(profile);

    // שלב 2: חישוב פרמטרי אימון בסיסיים (Progressive Overload)
    const trainingParameters = this.calculateTrainingParameters(profile);

    // שלב 3: בחירת תרגילים על בסיס מדעי
    const selectedExercises = this.selectOptimalExercises(
      safeExercises,
      profile
    );

    // שלב 4: יצירת המלצות מותאמות אישית עם Recovery planning
    const recommendation = this.buildRecommendation(
      selectedExercises,
      trainingParameters,
      profile
    );

    console.log("✅ תוכנית מדעית נוצרה בהצלחה!");
    return recommendation;
  }

  /**
   * סינון תרגילים בטוחים על בסיס היסטוריית פציעות ומגבלות
   */
  private filterSafeExercises(profile: ScientificUserProfile): any[] {
    let availableExercises = [...EXTENDED_EXERCISE_DATABASE];

    // סינון על בסיס פציעות קודמות
    if (profile.previousInjuries?.length) {
      availableExercises = availableExercises.filter((exercise) => {
        return !this.exerciseConflictsWithInjury(
          exercise,
          profile.previousInjuries!
        );
      });
    }

    // סינון על בסיס גיל
    if (profile.ageRange === "65+") {
      availableExercises = availableExercises.filter(
        (exercise) => exercise.difficulty !== "advanced"
      );
    }

    // סינון על בסיס ציוד זמין
    availableExercises = availableExercises.filter((exercise) =>
      this.exerciseMatchesEquipment(exercise, profile.availableEquipment)
    );

    console.log(
      `🛡️ סוננו ${availableExercises.length} תרגילים בטוחים מתוך ${EXTENDED_EXERCISE_DATABASE.length}`
    );
    return availableExercises;
  }

  /**
   * בדיקה האם תרגיל מתנגש עם פציעה קודמת
   */
  private exerciseConflictsWithInjury(
    exercise: any,
    injuries: string[]
  ): boolean {
    const conflictMap = {
      back: ["deadlift", "squat", "overhead_press", "bent_over_row"],
      knee: ["squat", "lunge", "jump", "running"],
      shoulder: ["overhead_press", "lateral_raise", "pull_up", "bench_press"],
      neck: ["overhead_press", "upright_row"],
      wrist: ["push_up", "plank", "handstand"],
      ankle: ["jump", "calf_raise", "running"],
    };

    return injuries.some((injury) => {
      const conflictingExercises =
        conflictMap[injury as keyof typeof conflictMap] || [];
      return conflictingExercises.some(
        (conflictExercise) =>
          exercise.name.toLowerCase().includes(conflictExercise) ||
          exercise.tags?.some((tag: string) => tag.includes(conflictExercise))
      );
    });
  }

  /**
   * בדיקה האם תרגיל תואם לציוד הזמין
   */
  private exerciseMatchesEquipment(
    exercise: any,
    availableEquipment: string[]
  ): boolean {
    // אם יש גישה לחדר כושר מלא - הכל זמין
    if (availableEquipment.includes("full_gym")) return true;

    // בדיקת תאימות ציוד ספציפי
    const exerciseEquipment = exercise.equipment || "bodyweight";

    const equipmentMap = {
      bodyweight: ["bodyweight"],
      dumbbells: ["dumbbells", "free_weights"],
      barbell: ["barbell", "free_weights"],
      kettlebell: ["kettlebell"],
      resistance_bands: ["resistance_bands"],
      pull_up_bar: ["pull_up_bar"],
    };

    const requiredEquipment = equipmentMap[
      exerciseEquipment as keyof typeof equipmentMap
    ] || [exerciseEquipment];

    return requiredEquipment.some((required) =>
      availableEquipment.some(
        (available) =>
          available.includes(required) || required.includes(available)
      )
    );
  }

  /**
   * חישוב פרמטרי אימון על בסיס מדעי
   */
  private calculateTrainingParameters(profile: ScientificUserProfile) {
    // מפת עוצמה על בסיס רמת ניסיון
    const intensityMap = {
      complete_beginner: "low",
      some_experience: "moderate",
      intermediate: "moderate",
      advanced: "high",
      athlete: "high",
    } as const;

    // מפת נפח אימון על בסיס מטרה
    const volumeMap = {
      feel_stronger: { sets: 3, reps: { min: 6, max: 10 } },
      build_muscle: { sets: 4, reps: { min: 8, max: 12 } },
      lose_weight: { sets: 3, reps: { min: 12, max: 15 } },
      improve_health: { sets: 3, reps: { min: 10, max: 15 } },
      increase_energy: { sets: 2, reps: { min: 15, max: 20 } },
      reduce_stress: { sets: 2, reps: { min: 12, max: 15 } },
      improve_posture: { sets: 3, reps: { min: 12, max: 15 } },
      sport_performance: { sets: 4, reps: { min: 6, max: 8 } },
    };

    // זמני מנוחה על בסיס מטרה ורמה
    const restMap = {
      strength: 180, // 3 דקות לכוח
      hypertrophy: 90, // 1.5 דקות לגדילה
      endurance: 60, // דקה לסיבולת
      fat_loss: 45, // 45 שניות לשריפת שומן
    };

    const goalToType: Record<string, keyof typeof restMap> = {
      feel_stronger: "strength",
      build_muscle: "hypertrophy",
      lose_weight: "fat_loss",
      increase_energy: "endurance",
    };

    const intensity =
      intensityMap[profile.fitnessExperience as keyof typeof intensityMap] ||
      "moderate";
    const volume =
      volumeMap[profile.primaryGoal as keyof typeof volumeMap] ||
      volumeMap["improve_health"];
    const trainingType = goalToType[profile.primaryGoal] || "hypertrophy";
    const restTime = restMap[trainingType];

    return {
      intensity,
      volume,
      restTime,
      weeklyProgression: this.calculateProgression(profile),
    };
  }

  /**
   * חישוב התקדמות שבועית בטוחה עם Periodization
   */
  private calculateProgression(profile: ScientificUserProfile) {
    const baseProgression = {
      complete_beginner: 0.05, // 5% עלייה שבועית
      some_experience: 0.03, // 3% עלייה שבועית
      intermediate: 0.02, // 2% עלייה שבועית
      advanced: 0.01, // 1% עלייה שבועית
      athlete: 0.005, // 0.5% עלייה שבועית
    };

    // התאמה לפי גיל - Recovery considerations
    const ageModifier = {
      "16-25": 1.0,
      "26-35": 0.9,
      "36-45": 0.8,
      "46-55": 0.7,
      "56-65": 0.6,
      "65+": 0.5,
    };

    const base =
      baseProgression[
        profile.fitnessExperience as keyof typeof baseProgression
      ] || 0.02;
    const modifier =
      ageModifier[profile.ageRange as keyof typeof ageModifier] || 0.8;

    return base * modifier;
  }

  /**
   * חישוב Heart Rate Zones מבוסס גיל
   */
  private calculateHeartRateZones(profile: ScientificUserProfile): {
    maxHR: number;
    zones: Record<string, { min: number; max: number; purpose: string }>;
  } {
    const age = this.extractAgeFromRange(profile.ageRange);
    const maxHR = 220 - age; // נוסחת הבסיס

    return {
      maxHR,
      zones: {
        recovery: {
          min: Math.round(maxHR * 0.5),
          max: Math.round(maxHR * 0.6),
          purpose: "התאוששות פעילה",
        },
        aerobic: {
          min: Math.round(maxHR * 0.6),
          max: Math.round(maxHR * 0.7),
          purpose: "שריפת שומן ויסוד אירובי",
        },
        anaerobic: {
          min: Math.round(maxHR * 0.7),
          max: Math.round(maxHR * 0.8),
          purpose: "שיפור סיבולת",
        },
        threshold: {
          min: Math.round(maxHR * 0.8),
          max: Math.round(maxHR * 0.9),
          purpose: "הגברת יכולת אירובית",
        },
        max_effort: {
          min: Math.round(maxHR * 0.9),
          max: maxHR,
          purpose: "מאמץ מקסימלי - זמן קצר",
        },
      },
    };
  }

  /**
   * בחירת תרגילים אופטימלית על בסיס מדעי
   */
  private selectOptimalExercises(
    availableExercises: any[],
    profile: ScientificUserProfile
  ): any[] {
    const exercisesPerSession = this.calculateExercisesPerSession(profile);

    // חיפוש תרגילים מותאמים לאזורי התמקדות
    const targetedExercises = availableExercises.filter((exercise) =>
      this.exerciseMatchesTargetAreas(exercise, profile.bodyFocusAreas)
    );

    // עדיפות לתרגילים מורכבים (מדעית מוכח שהם יעילים יותר)
    const compoundExercises = targetedExercises.filter(
      (exercise) =>
        exercise.type === "compound" || exercise.tags?.includes("compound")
    );

    const isolationExercises = targetedExercises.filter(
      (exercise) =>
        exercise.type === "isolation" || exercise.tags?.includes("isolation")
    );

    // יחס של 70% מורכבים, 30% בידוד (על בסיס מחקר)
    const compoundCount = Math.ceil(exercisesPerSession * 0.7);
    const isolationCount = exercisesPerSession - compoundCount;

    const selectedCompound = this.selectByPriority(
      compoundExercises,
      compoundCount,
      profile
    );
    const selectedIsolation = this.selectByPriority(
      isolationExercises,
      isolationCount,
      profile
    );

    return [...selectedCompound, ...selectedIsolation];
  }

  /**
   * חישוב מספר תרגילים לפי זמן ורמה
   */
  private calculateExercisesPerSession(profile: ScientificUserProfile): number {
    const baseExercises = {
      15: 3, // 15 דקות = 3 תרגילים
      30: 5, // 30 דקות = 5 תרגילים
      45: 7, // 45 דקות = 7 תרגילים
      60: 8, // 60 דקות = 8 תרגילים
      75: 10, // 75 דקות = 10 תרגילים
      90: 12, // 90 דקות = 12 תרגילים
    };

    return (
      baseExercises[profile.sessionDuration as keyof typeof baseExercises] || 6
    );
  }

  /**
   * בדיקת התאמה בין תרגיל לאזורי יעד
   */
  private exerciseMatchesTargetAreas(
    exercise: any,
    targetAreas: string[]
  ): boolean {
    const areaMapping = {
      upper_body: ["chest", "shoulders", "arms", "back"],
      core: ["core", "abs", "lower_back"],
      lower_body: ["legs", "glutes", "calves"],
      full_body: ["full_body", "compound"],
      flexibility: ["stretching", "mobility"],
      cardio: ["cardio", "hiit"],
    };

    return targetAreas.some((area) => {
      const mappedMuscles = areaMapping[area as keyof typeof areaMapping] || [];
      return mappedMuscles.some(
        (muscle) =>
          exercise.muscleGroups?.includes(muscle) ||
          exercise.primaryMuscles?.includes(muscle) ||
          exercise.tags?.includes(muscle)
      );
    });
  }

  /**
   * בחירת תרגילים לפי עדיפות מדעית
   */
  private selectByPriority(
    exercises: any[],
    count: number,
    profile: ScientificUserProfile
  ): any[] {
    // ניקוד עדיפות על בסיס מדעי
    const scoredExercises = exercises.map((exercise) => ({
      ...exercise,
      priority_score: this.calculateExercisePriority(exercise, profile),
    }));

    // מיון לפי ניקוד וחזרה של הטובים ביותר
    return scoredExercises
      .sort((a, b) => b.priority_score - a.priority_score)
      .slice(0, count);
  }

  /**
   * חישוב ניקוד עדיפות לתרגיל
   */
  private calculateExercisePriority(
    exercise: any,
    profile: ScientificUserProfile
  ): number {
    let score = 0;

    // בונוס לתרגילים מורכבים (מדעית יעילים יותר)
    if (exercise.type === "compound") score += 10;

    // בונוס לתרגילים הולמי רמה
    const difficultyMatch = {
      complete_beginner: { beginner: 10, intermediate: 5, advanced: 0 },
      some_experience: { beginner: 8, intermediate: 10, advanced: 5 },
      intermediate: { beginner: 5, intermediate: 10, advanced: 8 },
      advanced: { beginner: 0, intermediate: 8, advanced: 10 },
      athlete: { beginner: 0, intermediate: 5, advanced: 10 },
    };

    const levelBonus =
      difficultyMatch[
        profile.fitnessExperience as keyof typeof difficultyMatch
      ];
    if (levelBonus) {
      score += levelBonus[exercise.difficulty as keyof typeof levelBonus] || 0;
    }

    // בונוס למטרות ספציפיות
    if (
      profile.primaryGoal === "build_muscle" &&
      exercise.tags?.includes("muscle_building")
    ) {
      score += 8;
    }
    if (
      profile.primaryGoal === "lose_weight" &&
      exercise.tags?.includes("fat_burning")
    ) {
      score += 8;
    }

    return score;
  }

  /**
   * בניית המלצה מלאה עם הנחיות בטיחות ומוטיבציה
   */
  private buildRecommendation(
    exercises: any[],
    parameters: any,
    profile: ScientificUserProfile
  ): WorkoutRecommendation {
    const safetyNotes = this.generateSafetyNotes(profile);
    const motivationalTips = this.generateMotivationalTips(profile);

    return {
      exercises,
      intensity: parameters.intensity,
      volume: {
        setsPerExercise: parameters.volume.sets,
        repsRange: parameters.volume.reps,
        restBetweenSets: parameters.restTime,
      },
      duration: profile.sessionDuration,
      frequency: profile.availableDays,
      progression: {
        weeklyIncrease: parameters.weeklyProgression,
        deloadWeek: 4, // כל 4 שבועות שבוע קל יותר
      },
      safetyNotes,
      motivationalTips,
    };
  }

  /**
   * יצירת הערות בטיחות מותאמות אישית
   */
  private generateSafetyNotes(profile: ScientificUserProfile): string[] {
    const notes: string[] = [
      "התמיד בחימום של 5-10 דקות לפני האימון",
      "הפסק מיד אם מרגיש כאב חד או חוסר נוחות",
      "שתה מים לפני, במהלך ואחרי האימון",
      "קח יום מנוחה אחד בין כל יומי אימון",
    ];

    // הוספת הערות על בסיס גיל
    if (profile.ageRange === "65+" || profile.ageRange === "56-65") {
      notes.push("התחל בעוצמה נמוכה והגבר בהדרגה");
      notes.push("שים דגש על איזון ויציבות");
    }

    // הוספת הערות על בסיס פציעות
    if (profile.previousInjuries?.includes("back")) {
      notes.push("שמור על יציבה ישרה ושרירי ליבה מפוחים");
    }
    if (profile.previousInjuries?.includes("knee")) {
      notes.push("וודא שהברכיים עוקבות אחר כיוון הרגליים");
    }

    // הערות על בסיס מצב בריאותי
    if (profile.healthStatus === "managing_conditions") {
      notes.push("התייעץ עם רופא לפני שינויים משמעותיים בתוכנית");
    }

    return notes;
  }

  /**
   * יצירת טיפים מוטיבציוניים על בסיס פרופיל אישי
   */
  private generateMotivationalTips(profile: ScientificUserProfile): string[] {
    const baseTips = [
      "כל אימון הוא ניצחון - גם אם לא הרגשת מושלם",
      "התקדמות היא לא תמיד ליניארית - זה בסדר גמור",
      "התמד גם כשלא בא לך - זה בדיוק מה שיעשה את ההבדל",
    ];

    // טיפים על בסיס מוטיבציה
    if (profile.motivationType === "health") {
      baseTips.push("זכור - כל דקה של אימון משקיעה בבריאות העתידית שלך");
    }
    if (profile.motivationType === "appearance") {
      baseTips.push(
        "שינויים חיצוניים לוקחים זמן - תמקד בתחושה הפנימית בינתיים"
      );
    }
    if (profile.motivationType === "strength") {
      baseTips.push("כוח לא נמדד רק במשקלים - גם ביכולת לקום ולהמשיך");
    }

    // טיפים על בסיס סגנון אימון
    if (profile.workoutStylePreference === "quick_efficient") {
      baseTips.push("15 דקות של אימון איכותי שווים שעה של אימון רפוי");
    }
    if (profile.workoutStylePreference === "varied_fun") {
      baseTips.push("נסה וריאציות חדשות של תרגילים כדי לשמור על העניין");
    }

    return baseTips;
  }

  /**
   * פונקציה לחישוב BMR ו-TDEE (קילוריות יומיות)
   */
  public calculateDailyCalories(
    profile: ScientificUserProfile,
    weight?: number,
    height?: number
  ): {
    bmr: number;
    tdee: number;
    recommendations: string[];
  } {
    // אם אין נתוני משקל וגובה, נחזיר ערכים כלליים
    if (!weight || !height) {
      return {
        bmr: 0,
        tdee: 0,
        recommendations: [
          "להערכה מדויקת של צריכה קלורית, נדרש משקל וגובה",
          "בכל מקרה - תזונה מאוזנת חשובה לתוצאות האימון",
        ],
      };
    }

    // נוסחת Mifflin-St Jeor (מדויקת יותר)
    const ageNumeric = this.extractAgeFromRange(profile.ageRange);
    let bmr: number;

    if (profile.gender === "male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * ageNumeric;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * ageNumeric;
    }

    // מכפל פעילות על בסיס תדירות אימונים
    const activityMultiplier: Record<number, number> = {
      1: 1.375, // פעילות קלה
      2: 1.55, // פעילות בינונית
      3: 1.725, // פעילות גבוהה
      4: 1.9, // פעילות גבוהה מאוד
      5: 1.9, // פעילות גבוהה מאוד
      6: 2.0, // פעילות קיצונית
    };

    const tdee = bmr * (activityMultiplier[profile.availableDays] || 1.55);

    const recommendations = this.generateNutritionRecommendations(
      profile,
      tdee
    );

    return { bmr, tdee, recommendations };
  }

  /**
   * חילוץ גיל ממוצע מטווח גילאים
   */
  private extractAgeFromRange(ageRange: string): number {
    const ageMap = {
      "16-25": 20,
      "26-35": 30,
      "36-45": 40,
      "46-55": 50,
      "56-65": 60,
      "65+": 70,
    };
    return ageMap[ageRange as keyof typeof ageMap] || 35;
  }

  /**
   * המלצות תזונה מותאמות למטרה
   */
  private generateNutritionRecommendations(
    profile: ScientificUserProfile,
    tdee: number
  ): string[] {
    const recommendations: string[] = [];

    if (profile.primaryGoal === "lose_weight") {
      const deficitCalories = Math.round(tdee * 0.8); // 20% מחסור
      recommendations.push(`לירידה במשקל: כ-${deficitCalories} קלוריות ליום`);
      recommendations.push("דגש על חלבון ופחמימות מורכבות");
    }

    if (profile.primaryGoal === "build_muscle") {
      const surplusCalories = Math.round(tdee * 1.1); // 10% עודף
      recommendations.push(`לבניית שריר: כ-${surplusCalories} קלוריות ליום`);
      recommendations.push('1.6-2.2 גרם חלבון לכל ק"ג משקל גוף');
    }

    if (profile.primaryGoal === "improve_health") {
      recommendations.push(
        `לשמירה על בריאות: כ-${Math.round(tdee)} קלוריות ליום`
      );
      recommendations.push("מגוון של מקורות חלבון, ירקות ופירות");
    }

    recommendations.push("שתה לפחות 8 כוסות מים ליום");
    recommendations.push("אכל 2-3 שעות לפני האימון וחצי שעה אחריו");

    return recommendations;
  }
}

// יצוא singleton
export const scientificAI = new ScientificAIService();
