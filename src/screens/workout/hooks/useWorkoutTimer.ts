/**
 * @file src/screens/workout/hooks/useWorkoutTimer.ts
 * @description הוק לניהול זמן האימון הכללי עם שיפורי ביצועים ועקביות
 * English: Hook for managing overall workout duration with performance improvements
 * @updated 2025-01-31 שיפורי ביצועים, דיוק זמן, וטיפול בשגיאות
 */

import { useState, useEffect, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "../../../utils/workoutHelpers";

interface UseWorkoutTimerReturn {
  elapsedTime: number;
  formattedTime: string;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  lapTime: () => number; // זמן בין תרגילים
}

export const useWorkoutTimer = (workoutId?: string): UseWorkoutTimerReturn => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastLap, setLastLap] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // טען זמן שמור אם יש
  // Load saved time if exists
  useEffect(() => {
    if (workoutId) {
      loadSavedTime();
    }

    // Cleanup flag on unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [workoutId]);

  // טען זמן מ-AsyncStorage
  // Load time from AsyncStorage
  const loadSavedTime = async () => {
    try {
      const savedTime = await AsyncStorage.getItem(`workout_time_${workoutId}`);
      if (savedTime) {
        const parsed = JSON.parse(savedTime);
        setElapsedTime(parsed.elapsed || 0);
        if (parsed.isRunning) {
          startTimer();
        }
      }
    } catch (error) {
      console.error("Error loading saved time:", error);
    }
  };

  // שמור זמן ל-AsyncStorage עם טיפול מחוזק בשגיאות
  // Save time to AsyncStorage with enhanced error handling
  const saveTime = useCallback(async () => {
    if (!workoutId || !isMountedRef.current) return;

    try {
      await AsyncStorage.setItem(
        `workout_time_${workoutId}`,
        JSON.stringify({
          elapsed: elapsedTime,
          isRunning,
          lastSaved: new Date().toISOString(),
        })
      );
    } catch (error: unknown) {
      // טיפול מחוזק בשגיאות עם אבחון ספציפי
      const errorObj = error as {
        code?: number;
        message?: string;
        name?: string;
      };

      if (errorObj?.code === 13 || errorObj?.message?.includes("SQLITE_FULL")) {
        console.warn("⚠️ Storage full - pausing timer auto-saves");
        return;
      }

      if (errorObj?.name === "QuotaExceededError") {
        console.warn("⚠️ Storage quota exceeded - clearing old workout data");
        // Clean up old workout timer data
        const keys = await AsyncStorage.getAllKeys();
        const workoutKeys = keys.filter((key) =>
          key.startsWith("workout_time_")
        );
        if (workoutKeys.length > 5) {
          // Keep only the 5 most recent
          const oldKeys = workoutKeys.slice(0, -5);
          await AsyncStorage.multiRemove(oldKeys);
        }
        return;
      }

      console.error("Workout timer save error:", error);
    }
  }, [workoutId, elapsedTime, isRunning]);

  // עדכן טיימר עם דיוק גבוה יותר ומניעת memory leaks
  // Update timer with higher accuracy and memory leak prevention
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;

      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          return; // Prevent updates after unmount
        }

        const now = Date.now();
        const newElapsedTime = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedTime(newElapsedTime);
      }, 100); // Update every 100ms for better accuracy, consistent with useRestTimer
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, elapsedTime]);

  // שמור כל 10 שניות עם שיפור יעילות
  // Save every 10 seconds with improved efficiency
  useEffect(() => {
    if (!workoutId || !isRunning) return;

    const saveInterval = setInterval(() => {
      if (isMountedRef.current) {
        saveTime();
      }
    }, 10000);

    return () => clearInterval(saveInterval);
  }, [isRunning, saveTime, workoutId]);

  // התחל טיימר עם שיפור דיוק
  // Start timer with improved accuracy
  const startTimer = useCallback(() => {
    if (!isMountedRef.current) return;

    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime * 1000;
  }, [elapsedTime]);

  // השהה טיימר עם שמירה מיידית
  // Pause timer with immediate save
  const pauseTimer = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsRunning(false);
    await saveTime();
  }, [saveTime]);

  // אפס טיימר עם ניקוי מלא
  // Reset timer with complete cleanup
  const resetTimer = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsRunning(false);
    setElapsedTime(0);
    setLastLap(0);

    if (workoutId) {
      try {
        await AsyncStorage.removeItem(`workout_time_${workoutId}`);
      } catch (error) {
        console.error("Error removing saved time:", error);
      }
    }
  }, [workoutId]);

  // חשב זמן בין תרגילים
  // Calculate lap time
  const lapTime = useCallback(() => {
    const currentLap = elapsedTime - lastLap;
    setLastLap(elapsedTime);
    return currentLap;
  }, [elapsedTime, lastLap]);

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    lapTime,
  };
};
