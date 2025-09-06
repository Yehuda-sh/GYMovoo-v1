/**
 * @file useModalManager.tsx
 * @description Hook פשוט לניהול מודלים
 */

import { useState, useCallback } from "react";

export type ModalType = "error" | "success" | "confirm" | "comingSoon";

export interface ModalConfig {
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  destructive?: boolean;
  onCancel?: () => void;
  cancelText?: string;
}

export const useModalManager = () => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: "",
    message: "",
    confirmText: "אישור",
    cancelText: "ביטול",
    destructive: false,
  });

  const showModal = useCallback((type: ModalType, config: ModalConfig) => {
    setModalConfig({
      ...config,
      confirmText: config.confirmText || "אישור",
      cancelText: config.cancelText || "ביטול",
      destructive: config.destructive || false,
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
