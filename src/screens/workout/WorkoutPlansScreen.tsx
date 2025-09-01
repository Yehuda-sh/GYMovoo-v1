/**
 * @file src/screens/workout/WorkoutPlansScreen.tsx
 * @brief Enhanced Workout Plans Screen - מסך תוכניות אימון משופר (גרסה מאוחדת)
 * @description Unified architecture for workout plans management, including:
 *              - Modular components with custom hooks
 *              - Centralized services with error handling
 *              - Performance tracking and optimization
 *              - AI and basic plan support with subscription management
 * @dependencies React Native, Custom Hooks, UI Components, Error Boundaries
 * @status ACTIVE - Unified workout plans screen with enhanced performance
 * @updated 2025-09-01 - Performance optimizations, custom hooks, error handling improvements
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { logger } from "../../utils/logger";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";

// Core System Imports
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import type { WorkoutPlan, WorkoutRecommendation } from "../../types/index";
import type { WorkoutExercise } from "./types/workout.types";
import { RootStackParamList } from "../../navigation/types";
import type { User } from "../../stores/userStore";

// Component Imports
import BackButton from "../../components/common/BackButton";
import { UniversalModal } from "../../components/common/UniversalModal";
import WorkoutPlanManager from "../../components/WorkoutPlanManager";

// New Modular Components
import WorkoutPlanSelector from "./components/WorkoutPlanSelector";
import WorkoutPlanLoading from "./components/WorkoutPlanLoading";
import WorkoutPlanDisplay from "./components/WorkoutPlanDisplay";
import QuickActions from "./components/QuickActions";
import WorkoutErrorBoundary from "./components/WorkoutErrorBoundary";

// Custom Hooks
import { useModalManager } from "./hooks/useModalManager";

// Unified Workout Services - שירות מרכזי מאוחד
import { questionnaireService } from "../../services/questionnaireService";

// Performance tracking
import { PERFORMANCE_THRESHOLDS } from "./utils/workoutConstants";

// =======================================
// 🎣 CUSTOM HOOKS - הוקים מותאמים אישית
// =======================================

/**
 * Custom hook for managing workout plans state and operations
 */
const useWorkoutPlans = (
  user: User | null,
  _updateUser: (updates: Partial<User>) => void,
  _showError: (title: string, message: string) => void,
  _showSuccess: (title: string, message: string) => void,
  _triggerHaptic: (type: "light" | "medium" | "heavy") => void
) => {
  // Subscription state - memoized to prevent unnecessary re-renders
  const hasActiveSubscription = useMemo(
    () => user?.subscription?.isActive === true,
    [user?.subscription?.isActive]
  );
  const trialEnded = useMemo(
    () => user?.subscription?.hasCompletedTrial === true,
    [user?.subscription?.hasCompletedTrial]
  );
  const canAccessAI = useMemo(
    () => hasActiveSubscription || !trialEnded,
    [hasActiveSubscription, trialEnded]
  );

  // Component state - consolidated state management
  const [state, setState] = useState({
    refreshing: false,
    selectedPlanType: "basic" as "basic" | "smart",
    basicPlan: null as WorkoutPlan | null,
    smartPlan: null as WorkoutPlan | null,
    showPlanManager: false,
    pendingPlan: null as { plan: WorkoutPlan; type: "basic" | "smart" } | null,
    loading: false,
  });

  // Update state helper
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Get current active plan
  const currentWorkoutPlan = useMemo(
    () =>
      state.selectedPlanType === "smart" ? state.smartPlan : state.basicPlan,
    [state.selectedPlanType, state.smartPlan, state.basicPlan]
  );

  // Memoized action functions to prevent unnecessary re-renders
  const setRefreshing = useCallback(
    (refreshing: boolean) => updateState({ refreshing }),
    [updateState]
  );
  const setSelectedPlanTypeCallback = useCallback(
    (selectedPlanType: "basic" | "smart") => updateState({ selectedPlanType }),
    [updateState]
  );
  const setBasicPlanCallback = useCallback(
    (basicPlan: WorkoutPlan | null) => updateState({ basicPlan }),
    [updateState]
  );
  const setSmartPlanCallback = useCallback(
    (smartPlan: WorkoutPlan | null) => updateState({ smartPlan }),
    [updateState]
  );
  const setShowPlanManagerCallback = useCallback(
    (showPlanManager: boolean) => updateState({ showPlanManager }),
    [updateState]
  );
  const setPendingPlanCallback = useCallback(
    (pendingPlan: { plan: WorkoutPlan; type: "basic" | "smart" } | null) =>
      updateState({ pendingPlan }),
    [updateState]
  );
  const setLoadingCallback = useCallback(
    (loading: boolean) => updateState({ loading }),
    [updateState]
  );

  return {
    // State
    ...state,
    canAccessAI,
    currentWorkoutPlan,

    // Actions
    updateState,
    setState,
    setRefreshing,
    setSelectedPlanType: setSelectedPlanTypeCallback,
    setBasicPlan: setBasicPlanCallback,
    setSmartPlan: setSmartPlanCallback,
    setShowPlanManager: setShowPlanManagerCallback,
    setPendingPlan: setPendingPlanCallback,
    setLoading: setLoadingCallback,
  };
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

/**
 * Main screen component for managing and displaying workout plans
 * @param route - Optional route params
 * @returns React.ReactElement
 */
export default function WorkoutPlansScreen({
  route,
}: WorkoutPlanScreenProps): React.ReactElement {
  // Handle route parameters for better UX
  const routeParams = route?.params;
  const shouldRegenerate = routeParams?.regenerate;
  const shouldAutoStart = routeParams?.autoStart;
  // const returnFromWorkout = routeParams?.returnFromWorkout; // Not currently used
  // 🧭 Navigation
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Debug: Track re-renders
  React.useEffect(() => {
    // Only log if user is defined to avoid spam during initialization
    if (user?.id) {
      logger.warn(
        "WorkoutPlansScreen",
        `🔄 Re-rendered - userId: ${user.id}, basicPlan: ${!!basicPlan}, smartPlan: ${!!smartPlan}, selectedType: ${selectedPlanType}, loading: ${loading}, canAccessAI: ${canAccessAI}`
      );
    }
  });

  // 🚀 Performance Tracking
  const renderStartTime: number = useMemo(() => performance.now(), []);

  useEffect((): void => {
    const renderTime = performance.now() - renderStartTime;
    if (renderTime > PERFORMANCE_THRESHOLDS.SLOW_RENDER_WARNING) {
      logger.warn(
        "WorkoutPlansScreen",
        `⚠️ Slow render: ${renderTime.toFixed(2)}ms`
      );
    }
  }, [renderStartTime]);

  // 🎯 Haptic Feedback
  const triggerHaptic = useCallback((type: "light" | "medium" | "heavy") => {
    switch (type) {
      case "light":
        Haptics.selectionAsync();
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  }, []);

  // Core hooks and state - use selectors to prevent unnecessary re-renders
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  // Modal management
  const {
    activeModal,
    modalConfig,
    isOpen,
    showError,
    showSuccess,
    hideModal,
  } = useModalManager();

  // 🎯 Custom hook for workout plans management
  const {
    refreshing,
    selectedPlanType,
    basicPlan,
    smartPlan,
    showPlanManager,
    pendingPlan,
    loading,
    canAccessAI,
    currentWorkoutPlan,
    setRefreshing,
    setSelectedPlanType,
    setBasicPlan,
    setSmartPlan,
    setShowPlanManager,
    setPendingPlan,
    setLoading,
  } = useWorkoutPlans(user, updateUser, showError, showSuccess, triggerHaptic);

  // 🔄 יצירת תוכניות מאוחדת - מניעת כפילויות שירותים
  /**
   * Generate a basic workout plan for the user
   * @param showNotification - Whether to show success notification
   * @returns Promise<WorkoutPlan | null>
   */
  const generateBasicPlan = useCallback(
    async (showNotification: boolean = true): Promise<WorkoutPlan | null> => {
      try {
        setLoading(true);

        if (!user) {
          showError("שגיאה", "לא נמצא משתמש");
          return null;
        }

        // שימוש בשירות questionnaireService במקום כפילות
        const basicPlan = await questionnaireService.generateBasicWorkoutPlan();

        // המרה לטיפוס הנכון עם השדות הנדרשים
        const plan: WorkoutPlan = {
          ...basicPlan,
          type: "basic" as const,
          features: {
            personalizedWorkouts: false,
            equipmentOptimization: false,
            progressTracking: false,
            aiRecommendations: false,
            customSchedule: false,
          },
          requiresSubscription: false,
          createdAt: new Date().toISOString(),
        };

        if (showNotification) {
          showSuccess("תוכנית נוצרה!", "תוכנית בסיסית נוצרה בהצלחה");
        }

        // שמור בזיכרון המקומי ובמשתמש
        await updateUser({
          workoutplans: {
            ...user?.workoutplans,
            basicPlan: plan,
            lastUpdated: new Date().toISOString(),
          },
        });

        return plan;
      } catch (error) {
        logger.error(
          "WorkoutPlansScreen",
          "Error generating basic plan",
          error
        );
        showError("שגיאה", "לא הצלחנו ליצור תוכנית בסיסית");
        return null;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.workoutplans, showError, showSuccess, updateUser, setLoading]
  );

  /**
   * Generate an AI-powered workout plan for the user
   * @param showNotification - Whether to show success notification
   * @returns Promise<WorkoutPlan | null>
   */
  const generateAIPlan = useCallback(
    async (showNotification: boolean = true): Promise<WorkoutPlan | null> => {
      try {
        setLoading(true);

        if (!user) {
          showError("שגיאה", "לא נמצא משתמש");
          return null;
        }

        if (!canAccessAI) {
          showError("גישה מוגבלת", "תכונות AI זמינות רק למנויים");
          return null;
        }

        // שימוש בשירות questionnaireService לתוכנית חכמה
        const smartPlan = await questionnaireService.generateSmartWorkoutPlan();

        // המרה לטיפוס הנכון עם תכונות AI
        const plan: WorkoutPlan = {
          ...smartPlan,
          type: "smart" as const,
          features: {
            personalizedWorkouts: true,
            equipmentOptimization: true,
            progressTracking: true,
            aiRecommendations: true,
            customSchedule: true,
          },
          requiresSubscription: !canAccessAI,
          createdAt: new Date().toISOString(),
        };

        if (showNotification) {
          showSuccess("תוכנית AI נוצרה!", "תוכנית חכמה נוצרה במיוחד עבורך");
        }

        // שמור בזיכרון המקומי ובמשתמש
        await updateUser({
          workoutplans: {
            ...user?.workoutplans,
            smartPlan: plan,
            lastUpdated: new Date().toISOString(),
          },
        });

        return plan;
      } catch (error) {
        logger.error("WorkoutPlansScreen", "Error generating AI plan", error);
        showError("שגיאה", "לא הצלחנו ליצור תוכנית AI");
        return null;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      user?.workoutplans,
      canAccessAI,
      showError,
      showSuccess,
      updateUser,
      setLoading,
    ]
  );

  // 🔄 המרת נתוני אימון לפורמט המסך הפעיל
  /**
   * Convert a workout recommendation to the active workout format
   * @param workout - WorkoutRecommendation
   * @param workoutIndex - number
   * @returns Converted workout object
   */
  const convertWorkoutToActiveFormat = useCallback(
    (
      workout: WorkoutRecommendation,
      workoutIndex: number
    ): {
      name: string;
      dayName: string;
      startTime: string;
      exercises: WorkoutExercise[];
    } => {
      const convertedExercises: WorkoutExercise[] = (
        workout.exercises ?? []
      ).map((exercise, exerciseIndex: number) => ({
        id: exercise.id || `exercise_${exerciseIndex}_${Date.now()}`,
        name: exercise.name,
        category: exercise.category || "כללי",
        primaryMuscles: exercise.primaryMuscles || ["כללי"],
        equipment: exercise.equipment || "bodyweight",
        restTime: exercise.restTime || 60,
        sets: exercise.sets?.map((set, setIndex: number) => ({
          id: `${exercise.id || exerciseIndex}_set_${setIndex}_${Date.now()}`,
          type: "working" as const,
          reps: set.reps || 10,
          targetReps: set.reps || 10,
          targetWeight: set.weight || 0,
          actualReps: undefined,
          actualWeight: undefined,
          completed: false,
          restTime: set.restTime || 60,
          isPR: false,
        })) || [
          {
            id: `${exercise.id || exerciseIndex}_set_0_${Date.now()}`,
            type: "working" as const,
            reps: 10,
            targetReps: 10,
            targetWeight: 0,
            completed: false,
            restTime: 60,
            isPR: false,
          },
        ],
        notes: exercise.notes,
        videoUrl: exercise.videoUrl,
        imageUrl: exercise.imageUrl,
      }));

      return {
        name: workout.name || `אימון ${workoutIndex + 1}`,
        dayName: workout.name || `יום ${workoutIndex + 1}`,
        startTime: new Date().toISOString(),
        exercises: convertedExercises,
      };
    },
    []
  );

  // Get current active plan - REMOVED: now handled by custom hook
  // const currentWorkoutPlan = selectedPlanType === "smart" ? smartPlan : basicPlan;

  // Handle plan type selection
  /**
   * Handle selection of workout plan type
   * @param type - "basic" | "smart"
   */
  const handleSelectPlanType = useCallback(
    async (type: "basic" | "smart"): Promise<void> => {
      triggerHaptic("light");
      setSelectedPlanType(type);

      // שמור העדפה ב-userStore
      await updateUser({
        workoutplans: {
          ...user?.workoutplans,
          planPreference: type,
        },
      });
    },
    [triggerHaptic, updateUser, user?.workoutplans, setSelectedPlanType]
  );

  // Handle plan generation
  /**
   * Handle generation of basic workout plan
   */
  const handleGenerateBasic = useCallback(async (): Promise<void> => {
    triggerHaptic("medium");
    const plan = await generateBasicPlan(true);
    if (plan) {
      setBasicPlan(plan);
      setSelectedPlanType("basic");
    }
  }, [generateBasicPlan, triggerHaptic, setBasicPlan, setSelectedPlanType]);

  /**
   * Handle generation of AI workout plan
   */
  const handleGenerateAI = useCallback(async (): Promise<void> => {
    if (!canAccessAI) {
      showError(
        "גישה מוגבלת 🔒",
        "תכונות AI זמינות רק למנויים פעילים או במהלך תקופת הניסיון"
      );
      return;
    }

    triggerHaptic("heavy");
    const plan = await generateAIPlan(true);
    if (plan) {
      setSmartPlan(plan);
      setSelectedPlanType("smart");
    }
  }, [
    generateAIPlan,
    canAccessAI,
    triggerHaptic,
    showError,
    setSelectedPlanType,
    setSmartPlan,
  ]);

  // Handle workout start
  /**
   * Handle starting a workout from the current plan
   */
  const handleStartWorkout = useCallback((): void => {
    if (!currentWorkoutPlan) {
      showError("אין תוכנית", "יש ליצור תוכנית אימון תחילה");
      return;
    }

    triggerHaptic("heavy");

    // מעבר למסך אימון פעיל
    showSuccess("אימון מתחיל!", "מעבר למסך האימון");

    // Navigate to ActiveWorkout with proper parameters
    const workoutTemplate = currentWorkoutPlan.workouts?.[0]; // Get first workout template
    if (!workoutTemplate) {
      showError("שגיאה", "לא ניתן למצוא תבנית אימון");
      return;
    }

    // Use exercises directly from workout template
    const exercises = workoutTemplate.exercises || [];

    navigation.navigate("ActiveWorkout", {
      workoutData: {
        name: currentWorkoutPlan.name || "אימון יומי",
        dayName: workoutTemplate.name || "יום אימון",
        startTime: new Date().toISOString(),
        exercises: exercises as WorkoutExercise[],
      },
      aiCoaching: selectedPlanType === "smart" && canAccessAI,
      performanceTracking: {
        screenTime: 0,
        interactions: 0,
        lastVisited: new Date().toISOString(),
        frequency: 1,
        userPreference: 8,
      },
    });
  }, [
    currentWorkoutPlan,
    triggerHaptic,
    showSuccess,
    showError,
    canAccessAI,
    selectedPlanType,
    navigation,
  ]);

  // Handle refresh
  /**
   * Handle refresh of workout plans
   */
  const handleRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);

    try {
      // Refresh current plan type
      if (selectedPlanType === "smart" && canAccessAI) {
        await handleGenerateAI();
      } else {
        await handleGenerateBasic();
      }
    } finally {
      setRefreshing(false);
    }
  }, [
    selectedPlanType,
    canAccessAI,
    handleGenerateAI,
    handleGenerateBasic,
    setRefreshing,
  ]);

  // Initialize with basic plan on mount
  useEffect(() => {
    // טען תוכניות קיימות מהמשתמש תחילה
    if (user?.workoutplans?.basicPlan && !basicPlan) {
      setBasicPlan(user.workoutplans.basicPlan);
    }
    if (user?.workoutplans?.smartPlan && !smartPlan) {
      setSmartPlan(user.workoutplans.smartPlan);
    }

    // אם יש העדפה שמורה, בחר אותה
    if (user?.workoutplans?.planPreference) {
      setSelectedPlanType(user.workoutplans.planPreference);
    }

    // אם אין תוכנית בסיסית, צור אחת
    if (!basicPlan && !user?.workoutplans?.basicPlan) {
      generateBasicPlan(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.workoutplans, generateBasicPlan]);

  // Handle route parameters for enhanced UX
  useEffect(() => {
    if (shouldRegenerate && !loading) {
      logger.info(
        "WorkoutPlansScreen",
        "Auto-regenerating plan based on route params",
        {
          shouldRegenerate,
          selectedPlanType,
        }
      );

      if (selectedPlanType === "smart" && canAccessAI) {
        handleGenerateAI();
      } else {
        handleGenerateBasic();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shouldRegenerate,
    loading,
    selectedPlanType,
    handleGenerateAI,
    handleGenerateBasic,
  ]);

  // Auto-start workout if requested
  useEffect(() => {
    if (shouldAutoStart && currentWorkoutPlan && !loading) {
      logger.info(
        "WorkoutPlansScreen",
        "Auto-starting workout based on route params"
      );
      setTimeout(() => handleStartWorkout(), 1000); // Small delay for better UX
    }
  }, [shouldAutoStart, currentWorkoutPlan, loading, handleStartWorkout]);

  // Memoized workout plan display for performance
  const memoizedWorkoutPlanDisplay = useMemo(() => {
    if (!currentWorkoutPlan) return null;

    return (
      <WorkoutPlanDisplay
        workoutPlan={currentWorkoutPlan}
        isLoading={loading}
        onStartWorkout={(workout, index) => {
          triggerHaptic("heavy");
          showSuccess("מתחיל אימון!", `${workout.name} - אימון ${index + 1}`);

          // המרת הנתונים לפורמט של המסך הפעיל
          const workoutData = convertWorkoutToActiveFormat(workout, index);

          // Debug: הדפסת הנתונים שמועברים (פיתוח בלבד)
          if (__DEV__) {
            logger.debug(
              "WorkoutPlansScreen",
              "Navigating to ActiveWorkout with data:",
              {
                workoutName: workoutData.name,
                dayName: workoutData.dayName,
                exercisesCount: workoutData.exercises.length,
                exercises: workoutData.exercises.map((ex) => ({
                  id: ex.id,
                  name: ex.name,
                  setsCount: (ex.sets || []).length,
                })),
              }
            );
          }

          // מעבר למסך האימון הפעיל
          navigation.navigate("ActiveWorkout", { workoutData });
        }}
      />
    );
  }, [
    currentWorkoutPlan,
    loading,
    triggerHaptic,
    showSuccess,
    convertWorkoutToActiveFormat,
    navigation,
  ]);

  // Loading state
  if (loading) {
    return (
      <WorkoutErrorBoundary>
        <SafeAreaView style={styles.container}>
          <WorkoutPlanLoading
            message={
              selectedPlanType === "smart"
                ? "יוצר תוכנית AI..."
                : "יוצר תוכנית בסיסית..."
            }
            isAI={selectedPlanType === "smart"}
          />
        </SafeAreaView>
      </WorkoutErrorBoundary>
    );
  }

  return (
    <WorkoutErrorBoundary>
      <SafeAreaView style={styles.container}>
        <BackButton />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>תוכניות אימון</Text>
            <Text style={styles.subtitle}>
              בחר תוכנית ותתחיל להתאמן עוד היום
            </Text>
          </View>

          {/* Plan Type Selector */}
          <WorkoutPlanSelector
            selectedType={selectedPlanType}
            onSelectType={handleSelectPlanType}
            canAccessAI={canAccessAI}
          />

          {/* Current Plan Display */}
          {currentWorkoutPlan && (
            <View style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{currentWorkoutPlan.name}</Text>
                {/* אינדיקטור מקור התוכנית */}
                {user?.workoutplans?.lastUpdated && (
                  <Text style={styles.planSource}>
                    {selectedPlanType === "basic" &&
                    user?.workoutplans?.basicPlan
                      ? "💾 נטען מהזיכרון"
                      : selectedPlanType === "smart" &&
                          user?.workoutplans?.smartPlan
                        ? "💾 נטען מהזיכרון"
                        : "✨ נוצר חדש"}
                  </Text>
                )}
              </View>
              <Text style={styles.planDescription}>
                {currentWorkoutPlan.description}
              </Text>

              {/* תאריך עדכון אחרון */}
              {user?.workoutplans?.lastUpdated && (
                <Text style={styles.lastUpdated}>
                  עודכן:{" "}
                  {new Date(user.workoutplans.lastUpdated).toLocaleDateString(
                    "he-IL"
                  )}
                </Text>
              )}

              <View style={styles.planStats}>
                <Text style={styles.planStat}>
                  🏋️ {currentWorkoutPlan.workouts?.length || 0} אימונים
                </Text>
                <Text style={styles.planStat}>
                  ⏱️ {currentWorkoutPlan.duration} דקות
                </Text>
                <Text style={styles.planStat}>
                  📅 {currentWorkoutPlan.frequency} פעמים בשבוע
                </Text>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <QuickActions
            onRegenerateBasic={handleGenerateBasic}
            onRegenerateAI={handleGenerateAI}
            onStartWorkout={handleStartWorkout}
            canAccessAI={canAccessAI}
            hasWorkoutPlan={!!currentWorkoutPlan}
            loading={loading}
          />

          {/* Workout Plan Display - תצוגת התוכנית */}
          {memoizedWorkoutPlanDisplay}
          {!currentWorkoutPlan && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>אין תוכנית אימון</Text>
              <Text style={styles.emptyMessage}>
                יצור תוכנית חדשה כדי להתחיל להתאמן
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Plan Manager Modal */}
        {showPlanManager && pendingPlan && (
          <WorkoutPlanManager
            newPlan={pendingPlan.plan}
            planType={pendingPlan.type}
            visible={showPlanManager}
            onClose={() => setShowPlanManager(false)}
            /**
             * Handle saving a new plan in the modal
             * @param shouldSave - boolean
             * @param replaceType - "basic" | "smart" | "additional" | undefined
             */
            onSave={(
              shouldSave: boolean,
              replaceType?: "basic" | "smart" | "additional"
            ) => {
              if (shouldSave) {
                if (pendingPlan.type === "smart" || replaceType === "smart") {
                  setSmartPlan(pendingPlan.plan);
                } else {
                  setBasicPlan(pendingPlan.plan);
                }
                showSuccess("תוכנית נשמרה!", "התוכנית נשמרה בהצלחה");
              }
              setShowPlanManager(false);
              setPendingPlan(null);
            }}
          />
        )}

        {/* Universal Modal */}
        <UniversalModal
          visible={isOpen}
          type={activeModal || "error"}
          title={modalConfig.title || ""}
          message={modalConfig.message || ""}
          onClose={hideModal}
          onConfirm={modalConfig.onConfirm}
          onCancel={modalConfig.onCancel}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
        />
      </SafeAreaView>
    </WorkoutErrorBoundary>
  );
}

/**
 * Styles for WorkoutPlansScreen
 * @remarks All style keys are typed for consistency with React Native StyleSheet
 */
import type { StyleProp, ViewStyle, TextStyle, ImageStyle } from "react-native";
const styles: Record<
  string,
  StyleProp<ViewStyle | TextStyle | ImageStyle>
> = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  planCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    flex: 1,
  },
  planSource: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  planDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    fontStyle: "italic",
  },
  planStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 8,
  },
  planStat: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
