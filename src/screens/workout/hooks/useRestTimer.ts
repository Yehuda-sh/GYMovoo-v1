/**
 * @file src/screens/workout/hooks/useRestTimer.ts
 * @description הוק לניהול טיימר מנוחה בין סטים
 * @updated 2025-09-03 Simplified - removed unused features
 *
 * ✅ ACTIVE & SIMPLIFIED: Hook טיימר מנוחה בשימוש פעיל
 * - ActiveWorkoutScreen.tsx: ניהול זמני מנוחה בין סטים
 *
 * @features
 * - ⏱️ טיימר מדויק עם עדכון כל 100ms
 * - 📳 רטט חכם: התחלה, אזהרות וסיום
 * - ➕➖ הוספה/הפחתה דינמית של זמן
 * - 🔄 דילוג על טיימר
 * - 🛡️ הגנה מפני memory leaks
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { triggerVibration } from "../../../utils";

export interface UseRestTimerReturn {
  isRestTimerActive: boolean;
  restTimeRemaining: number;
  startRestTimer: (duration: number, exerciseName?: string) => void;
  skipRestTimer: () => void;
  addRestTime: (seconds: number) => void;
  subtractRestTime: (seconds: number) => void;
}

/**
 * Hook לניהול טיימר מנוחה
 */
export const useRestTimer = (): UseRestTimerReturn => {
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  const lastVibrationRef = useRef<number>(0);

  const completeRestTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRestTimerActive(false);
    setRestTimeRemaining(0);

    triggerVibration("long");
  }, []);

  useEffect(() => {
    if (isRestTimerActive) {
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          return;
        }

        const remaining = Math.ceil((endTimeRef.current - Date.now()) / 1000);

        if (remaining <= 0) {
          completeRestTimer();
        } else {
          setRestTimeRemaining(remaining);

          if (remaining <= 3 && remaining !== lastVibrationRef.current) {
            lastVibrationRef.current = remaining;
            triggerVibration("short");
          }
        }
      }, 100);
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
  }, [isRestTimerActive, completeRestTimer]);

  // נקיון בסיום component
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const startRestTimer = useCallback(
    (duration: number, _exerciseName?: string) => {
      endTimeRef.current = Date.now() + duration * 1000;
      setRestTimeRemaining(duration);
      setIsRestTimerActive(true);
      lastVibrationRef.current = 0;

      triggerVibration("start");
    },
    []
  );

  const skipRestTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRestTimerActive(false);
    setRestTimeRemaining(0);
  }, []);

  const addRestTime = useCallback(
    (seconds: number) => {
      if (isRestTimerActive && seconds > 0) {
        endTimeRef.current += seconds * 1000;
        const newRemaining = Math.ceil(
          (endTimeRef.current - Date.now()) / 1000
        );
        setRestTimeRemaining(Math.max(0, newRemaining));
      }
    },
    [isRestTimerActive]
  );

  const subtractRestTime = useCallback(
    (seconds: number) => {
      if (isRestTimerActive && seconds > 0) {
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

  return {
    isRestTimerActive,
    restTimeRemaining,
    startRestTimer,
    skipRestTimer,
    addRestTime,
    subtractRestTime,
  };
};
