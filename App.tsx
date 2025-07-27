// App.tsx
import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
// בתחילת הקובץ הראשי (App.tsx או app/_layout.tsx)
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "react-native-gesture-handler";
import { StorageCleanup } from "./src/utils/storageCleanup";

export default function App() {
  useEffect(() => {
    // ניקוי אחסון בהפעלה עם הגנות נוספות
    const initStorageCleanup = async () => {
      try {
        console.log("🧹 Starting storage cleanup...");
        const isFull = await StorageCleanup.isStorageFull();
        if (isFull) {
          console.log("🗑️ Storage is full, running emergency cleanup...");
          await StorageCleanup.emergencyCleanup();
        } else {
          console.log("🧽 Running regular cleanup...");
          // ניקוי רגיל של נתונים ישנים
          await StorageCleanup.cleanOldData();
        }
        console.log("✅ Storage cleanup completed successfully");
      } catch (error) {
        console.warn(
          "⚠️ Storage cleanup failed - continuing app startup:",
          error
        );
        // האפליקציה תמשיך לעבוד גם אם הניקוי נכשל
      }
    };

    // הרץ ניקוי בצורה אסינכרונית כדי לא לחסום את האפליקציה
    initStorageCleanup();
  }, []);

  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
}
