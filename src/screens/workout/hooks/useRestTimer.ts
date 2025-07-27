/**
 * @file src/screens/workout/hooks/useRestTimer.ts
 * @description הוק לניהול טיימר מנוחה בין סטים
 * English: Hook for managing rest timer between sets
 */

import { useState, useEffect, useRef, useCallback } from "react";
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

  // נקה interval בסיום
  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // עדכון טיימר
  // Update timer
  useEffect(() => {
    if (isRestTimerActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        const remaining = Math.ceil((endTimeRef.current - Date.now()) / 1000);

        if (remaining <= 0) {
          // סיום זמן מנוחה
          // Rest time ended
          completeRestTimer();
        } else {
          setRestTimeRemaining(remaining);

          // רטט בשניות האחרונות
          // Vibrate in last seconds
          if (remaining <= 3) {
            Vibration.vibrate(100);
          }
        }
      }, 100); // עדכון כל 100ms לדיוק
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
  }, [isRestTimerActive, isPaused]);

  // התחל טיימר מנוחה
  // Start rest timer
  const startRestTimer = useCallback(
    (duration: number, exerciseName?: string) => {
      endTimeRef.current = Date.now() + duration * 1000;
      setRestTimeRemaining(duration);
      setIsRestTimerActive(true);
      setIsPaused(false);
      setCurrentExerciseName(exerciseName);

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

  // סיום טיימר
  // Complete timer
  const completeRestTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRestTimerActive(false);
    setRestTimeRemaining(0);
    setIsPaused(false);
    setCurrentExerciseName(undefined);

    // רטט ארוך בסיום
    // Long vibration at end
    Vibration.vibrate([0, 300, 100, 300]);
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
    [isRestTimerActive]
  );

  return {
    isRestTimerActive,
    restTimeRemaining,
    startRestTimer,
    pauseRestTimer,
    resumeRestTimer,
    skipRestTimer,
    addRestTime,
    subtractRestTime,
    currentExerciseName,
  };
};
