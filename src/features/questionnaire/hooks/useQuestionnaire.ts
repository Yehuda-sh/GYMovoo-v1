/**
 * @file src/features/questionnaire/hooks/useQuestionnaire.ts
 * @description Custom hook for managing the questionnaire state and actions
 */

import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../../../stores/userStore";
import { UnifiedQuestionnaireManager } from "../data";
import type {
  Question,
  QuestionOption,
  QuestionnaireAnswer,
  QuestionnaireData,
} from "../types";
import { logger } from "../../../utils/logger";

// Storage key constant for questionnaire draft data
const DRAFT_STORAGE_KEY = "questionnaire_draft";

type RestorePayload = { answers: QuestionnaireAnswer[] };

interface UseQuestionnaireReturn {
  // State
  currentQuestion: Question | null;
  selectedOptions: QuestionOption[];
  isLoading: boolean;
  progress: number;

  // Derived
  canGoBack: boolean;
  isCompleted: boolean;

  // Actions
  handleSelectOption: (option: QuestionOption) => void;
  handleNext: () => Promise<void>;
  handlePrevious: () => void;
  completeQuestionnaire: () => Promise<QuestionnaireData | null>;
  resetQuestionnaire: () => Promise<void>;
  loadCurrentQuestion: () => void;

  // Utils
  checkForSavedProgress: () => Promise<boolean>;
  restoreProgress: (progressData: RestorePayload) => void;
}

export const useQuestionnaire = (): UseQuestionnaireReturn => {
  const { setSmartQuestionnaireData } = useUserStore();

  // Manager נשמר ב-state כדי לשמור על רפרנס יציב לאורך חיי הקומפ'
  const [manager] = useState(() => new UnifiedQuestionnaireManager());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);

  // Load current question + hydrate selected options for it
  const loadCurrentQuestion = useCallback(() => {
    try {
      const question = manager.getCurrentQuestion();
      setCurrentQuestion(question ?? null);

      if (question) {
        const allAnswers = manager.getAllAnswers();
        const currentAnswers = allAnswers.find(
          (a) => a.questionId === question.id
        );

        if (currentAnswers) {
          const answers = Array.isArray(currentAnswers.answer)
            ? currentAnswers.answer
            : [currentAnswers.answer];
          setSelectedOptions(answers);
        } else {
          setSelectedOptions([]);
        }

        setProgress(manager.getProgress());
      } else {
        // אין שאלה נוכחית (סוף), עדכן פרוגרס ל-100 אם יש תשובות
        const answered = manager.getAllAnswers().length;
        setProgress(answered > 0 ? 100 : 0);
      }
    } catch (error) {
      logger.error("useQuestionnaire", "Error loading question", error);
    }
  }, [manager]);

  // Restore progress from saved data
  const restoreProgress = useCallback(
    (progressData: RestorePayload) => {
      try {
        if (!progressData?.answers || !Array.isArray(progressData.answers))
          return;

        manager.reset();

        // החזרת תשובות
        for (const answer of progressData.answers) {
          if (answer?.questionId && answer?.answer) {
            manager.answerQuestion(answer.questionId, answer.answer);
          }
        }

        // דילוג קדימה עד לשאלה שלא נענתה (או סוף)
        while (true) {
          const q = manager.getCurrentQuestion();
          if (!q) break;
          const alreadyAnswered = progressData.answers.some(
            (a) => a.questionId === q.id
          );
          if (!alreadyAnswered) break;
          if (!manager.nextQuestion()) break;
        }

        loadCurrentQuestion();
        setHasRestoredProgress(true);
        logger.info(
          "useQuestionnaire",
          "Successfully restored questionnaire progress"
        );
      } catch (error) {
        logger.error("useQuestionnaire", "Error restoring progress", error);
      }
    },
    [manager, loadCurrentQuestion]
  );

  // Initialize questionnaire + check saved draft
  useEffect(() => {
    loadCurrentQuestion();

    const checkSavedProgress = async () => {
      try {
        const saved = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
        if (!saved || hasRestoredProgress) return;

        let parsed: unknown;
        try {
          parsed = JSON.parse(saved);
        } catch {
          // טיוטה פגומה — ננקה
          await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
          return;
        }

        const progressData = parsed as Partial<RestorePayload>;
        if (
          Array.isArray(progressData.answers) &&
          progressData.answers.length > 0
        ) {
          restoreProgress({
            answers: progressData.answers as QuestionnaireAnswer[],
          });
        }
      } catch (error) {
        logger.error(
          "useQuestionnaire",
          "Error checking saved progress",
          error
        );
      }
    };

    void checkSavedProgress();
  }, [loadCurrentQuestion, hasRestoredProgress, restoreProgress]);

  // Select/toggle answer
  const handleSelectOption = useCallback(
    (option: QuestionOption) => {
      if (!currentQuestion) return;

      if (currentQuestion.type === "single") {
        setSelectedOptions([option]);
      } else {
        // multiple: עדכון פונקציונלי למניעת מצבי מירוץ
        setSelectedOptions((prev) => {
          const exists = prev.some((o) => o.id === option.id);
          return exists
            ? prev.filter((o) => o.id !== option.id)
            : [...prev, option];
        });
      }
    },
    [currentQuestion]
  );

  // Complete the questionnaire
  const completeQuestionnaire =
    useCallback(async (): Promise<QuestionnaireData | null> => {
      setIsLoading(true);
      try {
        logger.info("useQuestionnaire", "Starting questionnaire completion");

        const smartData = manager.toSmartQuestionnaireData();
        logger.info("useQuestionnaire", "Generated smart questionnaire data");

        setSmartQuestionnaireData(smartData);
        logger.info(
          "useQuestionnaire",
          "Saved questionnaire data to user store"
        );

        await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
        logger.info(
          "useQuestionnaire",
          "Removed questionnaire draft from storage"
        );

        return smartData;
      } catch (error) {
        logger.error(
          "useQuestionnaire",
          "Error completing questionnaire",
          error
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [manager, setSmartQuestionnaireData]);

  // Next question
  const handleNext = useCallback(async () => {
    if (!currentQuestion || selectedOptions.length === 0) return;

    try {
      // Save answer – ודאות שלא נשלח undefined
      if (currentQuestion.type === "single") {
        const first = selectedOptions[0];
        if (!first) return; // הגנה כפולה
        manager.answerQuestion(currentQuestion.id, first);
      } else {
        manager.answerQuestion(currentQuestion.id, [...selectedOptions]);
      }

      // Persist draft (fire-and-forget)
      const saveDraft = async () => {
        try {
          const answers = manager.getAllAnswers();
          const draft = {
            answers,
            totalAnswered: answers.length,
            lastUpdated: new Date().toISOString(),
          };
          await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        } catch (error) {
          logger.error("useQuestionnaire", "Error saving draft", error);
        }
      };
      void saveDraft();

      // Completed?
      if (manager.isCompleted()) {
        await completeQuestionnaire();
      } else {
        manager.nextQuestion();
        loadCurrentQuestion();
      }
    } catch (error) {
      logger.error("useQuestionnaire", "Error moving to next question", error);
    }
  }, [
    currentQuestion,
    selectedOptions,
    manager,
    loadCurrentQuestion,
    completeQuestionnaire,
  ]);

  // Previous question
  const handlePrevious = useCallback(() => {
    if (manager.canGoBack()) {
      manager.previousQuestion();
      loadCurrentQuestion();
    }
  }, [manager, loadCurrentQuestion]);

  // Reset
  const resetQuestionnaire = useCallback(async () => {
    try {
      manager.reset();
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
      loadCurrentQuestion();
      setHasRestoredProgress(false);
    } catch (error) {
      logger.error("useQuestionnaire", "Error resetting questionnaire", error);
    }
  }, [manager, loadCurrentQuestion]);

  // Utility: check if there is a saved draft
  const checkForSavedProgress = useCallback(async (): Promise<boolean> => {
    try {
      const saved = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
      return !!saved;
    } catch (error) {
      logger.error(
        "useQuestionnaire",
        "Error checking for saved progress",
        error
      );
      return false;
    }
  }, []);

  return {
    // State
    currentQuestion,
    selectedOptions,
    isLoading,
    progress,

    // Derived
    canGoBack: manager.canGoBack(),
    isCompleted: manager.isCompleted(),

    // Actions
    handleSelectOption,
    handleNext,
    handlePrevious,
    completeQuestionnaire,
    resetQuestionnaire,
    loadCurrentQuestion,

    // Utils
    checkForSavedProgress,
    restoreProgress,
  };
};
