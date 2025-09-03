/**
 * @file src/screens/workout/ActiveWorkoutScreen.tsx
 * @brief מסך אימון פעיל - מעקב אחר אימון מלא של יום נבחר
 * @version 3.2.0
 * @author GYMovoo Development Team
 * @modified 2025-08-02
 *
 * @description
 * מסך אימון פעיל המציג את כל התרגילים של האימון הנבחר עם:
 * - מעקב אחר כל הסטים, משקלים וחזרות
 * - טיימר מנוחה ומעקב זמן
 * - סטטיסטיקות אימון כלליות
 * - שמירת התקדמות בזמן אמת
 * - אפשרות להוסיף/למחוק סטים ותרגילים
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
import { UniversalModal } from "../../components/common/UniversalModal";
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
import { useModalManager } from "./hooks/useModalManager";

// Utils
import { calculateWorkoutStats, formatVolume } from "../../utils";
import { calculateAvailableTrainingDays } from "../../utils/mainScreenUtils";

// Types
import { nextWorkoutLogicService } from "../../services/nextWorkoutLogicService";
import { useUserStore } from "../../stores/userStore";
import { logger } from "../../utils/logger";
import { WorkoutExercise } from "./types/workout.types";
import { useAccessibilityAnnouncements } from "../../hooks/useAccessibilityAnnouncements";
import { UniversalButton } from "../../components/ui/UniversalButton";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import AdManager from "../../components/AdManager";

const ActiveWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Accessibility announcements
  const { announceSuccess, announceInfo } = useAccessibilityAnnouncements();

  // סלקטור ממוקד ל-userStore
  const user = useUserStore(useCallback((state) => state.user, []));

  // קבלת פרמטרים מהניווט
  const { workoutData, pendingExercise } =
    (route.params as {
      workoutData?: {
        name?: string;
        dayName?: string;
        startTime?: string;
        exercises?: WorkoutExercise[];
      };
      pendingExercise?: {
        id: string;
        name: string;
        muscleGroup?: string;
        equipment?: string;
      };
    }) || {};

  // Development Debug
  useEffect(() => {
    if (__DEV__) {
      logger.debug(
        "ActiveWorkoutScreen",
        `Loaded: ${workoutData?.name} (${workoutData?.exercises?.length || 0} exercises)`
      );
    }
  }, [workoutData]);

  // Custom Hooks for State Management
  const exerciseManager = useExerciseManager({
    initialExercises: workoutData?.exercises,
    pendingExercise,
  });

  const { activeModal, modalConfig, showError, hideModal, showConfirm } =
    useModalManager();

  // Simple ad state management
  const [showStartAd, setShowStartAd] = useState(true);
  const [showEndAd, setShowEndAd] = useState(false);

  // Ad convenience functions
  const hideStartAd = () => setShowStartAd(false);
  const hideEndAd = () => setShowEndAd(false);
  const showEndAdForCompletion = useCallback(() => setShowEndAd(true), []);

  // Extract exercises from the manager
  const { exercises } = exerciseManager;

  // סטטיסטיקות האימון המלא
  const workoutStats = useMemo(() => {
    const stats = calculateWorkoutStats(exercises);
    if (__DEV__) {
      logger.debug(
        "ActiveWorkoutScreen",
        `Stats: ${stats.completedExercises}/${stats.totalExercises} exercises, ${stats.completedSets}/${stats.totalSets} sets`
      );
    }
    return stats;
  }, [exercises]);

  // טיימרים
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
      skipRestTimer();
    };
  }, [startTimer, pauseTimer, skipRestTimer]);

  // הפקת תוכנית שבועית לזיהוי אינדקס האימון
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

    // שליפת תדירות
    const days = calculateAvailableTrainingDays(user);

    return WORKOUT_DAYS_MAP[days] || WORKOUT_DAYS_MAP[3];
  }, [user]);

  const workoutIndexInPlan = useMemo(() => {
    const name = workoutData?.name?.trim();
    if (!name) return 0;
    const idx = weeklyPlan.findIndex((n) => n === name);
    return idx >= 0 ? idx : 0;
  }, [weeklyPlan, workoutData?.name]);

  // מחיקת סט מתרגיל
  const handleDeleteSet = useCallback(
    (exerciseId: string, setId: string) => {
      const exercise = exercises.find((ex) => ex.id === exerciseId);
      if (exercise && (exercise.sets || []).length <= 1) {
        showError("שגיאה", "חייב להיות לפחות סט אחד בתרגיל");
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
      showError("שגיאה", errorMsg);
      return;
    }

    // הצגת פרסומת סיום למשתמשי Free
    showEndAdForCompletion();

    announceInfo("פותח חלון סיום אימון");
    showConfirm(
      "סיום אימון",
      `האם ברצונך לסיים את האימון?\n\nסטטיסטיקות:\n• ${workoutStats.completedExercises}/${workoutStats.totalExercises} תרגילים הושלמו\n• ${workoutStats.completedSets}/${workoutStats.totalSets} סטים הושלמו\n• ${workoutStats.totalVolume} ק"ג נפח כללי`,
      async () => {
        hideModal();
        // עדכון מחזור האימונים
        await nextWorkoutLogicService.updateWorkoutCompleted(
          workoutIndexInPlan,
          workoutData?.name || "אימון"
        );
      },
      true // destructive
    );
  }, [
    hasCompletedExercises,
    showError,
    showEndAdForCompletion,
    announceInfo,
    showConfirm,
    hideModal,
    workoutStats.completedExercises,
    workoutStats.totalExercises,
    workoutStats.completedSets,
    workoutStats.totalSets,
    workoutStats.totalVolume,
    workoutIndexInPlan,
    workoutData?.name,
  ]);

  // הוספת תרגיל חדש לאימון הפעיל
  const handleAddExercise = useCallback(() => {
    announceInfo("עובר לבחירת תרגיל חדש");
    navigation.navigate("ExerciseList", {
      fromScreen: "ActiveWorkout",
      mode: "selection",
      onSelectExercise: (selectedExercise: WorkoutExercise) => {
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

        {/* Workout Stats */}
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
                showConfirm(
                  "מחיקת תרגיל",
                  "האם אתה בטוח שברצונך למחוק את התרגיל?",
                  () => {
                    exerciseManager.handleRemoveExercise(exerciseId);
                    hideModal();
                  },
                  true // destructive
                );
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

        {/* Universal Modal for all modals */}
        <UniversalModal
          visible={activeModal !== null}
          type={activeModal || "error"}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={hideModal}
          onConfirm={modalConfig.onConfirm}
          onCancel={modalConfig.onCancel}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          destructive={modalConfig.destructive}
        />

        {/* Ad Manager - פרסומות למשתמשי Free */}
        <AdManager
          placement="workout-start"
          visible={showStartAd}
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
  // סטיילים לכפתורי ההדר
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
