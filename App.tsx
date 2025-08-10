/**
 * @file App.tsx
 * @brief נקודת הכניסה הראשית לאפליקציית GYMovoo
 * @brief Main entry point for GYMovoo application
 * @description מטפל באתחול RTL, ניקוי אחסון, מנהל נתונים וניווט ראשי
 * @description Handles RTL initialization, storage cleanup, data manager and main navigation
 * @dependencies AppNavigator, StorageCleanup, dataManager, rtlHelpers, Toast
 * @notes אתחול RTL אוטומטי, ניקוי אחסון אסינכרוני, אתחול מנהל נתונים, Toast גלובלי
 * @notes Automatic RTL init, async storage cleanup, data manager init, global Toast
 * @updated 2025-08-10 הוספת מנהל נתונים מרכזי למערכת
 */

import React, { useEffect } from "react";

// ===============================================
// 📱 Navigation & UI Core - ניווט ויסודות UI
// ===============================================
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";

// ===============================================
// 🔧 Utilities & Configuration - כלים והגדרות
// ===============================================
import { StorageCleanup } from "./src/utils/storageCleanup";
import { dataManager } from "./src/services/core";
import { useUserStore } from "./src/stores/userStore";
import "./src/utils/rtlHelpers"; // 🌍 אתחול RTL אוטומטי / Automatic RTL initialization

// ===============================================
// 📚 Required Libraries - ספריות נדרשות
// ===============================================
import "react-native-reanimated"; // 🎬 אנימציות מתקדמות / Advanced animations
import "react-native-gesture-handler"; // 👆 טיפול במחוות / Gesture handling

/**
 * רכיב האפליקציה הראשי
 * Main application component
 *
 * @returns {React.FC} רכיב האפליקציה עם ניווט, ניקוי אחסון ומנהל נתונים
 * @returns {React.FC} Application component with navigation, storage cleanup and data manager
 */
export default function App(): React.JSX.Element {
  const { user } = useUserStore();

  useEffect(() => {
    /**
     * אתחול ניקוי אחסון בהפעלה
     * Initialize storage cleanup on startup
     */
    const initStorageCleanup = async (): Promise<void> => {
      try {
        const isFull = await StorageCleanup.isStorageFull();
        if (isFull) {
          // ניקוי חירום במקרה של אחסון מלא
          // Emergency cleanup in case of full storage
          await StorageCleanup.emergencyCleanup();
        } else {
          // ניקוי רגיל של נתונים ישנים
          // Regular cleanup of old data
          await StorageCleanup.cleanOldData();
        }
      } catch (error) {
        // האפליקציה תמשיך לעבוד גם אם הניקוי נכשל
        // App continues to work even if cleanup fails
        console.warn("Storage cleanup failed - continuing app startup:", error);
      }
    };

    /**
     * אתחול מנהל הנתונים המרכזי
     * Initialize central data manager
     */
    const initDataManager = async (): Promise<void> => {
      if (!user?.id) {
        console.warn("🔄 App: Waiting for user to initialize data manager...");
        return;
      }

      try {
        console.warn("🚀 App: Starting data manager initialization...");
        await dataManager.initialize(user);
        console.warn("✅ App: Data manager initialization completed");
      } catch (error) {
        console.error("❌ App: Data manager initialization failed:", error);
      }
    };

    // הרץ ניקוי בצורה אסינכרונית כדי לא לחסום את האפליקציה
    // Run cleanup asynchronously to avoid blocking the app
    initStorageCleanup();

    // אתחל מנהל נתונים כשיש משתמש
    // Initialize data manager when user is available
    if (user?.id) {
      initDataManager();
    }
  }, [user]);

  return (
    <>
      {/* ניווט ראשי של האפליקציה / Main application navigation */}
      <AppNavigator />

      {/* הודעות Toast גלובליות / Global Toast messages */}
      <Toast />
    </>
  );
}
