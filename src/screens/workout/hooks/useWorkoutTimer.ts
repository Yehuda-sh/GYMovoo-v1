/**
 * @file src/screens/workout/hooks/useWorkoutTimer.ts
 * @description הוק לניהול זמן האימון הכללי עם שיפורי ביצועים ועקביות מתקדמים
 * @description English: Hook for managing overall workout duration with advanced performance improvements
 * @updated 2025-01-17 Enhanced documentation and dependency fix for audit completion
 *
 * ✅ ACTIVE & CRITICAL: Hook טיימר אימון מרכזי בשימוש קריטי
 * - ActiveWorkoutScreen.tsx: מנהל את זמן האימון הכללי
 * - README.md: תיעוד מקיף עם דוגמאות שימוש
 * - AsyncStorage persistence: שמירה אוטומטית כל 10 שניות
 * - Error handling: טיפול מתקדם בבעיות storage וזיכרון
 *
 * @features
 * - ⏱️ טיימר מדויק עם עדכון כל 100ms (עקבי עם useRestTimer)
 * - 💾 שמירה אוטומטית ב-AsyncStorage עם recovery
 * - 🔄 lap timing למדידת זמן בין תרגילים
 * - 🛡️ הגנה מפני memory leaks ובעיות storage
 * - 📱 ניהול חכם של quota exceeded ו-storage full
 * - ⏸️ pause/resume עם שמירה מיידית
 *
 * @architecture High-precision persistent timer with intelligent error handling
 * @usage Core workout timing component with automatic state persistence
 * @performance 100ms intervals, optimized AsyncStorage operations
 * @reliability Memory leak prevention, storage quota management, graceful degradation
 */

import { useState, useEffect, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "../../../utils";

/**
 * ממשק החזרה של Hook עם פונקציונליות מלאה לניהול טיימר אימון
 */
interface UseWorkoutTimerReturn {
  elapsedTime: number;
  formattedTime: string;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  lapTime: () => number; // זמן בין תרגילים
}

/**
 * Hook מתקדם לניהול טיימר אימון עם persistence ו-error handling
 * @param {string} workoutId - מזהה האימון לשמירה ב-AsyncStorage
 * @returns {UseWorkoutTimerReturn} ממשק מלא לניהול טיימר אימון
 */
export const useWorkoutTimer = (workoutId?: string): UseWorkoutTimerReturn => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastLap, setLastLap] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // התחל טיימר עם שיפור דיוק - הגדרה מוקדמת
  // Start timer with improved accuracy - early definition
  const startTimer = useCallback(() => {
    if (!isMountedRef.current) return;

    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime * 1000;
  }, [elapsedTime]);

  // טען זמן מ-AsyncStorage עם useCallback לפתרון dependency warning
  // Load time from AsyncStorage with useCallback to fix dependency warning
  const loadSavedTime = useCallback(async () => {
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
  }, [workoutId, startTimer]);

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
  }, [workoutId, loadSavedTime]);

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
