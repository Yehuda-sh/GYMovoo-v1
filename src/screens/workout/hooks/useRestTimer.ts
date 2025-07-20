/**
 * @file src/screens/workout/hooks/useRestTimer.ts
 * @description הוק לניהול טיימר מנוחה בין סטים - גרסה מעודכנת
 * English: Hook for managing rest timer between sets - updated version
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Vibration, Platform } from "react-native";

interface UseRestTimerProps {
  defaultTime?: number;
  onComplete?: () => void;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  countdownAt?: number;
}

interface UseRestTimerReturn {
  currentRestTime: number;
  totalRestTime: number;
  isActive: boolean;
  isPaused: boolean;
  progress: number;
  start: (duration?: number) => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  addTime: (seconds: number) => void;
  subtractTime: (seconds: number) => void;
  // Aliases for compatibility
  timeLeft: number;
  startRest: (duration?: number) => void;
  pauseRest: () => void;
  skipRest: () => void;
  resetRest: () => void;
}

// הגדרות רטט
const VIBRATION_PATTERNS = {
  restComplete: [0, 200, 100, 200] as number[],
  countdown: [0, 50] as number[],
};

export const useRestTimer = ({
  defaultTime = 180,
  onComplete,
  soundEnabled = true,
  vibrationEnabled = true,
  countdownAt = 3,
}: UseRestTimerProps = {}): UseRestTimerReturn => {
  const [currentRestTime, setCurrentRestTime] = useState(0);
  const [totalRestTime, setTotalRestTime] = useState(defaultTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCountdownRef = useRef<number>(countdownAt + 1);

  // ניהול טיימר
  useEffect(() => {
    if (isActive && !isPaused && currentRestTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentRestTime((prev) => {
          const newTime = prev - 1;

          // רטט בספירה לאחור
          if (
            newTime <= countdownAt &&
            newTime > 0 &&
            newTime < lastCountdownRef.current
          ) {
            lastCountdownRef.current = newTime;
            if (vibrationEnabled && Platform.OS !== "web") {
              Vibration.vibrate(VIBRATION_PATTERNS.countdown);
            }
          }

          // סיום טיימר
          if (newTime === 0) {
            handleComplete();
          }

          return newTime;
        });
      }, 1000);
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
  }, [isActive, isPaused, currentRestTime, countdownAt, vibrationEnabled]);

  // טיפול בסיום
  const handleComplete = useCallback(() => {
    setIsActive(false);
    setCurrentRestTime(0);
    lastCountdownRef.current = countdownAt + 1;

    if (vibrationEnabled && Platform.OS !== "web") {
      Vibration.vibrate(VIBRATION_PATTERNS.restComplete);
    }

    onComplete?.();
  }, [countdownAt, vibrationEnabled, onComplete]);

  // התחל מנוחה
  const start = useCallback(
    (duration?: number) => {
      const restDuration = duration || defaultTime;
      setTotalRestTime(restDuration);
      setCurrentRestTime(restDuration);
      setIsActive(true);
      setIsPaused(false);
      lastCountdownRef.current = countdownAt + 1;
    },
    [defaultTime, countdownAt]
  );

  // השהה מנוחה
  const pause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // דלג על מנוחה
  const skip = useCallback(() => {
    setIsActive(false);
    setCurrentRestTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // הוסף זמן
  const addTime = useCallback((seconds: number) => {
    setCurrentRestTime((prev) => prev + seconds);
    setTotalRestTime((prev) => prev + seconds);
  }, []);

  // הורד זמן
  const subtractTime = useCallback((seconds: number) => {
    setCurrentRestTime((prev) => Math.max(0, prev - seconds));
    setTotalRestTime((prev) => Math.max(0, prev - seconds));
  }, []);

  // אפס טיימר
  const reset = useCallback(() => {
    setIsActive(false);
    setCurrentRestTime(0);
    setTotalRestTime(defaultTime);
    setIsPaused(false);
    lastCountdownRef.current = countdownAt + 1;
  }, [defaultTime, countdownAt]);

  // חשב התקדמות
  const progress =
    totalRestTime > 0 ? (totalRestTime - currentRestTime) / totalRestTime : 0;

  return {
    currentRestTime,
    totalRestTime,
    isActive,
    isPaused,
    progress,
    start,
    pause,
    reset,
    skip,
    addTime,
    subtractTime,
    // Aliases for backward compatibility
    timeLeft: currentRestTime,
    startRest: start,
    pauseRest: pause,
    skipRest: skip,
    resetRest: reset,
  };
};
