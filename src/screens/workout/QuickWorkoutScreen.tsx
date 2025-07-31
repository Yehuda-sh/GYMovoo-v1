/**
 * @file src/screens/workout/QuickWorkoutScreen.tsx
 * @brief מסך אימון מהיר מתקדם עם AI אישי וממשק אינטראקטיבי מלא
 * @version 3.0.0
 * @author GYMovoo Development Team
 * @created 2024-12-15
 * @modified 2025-07-31
 *
 * @description
 * מסך אימון מהיר מתקדם המספק חוויית אימון מלאה עם:
 * - יצירת אימונים מותאמים אישית על בסיס שאלון המשתמש
 * - ממשק אינטראקטיבי עם טיימרים, דשבורד, וסטטיסטיקות חיות
 * - מעקב התקדמות בזמן אמת עם חישוב שיאים אישיים
 * - מערכת מנוחה אוטומטית ופקדי זמן מתקדמים
 * - שמירה אוטומטית ויכולות backup מתקדמות
 *
 * @features
 * - ✅ יצירת אימונים מותאמים אישית עם generateQuickWorkout
 * - ✅ ממשק מתקדם עם WorkoutHeader, Dashboard, StatusBar
 * - ✅ מעקב זמן בזמן אמת עם useWorkoutTimer & useRestTimer
 * - ✅ חישוב שיאים אישיים מהיסטוריית המשתמש
 * - ✅ שמירה אוטומטית עם autoSaveService
 * - ✅ FAB דינמי עם הסתרה/הצגה בגלילה
 * - ✅ מודלים מתקדמים (PlateCalculator, ExerciseTips, Summary)
 * - ✅ תמיכת RTL מלאה עם אנימציות מתקדמות
 * - ✅ נגישות מקיפה לכל הרכיבים
 *
 * @performance
 * אופטימיזציה מתקדמת עם useMemo לחישובי סטטיסטיקות,
 * useCallback למניעת re-renders מיותרים, FlatList אופטימלי,
 * ואנימציות עם native driver לביצועים מיטביים
 *
 * @rtl
 * תמיכה מלאה בעברית עם פריסת רכיבים מימין לשמאל,
 * FAB ממוקם נכון, ואנימציות מותאמות לכיוון קריאה
 *
 * @accessibility
 * תמיכה מלאה ב-Screen Readers עם accessibilityLabel, accessibilityRole,
 * accessibilityHint מפורטים לכל רכיב אינטרקטיבי, טיימר, וסטטיסטיקה
 *
 * @algorithm
 * חישוב שיאים אישיים: השוואת ביצועים נוכחיים לקודמים מההיסטוריה
 * חישוב קצב: elapsedTime / totalReps
 * חישוב נפח: Σ(weight × reps) לכל הסטים המושלמים
 *
 * @hooks
 * - useWorkoutTimer: מעקב זמן אימון עם start/pause/resume
 * - useRestTimer: טיימר מנוחה אוטומטי עם פקדים
 * - useUserPreferences: נתוני משתמש ומטרות אימון
 * - useUserStore: גישה למידע המשתמש וההיסטוריה
 *
 * @services
 * - autoSaveService: שמירה אוטומטית של מצב האימון
 * - generateQuickWorkout: יצירת אימונים מותאמים אישית
 *
 * @dependencies
 * React Navigation, MaterialCommunityIcons, Animated, FlatList,
 * WorkoutHeader, WorkoutDashboard, ExerciseCard, FloatingActionButton
 *
 * @exports QuickWorkoutScreen (default)
 *
 * @example
 * ```tsx
 * // בשימוש עם preset exercises
 * navigation.navigate('QuickWorkout', {
 *   exercises: customExercises,
 *   workoutName: 'אימון חזה וכתפיים',
 *   source: 'WorkoutPlansScreen'
 * });
 * ```
 *
 * @notes
 * מסך מרכזי באפליקציה - מטפל בלוגיקה מורכבת של אימונים,
 * טיימרים, שמירת נתונים, ואינטראקציה עם המשתמש
 */
// cspell:ignore קומפוננטות, קומפוננטה, סקוואט, במודאלים, לדשבורד, הדשבורד, Subviews, אלרט, uick

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  FlatList,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { generateQuickWorkout } from "../../services/quickWorkoutGenerator";
import { useUserPreferences } from "../../hooks/useUserPreferences";

// Components - תיקון הייבוא
import { WorkoutHeader } from "./components/WorkoutHeader";
import { WorkoutDashboard } from "./components/WorkoutDashboard";
import ExerciseCard from "./components/ExerciseCard"; // שינוי לייבוא default
import { WorkoutStatusBar } from "./components/WorkoutStatusBar";
import { WorkoutSummary } from "./components/WorkoutSummary";
import { PlateCalculatorModal } from "./components/PlateCalculatorModal";
import { ExerciseTipsModal } from "./components/ExerciseTipsModal";
import FloatingActionButton from "../../components/workout/FloatingActionButton";

// Hooks & Services
import { useWorkoutTimer } from "./hooks/useWorkoutTimer";
import { useRestTimer } from "./hooks/useRestTimer";
import autoSaveService from "./services/autoSaveService";

// Types
import { Exercise, WorkoutData, Set } from "./types/workout.types";
import { useUserStore } from "../../stores/userStore";

// TypeScript interfaces for better type safety
interface HistoricalWorkout {
  exercises?: HistoricalExercise[];
  [key: string]: unknown;
}

interface HistoricalExercise {
  name?: string;
  exerciseName?: string;
  sets?: HistoricalSet[];
  weight?: number;
  reps?: number;
  [key: string]: unknown;
}

interface HistoricalSet {
  weight?: number;
  actualWeight?: number;
  reps?: number;
  actualReps?: number;
  [key: string]: unknown;
}

interface UserData {
  activityHistory?: {
    workouts?: HistoricalWorkout[];
  };
  [key: string]: unknown;
}

interface NextSetData {
  exercise: Exercise;
  set: Set;
}

// פונקציה לחישוב שיאים אישיים מהיסטוריית המשתמש
const calculatePersonalRecords = (
  user: UserData | null,
  currentExercises: Exercise[]
): number => {
  if (!user?.activityHistory?.workouts) return 0;

  let prCount = 0;
  const workouts = user.activityHistory.workouts;

  // עבור כל תרגיל נוכחי, בדוק אם יש שיא חדש
  currentExercises.forEach((exercise) => {
    const bestFromHistory = findBestPerformance(workouts, exercise.name);
    const currentBest = findCurrentBest(exercise);

    if (currentBest && bestFromHistory && currentBest > bestFromHistory) {
      prCount++;
    }
  });

  return prCount;
};

// פונקציה למציאת הביצוע הטוב ביותר בהיסטוריה
const findBestPerformance = (
  workouts: HistoricalWorkout[],
  exerciseName: string
): number => {
  let best = 0;

  workouts.forEach((workout) => {
    if (workout.exercises) {
      workout.exercises.forEach((ex: HistoricalExercise) => {
        if (ex.name === exerciseName || ex.exerciseName === exerciseName) {
          const performance = calculatePerformanceScore(ex);
          if (performance > best) {
            best = performance;
          }
        }
      });
    }
  });

  return best;
};

// פונקציה למציאת הביצוע הטוב ביותר באימון הנוכחי
const findCurrentBest = (exercise: Exercise): number => {
  let best = 0;

  exercise.sets.forEach((set) => {
    if (set.completed && set.actualReps && set.actualWeight) {
      const performance = set.actualWeight * set.actualReps;
      if (performance > best) {
        best = performance;
      }
    }
  });

  return best;
};

// פונקציה לחישוב ציון ביצוע (משקל * חזרות)
const calculatePerformanceScore = (exercise: HistoricalExercise): number => {
  if (exercise.sets && exercise.sets.length > 0) {
    let maxScore = 0;
    exercise.sets.forEach((set: HistoricalSet) => {
      const score =
        (set.weight || set.actualWeight || 0) *
        (set.reps || set.actualReps || 0);
      if (score > maxScore) {
        maxScore = score;
      }
    });
    return maxScore;
  }

  // אם אין sets, השתמש בערכים ישירים
  return (exercise.weight || 0) * (exercise.reps || 0);
};

// פונקציה לקבלת תרגיל יחיד מההיסטוריה - נדרשת למצב single-exercise
const getActiveExerciseFromHistory = (
  user: UserData | null,
  exerciseName?: string,
  presetExercise?: Exercise
): Exercise => {
  // אם יש תרגיל מוגדר מראש מהפרמטרים, השתמש בו
  if (presetExercise) {
    console.log(
      "✅ QuickWorkout - משתמש בתרגיל מוגדר מראש:",
      presetExercise.name
    );
    return {
      ...presetExercise,
      sets: presetExercise.sets.map((set) => ({
        ...set,
        actualWeight: set.actualWeight || set.targetWeight || 50,
        actualReps: set.actualReps || set.targetReps || 8,
      })),
    };
  }

  // אם יש שם תרגיל ספציפי, נחפש אותו בהיסטוריה
  if (exerciseName && user?.activityHistory?.workouts) {
    const recentWorkouts = user.activityHistory.workouts.slice(0, 5); // 5 אימונים אחרונים

    for (const workout of recentWorkouts) {
      if (workout.exercises) {
        const exercise = workout.exercises.find(
          (ex: HistoricalExercise) =>
            ex.name?.includes(exerciseName) ||
            ex.exerciseName?.includes(exerciseName)
        );

        if (exercise) {
          return {
            id: `history-${exerciseName}`,
            name: exercise.name || exercise.exerciseName || exerciseName,
            category: "היסטוריה",
            primaryMuscles: ["כללי"],
            equipment: "לא מוגדר",
            sets: exercise.sets?.map((set, index) => ({
              id: `${exercise.name}-${index + 1}`,
              type: "working" as const,
              targetWeight: set.weight || 50,
              targetReps: set.reps || 8,
              actualWeight: set.actualWeight || set.weight || 50,
              actualReps: set.actualReps || set.reps || 8,
              completed: false,
              isPR: false,
            })) || [
              {
                id: `${exerciseName}-1`,
                type: "working" as const,
                targetWeight: exercise.weight || 50,
                targetReps: exercise.reps || 8,
                actualWeight: exercise.weight || 50,
                actualReps: exercise.reps || 8,
                completed: false,
                isPR: false,
              },
            ],
            restTime: 90,
            notes: `מבוסס על ביצוע קודם: ${exercise.reps || 8}x${exercise.weight || 50}kg`,
          };
        }
      }
    }
  }

  // נתוני דמו כגיבוי
  return {
    id: `demo-${exerciseName || "exercise"}`,
    name: exerciseName || "תרגיל",
    category: "דמו",
    primaryMuscles: ["כללי"],
    equipment: "לא מוגדר",
    sets: [
      {
        id: `demo-${exerciseName || "exercise"}-1`,
        type: "working" as const,
        targetWeight: 50,
        targetReps: 8,
        actualWeight: 50,
        actualReps: 8,
        completed: false,
        isPR: false,
      },
    ],
    restTime: 90,
    notes: "תרגיל דמו - עדכן את הערכים לפי יכולתך",
  };
};

const initialExercises: Exercise[] = [
  {
    id: "1",
    name: "לחיצת חזה במוט",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "שרירי היד האחוריים"],
    equipment: "מוט",
    sets: [
      {
        id: "1-1",
        type: "warmup",
        targetReps: 15,
        targetWeight: 40,
        completed: false,
        isPR: false,
      },
      {
        id: "1-2",
        type: "working",
        targetReps: 10,
        targetWeight: 60,
        completed: false,
        isPR: false,
      },
      {
        id: "1-3",
        type: "working",
        targetReps: 10,
        targetWeight: 60,
        completed: false,
        isPR: false,
      },
      {
        id: "1-4",
        type: "working",
        targetReps: 8,
        targetWeight: 65,
        completed: false,
        isPR: false,
      },
    ],
    restTime: 90,
    notes: "התחמם היטב לפני הסטים הכבדים",
  },
  {
    id: "2",
    name: "חתירה בכבלים",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["שרירי היד הקדמיים"],
    equipment: "כבלים",
    sets: [
      {
        id: "2-1",
        type: "working",
        targetReps: 12,
        targetWeight: 50,
        completed: false,
        isPR: false,
      },
      {
        id: "2-2",
        type: "working",
        targetReps: 12,
        targetWeight: 50,
        completed: false,
        isPR: false,
      },
      {
        id: "2-3",
        type: "working",
        targetReps: 10,
        targetWeight: 55,
        completed: false,
        isPR: false,
      },
    ],
    restTime: 60,
  },
  {
    id: "3",
    name: "סקוואט",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    secondaryMuscles: ["core"],
    equipment: "מוט",
    sets: [
      {
        id: "3-1",
        type: "warmup",
        targetReps: 12,
        targetWeight: 40,
        completed: false,
        isPR: false,
      },
      {
        id: "3-2",
        type: "working",
        targetReps: 8,
        targetWeight: 80,
        completed: false,
        isPR: false,
      },
      {
        id: "3-3",
        type: "working",
        targetReps: 8,
        targetWeight: 80,
        completed: false,
        isPR: false,
      },
      {
        id: "3-4",
        type: "working",
        targetReps: 6,
        targetWeight: 90,
        completed: false,
        isPR: false,
      },
    ],
    restTime: 120,
    notes: "שמור על גב ישר וירידה עמוקה",
  },
];

// הגדרות FAB
// FAB Configuration
const FAB_CONFIG = {
  showLabel: true,
  labelDuration: 3000, // 3 שניות
};

const QuickWorkoutScreen: React.FC = () => {
  console.log("🎬 QuickWorkoutScreen component rendered");

  const navigation = useNavigation();
  const route = useRoute();

  // קבלת פרמטרים מהניווט - תמיכה במצבים שונים
  const {
    exercises: presetExercises,
    workoutName: presetWorkoutName,
    mode = "full",
    exerciseName,
    singleExercise,
    hideAdvancedFeatures = false,
    currentExerciseIndex = 0,
    workoutData,
  } = (route.params as {
    exercises?: Exercise[];
    workoutName?: string;
    source?: string;
    mode?: "full" | "single-exercise" | "view-only";
    exerciseName?: string;
    singleExercise?: Exercise;
    hideAdvancedFeatures?: boolean;
    currentExerciseIndex?: number;
    workoutData?: {
      exercises: Exercise[];
      workoutName?: string;
    };
  }) || {};

  console.log("🎬 QuickWorkoutScreen - מצב:", {
    mode,
    exerciseName,
    hasSingleExercise: !!singleExercise,
    hideAdvancedFeatures,
    currentExerciseIndex,
  });

  const [workoutName, setWorkoutName] = useState(() => {
    if (mode === "single-exercise") {
      return (
        workoutData?.workoutName ||
        singleExercise?.name ||
        exerciseName ||
        "תרגיל יחיד"
      );
    }
    return presetWorkoutName || "אימון מהיר";
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    if (mode === "single-exercise" && singleExercise) {
      return [singleExercise];
    }
    return presetExercises || [];
  });
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // מצב טעינה ראשוני - תלוי במצב
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(() => {
    // במצב תרגיל יחיד - אף פעם לא טוען
    if (mode === "single-exercise") {
      return false;
    }

    const hasValidPresets =
      presetExercises &&
      presetExercises.length > 0 &&
      presetExercises.some((ex) => ex && ex.sets && ex.sets.length > 0);

    console.log("🔄 QuickWorkout - מצב טעינה ראשוני:", {
      mode,
      hasPresets: !!presetExercises,
      presetsLength: presetExercises?.length || 0,
      hasValidPresets,
      shouldLoad: !hasValidPresets,
    });

    return !hasValidPresets; // טען רק אם אין תרגילים תקינים
  });

  const [hasLoggedPresetUse, setHasLoggedPresetUse] = useState(false); // מניעת לוגים חוזרים

  // גישה לנתוני המשתמש
  // Access user data
  const {
    userGoal,
    preferredDuration,
    hasCompletedQuestionnaire,
    isInitialized,
  } = useUserPreferences();

  const { user } = useUserStore();

  console.log("📊 QuickWorkout - User data:", {
    userGoal,
    preferredDuration,
    hasCompletedQuestionnaire,
    isInitialized,
    presetExercises: presetExercises?.length || 0,
    presetExercisesValid:
      presetExercises?.every(
        (ex) => ex && ex.id && ex.name && ex.sets?.length > 0
      ) || false,
  });

  // מצב FAB
  const [fabVisible, setFabVisible] = useState(true);
  const [fabLabelVisible, setFabLabelVisible] = useState(true);

  // מודלים (modals)
  const [modals, setModals] = useState({
    plateCalculator: false,
    exerciseTips: false,
  });

  // Confirmation modals
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showNoSetsModal, setShowNoSetsModal] = useState(false);
  const [showStartSetModal, setShowStartSetModal] = useState(false);
  const [nextSetData, setNextSetData] = useState<NextSetData | null>(null);

  const [modalData] = useState<{
    plateCalculatorWeight?: number;
    selectedExercise?: Exercise;
  }>({});

  // הגדרות טיימרים
  const workoutId = `quick-workout-${Date.now()}`;
  const { elapsedTime, formattedTime, isRunning, startTimer, pauseTimer } =
    useWorkoutTimer(workoutId);
  const {
    isRestTimerActive,
    restTimeRemaining,
    startRestTimer,
    skipRestTimer,
    addRestTime,
    subtractRestTime,
  } = useRestTimer();

  // אנימציות
  const dashboardAnimation = useRef(new Animated.Value(0)).current;

  // הגדרת מצב טעינה ראשוני - רק פעם אחת
  useEffect(() => {
    console.log("🔄 QuickWorkout - בדיקת תרגילים ראשונית");

    // בדיקה מתקדמת אם יש תרגילים תקינים מהתוכנית
    const hasValidPresetExercises =
      presetExercises &&
      presetExercises.length > 0 &&
      presetExercises.some((ex) => ex && ex.sets && ex.sets.length > 0);

    if (hasValidPresetExercises) {
      console.log(
        "🎯 QuickWorkout - יש תרגילים תקינים מהתוכנית, לא צריך לטעון"
      );
      setIsLoadingWorkout(false);
    } else if (presetExercises && presetExercises.length > 0) {
      console.warn("⚠️ QuickWorkout - יש תרגילים מהתוכנית אבל הם לא תקינים");
      // גם במקרה זה, נעבור ללוגיקה הרגילה ולא נישאר תקועים
    } else {
      console.log(
        "ℹ️ QuickWorkout - אין תרגילים מוגדרים מראש, מתחיל תהליך טעינה רגיל"
      );
    }
  }, []); // רק פעם אחת בעת יצירת הקומפוננט

  // מעקב אחר שינויים בטיימר המנוחה
  useEffect(() => {
    // עדכון מצב הטיימר בצורה שקטה
  }, [isRestTimerActive, restTimeRemaining]);

  // טעינת אימון מותאם אישית - רק פעם אחת
  // Load personalized workout - only once
  useEffect(() => {
    console.log("🔄 QuickWorkout useEffect triggered:", {
      isInitialized,
      isLoadingWorkout,
    });

    // רק אם אנחנו עדיין במצב טעינה ונתונים מוכנים
    if (isLoadingWorkout && isInitialized) {
      loadPersonalizedWorkout();
    }
  }, [isInitialized, isLoadingWorkout]); // חזרה לשני התנאים עם לוגיקה מתוקנת

  // Backup timer - אם הטעינה תקועה יותר מ-5 שניות, כבה אותה
  useEffect(() => {
    const backupTimer = setTimeout(() => {
      if (isLoadingWorkout) {
        console.warn("⏰ QuickWorkout - Backup timer: מכבה טעינה שתקועה");
        setIsLoadingWorkout(false);
        // אם אין תרגילים כלל, השתמש בברירת מחדל
        if (!exercises || exercises.length === 0) {
          console.log("🔧 QuickWorkout - Backup: משתמש בתרגילי ברירת מחדל");
          setExercises(initialExercises);
        }
      }
    }, 5000); // 5 שניות

    return () => clearTimeout(backupTimer);
  }, [isLoadingWorkout, exercises]);

  const loadPersonalizedWorkout = async () => {
    try {
      console.log("🚀 QuickWorkout - מתחיל טעינת אימון מותאם אישית...");

      // במצב תרגיל יחיד - טען מההיסטוריה או השתמש בנתונים שהועברו
      if (mode === "single-exercise") {
        if (!singleExercise && exerciseName) {
          const historyExercise = getActiveExerciseFromHistory(
            user as UserData | null,
            exerciseName
          );
          setExercises([historyExercise]);
        }
        setIsLoadingWorkout(false);
        return;
      }

      // לא מגדירים setIsLoadingWorkout(true) כדי למנוע לולאה

      // אם יש תרגילים מוכנים מהתוכנית - השתמש בהם!
      // בדיקה מתקדמת שהתרگילים באמת תקינים ויש בהם sets
      if (presetExercises && presetExercises.length > 0) {
        // וידוא שהתרגילים תקינים ויש להם sets
        const validExercises = presetExercises.filter(
          (ex) => ex && ex.id && ex.name && ex.sets && ex.sets.length > 0
        );

        if (validExercises.length > 0) {
          if (!hasLoggedPresetUse) {
            console.log(
              "✅ QuickWorkout - משתמש בתרגילים מהתוכנית:",
              validExercises.map((ex: Exercise) => ex.name)
            );
            setHasLoggedPresetUse(true);
          }
          setExercises(validExercises);
          setIsLoadingWorkout(false);
          return;
        } else {
          console.warn(
            "⚠️ QuickWorkout - תרגילי התוכנית לא תקינים, ממשיך ללוגיקה הרגילה"
          );
        }
      }

      // אם הנתונים לא נטענו עדיין - השתמש בברירת מחדל
      // If data not loaded yet - use default
      if (!isInitialized) {
        console.log(
          "⏳ QuickWorkout - נתונים לא נטענו עדיין, משתמש בברירת מחדל"
        );
        setExercises(initialExercises);
        setIsLoadingWorkout(false);
        return;
      }

      console.log("🔍 QuickWorkout - בדיקת השלמת שאלון:", {
        hasCompletedQuestionnaire,
        userGoal,
        preferredDuration,
        isInitialized,
      });

      // אם המשתמש השלים שאלון, צור אימון מותאם
      // If user completed questionnaire, create personalized workout
      if (hasCompletedQuestionnaire) {
        console.log("✅ QuickWorkout - משתמש השלים שאלון, יוצר אימון מותאם");
        try {
          const personalizedExercises = await generateQuickWorkout();
          if (personalizedExercises.length > 0) {
            setExercises(personalizedExercises);

            // עדכון שם האימון לפי המטרה
            // Update workout name by goal
            const workoutNames: { [key: string]: string } = {
              "ירידה במשקל": "אימון קרדיו לירידה במשקל",
              "עליה במסת שריר": "אימון בניית שריר",
              "שיפור כוח": "אימון כוח",
              "שיפור סיבולת": "אימון סיבולת",
              "בריאות כללית": "אימון מאוזן",
              "שיקום מפציעה": "אימון שיקומי",
            };
            setWorkoutName(workoutNames[userGoal] || "אימון מותאם אישית");
          } else {
            // אם אין תרגילים מתאימים, השתמש בברירת מחדל
            // If no suitable exercises, use default
            console.log(
              "⚠️ QuickWorkout - לא נמצאו תרגילים מותאמים, משתמש בברירת מחדל"
            );
            setExercises(initialExercises);
          }
        } catch (exerciseError) {
          console.error(
            "Error generating personalized exercises:",
            exerciseError
          );
          setExercises(initialExercises);
        }
      } else {
        // אם לא השלים שאלון, השתמש באימון ברירת מחדל
        // If didn't complete questionnaire, use default workout
        console.log(
          "⚠️ QuickWorkout - משתמש לא השלים שאלון, משתמש בברירת מחדל"
        );
        setExercises(initialExercises);

        // הצג הודעה למשתמש רק אם באמת לא השלים שאלון ולא אם הנתונים עדיין נטענים
        // Show message to user only if truly didn't complete questionnaire and not during data loading
        console.log("🔍 QuickWorkout - בדיקת תנאי הצגת אלרט:", {
          isInitialized,
          hasCompletedQuestionnaire,
          shouldShowAlert: isInitialized && !hasCompletedQuestionnaire,
        });
        if (isInitialized) {
          console.log(
            "🚨 QuickWorkout - מציג אלרט השלמת שאלון (נתונים נטענו במלואם)"
          );
          setTimeout(() => {
            setShowQuestionnaireModal(true);
          }, 1000);
        } else {
          console.log("🔄 QuickWorkout - דילוג על אלרט - נתונים עדיין נטענים");
        }
      }
    } catch (error) {
      console.error("Error loading personalized workout:", error);
      setExercises(initialExercises);
    } finally {
      console.log("✅ QuickWorkout - סיום טעינת אימון");
      setIsLoadingWorkout(false);

      // בדיקה סופית שיש תרגילים - אם לא, השתמש בברירת מחדל
      setTimeout(() => {
        if (!exercises || exercises.length === 0) {
          console.warn(
            "⚠️ QuickWorkout - לא נמצאו תרגילים בסוף הטעינה, משתמש בברירת מחדל"
          );
          setExercises(initialExercises);
        }
      }, 100);
    }
  };

  // הסתרת תווית FAB אחרי זמן מוגדר
  useEffect(() => {
    const timer = setTimeout(() => {
      setFabLabelVisible(false);
    }, FAB_CONFIG.labelDuration);

    return () => clearTimeout(timer);
  }, []);

  // פתיחה/סגירה של דשבורד
  const toggleDashboard = useCallback(() => {
    const toValue = dashboardVisible ? 0 : 1;
    setDashboardVisible(!dashboardVisible);

    Animated.spring(dashboardAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [dashboardVisible, dashboardAnimation]);

  // התחלת אימון
  useEffect(() => {
    startTimer();
    autoSaveService.startAutoSave(workoutId, () => ({
      id: workoutId,
      name: workoutName,
      startTime: new Date().toISOString(),
      duration: elapsedTime,
      exercises: exercises,
      totalVolume: stats.totalVolume,
    }));

    return () => {
      // נקה את השירותים כשיוצאים מהמסך
      autoSaveService.stopAutoSave();
      pauseTimer(); // עצור את הטיימר
      if (isRestTimerActive) {
        skipRestTimer(); // עצור טיימר מנוחה אם הוא פועל
      }
    };
  }, [pauseTimer, isRestTimerActive, skipRestTimer]);

  // חישובי סטטיסטיקות
  const stats = useMemo(() => {
    // בדיקת בטיחות - אם אין תרגילים, החזר ערכי ברירת מחדל
    if (!exercises || exercises.length === 0) {
      return {
        completedSets: 0,
        totalSets: 0,
        totalVolume: 0,
        totalReps: 0,
        currentPace: 0,
      };
    }

    let completedSets = 0;
    let totalVolume = 0;
    let totalReps = 0;

    exercises.forEach((exercise) => {
      if (exercise && exercise.sets) {
        exercise.sets.forEach((set) => {
          if (set && set.completed) {
            completedSets++;

            // אם יש ערכים ממשיים, השתמש בהם. אחרת השתמש בערכי המטרה
            const reps = set.actualReps || set.targetReps || 0;
            const weight = set.actualWeight || set.targetWeight || 0;

            totalReps += reps;
            totalVolume += reps * weight;
          }
        });
      }
    });

    const statsResult = {
      completedSets,
      totalSets: exercises.reduce(
        (acc, ex) => acc + (ex?.sets?.length || 0),
        0
      ),
      totalVolume,
      totalReps,
      currentPace: totalReps > 0 ? Math.round(elapsedTime / totalReps) : 0,
    };

    return statsResult;
  }, [exercises, elapsedTime]);

  // התרגיל הבא
  const nextExercise = useMemo(() => {
    if (!exercises || exercises.length === 0) {
      return null;
    }

    const incompleteExercise = exercises.find(
      (ex) => ex && ex.sets && ex.sets.some((set) => set && !set.completed)
    );
    return incompleteExercise || null;
  }, [exercises]);

  // Handlers
  const handleEditWorkoutName = useCallback(() => {
    Alert.prompt(
      "שם האימון",
      "הכנס שם חדש לאימון",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "שמור",
          onPress: (newName) => {
            if (newName && newName.trim()) {
              setWorkoutName(newName.trim());
            }
          },
        },
      ],
      "plain-text",
      workoutName
    );
  }, [workoutName]);

  const handleFinishWorkout = useCallback(() => {
    if (stats.completedSets === 0) {
      setShowNoSetsModal(true);
      return;
    }

    // עצור את כל הטיימרים לפני סיום האימון
    pauseTimer();
    if (isRestTimerActive) {
      skipRestTimer(); // עצור טיימר מנוחה אם הוא פועל
    }

    const workoutData: WorkoutData = {
      id: `workout-${Date.now()}`,
      name: workoutName,
      startTime: new Date().toISOString(),
      duration: elapsedTime,
      exercises: exercises,
      totalVolume: stats.totalVolume,
    };

    autoSaveService.saveWorkoutState(workoutData);
    setShowSummary(true);
  }, [
    workoutName,
    elapsedTime,
    exercises,
    stats,
    pauseTimer,
    isRestTimerActive,
    skipRestTimer,
  ]);

  // עיבוד המסך
  // Render screen
  if (isLoadingWorkout) {
    return (
      <View
        style={[styles.container, styles.loadingContainer]}
        accessible={true}
        accessibilityLabel="טוען אימון מותאם אישית"
        accessibilityRole="none"
      >
        <MaterialCommunityIcons
          name="dumbbell"
          size={80}
          color={theme.colors.primary}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel="אייקון משקולת - טוען אימון"
        />
        <Text style={styles.loadingText}>יוצר אימון מותאם אישית...</Text>
        <Text style={styles.loadingSubtext}>
          {hasCompletedQuestionnaire
            ? `מתאים אימון ל${userGoal}`
            : "טוען אימון ברירת מחדל"}
        </Text>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        accessible={true}
        accessibilityLabel="מסך אימון מהיר"
        accessibilityRole="none"
      >
        {/* Header קומפקטי */}
        <WorkoutHeader
          workoutName={workoutName}
          elapsedTime={formattedTime}
          onTimerPress={() => (isRunning ? pauseTimer() : startTimer())}
          onNamePress={mode === "view-only" ? () => {} : handleEditWorkoutName}
          onMenuPress={hideAdvancedFeatures ? () => {} : toggleDashboard}
        />

        {/* Workout Status Bar - Combined Rest Timer + Next Exercise - מוסתר במצב view-only */}
        {!hideAdvancedFeatures && (
          <WorkoutStatusBar
            isRestActive={isRestTimerActive}
            restTimeLeft={restTimeRemaining}
            onAddRestTime={addRestTime}
            onSubtractRestTime={subtractRestTime}
            onSkipRest={skipRestTimer}
            nextExercise={!isRestTimerActive ? nextExercise : null}
            onSkipToNext={() => {
              // מציאת התרגיל הבא ומעבר אליו | Find and move to next exercise
              const currentExerciseIndex = exercises.findIndex(
                (ex) => ex.id === nextExercise?.id
              );
              if (
                currentExerciseIndex !== -1 &&
                currentExerciseIndex < exercises.length - 1
              ) {
                // גלילה לתרגיל הבא | Scroll to next exercise
                const nextIndex = currentExerciseIndex + 1;
                // TODO: יש להוסיף ref ל-FlatList ולגלול אליו
                // For now, just log the action
                console.log(
                  `Skipping to exercise: ${exercises[nextIndex]?.name}`
                );
              }
            }}
          />
        )}
        <FlatList
          style={styles.listStyle}
          contentContainerStyle={styles.listContent}
          data={exercises}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={null}
          accessible={true}
          accessibilityLabel="רשימת תרגילי האימון"
          accessibilityRole="list"
          renderItem={({ item, index }) => (
            <ExerciseCard
              exercise={item}
              sets={item.sets}
              onUpdateSet={(setId: string, updates: Partial<Set>) => {
                // יצירת העתק עמוק של exercises
                const newExercises = exercises.map((ex) => ({
                  ...ex,
                  sets: ex.sets.map((s) => ({ ...s })),
                }));

                const exerciseIndex = newExercises.findIndex(
                  (ex) => ex.id === item.id
                );
                const setIndex = newExercises[exerciseIndex].sets.findIndex(
                  (s) => s.id === setId
                );
                if (setIndex !== -1) {
                  newExercises[exerciseIndex].sets[setIndex] = {
                    ...newExercises[exerciseIndex].sets[setIndex],
                    ...updates,
                  };
                  setExercises(newExercises);
                }
              }}
              onAddSet={() => {
                const newExercises = [...exercises];
                const exerciseIndex = newExercises.findIndex(
                  (ex) => ex.id === item.id
                );
                const lastSet = item.sets[item.sets.length - 1];
                const newSet = {
                  id: `${item.id}_set_${Date.now()}`,
                  type: "working" as const,
                  targetReps: lastSet?.targetReps || 10,
                  targetWeight: lastSet?.targetWeight || 0,
                  completed: false,
                  isPR: false,
                };
                newExercises[exerciseIndex].sets.push(newSet);
                setExercises(newExercises);
              }}
              onCompleteSet={(setId: string) => {
                // יצירת העתק עמוק של exercises
                const newExercises = exercises.map((ex) => ({
                  ...ex,
                  sets: ex.sets.map((s) => ({ ...s })),
                }));

                const exerciseIndex = newExercises.findIndex(
                  (ex) => ex.id === item.id
                );
                const setIndex = newExercises[exerciseIndex].sets.findIndex(
                  (s) => s.id === setId
                );

                if (setIndex !== -1) {
                  const currentSet = newExercises[exerciseIndex].sets[setIndex];
                  const isCompleting = !currentSet.completed;

                  // אם מסמנים כמושלם ואין ערכים ממשיים, השתמש בערכי המטרה
                  if (
                    isCompleting &&
                    !currentSet.actualReps &&
                    !currentSet.actualWeight
                  ) {
                    currentSet.actualReps = currentSet.targetReps;
                    currentSet.actualWeight = currentSet.targetWeight;
                  }

                  currentSet.completed = isCompleting;
                  setExercises(newExercises);

                  // אם הסט הושלם - התחל טיימר מנוחה אוטומטית
                  if (isCompleting) {
                    const restDuration = 30; // 30 שניות ברירת מחדל
                    startRestTimer(restDuration, item.name);
                  }
                }
              }}
              onRemoveExercise={() => {
                const newExercises = exercises.filter(
                  (ex) => ex.id !== item.id
                );
                setExercises(newExercises);
              }}
              onStartRest={(duration: number) => {
                startRestTimer(duration, item.name);
              }}
              onMoveUp={
                index > 0
                  ? () => {
                      const newExercises = [...exercises];
                      const temp = newExercises[index];
                      newExercises[index] = newExercises[index - 1];
                      newExercises[index - 1] = temp;
                      setExercises(newExercises);
                    }
                  : undefined
              }
              onMoveDown={
                index < exercises.length - 1
                  ? () => {
                      const newExercises = [...exercises];
                      const temp = newExercises[index];
                      newExercises[index] = newExercises[index + 1];
                      newExercises[index + 1] = temp;
                      setExercises(newExercises);
                    }
                  : undefined
              }
              onDuplicate={() => {
                const newExercises = [...exercises];
                const duplicatedExercise = {
                  ...item,
                  id: `${item.id}_copy_${Date.now()}`,
                  sets: item.sets.map((set, setIndex) => ({
                    ...set,
                    id: `${item.id}_copy_${Date.now()}_set_${setIndex}`,
                    completed: false,
                    actualReps: undefined,
                    actualWeight: undefined,
                  })),
                };
                newExercises.splice(index + 1, 0, duplicatedExercise);
                setExercises(newExercises);
              }}
              onDeleteSet={(setId: string) => {
                const newExercises = [...exercises];
                const exerciseIndex = newExercises.findIndex(
                  (ex) => ex.id === item.id
                );
                newExercises[exerciseIndex].sets = newExercises[
                  exerciseIndex
                ].sets.filter((s) => s.id !== setId);
                setExercises(newExercises);
              }}
              onTitlePress={() => {
                // מעבר לתרגיל יחיד במסך ActiveWorkout
                navigation.navigate(
                  "ActiveWorkout" as never,
                  {
                    exercise: item,
                    exerciseIndex: index,
                    totalExercises: exercises.length,
                    workoutData: {
                      name: workoutName,
                      startTime: new Date().toISOString(),
                      exercises: exercises,
                    },
                    onExerciseUpdate: (updatedExercise: Exercise) => {
                      const newExercises = [...exercises];
                      const exerciseIndex = newExercises.findIndex(
                        (ex) => ex.id === updatedExercise.id
                      );
                      if (exerciseIndex !== -1) {
                        newExercises[exerciseIndex] = updatedExercise;
                        setExercises(newExercises);
                      }
                    },
                  } as never
                );
              }}
              isFirst={index === 0}
              isLast={index === exercises.length - 1}
            />
          )}
          ListFooterComponent={
            mode === "single-exercise" ? (
              // כפתורי ניווט במצב תרגיל יחיד
              <View style={styles.singleExerciseNavigation}>
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={() => {
                    if (currentExerciseIndex > 0) {
                      console.log(
                        `🔙 חזרה לתרגיל הקודם: ${currentExerciseIndex - 1}`
                      );
                      // TODO: ניווט לתרגיל הקודם
                    } else {
                      console.log("ℹ️ זה התרגיל הראשון באימון");
                    }
                  }}
                  disabled={currentExerciseIndex <= 0}
                >
                  <Text style={styles.navButtonText}>הקודם</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => {
                    const totalExercises = workoutData?.exercises?.length || 1;
                    if (currentExerciseIndex < totalExercises - 1) {
                      console.log(
                        `🔄 מעבר לתרגיל הבא: ${currentExerciseIndex + 1}/${totalExercises}`
                      );
                      // TODO: ניווט לתרגיל הבא
                    } else {
                      console.log("✅ סיום האימון - כל התרגילים הושלמו");
                      navigation.goBack();
                    }
                  }}
                >
                  <Text style={styles.navButtonText}>
                    {currentExerciseIndex >=
                    (workoutData?.exercises?.length || 1) - 1
                      ? "סיים"
                      : "הבא"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.finishButton}
                onPress={handleFinishWorkout}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="סיים אימון"
                accessibilityHint={`סיים את האימון עם ${stats.completedSets} סטים שהושלמו`}
              >
                <Text style={styles.finishButtonText}>סיים אימון</Text>
              </TouchableOpacity>
            )
          }
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            // הסתרת/הצגת FAB בגלילה - שיפור לוגיקה
            const velocity = event.nativeEvent.velocity?.y || 0;
            const contentOffset = event.nativeEvent.contentOffset.y;

            // הסתר FAB בגלילה מהירה למטה או כשמגיעים לתחתית
            if (velocity > 0.8 || contentOffset > 100) {
              setFabVisible(false);
            } else if (velocity < -0.3 || contentOffset < 50) {
              // הצג FAB בגלילה למעלה או כשקרוב לראש הרשימה
              setFabVisible(true);
            }
          }}
          scrollEventThrottle={16}
        />

        {/* FAB - מוסתר במצבים מסוימים */}
        {!hideAdvancedFeatures && (
          <FloatingActionButton
            visible={fabVisible}
            label={
              fabLabelVisible
                ? mode === "single-exercise"
                  ? "התחל סט"
                  : "התחל עכשיו"
                : undefined
            }
            accessibilityLabel={
              mode === "single-exercise"
                ? "התחל את הסט הבא בתרגיל"
                : "התחל את הסט הבא"
            }
            accessibilityHint={`הקש כדי להתחיל את הסט הבא באימון. ${nextExercise ? `התרגיל הבא: ${nextExercise.name}` : "אין תרגילים נוספים"}`}
            onPress={() => {
              // מצא את הסט הבא שלא הושלם
              const nextSet = exercises
                .flatMap((ex) => ex.sets.map((set) => ({ exercise: ex, set })))
                .find(({ set }) => !set.completed);

              if (nextSet) {
                setNextSetData(nextSet);
                setShowStartSetModal(true);
              }
            }}
          />
        )}
      </KeyboardAvoidingView>

      {/* Dashboard Drawer */}
      <Animated.View
        style={[
          styles.dashboardDrawer,
          {
            transform: [
              {
                translateY: dashboardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-300, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents={dashboardVisible ? "auto" : "none"}
        accessible={dashboardVisible}
        accessibilityLabel="דשבורד אימון"
      >
        <WorkoutDashboard
          totalVolume={stats.totalVolume}
          completedSets={stats.completedSets}
          totalSets={stats.totalSets}
          pace={stats.currentPace}
          personalRecords={calculatePersonalRecords(
            user as UserData | null,
            exercises
          )}
          elapsedTime={formattedTime}
          onHide={toggleDashboard}
        />
      </Animated.View>

      {/* Modals */}
      {modals.plateCalculator && (
        <PlateCalculatorModal
          visible={modals.plateCalculator}
          onClose={() =>
            setModals((prev) => ({ ...prev, plateCalculator: false }))
          }
          currentWeight={modalData.plateCalculatorWeight}
        />
      )}
      {modals.exerciseTips && modalData.selectedExercise && (
        <ExerciseTipsModal
          visible={modals.exerciseTips}
          onClose={() =>
            setModals((prev) => ({ ...prev, exerciseTips: false }))
          }
          exerciseName={modalData.selectedExercise.name}
        />
      )}

      {/* Workout Summary */}
      {showSummary && (
        <WorkoutSummary
          workout={{
            id: `workout-${Date.now()}`,
            name: workoutName,
            startTime: new Date(Date.now() - elapsedTime * 1000).toISOString(),
            duration: elapsedTime,
            exercises: exercises,
            totalVolume: stats.totalVolume,
          }}
          onClose={() => {
            setShowSummary(false);
            navigation.goBack();
          }}
          onSave={() => {
            setShowSummary(false);
            navigation.goBack();
          }}
        />
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        visible={showQuestionnaireModal}
        onClose={() => setShowQuestionnaireModal(false)}
        onConfirm={() => {
          setShowQuestionnaireModal(false);
          navigation.navigate("Questionnaire" as never);
        }}
        title="אימון מותאם אישית"
        message="השלם את השאלון כדי לקבל אימונים מותאמים אישית לפי המטרות והיכולות שלך"
        confirmText="לשאלון"
        cancelText="אחר כך"
        icon="clipboard-outline"
      />

      <ConfirmationModal
        visible={showNoSetsModal}
        onClose={() => setShowNoSetsModal(false)}
        onConfirm={() => setShowNoSetsModal(false)}
        title="אין סטים שהושלמו"
        message="יש להשלים לפחות סט אחד לפני סיום האימון"
        confirmText="בסדר"
        icon="alert-circle-outline"
        iconColor={theme.colors.warning}
      />

      <ConfirmationModal
        visible={showStartSetModal}
        onClose={() => setShowStartSetModal(false)}
        onConfirm={() => {
          setShowStartSetModal(false);
          // מתחיל סט חדש
        }}
        title="התחל סט"
        message={
          nextSetData
            ? `${nextSetData.exercise.name} - ${nextSetData.set.targetReps} חזרות`
            : ""
        }
        confirmText="התחל"
        cancelText="ביטול"
        icon="play-circle-outline"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    textAlign: "center",
    writingDirection: "rtl",
  },
  loadingSubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: "center",
    writingDirection: "rtl",
  },
  listStyle: {
    flex: 1,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 60,
  },
  finishButton: {
    backgroundColor: theme.colors.success,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.success + "30",
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    writingDirection: "rtl",
  },
  dashboardDrawer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.large,
    zIndex: 1000,
  },
  // סגנונות למצב תרגיל יחיד
  singleExerciseNavigation: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  navButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    flex: 1,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  prevButton: {
    backgroundColor: theme.colors.secondary,
  },
  navButtonText: {
    color: theme.colors.card,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
});

// הוספת export default בסוף הקובץ
export default QuickWorkoutScreen;
