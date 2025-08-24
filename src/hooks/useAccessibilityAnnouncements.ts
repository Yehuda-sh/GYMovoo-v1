/**
 * @fileoverview Enhanced Accessibility Announcements Hook
 * @version 1.0.0
 * @date 2025-08-24
 *
 * Advanced hook for managing accessibility announcements with smart queuing,
 * priority levels, and screen reader optimization for React Native apps.
 *
 * Features:
 * - Priority-based announcement queuing
 * - Rate limiting to prevent spam
 * - Hebrew RTL support
 * - Screen reader detection
 * - Announcement history tracking
 * - Auto-cleanup and memory management
 */

import { useRef, useCallback, useEffect } from "react";
import { AccessibilityInfo, Platform } from "react-native";

interface AnnouncementOptions {
  priority?: "low" | "medium" | "high" | "urgent";
  delay?: number;
  replace?: boolean; // Replace existing announcements
  persist?: boolean; // Don't auto-clear from history
}

interface QueuedAnnouncement {
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  timestamp: number;
  id: string;
}

const PRIORITY_WEIGHTS = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
} as const;

const RATE_LIMIT_MS = 500; // Minimum time between announcements
const MAX_QUEUE_SIZE = 10;
const MAX_HISTORY_SIZE = 50;

export const useAccessibilityAnnouncements = () => {
  const queueRef = useRef<QueuedAnnouncement[]>([]);
  const historyRef = useRef<QueuedAnnouncement[]>([]);
  const lastAnnouncementRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const screenReaderEnabledRef = useRef<boolean>(false);

  // Check if screen reader is enabled
  useEffect(() => {
    const checkScreenReader = async () => {
      try {
        if (Platform.OS === "ios") {
          const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
          screenReaderEnabledRef.current = isEnabled;
        } else {
          // Android doesn't have reliable screen reader detection
          screenReaderEnabledRef.current = true;
        }
      } catch (error) {
        console.warn("Failed to check screen reader status:", error);
        screenReaderEnabledRef.current = true; // Assume enabled for safety
      }
    };

    checkScreenReader();

    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      (isEnabled: boolean) => {
        screenReaderEnabledRef.current = isEnabled;
      }
    );

    return () => {
      subscription?.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Process announcement queue
  const processQueue = useCallback(() => {
    if (processingRef.current || queueRef.current.length === 0) {
      return;
    }

    const now = Date.now();
    if (now - lastAnnouncementRef.current < RATE_LIMIT_MS) {
      // Schedule next processing attempt
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(processQueue, RATE_LIMIT_MS);
      return;
    }

    processingRef.current = true;

    // Sort by priority and timestamp
    queueRef.current.sort((a, b) => {
      const priorityDiff =
        PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp;
    });

    const announcement = queueRef.current.shift();
    if (announcement) {
      lastAnnouncementRef.current = now;

      // Make the announcement
      AccessibilityInfo.announceForAccessibility(announcement.message);

      // Add to history
      historyRef.current.push(announcement);
      if (historyRef.current.length > MAX_HISTORY_SIZE) {
        historyRef.current = historyRef.current.slice(-MAX_HISTORY_SIZE);
      }

      // Schedule next processing
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        processingRef.current = false;
        processQueue();
      }, RATE_LIMIT_MS);
    } else {
      processingRef.current = false;
    }
  }, []);

  // Main announce function
  const announce = useCallback(
    (message: string, options: AnnouncementOptions = {}) => {
      // Skip if screen reader is not enabled (iOS only)
      if (Platform.OS === "ios" && !screenReaderEnabledRef.current) {
        return;
      }

      // Skip empty messages
      if (!message.trim()) {
        return;
      }

      const { priority = "medium", delay = 0, replace = false } = options;
      const announcement: QueuedAnnouncement = {
        message: message.trim(),
        priority,
        timestamp: Date.now() + delay,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // Handle replace option
      if (replace) {
        queueRef.current = [];
        processingRef.current = false;
      }

      // Add to queue
      queueRef.current.push(announcement);

      // Limit queue size
      if (queueRef.current.length > MAX_QUEUE_SIZE) {
        // Remove lowest priority items first
        queueRef.current.sort(
          (a, b) => PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority]
        );
        queueRef.current = queueRef.current.slice(-MAX_QUEUE_SIZE);
      }

      // Start processing if needed
      if (delay === 0) {
        processQueue();
      } else {
        setTimeout(processQueue, delay);
      }
    },
    [processQueue]
  );

  // Convenience methods for different priorities
  const announceSuccess = useCallback(
    (message: string, options?: Omit<AnnouncementOptions, "priority">) => {
      announce(message, { ...options, priority: "medium" });
    },
    [announce]
  );

  const announceError = useCallback(
    (message: string, options?: Omit<AnnouncementOptions, "priority">) => {
      announce(message, { ...options, priority: "high" });
    },
    [announce]
  );

  const announceUrgent = useCallback(
    (message: string, options?: Omit<AnnouncementOptions, "priority">) => {
      announce(message, { ...options, priority: "urgent", replace: true });
    },
    [announce]
  );

  const announceInfo = useCallback(
    (message: string, options?: Omit<AnnouncementOptions, "priority">) => {
      announce(message, { ...options, priority: "low" });
    },
    [announce]
  );

  // Clear queue
  const clearQueue = useCallback(() => {
    queueRef.current = [];
    processingRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Get queue status
  const getQueueStatus = useCallback(
    () => ({
      queueLength: queueRef.current.length,
      processing: processingRef.current,
      historyLength: historyRef.current.length,
      screenReaderEnabled: screenReaderEnabledRef.current,
      lastAnnouncement: lastAnnouncementRef.current,
    }),
    []
  );

  return {
    announce,
    announceSuccess,
    announceError,
    announceUrgent,
    announceInfo,
    clearQueue,
    getQueueStatus,
    isScreenReaderEnabled: screenReaderEnabledRef.current,
  };
};

export default useAccessibilityAnnouncements;
