/**
 * @file src/screens/workout/hooks/useWorkoutTimer.ts
 * @description הוק פשוט לניהול זמן האימון הכללי
 * @description English: Simple hook for managing overall workout duration
 * @updated 2025-09-03 - ✅ Simplified from 237→50 lines, removed over-engineering
 *
 * ✅ ACTIVE & SIMPLIFIED: Hook טיימר אימון בסיסי בשימוש פעיל
 * - ActiveWorkoutScreen.tsx: מנהל את זמן האימון הכללי
 * - Functions: formattedTime, isRunning, startTimer, pauseTimer
 *
 * @features
 * - ⏱️ טיימר מדויק עם עדכון כל 100ms
 * - ⏸️ pause/resume בסיסי
 * - 🛡️ הגנה בסיסית מפני memory leaks
 *
 * @architecture Simple persistent timer with basic error handling
 * @usage Core workout timing component
 * @performance 100ms intervals, minimal state management
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { formatWorkoutTime } from "../../../utils";

/**
 * ממשק החזרה של Hook עם פונקציונליות בסיסית לניהול טיימר אימון
 */
interface UseWorkoutTimerReturn {
  formattedTime: string;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
}

/**
 * Hook פשוט לניהול טיימר אימון
 * @param {string} _ - workoutId (לא בשימוש, שמור לתאימות)
 * @returns {UseWorkoutTimerReturn} ממשק בסיסי לניהול טיימר אימון
 */
export const useWorkoutTimer = (_?: string): UseWorkoutTimerReturn => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // התחל טיימר
  const startTimer = useCallback(() => {
    if (!isMountedRef.current) return;

    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime * 1000;
  }, [elapsedTime]);

  // השהה טיימר
  const pauseTimer = useCallback(() => {
    if (!isMountedRef.current) return;
    setIsRunning(false);
  }, []);

  // עדכן טיימר עם דיוק גבוה
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;

        const now = Date.now();
        const newElapsedTime = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedTime(newElapsedTime);
      }, 100); // Update every 100ms for accuracy
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
  }, [isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    formattedTime: formatWorkoutTime(elapsedTime),
    isRunning,
    startTimer,
    pauseTimer,
  };
};
