/**
 * @file App.tsx
 * @brief נקודת הכניסה הראשית לאפליקציית GYMovoo
 * @brief Main entry point for GYMovoo application
 * @description מטפל באתחול RTL, ניקוי אחסון, וניווט ראשי
 * @description Handles RTL initialization, storage cleanup, and main navigation
 * @dependencies AppNavigator, StorageCleanup, rtlConfig, Toast
 * @notes אתחול RTL אוטומטי, ניקוי אחסון אסינכרוני, Toast גלובלי
 * @notes Automatic RTL init, async storage cleanup, global Toast
 * @updated 2025-08-04 Enhanced organization and eliminated RTL duplication
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
import "./src/utils/rtlConfig"; // 🌍 אתחול RTL אוטומטי / Automatic RTL initialization

// ===============================================
// 📚 Required Libraries - ספריות נדרשות
// ===============================================
import "react-native-reanimated"; // 🎬 אנימציות מתקדמות / Advanced animations
import "react-native-gesture-handler"; // 👆 טיפול במחוות / Gesture handling

/**
 * רכיב האפליקציה הראשי
 * Main application component
 *
 * @returns {React.FC} רכיב האפליקציה עם ניווט וניקוי אחסון
 * @returns {React.FC} Application component with navigation and storage cleanup
 */
export default function App(): React.JSX.Element {
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

    // הרץ ניקוי בצורה אסינכרונית כדי לא לחסום את האפליקציה
    // Run cleanup asynchronously to avoid blocking the app
    initStorageCleanup();
  }, []);

  return (
    <>
      {/* ניווט ראשי של האפליקציה / Main application navigation */}
      <AppNavigator />

      {/* הודעות Toast גלובליות / Global Toast messages */}
      <Toast />
    </>
  );
}
