/**
 * @file src/hooks/useAppInitialization.ts
 * @description Hook לניהול אתחול האפליקציה
 */

import { useEffect, useRef } from "react";
import { useUserStore } from "../stores/userStore";
import { StorageCleanup } from "../utils/storageCleanup";
import { logger } from "../utils/logger";

export const useAppInitialization = (): void => {
  // נשלוף גם hydrated כדי להבטיח שאתחול משתמש קורה רק אחרי טעינת ה-store מהאחסון
  const { user, hydrated } = useUserStore((s) => ({
    user: s.user,
    hydrated: s.hydrated,
  }));

  // זוכר למי כבר הרמנו את סביבת העבודה
  const initializedUserIdRef = useRef<string | null>(null);

  // --- ניקוי אחסון בהפעלה ראשונה (פעם אחת) ---
  useEffect(() => {
    let isMounted = true;

    const initStorageCleanup = async (): Promise<void> => {
      try {
        const isFull = await StorageCleanup.isStorageFull();
        if (!isMounted) return;

        if (isFull) {
          await StorageCleanup.emergencyCleanup();
        } else {
          await StorageCleanup.cleanOldData();
        }
      } catch (error) {
        // לוג אזהרה – לא חוסם את האפליקציה
        logger.warn("App", "Storage cleanup failed", error);
      }
    };

    initStorageCleanup();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- אתחול לפי משתמש (אחרי שה-store הידרייטד) ---
  useEffect(() => {
    // אם ה-store עוד לא נטען – לא מתחילים
    if (!hydrated) return;

    // אם אין משתמש – איפוס מזהה מאותחל (כדי לא לחסום אתחול עתידי)
    if (!user?.id) {
      initializedUserIdRef.current = null; // ✔ תקין מול string|null
      return;
    }

    // אם כבר אותחל למשתמש הזה – אין מה לעשות
    if (initializedUserIdRef.current === user.id) return;

    let isMounted = true;

    const initData = async (): Promise<void> => {
      try {
        // כאן היה רענון מהשרת – כרגע עובדים לוקלי בלבד
        logger.info("App", "App initialized for user (local data)", {
          userId: user.id,
        });

        // סימון שהמשתמש הזה אותחל
        if (isMounted) {
          initializedUserIdRef.current = user.id ?? null; // ✅ תיקון הטיפוס
        }
      } catch (error) {
        logger.warn("App", "Initialization failed", error);
        // גם במקרה כשלון נסמן כדי לא לנסות בלולאה – אפשר לשנות לפי צורך
        initializedUserIdRef.current = user.id ?? null; // ✅ תיקון הטיפוס
      }
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, hydrated]);
};
