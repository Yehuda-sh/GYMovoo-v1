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
      isComplete =
        !!answers.gender &&
        !!answers.weight &&
        !!answers.height &&
        !!answers.goals &&
        Array.isArray(answers.goals) &&
        answers.goals.length > 0 &&
        !!answers.availability &&
        Array.isArray(answers.availability) &&
        answers.availability.length > 0 &&
        !!answers.workout_duration &&
        !!answers.equipment &&
        Array.isArray(answers.equipment) &&
        answers.equipment.length > 0;
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
