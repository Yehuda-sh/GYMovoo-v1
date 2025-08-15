/**
 * @file src/screens/workout/WorkoutPlansScreenNew.tsx
 * @brief Enhanced Workout Plans Screen - מסך תוכניות אימון משופר (גרסה מרוכזת)
 * @dependencies React Native, Custom Hooks, UI Components
 * @updated August 2025 - Completely refactored with modular architecture
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

// Core System Imports
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../navigation/types";
import type { WorkoutPlan } from "../../types/index";

// Component Imports
import BackButton from "../../components/common/BackButton";
import { UniversalModal } from "../../components/common/UniversalModal";
import WorkoutPlanManager from "../../components/WorkoutPlanManager";

// New Modular Components
import WorkoutPlanSelector from "./components/WorkoutPlanSelector";
import WorkoutPlanLoading from "./components/WorkoutPlanLoading";
import QuickActions from "./components/QuickActions";
import WorkoutErrorBoundary from "./components/WorkoutErrorBoundary";

// Custom Hooks
import { useWorkoutGeneration } from "./hooks/useWorkoutGeneration";
import { useModalManager } from "./hooks/useModalManager";

// Performance tracking
import { PERFORMANCE_THRESHOLDS } from "./constants/workoutConstants";

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

export default function WorkoutPlansScreenNew({
  route: _,
}: WorkoutPlanScreenProps) {
  // 🚀 Performance Tracking
  const renderStartTime = useMemo(() => performance.now(), []);

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime;
    if (renderTime > PERFORMANCE_THRESHOLDS.SLOW_RENDER_WARNING) {
      console.warn(
        `⚠️ WorkoutPlansScreenNew slow render: ${renderTime.toFixed(2)}ms`
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

  // Core hooks and state
  const _navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useUserStore();

  // Subscription state
  const hasActiveSubscription = user?.subscription?.isActive === true;
  const trialEnded = (user as any)?.trialEnded === true;
  const canAccessAI = hasActiveSubscription || !trialEnded;

  // Component state
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<"basic" | "smart">(
    "basic"
  );
  const [basicPlan, setBasicPlan] = useState<WorkoutPlan | null>(null);
  const [smartPlan, setSmartPlan] = useState<WorkoutPlan | null>(null);
  const [showPlanManager, setShowPlanManager] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<{
    plan: WorkoutPlan;
    type: "basic" | "smart";
  } | null>(null);

  // Modal management
  const {
    activeModal,
    modalConfig,
    isOpen,
    showError,
    showSuccess,
    hideModal,
  } = useModalManager();

  // Workout generation hook
  const { loading, generateBasicPlan, generateAIPlan } = useWorkoutGeneration({
    onSuccess: showSuccess,
    onError: showError,
  });

  // Get current active plan
  const currentWorkoutPlan =
    selectedPlanType === "smart" ? smartPlan : basicPlan;

  // Handle plan type selection
  const handleSelectPlanType = useCallback(
    (type: "basic" | "smart") => {
      triggerHaptic("light");
      setSelectedPlanType(type);
    },
    [triggerHaptic]
  );

  // Handle plan generation
  const handleGenerateBasic = useCallback(async () => {
    triggerHaptic("medium");
    const plan = await generateBasicPlan(true);
    if (plan) {
      setBasicPlan(plan);
      setSelectedPlanType("basic");
    }
  }, [generateBasicPlan, triggerHaptic]);

  const handleGenerateAI = useCallback(async () => {
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
  }, [generateAIPlan, canAccessAI, triggerHaptic, showError]);

  // Handle workout start
  const handleStartWorkout = useCallback(() => {
    if (!currentWorkoutPlan) {
      showError("אין תוכנית", "יש ליצור תוכנית אימון תחילה");
      return;
    }

    triggerHaptic("heavy");

    // Navigate to workout - simplified for now
    showSuccess("אימון מתחיל!", "מעבר למסך האימון");

    // TODO: Navigate to actual workout screen
    // navigation.navigate('ActiveWorkout', { workoutData: ... });
  }, [currentWorkoutPlan, triggerHaptic, showSuccess, showError]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
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
  }, [selectedPlanType, canAccessAI, handleGenerateAI, handleGenerateBasic]);

  // Initialize with basic plan on mount
  useEffect(() => {
    if (!basicPlan) {
      generateBasicPlan(false);
    }
  }, [basicPlan, generateBasicPlan]);

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
              <Text style={styles.planName}>{currentWorkoutPlan.name}</Text>
              <Text style={styles.planDescription}>
                {currentWorkoutPlan.description}
              </Text>
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

          {/* No Plan State */}
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
            onSave={(shouldSave, replaceType) => {
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

const styles = StyleSheet.create({
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
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
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
