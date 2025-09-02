/**
 * @fileoverview Simple Accessibility Announcements Hook
 * @version 2.0.0 - Simplified
 * @date 2025-09-03
 *
 * Lightweight hook for managing accessibility announcements.
 * Provides basic announcement functions without over-engineering.
 */

import { useCallback } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Hook פשוט לניהול הכרזות נגישות
 * מספק פונקציות בסיסיות להכרזות לmscreen readers
 */
export const useAccessibilityAnnouncements = () => {
  // פונקציית הכרזה בסיסית
  const announce = useCallback((message: string) => {
    if (message.trim()) {
      AccessibilityInfo.announceForAccessibility(message.trim());
    }
  }, []);

  // פונקציות נוחות לסוגי הכרזות שונים
  const announceSuccess = useCallback(
    (message: string) => announce(message),
    [announce]
  );

  const announceError = useCallback(
    (message: string) => announce(message),
    [announce]
  );

  const announceInfo = useCallback(
    (message: string) => announce(message),
    [announce]
  );

  const announceUrgent = useCallback(
    (message: string) => announce(message),
    [announce]
  );

  return {
    announce,
    announceSuccess,
    announceError,
    announceUrgent,
    announceInfo,
  };
};

export default useAccessibilityAnnouncements;
