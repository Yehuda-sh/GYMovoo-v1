/**
 * @file src/screens/workout/hooks/useModalManager.tsx
 * @brief Hook לניהול מודלים משותף - מחליף 4 מודלים נפרדים
 * @description מנהל את כל המודלים במקום אחד עם ממשק אחיד ומוצלח
 * @updated 2025-09-03 Simplified - removed unused enhanced features
 *
 * ✅ ACTIVE & WELL-DESIGNED: Hook מתקדם בשימוש פעיל נרחב
 * - WorkoutPlansScreen.tsx: ניהול מודלי אימון ⭐
 * - ProfileScreen.tsx: מודלים למסך פרופיל ⭐
 * - WorkoutSummary.tsx & ActionButtons.tsx: מודלי סיכום אימון ⭐
 *
 * @features
 * - 4 סוגי מודלים: error, success, confirm, comingSoon
 * - ממשק אחיד עם פונקציות נוחות
 * - תמיכה במודלים הרסניים (destructive)
 * - ניהול מצב מרכזי עם TypeScript חזק
 *
 * @architecture Centralized modal state management with convenience methods
 * @usage 6+ components use this hook for consistent modal behavior
 * @pattern Single source of truth for modal management
 * @performance Lightweight state management with useCallback optimization
 */

import { useState, useCallback } from "react";

/**
 * תצורת מודל - מגדיר את התכנים והפעולות
 */
export interface ModalConfig {
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  destructive?: boolean;
  onCancel?: () => void;
  cancelText?: string;
}

/**
 * סוגי מודלים זמינים במערכת
 */
export type ModalType = "error" | "success" | "confirm" | "comingSoon";

// קונפיגורציית ברירת מחדל יציבה לשימוש פנימי
const DEFAULT_MODAL_CONFIG: ModalConfig = Object.freeze({
  title: "",
  message: "",
  confirmText: "אישור",
  cancelText: "ביטול",
  destructive: false,
});

/**
 * ממשק החזרה של Hook עם כל הפונקציונליות
 */
export interface UseModalManagerReturn {
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
  const [modalConfig, setModalConfig] =
    useState<ModalConfig>(DEFAULT_MODAL_CONFIG);

  const showModal = useCallback((type: ModalType, config: ModalConfig) => {
    const merged: ModalConfig = {
      ...DEFAULT_MODAL_CONFIG,
      ...config,
      cancelText: config.onCancel
        ? (config.cancelText ?? "ביטול")
        : (config.cancelText ?? DEFAULT_MODAL_CONFIG.cancelText),
      confirmText: config.confirmText ?? DEFAULT_MODAL_CONFIG.confirmText,
      destructive: config.destructive ?? DEFAULT_MODAL_CONFIG.destructive,
    };
    setModalConfig(merged);
    setActiveModal(type);
  }, []);

  const hideModal = useCallback(() => {
    setActiveModal(null);
    setModalConfig(DEFAULT_MODAL_CONFIG);
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
