/**
 * @file src/screens/workout/WorkoutPlanScreen.tsx
 * @brief מסך תוכנית אימון מותאמת אישית - מציג תוכנית שבועית מלאה
 * @brief Personalized workout plan screen - displays full weekly program
 * @dependencies React Native, theme, userStore, questionnaireService, exerciseDatabase
 * @notes מציג תוכנית אימון מחולקת לימים לפי הנתונים מהשאלון
 * @notes Displays workout plan divided by days based on questionnaire data
 * @recurring_errors חייב לבדוק isCompound במאגר התרגילים, סדר הגדרת משתנים
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { questionnaireService } from "../../services/questionnaireService";
import { WorkoutDataService } from "../../services/workoutDataService"; // 🤖 AI Service
import {
  WorkoutPlan,
  WorkoutTemplate,
  ExerciseTemplate,
} from "./types/workout.types";

// ייבוא מאגר התרגילים המרכזי
// Import central exercise database
import { EXTENDED_EXERCISE_DATABASE as ALL_EXERCISES } from "../../data/exerciseDatabase";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// קבועים לסוגי פיצול אימון
// Workout split type constants
const WORKOUT_SPLITS = {
  FULL_BODY: "full_body",
  UPPER_LOWER: "upper_lower",
  PUSH_PULL_LEGS: "push_pull_legs",
  BODY_PART: "body_part",
} as const;

// קבועים לימי אימון
// Workout day constants
const WORKOUT_DAYS = {
  1: ["אימון מלא"],
  2: ["פלג גוף עליון", "פלג גוף תחתון"],
  3: ["דחיפה", "משיכה", "רגליים"],
  4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
  5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
  6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
};

// מיפוי אייקונים לימי אימון
// Icons mapping for workout days
const DAY_ICONS: { [key: string]: string } = {
  "אימון מלא": "dumbbell",
  "פלג גוף עליון": "arm-flex",
  "פלג גוף תחתון": "run",
  דחיפה: "arrow-up-bold",
  משיכה: "arrow-down-bold",
  רגליים: "run",
  חזה: "shield",
  גב: "human",
  "גב + ביצפס": "human",
  כתפיים: "shoulder",
  ידיים: "arm-flex",
  בטן: "ab-testing",
  "חזה + טריצפס": "shield",

  "כתפיים + בטן": "shoulder",
  "ידיים + בטן": "arm-flex",
  "בטן + קרדיו": "run-fast",
};

interface WorkoutPlanScreenProps {
  route?: {
    params?: {
      regenerate?: boolean;
      autoStart?: boolean;
      returnFromWorkout?: boolean;
      completedWorkoutId?: string;
    };
  };
}

export default function WorkoutPlanScreen({ route }: WorkoutPlanScreenProps) {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiMode, setAiMode] = useState(false); // 🤖 AI Mode toggle
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // אנימציות
  // Animations
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);

  // מיפוי מהיר של תרגילים לשיפור ביצועים
  // Quick exercise mapping for performance
  const exerciseMap = useMemo(() => {
    return ALL_EXERCISES.reduce(
      (acc, ex) => {
        acc[ex.id] = ex;
        return acc;
      },
      {} as Record<string, any>
    );
  }, []);

  // טעינת התוכנית בעת כניסה למסך או בקשה לחידוש
  // Load plan on screen entry or regeneration request
  useEffect(() => {
    const autoStart = route?.params?.autoStart;
    const returnFromWorkout = route?.params?.returnFromWorkout;

    if (returnFromWorkout) {
      handlePostWorkoutReturn();
    } else {
      generateWorkoutPlan(!!route?.params?.regenerate).then(() => {
        // אימון אוטומטי אם התבקש
        if (autoStart && workoutPlan?.workouts?.[0]) {
          setTimeout(() => {
            startWorkout(workoutPlan.workouts[0]);
          }, 1500);
        }
      });
    }
  }, [route?.params]);

  // אנימציית כניסה
  // Entry animation
  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  /**
   * טיפול בחזרה מאימון
   * Handle return from workout
   */
  const handlePostWorkoutReturn = () => {
    const workoutId = route?.params?.completedWorkoutId;
    if (workoutId) {
      console.log(`✅ Workout completed: ${workoutId}`);

      Alert.alert(
        "אימון הושלם! 🎉",
        "האם ברצונך לצפות בהתקדמות או ליצור תוכנית חדשה?",
        [
          { text: "הישאר כאן", style: "cancel" },
          {
            text: "צור תוכנית חדשה",
            onPress: () => generateWorkoutPlan(true),
          },
        ]
      );
    } else {
      generateWorkoutPlan();
    }
  };

  /**
   * יצירת תוכנית אימון מותאמת אישית
   * Generate personalized workout plan
   */
  /**
   * יצירת תוכנית אימון מותאמת אישית
   * Generate personalized workout plan
   */
  // 🤖 פונקציה חדשה ליצירת תוכנית AI
  const generateAIWorkoutPlan = async (forceRegenerate: boolean = false) => {
    try {
      setLoading(!refreshing);
      if (refreshing) setRefreshing(true);
      setAiMode(true);

      console.log("🤖 AI Algorithm: יוצר תוכנית AI מותאמת אישית...");

      // שימוש באלגוריתם ה-AI החדש!
      const aiPlan = await WorkoutDataService.generateAIWorkoutPlan();
      
      if (aiPlan) {
        setWorkoutPlan(aiPlan);
        
        if (forceRegenerate) {
          Alert.alert(
            "✅ תוכנית AI נוצרה!",
            `נוצרה תוכנית AI חדשה: "${aiPlan.name}"\n\n` +
            `📊 ציון AI: ${aiPlan.aiScore?.toFixed(0)}/100\n` +
            `🎯 רמת התאמה: ${aiPlan.personalizationLevel}\n` +
            `🏋️ ניצול ציוד: ${aiPlan.equipmentUtilization?.toFixed(0)}%\n` +
            `🔄 ציון מגוון: ${aiPlan.varietyScore}\n\n` +
            `${aiPlan.adaptations?.join(', ') || 'ללא התאמות מיוחדות'}`,
            [{ text: "מעולה!", style: "default" }]
          );
        }
      } else {
        throw new Error("AI failed to generate plan");
      }

    } catch (error: any) {
      console.error("❌ AI Plan Generation Error:", error);
      
      Alert.alert(
        "שגיאה ביצירת תוכנית AI",
        error.message === "NO_QUESTIONNAIRE_DATA" 
          ? "אנא השלם את השאלון תחילה"
          : "אירעה שגיאה ביצירת התוכנית. נסה שוב מאוחר יותר.",
        [
          { text: "אישור", style: "default" },
          {
            text: "נסה שוב",
            style: "default",
            onPress: () => generateAIWorkoutPlan(true),
          },
        ]
      );
      
      // fallback לתוכנית רגילה
      generateWorkoutPlan(forceRegenerate);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateWorkoutPlan = async (forceRegenerate: boolean = false) => {
    try {
      setLoading(!refreshing);
      if (refreshing) setRefreshing(true);

      console.log(
        `🧠 Generating workout plan${forceRegenerate ? " (forced)" : ""}...`
      );

      // קבלת נתוני המשתמש מהשאלון
      // Get user data from questionnaire
      const userQuestionnaireData = user?.questionnaire || {};
      const questData = userQuestionnaireData as any;
      // המרת נתונים לפורמט שה-WorkoutPlanScreen מצפה לו
      const metadata = {
        // משאלות האימון (שלב 1) - תמיכה בשני הפורמטים
        frequency: questData.trainingFrequency || questData[4],
        duration: questData.sessionDuration || questData[5],
        goal: questData.primaryGoal || questData[2],
        experience: questData.fitnessLevel || questData[3],
        location: questData.workoutLocation || questData[6],

        // נתונים נוספים מהשלב השני (אם קיימים)
        age: questData.age || questData[0],
        height: questData.height,
        weight: questData.weight,
        gender: questData.gender || questData[1],
      };

      // בדיקת שדות חובה
      const requiredFields = ["frequency", "duration", "goal", "experience"];
      const missingFields = requiredFields.filter(
        (field) => !metadata[field as keyof typeof metadata]
      );
      if (
        missingFields.length > 0 ||
        Object.keys(userQuestionnaireData).length === 0
      ) {
        console.error(`Missing required fields: ${missingFields.join(", ")}`);
        Alert.alert(
          "נתונים חסרים 📋",
          "יש להשלים את השאלון כדי לקבל תוכנית מותאמת אישית",
          [
            { text: "ביטול", style: "cancel" },
            {
              text: "לשאלון",
              onPress: () => navigation.navigate("Questionnaire" as never),
            },
          ]
        );
        return;
      }

      // 🔴 התיקון כאן - קבלת ציוד זמין
      let equipment = await questionnaireService.getAvailableEquipment();

      // בדיקת ציוד
      if (!equipment || equipment.length === 0) {
        console.warn("⚠️ No equipment data found, using default");
        equipment = ["bodyweight"]; // ברירת מחדל למשקל גוף
      }

      // המרת תדירות אימונים
      const frequencyMap: { [key: string]: number } = {
        "1-2 פעמים בשבוע": 2,
        "3-4 פעמים בשבוע": 3,
        "5-6 פעמים בשבוע": 5,
        "כל יום": 6,
      };
      const daysPerWeek = frequencyMap[metadata.frequency] || 3; // 🔴 תיקון - שימוש ב-frequency

      // בחירת סוג פיצול לפי מספר ימי אימון
      const splitType = getSplitType(
        daysPerWeek,
        metadata.experience || "מתחיל (0-6 חודשים)"
      );

      // יצירת התוכנית
      const plan = createWorkoutPlan(
        metadata,
        equipment,
        daysPerWeek,
        splitType
      );

      setWorkoutPlan(plan);

      // הודעת הצלחה אם זה חידוש
      if (forceRegenerate && !refreshing) {
        Alert.alert("✨ תוכנית חדשה נוצרה!", "התוכנית עודכנה בהתאם להעדפותיך");
      }

      console.log(
        `✅ Workout plan generated: ${plan.name} with ${plan.workouts.length} workouts`
      );
    } catch (error) {
      console.error("Error generating workout plan:", error);
      Alert.alert("שגיאה", "לא הצלחנו ליצור תוכנית אימון. נסה שוב.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  /**
   * רענון התוכנית
   * Refresh plan
   */
  const handleRefresh = () => {
    setRefreshing(true);
    generateWorkoutPlan(true);
  };

  /**
   * בחירת סוג פיצול לפי ימי אימון וניסיון
   * Select split type by training days and experience
   */
  const getSplitType = (days: number, experience: string): string => {
    if (days <= 2) return WORKOUT_SPLITS.FULL_BODY;
    if (days === 3) {
      return experience === "מתחיל (0-6 חודשים)" // 🔴 תיקון - השוואה לערך בעברית
        ? WORKOUT_SPLITS.FULL_BODY
        : WORKOUT_SPLITS.PUSH_PULL_LEGS;
    }
    if (days === 4) return WORKOUT_SPLITS.UPPER_LOWER;
    return WORKOUT_SPLITS.BODY_PART;
  };

  /**
   * יצירת תוכנית אימון
   * Create workout plan
   */
  const createWorkoutPlan = (
    metadata: any,
    equipment: string[],
    daysPerWeek: number,
    splitType: string
  ): WorkoutPlan => {
    const workouts: WorkoutTemplate[] = [];
    const dayNames =
      WORKOUT_DAYS[daysPerWeek as keyof typeof WORKOUT_DAYS] || WORKOUT_DAYS[3];

    // יצירת אימונים לכל יום
    // Create workouts for each day
    dayNames.forEach((dayName, index) => {
      const exercises = selectExercisesForDay(
        dayName,
        equipment,
        metadata.experience || "מתחיל (0-6 חודשים)", // 🔴 תיקון - ברירת מחדל בעברית
        parseInt(metadata.duration?.split("-")[0] || "45"),
        metadata
      );
      workouts.push({
        id: `day-${index + 1}`,
        name: dayName,
        exercises: exercises,
        estimatedDuration: calculateDuration(exercises),
        targetMuscles: extractTargetMuscles(exercises),
        equipment: extractEquipment(exercises),
      });
    });

    return {
      id: `plan-${Date.now()}`,
      name: `תוכנית AI ל${metadata.goal || "אימון"}`,
      description: `תוכנית חכמה מותאמת אישית ל${
        metadata.goal || "אימון"
      } - ${daysPerWeek} ימים בשבוע`,
      difficulty: mapExperienceToDifficulty(metadata.experience),
      duration: parseInt(metadata.duration?.split("-")[0] || "45"),
      frequency: daysPerWeek,
      workouts: workouts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["AI-Generated", metadata.goal, metadata.location].filter(Boolean),
    };
  };

  /**
   * בחירת תרגילים ליום אימון משופרת
   * Enhanced exercise selection for workout day
   */
  const selectExercisesForDay = (
    dayName: string,
    equipment: string[],
    experience: string,
    duration: number,
    metadata: any
  ): ExerciseTemplate[] => {
    const exercises: ExerciseTemplate[] = [];
    const targetMuscles = getTargetMusclesForDay(dayName);

    // סינון תרגילים מתאימים
    // Filter suitable exercises
    const suitableExercises = ALL_EXERCISES.filter((ex: any) => {
      // בדיקת התאמה לשרירים
      const muscleMatch = targetMuscles.some(
        (muscle) =>
          ex.primaryMuscles?.includes(muscle) || ex.category === muscle
      );

      // בדיקת התאמה לציוד
      const equipmentMatch =
        equipment.includes(ex.equipment) || ex.equipment === "bodyweight";

      // בדיקת התאמה לרמה
      const levelMatch = isExerciseSuitableForLevel(ex.difficulty, experience);

      return muscleMatch && equipmentMatch && levelMatch;
    });

    // בחירת מספר תרגילים לפי משך האימון
    // Select number of exercises by duration
    const exerciseCount = Math.min(
      Math.floor(duration / 8), // תרגיל לכל 8 דקות
      suitableExercises.length,
      8 // מקסימום 8 תרגילים
    );

    // חלוקה לתרגילים מורכבים ובידוד (רק אם יש תמיכה במאגר)
    // Split to compound and isolation (only if supported in database)
    const hasCompoundInfo = suitableExercises.some((ex: any) =>
      ex.hasOwnProperty("isCompound")
    );

    if (hasCompoundInfo && metadata.goal !== "שיקום מפציעה") {
      const compoundExercises = suitableExercises.filter(
        (ex: any) => ex.isCompound
      );
      const isolationExercises = suitableExercises.filter(
        (ex: any) => !ex.isCompound
      );

      // יחס של 60% מורכבים, 40% בידוד
      const compoundCount = Math.ceil(exerciseCount * 0.6);
      const isolationCount = exerciseCount - compoundCount;

      // בחירת תרגילים מורכבים
      const selectedCompounds = selectRandomExercises(
        compoundExercises,
        compoundCount
      );
      const selectedIsolation = selectRandomExercises(
        isolationExercises,
        isolationCount
      );

      // שילוב והמרה לתבנית
      [...selectedCompounds, ...selectedIsolation].forEach((exercise) => {
        exercises.push(createExerciseTemplate(exercise, experience, metadata));
      });
    } else {
      // בחירה רגילה ללא חלוקה
      const selectedExercises = selectRandomExercises(
        suitableExercises,
        exerciseCount
      );
      selectedExercises.forEach((exercise) => {
        exercises.push(createExerciseTemplate(exercise, experience, metadata));
      });
    }

    return exercises;
  };

  /**
   * בחירת תרגילים אקראיים מרשימה
   * Select random exercises from list
   */
  const selectRandomExercises = (exercises: any[], count: number): any[] => {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  /**
   * יצירת תבנית תרגיל
   * Create exercise template
   */
  const createExerciseTemplate = (
    exercise: any,
    experience: string,
    metadata: any
  ): ExerciseTemplate => {
    return {
      exerciseId: exercise.id,
      sets: getSetsForExercise(exercise, experience),
      reps: getRepsForGoal(exercise, experience, metadata),
      restTime: getRestTimeForExercise(exercise, experience, metadata),
      notes: getExerciseNotes(exercise, experience),
    };
  };

  /**
   * קבלת שרירי יעד ליום אימון
   * Get target muscles for workout day
   */
  const getTargetMusclesForDay = (dayName: string): string[] => {
    const muscleMap: { [key: string]: string[] } = {
      "אימון מלא": ["חזה", "גב", "רגליים", "כתפיים"],
      "פלג גוף עליון": ["חזה", "גב", "כתפיים", "ידיים"],
      "פלג גוף תחתון": ["רגליים", "ישבן"],
      דחיפה: ["חזה", "כתפיים", "טריצפס"],
      משיכה: ["גב", "ביצפס"],
      רגליים: ["רגליים", "ישבן"],
      "חזה + טריצפס": ["חזה", "טריצפס"],
      "גב + ביצפס": ["גב", "ביצפס"],
      "כתפיים + בטן": ["כתפיים", "בטן"],
      "ידיים + בטן": ["ביצפס", "טריצפס", "בטן"],
      "בטן + קרדיו": ["בטן"],
    };

    return muscleMap[dayName] || ["גוף מלא"];
  };

  /**
   * בדיקת התאמת תרגיל לרמה
   * Check if exercise suits level
   */
  const isExerciseSuitableForLevel = (
    exerciseDifficulty: string | undefined,
    userExperience: string
  ): boolean => {
    const levelMap: { [key: string]: number } = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };

    const userLevel = levelMap[mapExperienceToLevel(userExperience)] || 1;
    const exerciseLevel = levelMap[exerciseDifficulty || "beginner"] || 1;

    // מתחילים יכולים לעשות רק תרגילי מתחילים
    // Beginners can only do beginner exercises
    if (userLevel === 1) return exerciseLevel === 1;

    // בינוניים יכולים לעשות מתחילים ובינוניים
    // Intermediate can do beginner and intermediate
    if (userLevel === 2) return exerciseLevel <= 2;

    // מתקדמים יכולים לעשות הכל
    // Advanced can do all
    return true;
  };

  /**
   * קבלת מספר סטים לתרגיל
   * Get sets for exercise
   */
  const getSetsForExercise = (exercise: any, experience: string): number => {
    const setsMap: { [key: string]: number } = {
      "מתחיל (0-6 חודשים)": 3,
      "בינוני (6-24 חודשים)": 4,
      "מתקדם (2+ שנים)": 4,
      מקצועי: 5,
    };

    return setsMap[experience] || 3;
  };

  /**
   * קבלת טווח חזרות משופר למטרה
   * Enhanced reps range for goal
   */
  const getRepsForGoal = (
    exercise: any,
    experience: string,
    metadata: any
  ): string => {
    const goal = metadata?.goal;

    // התאמה לתרגילי בטן
    // Adjust for core exercises
    if (exercise.category === "בטן") {
      return "15-25";
    }

    // התאמה לשיקום
    if (goal === "שיקום מפציעה") {
      if (experience === "מתחיל (0-6 חודשים)") {
        return "15-20";
      }
      return "12-15";
    }

    // התאמה לגיל (אם יש בנתונים)
    const age = metadata.age;
    if (age && parseInt(age) > 50) {
      const ageAdjustment = {
        "ירידה במשקל": "15-20",
        "עליה במסת שריר": "10-15",
        "שיפור כוח": "5-8",
        "שיפור סיבולת": "20-25",
        "בריאות כללית": "12-18",
      };
      return ageAdjustment[goal as keyof typeof ageAdjustment] || "12-15";
    }

    // מיפוי רגיל
    const repsMap: { [key: string]: string } = {
      "ירידה במשקל": "12-15",
      "עליה במסת שריר": "8-12",
      "שיפור כוח": "3-6",
      "שיפור סיבולת": "15-20",
      "בריאות כללית": "10-15",
    };

    return repsMap[goal || "בריאות כללית"] || "10-15";
  };

  /**
   * קבלת זמן מנוחה לתרגיל
   * Get rest time for exercise
   */
  const getRestTimeForExercise = (
    exercise: any,
    experience: string,
    metadata: any
  ): number => {
    const goal = metadata?.goal;

    // זמני מנוחה לפי מטרה (בשניות)
    // Rest times by goal (in seconds)
    const restMap: { [key: string]: number } = {
      "ירידה במשקל": 45,
      "עליה במסת שריר": 90,
      "שיפור כוח": 180,
      "שיפור סיבולת": 30,
      "בריאות כללית": 60,
      "שיקום מפציעה": 60,
    };

    return restMap[goal || "בריאות כללית"] || 60;
  };

  /**
   * קבלת הערות לתרגיל
   * Get exercise notes
   */
  const getExerciseNotes = (exercise: any, experience: string): string => {
    const notes: string[] = [];

    if (experience === "מתחיל (0-6 חודשים)") {
      notes.push("התחל עם משקל קל וצור טכניקה טובה");
    }

    if (exercise.equipment === "bodyweight") {
      notes.push("התאם את הקושי לפי הצורך");
    }

    if (exercise.difficulty === "advanced") {
      notes.push("שמור על טכניקה מושלמת");
    }

    return notes.join(". ");
  };

  /**
   * חישוב משך אימון משוער
   * Calculate estimated duration
   */
  const calculateDuration = (exercises: ExerciseTemplate[]): number => {
    let totalTime = 0;

    exercises.forEach((ex) => {
      // זמן לסט (כולל ביצוע): 1 דקה
      // Time per set (including execution): 1 minute
      const setsTime = ex.sets * 1;

      // זמן מנוחה בין סטים
      // Rest time between sets
      const restTime = (ex.sets - 1) * (ex.restTime / 60);

      // זמן חימום והכנה: 2 דקות
      // Warmup and setup: 2 minutes
      const setupTime = 2;

      totalTime += setsTime + restTime + setupTime;
    });

    return Math.round(totalTime);
  };

  /**
   * חילוץ שרירי יעד
   * Extract target muscles
   */
  const extractTargetMuscles = (exercises: ExerciseTemplate[]): string[] => {
    const muscles = new Set<string>();

    exercises.forEach((ex: ExerciseTemplate) => {
      const exercise = exerciseMap[ex.exerciseId];
      if (exercise && exercise.primaryMuscles) {
        exercise.primaryMuscles.forEach((m: string) => muscles.add(m));
      }
    });

    return Array.from(muscles);
  };

  /**
   * חילוץ ציוד נדרש
   * Extract required equipment
   */
  const extractEquipment = (exercises: ExerciseTemplate[]): string[] => {
    const equipment = new Set<string>();

    exercises.forEach((ex: ExerciseTemplate) => {
      const exercise = exerciseMap[ex.exerciseId];
      if (exercise) {
        equipment.add(exercise.equipment);
      }
    });

    return Array.from(equipment);
  };

  /**
   * המרת ניסיון לרמת קושי
   * Map experience to difficulty
   */
  const mapExperienceToDifficulty = (
    experience?: string
  ): "beginner" | "intermediate" | "advanced" => {
    const map: { [key: string]: "beginner" | "intermediate" | "advanced" } = {
      "מתחיל (0-6 חודשים)": "beginner",
      "בינוני (6-24 חודשים)": "intermediate",
      "מתקדם (2+ שנים)": "advanced",
      מקצועי: "advanced",
    };

    return map[experience || ""] || "beginner";
  };

  /**
   * המרת ניסיון לרמה
   * Map experience to level
   */
  const mapExperienceToLevel = (experience: string): string => {
    const map: { [key: string]: string } = {
      "מתחיל (0-6 חודשים)": "beginner",
      "בינוני (6-24 חודשים)": "intermediate",
      "מתקדם (2+ שנים)": "advanced",
      מקצועי: "advanced",
    };

    return map[experience] || "beginner";
  };

  /**
   * התחלת אימון משופרת
   * Enhanced start workout
   */
  const startWorkout = (workout: WorkoutTemplate) => {
    try {
      console.log(`🏋️ Starting workout: ${workout.name}`);

      // המרת התבנית לאימון פעיל
      // Convert template to active workout
      const activeExercises = workout.exercises
        .map((template: ExerciseTemplate) => {
          const exercise = exerciseMap[template.exerciseId];
          if (!exercise) {
            console.warn(`Exercise not found: ${template.exerciseId}`);
            return null;
          }

          return {
            ...exercise,
            sets: Array.from({ length: template.sets }, (_, i) => ({
              id: `set-${i + 1}`,
              type: i === 0 ? "warmup" : ("working" as const),
              targetReps: parseInt(template.reps.split("-")[1] || "12"),
              targetWeight: 0,
              completed: false,
              restTime: template.restTime,
              isPR: false,
            })),
            notes: template.notes,
          };
        })
        .filter(Boolean);

      if (activeExercises.length === 0) {
        Alert.alert("שגיאה", "לא נמצאו תרגילים מתאימים לאימון זה.");
        return;
      }

      // ניווט למסך אימון פעיל
      // Navigate to active workout screen
      (navigation as any).navigate("QuickWorkout", {
        exercises: activeExercises,
        workoutName: workout.name,
        workoutId: workout.id,
        source: "workout_plan",
        planData: {
          targetMuscles: workout.targetMuscles,
          estimatedDuration: workout.estimatedDuration,
          equipment: workout.equipment,
        },
      });

      console.log(
        `✅ Navigated to QuickWorkout with ${activeExercises.length} exercises`
      );
    } catch (error) {
      console.error("Error starting workout:", error);
      Alert.alert("שגיאה", "לא הצלחנו להתחיל את האימון. נסה שוב.");
    }
  };

  /**
   * הצגת פרטי תרגיל משופרת
   * Enhanced exercise details display
   */
  const showExerciseDetails = (exerciseId: string) => {
    if (expandedExercise === exerciseId) {
      setExpandedExercise(null);
    } else {
      setExpandedExercise(exerciseId);
    }
  };

  /**
   * החלפת תרגיל
   * Replace exercise
   */
  const replaceExercise = (exerciseId: string, dayIndex: number) => {
    Alert.alert("החלפת תרגיל", "האם ברצונך להחליף את התרגיל הנוכחי?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "החלף",
        onPress: () => {
          // לוגיקה להחלפת תרגיל
          console.log("Replace exercise:", exerciseId);
          Alert.alert("בקרוב", "אפשרות החלפת תרגילים תהיה זמינה בקרוב");
        },
      },
    ]);
  };

  // מסך טעינה
  // Loading screen
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons
          name="brain"
          size={80}
          color={theme.colors.primary}
        />
        <Text style={styles.loadingText}>
          יוצר תוכנית אימון מותאמת אישית...
        </Text>
        <Text style={styles.loadingSubtext}>
          מנתח את הנתונים שלך ומתאים תרגילים חכמים
        </Text>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  // מסך שגיאה
  // Error screen
  if (!workoutPlan) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={64}
          color={theme.colors.error}
        />
        <Text style={styles.errorText}>לא הצלחנו ליצור תוכנית אימון</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => generateWorkoutPlan()}
        >
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // המסך הראשי
  // Main screen
  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              title="מרענן תוכנית..."
              titleColor={theme.colors.text}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={28}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <View style={styles.titleRow}>
                <MaterialCommunityIcons
                  name={aiMode ? "robot" : "brain"}
                  size={28}
                  color={aiMode ? "#FF6B35" : theme.colors.primary}
                />
                <Text style={styles.title}>{workoutPlan.name}</Text>
                {aiMode && (
                  <View style={styles.aiIndicator}>
                    <Text style={styles.aiIndicatorText}>🤖 AI</Text>
                  </View>
                )}
              </View>
              <Text style={styles.subtitle}>{workoutPlan.description}</Text>

              {/* תגיות */}
              {/* Tags */}
              <View style={styles.tagsContainer}>
                {workoutPlan.tags &&
                  workoutPlan.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
              </View>
            </View>

            {/* סטטיסטיקות משופרות */}
            {/* Enhanced stats */}
            <View style={styles.statsContainer}>
              <LinearGradient
                colors={[
                  theme.colors.primary + "20",
                  theme.colors.primary + "10",
                ]}
                style={styles.statsGradient}
              >
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="calendar-week"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.statValue}>
                      {workoutPlan.frequency}
                    </Text>
                    <Text style={styles.statLabel}>ימים בשבוע</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.statValue}>{workoutPlan.duration}</Text>
                    <Text style={styles.statLabel}>דקות לאימון</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="arm-flex"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.statValue}>
                      {workoutPlan.difficulty === "beginner"
                        ? "מתחיל"
                        : workoutPlan.difficulty === "intermediate"
                          ? "בינוני"
                          : "מתקדם"}
                    </Text>
                    <Text style={styles.statLabel}>רמת קושי</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* בחירת יום משופרת */}
          {/* Enhanced day selector */}
          <View style={styles.daySelectorWrapper}>
            <Text style={styles.sectionTitle}>בחר יום אימון</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daySelector}
              style={styles.daySelectorContainer}
            >
              {workoutPlan.workouts.map((workout, index) => (
                <TouchableOpacity
                  key={workout.id}
                  style={[
                    styles.dayCard,
                    selectedDay === index && styles.dayCardActive,
                  ]}
                  onPress={() => setSelectedDay(index)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={
                      selectedDay === index
                        ? [theme.colors.primary, theme.colors.primary + "DD"]
                        : ["transparent", "transparent"]
                    }
                    style={styles.dayCardGradient}
                  >
                    <MaterialCommunityIcons
                      name={(DAY_ICONS[workout.name] || "dumbbell") as any}
                      size={32}
                      color={
                        selectedDay === index ? "#FFFFFF" : theme.colors.primary
                      }
                    />
                    <Text
                      style={[
                        styles.dayCardTitle,
                        selectedDay === index && styles.dayCardTitleActive,
                      ]}
                    >
                      יום {index + 1}
                    </Text>
                    <Text
                      style={[
                        styles.dayCardSubtitle,
                        selectedDay === index && styles.dayCardSubtitleActive,
                      ]}
                    >
                      {workout.name}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* פרטי היום הנבחר */}
          {/* Selected day details */}
          {workoutPlan.workouts[selectedDay] && (
            <View style={styles.dayDetails}>
              <View style={styles.dayHeader}>
                <View style={styles.dayHeaderTop}>
                  <MaterialCommunityIcons
                    name={
                      (DAY_ICONS[workoutPlan.workouts[selectedDay].name] ||
                        "dumbbell") as any
                    }
                    size={36}
                    color={theme.colors.primary}
                  />
                  <View style={styles.dayHeaderInfo}>
                    <Text style={styles.dayTitle}>
                      {workoutPlan.workouts[selectedDay].name}
                    </Text>
                    <View style={styles.dayStats}>
                      <Text style={styles.dayStatText}>
                        {workoutPlan.workouts[selectedDay].exercises.length}{" "}
                        תרגילים
                      </Text>
                      <Text style={styles.dayStatDivider}>•</Text>
                      <Text style={styles.dayStatText}>
                        {workoutPlan.workouts[selectedDay].estimatedDuration}{" "}
                        דקות
                      </Text>
                    </View>
                  </View>
                </View>

                {/* שרירי יעד */}
                {/* Target muscles */}
                <View style={styles.targetMuscles}>
                  <Text style={styles.targetMusclesTitle}>שרירי יעד:</Text>
                  <View style={styles.muscleChips}>
                    {workoutPlan.workouts[selectedDay].targetMuscles.map(
                      (muscle, index) => (
                        <View key={index} style={styles.muscleChip}>
                          <Text style={styles.muscleChipText}>{muscle}</Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              </View>

              {/* רשימת תרגילים משופרת */}
              {/* Enhanced exercise list */}
              <View style={styles.exerciseList}>
                {workoutPlan.workouts[selectedDay].exercises.map(
                  (exerciseTemplate: ExerciseTemplate, index: number) => {
                    const exercise = exerciseMap[exerciseTemplate.exerciseId];
                    if (!exercise) return null;

                    const isExpanded =
                      expandedExercise === exerciseTemplate.exerciseId;

                    return (
                      <View key={index} style={styles.exerciseCardWrapper}>
                        <TouchableOpacity
                          style={[
                            styles.exerciseCard,
                            isExpanded && styles.exerciseCardExpanded,
                          ]}
                          onPress={() =>
                            showExerciseDetails(exerciseTemplate.exerciseId)
                          }
                          activeOpacity={0.7}
                        >
                          <View style={styles.exerciseCardHeader}>
                            <View style={styles.exerciseNumber}>
                              <Text style={styles.exerciseNumberText}>
                                {index + 1}
                              </Text>
                            </View>

                            <View style={styles.exerciseInfo}>
                              <Text style={styles.exerciseName}>
                                {exercise.name}
                              </Text>
                              <View style={styles.exerciseDetails}>
                                <View style={styles.exerciseDetailItem}>
                                  <MaterialCommunityIcons
                                    name="repeat"
                                    size={16}
                                    color={theme.colors.textSecondary}
                                  />
                                  <Text style={styles.exerciseDetailText}>
                                    {exerciseTemplate.sets} סטים
                                  </Text>
                                </View>
                                <View style={styles.exerciseDetailItem}>
                                  <MaterialCommunityIcons
                                    name="counter"
                                    size={16}
                                    color={theme.colors.textSecondary}
                                  />
                                  <Text style={styles.exerciseDetailText}>
                                    {exerciseTemplate.reps} חזרות
                                  </Text>
                                </View>
                                <View style={styles.exerciseDetailItem}>
                                  <MaterialCommunityIcons
                                    name="timer-sand"
                                    size={16}
                                    color={theme.colors.textSecondary}
                                  />
                                  <Text style={styles.exerciseDetailText}>
                                    {exerciseTemplate.restTime}s מנוחה
                                  </Text>
                                </View>
                              </View>
                            </View>

                            <MaterialCommunityIcons
                              name={isExpanded ? "chevron-up" : "chevron-down"}
                              size={24}
                              color={theme.colors.primary}
                            />
                          </View>

                          {/* פרטים נוספים */}
                          {/* Additional details */}
                          {isExpanded && (
                            <View style={styles.exerciseExpanded}>
                              {exerciseTemplate.notes && (
                                <View style={styles.exerciseNotesContainer}>
                                  <MaterialCommunityIcons
                                    name="information"
                                    size={16}
                                    color={theme.colors.primary}
                                  />
                                  <Text style={styles.exerciseNotes}>
                                    {exerciseTemplate.notes}
                                  </Text>
                                </View>
                              )}

                              <View style={styles.exerciseExpandedDetails}>
                                <View style={styles.exerciseExpandedRow}>
                                  <Text style={styles.exerciseExpandedLabel}>
                                    קטגוריה:
                                  </Text>
                                  <Text style={styles.exerciseExpandedValue}>
                                    {exercise.category}
                                  </Text>
                                </View>
                                <View style={styles.exerciseExpandedRow}>
                                  <Text style={styles.exerciseExpandedLabel}>
                                    ציוד:
                                  </Text>
                                  <Text style={styles.exerciseExpandedValue}>
                                    {exercise.equipment}
                                  </Text>
                                </View>
                                <View style={styles.exerciseExpandedRow}>
                                  <Text style={styles.exerciseExpandedLabel}>
                                    רמת קושי:
                                  </Text>
                                  <Text style={styles.exerciseExpandedValue}>
                                    {exercise.difficulty === "beginner"
                                      ? "מתחיל"
                                      : exercise.difficulty === "intermediate"
                                        ? "בינוני"
                                        : "מתקדם"}
                                  </Text>
                                </View>
                              </View>

                              <TouchableOpacity
                                style={styles.replaceButton}
                                onPress={() =>
                                  replaceExercise(
                                    exerciseTemplate.exerciseId,
                                    selectedDay
                                  )
                                }
                              >
                                <MaterialCommunityIcons
                                  name="swap-horizontal"
                                  size={18}
                                  color={theme.colors.primary}
                                />
                                <Text style={styles.replaceButtonText}>
                                  החלף תרגיל
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  }
                )}
              </View>

              {/* כפתור התחלה משופר */}
              {/* Enhanced start button */}
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => startWorkout(workoutPlan.workouts[selectedDay])}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[theme.colors.success, theme.colors.success + "DD"]}
                  style={styles.startButtonGradient}
                >
                  <MaterialCommunityIcons
                    name="play"
                    size={28}
                    color="#FFFFFF"
                  />
                  <Text style={styles.startButtonText}>התחל אימון</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* פעולות נוספות */}
          {/* Additional actions */}
          <View style={styles.actions}>
            {/* 🤖 כפתור AI חדש */}
            <TouchableOpacity
              style={[styles.actionButton, styles.aiButton]}
              onPress={() => generateAIWorkoutPlan(true)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[
                  "#FF6B35" + "20",
                  "#FF6B35" + "10",
                ]}
                style={styles.actionButtonGradient}
              >
                <MaterialCommunityIcons
                  name="robot"
                  size={22}
                  color="#FF6B35"
                />
                <Text style={[styles.actionButtonText, { color: "#FF6B35" }]}>
                  🤖 תוכנית AI חכמה
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => generateWorkoutPlan(true)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[
                  theme.colors.primary + "15",
                  theme.colors.primary + "05",
                ]}
                style={styles.actionButtonGradient}
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={22}
                  color={theme.colors.primary}
                />
                <Text style={styles.actionButtonText}>צור תוכנית רגילה</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Alert.alert("בקרוב", "שמירת תוכניות תהיה זמינה בקרוב")
              }
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[
                  theme.colors.primary + "15",
                  theme.colors.primary + "05",
                ]}
                style={styles.actionButtonGradient}
              >
                <MaterialCommunityIcons
                  name="content-save"
                  size={22}
                  color={theme.colors.primary}
                />
                <Text style={styles.actionButtonText}>שמור תוכנית</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: theme.colors.text,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    ...theme.shadows.medium,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 60,
    right: theme.spacing.lg,
    zIndex: 1,
    padding: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card + "80",
  },
  titleContainer: {
    marginTop: 36,
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  aiIndicator: {
    backgroundColor: "#FF6B35" + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF6B35" + "40",
  },
  aiIndicatorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF6B35",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  tag: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  statsContainer: {
    marginTop: 20,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  statsGradient: {
    padding: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
    marginHorizontal: 10,
  },
  daySelectorWrapper: {
    paddingTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: 12,
  },
  daySelectorContainer: {
    maxHeight: 140,
  },
  daySelector: {
    paddingHorizontal: theme.spacing.lg,
    gap: 12,
  },
  dayCard: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  dayCardActive: {
    borderColor: theme.colors.primary,
    ...theme.shadows.large,
  },
  dayCardGradient: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    minWidth: 110,
    alignItems: "center",
  },
  dayCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 8,
  },
  dayCardTitleActive: {
    color: "#FFFFFF",
  },
  dayCardSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  dayCardSubtitleActive: {
    color: "#FFFFFF",
    opacity: 0.9,
  },
  dayDetails: {
    padding: theme.spacing.lg,
  },
  dayHeader: {
    marginBottom: 24,
  },
  dayHeaderTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  dayHeaderInfo: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: 8,
  },
  dayStats: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  dayStatText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  dayStatDivider: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  targetMuscles: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  targetMusclesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: 8,
  },
  muscleChips: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  muscleChip: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  muscleChipText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  exerciseList: {
    gap: 12,
  },
  exerciseCardWrapper: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  exerciseCardExpanded: {
    borderColor: theme.colors.primary,
  },
  exerciseCardHeader: {
    flexDirection: "row-reverse",
    padding: theme.spacing.md,
    alignItems: "center",
  },
  exerciseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "right",
  },
  exerciseDetails: {
    flexDirection: "row-reverse",
    gap: 16,
    flexWrap: "wrap",
  },
  exerciseDetailItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  exerciseDetailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  exerciseExpanded: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  exerciseNotesContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: theme.colors.info + "10",
    padding: 12,
    borderRadius: theme.radius.sm,
    marginBottom: 12,
  },
  exerciseNotes: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    textAlign: "right",
    lineHeight: 18,
  },
  exerciseExpandedDetails: {
    gap: 8,
    marginBottom: 12,
  },
  exerciseExpandedRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseExpandedLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  exerciseExpandedValue: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "500",
  },
  replaceButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  replaceButtonText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  startButton: {
    marginTop: 28,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    elevation: 6,
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  startButtonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 40,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  actions: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    padding: theme.spacing.lg,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  aiButton: {
    borderWidth: 2,
    borderColor: "#FF6B35" + "30",
  },
  actionButtonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
