/**
 * @file src/screens/workout/WorkoutPlanScreen.tsx
 * @brief מסך תוכנית אימון מותאמת אישית - מציג תוכנית שבועית מלאה
 * @brief Personalized workout plan screen - displays full weekly program
 * @dependencies React Native, theme, userStore, questionnaireService
 * @notes מציג תוכנית אימון מחולקת לימים לפי הנתונים מהשאלון
 * @notes Displays workout plan divided by days based on questionnaire data
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { questionnaireService } from "../../services/questionnaireService";
import {
  WorkoutPlan,
  WorkoutTemplate,
  ExerciseTemplate,
} from "./types/workout.types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

// רשימת תרגילים זמניים - צריך להעביר למודול נפרד
// Temporary exercise list - should move to separate module
const ALL_EXERCISES = [
  // תרגילי חזה
  {
    id: "bench_press",
    name: "לחיצת חזה",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["טריצפס", "כתפיים"],
    equipment: "barbell",
    difficulty: "intermediate",
  },
  {
    id: "pushups",
    name: "שכיבות סמיכה",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["טריצפס", "כתפיים"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "dumbbell_press",
    name: "לחיצת חזה דאמבלס",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["טריצפס", "כתפיים"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  // תרגילי גב
  {
    id: "pullups",
    name: "מתח",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "pullup_bar",
    difficulty: "intermediate",
  },
  {
    id: "lat_pulldown",
    name: "משיכה לחזה רחבה",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "cable_machine",
    difficulty: "beginner",
  },
  {
    id: "dumbbell_row",
    name: "חתירה דאמבל",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  // תרגילי רגליים
  {
    id: "squat",
    name: "סקוואט",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    secondaryMuscles: ["core"],
    equipment: "barbell",
    difficulty: "intermediate",
  },
  {
    id: "lunges",
    name: "מדרגות",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "deadlift",
    name: "דדליפט",
    category: "רגליים",
    primaryMuscles: ["גב תחתון", "רגליים", "ישבן"],
    secondaryMuscles: ["גב", "core"],
    equipment: "barbell",
    difficulty: "advanced",
  },
  // תרגילי כתפיים
  {
    id: "shoulder_press",
    name: "לחיצת כתפיים",
    category: "כתפיים",
    primaryMuscles: ["כתפיים"],
    secondaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "lateral_raise",
    name: "הרמות צד",
    category: "כתפיים",
    primaryMuscles: ["כתפיים צד"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  // תרגילי ידיים
  {
    id: "bicep_curl",
    name: "כפיפת ביצפס",
    category: "ידיים",
    primaryMuscles: ["ביצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  {
    id: "tricep_extension",
    name: "פשיטת טריצפס",
    category: "ידיים",
    primaryMuscles: ["טריצפס"],
    equipment: "dumbbells",
    difficulty: "beginner",
  },
  // תרגילי בטן
  {
    id: "plank",
    name: "פלאנק",
    category: "בטן",
    primaryMuscles: ["core"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "crunches",
    name: "כפיפות בטן",
    category: "בטן",
    primaryMuscles: ["בטן"],
    equipment: "bodyweight",
    difficulty: "beginner",
  },
  {
    id: "russian_twist",
    name: "סיבובים רוסיים",
    category: "בטן",
    primaryMuscles: ["אלכסונים"],
    equipment: "bodyweight",
    difficulty: "intermediate",
  },
];

interface WorkoutPlanScreenProps {
  route?: {
    params?: {
      regenerate?: boolean;
    };
  };
}

export default function WorkoutPlanScreen({ route }: WorkoutPlanScreenProps) {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  // טעינת התוכנית בעת כניסה למסך או בקשה לחידוש
  // Load plan on screen entry or regeneration request
  useEffect(() => {
    generateWorkoutPlan();
  }, [route?.params?.regenerate]);

  /**
   * יצירת תוכנית אימון מותאמת אישית
   * Generate personalized workout plan
   */
  const generateWorkoutPlan = async () => {
    try {
      setLoading(true);

      // קבלת נתוני המשתמש מהשאלון
      // Get user data from questionnaire
      const userQuestionnaireData = user?.questionnaireData;
      const metadata = userQuestionnaireData?.metadata || {};

      // בדיקה אם יש נתונים בפורמט הישן
      // Check if data exists in old format
      if (!metadata.frequency && user?.questionnaire) {
        // המרת נתונים מהפורמט הישן
        const oldAnswers = user.questionnaire;
        metadata.frequency = oldAnswers[4]; // שאלה 4 - תדירות
        metadata.duration = oldAnswers[5]; // שאלה 5 - משך
        metadata.goal = oldAnswers[2]; // שאלה 2 - מטרה
        metadata.experience = oldAnswers[3]; // שאלה 3 - ניסיון
        metadata.location = oldAnswers[6]; // שאלה 6 - מיקום
      }

      const equipment = await questionnaireService.getAvailableEquipment();

      if (!metadata || !metadata.frequency) {
        Alert.alert(
          "נתונים חסרים",
          "יש להשלים את השאלון כדי לקבל תוכנית מותאמת אישית",
          [
            { text: "ביטול", style: "cancel" },
            {
              text: "לשאלון",
              onPress: () =>
                navigation.navigate("DynamicQuestionnaire" as never),
            },
          ]
        );
        return;
      }

      // המרת תדירות אימונים למספר
      // Convert frequency to number
      const frequencyMap: { [key: string]: number } = {
        "1-2": 2,
        "3-4": 3,
        "5-6": 5,
        "כל יום": 6,
      };
      const daysPerWeek = frequencyMap[metadata.frequency] || 3;

      // בחירת סוג פיצול לפי מספר ימי אימון
      // Select split type by training days
      const splitType = getSplitType(
        daysPerWeek,
        metadata.experience || "beginner"
      );

      // יצירת התוכנית
      // Create the plan
      const plan = createWorkoutPlan(
        metadata,
        equipment,
        daysPerWeek,
        splitType
      );

      setWorkoutPlan(plan);
    } catch (error) {
      console.error("Error generating workout plan:", error);
      Alert.alert("שגיאה", "לא הצלחנו ליצור תוכנית אימון. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * בחירת סוג פיצול לפי ימי אימון וניסיון
   * Select split type by training days and experience
   */
  const getSplitType = (days: number, experience: string): string => {
    if (days <= 2) return WORKOUT_SPLITS.FULL_BODY;
    if (days === 3) {
      return experience === "beginner"
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
        metadata.experience || "beginner",
        parseInt(metadata.duration?.split("-")[0] || "45")
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
      name: `תוכנית ${metadata.goal || "אימון"}`,
      description: `תוכנית מותאמת אישית ל${
        metadata.goal || "אימון"
      } - ${daysPerWeek} ימים בשבוע`,
      difficulty: mapExperienceToDifficulty(metadata.experience),
      duration: parseInt(metadata.duration?.split("-")[0] || "45"),
      frequency: daysPerWeek,
      workouts: workouts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [metadata.goal, metadata.location].filter(Boolean),
    };
  };

  /**
   * בחירת תרגילים ליום אימון
   * Select exercises for workout day
   */
  const selectExercisesForDay = (
    dayName: string,
    equipment: string[],
    experience: string,
    duration: number
  ): ExerciseTemplate[] => {
    const exercises: ExerciseTemplate[] = [];
    const targetMuscles = getTargetMusclesForDay(dayName);

    // סינון תרגילים מתאימים
    // Filter suitable exercises
    const suitableExercises = ALL_EXERCISES.filter((ex: any) => {
      // בדיקת התאמה לשרירים
      const muscleMatch = targetMuscles.some(
        (muscle) => ex.primaryMuscles.includes(muscle) || ex.category === muscle
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
      Math.floor(duration / 10), // תרגיל לכל 10 דקות
      suitableExercises.length,
      8 // מקסימום 8 תרגילים
    );

    // בחירת תרגילים מגוונים
    // Select varied exercises
    const selectedCategories = new Set<string>();

    for (
      let i = 0;
      i < exerciseCount && exercises.length < exerciseCount;
      i++
    ) {
      const availableExercises = suitableExercises.filter(
        (ex: any) =>
          !selectedCategories.has(ex.category) ||
          selectedCategories.size >= targetMuscles.length
      );

      if (availableExercises.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * availableExercises.length
        );
        const exercise = availableExercises[randomIndex];

        exercises.push({
          exerciseId: exercise.id,
          sets: getSetsForExercise(exercise, experience),
          reps: getRepsForGoal(exercise, experience),
          restTime: getRestTimeForExercise(exercise, experience),
          notes: getExerciseNotes(exercise, experience),
        });

        selectedCategories.add(exercise.category);
      }
    }

    return exercises;
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
   * קבלת טווח חזרות למטרה
   * Get reps range for goal
   */
  const getRepsForGoal = (exercise: any, experience: string): string => {
    const goal =
      useUserStore.getState().user?.questionnaireData?.metadata?.goal;

    const repsMap: { [key: string]: string } = {
      "ירידה במשקל": "12-15",
      "עליה במסת שריר": "8-12",
      "שיפור כוח": "3-6",
      "שיפור סיבולת": "15-20",
      "בריאות כללית": "10-15",
      "שיקום מפציעה": "12-15",
    };

    // התאמה לתרגילי בטן
    // Adjust for core exercises
    if (exercise.category === "בטן") {
      return "15-25";
    }

    return repsMap[goal || "בריאות כללית"] || "10-15";
  };

  /**
   * קבלת זמן מנוחה לתרגיל
   * Get rest time for exercise
   */
  const getRestTimeForExercise = (
    exercise: any,
    experience: string
  ): number => {
    const goal =
      useUserStore.getState().user?.questionnaireData?.metadata?.goal;

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
      notes.push("התחל עם משקל קל וצור טכניקה");
    }

    if (exercise.equipment === "bodyweight") {
      notes.push("התאם את הקושי לפי הצורך");
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
      const exercise = ALL_EXERCISES.find((e: any) => e.id === ex.exerciseId);
      if (exercise) {
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
      const exercise = ALL_EXERCISES.find((e: any) => e.id === ex.exerciseId);
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
   * התחלת אימון
   * Start workout
   */
  const startWorkout = (workout: WorkoutTemplate) => {
    // המרת התבנית לאימון פעיל
    // Convert template to active workout
    const activeExercises = workout.exercises
      .map((template: ExerciseTemplate) => {
        const exercise = ALL_EXERCISES.find(
          (ex: any) => ex.id === template.exerciseId
        );
        if (!exercise) return null;

        return {
          ...exercise,
          sets: Array.from({ length: template.sets }, (_, i) => ({
            id: `set-${i + 1}`,
            type: i === 0 ? "warmup" : ("working" as const),
            targetReps: parseInt(template.reps.split("-")[1] || "12"),
            targetWeight: 0,
            completed: false,
            restTime: template.restTime,
          })),
          notes: template.notes,
        };
      })
      .filter(Boolean);

    // ניווט למסך אימון פעיל
    // Navigate to active workout screen
    (navigation as any).navigate("QuickWorkout", {
      exercises: activeExercises,
      workoutName: workout.name,
      workoutId: workout.id,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>
          יוצר תוכנית אימון מותאמת אישית...
        </Text>
      </View>
    );
  }

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
          onPress={generateWorkoutPlan}
        >
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-right"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>

          <Text style={styles.title}>{workoutPlan.name}</Text>
          <Text style={styles.subtitle}>{workoutPlan.description}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="calendar-week"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.statText}>{workoutPlan.frequency} ימים</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.statText}>{workoutPlan.duration} דקות</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="arm-flex"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.statText}>
                {workoutPlan.difficulty === "beginner"
                  ? "מתחיל"
                  : workoutPlan.difficulty === "intermediate"
                  ? "בינוני"
                  : "מתקדם"}
              </Text>
            </View>
          </View>
        </View>

        {/* Day Selector */}
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
                styles.dayButton,
                selectedDay === index && styles.dayButtonActive,
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === index && styles.dayButtonTextActive,
                ]}
              >
                יום {index + 1}
              </Text>
              <Text
                style={[
                  styles.dayButtonSubtext,
                  selectedDay === index && styles.dayButtonSubtextActive,
                ]}
              >
                {workout.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected Day Details */}
        {workoutPlan.workouts[selectedDay] && (
          <View style={styles.dayDetails}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>
                {workoutPlan.workouts[selectedDay].name}
              </Text>
              <View style={styles.dayStats}>
                <Text style={styles.dayStatText}>
                  {workoutPlan.workouts[selectedDay].exercises.length} תרגילים
                </Text>
                <Text style={styles.dayStatDivider}>•</Text>
                <Text style={styles.dayStatText}>
                  {workoutPlan.workouts[selectedDay].estimatedDuration} דקות
                </Text>
              </View>
            </View>

            {/* Exercise List */}
            <View style={styles.exerciseList}>
              {workoutPlan.workouts[selectedDay].exercises.map(
                (exerciseTemplate: ExerciseTemplate, index: number) => {
                  const exercise = ALL_EXERCISES.find(
                    (ex: any) => ex.id === exerciseTemplate.exerciseId
                  );
                  if (!exercise) return null;

                  return (
                    <View key={index} style={styles.exerciseCard}>
                      <View style={styles.exerciseNumber}>
                        <Text style={styles.exerciseNumberText}>
                          {index + 1}
                        </Text>
                      </View>

                      <View style={styles.exerciseInfo}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
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
                        {exerciseTemplate.notes && (
                          <Text style={styles.exerciseNotes}>
                            {exerciseTemplate.notes}
                          </Text>
                        )}
                      </View>

                      <TouchableOpacity style={styles.exerciseInfoButton}>
                        <MaterialCommunityIcons
                          name="information-outline"
                          size={20}
                          color={theme.colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }
              )}
            </View>

            {/* Start Workout Button */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => startWorkout(workoutPlan.workouts[selectedDay])}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary + "DD"]}
                style={styles.startButtonGradient}
              >
                <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
                <Text style={styles.startButtonText}>התחל אימון</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={generateWorkoutPlan}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.actionButtonText}>צור תוכנית חדשה</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert("בקרוב", "אפשרות זו תהיה זמינה בקרוב")}
          >
            <MaterialCommunityIcons
              name="content-save"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.actionButtonText}>שמור תוכנית</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
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
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "right",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    textAlign: "right",
  },
  statsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  statItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  daySelectorContainer: {
    maxHeight: 100,
  },
  daySelector: {
    paddingHorizontal: theme.spacing.lg,
    gap: 12,
  },
  dayButton: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    minWidth: 80,
    alignItems: "center",
  },
  dayButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  dayButtonTextActive: {
    color: "#FFFFFF",
  },
  dayButtonSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  dayButtonSubtextActive: {
    color: "#FFFFFF",
    opacity: 0.9,
  },
  dayDetails: {
    padding: theme.spacing.lg,
  },
  dayHeader: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 24,
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
  exerciseList: {
    gap: 12,
  },
  exerciseCard: {
    flexDirection: "row-reverse",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: "center",
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
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
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  exerciseNotes: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 6,
    textAlign: "right",
    fontStyle: "italic",
  },
  exerciseInfoButton: {
    padding: 8,
  },
  startButton: {
    marginTop: 24,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startButtonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  startButtonText: {
    fontSize: 18,
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
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.primary,
  },
});
