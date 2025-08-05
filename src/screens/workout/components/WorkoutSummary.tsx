/**
 * @file src/screens/workout/components/WorkoutSummary.tsx
 * @description מסך סיכום אימון מפולח ומעודכן
 * English: Refactored and optimized workout summary screen
 *
 * @features
 * - ✅ Modular component architecture
 * - ✅ Centralized workout statistics calculation
 * - ✅ Conditional logging system
 * - ✅ Separated feedback, achievements, and action sections
 * - ✅ Complete RTL support and accessibility
 * - ✅ Performance optimized with React.memo
 *
 * @performance
 * - React.memo for re-render prevention
 * - useCallback for stable function references
 * - useMemo for expensive calculations
 * - Modular components reduce bundle size
 *
 * @accessibility
 * - Full screen reader support
 * - Clear role definitions and labels
 * - RTL text direction and layout
 * - Interactive feedback elements
 *
 * @updated 2025-01-25 - Major refactoring: split into modular components
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import {
  formatTime,
  formatDuration,
  formatVolume,
  calculateWorkoutStats,
  workoutLogger,
} from "../../../utils";
import { WorkoutData } from "../types/workout.types";
import { useModalManager } from "../hooks/useModalManager";
import { UniversalModal } from "../../../components/common/UniversalModal";

// Import modular components
import { WorkoutStatsGrid } from "./WorkoutSummary/WorkoutStatsGrid";
import { FeedbackSection } from "./WorkoutSummary/FeedbackSection";
import { AchievementsSection } from "./WorkoutSummary/AchievementsSection";
import { ActionButtons } from "./WorkoutSummary/ActionButtons";

interface WorkoutSummaryProps {
  workout: WorkoutData;
  onClose: () => void;
  onSave: () => void;
  visible: boolean;
}

interface PersonalRecord {
  exercise: string;
  previousBest: number;
  newRecord: number;
  improvement: number;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = React.memo(
  ({ workout, onClose, onSave, visible }) => {
    // State management
    const [difficulty, setDifficulty] = useState<number>(0);
    const [feeling, setFeeling] = useState<string>("");
    const [readyForMore, setReadyForMore] = useState<boolean>(false);
    const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(
      []
    );

    // Modal management - אחיד במקום Alert.alert מפוזר
    const { activeModal, modalConfig, hideModal, showComingSoon } =
      useModalManager();

    // Calculate workout statistics using centralized utility
    const stats = useMemo(() => {
      if (!workout || !workout.exercises)
        return {
          totalExercises: 0,
          completedExercises: 0,
          totalSets: 0,
          completedSets: 0,
          totalVolume: 0,
          totalReps: 0,
          progressPercentage: 0,
          personalRecords: 0,
          duration: 0,
          totalPlannedSets: 0,
        };

      const calculatedStats = calculateWorkoutStats(workout.exercises);

      // Add additional properties for compatibility
      return {
        ...calculatedStats,
        duration: workout.duration || 0,
        totalPlannedSets: workout.exercises.reduce(
          (total, exercise) => total + (exercise.sets?.length || 0),
          0
        ),
      };
    }, [workout]);

    // Detect personal records on mount
    useEffect(() => {
      if (workout && visible) {
        workoutLogger.info("WorkoutSummary", "מזהה שיאים אישיים חדשים");

        // Mock personal records detection logic
        const mockRecords: PersonalRecord[] = [
          {
            exercise: "סקוואט",
            previousBest: 110,
            newRecord: 120,
            improvement: 9.1,
          },
          {
            exercise: "ספסל חזה",
            previousBest: 80,
            newRecord: 85,
            improvement: 6.25,
          },
        ];

        // In real implementation, this would check against user's history
        if (stats.totalVolume > 5000) {
          setPersonalRecords(mockRecords);
          workoutLogger.info(
            "WorkoutSummary",
            `זוהו ${mockRecords.length} שיאים אישיים חדשים`
          );
        }
      }
    }, [workout, visible, stats.totalVolume]);

    // Share workout functionality
    const handleShareWorkout = useCallback(async () => {
      workoutLogger.info("WorkoutSummary", "שיתוף אימון התחיל");

      const shareText = `🏋️ סיימתי אימון מדהים! 💪

📊 הסטטיסטיקות:
⏱️ משך: ${formatDuration(stats.duration)}
🔢 סטים: ${stats.totalSets}/${stats.totalPlannedSets}
⚖️ נפח: ${formatVolume(stats.totalVolume)}
${personalRecords.length > 0 ? `🏆 שיאים חדשים: ${personalRecords.length}` : ""}

${difficulty > 0 ? `🌟 קושי: ${difficulty}/5` : ""}
${feeling ? `😊 הרגשה: ${feeling}` : ""}

#אימון #כושר #התקדמות #GYMovoo`;

      try {
        await Share.share({
          message: shareText,
        });
        workoutLogger.info("WorkoutSummary", "אימון שותף בהצלחה");
      } catch (error) {
        workoutLogger.error("WorkoutSummary", `שגיאה בשיתוף אימון: ${error}`);
        Alert.alert("שגיאה", "לא ניתן לשתף את האימון כרגע");
      }
    }, [stats, difficulty, feeling, personalRecords]);

    // Finalize and save workout
    const handleFinalizeSummary = useCallback(async () => {
      workoutLogger.info("WorkoutSummary", "שמירה סופית של סיכום האימון");

      try {
        // In real implementation, save to database
        const summaryData = {
          workoutId: workout.id,
          stats,
          feedback: {
            difficulty,
            feeling,
            readyForMore,
          },
          personalRecords,
          timestamp: new Date().toISOString(),
        };

        workoutLogger.info(
          "WorkoutSummary",
          `נתוני סיכום נשמרו: ${JSON.stringify(summaryData)}`
        );

        // Close the summary screen
        onSave();
      } catch (error) {
        workoutLogger.error("WorkoutSummary", `שגיאה בשמירת סיכום: ${error}`);
        Alert.alert("שגיאה", "שגיאה בשמירת האימון - נסה שוב");
      }
    }, [
      workout.id,
      stats,
      difficulty,
      feeling,
      readyForMore,
      personalRecords,
      onSave,
    ]);

    // Mock achievements data
    const achievements = useMemo(
      () => [
        {
          type: "new_pr" as const,
          title: "שיא חדש!",
          subtitle: 'הגעת לשיא בסקוואט - 120 ק"ג!',
          icon: "trophy-award",
          color: theme.colors.warning,
        },
        {
          type: "streak" as const,
          title: "שורת אימונים!",
          subtitle: "3 אימונים השבוע - כל הכבוד!",
          icon: "fire",
          color: "#FF6B35",
        },
      ],
      []
    );

    if (!visible) {
      return null;
    }

    return (
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={styles.header}
          >
            {/* Header actions */}
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.topActionButton}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="סגור מסך סיכום"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <MaterialCommunityIcons
                  name="trophy"
                  size={32}
                  color={theme.colors.text}
                />
                <Text style={styles.congratsText}>כל הכבוד! 🎉</Text>
                <Text style={styles.workoutName}>
                  {workout.name || "אימון מהיר"}
                </Text>
              </View>

              <View style={styles.topActionsRight}>
                <TouchableOpacity
                  style={styles.topActionButton}
                  onPress={handleShareWorkout}
                  accessibilityRole="button"
                  accessibilityLabel="שתף אימון"
                >
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={20}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.topActionButton}
                  onPress={onSave}
                  accessibilityRole="button"
                  accessibilityLabel="שמור אימון מהיר"
                >
                  <MaterialCommunityIcons
                    name="content-save"
                    size={20}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            accessible={true}
            accessibilityLabel="תוכן סיכום האימון"
          >
            {/* Workout Statistics Grid */}
            <WorkoutStatsGrid
              totalExercises={stats.totalExercises}
              completedExercises={stats.completedExercises}
              totalSets={stats.totalSets}
              completedSets={stats.completedSets}
              totalVolume={stats.totalVolume}
              totalReps={stats.totalReps}
              progressPercentage={stats.progressPercentage}
              personalRecords={personalRecords.length}
              duration={stats.duration}
              plannedSets={stats.totalPlannedSets}
            />

            {/* Feedback Section */}
            <FeedbackSection
              difficulty={difficulty}
              feeling={feeling}
              onDifficultyChange={setDifficulty}
              onFeelingChange={setFeeling}
            />

            {/* Achievements Section */}
            <AchievementsSection
              achievements={achievements}
              personalRecords={personalRecords}
              workoutStats={{
                totalSets: stats.totalSets,
                totalVolume: stats.totalVolume,
                duration: stats.duration,
                completedExercises: workout.exercises?.length || 0,
              }}
            />

            {/* Action Buttons */}
            <ActionButtons
              onShareWorkout={handleShareWorkout}
              onSaveAsTemplate={() => {
                workoutLogger.info("WorkoutSummary", "שמירה כתבנית התחילה");
                showComingSoon("שמירה כתבנית אימון");
              }}
              onEditWorkout={() => {
                workoutLogger.info("WorkoutSummary", "עריכת אימון התחילה");
                showComingSoon("עריכת אימון");
              }}
              onDeleteWorkout={() => {
                workoutLogger.warn("WorkoutSummary", "מחיקת אימון התחילה");
                showComingSoon("מחיקת אימון");
              }}
              onFinishWorkout={handleFinalizeSummary}
              isWorkoutSaved={true}
            />
          </ScrollView>
        </View>

        {/* מודל אחיד למקום Alert.alert מפוזר */}
        <UniversalModal
          visible={activeModal !== null}
          type={activeModal || "comingSoon"}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={hideModal}
          onConfirm={modalConfig.onConfirm}
          confirmText={modalConfig.confirmText}
          destructive={modalConfig.destructive}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: "90%",
    ...theme.shadows.large,
  },
  header: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  topActions: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  congratsText: {
    fontSize: theme.typography.title2.fontSize,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  workoutName: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text + "CC",
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  topActionsRight: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    gap: theme.spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
});

export default WorkoutSummary;
