/**
 * @file src/utils/storageCleanup.example.ts
 * @brief דוגמאות שימוש בכלי ניקוי אחסון משודרגים | Examples using improved storage cleanup utilities
 * @created 2025-07-30
 */

import { StorageCleanup } from "./storageCleanup";

// ===== דוגמאות לשימוש בפונקציות החדשות =====

/**
 * דוגמה לבדיקת מצב אחסון מלא עם נתוני שאלון
 */
export const ExampleStorageStatusCheck = async () => {
  console.log("=== בדיקת מצב אחסון ===");

  // בדיקת מידע מפורט
  const storageInfo = await StorageCleanup.getStorageInfo();
  console.log("📊 Storage Info:", {
    totalKeys: storageInfo.totalKeys,
    estimatedSize: `${storageInfo.estimatedSize} KB`,
    questionnaireKeys: storageInfo.questionnaireKeys,
    genderAdaptationKeys: storageInfo.genderAdaptationKeys,
    userPreferencesSize: `${storageInfo.userPreferencesSize} KB`,
  });

  // בדיקה אם הזיכרון מלא
  const isFull = await StorageCleanup.isStorageFull();
  console.log(`💾 Storage full: ${isFull}`);

  // הדפסת סטטוס מלא
  await StorageCleanup.logStorageStatus();
};

/**
 * דוגמה לניקוי מתקדם עם שמירת נתוני שאלון
 */
export const ExampleAdvancedCleanup = async () => {
  console.log("=== ניקוי מתקדם ===");

  // גיבוי נתונים חיוניים לפני ניקוי
  const backup = await StorageCleanup.backupEssentialQuestionnaireData();

  if (backup) {
    console.log("💾 נתונים חיוניים גובו בהצלחה");

    // ניקוי נתוני שאלון זמניים
    await StorageCleanup.cleanQuestionnaireData();

    // ניקוי נתונים ישנים כללי
    await StorageCleanup.cleanOldData();

    // בדיקה אם הנתונים החיוניים עדיין תקינים
    const isValid = await StorageCleanup.validateQuestionnaireData();

    if (!isValid) {
      console.log("♻️ משחזר נתונים חיוניים...");
      await StorageCleanup.restoreEssentialQuestionnaireData(backup);
    }
  }
};

/**
 * דוגמה לניקוי חירום עם שמירת שאלון
 */
export const ExampleEmergencyCleanupWithBackup = async () => {
  console.log("=== ניקוי חירום ===");

  // בדיקה אם הזיכרון באמת מלא
  const isFull = await StorageCleanup.isStorageFull();

  if (isFull) {
    // גיבוי לפני ניקוי חירום
    const backup = await StorageCleanup.backupEssentialQuestionnaireData();

    // ניקוי חירום
    await StorageCleanup.emergencyCleanup();

    // וידוא שהנתונים החיוניים נשמרו
    const isValid = await StorageCleanup.validateQuestionnaireData();

    if (!isValid && backup) {
      console.log("🚨 משחזר נתונים חיוניים אחרי ניקוי חירום...");
      await StorageCleanup.restoreEssentialQuestionnaireData(backup);
    }

    // בדיקה חוזרת
    await ExampleStorageStatusCheck();
  } else {
    console.log("✅ הזיכרון לא מלא - לא נדרש ניקוי חירום");
  }
};

/**
 * דוגמה לוואלידציה של נתוני שאלון
 */
export const ExampleQuestionnaireValidation = async () => {
  console.log("=== וואלידציה של נתוני שאלון ===");

  const isValid = await StorageCleanup.validateQuestionnaireData();

  if (isValid) {
    console.log("✅ נתוני השאלון תקינים");
  } else {
    console.log("❌ נתוני השאלון לא תקינים או חסרים");

    // אפשר לנסות לשחזר מגיבוי אם יש
    console.log("💡 ניתן להפעיל את השאלון החכם מחדש");
  }
};

/**
 * דוגמה לפונקציית ניקוי אוטומטית שמופעלת בהפעלת האפליקציה
 */
export const ExampleAutomaticMaintenanceOnAppStart = async () => {
  console.log("=== תחזוקה אוטומטית בהפעלת האפליקציה ===");

  try {
    // בדיקת סטטוס
    const storageInfo = await StorageCleanup.getStorageInfo();

    // אם יש יותר מ-50 מפתחות שאלון, נקה זמניים
    if (storageInfo.questionnaireKeys > 50) {
      console.log("🧹 ניקוי נתוני שאלון זמניים...");
      await StorageCleanup.cleanQuestionnaireData();
    }

    // ניקוי נתונים ישנים (שבוע)
    await StorageCleanup.cleanOldData();

    // אם הזיכרון עדיין מלא, ניקוי חירום
    if (await StorageCleanup.isStorageFull()) {
      console.log("🚨 מפעיל ניקוי חירום...");
      await ExampleEmergencyCleanupWithBackup();
    }

    console.log("✅ תחזוקה אוטומטית הושלמה");
  } catch (error) {
    console.error("❌ שגיאה בתחזוקה אוטומטית:", error);
  }
};

/**
 * דוגמה לחיבור עם מערכת השאלון החכם
 */
export const ExampleIntegrationWithSmartQuestionnaire = {
  // לפני התחלת שאלון חדש
  beforeStartingQuestionnaire: async () => {
    await StorageCleanup.cleanQuestionnaireData();
    console.log("🧠 מסד נתונים מוכן לשאלון חדש");
  },

  // אחרי השלמת שאלון
  afterCompletingQuestionnaire: async () => {
    const isValid = await StorageCleanup.validateQuestionnaireData();
    if (isValid) {
      console.log("✅ נתוני השאלון נשמרו בהצלחה");
    } else {
      console.log("❌ בעיה בשמירת נתוני השאלון");
    }
  },

  // ניקוי יומי של נתונים זמניים
  dailyMaintenance: async () => {
    await StorageCleanup.cleanOldData();
    await StorageCleanup.cleanQuestionnaireData();
    console.log("🗓️ תחזוקה יומית הושלמה");
  },
};
