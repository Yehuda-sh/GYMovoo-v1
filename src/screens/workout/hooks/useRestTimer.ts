/**
 * @file src/screens/workout/hooks/useRestTimer.ts
 * @description הוק לניהול טיימר מנוחה בין סטים עם שיפורי ביצועים
 * English: Hook for managing rest timer between sets with performance improvements
 * @updated 2025-01-31 שיפורי ביצועים ועקביות עם useWorkoutTimer
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Vibration } from "react-native";

export interface UseRestTimerReturn {
  isRestTimerActive: boolean;
  restTimeRemaining: number;
  startRestTimer: (duration: number, exerciseName?: string) => void;
  pauseRestTimer: () => void;
  resumeRestTimer: () => void;
  skipRestTimer: () => void;
  addRestTime: (seconds: number) => void;
  subtractRestTime: (seconds: number) => void;
  currentExerciseName?: string;
}

export const useRestTimer = (): UseRestTimerReturn => {
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentExerciseName, setCurrentExerciseName] = useState<string>();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  const lastVibrationRef = useRef<number>(0); // למניעת רטט חוזר

  // נקה interval בסיום עם flag למניעת memory leaks
  // Clear interval on unmount with flag to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // סיום טיימר - הגדרה מוקדמת עם useCallback
  // Complete timer - early definition with useCallback
  const completeRestTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRestTimerActive(false);
    setRestTimeRemaining(0);
    setIsPaused(false);
    setCurrentExerciseName(undefined);

    // רטט ארוך בסיום
    // Long vibration at end
    Vibration.vibrate([0, 300, 100, 300]);
  }, []);
  useEffect(() => {
    if (isRestTimerActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          return; // Prevent updates after unmount
        }

        const remaining = Math.ceil((endTimeRef.current - Date.now()) / 1000);

        if (remaining <= 0) {
          // סיום זמן מנוחה
          // Rest time ended
          completeRestTimer();
        } else {
          setRestTimeRemaining(remaining);

          // רטט בשניות האחרונות - אבל לא בכל iteration
          // Vibrate in last seconds - but not every iteration
          if (remaining <= 3 && remaining !== lastVibrationRef.current) {
            lastVibrationRef.current = remaining;
            Vibration.vibrate(100);
          }
        }
      }, 100); // עדכון כל 100ms לדיוק
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
  }, [isRestTimerActive, isPaused, completeRestTimer]);

  // התחל טיימר מנוחה
  // Start rest timer
  const startRestTimer = useCallback(
    (duration: number, exerciseName?: string) => {
      endTimeRef.current = Date.now() + duration * 1000;
      setRestTimeRemaining(duration);
      setIsRestTimerActive(true);
      setIsPaused(false);
      setCurrentExerciseName(exerciseName);
      lastVibrationRef.current = 0; // איפוס רטט

      // רטט בהתחלה
      // Vibrate at start
      Vibration.vibrate(200);
    },
    []
  );

  // השהה טיימר
  // Pause timer
  const pauseRestTimer = useCallback(() => {
    if (isRestTimerActive && !isPaused) {
      setIsPaused(true);
      // שמור את הזמן שנותר
      // Save remaining time
      endTimeRef.current = Date.now() + restTimeRemaining * 1000;
    }
  }, [isRestTimerActive, isPaused, restTimeRemaining]);

  // המשך טיימר
  // Resume timer
  const resumeRestTimer = useCallback(() => {
    if (isRestTimerActive && isPaused) {
      setIsPaused(false);
      // חשב מחדש את זמן הסיום
      // Recalculate end time
      endTimeRef.current = Date.now() + restTimeRemaining * 1000;
    }
  }, [isRestTimerActive, isPaused, restTimeRemaining]);

  // דלג על טיימר
  // Skip timer
  const skipRestTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRestTimerActive(false);
    setRestTimeRemaining(0);
    setIsPaused(false);
    setCurrentExerciseName(undefined);
  }, []);

  // הוסף זמן לטיימר
  // Add time to timer
  const addRestTime = useCallback(
    (seconds: number) => {
      if (isRestTimerActive) {
        endTimeRef.current += seconds * 1000;
        const newRemaining = Math.ceil(
          (endTimeRef.current - Date.now()) / 1000
        );
        setRestTimeRemaining(Math.max(0, newRemaining));
      }
    },
    [isRestTimerActive]
  );

  // הפחת זמן מהטיימר
  // Subtract time from timer
  const subtractRestTime = useCallback(
    (seconds: number) => {
      if (isRestTimerActive) {
        endTimeRef.current -= seconds * 1000;
        const newRemaining = Math.ceil(
          (endTimeRef.current - Date.now()) / 1000
        );
        if (newRemaining <= 0) {
          completeRestTimer();
        } else {
          setRestTimeRemaining(newRemaining);
        }
      }
    },
    [isRestTimerActive, completeRestTimer]
  );

  return useMemo(
    () => ({
      isRestTimerActive,
      restTimeRemaining,
      startRestTimer,
      pauseRestTimer,
      resumeRestTimer,
      skipRestTimer,
      addRestTime,
      subtractRestTime,
      currentExerciseName,
    }),
    [
      isRestTimerActive,
      restTimeRemaining,
      startRestTimer,
      pauseRestTimer,
      resumeRestTimer,
      skipRestTimer,
      addRestTime,
      subtractRestTime,
      currentExerciseName,
    ]
  );
};
