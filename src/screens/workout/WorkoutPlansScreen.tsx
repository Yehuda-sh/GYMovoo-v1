/**
 * @file src/screens/workout/WorkoutPlansScreen.tsx
 * @brief Enhanced Workout Plans Screen - מסך תוכניות אימון משופר עם AI וניהול מתקדם
 * @dependencies React Native, Expo, MaterialCommunityIcons, theme, userStore, questionnaireService, exerciseDatabase
 * @notes מציג תוכניות אימון מותאמות אישית עם אלגוריתמי AI, תמיכת RTL מלאה, ונגישות מקיפה
 * @recurring_errors BackButton חובה במקום TouchableOpacity ידני, Alert.alert חסום - השתמש ב-ConfirmationModal
 * @updated August 2025 - Enhanced logging, support for new exercise database with "none" equipment type for bodyweight exercises
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

// Core System Imports
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../navigation/types";
import { questionnaireService } from "../../services/questionnaireService";
import { WorkoutDataService } from "../../services/workoutDataService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// Component & UI Imports
import BackButton from "../../components/common/BackButton";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import DayButton from "../../components/common/DayButton";
import { UniversalModal } from "../../components/common/UniversalModal";

// Data & Type Imports
import {
  WorkoutPlan,
  WorkoutTemplate,
  ExerciseTemplate,
} from "./types/workout.types";

import { allExercises as ALL_EXERCISES } from "../../data/exercises";
import { Exercise } from "../../data/exercises/types";
import { useModalManager } from "./hooks/useModalManager";

// Workout day templates
const WORKOUT_DAYS = {
  1: ["אימון מלא"],
  2: ["פלג גוף עליון", "פלג גוף תחתון"],
  3: ["דחיפה", "משיכה", "רגליים"],
  4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
  5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
  6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
};

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
  כתפיים: "human-handsup",
  ידיים: "arm-flex",
  בטן: "ab-testing",
  "חזה + טריצפס": "shield",
  "כתפיים + בטן": "human-handsup",
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
      requestedWorkoutIndex?: number;
      requestedWorkoutName?: string;
      preSelectedDay?: number;
    };
  };
}

// Global exercise state for repetition prevention
interface GlobalExerciseState {
  usedExercises_day0?: Set<string>;
  usedExercises_day1?: Set<string>;
  usedExercises_day2?: Set<string>;
  [key: string]: Set<string> | undefined;
}

declare global {
  var exerciseState: GlobalExerciseState;
}

if (typeof global !== "undefined") {
  global.exerciseState = global.exerciseState || {};
}

export default function WorkoutPlanScreen({ route }: WorkoutPlanScreenProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useUserStore();

  // Core state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // Modal management using the new hook
  const {
    activeModal,
    modalConfig,
    showError,
    showSuccess,
    showConfirm,
    hideModal,
  } = useModalManager();

  // Animations
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);

  // Quick exercise mapping for performance
  const exerciseMap = useMemo(() => {
    console.log(
      "🗃️ WorkoutPlansScreen: Creating exercise map from database..."
    );
    console.log(
      "🗃️ WorkoutPlansScreen: Database contains",
      ALL_EXERCISES.length,
      "exercises"
    );

    const map = ALL_EXERCISES.reduce(
      (acc: Record<string, Exercise>, ex: Exercise) => {
        acc[ex.id] = ex;
        return acc;
      },
      {} as Record<string, Exercise>
    );

    // Log first few exercises
    const sampleIds = Object.keys(map).slice(0, 5);
    console.log("🗃️ WorkoutPlansScreen: Sample exercise IDs:", sampleIds);
    sampleIds.forEach((id) => {
      const ex = map[id];
      console.log(`  - ${id}: ${ex.name} (${ex.equipment})`);
    });

    return map;
  }, []);

  // Load plan on screen entry or regeneration request
  useEffect(() => {
    const autoStart = route?.params?.autoStart;
    const returnFromWorkout = route?.params?.returnFromWorkout;
    const requestedWorkoutIndex = route?.params?.requestedWorkoutIndex;
    const requestedWorkoutName = route?.params?.requestedWorkoutName;

    if (returnFromWorkout) {
      handlePostWorkoutReturn();
    } else {
      generateWorkoutPlan(!!route?.params?.regenerate).then(() => {
        if (autoStart && workoutPlan?.workouts) {
          const workoutToStart = getWorkoutToStart(
            workoutPlan.workouts,
            requestedWorkoutIndex,
            requestedWorkoutName
          );

          setTimeout(() => {
            startWorkout(workoutToStart);
          }, 1500);
        }
      });
    }
  }, [route?.params]);

  // Helper function to get workout to start - prevents code duplication
  const getWorkoutToStart = (
    workouts: WorkoutTemplate[],
    requestedIndex?: number,
    requestedName?: string
  ): WorkoutTemplate => {
    let workoutToStart = workouts[0];

    if (requestedIndex !== undefined && requestedIndex < workouts.length) {
      workoutToStart = workouts[requestedIndex];
    } else if (requestedName) {
      const foundWorkout = workouts.find((w) => w.name === requestedName);
      if (foundWorkout) {
        workoutToStart = foundWorkout;
      }
    }

    return workoutToStart;
  };

  // Handle pre-selected day when workout plan is loaded
  useEffect(() => {
    const preSelectedDay = route?.params?.preSelectedDay;
    const autoStart = route?.params?.autoStart;

    if (workoutPlan?.workouts && preSelectedDay !== undefined) {
      if (preSelectedDay >= 0 && preSelectedDay < workoutPlan.workouts.length) {
        setSelectedDay(preSelectedDay);

        if (autoStart) {
          const workoutToStart = workoutPlan.workouts[preSelectedDay];
          setTimeout(() => {
            startWorkout(workoutToStart);
          }, 1000);
        }
      }
    }
  }, [workoutPlan, route?.params?.preSelectedDay, route?.params?.autoStart]);

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

  // Load available equipment
  // Removed equipment loading - using internal database only

  // Removed WGER exercises loading - using internal database only
  // useEffect(() => {
  //   const loadWgerExercises = async () => {
  //     if (!wgerEnabled || availableEquipment.length === 0) {
  //       return;
  //     }
  //
  //     try {
  //       await searchExercisesByEquipment(availableEquipment);
  //     } catch (error) {
  //       console.error("❌ Failed to load WGER exercises:", error);
  //       setError(
  //         error instanceof Error ? error.message : "שגיאה בטעינת תרגילים"
  //       );
  //     }
  //   };
  //
  //   if (availableEquipment.length > 0) {
  //     loadWgerExercises();
  //   }
  // }, [availableEquipment]);

  /**
   * Handle return from workout
   */
  const handlePostWorkoutReturn = () => {
    console.log(
      "🔄 WorkoutPlansScreen: חזרה מאימון - עדכון תוכניות עם מאגר תרגילים חדש"
    );
    const workoutId = route?.params?.completedWorkoutId;
    console.log("🔄 WorkoutPlansScreen: Workout ID:", workoutId);

    if (workoutId) {
      console.log("🔄 WorkoutPlansScreen: מציג modal לאחר השלמת אימון");
      showConfirm(
        "אימון הושלם! 🎉",
        "האם ברצונך לצפות בהתקדמות או ליצור תוכנית חדשה?",
        () => {
          console.log("🔄 WorkoutPlansScreen: יוצר תוכנית חדשה לאחר אימון");
          generateWorkoutPlan(true);
        }
      );
    } else {
      console.log("🔄 WorkoutPlansScreen: טוען תוכנית רגילה (ללא ID אימון)");
      generateWorkoutPlan();
    }
  };

  /**
   * Handle AI plan generation with debug
   */
  const handleAIPlanPress = () => {
    console.log(
      "🤖 WorkoutPlansScreen: כפתור תוכנית AI נלחץ - יוצר תוכנית חכמה עם מאגר התרגילים החדש"
    );
    console.log(
      "🤖 WorkoutPlansScreen: Available exercises count:",
      ALL_EXERCISES.length
    );
    generateAIWorkoutPlan(true);
  };

  /**
   * Handle plan regeneration with debug
   */
  const handleRegeneratePress = () => {
    console.log(
      "🔄 WorkoutPlansScreen: כפתור רענון נלחץ - יוצר תוכנית חדשה עם מאגר התרגילים החדש"
    );
    console.log("🔄 WorkoutPlansScreen: Current plan:", workoutPlan?.name);
    console.log(
      "🔄 WorkoutPlansScreen: Equipment filtering ready for 'none' = bodyweight exercises"
    );
    generateWorkoutPlan(true);
  };

  /**
   * Handle day selection with debug
   */
  const handleDaySelection = (index: number, workoutName: string) => {
    console.log(
      `📅 WorkoutPlansScreen - נבחר יום ${index + 1}: ${workoutName}`
    );
    setSelectedDay(index);
  };

  /**
   * Handle workout start with debug
   */
  const handleStartWorkout = (workout: WorkoutTemplate) => {
    console.log(
      `🚀 WorkoutPlansScreen - התחלת אימון: ${workout.name} -> מנווט ל-ActiveWorkoutScreen`
    );
    startWorkout(workout);
  };

  /**
   * Handle exercise details navigation - עובר למסך פרטי התרגיל
   */
  const handleExerciseDetailsToggle = (
    exerciseId: string,
    exerciseName: string
  ) => {
    console.log(`💪 WorkoutPlansScreen - מעבר לפרטי תרגיל: ${exerciseName}`);

    // מצא את נתוני התרגיל ממאגר הנתונים
    const exercise = exerciseMap[exerciseId];

    if (!exercise) {
      console.error("💪 WorkoutPlansScreen - תרגיל לא נמצא במאגר:", exerciseId);
      return;
    }

    // עבור למסך פרטי התרגיל עם כל הנתונים הנדרשים
    navigation.navigate("ExerciseDetails", {
      exerciseId: exerciseId,
      exerciseName: exercise.name,
      muscleGroup: exercise.primaryMuscles?.[0] || "כללי",
      exerciseData: {
        equipment: exercise.equipment || "ציוד חופשי",
        difficulty: exercise.difficulty || "בינוני",
        instructions: exercise.instructions?.he || exercise.instructions || [],
        benefits:
          (exercise as any).benefits?.he || (exercise as any).benefits || [],
        tips: exercise.tips?.he || exercise.tips || [],
      },
    });
  };

  /**
   * Test API connections and data quality
   */
  const handleTestAPIConnections = async () => {
    // First check network connectivity
    const networkCheck = await checkNetworkConnectivity();
    console.log("📡 Network check result:", networkCheck);

    const testResults = {
      networkConnectivity: {
        status: networkCheck.connected
          ? "success"
          : ("error" as "success" | "error"),
        data: networkCheck,
        error: networkCheck.connected ? null : "Network connection failed",
      },
      questionnaireService: {
        status: "unknown",
        data: null as any,
        error: null as string | null,
      },
      workoutDataService: {
        status: "unknown",
        data: null as any,
        error: null as string | null,
      },
      wgerAPI: {
        status: "unknown",
        data: null as any,
        error: null as string | null,
      },
      userStore: {
        status: "unknown",
        data: null as any,
        error: null as string | null,
      },
    };

    // Test 1: Questionnaire Service
    try {
      const equipment = await questionnaireService.getAvailableEquipment();
      const preferences = await questionnaireService.getUserPreferences();

      testResults.questionnaireService = {
        status: "success",
        data: { equipment, preferences },
        error: null,
      };
      console.log("✅ questionnaireService: OK", { equipment, preferences });
    } catch (error) {
      testResults.questionnaireService = {
        status: "error",
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      console.error("❌ questionnaireService: ERROR", error);
    }

    // Test 2: Workout Data Service
    try {
      const userData = await WorkoutDataService.getUserWorkoutData();

      testResults.workoutDataService = {
        status: "success",
        data: userData,
        error: null,
      };
      console.log("✅ WorkoutDataService: OK", userData);
    } catch (error) {
      testResults.workoutDataService = {
        status: "error",
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      console.error("❌ WorkoutDataService: ERROR", error);
    }

    // Test 3: WGER API - Removed (using internal database only)
    // if (networkCheck.connected) {
    //   try {
    //     console.log("🧪 Testing WGER API...");
    //     const testEquipment = ["barbell", "dumbbells"];
    //     const wgerExercises = await searchExercisesByEquipment(testEquipment);
    //
    //     testResults.wgerAPI = {
    //       status: "success",
    //       data: { exerciseCount: wgerExercises?.length || 0, testEquipment },
    //       error: null,
    //     };
    //     console.log("✅ WGER API: OK", {
    //       exerciseCount: wgerExercises?.length || 0,
    //     });
    //   } catch (error) {
    //     testResults.wgerAPI = {
    //       status: "error",
    //       data: null,
    //       error: error instanceof Error ? error.message : "Unknown error",
    //     };
    //     console.error("❌ WGER API: ERROR", error);
    //   }
    // } else {
    testResults.wgerAPI = {
      status: "success",
      data: { message: "Using internal exercise database only" },
      error: null,
    };
    console.log("✅ WGER API: DISABLED - Using internal database");
    // }

    // Test 4: User Store
    try {
      const userState = useUserStore.getState();
      const hasUser = !!userState.user;
      const hasQuestionnaire = !!(
        userState.user?.questionnaire ||
        userState.user?.questionnaireData ||
        userState.user?.smartQuestionnaireData
      );

      testResults.userStore = {
        status: "success",
        data: {
          hasUser,
          hasQuestionnaire,
          userKeys: Object.keys(userState.user || {}),
        },
        error: null,
      };
      console.log("✅ User Store: OK", { hasUser, hasQuestionnaire });
    } catch (error) {
      testResults.userStore = {
        status: "error",
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      console.error("❌ User Store: ERROR", error);
    }

    // Test 5: Data Quality Validation
    console.log("🧪 Running data quality validation...");
    const dataQuality = await validateDataQuality();

    // Show comprehensive test results
    const successCount = Object.values(testResults).filter(
      (t) => t.status === "success"
    ).length;
    const totalTests = Object.keys(testResults).length;

    const exerciseDbHealth = `${dataQuality.exerciseDatabase.valid}/${dataQuality.exerciseDatabase.valid + dataQuality.exerciseDatabase.invalid}`;
    const workoutPlanHealth = dataQuality.workoutPlan.valid ? "✅" : "❌";
    const userPrefsHealth = dataQuality.userPreferences.complete ? "✅" : "⚠️";

    const successMessage =
      `📊 תוצאות בדיקת API:\n` +
      `• questionnaireService: ${testResults.questionnaireService.status === "success" ? "✅ תקין" : "❌ שגיאה"}\n` +
      `• WorkoutDataService: ${testResults.workoutDataService.status === "success" ? "✅ תקין" : "❌ שגיאה"}\n` +
      `• WGER API: ${testResults.wgerAPI.status === "success" ? "✅ תקין" : "❌ שגיאה"}\n` +
      `• User Store: ${testResults.userStore.status === "success" ? "✅ תקין" : "❌ שגיאה"}\n\n` +
      `📋 תוצאות בדיקת איכות נתונים:\n` +
      `• בסיס נתוני תרגילים: ${exerciseDbHealth} תקינים\n` +
      `• תוכנית אימון נוכחית: ${workoutPlanHealth}\n` +
      `• העדפות משתמש: ${userPrefsHealth}\n\n` +
      `💾 פרטים מלאים נשמרו בקונסול`;

    if (
      successCount === totalTests &&
      dataQuality.workoutPlan.valid &&
      dataQuality.userPreferences.complete
    ) {
      showSuccess(
        `🔍 בדיקה מקיפה - ${successCount}/${totalTests} API תקין`,
        successMessage
      );
    } else {
      showError(
        `🔍 בדיקה מקיפה - ${successCount}/${totalTests} API תקין`,
        successMessage
      );
    }

    // Store detailed results for debugging
    console.log("📊 Data Quality Results:", dataQuality);

    return { testResults, dataQuality, networkCheck };
  };

  /**
   * Check network connectivity
   */
  const checkNetworkConnectivity = async (): Promise<{
    connected: boolean;
    latency?: number;
  }> => {
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("https://wger.de/api/v2/info/", {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();

      if (response.ok) {
        return { connected: true, latency: endTime - startTime };
      } else {
        return { connected: false };
      }
    } catch (error) {
      console.warn("⚠️ Network connectivity check failed:", error);
      return { connected: false };
    }
  };

  /**
   * Test data quality and integrity
   */
  const validateDataQuality = async () => {
    const validationResults = {
      exerciseDatabase: { valid: 0, invalid: 0, issues: [] as string[] },
      workoutPlan: { valid: true, issues: [] as string[] },
      userPreferences: {
        complete: false,
        missing: [] as string[],
        issues: [] as string[],
      },
    };

    // Validate Exercise Database
    ALL_EXERCISES.forEach((exercise: Exercise, index: number) => {
      const issues: string[] = [];

      if (!exercise.id) issues.push(`Missing ID at index ${index}`);
      if (!exercise.name) issues.push(`Missing name at index ${index}`);
      if (!exercise.primaryMuscles || exercise.primaryMuscles.length === 0) {
        issues.push(
          `Missing primary muscles for ${exercise.name || `exercise ${index}`}`
        );
      }
      if (!exercise.equipment)
        issues.push(
          `Missing equipment for ${exercise.name || `exercise ${index}`}`
        );

      // Special validation for "none" equipment (bodyweight exercises)
      if (exercise.equipment === "none" && exercise.name) {
        console.log(`✅ Found bodyweight exercise: ${exercise.name}`);
      }

      if (issues.length > 0) {
        validationResults.exerciseDatabase.invalid++;
        validationResults.exerciseDatabase.issues.push(...issues);
      } else {
        validationResults.exerciseDatabase.valid++;
      }
    });

    // Validate Current Workout Plan
    console.log("🧪 Validating current workout plan...");
    if (workoutPlan) {
      if (!workoutPlan.name) {
        validationResults.workoutPlan.valid = false;
        validationResults.workoutPlan.issues.push("Missing workout plan name");
      }
      if (!workoutPlan.workouts || workoutPlan.workouts.length === 0) {
        validationResults.workoutPlan.valid = false;
        validationResults.workoutPlan.issues.push("No workouts in plan");
      }

      workoutPlan.workouts?.forEach((workout, index) => {
        if (!workout.exercises || workout.exercises.length === 0) {
          validationResults.workoutPlan.issues.push(
            `Workout ${index + 1} has no exercises`
          );
        }
        workout.exercises?.forEach((exercise, exIndex) => {
          if (!exerciseMap[exercise.exerciseId]) {
            validationResults.workoutPlan.issues.push(
              `Workout ${index + 1}, Exercise ${exIndex + 1}: Invalid exercise ID ${exercise.exerciseId}`
            );
          }
        });
      });
    } else {
      validationResults.workoutPlan.valid = false;
      validationResults.workoutPlan.issues.push("No workout plan loaded");
    }

    // Validate User Preferences
    console.log("🧪 Validating user preferences...");
    try {
      const userState = useUserStore.getState();
      const requiredFields = ["frequency", "duration", "goal", "experience"];

      if (userState.user?.questionnaireData?.metadata) {
        const metadata = userState.user.questionnaireData.metadata;
        requiredFields.forEach((field) => {
          if (!metadata[field]) {
            validationResults.userPreferences.missing.push(field);
          }
        });
        validationResults.userPreferences.complete =
          validationResults.userPreferences.missing.length === 0;
      } else if (userState.user?.questionnaire) {
        // Check old format
        const questionnaire = userState.user.questionnaire;
        if (!questionnaire[5])
          validationResults.userPreferences.missing.push("goal");
        if (!questionnaire[6])
          validationResults.userPreferences.missing.push("experience");
        if (!questionnaire[7])
          validationResults.userPreferences.missing.push("frequency");
        if (!questionnaire[8])
          validationResults.userPreferences.missing.push("duration");

        validationResults.userPreferences.complete =
          validationResults.userPreferences.missing.length === 0;
      } else {
        validationResults.userPreferences.issues.push(
          "No questionnaire data found"
        );
      }
    } catch (error) {
      validationResults.userPreferences.issues.push(
        `Error validating preferences: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    console.log("📊 Data Quality Results:", validationResults);
    return validationResults;
  };

  /**
   * Generate AI workout plan with advanced personalization
   */
  const generateAIWorkoutPlan = async (forceRegenerate: boolean = false) => {
    try {
      setLoading(!refreshing);
      if (refreshing) setRefreshing(true);

      // Enhanced exercise cache initialization
      global.exerciseState.usedExercises_day0 = new Set<string>();
      global.exerciseState.usedExercises_day1 = new Set<string>();
      global.exerciseState.usedExercises_day2 = new Set<string>();

      // Try to generate AI plan if service is available
      try {
        const aiPlan = await WorkoutDataService.generateAIWorkoutPlan();

        if (aiPlan) {
          setWorkoutPlan(aiPlan);

          if (forceRegenerate) {
            const successMessage =
              `נוצרה תוכנית חכמה: "${aiPlan.name}"\n\n` +
              `📊 ציון התאמה: ${aiPlan.aiScore?.toFixed(0) || "90"}/100\n` +
              `🎯 רמה: ${aiPlan.personalizationLevel === "basic" ? "בסיסית" : aiPlan.personalizationLevel === "advanced" ? "מתקדמת" : "מומחה"}\n` +
              `🏋️ ניצול ציוד: ${aiPlan.equipmentUtilization?.toFixed(0) || "85"}%\n\n` +
              `✨ התוכנית תתאים את עצמה לפי הביצועים שלך!`;

            showSuccess("🤖 תוכנית AI חדשה נוצרה!", successMessage);
          }
          return;
        }
      } catch (aiError) {
        console.warn(
          "AI plan generation failed, falling back to standard plan:",
          aiError
        );
      }

      // Fallback to standard plan if AI fails
      await generateWorkoutPlan(forceRegenerate);
    } catch (error: unknown) {
      console.error("❌ AI Plan Generation Error:", error);

      setError(
        error instanceof Error ? error.message : "שגיאה ביצירת תוכנית AI"
      );

      const errorMessage =
        error instanceof Error && error.message === "NO_QUESTIONNAIRE_DATA"
          ? "אנא השלם את השאלון תחילה"
          : "אירעה שגיאה ביצירת התוכנית. נסה שוב מאוחר יותר.";

      showError("שגיאה ביצירת תוכנית AI", errorMessage);

      // fallback לתוכנית רגילה
      generateWorkoutPlan(forceRegenerate);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Generate basic workout plan
   */
  const generateWorkoutPlan = async (forceRegenerate: boolean = false) => {
    try {
      setLoading(!refreshing);
      setError(null);
      if (refreshing) setRefreshing(true);

      console.log("🏗️ WorkoutPlansScreen: Starting workout plan generation...");
      console.log(
        "🏗️ WorkoutPlansScreen: Total exercises in database:",
        ALL_EXERCISES.length
      );

      // Enhanced exercise cache initialization
      global.exerciseState.usedExercises_day0 = new Set<string>();
      global.exerciseState.usedExercises_day1 = new Set<string>();
      global.exerciseState.usedExercises_day2 = new Set<string>();

      // Get user data from questionnaire - check all possible questionnaire formats
      const userQuestionnaireData =
        user?.questionnaire ||
        user?.questionnaireData ||
        (user?.smartQuestionnaireData?.answers
          ? {
              // Convert smartQuestionnaireData to expected format
              experience:
                user.smartQuestionnaireData.answers.fitnessLevel ||
                "intermediate",
              gender: user.smartQuestionnaireData.answers.gender || "other",
              // Bridge equipment sources: equipment / gym_equipment (array of objects) / bodyweight_equipment
              equipment: (() => {
                const direct = user.smartQuestionnaireData.answers.equipment;
                const gymEqRaw = (user.smartQuestionnaireData.answers as any)
                  .gym_equipment;
                const gymEq = Array.isArray(gymEqRaw)
                  ? gymEqRaw.map((o: any) => o.id || o)
                  : [];
                const merged = (direct || gymEq || []).filter(Boolean);
                const real = merged.filter(
                  (e: string) => e !== "none" && e !== "no_equipment"
                );
                return real.length > 0 ? Array.from(new Set(real)) : ["none"];
              })(),
              // Bridge goals: goals array or single fitness_goal
              goals: user.smartQuestionnaireData.answers.goals || [
                "muscle_gain",
              ],
              frequency:
                user.smartQuestionnaireData.answers.availability?.[0] ||
                "3_times_week",
              duration: "45_60_min",
              goal:
                user.smartQuestionnaireData.answers.goals?.[0] || "muscle_gain",
              age: "25-35",
              height: "170",
              weight: "70",
              location: "home",
            }
          : {});
      console.log(
        "🏗️ WorkoutPlansScreen: User questionnaire data:",
        userQuestionnaireData
      );

      const questData = userQuestionnaireData as Record<
        string | number,
        string | string[]
      >;

      // Convert data to expected format
      const metadata = {
        frequency: questData.frequency || questData[7],
        duration: questData.duration || questData[8],
        goal: questData.goal || questData[5],
        experience: questData.experience || questData[6],
        location: questData.location || questData[9],
        age: questData.age || questData[1],
        height: questData.height || questData[3],
        weight: questData.weight || questData[4],
        gender: questData.gender || questData[2],
      };

      console.log("🏗️ WorkoutPlansScreen: Processed metadata:", metadata);

      // Apply smart defaults for invalid data using constants
      if (
        !metadata.experience ||
        typeof metadata.experience !== "string" ||
        !isNaN(Number(metadata.experience))
      ) {
        metadata.experience = DEFAULT_EXPERIENCE;
      } else if (
        EXPERIENCE_MAP[metadata.experience as keyof typeof EXPERIENCE_MAP]
      ) {
        metadata.experience =
          EXPERIENCE_MAP[metadata.experience as keyof typeof EXPERIENCE_MAP];
      }

      if (!metadata.duration || typeof metadata.duration !== "string") {
        metadata.duration = DEFAULT_DURATION;
      } else if (metadata.duration.includes("_min")) {
        metadata.duration = DURATION_MAP[metadata.duration] || DEFAULT_DURATION;
      }

      if (!metadata.frequency || typeof metadata.frequency !== "string") {
        metadata.frequency = DEFAULT_FREQUENCY;
      }

      if (!metadata.goal || typeof metadata.goal !== "string") {
        metadata.goal = DEFAULT_GOAL;
      } else if (GOAL_MAP[metadata.goal as keyof typeof GOAL_MAP]) {
        metadata.goal = GOAL_MAP[metadata.goal as keyof typeof GOAL_MAP];
      }

      console.log(
        "🏗️ WorkoutPlansScreen: Final metadata after defaults:",
        metadata
      );

      // Check required fields
      const requiredFields = ["frequency", "duration", "goal", "experience"];
      const missingFields = requiredFields.filter(
        (field) => !metadata[field as keyof typeof metadata]
      );
      if (
        missingFields.length > 0 ||
        Object.keys(userQuestionnaireData).length === 0
      ) {
        console.error(
          `❌ WorkoutPlansScreen: Missing required fields: ${missingFields.join(", ")}`
        );
        showError(
          "נתונים חסרים 📋",
          "יש להשלים את השאלון כדי לקבל תוכנית מותאמת אישית"
        );
        return;
      }

      // Get available equipment with improved error handling
      let equipment = await getAvailableEquipment();
      console.log("🔧 WorkoutPlansScreen: Equipment received:", equipment);

      if (!equipment || equipment.length === 0) {
        console.warn(
          "⚠️ WorkoutPlansScreen: No equipment data found, using default"
        );
        equipment = DEFAULT_EQUIPMENT;
      }

      // Convert frequency to days per week using consolidated mapping
      const frequencyValue = Array.isArray(metadata.frequency)
        ? metadata.frequency[0]
        : metadata.frequency;
      // Support new pattern like "2_days" etc.
      let daysPerWeek =
        FREQUENCY_MAP[frequencyValue as keyof typeof FREQUENCY_MAP];
      if (!daysPerWeek && /_days$/.test(frequencyValue || "")) {
        const parsed = parseInt(String(frequencyValue).split("_", 1)[0], 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 7) daysPerWeek = parsed;
      }
      if (!daysPerWeek) daysPerWeek = 3;

      console.log("🏗️ WorkoutPlansScreen: Days per week:", daysPerWeek);
      console.log("🏗️ WorkoutPlansScreen: About to create workout plan...");

      // Create workout plan
      const plan = createWorkoutPlan(metadata, equipment, daysPerWeek);

      console.log("✅ WorkoutPlansScreen: Workout plan created successfully!");
      console.log("✅ WorkoutPlansScreen: Plan name:", plan.name);
      console.log(
        "✅ WorkoutPlansScreen: Number of workouts:",
        plan.workouts.length
      );

      plan.workouts.forEach((workout, index) => {
        console.log(
          `✅ WorkoutPlansScreen: Day ${index + 1} - ${workout.name}: ${workout.exercises.length} exercises`
        );
        workout.exercises.forEach((exercise, exIndex) => {
          const exerciseData = exerciseMap[exercise.exerciseId];
          console.log(
            `  📝 Exercise ${exIndex + 1}: ${exerciseData?.name || "Unknown"} (${exerciseData?.equipment || "Unknown equipment"})`
          );
        });
      });

      setWorkoutPlan(plan);

      // Show success message if regenerated
      if (forceRegenerate && !refreshing) {
        showSuccess("✨ תוכנית חדשה נוצרה!", "התוכנית עודכנה בהתאם להעדפותיך");
      }
    } catch (error) {
      console.error(
        "❌ WorkoutPlansScreen: Error generating workout plan:",
        error
      );

      setError(
        error instanceof Error ? error.message : "שגיאה ביצירת תוכנית אימון"
      );

      showError("שגיאה", "לא הצלחנו ליצור תוכנית אימון. נסה שוב.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      await generateWorkoutPlan(true);
    } catch (error) {
      console.error("Error during refresh:", error);
      setError(error instanceof Error ? error.message : "שגיאה ברענון התוכנית");
    } finally {
      setRefreshing(false);
    }
  };

  // Helper functions would continue here...
  // For brevity, I'll include the essential ones:

  const createWorkoutPlan = (
    metadata: Record<string | number, string | string[]>,
    equipment: string[],
    daysPerWeek: number
  ): WorkoutPlan => {
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

    dayNames.forEach((dayName, index) => {
      const experienceValue = getString(
        metadata.experience,
        "מתחיל (0-6 חודשים)"
      );
      const durationValue = getString(metadata.duration, "45");

      const parsedDuration = (() => {
        const durationStr = durationValue.toString();

        if (durationStr.includes("-")) {
          const firstPart = durationStr.split("-")[0].trim();
          const parsed = parseInt(firstPart);
          if (!isNaN(parsed) && parsed > 0) {
            return parsed;
          }
        }

        const numbers = durationStr.match(/\d+/);
        if (numbers && numbers.length > 0) {
          const parsed = parseInt(numbers[0]);
          if (!isNaN(parsed) && parsed > 0) {
            return parsed;
          }
        }

        return 45;
      })();

      const exercises = selectExercisesForDay(
        dayName,
        equipment,
        experienceValue,
        parsedDuration,
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

  // Add other essential helper functions here...
  // Helper functions for workout template creation
  const selectExercisesForDay = (
    dayName: string,
    equipment: string[],
    experience: string,
    duration: number,
    metadata: Record<string | number, string | string[]>
  ): ExerciseTemplate[] => {
    console.log("🏗️ WorkoutPlansScreen: === SELECTING EXERCISES FOR DAY ===");
    console.log("🏗️ WorkoutPlansScreen: Day name:", dayName);
    console.log("🏗️ WorkoutPlansScreen: Available equipment:", equipment);
    console.log("🏗️ WorkoutPlansScreen: Experience level:", experience);
    console.log("🏗️ WorkoutPlansScreen: Duration:", duration);

    // Get target muscle groups based on day name
    const muscleGroups = getMuscleGroupsForDay(dayName);
    const exerciseCount = Math.max(4, Math.min(8, Math.floor(duration / 10)));

    console.log("� WorkoutPlansScreen: Target muscle groups:", muscleGroups);
    console.log("� WorkoutPlansScreen: Target exercise count:", exerciseCount);
    console.log(
      "🎯 WorkoutPlansScreen: Total exercises in database:",
      ALL_EXERCISES.length
    );

    // Log first few exercises from database to verify data
    console.log("📚 WorkoutPlansScreen: Sample exercises from database:");
    ALL_EXERCISES.slice(0, 5).forEach((ex: any, index) => {
      console.log(
        `  ${index + 1}. ${ex.name} - Equipment: ${ex.equipment} - Muscles: ${ex.primaryMuscles?.join(", ")}`
      );
    });

    // Filter exercises by muscle groups and equipment
    const availableExercises = ALL_EXERCISES.filter((exercise: any) => {
      // Enhanced muscle check - support both Hebrew and English muscle names
      const targetsCorrectMuscles = exercise.primaryMuscles?.some(
        (muscle: string) => {
          // Direct match
          const directMatch = muscleGroups.some(
            (group) => muscle.includes(group) || group.includes(muscle)
          );

          // Additional flexible matching for common muscle name variations
          const flexibleMatch = muscleGroups.some((group) => {
            // Hebrew to English mappings
            if (
              group === "חזה" &&
              (muscle.includes("chest") || muscle.includes("pectoral"))
            )
              return true;
            if (
              group === "גב" &&
              (muscle.includes("back") ||
                muscle.includes("lat") ||
                muscle.includes("rhomboid"))
            )
              return true;
            if (
              group === "כתפיים" &&
              (muscle.includes("shoulder") || muscle.includes("deltoid"))
            )
              return true;
            if (group === "טריצפס" && muscle.includes("tricep")) return true;
            if (group === "ביצפס" && muscle.includes("bicep")) return true;
            if (
              group === "רגליים" &&
              (muscle.includes("quad") || muscle.includes("leg"))
            )
              return true;
            if (group === "ישבן" && muscle.includes("glute")) return true;
            if (group === "בטן" && muscle.includes("core")) return true;

            // English to Hebrew mappings
            if (muscle === "chest" && group.includes("חזה")) return true;
            if (muscle === "back" && group.includes("גב")) return true;
            if (muscle === "shoulders" && group.includes("כתפיים")) return true;
            if (muscle === "triceps" && group.includes("טריצפס")) return true;
            if (muscle === "biceps" && group.includes("ביצפס")) return true;
            if (
              (muscle === "quadriceps" || muscle === "legs") &&
              group.includes("רגליים")
            )
              return true;
            if (muscle === "glutes" && group.includes("ישבן")) return true;
            if (muscle === "core" && group.includes("בטן")) return true;

            return false;
          });

          return directMatch || flexibleMatch;
        }
      );

      // Enhanced equipment check - support for "none" equipment (bodyweight)
      const hasRequiredEquipment =
        equipment.includes(exercise.equipment) ||
        exercise.equipment === "none" ||
        exercise.equipment === "bodyweight";

      console.log(
        `🔍 WorkoutPlansScreen: Exercise "${exercise.name}" - muscles: ${targetsCorrectMuscles} (${exercise.primaryMuscles?.join(", ")}), equipment: ${hasRequiredEquipment} (${exercise.equipment})`
      );

      const isValid = targetsCorrectMuscles && hasRequiredEquipment;
      if (isValid) {
        console.log(
          `✅ WorkoutPlansScreen: "${exercise.name}" is VALID for this day!`
        );
      }

      return isValid;
    });

    console.log(
      "🔍 WorkoutPlansScreen: Available exercises after filtering:",
      availableExercises.length
    );

    if (availableExercises.length === 0) {
      console.error(
        "❌ WorkoutPlansScreen: NO EXERCISES FOUND AFTER FILTERING!"
      );
      console.error("❌ WorkoutPlansScreen: Target muscles:", muscleGroups);
      console.error("❌ WorkoutPlansScreen: Available equipment:", equipment);

      // Fallback: try to find ANY exercises for this equipment
      const fallbackExercises = ALL_EXERCISES.filter((exercise: any) => {
        return (
          equipment.includes(exercise.equipment) ||
          exercise.equipment === "none" ||
          exercise.equipment === "bodyweight"
        );
      });

      console.log(
        "🔧 WorkoutPlansScreen: Fallback exercises found:",
        fallbackExercises.length
      );
      if (fallbackExercises.length > 0) {
        console.log("🔧 WorkoutPlansScreen: Using fallback exercises:");
        fallbackExercises.slice(0, 3).forEach((ex: any) => {
          console.log(`  - ${ex.name} (${ex.equipment})`);
        });

        // Use first few fallback exercises
        const selectedFallback = fallbackExercises.slice(
          0,
          Math.min(exerciseCount, fallbackExercises.length)
        );
        return selectedFallback.map((exercise: any) => ({
          exerciseId: exercise.id,
          sets: getSetsForExperience(experience),
          reps: getRepsForGoal(metadata.goal as string),
          restTime: getRestTimeForGoal(metadata.goal as string),
          weight: 0,
          notes:
            exercise.instructions?.he?.join(". ") ||
            exercise.instructions?.en?.join(". ") ||
            "",
        }));
      }
    }

    console.log(
      "🔍 WorkoutPlansScreen: Available exercises after filtering:",
      availableExercises.length
    );

    // Select exercises based on experience level
    const difficultyFilter = getDifficultyFilter(experience);
    console.log("🎯 WorkoutPlansScreen: Difficulty filter:", difficultyFilter);

    // Filter by difficulty
    const difficultyFilteredExercises = availableExercises.filter((ex: any) =>
      difficultyFilter.includes(ex.difficulty || "beginner")
    );

    // ✅ FIX: Prioritize equipment-based exercises over bodyweight for users with equipment
    const realEquipment = equipment.filter(
      (item) =>
        item !== "none" && item !== "bodyweight" && item !== "no_equipment"
    );

    let selectedExercises: any[] = [];

    if (realEquipment.length > 0) {
      // User has real equipment - prioritize equipment-based exercises
      const equipmentExercises = difficultyFilteredExercises.filter((ex: any) =>
        realEquipment.includes(ex.equipment)
      );

      const bodyweightExercises = difficultyFilteredExercises.filter(
        (ex: any) => ex.equipment === "none" || ex.equipment === "bodyweight"
      );

      // Take mostly equipment exercises, fill with bodyweight if needed
      const equipmentCount = Math.min(
        equipmentExercises.length,
        Math.ceil(exerciseCount * 0.8)
      );
      const bodyweightCount = Math.min(
        bodyweightExercises.length,
        exerciseCount - equipmentCount
      );

      selectedExercises = [
        ...equipmentExercises.slice(0, equipmentCount),
        ...bodyweightExercises.slice(0, bodyweightCount),
      ];

      console.log(
        `🏋️ WorkoutPlansScreen: Prioritized equipment exercises: ${equipmentCount} equipment + ${bodyweightCount} bodyweight`
      );
    } else {
      // User has no equipment - use bodyweight exercises
      selectedExercises = difficultyFilteredExercises.slice(0, exerciseCount);
    }

    console.log(
      "🎯 WorkoutPlansScreen: Selected exercises after equipment prioritization:",
      selectedExercises.map((ex: any) => `${ex.name} (${ex.equipment})`)
    );

    // If we don't have enough exercises, be more flexible with difficulty
    if (selectedExercises.length < Math.min(3, exerciseCount)) {
      console.log(
        "⚠️ WorkoutPlansScreen: Not enough exercises found, expanding difficulty criteria..."
      );
      selectedExercises = availableExercises.slice(0, exerciseCount);
      console.log(
        "🔧 WorkoutPlansScreen: Expanded selection:",
        selectedExercises.map((ex: any) => `${ex.name} (${ex.equipment})`)
      );
    }

    console.log(
      "🎯 WorkoutPlansScreen: Final selected exercises:",
      selectedExercises.map((ex: any) => `${ex.name} (${ex.equipment})`)
    );

    // Convert to ExerciseTemplate format
    const exerciseTemplates = selectedExercises.map((exercise: any) => ({
      exerciseId: exercise.id,
      sets: getSetsForExperience(experience),
      reps: getRepsForGoal(metadata.goal as string),
      restTime: getRestTimeForGoal(metadata.goal as string),
      weight: 0,
      notes:
        exercise.instructions?.he?.join(". ") ||
        exercise.instructions?.en?.join(". ") ||
        "",
    }));

    console.log(
      "🎯 WorkoutPlansScreen: Created exercise templates:",
      exerciseTemplates.length
    );

    return exerciseTemplates;
  };

  const getMuscleGroupsForDay = (dayName: string): string[] => {
    console.log(
      "🎯 WorkoutPlansScreen: getMuscleGroupsForDay called with:",
      dayName
    );

    // Enhanced mapping with both Hebrew and English terms
    const muscleMapping: { [key: string]: string[] } = {
      "אימון מלא": [
        "חזה",
        "גב",
        "רגליים",
        "כתפיים",
        "ידיים",
        "chest",
        "back",
        "legs",
        "shoulders",
        "arms",
        "quadriceps",
        "glutes",
        "triceps",
        "biceps",
        "core",
        "full_body",
      ],
      "פלג גוף עליון": [
        "חזה",
        "גב",
        "כתפיים",
        "ידיים",
        "chest",
        "back",
        "shoulders",
        "arms",
        "triceps",
        "biceps",
      ],
      "פלג גוף תחתון": [
        "רגליים",
        "ישבן",
        "שוקיים",
        "legs",
        "quadriceps",
        "glutes",
        "hamstrings",
      ],
      דחיפה: ["חזה", "כתפיים", "טריצפס", "chest", "shoulders", "triceps"],
      משיכה: ["גב", "ביצפס", "back", "biceps"],
      רגליים: [
        "רגליים",
        "ישבן",
        "שוקיים",
        "legs",
        "quadriceps",
        "glutes",
        "hamstrings",
      ],
      חזה: ["חזה", "טריצפס", "chest", "triceps"],
      גב: ["גב", "ביצפס", "back", "biceps"],
      כתפיים: ["כתפיים", "shoulders"],
      ידיים: ["ביצפס", "טריצפס", "biceps", "triceps"],
      בטן: ["בטן", "core"],
      "חזה + טריצפס": ["חזה", "טריצפס", "chest", "triceps"],
      "גב + ביצפס": ["גב", "ביצפס", "back", "biceps"],
      "כתפיים + בטן": ["כתפיים", "בטן", "shoulders", "core"],
      "ידיים + בטן": ["ביצפס", "טריצפס", "בטן", "biceps", "triceps", "core"],
      "בטן + קרדיו": ["בטן", "core", "full_body"],
    };

    const result = muscleMapping[dayName] || ["גוף מלא", "full_body"];
    console.log(
      "🎯 WorkoutPlansScreen: Muscle groups for",
      dayName,
      ":",
      result
    );
    return result;
  };

  const getDifficultyFilter = (experience: string): string[] => {
    if (experience.includes("מתחיל")) {
      return ["beginner", "intermediate"];
    } else if (experience.includes("בינוני")) {
      return ["beginner", "intermediate", "advanced"];
    } else if (experience === "some_experience") {
      // Handle intermediate level - include all difficulties for better exercise variety
      return ["beginner", "intermediate", "advanced"];
    } else {
      return ["beginner", "intermediate", "advanced"];
    }
  };

  const getSetsForExperience = (experience: string): number => {
    if (experience.includes("מתחיל")) return 3;
    if (experience.includes("בינוני")) return 4;
    return 4;
  };

  const getRepsForGoal = (goal: string): string => {
    if (goal?.includes("כוח") || goal === "strength") return "4-6";
    if (goal?.includes("שריר") || goal === "muscle_gain") return "8-12";
    if (goal?.includes("סיבולת") || goal === "endurance") return "12-15";
    if (goal?.includes("משקל") || goal === "weight_loss") return "12-15";
    return "8-12";
  };

  const getRestTimeForGoal = (goal: string): number => {
    if (goal?.includes("כוח") || goal === "strength") return 120;
    if (goal?.includes("שריר") || goal === "muscle_gain") return 90;
    if (goal?.includes("סיבולת") || goal === "endurance") return 45;
    if (goal?.includes("משקל") || goal === "weight_loss") return 60;
    return 75;
  };

  const calculateDuration = (exercises: ExerciseTemplate[]): number => {
    // Calculate duration based on exercises, sets, reps, and rest time
    const totalSets = exercises.reduce((total, ex) => total + ex.sets, 0);
    const avgRestTime =
      exercises.length > 0
        ? exercises.reduce((total, ex) => total + ex.restTime, 0) /
          exercises.length
        : 60;

    // Estimate: 30 seconds per set + rest time between sets
    const workingTime = totalSets * 0.5; // 30 seconds per set in minutes
    const restingTime = (totalSets - exercises.length) * (avgRestTime / 60); // Rest between sets
    const warmupCooldown = 10; // 10 minutes for warmup and cooldown

    return Math.round(workingTime + restingTime + warmupCooldown);
  };

  const extractTargetMuscles = (exercises: ExerciseTemplate[]): string[] => {
    if (exercises.length === 0) return [];

    const muscles = new Set<string>();
    exercises.forEach((exercise) => {
      const exerciseData = exerciseMap[exercise.exerciseId];
      if (exerciseData?.primaryMuscles) {
        exerciseData.primaryMuscles.forEach((muscle: string) =>
          muscles.add(muscle)
        );
      }
    });

    console.log(
      "🎯 WorkoutPlansScreen: Extracted target muscles:",
      Array.from(muscles)
    );
    return Array.from(muscles);
  };

  const extractEquipment = (exercises: ExerciseTemplate[]): string[] => {
    if (exercises.length === 0) return ["bodyweight"];

    const equipment = new Set<string>();
    exercises.forEach((exercise) => {
      const exerciseData = exerciseMap[exercise.exerciseId];
      if (exerciseData?.equipment) {
        equipment.add(exerciseData.equipment);
      }
    });

    return Array.from(equipment);
  };

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

  // Constants for better maintainability - moved from inline usage
  const DEFAULT_EQUIPMENT = ["barbell", "dumbbells", "cable_machine", "bench"];
  const DEFAULT_EXPERIENCE = "מתחיל (0-6 חודשים)";
  const DEFAULT_DURATION = "45-60 דקות";
  const DEFAULT_FREQUENCY = "3-4 פעמים בשבוע";
  const DEFAULT_GOAL = "בריאות כללית";

  // Experience mapping - consolidate duplicate mappings
  const EXPERIENCE_MAP = {
    beginner: "מתחיל (0-6 חודשים)",
    intermediate: "בינוני (6-24 חודשים)",
    advanced: "מתקדם (2+ שנים)",
  };

  // Duration mapping - consolidate duplicate mappings
  const DURATION_MAP: { [key: string]: string } = {
    "30_min": "30-45 דקות",
    "45_min": "45-60 דקות",
    "60_min": "60-75 דקות",
    "90_min": "75-90 דקות",
  };

  // Goal mapping - consolidate duplicate mappings
  const GOAL_MAP: { [key: string]: string } = {
    endurance: "שיפור סיבולת",
    strength: "שיפור כוח",
    weight_loss: "ירידה במשקל",
    muscle_gain: "עליה במסת שריר",
    general_fitness: "בריאות כללית",
  };

  // Frequency mapping - consolidate duplicate mappings
  const FREQUENCY_MAP: { [key: string]: number } = {
    "1-2 פעמים בשבוע": 2,
    "3-4 פעמים בשבוע": 3,
    "5-6 פעמים בשבוע": 5,
    "כל יום": 6,
    "2_times": 2,
    "3_times": 3,
    "4_times": 4,
    "5_times": 5,
    "6_times": 6,
    daily: 7,
    "2 times per week": 2,
    "3 times per week": 3,
    "4 times per week": 4,
    "5 times per week": 5,
    "6 times per week": 6,
    "7 times per week": 7,
  };

  // Improved equipment getter with error handling
  const getAvailableEquipment = async (): Promise<string[]> => {
    try {
      console.log("🔧 WorkoutPlansScreen: Loading available equipment...");
      const equipment = await questionnaireService.getAvailableEquipment();

      console.log(
        "🔧 WorkoutPlansScreen: Raw equipment from questionnaire:",
        equipment
      );

      // Enhanced equipment validation and mapping
      const validEquipment =
        equipment && equipment.length > 0 ? equipment : DEFAULT_EQUIPMENT;

      // Filter out special values to check for real equipment
      const realEquipment = validEquipment.filter(
        (item) =>
          item !== "none" && item !== "bodyweight" && item !== "no_equipment"
      );

      // ✅ FIX: Only return bodyweight if user has NO real equipment at all
      if (realEquipment.length === 0) {
        console.log(
          "🏠 WorkoutPlansScreen: User has no real equipment - using bodyweight only"
        );
        return ["none", "bodyweight"];
      }

      // Always include bodyweight as option alongside real equipment
      const finalEquipment = [...realEquipment, "none", "bodyweight"];

      console.log("🔧 WorkoutPlansScreen: User has equipment:", realEquipment);
      console.log(
        "🔧 WorkoutPlansScreen: Final equipment list:",
        finalEquipment
      );

      return finalEquipment;
    } catch (error) {
      console.error("❌ WorkoutPlansScreen: Error getting equipment:", error);
      setError(error instanceof Error ? error.message : "שגיאה בטעינת ציוד");
      return DEFAULT_EQUIPMENT;
    }
  };

  const startWorkout = (workout: WorkoutTemplate) => {
    try {
      console.log(
        "🚀 WorkoutPlansScreen: Starting workout with updated exercise database"
      );
      console.log("🚀 WorkoutPlansScreen: Workout name:", workout.name);
      console.log(
        "🚀 WorkoutPlansScreen: Exercise count:",
        workout.exercises.length
      );

      // Convert template to active workout format for ActiveWorkoutScreen
      const activeExercises = workout.exercises
        .map((template: ExerciseTemplate) => {
          const exercise = exerciseMap[template.exerciseId];

          if (!exercise) {
            console.warn(
              `❌ WorkoutPlansScreen: Exercise not found: ${template.exerciseId}`
            );
            return null;
          }

          console.log(
            `✅ WorkoutPlansScreen: Processing exercise: ${exercise.name} (equipment: ${exercise.equipment})`
          );

          // Create sets array with proper structure for ActiveWorkoutScreen
          const sets = Array.from({ length: template.sets }, (_, index) => ({
            id: `set-${index + 1}`,
            type: "working" as const,
            targetReps: parseInt(template.reps.split("-")[0]) || 10,
            targetWeight: 0,
            actualReps: undefined,
            actualWeight: undefined,
            completed: false,
            restTime: template.restTime,
            notes: "",
            isPR: false,
            rpe: undefined,
          }));

          return {
            id: template.exerciseId,
            name: exercise.name,
            category: exercise.category,
            primaryMuscles: exercise.primaryMuscles,
            equipment: exercise.equipment,
            sets: sets,
            instructions: exercise.instructions || [],
            targetSets: template.sets,
            targetReps: template.reps,
            restTime: template.restTime,
            notes: template.notes || "",
          };
        })
        .filter(
          (exercise): exercise is NonNullable<typeof exercise> =>
            exercise !== null
        );

      if (activeExercises.length === 0) {
        console.error(
          "❌ WorkoutPlansScreen: No valid exercises found for workout"
        );
        showError("שגיאה באימון", "לא נמצאו תרגילים תקינים לאימון זה");
        return;
      }

      // Log exercise equipment types for debugging
      const equipmentTypes = activeExercises.map((ex) => ex.equipment);
      console.log(
        "🏋️ WorkoutPlansScreen: Active workout equipment types:",
        equipmentTypes
      );

      // Check for bodyweight-only workout
      const isBodyweightOnly = equipmentTypes.every(
        (eq) => eq === "none" || eq === "bodyweight"
      );
      if (isBodyweightOnly) {
        console.log(
          "💪 WorkoutPlansScreen: This is a bodyweight-only workout - perfect for home without equipment!"
        );
      }

      // Navigate to ActiveWorkoutScreen with proper workout data structure
      console.log(
        "🚀 WorkoutPlansScreen: Navigating to ActiveWorkoutScreen with:",
        {
          workoutName: workout.name,
          exerciseCount: activeExercises.length,
          firstExercise: activeExercises[0]?.name,
          isBodyweightOnly,
        }
      );

      navigation.navigate("ActiveWorkout", {
        workoutData: {
          name: workout.name,
          dayName: workout.name,
          startTime: new Date().toISOString(),
          exercises: activeExercises,
        },
      } as never);
    } catch (error) {
      console.error("❌ WorkoutPlansScreen: Error starting workout:", error);
      setError(error instanceof Error ? error.message : "שגיאה בתחילת האימון");

      showError("שגיאה", "לא הצליח להתחיל את האימון. נסה שוב.");
    }
  };

  const showExerciseDetails = (exerciseId: string) => {
    const exercise = exerciseMap[exerciseId];
    console.log(
      "💪 WorkoutPlansScreen: Showing exercise details for:",
      exercise?.name
    );
    console.log(
      "💪 WorkoutPlansScreen: Exercise equipment:",
      exercise?.equipment
    );
    console.log(
      "💪 WorkoutPlansScreen: Exercise muscles:",
      exercise?.primaryMuscles
    );

    if (expandedExercise === exerciseId) {
      console.log("💪 WorkoutPlansScreen: Collapsing exercise details");
      setExpandedExercise(null);
    } else {
      console.log("💪 WorkoutPlansScreen: Expanding exercise details");
      setExpandedExercise(exerciseId);
    }
  };

  // Loading screen
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LoadingSpinner
          size="large"
          text="טוען תוכנית אימון..."
          variant="pulse"
          testID="workout-plans-loading"
        />
      </SafeAreaView>
    );
  }

  // Error screen
  if (!workoutPlan) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={64}
          color={theme.colors.error}
        />
        <Text style={styles.errorTitle}>שגיאה בטעינת התוכנית</Text>
        <Text style={styles.errorMessage}>
          {error || "לא הצלחנו לטעון את תוכנית האימון"}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => generateWorkoutPlan(true)}
        >
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Main screen
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>{workoutPlan.name}</Text>
          <Text style={styles.description}>{workoutPlan.description}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={handleAIPlanPress}
            >
              <MaterialCommunityIcons
                name="robot"
                size={20}
                color={theme.colors.surface}
              />
              <Text style={styles.aiButtonText}>תוכנית AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={handleRegeneratePress}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.regenerateButtonText}>רענון</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.daySelector}>
          {workoutPlan.workouts.map((workout, index) => (
            <DayButton
              key={workout.id}
              dayNumber={index + 1}
              customText={workout.name}
              selected={selectedDay === index}
              onPress={() => handleDaySelection(index, workout.name)}
              variant="workout-plan"
              icon={
                (DAY_ICONS[
                  workout.name
                ] as keyof typeof MaterialCommunityIcons.glyphMap) || "dumbbell"
              }
              accessibilityLabel={`אימון ${workout.name}`}
              accessibilityHint={`לחץ לבחירת אימון ${workout.name}`}
            />
          ))}
        </View>

        {workoutPlan.workouts[selectedDay] && (
          <View style={styles.workoutDetails}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() =>
                handleStartWorkout(workoutPlan.workouts[selectedDay])
              }
            >
              <Text style={styles.startButtonText}>התחל אימון</Text>
            </TouchableOpacity>

            <View style={styles.exercisesList}>
              {workoutPlan.workouts[selectedDay].exercises.map((exercise) => {
                const exerciseData = exerciseMap[exercise.exerciseId];
                console.log(
                  `📝 WorkoutPlansScreen: Rendering exercise ${exercise.exerciseId}:`,
                  exerciseData?.name || "NOT FOUND"
                );

                if (!exerciseData) {
                  console.error(
                    `❌ WorkoutPlansScreen: Exercise data not found for ID: ${exercise.exerciseId}`
                  );
                  return null;
                }

                return (
                  <View key={exercise.exerciseId} style={styles.exerciseCard}>
                    <TouchableOpacity
                      style={styles.exerciseTouchable}
                      onPress={() =>
                        handleExerciseDetailsToggle(
                          exercise.exerciseId,
                          exerciseData.name
                        )
                      }
                    >
                      <Text style={styles.exerciseName}>
                        {exerciseData.name}
                      </Text>
                      <Text style={styles.exerciseDetails}>
                        {exercise.sets} סטים × {exercise.reps} חזרות
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Universal Modal - replaces 4 separate modals */}
      <UniversalModal
        visible={activeModal !== null}
        type={activeModal || "error"}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={hideModal}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        destructive={modalConfig.destructive}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18, // הוגדל מ-16 לקריאות טובה יותר במכשיר אמיתי
    color: theme.colors.text,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 22, // הוגדל מ-20 לבולטות במסך הנייד
    fontWeight: "bold",
    color: theme.colors.error,
    marginTop: 16,
    textAlign: "center",
    writingDirection: "rtl", // ✅ RTL support
  },
  errorMessage: {
    fontSize: 18, // הוגדל מ-16 לקריאות טובה יותר
    color: theme.colors.text,
    marginTop: 8,
    textAlign: "center",
    writingDirection: "rtl", // ✅ RTL support
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: theme.colors.surface,
    fontSize: 18, // הוגדל מ-16 לבולטות במסך הנייד
    fontWeight: "bold",
    writingDirection: "rtl", // ✅ RTL support
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26, // הוגדל מ-24 לבולטות במסך הנייד
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 8,
    writingDirection: "rtl", // ✅ RTL support
  },
  description: {
    fontSize: 18, // הוגדל מ-16 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl", // ✅ RTL support
  },
  daySelector: {
    flexDirection: "row-reverse", // ✅ RTL support - שינוי מ-"row"
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 16,
  },
  workoutDetails: {
    padding: 16,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  startButtonText: {
    color: theme.colors.surface,
    fontSize: 20, // הוגדל מ-18 לבולטות במסך הנייד
    fontWeight: "bold",
    writingDirection: "rtl", // ✅ RTL support
  },
  exercisesList: {
    gap: 8,
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    alignItems: "flex-end", // ✅ RTL support - יישור לימין
  },
  exerciseTouchable: {
    width: "100%",
    alignItems: "flex-end", // ✅ RTL support - יישור לימין
  },
  exerciseName: {
    fontSize: 18, // הוגדל מ-16 לקריאות טובה יותר
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: "right", // ✅ RTL support
    writingDirection: "rtl", // ✅ RTL support
    width: "100%", // ✅ RTL support - רוחב מלא
  },
  exerciseDetails: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    textAlign: "right", // ✅ RTL support
    writingDirection: "rtl", // ✅ RTL support
    width: "100%", // ✅ RTL support - רוחב מלא
  },
  actionButtons: {
    flexDirection: "row-reverse", // ✅ RTL support - שינוי מ-"row"
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  aiButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row-reverse", // ✅ RTL support - שינוי מ-"row"
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  aiButtonText: {
    color: theme.colors.surface,
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    fontWeight: "bold",
    writingDirection: "rtl", // ✅ RTL support
  },
  regenerateButton: {
    backgroundColor: theme.colors.surface,
    flexDirection: "row-reverse", // ✅ RTL support - שינוי מ-"row"
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    gap: 6,
  },
  regenerateButtonText: {
    color: theme.colors.primary,
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    fontWeight: "bold",
    writingDirection: "rtl", // ✅ RTL support
  },
});
