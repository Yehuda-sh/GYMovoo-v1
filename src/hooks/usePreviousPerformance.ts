/**
 * @file src/hooks/usePreviousPerformance.ts
 * @description Hook לקבלת ביצועים קודמים של תרגילים
 * English: Hook for getting previous exercise performances
 */

import { useState, useEffect } from "react";
import {
  workoutHistoryService,
  PreviousPerformance,
} from "../services/workoutHistoryService";

export const usePreviousPerformance = (exerciseName: string) => {
  const [previousPerformance, setPreviousPerformance] =
    useState<PreviousPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreviousPerformance();
  }, [exerciseName]);

  const loadPreviousPerformance = async () => {
    try {
      setLoading(true);
      const performance =
        await workoutHistoryService.getPreviousPerformanceForExercise(
          exerciseName
        );
      setPreviousPerformance(performance);
    } catch (error) {
      console.error("Error loading previous performance:", error);
      setPreviousPerformance(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    previousPerformance,
    loading,
    refetch: loadPreviousPerformance,
  };
};
