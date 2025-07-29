/**
 * @file src/services/scientificUserGenerator.ts
 * @brief יוצר משתמשים רנדומליים עם נתונים מדעיים מלאים כולל היסטוריה
 * @dependencies scientificQuestionnaireData, scientificAIService, AsyncStorage
 * @notes יוצר פרופיל משתמש מלא עם 6 חודשי פעילות סימולטיביים
 * @recurring_errors לוודא שכל הנתונים עקביים זה עם זה
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScientificUserProfile, scientificAI } from "./scientificAIService";
import { scientificQuestionnaire } from "../data/scientificQuestionnaireData";

// ממשק לנתוני משתמש מדעי מלא
export interface FullScientificUser {
  // פרטים בסיסיים
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: string;

  // השאלון המדעי החדש
  scientificProfile: ScientificUserProfile;

  // תוכניות AI מותאמות
  aiRecommendations: {
    currentWorkoutPlan: any;
    nutritionPlan: any;
    heartRateZones: any;
    progressionPlan: any;
  };

  // היסטוריית פעילות של 6 חודשים
  activityHistory: {
    workouts: Array<{
      date: string;
      type: string;
      duration: number;
      exercises: any[];
      feedback: {
        rating: number;
        difficulty: "easy" | "medium" | "hard";
        enjoyment: "low" | "medium" | "high";
        notes: string;
        mood: string;
      };
      personalRecords?: Array<{
        type: "weight" | "volume" | "reps";
        exerciseName: string;
        value: number;
        improvement: number;
      }>;
    }>;

    measurements: Array<{
      date: string;
      weight?: number;
      bodyFat?: number;
      measurements?: Record<string, number>;
    }>;

    achievements: Array<{
      date: string;
      type:
        | "workout_streak"
        | "personal_record"
        | "goal_achieved"
        | "milestone";
      title: string;
      description: string;
    }>;
  };

  // סטטיסטיקות נוכחיות
  currentStats: {
    totalWorkouts: number;
    totalVolume: number;
    averageRating: number;
    currentStreak: number;
    favoriteExercises: string[];
    strongestMuscleGroups: string[];
    improvementAreas: string[];
  };

  // נתוני תאימות לאחור
  questionnaireData: {
    answers: Record<string, any>;
    completedAt: string;
    version: string;
    metadata: Record<string, any>;
  };
}

export class ScientificUserGenerator {
  /**
   * יוצר משתמש מדעי מלא עם היסטוריה של 6 חודשים
   */
  public async generateFullScientificUser(): Promise<FullScientificUser> {
    console.log("🔬 יוצר משתמש מדעי מלא...");

    // שלב 1: יצירת זהות בסיסית
    const basicIdentity = this.generateBasicIdentity();

    // שלב 2: יצירת פרופיל מדעי
    const scientificProfile = this.generateScientificProfile();

    // שלב 3: יצירת המלצות AI
    const aiRecommendations = this.generateAIRecommendations(scientificProfile);

    // שלב 4: יצירת היסטוריית 6 חודשים
    const activityHistory =
      await this.generateActivityHistory(scientificProfile);

    // שלב 5: חישוב סטטיסטיקות נוכחיות
    const currentStats = this.calculateCurrentStats(
      activityHistory,
      scientificProfile
    );

    // שלב 6: יצירת נתוני תאימות לאחור
    const questionnaireData =
      this.generateBackwardCompatibilityData(scientificProfile);

    const fullUser: FullScientificUser = {
      ...basicIdentity,
      scientificProfile,
      aiRecommendations,
      activityHistory,
      currentStats,
      questionnaireData,
    };

    console.log("✅ משתמש מדעי נוצר בהצלחה:", {
      email: fullUser.email,
      workouts: fullUser.activityHistory.workouts.length,
      totalVolume: fullUser.currentStats.totalVolume,
      streak: fullUser.currentStats.currentStreak,
    });

    return fullUser;
  }

  /**
   * יוצר זהות בסיסית רנדומלית
   */
  private generateBasicIdentity() {
    // שמות באנגלית בלבד לאימייל תקני
    const firstNames = [
      { hebrew: "יוסי", english: "yossi" },
      { hebrew: "מיכל", english: "michal" },
      { hebrew: "דני", english: "danny" },
      { hebrew: "שירה", english: "shira" },
      { hebrew: "עומר", english: "omer" },
      { hebrew: "נועה", english: "noa" },
      { hebrew: "איתי", english: "itai" },
      { hebrew: "רונית", english: "ronit" },
      { hebrew: "גיא", english: "guy" },
      { hebrew: "ליאת", english: "liat" },
    ];
    const lastNames = [
      { hebrew: "כהן", english: "cohen" },
      { hebrew: "לוי", english: "levi" },
      { hebrew: "מזרחי", english: "mizrahi" },
      { hebrew: "פרידמן", english: "friedman" },
      { hebrew: "שפירא", english: "shapira" },
      { hebrew: "אברהם", english: "abraham" },
      { hebrew: "דוד", english: "david" },
      { hebrew: "יוסף", english: "yosef" },
      { hebrew: "משה", english: "moshe" },
      { hebrew: "שרה", english: "sara" },
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.english}.${lastName.english}${Math.floor(Math.random() * 100)}@gmail.com`;

    return {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${firstName.hebrew} ${lastName.hebrew}`,
      email,
      provider: "google",
    };
  }

  /**
   * יוצר פרופיל מדעי רנדומלי אבל עקבי
   */
  private generateScientificProfile(): ScientificUserProfile {
    // בחירת גיל שמשפיע על שאר הפרמטרים
    const ageRanges = ["16-25", "26-35", "36-45", "46-55", "56-65", "65+"];
    const ageRange = ageRanges[Math.floor(Math.random() * ageRanges.length)];

    // רמת ניסיון בהתאם לגיל (צעירים יותר = פחות ניסיון בממוצע)
    const experienceLevels = [
      "complete_beginner",
      "some_experience",
      "intermediate",
      "advanced",
      "athlete",
    ];
    let fitnessExperience: string;

    if (ageRange === "16-25") {
      fitnessExperience = experienceLevels[Math.floor(Math.random() * 3)]; // 0-2
    } else if (ageRange === "26-35" || ageRange === "36-45") {
      fitnessExperience = experienceLevels[Math.floor(Math.random() * 4)]; // 0-3
    } else {
      fitnessExperience = experienceLevels[Math.floor(Math.random() * 5)]; // 0-4
    }

    // מטרה עיקרית בהתאם לגיל
    const goalsByAge = {
      "16-25": ["build_muscle", "sport_performance", "increase_energy"],
      "26-35": [
        "build_muscle",
        "lose_weight",
        "feel_stronger",
        "reduce_stress",
      ],
      "36-45": [
        "lose_weight",
        "improve_health",
        "reduce_stress",
        "increase_energy",
      ],
      "46-55": [
        "improve_health",
        "feel_stronger",
        "reduce_stress",
        "improve_posture",
      ],
      "56-65": [
        "improve_health",
        "feel_stronger",
        "improve_posture",
        "increase_energy",
      ],
      "65+": ["improve_health", "feel_stronger", "improve_posture"],
    };

    const ageGoals = goalsByAge[ageRange as keyof typeof goalsByAge];
    const primaryGoal = ageGoals[Math.floor(Math.random() * ageGoals.length)];

    // ימי אימון בהתאם לרמת ניסיון
    const daysByExperience = {
      complete_beginner: [2, 3],
      some_experience: [3, 4],
      intermediate: [3, 4, 5],
      advanced: [4, 5, 6],
      athlete: [5, 6],
    };

    const possibleDays =
      daysByExperience[fitnessExperience as keyof typeof daysByExperience];
    const availableDays =
      possibleDays[Math.floor(Math.random() * possibleDays.length)];

    // משך אימון בהתאם לזמינות
    const sessionDurations = [30, 45, 60, 75, 90];
    const sessionDuration =
      sessionDurations[Math.floor(Math.random() * sessionDurations.length)];

    // אזורי התמקדות
    const bodyFocusOptions = [
      "upper_body",
      "core",
      "lower_body",
      "full_body",
      "flexibility",
      "cardio",
    ];
    const bodyFocusAreas = this.selectRandomItems(
      bodyFocusOptions,
      1 + Math.floor(Math.random() * 3)
    );

    // מיקום אימון
    const workoutLocations = [
      "home_only",
      "gym_only",
      "both",
      "outdoor",
      "flexible",
    ];
    const workoutLocation =
      workoutLocations[Math.floor(Math.random() * workoutLocations.length)];

    // ציוד על בסיס מיקום
    let availableEquipment: string[];
    if (workoutLocation === "gym_only" || workoutLocation === "both") {
      availableEquipment = ["full_gym", "dumbbells", "barbell", "pull_up_bar"];
    } else if (workoutLocation === "home_only") {
      availableEquipment = this.selectRandomItems(
        ["bodyweight", "dumbbells", "resistance_bands", "kettlebell"],
        1 + Math.floor(Math.random() * 3)
      );
    } else {
      availableEquipment = ["bodyweight", "resistance_bands"];
    }

    // פציעות קודמות (יותר נפוצות בגילאים מבוגרים)
    const possibleInjuries = [
      "back",
      "knee",
      "shoulder",
      "neck",
      "wrist",
      "ankle",
    ];
    let previousInjuries: string[] = [];

    if (ageRange === "36-45" && Math.random() < 0.3) {
      previousInjuries = this.selectRandomItems(possibleInjuries, 1);
    } else if (ageRange === "46-55" && Math.random() < 0.4) {
      previousInjuries = this.selectRandomItems(
        possibleInjuries,
        1 + Math.floor(Math.random() * 2)
      );
    } else if (ageRange === "56-65" && Math.random() < 0.5) {
      previousInjuries = this.selectRandomItems(
        possibleInjuries,
        1 + Math.floor(Math.random() * 2)
      );
    } else if (ageRange === "65+" && Math.random() < 0.6) {
      previousInjuries = this.selectRandomItems(
        possibleInjuries,
        1 + Math.floor(Math.random() * 3)
      );
    }

    // סוג מוטיבציה
    const motivationTypes = [
      "health",
      "appearance",
      "strength",
      "energy",
      "stress_relief",
      "social",
      "competition",
      "routine",
    ];
    const motivationType =
      motivationTypes[Math.floor(Math.random() * motivationTypes.length)];

    // סגנון אימון
    const workoutStyles = [
      "steady_consistent",
      "varied_fun",
      "challenging_intense",
      "quick_efficient",
      "relaxed_mindful",
    ];
    const workoutStylePreference =
      workoutStyles[Math.floor(Math.random() * workoutStyles.length)];

    return {
      ageRange,
      gender: Math.random() < 0.5 ? "male" : "female",
      bodyAcceptance: 1 + Math.floor(Math.random() * 5),
      fitnessExperience,
      currentActivity: this.mapExperienceToActivity(fitnessExperience),
      primaryGoal,
      bodyFocusAreas,
      availableDays,
      sessionDuration,
      workoutLocation,
      availableEquipment,
      healthStatus: this.generateHealthStatus(ageRange),
      previousInjuries:
        previousInjuries.length > 0 ? previousInjuries : undefined,
      motivationType,
      workoutStylePreference,
      fitnessTestInterest: Math.random() < 0.7 ? "yes_simple" : "no_thanks",
    };
  }

  /**
   * בוחר פריטים רנדומליים מתוך מערך
   */
  private selectRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * ממפה רמת ניסיון לפעילות נוכחית
   */
  private mapExperienceToActivity(experience: string): string {
    const mapping = {
      complete_beginner: "sedentary",
      some_experience: "light_active",
      intermediate: "moderately_active",
      advanced: "very_active",
      athlete: "extremely_active",
    };
    return mapping[experience as keyof typeof mapping] || "moderately_active";
  }

  /**
   * יוצר מצב בריאותי בהתאם לגיל
   */
  private generateHealthStatus(ageRange: string): string {
    const healthByAge = {
      "16-25": ["excellent", "good"],
      "26-35": ["excellent", "good", "fair"],
      "36-45": ["good", "fair", "some_issues"],
      "46-55": ["good", "fair", "some_issues"],
      "56-65": ["fair", "some_issues", "managing_conditions"],
      "65+": ["fair", "some_issues", "managing_conditions"],
    };

    const options = healthByAge[ageRange as keyof typeof healthByAge];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * יוצר המלצות AI מותאמות
   */
  private generateAIRecommendations(profile: ScientificUserProfile) {
    console.log("🤖 יוצר המלצות AI...");

    // יצירת תוכנית אימון מדעית
    const currentWorkoutPlan = scientificAI.generateScientificWorkout(profile);

    // חישוב קלוריות יומיות (נתונים מדומים)
    const estimatedWeight =
      profile.gender === "male"
        ? 75 + Math.random() * 25
        : 60 + Math.random() * 20;
    const estimatedHeight =
      profile.gender === "male"
        ? 175 + Math.random() * 15
        : 165 + Math.random() * 15;

    const nutritionPlan = scientificAI.calculateDailyCalories(
      profile,
      estimatedWeight,
      estimatedHeight
    );

    // יצירת אזורי דופק (private method - נצטרך לגשת אליה)
    const age = this.extractAgeFromRange(profile.ageRange);
    const maxHR = 220 - age;
    const heartRateZones = {
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

    // תוכנית התקדמות
    const progressionPlan = {
      currentPhase: "building",
      weeklyIncrease: currentWorkoutPlan.progression.weeklyIncrease,
      deloadWeek: currentWorkoutPlan.progression.deloadWeek,
      nextMilestone: this.generateNextMilestone(profile.primaryGoal),
      expectedTimeframe: "4-6 שבועות",
    };

    return {
      currentWorkoutPlan,
      nutritionPlan,
      heartRateZones,
      progressionPlan,
    };
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
   * יוצר מטרת ביניים הבאה
   */
  private generateNextMilestone(primaryGoal: string): string {
    const milestones = {
      build_muscle: "הגדלת משקל בתרגילים בסיסיים ב-10%",
      lose_weight: "ירידה של 2-3 ק״ג במשקל",
      feel_stronger: "ביצוע 10 שכיבות סמיכה נוספות",
      improve_health: "שיפור בבדיקות דם ורמת אנרגיה",
      increase_energy: "הרגשה של אנרגיה לאורך כל היום",
      reduce_stress: "ירידה ברמת הלחץ והשקטת הנפש",
      improve_posture: "עמידה זקופה ללא כאבי גב",
      sport_performance: "שיפור ביצועים ב-15% בספורט הנבחר",
    };

    return (
      milestones[primaryGoal as keyof typeof milestones] || "שיפור כללי בכושר"
    );
  }

  /**
   * יוצר היסטוריית פעילות של 6 חודשים
   */
  private async generateActivityHistory(profile: ScientificUserProfile) {
    console.log("📅 יוצר היסטוריית 6 חודשים...");

    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

    const workouts = [];
    const measurements = [];
    const achievements = [];

    // יצירת אימונים עקביים
    let currentDate = new Date(sixMonthsAgo);
    let totalVolume = 0;
    let workoutCount = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // דפוס אימון לפי תדירות
    const workoutDays = this.generateWorkoutPattern(profile.availableDays);

    while (currentDate <= now) {
      const dayOfWeek = currentDate.getDay();

      // בדוק אם היום הוא יום אימון
      if (workoutDays.includes(dayOfWeek)) {
        // הסתברות לדילוג על אימון (נמוכה יותר למנוסים)
        const skipProbability = this.getSkipProbability(
          profile.fitnessExperience
        );

        if (Math.random() > skipProbability) {
          const workout = this.generateSingleWorkout(
            currentDate,
            profile,
            workoutCount
          );
          workouts.push(workout);

          totalVolume += workout.exercises.reduce(
            (sum: number, ex: any) =>
              sum + (ex.weight || 0) * ex.reps * ex.sets,
            0
          );
          workoutCount++;
          tempStreak++;

          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        } else {
          tempStreak = 0;
        }
      }

      // הוסף מדידת משקל אחת לשבועיים
      if (currentDate.getDate() === 1 || currentDate.getDate() === 15) {
        measurements.push(this.generateMeasurement(currentDate, profile));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // חשב streak נוכחי (אימונים אחרונים)
    currentStreak = this.calculateCurrentStreak(workouts);

    // יצור הישגים
    achievements.push(...this.generateAchievements(workouts, profile));

    return {
      workouts,
      measurements,
      achievements,
    };
  }

  /**
   * יוצר דפוס ימי אימון
   */
  private generateWorkoutPattern(availableDays: number): number[] {
    const allDays = [0, 1, 2, 3, 4, 5, 6]; // א'-ש'
    const workoutDays = [];

    // בחר ימים רנדומליים אבל מאוזנים
    const shuffled = [...allDays].sort(() => 0.5 - Math.random());

    for (let i = 0; i < availableDays; i++) {
      workoutDays.push(shuffled[i]);
    }

    return workoutDays.sort();
  }

  /**
   * מחזיר הסתברות לדילוג על אימון
   */
  private getSkipProbability(experience: string): number {
    const probabilities = {
      complete_beginner: 0.25, // 25% דילוג
      some_experience: 0.15, // 15% דילוג
      intermediate: 0.1, // 10% דילוג
      advanced: 0.05, // 5% דילוג
      athlete: 0.02, // 2% דילוג
    };

    return probabilities[experience as keyof typeof probabilities] || 0.15;
  }

  /**
   * יוצר אימון בודד עם זמן אמיתי
   */
  private generateSingleWorkout(
    date: Date,
    profile: ScientificUserProfile,
    workoutIndex: number
  ) {
    const workoutTypes = ["strength", "cardio", "mixed", "flexibility"];
    const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];

    // צור תרגילים בהתאם לפרופיל
    const exercises = this.generateWorkoutExercises(profile, type);

    // דירוג ומשוב רנדומלי אבל הגיוני
    const rating = this.generateWorkoutRating(
      profile.fitnessExperience,
      workoutIndex
    );
    const difficulty = this.generateDifficultyLevel(profile.fitnessExperience);
    const enjoyment = this.generateEnjoymentLevel(profile.motivationType);

    // יצירת זמן אמיתי לאימון
    const workoutTime = this.generateRealisticWorkoutTime(profile, date);

    return {
      date: date.toISOString().split("T")[0],
      completedAt: workoutTime.toISOString(), // זמן מלא עם שעה
      startTime: workoutTime.toISOString(),
      endTime: new Date(
        workoutTime.getTime() +
          (profile.sessionDuration + Math.floor(Math.random() * 20) - 10) *
            60000
      ).toISOString(),
      type,
      duration: profile.sessionDuration + Math.floor(Math.random() * 20) - 10, // ±10 דקות
      exercises,
      feedback: {
        rating,
        difficulty,
        enjoyment,
        notes: this.generateWorkoutNotes(rating, difficulty),
        mood: this.generateMoodEmoji(rating),
      },
      personalRecords:
        Math.random() < 0.1
          ? this.generatePersonalRecords(exercises)
          : undefined,
    };
  }

  /**
   * יוצר זמן אמיתי לאימון בהתאם לפרופיל המשתמש
   */
  private generateRealisticWorkoutTime(
    profile: ScientificUserProfile,
    date: Date
  ): Date {
    const workoutDate = new Date(date);

    // זמני אימון מועדפים לפי סוג המוטיבציה
    const preferredTimes: { [key: string]: number[] } = {
      routine: [6, 7, 8, 18, 19, 20], // בוקר מוקדם או ערב
      social: [9, 10, 11, 17, 18, 19], // שעות חברתיות
      energy: [7, 8, 9, 18, 19], // שעות אנרגיה גבוהה
      strength: [16, 17, 18, 19, 20], // אחר הצהריים-ערב
      weight_loss: [6, 7, 8, 19, 20], // בוקר או ערב מאוחר
    };

    // זמני אימון לפי מקום
    const locationTimes: { [key: string]: number[] } = {
      home_only: [6, 7, 8, 19, 20, 21], // גמיש יותר בבית
      gym_only: [8, 9, 10, 17, 18, 19, 20], // שעות חדר כושר
      outdoor: [7, 8, 9, 17, 18, 19], // תלוי באור יום
      both: [6, 7, 8, 17, 18, 19, 20, 21], // הכי גמיש
    };

    // בחר זמנים מועדפים
    const motivationTimes = preferredTimes[profile.motivationType] || [
      8, 18, 19,
    ];
    const locationBasedTimes = locationTimes[profile.workoutLocation] || [
      8, 18, 19,
    ];

    // שלב את הזמנים
    const combinedTimes = motivationTimes.filter((time) =>
      locationBasedTimes.includes(time)
    );
    const finalTimes =
      combinedTimes.length > 0 ? combinedTimes : motivationTimes;

    // בחר שעה רנדומלית מהזמנים המועדפים
    const preferredHour =
      finalTimes[Math.floor(Math.random() * finalTimes.length)];

    // הוסף וריאציה קטנה (±30 דקות)
    const minuteVariation = Math.floor(Math.random() * 60) - 30;
    const totalMinutes = preferredHour * 60 + minuteVariation;

    const finalHour = Math.floor(totalMinutes / 60);
    const finalMinute = totalMinutes % 60;

    // וודא שהשעות הגיוניות (6-22)
    const clampedHour = Math.max(6, Math.min(22, finalHour));
    const clampedMinute = Math.max(0, Math.min(59, finalMinute));

    workoutDate.setHours(clampedHour, clampedMinute, 0, 0);
    return workoutDate;
  }

  /**
   * יוצר תרגילים לאימון
   */
  private generateWorkoutExercises(
    profile: ScientificUserProfile,
    workoutType: string
  ) {
    // תרגילים בסיסיים לפי סוג אימון
    const exercisesByType = {
      strength: ["שכיבות סמיכה", "סקוואט", "מתח", "לחיצת כתפיים", "שכיבות בטן"],
      cardio: [
        "ריצה במקום",
        "קפיצות",
        "רכיבה על אופניים",
        "מדרגות",
        "ריצה חופשית",
      ],
      mixed: ["שכיבות סמיכה", "סקוואט", "קפיצות", "פלאנק", "לאנג'ס"],
      flexibility: ["מתיחות", "יוגה", "פילאטיס", "גלילת קצף", "נשימות עמוקות"],
    };

    const availableExercises =
      exercisesByType[workoutType as keyof typeof exercisesByType];
    const exerciseCount = 3 + Math.floor(Math.random() * 4); // 3-6 תרגילים

    const selectedExercises = this.selectRandomItems(
      availableExercises,
      exerciseCount
    );

    return selectedExercises.map((name) => ({
      name,
      sets: 2 + Math.floor(Math.random() * 4), // 2-5 סטים
      reps: 8 + Math.floor(Math.random() * 8), // 8-15 חזרות
      weight:
        workoutType === "strength"
          ? 10 + Math.floor(Math.random() * 40)
          : undefined, // 10-50 ק״ג
      duration:
        workoutType === "cardio"
          ? 5 + Math.floor(Math.random() * 20)
          : undefined, // 5-25 דקות
    }));
  }

  /**
   * יוצר דירוג אימון הגיוני
   */
  private generateWorkoutRating(
    experience: string,
    workoutIndex: number
  ): number {
    // מתחילים בדירוגים נמוכים יותר, משתפרים עם הזמן
    let baseRating = 3;

    if (experience === "complete_beginner") {
      baseRating = 2.5 + workoutIndex * 0.01; // שיפור הדרגתי
    } else if (experience === "some_experience") {
      baseRating = 3 + workoutIndex * 0.005;
    } else {
      baseRating = 3.5 + Math.random() * 1;
    }

    // הוסף רעש רנדומלי
    baseRating += (Math.random() - 0.5) * 0.8;

    return Math.max(1, Math.min(5, Math.round(baseRating * 2) / 2)); // עגל ל-0.5
  }

  /**
   * יוצר רמת קושי
   */
  private generateDifficultyLevel(
    experience: string
  ): "easy" | "medium" | "hard" {
    const difficulties = ["easy", "medium", "hard"] as const;

    if (experience === "complete_beginner") {
      return difficulties[Math.floor(Math.random() * 2)]; // easy או medium
    } else if (experience === "advanced" || experience === "athlete") {
      return difficulties[1 + Math.floor(Math.random() * 2)]; // medium או hard
    } else {
      return difficulties[Math.floor(Math.random() * 3)]; // הכל
    }
  }

  /**
   * יוצר רמת הנאה
   */
  private generateEnjoymentLevel(
    motivationType: string
  ): "low" | "medium" | "high" {
    const enjoyments = ["low", "medium", "high"] as const;

    // אנשים עם מוטיבציה חברתית או אנרגטית נהנים יותר
    if (motivationType === "social" || motivationType === "energy") {
      return enjoyments[1 + Math.floor(Math.random() * 2)]; // medium או high
    } else if (motivationType === "routine") {
      return enjoyments[Math.floor(Math.random() * 2)]; // low או medium
    } else {
      return enjoyments[Math.floor(Math.random() * 3)]; // הכל
    }
  }

  /**
   * יוצר הערות אימון
   */
  private generateWorkoutNotes(
    rating: number,
    difficulty: "easy" | "medium" | "hard"
  ): string {
    const notes = {
      low: ["קשה היום", "לא הרגשתי טוב", "צריך לנוח יותר", "המוטיבציה נמוכה"],
      medium: ["בסדר גמור", "אימון רגיל", "הרגשתי טוב", "התקדמתי קצת"],
      high: [
        "אימון מעולה!",
        "הרגשתי חזק",
        "שברתי שיא!",
        "מוטיבציה גבוהה",
        "אהבתי את האימון",
      ],
    };

    let category: "low" | "medium" | "high";
    if (rating <= 2.5) category = "low";
    else if (rating <= 4) category = "medium";
    else category = "high";

    const possibleNotes = notes[category];
    return possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
  }

  /**
   * יוצר אימוג'י מצב רוח
   */
  private generateMoodEmoji(rating: number): string {
    const moods = {
      low: ["😔", "😤", "😓", "🙄"],
      medium: ["😐", "🙂", "😊", "👍"],
      high: ["😀", "💪", "🔥", "⭐", "🎉"],
    };

    let category: "low" | "medium" | "high";
    if (rating <= 2.5) category = "low";
    else if (rating <= 4) category = "medium";
    else category = "high";

    const possibleMoods = moods[category];
    return possibleMoods[Math.floor(Math.random() * possibleMoods.length)];
  }

  /**
   * יוצר שיאים אישיים
   */
  private generatePersonalRecords(exercises: any[]): Array<{
    type: "weight" | "volume" | "reps";
    exerciseName: string;
    value: number;
    improvement: number;
  }> {
    const records = [];

    // בחר תרגיל רנדומלי עם משקל
    const weightExercises = exercises.filter((ex) => ex.weight);
    if (weightExercises.length > 0) {
      const exercise = weightExercises[0];
      records.push({
        type: "weight" as const,
        exerciseName: exercise.name,
        value: exercise.weight,
        improvement: 2.5 + Math.random() * 5, // 2.5-7.5 ק״ג שיפור
      });
    }

    return records;
  }

  /**
   * יוצר מדידה
   */
  private generateMeasurement(date: Date, profile: ScientificUserProfile) {
    const baseWeight = profile.gender === "male" ? 75 : 60;
    const weightVariation = (Math.random() - 0.5) * 4; // ±2 ק״ג

    return {
      date: date.toISOString().split("T")[0],
      weight: baseWeight + weightVariation,
      bodyFat: 15 + Math.random() * 10, // 15-25%
      measurements: {
        chest: 90 + Math.random() * 20,
        waist: 80 + Math.random() * 15,
        hips: 95 + Math.random() * 15,
        arms: 30 + Math.random() * 10,
      },
    };
  }

  /**
   * מחשב streak נוכחי
   */
  private calculateCurrentStreak(workouts: any[]): number {
    if (workouts.length === 0) return 0;

    // מיין לפי תאריך
    const sortedWorkouts = workouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);

    // בדוק לאחור מהיום
    for (let i = 0; i < 14; i++) {
      // בדוק עד 14 ימים אחורה
      const dateStr = checkDate.toISOString().split("T")[0];
      const workoutOnDate = sortedWorkouts.find((w) => w.date === dateStr);

      if (workoutOnDate) {
        streak++;
      } else if (streak > 0) {
        break; // הפסק אם יש פער
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  }

  /**
   * יוצר הישגים
   */
  private generateAchievements(
    workouts: any[],
    profile: ScientificUserProfile
  ) {
    const achievements = [];

    // הישג של 10 אימונים
    if (workouts.length >= 10) {
      achievements.push({
        date: workouts[9].date,
        type: "milestone" as const,
        title: "10 אימונים ראשונים!",
        description: "סיימת בהצלחה 10 אימונים - המסע רק מתחיל! 💪",
      });
    }

    // הישג של חודש שלם
    if (workouts.length >= 20) {
      achievements.push({
        date: workouts[19].date,
        type: "milestone" as const,
        title: "חודש מלא של אימונים!",
        description: "התמדת חודש שלם - אתה על הדרך הנכונה! 🏆",
      });
    }

    // הישג streak
    const maxStreak = this.calculateMaxStreak(workouts);
    if (maxStreak >= 7) {
      achievements.push({
        date: workouts[Math.floor(workouts.length / 2)].date,
        type: "workout_streak" as const,
        title: `${maxStreak} ימי אימון ברצף!`,
        description: "עקביות מדהימה - כך זה נעשה! 🔥",
      });
    }

    return achievements;
  }

  /**
   * מחשב streak מקסימלי
   */
  private calculateMaxStreak(workouts: any[]): number {
    if (workouts.length === 0) return 0;

    const sortedWorkouts = workouts.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedWorkouts.length; i++) {
      const prevDate = new Date(sortedWorkouts[i - 1].date);
      const currDate = new Date(sortedWorkouts[i].date);
      const daysDiff =
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff <= 2) {
        // עד יומיים בינהם
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(maxStreak, currentStreak);
  }

  /**
   * מחשב סטטיסטיקות נוכחיות
   */
  private calculateCurrentStats(
    activityHistory: any,
    profile: ScientificUserProfile
  ) {
    const workouts = activityHistory.workouts;

    const totalVolume = workouts.reduce((sum: number, workout: any) => {
      return (
        sum +
        workout.exercises.reduce((exSum: number, ex: any) => {
          return exSum + (ex.weight || 0) * ex.reps * ex.sets;
        }, 0)
      );
    }, 0);

    const averageRating =
      workouts.length > 0
        ? workouts.reduce((sum: number, w: any) => sum + w.feedback.rating, 0) /
          workouts.length
        : 0;

    // מצא תרגילים פופולריים
    const exerciseCounts: Record<string, number> = {};
    workouts.forEach((workout: any) => {
      workout.exercises.forEach((ex: any) => {
        exerciseCounts[ex.name] = (exerciseCounts[ex.name] || 0) + 1;
      });
    });

    const favoriteExercises = Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    return {
      totalWorkouts: workouts.length,
      totalVolume: Math.round(totalVolume),
      averageRating: Math.round(averageRating * 10) / 10,
      currentStreak: this.calculateCurrentStreak(workouts),
      favoriteExercises,
      strongestMuscleGroups: profile.bodyFocusAreas.slice(0, 2),
      improvementAreas: ["גמישות", "סיבולת"],
    };
  }

  /**
   * יוצר נתוני תאימות לאחור
   */
  private generateBackwardCompatibilityData(profile: ScientificUserProfile) {
    // ממיר את הפרופיל המדעי לפורמט הישן
    const answers: Record<string, any> = {
      // נתונים מפרופיל מדעי
      age_range: profile.ageRange,
      gender: profile.gender,
      fitness_experience: profile.fitnessExperience,
      primary_goal: profile.primaryGoal,
      available_days: profile.availableDays,
      session_duration: profile.sessionDuration,
      workout_location: profile.workoutLocation,
      available_equipment: profile.availableEquipment,
      motivation_type: profile.motivationType,
      workout_style: profile.workoutStylePreference,

      // נתונים נוספים לתאימות
      body_acceptance: profile.bodyAcceptance,
      body_focus_areas: profile.bodyFocusAreas,
      health_status: profile.healthStatus,
      previous_injuries: profile.previousInjuries,
      fitness_test_interest: profile.fitnessTestInterest,
    };

    return {
      answers,
      completedAt: new Date().toISOString(),
      version: "2.0-scientific",
      metadata: {
        scientificProfile: true,
        generatedRandomly: true,
        devMode: true,
        fullHistoryGenerated: true,
      },
    };
  }
}

// יצוא singleton
export const scientificUserGenerator = new ScientificUserGenerator();
