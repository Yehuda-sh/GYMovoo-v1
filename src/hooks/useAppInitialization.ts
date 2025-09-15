/**
 * @file src/hooks/useAppInitialization.ts
 * @description Hook לניהול אתחול האפליקציה
 */

import { useEffect, useRef } from "react";
import { useUserStore } from "../stores/userStore";
import { StorageCleanup } from "../utils/storageCleanup";
import { logger } from "../utils/logger";

export const useAppInitialization = () => {
  const { user } = useUserStore();
  const initializedUserIdRef = useRef<string | null>(null);
  const didRefreshRef = useRef(false);

  // ניקוי אחסון בהפעלה ראשונה
  useEffect(() => {
    const initStorageCleanup = async (): Promise<void> => {
      try {
        const isFull = await StorageCleanup.isStorageFull();
        if (isFull) {
          await StorageCleanup.emergencyCleanup();
          logger.info("App", "Emergency storage cleanup completed");
        } else {
          await StorageCleanup.cleanOldData();
          logger.info("App", "Regular storage cleanup completed");
        }
      } catch (error) {
        logger.warn("App", "Storage cleanup failed", error);
      }
    };

    initStorageCleanup();
  }, []);

  // אתחול משתמש
  useEffect(() => {
    const initData = async (): Promise<void> => {
      if (!user?.id) {
        return;
      }

      // איפוס דגל רענון כשמתחלף משתמש
      if (initializedUserIdRef.current !== user.id) {
        didRefreshRef.current = false;
      }

      // אם כבר מאותחל עבור המשתמש הזה
      if (initializedUserIdRef.current === user.id) {
        return;
      }

      try {
        // רענון מהשרת הוסר - נעבוד עם נתונים מקומיים
        logger.info("App", "App initialized for user (local data)", {
          userId: user.id,
        });

        // סיום אתחול
        initializedUserIdRef.current = user.id;
      } catch (error) {
        logger.warn("App", "Initialization failed", error);
        initializedUserIdRef.current = user.id;
      }
    };

    if (user?.id) {
      initData();
    }
  }, [user]);
};
