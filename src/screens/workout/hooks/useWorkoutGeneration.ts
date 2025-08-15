/**
 * @file src/screens/workout/hooks/useWorkoutGeneration.ts
 * @brief Simple Custom Hook for Workout Plan Generation
 * @updated August 2025 - Simplified version for better maintainability
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { useUserStore } from "../../../stores/userStore";
import { WorkoutPlan } from "../../../types";

interface UseWorkoutGenerationProps {
  onSuccess: (message: string, details: string) => void;
  onError: (title: string, message: string) => void;
}

export const useWorkoutGeneration = ({
  onSuccess,
  onError,
}: UseWorkoutGenerationProps) => {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const generateBasicPlan = useCallback(
    async (forceRegenerate: boolean = false): Promise<WorkoutPlan | null> => {
      try {
        setLoading(true);

        if (!user) {
          onError("שגיאה", "לא נמצא משתמש");
          return null;
        }

        // Simple plan generation logic here
        const plan: WorkoutPlan = {
          id: `plan-${Date.now()}`,
          name: "תוכנית בסיסית",
          description: "תוכנית אימון בסיסית",
          type: "basic",
          features: {
            personalizedWorkouts: false,
            equipmentOptimization: false,
            progressTracking: false,
            aiRecommendations: false,
            customSchedule: false,
          },
          workouts: [],
          duration: 45,
          frequency: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          requiresSubscription: false,
        };

        if (forceRegenerate) {
          onSuccess("תוכנית נוצרה!", "תוכנית אימון בסיסית נוצרה בהצלחה");
        }

        return plan;
      } catch (error) {
        console.error("Error generating plan:", error);
        onError("שגיאה", "לא ניתן ליצור תוכנית");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user, onSuccess, onError]
  );

  const generateAIPlan = useCallback(
    async (forceRegenerate: boolean = false): Promise<WorkoutPlan | null> => {
      // Fallback to basic plan for now
      return generateBasicPlan(forceRegenerate);
    },
    [generateBasicPlan]
  );

  return {
    loading,
    generateBasicPlan,
    generateAIPlan,
  };
};
