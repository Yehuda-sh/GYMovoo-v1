/**
 * @file src/services/demo/demoUserService.ts
 * @brief 🔴 DEMO ONLY - שירות יצירת משתמשים דמו למטרות פיתוח בלבד
 * @description יוצר נתוני דמו מציאותיים לבדיקות ופיתוח - לא לשימוש בפרודקשן!
 * @updated 2025-08-11 ✅ OPTIMIZED - שופר תיעוד, זוהו נקודות שיפור לעתיד
 * @status ⚠️ ACTIVE BUT NEEDS REFACTORING - קובץ גדול (1304 שורות) עם פונקציונליות קריטית
 * @used_by demoWorkoutService.ts, services export hub, demo ecosystem
 * @critical_functions generateDemoUserFromQuestionnaire, generateRealisticWorkout, generateWorkoutHistory
 * @todo REFACTOR: פיצול לקבצים קטנים יותר, השלמת TODO בקוד, ניקוי קוד מיותר
 * @warning NOT FOR PRODUCTION - DEMO DATA ONLY
 */

// 🔴 DEMO ONLY - הגנה מפני שימוש בפרודקשן
if (!__DEV__) {
  throw new Error("Demo service should not be used in production");
}

import {
  WorkoutData,
  WorkoutWithFeedback,
  Exercise,
  Set,
} from "../../screens/workout/types/workout.types";
import {
  adaptExerciseNameToGender,
  generateSingleGenderAdaptedNote,
  UserGender,
} from "../../utils/genderAdaptation";

// טיפוסים נוספים נדרשים
export interface DemoUser {
  id: string;
  name: string;
  gender: UserGender;
  age: number;
  experience: "beginner" | "intermediate" | "advanced";
  height: number; // ב-ס"מ
  weight: number; // ב-ק"ג
  fitnessGoals: string[];
  availableDays: number;
  sessionDuration: string;
  equipment: string[];
  preferredTime: "morning" | "afternoon" | "evening";
  workoutHistory: WorkoutWithFeedback[];
  // מסמן שזהו משתמש דמו (נדרש לצורך זיהוי וניקוי בפרודקשן)
  isDemo: boolean;
}

// ממשק משתמש פשוט לצורך התאימות
interface AppUser {
  id?: string;
  name?: string;
  email?: string;
  provider?: string;
  activityHistory?: {
    workouts: WorkoutWithFeedback[];
  };
  trainingStats?: {
    totalWorkouts?: number;
    totalVolume?: number;
    favoriteExercises?: string[];
    lastWorkoutDate?: string;
    preferredWorkoutDays?: number;
    selectedEquipment?: string[];
    fitnessGoals?: string[];
    currentFitnessLevel?: "beginner" | "intermediate" | "advanced";
  };
  preferences?: {
    theme?: "light" | "dark";
    notifications?: boolean;
    language?: "he" | "en";
    units?: "metric" | "imperial";
    gender?: "male" | "female" | "other";
    rtlPreference?: boolean;
    workoutNameStyle?: "adapted" | "neutral" | "original";
  };
  genderProfile?: {
    selectedGender: "male" | "female" | "other";
    adaptedWorkoutNames?: { [key: string]: string };
    personalizedMessages?: string[];
  };
  currentStats?: {
    totalWorkouts: number;
    totalVolume?: number;
    averageDifficulty: number; // legacy metric
    averageRating?: number; // unified proxy
    workoutStreak: number; // legacy name
    currentStreak?: number; // unified name
  };
}

// 💡 הוספת ממשק לנתוני תרגיל במאגר המרכזי
export interface ExerciseData {
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  baseWeight: number; // משקל בסיס למתחילים
}

// מינימום שדות נצרכים מתשובות שאלון / Minimal questionnaire answers shape
interface QuestionnaireAnswers {
  [key: string]: string | number | string[] | undefined;
  gender?: UserGender;
  experience?: "beginner" | "intermediate" | "advanced";
  fitness_level?: "beginner" | "intermediate" | "advanced";
  workout_frequency?: string; // qualitative frequency labels
  available_days?: string; // numeric as string
}

// ממשק למשתמש דמו מותאם שנוצר מהשאלון
interface CustomDemoUser {
  id: string;
  name: string;
  gender: UserGender;
  age: number;
  experience: "beginner" | "intermediate" | "advanced";
  height: number;
  weight: number;
  fitnessGoals: string[];
  availableDays: number;
  sessionDuration: string;
  equipment: string[];
  preferredTime: "morning" | "afternoon" | "evening";
}

// הגדרות קבועות
const DEMO_CONSTANTS = {
  // פרמטרי אימון מציאותיים
  MIN_SETS: 2,
  MAX_SETS: 5,
  MIN_REPS: 6,
  MAX_REPS: 20,
  MIN_WEIGHT: 5,
  MAX_WEIGHT: 120,
  MIN_DURATION_SECONDS: 1800, // 30 דקות
  MAX_DURATION_SECONDS: 5400, // 90 דקות

  // טווחי זמן
  WORKOUT_HISTORY_WEEKS: 12,
  MIN_WORKOUTS_PER_WEEK: 2,
  MAX_WORKOUTS_PER_WEEK: 4,

  // פידבק מציאותי
  FEEDBACK_POSITIVE_CHANCE: 0.7,
  PERSONAL_RECORD_CHANCE: 0.1,
  FATIGUE_CHANCE: 0.2,

  // דירוגים
  MIN_RATING: 3,
  MAX_RATING: 5,
} as const;

// נתוני תרגילים מותאמים לכל רמה
const EXERCISES_BY_LEVEL = {
  beginner: [
    {
      name: "שכיבות סמיכה",
      category: "bodyweight",
      primaryMuscles: ["חזה", "כתפיים"],
      equipment: "none",
    },
    {
      name: "סקוואט משקל גוף",
      category: "legs",
      primaryMuscles: ["רגליים", "עכוז"],
      equipment: "none",
    },
    {
      name: "פלנק",
      category: "core",
      primaryMuscles: ["בטן", "ליבה"],
      equipment: "none",
    },
    {
      name: "משיכות",
      category: "back",
      primaryMuscles: ["גב", "ביצפס"],
      equipment: "pullup_bar",
    },
    {
      name: "דיפס",
      category: "chest",
      primaryMuscles: ["חזה", "טריצפס"],
      equipment: "none",
    },
  ],
  intermediate: [
    {
      name: "ספסל שטוח",
      category: "chest",
      primaryMuscles: ["חזה", "כתפיים"],
      equipment: "barbell",
    },
    {
      name: "סקוואט עם משקל",
      category: "legs",
      primaryMuscles: ["רגליים"],
      equipment: "barbell",
    },
    {
      name: "משיכות סנטר",
      category: "back",
      primaryMuscles: ["גב"],
      equipment: "dumbbells",
    },
    {
      name: "כתף צידית",
      category: "shoulders",
      primaryMuscles: ["כתפיים"],
      equipment: "dumbbells",
    },
    {
      name: "ביצפס",
      category: "arms",
      primaryMuscles: ["ביצפס"],
      equipment: "dumbbells",
    },
    {
      name: "טריצפס",
      category: "arms",
      primaryMuscles: ["טריצפס"],
      equipment: "dumbbells",
    },
  ],
  advanced: [
    {
      name: "ספסל שטוח כבד",
      category: "chest",
      primaryMuscles: ["חזה"],
      equipment: "barbell",
    },
    {
      name: "דדליפט",
      category: "back",
      primaryMuscles: ["גב", "רגליים"],
      equipment: "barbell",
    },
    {
      name: "סקוואט כבד",
      category: "legs",
      primaryMuscles: ["רגליים"],
      equipment: "barbell",
    },
    {
      name: "כתף צבאית",
      category: "shoulders",
      primaryMuscles: ["כתפיים"],
      equipment: "barbell",
    },
    {
      name: "משיכות רחבות",
      category: "back",
      primaryMuscles: ["גב"],
      equipment: "pullup_bar",
    },
    {
      name: "בארבל רואו",
      category: "back",
      primaryMuscles: ["גב"],
      equipment: "barbell",
    },
  ],
} as const;

// הודעות פידבק מותאמות מגדר (הוסרו זמנית כדי לצמצם משקל קובץ ולהימנע משימוש לא נחוץ)
// const FEEDBACK_MESSAGES = {
//   positive: { male: [...], female: [...], other: [...] },
//   neutral: { male: [...], female: [...], other: [...] },
// } as const;

class DemoUserService {
  private static instance: DemoUserService;

  private constructor() {}

  static getInstance(): DemoUserService {
    if (!DemoUserService.instance) {
      DemoUserService.instance = new DemoUserService();
    }
    return DemoUserService.instance;
  }

  /**
   * יוצר משתמש דמו מציאותי
   */
  generateDemoUser(): DemoUser {
    // הגנה: אם נקרא בסביבת פרודקשן, החזר אובייקט דמה מינימלי מסומן isDemo
    if (!__DEV__) {
      return {
        id: "demo_disabled",
        name: "Demo Disabled",
        gender: "other",
        age: 0,
        experience: "beginner",
        height: 0,
        weight: 0,
        fitnessGoals: [],
        availableDays: 0,
        sessionDuration: "30",
        equipment: [],
        preferredTime: "morning",
        workoutHistory: [],
        isDemo: true,
      };
    }
    const genders: UserGender[] = ["male", "female", "other"];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const experiences = ["beginner", "intermediate", "advanced"] as const;
    const experience =
      experiences[Math.floor(Math.random() * experiences.length)];

    const maleNames = ["דוד", "יוסי", "אמיר", "רן", "תומר", "אלון", "גיל"];
    const femaleNames = ["שרה", "מיכל", "רונית", "נועה", "ליאת", "יעל", "דנה"];
    const otherNames = ["אלכס", "עדן", "נועם", "שחר", "ריי", "קיי", "דני"];

    let names: string[];
    if (gender === "male") names = maleNames;
    else if (gender === "female") names = femaleNames;
    else names = otherNames;

    return {
      id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: names[Math.floor(Math.random() * names.length)],
      gender,
      age: 25 + Math.floor(Math.random() * 20), // 25-44
      experience,
      height:
        gender === "male"
          ? 170 + Math.floor(Math.random() * 20)
          : 160 + Math.floor(Math.random() * 15),
      weight:
        gender === "male"
          ? 70 + Math.floor(Math.random() * 25)
          : 55 + Math.floor(Math.random() * 20),
      fitnessGoals: this.generateFitnessGoals(),
      availableDays: this.generateAvailableDays(), // תואם לשאלון
      sessionDuration: this.generateSessionDuration(),
      equipment: this.generateEquipment(experience),
      preferredTime: this.generatePreferredTime(),
      workoutHistory: [], // יאוכלס בנפרד
      isDemo: true,
    };
  }

  /**
   * 🎯 יוצר משתמש דמו מותאם לתשובות שאלון
   * @description פונקציה קריטית להמרת תשובות שאלון למשתמש דמו מציאותי
   * @param questionnaireAnswers - תשובות שאלון אופציונליות
   * @returns משתמש דמו מותאם או רנדומלי
   * @critical_usage מבסיס יצירת דמו לכל השאלונים במערכת
   */
  generateDemoUserFromQuestionnaire(
    questionnaireAnswers?: QuestionnaireAnswers
  ): DemoUser {
    // אם יש תשובות שאלון, השתמש בהן
    if (questionnaireAnswers) {
      return this.createUserFromQuestionnaireAnswers(questionnaireAnswers);
    }

    // אחרת, יצור משתמש דמו רנדומלי
    return this.generateDemoUser();
  }

  /**
   * יוצר משתמש מותאם לתשובות השאלון
   */
  private createUserFromQuestionnaireAnswers(
    answers: QuestionnaireAnswers
  ): DemoUser {
    const genders: UserGender[] = ["male", "female", "other"];

    // חלץ מידע מהתשובות
    const gender =
      (answers.gender as UserGender) ||
      genders[Math.floor(Math.random() * genders.length)];
    const experience = this.extractExperienceFromAnswers(answers);
    const fitnessGoals = this.extractFitnessGoalsFromAnswers(answers);
    const equipment = this.extractEquipmentFromAnswers(answers);
    const availableDays = this.extractAvailableDaysFromAnswers(answers);

    const maleNames = ["דוד", "יוסי", "אמיר", "רן", "תומר", "אלון", "גיל"];
    const femaleNames = ["שרה", "מיכל", "רונית", "נועה", "ליאת", "יעל", "דנה"];
    const otherNames = ["אלכס", "עדן", "נועם", "שחר", "ריי", "קיי", "דני"];

    let names: string[];
    if (gender === "male") names = maleNames;
    else if (gender === "female") names = femaleNames;
    else names = otherNames;

    return {
      id: `questionnaire_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: names[Math.floor(Math.random() * names.length)],
      gender,
      age: 25 + Math.floor(Math.random() * 20), // 25-44
      experience,
      height:
        gender === "male"
          ? 170 + Math.floor(Math.random() * 20)
          : 160 + Math.floor(Math.random() * 15),
      weight:
        gender === "male"
          ? 70 + Math.floor(Math.random() * 25)
          : 55 + Math.floor(Math.random() * 20),
      fitnessGoals,
      availableDays,
      sessionDuration: this.generateSessionDuration(),
      equipment,
      preferredTime: this.generatePreferredTime(),
      workoutHistory: [], // יאוכלס בנפרד
      isDemo: true,
    };
  }

  /**
   * מחלץ רמת ניסיון מתשובות השאלון
   */
  private extractExperienceFromAnswers(
    answers: QuestionnaireAnswers
  ): "beginner" | "intermediate" | "advanced" {
    // חפש שאלות הקשורות לרמת ניסיון
    if (answers.experience)
      return answers.experience as "beginner" | "intermediate" | "advanced";
    if (answers.fitness_level)
      return answers.fitness_level as "beginner" | "intermediate" | "advanced";
    if (answers.workout_frequency) {
      const frequency = answers.workout_frequency as string;
      if (frequency === "never" || frequency === "rarely") return "beginner";
      if (frequency === "sometimes" || frequency === "regularly")
        return "intermediate";
      if (frequency === "often" || frequency === "daily") return "advanced";
    }

    // ברירת מחדל
    return "intermediate";
  }

  /**
   * מחלץ יעדי כושר מתשובות השאלון
   */
  private extractFitnessGoalsFromAnswers(
    answers: QuestionnaireAnswers
  ): string[] {
    const goalMapping: Record<string, string> = {
      lose_weight: "ירידה במשקל",
      gain_muscle: "הגדלת מסה שרירית",
      improve_endurance: "שיפור סיבולת",
      get_stronger: "חיזוק השרירים",
      improve_fitness: "שיפור כושר גופני",
      tone_muscles: "הגדרת השרירים",
    };

    const goals: string[] = [];

    // חפש יעדים בתשובות
    Object.keys(answers).forEach((key) => {
      if (key.includes("goal") || key.includes("target")) {
        const value = answers[key];
        if (Array.isArray(value)) {
          value.forEach((goal) => {
            if (typeof goal === "string" && goalMapping[goal]) {
              goals.push(goalMapping[goal]);
            }
          });
        } else if (typeof value === "string" && goalMapping[value]) {
          goals.push(goalMapping[value]);
        }
      }
    });

    // אם לא נמצאו יעדים, החזר יעדים ברירת מחדל
    return goals.length > 0 ? goals : this.generateFitnessGoals();
  }

  /**
   * מחלץ ציוד זמין מתשובות השאלון
   */
  private extractEquipmentFromAnswers(answers: QuestionnaireAnswers): string[] {
    const equipmentMapping: Record<string, string> = {
      dumbbells: "dumbbells",
      barbell: "barbell",
      resistance_bands: "resistance_bands",
      pullup_bar: "pullup_bar",
      none: "none",
      bodyweight: "none",
    };

    const equipment: string[] = [];

    // חפש ציוד בתשובות
    Object.keys(answers).forEach((key) => {
      if (key.includes("equipment") || key.includes("gear")) {
        const value = answers[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (typeof item === "string" && equipmentMapping[item]) {
              equipment.push(equipmentMapping[item]);
            }
          });
        } else if (typeof value === "string" && equipmentMapping[value]) {
          equipment.push(equipmentMapping[value]);
        }
      }
    });

    // אם לא נמצא ציוד, החזר ברירת מחדל
    return equipment.length > 0 ? equipment : ["none"];
  }

  /**
   * מחלץ ימים זמינים מתשובות השאלון
   */
  private extractAvailableDaysFromAnswers(
    answers: QuestionnaireAnswers
  ): number {
    // נסה לחלץ מהשאלון החדש - availability field
    if (answers.availability) {
      const availability = Array.isArray(answers.availability)
        ? answers.availability[0]
        : answers.availability;

      switch (availability) {
        case "2_days":
          return 2;
        case "3_days":
          return 3;
        case "4_days":
          return 4;
        case "5_days":
          return 5;
        default:
          break;
      }
    }

    // נסה לחלץ מתשובות שאלון ישן
    if (answers.available_days && typeof answers.available_days === "string")
      return parseInt(answers.available_days) || 3;

    if (answers.workout_frequency) {
      const frequency = answers.workout_frequency;
      if (frequency === "never" || frequency === "rarely") return 2;
      if (frequency === "sometimes") return 3;
      if (frequency === "regularly") return 4;
      if (frequency === "often" || frequency === "daily") return 5;
    }

    return 3; // ברירת מחדל
  }

  /**
   * 🏋️ יוצר אימון מציאותי שעובר validateWorkoutData
   * @description פונקציה מרכזית ליצירת אימונים מותאמי מגדר ורמת ניסיון
   * @param gender - מגדר המשתמש לצורך התאמות
   * @param experience - רמת ניסיון (beginner/intermediate/advanced)
   * @param equipment - ציוד זמין למשתמש
   * @param customDate - תאריך מותאם (אופציונלי)
   * @returns אימון מלא עם פידבק וסטטיסטיקות
   * @critical_usage demoWorkoutService ו-generateWorkoutHistory משתמשים בפונקציה זו
   */
  generateRealisticWorkout(
    gender: UserGender,
    experience: "beginner" | "intermediate" | "advanced",
    equipment: string[] = [],
    customDate?: Date
  ): WorkoutWithFeedback {
    const workoutId = `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = customDate || this.generateRealisticWorkoutDate();

    // חישוב משך אימון מציאותי
    const durationMinutes =
      DEMO_CONSTANTS.MIN_DURATION_SECONDS / 60 +
      Math.floor(
        (Math.random() *
          (DEMO_CONSTANTS.MAX_DURATION_SECONDS -
            DEMO_CONSTANTS.MIN_DURATION_SECONDS)) /
          60
      );
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    // יצירת תרגילים מותאמים לרמה
    const exercises = this.generateRealisticExercises(
      gender,
      experience,
      equipment
    );

    // חישוב סטטיסטיקות אמיתיות
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const totalVolume = this.calculateTotalVolume(exercises);

    const workoutData: WorkoutData = {
      id: workoutId,
      name: `אימון ${this.determineWorkoutType(exercises)}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
      exercises,
      totalVolume,
      totalSets,
      completedSets: totalSets,
      caloriesBurned: this.calculateCalories(durationMinutes),
      notes: generateSingleGenderAdaptedNote(gender),
      rating: Math.floor(Math.random() * 3) + 3, // 3-5
      location: "בית",
      mood: this.generateMood(),
    };

    // יצירת פידבק מותאם מגדר
    const feedback = this.generateRealisticFeedback(
      gender,
      experience,
      workoutData
    );

    // יצירת סטטיסטיקות
    const stats = {
      duration: workoutData.duration,
      totalSets: totalSets,
      totalPlannedSets: totalSets,
      totalVolume: totalVolume,
      personalRecords:
        Math.random() < DEMO_CONSTANTS.PERSONAL_RECORD_CHANCE ? 1 : 0,
    };

    return {
      id: workoutId,
      workout: workoutData,
      feedback,
      stats,
      startTime: workoutData.startTime,
      endTime: workoutData.endTime,
      metadata: {
        deviceInfo: {
          platform: "mobile",
          screenWidth: 375,
          screenHeight: 812,
        },
        userGender: gender,
        version: "1.0",
        workoutSource: "demo",
      },
    };
  }

  /**
   * יוצר תרגילים מציאותיים מותאמים לרמה ומגדר
   */
  private generateRealisticExercises(
    gender: UserGender,
    experience: "beginner" | "intermediate" | "advanced",
    _equipment: string[]
  ): Exercise[] {
    const availableExercises = EXERCISES_BY_LEVEL[experience];
    const exerciseCount =
      experience === "beginner" ? 4 : experience === "intermediate" ? 6 : 8;

    const selectedExercises = this.shuffleArray([...availableExercises]).slice(
      0,
      exerciseCount
    );

    return selectedExercises.map((exerciseTemplate, index) => {
      const exerciseName = adaptExerciseNameToGender(
        exerciseTemplate.name,
        gender
      );

      return {
        id: `exercise_${index + 1}`,
        name: exerciseName,
        category: exerciseTemplate.category,
        primaryMuscles: [...exerciseTemplate.primaryMuscles],
        secondaryMuscles: [],
        equipment: exerciseTemplate.equipment,
        sets: this.generateRealisticSets(experience),
        restTime: this.calculateRestTime(experience),
        notes:
          Math.random() < 0.3 ? generateSingleGenderAdaptedNote(gender) : "",
        videoUrl: "",
        imageUrl: "",
        instructions: [],
        tips: [],
      };
    });
  }

  /**
   * יוצר סטים מציאותיים לפי רמת הניסיון
   */
  private generateRealisticSets(
    experience: "beginner" | "intermediate" | "advanced"
  ): Set[] {
    const setCount =
      experience === "beginner"
        ? DEMO_CONSTANTS.MIN_SETS
        : DEMO_CONSTANTS.MIN_SETS +
          Math.floor(
            Math.random() * (DEMO_CONSTANTS.MAX_SETS - DEMO_CONSTANTS.MIN_SETS)
          );

    const sets: Set[] = [];
    const baseWeight = this.getBaseWeight(experience);
    const baseReps = this.getBaseReps(experience);

    for (let i = 0; i < setCount; i++) {
      // הדרגתיות מציאותית - משקל יורד או חזרות יורדות
      const weightVariation =
        i === 0 ? 0 : -Math.floor(Math.random() * 3) * 2.5; // ירידה של 0-5 ק"ג
      const repsVariation = i === 0 ? 0 : -Math.floor(Math.random() * 3); // ירידה של 0-2 חזרות

      sets.push({
        id: `set_${i + 1}`,
        type: "working",
        targetReps: Math.max(DEMO_CONSTANTS.MIN_REPS, baseReps + repsVariation),
        targetWeight: Math.max(
          DEMO_CONSTANTS.MIN_WEIGHT,
          baseWeight + weightVariation
        ),
        actualReps: Math.max(DEMO_CONSTANTS.MIN_REPS, baseReps + repsVariation),
        actualWeight: Math.max(
          DEMO_CONSTANTS.MIN_WEIGHT,
          baseWeight + weightVariation
        ),
        completed: Math.random() > 0.05, // 95% השלמה
        restTime: this.calculateRestTime(experience),
        notes: "",
        isPR: i === 0 && Math.random() < DEMO_CONSTANTS.PERSONAL_RECORD_CHANCE,
        rpe: Math.floor(Math.random() * 3) + 7, // 7-10
      });
    }

    return sets;
  }

  /**
   * פידבק מציאותי בסיסי (פונקציה חסרה שגרמה לשגיאת קומפילציה)
   */
  private generateRealisticFeedback(
    gender: UserGender,
    experience: "beginner" | "intermediate" | "advanced",
    workoutData: WorkoutData
  ) {
    return {
      difficulty: Math.min(5, 3 + Math.floor(Math.random() * 3)), // 3-5
      feeling: ["😀", "💪", "😅", "🔥"][Math.floor(Math.random() * 4)],
      readyForMore: Math.random() > 0.3,
      completedAt: workoutData.endTime || new Date().toISOString(),
      genderAdaptedNotes:
        Math.random() < 0.5
          ? generateSingleGenderAdaptedNote(gender)
          : undefined,
    };
  }

  /**
   * יוצר תאריך אימון מציאותי
   */
  private generateRealisticWorkoutDate(): Date {
    const now = new Date();
    const daysBack = Math.floor(
      Math.random() * DEMO_CONSTANTS.WORKOUT_HISTORY_WEEKS * 7
    );
    const workoutDate = new Date(
      now.getTime() - daysBack * 24 * 60 * 60 * 1000
    );

    // שעות אימון מציאותיות (6:00-22:00)
    const hour = 6 + Math.floor(Math.random() * 16);
    const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45

    workoutDate.setHours(hour, minute, 0, 0);
    return workoutDate;
  }

  // פונקציות עזר
  private generateFitnessGoals(): string[] {
    const allGoals = [
      "הגדלת מסה שרירית",
      "ירידה במשקל",
      "שיפור כושר גופני",
      "חיזוק השרירים",
      "שיפור סיבולת",
      "הגדרת השרירים",
    ];
    // 🎯 תיקון: משתמש דמו צריך מטרה אחת בלבד - בדיוק כמו השאלון האמיתי
    // השאלון מאפשר רק single choice, אז גם הדמו צריך להיות עקבי
    const randomGoal = allGoals[Math.floor(Math.random() * allGoals.length)];
    return [randomGoal]; // רק מטרה אחת!
  }

  private generateSessionDuration(): string {
    const durations = ["30-45 דקות", "45-60 דקות", "60-90 דקות"];
    return durations[Math.floor(Math.random() * durations.length)];
  }

  /**
   * יוצר מספר ימי אימון תואם לשאלון החדש
   * בהתאמה לאפשרויות: 2_days, 3_days, 4_days, 5_days
   */
  private generateAvailableDays(): number {
    const availabilityOptions = [2, 3, 4, 5]; // תואם לשאלון החדש
    return availabilityOptions[
      Math.floor(Math.random() * availabilityOptions.length)
    ];
  }

  private generateEquipment(experience: string): string[] {
    const basicEquipment: string[] = ["none"];
    const intermediateEquipment: string[] = ["none", "dumbbells", "barbell"];
    const advancedEquipment: string[] = [
      "none",
      "dumbbells",
      "barbell",
      "cable_machine",
      "leg_press",
    ];

    switch (experience) {
      case "beginner":
        return basicEquipment;
      case "intermediate":
        return intermediateEquipment;
      case "advanced":
        return advancedEquipment;
      default:
        return basicEquipment;
    }
  }

  private generatePreferredTime(): "morning" | "afternoon" | "evening" {
    const times: ("morning" | "afternoon" | "evening")[] = [
      "morning",
      "afternoon",
      "evening",
    ];
    return times[Math.floor(Math.random() * times.length)];
  }

  private generateMood(): "great" | "good" | "okay" | "tired" | "bad" {
    const moods: ("great" | "good" | "okay" | "tired" | "bad")[] = [
      "great",
      "good",
      "okay",
      "tired",
      "bad",
    ];
    const weights = [0.3, 0.4, 0.2, 0.08, 0.02]; // הטיה חיובית
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (rand <= sum) return moods[i];
    }
    return "good";
  }

  private generateFeeling(): string {
    const feelings = ["😊", "💪", "🔥", "⚡", "😤", "🎯", "🏆", "😅"];
    return feelings[Math.floor(Math.random() * feelings.length)];
  }

  private getBaseWeight(experience: string): number {
    switch (experience) {
      case "beginner":
        return 10 + Math.floor(Math.random() * 15); // 10-25 ק"ג
      case "intermediate":
        return 25 + Math.floor(Math.random() * 25); // 25-50 ק"ג
      case "advanced":
        return 50 + Math.floor(Math.random() * 40); // 50-90 ק"ג
      default:
        return 15;
    }
  }

  private getBaseReps(experience: string): number {
    switch (experience) {
      case "beginner":
        return 12 + Math.floor(Math.random() * 6); // 12-18
      case "intermediate":
        return 8 + Math.floor(Math.random() * 8); // 8-16
      case "advanced":
        return 6 + Math.floor(Math.random() * 10); // 6-16
      default:
        return 12;
    }
  }

  private calculateRestTime(experience: string): number {
    switch (experience) {
      case "beginner":
        return 60 + Math.floor(Math.random() * 60); // 60-120 שניות
      case "intermediate":
        return 90 + Math.floor(Math.random() * 90); // 90-180 שניות
      case "advanced":
        return 120 + Math.floor(Math.random() * 120); // 120-240 שניות
      default:
        return 90;
    }
  }

  private calculateTotalVolume(exercises: Exercise[]): number {
    return exercises.reduce((total, exercise) => {
      return (
        total +
        exercise.sets.reduce((exerciseTotal, set) => {
          return (
            exerciseTotal +
            (set.actualWeight || set.targetWeight) *
              (set.actualReps || set.targetReps)
          );
        }, 0)
      );
    }, 0);
  }

  private calculateCalories(durationMinutes: number): number {
    // נוסחה פשוטה לחישוב קלוריות
    const baseCaloriesPerMinute = 8;
    return Math.floor(durationMinutes * baseCaloriesPerMinute);
  }

  private determineWorkoutType(exercises: Exercise[]): string {
    const muscleGroups = exercises.flatMap((ex) => ex.primaryMuscles);
    const upperBodyCount = muscleGroups.filter(
      (muscle) =>
        muscle.includes("חזה") ||
        muscle.includes("גב") ||
        muscle.includes("כתף") ||
        muscle.includes("ביצפס") ||
        muscle.includes("טריצפס")
    ).length;

    const lowerBodyCount = muscleGroups.filter(
      (muscle) => muscle.includes("רגל") || muscle.includes("עכוז")
    ).length;

    if (upperBodyCount > lowerBodyCount * 1.5) return "גוף עליון";
    if (lowerBodyCount > upperBodyCount * 1.5) return "גוף תחתון";
    return "גוף מלא";
  }

  private calculateDifficultyByExperience(experience: string): number {
    switch (experience) {
      case "beginner":
        return 2 + Math.floor(Math.random() * 2); // 2-3
      case "intermediate":
        return 3 + Math.floor(Math.random() * 2); // 3-4
      case "advanced":
        return 4 + Math.floor(Math.random() * 2); // 4-5
      default:
        return 3;
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 📈 יוצר היסטוריית אימונים מלאה למשתמש
   * @description מייצר היסטוריה מציאותית עם התפלגות טבעית של אימונים
   * @param user - משתמש דמו ליצירת היסטוריה מותאמת
   * @param weeksBack - מספר שבועות אחורה (ברירת מחדל: 12)
   * @returns רשימת אימונים ממוינת לפי תאריך
   * @performance יוצר בין 24-48 אימונים (2-4 אימונים בשבוע)
   */
  generateWorkoutHistory(
    user: DemoUser,
    weeksBack: number = DEMO_CONSTANTS.WORKOUT_HISTORY_WEEKS
  ): WorkoutWithFeedback[] {
    const workouts: WorkoutWithFeedback[] = [];
    const now = new Date();

    for (let week = 0; week < weeksBack; week++) {
      const workoutsThisWeek =
        DEMO_CONSTANTS.MIN_WORKOUTS_PER_WEEK +
        Math.floor(
          Math.random() *
            (DEMO_CONSTANTS.MAX_WORKOUTS_PER_WEEK -
              DEMO_CONSTANTS.MIN_WORKOUTS_PER_WEEK)
        );

      for (let workout = 0; workout < workoutsThisWeek; workout++) {
        const workoutDate = new Date(
          now.getTime() - (week * 7 + workout * 2) * 24 * 60 * 60 * 1000
        );
        const generatedWorkout = this.generateRealisticWorkout(
          user.gender,
          user.experience,
          user.equipment,
          workoutDate
        );
        workouts.push(generatedWorkout);
      }
    }

    return workouts.sort((a, b) => {
      const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
      return bTime - aTime;
    });
  }

  /**
   * יוצר משתמש דמו עם נתוני שאלון בסיסיים
   */
  async createRealisticDemoUser(gender?: UserGender): Promise<DemoUser> {
    const user = this.generateDemoUser();
    if (gender) {
      user.gender = gender;
    }

    // אין שמירה כאן - רק יצירה
    return user;
  }

  /**
   * מחזיר משתמש דמו (לשם תאימות עם הקוד הקיים)
   */
  async getDemoUser(): Promise<DemoUser | null> {
    // ליצירה פשוטה של משתמש דמו
    return this.generateDemoUser();
  }

  /**
   * 👤 יוצר משתמש מלא תואם לממשק User של המערכת
   * @description המיר משתמש דמו למבנה נתונים מלא של המערכת הראשית
   * @returns משתמש מלא עם כל השדות הנדרשים למערכת
   * @includes אימייל, סטטיסטיקות, העדפות, פרופיל מגדר והיסטוריית פעילות
   * @critical_system פונקציה מרכזית לחיבור מערכת הדמו למערכת הראשית
   */
  async generateRealisticUser(): Promise<AppUser> {
    const demoUser = this.generateDemoUser();
    const workouts = await this.generateWorkoutHistory(demoUser);

    // יצירת אימייל אנגלי מתאים
    const englishEmailNames: Record<string, string> = {
      // שמות זכרים
      דוד: "david",
      יוסי: "yossi",
      אמיר: "amir",
      רן: "ran",
      תומר: "tomer",
      אלון: "alon",
      גיל: "gil",
      // שמות נשים
      שרה: "sarah",
      מיכל: "michal",
      רונית: "ronit",
      נועה: "noa",
      ליאת: "liat",
      יעל: "yael",
      דנה: "dana",
      // שמות נייטרליים
      אלכס: "alex",
      עדן: "eden",
      נועם: "noam",
      שחר: "shachar",
      ריי: "ray",
      קיי: "kay",
      דני: "danny",
    };

    const englishName = englishEmailNames[demoUser.name] || "user";
    const randomNum = Math.floor(Math.random() * 999) + 1;

    // יצירת משתמש תואם לממשק User
    const user: AppUser = {
      id: demoUser.id,
      name: demoUser.name,
      email: `${englishName}${randomNum}@demo.app`,
      provider: "demo",

      // נתוני אימון
      trainingStats: {
        totalWorkouts: workouts.length,
        totalVolume: workouts.reduce(
          (sum, w) => sum + (w.stats?.totalVolume || 0),
          0
        ),
        favoriteExercises: this.calculateFavoriteExercises(workouts),
        lastWorkoutDate: workouts[0]?.startTime || new Date().toISOString(),
        preferredWorkoutDays: demoUser.availableDays,
        selectedEquipment: demoUser.equipment,
        fitnessGoals: demoUser.fitnessGoals,
        currentFitnessLevel: demoUser.experience,
      },

      // העדפות
      preferences: {
        theme: "light",
        notifications: true,
        language: "he",
        units: "metric",
        gender: demoUser.gender,
        rtlPreference: true,
        workoutNameStyle: "adapted",
      },

      // פרופיל מותאם מגדר
      genderProfile: {
        selectedGender: demoUser.gender,
        adaptedWorkoutNames: {},
        personalizedMessages: [],
      },

      // היסטוריית פעילות
      activityHistory: {
        workouts: workouts,
      },

      // סטטיסטיקות נוכחיות
      currentStats: {
        totalWorkouts: workouts.length,
        totalVolume: workouts.reduce(
          (sum, w) => sum + (w.stats?.totalVolume || 0),
          0
        ),
        averageDifficulty: this.calculateAverageDifficulty(workouts),
        averageRating: this.calculateAverageDifficulty(workouts), // mapped from difficulty as proxy
        workoutStreak: this.calculateWorkoutStreak(workouts),
        currentStreak: this.calculateWorkoutStreak(workouts),
      },
    };

    return user;
  }

  /**
   * יוצר משתמש מלא מנתוני דמו מותאמים (מהשאלון)
   */
  async generateRealisticUserFromCustomDemo(
    customDemoUser: CustomDemoUser
  ): Promise<AppUser> {
    // יצור DemoUser מהנתונים המותאמים
    const demoUser: DemoUser = {
      id: customDemoUser.id,
      name: customDemoUser.name,
      gender: customDemoUser.gender,
      age: customDemoUser.age,
      experience: customDemoUser.experience,
      height: customDemoUser.height,
      weight: customDemoUser.weight,
      fitnessGoals: customDemoUser.fitnessGoals,
      availableDays: customDemoUser.availableDays,
      sessionDuration: customDemoUser.sessionDuration,
      equipment: customDemoUser.equipment,
      preferredTime: customDemoUser.preferredTime,
      workoutHistory: [],
      isDemo: true,
    };

    // יצור היסטוריית אימונים מבוססת הנתונים המותאמים
    const workouts = await this.generateWorkoutHistory(demoUser);

    // יצירת אימייל אנגלי מתאים
    const englishEmailNames: Record<string, string> = {
      // שמות זכרים
      דוד: "david",
      יוסי: "yossi",
      אמיר: "amir",
      רן: "ran",
      תומר: "tomer",
      אלון: "alon",
      גיל: "gil",
      // שמות נשים
      שרה: "sarah",
      מיכל: "michal",
      רונית: "ronit",
      נועה: "noa",
      ליאת: "liat",
      יעל: "yael",
      דנה: "dana",
      // שמות נייטרליים
      אלכס: "alex",
      עדן: "eden",
      נועם: "noam",
      שחר: "shachar",
      ריי: "ray",
      קיי: "kay",
      דני: "danny",
    };

    const englishName = englishEmailNames[demoUser.name] || "user";
    const randomNum = Math.floor(Math.random() * 999) + 1;

    // יצירת משתמש תואם לממשק User
    const user: AppUser = {
      id: demoUser.id,
      name: demoUser.name,
      email: `${englishName}${randomNum}@demo.app`,
      provider: "demo",

      // נתוני אימון מותאמים
      trainingStats: {
        totalWorkouts: workouts.length,
        totalVolume: workouts.reduce(
          (sum, w) => sum + (w.stats?.totalVolume || 0),
          0
        ),
        favoriteExercises: this.calculateFavoriteExercises(workouts),
        lastWorkoutDate:
          workouts.length > 0 ? workouts[0].feedback?.completedAt : undefined,
        preferredWorkoutDays: demoUser.availableDays,
        selectedEquipment: demoUser.equipment,
        fitnessGoals: demoUser.fitnessGoals,
        currentFitnessLevel: demoUser.experience,
      },

      // העדפות מותאמות
      preferences: {
        theme: "light",
        notifications: true,
        language: "he",
        units: "metric",
        gender: demoUser.gender,
        rtlPreference: true,
        workoutNameStyle: "adapted",
      },

      // פרופיל מותאם מגדר
      genderProfile: {
        selectedGender: demoUser.gender,
        adaptedWorkoutNames: {},
        personalizedMessages: [
          `ברוכ${demoUser.gender === "female" ? "ה" : ""} הבא${demoUser.gender === "female" ? "ה" : ""} ${demoUser.name}!`,
        ],
      },

      // היסטוריית פעילות
      activityHistory: {
        workouts: workouts,
      },

      // סטטיסטיקות נוכחיות
      currentStats: {
        totalWorkouts: workouts.length,
        totalVolume: workouts.reduce(
          (sum, w) => sum + (w.stats?.totalVolume || 0),
          0
        ), // ✅ FIXED: חישוב נפח מלא במקום TODO
        averageDifficulty: this.calculateAverageDifficulty(workouts),
        averageRating: this.calculateAverageDifficulty(workouts),
        workoutStreak: this.calculateWorkoutStreak(workouts),
        currentStreak: this.calculateWorkoutStreak(workouts),
      },
    };

    return user;
  }

  /**
   * מחשב תרגילים מועדפים בהתבסס על התדירות
   */
  private calculateFavoriteExercises(
    workouts: WorkoutWithFeedback[]
  ): string[] {
    const exerciseCount: Record<string, number> = {};

    workouts.forEach((workout) => {
      workout.workout.exercises.forEach((exercise) => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });

    return Object.entries(exerciseCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name]) => name);
  }

  /**
   * מחשב קושי ממוצע
   */
  private calculateAverageDifficulty(workouts: WorkoutWithFeedback[]): number {
    if (workouts.length === 0) return 3;

    const totalDifficulty = workouts.reduce(
      (sum, w) => sum + (w.feedback?.difficulty || 3),
      0
    );
    return Math.round((totalDifficulty / workouts.length) * 10) / 10;
  }

  /**
   * מחשב רצף אימונים נוכחי
   */
  private calculateWorkoutStreak(workouts: WorkoutWithFeedback[]): number {
    if (workouts.length === 0) return 0;

    const sortedWorkouts = workouts
      .filter((w) => w.startTime)
      .sort(
        (a, b) =>
          new Date(b.startTime!).getTime() - new Date(a.startTime!).getTime()
      );

    let streak = 0;
    const today = new Date();

    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.startTime!);
      const daysDiff = Math.floor(
        (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}

// 🔴 DEMO ONLY - ייצוא singleton instance למשתמשי דמו
// ✅ ACTIVE: שירות קריטי למערכת הדמו - demoWorkoutService תלוי בו
// ⚠️ NEEDS REFACTORING: קובץ גדול (1304 שורות) צריך פיצול עתידי
export const demoUserService = DemoUserService.getInstance();
export default demoUserService;

// ✅ Backward compatibility export (לזמן מעבר מ-realisticDemoService)
export const realisticDemoService = demoUserService;
