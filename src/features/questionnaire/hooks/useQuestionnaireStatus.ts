/**
 * @file src/features/questionnaire/hooks/useQuestionnaireStatus.ts
 * @description Hook פשוט וממוקד לניהול מצב השלמת השאלון
 * @brief Simple and focused hook for questionnaire completion status
 */

import { useMemo } from "react";
import { useUserStore } from "../../../stores/userStore";
import { QuestionnaireStatus } from "../types";

/**
 * Hook פשוט לבדיקת מצב השאלון
 * פושט את כל ההגדרות לבדיקה אחת ברורה
 */
export const useQuestionnaireStatus = (): QuestionnaireStatus => {
  const user = useUserStore((state) => state.user);

  return useMemo(() => {
    if (!user) {
      return {
        hasData: false,
        isComplete: false,
        isStarted: false,
        isPartial: false,
        dataSource: "none",
      };
    }

    // Check if the user has any questionnaire data
    const hasData =
      !!user.questionnaireData &&
      Object.keys(user.questionnaireData).length > 0;

    let isComplete = false;

    if (hasData && user.questionnaireData?.answers) {
      // Check if essential fields exist in answers
      const answers = user.questionnaireData.answers;

      // Helper function to check if field has valid value (string or non-empty array)
      const hasValidValue = (field: string | string[] | undefined): boolean => {
        if (!field) return false;
        if (Array.isArray(field)) return field.length > 0;
        return typeof field === "string" && field.trim().length > 0;
      };

      isComplete =
        !!answers.gender &&
        !!answers.weight &&
        !!answers.height &&
        hasValidValue(answers.goals || answers.fitness_goal) && // Allow both field names
        hasValidValue(answers.availability) &&
        !!answers.workout_duration &&
        hasValidValue(answers.equipment);
    }

    return {
      hasData,
      isComplete,
      isStarted: hasData,
      isPartial: hasData && !isComplete,
      dataSource: hasData ? "smart" : "none",
      completedAt: user.questionnaireData?.metadata?.completedAt,
    };
  }, [user]);
};
