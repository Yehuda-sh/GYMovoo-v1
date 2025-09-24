/**
 * @file src/screens/main/hooks/useMainScreenData.ts
 * @description Custom hook for MainScreen data management
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { useUserStore } from "../../../stores/userStore";
import workoutFacadeService from "../../../services/workout/workoutFacadeService";
import { logger } from "../../../utils/logger";
import { calculateAvailableTrainingDays } from "../utils/mainScreenHelpers";

interface MainScreenStats {
  insights: string[];
  genderStats?: {
    total: {
      totalWorkouts: number;
      currentStreak: number;
      averageDifficulty: number;
      workoutStreak: number;
    };
  };
  totalWorkouts: number;
  currentStreak: number;
}

export const useMainScreenData = () => {
  const { user } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedStats, setAdvancedStats] = useState<MainScreenStats | null>(
    null
  );

  // Load advanced workout data
  const loadAdvancedData = useCallback(async () => {
    if (!user) return;

    try {
      setError(null);
      const historyItems = await workoutFacadeService.getHistoryForList();
      const insights =
        await workoutFacadeService.getPersonalizedAnalytics(historyItems);

      // Calculate statistics from history
      const totalWorkouts = historyItems.length;
      const currentStreak = historyItems.slice(0, 7).length; // Simple implementation

      // Calculate real average difficulty from history
      const averageDifficulty =
        historyItems.length > 0
          ? historyItems.reduce((sum, item) => sum + (item.rating || 0), 0) /
            historyItems.length
          : 0;

      setAdvancedStats({
        insights,
        genderStats: {
          total: {
            totalWorkouts,
            currentStreak,
            averageDifficulty,
            workoutStreak: currentStreak,
          },
        },
        totalWorkouts,
        currentStreak,
      });

      return historyItems;
    } catch (error) {
      logger.error("useMainScreenData", "Error loading advanced data", error);
      setError("שגיאה בטעינת נתונים");
      return [];
    }
  }, [user]);

  // Refresh data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await loadAdvancedData();
    } finally {
      setRefreshing(false);
    }
  }, [loadAdvancedData]);

  // Initial data load
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadAdvancedData();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [user?.id, loadAdvancedData]);

  // Memoized computed values
  const displayName = useMemo(
    () => user?.name || user?.email?.split("@")[0] || "מתאמן",
    [user?.name, user?.email]
  );

  const availableTrainingDays = useMemo(() => {
    return calculateAvailableTrainingDays(user);
  }, [user]);

  const daysToShow = useMemo(() => {
    const days = Array.from({ length: availableTrainingDays }, (_, i) => i + 1);
    return days;
  }, [availableTrainingDays]);

  return {
    // State
    refreshing,
    loading,
    error,
    advancedStats,

    // Computed values
    displayName,
    availableTrainingDays,
    daysToShow,

    // Actions
    onRefresh,
    loadAdvancedData,
  };
};
