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
import { StyleSheet } from "react-native";

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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * רכיב האפליקציה הראשי
 * Main application component
 *
 * @returns {React.FC} רכיב האפליקציה עם ניווט, ניקוי אחסון ומנהל נתונים
 * @returns {React.FC} Application component with navigation, storage cleanup and data manager
 */
export default function App(): React.JSX.Element {
  const { user } = useUserStore();
  const refreshFromServer = useUserStore((s) => s.refreshFromServer);

  // ניקוי אחסון – פעם אחת בהפעלה
  useEffect(() => {
    const initStorageCleanup = async (): Promise<void> => {
      try {
        const isFull = await StorageCleanup.isStorageFull();
        if (isFull) {
          await StorageCleanup.emergencyCleanup();
        } else {
          await StorageCleanup.cleanOldData();
        }
      } catch (error) {
        console.warn("Storage cleanup failed - continuing app startup:", error);
      }
    };
    initStorageCleanup();
  }, []);

  // אתחול מנהל נתונים + רענון מהשרת כשיש משתמש
  useEffect(() => {
    const initData = async (): Promise<void> => {
      if (!user?.id) {
        console.warn("🔄 App: Waiting for user to initialize data manager...");
        return;
      }
      try {
        // רענון מהשרת לפי מדיניות "שרת כמקור אמת"
        await refreshFromServer();
      } catch (e) {
        console.warn(
          "⚠️ App: refreshFromServer failed:",
          e instanceof Error ? e.message : String(e)
        );
      }
      try {
        console.warn("🚀 App: Starting data manager initialization...");
        await dataManager.initialize(user);
        console.warn("✅ App: Data manager initialization completed");
      } catch (error) {
        console.error("❌ App: Data manager initialization failed:", error);
      }
    };
    if (user?.id) initData();
  }, [user, refreshFromServer]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        {/* ניווט ראשי של האפליקציה / Main application navigation */}
        <AppNavigator />

        {/* הודעות Toast גלובליות / Global Toast messages */}
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
