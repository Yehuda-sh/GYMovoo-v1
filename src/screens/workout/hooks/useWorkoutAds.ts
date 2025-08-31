/**
 * @file src/screens/workout/hooks/useWorkoutAds.ts
 * @brief Custom hook for managing workout ads
 * @author GYMovoo Development Team
 */

import { useState, useEffect, useCallback } from "react";

interface UseWorkoutAdsReturn {
  // Ad states
  showStartAd: boolean;
  showEndAd: boolean;
  workoutStarted: boolean;

  // Ad actions
  setShowStartAd: (show: boolean) => void;
  setShowEndAd: (show: boolean) => void;
  setWorkoutStarted: (started: boolean) => void;

  // Convenience methods
  startWorkout: () => void;
  showEndAdForCompletion: () => void;
  hideStartAd: () => void;
  hideEndAd: () => void;
}

export const useWorkoutAds = (): UseWorkoutAdsReturn => {
  const [showStartAd, setShowStartAd] = useState(true);
  const [showEndAd, setShowEndAd] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const startWorkout = useCallback(() => {
    setWorkoutStarted(true);
  }, []);

  const showEndAdForCompletion = useCallback(() => {
    setShowEndAd(true);
  }, []);

  const hideStartAd = useCallback(() => {
    setShowStartAd(false);
  }, []);

  const hideEndAd = useCallback(() => {
    setShowEndAd(false);
  }, []);

  // Auto-start workout when component mounts
  useEffect(() => {
    if (!workoutStarted) {
      startWorkout();
    }
  }, [workoutStarted, startWorkout]);

  return {
    // Ad states
    showStartAd,
    showEndAd,
    workoutStarted,

    // Ad actions
    setShowStartAd,
    setShowEndAd,
    setWorkoutStarted,

    // Convenience methods
    startWorkout,
    showEndAdForCompletion,
    hideStartAd,
    hideEndAd,
  };
};
