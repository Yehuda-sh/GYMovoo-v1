// App.tsx
import React, { useEffect } from "react";
import { I18nManager } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
// בתחילת הקובץ הראשי (App.tsx או app/_layout.tsx)
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "react-native-gesture-handler";
import { StorageCleanup } from "./src/utils/storageCleanup";

// הפעלת תמיכה מלאה ב-RTL לעברית | Enable full RTL support for Hebrew
I18nManager.allowRTL(true);

export default function App() {
  useEffect(() => {
    // ניקוי אחסון בהפעלה עם הגנות נוספות
    const initStorageCleanup = async () => {
      try {
        console.log("🧹 App.tsx - Starting storage cleanup...");
        const isFull = await StorageCleanup.isStorageFull();
        if (isFull) {
          console.log(
            "🗑️ App.tsx - Storage is full, running emergency cleanup..."
          );
          await StorageCleanup.emergencyCleanup();
        } else {
          console.log("🧽 App.tsx - Running regular cleanup...");
          // ניקוי רגיל של נתונים ישנים
          await StorageCleanup.cleanOldData();
        }
        console.log("✅ App.tsx - Storage cleanup completed successfully");
      } catch (error) {
        console.warn(
          "⚠️ App.tsx - Storage cleanup failed - continuing app startup:",
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
