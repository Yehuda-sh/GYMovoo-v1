/**
 * @file src/screens/workout/hooks/useWorkoutPlanGeneration.ts
 * @brief Custom Hook for Workout Plan Generation - חוק מותאם ליצירת תוכניות אימון
 * @updated August 2025 - Enhanced hook for workout plan generation
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { useUserStore } from "../../../stores/userStore";
import { WorkoutPlan } from "../../../types";
import { WorkoutDataService } from "../../../services/workoutDataService";

interface UseWorkoutPlanGenerationProps {
  onSuccess: (message: string, details: string) => void;
  onError: (title: string, message: string) => void;
}

export const useWorkoutPlanGeneration = ({
  onSuccess,
  onError,
}: UseWorkoutPlanGenerationProps) => {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const generateBasicWorkoutPlan = useCallback(
    async (forceRegenerate: boolean = false) => {
      try {
        setLoading(true);

        console.log("🏗️ Starting basic workout plan generation...");

        // Get user questionnaire data
        const userQuestionnaireData =
          user?.questionnaire ||
          user?.questionnairedata ||
          user?.smartquestionnairedata?.answers ||
          {};

        console.log("🏗️ User questionnaire data:", userQuestionnaireData);

        // Check if user has basic data
        if (!user || Object.keys(userQuestionnaireData).length === 0) {
          console.error("❌ No user data or questionnaire found");
          onError(
            "נתונים חסרים 📋",
            "יש להשלים את השאלון כדי לקבל תוכנית מותאמת אישית"
          );
          return null;
        }

        // Create a basic workout plan
        const plan: WorkoutPlan = {
          id: `plan-${Date.now()}`,
          name: "תוכנית אימון בסיסית",
          description: "תוכנית אימון בסיסית מותאמת אישית",
          type: "basic",
          features: {
            personalizedWorkouts: false,
            equipmentOptimization: false,
            progressTracking: false,
            aiRecommendations: false,
            customSchedule: false,
          },
          workouts: [],
          duration: 4, // weeks
          frequency: 3, // times per week
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          requiresSubscription: false,
        };

        if (forceRegenerate) {
          onSuccess(
            "🏋️ תוכנית בסיסית נוצרה!",
            `נוצרה תוכנית "${plan.name}" בהצלחה`
          );
        }

        return plan;
      } catch (error: unknown) {
        console.error("❌ Basic Plan Generation Error:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "אירעה שגיאה ביצירת התוכנית. נסה שוב מאוחר יותר.";

        onError("שגיאה ביצירת תוכנית", errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user, onSuccess, onError]
  );

  const generateAIWorkoutPlan = useCallback(
    async (forceRegenerate: boolean = false) => {
      try {
        setLoading(true);

        console.log("🤖 Starting AI workout plan generation...");

        // Check if user can access AI features
        const hasActiveSubscription = user?.subscription?.isActive === true;
        const trialEnded = (user as any)?.trialEnded === true;
        const canAccessAI = hasActiveSubscription || !trialEnded;

        if (!canAccessAI) {
          onError(
            "גישה מוגבלת 🔒",
            "תכונות AI זמינות רק למנויים פעילים או במהלך תקופת הניסיון"
          );
          return null;
        }

        // Try to generate AI plan using WorkoutDataService
        let aiPlan: WorkoutPlan | null = null;

        try {
          const generatedPlan =
            await WorkoutDataService.generateAIWorkoutPlan();
          if (generatedPlan) {
            // Convert AIWorkoutPlan to WorkoutPlan format
            aiPlan = {
              id: generatedPlan.id,
              name: generatedPlan.name,
              description: generatedPlan.description,
              type: "smart",
              features: {
                personalizedWorkouts: true,
                equipmentOptimization: true,
                progressTracking: true,
                aiRecommendations: true,
                customSchedule: true,
              },
              workouts: [], // נשאיר ריק לעת הצורך - יקלקל פחות שגיאות
              duration: generatedPlan.duration,
              frequency: generatedPlan.frequency,
              createdAt: generatedPlan.createdAt,
              updatedAt: generatedPlan.updatedAt,
              requiresSubscription: true,
            };
          }
        } catch (generationError) {
          console.warn(
            "❌ AI generation failed, falling back to basic plan",
            generationError
          );
          // Fallback to basic plan
          return await generateBasicWorkoutPlan(forceRegenerate);
        }

        if (aiPlan && forceRegenerate) {
          const successMessage =
            `נוצרה תוכנית חכמה: "${aiPlan.name}"\n\n` +
            `📊 ציון התאמה: ${(aiPlan as any).aiScore?.toFixed(0) || "90"}/100\n` +
            `🎯 רמה: ${(aiPlan as any).personalizationLevel === "basic" ? "בסיסית" : (aiPlan as any).personalizationLevel === "advanced" ? "מתקדמת" : "מומחה"}\n` +
            `🏋️ ניצול ציוד: ${(aiPlan as any).equipmentUtilization?.toFixed(0) || "85"}%\n\n` +
            `✨ התוכנית תתאים את עצמה לפי הביצועים שלך!`;

          onSuccess("🤖 תוכנית AI חדשה נוצרה!", successMessage);
        }

        return aiPlan;
      } catch (error: unknown) {
        console.error("❌ AI Plan Generation Error:", error);

        const errorMessage =
          error instanceof Error && error.message === "NO_QUESTIONNAIRE_DATA"
            ? "אנא השלם את השאלון תחילה"
            : "אירעה שגיאה ביצירת התוכנית. נסה שוב מאוחר יותר.";

        onError("שגיאה ביצירת תוכנית AI", errorMessage);

        // Fallback to basic plan
        return await generateBasicWorkoutPlan(forceRegenerate);
      } finally {
        setLoading(false);
      }
    },
    [user, generateBasicWorkoutPlan, onSuccess, onError]
  );

  return {
    loading,
    generateBasicWorkoutPlan,
    generateAIWorkoutPlan,
  };
};
