/**
 * @file useRestTimer.ts
 * @description טיימר מנוחה פשוט
 */

import { useState, useEffect, useRef, useCallback } from "react";

export const useRestTimer = () => {
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // נקה טיימר בסגירה
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRestTimer = useCallback((duration: number) => {
    // נקה טיימר קודם אם יש
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setRestTimeRemaining(duration);
    setIsRestTimerActive(true);

    intervalRef.current = setInterval(() => {
      setRestTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRestTimerActive(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const skipRestTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRestTimerActive(false);
    setRestTimeRemaining(0);
  }, []);

  const addRestTime = useCallback(
    (seconds: number) => {
      if (isRestTimerActive) {
        setRestTimeRemaining((prev) => prev + seconds);
      }
    },
    [isRestTimerActive]
  );

  const subtractRestTime = useCallback(
    (seconds: number) => {
      if (isRestTimerActive) {
        setRestTimeRemaining((prev) => {
          const newTime = prev - seconds;
          if (newTime <= 0) {
            skipRestTimer();
            return 0;
          }
          return newTime;
        });
      }
    },
    [isRestTimerActive, skipRestTimer]
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
