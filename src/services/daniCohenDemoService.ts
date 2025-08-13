import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * טוען נתוני דמו של דני כהן מקובץ JSON ושומר ב-AsyncStorage
 * פתרון פשוט ונקי ללא סקריפטים מורכבים
 */
export const loadDaniCohenDemo = async (): Promise<void> => {
  // דמו מבוטל – מקור אמת הוא השרת בלבד (ראה .github/copilot-instructions.md)
  console.warn(
    "🚫 מצב דמו מבוטל: מקור אמת הוא השרת בלבד. יש להשתמש ב- src/services/api/userApi.ts"
  );
  throw new Error("DemoDisabled: client-side demo data is not allowed");
};

/**
 * מנקה את כל נתוני הדמו מ-AsyncStorage
 */
export const clearDaniCohenDemo = async (): Promise<void> => {
  try {
    console.warn("🧹 מנקה מפתחות דמו (אם נשמרו בעבר)...");

    await AsyncStorage.multiRemove([
      "user",
      "smartQuestionnaireData",
      "workoutHistory",
      "workoutPlans",
      "userStatistics",
    ]);

    console.warn("✅ ניקוי הושלם");
  } catch (error) {
    console.error("❌ שגיאה בניקוי נתוני דמו:", error);
    throw error;
  }
};
