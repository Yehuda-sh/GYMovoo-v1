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
import { ExerciseTemplate as DatabaseExercise } from "../../services/quickWorkoutGenerator";

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

// דיבוג - הצגת אפשרויות הימים
console.log(`🔍 DEBUG: WORKOUT_DAYS options:`, WORKOUT_DAYS);

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
  const [aiMode, setAiMode] = useState(false); // 🏠 Basic Mode is now DEFAULT to prevent repetitions
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [availableEquipment, setAvailableEquipment] = useState<string[]>([]);

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
      {} as Record<string, DatabaseExercise>
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
      // 🏠 Default to basic workout plan generation to prevent repetitions
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

  // טעינת ציוד זמין
  // Load available equipment
  useEffect(() => {
    const loadEquipment = async () => {
      const equipment = await getAvailableEquipment();
      setAvailableEquipment(equipment);
    };
    loadEquipment();
  }, []);

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
      console.log(
        "🔄 DEBUG: generateAIWorkoutPlan called with forceRegenerate:",
        forceRegenerate
      );

      // איפוס מטמון התרגילים המשומשים בתחילת כל יצירת תוכנית
      (global as any).usedExercises_day0 = new Set<string>();
      (global as any).usedExercises_day1 = new Set<string>();
      (global as any).usedExercises_day2 = new Set<string>();
      console.log("🧹 Cleared exercise usage cache for new plan generation");

      // שימוש באלגוריתם ה-AI החדש!
      const aiPlan = await WorkoutDataService.generateAIWorkoutPlan();

      if (aiPlan) {
        console.log(
          "✅ DEBUG: AI Plan created with",
          aiPlan.workouts.length,
          "workouts"
        );
        console.log(
          "📋 DEBUG: AI Workouts:",
          aiPlan.workouts.map((w) => ({
            name: w.name,
            exerciseCount: w.exercises.length,
          }))
        );

        setWorkoutPlan(aiPlan);

        console.log(`✅ DEBUG: AI Plan set successfully!`);
        console.log(`✅ DEBUG: Plan has ${aiPlan.workouts.length} workouts`);
        console.log(
          `✅ DEBUG: Plan frequency: ${aiPlan.frequency} days per week`
        );
        console.log(
          `✅ DEBUG: Plan workouts:`,
          aiPlan.workouts.map(
            (w, i) => `${i + 1}. ${w.name} (${w.exercises.length} exercises)`
          )
        );

        if (forceRegenerate) {
          Alert.alert(
            "🤖 תוכנית AI חדשה נוצרה!",
            `נוצרה תוכנית חכמה: "${aiPlan.name}"\n\n` +
              `📊 ציון התאמה: ${aiPlan.aiScore?.toFixed(0)}/100\n` +
              `🎯 רמה: ${aiPlan.personalizationLevel === "basic" ? "בסיסית" : aiPlan.personalizationLevel === "advanced" ? "מתקדמת" : "מומחה"}\n` +
              `🏋️ ניצול ציוד: ${aiPlan.equipmentUtilization?.toFixed(0)}%\n\n` +
              `✨ התוכנית תתאים את עצמה לפי הביצועים שלך!`,
            [{ text: "בואו נתחיל! 💪", style: "default" }]
          );
        }
      } else {
        throw new Error("AI failed to generate plan");
      }
    } catch (error: unknown) {
      console.error("❌ AI Plan Generation Error:", error);

      Alert.alert(
        "שגיאה ביצירת תוכנית AI",
        error instanceof Error && error.message === "NO_QUESTIONNAIRE_DATA"
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
      setAiMode(false); // Switch to basic mode

      console.log(
        `🧠 Generating basic workout plan${forceRegenerate ? " (forced)" : ""}...`
      );
      console.log("🔄 DEBUG: generateWorkoutPlan (FALLBACK) called");

      // איפוס מטמון התרגילים המשומשים בתחילת כל יצירת תוכנית
      (global as any).usedExercises_day0 = new Set<string>();
      (global as any).usedExercises_day1 = new Set<string>();
      (global as any).usedExercises_day2 = new Set<string>();
      console.log("🧹 Cleared exercise usage cache for new plan generation");

      // קבלת נתוני המשתמש מהשאלון
      // Get user data from questionnaire
      const userQuestionnaireData = user?.questionnaire || {};
      const questData = userQuestionnaireData as Record<
        string | number,
        string | string[]
      >;

      // 🔍 DEBUG: בדיקת נתוני השאלון
      console.log(`🔍 DEBUG: Raw questionnaire data:`, userQuestionnaireData);
      console.log(
        `🔍 DEBUG: Available keys:`,
        Object.keys(userQuestionnaireData)
      );
      console.log(`🔍 DEBUG: questData[0]:`, questData[0]);
      console.log(`🔍 DEBUG: questData[1]:`, questData[1]);
      console.log(`🔍 DEBUG: questData[2]:`, questData[2]);
      console.log(`🔍 DEBUG: questData[3]:`, questData[3]);
      console.log(`🔍 DEBUG: questData[4]:`, questData[4]);
      console.log(`🔍 DEBUG: questData[5]:`, questData[5]);
      console.log(`🔍 DEBUG: questData[6]:`, questData[6]);

      // המרת נתונים לפורמט שה-WorkoutPlanScreen מצפה לו
      const metadata = {
        // 🔧 FIX: תיקון מיפוי השדות - שימוש במפתחות הנכונים מהלוג
        frequency: questData.frequency || questData[7], // 🔧 השתמש ב-[7] במקום [4]
        duration: questData.duration || questData[8], // 🔧 השתמש ב-[8] במקום [5]
        goal: questData.goal || questData[5], // 🔧 השתמש ב-[5] במקום [2]
        experience: questData.experience || questData[6], // 🔧 השתמש ב-[6] במקום [3]
        location: questData.location || questData[9], // 🔧 השתמש ב-[9] במקום [6]

        // נתונים נוספים מהשלב השני (אם קיימים)
        age: questData.age || questData[1], // 🔧 השתמש ב-[1] במקום [0]
        height: questData.height || questData[3], // 🔧 גם גובה
        weight: questData.weight || questData[4], // 🔧 גם משקל
        gender: questData.gender || questData[2], // 🔧 גם מין
      };

      // 🔍 DEBUG: בדיקת מטא-דטה
      console.log(`🔍 DEBUG: Parsed metadata:`, metadata);
      console.log(`🔍 DEBUG: metadata.experience:`, metadata.experience);
      console.log(`🔍 DEBUG: metadata.duration:`, metadata.duration);
      console.log(`🔍 DEBUG: metadata.frequency:`, metadata.frequency);

      // 🔧 FIX: Apply smart defaults for invalid data
      if (
        !metadata.experience ||
        typeof metadata.experience !== "string" ||
        !isNaN(Number(metadata.experience))
      ) {
        console.log(
          `🔧 DEBUG: Invalid experience "${metadata.experience}", using default`
        );
        metadata.experience = "בינוני (6-24 חודשים)";
      } else if (metadata.experience === "beginner") {
        // 🔧 FIX: המרת פורמט אנגלי לעברי
        console.log(
          `🔧 DEBUG: Converting experience "beginner" → "מתחיל (0-6 חודשים)"`
        );
        metadata.experience = "מתחיל (0-6 חודשים)";
      } else if (metadata.experience === "intermediate") {
        console.log(
          `🔧 DEBUG: Converting experience "intermediate" → "בינוני (6-24 חודשים)"`
        );
        metadata.experience = "בינוני (6-24 חודשים)";
      } else if (metadata.experience === "advanced") {
        console.log(
          `🔧 DEBUG: Converting experience "advanced" → "מתקדם (2+ שנים)"`
        );
        metadata.experience = "מתקדם (2+ שנים)";
      }

      if (!metadata.duration || typeof metadata.duration !== "string") {
        console.log(
          `🔧 DEBUG: Invalid duration "${metadata.duration}", using default`
        );
        metadata.duration = "45-60 דקות";
      } else if (metadata.duration.includes("_min")) {
        // 🔧 FIX: המרת פורמט אנגלי לעברי
        const durationMap: { [key: string]: string } = {
          "30_min": "30-45 דקות",
          "45_min": "45-60 דקות",
          "60_min": "60-75 דקות",
          "90_min": "75-90 דקות",
        };
        const convertedDuration =
          durationMap[metadata.duration] || "45-60 דקות";
        console.log(
          `🔧 DEBUG: Converting duration "${metadata.duration}" → "${convertedDuration}"`
        );
        metadata.duration = convertedDuration;
      }

      if (!metadata.frequency || typeof metadata.frequency !== "string") {
        console.log(
          `🔧 DEBUG: Invalid frequency "${metadata.frequency}", using default`
        );
        metadata.frequency = "3-4 פעמים בשבוע";
      }

      if (!metadata.goal || typeof metadata.goal !== "string") {
        console.log(`🔧 DEBUG: Invalid goal "${metadata.goal}", using default`);
        metadata.goal = "בריאות כללית";
      } else if (metadata.goal === "endurance") {
        // 🔧 FIX: המרת פורמט אנגלי לעברי
        console.log(`🔧 DEBUG: Converting goal "endurance" → "שיפור סיבולת"`);
        metadata.goal = "שיפור סיבולת";
      } else if (metadata.goal === "strength") {
        console.log(`🔧 DEBUG: Converting goal "strength" → "שיפור כוח"`);
        metadata.goal = "שיפור כוח";
      } else if (metadata.goal === "weight_loss") {
        console.log(`🔧 DEBUG: Converting goal "weight_loss" → "ירידה במשקל"`);
        metadata.goal = "ירידה במשקל";
      } else if (metadata.goal === "muscle_gain") {
        console.log(
          `🔧 DEBUG: Converting goal "muscle_gain" → "עליה במסת שריר"`
        );
        metadata.goal = "עליה במסת שריר";
      } else if (metadata.goal === "general_fitness") {
        console.log(
          `🔧 DEBUG: Converting goal "general_fitness" → "בריאות כללית"`
        );
        metadata.goal = "בריאות כללית";
      }

      console.log(`🔧 DEBUG: Final metadata after fixes:`, {
        experience: metadata.experience,
        duration: metadata.duration,
        frequency: metadata.frequency,
        goal: metadata.goal,
      });

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

      // המרת תדירות אימונים - תמיכה בפורמטים העברי והאנגלי
      const frequencyMap: { [key: string]: number } = {
        // פורמט עברי (ישן)
        "1-2 פעמים בשבוע": 2,
        "3-4 פעמים בשבוע": 3,
        "5-6 פעמים בשבוע": 5,
        "כל יום": 6,
        // 🔧 FIX: פורמט אנגלי (חדש) מהשאלון הנוכחי
        "2_times": 2,
        "3_times": 3,
        "4_times": 4, // 🔧 נוסף לכיסוי 4 פעמים
        "5_times": 5,
        "6_times": 6,
        daily: 7,
      };
      const frequencyValue = Array.isArray(metadata.frequency)
        ? metadata.frequency[0]
        : metadata.frequency;
      const daysPerWeek =
        frequencyMap[frequencyValue as keyof typeof frequencyMap] || 3;

      // 🔍 DEBUG: בדיקות מקיפות לתדירות אימונים
      console.log(`🔍 DEBUG: === FREQUENCY MAPPING DEBUG ===`);
      console.log(`🔍 DEBUG: Raw frequency:`, metadata.frequency);
      console.log(`🔍 DEBUG: Raw frequency type:`, typeof metadata.frequency);
      console.log(
        `🔍 DEBUG: Raw frequency stringified:`,
        JSON.stringify(metadata.frequency)
      );
      console.log(
        `🔍 DEBUG: Frequency value after extraction:`,
        frequencyValue
      );
      console.log(`🔍 DEBUG: Frequency value type:`, typeof frequencyValue);
      console.log(
        `🔍 DEBUG: Days per week:`,
        daysPerWeek,
        `(type: ${typeof daysPerWeek})`
      );
      console.log(
        `🔍 DEBUG: Available frequency options:`,
        Object.keys(frequencyMap)
      );
      console.log(
        `🔍 DEBUG: frequencyMap lookup result:`,
        frequencyMap[frequencyValue as keyof typeof frequencyMap]
      );
      console.log(
        `🔍 DEBUG: Does frequencyMap have key "${frequencyValue}":`,
        Object.prototype.hasOwnProperty.call(frequencyMap, frequencyValue)
      );

      // 🔍 DEBUG: בדיקת התאמה מדויקת
      Object.keys(frequencyMap).forEach((key) => {
        console.log(
          `🔍 DEBUG: Comparing "${frequencyValue}" === "${key}": ${frequencyValue === key}`
        );
      });

      // 🚨 אזהרה אם daysPerWeek לא תקין
      if (isNaN(daysPerWeek) || daysPerWeek <= 0 || daysPerWeek > 6) {
        console.error(
          `❌ ERROR: Invalid daysPerWeek: ${daysPerWeek}! This will cause issues.`
        );
      }

      // בדיקה האם WORKOUT_DAYS תומך במספר הימים הזה
      if (!WORKOUT_DAYS[daysPerWeek as keyof typeof WORKOUT_DAYS]) {
        console.warn(
          `⚠️ WARNING: WORKOUT_DAYS doesn't have entry for ${daysPerWeek} days! Will use fallback.`
        );
      }

      // בחירת סוג פיצול לפי מספר ימי אימון
      const experienceValue = Array.isArray(metadata.experience)
        ? metadata.experience[0]
        : metadata.experience;
      const splitType = getSplitType(
        daysPerWeek,
        experienceValue || "מתחיל (0-6 חודשים)"
      );

      // יצירת התוכנית
      const plan = createWorkoutPlan(
        metadata,
        equipment,
        daysPerWeek,
        splitType
      );

      setWorkoutPlan(plan);

      console.log(`✅ DEBUG: Basic Plan set successfully!`);
      console.log(`✅ DEBUG: Plan has ${plan.workouts.length} workouts`);
      console.log(`✅ DEBUG: Plan frequency: ${plan.frequency} days per week`);
      console.log(
        `✅ DEBUG: Plan workouts:`,
        plan.workouts.map(
          (w, i) => `${i + 1}. ${w.name} (${w.exercises.length} exercises)`
        )
      );

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
    console.log(`🔄 DEBUG: handleRefresh called - starting refresh process`);
    console.log(
      `🔄 DEBUG: Current workout plan has ${workoutPlan?.workouts?.length || 0} days`
    );

    setRefreshing(true);
    // 🏠 Use basic workout plan on refresh to prevent repetitions
    generateWorkoutPlan(true);
  };

  /**
   * בחירת סוג פיצול לפי ימי אימון וניסיון
   * Select split type by training days and experience
   */
  const getSplitType = (days: number, experience: string): string => {
    console.log(
      `🔍 DEBUG: getSplitType - days: ${days}, experience: "${experience}"`
    );

    let splitType: string;

    if (days <= 2) {
      splitType = WORKOUT_SPLITS.FULL_BODY;
      console.log(`🔍 DEBUG: ${days} days <= 2 → FULL_BODY`);
    } else if (days === 3) {
      const isBeginnerInHebrew = experience === "מתחיל (0-6 חודשים)";
      console.log(
        `� DEBUG: ${days} days === 3, is beginner (${experience}): ${isBeginnerInHebrew}`
      );

      splitType = isBeginnerInHebrew
        ? WORKOUT_SPLITS.FULL_BODY
        : WORKOUT_SPLITS.PUSH_PULL_LEGS;

      console.log(`🔍 DEBUG: ${days} days === 3 → ${splitType}`);
    } else if (days === 4) {
      splitType = WORKOUT_SPLITS.UPPER_LOWER;
      console.log(`🔍 DEBUG: ${days} days === 4 → UPPER_LOWER`);
    } else {
      splitType = WORKOUT_SPLITS.BODY_PART;
      console.log(`🔍 DEBUG: ${days} days > 4 → BODY_PART`);
    }

    console.log(`🔍 DEBUG: Final split type: ${splitType}`);
    return splitType;
  };

  /**
   * יצירת תוכנית אימון
   * Create workout plan
   */
  const createWorkoutPlan = (
    metadata: Record<string | number, string | string[]>,
    equipment: string[],
    daysPerWeek: number,
    _splitType: string // prefixed with underscore to indicate intentionally unused
  ): WorkoutPlan => {
    // Helper function to extract string value from potentially array value
    const getString = (
      value: string | string[] | undefined,
      defaultValue = ""
    ): string => {
      if (!value) return defaultValue;
      return Array.isArray(value) ? value[0] || defaultValue : value;
    };

    const workouts: WorkoutTemplate[] = [];
    const dayNames =
      WORKOUT_DAYS[daysPerWeek as keyof typeof WORKOUT_DAYS] || WORKOUT_DAYS[3];

    // 🔍 DEBUG: בדיקות מקיפות לימי אימון
    console.log(`🏗️ DEBUG: === WORKOUT DAYS SELECTION DEBUG ===`);
    console.log(
      `🏗️ DEBUG: Requested daysPerWeek: ${daysPerWeek} (type: ${typeof daysPerWeek})`
    );
    console.log(
      `🏗️ DEBUG: WORKOUT_DAYS has key ${daysPerWeek}: ${Object.hasOwnProperty.call(WORKOUT_DAYS, daysPerWeek)}`
    );
    console.log(
      `🏗️ DEBUG: Available WORKOUT_DAYS keys:`,
      Object.keys(WORKOUT_DAYS)
    );
    console.log(`🏗️ DEBUG: Selected dayNames:`, dayNames);
    console.log(`🏗️ DEBUG: Will create ${dayNames?.length || 0} workout days`);

    // 🚨 אזהרה אם dayNames לא תקין
    if (!dayNames || dayNames.length === 0) {
      console.error(
        `❌ ERROR: No dayNames found for ${daysPerWeek} days! Using fallback.`
      );
    }

    console.log(
      `🏗️ DEBUG: Creating workout plan for ${daysPerWeek} days per week`
    );
    console.log(`🏗️ DEBUG: Day names array:`, dayNames);
    console.log(`🏗️ DEBUG: Will create ${dayNames.length} workout days`);

    // יצירת אימונים לכל יום
    // Create workouts for each day
    dayNames.forEach((dayName, index) => {
      console.log(`🏗️ DEBUG: Processing day ${index + 1}: ${dayName}`);

      const experienceValue = getString(
        metadata.experience,
        "מתחיל (0-6 חודשים)"
      );
      const durationValue = getString(metadata.duration, "45");

      // 🔍 DEBUG: בדיקת ערכי קלט מקיפה
      console.log(`🔍 DEBUG: === INPUT VALUES DEBUG ===`);
      console.log(
        `🔍 DEBUG: experienceValue: "${experienceValue}" (type: ${typeof experienceValue})`
      );
      console.log(
        `🔍 DEBUG: durationValue: "${durationValue}" (type: ${typeof durationValue})`
      );
      console.log(
        `🔍 DEBUG: durationValue.split("-"): [${durationValue
          .split("-")
          .map((s) => `"${s}"`)
          .join(", ")}]`
      );
      console.log(
        `🔍 DEBUG: durationValue.split("-")[0]: "${durationValue.split("-")[0]}"`
      );

      const parsedDuration = parseInt(durationValue.split("-")[0] || "45");
      console.log(
        `🔍 DEBUG: parseInt result: ${parsedDuration} (type: ${typeof parsedDuration}, isNaN: ${isNaN(parsedDuration)})`
      );

      // 🚨 אזהרה אם duration לא תקין
      if (isNaN(parsedDuration) || parsedDuration <= 0) {
        console.error(
          `❌ ERROR: Invalid parsed duration: ${parsedDuration}! This will cause NaN in exercise count.`
        );
      }

      const exercises = selectExercisesForDay(
        dayName,
        equipment,
        experienceValue,
        parsedDuration,
        metadata,
        index // העברת אינדקס היום לזרע קבוע
      );

      console.log(
        `🏗️ DEBUG: Day ${index + 1} (${dayName}) created with ${exercises.length} exercises`
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

    console.log(
      `🏗️ DEBUG: Final workout plan created with ${workouts.length} days:`,
      workouts.map(
        (w, i) => `Day ${i + 1}: ${w.name} (${w.exercises.length} exercises)`
      )
    );

    const goalValue = getString(metadata.goal, "אימון");
    const experienceValue = getString(
      metadata.experience,
      "מתחיל (0-6 חודשים)"
    );
    const durationValue = getString(metadata.duration, "45");
    const locationValue = getString(metadata.location);

    return {
      id: `plan-${Date.now()}`,
      name: `תוכנית AI ל${goalValue}`,
      description: `תוכנית חכמה מותאמת אישית ל${goalValue} - ${daysPerWeek} ימים בשבוע`,
      difficulty: mapExperienceToDifficulty(experienceValue),
      duration: parseInt(durationValue.split("-")[0] || "45"),
      frequency: daysPerWeek,
      workouts: workouts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["AI-Generated", goalValue, locationValue].filter(
        Boolean
      ) as string[],
    };
  };

  /**
   * בחירת תרגילים ליום אימון משופרת עם זרע קבוע ומניעת חזרות
   * Enhanced exercise selection for workout day with fixed seed and repetition prevention
   */
  const selectExercisesForDay = (
    dayName: string,
    equipment: string[],
    experience: string,
    duration: number,
    metadata: Record<string | number, string | string[]>,
    dayIndex: number = 0
  ): ExerciseTemplate[] => {
    console.log(`🚀 [Day ${dayIndex}] === ENTERING selectExercisesForDay ===`);
    console.log(
      `🚀 [Day ${dayIndex}] dayName: "${dayName}", equipment:`,
      equipment,
      `experience: "${experience}"`
    );
    console.log(
      `🚀 [Day ${dayIndex}] duration: ${duration} (type: ${typeof duration})`
    );
    console.log(
      `🚀 [Day ${dayIndex}] This is the BASIC/FALLBACK plan generation, NOT AI`
    );

    // 🔍 בדיקה אם duration הוא NaN
    if (isNaN(duration)) {
      console.log(
        `❌ [Day ${dayIndex}] ERROR: duration is NaN! Using default 45`
      );
      duration = 45;
    }

    // 🔍 DEBUG: בדיקת duration אחרי תיקון
    console.log(
      `🔍 [Day ${dayIndex}] Final duration after NaN check: ${duration} (type: ${typeof duration}, isNaN: ${isNaN(duration)})`
    );

    const exercises: ExerciseTemplate[] = [];
    const targetMuscles = getTargetMusclesForDay(dayName);

    console.log(
      `🎯 [Day ${dayIndex}] ${dayName} - Target muscles:`,
      targetMuscles
    );

    // הרחבת ציוד זמין לכלול תמיד משקל גוף
    const expandedEquipment = [...new Set([...equipment, "bodyweight"])];
    console.log(`⚙️ [Day ${dayIndex}] Equipment available:`, expandedEquipment);
    console.log(`👤 [Day ${dayIndex}] User experience: ${experience}`);

    // ספירת תרגילים זמינים לפי ציוד
    const equipmentStats = expandedEquipment
      .map((eq) => {
        const count = ALL_EXERCISES.filter((ex) => ex.equipment === eq).length;
        return `${eq}: ${count}`;
      })
      .join(", ");
    console.log(
      `📊 [Day ${dayIndex}] Exercise counts by equipment: ${equipmentStats}`
    );

    // סינון תרגילים מתאימים עם שיפור במיפוי שרירים
    const suitableExercises = ALL_EXERCISES.filter((ex: DatabaseExercise) => {
      // בדיקת התאמה לשרירים - משופרת
      const muscleMatch = targetMuscles.some((muscle) => {
        // בדיקה ישירה
        if (ex.primaryMuscles?.includes(muscle) || ex.category === muscle) {
          return true;
        }

        // מיפוי נוסף לשרירים
        const muscleAliases: { [key: string]: string[] } = {
          חזה: ["chest", "pectorals"],
          כתפיים: ["shoulders", "deltoids", "delts"],
          טריצפס: ["triceps", "tricep"],
          גב: ["back", "lats", "latissimus"],
          ביצפס: ["biceps", "bicep"],
          רגליים: [
            "legs",
            "quadriceps",
            "hamstrings",
            "glutes",
            "calves",
            "thighs",
          ],
          ישבן: ["glutes", "gluteus", "butt"],
        };

        const aliases = muscleAliases[muscle] || [];
        return aliases.some(
          (alias) =>
            ex.primaryMuscles?.includes(alias) ||
            ex.secondaryMuscles?.includes(alias) ||
            ex.category?.toLowerCase().includes(alias.toLowerCase())
        );
      });

      // בדיקת התאמה לציוד המורחב
      const equipmentMatch = expandedEquipment.includes(ex.equipment);

      // בדיקת התאמה לרמה
      const levelMatch = isExerciseSuitableForLevel(ex.difficulty, experience);

      return muscleMatch && equipmentMatch && levelMatch;
    });

    console.log(
      `💪 [Day ${dayIndex}] Found ${suitableExercises.length} suitable exercises for ${dayName}`
    );

    // 🔍 הצגת כל התרגילים המתאימים
    console.log(
      `📋 [Day ${dayIndex}] ALL suitable exercises for ${dayName}:`,
      suitableExercises.map((ex) => ex.name)
    );

    // לוג מפורט על התרגילים הזמינים לכל שריר יעד
    targetMuscles.forEach((muscle) => {
      const muscleExercises = suitableExercises.filter(
        (ex) => ex.primaryMuscles?.includes(muscle) || ex.category === muscle
      );
      console.log(
        `🎯 [Day ${dayIndex}] ${muscle}: ${muscleExercises.length} exercises available`,
        muscleExercises.slice(0, 3).map((ex) => ex.name)
      );

      // הצגת כל התרגילים לשריר הזה
      if (muscleExercises.length > 0) {
        console.log(
          `📝 [Day ${dayIndex}] All ${muscle} exercises:`,
          muscleExercises.map((ex) => `${ex.name}(${ex.equipment})`)
        );
      }
    });

    // בחירת מספר תרגילים לפי משך האימון
    // Select number of exercises by duration
    const exerciseCount = Math.min(
      Math.floor(duration / 8), // תרגيל לכל 8 דקות
      suitableExercises.length,
      8 // מקסימום 8 תرגילים
    );

    // חלוקה לתרגילים מורכבים ובידוד (רק אם יש תמיכה במאגר)
    // Split to compound and isolation (only if supported in database)
    const hasCompoundInfo = suitableExercises.some((ex: DatabaseExercise) =>
      Object.prototype.hasOwnProperty.call(ex, "isCompound")
    );

    // 🔍 DEBUG: בדיקת exerciseCount לפני השימוש
    console.log(`🔢 [Day ${dayIndex}] === BEFORE USING exerciseCount ===`);
    console.log(
      `🔢 [Day ${dayIndex}] exerciseCount: ${exerciseCount} (isNaN: ${isNaN(exerciseCount)}, <= 0: ${exerciseCount <= 0})`
    );
    console.log(`🔢 [Day ${dayIndex}] hasCompoundInfo: ${hasCompoundInfo}`);
    console.log(`🔢 [Day ${dayIndex}] metadata.goal: ${metadata.goal}`);

    if (hasCompoundInfo && metadata.goal !== "שיקום מפציעה") {
      const compoundExercises = suitableExercises.filter(
        (ex: DatabaseExercise) =>
          (ex as DatabaseExercise & { isCompound?: boolean }).isCompound
      );
      const isolationExercises = suitableExercises.filter(
        (ex: DatabaseExercise) =>
          !(ex as DatabaseExercise & { isCompound?: boolean }).isCompound
      );

      // יחס של 60% מורכבים, 40% בידוד
      const safeExerciseCount =
        isNaN(exerciseCount) || exerciseCount <= 0 ? 5 : exerciseCount;
      const compoundCount = Math.ceil(safeExerciseCount * 0.6);
      const isolationCount = safeExerciseCount - compoundCount;

      // בחירת תרגילים מורכבים
      const selectedCompounds = selectRandomExercises(
        compoundExercises,
        compoundCount,
        dayIndex * 100 + 1 // זרע ייחודי לתרגילים מורכבים
      );
      const selectedIsolation = selectRandomExercises(
        isolationExercises,
        isolationCount,
        dayIndex * 100 + 2 // זרע ייחודי לתרגילי בידוד
      );

      // שילוב והמרה לתבנית
      [...selectedCompounds, ...selectedIsolation].forEach((exercise) => {
        exercises.push(createExerciseTemplate(exercise, experience, metadata));
      });
    } else {
      // בחירה משופרת עם מניעת חזרות
      const usedExercisesKey = `usedExercises_day${dayIndex}`;
      const dayUsedExercises =
        (global as any)[usedExercisesKey] || new Set<string>();

      // סינון תרגילים שלא שומשו היום
      const availableExercises = suitableExercises.filter(
        (ex) => !dayUsedExercises.has(ex.id)
      );

      // אם אין מספיק תרגילים זמינים, השתמש בכל התרגילים
      const exercisesToSelect =
        availableExercises.length >= exerciseCount
          ? availableExercises
          : suitableExercises;

      console.log(
        `🎲 [Day ${dayIndex}] Selecting from ${exercisesToSelect.length} exercises (${availableExercises.length} unused)`
      );

      // הצגת התרגילים שמהם נבחר
      console.log(
        `🎲 [Day ${dayIndex}] Pool to select from:`,
        exercisesToSelect.map((ex) => ex.name)
      );

      // 🔧 Safety check for exerciseCount
      const safeExerciseCount =
        isNaN(exerciseCount) || exerciseCount <= 0 ? 5 : exerciseCount;
      console.log(
        `🔧 [Day ${dayIndex}] Using safeExerciseCount: ${safeExerciseCount} (original: ${exerciseCount})`
      );

      const selectedExercises = selectRandomExercises(
        exercisesToSelect,
        safeExerciseCount,
        dayIndex * 1000 + (Date.now() % 1000) // זרע מגוון יותר
      );

      console.log(
        `🎯 [Day ${dayIndex}] selectRandomExercises returned:`,
        selectedExercises.map((ex) => ex.name)
      );

      selectedExercises.forEach((exercise, idx) => {
        exercises.push(createExerciseTemplate(exercise, experience, metadata));
        dayUsedExercises.add(exercise.id);
        console.log(
          `✅ [Day ${dayIndex}] Selected ${idx + 1}: ${exercise.name} (ID: ${exercise.id})`
        );
      });

      // שמירת התרגילים שנבחרו
      (global as any)[usedExercisesKey] = dayUsedExercises;
    }

    return exercises;
  };

  /**
   * בחירת תרגילים אקראיים מרשימה עם זרע קבוע משופר
   * Select random exercises from list with improved fixed seed
   */
  const selectRandomExercises = (
    exercises: DatabaseExercise[],
    count: number,
    seed: number = 0
  ): DatabaseExercise[] => {
    console.log(
      `🎲 selectRandomExercises called with ${exercises.length} exercises, need ${count}, seed ${seed}`
    );
    console.log(
      `🎲 Input exercises:`,
      exercises.slice(0, 5).map((ex) => ex.name)
    );

    // � DEBUG: בדיקות מקדימות של הפרמטרים
    console.log(`🎲 === PARAMETER VALIDATION ===`);
    console.log(
      `🎲 count: ${count} (type: ${typeof count}, isNaN: ${isNaN(count)}, count <= 0: ${count <= 0})`
    );
    console.log(`🎲 exercises.length: ${exercises.length}`);
    console.log(`🎲 seed: ${seed} (type: ${typeof seed})`);

    // �🔧 FIX: Handle NaN count parameter
    const originalCount = count;
    if (isNaN(count) || count <= 0) {
      console.log(
        `❌ selectRandomExercises: Invalid count (${originalCount}), using default 5`
      );
      count = Math.min(5, exercises.length);
      console.log(
        `🔧 selectRandomExercises: Corrected count from ${originalCount} to ${count}`
      );
    }

    if (exercises.length === 0) {
      console.log(`❌ selectRandomExercises: No exercises to select from`);
      return [];
    }
    if (count >= exercises.length) {
      console.log(
        `📝 selectRandomExercises: Returning all ${exercises.length} exercises`
      );
      return [...exercises];
    }

    // יצירת רנדום עם זרע קבוע משופר
    const seededRandom = (seed: number) => {
      // שימוש במספר אלגוריתמים משולבים לשיפור הרנדומיות
      let x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      x = x - Math.floor(x);

      let y = Math.sin(seed * 93.9898 + 47.233) * 28758.5453;
      y = y - Math.floor(y);

      const result = (x + y) / 2;
      console.log(`🎲 seededRandom(${seed}) = ${result}`);
      return result;
    };

    // יצירת רשימה עם אינדקסים
    const indexedExercises = exercises.map((ex, index) => ({ ex, index }));

    console.log(
      `🔀 Starting shuffle with ${indexedExercises.length} exercises`
    );

    // ערבוב משופר עם זרע קבוע
    for (let i = indexedExercises.length - 1; i > 0; i--) {
      // שימוש בזרע מורכב יותר
      const complexSeed = seed * (i + 1) + (seed % 1000) * 1000 + i;
      const randomValue = seededRandom(complexSeed);
      const j = Math.floor(randomValue * (i + 1));

      console.log(
        `🔀 Shuffle step ${i}: seed=${complexSeed}, random=${randomValue}, j=${j}`
      );

      [indexedExercises[i], indexedExercises[j]] = [
        indexedExercises[j],
        indexedExercises[i],
      ];
    }

    const selected = indexedExercises.slice(0, count).map((item) => item.ex);
    console.log(
      `🔀 Shuffled and selected ${selected.length}/${exercises.length} exercises:`,
      selected.map((ex) => ex.name)
    );

    return selected;
  };

  /**
   * יצירת תבנית תרגיל
   * Create exercise template
   */
  const createExerciseTemplate = (
    exercise: DatabaseExercise,
    experience: string,
    metadata: Record<string | number, string | string[]>
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
   * קבלת שרירי יעד ליום אימון - משופר עם מיפוי מפורט
   * Get target muscles for workout day - improved with detailed mapping
   */
  const getTargetMusclesForDay = (dayName: string): string[] => {
    const muscleMap: { [key: string]: string[] } = {
      "אימון מלא": ["חזה", "גב", "רגליים", "כתפיים"],
      "פלג גוף עליון": ["חזה", "גב", "כתפיים", "ידיים"],
      "פלג גוף תחתון": ["רגליים", "ישבן"],
      // מיפוי מפורט יותר עבור Push/Pull/Legs
      דחיפה: ["chest", "shoulders", "triceps", "חזה", "כתפיים", "טריצפס"],
      משיכה: ["back", "biceps", "lats", "גב", "ביצפס"],
      רגליים: [
        "legs",
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "רגליים",
        "ישבן",
      ],
      // מיפוי נוסף
      "חזה + טריצפס": ["חזה", "טריצפס"],
      "גב + ביצפס": ["גב", "ביצפס"],
      "כתפיים + בטן": ["כתפיים", "בטן"],
      "ידיים + בטן": ["ביצפס", "טריצפס", "בטן"],
      "בטן + קרדיו": ["בטן"],
    };

    const muscles = muscleMap[dayName] || ["גוף מלא"];
    console.log(`🎯 Target muscles for "${dayName}":`, muscles);
    return muscles;
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
  const getSetsForExercise = (
    exercise: DatabaseExercise,
    experience: string
  ): number => {
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
    exercise: DatabaseExercise,
    experience: string,
    metadata: Record<string | number, string | string[]>
  ): string => {
    // Helper function to extract string value from potentially array value
    const getString = (
      value: string | string[] | undefined,
      defaultValue = ""
    ): string => {
      if (!value) return defaultValue;
      return Array.isArray(value) ? value[0] || defaultValue : value;
    };

    const goal = getString(metadata?.goal);

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
    const age = getString(metadata.age);
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
    exercise: DatabaseExercise,
    experience: string,
    metadata: Record<string | number, string | string[]>
  ): number => {
    // Helper function to extract string value from potentially array value
    const getString = (
      value: string | string[] | undefined,
      defaultValue = ""
    ): string => {
      if (!value) return defaultValue;
      return Array.isArray(value) ? value[0] || defaultValue : value;
    };

    const goal = getString(metadata?.goal);

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
  const getExerciseNotes = (
    exercise: DatabaseExercise,
    experience: string
  ): string => {
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
   * קבלת ציוד זמין עבור המשתמש
   * Get available equipment for user
   */
  const getAvailableEquipment = async (): Promise<string[]> => {
    try {
      const equipment = await questionnaireService.getAvailableEquipment();

      // אם אין ציוד זמין, נחזיר ציוד דמה למטרות דיבוג
      if (!equipment || equipment.length === 0) {
        return ["barbell", "dumbbells", "cable_machine", "bench"];
      }

      return equipment;
    } catch (error) {
      console.error("Error getting equipment:", error);
      // החזר ציוד דמה במקרה של שגיאה
      return ["barbell", "dumbbells", "cable_machine", "bench"];
    }
  };

  /**
   * המרת שמות ציוד לעברית
   * Convert equipment names to Hebrew
   */
  const translateEquipment = (equipment: string): string => {
    const equipmentTranslations: { [key: string]: string } = {
      bodyweight: "משקל גוף",
      dumbbells: "משקולות",
      barbell: "מוט ברזל",
      resistance_bands: "רצועות התנגדות",
      pull_up_bar: "מתקן מתחים",
      yoga_mat: "מזרן יוגה",
      kettlebell: "קטלבל",
      cable_machine: "מכונת כבלים",
      treadmill: "הליכון",
      bike: "אופניים",
      rowing_machine: "מכונת חתירה",
      bench: "ספסל",
      squat_rack: "מתקן סקוואט",
      smith_machine: "מכונת סמית'",
      leg_press: "מכונת לחיצת רגליים",
      lat_pulldown: "מכונת משיכות לאט",
      chest_press: "מכונת לחיצת חזה",
      preacher_curl: "ספסל ביצפס",
      foam_roller: "גליל פילאטיס",
      trx: "TRX",
      free_weights: "משקלים חופשיים",
    };

    return equipmentTranslations[equipment] || equipment;
  };

  /**
   * חישוב גודל דינמי לכפתורי הימים
   * Calculate dynamic size for day buttons
   */
  const getDayButtonStyle = () => {
    const dayCount = workoutPlan?.workouts.length || 3;

    if (dayCount <= 3) {
      // גודל רגיל עבור 3 ימים או פחות
      return {
        minWidth: 110,
        paddingHorizontal: 24,
        paddingVertical: 20,
        iconSize: 32,
        titleSize: 16,
        subtitleSize: 12,
        gap: 12,
      };
    } else if (dayCount === 4) {
      // גודל מוקטן עבור 4 ימים
      return {
        minWidth: 90,
        paddingHorizontal: 18,
        paddingVertical: 16,
        iconSize: 28,
        titleSize: 14,
        subtitleSize: 11,
        gap: 10,
      };
    } else if (dayCount === 5) {
      // גודל עוד יותר קטן עבור 5 ימים
      return {
        minWidth: 75,
        paddingHorizontal: 14,
        paddingVertical: 14,
        iconSize: 24,
        titleSize: 13,
        subtitleSize: 10,
        gap: 8,
      };
    } else {
      // גודל מינימלי עבור 6+ ימים
      return {
        minWidth: 65,
        paddingHorizontal: 12,
        paddingVertical: 12,
        iconSize: 22,
        titleSize: 12,
        subtitleSize: 9,
        gap: 6,
      };
    }
  };

  /**
   * התחלת אימון משופרת
   * Enhanced start workout
   */
  const startWorkout = (workout: WorkoutTemplate) => {
    try {
      console.log(`🏋️ Starting workout: ${workout.name}`);
      console.log(`🔍 Workout template:`, JSON.stringify(workout, null, 2));
      console.log(
        "🔄 DEBUG: startWorkout called with exercises:",
        workout.exercises.map((e) => e.exerciseId)
      );

      // המרת התבנית לאימון פעיל
      // Convert template to active workout
      const activeExercises = workout.exercises
        .map((template: ExerciseTemplate) => {
          console.log(`🔍 Processing exercise template:`, template);

          // קודם נחפש בתרגילים הרגילים
          let exercise = exerciseMap[template.exerciseId];

          // אם לא מצאנו, נחפש ב-ALL_EXERCISES ישירות
          if (!exercise) {
            const foundExercise = ALL_EXERCISES.find(
              (ex) => ex.id === template.exerciseId
            );
            if (foundExercise) {
              exercise = foundExercise;
              console.log(`🔍 Found exercise in ALL_EXERCISES:`, exercise.name);
            }
          }

          if (!exercise) {
            console.warn(`❌ Exercise not found: ${template.exerciseId}`);
            return null;
          }

          console.log(`✅ Converting exercise: ${exercise.name}`);

          return {
            id: template.exerciseId,
            name: exercise.name,
            category: exercise.category || "כללי",
            primaryMuscles: exercise.primaryMuscles || [],
            secondaryMuscles: exercise.secondaryMuscles || [],
            equipment: exercise.equipment || "bodyweight",
            difficulty: exercise.difficulty || "beginner",
            instructions: exercise.instructions || [],
            sets: Array.from({ length: template.sets }, (_, i) => ({
              id: `${template.exerciseId}-set-${i + 1}`,
              type: i === 0 ? "warmup" : ("working" as const),
              targetReps: parseInt(
                template.reps.split("-")[1] || template.reps || "12"
              ),
              targetWeight: 0,
              completed: false,
              restTime: template.restTime,
              isPR: false,
            })),
            restTime: template.restTime || 60,
            notes: template.notes || "",
          };
        })
        .filter(Boolean);

      console.log(`🎯 Created ${activeExercises.length} active exercises`);
      console.log(
        `📋 Active exercises:`,
        activeExercises.map((ex) => ex?.name)
      );

      if (activeExercises.length === 0) {
        Alert.alert("שגיאה", "לא נמצאו תרגילים מתאימים לאימון זה.");
        return;
      }

      // ניווט למסך אימון פעיל
      // Navigate to active workout screen
      console.log(
        `🚀 Navigating to QuickWorkout with ${activeExercises.length} exercises`
      );
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

      console.log("✅ Navigation completed successfully");
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
  const replaceExercise = (exerciseId: string, _dayIndex: number) => {
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
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons
          name="brain"
          size={80}
          color={theme.colors.primary}
        />
        <Text style={styles.loadingText}>🤖 יוצר תוכנית AI מותאמת...</Text>
        <Text style={styles.loadingSubtext}>מנתח נתונים וכותב תוכנית חכמה</Text>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  // מסך שגיאה
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
          onPress={() => generateAIWorkoutPlan()}
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

            {/* סטטיסטיקות */}
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
                    <Text style={styles.statLabel}>📅 ימים בשבוע</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.statValue}>{workoutPlan.duration}</Text>
                    <Text style={styles.statLabel}>⏱️ דקות לאימון</Text>
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
                    <Text style={styles.statLabel}>💪 רמת קושי</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* ציוד זמין */}
            {availableEquipment.length > 0 && (
              <View style={styles.equipmentContainer}>
                <View style={styles.equipmentHeader}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.equipmentTitle}>הציוד הזמין שלך</Text>
                </View>
                <View style={styles.equipmentGrid}>
                  {availableEquipment.map((equipment, index) => (
                    <View key={index} style={styles.equipmentChip}>
                      <Text style={styles.equipmentChipText}>
                        {translateEquipment(equipment)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* בחירת יום */}
          <View style={styles.daySelectorWrapper}>
            <Text style={styles.sectionTitle}>בחר יום אימון</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.daySelector,
                { gap: getDayButtonStyle().gap },
              ]}
              style={styles.daySelectorContainer}
            >
              {workoutPlan.workouts.map((workout, index) => {
                console.log(
                  `🎯 DEBUG: Rendering day button ${index + 1}: ${workout.name} with ${workout.exercises.length} exercises`
                );

                const buttonStyle = getDayButtonStyle();

                return (
                  <TouchableOpacity
                    key={workout.id}
                    style={[
                      styles.dayCard,
                      selectedDay === index && styles.dayCardActive,
                    ]}
                    onPress={() => {
                      console.log(
                        `🔘 DEBUG: Day ${index + 1} button pressed - "${workout.name}"`
                      );
                      console.log(
                        `🔘 DEBUG: Switching from day ${selectedDay} to day ${index}`
                      );
                      console.log(
                        `🔘 DEBUG: Workout has ${workout.exercises.length} exercises`
                      );

                      // הצגת רשימת התרגילים ביום הנבחר
                      const exerciseNames = workout.exercises.map((ex) => {
                        const exercise = exerciseMap[ex.exerciseId];
                        return exercise?.name || ex.exerciseId;
                      });
                      console.log(
                        `🔘 DEBUG: Exercises in ${workout.name}:`,
                        exerciseNames
                      );

                      setSelectedDay(index);
                    }}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={
                        selectedDay === index
                          ? [theme.colors.primary, theme.colors.primary + "DD"]
                          : ["transparent", "transparent"]
                      }
                      style={[
                        styles.dayCardGradient,
                        {
                          paddingHorizontal: buttonStyle.paddingHorizontal,
                          paddingVertical: buttonStyle.paddingVertical,
                          minWidth: buttonStyle.minWidth,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={(DAY_ICONS[workout.name] || "dumbbell") as any}
                        size={buttonStyle.iconSize}
                        color={
                          selectedDay === index
                            ? "#FFFFFF"
                            : theme.colors.primary
                        }
                      />
                      <Text
                        style={[
                          styles.dayCardTitle,
                          selectedDay === index && styles.dayCardTitleActive,
                          {
                            fontSize: buttonStyle.titleSize,
                            marginTop: buttonStyle.titleSize >= 16 ? 8 : 6,
                          },
                        ]}
                      >
                        יום {index + 1}
                      </Text>
                      <Text
                        style={[
                          styles.dayCardSubtitle,
                          selectedDay === index && styles.dayCardSubtitleActive,
                          {
                            fontSize: buttonStyle.subtitleSize,
                            marginTop: buttonStyle.subtitleSize >= 12 ? 4 : 2,
                          },
                        ]}
                      >
                        {workout.name}
                      </Text>

                      {/* 🔍 דיבוג - מספר תרגילים */}
                      <Text
                        style={{
                          fontSize: Math.max(buttonStyle.subtitleSize - 1, 9),
                          color:
                            selectedDay === index
                              ? "#FFFFFF"
                              : theme.colors.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        {workout.exercises.length} תרגילים
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* פרטי היום הנבחר */}
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

              {/* רשימת תרגילים */}
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

              {/* כפתור התחלה */}
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

          {/* הסבר על המודל AI */}
          {aiMode && (
            <View style={styles.aiExplanation}>
              <View style={styles.aiExplanationHeader}>
                <MaterialCommunityIcons
                  name="brain"
                  size={24}
                  color="#FF6B35"
                />
                <Text style={styles.aiExplanationTitle}>
                  איך AI עובד עבורך?
                </Text>
              </View>

              <View style={styles.aiFeatures}>
                <View style={styles.aiFeature}>
                  <MaterialCommunityIcons
                    name="trending-up"
                    size={20}
                    color={theme.colors.success}
                  />
                  <Text style={styles.aiFeatureText}>
                    <Text style={styles.aiFeatureBold}>התקדמות אוטומטית:</Text>{" "}
                    האימונים מתעצמים מעצמם לפי הביצועים שלך
                  </Text>
                </View>

                <View style={styles.aiFeature}>
                  <MaterialCommunityIcons
                    name="auto-fix"
                    size={20}
                    color={theme.colors.info}
                  />
                  <Text style={styles.aiFeatureText}>
                    <Text style={styles.aiFeatureBold}>התאמה דינמית:</Text>{" "}
                    התוכנית משתנה כל שבוע לפי ההתקדמות
                  </Text>
                </View>

                <View style={styles.aiFeature}>
                  <MaterialCommunityIcons
                    name="account-heart"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.aiFeatureText}>
                    <Text style={styles.aiFeatureBold}>למידה אישית:</Text>{" "}
                    האלגוריתם לומד את ההעדפות והיכולות שלך
                  </Text>
                </View>
              </View>

              <Text style={styles.aiExplanationNote}>
                💡 אין צורך לערוך רמה בשאלון - המערכת מתאימה אוטומטית!
              </Text>

              <View style={styles.learningIndicator}>
                <MaterialCommunityIcons
                  name="brain"
                  size={16}
                  color={theme.colors.success}
                />
                <Text style={styles.learningText}>
                  האלגוריתם לומד מכל אימון ומשפר את התוכנית שלך
                </Text>
              </View>
            </View>
          )}

          {/* פעולות נוספות */}
          <View style={styles.actions}>
            {/* 🤖 כפתור AI */}
            <TouchableOpacity
              style={[styles.actionButton, styles.aiButton]}
              onPress={() => generateAIWorkoutPlan(true)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#FF6B35" + "20", "#FF6B35" + "10"]}
                style={styles.actionButtonGradient}
              >
                <MaterialCommunityIcons
                  name="robot"
                  size={22}
                  color="#FF6B35"
                />
                <Text style={[styles.actionButtonText, { color: "#FF6B35" }]}>
                  תוכנית AI חכמה
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
                <Text style={styles.actionButtonText}>תוכנית בסיסית</Text>
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
                <Text style={styles.actionButtonText}>💾 שמור תוכנית</Text>
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
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  tagsContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  tag: {
    backgroundColor: theme.colors.primary + "15",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  statsContainer: {
    marginTop: 24,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  statsGradient: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
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
    // gap is now dynamic - set via getDayButtonStyle()
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
    // Dynamic sizing - now controlled by getDayButtonStyle()
    alignItems: "center",
  },
  dayCardTitle: {
    fontWeight: "700",
    color: theme.colors.text,
    // fontSize and marginTop are now dynamic
  },
  dayCardTitleActive: {
    color: "#FFFFFF",
  },
  dayCardSubtitle: {
    color: theme.colors.textSecondary,
    textAlign: "center",
    // fontSize and marginTop are now dynamic
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
  // סגנונות הסבר AI
  aiExplanation: {
    margin: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: "#FF6B35" + "30",
    ...theme.shadows.small,
  },
  aiExplanationHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  aiExplanationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "right",
  },
  aiFeatures: {
    gap: 12,
    marginBottom: 16,
  },
  aiFeature: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 12,
  },
  aiFeatureText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "right",
    lineHeight: 20,
  },
  aiFeatureBold: {
    fontWeight: "700",
    color: theme.colors.primary,
  },
  aiExplanationNote: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    backgroundColor: theme.colors.primary + "10",
    padding: 12,
    borderRadius: theme.radius.md,
    marginBottom: 12,
  },
  learningIndicator: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.success + "10",
    padding: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.success + "30",
  },
  learningText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: "500",
    textAlign: "center",
  },
  // סגנונות לציוד זמין
  // Available equipment styles
  equipmentContainer: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    ...theme.shadows.small,
  },
  equipmentHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  equipmentGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  equipmentChip: {
    backgroundColor: theme.colors.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  equipmentChipText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "500",
  },
});
