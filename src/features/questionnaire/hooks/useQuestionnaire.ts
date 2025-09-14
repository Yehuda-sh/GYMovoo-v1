/**
 * @file src/features/questionnaire/hooks/useQuestionnaire.ts
 * @description Custom hook for managing the questionnaire state and actions
 */

import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../../../stores/userStore";
import { UnifiedQuestionnaireManager } from "../data";
import { Question, QuestionOption, QuestionnaireAnswer } from "../types";

// Storage key constant
const DRAFT_STORAGE_KEY = "questionnaire_draft";

export const useQuestionnaire = () => {
  const { setSmartQuestionnaireData } = useUserStore();

  const [manager] = useState(() => new UnifiedQuestionnaireManager());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);

  // Load current question
  const loadCurrentQuestion = useCallback(() => {
    try {
      const question = manager.getCurrentQuestion();
      setCurrentQuestion(question);
      if (question) {
        // Get current answers for this question
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

        // Update progress
        setProgress(manager.getProgress());
      }
    } catch (error) {
      console.warn("Error loading question", error);
    }
  }, [manager]);

  // Restore progress from saved data
  const restoreProgress = useCallback(
    (progressData: { answers: QuestionnaireAnswer[] }) => {
      try {
        if (!progressData.answers || !Array.isArray(progressData.answers)) {
          return;
        }

        // Reset manager first
        manager.reset();

        // Restore each answer
        progressData.answers.forEach((answer) => {
          if (answer.questionId && answer.answer) {
            manager.answerQuestion(answer.questionId, answer.answer);
          }
        });

        // Move to the next unanswered question
        while (
          manager.getCurrentQuestion() &&
          progressData.answers.some(
            (a) => a.questionId === manager.getCurrentQuestion()?.id
          )
        ) {
          if (!manager.nextQuestion()) break;
        }

        // Load the current question
        loadCurrentQuestion();
        setHasRestoredProgress(true);

        console.log("Successfully restored questionnaire progress");
      } catch (error) {
        console.warn("Error restoring progress", error);
      }
    },
    [manager, loadCurrentQuestion]
  );

  // Initialize questionnaire
  useEffect(() => {
    loadCurrentQuestion();

    // Check for saved progress
    const checkSavedProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedProgress && !hasRestoredProgress) {
          const progressData = JSON.parse(savedProgress);
          if (progressData.answers && progressData.answers.length > 0) {
            restoreProgress(progressData);
          }
        }
      } catch (error) {
        console.warn("Error checking saved progress", error);
      }
    };

    checkSavedProgress();
  }, [loadCurrentQuestion, hasRestoredProgress, restoreProgress]);

  // Handle answer selection
  const handleSelectOption = useCallback(
    (option: QuestionOption) => {
      if (!currentQuestion) return;

      // Handle single or multiple selection based on question type
      if (currentQuestion.type === "single") {
        setSelectedOptions([option]);
      } else {
        // For multiple selection, toggle the option
        const isSelected = selectedOptions.some((o) => o.id === option.id);
        if (isSelected) {
          setSelectedOptions(selectedOptions.filter((o) => o.id !== option.id));
        } else {
          setSelectedOptions([...selectedOptions, option]);
        }
      }
    },
    [currentQuestion, selectedOptions]
  );

  // Complete the questionnaire
  const completeQuestionnaire = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("🏁 Starting questionnaire completion...");

      // Log the current state of the questionnaire
      console.log(
        `🧮 Current question index: ${manager.getCurrentQuestionIndex()}`
      );
      console.log(`📝 Total answers: ${manager.getAllAnswers().length}`);
      console.log(`✓ isCompleted: ${manager.isCompleted()}`);

      // Generate the smart questionnaire data
      const smartData = manager.toSmartQuestionnaireData();
      console.log("📊 Generated smart questionnaire data");

      // Update user store
      setSmartQuestionnaireData(smartData);
      console.log("💾 Saved questionnaire data to user store");

      // Clean up
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
      console.log("🧹 Removed questionnaire draft from storage");

      return smartData;
    } catch (error) {
      console.warn("❌ Error completing questionnaire", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [manager, setSmartQuestionnaireData]);

  // Handle next question
  const handleNext = useCallback(() => {
    if (!currentQuestion || selectedOptions.length === 0) return;

    try {
      // Save answer
      if (selectedOptions[0]) {
        manager.answerQuestion(
          currentQuestion.id,
          currentQuestion.type === "single"
            ? selectedOptions[0]
            : selectedOptions
        );
      }

      // Save draft to AsyncStorage
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
          console.warn("Error saving draft", error);
        }
      };

      saveDraft();

      // Check if completed
      if (manager.isCompleted()) {
        completeQuestionnaire();
      } else {
        // Move to next question
        manager.nextQuestion();
        loadCurrentQuestion();
      }
    } catch (error) {
      console.warn("Error moving to next question", error);
    }
  }, [
    currentQuestion,
    selectedOptions,
    manager,
    loadCurrentQuestion,
    completeQuestionnaire,
  ]);

  // Handle previous question
  const handlePrevious = useCallback(() => {
    if (manager.canGoBack()) {
      manager.previousQuestion();
      loadCurrentQuestion();
    }
  }, [manager, loadCurrentQuestion]);

  // Reset questionnaire
  const resetQuestionnaire = useCallback(async () => {
    try {
      manager.reset();
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
      loadCurrentQuestion();
      setHasRestoredProgress(false);
    } catch (error) {
      console.warn("Error resetting questionnaire", error);
    }
  }, [manager, loadCurrentQuestion]);

  // Utility function to check if there's saved progress
  const checkForSavedProgress = useCallback(async (): Promise<boolean> => {
    try {
      const savedProgress = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
      return !!savedProgress;
    } catch (error) {
      console.warn("Error checking for saved progress", error);
      return false;
    }
  }, []);

  return {
    // State
    currentQuestion,
    selectedOptions,
    isLoading,
    progress,

    // Derived state
    canGoBack: manager.canGoBack(),
    isCompleted: manager.isCompleted(),

    // Actions
    handleSelectOption,
    handleNext,
    handlePrevious,
    completeQuestionnaire,
    resetQuestionnaire,
    loadCurrentQuestion,

    // Utilities
    checkForSavedProgress,
    restoreProgress,
  };
};
