/**
 * @file src/screens/workout/hooks/useWorkoutModals.ts
 * @brief Custom hook for managing workout modals
 * @author GYMovoo Development Team
 */

import { useState, useCallback } from "react";

interface UseWorkoutModalsReturn {
  // Modal states
  showErrorModal: boolean;
  showExitModal: boolean;
  showDeleteModal: boolean;
  errorMessage: string;
  deleteExerciseId: string | null;

  // Modal actions
  setShowErrorModal: (show: boolean) => void;
  setShowExitModal: (show: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
  setErrorMessage: (message: string) => void;
  setDeleteExerciseId: (id: string | null) => void;

  // Convenience methods
  showError: (message: string) => void;
  showExitConfirmation: () => void;
  showDeleteConfirmation: (exerciseId: string) => void;
  hideAllModals: () => void;
}

export const useWorkoutModals = (): UseWorkoutModalsReturn => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteExerciseId, setDeleteExerciseId] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  }, []);

  const showExitConfirmation = useCallback(() => {
    setShowExitModal(true);
  }, []);

  const showDeleteConfirmation = useCallback((exerciseId: string) => {
    setDeleteExerciseId(exerciseId);
    setShowDeleteModal(true);
  }, []);

  const hideAllModals = useCallback(() => {
    setShowErrorModal(false);
    setShowExitModal(false);
    setShowDeleteModal(false);
    setErrorMessage("");
    setDeleteExerciseId(null);
  }, []);

  return {
    // Modal states
    showErrorModal,
    showExitModal,
    showDeleteModal,
    errorMessage,
    deleteExerciseId,

    // Modal actions
    setShowErrorModal,
    setShowExitModal,
    setShowDeleteModal,
    setErrorMessage,
    setDeleteExerciseId,

    // Convenience methods
    showError,
    showExitConfirmation,
    showDeleteConfirmation,
    hideAllModals,
  };
};
