/**
 * @file src/hooks/useQuestionnaireStatus.ts
 * @description Hook פשוט וממוקד לניהול מצב השלמת השאלון
 * @brief Simple and focused hook for questionnaire completion status
 * @updated 2025-09-03 פישוט ואופטימיזציה
 */

import { useMemo } from "react";
import { useUserStore } from "../stores/userStore";

export interface QuestionnaireStatus {
  /** האם יש נתוני שאלון בכלל */
  hasQuestionnaire: boolean;
  /** האם השאלון הושלם במלואו */
  isComplete: boolean;
  /** מקור הנתונים (smart/legacy/basic) */
  dataSource: "smart" | "legacy" | "basic" | "none";
  /** תאריך השלמה */
  completedAt?: string;
}

/**
 * Hook פשוט לבדיקת מצב השאלון
 * פושט את כל ההגדרות לבדיקה אחת ברורה
 */
export const useQuestionnaireStatus = (): QuestionnaireStatus => {
  const user = useUserStore((state) => state.user);

  return useMemo(() => {
    if (!user) {
      return {
        hasQuestionnaire: false,
        isComplete: false,
        dataSource: "none",
      };
    }

    // בדיקה פשוטה לפי סדר עדיפות
    if (user.smartquestionnairedata) {
      return {
        hasQuestionnaire: true,
        isComplete: !!user.smartquestionnairedata.metadata?.completedAt,
        dataSource: "smart",
        completedAt: user.smartquestionnairedata.metadata?.completedAt,
      };
    }

    if (user.questionnairedata) {
      return {
        hasQuestionnaire: true,
        isComplete: !!user.questionnairedata.completedAt,
        dataSource: "legacy",
        completedAt: user.questionnairedata.completedAt,
      };
    }

    if (user.questionnaire) {
      return {
        hasQuestionnaire: true,
        isComplete: !!user.hasQuestionnaire, // השתמש בשדה הפשוט
        dataSource: "basic",
      };
    }

    return {
      hasQuestionnaire: false,
      isComplete: false,
      dataSource: "none",
    };
  }, [user]);
};

/**
 * Hook פשוט לבדיקה מהירה של השלמת השאלון
 */
export const useIsQuestionnaireComplete = (): boolean => {
  const { isComplete } = useQuestionnaireStatus();
  return isComplete;
};

/**
 * Hook לקבלת פרטי המשתמש עם בדיקת תקינות
 */
export const useUserWithQuestionnaire = (): {
  user: unknown; // משתמש unknown כדי להימנע מבעיות type
  status: QuestionnaireStatus;
  isReady: boolean;
} => {
  const user = useUserStore((state) => state.user);
  const status = useQuestionnaireStatus();

  return {
    user,
    status,
    isReady: !!user && status.hasQuestionnaire,
  };
};
