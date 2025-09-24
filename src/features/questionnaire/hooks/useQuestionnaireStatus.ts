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

    const qd = user.questionnaireData;
    const ans = qd?.answers as Record<string, unknown> | undefined;

    // יש נתוני שאלון בכלל?
    const hasData = !!qd && !!ans && Object.keys(ans).length > 0;

    // אם אין תשובות – אי־אפשר להיות מושלם
    if (!hasData || !ans) {
      return {
        hasData: !!qd,
        isComplete: false,
        isStarted: !!qd,
        isPartial: false,
        dataSource: "none",
        completedAt: qd?.metadata?.completedAt,
      };
    }

    // עזרי ולידציה גנריים
    const hasNonEmptyArray = (v: unknown): boolean =>
      Array.isArray(v) && v.length > 0;

    const hasNonEmptyString = (v: unknown): boolean =>
      typeof v === "string" && v.trim().length > 0;

    const isPositiveNumber = (v: unknown): boolean =>
      typeof v === "number" && Number.isFinite(v) && v > 0;

    // תמיכה בשם שדה ישן/חדש:
    // goals / fitness_goal
    const goalsOk =
      hasNonEmptyArray(ans["goals"]) || hasNonEmptyString(ans["fitness_goal"]);

    // availability - תמיכה בarray וstring
    const availabilityOk =
      hasNonEmptyArray(ans["availability"]) ||
      hasNonEmptyString(ans["availability"]);

    // sessionDuration (חדש) / workout_duration (ישן)
    const durationOk =
      hasNonEmptyString(ans["sessionDuration"]) ||
      hasNonEmptyString(ans["workout_duration"]);

    // equipment (array) - תמיכה בשמות שדה שונים
    const equipmentOk =
      hasNonEmptyArray(ans["equipment"]) ||
      hasNonEmptyArray(ans["equipment_available"]);

    // gender (string)
    const genderOk = hasNonEmptyString(ans["gender"]);

    // weight/height יכולים להיות מספרים (במערכת החכמה) או מחרוזות (בגרסאות ישנות)
    const weightOk =
      isPositiveNumber(ans["weight"]) || hasNonEmptyString(ans["weight"]);
    const heightOk =
      isPositiveNumber(ans["height"]) || hasNonEmptyString(ans["height"]);

    // תנאי השלמה “הכרחיים”
    const isComplete =
      genderOk &&
      weightOk &&
      heightOk &&
      goalsOk &&
      availabilityOk &&
      durationOk &&
      equipmentOk;

    return {
      hasData,
      isComplete,
      isStarted: hasData,
      isPartial: hasData && !isComplete,
      dataSource: hasData ? "smart" : "none",
      completedAt: qd?.metadata?.completedAt,
    } as QuestionnaireStatus;
  }, [user]);
};
