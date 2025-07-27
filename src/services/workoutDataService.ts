/**
 * @file src/services/workoutDataService.ts
 * @brief שירות פשוט לניהול נתוני אימון - גרסה בסיסית שעובדת
 * @brief Simple workout data management service - basic working version
 * @dependencies questionnaireService, userStore
 * @notes גרסה פשוטה ויציבה לניהול נתוני אימון
 * @notes Simple and stable version for workout data management
 */

import { questionnaireService } from "./questionnaireService";
import { useUserStore } from "../stores/userStore";
import { EXTENDED_EXERCISE_DATABASE } from "../data/exerciseDatabase";
import {
  WorkoutPlan,
  WorkoutTemplate,
  ExerciseTemplate,
} from "../screens/workout/types/workout.types";

// טיפוס עבור metadata של תוכנית אימון
interface WorkoutMetadata {
  frequency?: string;
  duration?: string;
  experience?: string;
  goal?: string;
  location?: string;
  home_equipment?: string[];
  gym_equipment?: string[];
  age?: string;
  weight?: number;
  height?: number;
  health_conditions?: string[];
  fitness_assessment?: string;
  workout_preference?: string[];
  [key: string]: string | number | string[] | undefined;
}

// טיפוס עבור תוכנית AI מתקדמת
interface AIWorkoutPlan extends WorkoutPlan {
  aiScore: number;
  personalizationLevel: "basic" | "advanced" | "expert";
  equipmentUtilization: number;
  varietyScore: number;
  adaptations: string[];
}

// מחלקת נתוני אימון פשוטה
// Simple workout data class
export class WorkoutDataService {
  /**
   * קבלת נתוני משתמש מאוחדים מכל המקורות
   * Get unified user data from all sources
   */
  static async getUserWorkoutData() {
    const { user } = useUserStore.getState();

    try {
      // 1. נסה לקבל נתונים מהשירות (החדש)
      const preferences = await questionnaireService.getUserPreferences();
      if (preferences) {
        return {
          source: "service",
          data: preferences,
          isComplete: true,
        };
      }

      // 2. אם אין, נסה מה-store החדש
      if (user?.questionnaireData?.metadata) {
        return {
          source: "store_new",
          data: user.questionnaireData.metadata,
          isComplete: true,
        };
      }

      // 3. אם אין, נסה להמיר מהפורמט הישן
      if (user?.questionnaire) {
        const converted = this.convertOldFormat(user.questionnaire);
        return {
          source: "store_old_converted",
          data: converted,
          isComplete: false,
        };
      }

      // 4. אין נתונים כלל
      return {
        source: "none",
        data: null,
        isComplete: false,
      };
    } catch (error) {
      console.error("Error getting user workout data:", error);
      return {
        source: "error",
        data: null,
        isComplete: false,
      };
    }
  }

  /**
   * המרת נתונים מפורמט ישן לחדש
   * Convert data from old to new format
   */
  private static convertOldFormat(oldAnswers: {
    [key: number]: string | string[];
  }) {
    return {
      frequency: oldAnswers[4] as string,
      duration: oldAnswers[5] as string,
      goal: oldAnswers[2] as string,
      experience: oldAnswers[3] as string,
      location: oldAnswers[6] as string,
      migrated: true,
      migratedAt: new Date().toISOString(),
    };
  }

  /**
   * יצירת תוכנית אימון AI מתקדמת - האלגוריתם החדש!
   * Generate advanced AI workout plan - The new algorithm!
   */
  static async generateAIWorkoutPlan(): Promise<AIWorkoutPlan | null> {
    const userDataResult = await this.getUserWorkoutData();

    if (!userDataResult.data) {
      throw new Error("NO_QUESTIONNAIRE_DATA");
    }

    const metadata = userDataResult.data as WorkoutMetadata;

    try {
      console.log("🤖 AI Algorithm: בונה תוכנית מותאמת אישית...");
      console.log("📊 User Data:", metadata);

      // שלב 1: איסוף והערכת נתוני משתמש
      const userProfile = this.analyzeUserProfile(metadata);
      console.log("👤 User Profile Analysis:", userProfile);

      // שלב 2: ניתוח ציוד זמין
      const equipmentAnalysis = await this.analyzeEquipment(metadata);
      console.log("🏋️ Equipment Analysis:", equipmentAnalysis);

      // שלב 3: בניית מטריקס אימון חכם
      const workoutMatrix = this.buildSmartWorkoutMatrix(
        userProfile,
        equipmentAnalysis
      );
      console.log("🧠 Workout Matrix:", workoutMatrix);

      // שלב 4: יצירת תוכנית מותאמת
      const aiPlan = this.createPersonalizedPlan(
        metadata,
        userProfile,
        equipmentAnalysis,
        workoutMatrix
      );

      console.log("✅ AI Plan Generated:", aiPlan?.name);
      return aiPlan;
    } catch (error) {
      console.error("❌ AI Algorithm Error:", error);
      return null;
    }
  }

  /**
   * ניתוח פרופיל משתמש מתקדם
   * Advanced user profile analysis
   */
  private static analyzeUserProfile(metadata: WorkoutMetadata) {
    const profile = {
      fitnessLevel: this.calculateFitnessLevel(metadata),
      goalType: this.analyzeGoalType(metadata.goal),
      timeCommitment: this.analyzeTimeCommitment(
        metadata.frequency,
        metadata.duration
      ),
      physicalLimitations: this.assessPhysicalLimitations(metadata),
      preferenceScore: this.calculatePreferenceScore(metadata),
    };

    return profile;
  }

  /**
   * ניתוח ציוד זמין ויצירת אסטרטגיית שימוש
   * Equipment analysis and usage strategy
   */
  private static async analyzeEquipment(metadata: WorkoutMetadata) {
    const homeEquipment = metadata.home_equipment || [];
    const gymEquipment = metadata.gym_equipment || [];
    const location = metadata.location || "home";

    const availableEquipment =
      location === "gym" ? [...homeEquipment, ...gymEquipment] : homeEquipment;

    console.log("📦 Available Equipment:", availableEquipment);

    return {
      totalEquipment: availableEquipment,
      equipmentLevel: this.calculateEquipmentLevel(availableEquipment),
      canDoCardio: this.canDoCardio(availableEquipment),
      canDoStrength: this.canDoStrength(availableEquipment),
      canDoFunctional: this.canDoFunctional(availableEquipment),
      varietyScore: availableEquipment.length * 10, // ציון מגוון
    };
  }

  /**
   * בניית מטריקס אימון חכם על בסיס נתוני המשתמש
   * Build smart workout matrix based on user data
   */
  private static buildSmartWorkoutMatrix(
    userProfile: any,
    equipmentAnalysis: any
  ) {
    const matrix = {
      targetMuscleGroups: this.selectTargetMuscleGroups(userProfile.goalType),
      workoutSplit: this.determineOptimalSplit(userProfile.timeCommitment),
      intensityLevel: this.calculateIntensityLevel(userProfile.fitnessLevel),
      exerciseVariety: this.planExerciseVariety(equipmentAnalysis),
      progressionPlan: this.createProgressionPlan(userProfile.fitnessLevel),
    };

    return matrix;
  }

  /**
   * יצירת תוכנית מותאמת אישית עם אלגוריתם AI
   * Create personalized plan with AI algorithm
   */
  private static createPersonalizedPlan(
    metadata: WorkoutMetadata,
    userProfile: any,
    equipmentAnalysis: any,
    workoutMatrix: any
  ): AIWorkoutPlan {
    const daysPerWeek = this.parseFrequency(metadata.frequency || "3");
    const sessionDuration = this.parseDuration(metadata.duration || "45");

    // יצירת אימונים מותאמים עם AI
    const aiWorkouts = this.generateAIWorkouts(
      daysPerWeek,
      sessionDuration,
      equipmentAnalysis.totalEquipment,
      workoutMatrix
    );

    // חישוב ציונים
    const aiScore = this.calculateAIScore(
      userProfile,
      equipmentAnalysis,
      workoutMatrix
    );
    const personalizationLevel = this.determinePersonalizationLevel(aiScore);

    return {
      id: `ai-plan-${Date.now()}`,
      name: `🤖 ${metadata.goal || "אימון מותאם"}`,
      description: this.generateAIDescription(
        metadata,
        userProfile,
        equipmentAnalysis
      ),
      difficulty: this.mapExperienceToDifficulty(
        metadata.experience || "beginner"
      ),
      duration: sessionDuration,
      frequency: daysPerWeek,
      workouts: aiWorkouts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: this.generateSmartTags(metadata, equipmentAnalysis),

      // AI specific properties
      aiScore,
      personalizationLevel,
      equipmentUtilization:
        (equipmentAnalysis.totalEquipment.length / 20) * 100,
      varietyScore: equipmentAnalysis.varietyScore,
      adaptations: this.generateAdaptations(userProfile, equipmentAnalysis),
    };
  }

  /**
   * יצירת תוכנית אימון בסיסית (הפונקציה הישנה)
   * Generate basic workout plan (legacy function)
   */
  static async generateBasicWorkoutPlan(): Promise<WorkoutPlan | null> {
    const userDataResult = await this.getUserWorkoutData();

    if (!userDataResult.data) {
      throw new Error("NO_QUESTIONNAIRE_DATA");
    }

    const metadata = userDataResult.data;

    try {
      const equipment = await questionnaireService.getAvailableEquipment();

      // פרמטרים בסיסיים
      const daysPerWeek = this.parseFrequency(
        (metadata as WorkoutMetadata).frequency || "3"
      );
      const duration = this.parseDuration(
        (metadata as WorkoutMetadata).duration || "45"
      );
      const difficulty = this.mapExperienceToDifficulty(
        (metadata as WorkoutMetadata).experience || "beginner"
      );

      // יצירת אימונים פשוטים
      const workouts = this.createBasicWorkouts(daysPerWeek, equipment);

      return {
        id: `basic-plan-${Date.now()}`,
        name: `תוכנית ${(metadata as WorkoutMetadata).goal || "אימון"}`,
        description: `תוכנית בסיסית ל${
          (metadata as WorkoutMetadata).goal || "אימון"
        } - ${daysPerWeek} ימים בשבוע`,
        difficulty: difficulty,
        duration: duration,
        frequency: daysPerWeek,
        workouts: workouts,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [(metadata as WorkoutMetadata).goal, "Basic"].filter(
          Boolean
        ) as string[],
      };
    } catch (error) {
      console.error("Error generating basic workout plan:", error);
      return null;
    }
  }

  /**
   * יצירת אימונים בסיסיים
   * Create basic workouts
   */
  private static createBasicWorkouts(
    daysPerWeek: number,
    equipment: string[]
    // metadata מוסר כי לא משמש בפונקציה
  ): WorkoutTemplate[] {
    const workoutNames = this.getWorkoutNames(daysPerWeek);
    const workouts: WorkoutTemplate[] = [];

    workoutNames.forEach((name, index) => {
      // בחירת תרגילים בסיסיים
      const exercises = this.selectBasicExercises(name, equipment);

      workouts.push({
        id: `workout-${index + 1}`,
        name: name,
        exercises: exercises,
        estimatedDuration: 45, // זמן קבוע
        targetMuscles: this.getTargetMusclesForDay(name),
        equipment: equipment,
      });
    });

    return workouts;
  }

  /**
   * בחירת תרגילים בסיסיים
   * Select basic exercises
   */
  private static selectBasicExercises(
    workoutName: string,
    equipment: string[]
  ): ExerciseTemplate[] {
    const targetMuscles = this.getTargetMusclesForDay(workoutName);

    // סינון תרגילים מתאימים
    const suitableExercises = EXTENDED_EXERCISE_DATABASE.filter((exercise) => {
      const muscleMatch = targetMuscles.some(
        (muscle) =>
          exercise.primaryMuscles.includes(muscle) ||
          exercise.category === muscle
      );
      const equipmentMatch =
        equipment.includes(exercise.equipment) ||
        exercise.equipment === "bodyweight";
      const levelMatch = exercise.difficulty === "beginner";

      return muscleMatch && equipmentMatch && levelMatch;
    });

    // בחירת 4-6 תרגילים
    const selectedExercises = suitableExercises.slice(0, 6);

    return selectedExercises.map((exercise) => ({
      exerciseId: exercise.id,
      sets: 3,
      reps: "10-12",
      restTime: 60,
      notes: "התחל עם משקל קל",
    }));
  }

  /**
   * קבלת שמות אימונים לפי מספר ימים
   * Get workout names by number of days
   */
  private static getWorkoutNames(days: number): string[] {
    const WORKOUT_DAYS = {
      1: ["אימון מלא"],
      2: ["פלג גוף עליון", "פלג גוף תחתון"],
      3: ["דחיפה", "משיכה", "רגליים"],
      4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים"],
      5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים"],
      6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן"],
    };

    return WORKOUT_DAYS[days as keyof typeof WORKOUT_DAYS] || WORKOUT_DAYS[3];
  }

  /**
   * קבלת שרירי יעד ליום
   * Get target muscles for day
   */
  private static getTargetMusclesForDay(dayName: string): string[] {
    const muscleMap: { [key: string]: string[] } = {
      "אימון מלא": ["חזה", "גב", "רגליים", "כתפיים"],
      "פלג גוף עליון": ["חזה", "גב", "כתפיים", "ידיים"],
      "פלג גוף תחתון": ["רגליים", "ישבן"],
      דחיפה: ["חזה", "כתפיים", "טריצפס"],
      משיכה: ["גב", "ביצפס"],
      רגליים: ["רגליים", "ישבן"],
      "חזה + טריצפס": ["חזה", "טריצפס"],
      "גב + ביצפס": ["גב", "ביצפס"],
      כתפיים: ["כתפיים"],
      ידיים: ["ביצפס", "טריצפס"],
      בטן: ["בטן"],
    };

    return muscleMap[dayName] || ["גוף מלא"];
  }

  /**
   * פונקציות עזר
   * Helper functions
   */
  private static parseFrequency(frequency: string): number {
    const frequencyMap: { [key: string]: number } = {
      "1-2": 2,
      "3-4": 3,
      "5-6": 5,
      "כל יום": 6,
    };
    return frequencyMap[frequency] || 3;
  }

  private static parseDuration(duration: string): number {
    if (!duration) return 45;
    return parseInt(duration.split("-")[0]) || 45;
  }

  private static mapExperienceToDifficulty(
    experience: string
  ): "beginner" | "intermediate" | "advanced" {
    const map: { [key: string]: "beginner" | "intermediate" | "advanced" } = {
      "מתחיל (0-6 חודשים)": "beginner",
      "בינוני (6-24 חודשים)": "intermediate",
      "מתקדם (2+ שנים)": "advanced",
      מקצועי: "advanced",
    };
    return map[experience] || "beginner";
  }

  // ===============================================
  // 🤖 AI Algorithm Helper Functions
  // פונקציות עזר לאלגוריתם ה-AI
  // ===============================================

  /**
   * חישוב רמת כושר על בסיס נתוני המשתמש
   */
  private static calculateFitnessLevel(metadata: WorkoutMetadata): number {
    let score = 0;

    // ניסיון באימונים (40% מהציון)
    const experienceScore = {
      "מתחיל (0-6 חודשים)": 20,
      "בינוני (6-24 חודשים)": 60,
      "מתקדם (2+ שנים)": 90,
      מקצועי: 100,
    };
    score +=
      (experienceScore[metadata.experience as keyof typeof experienceScore] ||
        20) * 0.4;

    // הערכת כושר (30% מהציון)
    if (metadata.fitness_assessment) {
      const fitnessScore = {
        נמוך: 20,
        בינוני: 50,
        גבוה: 80,
        מעולה: 100,
      };
      score +=
        (fitnessScore[
          metadata.fitness_assessment as keyof typeof fitnessScore
        ] || 20) * 0.3;
    }

    // גיל (20% מהציון - צעירים יותר = ציון גבוה יותר)
    if (metadata.age) {
      const age = parseInt(metadata.age);
      const ageScore = Math.max(0, 100 - (age - 20) * 2);
      score += ageScore * 0.2;
    }

    // תדירות אימון רצויה (10% מהציון)
    const frequencyScore = {
      "1-2": 30,
      "3-4": 70,
      "5-6": 90,
      "כל יום": 100,
    };
    score +=
      (frequencyScore[metadata.frequency as keyof typeof frequencyScore] ||
        30) * 0.1;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * ניתוח סוג המטרה
   */
  private static analyzeGoalType(goal?: string) {
    const goalTypes = {
      "הרזיה ושריפת שומן": {
        type: "fat_loss",
        intensity: "high",
        cardio: 0.6,
        strength: 0.4,
      },
      "בניית שריר": {
        type: "muscle_gain",
        intensity: "high",
        cardio: 0.2,
        strength: 0.8,
      },
      "שיפור כושר": {
        type: "fitness",
        intensity: "medium",
        cardio: 0.5,
        strength: 0.5,
      },
      "החזקת מצב": {
        type: "maintenance",
        intensity: "medium",
        cardio: 0.4,
        strength: 0.6,
      },
      שיקום: {
        type: "rehabilitation",
        intensity: "low",
        cardio: 0.3,
        strength: 0.7,
      },
    };

    return goalTypes[goal as keyof typeof goalTypes] || goalTypes["שיפור כושר"];
  }

  /**
   * ניתוח מחויבות זמן
   */
  private static analyzeTimeCommitment(frequency?: string, duration?: string) {
    const freq = this.parseFrequency(frequency || "3");
    const dur = this.parseDuration(duration || "45");

    const totalMinutesPerWeek = freq * dur;

    return {
      frequency: freq,
      duration: dur,
      totalWeeklyMinutes: totalMinutesPerWeek,
      commitment:
        totalMinutesPerWeek > 300
          ? "high"
          : totalMinutesPerWeek > 150
            ? "medium"
            : "low",
    };
  }

  /**
   * הערכת מגבלות פיזיות
   */
  private static assessPhysicalLimitations(metadata: WorkoutMetadata) {
    const limitations = [];

    if (metadata.health_conditions && metadata.health_conditions.length > 0) {
      limitations.push(...metadata.health_conditions);
    }

    // בדיקת גיל לשיקולים מיוחדים
    if (metadata.age && parseInt(metadata.age) > 50) {
      limitations.push("age_considerations");
    }

    return {
      hasLimitations: limitations.length > 0,
      conditions: limitations,
      adaptationsNeeded: limitations.length > 0,
    };
  }

  /**
   * חישוב ציון העדפות
   */
  private static calculatePreferenceScore(metadata: WorkoutMetadata): number {
    let score = 50; // ציון בסיס

    if (metadata.workout_preference && metadata.workout_preference.length > 0) {
      score += metadata.workout_preference.length * 10; // יותר העדפות = ציון גבוה יותר
    }

    return Math.min(100, score);
  }

  /**
   * חישוב רמת ציוד
   */
  private static calculateEquipmentLevel(
    equipment: string[]
  ): "basic" | "intermediate" | "advanced" {
    if (equipment.length <= 3) return "basic";
    if (equipment.length <= 8) return "intermediate";
    return "advanced";
  }

  /**
   * בדיקה אם ניתן לבצע קרדיו
   */
  private static canDoCardio(equipment: string[]): boolean {
    const cardioEquipment = ["treadmill", "bike", "rowing_machine", "none"];
    return (
      equipment.some((eq) => cardioEquipment.includes(eq)) ||
      equipment.includes("none")
    );
  }

  /**
   * בדיקה אם ניתן לבצע אימוני כח
   */
  private static canDoStrength(equipment: string[]): boolean {
    const strengthEquipment = [
      "dumbbells",
      "barbell",
      "kettlebell",
      "resistance_bands",
      "none",
    ];
    return (
      equipment.some((eq) => strengthEquipment.includes(eq)) ||
      equipment.includes("none")
    );
  }

  /**
   * בדיקה אם ניתן לבצע אימון פונקציונלי
   */
  private static canDoFunctional(equipment: string[]): boolean {
    const functionalEquipment = ["trx", "yoga_mat", "foam_roller", "none"];
    return (
      equipment.some((eq) => functionalEquipment.includes(eq)) ||
      equipment.includes("none")
    );
  }

  /**
   * בחירת קבוצות שרירים ליעד
   */
  private static selectTargetMuscleGroups(goalType: any) {
    const muscleGroups = {
      fat_loss: ["גוף מלא", "קרדיו", "פונקציונלי"],
      muscle_gain: ["חזה", "גב", "רגליים", "כתפיים", "ידיים"],
      fitness: ["גוף מלא", "ליבה", "קרדיו"],
      maintenance: ["גוף מלא", "ליבה"],
      rehabilitation: ["ליבה", "יציבות", "גמישות"],
    };

    return (
      muscleGroups[goalType.type as keyof typeof muscleGroups] ||
      muscleGroups.fitness
    );
  }

  /**
   * קביעת פיצול אימון אופטימלי
   */
  private static determineOptimalSplit(timeCommitment: any) {
    if (timeCommitment.frequency <= 2) {
      return "full_body"; // גוף מלא
    } else if (timeCommitment.frequency <= 4) {
      return "upper_lower"; // עליון-תחתון
    } else {
      return "body_parts"; // חלקי גוף
    }
  }

  /**
   * חישוב רמת עצימות
   */
  private static calculateIntensityLevel(
    fitnessLevel: number
  ): "low" | "medium" | "high" {
    if (fitnessLevel < 40) return "low";
    if (fitnessLevel < 70) return "medium";
    return "high";
  }

  /**
   * תכנון מגוון תרגילים
   */
  private static planExerciseVariety(equipmentAnalysis: any) {
    return {
      totalVariations: equipmentAnalysis.totalEquipment.length * 2,
      cardioOptions: equipmentAnalysis.canDoCardio ? 5 : 2,
      strengthOptions: equipmentAnalysis.canDoStrength ? 8 : 4,
      functionalOptions: equipmentAnalysis.canDoFunctional ? 6 : 3,
    };
  }

  /**
   * יצירת תוכנית התקדמות
   */
  private static createProgressionPlan(fitnessLevel: number) {
    const weeks = fitnessLevel < 40 ? 8 : fitnessLevel < 70 ? 6 : 4;

    return {
      totalWeeks: weeks,
      progressionType: fitnessLevel < 40 ? "gradual" : "moderate",
      milestones: this.generateMilestones(weeks),
    };
  }

  /**
   * יצירת ציוני דרך
   */
  private static generateMilestones(weeks: number) {
    const milestones = [];
    for (let i = 1; i <= weeks; i += 2) {
      milestones.push({
        week: i,
        focus: i <= 2 ? "הסתגלות" : i <= 4 ? "התחזקות" : "התקדמות",
      });
    }
    return milestones;
  }

  /**
   * יצירת אימונים עם AI
   */
  private static generateAIWorkouts(
    daysPerWeek: number,
    sessionDuration: number,
    equipment: string[],
    workoutMatrix: any
  ): WorkoutTemplate[] {
    const workouts: WorkoutTemplate[] = [];
    const workoutNames = this.getWorkoutNames(daysPerWeek);

    workoutNames.forEach((name, index) => {
      // חישוב מספר תרגילים על בסיס זמן הסשן
      const exerciseCount = Math.floor(sessionDuration / 8); // בערך 8 דקות לתרגיל

      // בחירת תרגילים מותאמים עם AI
      const exercises = this.selectAIExercises(
        name,
        equipment,
        exerciseCount,
        workoutMatrix
      );

      workouts.push({
        id: `ai-workout-${index + 1}`,
        name: `${name}`, // הסרנו את (AI) מהשם לעיצוב נקי יותר
        exercises: exercises,
        estimatedDuration: sessionDuration,
        targetMuscles: this.getTargetMusclesForDay(name),
        equipment: equipment,
      });
    });

    return workouts;
  }

  /**
   * בחירת תרגילים עם AI
   */
  private static selectAIExercises(
    workoutName: string,
    equipment: string[],
    exerciseCount: number,
    workoutMatrix: any
  ): ExerciseTemplate[] {
    // כרגע placeholder - בהמשך נשלב עם מאגר התרגילים המלא
    const exercises: ExerciseTemplate[] = [];

    for (let i = 0; i < exerciseCount; i++) {
      exercises.push({
        exerciseId: `ai-exercise-${i + 1}`,
        sets: workoutMatrix.intensityLevel === "high" ? 4 : 3,
        reps: this.calculateOptimalReps(workoutMatrix.intensityLevel),
        restTime: this.calculateRestTime(workoutMatrix.intensityLevel),
        notes: `תרגיל AI מותאם - ${workoutName}`,
      });
    }

    return exercises;
  }

  /**
   * חישוב מספר חזרות אופטימלי
   */
  private static calculateOptimalReps(intensity: string): string {
    const repsMap = {
      low: "12-15",
      medium: "10-12",
      high: "8-10",
    };
    return repsMap[intensity as keyof typeof repsMap] || "10-12";
  }

  /**
   * חישוב זמן מנוחה
   */
  private static calculateRestTime(intensity: string): number {
    const restMap = {
      low: 45,
      medium: 60,
      high: 90,
    };
    return restMap[intensity as keyof typeof restMap] || 60;
  }

  /**
   * חישוב ציון AI
   */
  private static calculateAIScore(
    userProfile: any,
    equipmentAnalysis: any,
    workoutMatrix: any
  ): number {
    let score = 0;

    // ציון בסיס של פרופיל המשתמש (40%)
    score += userProfile.fitnessLevel * 0.4;

    // ציון ציוד (30%)
    score += (equipmentAnalysis.varietyScore / 10) * 0.3;

    // ציון התאמה (30%)
    score += userProfile.preferenceScore * 0.3;

    return Math.min(100, score);
  }

  /**
   * קביעת רמת התאמה אישית
   */
  private static determinePersonalizationLevel(
    aiScore: number
  ): "basic" | "advanced" | "expert" {
    if (aiScore < 50) return "basic";
    if (aiScore < 80) return "advanced";
    return "expert";
  }

  /**
   * יצירת תיאור AI
   */
  private static generateAIDescription(
    metadata: WorkoutMetadata,
    userProfile: any,
    equipmentAnalysis: any
  ): string {
    const goal = metadata.goal || "שיפור כושר";
    const location = metadata.location === "home" ? "🏠 בית" : "🏋️ חדר כושר";

    // אייקונים לפי מטרה
    const goalIcons = {
      "הרזיה ושריפת שומן": "⚡",
      "בניית שריר": "💪",
      "שיפור כושר": "🎯",
      "החזקת מצב": "🔄",
      שיקום: "🌱",
    };

    const goalIcon = goalIcons[goal as keyof typeof goalIcons] || "🎯";

    return `${goalIcon} ${goal} • ${location} • AI מתקדם ומתאים לך`;
  }

  /**
   * יצירת תגיות חכמות
   */
  private static generateSmartTags(
    metadata: WorkoutMetadata,
    equipmentAnalysis: any
  ): string[] {
    const tags = ["🤖 AI"];

    // אייקונים לפי מטרה
    const goalTags = {
      "הרזיה ושריפת שומן": "⚡ הרזיה",
      "בניית שריר": "💪 בניית שריר",
      "שיפור כושר": "🎯 כושר",
      "החזקת מצב": "🔄 תחזוקה",
      שיקום: "🌱 שיקום",
    };

    if (metadata.goal && goalTags[metadata.goal as keyof typeof goalTags]) {
      tags.push(goalTags[metadata.goal as keyof typeof goalTags]);
    }

    if (metadata.location) {
      tags.push(metadata.location === "home" ? "🏠 בית" : "🏋️ חדר כושר");
    }

    // תגיות ציוד עם אייקונים
    if (equipmentAnalysis.equipmentLevel === "basic")
      tags.push("🔧 ציוד בסיסי");
    if (equipmentAnalysis.equipmentLevel === "intermediate")
      tags.push("⚙️ ציוד בינוני");
    if (equipmentAnalysis.equipmentLevel === "advanced")
      tags.push("🛠️ ציוד מתקדם");

    return tags;
  }

  /**
   * יצירת התאמות
   */
  private static generateAdaptations(
    userProfile: any,
    equipmentAnalysis: any
  ): string[] {
    const adaptations = [];

    // התאמות בסיסיות
    if (userProfile.physicalLimitations.hasLimitations) {
      adaptations.push("🏥 מותאם למגבלות בריאותיות");
    }

    if (equipmentAnalysis.equipmentLevel === "basic") {
      adaptations.push("🔧 מותאם לציוד בסיסי");
    }

    if (userProfile.fitnessLevel < 40) {
      adaptations.push("📈 התקדמות הדרגתית למתחילים");
    }

    // התאמות AI מתקדמות
    adaptations.push("🤖 AI למידה אוטומטית");
    adaptations.push("📊 התאמה דינמית לפי ביצועים");
    adaptations.push("🎯 התעצמות אוטומטית מאימון לאימון");

    return adaptations;
  }
}
