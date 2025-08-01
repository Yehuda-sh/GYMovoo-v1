// App.tsx
import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "react-native-gesture-handler";
import { StorageCleanup } from "./src/utils/storageCleanup";
import "./src/utils/rtlConfig"; // אתחול RTL אוטומטי

export default function App() {
  useEffect(() => {
    // ניקוי אחסון בהפעלה עם הגנות נוספות
    // Storage cleanup on startup with additional safeguards
    const initStorageCleanup = async () => {
      try {
        const isFull = await StorageCleanup.isStorageFull();
        if (isFull) {
          await StorageCleanup.emergencyCleanup();
        } else {
          // ניקוי רגיל של נתונים ישנים
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
      <AppNavigator />
      <Toast />
    </>
  );
}
