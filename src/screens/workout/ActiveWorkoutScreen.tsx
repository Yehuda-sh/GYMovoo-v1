/**
 * @file src/screens/workout/ActiveWorkoutScreen.tsx
 * @brief מסך אימון פעיל - מעקב אחר אימון מלא של יום נבחר
 * @version 3.2.0
 * @author GYMovoo Development Team
   // Debug exercises state changes
  useEffect(() => {
    if (__DEV__) {
      console.warn("📊 ActiveWorkoutScreen - exercises state changed:", {
        exercisesCount: exercises.length,
        exercises: exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          setsCount: ex.sets?.length || 0
        }))
      });
    }
  }, [exercises]);

  // Debug workout stats changes
  useEffect(() => {
    if (__DEV__) {
      console.warn("📈 ActiveWorkoutScreen - workoutStats changed:", {
        totalExercises: workoutStats.totalExercises,
        completedExercises: workoutStats.completedExercises,
        totalSets: workoutStats.totalSets,
        completedSets: workoutStats.completedSets,
        progressPercentage: workoutStats.progressPercentage,
        displayText: `${workoutStats.completedExercises}/${workoutStats.totalExercises} תרגילים • ${workoutStats.progressPercentage}% הושלם`
      });
    }
  }, [workoutStats]);2024-12-15
 * @modified 2025-08-02
 *
 * @description
 * מסך אימון פעיל מלא המציג את כל התרגילים של האימון הנבחר עם:
 * - הצגת כל התרגילים של האימון בפריסה אחת
 * - מעקב אחר כל הסטים, משקלים וחזרות בכל תרגיל
 * - טיימר מנוחה אוטומטי לכל תרגיל
 * - מעקב התקדמות כללי של האימון (נפח, זמן, חזרות)
 * - שמירת כל הנתונים בזמן אמת
 * - אפשרות להוסיף/למחוק סטים ותרגילים
 * - 🆕 הזזת סטים בתוך תרגיל (drag & drop) במצב עריכה
 *
 * @features
 * - ✅ הצגת אימון מלא עם כל התרגילים
 * - ✅ מעקב אחר כל התרגילים, סטים ומשקלים
 * - ✅ טיימר מנוחה אוטומטי לכל תרגיל
 * - ✅ סטטיסטיקות אימון כלליות (נפח, זמן, חזרות, התקדמות)
 * - ✅ שמירת התקדמות בזמן אמת
 * - ✅ מצב אימון פעיל עם כל הפקדים
 * - ✅ גלילה חלקה בין תרגילים
 * - 🆕 onReorderSets - הזזת סטים במצב עריכה עם חצי מעלית (v3.2.0)
 *
 * @props
 * - workoutData: נתוני האימון המלא
 * - dayName: שם היום (חזה + טריצפס, גב + ביצפס וכו')
 * - exercises: רשימת כל התרגילים באימון
 *
 * @navigation
 * route.params: {
 *   workoutData: {
 *     name: string,
 *     dayName: string,
 *     exercises: Exercise[],
 *     startTime?: string
 *   }
 * }
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { triggerVibration } from "../../utils/workoutHelpers";
import BackButton from "../../components/common/BackButton";
import ConfirmationModal from "../../components/common/ConfirmationModal";

// Components
import ExercisesList from "./components/ExercisesList";
import { FloatingActionButton } from "../../components";

// Lazy Components for performance
const WorkoutStatusBar = React.lazy(
  () => import("./components/WorkoutStatusBar")
);

// Hooks & Services
import { useRestTimer } from "./hooks/useRestTimer";
import { useWorkoutTimer } from "./hooks/useWorkoutTimer";

// Utils
import {
  calculateWorkoutStats,
  formatVolume,
  workoutLogger,
} from "../../utils";

// Types
import { Exercise, Set } from "./types/workout.types";
import { nextWorkoutLogicService } from "../../services/nextWorkoutLogicService";
import { useUserStore } from "../../stores/userStore";
import { logger } from "../../utils/logger";
import { errorHandler } from "../../utils/errorHandler";
import { useAccessibilityAnnouncements } from "../../hooks/useAccessibilityAnnouncements";
import { UniversalButton } from "../../components/ui/UniversalButton";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";

const ActiveWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Accessibility announcements
  const { announceSuccess, announceInfo, announceError } =
    useAccessibilityAnnouncements();

  // סלקטור ממוקד ל-userStore - אופטימיזציה לביצועים
  const user = useUserStore(useCallback((state) => state.user, []));

  // קבלת פרמטרים מהניווט - עכשיו מקבלים אימון מלא
  const { workoutData, pendingExercise } =
    (route.params as {
      workoutData?: {
        name?: string;
        dayName?: string;
        startTime?: string;
        exercises?: Exercise[];
      };
      pendingExercise?: {
        id: string;
        name: string;
        muscleGroup?: string;
        equipment?: string;
      };
    }) || {};

  // Debug logging - מותנה בפיתוח
  useEffect(() => {
    if (__DEV__) {
      logger.debug("ActiveWorkoutScreen", "נטענו נתוני אימון", {
        workoutName: workoutData?.name,
        dayName: workoutData?.dayName,
        startTime: workoutData?.startTime,
        exerciseCount: workoutData?.exercises?.length || 0,
        exercises:
          workoutData?.exercises?.map((ex) => ({
            id: ex.id,
            name: ex.name,
            setsCount: ex.sets?.length || 0,
          })) || [],
        rawWorkoutData: workoutData,
      });
    }

    workoutLogger.info("נטענו נתוני אימון", {
      workoutName: workoutData?.name,
      exerciseCount: workoutData?.exercises?.length || 0,
      exercises: workoutData?.exercises?.map((ex) => ex.name) || [],
    });
  }, [workoutData]);

  // סטייט לכל התרגילים באימון
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const base = workoutData?.exercises || [];
    if (__DEV__) {
      logger.debug("ActiveWorkoutScreen", "הגדרת exercises state", {
        baseExercisesCount: base.length,
        baseExercises: base.map((ex) => ({
          id: ex.id,
          name: ex.name,
          hasSets: !!(ex.sets && ex.sets.length > 0),
          setsCount: ex.sets?.length || 0,
        })),
        hasPendingExercise: !!pendingExercise,
      });
    }

    // המרת תרגילי הבסיס לתרגילים עם סטים
    const baseExercisesWithSets: Exercise[] = base.map((ex) => {
      // בדיקה אם התרגיל כבר יש לו sets תקינים
      if (ex.sets && ex.sets.length > 0) {
        return ex as Exercise;
      }

      // אחרת, צור סטים בסיסיים (ברירת מחדל 2 סטים)
      const defaultSets = Array.from({ length: 2 }, (_, index) => ({
        id: `${ex.id}_set_${index + 1}_${Date.now()}`,
        type: "working" as const,
        targetReps: 10,
        targetWeight: 0,
        completed: false,
        isPR: false,
      }));

      return {
        id: ex.id,
        name: ex.name,
        category: ex.category || "כללי",
        primaryMuscles: ex.primaryMuscles || ["כללי"],
        equipment: ex.equipment || "bodyweight",
        restTime: ex.restTime || 60,
        sets: defaultSets,
      } as Exercise;
    });

    if (pendingExercise) {
      // צור תרגיל עם סט התחלתי בסיסי
      const newExercise: Exercise = {
        id: `${pendingExercise.id}_${Date.now()}`,
        name: pendingExercise.name,
        category: "כללי", // Default category since not provided in pendingExercise
        primaryMuscles: pendingExercise.muscleGroup
          ? [pendingExercise.muscleGroup]
          : ["כללי"],
        equipment: pendingExercise.equipment || "bodyweight",
        restTime: 60,
        sets: [
          {
            id: `${pendingExercise.id}_set_${Date.now()}`,
            type: "working",
            targetReps: 10,
            targetWeight: 0,
            completed: false,
            isPR: false,
          },
        ],
      };
      return [...baseExercisesWithSets, newExercise];
    }
    return baseExercisesWithSets;
  });

  // Debug exercises state changes
  useEffect(() => {
    if (__DEV__) {
      logger.debug("ActiveWorkoutScreen", "exercises state changed", {
        exercisesCount: exercises.length,
        exercises: exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          setsCount: ex.sets?.length || 0,
          firstSetId: ex.sets?.[0]?.id || "no sets",
        })),
      });
    }
  }, [exercises]);

  // Modal states
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteExerciseId, setDeleteExerciseId] = useState<string | null>(null);

  // סטטיסטיקות האימון המלא - אופטימיזציה עם יוטיליטי
  const workoutStats = useMemo(() => {
    const stats = calculateWorkoutStats(exercises);
    if (__DEV__) {
      logger.debug("ActiveWorkoutScreen", "workout stats calculated", {
        totalExercises: stats.totalExercises,
        completedExercises: stats.completedExercises,
        totalSets: stats.totalSets,
        completedSets: stats.completedSets,
        progressPercentage: stats.progressPercentage,
        exercisesArray: exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          setsCount: ex.sets?.length || 0,
          completedSetsInExercise:
            ex.sets?.filter((s) => s.completed).length || 0,
        })),
      });
    }
    return stats;
  }, [exercises]);

  // טיימרים - workoutId יציב לאורך חיי הקומפוננט
  const workoutId = useMemo(() => {
    const timestamp = workoutData?.startTime || Date.now();
    return `active-workout-${timestamp}`;
  }, [workoutData?.startTime]);
  const { formattedTime, isRunning, startTimer, pauseTimer } =
    useWorkoutTimer(workoutId);
  const {
    isRestTimerActive,
    restTimeRemaining,
    startRestTimer,
    skipRestTimer,
    addRestTime,
    subtractRestTime,
  } = useRestTimer();

  // התחלת טיימר אוטומטית
  useEffect(() => {
    startTimer();
    return () => {
      pauseTimer();
      // קריאה בטוחה: אם אין טיימר מנוחה פעיל, הפונקציה תתעלם
      skipRestTimer();
    };
  }, [startTimer, pauseTimer, skipRestTimer]);

  // הפקת תוכנית שבועית לזיהוי אינדקס האימון - אופטימיזציה בסיסית
  const weeklyPlan = useMemo(() => {
    const WORKOUT_DAYS_MAP: Record<number, string[]> = {
      1: ["אימון מלא"],
      2: ["פלג גוף עליון", "פלג גוף תחתון"],
      3: ["דחיפה", "משיכה", "רגליים"],
      4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
      5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
      6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
      7: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן", "קרדיו קל"],
    };

    // שליפת תדירות מהירה ופשוטה
    let days = 3; // ברירת מחדל

    // בדיקה מהירה - נתונים חכמים
    const smart = user?.smartquestionnairedata?.answers?.availability;
    if (smart) {
      const raw = Array.isArray(smart) ? String(smart[0]) : String(smart);
      const quickMap: Record<string, number> = {
        "2_days": 2,
        "3_days": 3,
        "4_days": 4,
        "5_days": 5,
        "6_plus_days": 6,
      };
      if (quickMap[raw]) days = quickMap[raw];
    }

    // fallback לנתוני stats אם אין נתונים חכמים
    else if (user?.trainingstats?.preferredWorkoutDays) {
      days = Math.min(
        7,
        Math.max(1, Number(user.trainingstats.preferredWorkoutDays))
      );
    }

    return WORKOUT_DAYS_MAP[days] || WORKOUT_DAYS_MAP[3];
  }, [
    user?.smartquestionnairedata?.answers?.availability,
    user?.trainingstats?.preferredWorkoutDays,
  ]);

  const workoutIndexInPlan = useMemo(() => {
    const name = workoutData?.name?.trim();
    if (!name) return 0;
    const idx = weeklyPlan.findIndex((n) => n === name);
    return idx >= 0 ? idx : 0;
  }, [weeklyPlan, workoutData?.name]);

  // עדכון סט בתרגיל - אופטימיזציה עם לוגר
  const handleUpdateSet = useCallback(
    (exerciseId: string, setId: string, updates: Partial<Set>) => {
      workoutLogger.setCompleted(exerciseId, setId, updates);

      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: (exercise.sets || []).map((set: Set) => {
                if (set.id === setId) {
                  return { ...set, ...updates };
                }
                return set;
              }),
            };
          }
          return exercise;
        })
      );
    },
    []
  );

  // השלמת סט
  const handleCompleteSet = useCallback(
    (exerciseId: string, setId: string) => {
      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            const newExercise = {
              ...exercise,
              sets: (exercise.sets || []).map((set: Set) => {
                if (set.id === setId) {
                  const isCompleting = !set.completed;

                  // אם מסמנים כמושלם ואין ערכים ממשיים, השתמש בערכי המטרה
                  if (isCompleting && !set.actualReps && !set.actualWeight) {
                    return {
                      ...set,
                      completed: isCompleting,
                      actualReps: set.targetReps,
                      actualWeight: set.targetWeight,
                    };
                  }

                  return { ...set, completed: isCompleting };
                }
                return set;
              }),
            };

            // הודעת נגישות
            const completedSet = newExercise.sets.find(
              (s: Set) => s.id === setId
            );
            if (completedSet?.completed) {
              announceSuccess(`סט הושלם בתרגיל ${exercise.name}`);
              const restDuration = exercise.restTime || 60;
              startRestTimer(restDuration, exercise.name);
            } else {
              announceInfo(`סט בוטל בתרגיל ${exercise.name}`);
            }

            return newExercise;
          }
          return exercise;
        })
      );
    },
    [startRestTimer, announceSuccess, announceInfo]
  );

  // הוספת סט לתרגיל
  const handleAddSet = useCallback(
    (exerciseId: string) => {
      const exercise = exercises.find((ex) => ex.id === exerciseId);
      const exerciseName = exercise?.name || "תרגיל";

      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            const sets = exercise.sets || [];
            const lastSet = sets.length > 0 ? sets[sets.length - 1] : null;
            const newSet: Set = {
              id: `${exercise.id}_set_${Date.now()}`,
              type: "working",
              targetReps: lastSet?.targetReps || 10,
              targetWeight: lastSet?.targetWeight || 0,
              completed: false,
              isPR: false,
            };

            return {
              ...exercise,
              sets: [...(exercise.sets || []), newSet],
            };
          }
          return exercise;
        })
      );

      announceInfo(`סט חדש נוסף לתרגיל ${exerciseName}`);
    },
    [exercises, announceInfo]
  );

  // מחיקת סט מתרגיל - בדיקת שגיאות מיועלת
  const handleDeleteSet = useCallback(
    (exerciseId: string, setId: string) => {
      const exercise = exercises.find((ex) => ex.id === exerciseId);
      if (exercise && (exercise.sets || []).length <= 1) {
        setErrorMessage("חייב להיות לפחות סט אחד בתרגיל");
        setShowErrorModal(true);
        return;
      }

      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: (exercise.sets || []).filter(
                (set: Set) => set.id !== setId
              ),
            };
          }
          return exercise;
        })
      );
    },
    [exercises]
  );

  // הזזת סטים בתוך תרגיל - אופטימיזציה עם לוגר
  const handleReorderSets = useCallback(
    (exerciseId: string, fromIndex: number, toIndex: number) => {
      workoutLogger.reorderSets(exerciseId, fromIndex, toIndex);

      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            const newSets = [...(exercise.sets || [])];
            const [movedSet] = newSets.splice(fromIndex, 1);
            newSets.splice(toIndex, 0, movedSet);

            return {
              ...exercise,
              sets: newSets,
            };
          }
          return exercise;
        })
      );
    },
    []
  );

  // סיום האימון המלא - בדיקה מותנית ביצועים
  const hasCompletedExercises = useMemo(
    () => workoutStats.completedExercises > 0,
    [workoutStats.completedExercises]
  );

  const handleFinishWorkout = useCallback(() => {
    if (!hasCompletedExercises) {
      const errorMsg = "יש להשלים לפחות תרגיל אחד לפני סיום האימון";
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
      announceError(errorMsg);
      return;
    }

    announceInfo("פותח חלון סיום אימון");
    setShowExitModal(true);
  }, [hasCompletedExercises, announceError, announceInfo]);

  // הוספת תרגיל חדש לאימון הפעיל
  const handleAddExercise = useCallback(() => {
    announceInfo("עובר לבחירת תרגיל חדש");
    navigation.navigate("ExerciseList", {
      fromScreen: "ActiveWorkout",
      mode: "selection",
      onSelectExercise: (selectedExercise: Exercise) => {
        // הוסף את התרגיל החדש לרשימת התרגילים
        const newExercise: Exercise = {
          ...selectedExercise,
          id: `${selectedExercise.id}_${Date.now()}`, // ID יחודי
          sets: [
            {
              id: `${selectedExercise.id}_set_${Date.now()}`,
              type: "working",
              targetReps: 10,
              targetWeight: 0,
              completed: false,
              isPR: false,
            },
          ],
        };

        setExercises((prev) => [...prev, newExercise]);
        announceSuccess(`תרגיל ${selectedExercise.name} נוסף לאימון`);

        // חזור למסך האימון הפעיל
        navigation.goBack();
      },
    });
  }, [navigation, announceInfo, announceSuccess]);

  if (exercises.length === 0) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <BackButton />
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={80}
          color={theme.colors.error}
        />
        <Text style={styles.errorText}>לא נמצאו תרגילים באימון</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton absolute={false} variant="minimal" />

          <View style={styles.headerInfo}>
            <Text style={styles.exerciseTitle} accessibilityRole="header">
              {workoutData?.name || "אימון פעיל"}
            </Text>
            <Text style={styles.progressText}>
              {workoutStats.completedExercises}/{workoutStats.totalExercises}{" "}
              תרגילים • {workoutStats.progressPercentage}% הושלם
            </Text>
            <Text
              style={styles.timeText}
              accessibilityLabel={`זמן אימון ${formattedTime}`}
            >
              {formattedTime}
            </Text>
          </View>

          <View style={styles.headerActions}>
            {/* כפתור הפסקה/המשכה עם טקסט */}
            <UniversalButton
              style={[styles.headerButton, styles.timerButton]}
              onPress={() => (isRunning ? pauseTimer() : startTimer())}
              variant="outline"
              size="small"
              title={isRunning ? "השהה" : "המשך"}
              icon={isRunning ? "pause" : "play"}
              accessibilityLabel={isRunning ? "עצור טיימר" : "התחל טיימר"}
              accessibilityHint={
                isRunning ? "עוצר את טיימר האימון" : "מתחיל את טיימר האימון"
              }
              testID="btn-toggle-timer"
            />

            {/* כפתור סיים אימון עם טקסט */}
            <UniversalButton
              style={[styles.headerButton, styles.finishButtonSmall]}
              onPress={handleFinishWorkout}
              variant="primary"
              size="small"
              title="סיים"
              icon="checkmark"
              accessibilityLabel="סיים אימון"
              accessibilityHint="פתח חלון אישור לסיום האימון"
              testID="btn-finish-header"
            />
          </View>
        </View>

        {/* Status Bar - Rest Timer */}
        <Suspense fallback={null}>
          <WorkoutStatusBar
            isRestActive={isRestTimerActive}
            restTimeLeft={restTimeRemaining}
            onAddRestTime={addRestTime}
            onSubtractRestTime={subtractRestTime}
            onSkipRest={skipRestTimer}
            nextExercise={null}
            onSkipToNext={() => {}}
          />
        </Suspense>

        {/* Workout Stats - פורמט משופר עם אייקונים */}
        <View style={styles.statsContainer}>
          <View style={styles.statItemWithBorder}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={24}
              color={theme.colors.primary}
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>{workoutStats.completedSets}</Text>
            <Text style={styles.statLabel}>סטים הושלמו</Text>
          </View>
          <View style={styles.statItemWithBorder}>
            <MaterialCommunityIcons
              name="weight-kilogram"
              size={24}
              color={theme.colors.warning}
              style={styles.statIcon}
            />
            <Text style={[styles.statValue, styles.statValueWarning]}>
              {formatVolume(workoutStats.totalVolume)}
            </Text>
            <Text style={styles.statLabel}>נפח (ק"ג)</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="repeat"
              size={24}
              color={theme.colors.success}
              style={styles.statIcon}
            />
            <Text style={[styles.statValue, styles.statValueSuccess]}>
              {workoutStats.totalReps}
            </Text>
            <Text style={styles.statLabel}>חזרות</Text>
          </View>
        </View>

        {/* All Exercises List */}
        {exercises.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>
              🏋️ תרגילי האימון ({exercises.length})
            </Text>
            <ExercisesList
              exercises={exercises}
              onUpdateSet={handleUpdateSet}
              onAddSet={handleAddSet}
              onCompleteSet={handleCompleteSet}
              onDeleteSet={handleDeleteSet}
              onReorderSets={handleReorderSets}
              onRemoveExercise={(exerciseId: string) => {
                setDeleteExerciseId(exerciseId);
                setShowDeleteModal(true);
              }}
              onStartRest={startRestTimer}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>אין תרגילים באימון</Text>
          </View>
        )}

        {/* Finish Workout Button */}
        <View style={styles.navigationContainer}>
          <UniversalButton
            title="סיים אימון ✓"
            onPress={() => {
              // אנימציית לחיצה
              if (Platform.OS === "ios") {
                triggerVibration("medium");
              }
              handleFinishWorkout();
            }}
            variant="primary"
            size="large"
            accessibilityLabel="סיים אימון"
            accessibilityHint="פתח חלון אישור לסיום האימון"
            testID="btn-finish-workout"
            style={styles.finishWorkoutButton}
          />
        </View>

        {/* FloatingActionButton להוספת תרגילים */}
        <FloatingActionButton
          onPress={handleAddExercise}
          icon="add"
          label="הוסף תרגיל"
          visible={true}
          bottom={120} // מעל הכפתור סיים אימון
          size="medium"
          accessibilityLabel="הוסף תרגיל חדש לאימון"
          accessibilityHint="לחץ כדי לבחור תרגיל חדש להוספה לאימון הנוכחי"
        />

        {/* Error Modal */}
        <ConfirmationModal
          visible={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          onConfirm={() => setShowErrorModal(false)}
          title="שגיאה"
          message={errorMessage}
          variant="error"
          singleButton={true}
          confirmText="הבנתי"
        />

        {/* Exit Confirmation Modal */}
        <ConfirmationModal
          visible={showExitModal}
          onClose={() => setShowExitModal(false)}
          onConfirm={async () => {
            try {
              setShowExitModal(false);
              // עדכון מחזור האימונים בשירות
              await nextWorkoutLogicService.updateWorkoutCompleted(
                workoutIndexInPlan,
                workoutData?.name || "אימון"
              );
            } catch (error) {
              logger.error("ActiveWorkout", "שגיאה בעדכון השלמת אימון", error);
              errorHandler.reportError(error, {
                source: "ActiveWorkoutScreen.completeWorkout",
              });
              // המשך ליציאה גם אם יש שגיאה בעדכון הרשומה
            } finally {
              navigation.goBack();
            }
          }}
          onCancel={() => setShowExitModal(false)}
          title="סיום אימון"
          message={`האם ברצונך לסיים את האימון?\n\nסטטיסטיקות:\n• ${workoutStats.completedExercises}/${workoutStats.totalExercises} תרגילים הושלמו\n• ${workoutStats.completedSets}/${workoutStats.totalSets} סטים הושלמו\n• ${workoutStats.totalVolume} ק"ג נפח כללי`}
          confirmText="סיים אימון"
          cancelText="המשך באימון"
          destructive={true}
          icon="fitness"
        />

        {/* Delete Exercise Modal */}
        <ConfirmationModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            if (deleteExerciseId) {
              setExercises((prev) =>
                prev.filter((ex) => ex.id !== deleteExerciseId)
              );
              setDeleteExerciseId(null);
            }
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
          title="מחיקת תרגיל"
          message="האם אתה בטוח שברצונך למחוק את התרגיל?"
          confirmText="מחק"
          cancelText="ביטול"
          destructive={true}
          icon="trash"
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    textAlign: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.small,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: theme.spacing.md,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl",
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },
  timeText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
    textAlign: "center",
    marginTop: theme.spacing.xs,
    writingDirection: "rtl",
  },
  // 🆕 סטיילים משופרים לכפתורי ההדר
  headerActions: {
    flexDirection: "row-reverse",
    gap: theme.spacing.sm,
    alignItems: "center",
  },

  // סטייל משותף לכפתורי הדר
  headerButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    minWidth: 70,
    justifyContent: "center",
    borderWidth: 1,
  },

  timerButton: {
    backgroundColor: theme.colors.primary + "20",
    borderColor: theme.colors.primary + "30",
    minWidth: 80,
  },

  finishButtonSmall: {
    backgroundColor: theme.colors.success + "20",
    borderColor: theme.colors.success + "30",
  },

  statsContainer: {
    flexDirection: "row-reverse",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    ...theme.shadows.medium,
    // שיפור עיצוב נוסף
    borderWidth: 1,
    borderColor: theme.colors.cardBorder + "20",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  statItemWithBorder: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border + "30",
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValueWarning: {
    color: theme.colors.warning,
  },
  statValueSuccess: {
    color: theme.colors.success,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
    writingDirection: "rtl",
    fontWeight: "500",
  },
  navigationContainer: {
    flexDirection: "row-reverse",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.lg,
    // שיפור עיצוב נוסף
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  finishWorkoutButton: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    // שיפור עיצוב נוסף
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 56,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
});

export default ActiveWorkoutScreen;
