/**
 * @file src/screens/workout/ActiveWorkoutScreen.tsx
 * @brief מסך אימון פעיל - מעקב אחר אימון מלא של יום נבחר
 * @version 3.2.0
 * @author GYMovoo Development Team
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
import EmptyState from "../../components/common/EmptyState";

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
import { useExerciseManager } from "./hooks/useExerciseManager";
import { useWorkoutModals } from "./hooks/useWorkoutModals";
import { useWorkoutAds } from "./hooks/useWorkoutAds";

// Utils
import {
  calculateWorkoutStats,
  formatVolume,
  workoutLogger,
} from "../../utils";
import { calculateAvailableTrainingDays } from "../../utils/mainScreenUtils";

// Types
import { Exercise, Set } from "./types/workout.types";
import { nextWorkoutLogicService } from "../../services/nextWorkoutLogicService";
import { useUserStore } from "../../stores/userStore";
import { logger } from "../../utils/logger";
import { errorHandler } from "../../utils/errorHandler";
import { useAccessibilityAnnouncements } from "../../hooks/useAccessibilityAnnouncements";
import { UniversalButton } from "../../components/ui/UniversalButton";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import AdManager from "../../components/AdManager";

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

  // 🎯 Development Debug Hooks (only in __DEV__ mode)
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

  // 🎯 Custom Hooks for State Management
  const exerciseManager = useExerciseManager({
    initialExercises: workoutData?.exercises,
    pendingExercise,
  });

  const {
    showErrorModal,
    showExitModal,
    showDeleteModal,
    errorMessage,
    deleteExerciseId,
    showError,
    showExitConfirmation,
    showDeleteConfirmation,
    hideAllModals,
  } = useWorkoutModals();

  const {
    showStartAd,
    showEndAd,
    workoutStarted,
    startWorkout,
    showEndAdForCompletion,
    hideStartAd,
    hideEndAd,
  } = useWorkoutAds();

  // Extract exercises from the manager
  const { exercises, setExercises } = exerciseManager;

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

  // טיפול בפרסומת התחלה
  useEffect(() => {
    if (!workoutStarted) {
      startWorkout();
    }
  }, [workoutStarted, startWorkout]);

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
    const days = calculateAvailableTrainingDays(user);

    return WORKOUT_DAYS_MAP[days] || WORKOUT_DAYS_MAP[3];
  }, [user]);

  const workoutIndexInPlan = useMemo(() => {
    const name = workoutData?.name?.trim();
    if (!name) return 0;
    const idx = weeklyPlan.findIndex((n) => n === name);
    return idx >= 0 ? idx : 0;
  }, [weeklyPlan, workoutData?.name]);

  // מחיקת סט מתרגיל - בדיקת שגיאות מיועלת
  const handleDeleteSet = useCallback(
    (exerciseId: string, setId: string) => {
      const exercise = exercises.find((ex) => ex.id === exerciseId);
      if (exercise && (exercise.sets || []).length <= 1) {
        showError("חייב להיות לפחות סט אחד בתרגיל");
        return;
      }

      exerciseManager.handleDeleteSet(exerciseId, setId);
    },
    [exercises, showError, exerciseManager]
  );

  // סיום האימון המלא - בדיקה מותנית ביצועים
  const hasCompletedExercises = useMemo(
    () => workoutStats.completedExercises > 0,
    [workoutStats.completedExercises]
  );

  const handleFinishWorkout = useCallback(() => {
    if (!hasCompletedExercises) {
      const errorMsg = "יש להשלים לפחות תרגיל אחד לפני סיום האימון";
      showError(errorMsg);
      return;
    }

    // הצגת פרסומת סיום למשתמשי Free
    showEndAdForCompletion();

    announceInfo("פותח חלון סיום אימון");
    showExitConfirmation();
  }, [
    hasCompletedExercises,
    showError,
    showEndAdForCompletion,
    announceInfo,
    showExitConfirmation,
  ]);

  // הוספת תרגיל חדש לאימון הפעיל
  const handleAddExercise = useCallback(() => {
    announceInfo("עובר לבחירת תרגיל חדש");
    navigation.navigate("ExerciseList", {
      fromScreen: "ActiveWorkout",
      mode: "selection",
      onSelectExercise: (selectedExercise: Exercise) => {
        // הוסף את התרגיל החדש לרשימת התרגילים
        exerciseManager.handleAddExercise(selectedExercise);
        announceSuccess(`תרגיל ${selectedExercise.name} נוסף לאימון`);

        // חזור למסך האימון הפעיל
        navigation.goBack();
      },
    });
  }, [navigation, announceInfo, announceSuccess, exerciseManager]);

  if (exercises.length === 0) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <BackButton haptic={true} hapticType="medium" />
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
              onUpdateSet={exerciseManager.handleUpdateSet}
              onAddSet={exerciseManager.handleAddSet}
              onCompleteSet={exerciseManager.handleCompleteSet}
              onDeleteSet={handleDeleteSet}
              onReorderSets={exerciseManager.handleReorderSets}
              onRemoveExercise={(exerciseId: string) => {
                showDeleteConfirmation(exerciseId);
              }}
              onStartRest={startRestTimer}
            />
          </>
        ) : (
          <EmptyState
            icon="barbell-outline"
            title="אין תרגילים באימון"
            variant="compact"
            testID="active-workout-empty-state"
          />
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
          onClose={hideAllModals}
          onConfirm={hideAllModals}
          title="שגיאה"
          message={errorMessage}
          variant="error"
          singleButton={true}
          confirmText="הבנתי"
        />

        {/* Exit Confirmation Modal */}
        <ConfirmationModal
          visible={showExitModal}
          onClose={hideAllModals}
          onConfirm={async () => {
            hideAllModals();
            // עדכון מחזור האימונים בשירות
            await nextWorkoutLogicService.updateWorkoutCompleted(
              workoutIndexInPlan,
              workoutData?.name || "אימון"
            );
          }}
          onCancel={hideAllModals}
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
          onClose={hideAllModals}
          onConfirm={() => {
            if (deleteExerciseId) {
              exerciseManager.handleRemoveExercise(deleteExerciseId);
            }
            hideAllModals();
          }}
          onCancel={hideAllModals}
          title="מחיקת תרגיל"
          message="האם אתה בטוח שברצונך למחוק את התרגיל?"
          confirmText="מחק"
          cancelText="ביטול"
          destructive={true}
          icon="trash"
        />

        {/* Ad Manager - פרסומות למשתמשי Free */}
        <AdManager
          placement="workout-start"
          visible={showStartAd && workoutStarted}
          onAdClosed={hideStartAd}
        />

        <AdManager
          placement="workout-end"
          visible={showEndAd}
          onAdClosed={hideEndAd}
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
