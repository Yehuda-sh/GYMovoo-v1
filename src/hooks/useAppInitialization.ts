/**
 * @file src/hooks/useAppInitialization.ts
 * @description Hook למניהת אתחול האפליקציה
 */

import { useEffect, useRef } from "react";
import { useUserStore } from "../stores/userStore";
import { dataManager } from "../services/core";
import { StorageCleanup } from "../utils/storageCleanup";
import { logger } from "../utils/logger";

export const useAppInitialization = () => {
  const { user } = useUserStore();
  const initializedUserIdRef = useRef<string | null>(null);
  const isInitializingRef = useRef(false);
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

  // אתחול מנהל נתונים
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
      if (initializedUserIdRef.current === user.id && dataManager.isReady()) {
        return;
      }

      // הימנע מהרצות מקבילות
      if (isInitializingRef.current) {
        return;
      }

      try {
        // רענון מהשרת (פעם אחת לכל משתמש)
        if (!didRefreshRef.current) {
          await useUserStore.getState().refreshFromServer();
          didRefreshRef.current = true;
          logger.info("App", "User data refreshed from server", {
            userId: user.id,
          });
        }
      } catch (error) {
        logger.warn("App", "Server refresh failed", error);
      }

      try {
        // בדיקה נוספת אחרי הרענון
        if (dataManager.isReady() && initializedUserIdRef.current === user.id) {
          return;
        }

        isInitializingRef.current = true;
        await dataManager.initialize(user);
        initializedUserIdRef.current = user.id;
        logger.info("App", "Data manager initialized", { userId: user.id });
      } catch (error) {
        logger.error("App", "Data manager initialization failed", error);
      } finally {
        isInitializingRef.current = false;
      }
    };

    if (user?.id) {
      initData();
    }
  }, [user]);
};
