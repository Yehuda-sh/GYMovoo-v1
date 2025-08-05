/**
 * @file src/screens/workout/hooks/useModalManager.tsx
 * @brief Hook לניהול מודלים משותף - מחליף 4 מודלים נפרדים
 * @description מנהל את כל המודלים במקום אחד עם ממשק אחיד
 */

import { useState, useCallback } from "react";

interface ModalConfig {
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  destructive?: boolean;
}

export type ModalType = "error" | "success" | "confirm" | "comingSoon";

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
