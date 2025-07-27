/**
 * @file src/screens/workout/hooks/useWorkoutTimer.ts
 * @description הוק לניהול זמן האימון הכללי
 * English: Hook for managing overall workout duration
 */

import { useState, useEffect, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // טען זמן שמור אם יש
  // Load saved time if exists
  useEffect(() => {
    if (workoutId) {
      loadSavedTime();
    }
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

  // שמור זמן ל-AsyncStorage
  // Save time to AsyncStorage
  const saveTime = useCallback(async () => {
    if (workoutId) {
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
        // אם מסד הנתונים מלא, עצור שמירות
        const errorObj = error as { code?: number; message?: string };
        if (
          errorObj?.code === 13 ||
          errorObj?.message?.includes("SQLITE_FULL")
        ) {
          console.warn("⚠️ Database full - stopping timer saves");
          return;
        }
        console.error("Error saving time:", error);
      }
    }
  }, [workoutId, elapsedTime, isRunning]);

  // עדכן טיימר
  // Update timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // שמור כל 10 שניות
  // Save every 10 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (isRunning) {
        saveTime();
      }
    }, 10000);

    return () => clearInterval(saveInterval);
  }, [isRunning, saveTime]);

  // התחל טיימר
  // Start timer
  const startTimer = useCallback(() => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
  }, []);

  // השהה טיימר
  // Pause timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    saveTime();
  }, [saveTime]);

  // אפס טיימר
  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    setLastLap(0);
    if (workoutId) {
      AsyncStorage.removeItem(`workout_time_${workoutId}`);
    }
  }, [workoutId]);

  // חשב זמן בין תרגילים
  // Calculate lap time
  const lapTime = useCallback(() => {
    const currentLap = elapsedTime - lastLap;
    setLastLap(elapsedTime);
    return currentLap;
  }, [elapsedTime, lastLap]);

  // פורמט זמן לתצוגה
  // Format time for display
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

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
