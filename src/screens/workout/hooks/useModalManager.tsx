/**
 * @file src/screens/workout/hooks/useModalManager.tsx
 * @brief Hook לניהול מודלים משותף - מחליף 4 מודלים נפרדים
 * @description מנהל את כל המודלים במקום אחד עם ממשק אחיד ומוצלח
 * @updated 2025-01-17 Enhanced documentation for audit completion
 *
 * ✅ ACTIVE & WELL-DESIGNED: Hook מתקדם בשימוש פעיל נרחב
 * - WorkoutPlansScreen.tsx: ניהול מודלי אימון
 * - ProfileScreen.tsx: מודלים למסך פרופיל
 * - WorkoutSummary.tsx & ActionButtons.tsx: מודלי סיכום אימון
 *
 * @features
 * - 4 סוגי מודלים: error, success, confirm, comingSoon
 * - ממשק אחיד עם פונקציות נוחות
 * - תמיכה במודלים הרסניים (destructive)
 * - ניהול מצב מרכזי עם TypeScript חזק
 *
 * @architecture Centralized modal state management with convenience methods
 * @usage 4+ components use this hook for consistent modal behavior
 * @pattern Single source of truth for modal management
 * @performance Lightweight state management with useCallback optimization
 */

import { useState, useCallback } from "react";

/**
 * תצורת מודל - מגדיר את התכנים והפעולות
 */
interface ModalConfig {
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  destructive?: boolean;
}

/**
 * סוגי מודלים זמינים במערכת
 */
export type ModalType = "error" | "success" | "confirm" | "comingSoon";

/**
 * ממשק החזרה של Hook עם כל הפונקציונליות
 */
interface UseModalManagerReturn {
  // State
  activeModal: ModalType | null;
  modalConfig: ModalConfig;

  // Actions
  showModal: (type: ModalType, config: ModalConfig) => void;
  hideModal: () => void;

  // Convenience methods
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    destructive?: boolean
  ) => void;
  showComingSoon: (feature: string) => void;
}

/**
 * Hook לניהול מודלים מרכזי - מחליף צורך במספר Hooks נפרדים
 * @returns {UseModalManagerReturn} ממשק מלא לניהול מודלים
 */
export const useModalManager = (): UseModalManagerReturn => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: "",
    message: "",
    confirmText: "אישור",
    destructive: false,
  });

  const showModal = useCallback((type: ModalType, config: ModalConfig) => {
    setModalConfig({
      confirmText: "אישור",
      destructive: false,
      ...config,
    });
    setActiveModal(type);
  }, []);

  const hideModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const showError = useCallback(
    (title: string, message: string) => {
      showModal("error", { title, message });
    },
    [showModal]
  );

  const showSuccess = useCallback(
    (title: string, message: string) => {
      showModal("success", { title, message });
    },
    [showModal]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      destructive = false
    ) => {
      showModal("confirm", {
        title,
        message,
        onConfirm,
        confirmText: destructive ? "מחק" : "אישור",
        destructive,
      });
    },
    [showModal]
  );

  const showComingSoon = useCallback(
    (feature: string) => {
      showModal("comingSoon", {
        title: "בקרוב...",
        message: `${feature} יהיה זמין בגרסה הבאה`,
      });
    },
    [showModal]
  );

  return {
    activeModal,
    modalConfig,
    showModal,
    hideModal,
    showError,
    showSuccess,
    showConfirm,
    showComingSoon,
  };
};
