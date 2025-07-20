/**
 * @file src/screens/workout/hooks/useRestTimer.ts
 * @description הוק לניהול טיימר מנוחה בין סטים - גרסה פשוטה
 * English: Hook for managing rest timer between sets - simplified version
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Vibration, Platform } from "react-native";

interface UseRestTimerProps {
  defaultTime?: number;
  onComplete?: () => void;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  countdownAt?: number; // התחל ספירה לאחור ב-X שניות
}

interface UseRestTimerReturn {
  timeLeft: number;
  isActive: boolean;
  progress: number; // 0-1 לאנימציות
  startRest: (duration?: number) => void;
  pauseRest: () => void;
  skipRest: () => void;
  addTime: (seconds: number) => void;
  subtractTime: (seconds: number) => void;
  resetRest: () => void;
}

// הגדרות רטט מקומיות
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
}: UseRestTimerProps): UseRestTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(defaultTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCountdownRef = useRef<number>(countdownAt + 1);

  // ניהול טיימר
  // Manage timer
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          // רטט בספירה לאחור
          // Countdown vibration
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
          // Timer complete
          if (newTime === 0) {
            handleComplete();
          }

          return newTime;
        });
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
  }, [isActive, isPaused, timeLeft, countdownAt, vibrationEnabled]);

  // טיפול בסיום
  // Handle completion
  const handleComplete = useCallback(() => {
    setIsActive(false);
    setTimeLeft(0);
    lastCountdownRef.current = countdownAt + 1;

    if (vibrationEnabled && Platform.OS !== "web") {
      Vibration.vibrate(VIBRATION_PATTERNS.restComplete);
    }

    onComplete?.();
  }, [countdownAt, vibrationEnabled, onComplete]);

  // התחל מנוחה
  // Start rest
  const startRest = useCallback(
    (duration?: number) => {
      const restDuration = duration || defaultTime;
      setTotalTime(restDuration);
      setTimeLeft(restDuration);
      setIsActive(true);
      setIsPaused(false);
      lastCountdownRef.current = countdownAt + 1;
    },
    [defaultTime, countdownAt]
  );

  // השהה מנוחה
  // Pause rest
  const pauseRest = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  // דלג על מנוחה
  // Skip rest
  const skipRest = useCallback(() => {
    setIsActive(false);
    setTimeLeft(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // הוסף זמן
  // Add time
  const addTime = useCallback((seconds: number) => {
    setTimeLeft((prev) => prev + seconds);
    setTotalTime((prev) => prev + seconds);
  }, []);

  // הורד זמן
  // Subtract time
  const subtractTime = useCallback((seconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev - seconds));
  }, []);

  // אפס טיימר
  // Reset timer
  const resetRest = useCallback(() => {
    setIsActive(false);
    setTimeLeft(0);
    setTotalTime(defaultTime);
    lastCountdownRef.current = countdownAt + 1;
  }, [defaultTime, countdownAt]);

  // חשב התקדמות
  // Calculate progress
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;

  return {
    timeLeft,
    isActive,
    progress,
    startRest,
    pauseRest,
    skipRest,
    addTime,
    subtractTime,
    resetRest,
  };
};
