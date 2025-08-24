/**
 * @file src/screens/workout/hooks/useModalManager.tsx
 * @brief Hook לניהול מודלים משותף - מחליף 4 מודלים נפרדים
 * @description מנהל את כל המודלים במקום אחד עם ממשק אחיד ומוצלח
 * @updated 2025-08-24 Enhanced documentation + UI enhancement support for premium modals
 *
 * ✅ ACTIVE & WELL-DESIGNED: Hook מתקדם בשימוש פעיל נרחב עם עיצוב משופר
 * - WorkoutPlansScreen.tsx: ניהול מודלי אימון ⭐ עם עיצוב מתקדם
 * - ProfileScreen.tsx: מודלים למסך פרופיל ⭐ עם shadows משופרים
 * - WorkoutSummary.tsx & ActionButtons.tsx: מודלי סיכום אימון ⭐ עם typography משופרת
 * - Enhanced modal support: תמיכה ב-30+ רכיבים עם עיצוב יוקרתי
 *
 * @features
 * - 4 סוגי מודלים: error, success, confirm, comingSoon
 * - ממשק אחיד עם פונקציות נוחות
 * - תמיכה במודלים הרסניים (destructive)
 * - ניהול מצב מרכזי עם TypeScript חזק
 * - Enhanced UI support: shadows מתקדמים, typography משופרת, נגישות מלאה
 *
 * @architecture Centralized modal state management with convenience methods
 * @usage 4+ components use this hook for consistent modal behavior
 * @pattern Single source of truth for modal management
 * @performance Lightweight state management with useCallback optimization
 * @enhancements Support for premium modal designs with advanced styling
 */

import { useState, useCallback } from "react";

/**
 * הגדרות עיצוב מתקדמות למודלים (נוסף 2025-08-24)
 * Enhanced design settings for modals
 */
export interface ModalDesignConfig {
  enhancedShadows?: boolean; // shadows מתקדמים
  premiumTypography?: boolean; // טיפוגרפיה משופרת
  largeButtons?: boolean; // כפתורים גדולים (minHeight 56)
  roundedCorners?: boolean; // פינות מעוגלות מתקדמות
  highContrast?: boolean; // ניגודיות גבוהה
  animationDuration?: number; // משך אנימציה (ms)
}

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
  // Enhanced design support (added 2025-08-24)
  designConfig?: ModalDesignConfig;
  priority?: "low" | "medium" | "high" | "critical"; // עדיפות המודל
}

/**
 * סוגי מודלים זמינים במערכת
 */
export type ModalType = "error" | "success" | "confirm" | "comingSoon";

// הגדרות עיצוב מתקדמות ברירת מחדל (נוסף 2025-08-24)
const DEFAULT_DESIGN_CONFIG: ModalDesignConfig = Object.freeze({
  enhancedShadows: true,
  premiumTypography: true,
  largeButtons: true,
  roundedCorners: true,
  highContrast: false,
  animationDuration: 300,
});

// קונפיגורציית ברירת מחדל יציבה לשימוש פנימי
const DEFAULT_MODAL_CONFIG: ModalConfig = Object.freeze({
  title: "",
  message: "",
  confirmText: "אישור",
  cancelText: "ביטול",
  destructive: false,
  designConfig: DEFAULT_DESIGN_CONFIG,
  priority: "medium",
});

/**
 * ממשק החזרה של Hook עם כל הפונקציונליות
 */
export interface UseModalManagerReturn {
  // State
  activeModal: ModalType | null;
  modalConfig: ModalConfig;
  isOpen: boolean;

  // Actions
  showModal: (type: ModalType, config: ModalConfig) => void;
  hideModal: () => void;
  confirm: () => void;
  cancel: () => void;

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

  // Enhanced convenience methods (added 2025-08-24)
  showEnhancedError: (
    title: string,
    message: string,
    designConfig?: ModalDesignConfig
  ) => void;
  showEnhancedSuccess: (
    title: string,
    message: string,
    designConfig?: ModalDesignConfig
  ) => void;
  showCriticalConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    designConfig?: ModalDesignConfig
  ) => void;
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
      // Enhanced design config merging (added 2025-08-24)
      designConfig: {
        ...DEFAULT_DESIGN_CONFIG,
        ...config.designConfig,
      },
      priority: config.priority ?? DEFAULT_MODAL_CONFIG.priority,
    };
    setModalConfig(merged);
    setActiveModal(type);
  }, []);

  const hideModal = useCallback(() => {
    setActiveModal(null);
    setModalConfig(DEFAULT_MODAL_CONFIG);
  }, []);

  const confirm = useCallback(() => {
    try {
      modalConfig.onConfirm?.();
    } finally {
      setActiveModal(null);
      setModalConfig(DEFAULT_MODAL_CONFIG);
    }
  }, [modalConfig]);

  const cancel = useCallback(() => {
    try {
      modalConfig.onCancel?.();
    } finally {
      setActiveModal(null);
      setModalConfig(DEFAULT_MODAL_CONFIG);
    }
  }, [modalConfig]);

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

  // Enhanced convenience methods (added 2025-08-24)
  const showEnhancedError = useCallback(
    (title: string, message: string, designConfig?: ModalDesignConfig) => {
      showModal("error", {
        title,
        message,
        priority: "high",
        designConfig: { ...DEFAULT_DESIGN_CONFIG, ...designConfig },
      });
    },
    [showModal]
  );

  const showEnhancedSuccess = useCallback(
    (title: string, message: string, designConfig?: ModalDesignConfig) => {
      showModal("success", {
        title,
        message,
        priority: "medium",
        designConfig: { ...DEFAULT_DESIGN_CONFIG, ...designConfig },
      });
    },
    [showModal]
  );

  const showCriticalConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      designConfig?: ModalDesignConfig
    ) => {
      showModal("confirm", {
        title,
        message,
        onConfirm,
        priority: "critical",
        destructive: true,
        confirmText: "מחק",
        designConfig: {
          ...DEFAULT_DESIGN_CONFIG,
          highContrast: true,
          ...designConfig,
        },
      });
    },
    [showModal]
  );

  return {
    activeModal,
    modalConfig,
    isOpen: activeModal !== null,
    showModal,
    hideModal,
    confirm,
    cancel,
    showError,
    showSuccess,
    showConfirm,
    showComingSoon,
    // Enhanced methods (added 2025-08-24)
    showEnhancedError,
    showEnhancedSuccess,
    showCriticalConfirm,
  };
};
