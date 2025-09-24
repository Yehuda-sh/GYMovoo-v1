/**
 * @file src/features/workout/screens/workout_screens/hooks/useWorkoutSummaryData.ts
 * @brief Custom hook for WorkoutSummaryScreen - following proven methodology
 * Extracts all business logic from UI component for better separation of concerns
 */

import { useState, useEffect } from "react";
import { Animated } from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
  type NavigationProp,
} from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import workoutFacadeService from "../../../../../services/workout/workoutFacadeService";
import { useUserStore } from "../../../../../stores/userStore";
import { RootStackParamList } from "../../../../../navigation/types";
import { logger } from "../../../../../utils/logger";

type SummaryRoute = RouteProp<RootStackParamList, "WorkoutSummary">;
type SummaryNav = NavigationProp<RootStackParamList>;

export const useWorkoutSummaryData = () => {
  const navigation = useNavigation<SummaryNav>();
  const route = useRoute<SummaryRoute>();
  const { user, updateUser } = useUserStore();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);

  const workoutData = route.params?.workoutData;

  // אנימציית כניסה + haptics
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [fadeAnim]);

  // חישוב רצף אימונים
  const calculateNewStreak = async (): Promise<number> => {
    try {
      const history = await workoutFacadeService.getHistoryForList();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (history.length === 0) return 1;

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const sortedHistory = history
        .slice()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      let streak = 1; // האימון הנוכחי
      let checkDate = new Date(yesterday);

      for (const workout of sortedHistory) {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);

        if (workoutDate.getTime() === checkDate.getTime()) {
          streak++;
          checkDate = new Date(checkDate);
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (workoutDate.getTime() < checkDate.getTime()) {
          break;
        }
      }

      return streak;
    } catch (error) {
      logger.error("useWorkoutSummaryData", "Error calculating streak", error);
      return 1;
    }
  };

  // שמירת אימון
  const handleSaveWorkout = async () => {
    if (!workoutData) {
      navigation.goBack();
      return;
    }

    setIsLoading(true);

    try {
      const now = Date.now();
      const workoutId = `workout_${now}`;

      await workoutFacadeService.saveWorkout({
        id: workoutId,
        workout: {
          id: workoutId,
          name: workoutData.workoutName,
          startTime: new Date(
            now - workoutData.totalDuration * 60 * 1000
          ).toISOString(),
          duration: workoutData.totalDuration,
          totalVolume: workoutData.totalVolume,
          exercises: workoutData.exercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            category: "strength",
            primaryMuscles: ["general"],
            equipment: "free_weights",
            sets: exercise.sets.map((set, index) => ({
              id: `set_${now}_${index}`,
              type: "working" as const,
              targetReps: set.reps,
              targetWeight: set.weight || 0,
              actualReps: set.reps,
              actualWeight: set.weight || 0,
              completed: set.completed,
              restTime: exercise.restTime || 60,
            })),
          })),
        },
        feedback: {
          completedAt: workoutData.completedAt,
          difficulty: workoutData.difficulty || 3,
          feeling: workoutData.feeling || "good",
          readyForMore: true,
          congratulationMessage: "אימון מעולה!",
        },
        stats: {
          duration: workoutData.totalDuration,
          totalSets: workoutData.totalSets,
          totalPlannedSets: workoutData.totalSets,
          totalVolume: workoutData.totalVolume,
          personalRecords: workoutData.personalRecords.length,
        },
      });

      // עדכון סטטיסטיקות המשתמש
      if (user) {
        const currentStats = user.trainingStats || {};
        const currentTotal = currentStats.totalWorkouts || 0;
        const newTotalWorkouts = currentTotal + 1;

        const currentAverage = currentStats.averageRating || 0;
        const newAverageRating =
          currentTotal > 0
            ? (currentAverage * currentTotal + (workoutData.difficulty || 3)) /
              newTotalWorkouts
            : workoutData.difficulty || 3;

        const newStreak = await calculateNewStreak();

        updateUser({
          trainingStats: {
            ...currentStats,
            totalWorkouts: newTotalWorkouts,
            currentStreak: newStreak,
            averageRating: newAverageRating,
            lastWorkoutDate: new Date().toISOString(),
          },
        });
      }

      navigation.goBack();
    } catch (error) {
      logger.error("useWorkoutSummaryData", "Error saving workout", error);
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipAndGoBack = () => {
    navigation.goBack();
  };

  return {
    // Data
    workoutData,
    fadeAnim,
    isLoading,

    // Actions
    handleSaveWorkout,
    handleSkipAndGoBack,
  };
};
