/**
 * @file src/hooks/useQuestionnaireStatus.ts
 * @description Hook מרכזי לניהול מצב השלמת השאלון
 * @brief Centralized hook for questionnaire completion status management
 * @created 2025-08-17
 */

import { useMemo } from "react";
import { useUserStore } from "../stores/userStore";
import type { User, QuestionnaireBasicData } from "../types";

export interface QuestionnaireStatus {
  /** האם יש נתוני שאלון בכלל */
  hasQuestionnaire: boolean;
  /** האם השאלון הושלם במלואו */
  isComplete: boolean;
  /** האם יש שלב אימון */
  hasTrainingStage: boolean;
  /** האם יש שלב פרופיל */
  hasProfileStage: boolean;
  /** מקור הנתונים (smart/legacy/basic) */
  dataSource: "smart" | "legacy" | "basic" | "none";
  /** תאריך השלמה */
  completedAt?: string;
}

/**
 * Hook מרכזי לבדיקת מצב השאלון
 * הוא מאחד את כל ההגדרות הקיימות לבדיקת השלמת שאלון
 */
export const useQuestionnaireStatus = (): QuestionnaireStatus => {
  const { user } = useUserStore();

  return useMemo(() => {
    if (!user) {
      return {
        hasQuestionnaire: false,
        isComplete: false,
        hasTrainingStage: false,
        hasProfileStage: false,
        dataSource: "none",
      };
    }

    // בדיקת מקור הנתונים בסדר עדיפות
    let dataSource: QuestionnaireStatus["dataSource"] = "none";
    let completedAt: string | undefined;

    if (user.smartquestionnairedata) {
      dataSource = "smart";
      completedAt = user.smartquestionnairedata.metadata?.completedAt;
    } else if (user.questionnairedata) {
      dataSource = "legacy";
      completedAt = user.questionnairedata.completedAt;
    } else if (user.questionnaire) {
      dataSource = "basic";
    }

    const hasQuestionnaire = dataSource !== "none";

    // בדיקת שלב אימון
    const hasTrainingStage =
      (dataSource === "smart" && !!user.smartquestionnairedata) ||
      (dataSource === "legacy" && !!user.questionnairedata) ||
      (dataSource === "basic" &&
        !!(user.questionnaire as QuestionnaireBasicData)?.age &&
        !!(user.questionnaire as QuestionnaireBasicData)?.goals);

    // בדיקת שלב פרופיל
    const hasProfileStage =
      (dataSource === "smart" && !!user.smartquestionnairedata) ||
      (dataSource === "legacy" && !!user.questionnairedata) ||
      (dataSource === "basic" &&
        !!(user.questionnaire as QuestionnaireBasicData)?.gender);

    // בדיקת השלמה מלאה
    const isComplete =
      (dataSource === "smart" &&
        !!user.smartquestionnairedata?.metadata?.completedAt) ||
      (dataSource === "legacy" && !!user.questionnairedata?.completedAt) ||
      (dataSource === "basic" && hasTrainingStage && hasProfileStage) ||
      !!user.hasQuestionnaire; // הסתמכות על השדה החדש שהוספנו

    return {
      hasQuestionnaire,
      isComplete,
      hasTrainingStage,
      hasProfileStage,
      dataSource,
      completedAt,
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
  user: User | null;
  status: QuestionnaireStatus;
  isReady: boolean;
} => {
  const { user } = useUserStore();
  const status = useQuestionnaireStatus();

  return {
    user,
    status,
    isReady: !!user && status.hasQuestionnaire,
  };
};
